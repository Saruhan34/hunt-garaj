-- Hunt Garaj: Topluluk / Akis veri modeli
-- Taslak: Canli veritabanina uygulanmadan once staging ortaminda test edilmelidir.
-- Gereksinimler: supabase-auth.sql, supabase-follow-system.sql,
--                supabase-content-ownership.sql

begin;

create extension if not exists pgcrypto;

create table if not exists public.community_creators (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  platform text not null default 'youtube' check (platform in ('youtube')),
  channel_id text,
  channel_url text not null,
  display_name text not null check (char_length(trim(display_name)) between 1 and 80),
  is_verified boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, channel_id)
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  post_type text not null check (post_type in (
    'photo', 'video', 'collection', 'new_vehicle', 'store_experience'
  )),
  body text not null default '' check (char_length(body) <= 1000),
  visibility text not null default 'public' check (visibility in ('public', 'friends')),
  status text not null default 'draft' check (status in (
    'draft', 'published', 'under_review', 'hidden', 'deleted'
  )),
  store_name text check (store_name is null or char_length(trim(store_name)) between 1 and 100),
  location_text text check (location_text is null or char_length(location_text) <= 120),
  experience_date date,
  external_provider text check (external_provider is null or external_provider = 'youtube'),
  external_video_id text check (
    external_video_id is null or external_video_id ~ '^[A-Za-z0-9_-]{11}$'
  ),
  creator_id uuid references public.community_creators(id) on delete set null,
  is_partnership boolean not null default false,
  is_editor_pick boolean not null default false,
  like_count integer not null default 0 check (like_count >= 0),
  comment_count integer not null default 0 check (comment_count >= 0),
  published_at timestamptz,
  edited_at timestamptz,
  deleted_at timestamptz,
  purge_after timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_posts_video_source_check check (
    post_type <> 'video'
    or external_video_id is not null
    or status = 'draft'
  ),
  constraint community_posts_store_fields_check check (
    post_type = 'store_experience'
    or (store_name is null and location_text is null and experience_date is null)
  ),
  constraint community_posts_delete_metadata_check check (
    (status = 'deleted' and deleted_at is not null and purge_after is not null)
    or (status <> 'deleted' and deleted_at is null and purge_after is null)
  )
);

create table if not exists public.community_post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  storage_path text not null unique,
  position smallint not null check (position between 0 and 5),
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_text text check (alt_text is null or char_length(alt_text) <= 300),
  created_at timestamptz not null default now(),
  unique (post_id, position)
);

create table if not exists public.community_post_vehicles (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  content_record_id text references public.content_records(id) on delete set null,
  position smallint not null check (position between 0 and 4),
  vehicle_snapshot jsonb not null check (jsonb_typeof(vehicle_snapshot) = 'object'),
  created_at timestamptz not null default now(),
  primary key (post_id, position)
);

create table if not exists public.community_post_likes (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.community_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.community_posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.community_post_comments(id) on delete restrict,
  body text not null check (char_length(trim(body)) between 1 and 500),
  is_deleted boolean not null default false,
  edited_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_comments_delete_check check (
    (is_deleted and deleted_at is not null) or (not is_deleted and deleted_at is null)
  )
);

create table if not exists public.community_post_saves (
  post_id uuid not null references public.community_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.user_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  constraint user_blocks_no_self_check check (blocker_id <> blocked_id)
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  post_id uuid references public.community_posts(id) on delete cascade,
  comment_id uuid references public.community_post_comments(id) on delete cascade,
  reason text not null check (reason in (
    'spam', 'abuse', 'inappropriate', 'misleading', 'commercial', 'copyright', 'other'
  )),
  details text check (details is null or char_length(details) <= 500),
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed', 'actioned')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint community_reports_one_target_check check (
    (post_id is not null)::integer + (comment_id is not null)::integer = 1
  )
);

create unique index if not exists community_reports_reporter_post_unique_idx
  on public.community_reports (reporter_id, post_id) where post_id is not null;
create unique index if not exists community_reports_reporter_comment_unique_idx
  on public.community_reports (reporter_id, comment_id) where comment_id is not null;

create index if not exists community_posts_public_feed_idx
  on public.community_posts (published_at desc, id desc)
  where status = 'published' and visibility = 'public';
