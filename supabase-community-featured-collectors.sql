-- Hunt Radar: Avcılar sekmesi için öne çıkan koleksiyonerler
-- Supabase Dashboard > SQL Editor içinde bir kez çalıştır.

begin;

create or replace function public.get_featured_collectors(
  p_limit integer default 4
)
returns table (
  id uuid,
  username text,
  avatar_id text,
  avatar_url text,
  garage_visibility text,
  profile_visibility text,
  vehicle_count bigint,
  highest_rarity text,
  follower_count integer,
  following_count integer,
  is_following boolean,
  last_active_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  with viewer as (
    select (select auth.uid()) as id
  )
  select
    p.id,
    p.username,
    p.avatar_id,
    p.avatar_url,
    coalesce(p.garage_visibility, 'public') as garage_visibility,
    coalesce(p.profile_visibility, 'public') as profile_visibility,
    coalesce(collection_summary.vehicle_count, 0)::bigint as vehicle_count,
    collection_summary.highest_rarity,
    coalesce(follow_summary.follower_count, 0)::integer as follower_count,
    coalesce(follow_summary.following_count, 0)::integer as following_count,
    coalesce(follow_summary.is_following, false) as is_following,
    coalesce(collection_summary.last_active_at, p.updated_at, p.created_at) as last_active_at
  from public.profiles p
  cross join viewer
  left join lateral (
    select
      count(cr.id)::bigint as vehicle_count,
      (
        array_agg(
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
        ) filter (where cr.id is not null)
      )[1] as highest_rarity,
      max(cr.updated_at) as last_active_at
    from public.content_records cr
    where cr.owner_id = p.id
      and cr.content_type = 'collection'
  ) collection_summary on true
  left join lateral (
    select
      (select count(*) from public.user_follows f where f.followed_id = p.id)::integer as follower_count,
      (select count(*) from public.user_follows f where f.follower_id = p.id)::integer as following_count,
      exists (
        select 1
        from public.user_follows f
        where f.follower_id = viewer.id
          and f.followed_id = p.id
      ) as is_following
  ) follow_summary on true
  where viewer.id is not null
    and p.username is not null
    and coalesce(p.profile_visibility, 'public') = 'public'
    and coalesce(p.garage_visibility, 'public') = 'public'
  order by
    (p.id = viewer.id) asc,
    coalesce(collection_summary.last_active_at, p.updated_at, p.created_at) desc,
    coalesce(follow_summary.follower_count, 0) desc,
    coalesce(collection_summary.vehicle_count, 0) desc,
    lower(p.username)
  limit greatest(1, least(coalesce(p_limit, 4), 12));
$$;

revoke all on function public.get_featured_collectors(integer) from public, anon;
grant execute on function public.get_featured_collectors(integer) to authenticated;

commit;

select
  p.proname,
  p.prosecdef as security_definer,
  has_function_privilege('authenticated', p.oid, 'execute') as authenticated_can_execute,
  has_function_privilege('anon', p.oid, 'execute') as anon_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname = 'get_featured_collectors';
