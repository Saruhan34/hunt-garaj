-- Hunt Radar: follower system
-- Run after supabase-profile-visibility-hardening.sql.

begin;

create table if not exists public.user_follows (
  follower_id uuid not null references auth.users(id) on delete cascade,
  followed_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, followed_id),
  constraint user_follows_no_self_follow check (follower_id <> followed_id)
);

create index if not exists user_follows_followed_id_created_at_idx
on public.user_follows (followed_id, created_at desc);

create index if not exists user_follows_follower_id_created_at_idx
on public.user_follows (follower_id, created_at desc);

alter table public.user_follows enable row level security;

drop policy if exists "signed in users can read follow graph" on public.user_follows;
drop policy if exists "users can follow as themselves" on public.user_follows;
drop policy if exists "users can unfollow as themselves" on public.user_follows;

create policy "signed in users can read follow graph"
on public.user_follows
for select
to authenticated
using (true);

create policy "users can follow as themselves"
on public.user_follows
for insert
to authenticated
with check (
  (select auth.uid()) = follower_id
  and follower_id <> followed_id
  and exists (
    select 1
    from public.profiles p
    where p.id = followed_id
      and p.username is not null
  )
);

create policy "users can unfollow as themselves"
on public.user_follows
for delete
to authenticated
using ((select auth.uid()) = follower_id);

revoke all on table public.user_follows from anon;
revoke all on table public.user_follows from authenticated;
grant select, insert, delete on table public.user_follows to authenticated;

create or replace function public.get_profile_follow_summary(p_target_user_id uuid)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'followers', (
      select count(*)::integer
      from public.user_follows uf
      where uf.followed_id = p_target_user_id
    ),
    'following', (
      select count(*)::integer
      from public.user_follows uf
      where uf.follower_id = p_target_user_id
    ),
    'is_following', exists (
      select 1
      from public.user_follows uf
      where uf.follower_id = (select auth.uid())
        and uf.followed_id = p_target_user_id
    )
  )
  where (select auth.uid()) is not null
    and p_target_user_id is not null;
$$;

create or replace function public.set_profile_follow(
  p_target_user_id uuid,
  p_following boolean default true
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if p_target_user_id is null then
    raise exception 'target_required' using errcode = '22023';
  end if;

  if p_target_user_id = v_user_id then
    raise exception 'self_follow_not_allowed' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.profiles p
    where p.id = p_target_user_id
      and p.username is not null
  ) then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  if coalesce(p_following, true) then
    insert into public.user_follows (follower_id, followed_id)
    values (v_user_id, p_target_user_id)
    on conflict (follower_id, followed_id) do nothing;
  else
    delete from public.user_follows
    where follower_id = v_user_id
      and followed_id = p_target_user_id;
  end if;

  return public.get_profile_follow_summary(p_target_user_id);
end;
$$;

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
  )
  select
    p.id,
    p.username,
    p.garage_visibility,
    p.profile_visibility,
    case
      when (
        p.profile_visibility = 'public'
        or p.id = viewer.id
        or (
          p.profile_visibility = 'friends'
          and exists (
            select 1 from public.user_follows f1
            where f1.follower_id = viewer.id and f1.followed_id = p.id
          )
          and exists (
            select 1 from public.user_follows f2
            where f2.follower_id = p.id and f2.followed_id = viewer.id
          )
        )
      )
      and (
        p.garage_visibility = 'public'
        or p.id = viewer.id
      ) then count(cr.id)
      else 0
    end as vehicle_count,
    case
      when (
        p.profile_visibility = 'public'
        or p.id = viewer.id
        or (
          p.profile_visibility = 'friends'
          and exists (
            select 1 from public.user_follows f1
            where f1.follower_id = viewer.id and f1.followed_id = p.id
          )
          and exists (
            select 1 from public.user_follows f2
            where f2.follower_id = p.id and f2.followed_id = viewer.id
          )
        )
      )
      and (
        p.garage_visibility = 'public'
        or p.id = viewer.id
      ) then
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
    end as highest_rarity,
    (
      select count(*)::integer
      from public.user_follows uf
      where uf.followed_id = p.id
    ) as follower_count,
    (
      select count(*)::integer
      from public.user_follows uf
      where uf.follower_id = p.id
    ) as following_count,
    exists (
      select 1
      from public.user_follows uf
      where uf.follower_id = viewer.id
        and uf.followed_id = p.id
    ) as is_following
  from public.profiles p
  cross join viewer
  left join public.content_records cr
    on cr.owner_id = p.id
   and cr.content_type = 'collection'
  where viewer.id is not null
    and p.username is not null
    and trim(p_query) <> ''
    and lower(p.username) like lower(trim(p_query)) || '%'
  group by p.id, p.username, p.garage_visibility, p.profile_visibility, viewer.id
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
  with viewer as (
    select (select auth.uid()) as id
  )
  select cr.id, cr.owner_id, cr.owner_username, cr.data, cr.created_at, cr.updated_at
  from public.content_records cr
  join public.profiles p on p.id = cr.owner_id
  cross join viewer
  where viewer.id is not null
    and cr.content_type = 'collection'
    and lower(p.username) = lower(trim(p_username))
    and (
      p.profile_visibility = 'public'
      or p.id = viewer.id
      or (
        p.profile_visibility = 'friends'
        and exists (
          select 1 from public.user_follows f1
          where f1.follower_id = viewer.id and f1.followed_id = p.id
        )
        and exists (
          select 1 from public.user_follows f2
          where f2.follower_id = p.id and f2.followed_id = viewer.id
        )
      )
    )
    and (p.garage_visibility = 'public' or p.id = viewer.id)
  order by cr.created_at desc, cr.id;