create index if not exists community_posts_author_created_idx
  on public.community_posts (author_id, created_at desc, id desc);
create index if not exists community_posts_creator_idx
  on public.community_posts (creator_id) where creator_id is not null;
create index if not exists community_post_media_post_idx
  on public.community_post_media (post_id, position);
create index if not exists community_post_media_owner_idx
  on public.community_post_media (owner_id);
create index if not exists community_post_vehicles_content_record_idx
  on public.community_post_vehicles (content_record_id) where content_record_id is not null;
create index if not exists community_post_likes_user_idx
  on public.community_post_likes (user_id, created_at desc);
create index if not exists community_post_comments_post_created_idx
  on public.community_post_comments (post_id, created_at desc, id desc);
create index if not exists community_post_comments_author_idx
  on public.community_post_comments (author_id, created_at desc);
create index if not exists community_post_comments_parent_idx
  on public.community_post_comments (parent_id) where parent_id is not null;
create index if not exists community_post_saves_user_idx
  on public.community_post_saves (user_id, created_at desc);
create index if not exists user_blocks_blocked_idx
  on public.user_blocks (blocked_id, blocker_id);
create index if not exists community_reports_status_created_idx
  on public.community_reports (status, created_at desc);

-- Ortak updated_at tetikleyicisi supabase-auth.sql tarafindan saglanir.
drop trigger if exists community_creators_set_updated_at on public.community_creators;
create trigger community_creators_set_updated_at before update on public.community_creators
for each row execute function public.set_updated_at();
drop trigger if exists community_posts_set_updated_at on public.community_posts;
create trigger community_posts_set_updated_at before update on public.community_posts
for each row execute function public.set_updated_at();
drop trigger if exists community_comments_set_updated_at on public.community_post_comments;
create trigger community_comments_set_updated_at before update on public.community_post_comments
for each row execute function public.set_updated_at();

create or replace function public.guard_community_post_write()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_admin boolean := (select public.is_admin());
begin
  if tg_op = 'INSERT' then
    if not v_admin and (
      new.author_id <> (select auth.uid())
      or new.is_partnership or new.is_editor_pick
      or new.creator_id is not null
      or new.like_count <> 0 or new.comment_count <> 0
      or new.status not in ('draft', 'published')
    ) then
      raise exception 'protected_community_post_fields' using errcode = '42501';
    end if;
  elsif not v_admin then
    if new.author_id <> old.author_id
      or new.post_type <> old.post_type
      or new.creator_id is distinct from old.creator_id
      or new.is_partnership <> old.is_partnership
      or new.is_editor_pick <> old.is_editor_pick
      or (pg_trigger_depth() <= 1 and new.like_count <> old.like_count)
      or (pg_trigger_depth() <= 1 and new.comment_count <> old.comment_count)
      or new.created_at <> old.created_at
      or new.published_at is distinct from old.published_at
      or (new.body is not distinct from old.body and new.edited_at is distinct from old.edited_at)
      or new.status in ('under_review', 'hidden')
    then
      raise exception 'protected_community_post_fields' using errcode = '42501';
    end if;
  end if;

  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  if new.status = 'deleted' and (tg_op = 'INSERT' or old.status is distinct from 'deleted') then
    new.deleted_at := now();
    new.purge_after := now() + interval '30 days';
  elsif tg_op = 'UPDATE' and old.status = 'deleted' and new.status <> 'deleted' then
    new.deleted_at := null;
    new.purge_after := null;
  end if;
  if tg_op = 'UPDATE' and new.body is distinct from old.body then
    new.edited_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists community_posts_guard_write on public.community_posts;
create trigger community_posts_guard_write
before insert or update on public.community_posts
for each row execute function public.guard_community_post_write();

create or replace function public.validate_community_media_owner()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if not exists (
    select 1 from public.community_posts p
    where p.id = new.post_id and p.author_id = new.owner_id
  ) then
    raise exception 'community_media_owner_mismatch' using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists community_media_validate_owner on public.community_post_media;
create trigger community_media_validate_owner before insert or update on public.community_post_media
for each row execute function public.validate_community_media_owner();

