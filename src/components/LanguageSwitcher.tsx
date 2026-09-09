'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales } from '../../i18n';

const languageNames: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
};

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    const segments = pathname.split('/');

    if (segments.length > 1) {
      segments[1] = newLocale;
    }

    router.push(segments.join('/'));
  };

  return (
    <label className="flex items-center">
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        value={locale}
        onChange={(event) => handleLocaleChange(event.target.value)}
        className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {languageNames[code]}
          </option>
        ))}
      </select>
    </label>
  );
};

export default LanguageSwitcher;
