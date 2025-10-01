'use client';

import Head from 'next/head';
import { type ReactElement } from 'react';

import { locales, type Locale } from '@/i18n';
import { seoConfig } from '@/shared/utils/seo-utils';

interface HreflangTagsProps {
  currentLocale: Locale;
  pathname: string;
  excludeLocales?: Locale[];
}

/**
 * Generates hreflang tags for international SEO
 * Essential for multilingual sites to indicate language/region targeting
 */
export function HreflangTags({
  currentLocale,
  pathname,
  excludeLocales = [],
}: HreflangTagsProps): ReactElement {
  // Safety check for undefined pathname
  const safePath = pathname || '/';

  // Clean pathname to remove locale prefix if present
  const cleanPathname = safePath.startsWith(`/${currentLocale}`)
    ? safePath.replace(`/${currentLocale}`, '')
    : safePath;

  // Ensure pathname starts with /
  const normalizedPath = cleanPathname.startsWith('/')
    ? cleanPathname
    : `/${cleanPathname}`;

  // Filter out excluded locales
  const availableLocales = locales.filter(
    locale => !excludeLocales.includes(locale)
  );

  return (
    <Head>
      {/* Generate hreflang for each available locale */}
      {availableLocales.map(locale => (
        <link
          key={`hreflang-${locale}`}
          rel="alternate"
          hrefLang={locale}
          href={`${seoConfig.siteUrl}/${locale}${normalizedPath}`}
        />
      ))}

      {/* x-default hreflang for international targeting */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${seoConfig.siteUrl}/en${normalizedPath}`}
      />

      {/* Canonical link for the current page */}
      <link
        rel="canonical"
        href={`${seoConfig.siteUrl}/${currentLocale}${normalizedPath}`}
      />
    </Head>
  );
}

/**
 * Hook to generate hreflang URLs for use in metadata
 */
export function useHreflangUrls(
  pathname: string,
  excludeLocales: Locale[] = []
): Record<string, string> {
  const cleanPathname = pathname.replace(/^\/[a-z]{2}/, '');
  const normalizedPath = cleanPathname.startsWith('/')
    ? cleanPathname
    : `/${cleanPathname}`;

  const hreflangUrls: Record<string, string> = {};
  const availableLocales = locales.filter(
    locale => !excludeLocales.includes(locale)
  );

  // Generate URLs for all available locales
  availableLocales.forEach(locale => {
    hreflangUrls[locale] = `${seoConfig.siteUrl}/${locale}${normalizedPath}`;
  });

  // Add x-default
  hreflangUrls['x-default'] = `${seoConfig.siteUrl}/en${normalizedPath}`;

  return hreflangUrls;
}

/**
 * Utility to validate hreflang implementation
 */
export function validateHreflangUrls(urls: Record<string, string>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if x-default exists
  if (!urls['x-default']) {
    errors.push('Missing x-default hreflang');
  }

  // Check if all required locales are present
  const missingLocales = locales.filter(locale => !urls[locale]);
  if (missingLocales.length > 0) {
    errors.push(`Missing locales: ${missingLocales.join(', ')}`);
  }

  // Validate URL format
  Object.entries(urls).forEach(([locale, url]) => {
    try {
      new URL(url);
    } catch {
      errors.push(`Invalid URL for locale ${locale}: ${url}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}
