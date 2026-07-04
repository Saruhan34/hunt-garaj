-- Hunt Radar Premium Garage & Explore
-- Idempotent schema extension. It never deletes, seeds, or rewrites existing rows.

begin;

-- ---------------------------------------------------------------------------
-- 1. Extend the existing catalog in place
-- ---------------------------------------------------------------------------

alter table if exists public.hotwheels_catalog_items
  add column if not exists brand text,
  add column if not exists series text,
  add column if not exists segment text,
  add column if not exists assortment text,
  add column if not exists case_code text,
  add column if not exists toy_number text,
  add column if not exists item_number text,
  add column if not exists casting_number text,
  add column if not exists collection_number text,
  add column if not exists wheel_type text,
  add column if not exists source_name text,
  add column if not exists source_url text;

alter table if exists public.hotwheels_catalog_items
  add column if not exists search_vector tsvector
  generated always as (
    setweight(to_tsvector('simple'::regconfig, coalesce(model_name, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(brand, '')), 'A') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(series, '')), 'B') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(segment, '')), 'B') ||
    setweight(to_tsvector('simple'::regconfig, coalesce(assortment, '')), 'B') ||
    setweight(to_tsvector('simple'::regconfig,
      coalesce(toy_number, '') || ' ' ||
      coalesce(item_number, '') || ' ' ||
      coalesce(casting_number, '') || ' ' ||
      coalesce(collection_number, '') || ' ' ||
      coalesce(case_code, '')
    ), 'C') ||
    setweight(to_tsvector('simple'::regconfig,
      coalesce(color, '') || ' ' ||
      coalesce(wheel_type, '') || ' ' ||
      coalesce(release_year::text, '')
    ), 'D')
  ) stored;

-- Keep rarity values aligned with the shared Garage / Explore card system.
alter table if exists public.hotwheels_catalog_items
  drop constraint if exists hotwheels_catalog_items_rarity_segment_check;

alter table if exists public.hotwheels_catalog_items
  add constraint hotwheels_catalog_items_rarity_segment_check
  check (rarity_segment = any (array[
    'regular'::text,
    'silver_series'::text,
    'premium'::text,
    'chase'::text,
    'treasure_hunt'::text,
    'super_treasure_hunt'::text,
    'zamac'::text,
    'red_edition'::text,
    'exclusive'::text
  ]));

create index if not exists hotwheels_catalog_search_idx
  on public.hotwheels_catalog_items using gin (search_vector);

create index if not exists hotwheels_catalog_browse_cursor_idx
  on public.hotwheels_catalog_items (model_name, id);

create index if not exists hotwheels_catalog_brand_year_cursor_idx
  on public.hotwheels_catalog_items (brand, release_year, model_name, id);

create index if not exists hotwheels_catalog_series_idx
  on public.hotwheels_catalog_items (series)
  where series is not null and series <> '';

create index if not exists hotwheels_catalog_segment_idx
  on public.hotwheels_catalog_items (segment)
  where segment is not null and segment <> '';

create index if not exists hotwheels_catalog_segment_filter_idx
  on public.hotwheels_catalog_items (lower(segment))
  where segment is not null and segment <> '';

create index if not exists hotwheels_catalog_rarity_segment_filter_idx
  on public.hotwheels_catalog_items ((replace(lower(rarity_segment), '_', ' ')))
  where rarity_segment is not null and rarity_segment <> '';

create index if not exists hotwheels_catalog_assortment_idx
  on public.hotwheels_catalog_items (assortment)
  where assortment is not null and assortment <> '';

create index if not exists hotwheels_catalog_case_idx
  on public.hotwheels_catalog_items (case_code)
  where case_code is not null and case_code <> '';

create index if not exists hotwheels_catalog_toy_number_idx
  on public.hotwheels_catalog_items (toy_number)
  where toy_number is not null and toy_number <> '';

create index if not exists hotwheels_catalog_item_number_idx
  on public.hotwheels_catalog_items (item_number)
  where item_number is not null and item_number <> '';