create or replace function public.validate_community_comment_parent()
returns trigger language plpgsql security invoker set search_path = '' as $$
declare v_parent_post uuid; v_parent_parent uuid;
begin
  if new.parent_id is null then return new; end if;
  select c.post_id, c.parent_id into v_parent_post, v_parent_parent
  from public.community_post_comments c where c.id = new.parent_id;
  if v_parent_post is null or v_parent_post <> new.post_id or v_parent_parent is not null then
    raise exception 'community_comment_parent_invalid' using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists community_comments_validate_parent on public.community_post_comments;
create trigger community_comments_validate_parent before insert or update
on public.community_post_comments for each row execute function public.validate_community_comment_parent();

create or replace function public.guard_community_comment_write()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and not (select public.is_admin()) then
    if new.author_id <> old.author_id
      or new.post_id <> old.post_id
      or new.parent_id is distinct from old.parent_id
      or new.created_at <> old.created_at
    then
      raise exception 'protected_community_comment_fields' using errcode = '42501';
    end if;
  end if;

  if tg_op = 'UPDATE' and new.is_deleted and not old.is_deleted then
    new.body := '[deleted]';
    new.deleted_at := now();
  elsif tg_op = 'UPDATE' and old.is_deleted and not new.is_deleted then
    raise exception 'deleted_comment_cannot_be_restored' using errcode = '42501';
  elsif tg_op = 'UPDATE' and new.body is distinct from old.body then
    new.edited_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists community_comments_guard_write on public.community_post_comments;
create trigger community_comments_guard_write before update on public.community_post_comments
for each row execute function public.guard_community_comment_write();

create or replace function public.sync_community_like_count()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.community_posts
  set like_count = (select count(*)::integer from public.community_post_likes l where l.post_id = coalesce(new.post_id, old.post_id))
  where id = coalesce(new.post_id, old.post_id);
  return coalesce(new, old);
end;
$$;
revoke all on function public.sync_community_like_count() from public, anon, authenticated;

drop trigger if exists community_likes_sync_count on public.community_post_likes;
create trigger community_likes_sync_count after insert or delete on public.community_post_likes
for each row execute function public.sync_community_like_count();

create or replace function public.sync_community_comment_count()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.community_posts
  set comment_count = (
    select count(*)::integer from public.community_post_comments c
    where c.post_id = coalesce(new.post_id, old.post_id) and not c.is_deleted
  ) where id = coalesce(new.post_id, old.post_id);
  return coalesce(new, old);
end;
$$;
revoke all on function public.sync_community_comment_count() from public, anon, authenticated;

drop trigger if exists community_comments_sync_count on public.community_post_comments;
create trigger community_comments_sync_count after insert or update or delete
on public.community_post_comments for each row execute function public.sync_community_comment_count();

create or replace function public.remove_follow_edges_after_block()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  delete from public.user_follows
  where (follower_id = new.blocker_id and followed_id = new.blocked_id)
     or (follower_id = new.blocked_id and followed_id = new.blocker_id);
  return new;
end;
$$;
revoke all on function public.remove_follow_edges_after_block() from public, anon, authenticated;

drop trigger if exists user_blocks_remove_follow_edges on public.user_blocks;
create trigger user_blocks_remove_follow_edges after insert on public.user_blocks
for each row execute function public.remove_follow_edges_after_block();

alter table public.community_creators enable row level security;
alter table public.community_posts enable row level security;
alter table public.community_post_media enable row level security;
alter table public.community_post_vehicles enable row level security;
alter table public.community_post_likes enable row level security;
alter table public.community_post_comments enable row level security;
alter table public.community_post_saves enable row level security;
alter table public.user_blocks enable row level security;
alter table public.community_reports enable row level security;

