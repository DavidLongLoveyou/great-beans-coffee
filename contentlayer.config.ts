import { defineDocumentType, makeSource } from 'contentlayer2/source-files';

// Common fields shared across document types
const commonFields = {
  title: {
    type: 'string',
    description: 'The title of the content',
    required: true,
  },
  description: {
    type: 'string',
    description: 'Brief description of the content',
    required: true,
  },
  publishedAt: {
    type: 'date',
    description: 'The date when the content was published',
    required: true,
  },
  updatedAt: {
    type: 'date',
    description: 'The date when the content was last updated',
    required: false,
  },
  author: {
    type: 'string',
    description: 'The author of the content',
    required: true,
  },
  authorBio: {
    type: 'string',
    description: 'Brief biography of the author',
    required: false,
  },
  authorImage: {
    type: 'string',
    description: 'Author profile image URL',
    required: false,
  },
  category: {
    type: 'string',
    description: 'Content category',
    required: true,
  },
  tags: {
    type: 'list',
    of: { type: 'string' },
    description: 'Content tags',
    required: false,
  },
  locale: {
    type: 'string',
    description: 'Content locale (en, vi, de, ja, fr, it, es, nl, ko)',
    required: true,
  },
  featured: {
    type: 'boolean',
    description: 'Whether the content is featured',
    required: false,
  },
  coverImage: {
    type: 'string',
    description: 'Cover image URL',
    required: false,
  },
  excerpt: {
    type: 'string',
    description: 'Brief excerpt of the content',
    required: false,
  },
  readingTime: {
    type: 'number',
    description: 'Estimated reading time in minutes',
    required: false,
  },
  seoTitle: {
    type: 'string',
    description: 'SEO optimized title',
    required: false,
  },
  seoDescription: {
    type: 'string',
    description: 'SEO optimized description',
    required: false,
  },
  keywords: {
    type: 'list',
    of: { type: 'string' },
    description: 'SEO keywords',
    required: false,
  },
  // Enhanced internationalization fields
  translationKey: {
    type: 'string',
    description: 'Unique key to link translations across locales',
    required: false,
  },
  alternateLanguages: {
    type: 'list',
    of: { type: 'string' },
    description: 'Available alternate language versions',
    required: false,
  },
  // AI optimization fields
  aiSummary: {
    type: 'string',
    description: 'AI-optimized summary for search engines and AI assistants',
    required: false,
  },
  aiKeywords: {
    type: 'list',
    of: { type: 'string' },
    description: 'AI-optimized keywords for better discoverability',
    required: false,
  },
  structuredData: {
    type: 'json',
    description: 'Structured data for rich snippets and AI understanding',
    required: false,
  },
} as const;

