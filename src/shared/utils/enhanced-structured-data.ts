import { type Locale } from '@/i18n';

import { seoConfig } from './seo-utils';

// Enhanced B2B Product Schema with international targeting
export interface B2BProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  '@id': string;
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': 'Brand';
    name: string;
    logo?: string;
  };
  manufacturer: {
    '@type': 'Organization';
    name: string;
    url: string;
    address: {
      '@type': 'PostalAddress';
      addressCountry: string;
      addressRegion: string;
    };
  };
  category: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  // B2B specific fields
  offers: {
    '@type': 'Offer';
    '@id': string;
    businessFunction: 'http://purl.org/goodrelations/v1#Sell';
    availability: string;
    seller: {
      '@type': 'Organization';
      name: string;
      url: string;
    };
    eligibleQuantity: {
      '@type': 'QuantitativeValue';
      minValue: number;
      maxValue?: number;
      unitCode: string;
      unitText: string;
    };
    priceSpecification?: {
      '@type': 'PriceSpecification';
      priceCurrency: string;
      price?: string;
      validFrom?: string;
      validThrough?: string;
    };
    deliveryLeadTime?: {
      '@type': 'QuantitativeValue';
      minValue: number;
      maxValue: number;
      unitCode: 'DAY';
    };
    areaServed: string[];
    incoterms?: string[];
  };
  // Quality certifications
  certification?: Array<{
    '@type': 'Certification';
    name: string;
    certificationIdentification: string;
    issuedBy: {
      '@type': 'Organization';
      name: string;
    };
  }>;
  // Origin information
  countryOfOrigin?: {
    '@type': 'Country';
    name: string;
    identifier: string;
  };
  // Additional product properties
  additionalProperty?: Array<{
    '@type': 'PropertyValue';
    name: string;
    value: string;
    unitText?: string;
  }>;
  // Index signature for compatibility with StructuredDataObject
  [key: string]: unknown;
}

// Enhanced Service Schema for B2B services
export interface B2BServiceSchema {
  '@context': 'https://schema.org';
  '@type': 'Service';
  '@id': string;
  name: string;
  description: string;
  image?: string[];
  provider: {
    '@type': 'Organization';
    name: string;
    url: string;
    address: {
      '@type': 'PostalAddress';
      addressCountry: string;
      addressRegion: string;
    };
  };
  serviceType: string;
  category: string;
  areaServed: string[];
  offers: {
    '@type': 'Offer';
    '@id': string;
    businessFunction: 'http://purl.org/goodrelations/v1#Sell';
    availability: string;
    priceSpecification?: {
      '@type': 'PriceSpecification';
      priceCurrency: string;
      price?: string;
      description?: string;
    };
    deliveryLeadTime?: {
      '@type': 'QuantitativeValue';
      minValue: number;
      maxValue: number;
      unitCode: 'DAY';
    };
    eligibleQuantity?: {
      '@type': 'QuantitativeValue';
      minValue: number;
      unitCode: string;
    };
  };
  // Service features
  serviceOutput?: Array<{
    '@type': 'Thing';
    name: string;
    description?: string;
  }>;
  // Certifications and standards
  hasCredential?: Array<{
    '@type': 'EducationalOccupationalCredential';
    name: string;
    credentialCategory: string;
  }>;
  // Index signature for compatibility with StructuredDataObject
  [key: string]: unknown;
}

// Enhanced Article Schema with multilingual support
export interface MultilingualArticleSchema {
  '@context': 'https://schema.org';
  '@type': 'Article';
  '@id': string;
  headline: string;
  description: string;
  image: string[];
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
    jobTitle?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
      width?: number;
      height?: number;
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
  inLanguage: string;
  // Multilingual versions
  workTranslation?: Array<{
    '@type': 'Article';
    '@id': string;
    inLanguage: string;
    url: string;
  }>;
  // Industry-specific fields
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
  // Speakable content for voice search
  speakable?: {
    '@type': 'SpeakableSpecification';
    cssSelector: string[];
  };
  // Index signature for compatibility with StructuredDataObject
  [key: string]: unknown;
}

// WebSite schema with search functionality
export interface WebSiteSchema {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  '@id': string;
  name: string;
  url: string;
  description: string;
  inLanguage: string[];
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
  };
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
  // Multilingual versions
  workTranslation?: Array<{
    '@type': 'WebSite';
    '@id': string;
    inLanguage: string;
    url: string;
  }>;
}