create index if not exists hotwheels_catalog_casting_number_idx
  on public.hotwheels_catalog_items (casting_number)
  where casting_number is not null and casting_number <> '';

-- Fast owner + catalog membership lookups while leaving legacy rows untouched.
create index if not exists content_records_catalog_membership_idx
  on public.content_records (owner_id, content_type, ((data ->> 'catalogId')))
  where content_type in ('collection', 'wishlist')
    and nullif(data ->> 'catalogId', '') is not null;

-- Repair duplicate memberships created by older clients before enforcing uniqueness.
with duplicate_groups as (
  select
    owner_id,
    content_type,
    data ->> 'catalogId' as catalog_id,
    min(id) as keep_id,
    sum(greatest(1, case
      when coalesce(data ->> 'quantity', '') ~ '^[0-9]+$' then (data ->> 'quantity')::integer
      else 1
    end))::integer as total_quantity
  from public.content_records
  where content_type in ('collection', 'wishlist')
    and nullif(data ->> 'catalogId', '') is not null
  group by owner_id, content_type, data ->> 'catalogId'
  having count(*) > 1
)
update public.content_records cr
set data = jsonb_set(cr.data, '{quantity}', to_jsonb(least(999, dg.total_quantity)), true),
    updated_at = now()
from duplicate_groups dg
where cr.id = dg.keep_id
  and cr.owner_id = dg.owner_id
  and cr.content_type = 'collection';

with duplicate_groups as (
  select owner_id, content_type, data ->> 'catalogId' as catalog_id, min(id) as keep_id
  from public.content_records
  where content_type in ('collection', 'wishlist')
    and nullif(data ->> 'catalogId', '') is not null
  group by owner_id, content_type, data ->> 'catalogId'
  having count(*) > 1
)
delete from public.content_records cr
using duplicate_groups dg
where cr.owner_id = dg.owner_id
  and cr.content_type = dg.content_type
  and cr.data ->> 'catalogId' = dg.catalog_id
  and cr.id <> dg.keep_id;

create unique index if not exists content_records_catalog_membership_unique_idx
  on public.content_records (owner_id, content_type, ((data ->> 'catalogId')))
  where content_type in ('collection', 'wishlist')
    and nullif(data ->> 'catalogId', '') is not null;

-- ---------------------------------------------------------------------------
-- 2. Search API: indexed, filterable, and cursor based
-- ---------------------------------------------------------------------------