$$;

create or replace function public.get_public_garage_page(p_username text)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with viewer as (
    select (select auth.uid()) as id
  ),
  target as (
    select p.id, p.username, p.profile_visibility, p.garage_visibility, p.avatar_id, p.created_at
    from public.profiles p
    cross join viewer
    where viewer.id is not null
      and lower(p.username) = lower(trim(p_username))
    limit 1
  ),
  access as (
    select
      t.*,
      (
        t.profile_visibility = 'public'
        or t.id = viewer.id
        or (
          t.profile_visibility = 'friends'
          and exists (
            select 1 from public.user_follows f1
            where f1.follower_id = viewer.id and f1.followed_id = t.id
          )
          and exists (
            select 1 from public.user_follows f2
            where f2.follower_id = t.id and f2.followed_id = viewer.id
          )
        )
      ) as can_view_profile,
      (
        (
          t.profile_visibility = 'public'
          or t.id = viewer.id
          or (
            t.profile_visibility = 'friends'
            and exists (
              select 1 from public.user_follows f1
              where f1.follower_id = viewer.id and f1.followed_id = t.id
            )
            and exists (
              select 1 from public.user_follows f2
              where f2.follower_id = t.id and f2.followed_id = viewer.id
            )
          )
        )
        and (t.garage_visibility = 'public' or t.id = viewer.id)
      ) as can_view_garage,
      exists (
        select 1
        from public.user_follows uf
        where uf.follower_id = viewer.id
          and uf.followed_id = t.id
      ) as is_following
    from target t
    cross join viewer
  ),
  follow_summary as (
    select
      a.id,
      (
        select count(*)::integer
        from public.user_follows uf
        where uf.followed_id = a.id
      ) as follower_count,
      (
        select count(*)::integer
        from public.user_follows uf
        where uf.follower_id = a.id
      ) as following_count
    from access a
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
      'created_at', a.created_at,
      'can_view_profile', a.can_view_profile,
      'can_view_garage', a.can_view_garage,
      'follower_count', fs.follower_count,
      'following_count', fs.following_count,
      'is_following', a.is_following
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
  left join follow_summary fs on fs.id = a.id
  left join reward_summary rs on rs.id = a.id;
$$;

revoke all on function public.get_profile_follow_summary(uuid) from public, anon;
revoke all on function public.set_profile_follow(uuid, boolean) from public, anon;
revoke all on function public.search_public_profiles(text, integer) from public, anon;
revoke all on function public.get_public_garage(text) from public, anon;
revoke all on function public.get_public_garage_page(text) from public, anon;
grant execute on function public.get_profile_follow_summary(uuid) to authenticated;
grant execute on function public.set_profile_follow(uuid, boolean) to authenticated;
grant execute on function public.search_public_profiles(text, integer) to authenticated;
grant execute on function public.get_public_garage(text) to authenticated;
grant execute on function public.get_public_garage_page(text) to authenticated;

commit;
