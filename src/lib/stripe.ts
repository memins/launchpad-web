import Stripe from 'stripe';

/**
 * Server-side Stripe client. Used by Checkout, Customer Portal, and webhooks.
 * Do not import this module from Client Components.
 */
export const getStripe = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error('Stripe requires STRIPE_SECRET_KEY environment variable');
  }

  return new Stripe(stripeSecretKey, {
    appInfo: {
      name: 'LaunchPad Web',
      version: '0.1.0',
    },
  });
};

/**
 * Publishable key for client-side Stripe.js / embedded Checkout.
 * Hosted Checkout (this kit) only needs the secret key on the server.
 */
export const getPublishableKey = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Stripe requires NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
  }

  return publishableKey;
};

export const getStripePriceId = () => {
  const priceId = process.env.STRIPE_PRICE_ID?.trim();
  return priceId && priceId.length > 0 ? priceId : null;
};

export const getStripeWebhookSecret = () => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  return secret && secret.length > 0 ? secret : null;
};

export const getAppUrl = () => {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return (url && url.length > 0 ? url : 'http://localhost:3000').replace(/\/$/, '');
};

/**
 * Secret key + price id are enough to start hosted Checkout.
 * The publishable key is optional until you embed Stripe.js.
 */
export const isStripeCheckoutConfigured = () =>
  Boolean(process.env.STRIPE_SECRET_KEY?.trim() && getStripePriceId());

export const stripeCustomerId = (customer: string | Stripe.Customer | Stripe.DeletedCustomer | null) => {
  if (!customer) {
    return null;
  }

  return typeof customer === 'string' ? customer : customer.id;
};

/**
 * Stripe API 2025+ moved period dates onto subscription items.
 */
export const getSubscriptionPeriodEndIso = (subscription: Stripe.Subscription) => {
  const itemPeriod = subscription.items.data[0]?.current_period_end;
  if (itemPeriod) {
    return new Date(itemPeriod * 1000).toISOString();
  }

  const legacy = (subscription as { current_period_end?: number }).current_period_end;
  if (legacy) {
    return new Date(legacy * 1000).toISOString();
  }

  return null;
};

export const getSubscriptionPriceId = (subscription: Stripe.Subscription) => {
  const price = subscription.items.data[0]?.price;
  if (!price) {
    return null;
  }

  return typeof price === 'string' ? price : price.id;
};

export const resolveCheckoutMode = (
  price: Stripe.Price
): Stripe.Checkout.SessionCreateParams.Mode =>
  price.type === 'recurring' ? 'subscription' : 'payment';

export const resolvePlanName = async (stripe: Stripe, priceId: string | null) => {
  if (!priceId) {
    return null;
  }

  const price = await stripe.prices.retrieve(priceId, { expand: ['product'] });
  if (price.nickname) {
    return price.nickname;
  }

  const product = price.product;
  if (typeof product === 'object' && product && !product.deleted && 'name' in product) {
    return product.name;
  }

  return null;
};

export const ensureStripeCustomer = async (params: {
  stripe: Stripe;
  userId: string;
  email?: string | null;
  existingCustomerId?: string | null;
}) => {
  if (params.existingCustomerId) {
    return params.existingCustomerId;
  }

  const customer = await params.stripe.customers.create({
    email: params.email || undefined,
    metadata: { user_id: params.userId },
  });

  return customer.id;
};

export const createCheckoutSessionForUser = async (params: {
  userId: string;
  email?: string | null;
  existingCustomerId?: string | null;
  priceId: string;
}) => {
  const stripe = getStripe();
  const price = await stripe.prices.retrieve(params.priceId);
  const mode = resolveCheckoutMode(price);
  const customerId = await ensureStripeCustomer({
    stripe,
    userId: params.userId,
    email: params.email,
    existingCustomerId: params.existingCustomerId,
  });
  const appUrl = getAppUrl();

  const session = await stripe.checkout.sessions.create({
    mode,
    customer: customerId,
    client_reference_id: params.userId,
    line_items: [{ price: params.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/billing?success=1`,
    cancel_url: `${appUrl}/dashboard/billing?canceled=1`,
    allow_promotion_codes: true,
    metadata: { user_id: params.userId, price_id: params.priceId },
    ...(mode === 'subscription'
      ? { subscription_data: { metadata: { user_id: params.userId } } }
      : { payment_intent_data: { metadata: { user_id: params.userId } } }),
  });

  return { session, customerId, mode };
};

export const createBillingPortalSession = async (customerId: string) => {
  const stripe = getStripe();

  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${getAppUrl()}/dashboard/billing`,
  });
};

export const getInvoiceSubscriptionId = (invoice: Stripe.Invoice) => {
  const fromParent = invoice.parent?.subscription_details?.subscription;
  if (typeof fromParent === 'string') {
    return fromParent;
  }

  if (fromParent && typeof fromParent === 'object' && 'id' in fromParent) {
    return fromParent.id;
  }

  const legacy = (invoice as { subscription?: string | { id: string } | null }).subscription;
  if (typeof legacy === 'string') {
    return legacy;
  }

  if (legacy && typeof legacy === 'object' && 'id' in legacy) {
    return legacy.id;
  }

  return null;
};
