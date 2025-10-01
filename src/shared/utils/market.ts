import { Locale } from '@/i18n';
import { getMarketConfig, Port } from '@/shared/config/markets';

/**
 * Calculate shipping cost estimate based on distance and weight
 */
export function calculateShippingEstimate(
  fromPort: Port,
  toPort: Port,
  weightKg: number,
  locale: Locale
): {
  estimatedCost: number;
  currency: string;
  transitDays: number;
} {
  const config = getMarketConfig(locale);

  // Calculate distance using Haversine formula
  const distance = calculateDistance(
    fromPort.coordinates.lat,
    fromPort.coordinates.lng,
    toPort.coordinates.lat,
    toPort.coordinates.lng
  );

  // Base rate per kg per 1000km
  const baseRatePerKgPer1000km = 2.5;
  const estimatedCost = (distance / 1000) * weightKg * baseRatePerKgPer1000km;

  return {
    estimatedCost: Math.round(estimatedCost * 100) / 100,
    currency: config.currency.code,
    transitDays: config.shippingInfo.averageTransitDays,
  };
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get the nearest port to a given location
 */
export function getNearestPort(
  latitude: number,
  longitude: number,
  locale: Locale
): Port {
  const config = getMarketConfig(locale);
  let nearestPort = config.majorPorts[0];
  let minDistance = Infinity;

  config.majorPorts.forEach(port => {
    const distance = calculateDistance(
      latitude,
      longitude,
      port.coordinates.lat,
      port.coordinates.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestPort = port;
    }
  });

  return nearestPort;
}

/**
 * Check if current time is within business hours for a market
 */
export function isWithinBusinessHours(
  locale: Locale,
  date: Date = new Date()
): boolean {
  const config = getMarketConfig(locale);
  const businessHours = config.businessHours;

  // Convert to market timezone
  const marketTime = new Intl.DateTimeFormat('en-US', {
    timeZone: businessHours.timezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  const [currentHour, currentMinute] = marketTime.split(':').map(Number);
  const currentTimeMinutes = currentHour * 60 + currentMinute;

  const [startHour, startMinute] = businessHours.start.split(':').map(Number);
  const startTimeMinutes = startHour * 60 + startMinute;

  const [endHour, endMinute] = businessHours.end.split(':').map(Number);
  const endTimeMinutes = endHour * 60 + endMinute;

  return (
    currentTimeMinutes >= startTimeMinutes &&
    currentTimeMinutes <= endTimeMinutes
  );
}

/**
 * Get next business day for a market
 */
export function getNextBusinessDay(
  locale: Locale,
  date: Date = new Date()
): Date {
  const nextDay = new Date(date);

  // Add one day
  nextDay.setDate(nextDay.getDate() + 1);

  // Skip weekends (assuming Monday-Friday business days)
  while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
    nextDay.setDate(nextDay.getDate() + 1);
  }

  return nextDay;
}

/**
 * Format number according to market locale
 */
export function formatNumber(number: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
}

/**
 * Format weight for display (metric/imperial based on market)
 */
export function formatWeight(weightKg: number, locale: Locale): string {
  const config = getMarketConfig(locale);

  // US uses imperial system
  if (config.countryCode === 'US') {
    const weightLbs = weightKg * 2.20462;
    return `${formatNumber(weightLbs, locale)} lbs`;
  }

  return `${formatNumber(weightKg, locale)} kg`;
}

/**
 * Get market-specific coffee grading standards
 */
interface GradingStandard {
  standard: string;
  grades: string[];
  description: string;
}

export function getCoffeeGradingStandards(locale: Locale): {
  standard: string;
  grades: string[];
  description: string;
} {
  const config = getMarketConfig(locale);

  // Market-specific coffee grading standards
  const gradingStandards: Record<string, GradingStandard> = {
    US: {
      standard: 'SCA (Specialty Coffee Association)',
      grades: ['Specialty Grade', 'Premium Grade', 'Exchange Grade'],
      description: 'Based on defect count and cup quality',
    },
    DE: {
      standard: 'ECF (European Coffee Federation)',
      grades: ['Grade 1', 'Grade 2', 'Grade 3'],
      description: 'European standard based on defects and moisture content',
    },
    JP: {
      standard: 'JCQA (Japan Coffee Quality Association)',
      grades: ['Premium', 'Standard', 'Commercial'],
      description: 'Japanese quality standards with strict defect limits',
    },
    KR: {
      standard: 'KCS (Korean Coffee Standards)',
      grades: ['Superior', 'Good', 'Fair'],
      description: 'Korean standards focusing on bean size and defects',
    },
    default: {
      standard: 'ICO (International Coffee Organization)',
      grades: ['Grade 1', 'Grade 2', 'Grade 3'],
      description: 'International standard for coffee quality',
    },
  };

  return gradingStandards[config.countryCode] || gradingStandards.default;
}

interface PaymentTerms {
  preferredMethods: string[];
  standardTerms: string[];
  currency: string;
}

/**
 * Get market-specific payment terms
 */
export function getPaymentTerms(locale: Locale): {
  preferredMethods: string[];
  standardTerms: string[];
  currency: string;
} {
  const config = getMarketConfig(locale);

  const paymentTerms: Record<string, PaymentTerms> = {
    US: {
      preferredMethods: [
        'Letter of Credit',
        'Wire Transfer',
        'Documentary Collection',
      ],
      standardTerms: [
        '30% advance, 70% on shipment',
        'LC at sight',
        'Net 30 days',
      ],
      currency: config.currency.code,
    },
    DE: {
      preferredMethods: [
        'SEPA Transfer',
        'Letter of Credit',
        'Documentary Collection',
      ],
      standardTerms: [
        '50% advance, 50% on delivery',
        'LC 30 days',
        'Net 45 days',
      ],
      currency: config.currency.code,
    },
    JP: {
      preferredMethods: [
        'Letter of Credit',
        'Bank Transfer',
        'Documentary Collection',
      ],
      standardTerms: ['100% LC at sight', '50% advance, 50% on shipment'],
      currency: config.currency.code,
    },
    default: {
      preferredMethods: ['Letter of Credit', 'Wire Transfer'],
      standardTerms: ['LC at sight', '50% advance, 50% on shipment'],
      currency: config.currency.code,
    },
  };

  return paymentTerms[config.countryCode] || paymentTerms.default;
}

interface CertificationRequirements {
  required: string[];
  preferred: string[];
  optional: string[];
}

/**
 * Get market-specific certifications requirements
 */
export function getCertificationRequirements(locale: Locale): {
  required: string[];
  preferred: string[];
  optional: string[];
} {
  const config = getMarketConfig(locale);

  const certifications: Record<string, CertificationRequirements> = {
    US: {
      required: ['FDA Registration', 'Organic (if applicable)'],
      preferred: ['Fair Trade', 'Rainforest Alliance', 'UTZ'],
      optional: ['Bird Friendly', 'Shade Grown'],
    },
    DE: {
      required: ['EU Organic (if applicable)', 'HACCP'],
      preferred: ['Fairtrade', 'Rainforest Alliance', 'UTZ'],
      optional: ['Demeter', 'Naturland'],
    },
    JP: {
      required: ['JAS Organic (if applicable)', 'Food Sanitation Law'],
      preferred: ['JAS', 'Rainforest Alliance'],
      optional: ['Bird Friendly', 'Fair Trade'],
    },
    default: {
      required: ['Phytosanitary Certificate', 'Certificate of Origin'],
      preferred: ['Organic', 'Fair Trade'],
      optional: ['Rainforest Alliance', 'UTZ'],
    },
  };

  return certifications[config.countryCode] || certifications.default;
}
