import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

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
    currency: string;
    dateFormat: string;
    numberFormat: string;
    rtl: boolean;
  }
> = {
  en: {
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
    rtl: false,
  },
  de: {
    currency: 'EUR',
    dateFormat: 'dd.MM.yyyy',
    numberFormat: 'de-DE',
    rtl: false,
  },
  ja: {
    currency: 'JPY',
    dateFormat: 'yyyy/MM/dd',
    numberFormat: 'ja-JP',
    rtl: false,
  },
  fr: {
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'fr-FR',
    rtl: false,
  },
  it: {
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'it-IT',
    rtl: false,
  },
  es: {
    currency: 'EUR',
    dateFormat: 'dd/MM/yyyy',
    numberFormat: 'es-ES',
    rtl: false,
  },
  nl: {
    currency: 'EUR',
    dateFormat: 'dd-MM-yyyy',
    numberFormat: 'nl-NL',
    rtl: false,
  },
  ko: {
    currency: 'KRW',
    dateFormat: 'yyyy. MM. dd.',
    numberFormat: 'ko-KR',
    rtl: false,
  },
  vi: {
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
    notFound();
  }

  try {
    return {
      messages: (await import(`../messages/${locale}.json`)).default
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    notFound();
  }
});