drop policy if exists "public reads published community posts" on public.community_posts;
drop policy if exists "members read visible community posts" on public.community_posts;
drop policy if exists "members create own community posts" on public.community_posts;
drop policy if exists "owners update community posts" on public.community_posts;
drop policy if exists "admins delete community posts" on public.community_posts;
drop policy if exists "public reads active creators" on public.community_creators;
drop policy if exists "admins manage creators" on public.community_creators;
drop policy if exists "read visible community media" on public.community_post_media;
drop policy if exists "owners manage community media" on public.community_post_media;
drop policy if exists "read visible linked vehicles" on public.community_post_vehicles;
drop policy if exists "owners manage linked vehicles" on public.community_post_vehicles;
drop policy if exists "read likes on visible posts" on public.community_post_likes;
drop policy if exists "members like visible posts" on public.community_post_likes;
drop policy if exists "members remove own likes" on public.community_post_likes;
drop policy if exists "read comments on visible posts" on public.community_post_comments;
drop policy if exists "members comment on visible posts" on public.community_post_comments;
drop policy if exists "authors update own comments" on public.community_post_comments;
drop policy if exists "admins delete comments" on public.community_post_comments;
drop policy if exists "members read own saves" on public.community_post_saves;
drop policy if exists "members save visible posts" on public.community_post_saves;
drop policy if exists "members remove own saves" on public.community_post_saves;
drop policy if exists "members read related blocks" on public.user_blocks;
drop policy if exists "members create own blocks" on public.user_blocks;
drop policy if exists "members remove own blocks" on public.user_blocks;
drop policy if exists "members create own reports" on public.community_reports;
drop policy if exists "members read own reports" on public.community_reports;
drop policy if exists "admins update reports" on public.community_reports;

-- Gonderi gorunurlugu: public, karsilikli takip, sahiplik, engel ve moderasyon.
create policy "public reads published community posts" on public.community_posts
for select to anon using (status = 'published' and visibility = 'public');
create policy "members read visible community posts" on public.community_posts
for select to authenticated using (
  (select public.is_admin())
  or author_id = (select auth.uid())
  or (
    status = 'published'
    and not exists (
      select 1 from public.user_blocks b
      where (b.blocker_id = (select auth.uid()) and b.blocked_id = author_id)
         or (b.blocker_id = author_id and b.blocked_id = (select auth.uid()))
    )
    and (
      visibility = 'public'
      or (
        visibility = 'friends'
        and exists (select 1 from public.user_follows f where f.follower_id = (select auth.uid()) and f.followed_id = author_id)
        and exists (select 1 from public.user_follows f where f.follower_id = author_id and f.followed_id = (select auth.uid()))
      )
    )
  )
);
create policy "members create own community posts" on public.community_posts
for insert to authenticated with check (author_id = (select auth.uid()) or (select public.is_admin()));
create policy "owners update community posts" on public.community_posts
for update to authenticated using (author_id = (select auth.uid()) or (select public.is_admin()))
with check (author_id = (select auth.uid()) or (select public.is_admin()));
create policy "admins delete community posts" on public.community_posts
for delete to authenticated using ((select public.is_admin()));

create policy "public reads active creators" on public.community_creators
for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "admins manage creators" on public.community_creators
for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Alt kaynaklar, yalnizca RLS ile gorulebilen ana gonderi uzerinden okunur.
create policy "read visible community media" on public.community_post_media
for select to anon, authenticated using (exists (select 1 from public.community_posts p where p.id = post_id));
create policy "owners manage community media" on public.community_post_media
for all to authenticated using (owner_id = (select auth.uid()) or (select public.is_admin()))
with check (owner_id = (select auth.uid()) or (select public.is_admin()));

create policy "read visible linked vehicles" on public.community_post_vehicles
for select to anon, authenticated using (exists (select 1 from public.community_posts p where p.id = post_id));
create policy "owners manage linked vehicles" on public.community_post_vehicles
for all to authenticated
using (exists (select 1 from public.community_posts p where p.id = post_id and (p.author_id = (select auth.uid()) or (select public.is_admin()))))
with check (exists (select 1 from public.community_posts p where p.id = post_id and (p.author_id = (select auth.uid()) or (select public.is_admin()))));

create policy "read likes on visible posts" on public.community_post_likes
for select to anon, authenticated using (exists (select 1 from public.community_posts p where p.id = post_id));
create policy "members like visible posts" on public.community_post_likes
for insert to authenticated with check (
  user_id = (select auth.uid())
  and exists (select 1 from public.community_posts p where p.id = post_id and p.author_id <> (select auth.uid()) and p.status = 'published')
);
create policy "members remove own likes" on public.community_post_likes
for delete to authenticated using (user_id = (select auth.uid()));

