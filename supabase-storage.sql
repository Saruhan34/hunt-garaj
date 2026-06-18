-- Hunt Radar public visual asset bucket
-- Run in Supabase Dashboard > SQL Editor.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hunt-radar-assets',
  'hunt-radar-assets',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "hunt radar assets are public" on storage.objects;
create policy "hunt radar assets are public"
on storage.objects
for select
to public
using (bucket_id = 'hunt-radar-assets');

drop policy if exists "admins upload hunt radar assets" on storage.objects;
create policy "admins upload hunt radar assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'hunt-radar-assets'
  and public.is_admin()
);

drop policy if exists "admins update hunt radar assets" on storage.objects;
create policy "admins update hunt radar assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'hunt-radar-assets'
  and public.is_admin()
)
with check (
  bucket_id = 'hunt-radar-assets'
  and public.is_admin()
);

drop policy if exists "admins delete hunt radar assets" on storage.objects;
create policy "admins delete hunt radar assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'hunt-radar-assets'
  and public.is_admin()
);
