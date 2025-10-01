import { renderHook, waitFor } from '@testing-library/react'
import { act } from '@testing-library/react'
import { useCoffeeProducts } from '../use-coffee-products'
import { createMockCoffeeProduct, createMockPaginatedResponse } from '@/test/utils'

// Mock the use cases
jest.mock('@/infrastructure/di/container', () => ({
  getCoffeeProductsUseCase: {
    execute: jest.fn(),
  },
  getFeaturedProductsUseCase: {
    execute: jest.fn(),
  },
  searchCoffeeProductsUseCase: {
    execute: jest.fn(),
  },
  getProductsByCategoryUseCase: {
    execute: jest.fn(),
  },
}))

const mockGetCoffeeProductsUseCase = require('@/infrastructure/di/container').getCoffeeProductsUseCase
const mockGetFeaturedProductsUseCase = require('@/infrastructure/di/container').getFeaturedProductsUseCase
const mockSearchCoffeeProductsUseCase = require('@/infrastructure/di/container').searchCoffeeProductsUseCase
const mockGetProductsByCategoryUseCase = require('@/infrastructure/di/container').getProductsByCategoryUseCase

describe('useCoffeeProducts Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default state', () => {
    const { result } = renderHook(() => useCoffeeProducts())

    expect(result.current.products).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.pagination).toEqual({
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    })
  })

  it('loads products successfully', async () => {
    const mockProducts = [
      createMockCoffeeProduct({ name: 'Ethiopian Yirgacheffe' }),
      createMockCoffeeProduct({ name: 'Colombian Supremo' }),
    ]
    const mockResponse = createMockPaginatedResponse(mockProducts, 1, 12, 2)

    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.loadProducts()
    })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockProducts)
    expect(result.current.pagination).toEqual(mockResponse.pagination)
    expect(result.current.error).toBeNull()
    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      limit: 12,
      filters: {},
    })
  })

  it('handles loading error', async () => {
    const errorMessage = 'Failed to load products'
    mockGetCoffeeProductsUseCase.execute.mockRejectedValue(new Error(errorMessage))

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.loadProducts()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual([])
    expect(result.current.error).toBe(errorMessage)
  })

  it('loads featured products', async () => {
    const mockFeaturedProducts = [
      createMockCoffeeProduct({ name: 'Premium Geisha', isFeatured: true }),
      createMockCoffeeProduct({ name: 'Blue Mountain', isFeatured: true }),
    ]

    mockGetFeaturedProductsUseCase.execute.mockResolvedValue(mockFeaturedProducts)

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.loadFeaturedProducts()
    })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockFeaturedProducts)
    expect(mockGetFeaturedProductsUseCase.execute).toHaveBeenCalledWith({ limit: 6 })
  })

  it('searches products with query', async () => {
    const searchQuery = 'Ethiopian'
    const mockSearchResults = [
      createMockCoffeeProduct({ name: 'Ethiopian Yirgacheffe' }),
      createMockCoffeeProduct({ name: 'Ethiopian Sidamo' }),
    ]
    const mockResponse = createMockPaginatedResponse(mockSearchResults, 1, 12, 2)

    mockSearchCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.searchProducts(searchQuery)
    })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockSearchResults)
    expect(mockSearchCoffeeProductsUseCase.execute).toHaveBeenCalledWith({
      query: searchQuery,
      page: 1,
      limit: 12,
      filters: {},
    })
  })

  it('loads products by category', async () => {
    const category = 'arabica'
    const mockCategoryProducts = [
      createMockCoffeeProduct({ varietals: ['Arabica'] }),
      createMockCoffeeProduct({ varietals: ['Arabica', 'Bourbon'] }),
    ]
    const mockResponse = createMockPaginatedResponse(mockCategoryProducts, 1, 12, 2)

    mockGetProductsByCategoryUseCase.execute.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.loadProductsByCategory(category)
    })

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.products).toEqual(mockCategoryProducts)
    expect(mockGetProductsByCategoryUseCase.execute).toHaveBeenCalledWith({
      category,
      page: 1,
      limit: 12,
      filters: {},
    })
  })

  it('applies filters correctly', async () => {
    const filters = {
      origin: 'Ethiopia',
      processingMethod: 'Washed',
      minPrice: 10,
      maxPrice: 50,
    }
    const mockResponse = createMockPaginatedResponse([], 1, 12, 0)

    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.setFilters(filters)
    })

    act(() => {
      result.current.loadProducts()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      limit: 12,
      filters,
    })
  })

  it('handles pagination correctly', async () => {
    const mockResponse = createMockPaginatedResponse([], 2, 12, 24)
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.setPage(2)
    })

    act(() => {
      result.current.loadProducts()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledWith({
      page: 2,
      limit: 12,
      filters: {},
    })
    expect(result.current.pagination.page).toBe(2)
  })

  it('changes page size correctly', async () => {
    const mockResponse = createMockPaginatedResponse([], 1, 24, 24)
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.setPageSize(24)
    })

    act(() => {
      result.current.loadProducts()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      limit: 24,
      filters: {},
    })
    expect(result.current.pagination.limit).toBe(24)
  })

  it('clears filters correctly', () => {
    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.setFilters({ origin: 'Ethiopia' })
    })

    expect(result.current.filters).toEqual({ origin: 'Ethiopia' })

    act(() => {
      result.current.clearFilters()
    })

    expect(result.current.filters).toEqual({})
  })

  it('refreshes products', async () => {
    const mockResponse = createMockPaginatedResponse([], 1, 12, 0)
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.refresh()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledTimes(1)
  })

  it('handles concurrent requests correctly', async () => {
    const mockResponse1 = createMockPaginatedResponse([createMockCoffeeProduct()], 1, 12, 1)
    const mockResponse2 = createMockPaginatedResponse([createMockCoffeeProduct()], 1, 12, 1)

    mockGetCoffeeProductsUseCase.execute
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2)

    const { result } = renderHook(() => useCoffeeProducts())

    // Start two concurrent requests
    act(() => {
      result.current.loadProducts()
      result.current.loadProducts()
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Should only call the use case twice (one for each request)
    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledTimes(2)
  })

  it('clears error when new request starts', async () => {
    // First request fails
    mockGetCoffeeProductsUseCase.execute.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useCoffeeProducts())

    act(() => {
      result.current.loadProducts()
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
    })

    // Second request succeeds
    const mockResponse = createMockPaginatedResponse([], 1, 12, 0)
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse)

    act(() => {
      result.current.loadProducts()
    })

    expect(result.current.error).toBeNull()

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })
})