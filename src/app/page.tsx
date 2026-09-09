import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  {
    title: 'Auth that ships',
    description: 'Email, OAuth, and cookie sessions via @supabase/ssr — not a leftover auth-helpers setup.',
  },
  {
    title: 'Protected app shell',
    description: 'Middleware-gated /dashboard with a role hook you can extend for admin routes.',
  },
  {
    title: 'Stripe-ready helper',
    description: 'Named LaunchPad Web in Stripe appInfo. Checkout and webhooks are the next drop.',
  },
  {
    title: 'Landing you can rebrand',
    description: 'A marketing page written as a ship kit, not a generic “boilerplate” placeholder.',
  },
  {
    title: 'Type-safe forms',
    description: 'React Hook Form + Zod on login and register so validation is ready on day one.',
  },
  {
    title: 'Tailwind CSS 4',
    description: 'Token-based theme, dark mode, and App Router layouts you can restyle in one file.',
  },
];

const included = [
  'Next.js App Router + TypeScript',
  'Supabase Auth with @supabase/ssr',
  'Dashboard shell + session gate',
  'Stripe helper (no fake Checkout yet)',
  'Buyer README and .env.example',
  'Commercial kit license',
];

const LandingPage = () => {
  return (
    <div className="bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-xl font-bold">LaunchPad Web</div>
          <nav className="hidden space-x-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              What’s inside
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Price
            </Link>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
              Demo login
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link
              href="/auth/login"
              className="rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Open the kit
            </Link>
          </div>
        </div>
      </header>

      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            One-time Next.js SaaS ship kit · $99
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl">
            Ship a SaaS this week —{' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              not another boilerplate
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            LaunchPad Web is a paid kit: clone it, paste Supabase + Stripe keys, and start building
            your product. Auth, a dashboard shell, and a buyer-ready README are already here.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="/auth/register"
              className="flex w-full items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              Start from the kit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/memins/launchpad-web"
              className="flex w-full items-center justify-center rounded-md bg-card px-8 py-3 text-base font-medium text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">What you actually get</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              A focused ship kit for founders who want to launch — not a kitchen-sink demo.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24">
        <div className="container mx-auto max-w-xl px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">One price. Yours to keep.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              No seat tiers. No “Pro plan” theater. Pay once, build unlimited apps.
            </p>
          </div>
          <div className="relative mt-16 rounded-lg border border-primary bg-card p-8 shadow-md">
            <div className="absolute -top-4 left-0 right-0 mx-auto w-36 rounded-full bg-primary py-1 text-center text-sm font-medium text-primary-foreground">
              Ship kit
            </div>
            <h3 className="text-xl font-semibold">LaunchPad Web</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">$99</span>
              <span className="ml-2 text-muted-foreground">one-time</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Gumroad checkout. Commercial license: build apps, don’t resell the kit.
            </p>
            <ul className="mt-6 space-y-3">
              {included.map((item) => (
                <li key={item} className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/auth/register"
                className="block w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Clone and start
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to ship, not scaffold?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Ten minutes to keys and `npm run dev`. The rest is your product.
          </p>
          <div className="mt-10">
            <Link
              href="/auth/register"
              className="inline-flex items-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              Open the kit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="md:flex md:justify-between">
            <div className="mb-8 md:mb-0">
              <div className="text-xl font-bold">LaunchPad Web</div>
              <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                A $99 one-time Next.js SaaS ship kit by Emin Sahin.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              <div>
                <h3 className="font-medium">Product</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
                      What’s inside
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
                      Price
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Resources</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link
                      href="https://github.com/memins/launchpad-web"
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      GitHub
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
                      Demo login
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <span className="text-sm text-muted-foreground">Commercial kit license</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} LaunchPad Web. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
