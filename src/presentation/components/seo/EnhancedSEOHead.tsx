'use client';

import Head from 'next/head';
import { type ReactElement } from 'react';

import { type Locale } from '@/i18n';
import {
  generateWebSiteSchema,
  generateMultilingualArticleSchema,
  generateB2BProductSchema,
  generateB2BServiceSchema,
} from '@/shared/utils/enhanced-structured-data';
import {
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  type SEOProps,
} from '@/shared/utils/seo-utils';

// Type for structured data objects
type StructuredDataObject = Record<string, unknown>;

import { HreflangTags } from './HreflangTags';
import { StructuredData } from './StructuredData';

interface EnhancedSEOHeadProps extends SEOProps {
  // Content-specific data
  contentType?: 'website' | 'article' | 'product' | 'service' | 'collection';
  contentData?: {
    // Article data
    article?: {
      id: string;
      title: string;
      description: string;
      images: string[];
      author: string;
      publishedAt: string;
      modifiedAt?: string;
      wordCount?: number;
      section?: string;
      keywords?: string[];
      alternateVersions?: Array<{ locale: string; url: string }>;
    };
    // Product data
    product?: {
      id: string;
      name: string;
      description: string;
      images: string[];
      category: string;
      sku?: string;
      origin: string;
      certifications?: Array<{
        name: string;
        identifier: string;
        issuer: string;
      }>;
      minOrderQuantity: number;
      unitOfMeasure: string;
      leadTime: { min: number; max: number };
      targetMarkets: string[];
      incoterms?: string[];
    };
    // Service data
    service?: {
      id: string;
      name: string;
      description: string;
      serviceType: string;
      category: string;
      features: string[];
      leadTime: { min: number; max: number };
      targetMarkets: string[];
      certifications?: string[];
    };
  };

  // SEO enhancements
  breadcrumbs?: Array<{ name: string; url: string }>;
  includeOrganization?: boolean;
  includeWebSite?: boolean;
  customStructuredData?: StructuredDataObject | Array<StructuredDataObject>;

  // Hreflang configuration
  excludeLocales?: Locale[];
  pathname: string;
}

/**
 * Enhanced SEO component with comprehensive B2B features
 * Includes hreflang, advanced structured data, and multilingual support
 */
