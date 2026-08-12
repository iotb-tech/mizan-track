-- Profiles
create table if not exists public.profiles (
    id      uuid primary key references auth.users (id) on delete cascade,
    email   text not null,
    full_name   text,
    created_at  timestamptz not null default now()
);



