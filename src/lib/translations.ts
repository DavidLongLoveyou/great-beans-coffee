import { getMessages } from './messages';

export async function getTranslations(locale?: string, namespace?: string) {
  const messages = await getMessages(locale);
  
  return function t(key: string) {
    const keys = key.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  };
}