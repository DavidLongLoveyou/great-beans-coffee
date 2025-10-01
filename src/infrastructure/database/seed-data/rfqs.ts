import type {
  RFQStatus,
  Priority,
  ShippingTerms,
  PaymentTerms,
} from '../../../domain/entities/rfq.entity';

export interface SeedRFQ {
  id: string;
  rfqNumber: string;
  clientCompanyId: string;
  status: RFQStatus;
  priority: Priority;
  title: string;
  description: string;
  requirements: {
    products: Array<{
      productId: string;
      quantity: number;
      unit: string;
      specifications?: string;
      qualityRequirements?: string[];
    }>;
    services?: Array<{
      serviceId: string;
      requirements: string;
      specifications?: string;
    }>;
    deliveryDate: string;
    shippingTerms: ShippingTerms;
    paymentTerms: PaymentTerms;
    certifications?: string[];
    packaging?: string;
    labeling?: string;
  };
  budget: {
    estimatedValue: number;
    currency: string;
    isFlexible: boolean;
    notes?: string;
  };
  shipping: {
    destination: {
      country: string;
      city: string;
      port?: string;
      address?: string;
    };
    preferredShippingMethod?: string;
    incoterms: string;
    specialRequirements?: string[];
  };
  timeline: {
    submittedAt: string;
    responseDeadline: string;
    expectedDecisionDate?: string;
    preferredDeliveryDate: string;
  };
  communication: {
    preferredLanguage: string;
    contactMethod: string;
    timezone: string;
    notes?: string;
  };
  attachments?: Array<{
    name: string;
    type: string;
    url: string;
    description?: string;
  }>;
  tags: string[];
  assignedTo?: string;
  createdBy: string;
  updatedBy: string;
}

