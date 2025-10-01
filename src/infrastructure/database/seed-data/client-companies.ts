import type {
  CompanyType,
  CompanySize,
  BusinessModel,
  RiskLevel,
} from '../../../domain/entities/client-company.entity';

export interface SeedClientCompany {
  id: string;
  companyCode: string;
  legalName: string;
  tradingName?: string;
  type: CompanyType;
  size: CompanySize;
  businessModel: BusinessModel;
  industry: string;
  description: string;
  website?: string;
  email: string;
  phone: string;
  addresses: Array<{
    type: 'HEADQUARTERS' | 'BILLING' | 'SHIPPING' | 'WAREHOUSE';
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
    isPrimary: boolean;
  }>;
  contacts: Array<{
    name: string;
    title: string;
    email: string;
    phone?: string;
    department: string;
    isPrimary: boolean;
    languages: string[];
  }>;
  businessProfile: {
    yearEstablished: number;
    employeeCount: number;
    annualRevenue?: number;
    currency: string;
    marketFocus: string[];
    specializations: string[];
    certifications: string[];
    tradingExperience: string;
  };
  financialInfo: {
    creditRating?: string;
    paymentTermsPreference: string;
    creditLimit?: number;
    currency: string;
    bankReferences?: string[];
    insuranceInfo?: string;
  };
  tradingHistory: {
    firstOrderDate?: string;
    totalOrdersCount: number;
    totalOrderValue: number;
    currency: string;
    averageOrderSize: number;
    lastOrderDate?: string;
    preferredProducts: string[];
    seasonalPatterns?: string;
  };
  preferences: {
    communicationLanguage: string;
    contactMethod: string;
    timezone: string;
    orderFrequency: string;
    qualityRequirements: string[];
    certificationRequirements: string[];
    packagingPreferences: string[];
  };
  riskAssessment: {
    riskLevel: RiskLevel;
    factors: string[];
    lastAssessmentDate: string;
    notes?: string;
  };
  tags: string[];
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export const clientCompaniesData: SeedClientCompany[] = [
  {
    id: 'client-german-roaster',
    companyCode: 'GER-ROAST-001',
    legalName: 'Schwarzwald Kaffeerösterei GmbH',
    tradingName: 'Black Forest Coffee Roasters',
    type: 'ROASTER',
    size: 'MEDIUM',
    businessModel: 'B2B',
    industry: 'Coffee Roasting and Distribution',
    description:
      'Premium coffee roaster specializing in specialty and organic coffees for the German and European markets. Known for their commitment to sustainability and direct trade relationships with coffee producers.',
    website: 'https://www.schwarzwald-kaffee.de',
    email: 'procurement@schwarzwald-kaffee.de',
    phone: '+49 7661 123456',
    addresses: [
      {
        type: 'HEADQUARTERS',
        street: 'Rösterei Straße 15',
        city: 'Freiburg',
        state: 'Baden-Württemberg',
        postalCode: '79098',
        country: 'Germany',
        isPrimary: true,
      },
      {
        type: 'WAREHOUSE',
        street: 'Industriegebiet Nord 42',
        city: 'Freiburg',
        state: 'Baden-Württemberg',
        postalCode: '79110',
        country: 'Germany',
        isPrimary: false,
      },
    ],
    contacts: [
      {
        name: 'Klaus Müller',
        title: 'Head of Procurement',
        email: 'k.mueller@schwarzwald-kaffee.de',
        phone: '+49 7661 123457',
        department: 'Procurement',
        isPrimary: true,
        languages: ['de', 'en', 'fr'],
      },
      {
        name: 'Anna Schmidt',
        title: 'Quality Manager',
        email: 'a.schmidt@schwarzwald-kaffee.de',
        phone: '+49 7661 123458',
        department: 'Quality Control',
        isPrimary: false,
        languages: ['de', 'en'],
      },
    ],
    businessProfile: {
      yearEstablished: 1987,
      employeeCount: 45,
      annualRevenue: 12000000,
      currency: 'EUR',
      marketFocus: ['Germany', 'Austria', 'Switzerland', 'Netherlands'],
      specializations: [
        'Organic coffee roasting',
        'Specialty coffee blends',
        'Direct trade sourcing',
        'Sustainable packaging',
      ],
      certifications: [
        'EU Organic',
        'Fair Trade',
        'Rainforest Alliance',
        'ISO 14001',
      ],
      tradingExperience:
        'Over 35 years in coffee roasting and trading, with established relationships across Europe and direct partnerships with coffee producers in Central and South America, Africa, and Asia.',
    },
    financialInfo: {
      creditRating: 'A+',
      paymentTermsPreference: 'LC at sight',
      creditLimit: 500000,
      currency: 'EUR',
      bankReferences: [
        'Deutsche Bank AG, Freiburg',
        'Sparkasse Freiburg-Nördlicher Breisgau',
      ],
      insuranceInfo:
        'Comprehensive trade credit insurance through Euler Hermes',
    },
    tradingHistory: {
      firstOrderDate: '2019-03-15',
      totalOrdersCount: 24,
      totalOrderValue: 2400000,
      currency: 'USD',
      averageOrderSize: 100000,
      lastOrderDate: '2024-01-15',
      preferredProducts: [
        'Premium Robusta Grade 1',
        'Organic Arabica',
        'Specialty single origins',
      ],
      seasonalPatterns:
        'Higher volumes in Q3-Q4 for holiday season preparation',
    },
    preferences: {
      communicationLanguage: 'de',
      contactMethod: 'email',
      timezone: 'Europe/Berlin',
      orderFrequency: 'Monthly',
      qualityRequirements: [
        'Organic certification mandatory',
        'Cupping score 80+ points',
        'Moisture content max 12%',
        'Defect count max 5%',
      ],
      certificationRequirements: [
        'EU Organic',
        'Fair Trade',
        'Rainforest Alliance',
      ],
      packagingPreferences: [
        '60kg jute bags with inner liner',
        'GrainPro bags for specialty lots',
        'Proper labeling in German and English',
      ],
    },
    riskAssessment: {
      riskLevel: 'LOW',
      factors: [
        'Excellent payment history',
        'Strong financial position',
        'Long-term business relationship',
        'Stable market demand',
      ],
      lastAssessmentDate: '2024-01-01',
      notes:
        'Highly reliable client with consistent ordering patterns and excellent payment record',
    },
    tags: ['premium', 'organic', 'european-market', 'established', 'reliable'],
    isActive: true,
    createdBy: 'admin-001',
    updatedBy: 'sales-manager-001',
  },
  {
    id: 'client-us-retailer',
    companyCode: 'USA-RETAIL-001',
    legalName: 'Mountain Peak Coffee Company LLC',
    tradingName: 'Mountain Peak Coffee',
    type: 'RETAILER',
    size: 'LARGE',
    businessModel: 'B2C',
    industry: 'Coffee Retail and E-commerce',
    description:
      'Leading coffee retailer with 150+ stores across the Western United States and a growing e-commerce presence. Focuses on providing high-quality coffee at accessible prices with a strong emphasis on customer education and experience.',
    website: 'https://www.mountainpeakcoffee.com',
    email: 'sourcing@mountainpeakcoffee.com',
    phone: '+1 503 555 0123',
    addresses: [
      {
        type: 'HEADQUARTERS',
        street: '1234 Coffee Avenue',
        city: 'Portland',
        state: 'Oregon',
        postalCode: '97201',
        country: 'United States',
        isPrimary: true,
      },
      {
        type: 'WAREHOUSE',
        street: '5678 Distribution Drive',
        city: 'Los Angeles',
        state: 'California',
        postalCode: '90021',
        country: 'United States',
        isPrimary: false,
      },
    ],
    contacts: [
      {
        name: 'Sarah Johnson',
        title: 'Director of Sourcing',
        email: 's.johnson@mountainpeakcoffee.com',
        phone: '+1 503 555 0124',
        department: 'Sourcing',
        isPrimary: true,
        languages: ['en', 'es'],
      },
      {
        name: 'Michael Chen',
        title: 'Private Label Manager',
        email: 'm.chen@mountainpeakcoffee.com',
        phone: '+1 503 555 0125',
        department: 'Product Development',
        isPrimary: false,
        languages: ['en', 'zh'],
      },
    ],
    businessProfile: {
      yearEstablished: 2008,
      employeeCount: 850,
      annualRevenue: 85000000,
      currency: 'USD',
      marketFocus: ['United States', 'Canada'],
      specializations: [
        'Private label coffee products',
        'Multi-channel retail distribution',
        'Customer education programs',
        'Sustainable sourcing initiatives',
      ],
      certifications: [
        'SQF (Safe Quality Food)',
        'Fair Trade USA',
        'USDA Organic',
        'B Corporation',
      ],
      tradingExperience:
        'Over 15 years in coffee retail with extensive experience in private label development, supply chain management, and multi-channel distribution across physical stores and e-commerce platforms.',
    },
    financialInfo: {
      creditRating: 'A',
      paymentTermsPreference: 'Net 30 days',
      creditLimit: 2000000,
      currency: 'USD',
      bankReferences: [
        'Wells Fargo Bank, Portland',
        'Bank of America, Los Angeles',
      ],
      insuranceInfo: 'Trade credit insurance through AIG',
    },
    tradingHistory: {
      totalOrdersCount: 0,
      totalOrderValue: 0,
      currency: 'USD',
      averageOrderSize: 0,
      preferredProducts: [
        'Commercial grade coffee for value products',
        'Premium coffee for specialty lines',
        'Organic and Fair Trade certified',
      ],
    },
    preferences: {
      communicationLanguage: 'en',
      contactMethod: 'video_call',
      timezone: 'America/Los_Angeles',
      orderFrequency: 'Quarterly',
      qualityRequirements: [
        'Consistent flavor profiles',
        'FDA compliance',
        'Shelf-life minimum 18 months',
        'Good extraction characteristics',
      ],
      certificationRequirements: [
        'USDA Organic for organic lines',
        'Fair Trade USA',
        'SQF manufacturing standards',
      ],
      packagingPreferences: [
        'Various retail formats',
        'Private label packaging',
        'Sustainable packaging materials',
      ],
    },
    riskAssessment: {
      riskLevel: 'MEDIUM',
      factors: [
        'New client relationship',
        'Large order volumes',
        'Strong financial position',
        'Established business model',
      ],
      lastAssessmentDate: '2024-01-15',
      notes:
        'New client with strong credentials and growth potential, requires careful monitoring of initial orders',
    },
    tags: [
      'retail',
      'private-label',
      'large-volume',
      'us-market',
      'new-client',
    ],
    isActive: true,
    createdBy: 'admin-001',
    updatedBy: 'sales-manager-002',
  },
  {
    id: 'client-japanese-importer',
    companyCode: 'JPN-IMP-001',
    legalName: '株式会社コーヒーインポート東京',
    tradingName: 'Tokyo Coffee Import Co., Ltd.',
    type: 'IMPORTER',
    size: 'MEDIUM',
    businessModel: 'B2B',
    industry: 'Coffee Import and Distribution',
    description:
      'Specialized coffee importer serving the Japanese market with focus on specialty and premium coffee. Supplies to high-end coffee shops, restaurants, and specialty retailers throughout Japan.',
    website: 'https://www.tokyo-coffee-import.co.jp',
    email: 'procurement@tokyo-coffee-import.co.jp',
    phone: '+81 3 1234 5678',
    addresses: [
      {
        type: 'HEADQUARTERS',
        street: '1-2-3 Shibaura, Minato-ku',
        city: 'Tokyo',
        postalCode: '105-0023',
        country: 'Japan',
        isPrimary: true,
      },
      {
        type: 'WAREHOUSE',
        street: '4-5-6 Odaiba, Minato-ku',
        city: 'Tokyo',
        postalCode: '135-0091',
        country: 'Japan',
        isPrimary: false,
      },
    ],
    contacts: [
      {
        name: '田中太郎',
        title: '調達部長',
        email: 't.tanaka@tokyo-coffee-import.co.jp',
        phone: '+81 3 1234 5679',
        department: 'Procurement',
        isPrimary: true,
        languages: ['ja', 'en'],
      },
      {
        name: '佐藤花子',
        title: '品質管理マネージャー',
        email: 'h.sato@tokyo-coffee-import.co.jp',
        phone: '+81 3 1234 5680',
        department: 'Quality Control',
        isPrimary: false,
        languages: ['ja', 'en'],
      },
    ],
    businessProfile: {
      yearEstablished: 1995,
      employeeCount: 28,
      annualRevenue: 8500000,
      currency: 'USD',
      marketFocus: ['Japan', 'South Korea'],
      specializations: [
        'Specialty coffee importing',
        'Quality assessment and cupping',
        'Direct trade relationships',
        'Japanese market expertise',
      ],
      certifications: [
        'JAS Organic',
        'Fair Trade Japan',
        'Specialty Coffee Association of Japan',
      ],
      tradingExperience:
        'Nearly 30 years of experience in coffee importing with deep knowledge of Japanese consumer preferences and regulatory requirements. Strong relationships with specialty coffee shops and high-end retailers.',
    },
    financialInfo: {
      creditRating: 'A-',
      paymentTermsPreference: 'LC at sight',
      creditLimit: 300000,
      currency: 'USD',
      bankReferences: [
        'Mitsubishi UFJ Bank, Tokyo',
        'Sumitomo Mitsui Banking Corporation',
      ],
      insuranceInfo: 'Trade insurance through Tokio Marine & Nichido',
    },
    tradingHistory: {
      firstOrderDate: '2020-06-10',
      totalOrdersCount: 18,
      totalOrderValue: 720000,
      currency: 'USD',
      averageOrderSize: 40000,
      lastOrderDate: '2023-12-05',
      preferredProducts: [
        'Premium Arabica single origins',
        'Specialty grade coffee',
        'Organic certified coffee',
      ],
      seasonalPatterns: 'Peak demand in spring and autumn seasons',
    },
    preferences: {
      communicationLanguage: 'ja',
      contactMethod: 'email',
      timezone: 'Asia/Tokyo',
      orderFrequency: 'Bi-monthly',
      qualityRequirements: [
        'Cupping score 85+ points',
        'Single origin traceability',
        'Exceptional flavor clarity',
        'Consistent quality batch to batch',
      ],
      certificationRequirements: [
        'JAS Organic for organic products',
        'Specialty Coffee Association certification',
        'Direct trade verification',
      ],
      packagingPreferences: [
        '60kg jute bags with GrainPro liner',
        'Japanese and English labeling',
        'Detailed origin information',
      ],
    },
    riskAssessment: {
      riskLevel: 'LOW',
      factors: [
        'Consistent payment history',
        'Stable business relationship',
        'Strong market position',
        'Conservative ordering patterns',
      ],
      lastAssessmentDate: '2023-12-01',
      notes:
        'Reliable long-term client with excellent payment record and consistent quality requirements',
    },
    tags: [
      'specialty',
      'japanese-market',
      'premium',
      'established',
      'quality-focused',
    ],
    isActive: true,
    createdBy: 'admin-001',
    updatedBy: 'sales-specialist-asia',
  },
  {
    id: 'client-uk-distributor',
    companyCode: 'UK-DIST-001',
    legalName: 'British Isles Coffee Distribution Ltd',
    tradingName: 'BICD',
    type: 'DISTRIBUTOR',
    size: 'MEDIUM',
    businessModel: 'B2B',
    industry: 'Coffee Distribution and Wholesale',
    description:
      'Leading coffee distributor serving the UK and Ireland markets. Specializes in connecting international coffee suppliers with local roasters, cafes, and food service operators.',
    website: 'https://www.bicd.co.uk',
    email: 'sourcing@bicd.co.uk',
    phone: '+44 20 7123 4567',
    addresses: [
      {
        type: 'HEADQUARTERS',
        street: '123 Coffee House Lane',
        city: 'London',
        postalCode: 'EC1A 1BB',
        country: 'United Kingdom',
        isPrimary: true,
      },
      {
        type: 'WAREHOUSE',
        street: 'Unit 45, Industrial Estate',
        city: 'Birmingham',
        postalCode: 'B12 0XY',
        country: 'United Kingdom',
        isPrimary: false,
      },
    ],
    contacts: [
      {
        name: 'James Wilson',
        title: 'Sourcing Director',
        email: 'j.wilson@bicd.co.uk',
        phone: '+44 20 7123 4568',
        department: 'Sourcing',
        isPrimary: true,
        languages: ['en', 'fr', 'de'],
      },
      {
        name: 'Emma Thompson',
        title: 'Business Development Manager',
        email: 'e.thompson@bicd.co.uk',
        phone: '+44 20 7123 4569',
        department: 'Business Development',
        isPrimary: false,
        languages: ['en', 'es'],
      },
    ],
    businessProfile: {
      yearEstablished: 2012,
      employeeCount: 35,
      annualRevenue: 15000000,
      currency: 'GBP',
      marketFocus: ['United Kingdom', 'Ireland', 'Northern Europe'],
      specializations: [
        'Coffee market intelligence',
        'Supply chain optimization',
        'Quality assurance programs',
        'Market entry consulting',
      ],
      certifications: [
        'BRC Global Standard',
        'Organic certification (Soil Association)',
        'Fair Trade Foundation',
      ],
      tradingExperience:
        'Over 12 years in coffee distribution with extensive network of suppliers and customers across Europe. Expertise in market analysis, supply chain management, and regulatory compliance.',
    },
    financialInfo: {
      creditRating: 'B+',
      paymentTermsPreference: 'Net 30 days',
      creditLimit: 150000,
      currency: 'GBP',
      bankReferences: ['Barclays Bank, London', 'HSBC UK, Birmingham'],
      insuranceInfo: 'Credit insurance through Atradius',
    },
    tradingHistory: {
      totalOrdersCount: 0,
      totalOrderValue: 0,
      currency: 'USD',
      averageOrderSize: 0,
      preferredProducts: [
        'Commercial and specialty grade coffee',
        'Sustainable and certified origins',
        'Flexible packaging options',
      ],
    },
    preferences: {
      communicationLanguage: 'en',
      contactMethod: 'video_call',
      timezone: 'Europe/London',
      orderFrequency: 'As needed',
      qualityRequirements: [
        'Consistent quality standards',
        'Proper documentation',
        'Traceability information',
        'Competitive pricing',
      ],
      certificationRequirements: [
        'Organic certification for organic products',
        'Fair Trade certification',
        'Sustainability credentials',
      ],
      packagingPreferences: [
        'Flexible packaging options',
        'Proper labeling for UK market',
        'Cost-effective solutions',
      ],
    },
    riskAssessment: {
      riskLevel: 'MEDIUM',
      factors: [
        'New business relationship',
        'Market entry phase',
        'Growing business model',
        'Established industry presence',
      ],
      lastAssessmentDate: '2024-02-01',
      notes:
        'New potential client with good industry reputation, seeking to establish Vietnamese coffee sourcing relationships',
    },
    tags: [
      'distributor',
      'uk-market',
      'new-client',
      'market-entry',
      'consulting',
    ],
    isActive: true,
    createdBy: 'admin-001',
    updatedBy: 'consulting-manager-001',
  },
  {
    id: 'client-australian-cafe',
    companyCode: 'AUS-CAFE-001',
    legalName: 'Southern Cross Coffee Pty Ltd',
    tradingName: 'Southern Cross Cafes',
    type: 'CAFE_CHAIN',
    size: 'MEDIUM',
    businessModel: 'B2C',
    industry: 'Coffee Retail and Food Service',
    description:
      'Growing cafe chain with 25 locations across Melbourne and Sydney. Known for their commitment to quality coffee and unique Australian coffee culture experience.',
    website: 'https://www.southerncrosscafes.com.au',
    email: 'procurement@southerncrosscafes.com.au',
    phone: '+61 3 9123 4567',
    addresses: [
      {
        type: 'HEADQUARTERS',
        street: '456 Collins Street',
        city: 'Melbourne',
        state: 'Victoria',
        postalCode: '3000',
        country: 'Australia',
        isPrimary: true,
      },
      {
        type: 'WAREHOUSE',
        street: '789 Industrial Road',
        city: 'Melbourne',
        state: 'Victoria',
        postalCode: '3021',
        country: 'Australia',
        isPrimary: false,
      },
    ],
    contacts: [
      {
        name: 'David Mitchell',
        title: 'Operations Manager',
        email: 'd.mitchell@southerncrosscafes.com.au',
        phone: '+61 3 9123 4568',
        department: 'Operations',
        isPrimary: true,
        languages: ['en'],
      },
      {
        name: 'Lisa Chen',
        title: 'Head Barista & Quality Control',
        email: 'l.chen@southerncrosscafes.com.au',
        phone: '+61 3 9123 4569',
        department: 'Quality Control',
        isPrimary: false,
        languages: ['en', 'zh'],
      },
    ],
    businessProfile: {
      yearEstablished: 2018,
      employeeCount: 120,
      annualRevenue: 8000000,
      currency: 'AUD',
      marketFocus: ['Australia'],
      specializations: [
        'Specialty coffee service',
        'Australian coffee culture',
        'Artisanal food offerings',
        'Community engagement',
      ],
      certifications: [
        'Australian Organic',
        'Fair Trade Australia',
        'Specialty Coffee Association',
      ],
      tradingExperience:
        '6 years in cafe operations with focus on quality coffee and customer experience. Growing presence in Australian specialty coffee market.',
    },
    financialInfo: {
      creditRating: 'B',
      paymentTermsPreference: 'LC 90 days',
      creditLimit: 100000,
      currency: 'AUD',
      bankReferences: [
        'Commonwealth Bank of Australia, Melbourne',
        'ANZ Bank, Sydney',
      ],
      insuranceInfo: 'Business insurance through QBE Australia',
    },
    tradingHistory: {
      firstOrderDate: '2023-08-20',
      totalOrdersCount: 3,
      totalOrderValue: 75000,
      currency: 'USD',
      averageOrderSize: 25000,
      lastOrderDate: '2023-12-15',
      preferredProducts: [
        'Custom coffee blends',
        'Specialty single origins',
        'Signature house blend',
      ],
      seasonalPatterns:
        'Higher consumption during Australian winter months (June-August)',
    },
    preferences: {
      communicationLanguage: 'en',
      contactMethod: 'email',
      timezone: 'Australia/Melbourne',
      orderFrequency: 'Quarterly',
      qualityRequirements: [
        'Excellent espresso characteristics',
        'Good crema production',
        'Balanced flavor for milk drinks',
        'Consistent roasting profile',
      ],
      certificationRequirements: [
        'Australian Organic for organic products',
        'Fair Trade Australia',
        'Sustainability credentials',
      ],
      packagingPreferences: [
        '1kg and 5kg bags',
        'Valve bags for freshness',
        'Australian labeling compliance',
      ],
    },
    riskAssessment: {
      riskLevel: 'MEDIUM',
      factors: [
        'Growing business with expansion plans',
        'Consistent ordering pattern',
        'Good payment history',
        'Competitive market environment',
      ],
      lastAssessmentDate: '2024-01-01',
      notes:
        'Promising client with growth potential, requires monitoring of expansion success and cash flow',
    },
    tags: [
      'cafe-chain',
      'australian-market',
      'specialty',
      'growing',
      'custom-blends',
    ],
    isActive: true,
    createdBy: 'admin-001',
    updatedBy: 'product-development-manager',
  },
];

export default clientCompaniesData;
