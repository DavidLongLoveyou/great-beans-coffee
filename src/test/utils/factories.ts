// Test data factories for generating consistent test data
import { faker } from '@faker-js/faker'

// User factory
export const createMockUser = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  company: faker.company.name(),
  role: faker.helpers.arrayElement(['buyer', 'supplier', 'admin']),
  phone: faker.phone.number(),
  country: faker.location.country(),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  isVerified: faker.datatype.boolean(),
  ...overrides,
})

// Coffee product factory
export const createMockCoffeeProduct = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  name: faker.helpers.arrayElement([
    'Ethiopian Yirgacheffe',
    'Colombian Supremo',
    'Jamaican Blue Mountain',
    'Hawaiian Kona',
    'Guatemala Antigua',
    'Costa Rica Tarrazú',
    'Yemen Mocha',
    'Panama Geisha'
  ]),
  slug: faker.helpers.slugify(faker.commerce.productName()),
  description: faker.commerce.productDescription(),
  origin: faker.helpers.arrayElement([
    'Ethiopia',
    'Colombia',
    'Brazil',
    'Guatemala',
    'Costa Rica',
    'Jamaica',
    'Yemen',
    'Panama',
    'Vietnam',
    'Indonesia'
  ]),
  region: faker.location.state(),
  altitude: faker.number.int({ min: 800, max: 2200 }),
  processingMethod: faker.helpers.arrayElement([
    'Washed',
    'Natural',
    'Honey',
    'Semi-washed',
    'Wet-hulled'
  ]),
  varietals: faker.helpers.arrayElements([
    'Arabica',
    'Bourbon',
    'Typica',
    'Caturra',
    'Catuai',
    'Geisha',
    'SL28',
    'SL34'
  ], { min: 1, max: 3 }),
  flavorProfile: {
    acidity: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
    body: faker.helpers.arrayElement(['Light', 'Medium', 'Full']),
    sweetness: faker.helpers.arrayElement(['Low', 'Medium', 'High']),
    notes: faker.helpers.arrayElements([
      'Chocolate',
      'Caramel',
      'Vanilla',
      'Fruity',
      'Floral',
      'Nutty',
      'Spicy',
      'Wine-like',
      'Citrus',
      'Berry'
    ], { min: 2, max: 4 })
  },
  certifications: faker.helpers.arrayElements([
    'Organic',
    'Fair Trade',
    'Rainforest Alliance',
    'UTZ',
    'Bird Friendly',
    'Shade Grown'
  ], { min: 0, max: 3 }),
  harvestSeason: faker.helpers.arrayElement([
    'October - February',
    'April - August',
    'Year-round',
    'November - March'
  ]),
  cupScore: faker.number.float({ min: 80, max: 95, fractionDigits: 1 }),
  moistureContent: faker.number.float({ min: 10, max: 12, fractionDigits: 1 }),
  screenSize: faker.helpers.arrayElement(['14+', '15+', '16+', '17+', '18+']),
  defectCount: faker.number.int({ min: 0, max: 5 }),
  pricePerKg: faker.number.float({ min: 3, max: 50, fractionDigits: 2 }),
  minimumOrder: faker.number.int({ min: 100, max: 1000 }),
  availableQuantity: faker.number.int({ min: 1000, max: 50000 }),
  images: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => ({
    url: faker.image.url(),
    alt: faker.lorem.words(3),
    caption: faker.lorem.sentence()
  })),
  supplier: createMockUser({ role: 'supplier' }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  isActive: faker.datatype.boolean({ probability: 0.9 }),
  isFeatured: faker.datatype.boolean({ probability: 0.3 }),
  ...overrides,
})

// RFQ (Request for Quotation) factory
export const createMockRFQ = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  rfqNumber: `RFQ-${faker.string.alphanumeric(8).toUpperCase()}`,
  buyer: createMockUser({ role: 'buyer' }),
  productRequirements: {
    origin: faker.helpers.arrayElement(['Ethiopia', 'Colombia', 'Brazil', 'Guatemala']),
    processingMethod: faker.helpers.arrayElement(['Washed', 'Natural', 'Honey']),
    cupScore: faker.number.int({ min: 80, max: 90 }),
    quantity: faker.number.int({ min: 1000, max: 10000 }),
    packaging: faker.helpers.arrayElement(['Jute bags', 'GrainPro bags', 'Vacuum packed']),
    deliveryLocation: faker.location.city(),
    targetPrice: faker.number.float({ min: 5, max: 25, fractionDigits: 2 }),
  },
  specifications: {
    moistureContent: faker.number.float({ min: 10, max: 12, fractionDigits: 1 }),
    screenSize: faker.helpers.arrayElement(['14+', '15+', '16+', '17+']),
    defectCount: faker.number.int({ min: 0, max: 3 }),
    certifications: faker.helpers.arrayElements([
      'Organic',
      'Fair Trade',
      'Rainforest Alliance'
    ], { min: 0, max: 2 }),
  },
  timeline: {
    submissionDeadline: faker.date.future(),
    deliveryDate: faker.date.future(),
    sampleRequired: faker.datatype.boolean(),
    sampleDeadline: faker.date.soon(),
  },
  status: faker.helpers.arrayElement([
    'draft',
    'published',
    'closed',
    'awarded',
    'cancelled'
  ]),
  responses: faker.number.int({ min: 0, max: 15 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  expiresAt: faker.date.future(),
  ...overrides,
})

