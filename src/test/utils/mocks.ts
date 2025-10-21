// Mock utilities for testing
import { CoffeeProduct } from '@/domain/entities/coffee-product.entity';
import { RFQ } from '@/domain/entities/rfq.entity';
import { User } from '@/domain/entities/user.entity';

// Mock data factories
export const mockUser = (overrides?: Partial<User>): User => ({
  id: 'user-123',
  email: 'test@example.com',
  profile: {
    firstName: 'Test',
    lastName: 'User',
    displayName: 'Test User',
    phoneNumber: '+1234567890',
    address: {
      street: '123 Test Street',
      city: 'Test City',
      country: 'Test Country',
    },
  },
  role: 'VIEWER',
  status: 'ACTIVE',
  preferences: {
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'USD',
    notifications: {
      email: true,
      browser: true,
      mobile: false,
      rfqUpdates: true,
      orderUpdates: true,
      systemAlerts: true,
      marketingEmails: false,
    },
    dashboard: {
      defaultView: 'OVERVIEW',
    },
  },
  security: {
    passwordHash: 'hashed_password',
    passwordSalt: 'salt',
    lastPasswordChange: new Date('2024-01-01'),
    mfaEnabled: false,
    loginAttempts: 0,
  },
  permissions: [],
  activity: {
    lastActiveAt: new Date('2024-01-01'),
    totalLogins: 10,
    totalRFQsHandled: 5,
    totalOrdersProcessed: 3,
    totalClientsManaged: 2,
  },
  employment: {
    startDate: new Date('2024-01-01'),
    jobTitle: 'Sales Representative',
    department: 'SALES',
    workLocation: 'OFFICE',
    contractType: 'FULL_TIME',
  },
  emailVerified: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  updatedBy: 'system',
  ...overrides,
});

export const mockCoffeeProduct = (): CoffeeProduct => {
  return {
    id: 'product-123',
    sku: 'ROB-G1-001',
    name: { en: 'Premium Robusta Grade 1' },
    description: { en: 'High-quality robusta coffee beans' },
    type: 'ROBUSTA',
    grade: 'GRADE_1',
    processingMethod: 'WASHED',
    specifications: {
      moisture: 12.5,
      defectRate: 0.5,
      screenSize: '18+',
      density: 0.75,
      cuppingScore: 85,
      acidity: 'Medium',
      body: 'Full',
      flavor: 'Chocolate, nutty, earthy',
    },
    pricing: {
      basePrice: 2500,
      currency: 'USD',
      unit: 'MT',
      incoterms: 'FOB',
      minimumOrder: 20,
      priceValidUntil: new Date('2024-12-31'),
    },
    availability: {
      inStock: true,
      stockQuantity: 150,
      harvestSeason: '2024/2025',
      availableFrom: new Date('2024-01-01'),
      availableUntil: new Date('2024-12-31'),
      leadTime: 30,
      productionCapacity: 50,
    },
    certifications: ['ORGANIC'],
    origin: {
      region: 'Dak Lak',
      province: 'Buon Ma Thuot',
      altitude: 650,
      farmSize: 'Estate',
      cooperativeName: 'Highland Coffee Cooperative',
      coordinates: { latitude: 12.6667, longitude: 108.05 },
      soilType: 'Basalt',
      climate: 'Tropical',
    },
    images: [
      {
        url: 'https://example.com/test-image.jpg',
        alt: { en: 'Test coffee product image' },
        isPrimary: true,
      },
    ],
    documents: [
      {
        type: 'SPECIFICATION',
        url: 'https://example.com/test-doc.pdf',
        name: { en: 'Product Specification' },
        language: 'en',
      },
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'test-user',
    updatedBy: 'test-user',
  };
};

export const mockRFQ = (overrides?: Partial<RFQ>): RFQ => ({
  id: 'rfq-123',
  rfqNumber: 'RFQ-2024-001',
  status: 'PENDING',
  priority: 'MEDIUM',
  companyInfo: {
    companyName: 'Test Company',
    contactPerson: 'John Doe',
    email: 'john@testcompany.com',
    phone: '+1234567890',
    address: {
      street: '123 Test St',
      city: 'Test City',
      postalCode: '12345',
      country: 'Test Country',
    },
    businessType: 'IMPORTER',
  },
  productRequirements: {
    coffeeType: 'ARABICA',
    grade: 'AA',
    processingMethod: 'WASHED',
    origin: 'ETHIOPIA',
    certifications: ['ORGANIC'],
  },
  quantityRequirements: {
    quantity: 5000,
    unit: 'KG',
    isRecurringOrder: false,
  },
  deliveryRequirements: {
    incoterms: 'FOB',
    destinationPort: 'Test Port',
    destinationCountry: 'Test Country',
    preferredDeliveryDate: new Date('2024-06-01'),
    latestDeliveryDate: new Date('2024-07-01'),
    packaging: 'JUTE_BAGS_60KG',
  },
  paymentTerms: {
    preferredCurrency: 'USD',
    paymentMethod: 'LC',
    paymentTerms: 'Test payment terms',
  },
  additionalRequirements: 'Test requirements',
  sampleRequired: false,
  submittedAt: new Date('2024-01-01'),
  lastActivityAt: new Date('2024-01-01'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  updatedBy: 'test-user',
  ...overrides,
});

// API Response mocks
export const mockApiResponse = <T>(data: T, success = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error',
  timestamp: new Date().toISOString(),
});

export const mockApiError = (message = 'Test error', status = 400) => ({
  success: false,
  error: {
    message,
    status,
    code: 'TEST_ERROR',
  },
  timestamp: new Date().toISOString(),
});

// Service mocks
export const mockEmailService = {
  sendEmail: jest.fn().mockResolvedValue({ success: true }),
  sendRFQNotification: jest.fn().mockResolvedValue({ success: true }),
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
};

export const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
};