export const MarketReport = defineDocumentType(() => ({
  name: 'MarketReport',
  filePathPattern: `market-reports/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    relatedReports: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related market reports',
      required: false,
    },
    targetMarkets: {
      type: 'list',
      of: { type: 'string' },
      description: 'Target markets for this report',
      required: false,
    },
    dataSource: {
      type: 'string',
      description: 'Data sources for the report',
      required: false,
    },
    reportType: {
      type: 'string',
      description: 'Type of report (QUARTERLY, ANNUAL, etc.)',
      required: false,
    },
    hasDataVisualization: {
      type: 'boolean',
      description: 'Whether the report includes data visualizations',
      required: false,
    },
    chartTypes: {
      type: 'list',
      of: { type: 'string' },
      description: 'Types of charts included in the report',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc =>
        `/market-reports/${doc._raw.flattenedPath.replace('market-reports/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

export const OriginStory = defineDocumentType(() => ({
  name: 'OriginStory',
  filePathPattern: `origin-stories/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    region: {
      type: 'string',
      description: 'Coffee growing region',
      required: true,
    },
    province: {
      type: 'string',
      description: 'Province or state',
      required: false,
    },
    coffeeVariety: {
      type: 'string',
      description: 'Coffee variety (Robusta, Arabica, etc.)',
      required: true,
    },
    altitude: {
      type: 'string',
      description: 'Growing altitude',
      required: false,
    },
    processingMethod: {
      type: 'string',
      description: 'Coffee processing method',
      required: false,
    },
    harvestSeason: {
      type: 'string',
      description: 'Harvest season',
      required: false,
    },
    gallery: {
      type: 'list',
      of: { type: 'string' },
      description: 'Image gallery URLs',
      required: false,
    },
    farmerName: {
      type: 'string',
      description: 'Featured farmer name',
      required: false,
    },
    farmSize: {
      type: 'string',
      description: 'Farm size',
      required: false,
    },
    sustainabilityPractices: {
      type: 'list',
      of: { type: 'string' },
      description: 'Sustainability practices',
      required: false,
    },
    certifications: {
      type: 'list',
      of: { type: 'string' },
      description: 'Farm certifications',
      required: false,
    },
    relatedStories: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related origin stories',
      required: false,
    },
    elevation: {
      type: 'string',
      description: 'Growing elevation range',
      required: false,
    },
    climate: {
      type: 'string',
      description: 'Climate conditions',
      required: false,
    },
    soilType: {
      type: 'string',
      description: 'Soil type and characteristics',
      required: false,
    },
    processingMethods: {
      type: 'list',
      of: { type: 'string' },
      description: 'Available processing methods',
      required: false,
    },
    cupProfile: {
      type: 'string',
      description: 'Cup profile and tasting notes',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc =>
        `/origin-stories/${doc._raw.flattenedPath.replace('origin-stories/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

export const ServicePage = defineDocumentType(() => ({
  name: 'ServicePage',
  filePathPattern: `services/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    serviceType: {
      type: 'string',
      description: 'Type of service',
      required: false,
    },
    gallery: {
      type: 'list',
      of: { type: 'string' },
      description: 'Service image gallery URLs',
      required: false,
    },
    pricing: {
      type: 'json',
      description: 'Pricing information object',
      required: false,
    },
    deliveryTime: {
      type: 'string',
      description: 'Service delivery time',
      required: false,
    },
    minimumOrder: {
      type: 'string',
      description: 'Minimum order requirement',
      required: false,
    },
    certifications: {
      type: 'list',
      of: { type: 'string' },
      description: 'Service certifications',
      required: false,
    },
    targetMarkets: {
      type: 'list',
      of: { type: 'string' },
      description: 'Target markets for this service',
      required: false,
    },
    serviceIncludes: {
      type: 'list',
      of: { type: 'string' },
      description: 'What the service includes',
      required: false,
    },
    relatedServices: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related services',
      required: false,
    },
    regions: {
      type: 'list',
      of: { type: 'string' },
      description: 'Available regions for this service',
      required: false,
    },
    varieties: {
      type: 'list',
      of: { type: 'string' },
      description: 'Coffee varieties available',
      required: false,
    },
    processingMethods: {
      type: 'list',
      of: { type: 'string' },
      description: 'Available processing methods',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc =>
        `/services/${doc._raw.flattenedPath.replace('services/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

export const BlogPost = defineDocumentType(() => ({
  name: 'BlogPost',
  filePathPattern: `blog/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    relatedPosts: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related blog posts',
      required: false,
    },
    tableOfContents: {
      type: 'boolean',
      description: 'Whether to show table of contents',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc => `/blog/${doc._raw.flattenedPath.replace('blog/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

export const LegalPage = defineDocumentType(() => ({
  name: 'LegalPage',
  filePathPattern: `legal/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    legalType: {
      type: 'string',
      description: 'Type of legal document',
      required: false,
    },
    effectiveDate: {
      type: 'date',
      description: 'Date when the legal document becomes effective',
      required: false,
    },
    lastReviewed: {
      type: 'date',
      description: 'Date when the document was last reviewed',
      required: false,
    },
    version: {
      type: 'string',
      description: 'Document version',
      required: false,
    },
    jurisdiction: {
      type: 'string',
      description: 'Legal jurisdiction',
      required: false,
    },
    governingLaw: {
      type: 'string',
      description: 'Governing law',
      required: false,
    },
    reviewedBy: {
      type: 'string',
      description: 'Reviewed by (law firm or legal entity)',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc => `/legal/${doc._raw.flattenedPath.replace('legal/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

// Company News content type
export const CompanyNews = defineDocumentType(() => ({
  name: 'CompanyNews',
  filePathPattern: `company-news/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    newsType: {
      type: 'string',
      description: 'Type of news (ANNOUNCEMENT, PARTNERSHIP, EXPANSION, etc.)',
      required: false,
    },
    priority: {
      type: 'string',
      description: 'News priority (HIGH, MEDIUM, LOW)',
      required: false,
    },
    targetAudience: {
      type: 'list',
      of: { type: 'string' },
      description: 'Target audience for this news',
      required: false,
    },
    relatedNews: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related company news',
      required: false,
    },
    pressRelease: {
      type: 'boolean',
      description: 'Whether this is a press release',
      required: false,
    },
    mediaContacts: {
      type: 'json',
      description: 'Media contact information',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc =>
        `/company-news/${doc._raw.flattenedPath.replace('company-news/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

// Case Studies content type
export const CaseStudy = defineDocumentType(() => ({
  name: 'CaseStudy',
  filePathPattern: `case-studies/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    clientName: {
      type: 'string',
      description: 'Client company name',
      required: false,
    },
    clientIndustry: {
      type: 'string',
      description: 'Client industry',
      required: false,
    },
    clientCountry: {
      type: 'string',
      description: 'Client country',
      required: false,
    },
    projectDuration: {
      type: 'string',
      description: 'Project duration',
      required: false,
    },
    challenge: {
      type: 'string',
      description: 'Main challenge addressed',
      required: false,
    },
    solution: {
      type: 'string',
      description: 'Solution provided',
      required: false,
    },
    results: {
      type: 'json',
      description: 'Quantifiable results achieved',
      required: false,
    },
    testimonial: {
      type: 'json',
      description: 'Client testimonial with quote and attribution',
      required: false,
    },
    servicesUsed: {
      type: 'list',
      of: { type: 'string' },
      description: 'Services used in this case study',
      required: false,
    },
    productsUsed: {
      type: 'list',
      of: { type: 'string' },
      description: 'Products used in this case study',
      required: false,
    },
    relatedCaseStudies: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related case studies',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc =>
        `/case-studies/${doc._raw.flattenedPath.replace('case-studies/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

// Product Guides content type
export const ProductGuide = defineDocumentType(() => ({
  name: 'ProductGuide',
  filePathPattern: `product-guides/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    guideType: {
      type: 'string',
      description:
        'Type of guide (BUYING_GUIDE, TECHNICAL_SPEC, COMPARISON, etc.)',
      required: false,
    },
    difficulty: {
      type: 'string',
      description: 'Guide difficulty level (BEGINNER, INTERMEDIATE, ADVANCED)',
      required: false,
    },
    estimatedTime: {
      type: 'string',
      description: 'Estimated time to complete/read',
      required: false,
    },
    prerequisites: {
      type: 'list',
      of: { type: 'string' },
      description: 'Prerequisites for this guide',
      required: false,
    },
    relatedProducts: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related coffee products',
      required: false,
    },
    relatedServices: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related services',
      required: false,
    },
    downloadableResources: {
      type: 'list',
      of: { type: 'string' },
      description: 'Downloadable resources (PDFs, checklists, etc.)',
      required: false,
    },
    relatedGuides: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related product guides',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc =>
        `/product-guides/${doc._raw.flattenedPath.replace('product-guides/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

// Landing Pages content type
export const LandingPage = defineDocumentType(() => ({
  name: 'LandingPage',
  filePathPattern: `landing-pages/**/*.mdx`,
  contentType: 'mdx',
  fields: {
    ...commonFields,
    pageType: {
      type: 'string',
      description: 'Type of landing page (PRODUCT, SERVICE, CAMPAIGN, etc.)',
      required: false,
    },
    campaignName: {
      type: 'string',
      description: 'Marketing campaign name',
      required: false,
    },
    targetKeywords: {
      type: 'list',
      of: { type: 'string' },
      description: 'Primary target keywords for SEO',
      required: false,
    },
    conversionGoal: {
      type: 'string',
      description: 'Primary conversion goal (LEAD_GENERATION, SALES, etc.)',
      required: false,
    },
    ctaText: {
      type: 'string',
      description: 'Primary call-to-action text',
      required: false,
    },
    ctaUrl: {
      type: 'string',
      description: 'Primary call-to-action URL',
      required: false,
    },
    heroSection: {
      type: 'json',
      description: 'Hero section configuration',
      required: false,
    },
    featuresSection: {
      type: 'json',
      description: 'Features section configuration',
      required: false,
    },
    testimonialsSection: {
      type: 'json',
      description: 'Testimonials section configuration',
      required: false,
    },
    faqSection: {
      type: 'json',
      description: 'FAQ section configuration',
      required: false,
    },
    relatedPages: {
      type: 'list',
      of: { type: 'string' },
      description: 'Related landing pages',
      required: false,
    },
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: doc =>
        `/landing/${doc._raw.flattenedPath.replace('landing-pages/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: doc => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

export default makeSource({
  contentDirPath: './content',
  documentTypes: [
    MarketReport,
    OriginStory,
    ServicePage,
    BlogPost,
    LegalPage,
    CompanyNews,
    CaseStudy,
    ProductGuide,
    LandingPage,
  ],
  disableImportAliasWarning: true,
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