create policy "read comments on visible posts" on public.community_post_comments
for select to anon, authenticated using (exists (select 1 from public.community_posts p where p.id = post_id));
create policy "members comment on visible posts" on public.community_post_comments
for insert to authenticated with check (
  author_id = (select auth.uid())
  and not is_deleted
  and exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'published')
);
create policy "authors update own comments" on public.community_post_comments
for update to authenticated using (author_id = (select auth.uid()) or (select public.is_admin()))
with check (author_id = (select auth.uid()) or (select public.is_admin()));
create policy "admins delete comments" on public.community_post_comments
for delete to authenticated using ((select public.is_admin()));

create policy "members read own saves" on public.community_post_saves
for select to authenticated using (user_id = (select auth.uid()));
create policy "members save visible posts" on public.community_post_saves
for insert to authenticated with check (
  user_id = (select auth.uid())
  and exists (select 1 from public.community_posts p where p.id = post_id and p.status = 'published')
);
create policy "members remove own saves" on public.community_post_saves
for delete to authenticated using (user_id = (select auth.uid()));

create policy "members read related blocks" on public.user_blocks
for select to authenticated using (blocker_id = (select auth.uid()) or blocked_id = (select auth.uid()));
create policy "members create own blocks" on public.user_blocks
for insert to authenticated with check (blocker_id = (select auth.uid()));
create policy "members remove own blocks" on public.user_blocks
for delete to authenticated using (blocker_id = (select auth.uid()));

create policy "members create own reports" on public.community_reports
for insert to authenticated with check (
  reporter_id = (select auth.uid())
  and status = 'open' and reviewed_by is null and reviewed_at is null
  and (
    (post_id is not null and exists (
      select 1 from public.community_posts p
      where p.id = post_id and p.author_id <> (select auth.uid())
    ))
    or
    (comment_id is not null and exists (
      select 1 from public.community_post_comments c
      where c.id = comment_id and c.author_id <> (select auth.uid())
    ))
  )
);
create policy "members read own reports" on public.community_reports
for select to authenticated using (reporter_id = (select auth.uid()) or (select public.is_admin()));
create policy "admins update reports" on public.community_reports
for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

revoke all on table public.community_creators, public.community_posts,
  public.community_post_media, public.community_post_vehicles,
  public.community_post_likes, public.community_post_comments,
  public.community_post_saves, public.user_blocks, public.community_reports
from anon, authenticated;

grant select on public.community_creators, public.community_posts,
  public.community_post_media, public.community_post_vehicles,
  public.community_post_likes, public.community_post_comments
to anon;

grant select, insert, update, delete on public.community_creators, public.community_posts,
  public.community_post_media, public.community_post_vehicles,
  public.community_post_likes, public.community_post_comments,
  public.community_post_saves, public.user_blocks, public.community_reports
to authenticated;

-- Private bucket: dosya yolu {user_id}/{post_id}/{media_id}.webp bicimindedir.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'community-media',
  'community-media',
  false,
  104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "members upload own community media" on storage.objects;
drop policy if exists "read visible community media objects" on storage.objects;
drop policy if exists "owners update community media objects" on storage.objects;
drop policy if exists "owners delete community media objects" on storage.objects;

create policy "members upload own community media" on storage.objects
for insert to authenticated with check (
  bucket_id = 'community-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "read visible community media objects" on storage.objects
for select to anon, authenticated using (
  bucket_id = 'community-media'
  and exists (
    select 1 from public.community_post_media m
    join public.community_posts p on p.id = m.post_id
    where m.storage_path = name
  )
);
create policy "owners update community media objects" on storage.objects
for update to authenticated
using (bucket_id = 'community-media' and owner_id = (select auth.uid())::text)
with check (
  bucket_id = 'community-media'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
create policy "owners delete community media objects" on storage.objects
for delete to authenticated using (
  bucket_id = 'community-media' and owner_id = (select auth.uid())::text
);

-- Onaylanan YouTube videosu (Iwze_IhSrNo), gercek kanal kimligi ve basligi
-- oEmbed/API ile dogrulandiktan sonra yonetici akisi tarafindan eklenecek.
-- Bu sema sahte kanal veya video metadatasi eklemez.

commit;
