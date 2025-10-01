'use client';

import { usePathname } from 'next/navigation';

import { getLocaleFromPathname } from '@/shared/utils/locale';

/**
 * Simple translation function that loads JSON directly
 */
function getTranslationData(locale: string) {
  try {
    // Use require for synchronous loading
    return require(`../../../messages/${locale}.json`);
  } catch (error) {
    // Fallback to English
    try {
      return require(`../../../messages/en.json`);
    } catch (fallbackError) {
      return {};
    }
  }
}

/**
 * Custom hook for translations
 */
export function useTranslation(namespace: string = '') {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);

  const t = (key: string): string => {
    try {
      const translation = getTranslationData(locale);

      if (namespace) {
        const namespaceData = translation[namespace];
        return namespaceData?.[key] || key;
      }

      return translation[key] || key;
    } catch (error) {
      return key;
    }
  };

  return { t, locale };
}
