import { notFound } from 'next/navigation';

export async function getMessages(locale?: string) {
  try {
    // If no locale provided, try to get from headers or default to 'en'
    const currentLocale = locale || 'en';
    
    const messages = await import(`../../messages/${currentLocale}.json`);
    return messages.default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to English if locale not found
    try {
      const fallbackMessages = await import(`../../messages/en.json`);
      return fallbackMessages.default;
    } catch (fallbackError) {
      console.error('Failed to load fallback messages', fallbackError);
      notFound();
    }
  }
}