/**
 * Product Catalog Data Structure for Vietnamese Coffee Exports
 * Comprehensive B2B product data with Vietnamese coffee varieties
 */

import { CertificationVO } from '@/domain/value-objects/certification.value-object';

// Core product types and enums
export enum CoffeeType {
  ROBUSTA = 'ROBUSTA',
  ARABICA = 'ARABICA',
  BLEND = 'BLEND',
  INSTANT = 'INSTANT',
  ROASTED = 'ROASTED',
}

export enum CoffeeGrade {
  GRADE_1 = 'GRADE_1',
  GRADE_2 = 'GRADE_2',
  GRADE_3 = 'GRADE_3',
  SPECIALTY = 'SPECIALTY',
  PREMIUM = 'PREMIUM',
  COMMERCIAL = 'COMMERCIAL',
}

export enum ProcessingMethod {
  NATURAL = 'NATURAL',
  WASHED = 'WASHED',
  HONEY = 'HONEY',
  SEMI_WASHED = 'SEMI_WASHED',
  WET_HULLED = 'WET_HULLED',
  PULPED_NATURAL = 'PULPED_NATURAL',
}

export enum PackagingType {
  JUTE_BAGS_60KG = 'JUTE_BAGS_60KG',
  JUTE_BAGS_69KG = 'JUTE_BAGS_69KG',
  GRAINPRO_BAGS = 'GRAINPRO_BAGS',
  VACUUM_PACKED = 'VACUUM_PACKED',
  BULK_CONTAINER = 'BULK_CONTAINER',
  SMALL_BAGS_1KG = 'SMALL_BAGS_1KG',
  SMALL_BAGS_5KG = 'SMALL_BAGS_5KG',
}

export enum CertificationType {
  ORGANIC = 'ORGANIC',
  FAIR_TRADE = 'FAIR_TRADE',
  RAINFOREST_ALLIANCE = 'RAINFOREST_ALLIANCE',
  UTZ = 'UTZ',
  UTZ_CERTIFIED = 'UTZ_CERTIFIED',
  C_CAFE_PRACTICES = 'C_CAFE_PRACTICES',
  BIRD_FRIENDLY = 'BIRD_FRIENDLY',
  SHADE_GROWN = 'SHADE_GROWN',
  DIRECT_TRADE = 'DIRECT_TRADE',
  ISO_22000 = 'ISO_22000',
  HACCP = 'HACCP',
  BRC = 'BRC',
  KOSHER = 'KOSHER',
  HALAL = 'HALAL',
}

// Product interfaces
export interface ProductSpecifications {
  moisture: number; // %
  defectRate: number; // %
  screenSize: string; // e.g., "18+", "16-18"
  density: number; // g/ml
  cuppingScore?: number; // 0-100
  acidity?: string;
  body?: string;
  flavor?: string;
  aroma?: string;
  aftertaste?: string;
  // Chemical composition properties
  caffeine?: number; // %
  ash?: number; // %
  lipids?: number; // %
  proteins?: number; // %
}

export interface ProductPricing {
  basePrice: number; // USD per MT
  currency: string;
  unit: string; // MT, KG
  incoterms: string; // FOB, CIF, CFR
  minimumOrder: number; // MT
  priceValidUntil: Date;
  paymentTerms: string; // e.g., "30 days net", "L/C at sight"
  discountTiers?: Array<{
    minQuantity: number;
    discountPercent: number;
  }>;
}

export interface ProductAvailability {
  inStock: boolean;
  stockQuantity: number; // MT
  harvestSeason: string;
  availableFrom: Date;
  availableUntil: Date;
  leadTime: number; // days
  productionCapacity: number; // MT per month
  // Enhanced B2B inventory planning fields
  reservedQuantity?: number; // MT already allocated to pending orders
  availableQuantity?: number; // MT available for new orders (stockQuantity - reservedQuantity)
  reorderLevel?: number; // MT threshold for reordering
  nextHarvestDate?: Date; // Expected date of next harvest
  qualityGradeDistribution?: Array<{
    grade: string;
    percentage: number;
    quantity: number; // MT
  }>;
  warehouseLocations?: Array<{
    location: string;
    quantity: number; // MT
    lastUpdated: Date;
  }>;
  processingStatus?: {
    raw: number; // MT of raw beans
    processing: number; // MT currently being processed
    ready: number; // MT ready for shipment
    lastUpdated: Date;
  };
  forecastData?: {
    expectedDemand: number; // MT for next 3 months
    plannedProduction: number; // MT planned for next harvest
    riskFactors: string[]; // Weather, market conditions, etc.
  };
}

export interface ProductOrigin {
  region: string;
  country: string;
  province: string;
  altitude: number; // meters
  farmSize: string;
  cooperativeName?: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  soilType: string;
  climate: string;
  harvestSeason?: string;
  farmingMethod?: string;
}

export interface ProductImage {
  url: string;
  alt: Record<string, string>; // Multi-language alt text
  isPrimary: boolean;
  caption?: Record<string, string>;
}

export interface ProductDocument {
  type:
    | 'SPECIFICATION'
    | 'CERTIFICATE'
    | 'SAMPLE_REPORT'
    | 'BROCHURE'
    | 'QUALITY_CERTIFICATE'
    | 'BUSINESS_LICENSE'
    | 'OTHER';
  url: string;
  name: Record<string, string>; // Multi-language names
  language: string;
  size?: string; // Human-readable file size (e.g., "2.4 MB")
  description?: Record<string, string>; // Multi-language descriptions
  fileSize?: number;
  downloadCount?: number;
}

