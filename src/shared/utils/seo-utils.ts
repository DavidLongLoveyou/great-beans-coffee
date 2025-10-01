import { type Metadata } from 'next';

import { type Locale, locales } from '@/i18n';

// Utility function to generate clean path without locale prefix
export function generateCleanPath(url: string | undefined): string {
  let cleanPath = url || '';
  // Remove any existing locale prefix from the path
  for (const existingLocale of locales) {
    if (cleanPath.startsWith(`/${existingLocale}`)) {
      cleanPath = cleanPath.replace(`/${existingLocale}`, '');
      break;
    }
  }
  // Ensure path starts with / if not empty
  if (cleanPath && !cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }
  return cleanPath;
}

// Utility function to generate hreflang URLs for all locales
export function generateHreflangUrls(
  url: string | undefined,
  baseUrl: string = seoConfig.siteUrl,
  alternateLocales: Locale[] = locales
): Record<string, string> {
  const cleanPath = generateCleanPath(url);
  const hreflangUrls: Record<string, string> = {};

  // Generate URLs for all locales
  for (const locale of alternateLocales) {
    hreflangUrls[locale] = `${baseUrl}/${locale}${cleanPath}`;
  }

  // Add x-default for international targeting (defaults to English)
  hreflangUrls['x-default'] = `${baseUrl}/en${cleanPath}`;

  return hreflangUrls;
}

// Enhanced SEO configuration with comprehensive metadata
export const seoConfig = {
  siteName: 'The Great Beans',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://thegreatbeans.com',
  defaultTitle: 'The Great Beans - Premium Vietnamese Coffee Export & B2B Solutions',
  defaultDescription:
    'Leading Vietnamese coffee exporter specializing in premium Arabica and Robusta beans. B2B solutions, private label manufacturing, and sustainable sourcing for global coffee businesses.',
  defaultKeywords: [
    'Vietnamese coffee export',
    'coffee beans wholesale',
    'B2B coffee solutions',
    'premium coffee supplier',
    'Arabica coffee Vietnam',
    'Robusta coffee export',
    'private label coffee',
    'sustainable coffee sourcing',
    'coffee manufacturing',
    'international coffee trade',
    'coffee quality control',
    'fair trade coffee',
    'organic coffee export',
    'coffee supply chain',
    'coffee roasting services'
  ],
  twitterHandle: '@thegreatbeans',
  defaultImage: '/images/hero-coffee-beans.jpg',
  favicon: '/favicon.ico',
  appleTouchIcon: '/apple-touch-icon.png',
  manifest: '/site.webmanifest',
  supportedLocales: ['en', 'vi', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko'] as Locale[],
  
  // Enhanced metadata for better SEO
  organization: {
    name: 'The Great Beans',
    legalName: 'The Great Beans Coffee Export Co., Ltd.',
    url: 'https://thegreatbeans.com',
    logo: 'https://thegreatbeans.com/images/logo.png',
    foundingDate: '2015-01-01',
    email: 'info@thegreatbeans.com',
    telephone: '+84-28-1234-5678',
    address: {
      streetAddress: '123 Coffee Export Street',
      addressLocality: 'Ho Chi Minh City',
      addressRegion: 'Ho Chi Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    socialMedia: {
      facebook: 'https://facebook.com/thegreatbeans',
      twitter: 'https://twitter.com/thegreatbeans',
      linkedin: 'https://linkedin.com/company/thegreatbeans',
      instagram: 'https://instagram.com/thegreatbeans',
    },
  },
  
  // Industry-specific metadata
  industry: {
    sector: 'Coffee Export and Manufacturing',
    naics: ['311920'], // Coffee and Tea Manufacturing
    targetMarkets: ['B2B Coffee Buyers', 'Private Label Brands', 'Coffee Roasters', 'Distributors'],
    servesCountries: ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'AU', 'JP', 'KR', 'SG'],
    certifications: [
      'ISO 22000:2018 Food Safety Management',
      'Rainforest Alliance Certified',
      'Fair Trade Certified',
      'USDA Organic Certified',
    ],
  },
  
  // Technical SEO settings
  technical: {
    enableStructuredData: true,
    enableOpenGraph: true,
    enableTwitterCards: true,
    enableHreflang: true,
    enableCanonical: true,
    enableRobotsMeta: true,
    enableSitemap: true,
    enableAnalytics: true,
    enableCoreWebVitals: true,
  },
};

// Generate metadata for pages
export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: Locale;
  alternateLocales?: Locale[];
  noIndex?: boolean;
  canonical?: string;
}

export function generateMetadata({
  title,
  description = seoConfig.defaultDescription,
  keywords = seoConfig.defaultKeywords,
  image = seoConfig.defaultImage,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  locale = 'en',
  alternateLocales = locales,
  noIndex = false,
  canonical,
}: SEOProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.defaultTitle;

  const fullUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl;
  const fullImage = image.startsWith('http')
    ? image
    : `${seoConfig.siteUrl}${image}`;

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    creator: seoConfig.siteName,
    publisher: seoConfig.siteName,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    canonical: canonical || fullUrl,

    // Open Graph
    openGraph: {
      type,
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || seoConfig.defaultTitle,
        },
      ],
      locale,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      title: fullTitle,
      description,
      images: [fullImage],
    },

    // Alternate languages (hreflang)
    alternates: {
      canonical: canonical || fullUrl,
      languages: generateHreflangUrls(url, seoConfig.siteUrl, alternateLocales),
    },

    // Icons
    icons: {
      icon: seoConfig.favicon,
      apple: seoConfig.appleTouchIcon,
    },

    // Manifest
    manifest: seoConfig.manifest,

    // Additional meta tags
    other: {
      'theme-color': '#d97706', // amber-600
      'msapplication-TileColor': '#d97706',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
    },
  };

  return metadata;
}

