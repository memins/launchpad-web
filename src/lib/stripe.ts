import Stripe from 'stripe';

/**
 * Server-side Stripe client. Checkout + webhooks are intentionally not wired yet.
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
 * Publishable key for client-side Stripe.js / Checkout.
 */
export const getPublishableKey = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error('Stripe requires NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
  }

  return publishableKey;
};
