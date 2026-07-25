-- Hunt Garaj: gerçek zamanlı topluluk sohbeti
-- Gereksinimler: supabase-auth.sql

begin;

create extension if not exists pgcrypto;

create table if not exists public.community_chat_messages (
  id uuid primary key default gen_random_uuid(),
  room text not null check (room in ('İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Diğer')),
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.community_chat_messages(id) on delete set null,
  body text not null check (char_length(btrim(body)) between 1 and 500),
  status text not null default 'published' check (status in ('published', 'deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_chat_messages_room_created_idx
  on public.community_chat_messages (room, created_at desc)
  where status = 'published';
create index if not exists community_chat_messages_author_idx
  on public.community_chat_messages (author_id, created_at desc);
create index if not exists community_chat_messages_parent_idx
  on public.community_chat_messages (parent_id)
  where parent_id is not null;

drop trigger if exists community_chat_messages_set_updated_at on public.community_chat_messages;
create trigger community_chat_messages_set_updated_at
before update on public.community_chat_messages
for each row execute function public.set_updated_at();

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
    new.body := btrim(new.body);
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
    new.body := btrim(new.body);
  end if;
  return new;
end;
$$;

drop trigger if exists community_chat_messages_guard_write on public.community_chat_messages;
create trigger community_chat_messages_guard_write
before insert or update on public.community_chat_messages
for each row execute function public.guard_community_chat_message_write();

alter table public.community_chat_messages enable row level security;

drop policy if exists "public reads published chat messages" on public.community_chat_messages;
drop policy if exists "members create own chat messages" on public.community_chat_messages;
drop policy if exists "owners update chat messages" on public.community_chat_messages;

create policy "public reads published chat messages"
on public.community_chat_messages for select
to anon, authenticated
using (
  status = 'published'
  or author_id = (select auth.uid())
  or (select public.is_admin())
);

create policy "members create own chat messages"
on public.community_chat_messages for insert
to authenticated
with check (author_id = (select auth.uid()) or (select public.is_admin()));

create policy "owners update chat messages"
on public.community_chat_messages for update
to authenticated
using (author_id = (select auth.uid()) or (select public.is_admin()))
with check (author_id = (select auth.uid()) or (select public.is_admin()));

revoke all on table public.community_chat_messages from anon, authenticated;
grant select on table public.community_chat_messages to anon, authenticated;
grant insert, update on table public.community_chat_messages to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'community_chat_messages'
  ) then
    alter publication supabase_realtime add table public.community_chat_messages;
  end if;
end;
$$;

commit;