// JSON-LD Structured Data Types
export interface OrganizationSchema {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  description: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    email: string;
  };
  sameAs: string[];
}

export interface ProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': 'Brand';
    name: string;
  };
  manufacturer: {
    '@type': 'Organization';
    name: string;
  };
  category: string;
  // Essential B2B fields
  sku?: string;
  gtin?: string;
  mpn?: string;
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
  review?: Array<{
    '@type': 'Review';
    author: {
      '@type': 'Person';
      name: string;
    };
    reviewRating: {
      '@type': 'Rating';
      ratingValue: number;
      bestRating?: number;
      worstRating?: number;
    };
    reviewBody: string;
    datePublished?: string;
  }>;
  offers?: {
    '@type': 'Offer';
    price?: string;
    priceCurrency?: string;
    availability: string;
    seller: {
      '@type': 'Organization';
      name: string;
    };
    // B2B specific offer details
    businessFunction?: string;
    eligibleQuantity?: {
      '@type': 'QuantitativeValue';
      minValue: number;
      unitCode: string;
    };
  };
}

export interface ArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  headline: string;
  description: string;
  image: string[];
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
  // Enhanced SEO fields
  wordCount?: number;
  articleSection?: string;
  keywords?: string[];
  speakable?: {
    '@type': 'SpeakableSpecification';
    cssSelector: string[];
  };
  about?: Array<{
    '@type': 'Thing';
    name: string;
    sameAs?: string;
  }>;
  mentions?: Array<{
    '@type': 'Thing';
    name: string;
    sameAs?: string;
  }>;
}

export interface ServiceSchema {
  '@context': 'https://schema.org';
  '@type': 'Service';
  name: string;
  description: string;
  provider: {
    '@type': 'Organization';
    name: string;
  };
  serviceType: string;
  areaServed: string;
  offers?: {
    '@type': 'Offer';
    price?: string;
    priceCurrency?: string;
    availability: string;
  };
}

// Base schema interface
interface BaseSchema {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

// Schema validation function
export function validateSchema(schema: BaseSchema): boolean {
  try {
    // Basic validation checks
    if (!schema['@context'] || !schema['@type']) {
      return false;
    }

    // Validate JSON structure
    JSON.stringify(schema);

    // Additional validation for specific schema types
    if (schema['@type'] === 'Product') {
      const productSchema = schema as ProductSchema;
      if (!productSchema.name || !productSchema.description) {
        return false;
      }
    }

    if (schema['@type'] === 'Article') {
      const articleSchema = schema as ArticleSchema;
      if (
        !articleSchema.headline ||
        !articleSchema.author ||
        !articleSchema.datePublished
      ) {
        return false;
      }
    }

    return true;
  } catch {
    return false;
  }
}

// Generate Organization Schema
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/images/logo.png`,
    description: seoConfig.defaultDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Coffee Street',
      addressLocality: 'Ho Chi Minh City',
      addressRegion: 'Ho Chi Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-123-456-789',
      contactType: 'customer service',
      email: 'info@thegreatbeans.com',
    },
    sameAs: [
      'https://www.facebook.com/thegreatbeans',
      'https://www.linkedin.com/company/thegreatbeans',
      'https://twitter.com/thegreatbeans',
    ],
  };
}

// Generate Product Schema
export function generateProductSchema(product: {
  name: string;
  description: string;
  images: string[];
  category: string;
  price?: string;
  currency?: string;
}): ProductSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map(img =>
      img.startsWith('http') ? img : `${seoConfig.siteUrl}${img}`
    ),
    brand: {
      '@type': 'Brand',
      name: seoConfig.siteName,
    },
    manufacturer: {
      '@type': 'Organization',
      name: seoConfig.siteName,
    },
    category: product.category,
    ...(product.price && {
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: seoConfig.siteName,
        },
      },
    }),
  };
}

// Generate Article Schema
export function generateArticleSchema(article: {
  title: string;
  description: string;
  images: string[];
  author: string;
  publishedAt: string;
  modifiedAt?: string;
  url: string;
}): ArticleSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.images.map(img =>
      img.startsWith('http') ? img : `${seoConfig.siteUrl}${img}`
    ),
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/images/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.siteUrl}${article.url}`,
    },
  };
}

// Generate Service Schema
export function generateServiceSchema(service: {
  name: string;
  description: string;
  serviceType: string;
  price?: string;
  currency?: string;
}): ServiceSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: seoConfig.siteName,
    },
    serviceType: service.serviceType,
    areaServed: 'Worldwide',
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: service.currency || 'USD',
        availability: 'https://schema.org/Available',
      },
    }),
  };
}

// Generate breadcrumb schema
export interface BreadcrumbSchema {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
}

export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${seoConfig.siteUrl}${crumb.url}`,
    })),
  };
}
