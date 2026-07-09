-- Hunt Radar Auth temel kurulumu
-- Supabase Dashboard > SQL Editor içinde çalıştır.

begin;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  username text unique,
  garage_visibility text not null default 'public' check (garage_visibility in ('public', 'private')),
  avatar_id text not null default 'garage-shield' check (avatar_id ~ '^[a-z0-9-]{1,40}$'),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_username text;
begin
  requested_username := nullif(trim(new.raw_user_meta_data ->> 'username'), '');
  if requested_username is not null and requested_username !~ '^[A-Za-z0-9_.-]{3,20}$' then
    raise exception 'username_invalid' using errcode = '22023';
  end if;

  insert into public.profiles (id, email, username, role)
  values (
    new.id,
    lower(new.email),
    requested_username,
    case
      when lower(new.email) = 'saruhanckmak@gmail.com' then 'admin'
      else 'user'
    end
  )
  on conflict (id) do update set
    email = excluded.email,
    username = coalesce(public.profiles.username, excluded.username),
    role = case
      when lower(excluded.email) = 'saruhanckmak@gmail.com' then 'admin'
      else public.profiles.role
    end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Handles are public identifiers, but their availability check returns only a boolean.
create or replace function public.is_username_available(p_username text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    coalesce(trim(p_username), '') ~ '^[A-Za-z0-9_.-]{3,20}$'
    and not exists (
      select 1
      from public.profiles p
      where lower(p.username) = lower(trim(p_username))
    );
$$;

revoke all on function public.is_username_available(text) from public;
grant execute on function public.is_username_available(text) to anon, authenticated;

-- Used by first-login onboarding and future profile editing. Ownership remains auth.uid().
create or replace function public.set_my_username(p_username text)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
  v_username text := trim(p_username);
begin
  if v_user_id is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;
  if v_username !~ '^[A-Za-z0-9_.-]{3,20}$' then
    raise exception 'username_invalid' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.profiles p
    where lower(p.username) = lower(v_username) and p.id <> v_user_id
  ) then
    raise exception 'username_taken' using errcode = '23505';
  end if;

  update public.profiles
  set username = v_username
  where id = v_user_id;

  update public.content_records
  set owner_username = v_username,
      updated_at = now()
  where owner_id = v_user_id;

  return v_username;
end;
$$;

revoke all on function public.set_my_username(text) from public, anon;
grant execute on function public.set_my_username(text) to authenticated;

-- Safely remove the legacy UUID suffix when the requested base handle is unambiguous.
create temporary table username_suffix_cleanup on commit drop as
select
  p.id,
  p.username as old_username,
  regexp_replace(p.username, '-[0-9a-fA-F]{6}$', '') as new_username
from public.profiles p
where p.username ~ '-[0-9a-fA-F]{6}$'
  and regexp_replace(p.username, '-[0-9a-fA-F]{6}$', '') ~ '^[A-Za-z0-9_.-]{3,20}$';

delete from username_suffix_cleanup c
where exists (
  select 1 from public.profiles p
  where p.id <> c.id and lower(p.username) = lower(c.new_username)
)
or exists (
  select 1 from username_suffix_cleanup other
  where other.id <> c.id and lower(other.new_username) = lower(c.new_username)
);

update public.profiles p
set username = c.new_username
from username_suffix_cleanup c
where p.id = c.id;

do $$
begin
  if to_regclass('public.content_records') is not null then
    execute $sql$
      update public.content_records cr
      set owner_username = c.new_username,
          updated_at = now()
      from username_suffix_cleanup c
      where cr.owner_id = c.id
    $sql$;
  end if;
end;
$$;

create unique index if not exists profiles_username_lower_unique
on public.profiles (lower(username))
where username is not null;

drop policy if exists "profiles are viewable by signed in users" on public.profiles;
create policy "profiles are viewable by signed in users"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "users can insert own profile" on public.profiles;
create policy "users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "users can update own public profile fields" on public.profiles;
create policy "users can update own public profile fields"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (
  auth.uid() = id
  and role = (select role from public.profiles where id = auth.uid())
);

-- Eğer admin kullanıcı daha önce oluşturulduysa rolü elle düzelt:
update public.profiles
set role = 'admin'
where lower(email) = 'saruhanckmak@gmail.com';

-- Admin panel / public site içerik yönetimi
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

drop policy if exists "site settings are public readable" on public.site_settings;
create policy "site settings are public readable"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "admins can insert site settings" on public.site_settings;
create policy "admins can insert site settings"
on public.site_settings
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "admins can update site settings" on public.site_settings;
create policy "admins can update site settings"
on public.site_settings
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.site_settings (key, value)
values (
  'site_config',
  '{
    "heroEyebrow": "Hot Wheels garaj pazarı",
    "heroTitleOne": "HUNT",
    "heroTitleTwo": "RADAR",
    "heroCopy": "Hot Wheels garajını, pazar ilanlarını ve hunt bildirimlerini tek merkezde yönet.",
    "heroTagline": "Garajını kur, rafları takip et.",
    "heroImage": "./assets/garage-hero.png",
    "bannerEnabled": false,
    "bannerTitle": "Hunt Radar duyurusu",
    "bannerText": "",
    "featuredListingKey": "",
    "featuredStoreId": "",
    "popularSearch": "Premium Ferrari",
    "communityTitle": "2026 mainline av listesi",
    "communityMeta": "24 yorum · rehber konusu",
    "catalogOverrides": {},
    "customCatalog": [],
    "hiddenCatalogIds": [],
    "contents": []
  }'::jsonb
)
on conflict (key) do nothing;

commit;
