import { getRequestConfig } from 'next-intl/server';

import { createScopedLogger } from '@/shared/utils/logger';

// Type for message structure
type Messages = Record<string, any>;

const logger = createScopedLogger('I18n');

// Define supported locales
export const locales = [
  'en',
  'de',
  'ja',
  'fr',
  'it',
  'es',
  'nl',
  'ko',
  'vi',
] as const;
export type Locale = (typeof locales)[number];

// Default locale
export const defaultLocale: Locale = 'en';

// Locale labels for UI
export const localeLabels: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  ja: '日本語',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  nl: 'Nederlands',
  ko: '한국어',
  vi: 'Tiếng Việt',
};

// Locale configurations
export const localeConfig: Record<
  Locale,
  {
    label: string;
    flag: string;
    currency: string;
    dateFormat: string;
    numberFormat: string;
    rtl: boolean;
  }
> = {
  en: {
    label: 'English',
    flag: '🇺🇸',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
    rtl: false,
  },
  de: {
    label: 'Deutsch',
    flag: '🇩🇪',
    currency: 'EUR',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: 'de-DE',
    rtl: false,
  },
  ja: {
    label: '日本語',
    flag: '🇯🇵',
    currency: 'JPY',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: 'ja-JP',
    rtl: false,
  },
  fr: {
    label: 'Français',
    flag: '🇫🇷',
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'fr-FR',
    rtl: false,
  },
  it: {
    label: 'Italiano',
    flag: '🇮🇹',
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'it-IT',
    rtl: false,
  },
  es: {
    label: 'Español',
    flag: '🇪🇸',
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'es-ES',
    rtl: false,
  },
  nl: {
    label: 'Nederlands',
    flag: '🇳🇱',
    currency: 'EUR',
    dateFormat: 'dd-MM-yyyy',
    numberFormat: 'nl-NL',
    rtl: false,
  },
  ko: {
    label: '한국어',
    flag: '🇰🇷',
    currency: 'KRW',
    dateFormat: 'yyyy. MM. dd.',
    numberFormat: 'ko-KR',
    rtl: false,
  },
  vi: {
    label: 'Tiếng Việt',
    flag: '🇻🇳',
    currency: 'VND',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'vi-VN',
    rtl: false,
  },
};

// Manual configuration without plugin
export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    // Use default locale instead of throwing notFound
    locale = defaultLocale;
  }

  try {
    const messages: Messages = (await import(`../messages/${locale}.json`))
      .default;
    return {
      locale: locale as string,
      messages,
      timeZone: 'UTC', // Default timezone to prevent environment mismatches
    };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      logger.error(`Failed to load messages for locale: ${locale}`, error);
    }

    // Try to load default locale messages as fallback
    try {
      const fallbackMessages: Messages = (
        await import(`../messages/${defaultLocale}.json`)
      ).default;
      return {
        locale: defaultLocale,
        messages: fallbackMessages,
        timeZone: 'UTC',
      };
    } catch (fallbackError) {
      if (process.env.NODE_ENV === 'development') {
        logger.error('Failed to load fallback messages', fallbackError);
      }
      // Return empty messages instead of notFound to prevent hydration issues
      return {
        locale: defaultLocale,
        messages: {} as Messages,
        timeZone: 'UTC',
      };
    }
  }
});
