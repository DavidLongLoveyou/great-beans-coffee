/**
 * Service Catalog Data Structure for Vietnamese Coffee B2B Services
 * Comprehensive service offerings for OEM, Private Label, and Sourcing
 */

import { CertificationType } from './product-catalog';

// Service types and enums
export enum ServiceType {
  OEM = 'OEM',
  PRIVATE_LABEL = 'PRIVATE_LABEL',
  SOURCING = 'SOURCING',
  LOGISTICS = 'LOGISTICS',
  QUALITY_CONTROL = 'QUALITY_CONTROL',
  CONSULTING = 'CONSULTING',
}

export enum ServiceCategory {
  MANUFACTURING = 'MANUFACTURING',
  BRANDING = 'BRANDING',
  SUPPLY_CHAIN = 'SUPPLY_CHAIN',
  LOGISTICS = 'LOGISTICS',
  QUALITY_ASSURANCE = 'QUALITY_ASSURANCE',
  CONSULTING = 'CONSULTING',
}

export enum DeliveryTimeframe {
  IMMEDIATE = 'IMMEDIATE', // 1-7 days
  SHORT_TERM = 'SHORT_TERM', // 1-4 weeks
  MEDIUM_TERM = 'MEDIUM_TERM', // 1-3 months
  LONG_TERM = 'LONG_TERM', // 3+ months
  ONGOING = 'ONGOING', // Continuous service
}

export enum PricingModel {
  FIXED_PRICE = 'FIXED_PRICE',
  PER_UNIT = 'PER_UNIT',
  PERCENTAGE = 'PERCENTAGE',
  HOURLY_RATE = 'HOURLY_RATE',
  MONTHLY_RETAINER = 'MONTHLY_RETAINER',
  CUSTOM_QUOTE = 'CUSTOM_QUOTE',
}

// Service interfaces
export interface ServiceCapability {
  name: Record<string, string>; // Multi-language capability names
  description: Record<string, string>; // Multi-language descriptions
  specifications: string[];
  minimumOrder?: number;
  maximumCapacity?: number;
  leadTime: number; // days
}

export interface ServicePricing {
  model: PricingModel;
  basePrice?: number;
  currency: string;
  unit?: string;
  minimumOrder?: number;
  setupFee?: number;
  discountTiers?: Array<{
    minQuantity: number;
    discountPercent: number;
  }>;
  priceValidUntil: Date;
}

export interface ServiceDeliverable {
  name: Record<string, string>;
  description: Record<string, string>;
  timeline: number; // days
  dependencies?: string[];
}

export interface ServiceRequirement {
  name: Record<string, string>;
  description: Record<string, string>;
  isMandatory: boolean;
  category: 'TECHNICAL' | 'BUSINESS' | 'LEGAL' | 'QUALITY';
}

export interface ServiceDocument {
  type:
    | 'BROCHURE'
    | 'SPECIFICATION'
    | 'CERTIFICATE'
    | 'CASE_STUDY'
    | 'TEMPLATE';
  url: string;
  name: Record<string, string>;
  language: string;
  fileSize?: number;
  downloadCount?: number;
}

export interface ServiceImage {
  url: string;
  alt: Record<string, string>;
  isPrimary: boolean;
  caption?: Record<string, string>;
}

