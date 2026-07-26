-- Hunt Garaj: topluluk sohbeti emoji tepkileri
-- Gereksinimler: supabase-auth.sql, supabase-community-chat.sql

begin;

create table if not exists public.community_chat_reactions (
  message_id uuid not null references public.community_chat_messages(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null check (emoji in ('🔥', '❤️', '👍', '😂', '😮')),
  created_at timestamptz not null default now(),
  primary key (message_id, user_id, emoji)
);

create index if not exists community_chat_reactions_user_idx
  on public.community_chat_reactions (user_id);

alter table public.community_chat_reactions enable row level security;

drop policy if exists "public reads chat reactions" on public.community_chat_reactions;
drop policy if exists "members create own chat reactions" on public.community_chat_reactions;
drop policy if exists "members delete own chat reactions" on public.community_chat_reactions;

create policy "public reads chat reactions"
on public.community_chat_reactions for select
to anon, authenticated
using (true);

create policy "members create own chat reactions"
on public.community_chat_reactions for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.community_chat_messages message
    where message.id = message_id
      and message.status = 'published'
  )
);

create policy "members delete own chat reactions"
on public.community_chat_reactions for delete
to authenticated
using (user_id = (select auth.uid()));

revoke all on table public.community_chat_reactions from anon, authenticated;
grant select on table public.community_chat_reactions to anon;
grant select, insert, delete on table public.community_chat_reactions to authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'community_chat_reactions'
  ) then
    alter publication supabase_realtime add table public.community_chat_reactions;
  end if;
end;
$$;

commit;

select
  to_regclass('public.community_chat_reactions') as reactions_table,
  c.relrowsecurity as rls_enabled,
  count(distinct policyname) as policy_count,
  exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'community_chat_reactions'
  ) as realtime_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
left join pg_policies p on p.schemaname = n.nspname and p.tablename = c.relname
where n.nspname = 'public'
  and c.relname = 'community_chat_reactions'
group by c.relrowsecurity;
