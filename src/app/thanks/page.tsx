import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Github,
  KeyRound,
  Mail,
  Rocket,
} from 'lucide-react';
import ThemeToggle from '@/components/marketing/ThemeToggle';
import {
  GITHUB_REPO_URL,
  KIT_NAME,
  KIT_PRICE,
  getGumroadUrl,
} from '@/lib/site';

export const metadata: Metadata = {
  title: 'Thanks — next steps',
  description: `You bought ${KIT_NAME} on Gumroad. Here’s how to get private repo access and finish setup.`,
};

const accessSteps = [
  {
    icon: Mail,
    title: 'Check the Gumroad receipt',
    body: 'Gumroad emails the product content after checkout. That message is how you get the kit — this page does not unlock a download or verify a license.',
  },
  {
    icon: Github,
    title: 'Reply with your GitHub username',
    body: 'The seller invites you as a collaborator on the private repo (read access is enough to clone). Accept the GitHub email, then clone with the URL in that invite.',
  },
  {
    icon: BookOpen,
    title: 'If a zip is attached, that is the backup',
    body: 'Use the receipt file when the invite is delayed. It is still the commercial kit: ship apps, do not redistribute the archive.',
  },
];

const setupSteps = [
  'Clone the private repo (or unzip the backup) and run cp .env.example .env.local',
  'Create a Supabase project and paste the URL, anon key, and service role key',
  'Run the two SQL files in supabase/migrations (profiles, then subscriptions)',
  'Add Stripe test keys, a price id, and stripe listen for the webhook',
  'npm install && npm run dev — then walk /auth/register → /onboarding → /dashboard',
];

const ThanksPage = () => {
  const gumroadUrl = getGumroadUrl();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            {KIT_NAME}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            >
              Storefront
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(var(--muted))_0%,transparent_55%)]"
          />
          <div className="container relative mx-auto max-w-3xl px-4 py-16 lg:py-24">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              After Gumroad checkout
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Thanks — here’s how you get the kit
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              {KIT_NAME} is delivered by the seller (private GitHub invite, with a
              zip on the receipt as backup). This page is a setup recap, not a
              license check. Anyone can open it.
            </p>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40 py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold tracking-tight">Get repo access</h2>
            <ol className="mt-8 space-y-4">
              {accessSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="flex gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-foreground" aria-hidden />
                      <h3 className="font-semibold">{step.title}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <h2 className="text-2xl font-bold tracking-tight">Then set up locally</h2>
            <p className="mt-3 text-muted-foreground">
              Full steps live in the README once you have the source. Short version:
            </p>
            <ul className="mt-8 space-y-3">
              {setupSteps.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub (invite required if private)
              </a>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium hover:bg-muted"
              >
                <KeyRound className="mr-2 h-4 w-4" />
                Try the included demo
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/40 py-16">
          <div className="container mx-auto max-w-3xl px-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">License in one line</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Build unlimited apps for yourself, clients, or your company. Do not
                resell or redistribute the kit (source or zip) as a starter. The
                commercial text is in <code className="font-mono">LICENSE</code>{' '}
                inside the repo.
              </p>
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Landed here without buying? The {KIT_PRICE} checkout is on Gumroad —
              this route is only a post-purchase explainer.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={gumroadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Buy on Gumroad · {KIT_PRICE}
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center text-sm text-muted-foreground hover:text-foreground"
              >
                <Rocket className="mr-2 h-4 w-4" />
                Back to the storefront
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ThanksPage;
