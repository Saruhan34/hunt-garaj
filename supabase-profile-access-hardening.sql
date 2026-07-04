-- Hunt Radar: profile access hardening
-- Run after supabase-user-garages.sql.

begin;

alter table public.profiles enable row level security;

-- Remove policies accumulated by older setup scripts.  Recreating a single
-- policy per operation keeps the effective access rules understandable.
drop policy if exists "Kullanıcı kendi profilini oluşturabilir" on public.profiles;
drop policy if exists "users can insert own profile" on public.profiles;
drop policy if exists "Herkes profil görebilir" on public.profiles;
drop policy if exists "profiles are viewable by signed in users" on public.profiles;
drop policy if exists "users can view own profile or admin can view all" on public.profiles;
drop policy if exists "Kullanıcı kendi profilini güncelleyebilir" on public.profiles;
drop policy if exists "users and admins can update profiles" on public.profiles;
drop policy if exists "users can update own public profile fields" on public.profiles;

create policy "signed in users can view safe profile fields"
on public.profiles
for select
to authenticated
using (true);

create policy "users can create their own profile"
on public.profiles
for insert
to authenticated
with check (
  (select auth.uid()) = id
  and coalesce(email, '') = coalesce((select auth.jwt()) ->> 'email', '')
);

create policy "users can update their own public profile fields"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- RLS limits rows; column grants limit which data can be read or changed.
-- In particular, clients cannot read e-mail addresses or promote their role.
revoke all on table public.profiles from anon;
revoke all on table public.profiles from authenticated;

grant select (id, username, role, garage_visibility, created_at, updated_at)
on public.profiles to authenticated;

grant insert (id, email, username, garage_visibility)
on public.profiles to authenticated;

grant update (username, garage_visibility, updated_at)
on public.profiles to authenticated;

commit;
