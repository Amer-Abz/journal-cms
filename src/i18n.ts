import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // Fallback locale if undefined, for diagnostics or resilience
  const currentLocale = locale && ['en', 'ar'].includes(locale) ? locale : 'en';
  return {
    messages: (await import(`../messages/${currentLocale}.json`)).default,
    locale: currentLocale // Ensure the determined locale is returned to next-intl
  };
});
