// Mock utilities for testing
import { CoffeeProduct } from '@/domain/entities/coffee-product.entity'
import { RFQ } from '@/domain/entities/rfq.entity'
import { User } from '@/domain/entities/user.entity'

// Mock data factories
export const mockUser = (overrides?: Partial<User>): User => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'CUSTOMER',
  company: 'Test Company',
  phone: '+1234567890',
  address: '123 Test Street',
  isActive: true,
  emailVerified: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})

export const mockCoffeeProduct = (overrides?: Partial<CoffeeProduct>): CoffeeProduct => ({
  id: 'product-123',
  name: 'Test Coffee',
  slug: 'test-coffee',
  description: 'A delicious test coffee',
  origin: 'Test Origin',
  variety: 'Arabica',
  processingMethod: 'WASHED',
  altitude: '1200-1500m',
  flavorProfile: ['chocolate', 'nutty'],
  certifications: ['ORGANIC'],
  harvestSeason: 'Year-round',
  availability: 'IN_STOCK',
  minimumOrder: 1000,
  pricePerKg: 8.50,
  currency: 'USD',
  images: ['test-image.jpg'],
  documents: ['test-spec.pdf'],
  tags: ['premium', 'single-origin'],
  isActive: true,
  isFeatured: false,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  createdBy: 'admin-001',
  updatedBy: 'admin-001',
  ...overrides,
})

export const mockRFQ = (overrides?: Partial<RFQ>): RFQ => ({
  id: 'rfq-123',
  rfqNumber: 'RFQ-2024-001',
  customerId: 'user-123',
  status: 'PENDING',
  priority: 'MEDIUM',
  productType: 'GREEN_BEANS',
  quantity: 5000,
  unit: 'KG',
  targetPrice: 8.00,
  currency: 'USD',
  deliveryLocation: 'Test Port',
  deliveryDate: new Date('2024-06-01'),
  requirements: 'Test requirements',
  notes: 'Test notes',
  attachments: [],
  responses: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  expiresAt: new Date('2024-02-01'),
  ...overrides,
})

// API Response mocks
export const mockApiResponse = <T>(data: T, success = true) => ({
  success,
  data,
  message: success ? 'Success' : 'Error',
  timestamp: new Date().toISOString(),
})

export const mockApiError = (message = 'Test error', status = 400) => ({
  success: false,
  error: {
    message,
    status,
    code: 'TEST_ERROR',
  },
  timestamp: new Date().toISOString(),
})

// Service mocks
export const mockEmailService = {
  sendEmail: jest.fn().mockResolvedValue({ success: true }),
  sendRFQNotification: jest.fn().mockResolvedValue({ success: true }),
  sendWelcomeEmail: jest.fn().mockResolvedValue({ success: true }),
}

export const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn(),
  clear: jest.fn(),
}

export const mockSearchService = {
  searchProducts: jest.fn().mockResolvedValue([]),
  indexProduct: jest.fn().mockResolvedValue(true),
  deleteProduct: jest.fn().mockResolvedValue(true),
}

export const mockAnalyticsService = {
  track: jest.fn(),
  identify: jest.fn(),
  page: jest.fn(),
}

// Repository mocks
export const mockCoffeeProductRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  findBySlug: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockCoffeeProduct()),
  update: jest.fn().mockResolvedValue(mockCoffeeProduct()),
  delete: jest.fn().mockResolvedValue(true),
  search: jest.fn().mockResolvedValue([]),
}

export const mockRFQRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockRFQ()),
  update: jest.fn().mockResolvedValue(mockRFQ()),
  delete: jest.fn().mockResolvedValue(true),
  findByCustomerId: jest.fn().mockResolvedValue([]),
}

export const mockUserRepository = {
  findAll: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockResolvedValue(null),
  findByEmail: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockUser()),
  update: jest.fn().mockResolvedValue(mockUser()),
  delete: jest.fn().mockResolvedValue(true),
}

// Use case mocks
export const mockGetCoffeeProductsUseCase = {
  execute: jest.fn().mockResolvedValue([]),
}

export const mockSubmitRFQUseCase = {
  execute: jest.fn().mockResolvedValue(mockRFQ()),
}

// External service mocks
export const mockCloudinaryService = {
  getOptimizedImageUrl: jest.fn().mockReturnValue('https://test.cloudinary.com/image.jpg'),
  getBlurPlaceholder: jest.fn().mockReturnValue('data:image/jpeg;base64,test'),
  uploadImage: jest.fn().mockResolvedValue({ url: 'https://test.cloudinary.com/image.jpg' }),
}

// Browser API mocks
export const mockIntersectionObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}

export const mockResizeObserver = {
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}

// Local storage mock
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Session storage mock
export const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

// Fetch mock
export const mockFetch = jest.fn()

// Helper to reset all mocks
export const resetAllMocks = () => {
  jest.clearAllMocks()
  
  // Reset specific mocks
  mockEmailService.sendEmail.mockResolvedValue({ success: true })
  mockCacheService.get.mockResolvedValue(null)
  mockSearchService.searchProducts.mockResolvedValue([])
  mockCoffeeProductRepository.findAll.mockResolvedValue([])
  mockRFQRepository.findAll.mockResolvedValue([])
  mockUserRepository.findAll.mockResolvedValue([])
}