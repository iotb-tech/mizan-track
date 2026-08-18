-- Profiles
create table if not exists public.profiles (
    id      uuid primary key references auth.users (id) on delete cascade,
    email   text not null,
    full_name   text,
    created_at  timestamptz not null default now()
);



create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create type frequency_type as enum ('daily', 'specific_days', 'weekly_count');

create table if not exists public.habits(
  id  uuid primary key default gen_random_uuid(),
  name  text not null check (char_length(name) between 3 and 120),
  user_id  uuid not null references public.profiles (id) on delete cascade,
  frequency_type  frequency_type not null,
  category text check (char_length(category) between 3 and 120),
  days_of_week smallint[],
  target_count smallint,
  created_at timestamptz not null default now()
);

create table if not exists public.habits_log(
  id  uuid primary key default gen_random_uuid(),
  habit_id  uuid not null references public.habits (id) on delete cascade,
  log_date  date not null,
  completed  boolean not null default false,
  unique (habit_id, log_date)
);

create index if not exists habits_user_id_idx on public.habits (user_id);
--create index if not exists habit_user_id_status_idx on public.habits_log (habit_id, completed);


alter table public.habits enable row level security;
alter table public.habits_log enable row level security;

create or replace function public.owns_habits(h_habit_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.habits h
    where h.id = h_habit_id
      and h.user_id = (select auth.uid())
  );
$$;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own"
  on public.profiles for select
  using ((select auth.uid())= id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  with check ((select auth.uid())= id);


drop policy if exists "habits: read own" on public.habits;
create policy "habits: read own"
  on public.habits for select
  using ((select auth.uid())= user_id);

drop policy if exists "habits: insert own" on public.habits;
create policy "habits: insert own"
  on public.habits for insert
  with check ((select auth.uid())= user_id);

drop policy if exists "habits: update own" on public.habits;
create policy "habits: update own"
  on public.habits for update
  with check ((select auth.uid())= user_id);

  
drop policy if exists "habits: delete own" on public.habits;
create policy "habits: delete own"
  on public.habits for delete
  using ((select auth.uid())= user_id);



drop policy if exists "habits_log: read own" on public.habits_log;
create policy "habits_log: read own"
  on public.habits_log for select
  using (public.owns_habits(habit_id) );

drop policy if exists "habits_log: insert own" on public.habits_log;
create policy "habits_log: insert own"
  on public.habits_log for insert
  with check (public.owns_habits(habit_id));

drop policy if exists "habits_log: update own" on public.habits_log;
create policy "habits_log: update own"
  on public.habits_log for update
  with check (public.owns_habits(habit_id));

drop policy if exists "habits_log: delete own" on public.habits_log;
create policy "habits: delete own"
  on public.habits_log for delete
  using (public.owns_habits(habit_id));

alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habits_log;
