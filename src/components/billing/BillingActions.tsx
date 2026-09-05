'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/Toaster';

type BillingActionsProps = {
  showCheckout: boolean;
  showPortal: boolean;
  checkoutLabel?: string;
};

const startStripeRedirect = async (path: string) => {
  const response = await fetch(path, { method: 'POST' });
  const payload = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

  if (!response.ok || !payload.url) {
    throw new Error(payload.error || 'Stripe request failed');
  }

  window.location.href = payload.url;
};

const BillingActions = ({
  showCheckout,
  showPortal,
  checkoutLabel = 'Upgrade',
}: BillingActionsProps) => {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<'checkout' | 'portal' | 'refresh' | null>(
    null
  );

  const handleCheckout = async () => {
    setPendingAction('checkout');
    try {
      await startStripeRedirect('/api/stripe/checkout');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Could not start checkout');
      setPendingAction(null);
    }
  };

  const handlePortal = async () => {
    setPendingAction('portal');
    try {
      await startStripeRedirect('/api/stripe/portal');
    } catch (error) {
      console.error('Portal error:', error);
      toast.error(error instanceof Error ? error.message : 'Could not open the billing portal');
      setPendingAction(null);
    }
  };

  const handleRefresh = () => {
    setPendingAction('refresh');
    router.refresh();
    window.setTimeout(() => setPendingAction(null), 400);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {showCheckout && (
        <button
          type="button"
          onClick={handleCheckout}
          disabled={pendingAction !== null}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
        >
          {pendingAction === 'checkout' ? (
            <Loader2 size={18} className="mr-2 animate-spin" aria-hidden="true" />
          ) : (
            <CreditCard size={18} className="mr-2" aria-hidden="true" />
          )}
          {checkoutLabel}
        </button>
      )}

      {showPortal && (
        <button
          type="button"
          onClick={handlePortal}
          disabled={pendingAction !== null}
          className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
        >
          {pendingAction === 'portal' ? (
            <Loader2 size={18} className="mr-2 animate-spin" aria-hidden="true" />
          ) : (
            <ExternalLink size={18} className="mr-2" aria-hidden="true" />
          )}
          Manage billing
        </button>
      )}

      <button
        type="button"
        onClick={handleRefresh}
        disabled={pendingAction !== null}
        className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
      >
        {pendingAction === 'refresh' ? (
          <Loader2 size={18} className="mr-2 animate-spin" aria-hidden="true" />
        ) : (
          <RefreshCw size={18} className="mr-2" aria-hidden="true" />
        )}
        Refresh status
      </button>
    </div>
  );
};

export default BillingActions;
