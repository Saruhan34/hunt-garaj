-- Hunt Radar public content ownership and RLS
-- Run once in Supabase Dashboard > SQL Editor.

create table if not exists public.content_records (
  id text primary key,
  content_type text not null check (
    content_type in ('collection', 'wishlist', 'stores', 'market', 'comments')
  ),
  owner_id uuid not null references auth.users(id) on delete cascade,
  owner_username text not null,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_records_type_idx
on public.content_records(content_type);

create index if not exists content_records_owner_idx
on public.content_records(owner_id);

alter table public.content_records enable row level security;

drop policy if exists "public content is readable" on public.content_records;

drop policy if exists "owners read their own content" on public.content_records;
create policy "owners read their own content"
on public.content_records
for select
to authenticated
using ((select auth.uid()) = owner_id);

drop policy if exists "community content is readable" on public.content_records;
create policy "community content is readable"
on public.content_records
for select
to anon, authenticated
using (content_type in ('stores', 'market', 'comments'));

drop policy if exists "signed in users read visible garages" on public.content_records;
create policy "signed in users read visible garages"
on public.content_records
for select
to authenticated
using (
  content_type = 'collection'
  and (
    (data ->> 'forSale') = 'true'
    or (data ->> 'forTrade') = 'true'
    or data ->> 'marketType' in ('Satılık', 'Takaslık')
    or exists (
      select 1 from public.profiles p
      where p.id = owner_id and p.garage_visibility = 'public'
    )
  )
);

drop policy if exists "users create only their own content" on public.content_records;
create policy "users create only their own content"
on public.content_records
for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "users update only their own content" on public.content_records;
create policy "users update only their own content"
on public.content_records
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "users delete only their own content" on public.content_records;
create policy "users delete only their own content"
on public.content_records
for delete
to authenticated
using (auth.uid() = owner_id);

-- Admin moderation remains available only through the admin role.
drop policy if exists "admins can moderate public content" on public.content_records;
create policy "admins can moderate public content"
on public.content_records
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists content_records_set_updated_at on public.content_records;
create trigger content_records_set_updated_at
before update on public.content_records
for each row execute function public.set_updated_at();
