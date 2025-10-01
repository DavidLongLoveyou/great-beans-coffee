import type { Locale } from '@/i18n';

// Main site configuration
export const siteConfig = {
  name: 'The Great Beans',
  description:
    'Premium Vietnamese Coffee for Global Markets - Direct from farm to your business',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://thegreatbeans.com',
  ogImage: '/images/og-image.jpg',

  // Company information
  company: {
    name: 'The Great Beans Co., Ltd.',
    legalName: 'The Great Beans Coffee Export Company Limited',
    founded: '2020',
    headquarters: 'Ho Chi Minh City, Vietnam',
    registrationNumber: 'VN-GB-2020-001',
    taxId: 'VN-TAX-GB-001',

    // Contact information
    contact: {
      email: 'info@thegreatbeans.com',
      phone: '+84-28-1234-5678',
      whatsapp: '+84-90-123-4567',
      address: {
        street: '123 Coffee Export Street',
        district: 'District 1',
        city: 'Ho Chi Minh City',
        country: 'Vietnam',
        postalCode: '70000',
      },
    },

    // Business information
    business: {
      type: 'B2B Coffee Exporter',
      specialties: ['Robusta', 'Arabica', 'Specialty Blends', 'Private Label'],
      certifications: [
        'USDA Organic',
        'Rainforest Alliance',
        'Fair Trade',
        'ISO 22000',
      ],
      capacity: '2000 MT/month',
      experience: '15+ years',
      markets: ['North America', 'Europe', 'Asia-Pacific', 'Middle East'],
    },
  },

  // Social media links
  social: {
    linkedin: 'https://linkedin.com/company/the-great-beans',
    facebook: 'https://facebook.com/thegreatbeans',
    instagram: 'https://instagram.com/thegreatbeans',
    youtube: 'https://youtube.com/@thegreatbeans',
    twitter: 'https://twitter.com/thegreatbeans',
  },

  // SEO configuration
  seo: {
    defaultTitle: 'The Great Beans - Premium Vietnamese Coffee Exporter',
    titleTemplate: '%s | The Great Beans',
    defaultDescription:
      'Premium Vietnamese coffee beans for global markets. Direct sourcing from sustainable farms with full traceability. Robusta, Arabica, and specialty blends for importers, roasters, and distributors.',
    keywords: [
      'Vietnamese coffee',
      'Robusta coffee beans',
      'Arabica coffee Vietnam',
      'Coffee exporter',
      'Premium coffee beans',
      'Sustainable coffee',
      'Coffee supplier',
      'Private label coffee',
      'Specialty coffee Vietnam',
      'Coffee import export',
    ],

    // Open Graph defaults
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'The Great Beans',
      images: [
        {
          url: '/images/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'The Great Beans - Premium Vietnamese Coffee',
        },
      ],
    },

    // Twitter Card defaults
    twitter: {
      card: 'summary_large_image',
      site: '@thegreatbeans',
      creator: '@thegreatbeans',
    },
  },

  // Analytics configuration
  analytics: {
    googleAnalytics: process.env.NEXT_PUBLIC_GA_ID,
    googleTagManager: process.env.NEXT_PUBLIC_GTM_ID,
    plausible: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    hotjar: process.env.NEXT_PUBLIC_HOTJAR_ID,
  },

  // Feature flags
  features: {
    blog: true,
    marketReports: true,
    originStories: true,
    rfqSystem: true,
    liveChat: true,
    multiLanguage: true,
    darkMode: false,
    newsletter: true,
    testimonials: true,
  },

  // API configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
    retries: 3,
  },

  // Third-party integrations
  integrations: {
    cloudinary: {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    },

    // CRM integration
    crm: {
      provider: 'hubspot', // or 'salesforce', 'pipedrive'
      apiKey: process.env.CRM_API_KEY,
    },

    // Email service
    email: {
      provider: 'sendgrid', // or 'mailgun', 'ses'
      apiKey: process.env.EMAIL_API_KEY,
      fromEmail: 'noreply@thegreatbeans.com',
      fromName: 'The Great Beans',
    },

    // Payment processing
    payment: {
      stripe: {
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        secretKey: process.env.STRIPE_SECRET_KEY,
      },
    },
  },
} as const;

// Locale-specific site configurations
export const localeSiteConfig: Record<
  Locale,
  {
    name: string;
    description: string;
    keywords: string[];
  }
