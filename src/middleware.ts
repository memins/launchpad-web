import { NextRequest, NextResponse } from 'next/server';
import {
  DEFAULT_APP_PATH,
  ONBOARDING_PATH,
  hasCompletedOnboarding,
  isSafeInternalPath,
} from '@/lib/auth-redirect';
import { updateSession } from '@/lib/supabase-middleware';

const PROTECTED_ROUTES = ['/dashboard', '/settings', '/admin', ONBOARDING_PATH];
const ADMIN_ROUTES = ['/admin'];
const APP_SHELL_ROUTES = ['/dashboard', '/settings', '/admin'];

const matchesPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));

const stripLocale = (pathname: string) => {
  const match = pathname.match(/^\/(en|de)(\/.*)?$/);
  if (!match) {
    return pathname;
  }
  return match[2] && match[2].length > 0 ? match[2] : '/';
};

export const middleware = async (request: NextRequest) => {
  const { supabase, supabaseResponse, user } = await updateSession(request);
  const pathname = stripLocale(request.nextUrl.pathname);

  const isProtectedRoute = matchesPrefix(pathname, PROTECTED_ROUTES);
  const isAdminRoute = matchesPrefix(pathname, ADMIN_ROUTES);
  const isAppShell = matchesPrefix(pathname, APP_SHELL_ROUTES);
  const isOnboarding = pathname === ONBOARDING_PATH;

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    const requested = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    if (isSafeInternalPath(requested)) {
      redirectUrl.searchParams.set('redirectTo', requested);
    }
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdminRoute && user) {
    const userRole = user.user_metadata?.role;
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL(DEFAULT_APP_PATH, request.url));
    }
  }

  // First-timers (and anyone who has not finished/skipped) stay in the wizard
  // instead of landing on an empty dashboard. Metadata is the fast gate;
  // persistOnboarding also writes public.profiles.
  if (user && isAppShell && !hasCompletedOnboarding(user)) {
    return NextResponse.redirect(new URL(ONBOARDING_PATH, request.url));
  }

  if (user && isOnboarding && hasCompletedOnboarding(user)) {
    return NextResponse.redirect(new URL(DEFAULT_APP_PATH, request.url));
  }

  // Keep the supabase client referenced so tree-shaking does not drop the session refresh.
  void supabase;

  return supabaseResponse;
};

export const config = {
  matcher: [
    '/((?!api/webhooks|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
