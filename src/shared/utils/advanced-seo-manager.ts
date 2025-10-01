import { type Metadata } from 'next';
import { type Locale } from '@/i18n';
import { seoConfig } from './seo-utils';
import { siteConfig } from '@/shared/config/site';

/**
 * Advanced SEO Manager for The Great Beans
 * Provides comprehensive Technical SEO capabilities including:
 * - Enhanced Schema.org markup
 * - Advanced meta tags optimization
 * - Structured data management
 * - International SEO support
 * - Core Web Vitals optimization
 */

// Enhanced SEO Configuration
export interface AdvancedSEOConfig {
  // Core business information
  business: {
    name: string;
    legalName: string;
    foundingDate: string;
    vatId?: string;
    duns?: string;
    naics?: string[];
    isicV4?: string[];
  };
  // Contact and location
  contact: {
    telephone: string;
    email: string;
    faxNumber?: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    geoCoordinates: {
      latitude: number;
      longitude: number;
    };
  };
  // Social media and online presence
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  // Business certifications and memberships
  certifications: Array<{
    name: string;
    issuedBy: string;
    identifier?: string;
    validFrom?: string;
    validThrough?: string;
  }>;
  // Industry and market information
  industry: {
    primarySector: string;
    secondarySectors: string[];
    targetMarkets: string[];
    servesCountries: string[];
  };
}

// Advanced SEO metadata interface
export interface AdvancedSEOMetadata {
  // Basic metadata
  title: string;
  description: string;
  keywords: string[];
  
  // Advanced metadata
  contentType: 'website' | 'article' | 'product' | 'service' | 'organization' | 'collection';
  locale: Locale;
  alternateLocales?: Locale[];
  
  // Content-specific metadata
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  
  // Business metadata
  price?: {
    amount: string;
    currency: string;
  };
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  sku?: string;
  gtin?: string;
  
  // Media metadata
  images?: Array<{
    url: string;
    alt: string;
    width?: number;
    height?: number;
    caption?: string;
  }>;
  videos?: Array<{
    url: string;
    thumbnail?: string;
    duration?: string;
    description?: string;
  }>;
  
  // SEO optimization
  canonical?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  priority?: number;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  
  // Structured data
  customStructuredData?: Record<string, any>[];
}

