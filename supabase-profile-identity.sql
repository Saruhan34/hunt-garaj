-- Hunt Radar: premium profile identity fields
-- Apply after supabase-auth.sql and supabase-public-garage-social-profile.sql.

begin;

alter table public.profiles
  add column if not exists profile_visibility text not null default 'public',
  add column if not exists bio text not null default '',
  add column if not exists location text not null default '',
  add column if not exists favorite_tags text[] not null default '{}'::text[],
  add column if not exists showcase_vehicle_keys text[] not null default '{}'::text[];

alter table public.profiles
  drop constraint if exists profiles_profile_visibility_check;

alter table public.profiles
  add constraint profiles_profile_visibility_check
  check (profile_visibility in ('public', 'friends', 'private'));

alter table public.profiles
  drop constraint if exists profiles_bio_length_check;

alter table public.profiles
  add constraint profiles_bio_length_check
  check (char_length(bio) <= 140);

alter table public.profiles
  drop constraint if exists profiles_location_length_check;

alter table public.profiles
  add constraint profiles_location_length_check
  check (char_length(location) <= 40);

alter table public.profiles
  drop constraint if exists profiles_favorite_tags_limit_check;

alter table public.profiles
  add constraint profiles_favorite_tags_limit_check
  check (cardinality(favorite_tags) <= 5);

alter table public.profiles
  drop constraint if exists profiles_showcase_vehicle_keys_limit_check;

alter table public.profiles
  add constraint profiles_showcase_vehicle_keys_limit_check
  check (cardinality(showcase_vehicle_keys) <= 6);

grant select (profile_visibility, bio, location, favorite_tags, showcase_vehicle_keys)
on public.profiles to authenticated;

create or replace function public.set_profile_identity(
  p_bio text default '',
  p_location text default '',
  p_favorite_tags text[] default '{}'::text[],
  p_showcase_vehicle_keys text[] default '{}'::text[],
  p_profile_visibility text default 'public'
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_bio text := left(trim(coalesce(p_bio, '')), 140);
  v_location text := left(trim(coalesce(p_location, '')), 40);
  v_favorite_tags text[];
  v_showcase_vehicle_keys text[];
  v_profile_visibility text := coalesce(nullif(trim(p_profile_visibility), ''), 'public');
  v_profile public.profiles%rowtype;
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if v_profile_visibility not in ('public', 'friends', 'private') then
    raise exception 'invalid_profile_visibility' using errcode = '22023';
  end if;

  select coalesce(array_agg(tag), '{}'::text[])
  into v_favorite_tags
  from (
    select distinct left(trim(tag), 32) as tag
    from unnest(coalesce(p_favorite_tags, '{}'::text[])) as tag
    where trim(tag) <> ''
    limit 5
  ) s;

  select coalesce(array_agg(vehicle_key), '{}'::text[])
  into v_showcase_vehicle_keys
  from (
    select distinct left(trim(vehicle_key), 220) as vehicle_key
    from unnest(coalesce(p_showcase_vehicle_keys, '{}'::text[])) as vehicle_key
    where trim(vehicle_key) <> ''
    limit 6
  ) s;

  update public.profiles
  set bio = v_bio,
      location = v_location,
      favorite_tags = v_favorite_tags,
      showcase_vehicle_keys = v_showcase_vehicle_keys,
      profile_visibility = v_profile_visibility,
      updated_at = now()
  where id = v_user_id
  returning * into v_profile;

  if v_profile.id is null then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  return jsonb_build_object(
    'profile_visibility', v_profile.profile_visibility,
    'bio', v_profile.bio,
    'location', v_profile.location,
    'favorite_tags', v_profile.favorite_tags,
    'showcase_vehicle_keys', v_profile.showcase_vehicle_keys,
    'updated_at', v_profile.updated_at
  );
end;
$$;

revoke all on function public.set_profile_identity(text, text, text[], text[], text) from public, anon;
grant execute on function public.set_profile_identity(text, text, text[], text[], text) to authenticated;

commit;
