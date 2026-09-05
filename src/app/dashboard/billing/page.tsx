import { CheckCircle2, CircleAlert, CreditCard } from 'lucide-react';
import BillingActions from '@/components/billing/BillingActions';
import {
  fetchOwnSubscription,
  formatBillingStatus,
  formatPeriodEnd,
  hasActiveAccess,
} from '@/lib/billing';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

type BillingPageProps = {
  searchParams: Promise<{ success?: string; canceled?: string }>;
};

const BillingPage = async ({ searchParams }: BillingPageProps) => {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { subscription, error } = await fetchOwnSubscription(supabase);
  const checkoutReady = Boolean(
    process.env.STRIPE_SECRET_KEY?.trim() && process.env.STRIPE_PRICE_ID?.trim()
  );
  const hasAccess = hasActiveAccess(subscription);
  const planLabel = hasAccess ? subscription?.plan_name || 'Pro' : 'Free';
  const periodLabel = formatPeriodEnd(subscription?.current_period_end);
  const tableMissing = Boolean(error && /relation|schema cache|does not exist/i.test(error));

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing</h1>
        <p className="mt-1 text-muted-foreground">
          Current plan and Checkout for the users of your SaaS. This is not a full Stripe Billing
          portal clone — use Manage billing for invoices and cancellation.
        </p>
      </div>

      {params.success === '1' && (
        <div
          className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-200"
          role="status"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>
            Checkout finished. Access updates when the Stripe webhook lands — use Refresh status if
            this page still says Free.
          </p>
        </div>
      )}

      {params.canceled === '1' && (
        <div
          className="flex items-start gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
          role="status"
        >
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>Checkout was canceled. Nothing was charged.</p>
        </div>
      )}

      {!checkoutReady && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          Add <code className="font-mono">STRIPE_SECRET_KEY</code> and{' '}
          <code className="font-mono">STRIPE_PRICE_ID</code> to <code className="font-mono">.env.local</code>{' '}
          to enable Checkout. See the README Stripe section.
        </div>
      )}

      {tableMissing && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          Run <code className="font-mono">supabase/migrations/20240904220000_create_subscriptions.sql</code>{' '}
          in the Supabase SQL Editor so billing state can persist.
        </div>
      )}

      <section className="space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current plan</p>
            <p className="mt-1 text-2xl font-semibold">{planLabel}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <CreditCard className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd className="mt-1 font-medium">{formatBillingStatus(subscription?.status)}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">
              {subscription?.cancel_at_period_end ? 'Access through' : 'Renews / ends'}
            </dt>
            <dd className="mt-1 font-medium">
              {hasAccess && !periodLabel
                ? 'Lifetime (one-time)'
                : periodLabel || '—'}
            </dd>
          </div>
        </dl>

        {subscription?.cancel_at_period_end && hasAccess && (
          <p className="text-sm text-muted-foreground">
            Cancellation is scheduled. Access stays until the date above.
          </p>
        )}

        <BillingActions
          showCheckout={checkoutReady && !hasAccess}
          showPortal={checkoutReady && Boolean(subscription?.stripe_customer_id)}
          checkoutLabel={subscription?.status === 'canceled' ? 'Resubscribe' : 'Upgrade'}
        />
      </section>
    </div>
  );
};

export default BillingPage;
