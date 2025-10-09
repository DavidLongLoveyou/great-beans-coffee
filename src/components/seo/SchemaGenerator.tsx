import { type Locale } from '@/i18n';

// Base schema interfaces
interface BaseSchema {
  '@context': string;
  '@type': string;
}

interface ImageObject {
  '@type': 'ImageObject';
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress: string;
  addressLocality: string;
  addressRegion?: string;
  postalCode?: string;
  addressCountry: string;
}

interface ContactPoint {
  '@type': 'ContactPoint';
  telephone: string;
  contactType: 'sales' | 'customer service' | 'technical support' | 'billing';
  availableLanguage: string[];
  email?: string;
}

interface Organization extends BaseSchema {
  '@type': 'Organization';
  name: string;
  alternateName?: string;
  url: string;
  logo: string | ImageObject;
  description: string;
  foundingDate?: string;
  address?: PostalAddress;
  contactPoint?: ContactPoint | ContactPoint[];
  sameAs?: string[];
  hasOfferCatalog?: OfferCatalog;
  aggregateRating?: AggregateRating;
  review?: Review[];
}

interface Product extends BaseSchema {
  '@type': 'Product';
  name: string;
  description: string;
  brand: Brand;
  category: string;
  image: string | ImageObject | ImageObject[];
  offers: Offer | Offer[];
  aggregateRating?: AggregateRating;
  review?: Review[];
  sku?: string;
  gtin?: string;
  mpn?: string;
  additionalProperty?: PropertyValue[];
}

interface Service extends BaseSchema {
  '@type': 'Service';
  name: string;
  description: string;
  provider: Organization;
  serviceType: string;
  areaServed: string | string[];
  hasOfferCatalog?: OfferCatalog;
  aggregateRating?: AggregateRating;
  review?: Review[];
  additionalProperty?: PropertyValue[];
}

interface Article extends BaseSchema {
  '@type': 'Article';
  headline: string;
  description: string;
  image: string | ImageObject;
  author: Person | Organization;
  publisher: Organization;
  datePublished: string;
  dateModified?: string;
  mainEntityOfPage: WebPage;
  articleSection?: string;
  keywords?: string[];
}

interface Offer {
  '@type': 'Offer';
  price?: string;
  priceCurrency?: string;
  availability: string;
  seller: Organization;
  validFrom?: string;
  validThrough?: string;
  priceSpecification?: PriceSpecification;
  itemCondition?: string;
  warranty?: WarrantyPromise;
}

interface OfferCatalog {
  '@type': 'OfferCatalog';
  name: string;
  itemListElement: Offer[];
}

interface Brand {
  '@type': 'Brand';
  name: string;
  logo?: string | ImageObject;
}

interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: string;
  reviewCount: string;
  bestRating?: string;
  worstRating?: string;
}

interface Review {
  '@type': 'Review';
  reviewRating: Rating;
  author: Person;
  reviewBody: string;
  datePublished: string;
}

interface Rating {
  '@type': 'Rating';
  ratingValue: string;
  bestRating?: string;
  worstRating?: string;
}

interface Person {
  '@type': 'Person';
  name: string;
  jobTitle?: string;
  worksFor?: Organization;
}

interface WebPage {
  '@type': 'WebPage';
  '@id': string;
}

interface PropertyValue {
  '@type': 'PropertyValue';
  name: string;
  value: string;
}

interface PriceSpecification {
  '@type': 'PriceSpecification';
  price: string;
  priceCurrency: string;
  minPrice?: string;
  maxPrice?: string;
  unitCode?: string;
}

interface WarrantyPromise {
  '@type': 'WarrantyPromise';
  durationOfWarranty: string;
  warrantyScope: string;
}

// Schema generation props
interface OrganizationSchemaProps {
  name: string;
  alternateName?: string;
  url: string;
  logo: string;
  description: string;
  foundingDate?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: 'sales' | 'customer service' | 'technical support' | 'billing';
    availableLanguage: string[];
    email?: string;
  };
  sameAs?: string[];
  products?: Array<{
    name: string;
    category: string;
    price?: string;
    currency?: string;
  }>;
  rating?: {
    ratingValue: string;
    reviewCount: string;
  };
}