export interface CatalogService {
  id: string;
  serviceCode: string;
  name: Record<string, string>;
  shortDescription: Record<string, string>;
  longDescription: Record<string, string>;
  type: ServiceType;
  category: ServiceCategory;
  capabilities: ServiceCapability[];
  pricing: ServicePricing;
  deliverables: ServiceDeliverable[];
  requirements: ServiceRequirement[];
  timeframe: DeliveryTimeframe;
  certifications: CertificationType[];
  images: ServiceImage[];
  documents: ServiceDocument[];
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Vietnamese Coffee Service Catalog
export const VIETNAMESE_COFFEE_SERVICE_CATALOG: CatalogService[] = [
  // OEM Manufacturing Service
  {
    id: 'oem-manufacturing-001',
    serviceCode: 'OEM-MFG-001',
    name: {
      en: 'OEM Coffee Manufacturing',
      vi: 'Sản Xuất Cà Phê OEM',
      de: 'OEM Kaffeeherstellung',
      ja: 'OEMコーヒー製造',
    },
    shortDescription: {
      en: 'Complete OEM coffee manufacturing services from green beans to finished products',
      vi: 'Dịch vụ sản xuất cà phê OEM hoàn chỉnh từ hạt xanh đến sản phẩm hoàn thiện',
      de: 'Komplette OEM-Kaffeeherstellungsdienstleistungen von grünen Bohnen bis zu fertigen Produkten',
      ja: '生豆から完成品まで完全なOEMコーヒー製造サービス',
    },
    longDescription: {
      en: 'Our comprehensive OEM manufacturing service covers the entire coffee production process. From sourcing premium Vietnamese coffee beans to roasting, grinding, and packaging according to your specifications. We maintain strict quality control throughout the process and can accommodate various product formats including whole beans, ground coffee, and instant coffee. Our facility is certified to international standards and can handle both small batch specialty orders and large-scale commercial production.',
      vi: 'Dịch vụ sản xuất OEM toàn diện của chúng tôi bao gồm toàn bộ quy trình sản xuất cà phê. Từ việc tìm nguồn hạt cà phê Việt Nam cao cấp đến rang, xay và đóng gói theo thông số kỹ thuật của bạn. Chúng tôi duy trì kiểm soát chất lượng nghiêm ngặt trong suốt quá trình và có thể đáp ứng các định dạng sản phẩm khác nhau bao gồm hạt nguyên, cà phê xay và cà phê hòa tan.',
      de: 'Unser umfassender OEM-Herstellungsservice deckt den gesamten Kaffeeproduktionsprozess ab. Von der Beschaffung hochwertiger vietnamesischer Kaffeebohnen bis zum Rösten, Mahlen und Verpacken nach Ihren Spezifikationen. Wir halten strenge Qualitätskontrolle während des gesamten Prozesses aufrecht.',
      ja: '当社の包括的なOEM製造サービスは、コーヒー生産プロセス全体をカバーします。プレミアムベトナムコーヒー豆の調達から、お客様の仕様に応じた焙煎、粉砕、包装まで。プロセス全体で厳格な品質管理を維持します。',
    },
    type: ServiceType.OEM,
    category: ServiceCategory.MANUFACTURING,
    capabilities: [
      {
        name: {
          en: 'Coffee Roasting',
          vi: 'Rang Cà Phê',
          de: 'Kaffeeröstung',
          ja: 'コーヒー焙煎',
        },
        description: {
          en: 'Professional coffee roasting with precise temperature and time control',
          vi: 'Rang cà phê chuyên nghiệp với kiểm soát nhiệt độ và thời gian chính xác',
          de: 'Professionelle Kaffeeröstung mit präziser Temperatur- und Zeitkontrolle',
          ja: '正確な温度と時間制御による専門的なコーヒー焙煎',
        },
        specifications: [
          'Light, Medium, Dark roast profiles',
          'Batch sizes: 50kg - 1000kg',
          'Custom roast curve development',
          'Quality control testing',
        ],
        minimumOrder: 500, // kg
        maximumCapacity: 50000, // kg per month
        leadTime: 14,
      },
      {
        name: {
          en: 'Coffee Grinding',
          vi: 'Xay Cà Phê',
          de: 'Kaffeemahlung',
          ja: 'コーヒー粉砕',
        },
        description: {
          en: 'Precision grinding for various brewing methods and applications',
          vi: 'Xay chính xác cho các phương pháp pha và ứng dụng khác nhau',
          de: 'Präzisionsmahlung für verschiedene Brühmethoden und Anwendungen',
          ja: '様々な抽出方法と用途のための精密粉砕',
        },
        specifications: [
          'Espresso, Drip, French Press, Turkish grinds',
          'Particle size consistency: ±5%',
          'Nitrogen flushing available',
          'Custom grind profiles',
        ],
        minimumOrder: 100, // kg
        maximumCapacity: 20000, // kg per month
        leadTime: 7,
      },
      {
        name: {
          en: 'Custom Packaging',
          vi: 'Đóng Gói Tùy Chỉnh',
          de: 'Individuelle Verpackung',
          ja: 'カスタムパッケージング',
        },
        description: {
          en: 'Flexible packaging solutions with your branding and specifications',
          vi: 'Giải pháp đóng gói linh hoạt với thương hiệu và thông số kỹ thuật của bạn',
          de: 'Flexible Verpackungslösungen mit Ihrem Branding und Spezifikationen',
          ja: 'お客様のブランディングと仕様による柔軟なパッケージングソリューション',
        },
        specifications: [
          'Bags: 100g - 1kg consumer packs',
          'Bulk: 5kg - 25kg commercial packs',
          'Valve bags, vacuum packs, tins',
          'Custom label printing',
        ],
        minimumOrder: 1000, // units
        maximumCapacity: 100000, // units per month
        leadTime: 21,
      },
    ],
    pricing: {
      model: PricingModel.PER_UNIT,
      basePrice: 8.5, // USD per kg
      currency: 'USD',
      unit: 'kg',
      minimumOrder: 500,
      setupFee: 2500,
      discountTiers: [
        { minQuantity: 1000, discountPercent: 5 },
        { minQuantity: 5000, discountPercent: 10 },
        { minQuantity: 10000, discountPercent: 15 },
      ],
      priceValidUntil: new Date('2024-12-31'),
    },
    deliverables: [
      {
        name: {
          en: 'Product Development',
          vi: 'Phát Triển Sản Phẩm',
          de: 'Produktentwicklung',
          ja: '製品開発',
        },
        description: {
          en: 'Custom blend development and recipe optimization',
          vi: 'Phát triển hỗn hợp tùy chỉnh và tối ưu hóa công thức',
          de: 'Individuelle Mischungsentwicklung und Rezeptoptimierung',
          ja: 'カスタムブレンド開発とレシピ最適化',
        },
        timeline: 14,
      },
      {
        name: {
          en: 'Sample Production',
          vi: 'Sản Xuất Mẫu',
          de: 'Musterproduktion',
          ja: 'サンプル生産',
        },
        description: {
          en: 'Small batch samples for approval before full production',
          vi: 'Mẫu lô nhỏ để phê duyệt trước khi sản xuất đầy đủ',
          de: 'Kleinchargen-Muster zur Genehmigung vor der Vollproduktion',
          ja: '本格生産前の承認用小ロットサンプル',
        },
        timeline: 7,
        dependencies: ['Product Development'],
      },
      {
        name: {
          en: 'Full Production',
          vi: 'Sản Xuất Đầy Đủ',
          de: 'Vollproduktion',
          ja: '本格生産',
        },
        description: {
          en: 'Complete manufacturing and packaging of approved products',
          vi: 'Sản xuất và đóng gói hoàn chỉnh các sản phẩm đã được phê duyệt',
          de: 'Vollständige Herstellung und Verpackung genehmigter Produkte',
          ja: '承認された製品の完全な製造と包装',
        },
        timeline: 21,
        dependencies: ['Sample Production'],
      },
    ],
    requirements: [
      {
        name: {
          en: 'Product Specifications',
          vi: 'Thông Số Sản Phẩm',
          de: 'Produktspezifikationen',
          ja: '製品仕様',
        },
        description: {
          en: 'Detailed product requirements including blend ratios, roast levels, and packaging specifications',
          vi: 'Yêu cầu sản phẩm chi tiết bao gồm tỷ lệ pha trộn, mức độ rang và thông số đóng gói',
          de: 'Detaillierte Produktanforderungen einschließlich Mischungsverhältnisse, Röstgrade und Verpackungsspezifikationen',
          ja: 'ブレンド比率、焙煎レベル、包装仕様を含む詳細な製品要件',
        },
        isMandatory: true,
        category: 'TECHNICAL',
      },
      {
        name: {
          en: 'Minimum Order Quantity',
          vi: 'Số Lượng Đặt Hàng Tối Thiểu',
          de: 'Mindestbestellmenge',
          ja: '最小注文数量',
        },
        description: {
          en: 'Minimum 500kg per SKU for cost-effective production',
          vi: 'Tối thiểu 500kg mỗi SKU để sản xuất hiệu quả về chi phí',
          de: 'Mindestens 500kg pro SKU für kosteneffiziente Produktion',
          ja: 'コスト効率的な生産のためのSKUあたり最小500kg',
        },
        isMandatory: true,
        category: 'BUSINESS',
      },
    ],
    timeframe: DeliveryTimeframe.MEDIUM_TERM,
    certifications: [
      CertificationType.ORGANIC,
      CertificationType.FAIR_TRADE,
      CertificationType.RAINFOREST_ALLIANCE,
    ],
    images: [
      {
        url: '/images/services/oem-manufacturing-primary.jpg',
        alt: {
          en: 'OEM Coffee Manufacturing Facility',
          vi: 'Cơ Sở Sản Xuất Cà Phê OEM',
          de: 'OEM Kaffeeherstellungsanlage',
          ja: 'OEMコーヒー製造施設',
        },
        isPrimary: true,
      },
    ],
    documents: [
      {
        type: 'BROCHURE',
        url: '/documents/oem-manufacturing-brochure.pdf',
        name: {
          en: 'OEM Manufacturing Services Brochure',
          vi: 'Brochure Dịch Vụ Sản Xuất OEM',
          de: 'OEM-Herstellungsdienstleistungen Broschüre',
          ja: 'OEM製造サービスパンフレット',
        },
        language: 'en',
      },
      {
        type: 'SPECIFICATION',
        url: '/documents/oem-manufacturing-specs.pdf',
        name: {
          en: 'Technical Specifications',
          vi: 'Thông Số Kỹ Thuật',
          de: 'Technische Spezifikationen',
          ja: '技術仕様',
        },
        language: 'en',
      },
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'system',
    updatedBy: 'admin',
  },

  // Private Label Service
  {
    id: 'private-label-001',
    serviceCode: 'PL-001',
    name: {
      en: 'Private Label Coffee Solutions',
      vi: 'Giải Pháp Cà Phê Nhãn Riêng',
      de: 'Private Label Kaffeelösungen',
      ja: 'プライベートラベルコーヒーソリューション',
    },
    shortDescription: {
      en: 'Complete private label coffee solutions with custom branding and packaging',
      vi: 'Giải pháp cà phê nhãn riêng hoàn chỉnh với thương hiệu và đóng gói tùy chỉnh',
      de: 'Komplette Private Label Kaffeelösungen mit individuellem Branding und Verpackung',
      ja: 'カスタムブランディングとパッケージングによる完全なプライベートラベルコーヒーソリューション',
    },
    longDescription: {
      en: 'Transform your coffee business with our comprehensive private label solutions. We handle everything from product development and branding to manufacturing and packaging. Our team works closely with you to create unique coffee blends that reflect your brand identity. We offer complete design services, regulatory compliance support, and flexible production volumes to meet your market needs.',
      vi: 'Chuyển đổi doanh nghiệp cà phê của bạn với các giải pháp nhãn riêng toàn diện của chúng tôi. Chúng tôi xử lý mọi thứ từ phát triển sản phẩm và xây dựng thương hiệu đến sản xuất và đóng gói.',
      de: 'Transformieren Sie Ihr Kaffeegeschäft mit unseren umfassenden Private Label Lösungen. Wir kümmern uns um alles von der Produktentwicklung und dem Branding bis zur Herstellung und Verpackung.',
      ja: '当社の包括的なプライベートラベルソリューションでコーヒービジネスを変革してください。製品開発とブランディングから製造と包装まですべてを処理します。',
    },
    type: ServiceType.PRIVATE_LABEL,
    category: ServiceCategory.BRANDING,
    capabilities: [
      {
        name: {
          en: 'Brand Development',
          vi: 'Phát Triển Thương Hiệu',
          de: 'Markenentwicklung',
          ja: 'ブランド開発',
        },
        description: {
          en: 'Complete brand identity creation including logo, packaging design, and brand guidelines',
          vi: 'Tạo nhận diện thương hiệu hoàn chỉnh bao gồm logo, thiết kế bao bì và hướng dẫn thương hiệu',
          de: 'Vollständige Markenidentitätserstellung einschließlich Logo, Verpackungsdesign und Markenrichtlinien',
          ja: 'ロゴ、パッケージデザイン、ブランドガイドラインを含む完全なブランドアイデンティティ作成',
        },
        specifications: [
          'Logo design and brand identity',
          'Packaging design and artwork',
          'Brand guidelines documentation',
          'Marketing material templates',
        ],
        leadTime: 21,
      },
      {
        name: {
          en: 'Product Formulation',
          vi: 'Công Thức Sản Phẩm',
          de: 'Produktformulierung',
          ja: '製品配合',
        },
        description: {
          en: 'Custom coffee blend development tailored to your target market and brand positioning',
          vi: 'Phát triển hỗn hợp cà phê tùy chỉnh phù hợp với thị trường mục tiêu và định vị thương hiệu của bạn',
          de: 'Individuelle Kaffeemischungsentwicklung zugeschnitten auf Ihren Zielmarkt und Markenpositionierung',
          ja: 'ターゲット市場とブランドポジショニングに合わせたカスタムコーヒーブレンド開発',
        },
        specifications: [
          'Flavor profile development',
          'Blend optimization',
          'Sensory testing and evaluation',
          'Recipe documentation',
        ],
        leadTime: 14,
      },
      {
        name: {
          en: 'Regulatory Compliance',
          vi: 'Tuân Thủ Quy Định',
          de: 'Regulatorische Compliance',
          ja: '規制遵守',
        },
        description: {
          en: 'Ensure your products meet all regulatory requirements for your target markets',
          vi: 'Đảm bảo sản phẩm của bạn đáp ứng tất cả các yêu cầu quy định cho thị trường mục tiêu',
          de: 'Stellen Sie sicher, dass Ihre Produkte alle regulatorischen Anforderungen für Ihre Zielmärkte erfüllen',
          ja: 'お客様の製品がターゲット市場のすべての規制要件を満たすことを確保',
        },
        specifications: [
          'Labeling compliance',
          'Nutritional analysis',
          'Certification support',
          'Documentation preparation',
        ],
        leadTime: 10,
      },
    ],
    pricing: {
      model: PricingModel.CUSTOM_QUOTE,
      currency: 'USD',
      setupFee: 5000,
      priceValidUntil: new Date('2024-12-31'),
    },
    deliverables: [
      {
        name: {
          en: 'Brand Identity Package',
          vi: 'Gói Nhận Diện Thương Hiệu',
          de: 'Markenidentitätspaket',
          ja: 'ブランドアイデンティティパッケージ',
        },
        description: {
          en: 'Complete brand identity including logo, colors, typography, and brand guidelines',
          vi: 'Nhận diện thương hiệu hoàn chỉnh bao gồm logo, màu sắc, kiểu chữ và hướng dẫn thương hiệu',
          de: 'Vollständige Markenidentität einschließlich Logo, Farben, Typografie und Markenrichtlinien',
          ja: 'ロゴ、色、タイポグラフィ、ブランドガイドラインを含む完全なブランドアイデンティティ',
        },
        timeline: 21,
      },
      {
        name: {
          en: 'Product Samples',
          vi: 'Mẫu Sản Phẩm',
          de: 'Produktmuster',
          ja: '製品サンプル',
        },
        description: {
          en: 'Multiple product samples for testing and approval',
          vi: 'Nhiều mẫu sản phẩm để thử nghiệm và phê duyệt',
          de: 'Mehrere Produktmuster zum Testen und zur Genehmigung',
          ja: 'テストと承認のための複数の製品サンプル',
        },
        timeline: 14,
        dependencies: ['Brand Identity Package'],
      },
      {
        name: {
          en: 'Production Ready Products',
          vi: 'Sản Phẩm Sẵn Sàng Sản Xuất',
          de: 'Produktionsfertige Produkte',
          ja: '生産準備完了製品',
        },
        description: {
          en: 'Fully branded and packaged products ready for market',
          vi: 'Sản phẩm có thương hiệu và đóng gói đầy đủ sẵn sàng cho thị trường',
          de: 'Vollständig gebrandete und verpackte Produkte bereit für den Markt',
          ja: '市場投入準備完了の完全ブランド化・包装済み製品',
        },
        timeline: 30,
        dependencies: ['Product Samples'],
      },
    ],
    requirements: [
      {
        name: {
          en: 'Brand Brief',
          vi: 'Tóm Tắt Thương Hiệu',
          de: 'Marken-Brief',
          ja: 'ブランドブリーフ',
        },
        description: {
          en: 'Detailed brand positioning, target audience, and design preferences',
          vi: 'Định vị thương hiệu chi tiết, đối tượng mục tiêu và sở thích thiết kế',
          de: 'Detaillierte Markenpositionierung, Zielgruppe und Designpräferenzen',
          ja: '詳細なブランドポジショニング、ターゲットオーディエンス、デザイン嗜好',
        },
        isMandatory: true,
        category: 'BUSINESS',
      },
      {
        name: {
          en: 'Market Research',
          vi: 'Nghiên Cứu Thị Trường',
          de: 'Marktforschung',
          ja: '市場調査',
        },
        description: {
          en: 'Understanding of target market preferences and competitive landscape',
          vi: 'Hiểu biết về sở thích thị trường mục tiêu và bối cảnh cạnh tranh',
          de: 'Verständnis der Zielmarktpräferenzen und Wettbewerbslandschaft',
          ja: 'ターゲット市場の嗜好と競争環境の理解',
        },
        isMandatory: false,
        category: 'BUSINESS',
      },
    ],
    timeframe: DeliveryTimeframe.MEDIUM_TERM,
    certifications: [CertificationType.ORGANIC, CertificationType.FAIR_TRADE],
    images: [
      {
        url: '/images/services/private-label-primary.jpg',
        alt: {
          en: 'Private Label Coffee Products',
          vi: 'Sản Phẩm Cà Phê Nhãn Riêng',
          de: 'Private Label Kaffeeprodukte',
          ja: 'プライベートラベルコーヒー製品',
        },
        isPrimary: true,
      },
    ],
    documents: [
      {
        type: 'BROCHURE',
        url: '/documents/private-label-brochure.pdf',
        name: {
          en: 'Private Label Solutions Brochure',
          vi: 'Brochure Giải Pháp Nhãn Riêng',
          de: 'Private Label Lösungen Broschüre',
          ja: 'プライベートラベルソリューションパンフレット',
        },
        language: 'en',
      },
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'system',
    updatedBy: 'admin',
  },

  // Coffee Sourcing Service
  {
    id: 'coffee-sourcing-001',
    serviceCode: 'CS-001',
    name: {
      en: 'Coffee Sourcing & Procurement',
      vi: 'Tìm Nguồn & Mua Sắm Cà Phê',
      de: 'Kaffeebeschaffung & Einkauf',
      ja: 'コーヒー調達・購買',
    },
    shortDescription: {
      en: 'Professional coffee sourcing services connecting you with premium Vietnamese coffee suppliers',
      vi: 'Dịch vụ tìm nguồn cà phê chuyên nghiệp kết nối bạn với các nhà cung cấp cà phê Việt Nam cao cấp',
      de: 'Professionelle Kaffeebeschaffungsdienstleistungen, die Sie mit Premium-vietnamesischen Kaffeelieferanten verbinden',
      ja: 'プレミアムベトナムコーヒーサプライヤーとお客様を結ぶ専門的なコーヒー調達サービス',
    },
    longDescription: {
      en: 'Navigate the complex Vietnamese coffee market with our expert sourcing services. We leverage our extensive network of farmers, cooperatives, and processors to find the exact coffee profiles you need. Our team conducts thorough quality assessments, manages logistics, and ensures transparent pricing. Whether you need specialty single-origin coffees or large volumes of commercial grade beans, we provide end-to-end sourcing solutions.',
      vi: 'Điều hướng thị trường cà phê Việt Nam phức tạp với các dịch vụ tìm nguồn chuyên gia của chúng tôi. Chúng tôi tận dụng mạng lưới rộng lớn của nông dân, hợp tác xã và nhà chế biến để tìm ra chính xác các hồ sơ cà phê bạn cần.',
      de: 'Navigieren Sie durch den komplexen vietnamesischen Kaffeemarkt mit unseren Experten-Beschaffungsdienstleistungen. Wir nutzen unser umfangreiches Netzwerk von Bauern, Genossenschaften und Verarbeitern.',
      ja: '当社の専門調達サービスで複雑なベトナムコーヒー市場をナビゲートしてください。農家、協同組合、加工業者の広範なネットワークを活用して、お客様が必要とする正確なコーヒープロファイルを見つけます。',
    },
    type: ServiceType.SOURCING,
    category: ServiceCategory.SUPPLY_CHAIN,
    capabilities: [
      {
        name: {
          en: 'Supplier Network Access',
          vi: 'Truy Cập Mạng Lưới Nhà Cung Cấp',
          de: 'Zugang zum Lieferantennetzwerk',
          ja: 'サプライヤーネットワークアクセス',
        },
        description: {
          en: 'Access to over 500 verified coffee suppliers across Vietnam',
          vi: 'Truy cập vào hơn 500 nhà cung cấp cà phê đã được xác minh trên khắp Việt Nam',
          de: 'Zugang zu über 500 verifizierten Kaffeelieferanten in ganz Vietnam',
          ja: 'ベトナム全土の500以上の検証済みコーヒーサプライヤーへのアクセス',
        },
        specifications: [
          'Direct farmer relationships',
          'Cooperative partnerships',
          'Processing facility network',
          'Export license verification',
        ],
        leadTime: 7,
      },
      {
        name: {
          en: 'Quality Assessment',
          vi: 'Đánh Giá Chất Lượng',
          de: 'Qualitätsbewertung',
          ja: '品質評価',
        },
        description: {
          en: 'Comprehensive quality testing and evaluation of coffee samples',
          vi: 'Kiểm tra và đánh giá chất lượng toàn diện các mẫu cà phê',
          de: 'Umfassende Qualitätsprüfung und -bewertung von Kaffeeproben',
          ja: 'コーヒーサンプルの包括的な品質テストと評価',
        },
        specifications: [
          'Physical analysis (moisture, defects, screen size)',
          'Sensory evaluation (cupping)',
          'Chemical analysis (caffeine, chlorogenic acid)',
          'Certification verification',
        ],
        leadTime: 5,
      },
      {
        name: {
          en: 'Price Negotiation',
          vi: 'Đàm Phán Giá',
          de: 'Preisverhandlung',
          ja: '価格交渉',
        },
        description: {
          en: 'Professional price negotiation to secure best market rates',
          vi: 'Đàm phán giá chuyên nghiệp để đảm bảo mức giá thị trường tốt nhất',
          de: 'Professionelle Preisverhandlung zur Sicherung der besten Marktpreise',
          ja: '最良の市場価格を確保するための専門的な価格交渉',
        },
        specifications: [
          'Market price analysis',
          'Volume discount negotiation',
          'Contract term optimization',
          'Payment term negotiation',
        ],
        leadTime: 3,
      },
    ],
    pricing: {
      model: PricingModel.PERCENTAGE,
      basePrice: 3.5, // % of transaction value
      currency: 'USD',
      minimumOrder: 10000, // USD minimum transaction
      priceValidUntil: new Date('2024-12-31'),
    },
    deliverables: [
      {
        name: {
          en: 'Supplier Identification',
          vi: 'Xác Định Nhà Cung Cấp',
          de: 'Lieferantenidentifikation',
          ja: 'サプライヤー特定',
        },
        description: {
          en: 'Comprehensive list of qualified suppliers matching your requirements',
          vi: 'Danh sách toàn diện các nhà cung cấp đủ điều kiện phù hợp với yêu cầu của bạn',
          de: 'Umfassende Liste qualifizierter Lieferanten, die Ihren Anforderungen entsprechen',
          ja: 'お客様の要件に合致する適格サプライヤーの包括的リスト',
        },
        timeline: 7,
      },
      {
        name: {
          en: 'Sample Procurement',
          vi: 'Mua Sắm Mẫu',
          de: 'Musterbeschaffung',
          ja: 'サンプル調達',
        },
        description: {
          en: 'Collection and delivery of coffee samples for evaluation',
          vi: 'Thu thập và giao mẫu cà phê để đánh giá',
          de: 'Sammlung und Lieferung von Kaffeeproben zur Bewertung',
          ja: '評価用コーヒーサンプルの収集と配送',
        },
        timeline: 10,
        dependencies: ['Supplier Identification'],
      },
      {
        name: {
          en: 'Contract Negotiation',
          vi: 'Đàm Phán Hợp Đồng',
          de: 'Vertragsverhandlung',
          ja: '契約交渉',
        },
        description: {
          en: 'Professional contract negotiation and finalization',
          vi: 'Đàm phán và hoàn thiện hợp đồng chuyên nghiệp',
          de: 'Professionelle Vertragsverhandlung und -finalisierung',
          ja: '専門的な契約交渉と最終化',
        },
        timeline: 14,
        dependencies: ['Sample Procurement'],
      },
    ],
    requirements: [
      {
        name: {
          en: 'Product Specifications',
          vi: 'Thông Số Sản Phẩm',
          de: 'Produktspezifikationen',
          ja: '製品仕様',
        },
        description: {
          en: 'Detailed requirements for coffee type, grade, processing method, and quality parameters',
          vi: 'Yêu cầu chi tiết về loại cà phê, cấp độ, phương pháp chế biến và thông số chất lượng',
          de: 'Detaillierte Anforderungen für Kaffeetyp, Grad, Verarbeitungsmethode und Qualitätsparameter',
          ja: 'コーヒータイプ、グレード、加工方法、品質パラメータの詳細要件',
        },
        isMandatory: true,
        category: 'TECHNICAL',
      },
      {
        name: {
          en: 'Volume Requirements',
          vi: 'Yêu Cầu Khối Lượng',
          de: 'Volumenanforderungen',
          ja: '数量要件',
        },
        description: {
          en: 'Annual volume requirements and delivery schedule preferences',
          vi: 'Yêu cầu khối lượng hàng năm và sở thích lịch trình giao hàng',
          de: 'Jährliche Volumenanforderungen und Lieferzeitplan-Präferenzen',
          ja: '年間数量要件と配送スケジュール希望',
        },
        isMandatory: true,
        category: 'BUSINESS',
      },
    ],
    timeframe: DeliveryTimeframe.SHORT_TERM,
    certifications: [],
    images: [
      {
        url: '/images/services/coffee-sourcing-primary.jpg',
        alt: {
          en: 'Coffee Sourcing and Procurement Services',
          vi: 'Dịch Vụ Tìm Nguồn và Mua Sắm Cà Phê',
          de: 'Kaffeebeschaffungs- und Einkaufsdienstleistungen',
          ja: 'コーヒー調達・購買サービス',
        },
        isPrimary: true,
      },
    ],
    documents: [
      {
        type: 'BROCHURE',
        url: '/documents/coffee-sourcing-brochure.pdf',
        name: {
          en: 'Coffee Sourcing Services Brochure',
          vi: 'Brochure Dịch Vụ Tìm Nguồn Cà Phê',
          de: 'Kaffeebeschaffungsdienstleistungen Broschüre',
          ja: 'コーヒー調達サービスパンフレット',
        },
        language: 'en',
      },
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'system',
    updatedBy: 'admin',
  },

  // Logistics & Shipping Service
  {
    id: 'logistics-shipping-001',
    serviceCode: 'LOG-001',
    name: {
      en: 'Logistics & Shipping Solutions',
      vi: 'Giải Pháp Logistics & Vận Chuyển',
      de: 'Logistik- & Versandlösungen',
      ja: 'ロジスティクス・配送ソリューション',
    },
    shortDescription: {
      en: 'End-to-end logistics and shipping solutions for coffee exports from Vietnam',
      vi: 'Giải pháp logistics và vận chuyển từ đầu đến cuối cho xuất khẩu cà phê từ Việt Nam',
      de: 'End-to-End Logistik- und Versandlösungen für Kaffeeexporte aus Vietnam',
      ja: 'ベトナムからのコーヒー輸出のためのエンドツーエンドロジスティクス・配送ソリューション',
    },
    longDescription: {
      en: 'Streamline your coffee supply chain with our comprehensive logistics solutions. We handle everything from inland transportation to international shipping, customs clearance, and final delivery. Our experienced team ensures your coffee maintains its quality throughout the journey while optimizing costs and delivery times.',
      vi: 'Hợp lý hóa chuỗi cung ứng cà phê của bạn với các giải pháp logistics toàn diện của chúng tôi. Chúng tôi xử lý mọi thứ từ vận chuyển nội địa đến vận chuyển quốc tế, thông quan hải quan và giao hàng cuối cùng.',
      de: 'Optimieren Sie Ihre Kaffee-Lieferkette mit unseren umfassenden Logistiklösungen. Wir kümmern uns um alles von Inlandstransport bis internationaler Schifffahrt, Zollabfertigung und Endlieferung.',
      ja: '当社の包括的なロジスティクスソリューションでコーヒーサプライチェーンを合理化してください。国内輸送から国際輸送、通関、最終配送まですべてを処理します。',
    },
    type: ServiceType.LOGISTICS,
    category: ServiceCategory.LOGISTICS,
    capabilities: [
      {
        name: {
          en: 'Inland Transportation',
          vi: 'Vận Chuyển Nội Địa',
          de: 'Inlandstransport',
          ja: '国内輸送',
        },
        description: {
          en: 'Reliable transportation from farms and processing facilities to ports',
          vi: 'Vận chuyển đáng tin cậy từ trang trại và cơ sở chế biến đến cảng',
          de: 'Zuverlässiger Transport von Farmen und Verarbeitungsanlagen zu Häfen',
          ja: '農場や加工施設から港への信頼性の高い輸送',
        },
        specifications: [
          'Temperature-controlled vehicles',
          'GPS tracking',
          'Insurance coverage',
          'Flexible scheduling',
        ],
        leadTime: 2,
      },
      {
        name: {
          en: 'International Shipping',
          vi: 'Vận Chuyển Quốc Tế',
          de: 'Internationale Schifffahrt',
          ja: '国際輸送',
        },
        description: {
          en: 'Ocean freight services to major global destinations',
          vi: 'Dịch vụ vận tải đường biển đến các điểm đến toàn cầu chính',
          de: 'Seefracht-Dienstleistungen zu wichtigen globalen Zielen',
          ja: '主要なグローバル目的地への海上貨物サービス',
        },
        specifications: [
          'FCL and LCL options',
          'Container tracking',
          'Marine insurance',
          'Documentation handling',
        ],
        leadTime: 21,
      },
      {
        name: {
          en: 'Customs Clearance',
          vi: 'Thông Quan Hải Quan',
          de: 'Zollabfertigung',
          ja: '通関',
        },
        description: {
          en: 'Professional customs clearance and documentation services',
          vi: 'Dịch vụ thông quan hải quan và tài liệu chuyên nghiệp',
          de: 'Professionelle Zollabfertigungs- und Dokumentationsdienstleistungen',
          ja: '専門的な通関・書類作成サービス',
        },
        specifications: [
          'Export documentation',
          'Certificate of origin',
          'Phytosanitary certificates',
          'Customs bond handling',
        ],
        leadTime: 3,
      },
    ],
    pricing: {
      model: PricingModel.CUSTOM_QUOTE,
      currency: 'USD',
      priceValidUntil: new Date('2024-12-31'),
    },
    deliverables: [
      {
        name: {
          en: 'Shipping Quote',
          vi: 'Báo Giá Vận Chuyển',
          de: 'Versandangebot',
          ja: '配送見積もり',
        },
        description: {
          en: 'Detailed shipping cost breakdown and timeline',
          vi: 'Phân tích chi phí vận chuyển chi tiết và thời gian',
          de: 'Detaillierte Versandkostenaufschlüsselung und Zeitplan',
          ja: '詳細な配送コスト内訳とタイムライン',
        },
        timeline: 1,
      },
      {
        name: {
          en: 'Logistics Coordination',
          vi: 'Điều Phối Logistics',
          de: 'Logistikkoordination',
          ja: 'ロジスティクス調整',
        },
        description: {
          en: 'Complete coordination of pickup, transportation, and delivery',
          vi: 'Điều phối hoàn chỉnh việc nhận hàng, vận chuyển và giao hàng',
          de: 'Vollständige Koordination von Abholung, Transport und Lieferung',
          ja: '集荷、輸送、配送の完全な調整',
        },
        timeline: 30,
        dependencies: ['Shipping Quote'],
      },
    ],
    requirements: [
      {
        name: {
          en: 'Shipment Details',
          vi: 'Chi Tiết Lô Hàng',
          de: 'Sendungsdetails',
          ja: '出荷詳細',
        },
        description: {
          en: 'Complete shipment information including origin, destination, and cargo details',
          vi: 'Thông tin lô hàng hoàn chỉnh bao gồm xuất xứ, điểm đến và chi tiết hàng hóa',
          de: 'Vollständige Sendungsinformationen einschließlich Herkunft, Ziel und Frachtdetails',
          ja: '出発地、目的地、貨物詳細を含む完全な出荷情報',
        },
        isMandatory: true,
        category: 'TECHNICAL',
      },
    ],
    timeframe: DeliveryTimeframe.SHORT_TERM,
    certifications: [],
    images: [
      {
        url: '/images/services/logistics-shipping-primary.jpg',
        alt: {
          en: 'Logistics and Shipping Solutions',
          vi: 'Giải Pháp Logistics và Vận Chuyển',
          de: 'Logistik- und Versandlösungen',
          ja: 'ロジスティクス・配送ソリューション',
        },
        isPrimary: true,
      },
    ],
    documents: [
      {
        type: 'BROCHURE',
        url: '/documents/logistics-shipping-brochure.pdf',
        name: {
          en: 'Logistics & Shipping Services Brochure',
          vi: 'Brochure Dịch Vụ Logistics & Vận Chuyển',
          de: 'Logistik- & Versanddienstleistungen Broschüre',
          ja: 'ロジスティクス・配送サービスパンフレット',
        },
        language: 'en',
      },
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'system',
    updatedBy: 'admin',
  },
];

// Helper functions for service catalog
export const getServicesByType = (type: ServiceType): CatalogService[] => {
  return VIETNAMESE_COFFEE_SERVICE_CATALOG.filter(
    service => service.type === type
  );
};

export const getServicesByCategory = (
  category: ServiceCategory
): CatalogService[] => {
  return VIETNAMESE_COFFEE_SERVICE_CATALOG.filter(
    service => service.category === category
  );
};

export const getFeaturedServices = (): CatalogService[] => {
  return VIETNAMESE_COFFEE_SERVICE_CATALOG.filter(
    service => service.isFeatured
  );
};

export const getActiveServices = (): CatalogService[] => {
  return VIETNAMESE_COFFEE_SERVICE_CATALOG.filter(service => service.isActive);
};

export const getServiceById = (id: string): CatalogService | undefined => {
  return VIETNAMESE_COFFEE_SERVICE_CATALOG.find(service => service.id === id);
};

export const getServiceByCode = (
  serviceCode: string
): CatalogService | undefined => {
  return VIETNAMESE_COFFEE_SERVICE_CATALOG.find(
    service => service.serviceCode === serviceCode
  );
};

export const searchServices = (
  query: string,
  locale = 'en'
): CatalogService[] => {
  const lowercaseQuery = query.toLowerCase();
  return VIETNAMESE_COFFEE_SERVICE_CATALOG.filter(service => {
    const name = service.name[locale]?.toLowerCase() || '';
    const description = service.shortDescription[locale]?.toLowerCase() || '';
    const serviceCode = service.serviceCode.toLowerCase();

    return (
      name.includes(lowercaseQuery) ||
      description.includes(lowercaseQuery) ||
      serviceCode.includes(lowercaseQuery)
    );
  });
};

// Service filtering utilities
export interface ServiceFilters {
  type?: ServiceType[];
  category?: ServiceCategory[];
  timeframe?: DeliveryTimeframe[];
  pricingModel?: PricingModel[];
  featured?: boolean;
}

export const filterServices = (filters: ServiceFilters): CatalogService[] => {
  return VIETNAMESE_COFFEE_SERVICE_CATALOG.filter(service => {
    if (filters.type && !filters.type.includes(service.type)) return false;
    if (filters.category && !filters.category.includes(service.category))
      return false;
    if (filters.timeframe && !filters.timeframe.includes(service.timeframe))
      return false;
    if (
      filters.pricingModel &&
      !filters.pricingModel.includes(service.pricing.model)
    )
      return false;
    if (
      filters.featured !== undefined &&
      service.isFeatured !== filters.featured
    )
      return false;

    return true;
  });
};

// Export service catalog metadata
export const SERVICE_CATALOG_METADATA = {
  totalServices: VIETNAMESE_COFFEE_SERVICE_CATALOG.length,
  serviceTypes: Object.values(ServiceType),
  serviceCategories: Object.values(ServiceCategory),
  deliveryTimeframes: Object.values(DeliveryTimeframe),
  pricingModels: Object.values(PricingModel),
  supportedLocales: ['en', 'vi', 'de', 'ja'],
  lastUpdated: new Date('2024-01-15'),
};
