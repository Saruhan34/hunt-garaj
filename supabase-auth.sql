-- Hunt Radar Auth temel kurulumu
-- Supabase Dashboard > SQL Editor içinde çalıştır.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  username text unique,
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
set search_path = public
as $$
declare
  requested_username text;
begin
  requested_username := nullif(trim(new.raw_user_meta_data ->> 'username'), '');

  insert into public.profiles (id, email, username, role)
  values (
    new.id,
    lower(new.email),
    coalesce(requested_username, split_part(lower(new.email), '@', 1)) || '-' || left(new.id::text, 6),
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
