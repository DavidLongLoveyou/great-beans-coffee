import { notFound } from 'next/navigation';
import { locales, defaultLocale } from '@/i18n';

export async function getMessages(locale?: string) {
  try {
    // Validate and sanitize locale
    const currentLocale = locale && locales.includes(locale as any) ? locale : defaultLocale;
    
    // Prevent invalid imports by validating locale format
    if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(currentLocale)) {
      throw new Error(`Invalid locale format: ${currentLocale}`);
    }
    
    const messages = await import(`../../messages/${currentLocale}.json`);
    return messages.default;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Failed to load messages for locale: ${locale}`, error);
    
    // Only try fallback if we haven't already tried the default locale
    if (locale !== defaultLocale) {
      try {
        const fallbackMessages = await import(`../../messages/${defaultLocale}.json`);
        return fallbackMessages.default;
      } catch (fallbackError) {
        // eslint-disable-next-line no-console
        console.error('Failed to load fallback messages', fallbackError);
      }
    }
    
    notFound();
  }
}