// Default advanced SEO configuration
export const advancedSEOConfig: AdvancedSEOConfig = {
  business: {
    name: 'The Great Beans',
    legalName: 'The Great Beans Coffee Export Co., Ltd.',
    foundingDate: '2015-01-01',
    naics: ['311920'], // Coffee and Tea Manufacturing
    isicV4: ['1079'], // Manufacture of other food products n.e.c.
  },
  contact: {
    telephone: '+84-28-1234-5678',
    email: 'info@thegreatbeans.com',
    address: {
      streetAddress: '123 Coffee Export Street',
      addressLocality: 'Ho Chi Minh City',
      addressRegion: 'Ho Chi Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    geoCoordinates: {
      latitude: 10.8231,
      longitude: 106.6297,
    },
  },
  socialMedia: {
    linkedin: 'https://linkedin.com/company/thegreatbeans',
    facebook: 'https://facebook.com/thegreatbeans',
    twitter: 'https://twitter.com/thegreatbeans',
    instagram: 'https://instagram.com/thegreatbeans',
  },
  certifications: [
    {
      name: 'ISO 22000:2018 Food Safety Management',
      issuedBy: 'International Organization for Standardization',
      identifier: 'ISO22000-2018-TGB',
    },
    {
      name: 'Rainforest Alliance Certified',
      issuedBy: 'Rainforest Alliance',
      identifier: 'RA-CERT-TGB-2024',
    },
    {
      name: 'Fair Trade Certified',
      issuedBy: 'Fair Trade USA',
      identifier: 'FT-USA-TGB-2024',
    },
    {
      name: 'Organic Certification',
      issuedBy: 'USDA Organic',
      identifier: 'USDA-ORG-TGB-2024',
    },
  ],
  industry: {
    primarySector: 'Coffee Export and Manufacturing',
    secondarySectors: [
      'Agricultural Products Export',
      'Food and Beverage Manufacturing',
      'Private Label Manufacturing',
      'Supply Chain Management',
    ],
    targetMarkets: ['B2B Coffee Buyers', 'Private Label Brands', 'Coffee Roasters', 'Distributors'],
    servesCountries: ['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'AU', 'JP', 'KR', 'SG'],
  },
};

export class AdvancedSEOManager {
  private config: AdvancedSEOConfig;
  private baseUrl: string;

  constructor(config: AdvancedSEOConfig = advancedSEOConfig) {
    this.config = config;
    this.baseUrl = seoConfig.siteUrl;
  }

  /**
   * Generate comprehensive metadata for Next.js
   */
  generateMetadata(metadata: AdvancedSEOMetadata): Metadata {
    const {
      title,
      description,
      keywords,
      contentType,
      locale,
      alternateLocales,
      author,
      publishedTime,
      modifiedTime,
      section,
      tags,
      images,
      canonical,
      noIndex,
      noFollow,
    } = metadata;

    const fullTitle = title.includes(this.config.business.name) 
      ? title 
      : `${title} | ${this.config.business.name}`;

    const primaryImage = images?.[0] || {
      url: `${this.baseUrl}/images/og-default.jpg`,
      alt: title,
      width: 1200,
      height: 630,
    };

    const fullImageUrl = primaryImage.url.startsWith('http') 
      ? primaryImage.url 
      : `${this.baseUrl}${primaryImage.url}`;

    // Generate robots directive
    const robotsDirectives = [];
    if (noIndex) robotsDirectives.push('noindex');
    if (noFollow) robotsDirectives.push('nofollow');
    if (robotsDirectives.length === 0) {
      robotsDirectives.push('index', 'follow');
    }

    return {
      title: fullTitle,
      description,
      keywords: keywords.join(', '),
      authors: author ? [{ name: author }] : undefined,
      creator: this.config.business.name,
      publisher: this.config.business.name,
      robots: robotsDirectives.join(', '),
      canonical: canonical || `${this.baseUrl}/${locale}`,

      // Enhanced Open Graph
      openGraph: {
        type: contentType === 'article' ? 'article' : 'website',
        title: fullTitle,
        description,
        url: canonical || `${this.baseUrl}/${locale}`,
        siteName: this.config.business.name,
        locale,
        images: [
          {
            url: fullImageUrl,
            width: primaryImage.width || 1200,
            height: primaryImage.height || 630,
            alt: primaryImage.alt || title,
          },
        ],
        ...(contentType === 'article' && {
          publishedTime,
          modifiedTime,
          authors: author ? [author] : undefined,
          section,
          tags,
        }),
      },

      // Enhanced Twitter metadata
      twitter: {
        card: 'summary_large_image',
        site: '@thegreatbeans',
        creator: '@thegreatbeans',
        title: fullTitle,
        description,
        images: [fullImageUrl],
      },

      // Alternate languages
      alternates: {
        canonical: canonical || `${this.baseUrl}/${locale}`,
        languages: this.generateHreflangUrls(canonical, alternateLocales),
      },

      // Enhanced metadata
      other: {
        'theme-color': '#8B4513',
        'msapplication-TileColor': '#8B4513',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'format-detection': 'telephone=no',
        'mobile-web-app-capable': 'yes',
        
        // Business-specific meta tags
        'business:contact_data:street_address': this.config.contact.address.streetAddress,
        'business:contact_data:locality': this.config.contact.address.addressLocality,
        'business:contact_data:region': this.config.contact.address.addressRegion,
        'business:contact_data:postal_code': this.config.contact.address.postalCode,
        'business:contact_data:country_name': this.config.contact.address.addressCountry,
        'business:contact_data:email': this.config.contact.email,
        'business:contact_data:phone_number': this.config.contact.telephone,
        
        // Geographic meta tags
        'geo.region': this.config.contact.address.addressCountry,
        'geo.placename': this.config.contact.address.addressLocality,
        'geo.position': `${this.config.contact.geoCoordinates.latitude};${this.config.contact.geoCoordinates.longitude}`,
        'ICBM': `${this.config.contact.geoCoordinates.latitude}, ${this.config.contact.geoCoordinates.longitude}`,
        
        // Industry-specific meta tags
        'industry': this.config.industry.primarySector,
        'target-market': this.config.industry.targetMarkets.join(', '),
        'serves-countries': this.config.industry.servesCountries.join(', '),
      },
    };
  }

  /**
   * Generate comprehensive organization Schema.org markup
   */
  generateOrganizationSchema(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${this.baseUrl}/#organization`,
      name: this.config.business.name,
      legalName: this.config.business.legalName,
      url: this.baseUrl,
      logo: {
        '@type': 'ImageObject',
        '@id': `${this.baseUrl}/#logo`,
        url: `${this.baseUrl}/images/logo.png`,
        width: 300,
        height: 100,
        caption: this.config.business.name,
      },
      image: `${this.baseUrl}/images/logo.png`,
      description: seoConfig.defaultDescription,
      foundingDate: this.config.business.foundingDate,
      
      // Contact information
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.config.contact.address.streetAddress,
        addressLocality: this.config.contact.address.addressLocality,
        addressRegion: this.config.contact.address.addressRegion,
        postalCode: this.config.contact.address.postalCode,
        addressCountry: this.config.contact.address.addressCountry,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: this.config.contact.geoCoordinates.latitude,
        longitude: this.config.contact.geoCoordinates.longitude,
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: this.config.contact.telephone,
          email: this.config.contact.email,
          contactType: 'customer service',
          areaServed: this.config.industry.servesCountries,
          availableLanguage: ['en', 'vi', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko'],
        },
        {
          '@type': 'ContactPoint',
          telephone: this.config.contact.telephone,
          email: 'sales@thegreatbeans.com',
          contactType: 'sales',
          areaServed: this.config.industry.servesCountries,
          availableLanguage: ['en', 'vi', 'de', 'ja'],
        },
      ],
      
      // Social media presence
      sameAs: Object.values(this.config.socialMedia).filter(Boolean),
      
      // Business classification
      naics: this.config.business.naics,
      isicV4: this.config.business.isicV4,
      
      // Certifications
      hasCredential: this.config.certifications.map(cert => ({
        '@type': 'EducationalOccupationalCredential',
        name: cert.name,
        credentialCategory: 'certification',
        recognizedBy: {
          '@type': 'Organization',
          name: cert.issuedBy,
        },
        ...(cert.identifier && { identifier: cert.identifier }),
      })),
      
      // Business services
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Coffee Export Services',
            description: 'Premium Vietnamese coffee export and B2B solutions',
          },
          areaServed: this.config.industry.servesCountries.map(country => ({
            '@type': 'Country',
            name: country,
          })),
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Private Label Manufacturing',
            description: 'Custom coffee blending and private label manufacturing services',
          },
          areaServed: this.config.industry.servesCountries.map(country => ({
            '@type': 'Country',
            name: country,
          })),
        },
      ],
      
      // Awards and recognition (can be expanded)
      award: [
        'ISO 22000:2018 Certified',
        'Rainforest Alliance Certified',
        'Fair Trade Certified',
        'USDA Organic Certified',
      ],
    };
  }

  /**
   * Generate website Schema.org markup
   */
  generateWebsiteSchema(locale: Locale): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.baseUrl}/${locale}/#website`,
      url: `${this.baseUrl}/${locale}`,
      name: this.config.business.name,
      description: seoConfig.defaultDescription,
      publisher: {
        '@id': `${this.baseUrl}/#organization`,
      },
      inLanguage: locale,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/${locale}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  /**
   * Generate breadcrumb Schema.org markup
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url.startsWith('http') ? crumb.url : `${this.baseUrl}${crumb.url}`,
      })),
    };
  }

  /**
   * Generate FAQ Schema.org markup for AI optimization
   */
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };
  }

  /**
   * Generate hreflang URLs for international SEO
   */
  private generateHreflangUrls(
    currentUrl?: string,
    alternateLocales?: Locale[]
  ): Record<string, string> {
    const urls: Record<string, string> = {};
    const locales = alternateLocales || ['en', 'vi', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko'];
    
    locales.forEach(locale => {
      urls[locale] = currentUrl 
        ? currentUrl.replace(/\/[a-z]{2}(\/|$)/, `/${locale}$1`)
        : `${this.baseUrl}/${locale}`;
    });
    
    // Add x-default for international targeting
    urls['x-default'] = currentUrl 
      ? currentUrl.replace(/\/[a-z]{2}(\/|$)/, '/en$1')
      : `${this.baseUrl}/en`;
    
    return urls;
  }

  /**
   * Validate structured data
   */
  validateStructuredData(data: Record<string, any>): boolean {
    // Basic validation for required Schema.org fields
    if (!data['@context'] || !data['@type']) {
      return false;
    }
    
    // Validate context
    if (data['@context'] !== 'https://schema.org') {
      return false;
    }
    
    // Type-specific validation
    switch (data['@type']) {
      case 'Organization':
        return !!(data.name && data.url);
      case 'Product':
        return !!(data.name && data.description);
      case 'Article':
        return !!(data.headline && data.author);
      case 'Service':
        return !!(data.name && data.provider);
      default:
        return true; // Allow other types
    }
  }
}

// Export singleton instance
export const advancedSEOManager = new AdvancedSEOManager();