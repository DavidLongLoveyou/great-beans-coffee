import type { ClusterArticle } from '@/components/clusters/ClusterArticleCard';
import type { ClusterProduct } from '@/components/clusters/ClusterProductCard';
import type { ClusterService } from '@/components/clusters/ClusterServiceCard';

// Mock Products Data
export const CLUSTER_PRODUCTS: Record<string, ClusterProduct[]> = {
  'vietnam-robusta-suppliers': [
    {
      id: 'robusta-grade1-premium',
      name: 'The Great Beans Premium Grade 1 Robusta',
      description:
        'Exceptional quality Robusta beans sourced and processed by The Great Beans with superior body and crema characteristics, perfect for espresso blends. Available as green beans or custom roasted.',
      image: '/images/products/robusta-premium.jpg',
      price: 'From $2,850/MT FOB',
      grade: 'grade1',
      origin: {
        country: 'Vietnam',
        region: 'Dak Lak',
      },
      processingMethod: 'washed',
      certifications: ['rainforestAlliance', 'organic'],
      specifications: {
        moisture: '12.5%',
        screenSize: '18+',
        defectRate: '2%',
        cuppingScore: 82,
      },
      features: [
        'Screen size 18+ with uniform bean size',
        'Low defect rate under 3%',
        'Excellent body and crema production',
        'Consistent quality year-round',
        'Available green or roasted',
        'Organic certified',
      ],
      inStock: true,
      leadTime: '15-20 days',
      isFeatured: true,
    },
    {
      id: 'robusta-grade2-commercial',
      name: 'The Great Beans Commercial Grade 2 Robusta',
      description:
        'High-volume commercial grade Robusta sourced by The Great Beans, ideal for instant coffee and large-scale blending operations. Available as green beans or custom roasted.',
      image: '/images/products/robusta-commercial.jpg',
      price: 'From $2,450/MT FOB',
      grade: 'grade2',
      origin: {
        country: 'Vietnam',
        region: 'Gia Lai',
      },
      processingMethod: 'natural',
      certifications: ['rainforestAlliance'],
      specifications: {
        moisture: '13%',
        screenSize: '16+',
        defectRate: '5%',
      },
      features: [
        'Competitive pricing for volume buyers',
        'Consistent supply chain',
        'Suitable for instant coffee production',
        'Flexible packaging options',
        'Available green or roasted',
        'Rainforest Alliance certified',
      ],
      inStock: true,
      leadTime: '10-15 days',
    },
    {
      id: 'robusta-organic-certified',
      name: 'The Great Beans Organic Certified Robusta',
      description:
        'USDA Organic and EU Organic certified Robusta beans sourced by The Great Beans from sustainable farming practices. Available as green beans or custom roasted.',
      image: '/images/products/robusta-organic.jpg',
      price: 'From $3,200/MT FOB',
      grade: 'grade1',
      origin: {
        country: 'Vietnam',
        region: 'Lam Dong',
      },
      processingMethod: 'washed',
      certifications: ['organic', 'rainforestAlliance'],
      specifications: {
        moisture: '12%',
        screenSize: '18+',
        defectRate: '2%',
        cuppingScore: 84,
      },
      features: [
        'USDA and EU Organic certified',
        'Sustainable farming practices',
        'Full traceability to farm level',
        'Available green or roasted',
        'Rainforest Alliance certified',
      ],
      inStock: true,
      leadTime: '20-25 days',
    },
  ],
  'specialty-arabica-sourcing': [
    {
      id: 'arabica-specialty-dalat',
      name: 'The Great Beans Dalat Specialty Arabica',
      description:
        'High-altitude Arabica from Dalat region sourced by The Great Beans with complex flavor profile and exceptional cupping scores. Available as green beans or custom roasted.',
      image: '/images/products/arabica-dalat.jpg',
      price: 'From $4,500/MT FOB',
      grade: 'specialty',
      origin: {
        country: 'Vietnam',
        region: 'Dalat',
      },
      processingMethod: 'washed',
      certifications: ['organic', 'rainforestAlliance'],
      specifications: {
        moisture: '11%',
        screenSize: '17+',
        defectRate: '1%',
        cuppingScore: 87,
      },
      features: [
        'Cupping score 85+ consistently',
        'High altitude grown (1,200-1,500m)',
        'Complex flavor notes',
        'Single origin traceability',
        'Available green or roasted',
        'Organic certified',
      ],
      inStock: true,
      leadTime: '25-30 days',
      isFeatured: true,
    },
    {
      id: 'arabica-honey-processed',
      name: 'The Great Beans Honey Processed Arabica',
      description:
        'Unique honey processing method sourced by The Great Beans creates distinctive sweetness and body in this premium Arabica. Available as green beans or custom roasted.',
      image: '/images/products/arabica-honey.jpg',
      price: 'From $5,200/MT FOB',
      grade: 'specialty',
      origin: {
        country: 'Vietnam',
        region: 'Son La',
      },
      processingMethod: 'honey',
      certifications: ['organic'],
      specifications: {
        moisture: '11.5%',
        screenSize: '16+',
        defectRate: '1%',
        cuppingScore: 89,
      },
      features: [
        'Unique honey processing method',
        'Enhanced sweetness and body',
        'Limited seasonal availability',
        'Artisanal processing techniques',
        'Available green or roasted',
        'Organic certified',
      ],
      inStock: false,
      leadTime: '30-35 days',
    },
  ],
  'private-label-coffee-manufacturing': [
    {
      id: 'custom-blend-robusta-arabica',
      name: 'The Great Beans Custom Robusta-Arabica Blend',
      description:
        'Tailored blend combining Vietnamese Robusta and Arabica sourced by The Great Beans to your exact specifications and flavor profile. Available as green beans or custom roasted.',
      image: '/images/products/custom-blend.jpg',
      price: 'Custom pricing based on specs',
      grade: 'custom',
      origin: {
        country: 'Vietnam',
        region: 'Multi-region',
      },
      processingMethod: 'mixed',
      certifications: ['organic', 'rainforestAlliance'],
      specifications: {
        moisture: '12%',
        screenSize: 'Custom',
        defectRate: '2%',
      },
      features: [
        'Bespoke blend formulations',
        'Consistent quality control',
        'Flexible packaging options',
        'Private label services',
        'Available green or roasted',
        'Organic certified options',
      ],
      inStock: true,
      leadTime: '20-30 days',
      isFeatured: true,
    },
    {
      id: 'instant-coffee-base',
      name: 'The Great Beans Instant Coffee Base Material',
      description:
        'High-quality Robusta specifically selected and processed by The Great Beans for instant coffee manufacturing. Available as green beans or custom roasted.',
      image: '/images/products/instant-base.jpg',
      price: 'From $2,650/MT FOB',
      grade: 'grade1',
      origin: {
        country: 'Vietnam',
        region: 'Dak Lak',
      },
      processingMethod: 'natural',
      certifications: ['rainforestAlliance'],
      specifications: {
        moisture: '12.5%',
        screenSize: '18+',
        defectRate: '2%',
      },
      features: [
        'Optimized for instant coffee production',
        'High extraction yield',
        'Consistent flavor profile',
        'Volume pricing available',
        'Available green or roasted',
        'Rainforest Alliance certified',
      ],
      inStock: true,
      leadTime: '15-20 days',
    },
  ],
};

