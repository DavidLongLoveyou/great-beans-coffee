import { type Locale } from '@/i18n';
import { seoConfig } from './seo-utils';

// Enhanced Coffee Product Schema with industry-specific properties
export interface CoffeeProductSchema {
  '@context': 'https://schema.org';
  '@type': 'Product';
  '@id': string;
  name: string;
  description: string;
  image: string[];
  brand: {
    '@type': 'Brand';
    name: string;
    logo: string;
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
  sku: string;
  // Coffee-specific properties
  additionalProperty: Array<{
    '@type': 'PropertyValue';
    name: string;
    value: string;
    description?: string;
  }>;
  // B2B Offers
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
      unitCode: string;
      unitText: string;
    };
    deliveryLeadTime: {
      '@type': 'QuantitativeValue';
      minValue: number;
      maxValue: number;
      unitCode: 'DAY';
    };
    areaServed: string[];
    incoterms: string[];
  };
  // Quality certifications
  hasCredential?: Array<{
    '@type': 'EducationalOccupationalCredential';
    name: string;
    credentialCategory: 'Quality Certification';
    recognizedBy: {
      '@type': 'Organization';
      name: string;
    };
  }>;
  // Origin information
  countryOfOrigin?: {
    '@type': 'Country';
    name: string;
  };
  // Sustainability information
  sustainabilityRating?: {
    '@type': 'Rating';
    ratingValue: string;
    bestRating: string;
    worstRating: string;
  };
}

// Coffee Origin Schema for detailed origin information
export interface CoffeeOriginSchema {
  '@context': 'https://schema.org';
  '@type': 'Place';
  '@id': string;
  name: string;
  description: string;
  geo: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  containedInPlace: {
    '@type': 'Country';
    name: string;
  };
  additionalProperty: Array<{
    '@type': 'PropertyValue';
    name: string;
    value: string;
  }>;
}

// Coffee Certification Schema
export interface CoffeeCertificationSchema {
  '@context': 'https://schema.org';
  '@type': 'EducationalOccupationalCredential';
  '@id': string;
  name: string;
  description: string;
  credentialCategory:
    | 'Quality Certification'
    | 'Sustainability Certification'
    | 'Organic Certification';
  recognizedBy: {
    '@type': 'Organization';
    name: string;
    url?: string;
  };
  validIn: {
    '@type': 'Country';
    name: string;
  }[];
  dateCreated: string;
  validFrom: string;
  validUntil?: string;
}

