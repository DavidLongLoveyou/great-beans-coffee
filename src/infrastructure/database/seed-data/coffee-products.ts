import type {
  CoffeeType,
  CoffeeGrade,
  ProcessingMethod,
  Certification,
} from '../../../domain/entities/coffee-product.entity';

export interface SeedCoffeeProduct {
  id: string;
  sku: string;
  coffeeType: CoffeeType;
  grade: CoffeeGrade;
  processing: ProcessingMethod;
  certifications: Certification[];
  specifications: {
    moisture: string;
    defects: string;
    screenSize: string;
    density: string;
    cupping: {
      aroma: number;
      flavor: number;
      acidity: number;
      body: number;
      overall: number;
    };
    caffeine?: string;
  };
  pricing: {
    basePrice: number;
    currency: string;
    unit: string;
    minOrder: number;
    priceBreaks: Array<{ quantity: number; price: number }>;
  };
  availability: {
    inStock: boolean;
    quantity: number;
    harvestSeason: string;
    availableFrom: string;
    availableUntil?: string;
  };
  originInfo: {
    region: string;
    province: string;
    farm: string;
    altitude: string;
    coordinates: { lat: number; lng: number };
    soilType: string;
    climate: string;
    harvestMethod: string;
  };
  translations: {
    [locale: string]: {
      name: string;
      description: string;
      shortDescription: string;
      features: string[];
      tastingNotes: string[];
      brewingRecommendations: string;
    };
  };
  images: string[];
  documents: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdBy: string;
  updatedBy: string;
}

