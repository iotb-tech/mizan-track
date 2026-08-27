-- ==============================================================================
-- MIZAN TRACK: COMPLETE DATABASE SCHEMA
-- ==============================================================================

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  is_disabled boolean not null default false,
  avatar_url text,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role, is_disabled, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'user'),
    false,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Habits & Logs
create type frequency_type as enum ('daily', 'specific_days', 'weekly_count');

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 3 and 120),
  user_id uuid not null references public.profiles (id) on delete cascade,
  frequency_type frequency_type not null,
  category text check (char_length(category) between 3 and 120),
  days_of_week smallint[],
  target_count smallint,
  created_at timestamptz not null default now()
);

create table if not exists public.habits_log (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  log_date date not null,
  completed boolean not null default false,
  unique (habit_id, log_date)
);

create index if not exists habits_user_id_idx on public.habits (user_id);

-- 3. Expenses Table
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  category text not null check (char_length(category) between 1 and 120),
  amount numeric not null check (amount > 0),
  date date not null default current_date,
  note text check (char_length(note) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists expenses_user_id_idx on public.expenses (user_id);

-- 4. System Settings Table
create table if not exists public.system_settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamptz not null default now()
);

-- Default admin password: Admin@MizanTrack2026!
insert into public.system_settings (key, value, description)
values (
  'admin_password_hash',
  '15d6ef77c23d37b18d48f5ad4c6d8286ab65ad0b6f42eb9da208000d1e588464',
  'Hashed master admin verification password'
)
on conflict (key) do nothing;

-- 5. Row Level Security & Helper Functions
alter table public.profiles enable row level security;
alter table public.habits enable row level security;
alter table public.habits_log enable row level security;
alter table public.expenses enable row level security;
alter table public.system_settings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and coalesce(p.role, 'user') = 'admin'
      and coalesce(p.is_disabled, false) = false
  );
$$;

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

-- RLS: Profiles
drop policy if exists "profiles: read own" on public.profiles;
drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin"
  on public.profiles for select
  using ((select auth.uid()) = id or public.is_admin());

drop policy if exists "profiles: update own" on public.profiles;
drop policy if exists "profiles: update own or admin" on public.profiles;
create policy "profiles: update own or admin"
  on public.profiles for update
  using ((select auth.uid()) = id or public.is_admin())
  with check ((select auth.uid()) = id or public.is_admin());

drop policy if exists "profiles: delete admin" on public.profiles;
create policy "profiles: delete admin"
  on public.profiles for delete
  using (public.is_admin());

-- RLS: Habits (Admin has read-only access to all habits)
drop policy if exists "habits: read own" on public.habits;
drop policy if exists "habits: read own or admin" on public.habits;
create policy "habits: read own or admin"
  on public.habits for select
  using ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "habits: insert own" on public.habits;
create policy "habits: insert own"
  on public.habits for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "habits: update own" on public.habits;
create policy "habits: update own"
  on public.habits for update
  with check ((select auth.uid()) = user_id);

drop policy if exists "habits: delete own" on public.habits;
create policy "habits: delete own"
  on public.habits for delete
  using ((select auth.uid()) = user_id);

-- RLS: Habits Log (Admin has read-only access to all habit logs)
drop policy if exists "habits_log: read own" on public.habits_log;
drop policy if exists "habits_log: read own or admin" on public.habits_log;
create policy "habits_log: read own or admin"
  on public.habits_log for select
  using (public.owns_habits(habit_id) or public.is_admin());

drop policy if exists "habits_log: insert own" on public.habits_log;
create policy "habits_log: insert own"
  on public.habits_log for insert
  with check (public.owns_habits(habit_id));

drop policy if exists "habits_log: update own" on public.habits_log;
create policy "habits_log: update own"
  on public.habits_log for update
  with check (public.owns_habits(habit_id));

drop policy if exists "habits_log: delete own" on public.habits_log;
create policy "habits_log: delete own"
  on public.habits_log for delete
  using (public.owns_habits(habit_id));

-- RLS: Expenses (Admin has read-only access to all expenses)
drop policy if exists "expenses: read own or admin" on public.expenses;
create policy "expenses: read own or admin"
  on public.expenses for select
  using ((select auth.uid()) = user_id or public.is_admin());

drop policy if exists "expenses: insert own" on public.expenses;
create policy "expenses: insert own"
  on public.expenses for insert
  with check ((select auth.uid()) = user_id);

drop policy if exists "expenses: update own" on public.expenses;
create policy "expenses: update own"
  on public.expenses for update
  with check ((select auth.uid()) = user_id);

drop policy if exists "expenses: delete own" on public.expenses;
create policy "expenses: delete own"
  on public.expenses for delete
  using ((select auth.uid()) = user_id);

-- RLS: System Settings
drop policy if exists "system_settings: read admin" on public.system_settings;
create policy "system_settings: read admin"
  on public.system_settings for select
  using (public.is_admin());

drop policy if exists "system_settings: update admin" on public.system_settings;
create policy "system_settings: update admin"
  on public.system_settings for update
  using (public.is_admin())
  with check (public.is_admin());

-- Realtime subscriptions
alter publication supabase_realtime add table public.habits;
alter publication supabase_realtime add table public.habits_log;
alter publication supabase_realtime add table public.expenses;
