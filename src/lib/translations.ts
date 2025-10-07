import { createScopedLogger } from '@/shared/utils/logger';

import { getMessages } from './messages';

const logger = createScopedLogger('Translations');

export async function getTranslations(locale: string) {
  const messages = await getMessages(locale);

  return function t(key: string): string {
    const keys = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = messages;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        if (process.env.NODE_ENV === 'development') {
          logger.warn(
            `Translation key "${key}" not found for locale "${locale}"`
          );
        }
        return key; // Return the key as fallback
      }
    }

    return typeof value === 'string' ? value : key;
  };
}
