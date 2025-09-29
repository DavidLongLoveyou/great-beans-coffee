import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko'] as const;

export type Locale = (typeof locales)[number];

// Locale display names for the language switcher
export const localeNames: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
  ja: '日本語',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
  nl: 'Nederlands',
  ko: '한국어'
};

// Flag emojis for visual representation
export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  de: '🇩🇪',
  ja: '🇯🇵',
  fr: '🇫🇷',
  it: '🇮🇹',
  es: '🇪🇸',
  nl: '🇳🇱',
  ko: '🇰🇷'
};

export default getRequestConfig(async ({ locale }) => {
  return {
    messages: (await import(`../messages/${locale}.json`)).default
  };
});