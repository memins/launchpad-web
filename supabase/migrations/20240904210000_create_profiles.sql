-- LaunchPad Web — first-run profile + onboarding flag
--
-- Buyers: paste this entire file into the Supabase SQL Editor and run it
-- (Dashboard → SQL Editor → New query). If you use the Supabase CLI:
--   supabase db push
--
-- What this creates
--   public.profiles     one row per auth user (display name, workspace, onboarding)
--   RLS                 users can only read/write their own row
--   handle_new_user()   inserts a profile when someone signs up
--   backfill            covers users that already exist in auth.users

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  workspace_name text,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'App profile for each auth user. onboarding_completed_at is set when they finish or skip the wizard.';

create index if not exists profiles_onboarding_completed_at_idx
  on public.profiles (onboarding_completed_at);

alter table public.profiles enable row level security;

drop policy if exists "Users can select their own profile" on public.profiles;
create policy "Users can select their own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Runs as the table owner so the insert succeeds before the user session exists.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(
      trim(
        coalesce(
          new.raw_user_meta_data ->> 'display_name',
          new.raw_user_meta_data ->> 'name',
          new.raw_user_meta_data ->> 'full_name',
          split_part(new.email, '@', 1)
        )
      ),
      ''
    )
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Existing auth users (local testing, imported accounts) get a row too.
insert into public.profiles (id, display_name)
select
  users.id,
  nullif(
    trim(
      coalesce(
        users.raw_user_meta_data ->> 'display_name',
        users.raw_user_meta_data ->> 'name',
        users.raw_user_meta_data ->> 'full_name',
        split_part(users.email, '@', 1)
      )
    ),
    ''
  )
from auth.users as users
on conflict (id) do nothing;
