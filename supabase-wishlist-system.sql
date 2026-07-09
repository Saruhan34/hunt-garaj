-- Hunt Radar: catalog-backed premium wishlist metadata and atomic acquisition.
-- Run after supabase-garage-explore.sql and supabase-content-access-hardening.sql.

begin;

-- Keep every legacy row. Only fill fields that the previous client did not have.
update public.content_records
set data = jsonb_set(
      jsonb_set(
        jsonb_set(
          data,
          '{status}',
          to_jsonb(coalesce(nullif(data ->> 'status', ''), 'active')),
          true
        ),
        '{priority}',
        to_jsonb(case
          when lower(coalesce(data ->> 'priority', '')) like '%çok%' then 'Çok istiyorum'
          when lower(coalesce(data ->> 'priority', '')) like '%nadir av%' then 'Çok istiyorum'
          when lower(coalesce(data ->> 'priority', '')) like '%öncel%' then 'Öncelikli'
          when lower(coalesce(data ->> 'priority', '')) like '%takip%' then 'Takipte'
          else 'Fırsat olursa'
        end),
        true
      ),
      '{updatedAt}',
      to_jsonb(coalesce(nullif(data ->> 'updatedAt', ''), nullif(data ->> 'createdAt', ''), updated_at::text)),
      true
    ),
    updated_at = now()
where content_type = 'wishlist'
  and (
    nullif(data ->> 'status', '') is null
    or nullif(data ->> 'updatedAt', '') is null
    or coalesce(data ->> 'priority', '') in ('Denk gelirse', 'Nadir av', '')
  );

create index if not exists content_records_wishlist_status_idx
  on public.content_records (owner_id, ((data ->> 'status')), created_at desc)
  where content_type = 'wishlist';

-- One idempotent write path for the Wishlist page, Explore cards and detail drawer.
-- Catalog rows are canonical when present. Bundled catalog metadata is accepted only
-- into the caller's private wishlist row when an older production catalog is missing
-- the selected stable id; it never creates or edits a shared catalog row.
create or replace function public.set_wishlist_item(
  p_catalog_id text,
  p_active boolean,
  p_vehicle jsonb default '{}'::jsonb,
  p_priority text default 'Fırsat olursa',
  p_target_price numeric default null,
  p_notes text default ''
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_username text;
  v_catalog public.hotwheels_catalog_items%rowtype;
  v_catalog_found boolean := false;
  v_record public.content_records%rowtype;
  v_record_id text;
  v_priority text;
  v_model text;
  v_payload jsonb;
  v_now timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if nullif(trim(p_catalog_id), '') is null or length(p_catalog_id) > 180 then
    raise exception 'invalid_catalog_id' using errcode = '22023';
  end if;
  if p_target_price is not null and (p_target_price < 0 or p_target_price > 10000000) then
    raise exception 'invalid_target_price' using errcode = '22023';
  end if;
  if length(coalesce(p_notes, '')) > 200 then
    raise exception 'notes_too_long' using errcode = '22023';
  end if;

  v_priority := case p_priority
    when 'Çok istiyorum' then p_priority
    when 'Öncelikli' then p_priority
    when 'Fırsat olursa' then p_priority
    when 'Takipte' then p_priority
    else 'Fırsat olursa'
  end;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':wishlist:' || p_catalog_id, 0));

  select * into v_record
  from public.content_records
  where owner_id = v_user_id
    and content_type = 'wishlist'
    and data ->> 'catalogId' = p_catalog_id
  order by created_at
  limit 1
  for update;

  if not p_active then
    if found then
      delete from public.content_records where id = v_record.id and owner_id = v_user_id;
    end if;
    return jsonb_build_object('active', false, 'record_id', null, 'catalog_id', p_catalog_id);
  end if;

  select * into v_catalog
  from public.hotwheels_catalog_items
  where id = p_catalog_id;
  v_catalog_found := found;

  v_model := coalesce(
    case when v_catalog_found then nullif(v_catalog.model_name, '') end,
    nullif(trim(p_vehicle ->> 'model'), ''),
    nullif(trim(p_vehicle ->> 'model_name'), '')
  );
  if v_model is null then
    raise exception 'vehicle_model_required' using errcode = '22023';
  end if;

  v_payload := jsonb_strip_nulls(jsonb_build_object(
    'catalogId', p_catalog_id,
    'model', v_model,
    'brand', coalesce(case when v_catalog_found then v_catalog.brand end, p_vehicle ->> 'brand', ''),
    'series', coalesce(case when v_catalog_found then v_catalog.series end, p_vehicle ->> 'series', ''),
    'year', coalesce(case when v_catalog_found then v_catalog.release_year::text end, p_vehicle ->> 'year', p_vehicle ->> 'release_year', ''),
    'color', coalesce(case when v_catalog_found then v_catalog.color end, p_vehicle ->> 'color', ''),
    'rarity', coalesce(case when v_catalog_found then v_catalog.rarity_segment end, p_vehicle ->> 'rarity', p_vehicle ->> 'raritySegment', 'Regular'),
    'photo', coalesce(case when v_catalog_found then v_catalog.image_url end, p_vehicle ->> 'photo', p_vehicle ->> 'imageUrl', p_vehicle ->> 'image_url', ''),
    'reference', coalesce(p_vehicle ->> 'reference', p_vehicle ->> 'sourceUrl', ''),
    'priority', v_priority,
    'targetPrice', p_target_price,
    'budget', case when p_target_price is null then '' else trim(to_char(p_target_price, 'FM999999990D00')) || ' TL' end,
    'notes', left(coalesce(p_notes, ''), 200),
    'status', 'active',
    'catalogSource', case when v_catalog_found then 'supabase' else 'bundled' end,
    'updatedAt', v_now
  ));

  if v_record.id is not null then
    update public.content_records
    set data = data || v_payload,
        updated_at = v_now
    where id = v_record.id and owner_id = v_user_id
    returning * into v_record;
    return jsonb_build_object('active', true, 'record_id', v_record.id, 'catalog_id', p_catalog_id, 'data', v_record.data);
  end if;

  select username into v_username from public.profiles where id = v_user_id;
  v_username := coalesce(v_username, 'collector');
  v_record_id := gen_random_uuid()::text;
  v_payload := v_payload || jsonb_build_object('id', v_record_id, 'createdAt', v_now);
  insert into public.content_records (id, content_type, owner_id, owner_username, data, created_at, updated_at)
  values (v_record_id, 'wishlist', v_user_id, v_username, v_payload, v_now, v_now);

  return jsonb_build_object('active', true, 'record_id', v_record_id, 'catalog_id', p_catalog_id, 'data', v_payload);
