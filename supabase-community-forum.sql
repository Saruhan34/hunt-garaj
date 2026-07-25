-- Hunt Garaj: Topluluk / Forum veri modeli
-- Gereksinimler: supabase-auth.sql

begin;

create extension if not exists pgcrypto;

create table if not exists public.community_forum_topics (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in (
    'general', 'diecast', 'showcase', 'hunts',
    'stores', 'trade', 'events', 'support'
  )),
  title text not null check (char_length(trim(title)) between 8 and 120),
  body text not null check (char_length(trim(body)) between 20 and 5000),
  status text not null default 'published' check (status in ('draft', 'published', 'locked', 'hidden', 'deleted')),
  is_pinned boolean not null default false,
  is_solved boolean not null default false,
  reply_count integer not null default 0 check (reply_count >= 0),
  view_count integer not null default 0 check (view_count >= 0),
  last_reply_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.community_forum_topics
  add column if not exists is_pinned boolean not null default false,
  add column if not exists is_solved boolean not null default false;

create table if not exists public.community_forum_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.community_forum_topics(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.community_forum_replies(id) on delete set null,
  body text not null check (char_length(trim(body)) between 2 and 3000),
  status text not null default 'published' check (status in ('published', 'hidden', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_forum_media (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.community_forum_topics(id) on delete cascade,
  reply_id uuid references public.community_forum_replies(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null unique,
  position smallint not null check (position between 0 and 5),
  alt_text text check (alt_text is null or char_length(alt_text) <= 300),
  created_at timestamptz not null default now(),
  constraint community_forum_media_parent_check check (
    (topic_id is not null and reply_id is null)
    or (topic_id is null and reply_id is not null)
  )
);

create table if not exists public.community_forum_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  topic_id uuid references public.community_forum_topics(id) on delete cascade,
  reply_id uuid references public.community_forum_replies(id) on delete cascade,
  reason text not null check (reason in ('spam', 'harassment', 'misinformation', 'unsafe_trade', 'other')),
  details text check (details is null or char_length(details) between 3 and 500),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint community_forum_reports_target_check check (
    (topic_id is not null and reply_id is null)
    or (topic_id is null and reply_id is not null)
  )
);

create index if not exists community_forum_topics_feed_idx
  on public.community_forum_topics (published_at desc, id desc)
  where status = 'published';
create index if not exists community_forum_topics_category_idx
  on public.community_forum_topics (category, published_at desc, id desc)
  where status = 'published';
create index if not exists community_forum_topics_author_idx
  on public.community_forum_topics (author_id, created_at desc);
create index if not exists community_forum_topics_pinned_idx
  on public.community_forum_topics (is_pinned desc, last_reply_at desc nulls last, published_at desc)
  where status in ('published', 'locked');
create index if not exists community_forum_replies_topic_idx
  on public.community_forum_replies (topic_id, created_at asc);
create index if not exists community_forum_replies_author_idx
  on public.community_forum_replies (author_id, created_at desc);
create index if not exists community_forum_replies_parent_idx
  on public.community_forum_replies (parent_id) where parent_id is not null;
create unique index if not exists community_forum_media_topic_position_idx
  on public.community_forum_media (topic_id, position) where topic_id is not null;
create unique index if not exists community_forum_media_reply_position_idx
  on public.community_forum_media (reply_id, position) where reply_id is not null;
create index if not exists community_forum_media_owner_idx
  on public.community_forum_media (owner_id);
create unique index if not exists community_forum_reports_topic_reporter_idx
  on public.community_forum_reports (reporter_id, topic_id) where topic_id is not null;
create unique index if not exists community_forum_reports_reply_reporter_idx
  on public.community_forum_reports (reporter_id, reply_id) where reply_id is not null;
create index if not exists community_forum_reports_moderation_queue_idx
  on public.community_forum_reports (status, created_at desc);

drop trigger if exists community_forum_topics_set_updated_at on public.community_forum_topics;
create trigger community_forum_topics_set_updated_at
before update on public.community_forum_topics
for each row execute function public.set_updated_at();

drop trigger if exists community_forum_replies_set_updated_at on public.community_forum_replies;
create trigger community_forum_replies_set_updated_at
before update on public.community_forum_replies
for each row execute function public.set_updated_at();

create or replace function public.guard_community_forum_topic_write()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_admin boolean := (select public.is_admin());
begin
  -- Trusted database functions maintain counters without exposing those fields
  -- to direct client updates.
  if current_user in ('postgres', 'service_role', 'supabase_admin') then
    return new;
  end if;

  -- Reply counter updates are performed by a nested database trigger.
  if pg_trigger_depth() > 1 then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if not v_admin and (
      new.author_id <> (select auth.uid())
      or new.reply_count <> 0
      or new.view_count <> 0
      or new.last_reply_at is not null
      or new.is_pinned
      or new.is_solved
      or new.status not in ('draft', 'published')
    ) then
      raise exception 'forum_topic_insert_not_allowed' using errcode = '42501';
    end if;
    if new.status = 'published' and new.published_at is null then
      new.published_at := now();
    end if;
  elsif not v_admin then
    if new.author_id <> old.author_id
      or new.author_id <> (select auth.uid())
      or new.reply_count <> old.reply_count
      or new.view_count <> old.view_count
      or new.last_reply_at is distinct from old.last_reply_at
      or new.is_pinned is distinct from old.is_pinned
    then
      raise exception 'forum_topic_update_not_allowed' using errcode = '42501';
    end if;
    if new.status not in ('draft', 'published', 'deleted') then
      raise exception 'forum_topic_status_not_allowed' using errcode = '42501';
    end if;
    if old.status = 'deleted' and new.status <> 'deleted' then
      raise exception 'forum_topic_restore_not_allowed' using errcode = '42501';
    end if;
    if new.status = 'published' and new.published_at is null then
      new.published_at := coalesce(old.published_at, now());
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists community_forum_topics_guard_write on public.community_forum_topics;
create trigger community_forum_topics_guard_write
before insert or update on public.community_forum_topics
for each row execute function public.guard_community_forum_topic_write();

create or replace function public.guard_community_forum_reply_write()
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
      or new.status <> 'published'
    ) then
      raise exception 'forum_reply_insert_not_allowed' using errcode = '42501';
    end if;
    if new.parent_id is not null and not exists (
      select 1 from public.community_forum_replies r
      where r.id = new.parent_id and r.topic_id = new.topic_id and r.status = 'published'
    ) then
      raise exception 'forum_reply_parent_mismatch' using errcode = '23514';
    end if;
  elsif not v_admin then
    if new.author_id <> old.author_id
      or new.author_id <> (select auth.uid())
      or new.topic_id <> old.topic_id
      or new.parent_id is distinct from old.parent_id
      or new.status not in ('published', 'deleted')
    then
      raise exception 'forum_reply_update_not_allowed' using errcode = '42501';
    end if;
    if old.status = 'deleted' and new.status <> 'deleted' then
      raise exception 'forum_reply_restore_not_allowed' using errcode = '42501';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists community_forum_replies_guard_write on public.community_forum_replies;
create trigger community_forum_replies_guard_write
before insert or update on public.community_forum_replies
for each row execute function public.guard_community_forum_reply_write();

create or replace function public.guard_community_forum_media_write()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.owner_id <> (select auth.uid()) and not (select public.is_admin()) then
    raise exception 'forum_media_owner_not_allowed' using errcode = '42501';
  end if;
  if new.topic_id is not null and not exists (
    select 1 from public.community_forum_topics topic
    where topic.id = new.topic_id
      and topic.author_id = new.owner_id
      and topic.status in ('draft', 'published')
  ) then
    raise exception 'forum_media_topic_not_allowed' using errcode = '42501';
  end if;
  if new.reply_id is not null and not exists (
    select 1 from public.community_forum_replies reply
    join public.community_forum_topics topic on topic.id = reply.topic_id
    where reply.id = new.reply_id
      and reply.author_id = new.owner_id
      and reply.status = 'published'
      and topic.status = 'published'
  ) then
    raise exception 'forum_media_reply_not_allowed' using errcode = '42501';
  end if;
  if new.reply_id is not null and new.position > 2 then
    raise exception 'forum_reply_media_limit' using errcode = '23514';
  end if;
  return new;
end;
$$;

drop trigger if exists community_forum_media_guard_write on public.community_forum_media;
create trigger community_forum_media_guard_write
before insert or update on public.community_forum_media
for each row execute function public.guard_community_forum_media_write();

create or replace function public.guard_community_forum_report_write()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.reporter_id <> (select auth.uid()) then
      raise exception 'forum_report_owner_mismatch' using errcode = '42501';
    end if;
    if new.topic_id is not null and not exists (
      select 1 from public.community_forum_topics topic
      where topic.id = new.topic_id
        and topic.status in ('published', 'locked')
        and topic.author_id <> (select auth.uid())
    ) then
      raise exception 'forum_report_topic_not_allowed' using errcode = '42501';
    end if;
    if new.reply_id is not null and not exists (
      select 1
      from public.community_forum_replies reply
      join public.community_forum_topics topic on topic.id = reply.topic_id
      where reply.id = new.reply_id
        and reply.status = 'published'
        and topic.status in ('published', 'locked')
        and reply.author_id <> (select auth.uid())
    ) then
      raise exception 'forum_report_reply_not_allowed' using errcode = '42501';
    end if;
    new.status := 'open';
    new.reviewed_by := null;
    new.reviewed_at := null;
  elsif not (select public.is_admin()) then
    raise exception 'forum_report_update_not_allowed' using errcode = '42501';
  else
    new.reporter_id := old.reporter_id;
    new.topic_id := old.topic_id;
    new.reply_id := old.reply_id;
    new.reason := old.reason;
    new.details := old.details;
    new.reviewed_by := (select auth.uid());
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists community_forum_reports_guard_write on public.community_forum_reports;
create trigger community_forum_reports_guard_write
before insert or update on public.community_forum_reports
for each row execute function public.guard_community_forum_report_write();

create or replace function public.sync_community_forum_reply_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_topic_id uuid;
begin
  v_topic_id := case when tg_op = 'DELETE' then old.topic_id else new.topic_id end;

  update public.community_forum_topics topic
  set
    reply_count = stats.reply_count,
    last_reply_at = stats.last_reply_at
  from (
    select
      count(*)::integer as reply_count,
      max(reply.created_at) as last_reply_at
    from public.community_forum_replies reply
    where reply.topic_id = v_topic_id
      and reply.status = 'published'
  ) stats
  where topic.id = v_topic_id;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists community_forum_replies_sync_count on public.community_forum_replies;
create trigger community_forum_replies_sync_count
after insert or update of status or delete on public.community_forum_replies
for each row execute function public.sync_community_forum_reply_count();

create or replace function public.increment_community_forum_topic_view(p_topic_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  update public.community_forum_topics
  set view_count = view_count + 1
  where id = p_topic_id
    and status in ('published', 'locked')
  returning view_count into v_count;

  return v_count;
end;
$$;

alter table public.community_forum_topics enable row level security;
alter table public.community_forum_replies enable row level security;
alter table public.community_forum_media enable row level security;
alter table public.community_forum_reports enable row level security;

drop policy if exists "public reads published forum topics" on public.community_forum_topics;
drop policy if exists "members create own forum topics" on public.community_forum_topics;
drop policy if exists "owners update forum topics" on public.community_forum_topics;

create policy "public reads published forum topics"
on public.community_forum_topics for select
to anon, authenticated
using (
  status in ('published', 'locked')
  or author_id = (select auth.uid())
  or (select public.is_admin())
);

create policy "members create own forum topics"
on public.community_forum_topics for insert
to authenticated
with check (author_id = (select auth.uid()) or (select public.is_admin()));

create policy "owners update forum topics"
on public.community_forum_topics for update
to authenticated
using (author_id = (select auth.uid()) or (select public.is_admin()))
with check (author_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "public reads published forum replies" on public.community_forum_replies;
drop policy if exists "members create own forum replies" on public.community_forum_replies;
drop policy if exists "owners update forum replies" on public.community_forum_replies;

create policy "public reads published forum replies"
on public.community_forum_replies for select
to anon, authenticated
using (
  status = 'published'
  or author_id = (select auth.uid())
  or (select public.is_admin())
);

create policy "members create own forum replies"
on public.community_forum_replies for insert
to authenticated
with check (
  author_id = (select auth.uid())
  and exists (
    select 1 from public.community_forum_topics t
    where t.id = topic_id and t.status = 'published'
  )
);

create policy "owners update forum replies"
on public.community_forum_replies for update
to authenticated
using (author_id = (select auth.uid()) or (select public.is_admin()))
with check (author_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "public reads visible forum media" on public.community_forum_media;
drop policy if exists "owners create forum media" on public.community_forum_media;
drop policy if exists "owners delete forum media" on public.community_forum_media;

create policy "public reads visible forum media"
on public.community_forum_media for select
to anon, authenticated
using (
  (
    topic_id is not null
    and exists (
      select 1 from public.community_forum_topics topic
      where topic.id = topic_id
        and (topic.status in ('published', 'locked') or topic.author_id = (select auth.uid()) or (select public.is_admin()))
    )
  )
  or (
    reply_id is not null
    and exists (
      select 1
      from public.community_forum_replies reply
      join public.community_forum_topics topic on topic.id = reply.topic_id
      where reply.id = reply_id
        and (reply.status = 'published' or reply.author_id = (select auth.uid()) or (select public.is_admin()))
        and (topic.status in ('published', 'locked') or topic.author_id = (select auth.uid()) or (select public.is_admin()))
    )
  )
);

create policy "owners create forum media"
on public.community_forum_media for insert
to authenticated
with check (owner_id = (select auth.uid()) or (select public.is_admin()));

create policy "owners delete forum media"
on public.community_forum_media for delete
to authenticated
using (owner_id = (select auth.uid()) or (select public.is_admin()));

drop policy if exists "reporters read own forum reports" on public.community_forum_reports;
drop policy if exists "members create forum reports" on public.community_forum_reports;
drop policy if exists "admins manage forum reports" on public.community_forum_reports;

create policy "reporters read own forum reports"
on public.community_forum_reports for select
to authenticated
using (reporter_id = (select auth.uid()) or (select public.is_admin()));

create policy "members create forum reports"
on public.community_forum_reports for insert
to authenticated
with check (reporter_id = (select auth.uid()));

create policy "admins manage forum reports"
on public.community_forum_reports for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

revoke all on table public.community_forum_topics, public.community_forum_replies, public.community_forum_media, public.community_forum_reports from anon, authenticated;
grant select on table public.community_forum_topics, public.community_forum_replies, public.community_forum_media to anon, authenticated;
grant select, insert on table public.community_forum_reports to authenticated;
grant update on table public.community_forum_reports to authenticated;
grant insert, update on table public.community_forum_topics, public.community_forum_replies to authenticated;
grant insert, delete on table public.community_forum_media to authenticated;

drop policy if exists "read visible forum media objects" on storage.objects;
create policy "read visible forum media objects"
on storage.objects for select
to anon, authenticated
using (
  bucket_id = 'community-media'
  and exists (
    select 1
    from public.community_forum_media media
    where media.storage_path = name
  )
);

revoke all on function public.increment_community_forum_topic_view(uuid) from public;
grant execute on function public.increment_community_forum_topic_view(uuid) to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'community_forum_topics'
  ) then
    alter publication supabase_realtime add table public.community_forum_topics;
  end if;
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'community_forum_replies'
  ) then
    alter publication supabase_realtime add table public.community_forum_replies;
  end if;
end;
$$;

commit;
