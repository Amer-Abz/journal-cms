'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useRouter, usePathname} from 'next-intl/client';
import { ChangeEvent } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    router.replace(pathname, {locale: nextLocale});
  };

  return (
    <div className="p-4">
      <label htmlFor="language-select" className="sr-only">{t('changeTo', {language: ''})} </label>
      <select
        id="language-select"
        defaultValue={locale}
        onChange={onSelectChange}
        className="border border-gray-300 rounded-md p-2"
      >
        <option value="en">{t('changeTo', {language: 'English'})} (English)</option>
        <option value="ar">{t('changeTo', {language: 'العربية'})} (العربية)</option>
      </select>
    </div>
  );
}