// Mock Services Data
export const CLUSTER_SERVICES: Record<string, ClusterService[]> = {
  'vietnam-robusta-suppliers': [
    {
      id: 'robusta-sourcing',
      name: 'Robusta Sourcing & Procurement',
      description:
        'Comprehensive sourcing services for Vietnamese Robusta with quality assurance and competitive pricing.',
      icon: 'Truck',
      category: 'Sourcing',
      features: [
        'Direct farm relationships',
        'Quality pre-shipment inspection',
        'Competitive FOB pricing',
        'Flexible payment terms',
        'Real-time market intelligence',
        'Custom grade specifications',
      ],
      capabilities: {
        minimum: '1 container (19.2 MT)',
        maximum: '500+ containers/month',
        leadTime: '15-30 days',
      },
      certifications: ['ISO 22000', 'HACCP', 'Rainforest Alliance'],
      pricing: {
        model: 'FOB Ho Chi Minh Port',
        startingPrice: '$2,450/MT',
      },
      isPopular: true,
    },
    {
      id: 'quality-control',
      name: 'Quality Control & Testing',
      description:
        'Professional cupping lab and quality control services ensuring consistent grade standards.',
      icon: 'Settings',
      category: 'Quality Assurance',
      features: [
        'Professional cupping lab',
        'Pre-shipment quality testing',
        'Certificate of Analysis (COA)',
        'Third-party verification',
        'Moisture and defect analysis',
        'Custom quality parameters',
      ],
      capabilities: {
        minimum: '5 MT per test',
        maximum: 'Unlimited',
        leadTime: '3-5 days',
      },
      certifications: ['ISO 17025', 'SCA Certified'],
      pricing: {
        model: 'Per shipment testing',
        startingPrice: '$150/test',
      },
    },
  ],
  'specialty-arabica-sourcing': [
    {
      id: 'specialty-sourcing',
      name: 'Specialty Arabica Sourcing',
      description:
        'Curated selection of high-scoring Vietnamese Arabica from premium growing regions.',
      icon: 'Factory',
      category: 'Specialty Sourcing',
      features: [
        'Cupping score 85+ guarantee',
        'Single origin traceability',
        'Micro-lot availability',
        'Seasonal harvest planning',
        'Direct trade relationships',
        'Sustainability certifications',
      ],
      capabilities: {
        minimum: '5 bags (300 kg)',
        maximum: '50 MT per lot',
        leadTime: '30-45 days',
      },
      certifications: ['Organic', 'Fair Trade', 'Rainforest Alliance'],
      pricing: {
        model: 'Premium pricing',
        startingPrice: '$4,500/MT',
      },
      isPopular: true,
    },
  ],
  'private-label-coffee-manufacturing': [
    {
      id: 'private-label-manufacturing',
      name: 'Private Label Manufacturing',
      description:
        'Complete private label coffee manufacturing from blend development to packaging.',
      icon: 'Factory',
      category: 'Manufacturing',
      features: [
        'Custom blend development',
        'Private label packaging',
        'Brand design support',
        'Flexible MOQ options',
        'Multiple packaging formats',
        'Quality certification',
      ],
      capabilities: {
        minimum: '500 kg per SKU',
        maximum: '100+ MT per month',
        leadTime: '45-60 days',
      },
      certifications: ['ISO 22000', 'HACCP', 'BRC'],
      pricing: {
        model: 'Custom manufacturing',
        startingPrice: 'Quote on request',
      },
      isPopular: true,
    },
    {
      id: 'oem-services',
      name: 'OEM Coffee Services',
      description:
        'Original Equipment Manufacturing services for coffee brands and distributors.',
      icon: 'Settings',
      category: 'OEM',
      features: [
        'White label solutions',
        'Custom formulations',
        'Packaging design',
        'Regulatory compliance',
        'Supply chain management',
        'Quality assurance',
      ],
      capabilities: {
        minimum: '1 MT per order',
        maximum: 'Unlimited capacity',
        leadTime: '30-45 days',
      },
      certifications: ['ISO 22000', 'HACCP'],
      pricing: {
        model: 'OEM pricing',
        startingPrice: 'Quote on request',
      },
    },
  ],
};

