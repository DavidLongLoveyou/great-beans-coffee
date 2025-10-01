'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import { Locale } from '@/i18n';
import { getMarketConfig, MarketConfig, Port } from '@/shared/config/markets';
import {
  formatCurrency,
  formatDate,
  getBusinessHours,
  getEstimatedDelivery,
} from '@/shared/config/markets';
import {
  isWithinBusinessHours,
  getNextBusinessDay,
  formatNumber,
  formatWeight,
  getCoffeeGradingStandards,
  getPaymentTerms,
  getCertificationRequirements,
  calculateShippingEstimate,
  getNearestPort,
} from '@/shared/utils/market';

export interface ShippingCalculation {
  estimatedCost: number;
  currency: string;
  transitDays: number;
}

export interface UseMarketReturn {
  // Market configuration
  config: MarketConfig;
  locale: Locale;

  // Formatting functions
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date) => string;
  formatNumber: (number: number) => string;
  formatWeight: (weightKg: number) => string;

  // Business operations
  isBusinessHours: boolean;
  businessHours: { start: string; end: string; timezone: string };
  getNextBusinessDay: (date?: Date) => Date;
  getEstimatedDelivery: (shipDate?: Date) => Date;

  // Market-specific data
  coffeeGradingStandards: {
    standard: string;
    grades: string[];
    description: string;
  };
  paymentTerms: {
    preferredMethods: string[];
    standardTerms: string[];
    currency: string;
  };
  certificationRequirements: {
    required: string[];
    preferred: string[];
    optional: string[];
  };

  // Utility functions
  calculateShipping: (
    fromPort: Port,
    toPort: Port,
    weightKg: number
  ) => ShippingCalculation;
  getNearestPort: (latitude: number, longitude: number) => Port | null;
}

/**
 * Hook to get market-specific configuration and utilities
 */
export function useMarket(): UseMarketReturn {
  const pathname = usePathname();

  // Extract locale from pathname
  const locale = useMemo(() => {
    const segments = pathname.split('/');
    const localeSegment = segments[1];

    // Validate locale
    const validLocales: Locale[] = [
      'en',
      'de',
      'ja',
      'fr',
      'it',
      'es',
      'nl',
      'ko',
    ];
    return validLocales.includes(localeSegment as Locale)
      ? (localeSegment as Locale)
      : 'en';
  }, [pathname]);

  const config = useMemo(() => getMarketConfig(locale), [locale]);

  // Memoized formatting functions
  const formatters = useMemo(
    () => ({
      formatCurrency: (amount: number) => formatCurrency(amount, locale),
      formatDate: (date: Date) => formatDate(date, locale),
      formatNumber: (number: number) => formatNumber(number, locale),
      formatWeight: (weightKg: number) => formatWeight(weightKg, locale),
    }),
    [locale]
  );

  // Business operations
  const businessOperations = useMemo(() => {
    const now = new Date();
    return {
      isBusinessHours: isWithinBusinessHours(locale, now),
      businessHours: getBusinessHours(locale),
      getNextBusinessDay: (date?: Date) => getNextBusinessDay(locale, date),
      getEstimatedDelivery: (shipDate?: Date) =>
        getEstimatedDelivery(locale, shipDate),
    };
  }, [locale]);

  // Market-specific data
  const marketData = useMemo(
    () => ({
      coffeeGradingStandards: getCoffeeGradingStandards(locale),
      paymentTerms: getPaymentTerms(locale),
      certificationRequirements: getCertificationRequirements(locale),
    }),
    [locale]
  );

  // Utility functions
  const utilities = useMemo(
    () => ({
      calculateShipping: (fromPort: Port, toPort: Port, weightKg: number) =>
        calculateShippingEstimate(fromPort, toPort, weightKg, locale),
      getNearestPort: (latitude: number, longitude: number) =>
        getNearestPort(latitude, longitude, locale),
    }),
    [locale]
  );

  return {
    config,
    locale,
    ...formatters,
    ...businessOperations,
    ...marketData,
    ...utilities,
  };
}

/**
 * Hook to get market configuration for a specific locale
 */
export function useMarketConfig(targetLocale?: Locale): MarketConfig {
  const { locale } = useMarket();
  const effectiveLocale = targetLocale || locale;

  return useMemo(() => getMarketConfig(effectiveLocale), [effectiveLocale]);
}

/**
 * Hook to compare markets
 */
export function useMarketComparison(locales: Locale[]) {
  return useMemo(() => {
    return locales.map(locale => ({
      locale,
      config: getMarketConfig(locale),
      gradingStandards: getCoffeeGradingStandards(locale),
      paymentTerms: getPaymentTerms(locale),
      certifications: getCertificationRequirements(locale),
    }));
  }, [locales]);
}

/**
 * Hook for market-aware price formatting
 */
export function useMarketPricing() {
  const { config, formatCurrency } = useMarket();

  return useMemo(
    () => ({
      formatPrice: (amount: number) => formatCurrency(amount),
      formatPriceRange: (min: number, max: number) =>
        `${formatCurrency(min)} - ${formatCurrency(max)}`,
      formatPricePerKg: (pricePerKg: number) =>
        `${formatCurrency(pricePerKg)}/kg`,
      formatPricePerBag: (pricePerBag: number, bagWeight: number = 60) =>
        `${formatCurrency(pricePerBag)}/${bagWeight}kg bag`,
      currency: config.currency,
    }),
    [config, formatCurrency]
  );
}

/**
 * Hook for market-aware shipping calculations
 */
export function useMarketShipping() {
  const { config, calculateShipping, formatCurrency } = useMarket();

  return useMemo(
    () => ({
      calculateCost: calculateShipping,
      formatShippingCost: (cost: number) => formatCurrency(cost),
      averageTransitDays: config.shippingInfo.averageTransitDays,
      preferredIncoterms: config.shippingInfo.preferredIncoterms,
      majorPorts: config.majorPorts,
    }),
    [config, calculateShipping, formatCurrency]
  );
}
