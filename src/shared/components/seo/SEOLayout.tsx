import React from 'react';
import { type Metadata } from 'next';
import { EnhancedSEOHead } from './EnhancedSEOHead';
import { type Locale } from '@/i18n';

// Core SEO data interfaces
export interface SEOPageData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  locale?: Locale;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
  canonical?: string;
}

// Product-specific SEO data
export interface ProductSEOData extends SEOPageData {
  product: {
    id: string;
    name: string;
    description: string;
    category: string;
    origin: string;
    processingMethod: string;
    certifications: string[];
    images: string[];
    price?: {
      currency: string;
      minPrice: number;
      maxPrice?: number;
      priceValidUntil?: string;
    };
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    brand: string;
    manufacturer: string;
    sku?: string;
    gtin?: string;
    mpn?: string;
    weight?: string;
    dimensions?: {
      length: string;
      width: string;
      height: string;
    };
    packaging?: string;
    shelfLife?: string;
    storageInstructions?: string;
    nutritionalInfo?: Record<string, string>;
    qualityGrade?: string;
    harvestSeason?: string;
    farmLocation?: string;
    altitudeGrown?: string;
    cupping?: {
      score: number;
      notes: string[];
      aroma: number;
      flavor: number;
      acidity: number;
      body: number;
      balance: number;
    };
  };
}

// Service-specific SEO data
export interface ServiceSEOData extends SEOPageData {
  service: {
    id: string;
    name: string;
    description: string;
    category: string;
    serviceType: string;
    provider: string;
    areaServed: string[];
    availableLanguage: string[];
    hoursAvailable?: string;
    serviceOutput?: string;
    audience?: string;
    eligibleRegion?: string[];
    ineligibleRegion?: string[];
    serviceAudience?: string;
    hasOfferCatalog?: boolean;
    termsOfService?: string;
    serviceUrl?: string;
    aggregateRating?: {
      ratingValue: number;
      reviewCount: number;
      bestRating: number;
      worstRating: number;
    };
    offers?: {
      price?: string;
      priceCurrency?: string;
      availability?: string;
      validFrom?: string;
      validThrough?: string;
      eligibleQuantity?: {
        minValue: number;
        maxValue?: number;
        unitCode: string;
      };
      businessFunction?: string;
      deliveryLeadTime?: string;
    };
  };
}

// Article-specific SEO data
export interface ArticleSEOData extends SEOPageData {
  article: {
    id: string;
    headline: string;
    description: string;
    body: string;
    author: {
      name: string;
      url?: string;
      image?: string;
      jobTitle?: string;
      worksFor?: string;
    };
    publisher: {
      name: string;
      logo: string;
      url: string;
    };
    datePublished: string;
    dateModified: string;
    mainEntityOfPage: string;
    image: string[];
    articleSection: string;
    wordCount: number;
    inLanguage: string;
    about?: string[];
    mentions?: string[];
    citation?: string[];
    isPartOf?: {
      name: string;
      url: string;
    };
    hasPart?: Array<{
      name: string;
      url: string;
    }>;
    speakable?: {
      cssSelector: string[];
      xpath?: string[];
    };
  };
}

// Collection page SEO data
export interface CollectionSEOData extends SEOPageData {
  collection: {
    name: string;
    description: string;
    numberOfItems: number;
    itemListElement: Array<{
      position: number;
      item: {
        '@id': string;
        name: string;
        description?: string;
        image?: string;
        url: string;
      };
    }>;
    mainEntity?: string;
    about?: string;
    audience?: string;
    genre?: string;
    inLanguage?: string;
    isPartOf?: {
      name: string;
      url: string;
    };
  };
}

// Breadcrumb data
export interface BreadcrumbData {
  items: Array<{
    name: string;
    url: string;
    position: number;
  }>;
}

// FAQ data
export interface FAQData {
  questions: Array<{
    question: string;
    answer: string;
    acceptedAnswer?: {
      text: string;
      author?: string;
      dateCreated?: string;
      upvoteCount?: number;
    };
  }>;
}

// Main SEO Layout Props
export interface SEOLayoutProps {
  children: React.ReactNode;
  seoData: SEOPageData | ProductSEOData | ServiceSEOData | ArticleSEOData | CollectionSEOData;
  breadcrumbs?: BreadcrumbData;
  faqs?: FAQData;
  alternateLanguages?: Record<Locale, string>;
  structuredDataType?: 'product' | 'service' | 'article' | 'collection' | 'website';
  enableAnalytics?: boolean;
  enableCoreWebVitals?: boolean;
  preloadResources?: Array<{
    href: string;
    as: 'script' | 'style' | 'font' | 'image';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }>;
  prefetchDNS?: string[];
  preconnectOrigins?: string[];
  className?: string;
}

/**
 * SEOLayout Component
 * 
 * A comprehensive layout component that handles all SEO aspects including:
 * - Advanced meta tags and Open Graph optimization
 * - Schema.org structured data for various content types
 * - International SEO with hreflang support
 * - Core Web Vitals optimization
 * - Analytics and performance tracking
 * - Resource preloading and DNS optimization
 */
export function SEOLayout({
  children,
  seoData,
  breadcrumbs,
  faqs,
  alternateLanguages,
  structuredDataType = 'website',
  enableAnalytics = true,
  enableCoreWebVitals = true,
  preloadResources = [],
  prefetchDNS = [],
  preconnectOrigins = [],
  className,
}: SEOLayoutProps) {
  return (
    <>
      <EnhancedSEOHead
        seoData={seoData}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
        alternateLanguages={alternateLanguages}
        structuredDataType={structuredDataType}
        enableAnalytics={enableAnalytics}
        enableCoreWebVitals={enableCoreWebVitals}
        preloadResources={preloadResources}
        prefetchDNS={prefetchDNS}
        preconnectOrigins={preconnectOrigins}
      />
      <div className={className}>
        {children}
      </div>
    </>
  );
}

// Helper function to generate Next.js metadata from SEO data
export function generateSEOMetadata(seoData: SEOPageData): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    locale = 'en',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    noindex = false,
    nofollow = false,
    canonical,
  } = seoData;

  const metadata: Metadata = {
    title,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonical || url,
    },
    openGraph: {
      type: type as any,
      title,
      description,
      url,
      siteName: 'The Great Beans',
      locale,
      images: image ? [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ] : undefined,
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : undefined,
        section,
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
      creator: '@thegreatbeans',
      site: '@thegreatbeans',
    },
    other: {
      'article:author': author,
      'article:section': section,
      'article:tag': tags.join(', '),
    },
  };

  return metadata;
}

// Type guards for SEO data
export function isProductSEOData(data: any): data is ProductSEOData {
  return data && typeof data === 'object' && 'product' in data;
}

export function isServiceSEOData(data: any): data is ServiceSEOData {
  return data && typeof data === 'object' && 'service' in data;
}

export function isArticleSEOData(data: any): data is ArticleSEOData {
  return data && typeof data === 'object' && 'article' in data;
}

export function isCollectionSEOData(data: any): data is CollectionSEOData {
  return data && typeof data === 'object' && 'collection' in data;
}

export default SEOLayout;