export const mockSearchService = {
  searchProducts: jest.fn().mockResolvedValue([]),
  indexProduct: jest.fn().mockResolvedValue(true),
  deleteProduct: jest.fn().mockResolvedValue(true),
};

export const mockAnalyticsService = {
  track: jest.fn(),
  identify: jest.fn(),
  page: jest.fn(),
};

// Repository mocks
export const mockCoffeeProductRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  findBySlug: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockCoffeeProduct()),
  update: jest.fn().mockResolvedValue(mockCoffeeProduct()),
  delete: jest.fn().mockResolvedValue(true),
  search: jest.fn().mockResolvedValue([]),
};

export const mockRFQRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockRFQ()),
  update: jest.fn().mockResolvedValue(mockRFQ()),
  delete: jest.fn().mockResolvedValue(true),
  findByCustomerId: jest.fn().mockResolvedValue([]),
};

export const mockUserRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  findByEmail: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockUser()),
  update: jest.fn().mockResolvedValue(mockUser()),
  delete: jest.fn().mockResolvedValue(true),
};

// Use case mocks
export const mockGetCoffeeProductsUseCase = {
  execute: jest.fn().mockResolvedValue([]),
};

export const mockSubmitRFQUseCase = {
  execute: jest.fn().mockResolvedValue(mockRFQ()),
};

// External service mocks
export const mockCloudinaryService = {
  getOptimizedImageUrl: jest
    .fn()
    .mockReturnValue('https://test.cloudinary.com/image.jpg'),
  getBlurPlaceholder: jest.fn().mockReturnValue('data:image/jpeg;base64,test'),
  uploadImage: jest
    .fn()
    .mockResolvedValue({ url: 'https://test.cloudinary.com/image.jpg' }),
};

// Browser API mocks
export const mockIntersectionObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
};

export const mockResizeObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
};

// Local storage mock
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Session storage mock
export const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Fetch mock
export const mockFetch = jest.fn();

// Helper to reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks();

  // Reset specific mocks
  mockEmailService.sendEmail.mockResolvedValue({ success: true });
  mockCacheService.get.mockResolvedValue(null);
  mockSearchService.searchProducts.mockResolvedValue([]);
  mockCoffeeProductRepository.findAll.mockResolvedValue([]);
  mockRFQRepository.findAll.mockResolvedValue([]);
  mockUserRepository.findAll.mockResolvedValue([]);
};

// Contentlayer mocks
export const allMarketReports = [];
export const allOriginStories = [];
export const allServicePages = [];
export const allBlogPosts = [];

// Mock next-intl functions
export const getTranslations = jest.fn(() => (key: string) => key);
export const getLocale = jest.fn(() => 'en');
export const getMessages = jest.fn(() => ({}));
export const unstable_setRequestLocale = jest.fn();
export const getRequestConfig = jest.fn((_configFn) => {
  // Return a mock configuration that mimics the real behavior
  return async ({ locale = 'en' } = {}) => {
    return {
      locale,
      messages: {},
    };
  };
});

// Client-side next-intl mocks
export const useTranslations = jest.fn(() => (key: string) => key);
export const useLocale = jest.fn(() => 'en');
export const useMessages = jest.fn(() => ({}));
export const useNow = jest.fn((_date) => new Date());
export const useTimeZone = jest.fn(() => 'UTC');
export const useFormatter = jest.fn(() => ({
  dateTime: (date: Date) => date.toISOString(),
  number: (num: number) => num.toString(),
  relativeTime: (_date: Date) => 'just now',
}));

// Default export for contentlayer mocks
const mockContentlayer = {
  allMarketReports,
  allOriginStories,
  allServicePages,
  allBlogPosts,
  getTranslations,
  getLocale,
  getMessages,
  unstable_setRequestLocale,
  getRequestConfig,
  useTranslations,
  useLocale,
  useMessages,
  useNow,
  useTimeZone,
  useFormatter,
};

export default mockContentlayer;
