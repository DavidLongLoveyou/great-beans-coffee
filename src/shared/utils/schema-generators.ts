import { type Locale } from '@/i18n';
import { advancedSEOConfig } from './advanced-seo-manager';

/**
 * Specialized Schema.org Generators for The Great Beans
 * Provides industry-specific structured data markup for:
 * - Coffee products and varieties
 * - B2B services and solutions
 * - Educational content and articles
 * - Market reports and insights
 * - Origin stories and certifications
 */

export interface CoffeeProductData {
  id: string;
  name: string;
  description: string;
  variety: string;
  origin: string;
  processingMethod: string;
  roastLevel?: string;
  flavorProfile: string[];
  certifications: string[];
  price?: {
    amount: string;
    currency: string;
    unit: string; // e.g., "per kg", "per ton"
  };
  availability: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Seasonal';
  minimumOrderQuantity?: string;
  harvestSeason?: string;
  altitude?: string;
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  specifications?: {
    moisture?: string;
    screenSize?: string;
    density?: string;
    defects?: string;
  };
}

export interface B2BServiceData {
  id: string;
  name: string;
  description: string;
  serviceType: 'export' | 'manufacturing' | 'consulting' | 'logistics' | 'quality-control';
  targetMarkets: string[];
  deliveryTime?: string;
  minimumOrder?: string;
  certifications: string[];
  features: string[];
  price?: {
    type: 'fixed' | 'variable' | 'quote';
    amount?: string;
    currency?: string;
    unit?: string;
  };
  areaServed: string[];
}

export interface ArticleData {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedDate: string;
  modifiedDate?: string;
  category: string;
  tags: string[];
  readingTime?: number;
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  locale: Locale;
  relatedArticles?: string[];
}

export interface MarketReportData {
  id: string;
  title: string;
  description: string;
  reportType: 'market-analysis' | 'price-forecast' | 'industry-trends' | 'origin-report';
  coveragePeriod: {
    start: string;
    end: string;
  };
  markets: string[];
  keyFindings: string[];
  methodology?: string;
  dataSource?: string;
  publishedDate: string;
  author: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
}

export interface OriginStoryData {
  id: string;
  title: string;
  description: string;
  region: string;
  country: string;
  farmName?: string;
  farmerName?: string;
  altitude?: string;
  climate?: string;
  soilType?: string;
  varietiesGrown: string[];
  sustainabilityPractices: string[];
  certifications: string[];
  harvestSeason: string;
  processingMethods: string[];
  images: Array<{
    url: string;
    alt: string;
    caption?: string;
  }>;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export class SchemaGenerators {
  private baseUrl: string;

  constructor() {
    this.baseUrl = 'https://thegreatbeans.com';
  }

  /**
   * Generate enhanced Product Schema for coffee products
   */
  generateCoffeeProductSchema(product: CoffeeProductData, locale: Locale): Record<string, any> {
    const productUrl = `${this.baseUrl}/${locale}/products/${product.id}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `${productUrl}#product`,
      name: product.name,
      description: product.description,
      url: productUrl,
      
      // Product identification
      sku: product.id,
      productID: product.id,
      
      // Coffee-specific properties
      category: 'Coffee',
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Coffee Variety',
          value: product.variety,
        },
        {
          '@type': 'PropertyValue',
          name: 'Origin',
          value: product.origin,
        },
        {
          '@type': 'PropertyValue',
          name: 'Processing Method',
          value: product.processingMethod,
        },
        {
          '@type': 'PropertyValue',
          name: 'Flavor Profile',
          value: product.flavorProfile.join(', '),
        },
        ...(product.roastLevel ? [{
          '@type': 'PropertyValue',
          name: 'Roast Level',
          value: product.roastLevel,
        }] : []),
        ...(product.altitude ? [{
          '@type': 'PropertyValue',
          name: 'Growing Altitude',
          value: product.altitude,
        }] : []),
        ...(product.harvestSeason ? [{
          '@type': 'PropertyValue',
          name: 'Harvest Season',
          value: product.harvestSeason,
        }] : []),
      ],
      
