-- Hunt Radar: public profile search repair
-- Run after supabase-auth.sql, supabase-content-ownership.sql,
-- supabase-profile-access-hardening.sql, and supabase-follow-system.sql.

begin;

alter table public.profiles
  add column if not exists profile_visibility text not null default 'public',
  add column if not exists garage_visibility text not null default 'public';

alter table public.profiles enable row level security;

grant select (id, username, role, garage_visibility, profile_visibility, avatar_id, created_at, updated_at)
on public.profiles to authenticated;

grant select on table public.user_follows to authenticated;
grant select on table public.content_records to authenticated;

drop function if exists public.search_public_profiles(text, integer);

create or replace function public.search_public_profiles(
  p_query text,
  p_limit integer default 12
)
returns table (
  id uuid,
  username text,
  garage_visibility text,
  profile_visibility text,
  vehicle_count bigint,
  highest_rarity text,
  follower_count integer,
  following_count integer,
  is_following boolean
)
language sql
stable
security invoker
set search_path = ''
as $$
  with viewer as (
    select (select auth.uid()) as id
  ),
  matched_profiles as (
    select
      p.id,
      p.username,
      coalesce(p.garage_visibility, 'public') as garage_visibility,
      coalesce(p.profile_visibility, 'public') as profile_visibility
    from public.profiles p
    cross join viewer
    where viewer.id is not null
      and p.username is not null
      and trim(coalesce(p_query, '')) <> ''
      and lower(p.username) like lower(trim(p_query)) || '%'
  ),
  access as (
    select
      mp.*,
      (
        mp.profile_visibility = 'public'
        or mp.id = viewer.id
        or (
          mp.profile_visibility = 'friends'
          and exists (
            select 1 from public.user_follows f1
            where f1.follower_id = viewer.id and f1.followed_id = mp.id
          )
          and exists (
            select 1 from public.user_follows f2
            where f2.follower_id = mp.id and f2.followed_id = viewer.id
          )
        )
      ) as can_view_profile,
      (
        mp.garage_visibility = 'public'
        or mp.id = viewer.id
      ) as can_view_garage,
      viewer.id as viewer_id
    from matched_profiles mp
    cross join viewer
  )
  select
    a.id,
    a.username,
    a.garage_visibility,
    a.profile_visibility,
    case when a.can_view_profile and a.can_view_garage then count(cr.id) else 0 end as vehicle_count,
    case when a.can_view_profile and a.can_view_garage then
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
    else null end as highest_rarity,
    (
      select count(*)::integer
      from public.user_follows uf
      where uf.followed_id = a.id
    ) as follower_count,
    (
      select count(*)::integer
      from public.user_follows uf
      where uf.follower_id = a.id
    ) as following_count,
    exists (
      select 1
      from public.user_follows uf
      where uf.follower_id = a.viewer_id
        and uf.followed_id = a.id
    ) as is_following
  from access a
  left join public.content_records cr
    on cr.owner_id = a.id
   and cr.content_type = 'collection'
  group by a.id, a.username, a.garage_visibility, a.profile_visibility, a.can_view_profile, a.can_view_garage, a.viewer_id
  order by lower(a.username)
  limit greatest(1, least(coalesce(p_limit, 12), 25));
$$;

revoke all on function public.search_public_profiles(text, integer) from public, anon;
grant execute on function public.search_public_profiles(text, integer) to authenticated;

commit;