// Mock Articles Data
export const CLUSTER_ARTICLES: Record<string, ClusterArticle[]> = {
  'vietnam-robusta-suppliers': [
    {
      id: 'vietnam-robusta-market-outlook-2024',
      title:
        'Vietnam Robusta Market Outlook 2024: Supply Chain Resilience and Quality Improvements',
      excerpt:
        "Comprehensive analysis of Vietnam's Robusta coffee market trends, including production forecasts, quality initiatives, and export opportunities for international buyers.",
      image: '/images/articles/robusta-market-2024.jpg',
      category: 'Market Analysis',
      publishedAt: '2024-01-15',
      readingTime: '8 min read',
      author: {
        name: 'Dr. Nguyen Van Minh',
        role: 'Coffee Market Analyst',
      },
      tags: ['Robusta', 'Market Trends', 'Vietnam', 'Supply Chain'],
      url: '/en/market-reports/vietnam-robusta-market-outlook-2024',
      isFeatured: true,
    },
    {
      id: 'robusta-quality-standards-guide',
      title:
        "Understanding Vietnamese Robusta Quality Standards: A Buyer's Guide",
      excerpt:
        'Essential guide for international buyers covering Vietnamese Robusta grading systems, quality parameters, and certification requirements.',
      image: '/images/articles/robusta-quality-guide.jpg',
      category: 'Quality Guide',
      publishedAt: '2024-01-10',
      readingTime: '12 min read',
      author: {
        name: 'Le Thi Hoa',
        role: 'Quality Control Manager',
      },
      tags: ['Quality Standards', 'Robusta', 'Grading', 'Certification'],
      url: '/en/blog/robusta-quality-standards-guide',
    },
    {
      id: 'sustainable-robusta-farming-vietnam',
      title:
        'Sustainable Robusta Farming Practices in Vietnam: Environmental and Economic Benefits',
      excerpt:
        'Exploring how Vietnamese Robusta farmers are adopting sustainable practices to improve both environmental impact and coffee quality.',
      image: '/images/articles/sustainable-robusta.jpg',
      category: 'Sustainability',
      publishedAt: '2024-01-05',
      readingTime: '10 min read',
      author: {
        name: 'Tran Duc Thanh',
        role: 'Sustainability Coordinator',
      },
      tags: ['Sustainability', 'Farming', 'Environment', 'Robusta'],
      url: '/en/blog/sustainable-robusta-farming-vietnam',
    },
  ],
  'specialty-arabica-sourcing': [
    {
      id: 'vietnam-arabica-specialty-potential',
      title:
        "Vietnam's Specialty Arabica Potential: High-Altitude Regions and Unique Terroir",
      excerpt:
        'Discovering the emerging specialty Arabica regions in Vietnam, including Dalat, Son La, and their unique flavor profiles and growing conditions.',
      image: '/images/articles/specialty-arabica-vietnam.jpg',
      category: 'Specialty Coffee',
      publishedAt: '2024-01-20',
      readingTime: '15 min read',
      author: {
        name: 'James Wilson',
        role: 'Specialty Coffee Consultant',
      },
      tags: ['Specialty Coffee', 'Arabica', 'Terroir', 'Vietnam'],
      url: '/en/blog/vietnam-arabica-specialty-potential',
      isFeatured: true,
    },
    {
      id: 'cupping-vietnamese-arabica',
      title:
        'Cupping Vietnamese Arabica: Flavor Profiles and Processing Methods',
      excerpt:
        'Professional cupping notes and analysis of Vietnamese Arabica varieties, including processing method impacts on flavor development.',
      image: '/images/articles/cupping-arabica.jpg',
      category: 'Cupping',
      publishedAt: '2024-01-12',
      readingTime: '11 min read',
      author: {
        name: 'Maria Santos',
        role: 'Q Grader & Cupping Expert',
      },
      tags: ['Cupping', 'Arabica', 'Flavor Profile', 'Processing'],
      url: '/en/blog/cupping-vietnamese-arabica',
    },
  ],
  'private-label-coffee-manufacturing': [
    {
      id: 'private-label-coffee-trends-2024',
      title:
        'Private Label Coffee Trends 2024: Customization and Brand Differentiation',
      excerpt:
        'Latest trends in private label coffee manufacturing, including custom blending, packaging innovations, and brand positioning strategies.',
      image: '/images/articles/private-label-trends.jpg',
      category: 'Industry Trends',
      publishedAt: '2024-01-18',
      readingTime: '9 min read',
      author: {
        name: 'Sarah Chen',
        role: 'Private Label Specialist',
      },
      tags: ['Private Label', 'Trends', 'Branding', 'Manufacturing'],
      url: '/en/blog/private-label-coffee-trends-2024',
      isFeatured: true,
    },
    {
      id: 'oem-coffee-manufacturing-guide',
      title: 'OEM Coffee Manufacturing: From Concept to Market-Ready Product',
      excerpt:
        'Complete guide to OEM coffee manufacturing processes, including blend development, quality control, and regulatory compliance.',
      image: '/images/articles/oem-manufacturing.jpg',
      category: 'Manufacturing Guide',
      publishedAt: '2024-01-08',
      readingTime: '14 min read',
      author: {
        name: 'David Kim',
        role: 'Manufacturing Director',
      },
      tags: ['OEM', 'Manufacturing', 'Quality Control', 'Compliance'],
      url: '/en/blog/oem-coffee-manufacturing-guide',
    },
  ],
};

// Helper function to get cluster data
export function getClusterData(clusterId: string) {
  return {
    products: CLUSTER_PRODUCTS[clusterId] || [],
    services: CLUSTER_SERVICES[clusterId] || [],
    articles: CLUSTER_ARTICLES[clusterId] || [],
  };
}
