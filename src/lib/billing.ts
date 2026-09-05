import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, SubscriptionRow } from '@/lib/database.types';

export type Subscription = SubscriptionRow;

export const ACCESS_STATUSES = ['active', 'trialing'] as const;

export type AccessStatus = (typeof ACCESS_STATUSES)[number];

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUuid = (value: string | null | undefined): value is string =>
  Boolean(value && UUID_RE.test(value));

export const hasActiveAccess = (subscription: Pick<Subscription, 'status'> | null | undefined) =>
  Boolean(subscription && ACCESS_STATUSES.includes(subscription.status as AccessStatus));

export const formatBillingStatus = (status: string | null | undefined) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'trialing':
      return 'Trialing';
    case 'past_due':
      return 'Past due';
    case 'canceled':
      return 'Canceled';
    case 'unpaid':
      return 'Unpaid';
    case 'incomplete':
      return 'Incomplete';
    case 'incomplete_expired':
      return 'Expired';
    case 'paused':
      return 'Paused';
    case 'none':
    case undefined:
    case null:
    case '':
      return 'Free';
    default:
      return status.replace(/_/g, ' ');
  }
};

export const formatPeriodEnd = (iso: string | null | undefined) => {
  if (!iso) {
    return null;
  }

  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Load the signed-in user's billing row. A missing table (SQL not run yet)
 * is non-fatal — the UI treats that as "no plan".
 */
export const fetchOwnSubscription = async (supabase: SupabaseClient<Database>) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, subscription: null, error: userError?.message ?? 'Not signed in' };
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return { user, subscription: null, error: error.message };
  }

  return { user, subscription: data, error: null };
};
