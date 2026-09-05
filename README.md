# LaunchPad Web

A paid, one-time **Next.js SaaS ship kit** — not a generic boilerplate. Clone it, wire Supabase + Stripe, and start shipping a product instead of scaffolding auth, billing hooks, and a dashboard from scratch.

**Price:** $99 on [Gumroad](https://gumroad.com) (one-time). Built by [Emin Sahin](https://github.com/memins).

Stack: **Next.js App Router**, **TypeScript**, **Tailwind CSS 4**, **Supabase Auth (`@supabase/ssr`)**, **Stripe Checkout + webhooks**, **Resend**.

## What’s in the kit

- Email / password + OAuth-ready auth with cookie sessions (`@supabase/ssr`)
- First-run onboarding wizard (display name + optional workspace) gated by middleware
- Protected `/dashboard` via middleware
- Kit marketing homepage (hero, what’s included, audience, stack, $99 pricing, FAQ) with a Gumroad Buy CTA
- Stripe Checkout, signed webhook, and a `/dashboard/billing` plan status
- i18n-ready `/en` and `/de` landing variants
- Plop generators for pages, components, hooks, and API routes

## 10-minute setup

### 1. Clone and install

```bash
git clone https://github.com/memins/launchpad-web.git
cd launchpad-web
cp .env.example .env.local
npm install
```

### 2. Supabase (~4 minutes)

1. Create a project at [supabase.com](https://supabase.com).
2. **Project Settings → API**: copy **Project URL** and **anon public** key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Copy the **service_role** key into `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose it to the browser).
4. **Authentication → Providers**: enable Email. Optionally enable Google / Apple.
5. **Authentication → URL configuration**
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
6. **SQL Editor**: paste and run these two files (profiles first):
   - `supabase/migrations/20240904210000_create_profiles.sql` — `public.profiles` (display name, workspace, onboarding), RLS, signup trigger.
   - `supabase/migrations/20240904220000_create_subscriptions.sql` — `public.subscriptions` (Stripe customer / plan / status). Users can **select** their own row; the webhook writes with `SUPABASE_SERVICE_ROLE_KEY`.

### 3. Stripe (~5 minutes)

This kit bills **your SaaS users** (not the $99 kit purchase). Pattern: hosted Checkout. A **recurring** `STRIPE_PRICE_ID` opens `mode: subscription`. A **one-time** price opens `mode: payment` and stores `status = active` as lifetime access.

1. Create a [Stripe](https://stripe.com) account and toggle **test mode**.
2. **Developers → API keys**: set `STRIPE_SECRET_KEY` and (optional) `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`. Hosted Checkout only needs the secret key.
3. **Product catalog**: create a Product + Price. Paste the `price_...` id into `STRIPE_PRICE_ID`.
4. **Settings → Billing → Customer portal**: turn the portal on so “Manage billing” works (invoices, cancel, payment method).
5. Webhook — local and production (below).

#### Local webhook (Stripe CLI)

Checkout success is persisted by the webhook, not by the redirect. Forward events while `npm run dev` is running:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the CLI `whsec_...` into `STRIPE_WEBHOOK_SECRET` in `.env.local` and restart Next.js. Trigger a test payment with card `4242 4242 4242 4242`, any future expiry, any CVC.

Useful events this route handles:

- `checkout.session.completed`
- `customer.subscription.created` / `updated` / `deleted`
- `invoice.paid` / `invoice.payment_failed`

```bash
stripe trigger checkout.session.completed
```

CLI trigger events do not include your app `user_id` metadata — use a real Checkout from `/dashboard/billing` to see the row update.

#### Production webhook

Stripe Dashboard → **Developers → Webhooks → Add endpoint**:

- URL: `https://your-domain.com/api/webhooks/stripe`
- Events: the same list as above
- Signing secret → `STRIPE_WEBHOOK_SECRET` on Vercel (Production + Preview)

The webhook writes with `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). Keep that key server-only.

### 4. Email (optional)

Create a [Resend](https://resend.com) API key and set `RESEND_API_KEY` plus `RESEND_FROM_EMAIL`. Skip this until you send transactional mail.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up at `/auth/register` — new users land on `/onboarding` (complete or skip), then `/dashboard`. Returning users who already finished onboarding go straight to the app.

## Environment variables

Copy `.env.example` → `.env.local`. Every key is documented there:

| Variable | Required to boot | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | Your site origin |
| `NEXT_PUBLIC_GUMROAD_URL` | Optional (homepage Buy CTA) | Your Gumroad product URL. Falls back to `https://gumroad.com`. Swap this when you publish the kit listing — or when you rebrand the homepage for your own product. |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin/server only | Supabase → Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional (Stripe.js later) | Stripe → API keys |
| `STRIPE_SECRET_KEY` | Checkout + webhook | Stripe → API keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature | Stripe CLI or Dashboard → Webhooks |
| `STRIPE_PRICE_ID` | Checkout line item | Stripe → Product catalog |
| `RESEND_API_KEY` | Optional | Resend dashboard |
| `RESEND_FROM_EMAIL` | Optional | Your sending domain |

## Deploy to Vercel

1. Push this repo to GitHub (or import `memins/launchpad-web`).
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. Add the same env vars from `.env.local` (Production + Preview).
4. Set `NEXT_PUBLIC_APP_URL` to `https://your-domain.vercel.app`.
5. In Supabase Auth URL config, add `https://your-domain.vercel.app` and `https://your-domain.vercel.app/auth/callback`.
6. Add a Stripe webhook endpoint for `https://your-domain.vercel.app/api/webhooks/stripe` and set `STRIPE_WEBHOOK_SECRET`.
7. Deploy. Framework preset: **Next.js**.

```bash
npm run build
npx vercel --prod
```

## Auth routes

One App Router tree — no locale-prefixed duplicates:

| Path | Purpose |
| --- | --- |
| `/` | Kit storefront (Buy on Gumroad + demo login). `/en` and `/de` reuse the same page. |
| `/auth/login` | Email + OAuth sign-in (included SaaS demo) |
| `/auth/register` | Email + OAuth sign-up |
| `/auth/callback` | Supabase OAuth / magic-link exchange (first-timers → `/onboarding`) |
| `/onboarding` | Short first-run wizard (complete or skip; session-gated) |
| `/dashboard` | Session-gated app shell (redirects here after onboarding) |
| `/dashboard/profile` | Edit the same profile fields collected during onboarding |
| `/dashboard/billing` | Plan status, Upgrade → Checkout, Manage billing → Customer Portal |
| `/api/stripe/checkout` | Authenticated: create a Checkout Session and redirect URL |
| `/api/stripe/portal` | Authenticated: Customer Portal session |
| `/api/webhooks/stripe` | Stripe-signed webhook (no cookies; service role writes `subscriptions`) |

## Scripts

```bash
npm run dev       # Next.js dev server
npm run build     # Production build
npm run start     # Serve the production build
npm run lint      # ESLint
npm run generate  # Plop scaffolding
```

## License

LaunchPad Web is a **commercial kit**, not MIT. Buyers may build and ship apps. You may not resell or redistribute the kit itself. See [`LICENSE`](./LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Stripe](https://stripe.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Resend](https://resend.com/)
