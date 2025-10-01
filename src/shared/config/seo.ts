import { Locale } from '@/shared/types/locale';

/**
 * Core SEO Configuration
 */
export const seoConfig = {
  siteName: 'The Great Beans',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://thegreatbeans.com',
  contactEmail: 'info@thegreatbeans.com',
  defaultLocale: 'en' as Locale,
  supportedLocales: [
    'en',
    'de',
    'ja',
    'fr',
    'es',
    'it',
    'nl',
    'ko',
  ] as Locale[],

  // Business Information
  business: {
    name: 'The Great Beans Coffee Co., Ltd.',
    legalName: 'The Great Beans Coffee Company Limited',
    foundedYear: 2020,
    address: {
      streetAddress: '123 Coffee Street',
      addressLocality: 'Ho Chi Minh City',
      addressRegion: 'Ho Chi Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    contact: {
      telephone: '+84-28-1234-5678',
      email: 'info@thegreatbeans.com',
      faxNumber: '+84-28-1234-5679',
    },
    social: {
      linkedin: 'https://linkedin.com/company/the-great-beans',
      facebook: 'https://facebook.com/thegreatbeans',
      twitter: 'https://twitter.com/thegreatbeans',
      instagram: 'https://instagram.com/thegreatbeans',
      youtube: 'https://youtube.com/@thegreatbeans',
    },
    certifications: [
      'ISO 22000:2018',
      'HACCP',
      'Organic JAS',
      'EU Organic',
      'USDA Organic',
      'Rainforest Alliance',
      'Fair Trade',
    ],
  },

  // Default Meta Tags
  defaultMeta: {
    robots:
      'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
    themeColor: '#8B4513', // Coffee brown
    msapplicationTileColor: '#8B4513',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    appleMobileWebAppTitle: 'The Great Beans',
    applicationName: 'The Great Beans',
    msapplicationTooltip: 'Premium Vietnamese Coffee Exports',
    referrerPolicy: 'strict-origin-when-cross-origin',
  },

  // Performance and Security
  performance: {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://res.cloudinary.com',
    ],
    dnsPrefetch: [
      'https://www.google-analytics.com',
      'https://www.googletagmanager.com',
    ],
  },

  // Analytics
  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID,
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  },
} as const;

/**
 * Localized SEO Configuration
 */
export const localizedSeoConfig: Record<
  Locale,
  {
    siteName: string;
    siteDescription: string;
    keywords: string[];
    language: string;
    region: string;
    currency: string;
    timezone: string;
  }
