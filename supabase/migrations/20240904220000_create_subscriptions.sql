-- LaunchPad Web — Stripe billing state (one row per auth user)
--
-- Buyers: paste this entire file into the Supabase SQL Editor and run it
-- (Dashboard → SQL Editor → New query) after the profiles migration.
-- If you use the Supabase CLI:
--   supabase db push
--
-- What this creates
--   public.subscriptions   plan / access row keyed to auth.users
--   RLS                    users can SELECT their own row only
--                          writes come from the Next.js webhook via the service role
--   updated_at trigger     reused from the profiles migration when present
--
-- Checkout mode
--   Recurring STRIPE_PRICE_ID → Checkout `subscription` + lifecycle webhooks
--   One-time STRIPE_PRICE_ID  → Checkout `payment`; status becomes `active` (lifetime)

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text,
  stripe_price_id text,
  status text not null default 'none',
  plan_name text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.subscriptions is
  'Stripe billing state for each auth user. Webhook (service role) is the writer; the signed-in user may read their own row.';

comment on column public.subscriptions.status is
  'Stripe subscription status, or `active` for a completed one-time Checkout, or `none` before purchase.';

create index if not exists subscriptions_stripe_customer_id_idx
  on public.subscriptions (stripe_customer_id);

create index if not exists subscriptions_status_idx
  on public.subscriptions (status);

alter table public.subscriptions enable row level security;

drop policy if exists "Users can select their own subscription" on public.subscriptions;
create policy "Users can select their own subscription"
  on public.subscriptions
  for select
  using (auth.uid() = user_id);

-- No insert/update/delete policies for authenticated users.
-- The Stripe webhook uses SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
  before update on public.subscriptions
  for each row
  execute function public.set_updated_at();
