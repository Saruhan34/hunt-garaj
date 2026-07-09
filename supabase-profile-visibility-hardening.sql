-- Hunt Radar: profile visibility hardening for public profile / garage RPCs
-- Run after supabase-user-garages.sql, supabase-public-garage-social-profile.sql
-- and supabase-profile-identity.sql.

begin;

alter table public.profiles
  add column if not exists profile_visibility text not null default 'public',
  add column if not exists avatar_id text not null default 'garage-shield';

alter table public.profiles
  drop constraint if exists profiles_profile_visibility_check;

alter table public.profiles
  add constraint profiles_profile_visibility_check
  check (profile_visibility in ('public', 'friends', 'private'));

alter table public.profiles
  drop constraint if exists profiles_avatar_id_format_check;

alter table public.profiles
  add constraint profiles_avatar_id_format_check
  check (avatar_id ~ '^[a-z0-9-]{1,40}$');

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
    p.profile_visibility,
    case
      when (p.profile_visibility = 'public' or p.id = (select auth.uid()))
       and (p.garage_visibility = 'public' or p.id = (select auth.uid())) then count(cr.id)
      else 0
    end as vehicle_count,
    case
      when (p.profile_visibility = 'public' or p.id = (select auth.uid()))
       and (p.garage_visibility = 'public' or p.id = (select auth.uid())) then
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
    and p.username is not null
    and trim(p_query) <> ''
    and lower(p.username) like lower(trim(p_query)) || '%'
  group by p.id, p.username, p.garage_visibility, p.profile_visibility
  order by lower(p.username)
  limit greatest(1, least(coalesce(p_limit, 12), 25));
$$;

drop function if exists public.get_public_garage(text);

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
    and (p.profile_visibility = 'public' or p.id = (select auth.uid()))
    and (p.garage_visibility = 'public' or p.id = (select auth.uid()))
  order by cr.created_at desc, cr.id;
$$;

create or replace function public.get_public_garage_page(p_username text)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with target as (
    select p.id, p.username, p.profile_visibility, p.garage_visibility, p.avatar_id, p.created_at
    from public.profiles p
    where (select auth.uid()) is not null
      and lower(p.username) = lower(trim(p_username))
    limit 1
  ),
  access as (
    select
      t.*,
      ((t.profile_visibility = 'public' and t.garage_visibility = 'public') or t.id = (select auth.uid())) as can_view_garage
    from target t
  ),
  reward_summary as (
    select
      a.id,
      coalesce(ur.radar_points, 0) as radar_points,
      coalesce(ur.seller_score, 0) as seller_score,
      coalesce(ur.verification_score, 0) as verification_score,
      coalesce((
        select jsonb_object_agg(ec.event_type, ec.event_count)
        from (
          select re.event_type, count(*)::integer as event_count
          from public.reward_events re
          where re.user_id = a.id
          group by re.event_type
        ) ec
      ), '{}'::jsonb) as event_counts
    from access a
    left join public.user_rewards ur on ur.user_id = a.id
  ),
  garage_rows as (
    select cr.id, cr.owner_id, cr.owner_username, cr.data, cr.created_at, cr.updated_at
    from public.content_records cr
    join access a on a.id = cr.owner_id
    where cr.content_type = 'collection'
      and a.can_view_garage
    order by cr.created_at desc, cr.id
  )
  select jsonb_build_object(
    'profile', jsonb_build_object(
      'id', a.id,
      'username', a.username,
      'profile_visibility', a.profile_visibility,
      'garage_visibility', a.garage_visibility,
      'avatar_id', a.avatar_id,
      'created_at', a.created_at
    ),
    'rewards', case
      when a.can_view_garage then
        jsonb_build_object(
          'radar_points', rs.radar_points,
          'seller_score', rs.seller_score,
          'verification_score', rs.verification_score,
          'event_counts', rs.event_counts
        )
      else '{}'::jsonb
    end,
    'garage', case
      when a.can_view_garage then
        coalesce((select jsonb_agg(to_jsonb(gr) order by gr.created_at desc, gr.id) from garage_rows gr), '[]'::jsonb)
      else '[]'::jsonb
    end
  )
  from access a
  left join reward_summary rs on rs.id = a.id;
$$;

revoke all on function public.search_public_profiles(text, integer) from public, anon;
revoke all on function public.get_public_garage(text) from public, anon;
revoke all on function public.get_public_garage_page(text) from public, anon;
grant execute on function public.search_public_profiles(text, integer) to authenticated;
grant execute on function public.get_public_garage(text) to authenticated;
grant execute on function public.get_public_garage_page(text) to authenticated;

commit;