interface ProductSchemaProps {
  name: string;
  description: string;
  brand: string;
  category: string;
  image: string | string[];
  price?: string;
  currency?: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder' | 'Discontinued';
  sku?: string;
  gtin?: string;
  mpn?: string;
  seller: {
    name: string;
    url?: string;
    logo?: string;
    description?: string;
  };
  rating?: {
    ratingValue: string;
    reviewCount: string;
  };
  properties?: Array<{
    name: string;
    value: string;
  }>;
  warranty?: {
    duration: string;
    scope: string;
  };
}

interface ServiceSchemaProps {
  name: string;
  description: string;
  serviceType: string;
  provider: {
    name: string;
    url?: string;
    logo?: string;
    description?: string;
  };
  areaServed: string | string[];
  offers?: Array<{
    name: string;
    price?: string;
    currency?: string;
  }>;
  rating?: {
    ratingValue: string;
    reviewCount: string;
  };
  properties?: Array<{
    name: string;
    value: string;
  }>;
}

interface ArticleSchemaProps {
  headline: string;
  description: string;
  image: string;
  author: {
    name: string;
    jobTitle?: string;
  };
  publisher: {
    name: string;
    logo: string;
    url?: string;
    description?: string;
  };
  datePublished: string;
  dateModified?: string;
  url: string;
  section?: string;
  keywords?: string[];
}

