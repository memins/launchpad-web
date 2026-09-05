import type Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase';
import {
  getInvoiceSubscriptionId,
  getStripe,
  getSubscriptionPeriodEndIso,
  getSubscriptionPriceId,
  resolvePlanName,
  stripeCustomerId,
} from '@/lib/stripe';
import { isUuid } from '@/lib/billing';
import type { SubscriptionInsert } from '@/lib/database.types';

const firstUuid = (...candidates: Array<string | null | undefined>) => {
  for (const candidate of candidates) {
    if (isUuid(candidate)) {
      return candidate;
    }
  }

  return null;
};

export const resolveUserIdForCustomer = async (params: {
  metadataUserId?: string | null;
  clientReferenceId?: string | null;
  customerId?: string | null;
}) => {
  const fromMeta = firstUuid(params.metadataUserId, params.clientReferenceId);
  if (fromMeta) {
    return fromMeta;
  }

  if (!params.customerId) {
    return null;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', params.customerId)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not look up billing row: ${error.message}`);
  }

  return data?.user_id ?? null;
};

export const upsertSubscription = async (row: SubscriptionInsert) => {
  const admin = createAdminClient();
  const { error } = await admin.from('subscriptions').upsert(row, { onConflict: 'user_id' });

  if (error) {
    throw new Error(`Could not persist billing state: ${error.message}`);
  }
};

export const rememberStripeCustomer = async (params: {
  userId: string;
  customerId: string;
}) => {
  const admin = createAdminClient();
  const { data: existing, error: readError } = await admin
    .from('subscriptions')
    .select('id')
    .eq('user_id', params.userId)
    .maybeSingle();

  if (readError) {
    throw new Error(`Could not read billing row: ${readError.message}`);
  }

  if (existing) {
    const { error } = await admin
      .from('subscriptions')
      .update({ stripe_customer_id: params.customerId })
      .eq('user_id', params.userId);

    if (error) {
      throw new Error(`Could not store Stripe customer: ${error.message}`);
    }

    return;
  }

  await upsertSubscription({
    user_id: params.userId,
    stripe_customer_id: params.customerId,
    status: 'none',
  });
};

export const syncStripeSubscription = async (
  subscription: Stripe.Subscription,
  extras?: { userId?: string | null; planName?: string | null }
) => {
  const customerId = stripeCustomerId(subscription.customer);
  const userId =
    extras?.userId ??
    (await resolveUserIdForCustomer({
      metadataUserId: subscription.metadata?.user_id,
      customerId,
    }));

  if (!userId || !customerId) {
    throw new Error('Stripe subscription event is missing user_id or customer id');
  }

  const priceId = getSubscriptionPriceId(subscription);
  const planName = extras?.planName ?? (await resolvePlanName(getStripe(), priceId));

  await upsertSubscription({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    status: subscription.status,
    plan_name: planName,
    current_period_end: getSubscriptionPeriodEndIso(subscription),
    cancel_at_period_end: subscription.cancel_at_period_end,
  });
};

const grantOneTimeAccess = async (session: Stripe.Checkout.Session) => {
  const customerId = stripeCustomerId(session.customer);
  const userId = await resolveUserIdForCustomer({
    metadataUserId: session.metadata?.user_id,
    clientReferenceId: session.client_reference_id,
    customerId,
  });

  if (!userId || !customerId) {
    throw new Error('Checkout session is missing user_id or customer id');
  }

  const priceId =
    session.metadata?.price_id ||
    (typeof session.line_items?.data[0]?.price === 'object'
      ? session.line_items.data[0]?.price?.id
      : null) ||
    process.env.STRIPE_PRICE_ID ||
    null;
  const planName = await resolvePlanName(getStripe(), priceId);

  await upsertSubscription({
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: null,
    stripe_price_id: priceId,
    status: 'active',
    plan_name: planName,
    current_period_end: null,
    cancel_at_period_end: false,
  });
};

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
    return;
  }

  if (session.mode === 'subscription') {
    const stripe = getStripe();
    const subscriptionId =
      typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error('Subscription Checkout completed without a subscription id');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const userId = firstUuid(session.metadata?.user_id, session.client_reference_id);
    await syncStripeSubscription(subscription, { userId });
    return;
  }

  if (session.mode === 'payment') {
    await grantOneTimeAccess(session);
  }
};

const handleInvoiceEvent = async (invoice: Stripe.Invoice) => {
  const subscriptionId = getInvoiceSubscriptionId(invoice);
  if (!subscriptionId) {
    return;
  }

  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  await syncStripeSubscription(subscription);
};

/**
 * Persist the "has access / plan" row from Stripe events.
 * Throws on persistence failure so the route can 500 and Stripe will retry.
 */
export const handleStripeEvent = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      return;
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await syncStripeSubscription(event.data.object as Stripe.Subscription);
      return;
    case 'invoice.paid':
    case 'invoice.payment_failed':
      await handleInvoiceEvent(event.data.object as Stripe.Invoice);
      return;
    default:
      return;
  }
};
