import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from '../../i18n';

const isLocale = (value: string | undefined): value is (typeof locales)[number] =>
  !!value && locales.includes(value);

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
