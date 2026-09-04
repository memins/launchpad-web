import type { Metadata } from 'next';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MarketingLanding from '@/components/marketing/MarketingLanding';
import { KIT_NAME, KIT_PRICE_LABEL } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    absolute: `${KIT_NAME} — ${KIT_PRICE_LABEL} Next.js SaaS ship kit`,
  },
  description:
    'Buy LaunchPad Web: a one-time Next.js 15 + Supabase + Stripe kit with auth, onboarding, billing, and a dashboard. $99 on Gumroad.',
};

const LocaleLandingPage = () => {
  return <MarketingLanding headerExtra={<LanguageSwitcher />} />;
};

export default LocaleLandingPage;