// Generate enhanced coffee product schema
export function generateEnhancedCoffeeProductSchema(
  product: {
    id: string;
    name: string;
    description: string;
    images: string[];
    category: string;
    sku: string;
    variety: string;
    origin: {
      country: string;
      region: string;
      farm?: string;
      altitude?: number;
      coordinates?: { lat: number; lng: number };
    };
    processing: {
      method: string;
      fermentation?: string;
      drying?: string;
    };
    characteristics: {
      flavorProfile: string[];
      acidity: string;
      body: string;
      aroma: string;
      cupping_score?: number;
    };
    specifications: {
      moisture?: number;
      screenSize?: string;
      density?: number;
      defects?: number;
    };
    certifications: Array<{
      name: string;
      issuer: string;
      validFrom: string;
      validUntil?: string;
    }>;
    pricing: {
      minOrderQuantity: number;
      unit: string;
      leadTime: { min: number; max: number };
      incoterms: string[];
    };
    sustainability?: {
      rating: number;
      practices: string[];
    };
  },
  _locale: Locale
): CoffeeProductSchema {
  const baseUrl = seoConfig.siteUrl;
  const productUrl = `${baseUrl}/${_locale}/products/${product.id}`;

  // Build coffee-specific properties
  const additionalProperties = [
    {
      '@type': 'PropertyValue' as const,
      name: 'Coffee Variety',
      value: product.variety,
      description: 'The specific variety of coffee bean',
    },
    {
      '@type': 'PropertyValue' as const,
      name: 'Processing Method',
      value: product.processing.method,
      description: 'Method used to process the coffee beans',
    },
    {
      '@type': 'PropertyValue' as const,
      name: 'Flavor Profile',
      value: product.characteristics.flavorProfile.join(', '),
      description: 'Primary flavor notes and characteristics',
    },
    {
      '@type': 'PropertyValue' as const,
      name: 'Acidity Level',
      value: product.characteristics.acidity,
      description: 'Acidity level of the coffee',
    },
    {
      '@type': 'PropertyValue' as const,
      name: 'Body',
      value: product.characteristics.body,
      description: 'Body and mouthfeel characteristics',
    },
    {
      '@type': 'PropertyValue' as const,
      name: 'Aroma',
      value: product.characteristics.aroma,
      description: 'Aromatic characteristics',
    },
    {
      '@type': 'PropertyValue' as const,
      name: 'Origin Region',
      value: `${product.origin.region}, ${product.origin.country}`,
      description: 'Geographic origin of the coffee',
    },
  ];

  // Add altitude if available
  if (product.origin.altitude) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Growing Altitude',
      value: `${product.origin.altitude}m`,
      description: 'Altitude at which the coffee is grown',
    });
  }

  // Add cupping score if available
  if (product.characteristics.cupping_score) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Cupping Score',
      value: product.characteristics.cupping_score.toString(),
      description: 'Professional cupping score (0-100 scale)',
    });
  }

  // Add specifications
  if (product.specifications.moisture) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Moisture Content',
      value: `${product.specifications.moisture}%`,
      description: 'Moisture content percentage',
    });
  }

  if (product.specifications.screenSize) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Screen Size',
      value: product.specifications.screenSize,
      description: 'Bean screen size classification',
    });
  }

  if (product.specifications.density) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Bean Density',
      value: `${product.specifications.density} g/ml`,
      description: 'Bean density measurement',
    });
  }

  if (product.specifications.defects !== undefined) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Defect Rate',
      value: `${product.specifications.defects}%`,
      description: 'Percentage of defective beans',
    });
  }

  // Add processing details
  if (product.processing.fermentation) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Fermentation',
      value: product.processing.fermentation,
      description: 'Fermentation process used',
    });
  }

  if (product.processing.drying) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Drying Method',
      value: product.processing.drying,
      description: 'Method used for drying the beans',
    });
  }

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
    additionalProperty: additionalProperties,
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
        minValue: product.pricing.minOrderQuantity,
        unitCode: 'KGM',
        unitText: product.pricing.unit,
      },
      deliveryLeadTime: {
        '@type': 'QuantitativeValue',
        minValue: product.pricing.leadTime.min,
        maxValue: product.pricing.leadTime.max,
        unitCode: 'DAY',
      },
      areaServed: ['Global'],
      incoterms: product.pricing.incoterms,
    },
    hasCredential: product.certifications.map(cert => ({
      '@type': 'EducationalOccupationalCredential' as const,
      name: cert.name,
      credentialCategory: 'Quality Certification' as const,
      recognizedBy: {
        '@type': 'Organization' as const,
        name: cert.issuer,
      },
    })),
    countryOfOrigin: {
      '@type': 'Country',
      name: product.origin.country,
    },
    ...(product.sustainability && {
      sustainabilityRating: {
        '@type': 'Rating',
        ratingValue: product.sustainability.rating.toString(),
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };
}

// Generate coffee origin schema
export function generateCoffeeOriginSchema(
  origin: {
    id: string;
    name: string;
    description: string;
    country: string;
    region: string;
    coordinates?: { lat: number; lng: number };
    altitude?: number;
    climate?: string;
    soilType?: string;
    rainfall?: string;
    temperature?: string;
  },
  _locale: Locale
): CoffeeOriginSchema {
  const baseUrl = seoConfig.siteUrl;
  const originUrl = `${baseUrl}/${_locale}/origins/${origin.id}`;

  const additionalProperties = [
    {
      '@type': 'PropertyValue' as const,
      name: 'Region',
      value: origin.region,
    },
  ];

  if (origin.altitude) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Altitude',
      value: `${origin.altitude}m`,
    });
  }

  if (origin.climate) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Climate',
      value: origin.climate,
    });
  }

  if (origin.soilType) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Soil Type',
      value: origin.soilType,
    });
  }

  if (origin.rainfall) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Annual Rainfall',
      value: origin.rainfall,
    });
  }

  if (origin.temperature) {
    additionalProperties.push({
      '@type': 'PropertyValue' as const,
      name: 'Average Temperature',
      value: origin.temperature,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    '@id': originUrl,
    name: origin.name,
    description: origin.description,
    geo: origin.coordinates
      ? {
          '@type': 'GeoCoordinates',
          latitude: origin.coordinates.lat,
          longitude: origin.coordinates.lng,
        }
      : {
          '@type': 'GeoCoordinates',
          latitude: 0,
          longitude: 0,
        },
    containedInPlace: {
      '@type': 'Country',
      name: origin.country,
    },
    additionalProperty: additionalProperties,
  };
}

// Generate coffee certification schema
export function generateCoffeeCertificationSchema(
  certification: {
    id: string;
    name: string;
    description: string;
    category: 'Quality' | 'Sustainability' | 'Organic';
    issuer: {
      name: string;
      url?: string;
    };
    validCountries: string[];
    dateCreated: string;
    validFrom: string;
    validUntil?: string;
  },
  _locale: Locale
): CoffeeCertificationSchema {
  const baseUrl = seoConfig.siteUrl;
  const certUrl = `${baseUrl}/${_locale}/certifications/${certification.id}`;

  const categoryMap = {
    Quality: 'Quality Certification' as const,
    Sustainability: 'Sustainability Certification' as const,
    Organic: 'Organic Certification' as const,
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    '@id': certUrl,
    name: certification.name,
    description: certification.description,
    credentialCategory: categoryMap[certification.category],
    recognizedBy: {
      '@type': 'Organization',
      name: certification.issuer.name,
      ...(certification.issuer.url && { url: certification.issuer.url }),
    },
    validIn: certification.validCountries.map(country => ({
      '@type': 'Country' as const,
      name: country,
    })),
    dateCreated: certification.dateCreated,
    validFrom: certification.validFrom,
    ...(certification.validUntil && { validUntil: certification.validUntil }),
  };
}
