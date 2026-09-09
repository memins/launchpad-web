import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

// Avoid prerendering a cookie-backed Supabase client at build time.
export const dynamic = 'force-dynamic';

/**
 * First-run wizard. Middleware keeps signed-out users out and sends
 * completed users to /dashboard so this page is only for new sessions.
 */
const OnboardingPage = () => {
  return <OnboardingWizard />;
};

export default OnboardingPage;