end;
$$;

revoke all on function public.set_wishlist_item(text, boolean, jsonb, text, numeric, text) from public, anon;
grant execute on function public.set_wishlist_item(text, boolean, jsonb, text, numeric, text) to authenticated;

create or replace function public.acquire_wishlist_vehicle(p_catalog_id text)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_username text;
  v_catalog public.hotwheels_catalog_items%rowtype;
  v_catalog_found boolean := false;
  v_wishlist public.content_records%rowtype;
  v_garage public.content_records%rowtype;
  v_garage_id text;
  v_quantity integer := 1;
  v_now timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':acquire:' || p_catalog_id, 0));

  select * into v_wishlist
  from public.content_records
  where owner_id = v_user_id
    and content_type = 'wishlist'
    and data ->> 'catalogId' = p_catalog_id
  order by created_at
  limit 1
  for update;
  if not found then
    raise exception 'wishlist_item_not_found' using errcode = 'P0002';
  end if;

  select * into v_catalog
  from public.hotwheels_catalog_items
  where id = p_catalog_id;
  v_catalog_found := found;

  select * into v_garage
  from public.content_records
  where owner_id = v_user_id
    and content_type = 'collection'
    and data ->> 'catalogId' = p_catalog_id
  order by created_at
  limit 1
  for update;

  if found then
    v_quantity := least(999, greatest(1, case
      when coalesce(v_garage.data ->> 'quantity', '') ~ '^[0-9]+$'
        then (v_garage.data ->> 'quantity')::integer
      else 1
    end) + 1);
    v_garage_id := v_garage.id;
    update public.content_records
    set data = jsonb_set(jsonb_set(data, '{quantity}', to_jsonb(v_quantity), true), '{updatedAt}', to_jsonb(v_now::text), true),
        updated_at = v_now
    where id = v_garage.id and owner_id = v_user_id;
  else
    select username into v_username from public.profiles where id = v_user_id;
    v_username := coalesce(v_username, 'collector');
    v_garage_id := gen_random_uuid()::text;
    insert into public.content_records (id, content_type, owner_id, owner_username, data, created_at, updated_at)
    values (
      v_garage_id,
      'collection',
      v_user_id,
      v_username,
      jsonb_build_object(
        'id', v_garage_id,
        'catalogId', p_catalog_id,
        'model', coalesce(case when v_catalog_found then v_catalog.model_name end, v_wishlist.data ->> 'model', 'İsimsiz araç'),
        'brand', coalesce(case when v_catalog_found then v_catalog.brand end, v_wishlist.data ->> 'brand', ''),
        'series', coalesce(case when v_catalog_found then v_catalog.series end, v_wishlist.data ->> 'series', ''),
        'year', coalesce(case when v_catalog_found then v_catalog.release_year::text end, v_wishlist.data ->> 'year', ''),
        'color', coalesce(case when v_catalog_found then v_catalog.color end, v_wishlist.data ->> 'color', ''),
        'rarity', coalesce(case when v_catalog_found then v_catalog.rarity_segment end, v_wishlist.data ->> 'rarity', 'Regular'),
        'photo', coalesce(case when v_catalog_found then v_catalog.image_url end, v_wishlist.data ->> 'photo', ''),
        'quantity', 1,
        'condition', 'İyi',
        'packagingStatus', 'Kartonetli',
        'forSale', false,
        'forTrade', false,
        'createdAt', v_now,
        'updatedAt', v_now
      ),
      v_now,
      v_now
    );
  end if;

  update public.content_records
  set data = jsonb_set(
      jsonb_set(
        jsonb_set(data, '{status}', '"acquired"'::jsonb, true),
        '{acquiredAt}', to_jsonb(v_now::text), true
      ),
      '{updatedAt}', to_jsonb(v_now::text), true
    ),
    updated_at = v_now
  where id = v_wishlist.id and owner_id = v_user_id;

  return jsonb_build_object(
    'wishlist_record_id', v_wishlist.id,
    'garage_record_id', v_garage_id,
    'quantity', v_quantity,
    'status', 'acquired'
  );
end;
$$;

revoke all on function public.acquire_wishlist_vehicle(text) from public, anon;
grant execute on function public.acquire_wishlist_vehicle(text) to authenticated;

commit;
