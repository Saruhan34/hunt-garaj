-- Hunt Radar multi-photo support
-- Run after supabase-auth.sql and supabase-content-ownership.sql.
-- This file is additive: it does not remove or alter the legacy photo field.

create table if not exists public.radar_note_photos (
  id uuid primary key default gen_random_uuid(),
  radar_note_id text not null references public.content_records(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  photo_url text not null check (
    length(trim(photo_url)) > 0
    and length(photo_url) <= 4096
  ),
  sort_order smallint not null default 0 check (sort_order between 0 and 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (radar_note_id, sort_order)
);

create index if not exists radar_note_photos_note_idx
on public.radar_note_photos(radar_note_id, sort_order);

create index if not exists radar_note_photos_user_idx
on public.radar_note_photos(user_id);

alter table public.radar_note_photos enable row level security;

drop policy if exists "radar note photos are publicly readable" on public.radar_note_photos;
create policy "radar note photos are publicly readable"
on public.radar_note_photos
for select
to anon, authenticated
using (true);

drop policy if exists "owners insert radar note photos" on public.radar_note_photos;
create policy "owners insert radar note photos"
on public.radar_note_photos
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.content_records cr
    where cr.id = radar_note_id
      and cr.content_type = 'stores'
      and cr.owner_id = auth.uid()
  )
);

drop policy if exists "owners update radar note photos" on public.radar_note_photos;
create policy "owners update radar note photos"
on public.radar_note_photos
for update
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.content_records cr
    where cr.id = radar_note_id
      and cr.content_type = 'stores'
      and cr.owner_id = auth.uid()
  )
)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.content_records cr
    where cr.id = radar_note_id
      and cr.content_type = 'stores'
      and cr.owner_id = auth.uid()
  )
);

drop policy if exists "owners delete radar note photos" on public.radar_note_photos;
create policy "owners delete radar note photos"
on public.radar_note_photos
for delete
to authenticated
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.content_records cr
    where cr.id = radar_note_id
      and cr.content_type = 'stores'
      and cr.owner_id = auth.uid()
  )
);

drop trigger if exists radar_note_photos_set_updated_at on public.radar_note_photos;
create trigger radar_note_photos_set_updated_at
before update on public.radar_note_photos
for each row execute function public.set_updated_at();

grant select on public.radar_note_photos to anon, authenticated;
grant insert, update, delete on public.radar_note_photos to authenticated;

-- Users upload radar evidence only under:
-- radar-notes/{auth.uid()}/{radar_note_id}/{file}

drop policy if exists "users upload own radar note photos" on storage.objects;
create policy "users upload own radar note photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'hunt-radar-assets'
  and (storage.foldername(name))[1] = 'radar-notes'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "users update own radar note photos" on storage.objects;
create policy "users update own radar note photos"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'hunt-radar-assets'
  and (storage.foldername(name))[1] = 'radar-notes'
  and (storage.foldername(name))[2] = auth.uid()::text
)
with check (
  bucket_id = 'hunt-radar-assets'
  and (storage.foldername(name))[1] = 'radar-notes'
  and (storage.foldername(name))[2] = auth.uid()::text
);

drop policy if exists "users delete own radar note photos" on storage.objects;
create policy "users delete own radar note photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'hunt-radar-assets'
  and (storage.foldername(name))[1] = 'radar-notes'
  and (storage.foldername(name))[2] = auth.uid()::text
);
