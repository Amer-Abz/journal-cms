import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

// Explicitly point to the i18n configuration file
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
