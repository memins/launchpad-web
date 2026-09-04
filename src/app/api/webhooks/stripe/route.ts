import { NextResponse } from 'next/server';
import { handleStripeEvent } from '@/lib/billing-sync';
import { getStripe, getStripeWebhookSecret } from '@/lib/stripe';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Stripe webhook. Middleware excludes `/api/webhooks/*` so this stays cookie-free.
 * Always verify the signature against the raw body before touching billing state.
 */
export const POST = async (request: Request) => {
  const webhookSecret = getStripeWebhookSecret();
  if (!webhookSecret) {
    return NextResponse.json({ error: 'STRIPE_WEBHOOK_SECRET is not set' }, { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event;
  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature failed:', error);
    return NextResponse.json({ error: 'Invalid Stripe signature' }, { status: 400 });
  }

  try {
    await handleStripeEvent(event);
  } catch (error) {
    console.error(`Stripe webhook handler failed (${event.type}):`, error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
};
