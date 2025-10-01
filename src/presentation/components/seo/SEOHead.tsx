'use client';

import Head from 'next/head';
import { type ReactElement } from 'react';

import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  type SEOProps,
} from '@/shared/utils/seo-utils';

import { StructuredData } from './StructuredData';

// Type for structured data objects
type StructuredDataObject = Record<string, unknown>;

interface SEOHeadProps extends SEOProps {
  structuredData?: StructuredDataObject | Array<StructuredDataObject>;
  breadcrumbs?: Array<{ name: string; url: string }>;
  includeOrganization?: boolean;
}

/**
 * Comprehensive SEO component that handles both metadata and structured data
 * Should be used in page components for optimal SEO
 */
export function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  locale = 'en',
  alternateLocales,
  noIndex = false,
  canonical,
  structuredData,
  breadcrumbs,
  includeOrganization = true,
}: SEOHeadProps): ReactElement {
  // Prepare all structured data
  const allStructuredData: Array<StructuredDataObject> = [];

  // Add organization schema
  if (includeOrganization) {
    allStructuredData.push(generateOrganizationSchema());
  }

  // Add breadcrumbs schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    allStructuredData.push(generateBreadcrumbSchema(breadcrumbs));
  }

  // Add custom structured data
  if (structuredData) {
    if (Array.isArray(structuredData)) {
      allStructuredData.push(...structuredData);
    } else {
      allStructuredData.push(structuredData);
    }
  }

  // Add article schema if we have article-specific data
  if (
    type === 'article' &&
    (author || publishedTime || modifiedTime || section || tags)
  ) {
    const articleSchema: StructuredDataObject = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      url: url,
    };

    if (author) articleSchema.author = { '@type': 'Person', name: author };
    if (publishedTime) articleSchema.datePublished = publishedTime;
    if (modifiedTime) articleSchema.dateModified = modifiedTime;
    if (section) articleSchema.articleSection = section;
    if (tags)
      articleSchema.keywords = Array.isArray(tags) ? tags.join(', ') : tags;
    if (image) articleSchema.image = image;

    allStructuredData.push(articleSchema);
  }

  return (
    <>
      {/* Structured Data */}
      {allStructuredData.length > 0 && (
        <StructuredData data={allStructuredData} />
      )}

      {/* Additional meta tags that Next.js metadata API doesn't cover */}
      <Head>
        {/* Language and locale meta tags */}
        <meta httpEquiv="content-language" content={locale} />

        {/* Canonical URL if provided */}
        {canonical && <link rel="canonical" href={canonical} />}

        {/* Robots meta tag */}
        {noIndex && <meta name="robots" content="noindex, nofollow" />}

        {/* Alternate language links */}
        {alternateLocales &&
          alternateLocales.map(altLocale => (
            <link
              key={altLocale}
              rel="alternate"
              hrefLang={altLocale}
              href={url ? url.replace(`/${locale}/`, `/${altLocale}/`) : ''}
            />
          ))}

        {/* Article-specific meta tags */}
        {type === 'article' && author && (
          <meta name="author" content={author} />
        )}
        {type === 'article' && publishedTime && (
          <meta property="article:published_time" content={publishedTime} />
        )}
        {type === 'article' && modifiedTime && (
          <meta property="article:modified_time" content={modifiedTime} />
        )}
        {type === 'article' && section && (
          <meta property="article:section" content={section} />
        )}
        {type === 'article' && tags && (
          <>
            {Array.isArray(tags) ? (
              tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
              ))
            ) : (
              <meta property="article:tag" content={tags} />
            )}
          </>
        )}
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Keywords meta tag */}
        {keywords && <meta name="keywords" content={keywords} />}

        {/* Geo meta tags */}
        <meta name="geo.region" content="VN" />
        <meta name="geo.placename" content="Ho Chi Minh City" />
        <meta name="geo.position" content="10.8231;106.6297" />
        <meta name="ICBM" content="10.8231, 106.6297" />

        {/* Business meta tags */}
        <meta
          name="business:contact_data:street_address"
          content="123 Coffee Street"
        />
        <meta
          name="business:contact_data:locality"
          content="Ho Chi Minh City"
        />
        <meta name="business:contact_data:region" content="Ho Chi Minh" />
        <meta name="business:contact_data:postal_code" content="700000" />
        <meta name="business:contact_data:country_name" content="Vietnam" />
        <meta
          name="business:contact_data:email"
          content="info@thegreatbeans.com"
        />
        <meta
          name="business:contact_data:phone_number"
          content="+84-123-456-789"
        />

        {/* Additional SEO meta tags */}
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="revisit-after" content="7 days" />

        {/* Verification tags (to be replaced with actual values) */}
        {/* <meta name="google-site-verification" content="your-google-verification-code" /> */}
        {/* <meta name="msvalidate.01" content="your-bing-verification-code" /> */}

        {/* Structured data for local business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://thegreatbeans.com/#business',
              name: 'The Great Beans',
              image: 'https://thegreatbeans.com/images/logo.png',
              telephone: '+84-123-456-789',
              email: 'info@thegreatbeans.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '123 Coffee Street',
                addressLocality: 'Ho Chi Minh City',
                addressRegion: 'Ho Chi Minh',
                postalCode: '700000',
                addressCountry: 'VN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 10.8231,
                longitude: 106.6297,
              },
              url: 'https://thegreatbeans.com',
              sameAs: [
                'https://www.facebook.com/thegreatbeans',
                'https://www.linkedin.com/company/thegreatbeans',
                'https://twitter.com/thegreatbeans',
              ],
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                ],
                opens: '08:00',
                closes: '18:00',
              },
            }),
          }}
        />
      </Head>
    </>
  );
}

export default SEOHead;
