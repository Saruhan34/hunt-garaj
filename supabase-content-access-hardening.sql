-- Hunt Radar: consolidate content_records access policies
-- Run after supabase-profile-access-hardening.sql.

begin;

alter table public.content_records enable row level security;

drop policy if exists "admins can moderate public content" on public.content_records;
drop policy if exists "community content is readable" on public.content_records;
drop policy if exists "owners read their own content" on public.content_records;
drop policy if exists "signed in users read visible garages" on public.content_records;
drop policy if exists "users create only their own content" on public.content_records;
drop policy if exists "users update only their own content" on public.content_records;
drop policy if exists "users delete only their own content" on public.content_records;

create policy "community content is readable"
on public.content_records
for select
to anon
using (content_type in ('stores', 'market', 'comments'));

create policy "signed in content access"
on public.content_records
for select
to authenticated
using (
  (select public.is_admin())
  or owner_id = (select auth.uid())
  or content_type in ('stores', 'market', 'comments')
  or (
    content_type = 'collection'
    and (
      data ->> 'forSale' = 'true'
      or data ->> 'forTrade' = 'true'
      or data ->> 'marketType' in ('Satılık', 'Takaslık')
      or exists (
        select 1
        from public.profiles p
        where p.id = content_records.owner_id
          and p.garage_visibility = 'public'
      )
    )
  )
);

create policy "signed in users create owned content"
on public.content_records
for insert
to authenticated
with check (
  owner_id = (select auth.uid())
  or (select public.is_admin())
);

create policy "signed in users update owned content"
on public.content_records
for update
to authenticated
using (
  owner_id = (select auth.uid())
  or (select public.is_admin())
)
with check (
  owner_id = (select auth.uid())
  or (select public.is_admin())
);

create policy "signed in users delete owned content"
on public.content_records
for delete
to authenticated
using (
  owner_id = (select auth.uid())
  or (select public.is_admin())
);

commit;
