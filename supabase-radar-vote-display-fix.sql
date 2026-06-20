-- Hunt Radar oy sayaçları ve kullanıcının seçili oyunu için güvenli özet RPC'si.
-- Mevcut tabloları veya oyları silmez. Ham voter_id değerlerini dışarı açmaz.

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

revoke all on function public.get_store_report_summaries() from public;
grant execute on function public.get_store_report_summaries() to anon, authenticated;

notify pgrst, 'reload schema';
