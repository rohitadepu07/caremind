create table if not exists public.caremind_user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  app_state jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.caremind_user_data enable row level security;

create policy "Users can read their own CareMind data"
  on public.caremind_user_data
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own CareMind data"
  on public.caremind_user_data
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own CareMind data"
  on public.caremind_user_data
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

grant select, insert, update on public.caremind_user_data to authenticated;
