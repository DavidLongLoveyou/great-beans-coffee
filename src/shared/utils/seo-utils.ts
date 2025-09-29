import { type Metadata } from 'next';
import { type Locale } from '@/i18n';

// Base SEO configuration
export const seoConfig = {
  siteName: 'The Great Beans',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://thegreatbeans.com',
  defaultTitle: 'The Great Beans - Premium Coffee Export & B2B Solutions',
  defaultDescription: 'Leading Vietnamese coffee exporter specializing in premium Robusta and Arabica beans. B2B solutions, private labeling, and sustainable sourcing for global partners.',
  defaultKeywords: [
    'coffee export',
    'vietnamese coffee',
    'robusta coffee',
    'arabica coffee',
    'b2b coffee',
    'private label coffee',
    'coffee sourcing',
    'premium coffee beans',
    'sustainable coffee',
    'coffee wholesale'
  ],
  twitterHandle: '@thegreatbeans',
  defaultImage: '/images/og-default.jpg',
  favicon: '/favicon.ico',
  appleTouchIcon: '/apple-touch-icon.png',
  manifest: '/site.webmanifest'
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
  alternateLocales = ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'nl'],
  noIndex = false,
  canonical
}: SEOProps = {}): Metadata {
  const fullTitle = title 
    ? `${title} | ${seoConfig.siteName}`
    : seoConfig.defaultTitle;
  
  const fullUrl = url ? `${seoConfig.siteUrl}${url}` : seoConfig.siteUrl;
  const fullImage = image.startsWith('http') ? image : `${seoConfig.siteUrl}${image}`;
  
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
        }
      ],
      locale,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags
      })
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      title: fullTitle,
      description,
      images: [fullImage]
    },
    
    // Alternate languages
    alternates: {
      canonical: canonical || fullUrl,
      languages: {
        ...alternateLocales.reduce((acc, loc) => {
          // Remove duplicate locale from URL path
          const cleanUrl = url?.replace(`/${loc}`, '') || '';
          acc[loc] = `${seoConfig.siteUrl}/${loc}${cleanUrl}`;
          return acc;
        }, {} as Record<string, string>),
        // Add x-default for international targeting
        'x-default': `${seoConfig.siteUrl}/en${url?.replace('/en', '') || ''}`
      }
    },
    
    // Icons
    icons: {
      icon: seoConfig.favicon,
      apple: seoConfig.appleTouchIcon
    },
    
    // Manifest
    manifest: seoConfig.manifest,
    
    // Additional meta tags
    other: {
      'theme-color': '#d97706', // amber-600
      'msapplication-TileColor': '#d97706',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default'
    }
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

// Schema validation function
export function validateSchema(schema: any): boolean {
  try {
    // Basic validation checks
    if (!schema['@context'] || !schema['@type']) {
      console.warn('Schema missing required @context or @type');
      return false;
    }
    
    // Validate JSON structure
    JSON.stringify(schema);
    
    // Additional validation for specific schema types
    if (schema['@type'] === 'Product') {
      if (!schema.name || !schema.description) {
        console.warn('Product schema missing required name or description');
        return false;
      }
    }
    
    if (schema['@type'] === 'Article') {
      if (!schema.headline || !schema.author || !schema.datePublished) {
        console.warn('Article schema missing required fields');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Schema validation failed:', error);
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
      addressCountry: 'VN'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-123-456-789',
      contactType: 'customer service',
      email: 'info@thegreatbeans.com'
    },
    sameAs: [
      'https://www.facebook.com/thegreatbeans',
      'https://www.linkedin.com/company/thegreatbeans',
      'https://twitter.com/thegreatbeans'
    ]
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
    image: product.images.map(img => img.startsWith('http') ? img : `${seoConfig.siteUrl}${img}`),
    brand: {
      '@type': 'Brand',
      name: seoConfig.siteName
    },
    manufacturer: {
      '@type': 'Organization',
      name: seoConfig.siteName
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
          name: seoConfig.siteName
        }
      }
    })
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
    image: article.images.map(img => img.startsWith('http') ? img : `${seoConfig.siteUrl}${img}`),
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${seoConfig.siteUrl}/images/logo.png`
      }
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${seoConfig.siteUrl}${article.url}`
    }
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
      name: seoConfig.siteName
    },
    serviceType: service.serviceType,
    areaServed: 'Worldwide',
    ...(service.price && {
      offers: {
        '@type': 'Offer',
        price: service.price,
        priceCurrency: service.currency || 'USD',
        availability: 'https://schema.org/Available'
      }
    })
  };
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${seoConfig.siteUrl}${crumb.url}`
    }))
  };
}