      // Technical specifications
      ...(product.specifications && {
        additionalProperty: [
          ...((this as any).additionalProperty || []),
          ...(product.specifications.moisture ? [{
            '@type': 'PropertyValue',
            name: 'Moisture Content',
            value: product.specifications.moisture,
          }] : []),
          ...(product.specifications.screenSize ? [{
            '@type': 'PropertyValue',
            name: 'Screen Size',
            value: product.specifications.screenSize,
          }] : []),
          ...(product.specifications.density ? [{
            '@type': 'PropertyValue',
            name: 'Density',
            value: product.specifications.density,
          }] : []),
          ...(product.specifications.defects ? [{
            '@type': 'PropertyValue',
            name: 'Defect Rate',
            value: product.specifications.defects,
          }] : []),
        ],
      }),
      
      // Brand and manufacturer
      brand: {
        '@type': 'Brand',
        name: advancedSEOConfig.business.name,
        logo: `${this.baseUrl}/images/logo.png`,
      },
      manufacturer: {
        '@type': 'Organization',
        '@id': `${this.baseUrl}/#organization`,
        name: advancedSEOConfig.business.name,
      },
      
      // Images
      image: product.images.map(img => ({
        '@type': 'ImageObject',
        url: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
        description: img.alt,
        caption: img.caption,
      })),
      
