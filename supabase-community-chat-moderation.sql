-- Hunt Garaj: topluluk sohbeti moderasyonu
-- Gereksinimler: supabase-auth.sql, supabase-community-chat.sql

begin;

create table if not exists public.community_chat_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  message_id uuid not null references public.community_chat_messages(id) on delete cascade,
  reason text not null check (reason in ('spam', 'harassment', 'misinformation', 'unsafe_trade', 'other')),
  details text check (details is null or char_length(details) between 3 and 500),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (reporter_id, message_id)
);

create table if not exists public.community_chat_blocks (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

create index if not exists community_chat_reports_message_idx
  on public.community_chat_reports (message_id);
create index if not exists community_chat_reports_moderation_queue_idx
  on public.community_chat_reports (status, created_at desc);
create index if not exists community_chat_blocks_blocked_idx
  on public.community_chat_blocks (blocked_id);

create or replace function public.guard_community_chat_report_write()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    if new.reporter_id <> (select auth.uid()) then
      raise exception 'community_chat_report_owner_mismatch' using errcode = '42501';
    end if;
    if not exists (
      select 1
      from public.community_chat_messages message
      where message.id = new.message_id
        and message.status = 'published'
        and message.author_id <> (select auth.uid())
    ) then
      raise exception 'community_chat_report_not_allowed' using errcode = '42501';
    end if;
    new.status := 'open';
    new.reviewed_by := null;
    new.reviewed_at := null;
  elsif not (select public.is_admin()) then
    raise exception 'community_chat_report_update_not_allowed' using errcode = '42501';
  else
    new.reporter_id := old.reporter_id;
    new.message_id := old.message_id;
    new.reason := old.reason;
    new.details := old.details;
    new.reviewed_by := (select auth.uid());
    new.reviewed_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists community_chat_reports_guard_write on public.community_chat_reports;
create trigger community_chat_reports_guard_write
before insert or update on public.community_chat_reports
for each row execute function public.guard_community_chat_report_write();

create or replace function public.guard_community_chat_message_write()
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
      raise exception 'community_chat_insert_not_allowed' using errcode = '42501';
    end if;

    if not v_admin then
      perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(new.author_id::text, 7342)
      );
      if (
        select count(*) >= 5
        from public.community_chat_messages recent
        where recent.author_id = new.author_id
          and recent.created_at > pg_catalog.now() - interval '10 seconds'
      ) then
        raise exception 'community_chat_rate_limit' using errcode = 'P0001';
      end if;
      if exists (
        select 1
        from public.community_chat_messages recent
        where recent.author_id = new.author_id
          and recent.body = pg_catalog.btrim(new.body)
          and recent.created_at > pg_catalog.now() - interval '20 seconds'
      ) then
        raise exception 'community_chat_duplicate_message' using errcode = 'P0001';
      end if;
    end if;

    new.body := pg_catalog.btrim(new.body);
    if new.parent_id is not null and not exists (
      select 1
      from public.community_chat_messages parent
      where parent.id = new.parent_id
        and parent.room = new.room
        and parent.status = 'published'
    ) then
      raise exception 'community_chat_parent_mismatch' using errcode = '23514';
    end if;
  elsif not v_admin then
    if new.author_id <> old.author_id
      or new.author_id <> (select auth.uid())
      or new.room <> old.room
      or new.parent_id is distinct from old.parent_id
      or new.status not in ('published', 'deleted')
    then
      raise exception 'community_chat_update_not_allowed' using errcode = '42501';
    end if;
    if old.status = 'deleted' and new.status <> 'deleted' then
      raise exception 'community_chat_restore_not_allowed' using errcode = '42501';
    end if;
    new.body := pg_catalog.btrim(new.body);
  end if;
  return new;
end;
$$;

alter table public.community_chat_reports enable row level security;
alter table public.community_chat_blocks enable row level security;

drop policy if exists "reporters read own chat reports" on public.community_chat_reports;
drop policy if exists "members create chat reports" on public.community_chat_reports;
drop policy if exists "admins manage chat reports" on public.community_chat_reports;

create policy "reporters read own chat reports"
on public.community_chat_reports for select
to authenticated
using (reporter_id = (select auth.uid()) or (select public.is_admin()));

create policy "members create chat reports"
on public.community_chat_reports for insert
to authenticated
with check (reporter_id = (select auth.uid()));

create policy "admins manage chat reports"
on public.community_chat_reports for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "members read own chat blocks" on public.community_chat_blocks;
drop policy if exists "members create own chat blocks" on public.community_chat_blocks;
drop policy if exists "members delete own chat blocks" on public.community_chat_blocks;

create policy "members read own chat blocks"
on public.community_chat_blocks for select
to authenticated
using (blocker_id = (select auth.uid()) or (select public.is_admin()));

create policy "members create own chat blocks"
on public.community_chat_blocks for insert
to authenticated
with check (
  blocker_id = (select auth.uid())
  and blocked_id <> (select auth.uid())
);

create policy "members delete own chat blocks"
on public.community_chat_blocks for delete
to authenticated
using (blocker_id = (select auth.uid()) or (select public.is_admin()));

revoke all on table public.community_chat_reports, public.community_chat_blocks from anon, authenticated;
grant select, insert, update on table public.community_chat_reports to authenticated;
grant select, insert, delete on table public.community_chat_blocks to authenticated;

commit;

select
  to_regclass('public.community_chat_reports') as reports_table,
  to_regclass('public.community_chat_blocks') as blocks_table,
  count(*) filter (where policyname like '%chat report%') as report_policies,
  count(*) filter (where policyname like '%chat block%') as block_policies
from pg_policies
where schemaname = 'public'
  and tablename in ('community_chat_reports', 'community_chat_blocks');
