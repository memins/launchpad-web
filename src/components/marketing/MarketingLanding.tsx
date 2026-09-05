import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Gauge,
  KeyRound,
  Layers3,
  LayoutDashboard,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import MarketingHeader from '@/components/marketing/MarketingHeader';
import {
  GITHUB_REPO_URL,
  KIT_NAME,
  KIT_PRICE,
  KIT_PRICE_LABEL,
  THANKS_PATH,
  getGumroadUrl,
} from '@/lib/site';

const included = [
  {
    icon: ShieldCheck,
    title: 'Supabase auth that ships',
    description:
      'Email/password plus OAuth-ready flows with cookie sessions via @supabase/ssr — not a leftover auth-helpers setup.',
  },
  {
    icon: UserPlus,
    title: 'First-run onboarding',
    description:
      'A short wizard (display name + optional workspace) gated by middleware so new users land somewhere useful.',
  },
  {
    icon: CreditCard,
    title: 'Stripe billing for your users',
    description:
      'Hosted Checkout, a signed webhook, Customer Portal, and a /dashboard/billing plan status you can reuse.',
  },
  {
    icon: LayoutDashboard,
    title: 'Protected dashboard shell',
    description:
      'Session-gated /dashboard with profile and billing routes. The in-app demo stays a SaaS — this page sells the kit.',
  },
  {
    icon: Layers3,
    title: 'Next.js 15 + Tailwind CSS 4',
    description:
      'App Router, TypeScript, token-based theme, and dark mode. Restyle in one file instead of hunting class soup.',
  },
  {
    icon: Sparkles,
    title: 'Buyer-ready setup docs',
    description:
      'A 10-minute README, copy-paste SQL, and .env.example. Commercial license: build apps, don’t resell the kit.',
  },
];

const audienceFor = [
  {
    title: 'Solo founders',
    description:
      'You want a SaaS in market this month, not another weekend spent wiring auth cookies and webhook signatures.',
  },
  {
    title: 'Agencies and freelancers',
    description:
      'Client products still need login, onboarding, and billing. Start from a focused kit instead of rebuilding the shell.',
  },
  {
    title: 'Developers who want less kit, not more',
    description:
      'No kitchen-sink demo, no invented social proof. Auth, onboarding, Stripe, dashboard — then your product.',
  },
];

const audienceNot = [
  'Teams that need a multi-tenant enterprise starter with orgs, roles, and audit logs on day one',
  'Anyone looking for a free MIT boilerplate they can resell as their own kit',
  'Flutter or mobile-first products — this kit is web / Next.js only',
];

const stack = [
  { name: 'Next.js 15', detail: 'App Router, React 19, TypeScript' },
  { name: 'Supabase', detail: 'Auth, Postgres, RLS, @supabase/ssr' },
  { name: 'Stripe', detail: 'Checkout, webhooks, Customer Portal' },
  { name: 'Tailwind CSS 4', detail: 'Design tokens and dark mode' },
  { name: 'Zod + RHF', detail: 'Login and register validation' },
  { name: 'Resend', detail: 'Optional transactional email' },
];

const pricingIncludes = [
  'Next.js App Router + TypeScript',
  'Supabase Auth with @supabase/ssr',
  'Onboarding wizard + profiles schema',
  'Dashboard shell + session gate',
  'Stripe Checkout, webhook, and plan status',
  'This marketing homepage (Gumroad CTA is env-driven)',
  'Buyer README and .env.example',
  'Commercial kit license — unlimited apps you ship',
];

const faqs = [
  {
    question: 'What am I buying?',
    answer:
      'The LaunchPad Web source kit: a Next.js 15 app with Supabase auth, a first-run onboarding wizard, Stripe Checkout + webhooks, and a protected dashboard. You clone it, add your keys, and build your product on top.',
  },
  {
    question: 'Is the $99 one-time, or a subscription?',
    answer:
      'One-time on Gumroad. You keep the code and can ship unlimited apps. Stripe inside the kit is how *your* SaaS bills *your* users — it is not a fee for the kit itself.',
  },
  {
    question: 'How is this different from a free boilerplate?',
    answer:
      'It is a paid commercial kit with a buyer README, copy-paste SQL, and a license that lets you ship products but not resell the kit. The homepage sells LaunchPad Web. The /auth, /onboarding, and /dashboard routes are the included SaaS demo — not a second storefront.',
  },
  {
    question: 'Can I try the app before I buy?',
    answer:
      'Yes. Demo login opens the included SaaS shell so you can walk auth → onboarding → dashboard → billing. Buying the kit is the Gumroad checkout on this page.',
  },
  {
    question: 'What do I get after checkout?',
    answer:
      'You pay on Gumroad and receive the kit through that listing. This page does not automate fulfillment (no GitHub invite from the Buy button). After checkout, Gumroad can redirect to /thanks for invite and setup steps. Point NEXT_PUBLIC_GUMROAD_URL at your product URL when you publish.',
  },
  {
    question: 'Can I use it for client work?',
    answer:
      'Yes. Build unlimited apps for yourself, clients, or your company. You may not resell or redistribute the kit itself as a starter or competing ship kit. See LICENSE.',
  },
];