// Generate B2B Product Schema
export function generateB2BProductSchema(
  product: {
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
  },
  locale: Locale
): B2BProductSchema {
  const baseUrl = seoConfig.siteUrl;
  const productUrl = `${baseUrl}/${locale}/products/${product.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': productUrl,
    name: product.name,
    description: product.description,
    image: product.images.map(img =>
      img.startsWith('http') ? img : `${baseUrl}${img}`
    ),
    brand: {
      '@type': 'Brand',
      name: 'The Great Beans',
      logo: `${baseUrl}/images/logo.png`,
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'The Great Beans',
      url: baseUrl,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'VN',
        addressRegion: 'Ho Chi Minh City',
      },
    },
    category: product.category,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      '@id': `${productUrl}#offer`,
      businessFunction: 'http://purl.org/goodrelations/v1#Sell',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'The Great Beans',
        url: baseUrl,
      },
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        minValue: product.minOrderQuantity,
        unitCode: 'KGM',
        unitText: product.unitOfMeasure,
      },
      deliveryLeadTime: {
        '@type': 'QuantitativeValue',
        minValue: product.leadTime.min,
        maxValue: product.leadTime.max,
        unitCode: 'DAY',
      },
      areaServed: product.targetMarkets,
      incoterms: product.incoterms,
    },
    countryOfOrigin: {
      '@type': 'Country',
      name: product.origin,
      identifier: 'VN',
    },
    certification: product.certifications?.map(cert => ({
      '@type': 'Certification',
      name: cert.name,
      certificationIdentification: cert.identifier,
      issuedBy: {
        '@type': 'Organization',
        name: cert.issuer,
      },
    })),
  };
}

// Generate B2B Service Schema
export function generateB2BServiceSchema(
  service: {
    id: string;
    name: string;
    description: string;
    serviceType: string;
    category: string;
    features: string[];
    leadTime: { min: number; max: number };
    targetMarkets: string[];
    certifications?: string[];
  },
  locale: Locale
): B2BServiceSchema {
  const baseUrl = seoConfig.siteUrl;
  const serviceUrl = `${baseUrl}/${locale}/services/${service.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': serviceUrl,
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'The Great Beans',
      url: baseUrl,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'VN',
        addressRegion: 'Ho Chi Minh City',
      },
    },
    serviceType: service.serviceType,
    category: service.category,
    areaServed: service.targetMarkets,
    offers: {
      '@type': 'Offer',
      '@id': `${serviceUrl}#offer`,
      businessFunction: 'http://purl.org/goodrelations/v1#Sell',
      availability: 'https://schema.org/Available',
      deliveryLeadTime: {
        '@type': 'QuantitativeValue',
        minValue: service.leadTime.min,
        maxValue: service.leadTime.max,
        unitCode: 'DAY',
      },
    },
    serviceOutput: service.features.map(feature => ({
      '@type': 'Thing',
      name: feature,
    })),
    hasCredential: service.certifications?.map(cert => ({
      '@type': 'EducationalOccupationalCredential',
      name: cert,
      credentialCategory: 'Quality Certification',
    })),
  };
}

// Generate Multilingual Article Schema
export function generateMultilingualArticleSchema(
  article: {
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
  },
  locale: Locale
): MultilingualArticleSchema {
  const baseUrl = seoConfig.siteUrl;
  const articleUrl = `${baseUrl}/${locale}/blog/${article.id}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': articleUrl,
    headline: article.title,
    description: article.description,
    image: article.images.map(img =>
      img.startsWith('http') ? img : `${baseUrl}${img}`
    ),
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: 'Coffee Industry Expert',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Great Beans',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
        width: 200,
        height: 60,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    wordCount: article.wordCount,
    articleSection: article.section,
    keywords: article.keywords,
    inLanguage: locale,
    workTranslation: article.alternateVersions?.map(version => ({
      '@type': 'Article',
      '@id': version.url,
      inLanguage: version.locale,
      url: version.url,
    })),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.summary', '.key-points'],
    },
  };
}

// Generate WebSite Schema with multilingual support
export function generateWebSiteSchema(locale: Locale): WebSiteSchema {
  const baseUrl = seoConfig.siteUrl;
  const siteUrl = `${baseUrl}/${locale}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': siteUrl,
    name: 'The Great Beans',
    url: siteUrl,
    description:
      'Premium Vietnamese Coffee Exporter - B2B Solutions, Private Labeling, and Sustainable Sourcing',
    inLanguage: ['en', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko', 'vi'],
    publisher: {
      '@type': 'Organization',
      name: 'The Great Beans',
      url: baseUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
