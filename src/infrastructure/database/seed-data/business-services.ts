import type {
  ServiceType,
  ServiceCategory,
  PricingModel,
} from '../../../domain/entities/business-service.entity';

export interface SeedBusinessService {
  id: string;
  serviceCode: string;
  type: ServiceType;
  category: ServiceCategory;
  pricingModel: PricingModel;
  pricing: {
    basePrice?: number;
    currency: string;
    unit: string;
    minimumOrder?: number;
    setupFee?: number;
    priceBreaks?: Array<{ quantity: number; price: number }>;
  };
  deliveryTimeline: {
    estimatedDays: number;
    minimumDays: number;
    maximumDays: number;
    factors: string[];
  };
  requirements: {
    minimumQuantity?: number;
    leadTime: number;
    specifications: string[];
    documentation: string[];
  };
  capabilities: {
    capacity: string;
    equipment: string[];
    certifications: string[];
    qualityStandards: string[];
  };
  processSteps: Array<{
    step: number;
    name: string;
    description: string;
    duration: string;
    deliverables: string[];
  }>;
  translations: {
    [locale: string]: {
      name: string;
      description: string;
      shortDescription: string;
      benefits: string[];
      features: string[];
      processOverview: string;
      qualityAssurance: string;
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

export const businessServicesData: SeedBusinessService[] = [
  {
    id: 'oem-coffee-manufacturing',
    serviceCode: 'OEM-COFFEE-001',
    type: 'OEM_MANUFACTURING',
    category: 'MANUFACTURING',
    pricingModel: 'VOLUME_BASED',
    pricing: {
      basePrice: 3500,
      currency: 'USD',
      unit: 'MT',
      minimumOrder: 20,
      setupFee: 2500,
      priceBreaks: [
        { quantity: 50, price: 3400 },
        { quantity: 100, price: 3300 },
        { quantity: 200, price: 3200 },
        { quantity: 500, price: 3100 },
      ],
    },
    deliveryTimeline: {
      estimatedDays: 45,
      minimumDays: 30,
      maximumDays: 60,
      factors: [
        'Product complexity',
        'Packaging requirements',
        'Quality testing duration',
        'Shipping method',
        'Seasonal demand',
      ],
    },
    requirements: {
      minimumQuantity: 20,
      leadTime: 30,
      specifications: [
        'Detailed product specifications',
        'Quality standards and tolerances',
        'Packaging design and materials',
        'Labeling requirements',
        'Certification needs',
      ],
      documentation: [
        'Product development brief',
        'Technical specifications',
        'Quality control plan',
        'Packaging artwork',
        'Regulatory compliance documents',
      ],
    },
    capabilities: {
      capacity: '2000 MT/month',
      equipment: [
        'Industrial roasting lines',
        'Grinding and blending systems',
        'Automated packaging lines',
        'Quality control laboratory',
        'Climate-controlled storage',
      ],
      certifications: [
        'ISO 22000 (Food Safety)',
        'HACCP',
        'BRC Global Standard',
        'Organic processing',
        'Kosher and Halal',
      ],
      qualityStandards: [
        'SCA (Specialty Coffee Association)',
        'ICO (International Coffee Organization)',
        'FDA compliance',
        'EU food safety standards',
        'Custom quality protocols',
      ],
    },
    processSteps: [
      {
        step: 1,
        name: 'Consultation & Planning',
        description:
          'Initial consultation to understand requirements, product specifications, and market positioning',
        duration: '5-7 days',
        deliverables: [
          'Product development plan',
          'Technical feasibility assessment',
          'Cost estimation',
          'Timeline proposal',
        ],
      },
      {
        step: 2,
        name: 'Product Development',
        description:
          'Blend creation, roast profile development, and sample preparation',
        duration: '10-14 days',
        deliverables: [
          'Product samples',
          'Roast profile documentation',
          'Sensory evaluation report',
          'Nutritional analysis',
        ],
      },
      {
        step: 3,
        name: 'Packaging Design',
        description:
          'Packaging development, artwork creation, and material selection',
        duration: '7-10 days',
        deliverables: [
          'Packaging prototypes',
          'Artwork files',
          'Material specifications',
          'Shelf-life testing plan',
        ],
      },
      {
        step: 4,
        name: 'Production Setup',
        description:
          'Production line configuration, quality control setup, and staff training',
        duration: '5-7 days',
        deliverables: [
          'Production procedures',
          'Quality control checkpoints',
          'Staff training completion',
          'Equipment calibration',
        ],
      },
      {
        step: 5,
        name: 'Production & Quality Control',
        description: 'Full-scale production with continuous quality monitoring',
        duration: '15-20 days',
        deliverables: [
          'Finished products',
          'Quality certificates',
          'Production reports',
          'Traceability documentation',
        ],
      },
      {
        step: 6,
        name: 'Packaging & Shipping',
        description: 'Final packaging, labeling, and preparation for shipment',
        duration: '3-5 days',
        deliverables: [
          'Packaged products',
          'Shipping documentation',
          'Certificate of analysis',
          'Tracking information',
        ],
      },
    ],
    translations: {
      en: {
        name: 'OEM Coffee Manufacturing',
        description:
          'Complete OEM coffee manufacturing service from concept to finished product. We partner with brands to create custom coffee products that meet their exact specifications, quality standards, and market requirements. Our state-of-the-art facility and experienced team ensure consistent quality and reliable delivery for your private label coffee needs.',
        shortDescription:
          'End-to-end OEM coffee manufacturing from concept to finished product',
        benefits: [
          'Reduced capital investment in equipment and facilities',
          'Access to experienced coffee processing expertise',
          'Flexible production volumes to match demand',
          'Comprehensive quality assurance and testing',
          'Faster time-to-market for new products',
          'Cost-effective manufacturing solutions',
          'Full regulatory compliance support',
        ],
        features: [
          'Custom blend development and roast profiling',
          'Multiple packaging formats and sizes',
          'Private labeling and branding services',
          'Quality control and testing at every stage',
          'Flexible minimum order quantities',
          'Comprehensive documentation and traceability',
          'International shipping and logistics support',
        ],
        processOverview:
          'Our OEM manufacturing process begins with understanding your product vision and market requirements. We then develop custom blends and roast profiles, create packaging solutions, set up production lines, and manufacture your products to the highest quality standards. Throughout the process, we maintain strict quality control and provide complete documentation for traceability and compliance.',
        qualityAssurance:
          'Every batch undergoes rigorous quality testing including sensory evaluation, physical analysis, and microbiological testing. Our ISO 22000 certified facility ensures food safety at every step, while our experienced quality team monitors production continuously to maintain consistency and meet your specifications.',
      },
      de: {
        name: 'OEM Kaffeeherstellung',
        description:
          'Kompletter OEM-Kaffeeherstellungsservice vom Konzept bis zum fertigen Produkt. Wir arbeiten mit Marken zusammen, um maßgeschneiderte Kaffeeprodukte zu entwickeln.',
        shortDescription:
          'End-to-End OEM Kaffeeherstellung vom Konzept bis zum fertigen Produkt',
        benefits: [
          'Reduzierte Kapitalinvestitionen in Ausrüstung',
          'Zugang zu erfahrener Kaffee-Expertise',
          'Flexible Produktionsvolumen',
          'Umfassende Qualitätssicherung',
        ],
        features: [
          'Individuelle Mischungsentwicklung',
          'Mehrere Verpackungsformate',
          'Private Label Services',
          'Qualitätskontrolle in jeder Phase',
        ],
        processOverview:
          'Unser OEM-Herstellungsprozess beginnt mit dem Verständnis Ihrer Produktvision und Marktanforderungen.',
        qualityAssurance:
          'Jede Charge durchläuft rigorose Qualitätstests einschließlich sensorischer Bewertung und physikalischer Analyse.',
      },
      ja: {
        name: 'OEMコーヒー製造',
        description:
          'コンセプトから完成品まで、完全なOEMコーヒー製造サービス。ブランドと提携して、正確な仕様、品質基準、市場要件を満たすカスタムコーヒー製品を作成します。',
        shortDescription:
          'コンセプトから完成品までのエンドツーエンドOEMコーヒー製造',
        benefits: [
          '設備・施設への資本投資削減',
          '経験豊富なコーヒー加工専門知識へのアクセス',
          '需要に合わせた柔軟な生産量',
          '包括的な品質保証とテスト',
        ],
        features: [
          'カスタムブレンド開発とロースト プロファイリング',
          '複数のパッケージ形式とサイズ',
          'プライベートラベルとブランディングサービス',
          '各段階での品質管理とテスト',
        ],
        processOverview:
          '当社のOEM製造プロセスは、お客様の製品ビジョンと市場要件を理解することから始まります。',
        qualityAssurance:
          'すべてのバッチは、官能評価、物理分析、微生物学的試験を含む厳格な品質試験を受けます。',
      },
    },
    images: [
      'oem-manufacturing-facility.jpg',
      'production-line-overview.jpg',
      'quality-control-lab.jpg',
      'packaging-systems.jpg',
      'finished-products-showcase.jpg',
    ],
    documents: [
      'oem-service-brochure.pdf',
      'facility-certifications.pdf',
      'quality-standards-guide.pdf',
      'production-capabilities.pdf',
      'oem-process-flowchart.pdf',
    ],
    tags: [
      'oem',
      'manufacturing',
      'custom-blends',
      'private-label',
      'quality-assured',
    ],
    isActive: true,
    isFeatured: true,
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
  },
  {
    id: 'private-label-coffee',
    serviceCode: 'PL-COFFEE-001',
    type: 'PRIVATE_LABEL',
    category: 'BRANDING',
    pricingModel: 'VOLUME_BASED',
    pricing: {
      basePrice: 4200,
      currency: 'USD',
      unit: 'MT',
      minimumOrder: 10,
      setupFee: 5000,
      priceBreaks: [
        { quantity: 25, price: 4100 },
        { quantity: 50, price: 4000 },
        { quantity: 100, price: 3900 },
        { quantity: 250, price: 3800 },
      ],
    },
    deliveryTimeline: {
      estimatedDays: 60,
      minimumDays: 45,
      maximumDays: 75,
      factors: [
        'Brand development complexity',
        'Packaging design iterations',
        'Regulatory approvals',
        'Market research requirements',
        'Product testing duration',
      ],
    },
    requirements: {
      minimumQuantity: 10,
      leadTime: 45,
      specifications: [
        'Brand positioning and target market',
        'Product category and format preferences',
        'Quality and price point requirements',
        'Packaging and design preferences',
        'Distribution channel requirements',
      ],
      documentation: [
        'Brand brief and guidelines',
        'Market research data',
        'Competitive analysis',
        'Regulatory requirements',
        'Distribution agreements',
      ],
    },
    capabilities: {
      capacity: '500 MT/month for private label',
      equipment: [
        'Flexible packaging lines',
        'Custom labeling systems',
        'Brand-specific storage areas',
        'Dedicated quality control',
        'Sample preparation facilities',
      ],
      certifications: [
        'Private label manufacturing',
        'Brand compliance auditing',
        'Intellectual property protection',
        'Confidentiality agreements',
        'Quality system validation',
      ],
      qualityStandards: [
        'Brand-specific quality protocols',
        'Consistency monitoring',
        'Shelf-life validation',
        'Sensory panel evaluation',
        'Consumer testing support',
      ],
    },
    processSteps: [
      {
        step: 1,
        name: 'Brand Strategy & Market Analysis',
        description:
          'Comprehensive market research and brand positioning strategy development',
        duration: '10-14 days',
        deliverables: [
          'Market analysis report',
          'Competitive landscape study',
          'Brand positioning strategy',
          'Target consumer profile',
        ],
      },
      {
        step: 2,
        name: 'Product Development & Formulation',
        description:
          'Custom product formulation based on brand requirements and market positioning',
        duration: '14-21 days',
        deliverables: [
          'Product formulations',
          'Sensory profiles',
          'Cost analysis',
          'Nutritional information',
        ],
      },
      {
        step: 3,
        name: 'Brand Identity & Packaging Design',
        description:
          'Complete brand identity development and packaging design creation',
        duration: '14-21 days',
        deliverables: [
          'Brand identity guidelines',
          'Logo and visual elements',
          'Packaging designs',
          'Marketing materials',
        ],
      },
      {
        step: 4,
        name: 'Regulatory Compliance & Approvals',
        description:
          'Ensuring all regulatory requirements are met for target markets',
        duration: '7-14 days',
        deliverables: [
          'Regulatory compliance report',
          'Label approvals',
          'Certification documents',
          'Import/export permits',
        ],
      },
      {
        step: 5,
        name: 'Production & Quality Assurance',
        description:
          'Full-scale production with brand-specific quality controls',
        duration: '10-15 days',
        deliverables: [
          'Finished products',
          'Quality certificates',
          'Brand compliance report',
          'Batch documentation',
        ],
      },
      {
        step: 6,
        name: 'Launch Support & Distribution',
        description:
          'Marketing support and distribution assistance for product launch',
        duration: '5-10 days',
        deliverables: [
          'Launch marketing materials',
          'Distribution support',
          'Training materials',
          'Ongoing support plan',
        ],
      },
    ],
    translations: {
      en: {
        name: 'Private Label Coffee Solutions',
        description:
          'Comprehensive private label coffee solutions that help you build your own coffee brand. From market research and product development to brand creation and manufacturing, we provide end-to-end support to bring your coffee brand vision to life. Our experienced team works closely with you to create products that resonate with your target market and build lasting customer loyalty.',
        shortDescription:
          'Complete private label coffee solutions from brand development to manufacturing',
        benefits: [
          'Build your own coffee brand with expert support',
          'Comprehensive market research and positioning',
          'Custom product formulation and development',
          'Professional brand identity and packaging design',
          'Full regulatory compliance and certification support',
          'Flexible production volumes and scalability',
          'Ongoing marketing and distribution assistance',
        ],
        features: [
          'Market research and competitive analysis',
          'Custom blend development and taste profiling',
          'Brand identity creation and design services',
          'Packaging design and material selection',
          'Regulatory compliance and certification',
          'Quality assurance and consistency monitoring',
          'Marketing support and launch assistance',
        ],
        processOverview:
          'Our private label process starts with understanding your brand vision and target market. We conduct thorough market research, develop custom products, create compelling brand identity, ensure regulatory compliance, and manufacture your products to the highest standards. Throughout the journey, we provide ongoing support to help your brand succeed in the competitive coffee market.',
        qualityAssurance:
          'We maintain the highest quality standards for private label products, with dedicated quality control protocols, regular consistency monitoring, and comprehensive testing. Our team ensures that every batch meets your brand specifications and maintains the quality that your customers expect.',
      },
    },
    images: [
      'private-label-showcase.jpg',
      'brand-development-process.jpg',
      'packaging-design-studio.jpg',
      'private-label-products.jpg',
    ],
    documents: [
      'private-label-service-guide.pdf',
      'brand-development-process.pdf',
      'packaging-options-catalog.pdf',
      'regulatory-compliance-guide.pdf',
    ],
    tags: [
      'private-label',
      'brand-development',
      'custom-products',
      'market-research',
    ],
    isActive: true,
    isFeatured: true,
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
  },
  {
    id: 'sourcing-consulting',
    serviceCode: 'CONSULT-SOURCING-001',
    type: 'MARKET_CONSULTING',
    category: 'CONSULTING',
    pricingModel: 'PROJECT_BASED',
    pricing: {
      basePrice: 15000,
      currency: 'USD',
      unit: 'PROJECT',
      setupFee: 2500,
    },
    deliveryTimeline: {
      estimatedDays: 90,
      minimumDays: 60,
      maximumDays: 120,
      factors: [
        'Project scope and complexity',
        'Number of origins to evaluate',
        'Quality requirements specificity',
        'Supplier network development needs',
        'Certification requirements',
      ],
    },
    requirements: {
      leadTime: 30,
      specifications: [
        'Sourcing objectives and criteria',
        'Quality standards and specifications',
        'Volume requirements and timeline',
        'Budget parameters and constraints',
        'Certification and compliance needs',
      ],
      documentation: [
        'Project brief and objectives',
        'Quality specifications',
        'Supplier evaluation criteria',
        'Compliance requirements',
        'Budget and timeline constraints',
      ],
    },
    capabilities: {
      capacity: '10-15 concurrent projects',
      equipment: [
        'Mobile cupping laboratory',
        'Quality assessment tools',
        'Sample roasting equipment',
        'Documentation systems',
        'Communication platforms',
      ],
      certifications: [
        'Coffee quality certification',
        'Supply chain auditing',
        'Sustainability consulting',
        'Trade compliance expertise',
        'Risk assessment capabilities',
      ],
      qualityStandards: [
        'SCA cupping protocols',
        'Origin quality assessment',
        'Supplier evaluation standards',
        'Traceability verification',
        'Sustainability auditing',
      ],
    },
    processSteps: [
      {
        step: 1,
        name: 'Project Scoping & Strategy',
        description:
          'Define sourcing objectives, criteria, and develop comprehensive sourcing strategy',
        duration: '7-10 days',
        deliverables: [
          'Sourcing strategy document',
          'Project timeline and milestones',
          'Evaluation criteria framework',
          'Risk assessment plan',
        ],
      },
      {
        step: 2,
        name: 'Market Research & Origin Analysis',
        description:
          'Comprehensive market research and analysis of potential coffee origins',
        duration: '14-21 days',
        deliverables: [
          'Market analysis report',
          'Origin evaluation matrix',
          'Price trend analysis',
          'Supply risk assessment',
        ],
      },
      {
        step: 3,
        name: 'Supplier Identification & Evaluation',
        description:
          'Identify, evaluate, and qualify potential suppliers based on criteria',
        duration: '21-30 days',
        deliverables: [
          'Supplier database',
          'Evaluation scorecards',
          'Due diligence reports',
          'Capability assessments',
        ],
      },
      {
        step: 4,
        name: 'Quality Assessment & Sampling',
        description:
          'Conduct quality assessments and coordinate sample evaluations',
        duration: '14-21 days',
        deliverables: [
          'Quality assessment reports',
          'Cupping notes and scores',
          'Sample coordination',
          'Quality recommendations',
        ],
      },
      {
        step: 5,
        name: 'Negotiation & Contract Support',
        description: 'Support contract negotiations and agreement finalization',
        duration: '10-14 days',
        deliverables: [
          'Negotiation strategy',
          'Contract review and recommendations',
          'Terms and conditions analysis',
          'Risk mitigation proposals',
        ],
      },
      {
        step: 6,
        name: 'Implementation & Monitoring',
        description:
          'Support implementation and establish ongoing monitoring systems',
        duration: '14-21 days',
        deliverables: [
          'Implementation plan',
          'Monitoring framework',
          'Performance metrics',
          'Ongoing support structure',
        ],
      },
    ],
    translations: {
      en: {
        name: 'Coffee Sourcing Consulting',
        description:
          'Expert coffee sourcing consulting services to help you identify, evaluate, and secure the best coffee suppliers for your business needs. Our experienced team provides comprehensive market analysis, supplier evaluation, quality assessment, and negotiation support to ensure you establish reliable, high-quality coffee supply chains that meet your specific requirements and budget.',
        shortDescription:
          'Expert consulting for coffee sourcing, supplier evaluation, and supply chain optimization',
        benefits: [
          'Access to extensive supplier network and market knowledge',
          'Reduced sourcing risks through expert evaluation',
          'Cost optimization through strategic negotiations',
          'Quality assurance through professional assessment',
          'Time savings with streamlined sourcing process',
          'Ongoing support and relationship management',
          'Market intelligence and trend analysis',
        ],
        features: [
          'Comprehensive market research and analysis',
          'Supplier identification and qualification',
          'Quality assessment and cupping services',
          'Contract negotiation and legal support',
          'Risk assessment and mitigation strategies',
          'Sustainability and certification guidance',
          'Ongoing monitoring and performance tracking',
        ],
        processOverview:
          'Our sourcing consulting process begins with understanding your specific needs and developing a tailored sourcing strategy. We conduct comprehensive market research, identify and evaluate potential suppliers, assess quality through professional cupping, support contract negotiations, and establish monitoring systems for ongoing success.',
        qualityAssurance:
          'All supplier evaluations include rigorous quality assessments using SCA protocols, comprehensive due diligence, and ongoing monitoring. Our experienced team ensures that recommended suppliers meet your quality standards and can deliver consistently over time.',
      },
    },
    images: [
      'sourcing-consulting-team.jpg',
      'supplier-evaluation-process.jpg',
      'quality-assessment-lab.jpg',
      'market-research-analysis.jpg',
    ],
    documents: [
      'sourcing-consulting-overview.pdf',
      'supplier-evaluation-framework.pdf',
      'quality-assessment-protocols.pdf',
      'market-analysis-sample.pdf',
    ],
    tags: [
      'consulting',
      'sourcing',
      'supplier-evaluation',
      'market-research',
      'quality-assessment',
    ],
    isActive: true,
    isFeatured: false,
    createdBy: 'admin-001',
    updatedBy: 'admin-001',
  },
];

export default businessServicesData;
