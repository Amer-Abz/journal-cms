import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Inter } from "next/font/google"; // Assuming this is still wanted from default setup

// If you have a global CSS file, import it here.
import '../globals.css'; // Adjusted path

const inter = Inter({ subsets: ["latin"] });

export default async function LocaleLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // Providing all messages to the client
  // side is a simple way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// It's good practice to also define metadata generation for localized layouts
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  // You can use a translation file for this if needed
  const title = locale === 'ar' ? 'موقعي' : 'My Site';
  const description = locale === 'ar' ? 'وصف موقعي' : 'My site description';

  return {
    title,
    description,
  };
}

// Define static params for locales to enable static generation if desired
export async function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'ar'}];
}
