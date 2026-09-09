'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const LocaleLandingPage = () => {
  const commonT = useTranslations('common');
  const homeT = useTranslations('home');

  const features = [
    {
      title: homeT('features.feature1.title'),
      description: homeT('features.feature1.description'),
    },
    {
      title: homeT('features.feature2.title'),
      description: homeT('features.feature2.description'),
    },
    {
      title: homeT('features.feature3.title'),
      description: homeT('features.feature3.description'),
    },
  ];

  return (
    <div className="bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="text-xl font-bold">LaunchPad Web</div>
          <nav className="hidden space-x-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              {commonT('navigation.features')}
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              {commonT('navigation.pricing')}
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Link
              href="/auth/login"
              className="rounded-md px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            >
              {commonT('navigation.login')}
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
            >
              {commonT('navigation.signup')}
            </Link>
            <div className="ml-2 border-l border-border pl-2">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tighter sm:text-5xl md:text-6xl">
            {homeT('hero.title')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            {homeT('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Link
              href="/auth/register"
              className="flex w-full items-center justify-center rounded-md bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              {commonT('buttons.getStarted')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="https://github.com/memins/launchpad-web"
              className="flex w-full items-center justify-center rounded-md bg-card px-8 py-3 text-base font-medium text-foreground shadow-sm ring-1 ring-inset ring-border hover:bg-muted sm:w-auto"
              target="_blank"
              rel="noopener noreferrer"
            >
              {commonT('buttons.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">{homeT('features.title')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              {homeT('features.subtitle')}
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
          <div className="rounded-lg border border-primary bg-card p-8 shadow-md">
            <h3 className="text-xl font-semibold">LaunchPad Web</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">$99</span>
              <span className="ml-2 text-muted-foreground">one-time</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{homeT('hero.subtitle')}</p>
            <ul className="mt-6 space-y-3">
              {features.map((feature) => (
                <li key={feature.title} className="flex items-start">
                  <CheckCircle className="mr-2 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-sm text-muted-foreground">{feature.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/auth/register"
                className="block w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {commonT('buttons.getStarted')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          {commonT('footer.copyright')}
        </div>
      </footer>
    </div>
  );
};

export default LocaleLandingPage;
