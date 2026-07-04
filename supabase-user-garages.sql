-- Hunt Radar user-scoped garages and collector discovery
-- Idempotent migration. Apply after supabase-auth.sql and supabase-content-ownership.sql.

begin;

alter table public.profiles
  add column if not exists garage_visibility text not null default 'public';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_garage_visibility_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_garage_visibility_check
      check (garage_visibility in ('public', 'private'));
  end if;
end
$$;

update public.profiles
set garage_visibility = 'public'
where garage_visibility is null
   or garage_visibility not in ('public', 'private');

create index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

create index if not exists content_records_owner_type_created_idx
  on public.content_records (owner_id, content_type, created_at desc);

create index if not exists content_records_public_collection_idx
  on public.content_records (content_type, owner_id, created_at desc)
  where content_type = 'collection';

-- Replace the old all-content read policy with type-aware access rules.
drop policy if exists "public content is readable" on public.content_records;
drop policy if exists "owners read their own content" on public.content_records;
create policy "owners read their own content"
on public.content_records
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "community content is readable" on public.content_records;
create policy "community content is readable"
on public.content_records
for select
to anon, authenticated
using (content_type in ('stores', 'market', 'comments'));

drop policy if exists "signed in users read visible garages" on public.content_records;
create policy "signed in users read visible garages"
on public.content_records
for select
to authenticated
using (
  content_type = 'collection'
  and (
    (data ->> 'forSale') = 'true'
    or (data ->> 'forTrade') = 'true'
    or data ->> 'marketType' in ('Satılık', 'Takaslık')
    or exists (
      select 1
      from public.profiles p
      where p.id = owner_id
        and p.garage_visibility = 'public'
    )
  )
);

-- Profiles are searchable by signed-in users, but email is never exposed through the Data API.
revoke select on table public.profiles from anon;
revoke select on table public.profiles from authenticated;
grant select (id, username, role, garage_visibility, created_at, updated_at)
  on table public.profiles to authenticated;

create or replace function public.search_public_profiles(
  p_query text,
  p_limit integer default 12
)
returns table (
  id uuid,
  username text,
  garage_visibility text,
  vehicle_count bigint,
  highest_rarity text
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    p.id,
    p.username,
    p.garage_visibility,
    case
      when p.garage_visibility = 'public' or p.id = (select auth.uid()) then count(cr.id)
      else 0
    end as vehicle_count,
    case
      when p.garage_visibility = 'public' or p.id = (select auth.uid()) then
        (array_agg(
          nullif(cr.data ->> 'rarity', '')
          order by case replace(lower(coalesce(cr.data ->> 'rarity', 'regular')), ' ', '_')
            when 'chase' then 1
            when 'super_treasure_hunt' then 2
            when 'sth' then 2
            when 'treasure_hunt' then 3
            when 'th' then 3
            when 'premium' then 4
            when 'silver_series' then 5
            else 6
          end
        ) filter (where cr.id is not null))[1]
      else null
    end as highest_rarity
  from public.profiles p
  left join public.content_records cr
    on cr.owner_id = p.id
   and cr.content_type = 'collection'
  where (select auth.uid()) is not null
    and length(trim(coalesce(p_query, ''))) >= 2
    and starts_with(lower(p.username), lower(trim(p_query)))
  group by p.id, p.username, p.garage_visibility
  order by
    case when lower(p.username) = lower(trim(p_query)) then 0 else 1 end,
    lower(p.username)
  limit least(greatest(coalesce(p_limit, 12), 1), 20);
$$;

create or replace function public.get_public_garage(p_username text)
returns table (
  id text,
  owner_id uuid,
  owner_username text,
  data jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select cr.id, cr.owner_id, cr.owner_username, cr.data, cr.created_at, cr.updated_at
  from public.content_records cr
  join public.profiles p on p.id = cr.owner_id
  where (select auth.uid()) is not null
    and cr.content_type = 'collection'
    and lower(p.username) = lower(trim(p_username))
    and (p.garage_visibility = 'public' or p.id = (select auth.uid()))
  order by cr.created_at desc, cr.id;
$$;

create or replace function public.get_my_garage()
returns table (
  id text,
  owner_id uuid,
  owner_username text,
  data jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select cr.id, cr.owner_id, cr.owner_username, cr.data, cr.created_at, cr.updated_at
  from public.content_records cr
  where cr.content_type = 'collection'
    and cr.owner_id = (select auth.uid())
  order by cr.created_at desc, cr.id;
$$;

create or replace function public.get_collection_market_listings()
returns table (
  id text,
  owner_id uuid,
  owner_username text,
  data jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select cr.id, cr.owner_id, cr.owner_username, cr.data, cr.created_at, cr.updated_at
  from public.content_records cr
  where cr.content_type = 'collection'
    and (
      (cr.data ->> 'forSale') = 'true'
      or (cr.data ->> 'forTrade') = 'true'
      or cr.data ->> 'marketType' in ('Satılık', 'Takaslık')
    )
  order by cr.created_at desc, cr.id;
$$;

create or replace function public.set_garage_visibility(p_visibility text)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if p_visibility not in ('public', 'private') then
    raise exception 'invalid_garage_visibility' using errcode = '22023';
  end if;

  update public.profiles
  set garage_visibility = p_visibility,
      updated_at = now()
  where id = (select auth.uid());

  if not found then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;
  return p_visibility;
end;
$$;

revoke all on function public.search_public_profiles(text, integer) from public, anon;
revoke all on function public.get_public_garage(text) from public, anon;
revoke all on function public.get_my_garage() from public, anon;
revoke all on function public.get_collection_market_listings() from public, anon;
revoke all on function public.set_garage_visibility(text) from public, anon;

grant execute on function public.search_public_profiles(text, integer) to authenticated;
grant execute on function public.get_public_garage(text) to authenticated;
grant execute on function public.get_my_garage() to authenticated;
grant execute on function public.get_collection_market_listings() to authenticated;
grant execute on function public.set_garage_visibility(text) to authenticated;

commit;
