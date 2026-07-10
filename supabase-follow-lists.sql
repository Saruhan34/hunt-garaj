-- Hunt Radar: public profile follow lists
-- Run after supabase-follow-system.sql.

create or replace function public.get_profile_follow_list(
  p_target_user_id uuid,
  p_kind text default 'followers',
  p_limit integer default 40
)
returns table (
  id uuid,
  username text,
  avatar_id text,
  profile_visibility text,
  garage_visibility text,
  bio text,
  location text,
  favorite_tags text[],
  follower_count integer,
  following_count integer,
  is_following boolean,
  created_at timestamptz
)
language sql
security invoker
set search_path = public
as $$
  with viewer as (
    select (select auth.uid()) as id
  ),
  target as (
    select p.id
    from public.profiles p
    where p.id = p_target_user_id
      and coalesce(p.profile_visibility, 'public') = 'public'
  ),
  graph as (
    select
      case
        when lower(coalesce(p_kind, 'followers')) = 'following' then uf.followed_id
        else uf.follower_id
      end as profile_id,
      uf.created_at
    from public.user_follows uf
    join target t on (
      (lower(coalesce(p_kind, 'followers')) = 'following' and uf.follower_id = t.id)
      or
      (lower(coalesce(p_kind, 'followers')) <> 'following' and uf.followed_id = t.id)
    )
    order by uf.created_at desc
    limit greatest(1, least(coalesce(p_limit, 40), 80))
  )
  select
    p.id,
    p.username,
    p.avatar_id,
    coalesce(p.profile_visibility, 'public') as profile_visibility,
    coalesce(p.garage_visibility, 'private') as garage_visibility,
    case when coalesce(p.profile_visibility, 'public') = 'public' then p.bio else null end as bio,
    case when coalesce(p.profile_visibility, 'public') = 'public' then p.location else null end as location,
    case when coalesce(p.profile_visibility, 'public') = 'public' then p.favorite_tags else array[]::text[] end as favorite_tags,
    (
      select count(*)::integer
      from public.user_follows count_followers
      where count_followers.followed_id = p.id
    ) as follower_count,
    (
      select count(*)::integer
      from public.user_follows count_following
      where count_following.follower_id = p.id
    ) as following_count,
    exists (
      select 1
      from public.user_follows viewer_follow
      cross join viewer
      where viewer_follow.follower_id = viewer.id
        and viewer_follow.followed_id = p.id
    ) as is_following,
    graph.created_at
  from graph
  join public.profiles p on p.id = graph.profile_id
  where p.username is not null
  order by graph.created_at desc;
$$;

revoke all on function public.get_profile_follow_list(uuid, text, integer) from public, anon;
grant execute on function public.get_profile_follow_list(uuid, text, integer) to authenticated;