export const coffeeProductsData: SeedCoffeeProduct[] = [
  // Premium Robusta Products - The Great Beans Specialties
  {
    id: 'robusta-grade1-dak-lak',
    sku: 'TGB-ROB-G1-001',
    coffeeType: 'ROBUSTA',
    grade: 'GRADE_1',
    processing: 'NATURAL',
    certifications: ['ORGANIC', 'RAINFOREST_ALLIANCE'],
    specifications: {
      moisture: '12.5%',
      defects: '< 5%',
      screenSize: '18+',
      density: '0.70 g/ml',
      cupping: {
        aroma: 7.8,
        flavor: 8.2,
        acidity: 6.5,
        body: 8.8,
        overall: 8.0,
      },
      caffeine: '2.2-2.7%',
    },
    pricing: {
      basePrice: 2950,
      currency: 'USD',
      unit: 'MT',
      minOrder: 20,
      priceBreaks: [
        { quantity: 50, price: 2900 },
        { quantity: 100, price: 2850 },
        { quantity: 200, price: 2800 },
      ],
    },
    availability: {
      inStock: true,
      quantity: 500,
      harvestSeason: '2024',
      availableFrom: '2024-01-01',
      availableUntil: '2024-12-31',
    },
    originInfo: {
      region: 'Central Highlands',
      province: 'Dak Lak',
      farm: 'The Great Beans Partner Farms',
      altitude: '500-800m',
      coordinates: { lat: 12.71, lng: 108.2378 },
      soilType: 'Volcanic basalt',
      climate: 'Tropical monsoon',
      harvestMethod: 'Hand-picked selective',
    },
    translations: {
      en: {
        name: 'Premium Robusta Grade 1 - Dak Lak',
        description:
          'Exceptional Grade 1 Robusta beans from the volcanic highlands of Dak Lak province, carefully selected and processed by The Great Beans. These premium green coffee beans offer superior body and strength with rich chocolate and nutty undertones. Grown at optimal altitudes in mineral-rich volcanic soil, our Robusta delivers consistent quality for roasters and exporters worldwide. Available in both green and roasted forms to meet diverse customer requirements.',
        shortDescription:
          "Premium Grade 1 Robusta from Dak Lak's volcanic highlands - available green or roasted",
        features: [
          'Single origin from Dak Lak province',
          'Grown in volcanic basalt soil',
          'Hand-picked selective harvest',
          'Natural sun-drying process',
          'Organic and Rainforest Alliance certified',
          'Low defect rate < 5%',
          'High caffeine content 2.2-2.7%',
          'Available as green beans or custom roasted',
        ],
        tastingNotes: [
          'Rich chocolate undertones',
          'Nutty aroma with earthy finish',
          'Full body with low acidity',
          'Hints of dark caramel',
          'Clean, smooth aftertaste',
        ],
        brewingRecommendations:
          'Ideal for espresso blends (60-80%), French press, and Vietnamese phin filter. Recommended brewing temperature: 90-96°C. Perfect for milk-based beverages and instant coffee production.',
      },
      de: {
        name: 'Premium Robusta Grad 1 - Dak Lak',
        description:
          'Außergewöhnliche Robusta-Bohnen der Klasse 1 aus den vulkanischen Hochländern der Provinz Dak Lak. Diese Bohnen bieten eine perfekte Balance zwischen Stärke und Geschmeidigkeit mit reichen Schokoladen- und Nussuntertönen.',
        shortDescription:
          'Premium Robusta Grad 1 aus Dak Laks vulkanischen Hochländern mit reichen Schokoladennoten',
        features: [
          'Einzelherkunft aus der Provinz Dak Lak',
          'Angebaut in vulkanischem Basaltboden',
          'Handgepflückte selektive Ernte',
          'Natürlicher Sonnentrocknungsprozess',
          'Dreifach zertifiziert (Bio, Rainforest Alliance, UTZ)',
        ],
        tastingNotes: [
          'Reiche Schokoladenuntertöne',
          'Nussiges Aroma mit erdigem Abgang',
          'Vollmundig mit geringer Säure',
          'Anklänge von dunklem Karamell',
        ],
        brewingRecommendations:
          'Ideal für Espresso-Mischungen, French Press und vietnamesischen Phin-Filter.',
      },
      ja: {
        name: 'プレミアム ロブスタ グレード1 - ダクラク',
        description:
          'ダクラク省の火山性高地から採れた例外的なグレード1ロブスタ豆。力強さと滑らかさの完璧なバランスを持ち、豊かなチョコレートとナッツの風味が特徴です。',
        shortDescription:
          'ダクラクの火山性高地産プレミアムグレード1ロブスタ、豊かなチョコレートノート',
        features: [
          'ダクラク省単一原産地',
          '火山性玄武岩土壌で栽培',
          '手摘み選別収穫',
          '天然日干し加工',
          '三重認証（オーガニック、レインフォレスト・アライアンス、UTZ）',
        ],
        tastingNotes: [
          '豊かなチョコレートの風味',
          'ナッツの香りと土の余韻',
          'フルボディで低酸味',
          'ダークキャラメルのヒント',
        ],
        brewingRecommendations:
          'エスプレッソブレンド、フレンチプレス、ベトナムのフィンフィルターに最適。',
      },
    },
    images: [
      'robusta-grade1-dak-lak-beans.jpg',
      'dak-lak-plantation.jpg',
      'robusta-processing-natural.jpg',
      'highland-estates-farm.jpg',
    ],
    documents: [
      'robusta-grade1-specification-sheet.pdf',
      'organic-certification.pdf',
      'rainforest-alliance-certificate.pdf',
      'utz-certification.pdf',
      'quality-analysis-report.pdf',
    ],
    tags: [
      'robusta',
      'grade1',
      'dak-lak',
      'organic',
      'premium',
      'natural-process',
    ],
    isActive: true,
    isFeatured: true,
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
  },
  {
    id: 'robusta-grade2-gia-lai',
    sku: 'TGB-ROB-G2-002',
    coffeeType: 'ROBUSTA',
    grade: 'GRADE_2',
    processing: 'WASHED',
    certifications: ['RAINFOREST_ALLIANCE'],
    specifications: {
      moisture: '12.8%',
      defects: '< 8%',
      screenSize: '16+',
      density: '0.68 g/ml',
      cupping: {
        aroma: 7.0,
        flavor: 7.5,
        acidity: 6.0,
        body: 8.0,
        overall: 7.2,
      },
      caffeine: '2.0-2.5%',
    },
    pricing: {
      basePrice: 2650,
      currency: 'USD',
      unit: 'MT',
      minOrder: 25,
      priceBreaks: [
        { quantity: 50, price: 2600 },
        { quantity: 100, price: 2550 },
        { quantity: 200, price: 2500 },
      ],
    },
    availability: {
      inStock: true,
      quantity: 800,
      harvestSeason: '2024',
      availableFrom: '2024-01-15',
    },
    originInfo: {
      region: 'Central Highlands',
      province: 'Gia Lai',
      farm: 'The Great Beans Partner Cooperative',
      altitude: '400-700m',
      coordinates: { lat: 13.9833, lng: 108.0 },
      soilType: 'Red basalt',
      climate: 'Tropical savanna',
      harvestMethod: 'Selective picking',
    },
    translations: {
      en: {
        name: 'Commercial Robusta Grade 2 - Gia Lai',
        description:
          'High-quality Grade 2 Robusta beans from Gia Lai province, carefully sourced and processed by The Great Beans using the washed method for cleaner cup profile. These beans offer excellent value for commercial applications while maintaining good flavor characteristics and consistency. Available as green beans or custom roasted to specification.',
        shortDescription:
          'Commercial Grade 2 Robusta from Gia Lai with clean, washed processing',
        features: [
          'Washed processing for clean profile',
          'Consistent quality and sizing',
          'Rainforest Alliance certified',
          'Excellent for blending',
          'Competitive pricing',
          'Reliable supply chain',
          'Available green or roasted',
        ],
        tastingNotes: [
          'Clean, straightforward flavor',
          'Moderate body and strength',
          'Subtle earthy notes',
          'Balanced bitterness',
          'Smooth finish',
        ],
        brewingRecommendations:
          'Perfect for commercial blends, instant coffee production, and espresso bases. Suitable for all brewing methods.',
      },
    },
    images: [
      'robusta-grade2-gia-lai-beans.jpg',
      'gia-lai-cooperative.jpg',
      'washed-processing-facility.jpg',
    ],
    documents: [
      'robusta-grade2-specification.pdf',
      'fair-trade-certificate.pdf',
      'rainforest-alliance-cert.pdf',
    ],
    tags: [
      'robusta',
      'grade2',
      'gia-lai',
      'washed',
      'commercial',
      'fair-trade',
    ],
    isActive: true,
    isFeatured: false,
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
  },
  // Premium Arabica Products - The Great Beans Specialties
  {
    id: 'arabica-premium-da-lat',
    sku: 'TGB-ARA-PREM-003',
    coffeeType: 'ARABICA',
    grade: 'PREMIUM',
    processing: 'WASHED',
    certifications: ['ORGANIC', 'UTZ'],
    specifications: {
      moisture: '11.5%',
      defects: '< 3%',
      screenSize: '16+',
      density: '0.75 g/ml',
      cupping: {
        aroma: 8.5,
        flavor: 8.8,
        acidity: 8.0,
        body: 7.5,
        overall: 8.4,
      },
      caffeine: '1.2-1.5%',
    },
    pricing: {
      basePrice: 4200,
      currency: 'USD',
      unit: 'MT',
      minOrder: 10,
      priceBreaks: [
        { quantity: 25, price: 4150 },
        { quantity: 50, price: 4100 },
        { quantity: 100, price: 4000 },
      ],
    },
    availability: {
      inStock: true,
      quantity: 150,
      harvestSeason: '2024',
      availableFrom: '2024-02-01',
      availableUntil: '2024-10-31',
    },
    originInfo: {
      region: 'Central Highlands',
      province: 'Lam Dong',
      farm: 'The Great Beans Highland Partners',
      altitude: '1200-1500m',
      coordinates: { lat: 11.9404, lng: 108.4583 },
      soilType: 'Red volcanic',
      climate: 'Subtropical highland',
      harvestMethod: 'Hand-picked cherry selection',
    },
    translations: {
      en: {
        name: 'Premium Arabica - Da Lat Highlands',
        description:
          "Exceptional specialty Arabica from the cool highlands of Da Lat, Lam Dong province, carefully sourced and processed by The Great Beans. Grown at high altitudes in ideal subtropical conditions, these beans showcase the unique terroir of Vietnamese highland coffee. Carefully processed using the washed method to highlight the bean's natural brightness and complexity. Available as green beans or custom roasted to specification.",
        shortDescription:
          'Specialty Arabica from Da Lat highlands with bright, complex flavor profile',
        features: [
          'High-altitude cultivation (1200-1500m)',
          'Subtropical highland terroir',
          'Washed processing for clarity',
          'Hand-picked cherry selection',
          'Organic and specialty certified',
          'Sustainable sourcing practices',
          'Unique Vietnamese Arabica character',
          'Available green or roasted',
        ],
        tastingNotes: [
          'Bright citrus acidity',
          'Floral jasmine aroma',
          'Wine-like complexity',
          'Notes of bergamot and honey',
          'Clean, lingering finish',
          'Medium body with silky texture',
        ],
        brewingRecommendations:
          'Excellent for pour-over methods (V60, Chemex), light to medium roasts. Brewing temperature: 92-94°C. Perfect for showcasing origin characteristics.',
      },
      de: {
        name: 'Premium Arabica - Da Lat Berglandgut',
        description:
          'Außergewöhnliche Specialty-Grade Arabica aus dem kühlen Bergklima von Da Lat. In großer Höhe in vulkanischem Boden angebaut, entwickeln diese Bohnen komplexe Geschmacksprofile.',
        shortDescription:
          'Specialty-Grade Arabica aus Da Lats hochgelegenen vulkanischen Terroir',
        features: [
          'Hochlagen-Anbau (1200-1500m)',
          'Specialty Coffee Association zertifiziert',
          'Bio und Direct Trade',
          'Einzigartiges vietnamesisches Terroir',
        ],
        tastingNotes: [
          'Helle Zitrusacidität',
          'Blumiges Jasmin-Aroma',
          'Weinähnliche Komplexität',
          'Noten von Bergamotte und Honig',
        ],
        brewingRecommendations:
          'Ausgezeichnet für Pour-Over-Methoden, helle bis mittlere Röstungen.',
      },
    },
    images: [
      'arabica-premium-da-lat-beans.jpg',
      'da-lat-mountain-estate.jpg',
      'high-altitude-plantation.jpg',
      'washed-processing-arabica.jpg',
    ],
    documents: [
      'arabica-premium-specification.pdf',
      'specialty-coffee-certification.pdf',
      'organic-certificate-arabica.pdf',
      'direct-trade-agreement.pdf',
      'cupping-score-sheet.pdf',
    ],
    tags: [
      'arabica',
      'premium',
      'da-lat',
      'specialty',
      'organic',
      'high-altitude',
    ],
    isActive: true,
    isFeatured: true,
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
  },
  // Specialty Blends
  {
    id: 'blend-signature-vietnamese',
    sku: 'BLEND-SIG-VN-001',
    coffeeType: 'BLEND',
    grade: 'PREMIUM',
    processing: 'MIXED',
    certifications: ['RAINFOREST_ALLIANCE', 'UTZ'],
    specifications: {
      moisture: '12.0%',
      defects: '< 4%',
      screenSize: '16+',
      density: '0.72 g/ml',
      cupping: {
        aroma: 8.0,
        flavor: 8.2,
        acidity: 7.0,
        body: 8.5,
        overall: 8.0,
      },
      caffeine: '1.8-2.2%',
    },
    pricing: {
      basePrice: 3200,
      currency: 'USD',
      unit: 'MT',
      minOrder: 15,
      priceBreaks: [
        { quantity: 30, price: 3150 },
        { quantity: 60, price: 3100 },
        { quantity: 120, price: 3000 },
      ],
    },
    availability: {
      inStock: true,
      quantity: 300,
      harvestSeason: '2024',
      availableFrom: '2024-01-01',
    },
    originInfo: {
      region: 'Multi-region blend',
      province: 'Dak Lak & Lam Dong',
      farm: 'Selected partner farms',
      altitude: '500-1200m',
      coordinates: { lat: 12.5, lng: 108.3 },
      soilType: 'Volcanic basalt & loam',
      climate: 'Tropical to subtropical',
      harvestMethod: 'Selective picking',
    },
    translations: {
      en: {
        name: 'Signature Vietnamese Blend',
        description:
          "Our masterfully crafted signature blend combining the best of Vietnamese coffee terroir. This blend features 70% premium Robusta from Dak Lak for body and strength, and 30% specialty Arabica from Da Lat for complexity and brightness. The result is a uniquely Vietnamese coffee that showcases the country's diverse coffee heritage.",
        shortDescription:
          'Masterful blend of 70% premium Robusta and 30% specialty Arabica',
        features: [
          '70% Premium Robusta (Dak Lak)',
          '30% Specialty Arabica (Da Lat)',
          'Balanced strength and complexity',
          'Represents Vietnamese coffee heritage',
          'Consistent year-round availability',
          'Perfect for various brewing methods',
        ],
        tastingNotes: [
          'Rich chocolate base from Robusta',
          'Bright citrus notes from Arabica',
          'Full body with balanced acidity',
          'Caramel sweetness',
          'Long, satisfying finish',
          'Hints of tropical fruit',
        ],
        brewingRecommendations:
          'Versatile blend suitable for espresso, drip coffee, French press, and Vietnamese phin. Excellent for both black coffee and milk-based beverages.',
      },
    },
    images: [
      'signature-blend-beans.jpg',
      'blend-components.jpg',
      'roasted-blend-profile.jpg',
    ],
    documents: [
      'signature-blend-specification.pdf',
      'blend-ratio-guide.pdf',
      'brewing-recommendations.pdf',
    ],
    tags: [
      'blend',
      'signature',
      'robusta-arabica',
      'premium',
      'vietnamese-heritage',
    ],
    isActive: true,
    isFeatured: true,
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
  },
];

export default coffeeProductsData;
