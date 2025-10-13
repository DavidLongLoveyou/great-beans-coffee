import { createScopedLogger } from '@/shared/utils/logger';

import { getMessages } from './messages';

const logger = createScopedLogger('Translations');

export async function getTranslations(locale: string) {
  const messages = await getMessages(locale);

  return function t(key: string): string {
    const keys = key.split('.');
    let value: unknown = messages;

    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k];
      if (value === undefined) {
        // Lib layer logging removed for production
        return key; // Return the key as fallback
      }
    }

    return typeof value === 'string' ? value : key;
  };
}
