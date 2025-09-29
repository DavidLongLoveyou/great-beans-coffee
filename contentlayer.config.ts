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
    description: 'Content locale (en, vi, etc.)',
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
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/market-reports/${doc._raw.flattenedPath.replace('market-reports/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
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
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/origin-stories/${doc._raw.flattenedPath.replace('origin-stories/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
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
  },
  computedFields: {
    url: {
      type: 'string',
      resolve: (doc) => `/services/${doc._raw.flattenedPath.replace('services/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
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
      resolve: (doc) => `/blog/${doc._raw.flattenedPath.replace('blog/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
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
      resolve: (doc) => `/legal/${doc._raw.flattenedPath.replace('legal/', '')}`,
    },
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.sourceFileName.replace(/\.mdx$/, ''),
    },
  },
}));

export default makeSource({
  contentDirPath: './content',
  documentTypes: [MarketReport, OriginStory, ServicePage, BlogPost, LegalPage],
  disableImportAliasWarning: true,
});