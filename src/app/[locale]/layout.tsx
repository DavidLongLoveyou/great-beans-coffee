import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import '../globals.css';
import '../../styles/fonts.css';
import { type Locale } from '@/i18n';
import Footer from '@/presentation/components/layout/Footer';
import Header from '@/presentation/components/layout/Header';
import { PerformanceInitializer } from '@/shared/components/performance/PerformanceInitializer';
import { PerformanceMonitor } from '@/shared/components/performance/PerformanceMonitor';

// Configure fonts with Next.js optimization
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

// Playfair Display is now loaded locally via fonts.css

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  preload: false, // Only preload if used above the fold
});

export const metadata: Metadata = {
  title: {
    default: 'The Great Beans - Premium Vietnamese Coffee Exports',
    template: '%s | The Great Beans',
  },
  description:
    'Leading B2B platform for Vietnamese coffee exports. Premium Robusta, Arabica, and specialty blends for global importers, roasters, and distributors.',
  keywords: [
    'Vietnamese coffee',
    'Robusta coffee beans',
    'Arabica coffee Vietnam',
    'Coffee exporter',
    'Premium coffee beans',
    'Sustainable coffee',
    'Coffee supplier',
    'Private label coffee',
    'Specialty coffee Vietnam',
    'Coffee import export',
    'B2B coffee platform',
    'Coffee roasters',
    'Coffee distributors',
  ],
  authors: [{ name: 'The Great Beans' }],
  creator: 'The Great Beans',
  publisher: 'The Great Beans',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thegreatbeans.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'vi-VN': '/vi',
      'de-DE': '/de',
      'ja-JP': '/ja',
      'fr-FR': '/fr',
      'it-IT': '/it',
      'es-ES': '/es',
      'nl-NL': '/nl',
      'ko-KR': '/ko',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thegreatbeans.com',
    siteName: 'The Great Beans',
    title: 'The Great Beans - Premium Vietnamese Coffee Exports',
    description:
      'Leading B2B platform for Vietnamese coffee exports. Premium Robusta, Arabica, and specialty blends for global importers, roasters, and distributors.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'The Great Beans - Premium Vietnamese Coffee',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thegreatbeans',
    creator: '@thegreatbeans',
    title: 'The Great Beans - Premium Vietnamese Coffee Exports',
    description:
      'Leading B2B platform for Vietnamese coffee exports. Premium Robusta, Arabica, and specialty blends for global importers, roasters, and distributors.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    yahoo: process.env.NEXT_PUBLIC_YAHOO_VERIFICATION,
  },
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
      <head>
        {/* Favicon and icons */}
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link
          rel="icon"
          href="/icon-192x192.png"
          type="image/svg+xml"
          sizes="192x192"
        />
        <link
          rel="icon"
          href="/icon-512x512.png"
          type="image/svg+xml"
          sizes="512x512"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />

        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Theme colors */}
        <meta name="theme-color" content="#8B4513" />
        <meta name="msapplication-TileColor" content="#8B4513" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="The Great Beans" />

        {/* Enhanced SEO meta tags */}
        <meta name="geo.region" content="VN" />
        <meta name="geo.placename" content="Ho Chi Minh City" />
        <meta name="geo.position" content="10.8231;106.6297" />
        <meta name="ICBM" content="10.8231, 106.6297" />

        {/* Business information */}
        <meta
          name="business:contact_data:street_address"
          content="123 Coffee Export Street"
        />
        <meta
          name="business:contact_data:locality"
          content="Ho Chi Minh City"
        />
        <meta name="business:contact_data:region" content="Ho Chi Minh" />
        <meta name="business:contact_data:postal_code" content="70000" />
        <meta name="business:contact_data:country_name" content="Vietnam" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Performance optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//api.vercel.com" />

        {/* Critical resource preloading */}
        <link
          rel="preload"
          href="/images/og-image.jpg"
          as="image"
          type="image/jpeg"
        />

        {/* Font preloading for better performance */}
        <link
          rel="preload"
          href="/fonts/playfair-display-v40-latin-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/playfair-display-v40-latin-700.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Resource hints for better performance */}
        <link rel="prefetch" href="/en/services" />
        <link rel="prefetch" href="/en/blog" />
        <link rel="prefetch" href="/en/market-reports" />
      </head>
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable}`}>
        <PerformanceInitializer />
        <NextIntlClientProvider messages={messages} locale={locale}>
          {/* Skip navigation links for accessibility */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Skip to main content
          </a>
          <a
            href="#navigation"
            className="sr-only focus:not-sr-only focus:absolute focus:left-40 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Skip to navigation
          </a>
          <div className="flex min-h-screen flex-col">
            <Header locale={locale as Locale} />
            <main id="main" className="flex-1" role="main" tabIndex={-1}>
              {children}
            </main>
            <Footer locale={locale as Locale} />
          </div>
        </NextIntlClientProvider>
        <PerformanceMonitor />
      </body>
    </html>
  );
}
