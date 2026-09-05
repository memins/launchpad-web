# Gumroad listing (seller)

This guide is for **Emin** (the seller), not for kit buyers. It covers creating the $99 one-time LaunchPad Web product, wiring `NEXT_PUBLIC_GUMROAD_URL`, and delivering a **private GitHub kit** without a license server or Gumroad API purchase flow.

There is **no live listing in this repo**. Use placeholders until you publish. Do not invent product URLs, sales counts, or “bestseller” claims on the homepage.

Buyer checkout stays on Gumroad. This app’s Buy buttons only open `NEXT_PUBLIC_GUMROAD_URL` (see `src/lib/site.ts`). After payment, Gumroad can redirect to `/thanks`.

## Create the $99 one-time product

1. Sign in at [gumroad.com](https://gumroad.com) with the seller account.
2. **New product** → digital product (not a membership / subscription).
3. **Name:** LaunchPad Web
4. **Price:** `99` USD, **one-time**. Do not enable recurring billing — Stripe inside the kit is how *buyers’* SaaS apps bill *their* users.
5. **Permalink:** pick something you control, e.g. `YOUR_PERMALINK`. The public URL will look like:

   `https://YOUR_USERNAME.gumroad.com/l/YOUR_PERMALINK`

   That string is a **placeholder**. Paste the real URL into `NEXT_PUBLIC_GUMROAD_URL` only after Gumroad shows the product page.
6. **Cover / thumbnail:** optional. Use a screenshot of the kit storefront if you have one.
7. **Discoverability:** keep the product unpublished (or unlisted) until the [ship checklist](./ship-checklist.md) is done.
8. Save. Copy the product URL from the Gumroad dashboard — do not guess a slug.

## Product description (copy-paste)

Use this as the listing body. It matches what the kit actually ships.

```text
LaunchPad Web is a paid, one-time Next.js + Supabase SaaS ship kit — not a free boilerplate.

Pay once. Clone the source. Ship your product instead of scaffolding auth, billing, and a dashboard.

What’s included
• Next.js 15 App Router, TypeScript, Tailwind CSS 4
• Supabase Auth (@supabase/ssr) — email/password, OAuth-ready, cookie sessions
• First-run onboarding wizard + profiles schema (RLS)
• Protected /dashboard with profile and billing routes
• Stripe Checkout, signed webhooks, and Customer Portal for YOUR SaaS users
• Kit marketing homepage (Buy CTA is env-driven)
• Buyer README, copy-paste SQL migrations, and .env.example
• Commercial license: build unlimited apps you ship

What you are not buying
• A subscription to the kit (price is $99 one-time)
• Automated GitHub access from the Buy button (see delivery below)
• The right to resell or redistribute the kit as a starter

After checkout
1. Check the Gumroad receipt email for access instructions.
2. Reply with your GitHub username so you can be invited to the private repo.
3. Open the thanks page (redirect) for clone + setup steps.

Stack: Next.js, Supabase, Stripe, Tailwind CSS 4, Resend (optional). Web only — no Flutter.
License: build apps; do not resell the kit. See LICENSE in the repo.
```

Short tagline if Gumroad asks for a one-liner:

```text
$99 one-time Next.js + Supabase SaaS ship kit — auth, onboarding, Stripe, dashboard.
```

## Set `NEXT_PUBLIC_GUMROAD_URL`

| Where | Value |
| --- | --- |
| Local | `.env.local` — same key as `.env.example` |
| Vercel | Project → Settings → Environment Variables (Production + Preview) |
| Fallback in code | `https://gumroad.com` when the var is empty |

Until the listing is public, leave the placeholder (`https://gumroad.com`). After you publish, set the **real** product URL from the Gumroad dashboard. Buyers who rebrand the homepage for their own product swap this same variable — no code change.

Do not commit a real product URL if you want the template to stay generic. The homepage already documents the env var.

## Delivery (private GitHub kit)

Gumroad cannot add a collaborator to GitHub by itself. This repo has **no** Gumroad purchase API, license key, or invite webhook — do not add one unless you later want that product.

### Primary: receipt email + private GitHub invite

**Use this as the default.** The kit is source on GitHub; an invite is the access that stays up to date (`git pull` / clone). A zip goes stale the next time you commit.

1. Keep the buyer-facing repo **private** before you sell (or use a private delivery repo you control). A public clone would give unpaid access.
2. In the Gumroad product, open **Content** (the post-purchase / receipt body — Gumroad emails this).
3. Paste instructions like:

   ```text
   Thanks for buying LaunchPad Web.

   How you get the source
   1. Reply to this email with your GitHub username.
   2. I will send a private collaborator invite to the kit repo (read access is enough to clone).
   3. Accept the invite, then:
      git clone git@github.com:YOUR_ORG/YOUR_PRIVATE_REPO.git
      cd YOUR_PRIVATE_REPO
      cp .env.example .env.local
      npm install && npm run dev
   4. Follow the README “10-minute setup” (Supabase SQL, Stripe keys).

   If the invite is delayed, use the zip attached to this receipt (backup).
   License: you may ship apps; you may not resell or redistribute the kit.
   Setup recap: https://YOUR_DOMAIN/thanks
   ```

   Replace `YOUR_ORG/YOUR_PRIVATE_REPO` and `YOUR_DOMAIN` with your real values when you publish. Leave them as placeholders in this file.
4. After each sale: GitHub → repo → **Settings → Collaborators** → Add the buyer’s username → **Read**.
5. Invite from the same account that owns the private repo. Do not paste personal access tokens into Gumroad.

Optional: a short form (Tally, Google Form) linked from the receipt if you do not want buyers to reply by email. The form only needs **Gumroad email + GitHub username**. Still a manual invite — not a license server.

### Backup: downloadable zip of a tagged release

Attach a zip so the buyer can start if the invite is late or they do not use GitHub yet.

1. Tag a release locally (example):

   ```bash
   git tag kit-YYYY.MM.DD
   git archive --format=zip --prefix=launchpad-web/ -o /tmp/launchpad-web-kit.zip HEAD
   ```

2. Upload that zip as a **product file** on Gumroad (receipt download).
3. Re-export and replace the file when you cut a new kit version.
4. The zip is still the Kit. `LICENSE` forbids the buyer from sharing it or posting a public clone.

Do not use a public GitHub Release on a public repo as the “private kit” — that is a free download.

## Redirect to `/thanks`

In the Gumroad product settings, set **Redirect to a URL after purchase** (wording varies) to:

```text
https://YOUR_DOMAIN/thanks
```

Local preview: `http://localhost:3000/thanks`. Production: your Vercel (or custom) origin + `/thanks`.

`/thanks` explains invite + setup. It does **not** check a license, read Gumroad cookies, or unlock the repo. Anyone can open it.

## What this repo will not do

- Call the Gumroad API to create a sale or auto-invite
- Invent a product URL, rating, or sales number
- Treat Stripe Checkout as the $99 kit purchase (Stripe is for the buyer’s SaaS users)

## License (resale)

`LICENSE` is a commercial kit license: purchasers may build and ship apps; they may not resell or redistribute the kit (including the fulfillment zip). Seller delivery (invite and/or zip to the purchaser only) is allowed. Keep that language on the Gumroad listing.

When you are ready to publish, walk [docs/ship-checklist.md](./ship-checklist.md).
