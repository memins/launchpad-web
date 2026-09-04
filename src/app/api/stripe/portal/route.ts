import { NextResponse } from 'next/server';
import { createBillingPortalSession } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export const POST = async () => {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Set STRIPE_SECRET_KEY.' },
      { status: 503 }
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to manage billing' }, { status: 401 });
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: 'Run the subscriptions SQL migration before opening the Customer Portal.' },
      { status: 503 }
    );
  }

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No Stripe customer yet. Subscribe first, then manage billing here.' },
      { status: 400 }
    );
  }

  try {
    const portal = await createBillingPortalSession(subscription.stripe_customer_id);
    return NextResponse.json({ url: portal.url });
  } catch (portalError) {
    console.error('Stripe Customer Portal error:', portalError);
    const message =
      portalError instanceof Error
        ? portalError.message
        : 'Could not open the Customer Portal. Enable it in Stripe → Settings → Billing → Customer portal.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
