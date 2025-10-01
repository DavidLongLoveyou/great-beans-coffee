import { Locale } from '@/i18n';

export interface Port {
  name: string;
  code: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface MarketConfig {
  locale: Locale;
  region: string;
  country: string;
  countryCode: string;
  currency: {
    code: string;
    symbol: string;
    name: string;
  };
  timezone: string;
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousands: string;
  };
  majorPorts: Port[];
  businessHours: {
    start: string;
    end: string;
    timezone: string;
  };
  shippingInfo: {
    averageTransitDays: number;
    preferredIncoterms: string[];
  };
}

export const marketConfigs: Record<Locale, MarketConfig> = {
  en: {
    locale: 'en',
    region: 'North America',
    country: 'United States',
    countryCode: 'US',
    currency: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
    },
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
    },
    majorPorts: [
      {
        name: 'Port of New York and New Jersey',
        code: 'USNYC',
        city: 'New York',
        country: 'United States',
        coordinates: { lat: 40.6892, lng: -74.0445 },
      },
      {
        name: 'Port of Los Angeles',
        code: 'USLAX',
        city: 'Los Angeles',
        country: 'United States',
        coordinates: { lat: 33.7361, lng: -118.2639 },
      },
      {
        name: 'Port of Long Beach',
        code: 'USLGB',
        city: 'Long Beach',
        country: 'United States',
        coordinates: { lat: 33.7553, lng: -118.2111 },
      },
    ],
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'America/New_York',
    },
    shippingInfo: {
      averageTransitDays: 25,
      preferredIncoterms: ['FOB', 'CIF', 'CFR'],
    },
  },
  de: {
    locale: 'de',
    region: 'Europe',
    country: 'Germany',
    countryCode: 'DE',
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
    },
    timezone: 'Europe/Berlin',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
    majorPorts: [
      {
        name: 'Port of Hamburg',
        code: 'DEHAM',
        city: 'Hamburg',
        country: 'Germany',
        coordinates: { lat: 53.5511, lng: 9.9937 },
      },
      {
        name: 'Port of Bremen',
        code: 'DEBRV',
        city: 'Bremen',
        country: 'Germany',
        coordinates: { lat: 53.0793, lng: 8.8017 },
      },
      {
        name: 'Port of Rotterdam',
        code: 'NLRTM',
        city: 'Rotterdam',
        country: 'Netherlands',
        coordinates: { lat: 51.9244, lng: 4.4777 },
      },
    ],
    businessHours: {
      start: '08:00',
      end: '17:00',
      timezone: 'Europe/Berlin',
    },
    shippingInfo: {
      averageTransitDays: 20,
      preferredIncoterms: ['CIF', 'CFR', 'DAP'],
    },
  },
  ja: {
    locale: 'ja',
    region: 'Asia Pacific',
    country: 'Japan',
    countryCode: 'JP',
    currency: {
      code: 'JPY',
      symbol: '¥',
      name: 'Japanese Yen',
    },
    timezone: 'Asia/Tokyo',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: {
      decimal: '.',
      thousands: ',',
    },
    majorPorts: [
      {
        name: 'Port of Tokyo',
        code: 'JPTYO',
        city: 'Tokyo',
        country: 'Japan',
        coordinates: { lat: 35.6762, lng: 139.6503 },
      },
      {
        name: 'Port of Yokohama',
        code: 'JPYOK',
        city: 'Yokohama',
        country: 'Japan',
        coordinates: { lat: 35.4437, lng: 139.638 },
      },
      {
        name: 'Port of Kobe',
        code: 'JPUKB',
        city: 'Kobe',
        country: 'Japan',
        coordinates: { lat: 34.6901, lng: 135.1956 },
      },
    ],
    businessHours: {
      start: '09:00',
      end: '18:00',
      timezone: 'Asia/Tokyo',
    },
    shippingInfo: {
      averageTransitDays: 15,
      preferredIncoterms: ['CIF', 'CFR', 'FOB'],
    },
  },
  fr: {
    locale: 'fr',
    region: 'Europe',
    country: 'France',
    countryCode: 'FR',
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
    },
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
    },
    majorPorts: [
      {
        name: 'Port of Le Havre',
        code: 'FRLEH',
        city: 'Le Havre',
        country: 'France',
        coordinates: { lat: 49.4944, lng: 0.1079 },
      },
      {
        name: 'Port of Marseille',
        code: 'FRMRS',
        city: 'Marseille',
        country: 'France',
        coordinates: { lat: 43.2965, lng: 5.3698 },
      },
      {
        name: 'Port of Antwerp',
        code: 'BEANR',
        city: 'Antwerp',
        country: 'Belgium',
        coordinates: { lat: 51.2194, lng: 4.4025 },
      },
    ],
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'Europe/Paris',
    },
    shippingInfo: {
      averageTransitDays: 18,
      preferredIncoterms: ['CIF', 'CFR', 'DAP'],
    },
  },
  it: {
    locale: 'it',
    region: 'Europe',
    country: 'Italy',
    countryCode: 'IT',
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
    },
    timezone: 'Europe/Rome',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
    majorPorts: [
      {
        name: 'Port of Genoa',
        code: 'ITGOA',
        city: 'Genoa',
        country: 'Italy',
        coordinates: { lat: 44.4056, lng: 8.9463 },
      },
      {
        name: 'Port of La Spezia',
        code: 'ITLSP',
        city: 'La Spezia',
        country: 'Italy',
        coordinates: { lat: 44.1023, lng: 9.8196 },
      },
      {
        name: 'Port of Naples',
        code: 'ITNAP',
        city: 'Naples',
        country: 'Italy',
        coordinates: { lat: 40.8518, lng: 14.2681 },
      },
    ],
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'Europe/Rome',
    },
    shippingInfo: {
      averageTransitDays: 22,
      preferredIncoterms: ['CIF', 'CFR', 'FOB'],
    },
  },
  es: {
    locale: 'es',
    region: 'Europe',
    country: 'Spain',
    countryCode: 'ES',
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
    },
    timezone: 'Europe/Madrid',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
    majorPorts: [
      {
        name: 'Port of Valencia',
        code: 'ESVLC',
        city: 'Valencia',
        country: 'Spain',
        coordinates: { lat: 39.4699, lng: -0.3763 },
      },
      {
        name: 'Port of Barcelona',
        code: 'ESBCN',
        city: 'Barcelona',
        country: 'Spain',
        coordinates: { lat: 41.3851, lng: 2.1734 },
      },
      {
        name: 'Port of Algeciras',
        code: 'ESALG',
        city: 'Algeciras',
        country: 'Spain',
        coordinates: { lat: 36.1408, lng: -5.4526 },
      },
    ],
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'Europe/Madrid',
    },
    shippingInfo: {
      averageTransitDays: 20,
      preferredIncoterms: ['CIF', 'CFR', 'DAP'],
    },
  },
  nl: {
    locale: 'nl',
    region: 'Europe',
    country: 'Netherlands',
    countryCode: 'NL',
    currency: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
    },
    timezone: 'Europe/Amsterdam',
    dateFormat: 'DD-MM-YYYY',
    numberFormat: {
      decimal: ',',
      thousands: '.',
    },
    majorPorts: [
      {
        name: 'Port of Rotterdam',
        code: 'NLRTM',
        city: 'Rotterdam',
        country: 'Netherlands',
        coordinates: { lat: 51.9244, lng: 4.4777 },
      },
      {
        name: 'Port of Amsterdam',
        code: 'NLAMS',
        city: 'Amsterdam',
        country: 'Netherlands',
        coordinates: { lat: 52.3676, lng: 4.9041 },
      },
      {
        name: 'Port of Antwerp',
        code: 'BEANR',
        city: 'Antwerp',
        country: 'Belgium',
        coordinates: { lat: 51.2194, lng: 4.4025 },
      },
    ],
    businessHours: {
      start: '08:30',
      end: '17:00',
      timezone: 'Europe/Amsterdam',
    },
    shippingInfo: {
      averageTransitDays: 18,
      preferredIncoterms: ['CIF', 'CFR', 'DAP'],
    },
  },
  ko: {
    locale: 'ko',
    region: 'Asia Pacific',
    country: 'South Korea',
    countryCode: 'KR',
    currency: {
      code: 'KRW',
      symbol: '₩',
      name: 'Korean Won',
    },
    timezone: 'Asia/Seoul',
    dateFormat: 'YYYY.MM.DD',
    numberFormat: {
      decimal: '.',
      thousands: ',',
    },
    majorPorts: [
      {
        name: 'Port of Busan',
        code: 'KRPUS',
        city: 'Busan',
        country: 'South Korea',
        coordinates: { lat: 35.1796, lng: 129.0756 },
      },
      {
        name: 'Port of Incheon',
        code: 'KRICN',
        city: 'Incheon',
        country: 'South Korea',
        coordinates: { lat: 37.4563, lng: 126.7052 },
      },
      {
        name: 'Port of Gwangyang',
        code: 'KRKWY',
        city: 'Gwangyang',
        country: 'South Korea',
        coordinates: { lat: 34.9406, lng: 127.7669 },
      },
    ],
    businessHours: {
      start: '09:00',
      end: '18:00',
      timezone: 'Asia/Seoul',
    },
    shippingInfo: {
      averageTransitDays: 12,
      preferredIncoterms: ['CIF', 'CFR', 'FOB'],
    },
  },
};

