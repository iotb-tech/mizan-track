-- ==============================================================================
-- MIZAN TRACK: ADMIN MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor to enable Admin capabilities
-- ==============================================================================

-- 1. Add role and is_disabled columns to profiles if they don't exist
alter table public.profiles
  add column if not exists role text not null default 'user' check (role in ('user', 'admin')),
  add column if not exists is_disabled boolean not null default false;

-- Backfill missing profile rows for existing auth users
insert into public.profiles (id, email, full_name, role, is_disabled)
select 
  id,
  coalesce(email, 'user@example.com'),
  coalesce(raw_user_meta_data->>'full_name', split_part(email, '@', 1)),
  'user',
  false
from auth.users
on conflict (id) do update
set is_disabled = false where public.profiles.is_disabled is null;

update public.profiles set is_disabled = false where is_disabled is null;
update public.profiles set role = 'user' where role is null;

-- 2. Create expenses table if not already tracked in schema
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
alter table public.expenses enable row level security;

-- 3. Create system_settings table for admin password and system parameters
create table if not exists public.system_settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamptz not null default now()
);

alter table public.system_settings enable row level security;

-- Initial default admin password: Admin@MizanTrack2026!
-- SHA-256 hash of "Admin@MizanTrack2026!"
insert into public.system_settings (key, value, description)
values (
  'admin_password_hash',
  '15d6ef77c23d37b18d48f5ad4c6d8286ab65ad0b6f42eb9da208000d1e588464',
  'Hashed master admin verification password'
)
on conflict (key) do update
set value = '15d6ef77c23d37b18d48f5ad4c6d8286ab65ad0b6f42eb9da208000d1e588464';

-- 4. Helper function to check if current user is an active admin
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

-- 5. Update RLS Policies for Profiles
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

-- 6. Update RLS Policies for Habits
drop policy if exists "habits: read own" on public.habits;
drop policy if exists "habits: read own or admin" on public.habits;
create policy "habits: read own or admin"
  on public.habits for select
  using ((select auth.uid()) = user_id or public.is_admin());

-- Notice: Admins can READ all habits, but only own users can INSERT/UPDATE/DELETE (read-only for admin)
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

-- 7. Update RLS Policies for Habits Log
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

-- 8. Update RLS Policies for Expenses
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

-- 9. Update RLS Policies for System Settings
drop policy if exists "system_settings: read admin" on public.system_settings;
create policy "system_settings: read admin"
  on public.system_settings for select
  using (public.is_admin());

drop policy if exists "system_settings: update admin" on public.system_settings;
create policy "system_settings: update admin"
  on public.system_settings for update
  using (public.is_admin())
  with check (public.is_admin());