export const rfqsData: SeedRFQ[] = [
  {
    id: 'rfq-001-premium-robusta',
    rfqNumber: 'RFQ-2024-001',
    clientCompanyId: 'client-german-roaster',
    status: 'PENDING',
    priority: 'HIGH',
    title: 'Premium Robusta for European Market - 100MT',
    description:
      'We are seeking a reliable supplier for premium grade Robusta coffee beans for our European roasting operations. This is for a new product line targeting the specialty coffee segment in Germany and neighboring countries. Quality and consistency are paramount for this project.',
    requirements: {
      products: [
        {
          productId: 'premium-robusta-grade1',
          quantity: 100,
          unit: 'MT',
          specifications:
            'Screen size 18+, moisture content max 12.5%, defects max 5%',
          qualityRequirements: [
            'Cupping score minimum 80 points',
            'Uniform bean size and color',
            'No visible defects or foreign matter',
            'Fresh crop (within 12 months)',
            'Proper storage and handling',
          ],
        },
      ],
      deliveryDate: '2024-04-15',
      shippingTerms: 'CIF',
      paymentTerms: 'LC_AT_SIGHT',
      certifications: [
        'Organic certification (EU standards)',
        'Fair Trade certification',
        'Rainforest Alliance certification',
        'ISO 22000 food safety',
      ],
      packaging: '60kg jute bags with inner plastic liner',
      labeling: 'English and German labels with origin information',
    },
    budget: {
      estimatedValue: 350000,
      currency: 'USD',
      isFlexible: true,
      notes:
        'Budget can be adjusted for exceptional quality or additional certifications',
    },
    shipping: {
      destination: {
        country: 'Germany',
        city: 'Hamburg',
        port: 'Port of Hamburg',
        address: 'Warehouse District, Hamburg',
      },
      preferredShippingMethod: 'Container shipping',
      incoterms: 'CIF Hamburg',
      specialRequirements: [
        'Temperature-controlled container',
        'Fumigation certificate required',
        'Insurance coverage for full value',
        'Tracking and monitoring during transit',
      ],
    },
    timeline: {
      submittedAt: '2024-02-01T09:00:00Z',
      responseDeadline: '2024-02-15T17:00:00Z',
      expectedDecisionDate: '2024-02-20T12:00:00Z',
      preferredDeliveryDate: '2024-04-15T00:00:00Z',
    },
    communication: {
      preferredLanguage: 'en',
      contactMethod: 'email',
      timezone: 'Europe/Berlin',
      notes: 'Available for video calls between 9 AM - 5 PM CET',
    },
    attachments: [
      {
        name: 'quality-specifications.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-001/quality-specifications.pdf',
        description: 'Detailed quality requirements and testing protocols',
      },
      {
        name: 'packaging-requirements.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-001/packaging-requirements.pdf',
        description: 'Packaging and labeling specifications',
      },
    ],
    tags: ['premium', 'robusta', 'organic', 'fair-trade', 'european-market'],
    assignedTo: 'sales-manager-001',
    createdBy: 'client-german-roaster',
    updatedBy: 'sales-manager-001',
  },
  {
    id: 'rfq-002-private-label-oem',
    rfqNumber: 'RFQ-2024-002',
    clientCompanyId: 'client-us-retailer',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    title: 'Private Label Coffee Manufacturing - Multi-SKU Project',
    description:
      'We are looking for a manufacturing partner to produce a range of private label coffee products for our retail chain. This includes ground coffee, whole beans, and single-serve pods across different price points and quality levels.',
    requirements: {
      products: [
        {
          productId: 'commercial-robusta-grade2',
          quantity: 50,
          unit: 'MT',
          specifications: 'For value-tier products, screen size 16+',
          qualityRequirements: [
            'Consistent flavor profile',
            'Good extraction characteristics',
            'Cost-effective quality level',
          ],
        },
        {
          productId: 'premium-arabica-dalat',
          quantity: 25,
          unit: 'MT',
          specifications: 'For premium-tier products, specialty grade',
          qualityRequirements: [
            'Cupping score 85+ points',
            'Distinctive flavor profile',
            'Single origin traceability',
          ],
        },
      ],
      services: [
        {
          serviceId: 'private-label-coffee',
          requirements:
            'Complete private label solution including brand development',
          specifications:
            'Brand identity, packaging design, regulatory compliance',
        },
        {
          serviceId: 'oem-coffee-manufacturing',
          requirements:
            'Manufacturing for multiple SKUs with different specifications',
          specifications:
            'Ground coffee, whole beans, and single-serve formats',
        },
      ],
      deliveryDate: '2024-06-30',
      shippingTerms: 'FOB',
      paymentTerms: 'NET_30',
      certifications: [
        'FDA compliance',
        'SQF certification',
        'Kosher certification',
      ],
      packaging: 'Various formats: 12oz bags, 2lb bags, single-serve pods',
      labeling: 'Private label with our brand identity',
    },
    budget: {
      estimatedValue: 500000,
      currency: 'USD',
      isFlexible: false,
      notes:
        'Fixed budget for initial order, potential for larger volumes if successful',
    },
    shipping: {
      destination: {
        country: 'United States',
        city: 'Los Angeles',
        port: 'Port of Los Angeles',
        address: 'Distribution Center, Los Angeles, CA',
      },
      preferredShippingMethod: 'Container shipping',
      incoterms: 'FOB Vietnam',
      specialRequirements: [
        'FDA prior notice required',
        'Proper documentation for customs',
        'Consolidated shipping for cost efficiency',
      ],
    },
    timeline: {
      submittedAt: '2024-01-15T14:30:00Z',
      responseDeadline: '2024-02-01T17:00:00Z',
      expectedDecisionDate: '2024-02-10T12:00:00Z',
      preferredDeliveryDate: '2024-06-30T00:00:00Z',
    },
    communication: {
      preferredLanguage: 'en',
      contactMethod: 'video_call',
      timezone: 'America/Los_Angeles',
      notes: 'Weekly progress calls preferred, available PST business hours',
    },
    attachments: [
      {
        name: 'brand-guidelines.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-002/brand-guidelines.pdf',
        description: 'Existing brand guidelines and design requirements',
      },
      {
        name: 'product-specifications.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        url: '/documents/rfq-002/product-specifications.xlsx',
        description: 'Detailed specifications for all SKUs',
      },
      {
        name: 'market-research.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-002/market-research.pdf',
        description: 'Market research and competitive analysis',
      },
    ],
    tags: ['private-label', 'oem', 'multi-sku', 'retail', 'us-market'],
    assignedTo: 'sales-manager-001',
    createdBy: 'client-us-retailer',
    updatedBy: 'sales-manager-001',
  },
  {
    id: 'rfq-003-specialty-arabica',
    rfqNumber: 'RFQ-2024-003',
    clientCompanyId: 'client-japanese-importer',
    status: 'QUOTED',
    priority: 'HIGH',
    title: 'Specialty Arabica for Japanese Coffee Shops - 20MT',
    description:
      'Sourcing high-quality Arabica coffee for a network of specialty coffee shops in Japan. Focus on unique flavor profiles and exceptional quality that will appeal to discerning Japanese coffee consumers.',
    requirements: {
      products: [
        {
          productId: 'premium-arabica-dalat',
          quantity: 20,
          unit: 'MT',
          specifications:
            'Specialty grade, washed process, high altitude grown',
          qualityRequirements: [
            'Cupping score 87+ points',
            'Bright acidity and floral notes',
            'Clean cup with no defects',
            'Traceable to specific farm lots',
            'Harvest within last 6 months',
          ],
        },
      ],
      deliveryDate: '2024-03-30',
      shippingTerms: 'CIF',
      paymentTerms: 'LC_AT_SIGHT',
      certifications: [
        'JAS Organic certification',
        'Specialty Coffee Association certification',
        'Direct trade verification',
      ],
      packaging: '60kg jute bags with GrainPro liner',
      labeling: 'Japanese and English labels with detailed origin information',
    },
    budget: {
      estimatedValue: 180000,
      currency: 'USD',
      isFlexible: true,
      notes: 'Premium pricing acceptable for exceptional quality',
    },
    shipping: {
      destination: {
        country: 'Japan',
        city: 'Tokyo',
        port: 'Port of Tokyo',
        address: 'Shibaura Warehouse District, Tokyo',
      },
      preferredShippingMethod: 'Refrigerated container',
      incoterms: 'CIF Tokyo',
      specialRequirements: [
        'Temperature and humidity controlled shipping',
        'Japanese import documentation',
        'Phytosanitary certificate',
        'Certificate of origin',
      ],
    },
    timeline: {
      submittedAt: '2024-01-20T10:00:00Z',
      responseDeadline: '2024-02-05T17:00:00Z',
      expectedDecisionDate: '2024-02-12T12:00:00Z',
      preferredDeliveryDate: '2024-03-30T00:00:00Z',
    },
    communication: {
      preferredLanguage: 'ja',
      contactMethod: 'email',
      timezone: 'Asia/Tokyo',
      notes:
        'Japanese language preferred, English acceptable for technical discussions',
    },
    attachments: [
      {
        name: 'quality-requirements-ja.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-003/quality-requirements-ja.pdf',
        description: 'Quality requirements in Japanese',
      },
      {
        name: 'import-regulations.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-003/import-regulations.pdf',
        description: 'Japanese import regulations and requirements',
      },
    ],
    tags: [
      'specialty',
      'arabica',
      'japanese-market',
      'high-quality',
      'direct-trade',
    ],
    assignedTo: 'sales-rep-001',
    createdBy: 'client-japanese-importer',
    updatedBy: 'sales-rep-001',
  },
  {
    id: 'rfq-004-sourcing-consulting',
    rfqNumber: 'RFQ-2024-004',
    clientCompanyId: 'client-uk-distributor',
    status: 'PENDING',
    priority: 'LOW',
    title: 'Coffee Sourcing Strategy Consulting - Market Entry',
    description:
      'We are a UK-based distributor looking to enter the Vietnamese coffee market. We need consulting services to help us understand the market, identify reliable suppliers, and develop a sourcing strategy for our European operations.',
    requirements: {
      services: [
        {
          serviceId: 'sourcing-consulting',
          requirements:
            'Comprehensive market analysis and supplier identification',
          specifications:
            'Focus on Robusta and Arabica suppliers, quality assessment, pricing analysis',
        },
      ],
      deliveryDate: '2024-05-31',
      shippingTerms: 'N/A',
      paymentTerms: 'NET_30',
      certifications: [
        'Consulting credentials',
        'Industry expertise verification',
      ],
    },
    budget: {
      estimatedValue: 25000,
      currency: 'USD',
      isFlexible: true,
      notes:
        'Budget for initial consulting phase, additional budget available for implementation',
    },
    shipping: {
      destination: {
        country: 'United Kingdom',
        city: 'London',
        address: 'Business District, London',
      },
      incoterms: 'N/A',
    },
    timeline: {
      submittedAt: '2024-02-05T11:00:00Z',
      responseDeadline: '2024-02-20T17:00:00Z',
      expectedDecisionDate: '2024-02-28T12:00:00Z',
      preferredDeliveryDate: '2024-05-31T00:00:00Z',
    },
    communication: {
      preferredLanguage: 'en',
      contactMethod: 'video_call',
      timezone: 'Europe/London',
      notes: 'Regular progress meetings preferred, flexible with timing',
    },
    attachments: [
      {
        name: 'company-profile.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-004/company-profile.pdf',
        description: 'Our company profile and current operations',
      },
      {
        name: 'market-entry-objectives.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-004/market-entry-objectives.pdf',
        description: 'Detailed objectives for Vietnamese market entry',
      },
    ],
    tags: ['consulting', 'market-entry', 'sourcing-strategy', 'uk-market'],
    assignedTo: 'quality-manager-001',
    createdBy: 'client-uk-distributor',
    updatedBy: 'quality-manager-001',
  },
  {
    id: 'rfq-005-blend-development',
    rfqNumber: 'RFQ-2024-005',
    clientCompanyId: 'client-australian-cafe',
    status: 'COMPLETED',
    priority: 'MEDIUM',
    title: 'Custom Blend Development for Cafe Chain - 30MT',
    description:
      'Development of a signature coffee blend for our growing cafe chain in Australia. We need a unique flavor profile that will differentiate us in the competitive Australian coffee market.',
    requirements: {
      products: [
        {
          productId: 'signature-vietnamese-blend',
          quantity: 30,
          unit: 'MT',
          specifications: 'Custom blend with 60% Robusta, 40% Arabica',
          qualityRequirements: [
            'Balanced flavor profile with chocolate notes',
            'Good crema production for espresso',
            'Consistent roasting characteristics',
            'Suitable for milk-based drinks',
          ],
        },
      ],
      services: [
        {
          serviceId: 'oem-coffee-manufacturing',
          requirements: 'Custom blend development and production',
          specifications:
            'Roast profile development, quality testing, production setup',
        },
      ],
      deliveryDate: '2024-04-30',
      shippingTerms: 'CIF',
      paymentTerms: 'LC_90_DAYS',
      certifications: [
        'Australian import compliance',
        'Organic certification preferred',
      ],
      packaging: '1kg retail bags and 5kg commercial bags',
      labeling: 'Private label with our cafe branding',
    },
    budget: {
      estimatedValue: 240000,
      currency: 'USD',
      isFlexible: false,
      notes: 'Fixed budget for initial order, long-term partnership potential',
    },
    shipping: {
      destination: {
        country: 'Australia',
        city: 'Melbourne',
        port: 'Port of Melbourne',
        address: 'Distribution Center, Melbourne, VIC',
      },
      preferredShippingMethod: 'Container shipping',
      incoterms: 'CIF Melbourne',
      specialRequirements: [
        'Australian quarantine compliance',
        'Fumigation certificate',
        'Proper documentation for customs clearance',
      ],
    },
    timeline: {
      submittedAt: '2024-01-10T08:00:00Z',
      responseDeadline: '2024-01-25T17:00:00Z',
      expectedDecisionDate: '2024-02-01T12:00:00Z',
      preferredDeliveryDate: '2024-04-30T00:00:00Z',
    },
    communication: {
      preferredLanguage: 'en',
      contactMethod: 'email',
      timezone: 'Australia/Melbourne',
      notes: 'AEST business hours preferred for calls',
    },
    attachments: [
      {
        name: 'flavor-profile-requirements.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-005/flavor-profile-requirements.pdf',
        description: 'Detailed flavor profile and sensory requirements',
      },
      {
        name: 'cafe-brand-guidelines.pdf',
        type: 'application/pdf',
        url: '/documents/rfq-005/cafe-brand-guidelines.pdf',
        description: 'Brand guidelines for packaging and labeling',
      },
    ],
    tags: [
      'custom-blend',
      'cafe-chain',
      'australian-market',
      'signature-blend',
    ],
    assignedTo: 'logistics-coordinator-001',
    createdBy: 'client-australian-cafe',
    updatedBy: 'logistics-coordinator-001',
  },
];

export default rfqsData;
