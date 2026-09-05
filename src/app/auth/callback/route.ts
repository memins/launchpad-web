import { NextRequest, NextResponse } from 'next/server';
import { hasCompletedOnboarding, resolvePostAuthPath } from '@/lib/auth-redirect';
import { isProfileOnboarded } from '@/lib/profile';
import { createServerSupabaseClient } from '@/lib/supabase-server';

/**
 * Exchange a Supabase Auth code (OAuth / magic link) for a cookie session,
 * then send first-timers to /onboarding instead of a blank dashboard.
 */
export const GET = async (request: NextRequest) => {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirectTo');

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && !hasCompletedOnboarding(user)) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed_at')
          .eq('id', user.id)
          .maybeSingle();

        if (isProfileOnboarded(profile)) {
          await supabase.auth.updateUser({
            data: { onboarding_completed: true },
          });

          const completedUser = {
            ...user,
            user_metadata: {
              ...user.user_metadata,
              onboarding_completed: true,
            },
          };

          return NextResponse.redirect(
            new URL(resolvePostAuthPath(completedUser, redirectTo), requestUrl.origin)
          );
        }
      }

      return NextResponse.redirect(
        new URL(resolvePostAuthPath(user, redirectTo), requestUrl.origin)
      );
    }
  }

  return NextResponse.redirect(new URL('/auth/login', request.url));
};