> = {
  en: {
    name: 'The Great Beans - Premium Vietnamese Coffee Exporter',
    description:
      'Premium Vietnamese coffee beans for global markets. Direct sourcing from sustainable farms with full traceability.',
    keywords: [
      'Vietnamese coffee',
      'Robusta coffee beans',
      'Coffee exporter',
      'Premium coffee beans',
    ],
  },
  vi: {
    name: 'The Great Beans - Nhà Xuất Khẩu Cà Phê Việt Nam Cao Cấp',
    description:
      'Hạt cà phê Việt Nam cao cấp cho thị trường toàn cầu. Nguồn gốc trực tiếp từ các trang trại bền vững.',
    keywords: [
      'cà phê Việt Nam',
      'hạt cà phê Robusta',
      'xuất khẩu cà phê',
      'cà phê cao cấp',
    ],
  },
  de: {
    name: 'The Great Beans - Premium Vietnamesischer Kaffee-Exporteur',
    description:
      'Premium vietnamesische Kaffeebohnen für globale Märkte. Direkte Beschaffung von nachhaltigen Farmen.',
    keywords: [
      'Vietnamesischer Kaffee',
      'Robusta Kaffeebohnen',
      'Kaffee-Exporteur',
      'Premium Kaffeebohnen',
    ],
  },
  ja: {
    name: 'The Great Beans - プレミアムベトナムコーヒー輸出業者',
    description:
      'グローバル市場向けのプレミアムベトナムコーヒー豆。持続可能な農場からの直接調達。',
    keywords: [
      'ベトナムコーヒー',
      'ロブスタコーヒー豆',
      'コーヒー輸出業者',
      'プレミアムコーヒー豆',
    ],
  },
  fr: {
    name: 'The Great Beans - Exportateur de Café Vietnamien Premium',
    description:
      'Grains de café vietnamiens premium pour les marchés mondiaux. Approvisionnement direct depuis des fermes durables.',
    keywords: [
      'café vietnamien',
      'grains de café Robusta',
      'exportateur de café',
      'grains de café premium',
    ],
  },
  it: {
    name: 'The Great Beans - Esportatore di Caffè Vietnamita Premium',
    description:
      'Chicchi di caffè vietnamiti premium per i mercati globali. Approvvigionamento diretto da fattorie sostenibili.',
    keywords: [
      'caffè vietnamita',
      'chicchi di caffè Robusta',
      'esportatore di caffè',
      'chicchi di caffè premium',
    ],
  },
  es: {
    name: 'The Great Beans - Exportador de Café Vietnamita Premium',
    description:
      'Granos de café vietnamitas premium para mercados globales. Abastecimiento directo de granjas sostenibles.',
    keywords: [
      'café vietnamita',
      'granos de café Robusta',
      'exportador de café',
      'granos de café premium',
    ],
  },
  nl: {
    name: 'The Great Beans - Premium Vietnamese Koffie Exporteur',
    description:
      'Premium Vietnamese koffiebonen voor wereldwijde markten. Directe inkoop van duurzame boerderijen.',
    keywords: [
      'Vietnamese koffie',
      'Robusta koffiebonen',
      'koffie exporteur',
      'premium koffiebonen',
    ],
  },
  ko: {
    name: 'The Great Beans - 프리미엄 베트남 커피 수출업체',
    description:
      '글로벌 시장을 위한 프리미엄 베트남 커피 원두. 지속 가능한 농장에서 직접 조달.',
    keywords: [
      '베트남 커피',
      '로부스타 커피 원두',
      '커피 수출업체',
      '프리미엄 커피 원두',
    ],
  },
};

// Navigation configuration
export const navigationConfig = {
  main: [
    { href: '/', label: 'navigation.home' },
    { href: '/products', label: 'navigation.products' },
    { href: '/services', label: 'navigation.services' },
    { href: '/about', label: 'navigation.about' },
    { href: '/contact', label: 'navigation.contact' },
  ],

  footer: {
    company: [
      { href: '/about', label: 'navigation.about' },
      { href: '/certifications', label: 'navigation.certifications' },
      { href: '/sustainability', label: 'footer.sustainability' },
      { href: '/careers', label: 'footer.careers' },
    ],
    products: [
      { href: '/products/robusta', label: 'products.categories.robusta' },
      { href: '/products/arabica', label: 'products.categories.arabica' },
      { href: '/products/blends', label: 'products.categories.blends' },
      { href: '/products/instant', label: 'products.categories.instant' },
    ],
    resources: [
      { href: '/blog', label: 'navigation.blog' },
      { href: '/market-reports', label: 'footer.marketReports' },
      { href: '/origin-stories', label: 'footer.originStories' },
      { href: '/downloads', label: 'footer.downloads' },
    ],
    legal: [
      { href: '/legal/privacy', label: 'footer.privacy' },
      { href: '/legal/terms', label: 'footer.terms' },
      { href: '/legal/cookies', label: 'footer.cookies' },
    ],
  },
} as const;