const kitRoutes = [
  { path: '/auth', label: 'Login + register', note: 'Supabase cookie sessions' },
  { path: '/onboarding', label: 'First-run wizard', note: 'Middleware-gated' },
  { path: '/dashboard', label: 'App shell', note: 'Session required' },
  { path: '/dashboard/billing', label: 'Plan status', note: 'Checkout + portal' },
];

interface MarketingLandingProps {
  headerExtra?: ReactNode;
}

const MarketingLanding = ({ headerExtra }: MarketingLandingProps) => {
  const gumroadUrl = getGumroadUrl();

  return (
    <div className="bg-background text-foreground">
      <MarketingHeader gumroadUrl={gumroadUrl} headerExtra={headerExtra} />

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--muted))_0%,transparent_55%)]"
          />
          <div className="container relative mx-auto grid items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Next.js 15 ship kit · {KIT_PRICE_LABEL}
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Buy the kit.{' '}
                <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Ship the product.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                {KIT_NAME} is a one-time Next.js + Supabase SaaS kit: auth, onboarding,
                Stripe billing, and a dashboard already wired. Clone it, paste your
                keys, and spend the week on your idea — not scaffolding.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={gumroadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Buy on Gumroad · {KIT_PRICE}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-card px-6 py-3 text-base font-medium text-foreground hover:bg-muted"
                >
                  Try the demo
                </Link>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                One-time commercial license. Demo login is the included SaaS shell —
                not the purchase flow.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card/80 p-6 shadow-sm backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                What’s already in the repo
              </p>
              <ul className="mt-4 divide-y divide-border">
                {kitRoutes.map((route) => (
                  <li key={route.path} className="flex items-start justify-between gap-4 py-3">
                    <div>
                      <p className="font-medium">{route.label}</p>
                      <p className="text-sm text-muted-foreground">{route.note}</p>
                    </div>
                    <code className="shrink-0 rounded-md bg-muted px-2 py-1 font-mono text-xs text-foreground">
                      {route.path}
                    </code>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Next.js 15', 'Supabase', 'Stripe', 'Tailwind 4'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="included" className="border-t border-border bg-muted/40 py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                What’s included
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                The unglamorous work is already done
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Six pieces you would otherwise rebuild. Honest feature claims — no
                invented user counts or testimonials.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {included.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <item.icon className="h-5 w-5 text-foreground" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="audience" className="py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Who it’s for
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built for people who ship, not collect starters
              </h2>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {audienceFor.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-border bg-card p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-10 rounded-xl border border-border bg-muted/40 p-6">
              <h3 className="font-semibold">Who should skip it</h3>
              <ul className="mt-4 space-y-3">
                {audienceNot.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="stack" className="border-t border-border bg-muted/40 py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Tech stack
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Boring on purpose
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The same stack you would pick anyway. No Flutter, no extra mobile
                repo — web and Next.js only.
              </p>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {stack.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
                >
                  <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 lg:py-24">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Pricing
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {KIT_PRICE} once. Yours to keep.
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                No seat tiers. No “Pro plan” theater for the kit. Pay on Gumroad,
                then bill your own customers with the Stripe integration inside.
              </p>
            </div>

            <div className="relative mt-12 rounded-2xl border border-primary bg-card p-8 shadow-md">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                Ship kit
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{KIT_NAME}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Commercial license · checkout on Gumroad
                  </p>
                </div>
                <p className="text-4xl font-bold tracking-tight">
                  {KIT_PRICE}
                  <span className="ml-2 text-base font-normal text-muted-foreground">
                    one-time
                  </span>
                </p>
              </div>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {pricingIncludes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href={gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Buy on Gumroad · {KIT_PRICE}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Set <code className="font-mono">NEXT_PUBLIC_GUMROAD_URL</code> to your
                product link — see the README.
              </p>
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-border bg-muted/40 py-20 lg:py-24">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="text-center">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                FAQ
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Straight answers
              </h2>
            </div>
            <div className="mt-12 space-y-3">
              {faqs.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-xl border border-border bg-card px-5 py-4"
                >
                  <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.question}
                      <span className="text-muted-foreground transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <Rocket className="mx-auto h-8 w-8 text-foreground" aria-hidden />
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to ship, not scaffold?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
              Ten minutes to keys and <code className="font-mono text-sm">npm run dev</code>.
              The rest is your product.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
              >
                Buy the kit · {KIT_PRICE}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link
                href="/auth/login"
                className="inline-flex items-center rounded-md border border-border bg-card px-6 py-3 text-base font-medium text-foreground hover:bg-muted"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Demo login
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <p className="text-lg font-semibold">{KIT_NAME}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                A {KIT_PRICE_LABEL} Next.js SaaS ship kit by Emin Sahin.
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#included" className="hover:text-foreground">
                    What’s included
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-foreground">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium">Try it</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-foreground">
                    Demo login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-foreground">
                    Create a demo account
                  </Link>
                </li>
                <li>
                  <a
                    href={GITHUB_REPO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Commercial kit license</li>
                <li>Build apps. Don’t resell the kit.</li>
                <li>
                  <Link href={THANKS_PATH} className="hover:text-foreground">
                    After you buy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-10 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {KIT_NAME}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLanding;