      // Offers and pricing
      offers: {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: product.price?.currency || 'USD',
        ...(product.price && {
          price: product.price.amount,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: product.price.amount,
            priceCurrency: product.price.currency,
            unitText: product.price.unit,
          },
        }),
        availability: `https://schema.org/${product.availability}`,
        seller: {
          '@type': 'Organization',
          '@id': `${this.baseUrl}/#organization`,
        },
        businessFunction: 'https://purl.org/goodrelations/v1#Sell',
        ...(product.minimumOrderQuantity && {
          eligibleQuantity: {
            '@type': 'QuantitativeValue',
            minValue: product.minimumOrderQuantity,
            unitText: 'kg',
          },
        }),
        areaServed: advancedSEOConfig.industry.servesCountries.map(country => ({
          '@type': 'Country',
          name: country,
        })),
        deliveryLeadTime: {
          '@type': 'QuantitativeValue',
          minValue: 14,
          maxValue: 30,
          unitCode: 'DAY',
        },
      },
      
      // Certifications
      hasCredential: product.certifications.map(cert => ({
        '@type': 'EducationalOccupationalCredential',
        name: cert,
        credentialCategory: 'certification',
      })),
      
      // Country of origin
      countryOfOrigin: {
        '@type': 'Country',
        name: product.origin,
      },
      
      // Audience
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'B2B Coffee Buyers',
      },
    };
  }

  /**
   * Generate Service Schema for B2B services
   */
  generateB2BServiceSchema(service: B2BServiceData, locale: Locale): Record<string, any> {
    const serviceUrl = `${this.baseUrl}/${locale}/services/${service.id}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      '@id': `${serviceUrl}#service`,
      name: service.name,
      description: service.description,
      url: serviceUrl,
      
      // Service provider
      provider: {
        '@type': 'Organization',
        '@id': `${this.baseUrl}/#organization`,
      },
      
      // Service category
      serviceType: service.serviceType,
      category: this.getServiceCategory(service.serviceType),
      
      // Service features
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.name} Features`,
        itemListElement: service.features.map((feature, index) => ({
          '@type': 'Offer',
          position: index + 1,
          name: feature,
        })),
      },
      
      // Area served
      areaServed: service.areaServed.map(area => ({
        '@type': 'Country',
        name: area,
      })),
      
      // Audience
      audience: {
        '@type': 'BusinessAudience',
        audienceType: service.targetMarkets.join(', '),
      },
      
      // Offers
      offers: {
        '@type': 'Offer',
        url: serviceUrl,
        ...(service.price && service.price.type === 'fixed' && {
          price: service.price.amount,
          priceCurrency: service.price.currency,
        }),
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          '@id': `${this.baseUrl}/#organization`,
        },
        businessFunction: 'https://purl.org/goodrelations/v1#Sell',
        ...(service.deliveryTime && {
          deliveryLeadTime: {
            '@type': 'QuantitativeValue',
            value: service.deliveryTime,
            unitCode: 'DAY',
          },
        }),
      },
      
      // Certifications
      hasCredential: service.certifications.map(cert => ({
        '@type': 'EducationalOccupationalCredential',
        name: cert,
        credentialCategory: 'certification',
      })),
    };
  }

  /**
   * Generate Article Schema with enhanced B2B focus
   */
  generateArticleSchema(article: ArticleData, locale: Locale): Record<string, any> {
    const articleUrl = `${this.baseUrl}/${locale}/blog/${article.id}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${articleUrl}#article`,
      headline: article.title,
      description: article.description,
      url: articleUrl,
      
      // Content details
      articleBody: article.content,
      wordCount: article.content.split(' ').length,
      ...(article.readingTime && {
        timeRequired: `PT${article.readingTime}M`,
      }),
      
      // Author information
      author: {
        '@type': 'Person',
        name: article.author,
        worksFor: {
          '@type': 'Organization',
          '@id': `${this.baseUrl}/#organization`,
        },
      },
      
      // Publisher
      publisher: {
        '@type': 'Organization',
        '@id': `${this.baseUrl}/#organization`,
      },
      
      // Dates
      datePublished: article.publishedDate,
      dateModified: article.modifiedDate || article.publishedDate,
      
      // Images
      image: article.images.map(img => ({
        '@type': 'ImageObject',
        url: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
        description: img.alt,
        caption: img.caption,
      })),
      
      // Main image for social sharing
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      
      // Category and tags
      articleSection: article.category,
      keywords: article.tags.join(', '),
      
      // Language
      inLanguage: locale,
      
      // Audience
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Coffee Industry Professionals',
      },
      
      // About (coffee industry)
      about: {
        '@type': 'Thing',
        name: 'Coffee Industry',
        sameAs: 'https://en.wikipedia.org/wiki/Coffee_industry',
      },
      
      // Mentions (if related to specific topics)
      mentions: [
        {
          '@type': 'Thing',
          name: 'Coffee Export',
          sameAs: 'https://en.wikipedia.org/wiki/Coffee_export',
        },
        {
          '@type': 'Thing',
          name: 'Vietnamese Coffee',
          sameAs: 'https://en.wikipedia.org/wiki/Vietnamese_coffee',
        },
      ],
    };
  }

  /**
   * Generate Market Report Schema
   */
  generateMarketReportSchema(report: MarketReportData, locale: Locale): Record<string, any> {
    const reportUrl = `${this.baseUrl}/${locale}/market-reports/${report.id}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Report',
      '@id': `${reportUrl}#report`,
      name: report.title,
      description: report.description,
      url: reportUrl,
      
      // Report details
      reportNumber: report.id,
      datePublished: report.publishedDate,
      
      // Author/Publisher
      author: {
        '@type': 'Person',
        name: report.author,
        worksFor: {
          '@type': 'Organization',
          '@id': `${this.baseUrl}/#organization`,
        },
      },
      publisher: {
        '@type': 'Organization',
        '@id': `${this.baseUrl}/#organization`,
      },
      
      // Coverage
      spatialCoverage: report.markets.map(market => ({
        '@type': 'Place',
        name: market,
      })),
      temporalCoverage: `${report.coveragePeriod.start}/${report.coveragePeriod.end}`,
      
      // Key findings
      abstract: report.keyFindings.join('. '),
      
      // Images
      image: report.images.map(img => ({
        '@type': 'ImageObject',
        url: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
        description: img.alt,
      })),
      
      // Subject matter
      about: {
        '@type': 'Thing',
        name: 'Coffee Market Analysis',
      },
      
      // Audience
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Coffee Industry Stakeholders',
      },
      
      // Language
      inLanguage: locale,
    };
  }

  /**
   * Generate Origin Story Schema with Place markup
   */
  generateOriginStorySchema(story: OriginStoryData, locale: Locale): Record<string, any> {
    const storyUrl = `${this.baseUrl}/${locale}/origins/${story.id}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      '@id': `${storyUrl}#story`,
      headline: story.title,
      description: story.description,
      url: storyUrl,
      
      // Publisher
      publisher: {
        '@type': 'Organization',
        '@id': `${this.baseUrl}/#organization`,
      },
      
      // Main entity (the place/farm)
      mainEntity: {
        '@type': 'Place',
        name: story.farmName || `${story.region}, ${story.country}`,
        address: {
          '@type': 'PostalAddress',
          addressRegion: story.region,
          addressCountry: story.country,
        },
        ...(story.coordinates && {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: story.coordinates.latitude,
            longitude: story.coordinates.longitude,
          },
        }),
        
        // Agricultural properties
        additionalProperty: [
          ...(story.altitude ? [{
            '@type': 'PropertyValue',
            name: 'Altitude',
            value: story.altitude,
          }] : []),
          ...(story.climate ? [{
            '@type': 'PropertyValue',
            name: 'Climate',
            value: story.climate,
          }] : []),
          ...(story.soilType ? [{
            '@type': 'PropertyValue',
            name: 'Soil Type',
            value: story.soilType,
          }] : []),
          {
            '@type': 'PropertyValue',
            name: 'Coffee Varieties',
            value: story.varietiesGrown.join(', '),
          },
          {
            '@type': 'PropertyValue',
            name: 'Harvest Season',
            value: story.harvestSeason,
          },
          {
            '@type': 'PropertyValue',
            name: 'Processing Methods',
            value: story.processingMethods.join(', '),
          },
        ],
      },
      
      // Images
      image: story.images.map(img => ({
        '@type': 'ImageObject',
        url: img.url.startsWith('http') ? img.url : `${this.baseUrl}${img.url}`,
        description: img.alt,
        caption: img.caption,
      })),
      
      // Sustainability and certifications
      mentions: [
        ...story.sustainabilityPractices.map(practice => ({
          '@type': 'Thing',
          name: practice,
        })),
        ...story.certifications.map(cert => ({
          '@type': 'Certification',
          name: cert,
        })),
      ],
      
      // Language
      inLanguage: locale,
      
      // Audience
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Coffee Sourcing Professionals',
      },
    };
  }

  /**
   * Generate Collection Page Schema (for product listings, blog categories, etc.)
   */
  generateCollectionPageSchema(
    title: string,
    description: string,
    items: Array<{ name: string; url: string; description?: string }>,
    locale: Locale,
    collectionType: 'products' | 'articles' | 'services' | 'reports'
  ): Record<string, any> {
    const collectionUrl = `${this.baseUrl}/${locale}/${collectionType}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${collectionUrl}#collection`,
      name: title,
      description,
      url: collectionUrl,
      
      // Main entity
      mainEntity: {
        '@type': 'ItemList',
        name: title,
        description,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          url: item.url.startsWith('http') ? item.url : `${this.baseUrl}${item.url}`,
          ...(item.description && { description: item.description }),
        })),
      },
      
      // Publisher
      publisher: {
        '@type': 'Organization',
        '@id': `${this.baseUrl}/#organization`,
      },
      
      // Language
      inLanguage: locale,
      
      // Audience
      audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Coffee Industry Professionals',
      },
    };
  }

  /**
   * Helper method to get service category
   */
  private getServiceCategory(serviceType: string): string {
    const categories = {
      export: 'Export Services',
      manufacturing: 'Manufacturing Services',
      consulting: 'Business Consulting',
      logistics: 'Logistics Services',
      'quality-control': 'Quality Assurance Services',
    };
    
    return categories[serviceType as keyof typeof categories] || 'Business Services';
  }
}

// Export singleton instance
export const schemaGenerators = new SchemaGenerators();