export function EnhancedSEOHead({
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
  contentType = 'website',
  contentData,
  breadcrumbs,
  includeOrganization = true,
  includeWebSite = true,
  customStructuredData,
  excludeLocales = [],
  pathname,
}: EnhancedSEOHeadProps): ReactElement {
  // Prepare all structured data
  const allStructuredData: Array<StructuredDataObject> = [];

  // Add WebSite schema
  if (includeWebSite) {
    allStructuredData.push(generateWebSiteSchema(locale));
  }

  // Add organization schema
  if (includeOrganization) {
    allStructuredData.push(generateOrganizationSchema());
  }

  // Add breadcrumbs schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    allStructuredData.push(generateBreadcrumbSchema(breadcrumbs));
  }

  // Add content-specific structured data
  if (contentType === 'article' && contentData?.article) {
    allStructuredData.push(
      generateMultilingualArticleSchema(contentData.article, locale)
    );
  } else if (contentType === 'product' && contentData?.product) {
    allStructuredData.push(
      generateB2BProductSchema(contentData.product, locale)
    );
  } else if (contentType === 'service' && contentData?.service) {
    allStructuredData.push(
      generateB2BServiceSchema(contentData.service, locale)
    );
  }

  // Add custom structured data
  if (customStructuredData) {
    if (Array.isArray(customStructuredData)) {
      allStructuredData.push(...customStructuredData);
    } else {
      allStructuredData.push(customStructuredData);
    }
  }

  return (
    <>
      {/* Hreflang Tags */}
      <HreflangTags
        currentLocale={locale}
        pathname={pathname}
        excludeLocales={excludeLocales}
      />

      {/* Structured Data */}
      {allStructuredData.length > 0 && (
        <StructuredData data={allStructuredData} />
      )}

      {/* Basic meta tags */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        {keywords && <meta name="keywords" content={keywords} />}
        {canonical && <link rel="canonical" href={canonical} />}
        {url && <meta property="og:url" content={url} />}
        {image && <meta property="og:image" content={image} />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        <meta property="og:locale" content={locale} />

        {/* Article-specific meta tags */}
        {type === 'article' && (
          <>
            {author && <meta name="author" content={author} />}
            {publishedTime && (
              <meta property="article:published_time" content={publishedTime} />
            )}
            {modifiedTime && (
              <meta property="article:modified_time" content={modifiedTime} />
            )}
            {section && <meta property="article:section" content={section} />}
            {tags &&
              tags.map(tag => (
                <meta
                  key={`article-tag-${tag}`}
                  property="article:tag"
                  content={tag}
                />
              ))}
          </>
        )}

        {/* Robots meta tag */}
        <meta
          name="robots"
          content={noIndex ? 'noindex,nofollow' : 'index,follow'}
        />

        {/* Language and alternate locales */}
        <meta httpEquiv="content-language" content={locale} />
        {alternateLocales &&
          alternateLocales.map(altLocale => (
            <link
              key={`alternate-${altLocale}`}
              rel="alternate"
              hrefLang={altLocale}
              href={`/${altLocale}${pathname}`}
            />
          ))}

        {/* Additional meta tags for enhanced SEO */}
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Geo targeting */}
        <meta name="geo.region" content="VN" />
        <meta name="geo.placename" content="Ho Chi Minh City" />
        <meta name="geo.position" content="10.8231;106.6297" />
        <meta name="ICBM" content="10.8231, 106.6297" />

        {/* Business information */}
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

        {/* Content language */}
        <meta httpEquiv="content-language" content={locale} />

        {/* Mobile optimization */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="format-detection" content="address=yes" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        {/* Referrer policy */}
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#8B4513" />
        <meta name="msapplication-TileColor" content="#8B4513" />

        {/* Apple-specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="The Great Beans" />

        {/* Microsoft-specific meta tags */}
        <meta
          name="msapplication-tooltip"
          content="Premium Vietnamese Coffee Exporter"
        />
        <meta name="msapplication-starturl" content={`/${locale}`} />

        {/* Content-specific meta tags */}
        {contentType === 'article' && (
          <>
            <meta name="article:author" content={author} />
            <meta name="article:published_time" content={publishedTime} />
            {modifiedTime && (
              <meta name="article:modified_time" content={modifiedTime} />
            )}
            {section && <meta name="article:section" content={section} />}
            {tags?.map(tag => (
              <meta key={`meta-tag-${tag}`} name="article:tag" content={tag} />
            ))}
          </>
        )}

        {contentType === 'product' && contentData?.product && (
          <>
            <meta name="product:brand" content="The Great Beans" />
            <meta name="product:availability" content="in stock" />
            <meta name="product:condition" content="new" />
            <meta name="product:price:currency" content="USD" />
            <meta
              name="product:retailer_item_id"
              content={contentData.product.sku}
            />
          </>
        )}

        {/* B2B specific meta tags */}
        <meta name="target-audience" content="B2B" />
        <meta name="industry" content="Coffee, Food & Beverage, Agriculture" />
        <meta name="business-type" content="Exporter, Manufacturer, Supplier" />

        {/* Rich snippets hints */}
        <meta
          name="robots"
          content={
            noIndex
              ? 'noindex, nofollow'
              : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
          }
        />

        {/* Verification tags (to be filled with actual values) */}
        {/* <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" /> */}
        {/* <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" /> */}
        {/* <meta name="yandex-verification" content="YOUR_YANDEX_VERIFICATION_CODE" /> */}
      </Head>
    </>
  );
}

/**
 * Simplified version for basic pages
 */
export function BasicSEOHead({
  title,
  description,
  locale = 'en',
  pathname,
  noIndex = false,
}: {
  title: string;
  description: string;
  locale?: Locale;
  pathname: string;
  noIndex?: boolean;
}): ReactElement {
  return (
    <EnhancedSEOHead
      title={title}
      description={description}
      locale={locale}
      pathname={pathname}
      noIndex={noIndex}
      includeOrganization={true}
      includeWebSite={true}
    />
  );
}