> = {
  en: {
    siteName: 'The Great Beans - Premium Vietnamese Coffee Exports',
    siteDescription:
      'Leading Vietnamese coffee exporter specializing in premium Robusta and Arabica beans. B2B sourcing, private label, and OEM services for global importers and roasters.',
    keywords: [
      'vietnamese coffee',
      'robusta coffee beans',
      'arabica coffee vietnam',
      'coffee export vietnam',
      'premium coffee beans',
      'b2b coffee sourcing',
      'private label coffee',
      'oem coffee services',
      'coffee supplier vietnam',
      'specialty coffee beans',
    ],
    language: 'en-US',
    region: 'US',
    currency: 'USD',
    timezone: 'America/New_York',
  },
  de: {
    siteName: 'The Great Beans - Premium Vietnamesischer Kaffee Export',
    siteDescription:
      'Führender vietnamesischer Kaffeeexporteur spezialisiert auf Premium Robusta und Arabica Bohnen. B2B Beschaffung, Private Label und OEM Services für globale Importeure und Röster.',
    keywords: [
      'vietnamesischer kaffee',
      'robusta kaffeebohnen',
      'arabica kaffee vietnam',
      'kaffee export vietnam',
      'premium kaffeebohnen',
      'b2b kaffee beschaffung',
      'private label kaffee',
      'oem kaffee services',
      'kaffee lieferant vietnam',
      'spezialitätenkaffee',
    ],
    language: 'de-DE',
    region: 'DE',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
  },
  ja: {
    siteName: 'The Great Beans - プレミアムベトナムコーヒー輸出',
    siteDescription:
      'プレミアムロブスタとアラビカ豆を専門とする大手ベトナムコーヒー輸出業者。グローバルな輸入業者とロースター向けのB2B調達、プライベートラベル、OEMサービス。',
    keywords: [
      'ベトナムコーヒー',
      'ロブスタコーヒー豆',
      'アラビカコーヒーベトナム',
      'コーヒー輸出ベトナム',
      'プレミアムコーヒー豆',
      'b2bコーヒー調達',
      'プライベートラベルコーヒー',
      'oemコーヒーサービス',
      'コーヒーサプライヤーベトナム',
      'スペシャルティコーヒー豆',
    ],
    language: 'ja-JP',
    region: 'JP',
    currency: 'JPY',
    timezone: 'Asia/Tokyo',
  },
  fr: {
    siteName: 'The Great Beans - Exportation de Café Vietnamien Premium',
    siteDescription:
      "Principal exportateur de café vietnamien spécialisé dans les grains Robusta et Arabica premium. Services B2B d'approvisionnement, marque privée et OEM pour importateurs et torréfacteurs mondiaux.",
    keywords: [
      'café vietnamien',
      'grains de café robusta',
      'café arabica vietnam',
      'exportation café vietnam',
      'grains de café premium',
      'approvisionnement café b2b',
      'café marque privée',
      'services oem café',
      'fournisseur café vietnam',
      'grains de café spécialisés',
    ],
    language: 'fr-FR',
    region: 'FR',
    currency: 'EUR',
    timezone: 'Europe/Paris',
  },
  es: {
    siteName: 'The Great Beans - Exportación de Café Vietnamita Premium',
    siteDescription:
      'Principal exportador de café vietnamita especializado en granos Robusta y Arábica premium. Servicios B2B de abastecimiento, marca privada y OEM para importadores y tostadores globales.',
    keywords: [
      'café vietnamita',
      'granos de café robusta',
      'café arábica vietnam',
      'exportación café vietnam',
      'granos de café premium',
      'abastecimiento café b2b',
      'café marca privada',
      'servicios oem café',
      'proveedor café vietnam',
      'granos de café especiales',
    ],
    language: 'es-ES',
    region: 'ES',
    currency: 'EUR',
    timezone: 'Europe/Madrid',
  },
  it: {
    siteName: 'The Great Beans - Esportazione Caffè Vietnamita Premium',
    siteDescription:
      'Principale esportatore di caffè vietnamita specializzato in chicchi Robusta e Arabica premium. Servizi B2B di approvvigionamento, private label e OEM per importatori e torrefattori globali.',
    keywords: [
      'caffè vietnamita',
      'chicchi di caffè robusta',
      'caffè arabica vietnam',
      'esportazione caffè vietnam',
      'chicchi di caffè premium',
      'approvvigionamento caffè b2b',
      'caffè private label',
      'servizi oem caffè',
      'fornitore caffè vietnam',
      'chicchi di caffè speciali',
    ],
    language: 'it-IT',
    region: 'IT',
    currency: 'EUR',
    timezone: 'Europe/Rome',
  },
  nl: {
    siteName: 'The Great Beans - Premium Vietnamese Koffie Export',
    siteDescription:
      'Toonaangevende Vietnamese koffie-exporteur gespecialiseerd in premium Robusta en Arabica bonen. B2B sourcing, private label en OEM services voor wereldwijde importeurs en branders.',
    keywords: [
      'vietnamese koffie',
      'robusta koffiebonen',
      'arabica koffie vietnam',
      'koffie export vietnam',
      'premium koffiebonen',
      'b2b koffie sourcing',
      'private label koffie',
      'oem koffie services',
      'koffie leverancier vietnam',
      'specialiteit koffiebonen',
    ],
    language: 'nl-NL',
    region: 'NL',
    currency: 'EUR',
    timezone: 'Europe/Amsterdam',
  },
  ko: {
    siteName: 'The Great Beans - 프리미엄 베트남 커피 수출',
    siteDescription:
      '프리미엄 로부스타와 아라비카 원두를 전문으로 하는 선도적인 베트남 커피 수출업체. 글로벌 수입업체와 로스터를 위한 B2B 소싱, 프라이빗 라벨, OEM 서비스.',
    keywords: [
      '베트남 커피',
      '로부스타 커피 원두',
      '아라비카 커피 베트남',
      '커피 수출 베트남',
      '프리미엄 커피 원두',
      'b2b 커피 소싱',
      '프라이빗 라벨 커피',
      'oem 커피 서비스',
      '커피 공급업체 베트남',
      '스페셜티 커피 원두',
    ],
    language: 'ko-KR',
    region: 'KR',
    currency: 'KRW',
    timezone: 'Asia/Seoul',
  },
};

/**
 * Get localized SEO configuration for a specific locale
 */
export function getLocalizedSeoConfig(locale: Locale) {
  return localizedSeoConfig[locale] || localizedSeoConfig.en;
}

/**
 * Generate hreflang URLs for all supported locales
 */
export function generateHreflangUrls(
  pathname: string
): Array<{ hreflang: string; href: string }> {
  const hreflangUrls = seoConfig.supportedLocales.map(locale => ({
    hreflang: localizedSeoConfig[locale].language,
    href: `${seoConfig.siteUrl}/${locale}${pathname}`,
  }));

  // Add x-default
  hreflangUrls.push({
    hreflang: 'x-default',
    href: `${seoConfig.siteUrl}/${seoConfig.defaultLocale}${pathname}`,
  });

  return hreflangUrls;
}

/**
 * SEO Page Types for structured data
 */
export const seoPageTypes = {
  homepage: 'WebSite',
  product: 'Product',
  service: 'Service',
  article: 'Article',
  organization: 'Organization',
  breadcrumb: 'BreadcrumbList',
  faq: 'FAQPage',
  contact: 'ContactPage',
  about: 'AboutPage',
} as const;

export type SeoPageType = keyof typeof seoPageTypes;
