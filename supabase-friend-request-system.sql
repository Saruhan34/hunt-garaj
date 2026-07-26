-- Hunt Radar: kalıcı arkadaşlık istekleri ve kabul edilmiş arkadaşlar
-- supabase-follow-system.sql sonrasında bir kez çalıştır.

begin;

create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending'
    check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint friend_requests_no_self_request check (sender_id <> receiver_id)
);

create unique index if not exists friend_requests_active_pair_idx
on public.friend_requests (
  least(sender_id, receiver_id),
  greatest(sender_id, receiver_id)
)
where status in ('pending', 'accepted');

create index if not exists friend_requests_receiver_status_created_idx
on public.friend_requests (receiver_id, status, created_at desc);

create index if not exists friend_requests_sender_status_created_idx
on public.friend_requests (sender_id, status, created_at desc);

alter table public.friend_requests enable row level security;

drop policy if exists "participants can read friend requests" on public.friend_requests;
create policy "participants can read friend requests"
on public.friend_requests
for select
to authenticated
using (
  (select auth.uid()) = sender_id
  or (select auth.uid()) = receiver_id
);

revoke all on table public.friend_requests from anon, authenticated;
grant select on table public.friend_requests to authenticated;

grant select (id, username, avatar_id, avatar_url, garage_visibility, profile_visibility)
on public.profiles to authenticated;
grant select on table public.content_records to authenticated;

-- Eski tek yönlü bağlantıları veri kaybetmeden kabul edilmiş arkadaşlığa çevir.
insert into public.friend_requests (sender_id, receiver_id, status, created_at, updated_at)
select distinct on (least(uf.follower_id, uf.followed_id), greatest(uf.follower_id, uf.followed_id))
  uf.follower_id,
  uf.followed_id,
  'accepted',
  uf.created_at,
  uf.created_at
from public.user_follows uf
where uf.follower_id <> uf.followed_id
order by
  least(uf.follower_id, uf.followed_id),
  greatest(uf.follower_id, uf.followed_id),
  uf.created_at
on conflict do nothing;

-- Kabul edilmiş eski bağlantıları iki yönlü hale getir.
insert into public.user_follows (follower_id, followed_id)
select fr.sender_id, fr.receiver_id
from public.friend_requests fr
where fr.status = 'accepted'
union
select fr.receiver_id, fr.sender_id
from public.friend_requests fr
where fr.status = 'accepted'
on conflict (follower_id, followed_id) do nothing;

create or replace function public.get_profile_follow_summary(p_target_user_id uuid)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with viewer as (
    select (select auth.uid()) as id
  ),
  active_request as (
    select fr.id, fr.sender_id, fr.receiver_id, fr.status
    from public.friend_requests fr
    cross join viewer
    where fr.status in ('pending', 'accepted')
      and (
        (fr.sender_id = viewer.id and fr.receiver_id = p_target_user_id)
        or (fr.receiver_id = viewer.id and fr.sender_id = p_target_user_id)
      )
    limit 1
  ),
  relation as (
    select
      case
        when p_target_user_id = viewer.id then 'self'
        when exists (
          select 1
          from public.user_follows f1
          where f1.follower_id = viewer.id
            and f1.followed_id = p_target_user_id
        ) and exists (
          select 1
          from public.user_follows f2
          where f2.follower_id = p_target_user_id
            and f2.followed_id = viewer.id
        ) then 'friends'
        when exists (
          select 1 from active_request ar
          where ar.status = 'accepted'
        ) then 'friends'
        when exists (
          select 1 from active_request ar
          where ar.status = 'pending' and ar.sender_id = viewer.id
        ) then 'outgoing_pending'
        when exists (
          select 1 from active_request ar
          where ar.status = 'pending' and ar.receiver_id = viewer.id
        ) then 'incoming_pending'
        else 'none'
      end as friendship_state,
      (select ar.id from active_request ar where ar.status = 'pending' limit 1) as request_id
    from viewer
  )
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
    'is_following', relation.friendship_state = 'friends',
    'friendship_state', relation.friendship_state,
    'request_id', relation.request_id
  )
  from viewer
  cross join relation
  where viewer.id is not null
    and p_target_user_id is not null;
$$;

