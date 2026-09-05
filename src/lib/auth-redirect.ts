import type { User } from '@supabase/supabase-js';

export const ONBOARDING_PATH = '/onboarding';
export const DEFAULT_APP_PATH = '/dashboard';

/**
 * user_metadata.onboarding_completed is the fast gate used by middleware.
 * The profiles table is the durable source of truth (see persistOnboarding).
 */
export const hasCompletedOnboarding = (user: User | null | undefined) =>
  user?.user_metadata?.onboarding_completed === true;

export const isSafeInternalPath = (path: string | null | undefined): path is string => {
  if (!path) {
    return false;
  }

  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\');
};

export const resolvePostAuthPath = (user: User | null | undefined, requestedPath?: string | null) => {
  if (!hasCompletedOnboarding(user)) {
    return ONBOARDING_PATH;
  }

  if (isSafeInternalPath(requestedPath) && requestedPath !== ONBOARDING_PATH) {
    return requestedPath;
  }

  return DEFAULT_APP_PATH;
};

export const getDisplayName = (user: User | null | undefined, fallback = 'User') => {
  const fromMeta =
    (typeof user?.user_metadata?.display_name === 'string' && user.user_metadata.display_name) ||
    (typeof user?.user_metadata?.name === 'string' && user.user_metadata.name) ||
    (typeof user?.user_metadata?.full_name === 'string' && user.user_metadata.full_name);

  if (fromMeta && fromMeta.trim().length > 0) {
    return fromMeta.trim();
  }

  return user?.email?.split('@')[0] || fallback;
};

export const getWorkspaceName = (user: User | null | undefined) => {
  const value = user?.user_metadata?.workspace_name;
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
};
