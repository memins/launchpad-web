# Ship checklist (go live)

Seller checklist before you take the LaunchPad Web listing public. Details for Gumroad: [docs/gumroad.md](./gumroad.md). Buyer setup stays in the [README](../README.md).

Do not commit secrets. Use Vercel / `.env.local` only.

## Repo and license

- [ ] Buyer-facing GitHub repo is **private** (or you have a private delivery repo).
- [ ] `LICENSE` is the commercial kit text (build apps; do not resell the kit).
- [ ] You can add collaborators (owner or admin on that repo).

## Supabase

- [ ] Production project exists (not only local).
- [ ] Run both SQL files in **SQL Editor** (profiles first):
  - `supabase/migrations/20240904210000_create_profiles.sql`
  - `supabase/migrations/20240904220000_create_subscriptions.sql`
- [ ] **Authentication → URL configuration**
  - Site URL: `https://YOUR_DOMAIN`
  - Redirect URLs: `https://YOUR_DOMAIN/auth/callback` (plus `http://localhost:3000/auth/callback` if you still develop locally)
- [ ] Email provider on; OAuth only if you configured the provider keys.

## Stripe (your demo / buyers’ SaaS — not the $99 kit)

- [ ] Live mode keys when you want real charges (`sk_live_…`, `whsec_…`). Keep test keys for preview.
- [ ] `STRIPE_PRICE_ID` is a real Price id (`price_…`).
- [ ] Customer portal enabled (Billing → Customer portal).
- [ ] Webhook endpoint: `https://YOUR_DOMAIN/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `customer.subscription.created` / `updated` / `deleted`, `invoice.paid`, `invoice.payment_failed`
  - Signing secret → `STRIPE_WEBHOOK_SECRET`

## Gumroad (the $99 kit)

- [ ] Product created: **$99, one-time**, digital (not a membership).
- [ ] Description uses the “what’s included” bullets from [docs/gumroad.md](./gumroad.md).
- [ ] Content email: reply-with-GitHub-username + clone steps (primary delivery).
- [ ] Backup zip of a tagged tree attached (optional but recommended).
- [ ] Redirect after purchase: `https://YOUR_DOMAIN/thanks`
- [ ] Copy the **dashboard** product URL into `NEXT_PUBLIC_GUMROAD_URL` (no invented slug).

## Vercel env

Set the same keys as `.env.example` for **Production** (and Preview if you want the marketing CTA to work there):

| Variable | Live value |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | `https://YOUR_DOMAIN` |
| `NEXT_PUBLIC_GUMROAD_URL` | Real Gumroad product URL, or leave unset until you publish |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server only) |
| `STRIPE_SECRET_KEY` | `sk_live_…` or `sk_test_…` |
| `STRIPE_WEBHOOK_SECRET` | Endpoint signing secret |
| `STRIPE_PRICE_ID` | `price_…` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Optional until you send mail |

Then deploy. Framework preset: **Next.js**.

## Smoke before you publish the listing

- [ ] `npm run build` succeeds with those env vars present in the host.
- [ ] `/` Buy button opens the Gumroad product (or `https://gumroad.com` if still placeholder).
- [ ] `/thanks` loads without login and lists invite + setup steps.
- [ ] `/auth/register` → onboarding → `/dashboard` still works (SaaS demo).
- [ ] Send yourself a Gumroad receipt (or a test purchase) and confirm the content email + zip (if attached).

When that passes, publish the Gumroad product and swap `NEXT_PUBLIC_GUMROAD_URL` if you have not already.
