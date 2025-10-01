export interface ITranslationService {
  translate(text: string, fromLang: string, toLang: string): Promise<string>;
  detectLanguage(text: string): Promise<string>;
  getSupportedLanguages(): Promise<string[]>;
}

export class TranslationService implements ITranslationService {
  private supportedLanguages = [
    'en',
    'vi',
    'es',
    'fr',
    'de',
    'ja',
    'ko',
    'zh',
    'nl',
  ];

  async translate(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    try {
      console.log(`Translating "${text}" from ${fromLang} to ${toLang}`);

      // In a real implementation, this would integrate with Google Translate, AWS Translate, etc.
      // For now, return the original text with a prefix to indicate translation
      await new Promise(resolve => setTimeout(resolve, 100));

      if (fromLang === toLang) {
        return text;
      }

      // Mock translation
      return `[${toLang.toUpperCase()}] ${text}`;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Return original text if translation fails
    }
  }

  async detectLanguage(text: string): Promise<string> {
    try {
      console.log(`Detecting language for: "${text}"`);

      // Simple language detection based on common words
      const vietnameseWords = [
        'cà',
        'phê',
        'việt',
        'nam',
        'robusta',
        'arabica',
      ];
      const spanishWords = ['café', 'español', 'colombia', 'brasil'];
      const frenchWords = ['café', 'français', 'france'];
      const germanWords = ['kaffee', 'deutsch', 'deutschland'];

      const lowerText = text.toLowerCase();

      if (vietnameseWords.some(word => lowerText.includes(word))) {
        return 'vi';
      }
      if (spanishWords.some(word => lowerText.includes(word))) {
        return 'es';
      }
      if (frenchWords.some(word => lowerText.includes(word))) {
        return 'fr';
      }
      if (germanWords.some(word => lowerText.includes(word))) {
        return 'de';
      }

      // Default to English
      return 'en';
    } catch (error) {
      console.error('Language detection failed:', error);
      return 'en';
    }
  }

  async getSupportedLanguages(): Promise<string[]> {
    return [...this.supportedLanguages];
  }
}
