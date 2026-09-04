import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase-middleware';

const PROTECTED_ROUTES = ['/dashboard', '/settings', '/admin'];
const ADMIN_ROUTES = ['/admin'];

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

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth/login', request.url);
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAdminRoute && user) {
    const userRole = user.user_metadata?.role;
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
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