// RFQ Response factory
export const createMockRFQResponse = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  rfqId: faker.string.uuid(),
  supplier: createMockUser({ role: 'supplier' }),
  quotation: {
    pricePerKg: faker.number.float({ min: 5, max: 30, fractionDigits: 2 }),
    totalPrice: faker.number.float({ min: 5000, max: 300000, fractionDigits: 2 }),
    currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP']),
    validUntil: faker.date.future(),
    paymentTerms: faker.helpers.arrayElement([
      'Net 30',
      'Net 60',
      'Letter of Credit',
      'Cash on Delivery'
    ]),
    deliveryTerms: faker.helpers.arrayElement(['FOB', 'CIF', 'EXW', 'DDP']),
  },
  productDetails: {
    origin: faker.location.country(),
    farm: faker.company.name(),
    processingMethod: faker.helpers.arrayElement(['Washed', 'Natural', 'Honey']),
    varietals: faker.helpers.arrayElements(['Arabica', 'Bourbon', 'Typica'], { min: 1, max: 2 }),
    cupScore: faker.number.float({ min: 82, max: 92, fractionDigits: 1 }),
    harvestDate: faker.date.past(),
  },
  samples: {
    available: faker.datatype.boolean(),
    cost: faker.number.float({ min: 0, max: 50, fractionDigits: 2 }),
    shippingCost: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
    deliveryTime: faker.helpers.arrayElement(['3-5 days', '1 week', '2 weeks']),
  },
  attachments: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
    name: faker.system.fileName(),
    url: faker.internet.url(),
    type: faker.helpers.arrayElement(['pdf', 'doc', 'jpg', 'png']),
    size: faker.number.int({ min: 1000, max: 5000000 }),
  })),
  message: faker.lorem.paragraphs(2),
  status: faker.helpers.arrayElement(['pending', 'accepted', 'rejected', 'negotiating']),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

// Company/Supplier profile factory
export const createMockCompany = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  slug: faker.helpers.slugify(faker.company.name()),
  description: faker.company.catchPhrase(),
  about: faker.lorem.paragraphs(3),
  logo: faker.image.url(),
  coverImage: faker.image.url(),
  website: faker.internet.url(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  address: {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country: faker.location.country(),
    zipCode: faker.location.zipCode(),
  },
  certifications: faker.helpers.arrayElements([
    'ISO 22000',
    'HACCP',
    'Organic',
    'Fair Trade',
    'Rainforest Alliance',
    'UTZ'
  ], { min: 1, max: 4 }),
  establishedYear: faker.number.int({ min: 1950, max: 2020 }),
  employeeCount: faker.helpers.arrayElement([
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '500+'
  ]),
  annualCapacity: faker.number.int({ min: 1000, max: 100000 }),
  exportMarkets: faker.helpers.arrayElements([
    'North America',
    'Europe',
    'Asia',
    'Middle East',
    'Australia',
    'South America'
  ], { min: 1, max: 4 }),
  socialMedia: {
    facebook: faker.internet.url(),
    twitter: faker.internet.url(),
    linkedin: faker.internet.url(),
    instagram: faker.internet.url(),
  },
  rating: faker.number.float({ min: 3.5, max: 5.0, fractionDigits: 1 }),
  reviewCount: faker.number.int({ min: 0, max: 100 }),
  isVerified: faker.datatype.boolean({ probability: 0.7 }),
  isPremium: faker.datatype.boolean({ probability: 0.3 }),
  createdAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  ...overrides,
})

// News/Blog article factory
export const createMockArticle = (overrides: Partial<any> = {}) => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  slug: faker.helpers.slugify(faker.lorem.words(5)),
  excerpt: faker.lorem.paragraph(),
  content: faker.lorem.paragraphs(10),
  featuredImage: faker.image.url(),
  author: createMockUser(),
  category: faker.helpers.arrayElement([
    'Market News',
    'Industry Insights',
    'Sustainability',
    'Quality',
    'Technology',
    'Farming Practices'
  ]),
  tags: faker.helpers.arrayElements([
    'coffee',
    'export',
    'sustainability',
    'quality',
    'market',
    'farming',
    'technology',
    'certification'
  ], { min: 2, max: 5 }),
  publishedAt: faker.date.past(),
  updatedAt: faker.date.recent(),
  isPublished: faker.datatype.boolean({ probability: 0.8 }),
  isFeatured: faker.datatype.boolean({ probability: 0.2 }),
  readTime: faker.number.int({ min: 2, max: 15 }),
  views: faker.number.int({ min: 0, max: 10000 }),
  likes: faker.number.int({ min: 0, max: 500 }),
  ...overrides,
})

// Factory helper functions
export const createMockList = <T>(factory: (overrides?: any) => T, count: number, overrides?: any): T[] => {
  return Array.from({ length: count }, () => factory(overrides))
}

export const createMockPaginatedResponse = <T>(
  items: T[],
  page = 1,
  limit = 10,
  total?: number
) => ({
  data: items,
  pagination: {
    page,
    limit,
    total: total || items.length,
    totalPages: Math.ceil((total || items.length) / limit),
    hasNext: page * limit < (total || items.length),
    hasPrev: page > 1,
  },
})

// Seed data for consistent testing
export const seedData = {
  users: createMockList(createMockUser, 10),
  coffeeProducts: createMockList(createMockCoffeeProduct, 20),
  rfqs: createMockList(createMockRFQ, 15),
  companies: createMockList(createMockCompany, 8),
  articles: createMockList(createMockArticle, 12),
}