create or replace function public.get_friendship_states(p_target_user_ids uuid[])
returns table (
  target_user_id uuid,
  friendship_state text,
  request_id uuid
)
language sql
stable
security invoker
set search_path = ''
as $$
  with viewer as (
    select (select auth.uid()) as id
  ),
  targets as (
    select distinct unnest(coalesce(p_target_user_ids, '{}'::uuid[])) as id
  )
  select
    targets.id as target_user_id,
    case
      when targets.id = viewer.id then 'self'
      when exists (
        select 1 from public.user_follows f1
        where f1.follower_id = viewer.id and f1.followed_id = targets.id
      ) and exists (
        select 1 from public.user_follows f2
        where f2.follower_id = targets.id and f2.followed_id = viewer.id
      ) then 'friends'
      when active_request.status = 'accepted' then 'friends'
      when active_request.status = 'pending' and active_request.sender_id = viewer.id then 'outgoing_pending'
      when active_request.status = 'pending' and active_request.receiver_id = viewer.id then 'incoming_pending'
      else 'none'
    end as friendship_state,
    case when active_request.status = 'pending' then active_request.id else null end as request_id
  from targets
  cross join viewer
  left join lateral (
    select fr.id, fr.sender_id, fr.receiver_id, fr.status
    from public.friend_requests fr
    where fr.status in ('pending', 'accepted')
      and (
        (fr.sender_id = viewer.id and fr.receiver_id = targets.id)
        or (fr.receiver_id = viewer.id and fr.sender_id = targets.id)
      )
    limit 1
  ) active_request on true
  where viewer.id is not null;
$$;