/**
 * Get market configuration for a specific locale
 */
export function getMarketConfig(locale: Locale): MarketConfig {
  return marketConfigs[locale] || marketConfigs.en;
}

/**
 * Get all available markets
 */
export function getAllMarkets(): MarketConfig[] {
  return Object.values(marketConfigs);
}

/**
 * Get markets by region
 */
export function getMarketsByRegion(region: string): MarketConfig[] {
  return Object.values(marketConfigs).filter(
    config => config.region === region
  );
}

/**
 * Format currency for a specific market
 */
export function formatCurrency(amount: number, locale: Locale): string {
  const config = getMarketConfig(locale);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: config.currency.code,
  }).format(amount);
}

/**
 * Format date for a specific market
 */
export function formatDate(date: Date, locale: Locale): string {
  const config = getMarketConfig(locale);
  return new Intl.DateTimeFormat(locale, {
    timeZone: config.timezone,
  }).format(date);
}

/**
 * Get business hours in local time
 */
export function getBusinessHours(locale: Locale): {
  start: string;
  end: string;
  timezone: string;
} {
  const config = getMarketConfig(locale);
  return config.businessHours;
}

/**
 * Calculate estimated delivery date
 */
export function getEstimatedDelivery(
  locale: Locale,
  shipDate: Date = new Date()
): Date {
  const config = getMarketConfig(locale);
  const deliveryDate = new Date(shipDate);
  deliveryDate.setDate(
    deliveryDate.getDate() + config.shippingInfo.averageTransitDays
  );
  return deliveryDate;
}