create or replace function public.search_hotwheels_catalog(
  p_query text default null,
  p_brand text default null,
  p_series text default null,
  p_release_year integer default null,
  p_segment text default null,
  p_assortment text default null,
  p_case_code text default null,
  p_membership text default 'any',
  p_after_model text default null,
  p_after_id text default null,
  p_limit integer default 24
)
returns table (
  id text,
  model_name text,
  brand text,
  release_year integer,
  series text,
  segment text,
  assortment text,
  case_code text,
  toy_number text,
  item_number text,
  casting_number text,
  collection_number text,
  wheel_type text,
  color text,
  image_url text,
  features text[],
  rarity_segment text,
  source_name text,
  source_url text,
  owned_quantity integer,
  wishlisted boolean,
  relevance real,
  total_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  with request_context as (
    select
      nullif(trim(p_query), '') as search_text,
      case
        when nullif(trim(p_query), '') is null then null::tsquery
        else websearch_to_tsquery('simple'::regconfig, trim(p_query))
      end as search_query,
      (select auth.uid()) as user_id,
      greatest(1, least(coalesce(p_limit, 24), 48)) as page_size
  ), catalog_membership as (
    select
      cr.data ->> 'catalogId' as catalog_id,
      max(case
        when cr.content_type = 'collection'
          then greatest(1, case
            when coalesce(cr.data ->> 'quantity', '') ~ '^[0-9]+$'
              then (cr.data ->> 'quantity')::integer
            else 1
          end)
        else 0
      end)::integer as owned_quantity,
      bool_or(cr.content_type = 'wishlist') as wishlisted
    from public.content_records cr
    cross join request_context rc
    where rc.user_id is not null
      and cr.owner_id = rc.user_id
      and cr.content_type in ('collection', 'wishlist')
      and nullif(cr.data ->> 'catalogId', '') is not null
    group by cr.data ->> 'catalogId'
  ), filtered as (
    select
      c.*,
      coalesce(m.owned_quantity, 0)::integer as owned_quantity_value,
      coalesce(m.wishlisted, false) as wishlisted_value,
      case
        when rc.search_query is null then 0::real
        else ts_rank(c.search_vector, rc.search_query)
      end::real as rank_value
    from public.hotwheels_catalog_items c
    cross join request_context rc
    left join catalog_membership m on m.catalog_id = c.id
    where (rc.search_query is null or c.search_vector @@ rc.search_query)
      and (nullif(trim(p_brand), '') is null or lower(c.brand) = lower(trim(p_brand)))
      and (nullif(trim(p_series), '') is null or lower(c.series) = lower(trim(p_series)))
      and (p_release_year is null or c.release_year = p_release_year)
      and (
        nullif(trim(p_segment), '') is null
        or lower(c.segment) = lower(trim(p_segment))
        or replace(lower(c.rarity_segment), '_', ' ') = replace(lower(trim(p_segment)), '_', ' ')
      )
      and (nullif(trim(p_assortment), '') is null or lower(c.assortment) = lower(trim(p_assortment)))
      and (nullif(trim(p_case_code), '') is null or lower(c.case_code) = lower(trim(p_case_code)))
      and (
        coalesce(p_membership, 'any') = 'any'
        or (p_membership = 'owned' and coalesce(m.owned_quantity, 0) > 0)
        or (p_membership = 'not_owned' and coalesce(m.owned_quantity, 0) = 0)
        or (p_membership = 'wishlist' and coalesce(m.wishlisted, false))
        or (p_membership = 'not_wishlist' and not coalesce(m.wishlisted, false))
      )
  ), counted as (
    select filtered.*, count(*) over () as full_count
    from filtered
  )
  select
    c.id,
    c.model_name,
    c.brand,
    c.release_year,
    c.series,
    c.segment,
    c.assortment,
    c.case_code,
    c.toy_number,
    c.item_number,
    c.casting_number,
    c.collection_number,
    c.wheel_type,
    c.color,
    c.image_url,
    c.features,
    c.rarity_segment,
    c.source_name,
    c.source_url,
    c.owned_quantity_value,
    c.wishlisted_value,
    c.rank_value,
    c.full_count
  from counted c
  cross join request_context rc
  where p_after_model is null
     or (c.model_name, c.id) > (p_after_model, coalesce(p_after_id, ''))
  order by c.model_name asc, c.id asc
  limit (select page_size from request_context);
$$;

revoke all on function public.search_hotwheels_catalog(
  text, text, text, integer, text, text, text, text, text, text, integer
) from public;
grant execute on function public.search_hotwheels_catalog(
  text, text, text, integer, text, text, text, text, text, text, integer
) to anon, authenticated;

create or replace function public.get_hotwheels_catalog_facets()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'brands', coalesce((
      select jsonb_agg(value order by value)
      from (select distinct brand as value from public.hotwheels_catalog_items where nullif(brand, '') is not null) q
    ), '[]'::jsonb),
    'series', coalesce((
      select jsonb_agg(value order by value)
      from (select distinct series as value from public.hotwheels_catalog_items where nullif(series, '') is not null) q
    ), '[]'::jsonb),
    'years', coalesce((
      select jsonb_agg(value order by value desc)
      from (select distinct release_year as value from public.hotwheels_catalog_items) q
    ), '[]'::jsonb),
    'segments', coalesce((
      select jsonb_agg(value order by value)
      from (
        select segment as value
        from public.hotwheels_catalog_items
        where nullif(segment, '') is not null
        union
        select rarity_segment as value
        from public.hotwheels_catalog_items
        where nullif(rarity_segment, '') is not null
      ) q
    ), '[]'::jsonb),
    'assortments', coalesce((
      select jsonb_agg(value order by value)
      from (select distinct assortment as value from public.hotwheels_catalog_items where nullif(assortment, '') is not null) q
    ), '[]'::jsonb),
    'cases', coalesce((
      select jsonb_agg(value order by value)
      from (select distinct case_code as value from public.hotwheels_catalog_items where nullif(case_code, '') is not null) q
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.get_hotwheels_catalog_facets() from public;
grant execute on function public.get_hotwheels_catalog_facets() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Atomic Garage / Wishlist membership API
-- ---------------------------------------------------------------------------

create or replace function public.mutate_vehicle_membership(
  p_catalog_id text,
  p_target text,
  p_action text
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
  v_record public.content_records%rowtype;
  v_record_id text;
  v_quantity integer := 0;
  v_merged_quantity integer := 0;
  v_exists boolean := false;
  v_now timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if p_target not in ('collection', 'wishlist') then
    raise exception 'invalid_membership_target' using errcode = '22023';
  end if;
  if p_action not in ('add', 'increment', 'decrement', 'remove', 'toggle') then
    raise exception 'invalid_membership_action' using errcode = '22023';
  end if;

  select * into v_catalog
  from public.hotwheels_catalog_items
  where id = p_catalog_id;
  if not found then
    raise exception 'catalog_item_not_found' using errcode = 'P0002';
  end if;

  select username into v_username
  from public.profiles
  where id = v_user_id;
  v_username := coalesce(v_username, 'collector');

  perform pg_advisory_xact_lock(hashtextextended(v_user_id::text || ':' || p_target || ':' || p_catalog_id, 0));

  select * into v_record
  from public.content_records
  where owner_id = v_user_id
    and content_type = p_target
    and data ->> 'catalogId' = p_catalog_id
  order by created_at
  limit 1
  for update;
  v_exists := found;

  -- Older clients could create more than one row for the same catalog vehicle.
  -- Collapse those rows inside the same advisory lock before applying the action.
  if v_exists then
    select coalesce(sum(greatest(1, case
      when coalesce(cr.data ->> 'quantity', '') ~ '^[0-9]+$'
        then (cr.data ->> 'quantity')::integer
      else 1
    end)), 1)::integer
    into v_merged_quantity
    from public.content_records cr
    where cr.owner_id = v_user_id
      and cr.content_type = p_target
      and cr.data ->> 'catalogId' = p_catalog_id;

    delete from public.content_records
    where owner_id = v_user_id
      and content_type = p_target
      and data ->> 'catalogId' = p_catalog_id
      and id <> v_record.id;

    if p_target = 'collection' then
      update public.content_records
      set data = jsonb_set(data, '{quantity}', to_jsonb(least(999, v_merged_quantity)), true),
          updated_at = v_now
      where id = v_record.id and owner_id = v_user_id;
      v_record.data := jsonb_set(v_record.data, '{quantity}', to_jsonb(least(999, v_merged_quantity)), true);
    end if;
  end if;

  if p_target = 'wishlist' then
    if (p_action in ('remove', 'toggle') and v_exists) then
      delete from public.content_records where id = v_record.id and owner_id = v_user_id;
      return jsonb_build_object('target', p_target, 'active', false, 'quantity', 0, 'record_id', null);
    end if;
    if not v_exists then
      v_record_id := gen_random_uuid()::text;
      insert into public.content_records (id, content_type, owner_id, owner_username, data, created_at, updated_at)
      values (
        v_record_id,
        'wishlist',
        v_user_id,
        v_username,
        jsonb_build_object(
          'id', v_record_id,
          'catalogId', v_catalog.id,
          'model', v_catalog.model_name,
          'brand', coalesce(v_catalog.brand, ''),
          'series', coalesce(v_catalog.series, ''),
          'year', v_catalog.release_year::text,
          'color', v_catalog.color,
          'rarity', v_catalog.rarity_segment,
          'photo', coalesce(v_catalog.image_url, ''),
          'priority', 'Denk gelirse',
          'createdAt', v_now
        ),
        v_now,
        v_now
      );
      return jsonb_build_object('target', p_target, 'active', true, 'quantity', 0, 'record_id', v_record_id);
    end if;
    return jsonb_build_object('target', p_target, 'active', true, 'quantity', 0, 'record_id', v_record.id);
  end if;

  if not v_exists and p_action in ('decrement', 'remove') then
    return jsonb_build_object('target', p_target, 'active', false, 'quantity', 0, 'record_id', null);
  end if;

  if not v_exists then
    v_record_id := gen_random_uuid()::text;
    insert into public.content_records (id, content_type, owner_id, owner_username, data, created_at, updated_at)
    values (
      v_record_id,
      'collection',
      v_user_id,
      v_username,
      jsonb_build_object(
        'id', v_record_id,
        'catalogId', v_catalog.id,
        'model', v_catalog.model_name,
        'brand', coalesce(v_catalog.brand, ''),
        'series', coalesce(v_catalog.series, ''),
        'year', v_catalog.release_year::text,
        'color', v_catalog.color,
        'rarity', v_catalog.rarity_segment,
        'photo', coalesce(v_catalog.image_url, ''),
        'quantity', 1,
        'condition', 'İyi',
        'packagingStatus', 'Kartonetli',
        'forSale', false,
        'forTrade', false,
        'estimatedValue', '',
        'createdAt', v_now,
        'updatedAt', v_now
      ),
      v_now,
      v_now
    );
    return jsonb_build_object('target', p_target, 'active', true, 'quantity', 1, 'record_id', v_record_id, 'created', true);
  end if;

  v_quantity := greatest(1, case
    when coalesce(v_record.data ->> 'quantity', '') ~ '^[0-9]+$'
      then (v_record.data ->> 'quantity')::integer
    else 1
  end);
  if p_action = 'remove' or (p_action = 'decrement' and v_quantity <= 1) then
    delete from public.content_records where id = v_record.id and owner_id = v_user_id;
    return jsonb_build_object('target', p_target, 'active', false, 'quantity', 0, 'record_id', null);
  end if;
  if p_action in ('add', 'increment') then
    v_quantity := least(999, v_quantity + 1);
  elsif p_action = 'decrement' then
    v_quantity := greatest(1, v_quantity - 1);
  end if;

  update public.content_records
  set data = jsonb_set(
      jsonb_set(data, '{quantity}', to_jsonb(v_quantity), true),
      '{updatedAt}', to_jsonb(v_now), true
    ),
    updated_at = v_now
  where id = v_record.id and owner_id = v_user_id;

  return jsonb_build_object('target', p_target, 'active', true, 'quantity', v_quantity, 'record_id', v_record.id);
end;
$$;

revoke all on function public.mutate_vehicle_membership(text, text, text) from public, anon;
grant execute on function public.mutate_vehicle_membership(text, text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- 4. Moderated vehicle suggestions
-- ---------------------------------------------------------------------------

create table if not exists public.vehicle_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  model_name text not null check (char_length(trim(model_name)) between 2 and 160),
  brand text,
  release_year integer check (release_year is null or release_year between 1968 and 2100),
  toy_number text,
  item_number text,
  casting_number text,
  source_url text,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.vehicle_suggestions enable row level security;

create index if not exists vehicle_suggestions_user_created_idx
  on public.vehicle_suggestions (user_id, created_at desc);
create index if not exists vehicle_suggestions_pending_idx
  on public.vehicle_suggestions (created_at)
  where status = 'pending';

drop trigger if exists vehicle_suggestions_set_updated_at on public.vehicle_suggestions;
create trigger vehicle_suggestions_set_updated_at
before update on public.vehicle_suggestions
for each row execute function public.set_updated_at();

drop policy if exists "users read own vehicle suggestions" on public.vehicle_suggestions;
create policy "users read own vehicle suggestions"
on public.vehicle_suggestions for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users submit pending vehicle suggestions" on public.vehicle_suggestions;
create policy "users submit pending vehicle suggestions"
on public.vehicle_suggestions for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
);

drop policy if exists "admins read vehicle suggestions" on public.vehicle_suggestions;
create policy "admins read vehicle suggestions"
on public.vehicle_suggestions for select to authenticated
using ((select public.is_admin()));

drop policy if exists "admins update vehicle suggestions" on public.vehicle_suggestions;
create policy "admins update vehicle suggestions"
on public.vehicle_suggestions for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant select, insert, update on public.vehicle_suggestions to authenticated;

drop policy if exists "admins insert hotwheels catalog items" on public.hotwheels_catalog_items;
create policy "admins insert hotwheels catalog items"
on public.hotwheels_catalog_items for insert to authenticated
with check ((select public.is_admin()));

drop policy if exists "admins update hotwheels catalog items" on public.hotwheels_catalog_items;
create policy "admins update hotwheels catalog items"
on public.hotwheels_catalog_items for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

grant insert, update on public.hotwheels_catalog_items to authenticated;

create or replace function public.review_vehicle_suggestion(
  p_suggestion_id uuid,
  p_status text,
  p_catalog_id text default null,
  p_catalog_data jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_suggestion public.vehicle_suggestions%rowtype;
  v_model_name text;
  v_release_year integer;
  v_rarity text;
begin
  if v_user_id is null or not (select public.is_admin()) then
    raise exception 'admin_required' using errcode = '42501';
  end if;
  if p_status not in ('approved', 'rejected') then
    raise exception 'invalid_review_status' using errcode = '22023';
  end if;

  select * into v_suggestion
  from public.vehicle_suggestions
  where id = p_suggestion_id
  for update;
  if not found then
    raise exception 'suggestion_not_found' using errcode = 'P0002';
  end if;

  if p_status = 'approved' then
    if nullif(trim(p_catalog_id), '') is null then
      raise exception 'catalog_id_required' using errcode = '22023';
    end if;
    v_model_name := coalesce(nullif(trim(p_catalog_data ->> 'model_name'), ''), v_suggestion.model_name);
    v_release_year := coalesce(nullif(p_catalog_data ->> 'release_year', '')::integer, v_suggestion.release_year);
    v_rarity := coalesce(nullif(p_catalog_data ->> 'rarity_segment', ''), 'regular');
    if v_release_year is null then
      raise exception 'release_year_required' using errcode = '22023';
    end if;

    insert into public.hotwheels_catalog_items (
      id, model_name, brand, release_year, series, segment, assortment, case_code,
      toy_number, item_number, casting_number, wheel_type, color, image_url,
      features, rarity_segment, source_name, source_url
    ) values (
      trim(p_catalog_id),
      v_model_name,
      coalesce(nullif(p_catalog_data ->> 'brand', ''), v_suggestion.brand),
      v_release_year,
      nullif(p_catalog_data ->> 'series', ''),
      nullif(p_catalog_data ->> 'segment', ''),
      nullif(p_catalog_data ->> 'assortment', ''),
      nullif(p_catalog_data ->> 'case_code', ''),
      coalesce(nullif(p_catalog_data ->> 'toy_number', ''), v_suggestion.toy_number),
      coalesce(nullif(p_catalog_data ->> 'item_number', ''), v_suggestion.item_number),
      coalesce(nullif(p_catalog_data ->> 'casting_number', ''), v_suggestion.casting_number),
      nullif(p_catalog_data ->> 'wheel_type', ''),
      coalesce(p_catalog_data ->> 'color', ''),
      nullif(p_catalog_data ->> 'image_url', ''),
      '{}'::text[],
      v_rarity,
      'Community suggestion',
      coalesce(nullif(p_catalog_data ->> 'source_url', ''), v_suggestion.source_url)
    )
    on conflict (id) do nothing;
  end if;

  update public.vehicle_suggestions
  set status = p_status,
      reviewed_by = v_user_id,
      reviewed_at = now(),
      updated_at = now()
  where id = p_suggestion_id;

  return jsonb_build_object('id', p_suggestion_id, 'status', p_status, 'catalog_id', p_catalog_id);
end;
$$;

revoke all on function public.review_vehicle_suggestion(uuid, text, text, jsonb) from public, anon;
grant execute on function public.review_vehicle_suggestion(uuid, text, text, jsonb) to authenticated;

commit;