create or replace function public.get_friend_requests(p_limit integer default 40)
returns table (
  request_id uuid,
  id uuid,
  username text,
  avatar_id text,
  avatar_url text,
  garage_visibility text,
  profile_visibility text,
  vehicle_count bigint,
  friend_count integer,
  requested_at timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    fr.id as request_id,
    p.id,
    p.username,
    p.avatar_id,
    p.avatar_url,
    coalesce(p.garage_visibility, 'public') as garage_visibility,
    coalesce(p.profile_visibility, 'public') as profile_visibility,
    (
      select count(*)::bigint
      from public.content_records cr
      where cr.owner_id = p.id
        and cr.content_type = 'collection'
    ) as vehicle_count,
    (
      select count(*)::integer
      from public.user_follows uf
      where uf.follower_id = p.id
    ) as friend_count,
    fr.created_at as requested_at
  from public.friend_requests fr
  join public.profiles p on p.id = fr.sender_id
  where fr.receiver_id = (select auth.uid())
    and fr.status = 'pending'
    and p.username is not null
  order by fr.created_at desc
  limit greatest(1, least(coalesce(p_limit, 40), 100));
$$;

create or replace function public.get_friend_list(p_limit integer default 80)
returns table (
  id uuid,
  username text,
  avatar_id text,
  avatar_url text,
  garage_visibility text,
  profile_visibility text,
  vehicle_count bigint,
  friend_count integer,
  friends_since timestamptz
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    p.id,
    p.username,
    p.avatar_id,
    p.avatar_url,
    coalesce(p.garage_visibility, 'public') as garage_visibility,
    coalesce(p.profile_visibility, 'public') as profile_visibility,
    (
      select count(*)::bigint
      from public.content_records cr
      where cr.owner_id = p.id
        and cr.content_type = 'collection'
    ) as vehicle_count,
    (
      select count(*)::integer
      from public.user_follows friend_count_rows
      where friend_count_rows.follower_id = p.id
    ) as friend_count,
    uf.created_at as friends_since
  from public.user_follows uf
  join public.user_follows reciprocal
    on reciprocal.follower_id = uf.followed_id
   and reciprocal.followed_id = uf.follower_id
  join public.profiles p on p.id = uf.followed_id
  where uf.follower_id = (select auth.uid())
    and p.username is not null
  order by uf.created_at desc, lower(p.username)
  limit greatest(1, least(coalesce(p_limit, 80), 150));
$$;

create or replace function public.request_friendship(p_target_user_id uuid)
returns jsonb
language plpgsql
security definer
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
    raise exception 'self_request_not_allowed' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.profiles p
    where p.id = p_target_user_id and p.username is not null
  ) then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  if exists (
    select 1
    from public.friend_requests fr
    where fr.status in ('pending', 'accepted')
      and (
        (fr.sender_id = v_user_id and fr.receiver_id = p_target_user_id)
        or (fr.sender_id = p_target_user_id and fr.receiver_id = v_user_id)
      )
  ) then
    return public.get_profile_follow_summary(p_target_user_id);
  end if;

  update public.friend_requests
  set status = 'cancelled', updated_at = now()
  where status in ('declined', 'cancelled')
    and (
      (sender_id = v_user_id and receiver_id = p_target_user_id)
      or (sender_id = p_target_user_id and receiver_id = v_user_id)
    );

  insert into public.friend_requests (sender_id, receiver_id, status)
  values (v_user_id, p_target_user_id, 'pending');

  return public.get_profile_follow_summary(p_target_user_id);
end;
$$;

create or replace function public.cancel_friend_request(p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_target_user_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  update public.friend_requests
  set status = 'cancelled', updated_at = now()
  where id = p_request_id
    and sender_id = v_user_id
    and status = 'pending'
  returning receiver_id into v_target_user_id;

  if v_target_user_id is null then
    raise exception 'pending_request_not_found' using errcode = 'P0002';
  end if;

  return public.get_profile_follow_summary(v_target_user_id);
end;
$$;

create or replace function public.respond_friend_request(
  p_request_id uuid,
  p_accept boolean
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_sender_id uuid;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  update public.friend_requests
  set
    status = case when coalesce(p_accept, false) then 'accepted' else 'declined' end,
    updated_at = now()
  where id = p_request_id
    and receiver_id = v_user_id
    and status = 'pending'
  returning sender_id into v_sender_id;

  if v_sender_id is null then
    raise exception 'pending_request_not_found' using errcode = 'P0002';
  end if;

  if coalesce(p_accept, false) then
    insert into public.user_follows (follower_id, followed_id)
    values
      (v_user_id, v_sender_id),
      (v_sender_id, v_user_id)
    on conflict (follower_id, followed_id) do nothing;
  end if;

  return public.get_profile_follow_summary(v_sender_id);
end;
$$;

create or replace function public.remove_friend(p_target_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if p_target_user_id is null or p_target_user_id = v_user_id then
    raise exception 'invalid_target' using errcode = '22023';
  end if;

  delete from public.user_follows
  where (follower_id = v_user_id and followed_id = p_target_user_id)
     or (follower_id = p_target_user_id and followed_id = v_user_id);

  update public.friend_requests
  set status = 'cancelled', updated_at = now()
  where status = 'accepted'
    and (
      (sender_id = v_user_id and receiver_id = p_target_user_id)
      or (sender_id = p_target_user_id and receiver_id = v_user_id)
    );

  return public.get_profile_follow_summary(p_target_user_id);
end;
$$;

revoke all on function public.get_profile_follow_summary(uuid) from public, anon;
revoke all on function public.get_friendship_states(uuid[]) from public, anon;
revoke all on function public.get_friend_requests(integer) from public, anon;
revoke all on function public.get_friend_list(integer) from public, anon;
revoke all on function public.request_friendship(uuid) from public, anon;
revoke all on function public.cancel_friend_request(uuid) from public, anon;
revoke all on function public.respond_friend_request(uuid, boolean) from public, anon;
revoke all on function public.remove_friend(uuid) from public, anon;

grant execute on function public.get_profile_follow_summary(uuid) to authenticated;
grant execute on function public.get_friendship_states(uuid[]) to authenticated;
grant execute on function public.get_friend_requests(integer) to authenticated;
grant execute on function public.get_friend_list(integer) to authenticated;
grant execute on function public.request_friendship(uuid) to authenticated;
grant execute on function public.cancel_friend_request(uuid) to authenticated;
grant execute on function public.respond_friend_request(uuid, boolean) to authenticated;
grant execute on function public.remove_friend(uuid) to authenticated;

commit;

select
  to_regclass('public.friend_requests') is not null as friend_requests_ready,
  c.relrowsecurity as rls_enabled,
  has_table_privilege('authenticated', 'public.friend_requests', 'select') as authenticated_can_select,
  has_table_privilege('anon', 'public.friend_requests', 'select') as anon_can_select
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname = 'friend_requests';

select
  p.proname,
  p.prosecdef as security_definer,
  has_function_privilege('authenticated', p.oid, 'execute') as authenticated_can_execute,
  has_function_privilege('anon', p.oid, 'execute') as anon_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'get_friendship_states',
    'get_friend_requests',
    'get_friend_list',
    'request_friendship',
    'cancel_friend_request',
    'respond_friend_request',
    'remove_friend'
  )
order by p.proname;
