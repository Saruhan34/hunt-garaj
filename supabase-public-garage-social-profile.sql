-- Hunt Radar: premium public garage social profile
-- Run after supabase-content-access-hardening.sql.

begin;

alter table public.profiles
  add column if not exists avatar_id text not null default 'garage-shield';

alter table public.profiles
  drop constraint if exists profiles_avatar_id_format_check;

alter table public.profiles
  add constraint profiles_avatar_id_format_check
  check (avatar_id ~ '^[a-z0-9-]{1,40}$');

grant select (avatar_id) on public.profiles to authenticated;
grant update (avatar_id) on public.profiles to authenticated;

create or replace function public.set_public_avatar(p_avatar_id text)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if p_avatar_id not in (
    'flame-wheel', 'neon-front', 'carbon-wing', 'gold-key',
    'turbo-core', 'gold-supra', 'garage-shield'
  ) then
    raise exception 'invalid_avatar' using errcode = '22023';
  end if;

  update public.profiles
  set avatar_id = p_avatar_id,
      updated_at = now()
  where id = (select auth.uid());

  if not found then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  return p_avatar_id;
end;
$$;

create or replace function public.get_public_garage_page(p_username text)
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with target as (
    select p.id, p.username, p.garage_visibility, p.avatar_id, p.created_at
    from public.profiles p
    where (select auth.uid()) is not null
      and lower(p.username) = lower(trim(p_username))
    limit 1
  ),
  reward_summary as (
    select
      t.id,
      coalesce(ur.radar_points, 0) as radar_points,
      coalesce(ur.seller_score, 0) as seller_score,
      coalesce(ur.verification_score, 0) as verification_score,
      coalesce((
        select jsonb_object_agg(ec.event_type, ec.event_count)
        from (
          select re.event_type, count(*)::integer as event_count
          from public.reward_events re
          where re.user_id = t.id
          group by re.event_type
        ) ec
      ), '{}'::jsonb) as event_counts
    from target t
    left join public.user_rewards ur on ur.user_id = t.id
  ),
  garage_rows as (
    select cr.id, cr.owner_id, cr.owner_username, cr.data, cr.created_at, cr.updated_at
    from public.content_records cr
    join target t on t.id = cr.owner_id
    where cr.content_type = 'collection'
      and (t.garage_visibility = 'public' or t.id = (select auth.uid()))
    order by cr.created_at desc, cr.id
  )
  select jsonb_build_object(
    'profile', jsonb_build_object(
      'id', t.id,
      'username', t.username,
      'garage_visibility', t.garage_visibility,
      'avatar_id', t.avatar_id,
      'created_at', t.created_at
    ),
    'rewards', case
      when t.garage_visibility = 'public' or t.id = (select auth.uid()) then
        jsonb_build_object(
          'radar_points', rs.radar_points,
          'seller_score', rs.seller_score,
          'verification_score', rs.verification_score,
          'event_counts', rs.event_counts
        )
      else '{}'::jsonb
    end,
    'garage', case
      when t.garage_visibility = 'public' or t.id = (select auth.uid()) then
        coalesce((select jsonb_agg(to_jsonb(gr) order by gr.created_at desc, gr.id) from garage_rows gr), '[]'::jsonb)
      else '[]'::jsonb
    end
  )
  from target t
  left join reward_summary rs on rs.id = t.id;
$$;

revoke all on function public.set_public_avatar(text) from public, anon;
revoke all on function public.get_public_garage_page(text) from public, anon;
grant execute on function public.set_public_avatar(text) to authenticated;
grant execute on function public.get_public_garage_page(text) to authenticated;

commit;
