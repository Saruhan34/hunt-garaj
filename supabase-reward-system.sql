-- Hunt Radar secure Reward / Rank / Verification system
-- Run after supabase-auth.sql and supabase-content-ownership.sql.

create table if not exists public.reward_settings (
  key text primary key default 'default',
  value jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

insert into public.reward_settings (key, value)
values ('default', '{
  "daily_limit": 150,
  "store_cooldown_minutes": 60,
  "verification_threshold": 3,
  "wrong_threshold": 3,
  "ranks": [
    {"id":"r1","title":"R1 Çaylak Avcı","min":0},
    {"id":"r2","title":"R2 Raf Takipçisi","min":250},
    {"id":"r3","title":"R3 Hunt Muhbiri","min":750},
    {"id":"r4","title":"R4 Premium Avcı","min":1750},
    {"id":"th","title":"TH Dedektifi","min":3500},
    {"id":"sth","title":"STH Efsanesi","min":7500},
    {"id":"hr","title":"HR Garaj Ustası","min":15000}
  ]
}'::jsonb)
on conflict (key) do update set value = excluded.value;

create table if not exists public.reward_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  points integer not null,
  target_key text not null default '',
  dedupe_key text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reward_action_rules (
  event_type text primary key,
  label text not null,
  points integer not null default 0,
  seller_points integer not null default 0,
  cooldown_minutes integer not null default 0 check (cooldown_minutes >= 0),
  once_per_target boolean not null default true,
  tone text,
  visual text,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.reward_action_rules(event_type,label,points,seller_points,cooldown_minutes,once_per_target,tone,visual) values
('radar_photo','Fotoğraflı radar bildirimi',20,0,60,true,'red','camera-proof'),
('radar_text','Fotoğrafsız radar bildirimi',5,0,60,true,'silver','verified-radar'),
('radar_premium','Premium araç bildirimi',25,0,60,true,'gold','premium-flame'),
('radar_th','TH bildirimi',40,0,120,true,'teal','th-radar'),
('radar_sth','STH bildirimi',75,0,180,true,'red','th-radar'),
('radar_empty','Boş raf bildirimi',10,0,60,true,'silver','empty-shelf'),
('radar_verified_bonus','Topluluk tarafından doğrulandı',35,0,0,true,'gold','verified-radar'),
('radar_false_penalty','Yanlış bilgi cezası',-30,0,0,true,'red','wrong-alert'),
('radar_spam_penalty','Spam / tekrar bilgi',-10,0,0,true,'red','wrong-alert'),
('vote_correct','Doğru doğrulama katkısı',5,0,0,true,'teal','verified-radar'),
('vote_gone','Artık kalmadı katkısı',5,0,0,true,'silver','empty-shelf'),
('vote_wrong','Yanlış bilgi raporu',8,0,0,true,'red','wrong-alert'),
('garage_created','Garaja araç ekleme',3,0,2,true,'teal','garage-car'),
('listing_created','İlan ekleme',5,0,5,true,'gold','listing-card'),
('deal_completed','Satış / takas tamamlandı',20,0,0,true,'teal','deal-handshake'),
('seller_positive_review','Olumlu satıcı yorumu',0,25,0,true,'gold','seller-star'),
('helpful_forum','Faydalı topluluk katkısı',5,0,10,true,'teal','forum-guide')
on conflict (event_type) do update set
  label=excluded.label, points=excluded.points, seller_points=excluded.seller_points,
  cooldown_minutes=excluded.cooldown_minutes, once_per_target=excluded.once_per_target,
  tone=excluded.tone, visual=excluded.visual;

create unique index if not exists reward_events_dedupe_idx
on public.reward_events(user_id, dedupe_key)
where dedupe_key is not null and dedupe_key <> '';

create index if not exists reward_events_user_date_idx
on public.reward_events(user_id, created_at desc);

create table if not exists public.user_rewards (
  user_id uuid primary key references auth.users(id) on delete cascade,
  radar_points integer not null default 0 check (radar_points >= 0),
  seller_score integer not null default 0 check (seller_score >= 0),
  verification_score integer not null default 0 check (verification_score >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_report_votes (
  id uuid primary key default gen_random_uuid(),
  store_report_id text not null,
  report_owner_id uuid not null references auth.users(id) on delete cascade,
  voter_id uuid not null references auth.users(id) on delete cascade,
  vote text not null check (vote in ('correct', 'gone', 'wrong')),
  rewarded boolean not null default false,
  created_at timestamptz not null default now(),
  unique(store_report_id, voter_id),
  check (report_owner_id <> voter_id)
);

create table if not exists public.store_report_states (
  store_report_id text primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','verified','expired','disputed')),
  correct_count integer not null default 0,
  gone_count integer not null default 0,
  wrong_count integer not null default 0,
  expires_at timestamptz not null default (now() + interval '8 hours'),
  last_activity_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.store_report_states add column if not exists status text not null default 'pending';
alter table public.store_report_states add column if not exists correct_count integer not null default 0;
alter table public.store_report_states add column if not exists gone_count integer not null default 0;
alter table public.store_report_states add column if not exists wrong_count integer not null default 0;
alter table public.store_report_states add column if not exists expires_at timestamptz not null default (now() + interval '8 hours');
alter table public.store_report_states add column if not exists last_activity_at timestamptz not null default now();
alter table public.store_report_states add column if not exists updated_at timestamptz not null default now();

create table if not exists public.reward_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  points integer,
  event_type text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.badges (
  id text primary key,
  title text not null,
  description text not null default '',
  requirement jsonb not null default '{}'::jsonb,
  visual text,
  tone text,
  enabled boolean not null default true
);

create table if not exists public.user_badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.reward_settings enable row level security;
alter table public.reward_action_rules enable row level security;
alter table public.reward_events enable row level security;
alter table public.user_rewards enable row level security;
alter table public.store_report_votes enable row level security;
alter table public.store_report_states enable row level security;
alter table public.reward_notifications enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

drop policy if exists "reward settings readable" on public.reward_settings;
create policy "reward settings readable" on public.reward_settings for select to anon, authenticated using (true);
drop policy if exists "admins manage reward settings" on public.reward_settings;
create policy "admins manage reward settings" on public.reward_settings for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reward action rules readable" on public.reward_action_rules;
create policy "reward action rules readable" on public.reward_action_rules for select to anon, authenticated using (enabled);
drop policy if exists "admins manage reward action rules" on public.reward_action_rules;
create policy "admins manage reward action rules" on public.reward_action_rules for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "reward events public readable" on public.reward_events;
create policy "reward events public readable" on public.reward_events for select to authenticated using (true);
-- No insert/update/delete policy: clients cannot manufacture or alter points.

drop policy if exists "user rewards public readable" on public.user_rewards;
create policy "user rewards public readable" on public.user_rewards for select to authenticated using (true);

drop policy if exists "votes readable" on public.store_report_votes;
-- Raw votes are private. Public summaries are exposed by a security-definer RPC.

drop policy if exists "store report states readable" on public.store_report_states;
-- State rows include owner IDs. Clients only receive the safe projection from get_store_report_summaries().

drop policy if exists "users read own reward notifications" on public.reward_notifications;
create policy "users read own reward notifications" on public.reward_notifications
for select to authenticated using (auth.uid() = user_id);
drop policy if exists "users update own reward notifications" on public.reward_notifications;
create policy "users update own reward notifications" on public.reward_notifications
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "badges readable" on public.badges;
create policy "badges readable" on public.badges for select to anon, authenticated using (enabled);
drop policy if exists "admins manage badges" on public.badges;
create policy "admins manage badges" on public.badges for all to authenticated
using (public.is_admin()) with check (public.is_admin());

drop policy if exists "user badges readable" on public.user_badges;
create policy "user badges readable" on public.user_badges for select to authenticated using (true);

create or replace function public.reward_rule(p_event_type text)
returns table(points integer, seller_points integer, cooldown_minutes integer, once_per_target boolean)
language sql stable
security definer
set search_path = public
as $$
  select points, seller_points, cooldown_minutes, once_per_target
  from public.reward_action_rules
  where event_type = p_event_type and enabled;
$$;

create or replace function public.sync_store_report_state()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.content_type = 'stores' then
    insert into public.store_report_states(store_report_id, owner_id, expires_at, last_activity_at)
    values (new.id, new.owner_id, coalesce(new.created_at, now()) + interval '8 hours', coalesce(new.updated_at, now()))
    on conflict (store_report_id) do update set
      owner_id = excluded.owner_id,
      last_activity_at = greatest(public.store_report_states.last_activity_at, excluded.last_activity_at);
  end if;
  return new;
end;
$$;

drop trigger if exists content_records_sync_store_state on public.content_records;
create trigger content_records_sync_store_state
after insert or update on public.content_records
for each row execute function public.sync_store_report_state();

insert into public.store_report_states(store_report_id, owner_id, expires_at, last_activity_at)
select id, owner_id, created_at + interval '8 hours', updated_at
from public.content_records
where content_type = 'stores'
on conflict (store_report_id) do nothing;

create or replace function public.get_store_report_summaries()
returns table(
  store_report_id text,
  status text,
  correct_count integer,
  gone_count integer,
  wrong_count integer,
  total_votes integer,
  current_vote text,
  expires_at timestamptz,
  last_activity_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  with reports as (
    select
      c.id as store_report_id,
      c.created_at + interval '8 hours' as expires_at,
      c.updated_at
    from public.content_records c
    where c.content_type = 'stores'
  ),
  vote_counts as (
    select
      v.store_report_id,
      count(*) filter (where v.vote = 'correct')::integer as correct_count,
      count(*) filter (where v.vote = 'gone')::integer as gone_count,
      count(*) filter (where v.vote = 'wrong')::integer as wrong_count,
      max(v.created_at) as last_vote_at
    from public.store_report_votes v
    group by v.store_report_id
  )
  select
    r.store_report_id,
    case
      when coalesce(vc.wrong_count, 0) >= 3
        and coalesce(vc.wrong_count, 0) >= coalesce(vc.correct_count, 0)
        and coalesce(vc.wrong_count, 0) >= coalesce(vc.gone_count, 0)
        then 'disputed'
      when coalesce(vc.gone_count, 0) >= 3
        and coalesce(vc.gone_count, 0) >= coalesce(vc.correct_count, 0)
        then 'expired'
      when coalesce(vc.correct_count, 0) >= 3
        then 'verified'
      when r.expires_at <= now()
        then 'expired'
      else 'pending'
    end as status,
    coalesce(vc.correct_count, 0)::integer,
    coalesce(vc.gone_count, 0)::integer,
    coalesce(vc.wrong_count, 0)::integer,
    (
      coalesce(vc.correct_count, 0)
      + coalesce(vc.gone_count, 0)
      + coalesce(vc.wrong_count, 0)
    )::integer as total_votes,
    (
      select v.vote
      from public.store_report_votes v
      where v.store_report_id = r.store_report_id
        and v.voter_id = auth.uid()
      limit 1
    ) as current_vote,
    r.expires_at,
    greatest(r.updated_at, coalesce(vc.last_vote_at, r.updated_at)) as last_activity_at
  from reports r
  left join vote_counts vc on vc.store_report_id = r.store_report_id;
$$;

create or replace function public.apply_reward_event(
  p_user_id uuid,
  p_event_type text,
  p_target_key text default '',
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_rule record;
  v_daily_limit integer := 150;
  v_today_positive integer := 0;
  v_points integer;
  v_dedupe text;
  v_event_id uuid;
begin
  select * into v_rule from public.reward_rule(p_event_type);
  if not found then return jsonb_build_object('awarded', false, 'reason', 'unknown_rule', 'points', 0); end if;

  select coalesce((value->>'daily_limit')::integer, 150) into v_daily_limit
  from public.reward_settings where key = 'default';

  v_dedupe := case when v_rule.once_per_target and coalesce(p_target_key, '') <> ''
    then p_event_type || ':' || p_target_key else null end;

  if v_dedupe is not null and exists (
    select 1 from public.reward_events where user_id = p_user_id and dedupe_key = v_dedupe
  ) then
    return jsonb_build_object('awarded', false, 'reason', 'duplicate', 'points', 0);
  end if;

  if v_rule.cooldown_minutes > 0 and exists (
    select 1 from public.reward_events
    where user_id = p_user_id and event_type = p_event_type
      and created_at > now() - make_interval(mins => v_rule.cooldown_minutes)
  ) then
    return jsonb_build_object('awarded', false, 'reason', 'cooldown', 'points', 0);
  end if;

  if p_event_type like 'radar_%' and p_event_type not in ('radar_verified_bonus','radar_false_penalty','radar_spam_penalty')
     and coalesce(p_meta->>'storeKey', '') <> ''
     and exists (
       select 1 from public.reward_events
       where user_id = p_user_id
         and event_type like 'radar_%'
         and meta->>'storeKey' = p_meta->>'storeKey'
         and created_at > now() - interval '60 minutes'
     ) then
    return jsonb_build_object('awarded', false, 'reason', 'store_cooldown', 'points', 0);
  end if;

  select coalesce(sum(greatest(points, 0)), 0) into v_today_positive
  from public.reward_events
  where user_id = p_user_id and created_at >= date_trunc('day', now());

  v_points := v_rule.points;
  if v_points > 0 then
    v_points := greatest(0, least(v_points, v_daily_limit - v_today_positive));
    if v_points = 0 then return jsonb_build_object('awarded', false, 'reason', 'daily_limit', 'points', 0); end if;
  end if;

  insert into public.reward_events(user_id, event_type, points, target_key, dedupe_key, meta)
  values (p_user_id, p_event_type, v_points, coalesce(p_target_key, ''), v_dedupe, p_meta)
  returning id into v_event_id;

  insert into public.user_rewards(user_id, radar_points, seller_score, verification_score)
  values (
    p_user_id,
    greatest(v_points, 0),
    greatest(v_rule.seller_points, 0),
    case when p_event_type in ('vote_correct','vote_gone','vote_wrong') then 1 else 0 end
  )
  on conflict (user_id) do update set
    radar_points = greatest(0, public.user_rewards.radar_points + v_points),
    seller_score = greatest(0, public.user_rewards.seller_score + v_rule.seller_points),
    verification_score = greatest(0, public.user_rewards.verification_score +
      case when p_event_type in ('vote_correct','vote_gone','vote_wrong') then 1 else 0 end),
    updated_at = now();

  insert into public.reward_notifications(user_id, title, body, points, event_type)
  values (
    p_user_id,
    case when v_points >= 0 then 'Radar Puanı kazandın' else 'Radar Puanı düzeltildi' end,
    p_event_type,
    v_points,
    p_event_type
  );

  return jsonb_build_object('awarded', true, 'reason', 'awarded', 'points', v_points, 'event_id', v_event_id);
exception
  when unique_violation then
    return jsonb_build_object('awarded', false, 'reason', 'duplicate', 'points', 0);
end;
$$;

create or replace function public.award_reward_event(
  p_event_type text,
  p_target_key text default '',
  p_meta jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record record;
  v_status text;
  v_confidence text;
  v_expected text;
begin
  if auth.uid() is null then raise exception 'login_required'; end if;

  if p_event_type like 'radar_%'
     and p_event_type not in ('radar_verified_bonus','radar_false_penalty','radar_spam_penalty') then
    select owner_id, content_type, data into v_record
    from public.content_records where id = p_target_key;
    if v_record.owner_id is distinct from auth.uid() or v_record.content_type <> 'stores' then
      return jsonb_build_object('awarded', false, 'reason', 'invalid_target');
    end if;
    v_status := lower(coalesce(v_record.data->>'status', ''));
    v_confidence := lower(coalesce(v_record.data->>'confidence', ''));
    v_expected := case
      when v_status like '%sth%' then 'radar_sth'
      when v_status ~ '(^|[^a-z])th([^a-z]|$)' then 'radar_th'
      when v_status like '%premium%' then 'radar_premium'
      when v_status like '%boş%' or lower(coalesce(v_record.data->>'models','')) like '%boş%' then 'radar_empty'
      when v_confidence like '%foto%' then 'radar_photo'
      else 'radar_text'
    end;
    if p_event_type <> v_expected then
      return jsonb_build_object('awarded', false, 'reason', 'invalid_event_type');
    end if;
  elsif p_event_type = 'garage_created' then
    select owner_id, content_type into v_record from public.content_records where id = p_target_key;
    if v_record.owner_id is distinct from auth.uid() or v_record.content_type <> 'collection' then
      return jsonb_build_object('awarded', false, 'reason', 'invalid_target');
    end if;
  elsif p_event_type = 'listing_created' then
    select owner_id, content_type, data into v_record from public.content_records where id = p_target_key;
    if v_record.owner_id is distinct from auth.uid()
       or v_record.content_type not in ('market','collection')
       or coalesce(v_record.data->>'marketType','') not in ('Satılık','Takaslık') then
      return jsonb_build_object('awarded', false, 'reason', 'invalid_target');
    end if;
  elsif p_event_type = 'deal_completed' then
    select owner_id, content_type, data into v_record from public.content_records where id = p_target_key;
    if v_record.owner_id is distinct from auth.uid()
       or v_record.content_type not in ('market','collection')
       or coalesce(v_record.data->>'listingStatus','') not in ('Satıldı','Takaslandı') then
      return jsonb_build_object('awarded', false, 'reason', 'invalid_target');
    end if;
  elsif p_event_type = 'helpful_forum' then
    select owner_id, content_type into v_record from public.content_records where id = split_part(p_target_key, ':', 1);
    if v_record.owner_id is distinct from auth.uid() or v_record.content_type <> 'comments' then
      return jsonb_build_object('awarded', false, 'reason', 'invalid_target');
    end if;
  elsif p_event_type in ('radar_verified_bonus','radar_false_penalty','radar_spam_penalty','vote_correct','vote_gone','vote_wrong') then
    return jsonb_build_object('awarded', false, 'reason', 'server_only');
  end if;

  return public.apply_reward_event(auth.uid(), p_event_type, p_target_key, p_meta);
end;
$$;

create or replace function public.vote_store_report(
  p_store_report_id text,
  p_vote text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_owner uuid;
  v_counts record;
  v_consensus text;
  v_vote record;
  v_state_status text;
  v_expires_at timestamptz;
begin
  if auth.uid() is null then raise exception 'login_required'; end if;
  if p_vote not in ('correct','gone','wrong') then raise exception 'invalid_vote'; end if;

  select owner_id into v_owner
  from public.content_records
  where id = p_store_report_id and content_type = 'stores';

  if v_owner is null then raise exception 'report_not_found'; end if;
  if v_owner = auth.uid() then
    return jsonb_build_object('awarded', false, 'reason', 'self_vote');
  end if;

  insert into public.store_report_states(store_report_id, owner_id, expires_at, last_activity_at)
  select id, owner_id, created_at + interval '8 hours', updated_at
  from public.content_records
  where id = p_store_report_id and content_type = 'stores'
  on conflict (store_report_id) do nothing;

  select s.status, s.expires_at
  into v_state_status, v_expires_at
  from public.store_report_states s
  where s.store_report_id = p_store_report_id
  for update;

  if v_expires_at <= now() and v_state_status = 'pending' then
    update public.store_report_states
    set status = 'expired', updated_at = now()
    where store_report_id = p_store_report_id;
    return jsonb_build_object('awarded', false, 'reason', 'expired');
  end if;

  if v_state_status <> 'pending' then
    return jsonb_build_object('awarded', false, 'reason', 'closed', 'status', v_state_status);
  end if;

  insert into public.store_report_votes(store_report_id, report_owner_id, voter_id, vote)
  values (p_store_report_id, v_owner, auth.uid(), p_vote)
  on conflict (store_report_id, voter_id) do nothing;

  if not found then return jsonb_build_object('awarded', false, 'reason', 'duplicate'); end if;

  select
    count(*) filter (where vote = 'correct') as correct_count,
    count(*) filter (where vote = 'gone') as gone_count,
    count(*) filter (where vote = 'wrong') as wrong_count
  into v_counts
  from public.store_report_votes where store_report_id = p_store_report_id;

  v_consensus := case
    when v_counts.wrong_count >= 3 and v_counts.wrong_count >= v_counts.correct_count and v_counts.wrong_count >= v_counts.gone_count then 'wrong'
    when v_counts.gone_count >= 3 and v_counts.gone_count >= v_counts.correct_count then 'gone'
    when v_counts.correct_count >= 3 then 'correct'
    else null
  end;

  insert into public.store_report_states(
    store_report_id, owner_id, status, correct_count, gone_count, wrong_count, last_activity_at, updated_at
  )
  values (
    p_store_report_id,
    v_owner,
    case v_consensus when 'correct' then 'verified' when 'gone' then 'expired' when 'wrong' then 'disputed' else 'pending' end,
    v_counts.correct_count,
    v_counts.gone_count,
    v_counts.wrong_count,
    now(),
    now()
  )
  on conflict (store_report_id) do update set
    status = case
      when excluded.status <> 'pending' then excluded.status
      when public.store_report_states.expires_at <= now() then 'expired'
      else public.store_report_states.status
    end,
    correct_count = excluded.correct_count,
    gone_count = excluded.gone_count,
    wrong_count = excluded.wrong_count,
    last_activity_at = now(),
    updated_at = now();

  if v_consensus is not null then
    for v_vote in
      select id, voter_id, vote from public.store_report_votes
      where store_report_id = p_store_report_id and rewarded = false and vote = v_consensus
    loop
      perform public.apply_reward_event(
        v_vote.voter_id,
        case v_vote.vote when 'correct' then 'vote_correct' when 'gone' then 'vote_gone' else 'vote_wrong' end,
        p_store_report_id,
        jsonb_build_object('storeId', p_store_report_id, 'consensus', v_consensus)
      );
      update public.store_report_votes set rewarded = true where id = v_vote.id;
    end loop;
  end if;

  if v_consensus in ('correct','gone') then
    perform public.apply_reward_event(v_owner, 'radar_verified_bonus', p_store_report_id, jsonb_build_object('storeId', p_store_report_id));
  end if;
  if v_consensus = 'wrong' then
    perform public.apply_reward_event(v_owner, 'radar_false_penalty', p_store_report_id, jsonb_build_object('storeId', p_store_report_id));
  end if;

  return jsonb_build_object(
    'awarded', true,
    'reason', 'awarded',
    'consensus', v_consensus,
    'counts', jsonb_build_object('correct', v_counts.correct_count, 'gone', v_counts.gone_count, 'wrong', v_counts.wrong_count)
  );
end;
$$;

revoke all on function public.apply_reward_event(uuid, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.award_reward_event(text, text, jsonb) from public, anon;
revoke all on function public.vote_store_report(text, text) from public, anon;
revoke all on function public.get_store_report_summaries() from public;
grant execute on function public.award_reward_event(text, text, jsonb) to authenticated;
grant execute on function public.vote_store_report(text, text) to authenticated;
grant execute on function public.get_store_report_summaries() to anon, authenticated;

insert into public.badges(id, title, description, requirement, visual, tone) values
('photo-proof','Fotoğraflı Kanıtçı','Radar notlarına gerçek raf fotoğrafı ekle.','{"event":"radar_photo","count":10}','camera-proof','red'),
('trusted-seller','Güvenilir Satıcı','Olumlu işlemlerle satıcı güveni oluştur.','{"seller_score":100}','seller-star','gold'),
('shelf-reporter','Raf Muhbiri','Düzenli ve doğru raf bilgileri paylaş.','{"radar_reports":25}','verified-radar','teal'),
('empty-shelf','Boş Raf Uyarıcısı','Boş rafları zamanında bildir.','{"event":"radar_empty","count":10}','empty-shelf','silver'),
('premium-hunter','Premium Avcısı','Premium araçları topluluğa haber ver.','{"event":"radar_premium","count":15}','premium-flame','gold'),
('th-finder','TH Bulucu','Doğrulanan TH veya STH bulguları paylaş.','{"events":["radar_th","radar_sth"],"count":5}','th-radar','red'),
('community-guide','Topluluk Rehberi','Faydalı yorum ve rehber katkıları yap.','{"event":"helpful_forum","count":20}','forum-guide','teal'),
('first-trade','İlk Takas','İlk satış veya takasını tamamla.','{"event":"deal_completed","count":1}','deal-handshake','gold')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  requirement = excluded.requirement,
  visual = excluded.visual,
  tone = excluded.tone;
