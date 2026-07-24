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
  reply_count integer not null default 0 check (reply_count >= 0),
  view_count integer not null default 0 check (view_count >= 0),
  last_reply_at timestamptz,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_forum_topics_feed_idx
  on public.community_forum_topics (published_at desc, id desc)
  where status = 'published';
create index if not exists community_forum_topics_category_idx
  on public.community_forum_topics (category, published_at desc, id desc)
  where status = 'published';
create index if not exists community_forum_topics_author_idx
  on public.community_forum_topics (author_id, created_at desc);

drop trigger if exists community_forum_topics_set_updated_at on public.community_forum_topics;
create trigger community_forum_topics_set_updated_at
before update on public.community_forum_topics
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
  if tg_op = 'INSERT' then
    if not v_admin and (
      new.author_id <> (select auth.uid())
      or new.reply_count <> 0
      or new.view_count <> 0
      or new.last_reply_at is not null
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

alter table public.community_forum_topics enable row level security;

drop policy if exists "public reads published forum topics" on public.community_forum_topics;
drop policy if exists "members create own forum topics" on public.community_forum_topics;
drop policy if exists "owners update forum topics" on public.community_forum_topics;

create policy "public reads published forum topics"
on public.community_forum_topics for select
to anon, authenticated
using (
  status = 'published'
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

revoke all on table public.community_forum_topics from anon, authenticated;
grant select on table public.community_forum_topics to anon, authenticated;
grant insert, update on table public.community_forum_topics to authenticated;

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
end;
$$;

commit;
