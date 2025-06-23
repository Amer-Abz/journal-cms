import {
  createLocalizedPathnamesNavigation
} from 'next-intl/navigation';

export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en';

// Define any pathnames that should be localized.
// For now, we might not have specific ones beyond what next-intl handles by default with middleware.
// Example:
// export const pathnames = {
//   '/': '/',
//   '/about': {
//     en: '/about',
//     ar: '/about-ar' // Example if you wanted different slugs
//   }
// } as const;

// If you don't have specific localized pathnames beyond simple prefixing,
// you might not need to pass pathnames or localePrefix to createLocalizedPathnamesNavigation,
// as middleware handles prefixing.
// However, to use the typed navigation, we still call it.
// For simplicity, if pathnames are not complex, you can omit them.
// The `localePrefix` option can be 'as-needed' (default), 'always', or 'never'.
// It should align with your middleware settings. Our middleware implies 'as-needed' or 'always'.

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    // pathnames, // Uncomment if you have specific pathnames to localize
    localePrefix: undefined // Or 'as-needed', 'always'. `undefined` uses default.
    // For `next-intl` v3+, `localePrefix` might not be needed here if middleware handles it.
    // Let's rely on the default behavior first.
  });