export interface CatalogProduct {
  id: string;
  sku: string;
  name: Record<string, string>; // Multi-language names
  description: Record<string, string>; // Multi-language descriptions
  shortDescription: Record<string, string>; // Multi-language short descriptions
  longDescription?: Record<string, string>; // Multi-language long descriptions
  type: CoffeeType;
  grade: CoffeeGrade;
  processingMethod: ProcessingMethod;
  specifications: ProductSpecifications;
  pricing: ProductPricing;
  availability: ProductAvailability;
  certifications: CertificationType[];
  origin: ProductOrigin;
  images: ProductImage[];
  documents: ProductDocument[];
  packagingOptions: PackagingType[];
  packaging?: Record<string, string>; // Multi-language packaging info
  qualityTests?: Record<string, string>; // Multi-language quality test info
  harvestSeason?: string;
  farmingMethod?: string;
  minimumOrder?: number;
  country?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Vietnamese Coffee Product Catalog
export const VIETNAMESE_COFFEE_CATALOG: CatalogProduct[] = [
  // Premium Robusta Products
  {
    id: 'rob-g1-nat-001',
    sku: 'ROB-G1-NAT-001',
    name: {
      en: 'Premium Robusta Grade 1 Natural',
      vi: 'Cà Phê Robusta Loại 1 Chế Biến Khô',
      de: 'Premium Robusta Grad 1 Naturell',
      ja: 'プレミアムロブスタグレード1ナチュラル',
    },
    description: {
      en: 'High-quality natural processed Robusta from Dak Lak province. Full-bodied with chocolate and nutty notes, perfect for espresso blends.',
      vi: 'Cà phê Robusta chất lượng cao chế biến khô từ tỉnh Đắk Lắk. Đậm đà với hương vị chocolate và hạt, hoàn hảo cho pha chế espresso.',
      de: 'Hochwertiger natürlich verarbeiteter Robusta aus der Provinz Dak Lak. Vollmundig mit Schokoladen- und Nussnoten, perfekt für Espresso-Mischungen.',
      ja: 'ダクラク省産の高品質ナチュラル加工ロブスタ。チョコレートとナッツの風味でフルボディ、エスプレッソブレンドに最適。',
    },
    shortDescription: {
      en: 'Premium Grade 1 Robusta with chocolate and nutty notes from Dak Lak province.',
      vi: 'Robusta Loại 1 cao cấp với hương vị chocolate và hạt từ Đắk Lắk.',
      de: 'Premium Grad 1 Robusta mit Schokoladen- und Nussnoten aus Dak Lak.',
      ja: 'ダクラク省産チョコレートとナッツ風味のプレミアムグレード1ロブスタ。',
    },
    type: CoffeeType.ROBUSTA,
    grade: CoffeeGrade.GRADE_1,
    processingMethod: ProcessingMethod.NATURAL,
    specifications: {
      moisture: 12.5,
      defectRate: 0.5,
      screenSize: '18+',
      density: 0.75,
      cuppingScore: 85,
      acidity: 'Low',
      body: 'Full',
      flavor: 'Chocolate, nutty, earthy',
      aroma: 'Rich, roasted',
      aftertaste: 'Long, pleasant',
    },
    pricing: {
      basePrice: 2850,
      currency: 'USD',
      unit: 'MT',
      incoterms: 'FOB Ho Chi Minh Port',
      minimumOrder: 20,
      priceValidUntil: new Date('2024-12-31'),
      paymentTerms: '30 days net',
      discountTiers: [
        { minQuantity: 50, discountPercent: 2 },
        { minQuantity: 100, discountPercent: 4 },
        { minQuantity: 200, discountPercent: 6 },
      ],
    },
    availability: {
      inStock: true,
      stockQuantity: 500,
      harvestSeason: 'October - February',
      availableFrom: new Date('2024-01-01'),
      availableUntil: new Date('2024-12-31'),
      leadTime: 21,
      productionCapacity: 200,
    },
    certifications: [
      CertificationType.RAINFOREST_ALLIANCE,
      CertificationType.UTZ,
    ],
    origin: {
      region: 'Central Highlands',
      country: 'Vietnam',
      province: 'Dak Lak',
      altitude: 650,
      farmSize: 'Estate (500+ hectares)',
      cooperativeName: 'Highland Coffee Cooperative',
      coordinates: { latitude: 12.6667, longitude: 108.05 },
      soilType: 'Basalt',
      climate: 'Tropical monsoon',
    },
    images: [
      {
        url: '/images/products/robusta-grade1-natural-primary.jpg',
        alt: {
          en: 'Premium Robusta Grade 1 Natural Coffee Beans',
          vi: 'Hạt Cà Phê Robusta Loại 1 Chế Biến Khô',
          de: 'Premium Robusta Grad 1 Naturell Kaffeebohnen',
          ja: 'プレミアムロブスタグレード1ナチュラルコーヒー豆',
        },
        isPrimary: true,
      },
      {
        url: '/images/products/robusta-grade1-natural-farm.jpg',
        alt: {
          en: 'Robusta Coffee Farm in Dak Lak Province',
          vi: 'Trang Trại Cà Phê Robusta tại Đắk Lắk',
          de: 'Robusta-Kaffeefarm in der Provinz Dak Lak',
          ja: 'ダクラク省のロブスタコーヒー農園',
        },
        isPrimary: false,
      },
    ],
    documents: [
      {
        type: 'SPECIFICATION',
        url: '/documents/rob-g1-nat-001-spec.pdf',
        name: {
          en: 'Product Specification Sheet',
          vi: 'Bảng Thông Số Kỹ Thuật',
          de: 'Produktspezifikation',
          ja: '製品仕様書',
        },
        language: 'en',
        size: '2.4 MB',
        description: {
          en: 'Comprehensive technical specifications including physical and chemical properties',
          vi: 'Thông số kỹ thuật toàn diện bao gồm tính chất vật lý và hóa học',
          de: 'Umfassende technische Spezifikationen einschließlich physikalischer und chemischer Eigenschaften',
          ja: '物理的および化学的特性を含む包括的な技術仕様',
        },
      },
      {
        type: 'QUALITY_CERTIFICATE',
        url: '/documents/rob-g1-nat-001-coa.pdf',
        name: {
          en: 'Certificate of Analysis (COA)',
          vi: 'Giấy Chứng Nhận Phân Tích',
          de: 'Analysezertifikat (COA)',
          ja: '分析証明書（COA）',
        },
        language: 'en',
        size: '1.8 MB',
        description: {
          en: 'Laboratory analysis results for moisture, defects, screen size, and chemical composition',
          vi: 'Kết quả phân tích phòng thí nghiệm về độ ẩm, khuyết tật, kích thước sàng và thành phần hóa học',
          de: 'Laboranalyseergebnisse für Feuchtigkeit, Defekte, Siebgröße und chemische Zusammensetzung',
          ja: '水分、欠陥、スクリーンサイズ、化学組成の実験室分析結果',
        },
      },
      {
        type: 'QUALITY_CERTIFICATE',
        url: '/documents/rob-g1-nat-001-cert.pdf',
        name: {
          en: 'Rainforest Alliance Certificate',
          vi: 'Chứng Nhận Rainforest Alliance',
          de: 'Rainforest Alliance Zertifikat',
          ja: 'レインフォレスト・アライアンス認証',
        },
        language: 'en',
        size: '1.2 MB',
        description: {
          en: 'Sustainability certification ensuring environmental and social standards',
          vi: 'Chứng nhận bền vững đảm bảo các tiêu chuẩn môi trường và xã hội',
          de: 'Nachhaltigkeitszertifizierung zur Gewährleistung von Umwelt- und Sozialstandards',
          ja: '環境および社会基準を保証する持続可能性認証',
        },
      },
      {
        type: 'QUALITY_CERTIFICATE',
        url: '/documents/rob-g1-nat-001-haccp.pdf',
        name: {
          en: 'HACCP Certificate',
          vi: 'Chứng Nhận HACCP',
          de: 'HACCP-Zertifikat',
          ja: 'HACCP認証',
        },
        language: 'en',
        size: '0.9 MB',
        description: {
          en: 'Food safety management system certification',
          vi: 'Chứng nhận hệ thống quản lý an toàn thực phẩm',
          de: 'Zertifizierung des Lebensmittelsicherheits-Managementsystems',
          ja: '食品安全管理システム認証',
        },
      },
      {
        type: 'BUSINESS_LICENSE',
        url: '/documents/rob-g1-nat-001-phytosanitary.pdf',
        name: {
          en: 'Phytosanitary Certificate',
          vi: 'Giấy Chứng Nhận Kiểm Dịch Thực Vật',
          de: 'Pflanzengesundheitszeugnis',
          ja: '植物検疫証明書',
        },
        language: 'en',
        size: '0.7 MB',
        description: {
          en: 'Official certificate confirming product meets plant health requirements',
          vi: 'Giấy chứng nhận chính thức xác nhận sản phẩm đáp ứng yêu cầu sức khỏe thực vật',
          de: 'Offizielles Zertifikat zur Bestätigung der Einhaltung der Pflanzengesundheitsanforderungen',
          ja: '製品が植物衛生要件を満たしていることを確認する公式証明書',
        },
      },
      {
        type: 'OTHER',
        url: '/documents/rob-g1-nat-001-origin.pdf',
        name: {
          en: 'Certificate of Origin',
          vi: 'Giấy Chứng Nhận Xuất Xứ',
          de: 'Ursprungszeugnis',
          ja: '原産地証明書',
        },
        language: 'en',
        size: '0.5 MB',
        description: {
          en: 'Official document certifying the country of origin for trade purposes',
          vi: 'Tài liệu chính thức chứng nhận quốc gia xuất xứ cho mục đích thương mại',
          de: 'Offizielles Dokument zur Bescheinigung des Ursprungslandes für Handelszwecke',
          ja: '貿易目的での原産国を証明する公式文書',
        },
      },
      {
        type: 'OTHER',
        url: '/documents/rob-g1-nat-001-cupping.pdf',
        name: {
          en: 'Cupping Report',
          vi: 'Báo Cáo Cupping',
          de: 'Cupping-Bericht',
          ja: 'カッピングレポート',
        },
        language: 'en',
        size: '1.1 MB',
        description: {
          en: 'Professional sensory evaluation and tasting notes from certified Q-graders',
          vi: 'Đánh giá cảm quan chuyên nghiệp và ghi chú nếm thử từ các Q-grader được chứng nhận',
          de: 'Professionelle sensorische Bewertung und Verkostungsnotizen von zertifizierten Q-Gradern',
          ja: '認定Qグレーダーによる専門的な官能評価とテイスティングノート',
        },
      },
    ],
    packagingOptions: [
      PackagingType.JUTE_BAGS_60KG,
      PackagingType.JUTE_BAGS_69KG,
      PackagingType.GRAINPRO_BAGS,
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'system',
    updatedBy: 'admin',
  },

  // Washed Robusta Grade 1
  {
    id: 'rob-g1-wash-002',
    sku: 'ROB-G1-WASH-002',
    name: {
      en: 'Premium Robusta Grade 1 Washed',
      vi: 'Cà Phê Robusta Loại 1 Chế Biến Ướt',
      de: 'Premium Robusta Grad 1 Gewaschen',
      ja: 'プレミアムロブスタグレード1ウォッシュド',
    },
    description: {
      en: 'Clean, bright Robusta with washed processing from Gia Lai province. Excellent for instant coffee production and premium blends.',
      vi: 'Cà phê Robusta sạch, tươi sáng chế biến ướt từ tỉnh Gia Lai. Tuyệt vời cho sản xuất cà phê hòa tan và pha chế cao cấp.',
      de: 'Sauberer, heller Robusta mit gewaschener Verarbeitung aus der Provinz Gia Lai. Ausgezeichnet für Instantkaffee-Produktion und Premium-Mischungen.',
      ja: 'ザーライ省産のクリーンで明るいウォッシュド加工ロブスタ。インスタントコーヒー製造とプレミアムブレンドに最適。',
    },
    shortDescription: {
      en: 'Clean, bright Grade 1 Washed Robusta from Gia Lai province.',
      vi: 'Robusta Loại 1 chế biến ướt sạch, tươi sáng từ Gia Lai.',
      de: 'Sauberer, heller Grad 1 Gewaschener Robusta aus Gia Lai.',
      ja: 'ザーライ省産クリーンで明るいグレード1ウォッシュドロブスタ。',
    },
    type: CoffeeType.ROBUSTA,
    grade: CoffeeGrade.GRADE_1,
    processingMethod: ProcessingMethod.WASHED,
    specifications: {
      moisture: 12.0,
      defectRate: 0.3,
      screenSize: '18+',
      density: 0.76,
      cuppingScore: 87,
      acidity: 'Medium-Low',
      body: 'Medium-Full',
      flavor: 'Clean, mild chocolate, slight citrus',
      aroma: 'Fresh, clean',
      aftertaste: 'Clean, short',
    },
    pricing: {
      basePrice: 2950,
      currency: 'USD',
      unit: 'MT',
      incoterms: 'FOB Ho Chi Minh Port',
      minimumOrder: 20,
      priceValidUntil: new Date('2024-12-31'),
      paymentTerms: 'L/C at sight',
      discountTiers: [
        { minQuantity: 50, discountPercent: 2 },
        { minQuantity: 100, discountPercent: 4 },
        { minQuantity: 200, discountPercent: 6 },
      ],
    },
    availability: {
      inStock: true,
      stockQuantity: 300,
      harvestSeason: 'October - February',
      availableFrom: new Date('2024-01-01'),
      availableUntil: new Date('2024-12-31'),
      leadTime: 21,
      productionCapacity: 150,
    },
    certifications: [CertificationType.ORGANIC, CertificationType.FAIR_TRADE],
    origin: {
      region: 'Central Highlands',
      country: 'Vietnam',
      province: 'Gia Lai',
      altitude: 750,
      farmSize: 'Cooperative (200+ farmers)',
      cooperativeName: 'Gia Lai Coffee Farmers Cooperative',
      coordinates: { latitude: 13.9833, longitude: 108.0 },
      soilType: 'Red basalt',
      climate: 'Tropical highland',
    },
    images: [
      {
        url: '/images/products/robusta-grade1-washed-primary.jpg',
        alt: {
          en: 'Premium Robusta Grade 1 Washed Coffee Beans',
          vi: 'Hạt Cà Phê Robusta Loại 1 Chế Biến Ướt',
          de: 'Premium Robusta Grad 1 Gewaschene Kaffeebohnen',
          ja: 'プレミアムロブスタグレード1ウォッシュドコーヒー豆',
        },
        isPrimary: true,
      },
    ],
    documents: [
      {
        type: 'SPECIFICATION',
        url: '/documents/rob-g1-wash-002-spec.pdf',
        name: {
          en: 'Product Specification Sheet',
          vi: 'Bảng Thông Số Kỹ Thuật',
          de: 'Produktspezifikation',
          ja: '製品仕様書',
        },
        language: 'en',
      },
    ],
    packagingOptions: [
      PackagingType.JUTE_BAGS_60KG,
      PackagingType.GRAINPRO_BAGS,
      PackagingType.VACUUM_PACKED,
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 2,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'system',
    updatedBy: 'admin',
  },

  // Highland Arabica
  {
    id: 'ara-spec-001',
    sku: 'ARA-SPEC-001',
    name: {
      en: 'Highland Arabica Specialty',
      vi: 'Cà Phê Arabica Cao Nguyên Đặc Biệt',
      de: 'Highland Arabica Spezialität',
      ja: 'ハイランドアラビカスペシャルティ',
    },
    description: {
      en: 'Exceptional Arabica from high-altitude farms in Da Lat. Complex flavor profile with floral notes and bright acidity.',
      vi: 'Cà phê Arabica đặc biệt từ các trang trại cao nguyên ở Đà Lạt. Hương vị phức tạp với note hoa và độ chua tươi sáng.',
      de: 'Außergewöhnlicher Arabica von Hochland-Farmen in Da Lat. Komplexes Geschmacksprofil mit floralen Noten und heller Säure.',
      ja: 'ダラット高地農園の特別なアラビカ。フローラルノートと明るい酸味の複雑な風味プロファイル。',
    },
    shortDescription: {
      en: 'Exceptional high-altitude Arabica specialty from Da Lat.',
      vi: 'Arabica đặc biệt cao nguyên đặc biệt từ Đà Lạt.',
      de: 'Außergewöhnlicher Hochland-Arabica-Spezialität aus Da Lat.',
      ja: 'ダラット産特別な高地アラビカスペシャルティ。',
    },
    type: CoffeeType.ARABICA,
    grade: CoffeeGrade.SPECIALTY,
    processingMethod: ProcessingMethod.WASHED,
    specifications: {
      moisture: 11.5,
      defectRate: 0.2,
      screenSize: '16+',
      density: 0.72,
      cuppingScore: 92,
      acidity: 'Bright',
      body: 'Medium',
      flavor: 'Floral, citrus, honey, chocolate',
      aroma: 'Floral, fruity',
      aftertaste: 'Long, sweet',
    },
    pricing: {
      basePrice: 8500,
      currency: 'USD',
      unit: 'MT',
      incoterms: 'FOB Ho Chi Minh Port',
      minimumOrder: 5,
      priceValidUntil: new Date('2024-12-31'),
      paymentTerms: 'T/T 50% advance, 50% on shipment',
      discountTiers: [
        { minQuantity: 10, discountPercent: 2 },
        { minQuantity: 20, discountPercent: 4 },
      ],
    },
    availability: {
      inStock: true,
      stockQuantity: 50,
      harvestSeason: 'November - March',
      availableFrom: new Date('2024-01-01'),
      availableUntil: new Date('2024-08-31'),
      leadTime: 14,
      productionCapacity: 20,
      // Enhanced B2B inventory planning data
      reservedQuantity: 12,
      availableQuantity: 38, // 50 - 12
      reorderLevel: 15,
      nextHarvestDate: new Date('2024-11-15'),
      qualityGradeDistribution: [
        { grade: 'Grade 1', percentage: 65, quantity: 32.5 },
        { grade: 'Grade 2', percentage: 30, quantity: 15 },
        { grade: 'Grade 3', percentage: 5, quantity: 2.5 },
      ],
      warehouseLocations: [
        {
          location: 'Ho Chi Minh City Port',
          quantity: 30,
          lastUpdated: new Date('2024-01-15T08:00:00Z'),
        },
        {
          location: 'Da Lat Processing Center',
          quantity: 15,
          lastUpdated: new Date('2024-01-15T08:00:00Z'),
        },
        {
          location: 'Hanoi Distribution Hub',
          quantity: 5,
          lastUpdated: new Date('2024-01-15T08:00:00Z'),
        },
      ],
      processingStatus: {
        raw: 8,
        processing: 7,
        ready: 35,
        lastUpdated: new Date('2024-01-15T10:30:00Z'),
      },
      forecastData: {
        expectedDemand: 75,
        plannedProduction: 80,
        riskFactors: [
          'Weather variability in highland regions',
          'Seasonal labor availability',
          'Global market price fluctuations',
        ],
      },
    },
    certifications: [
      CertificationType.ORGANIC,
      CertificationType.RAINFOREST_ALLIANCE,
      CertificationType.BIRD_FRIENDLY,
    ],
    origin: {
      region: 'Southern Highlands',
      country: 'Vietnam',
      province: 'Lam Dong',
      altitude: 1500,
      farmSize: 'Small farms (2-5 hectares)',
      cooperativeName: 'Da Lat Specialty Coffee Cooperative',
      coordinates: { latitude: 11.9404, longitude: 108.4583 },
      soilType: 'Volcanic',
      climate: 'Temperate highland',
    },
    images: [
      {
        url: '/images/products/arabica-highland-specialty-primary.jpg',
        alt: {
          en: 'Highland Arabica Specialty Coffee Beans',
          vi: 'Hạt Cà Phê Arabica Cao Nguyên Đặc Biệt',
          de: 'Highland Arabica Spezialitäts-Kaffeebohnen',
          ja: 'ハイランドアラビカスペシャルティコーヒー豆',
        },
        isPrimary: true,
      },
    ],
    documents: [
      {
        type: 'SPECIFICATION',
        url: '/documents/ara-spec-001-spec.pdf',
        name: {
          en: 'Product Specification Sheet',
          vi: 'Bảng Thông Số Kỹ Thuật',
          de: 'Produktspezifikation',
          ja: '製品仕様書',
        },
        language: 'en',
        size: '1.8 MB',
        description: {
          en: 'Comprehensive technical specifications including physical properties, chemical analysis, and quality parameters',
          vi: 'Thông số kỹ thuật toàn diện bao gồm tính chất vật lý, phân tích hóa học và thông số chất lượng',
          de: 'Umfassende technische Spezifikationen einschließlich physikalischer Eigenschaften, chemischer Analyse und Qualitätsparameter',
          ja: '物理的特性、化学分析、品質パラメータを含む包括的な技術仕様',
        },
      },
      {
        type: 'SAMPLE_REPORT',
        url: '/documents/ara-spec-001-cupping.pdf',
        name: {
          en: 'Cupping Report',
          vi: 'Báo Cáo Nếm Thử',
          de: 'Verkostungsbericht',
          ja: 'カッピングレポート',
        },
        language: 'en',
        size: '2.1 MB',
        description: {
          en: 'Professional cupping evaluation with detailed flavor profile, aroma notes, and quality scoring',
          vi: 'Đánh giá nếm thử chuyên nghiệp với hồ sơ hương vị chi tiết, ghi chú mùi thơm và chấm điểm chất lượng',
          de: 'Professionelle Verkostungsbewertung mit detailliertem Geschmacksprofil, Aromanotizen und Qualitätsbewertung',
          ja: '詳細な風味プロファイル、アロマノート、品質スコアリングを含む専門的なカッピング評価',
        },
      },
      {
        type: 'OTHER',
        url: '/documents/ara-spec-001-coa.pdf',
        name: {
          en: 'Certificate of Analysis (COA)',
          vi: 'Giấy Chứng Nhận Phân Tích',
          de: 'Analysezertifikat',
          ja: '分析証明書',
        },
        language: 'en',
        size: '1.2 MB',
        description: {
          en: 'Laboratory analysis results including moisture content, defect analysis, and microbiological testing',
          vi: 'Kết quả phân tích phòng thí nghiệm bao gồm hàm lượng ẩm, phân tích khuyết tật và kiểm tra vi sinh',
          de: 'Laboranalyseergebnisse einschließlich Feuchtigkeitsgehalt, Defektanalyse und mikrobiologische Prüfung',
          ja: '水分含有量、欠陥分析、微生物検査を含む実験室分析結果',
        },
      },
      {
        type: 'QUALITY_CERTIFICATE',
        url: '/documents/ara-spec-001-quality-cert.pdf',
        name: {
          en: 'Quality Assurance Certificate',
          vi: 'Giấy Chứng Nhận Đảm Bảo Chất Lượng',
          de: 'Qualitätssicherungszertifikat',
          ja: '品質保証証明書',
        },
        language: 'en',
        size: '0.8 MB',
        description: {
          en: 'Third-party quality certification confirming compliance with international coffee standards',
          vi: 'Chứng nhận chất lượng bên thứ ba xác nhận tuân thủ các tiêu chuẩn cà phê quốc tế',
          de: 'Qualitätszertifizierung durch Dritte zur Bestätigung der Einhaltung internationaler Kaffeestandards',
          ja: '国際コーヒー基準への準拠を確認する第三者品質認証',
        },
      },
      {
        type: 'BROCHURE',
        url: '/documents/ara-spec-001-origin-story.pdf',
        name: {
          en: 'Origin Story & Farm Profile',
          vi: 'Câu Chuyện Nguồn Gốc & Hồ Sơ Trang Trại',
          de: 'Ursprungsgeschichte & Farmprofil',
          ja: 'オリジンストーリー＆農園プロファイル',
        },
        language: 'en',
        size: '3.2 MB',
        description: {
          en: 'Detailed information about the highland farms, cultivation practices, and sustainability initiatives',
          vi: 'Thông tin chi tiết về các trang trại cao nguyên, thực hành canh tác và sáng kiến bền vững',
          de: 'Detaillierte Informationen über die Hochlandfarmen, Anbaumethoden und Nachhaltigkeitsinitiativen',
          ja: '高地農園、栽培方法、持続可能性への取り組みに関する詳細情報',
        },
      },
    ],
    packagingOptions: [
      PackagingType.GRAINPRO_BAGS,
      PackagingType.VACUUM_PACKED,
      PackagingType.SMALL_BAGS_5KG,
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'system',
    updatedBy: 'admin',
  },

  // Premium Instant Coffee
  {
    id: 'inst-prem-001',
    sku: 'INST-PREM-001',
    name: {
      en: 'Premium Instant Coffee',
      vi: 'Cà Phê Hòa Tan Cao Cấp',
      de: 'Premium Instantkaffee',
      ja: 'プレミアムインスタントコーヒー',
    },
    description: {
      en: 'High-quality spray-dried instant coffee made from premium Vietnamese Robusta. Rich flavor and excellent solubility.',
      vi: 'Cà phê hòa tan sấy phun chất lượng cao từ Robusta Việt Nam cao cấp. Hương vị đậm đà và độ tan tuyệt vời.',
      de: 'Hochwertiger sprühgetrockneter Instantkaffee aus Premium-vietnamesischem Robusta. Reicher Geschmack und ausgezeichnete Löslichkeit.',
      ja: 'プレミアムベトナムロブスタから作られた高品質スプレードライインスタントコーヒー。豊かな風味と優れた溶解性。',
    },
    shortDescription: {
      en: 'High-quality spray-dried instant coffee from premium Vietnamese Robusta.',
      vi: 'Cà phê hòa tan sấy phun chất lượng cao từ Robusta Việt Nam.',
      de: 'Hochwertiger sprühgetrockneter Instantkaffee aus vietnamesischem Robusta.',
      ja: 'プレミアムベトナムロブスタの高品質スプレードライインスタントコーヒー。',
    },
    type: CoffeeType.INSTANT,
    grade: CoffeeGrade.PREMIUM,
    processingMethod: ProcessingMethod.NATURAL,
    specifications: {
      moisture: 3.5,
      defectRate: 0.1,
      screenSize: 'N/A',
      density: 0.35,
      acidity: 'Low',
      body: 'Full',
      flavor: 'Rich, chocolate, caramel',
      aroma: 'Intense coffee',
      aftertaste: 'Long, pleasant',
    },
    pricing: {
      basePrice: 12500,
      currency: 'USD',
      unit: 'MT',
      incoterms: 'FOB Ho Chi Minh Port',
      minimumOrder: 1,
      priceValidUntil: new Date('2024-12-31'),
      paymentTerms: 'L/C 90 days',
      discountTiers: [
        { minQuantity: 5, discountPercent: 3 },
        { minQuantity: 10, discountPercent: 5 },
        { minQuantity: 20, discountPercent: 8 },
      ],
    },
    availability: {
      inStock: true,
      stockQuantity: 100,
      harvestSeason: 'Year-round production',
      availableFrom: new Date('2024-01-01'),
      availableUntil: new Date('2024-12-31'),
      leadTime: 30,
      productionCapacity: 50,
    },
    certifications: [CertificationType.ORGANIC],
    origin: {
      region: 'Manufacturing Facility',
      country: 'Vietnam',
      province: 'Ho Chi Minh City',
      altitude: 10,
      farmSize: 'Industrial facility',
      coordinates: { latitude: 10.8231, longitude: 106.6297 },
      soilType: 'N/A',
      climate: 'N/A',
    },
    images: [
      {
        url: '/images/products/instant-coffee-premium-primary.jpg',
        alt: {
          en: 'Premium Instant Coffee Powder',
          vi: 'Bột Cà Phê Hòa Tan Cao Cấp',
          de: 'Premium Instantkaffee-Pulver',
          ja: 'プレミアムインスタントコーヒーパウダー',
        },
        isPrimary: true,
      },
    ],
    documents: [
      {
        type: 'SPECIFICATION',
        url: '/documents/inst-prem-001-spec.pdf',
        name: {
          en: 'Product Specification Sheet',
          vi: 'Bảng Thông Số Kỹ Thuật',
          de: 'Produktspezifikation',
          ja: '製品仕様書',
        },
        language: 'en',
      },
    ],
    packagingOptions: [
      PackagingType.SMALL_BAGS_1KG,
      PackagingType.SMALL_BAGS_5KG,
      PackagingType.VACUUM_PACKED,
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'system',
    updatedBy: 'admin',
  },

  // Robusta Grade 2
  {
    id: 'rob-g2-nat-003',
    sku: 'ROB-G2-NAT-003',
    name: {
      en: 'Commercial Robusta Grade 2 Natural',
      vi: 'Cà Phê Robusta Loại 2 Thương Mại Chế Biến Khô',
      de: 'Kommerzieller Robusta Grad 2 Naturell',
      ja: 'コマーシャルロブスタグレード2ナチュラル',
    },
    description: {
      en: 'Cost-effective Robusta Grade 2 for commercial applications. Consistent quality with good cup characteristics.',
      vi: 'Cà phê Robusta Loại 2 hiệu quả về chi phí cho ứng dụng thương mại. Chất lượng ổn định với đặc tính tách tốt.',
      de: 'Kosteneffektiver Robusta Grad 2 für kommerzielle Anwendungen. Gleichbleibende Qualität mit guten Tasseneigenschaften.',
      ja: '商業用途向けのコスト効率の良いロブスタグレード2。良好なカップ特性を持つ一貫した品質。',
    },
    shortDescription: {
      en: 'Cost-effective Robusta Grade 2 for commercial applications.',
      vi: 'Robusta Loại 2 hiệu quả chi phí cho ứng dụng thương mại.',
      de: 'Kosteneffektiver Robusta Grad 2 für kommerzielle Anwendungen.',
      ja: '商業用途向けのコスト効率の良いロブスタグレード2。',
    },
    type: CoffeeType.ROBUSTA,
    grade: CoffeeGrade.GRADE_2,
    processingMethod: ProcessingMethod.NATURAL,
    specifications: {
      moisture: 13.0,
      defectRate: 1.5,
      screenSize: '16+',
      density: 0.73,
      cuppingScore: 80,
      acidity: 'Low',
      body: 'Medium-Full',
      flavor: 'Earthy, woody, mild chocolate',
      aroma: 'Earthy',
      aftertaste: 'Short',
    },
    pricing: {
      basePrice: 2350,
      currency: 'USD',
      unit: 'MT',
      incoterms: 'FOB Ho Chi Minh Port',
      minimumOrder: 50,
      priceValidUntil: new Date('2024-12-31'),
      paymentTerms: '60 days net',
      discountTiers: [
        { minQuantity: 100, discountPercent: 2 },
        { minQuantity: 200, discountPercent: 4 },
        { minQuantity: 500, discountPercent: 6 },
      ],
    },
    availability: {
      inStock: true,
      stockQuantity: 1000,
      harvestSeason: 'October - February',
      availableFrom: new Date('2024-01-01'),
      availableUntil: new Date('2024-12-31'),
      leadTime: 21,
      productionCapacity: 500,
    },
    certifications: [],
    origin: {
      region: 'Central Highlands',
      country: 'Vietnam',
      province: 'Dak Nong',
      altitude: 500,
      farmSize: 'Mixed farms',
      coordinates: { latitude: 12.2646, longitude: 107.6098 },
      soilType: 'Red soil',
      climate: 'Tropical',
    },
    images: [
      {
        url: '/images/products/robusta-grade2-natural-primary.jpg',
        alt: {
          en: 'Commercial Robusta Grade 2 Natural Coffee Beans',
          vi: 'Hạt Cà Phê Robusta Loại 2 Thương Mại Chế Biến Khô',
          de: 'Kommerzielle Robusta Grad 2 Naturelle Kaffeebohnen',
          ja: 'コマーシャルロブスタグレード2ナチュラルコーヒー豆',
        },
        isPrimary: true,
      },
    ],
    documents: [
      {
        type: 'SPECIFICATION',
        url: '/documents/rob-g2-nat-003-spec.pdf',
        name: {
          en: 'Product Specification Sheet',
          vi: 'Bảng Thông Số Kỹ Thuật',
          de: 'Produktspezifikation',
          ja: '製品仕様書',
        },
        language: 'en',
      },
    ],
    packagingOptions: [
      PackagingType.JUTE_BAGS_60KG,
      PackagingType.JUTE_BAGS_69KG,
      PackagingType.BULK_CONTAINER,
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 5,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'system',
    updatedBy: 'admin',
  },
];

// Helper functions for product catalog
export const getProductsByType = (type: CoffeeType): CatalogProduct[] => {
  return VIETNAMESE_COFFEE_CATALOG.filter(product => product.type === type);
};

export const getProductsByGrade = (grade: CoffeeGrade): CatalogProduct[] => {
  return VIETNAMESE_COFFEE_CATALOG.filter(product => product.grade === grade);
};

export const getFeaturedProducts = (): CatalogProduct[] => {
  return VIETNAMESE_COFFEE_CATALOG.filter(product => product.isFeatured);
};

export const getActiveProducts = (): CatalogProduct[] => {
  return VIETNAMESE_COFFEE_CATALOG.filter(product => product.isActive);
};

export const getProductById = (id: string): CatalogProduct | undefined => {
  return VIETNAMESE_COFFEE_CATALOG.find(product => product.id === id);
};

export const getProductBySku = (sku: string): CatalogProduct | undefined => {
  return VIETNAMESE_COFFEE_CATALOG.find(product => product.sku === sku);
};

export const searchProducts = (
  query: string,
  locale = 'en'
): CatalogProduct[] => {
  const lowercaseQuery = query.toLowerCase();
  return VIETNAMESE_COFFEE_CATALOG.filter(product => {
    const name = product.name[locale]?.toLowerCase() || '';
    const description = product.description[locale]?.toLowerCase() || '';
    const sku = product.sku.toLowerCase();

    return (
      name.includes(lowercaseQuery) ||
      description.includes(lowercaseQuery) ||
      sku.includes(lowercaseQuery)
    );
  });
};

// Product filtering utilities
export interface ProductFilters {
  type?: CoffeeType[];
  grade?: CoffeeGrade[];
  processingMethod?: ProcessingMethod[];
  certifications?: CertificationType[];
  priceRange?: { min: number; max: number };
  inStock?: boolean;
  featured?: boolean;
}

export const filterProducts = (filters: ProductFilters): CatalogProduct[] => {
  return VIETNAMESE_COFFEE_CATALOG.filter(product => {
    if (filters.type && !filters.type.includes(product.type)) return false;
    if (filters.grade && !filters.grade.includes(product.grade)) return false;
    if (
      filters.processingMethod &&
      !filters.processingMethod.includes(product.processingMethod)
    )
      return false;
    if (
      filters.certifications &&
      !filters.certifications.some(cert =>
        product.certifications.includes(cert)
      )
    )
      return false;
    if (filters.priceRange) {
      const price = product.pricing.basePrice;
      if (price < filters.priceRange.min || price > filters.priceRange.max)
        return false;
    }
    if (
      filters.inStock !== undefined &&
      product.availability.inStock !== filters.inStock
    )
      return false;
    if (
      filters.featured !== undefined &&
      product.isFeatured !== filters.featured
    )
      return false;

    return true;
  });
};

// Export product catalog metadata
export const PRODUCT_CATALOG_METADATA = {
  totalProducts: VIETNAMESE_COFFEE_CATALOG.length,
  productTypes: Object.values(CoffeeType),
  productGrades: Object.values(CoffeeGrade),
  processingMethods: Object.values(ProcessingMethod),
  packagingTypes: Object.values(PackagingType),
  certificationTypes: Object.values(CertificationType),
  supportedLocales: ['en', 'vi', 'de', 'ja'],
  lastUpdated: new Date('2024-01-15'),
};
