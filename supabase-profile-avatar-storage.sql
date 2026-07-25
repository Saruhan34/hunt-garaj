-- Hunt Garaj: public custom profile avatars
-- Run once in Supabase SQL Editor.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-avatars', 'profile-avatars', true, 1048576, array['image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

alter table public.profiles
  add column if not exists avatar_url text;

alter table public.profiles
  drop constraint if exists profiles_avatar_id_format_check;

alter table public.profiles
  add constraint profiles_avatar_id_format_check
  check (avatar_id ~ '^[a-z0-9-]{1,40}$');

alter table public.profiles
  drop constraint if exists profiles_avatar_url_format_check;

alter table public.profiles
  add constraint profiles_avatar_url_format_check
  check (
    avatar_url is null
    or avatar_url ~ '^https://lqksregvjhuswyvjjjqa\.supabase\.co/storage/v1/object/public/profile-avatars/'
  );

grant select (avatar_id, avatar_url) on public.profiles to authenticated;
grant update (avatar_id, avatar_url) on public.profiles to authenticated;

drop policy if exists "Users upload their own profile avatars" on storage.objects;
create policy "Users upload their own profile avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
  and lower(storage.extension(name)) = 'webp'
);

drop function if exists public.set_public_avatar(text);

create or replace function public.set_public_avatar(
  p_avatar_id text,
  p_avatar_url text default null
)
returns text
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then
    raise exception 'authentication_required' using errcode = '42501';
  end if;

  if p_avatar_id not in ('hr-default', 'custom') then
    raise exception 'invalid_avatar' using errcode = '22023';
  end if;

  if p_avatar_id = 'custom' and (
    p_avatar_url is null
    or p_avatar_url !~ '^https://lqksregvjhuswyvjjjqa\.supabase\.co/storage/v1/object/public/profile-avatars/'
  ) then
    raise exception 'invalid_avatar_url' using errcode = '22023';
  end if;

  update public.profiles
  set avatar_id = p_avatar_id,
      avatar_url = case when p_avatar_id = 'custom' then p_avatar_url else null end,
      updated_at = now()
  where id = (select auth.uid());

  if not found then
    raise exception 'profile_not_found' using errcode = 'P0002';
  end if;

  return p_avatar_id;
end;
$$;

revoke all on function public.set_public_avatar(text, text) from public, anon;
grant execute on function public.set_public_avatar(text, text) to authenticated;

commit;
