import { Locale, locales, localeNames, localeFlags } from '@/i18n';

/**
 * Get the display name for a locale
 */
export function getLocaleDisplayName(locale: Locale): string {
  return localeNames[locale] || locale;
}

/**
 * Get the flag emoji for a locale
 */
export function getLocaleFlag(locale: Locale): string {
  return localeFlags[locale] || '🌐';
}

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get the default locale
 */
export function getDefaultLocale(): Locale {
  return 'en';
}

/**
 * Get all available locales with their display names and flags
 */
export function getAllLocales() {
  return locales.map(locale => ({
    code: locale,
    name: getLocaleDisplayName(locale),
    flag: getLocaleFlag(locale),
  }));
}

/**
 * Get locale from pathname
 */
export function getLocaleFromPathname(pathname: string): Locale {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (potentialLocale && isValidLocale(potentialLocale)) {
    return potentialLocale;
  }
  
  return getDefaultLocale();
}

/**
 * Remove locale from pathname
 */
export function removeLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/');
  const potentialLocale = segments[1];
  
  if (potentialLocale && isValidLocale(potentialLocale)) {
    return '/' + segments.slice(2).join('/');
  }
  
  return pathname;
}

/**
 * Add locale to pathname
 */
export function addLocaleToPathname(pathname: string, locale: Locale): string {
  const cleanPathname = removeLocaleFromPathname(pathname);
  return `/${locale}${cleanPathname === '/' ? '' : cleanPathname}`;
}