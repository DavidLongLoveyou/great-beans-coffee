import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import '../globals.css';
import { type Locale } from '@/i18n';
import Footer from '@/presentation/components/layout/Footer';
import Header from '@/presentation/components/layout/Header';
import { PerformanceInitializer } from '@/shared/components/performance/PerformanceInitializer';
import { PerformanceMonitor } from '@/shared/components/performance/PerformanceMonitor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Great Beans - Premium Vietnamese Coffee Exports',
  description:
    'Leading B2B platform for Vietnamese coffee exports. Premium Robusta, Arabica, and specialty blends for global importers, roasters, and distributors.',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Use next-intl's built-in getMessages which is already configured in i18n.ts
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <PerformanceInitializer />
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex min-h-screen flex-col">
            <Header locale={locale as Locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale as Locale} />
          </div>
        </NextIntlClientProvider>
        <PerformanceMonitor />
      </body>
    </html>
  );
}