export class SchemaGenerator {
  private baseUrl: string;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL ||
      'https://thegreatbeans.com'
  ) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate Organization schema for company pages
   */
  generateOrganizationSchema(props: OrganizationSchemaProps): Organization {
    const schema: Organization = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: props.name,
      url: props.url,
      logo: props.logo,
      description: props.description,
    };

    if (props.alternateName) {
      schema.alternateName = props.alternateName;
    }

    if (props.foundingDate) {
      schema.foundingDate = props.foundingDate;
    }

    if (props.address) {
      schema.address = {
        '@type': 'PostalAddress',
        ...props.address,
      };
    }

    if (props.contactPoint) {
      schema.contactPoint = {
        '@type': 'ContactPoint',
        ...props.contactPoint,
      };
    }

    if (props.sameAs) {
      schema.sameAs = props.sameAs;
    }

    if (props.products && props.products.length > 0) {
      schema.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        name: `${props.name} Product Catalog`,
        itemListElement: props.products.map(product => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: product.name,
            category: product.category,
          },
          ...(product.price &&
            product.currency && {
              price: product.price,
              priceCurrency: product.currency,
            }),
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            '@context': 'https://schema.org',
            name: props.name,
            url: props.url,
            logo: props.logo,
            description: props.description,
          },
        })),
      };
    }

    if (props.rating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: props.rating.ratingValue,
        reviewCount: props.rating.reviewCount,
        bestRating: '5',
        worstRating: '1',
      };
    }

    return schema;
  }

  /**
   * Generate Product schema with Offers for product pages
   */
  generateProductSchema(props: ProductSchemaProps): Product {
    const images = Array.isArray(props.image) ? props.image : [props.image];

    const schema: Product = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: props.name,
      description: props.description,
      brand: {
        '@type': 'Brand',
        name: props.brand,
      },
      category: props.category,
      image: images.map(img => ({
        '@type': 'ImageObject',
        url: img,
        alt: props.name,
      })),
      offers: {
        '@type': 'Offer',
        availability: `https://schema.org/${props.availability}`,
        seller: {
          '@type': 'Organization',
          '@context': 'https://schema.org',
          name: props.seller.name,
          url: props.seller.url || this.baseUrl,
          logo: props.seller.logo || `${this.baseUrl}/images/logo.png`,
          description: props.seller.description || props.description,
        },
        ...(props.price &&
          props.currency && {
            price: props.price,
            priceCurrency: props.currency,
          }),
        itemCondition: 'https://schema.org/NewCondition',
      },
    };

    if (props.sku) {
      schema.sku = props.sku;
    }

    if (props.gtin) {
      schema.gtin = props.gtin;
    }

    if (props.mpn) {
      schema.mpn = props.mpn;
    }

    if (props.rating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: props.rating.ratingValue,
        reviewCount: props.rating.reviewCount,
        bestRating: '5',
        worstRating: '1',
      };
    }

    if (props.properties && props.properties.length > 0) {
      schema.additionalProperty = props.properties.map(prop => ({
        '@type': 'PropertyValue',
        name: prop.name,
        value: prop.value,
      }));
    }

    if (props.warranty) {
      (schema.offers as Offer).warranty = {
        '@type': 'WarrantyPromise',
        durationOfWarranty: props.warranty.duration,
        warrantyScope: props.warranty.scope,
      };
    }

    return schema;
  }

  /**
   * Generate Service schema for service pages
   */
  generateServiceSchema(props: ServiceSchemaProps): Service {
    const schema: Service = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: props.name,
      description: props.description,
      serviceType: props.serviceType,
      provider: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: props.provider.name,
        url: props.provider.url || this.baseUrl,
        logo: props.provider.logo || `${this.baseUrl}/images/logo.png`,
        description: props.provider.description || props.description,
      },
      areaServed: props.areaServed,
    };

    if (props.offers && props.offers.length > 0) {
      schema.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        name: `${props.name} Service Offers`,
        itemListElement: props.offers.map(offer => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: offer.name,
          },
          ...(offer.price &&
            offer.currency && {
              price: offer.price,
              priceCurrency: offer.currency,
            }),
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            '@context': 'https://schema.org',
            name: props.provider.name,
            url: props.provider.url || this.baseUrl,
            logo: props.provider.logo || `${this.baseUrl}/images/logo.png`,
            description: props.provider.description || props.description,
          },
        })),
      };
    }

    if (props.rating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: props.rating.ratingValue,
        reviewCount: props.rating.reviewCount,
        bestRating: '5',
        worstRating: '1',
      };
    }

    if (props.properties && props.properties.length > 0) {
      schema.additionalProperty = props.properties.map(prop => ({
        '@type': 'PropertyValue',
        name: prop.name,
        value: prop.value,
      }));
    }

    return schema;
  }

  /**
   * Generate Article schema for content pages
   */
  generateArticleSchema(props: ArticleSchemaProps): Article {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: props.headline,
      description: props.description,
      image: {
        '@type': 'ImageObject',
        url: props.image,
        alt: props.headline,
      },
      author: {
        '@type': 'Person',
        name: props.author.name,
        ...(props.author.jobTitle && { jobTitle: props.author.jobTitle }),
      },
      publisher: {
        '@type': 'Organization',
        '@context': 'https://schema.org',
        name: props.publisher.name,
        url: props.publisher.url || this.baseUrl,
        description: props.publisher.description || props.description,
        logo: {
          '@type': 'ImageObject',
          url: props.publisher.logo,
        },
      },
      datePublished: props.datePublished,
      dateModified: props.dateModified || props.datePublished,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': props.url,
      },
      ...(props.section && { articleSection: props.section }),
      ...(props.keywords && { keywords: props.keywords }),
    };
  }

  /**
   * Generate FAQ schema for AI optimization
   */
  generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
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
   * Generate BreadcrumbList schema for navigation
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: breadcrumb.name,
        item: breadcrumb.url,
      })),
    };
  }

  /**
   * Generate WebSite schema with search action
   */
  generateWebSiteSchema(name: string, url: string, searchUrl: string) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name,
      url,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${searchUrl}?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }
}

// Export default instance
export const schemaGenerator = new SchemaGenerator();

// Export types for external use
export type {
  OrganizationSchemaProps,
  ProductSchemaProps,
  ServiceSchemaProps,
  ArticleSchemaProps,
};
