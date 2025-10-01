import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { NextIntlProvider } from '@/components/providers/NextIntlProvider';
import { getMessages } from '@/lib/messages';
import { PerformanceMonitor } from '@/shared/components/performance/PerformanceMonitor';
import { PerformanceInitializer } from '@/shared/components/performance/PerformanceInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Great Beans - Premium Vietnamese Coffee Exports',
  description: 'Leading B2B platform for Vietnamese coffee exports. Premium Robusta, Arabica, and specialty blends for global importers, roasters, and distributors.',
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <PerformanceInitializer />
        <NextIntlProvider messages={messages} locale={locale}>
          {children}
        </NextIntlProvider>
        <PerformanceMonitor />
      </body>
    </html>
  );
}
