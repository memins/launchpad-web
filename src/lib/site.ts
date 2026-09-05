/**
 * Public site constants for the LaunchPad Web kit storefront.
 *
 * Set `NEXT_PUBLIC_GUMROAD_URL` to the Gumroad product URL that sells this kit
 * (or, after you rebrand the homepage, the URL that sells *your* product).
 * Buyers swap the value in `.env.local` / Vercel — no code change required.
 */
export const KIT_NAME = 'LaunchPad Web';
export const KIT_PRICE = '$99';
export const KIT_PRICE_LABEL = '$99 one-time';
export const GITHUB_REPO_URL = 'https://github.com/memins/launchpad-web';

/** Public fallback when the env var is unset — replace it before you sell. */
export const DEFAULT_GUMROAD_URL = 'https://gumroad.com';

export const getGumroadUrl = () => {
  const configured = process.env.NEXT_PUBLIC_GUMROAD_URL?.trim();
  return configured && configured.length > 0 ? configured : DEFAULT_GUMROAD_URL;
};
