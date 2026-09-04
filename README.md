# LaunchPad Web

A paid, one-time **Next.js SaaS ship kit** — not a generic boilerplate. Clone it, wire Supabase + Stripe, and start shipping a product instead of scaffolding auth, billing hooks, and a dashboard from scratch.

**Price:** $99 on [Gumroad](https://gumroad.com) (one-time). Built by [Emin Sahin](https://github.com/memins).

Stack: **Next.js App Router**, **TypeScript**, **Tailwind CSS 4**, **Supabase Auth (`@supabase/ssr`)**, **Stripe helper**, **Resend**.

## What’s in the kit

- Email / password + OAuth-ready auth with cookie sessions (`@supabase/ssr`)
- Protected `/dashboard` via middleware
- Marketing landing you can rebrand in one pass
- Stripe client helper (Checkout + webhooks come in a follow-up drop)
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

### 3. Stripe (~3 minutes)

1. Create a [Stripe](https://stripe.com) account and toggle **test mode**.
2. **Developers → API keys**: set `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`.
3. Create a product / price and paste the price id into `STRIPE_PRICE_ID` (used when Checkout ships).
4. Leave `STRIPE_WEBHOOK_SECRET` blank until you add a webhook endpoint.

### 4. Email (optional)

Create a [Resend](https://resend.com) API key and set `RESEND_API_KEY` plus `RESEND_FROM_EMAIL`. Skip this until you send transactional mail.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up at `/auth/register`, then open `/dashboard`.

## Environment variables

Copy `.env.example` → `.env.local`. Every key is documented there:

| Variable | Required to boot | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Yes | Your site origin |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin/server only | Supabase → Settings → API |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For Stripe helper | Stripe → API keys |
| `STRIPE_SECRET_KEY` | For Stripe helper | Stripe → API keys |
| `STRIPE_WEBHOOK_SECRET` | Later (Checkout) | Stripe → Webhooks |
| `STRIPE_PRICE_ID` | Later (Checkout) | Stripe → Products |
| `RESEND_API_KEY` | Optional | Resend dashboard |
| `RESEND_FROM_EMAIL` | Optional | Your sending domain |

## Deploy to Vercel

1. Push this repo to GitHub (or import `memins/launchpad-web`).
2. [vercel.com/new](https://vercel.com/new) → import the repo.
3. Add the same env vars from `.env.local` (Production + Preview).
4. Set `NEXT_PUBLIC_APP_URL` to `https://your-domain.vercel.app`.
5. In Supabase Auth URL config, add `https://your-domain.vercel.app` and `https://your-domain.vercel.app/auth/callback`.
6. Deploy. Framework preset: **Next.js**.

```bash
npm run build
npx vercel --prod
```

## Auth routes

One App Router tree — no locale-prefixed duplicates:

| Path | Purpose |
| --- | --- |
| `/auth/login` | Email + OAuth sign-in |
| `/auth/register` | Email + OAuth sign-up |
| `/auth/callback` | Supabase OAuth / magic-link exchange |
| `/dashboard` | Session-gated app shell |

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
