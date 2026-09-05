import { NextResponse } from 'next/server';
import { rememberStripeCustomer } from '@/lib/billing-sync';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createCheckoutSessionForUser, getStripePriceId, isStripeCheckoutConfigured } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

export const POST = async () => {
  if (!isStripeCheckoutConfigured()) {
    return NextResponse.json(
      { error: 'Stripe Checkout is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.' },
      { status: 503 }
    );
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Sign in to start checkout' }, { status: 401 });
  }

  const priceId = getStripePriceId();
  if (!priceId) {
    return NextResponse.json({ error: 'STRIPE_PRICE_ID is not set' }, { status: 503 });
  }

  const { data: existing } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  try {
    const { session, customerId } = await createCheckoutSessionForUser({
      userId: user.id,
      email: user.email,
      existingCustomerId: existing?.stripe_customer_id,
      priceId,
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe did not return a Checkout URL' }, { status: 502 });
    }

    try {
      await rememberStripeCustomer({ userId: user.id, customerId });
    } catch (persistError) {
      // Webhook still has metadata.user_id. Missing SQL should not block Checkout.
      console.error('Could not persist Stripe customer before redirect:', persistError);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Could not create Checkout Session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
