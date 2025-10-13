import { renderHook, act, waitFor } from '@testing-library/react';

import { createMockCoffeeProduct } from '@/test/utils';

import { useCoffeeProducts } from '../use-coffee-products';

// Mock the DI container exports
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
}));

// Get the mocked use cases after mocking
const mockGetCoffeeProductsUseCase = jest.requireMock(
  '@/infrastructure/di/container'
).getCoffeeProductsUseCase;

describe('useCoffeeProducts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() =>
      useCoffeeProducts({ autoFetch: false })
    );

    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.fetchProducts).toBe('function');
    expect(typeof result.current.refetch).toBe('function');
  });

  it('fetches products successfully', async () => {
    const mockProducts = [
      createMockCoffeeProduct({ name: 'Ethiopian Yirgacheffe' }),
      createMockCoffeeProduct({ name: 'Colombian Supremo' }),
    ];
    const mockResponse = {
      products: mockProducts,
      total: 2,
      hasMore: false,
    };
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useCoffeeProducts({ autoFetch: false })
    );

    await act(async () => {
      await result.current.fetchProducts();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(result.current.error).toBeNull();
    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledWith({});
  });

  it('handles loading error', async () => {
    const errorMessage = 'Failed to load products';
    mockGetCoffeeProductsUseCase.execute.mockRejectedValue(
      new Error(errorMessage)
    );

    const { result } = renderHook(() =>
      useCoffeeProducts({ autoFetch: false })
    );

    await act(async () => {
      await result.current.fetchProducts();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.products).toEqual([]);
  });

  it('fetches featured products correctly', async () => {
    const mockFeaturedProducts = [
      createMockCoffeeProduct({ name: 'Premium Geisha', isFeatured: true }),
      createMockCoffeeProduct({ name: 'Blue Mountain', isFeatured: true }),
    ];
    const mockResponse = {
      products: mockFeaturedProducts,
      total: 2,
      hasMore: false,
    };
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useCoffeeProducts({ autoFetch: false })
    );

    await act(async () => {
      await result.current.fetchProducts({ featured: true });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockFeaturedProducts);
    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledWith({
      filters: { featured: true },
    });
  });

  it('searches products correctly', async () => {
    const mockSearchResults = [
      createMockCoffeeProduct({ name: 'Ethiopian Yirgacheffe' }),
      createMockCoffeeProduct({ name: 'Ethiopian Sidamo' }),
    ];
    const mockResponse = {
      products: mockSearchResults,
      total: 2,
      hasMore: false,
    };
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useCoffeeProducts({ autoFetch: false })
    );

    await act(async () => {
      await result.current.fetchProducts({});
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockSearchResults);
    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledWith({
      filters: {},
    });
  });

  it('fetches products by category correctly', async () => {
    const category = 'arabica';
    const mockCategoryProducts = [
      createMockCoffeeProduct({ varietals: ['Arabica'] }),
      createMockCoffeeProduct({ varietals: ['Arabica', 'Bourbon'] }),
    ];
    const mockResponse = {
      products: mockCategoryProducts,
      total: 2,
      hasMore: false,
    };
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useCoffeeProducts({ autoFetch: false })
    );

    await act(async () => {
      await result.current.fetchProducts({ type: [category] });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.products).toEqual(mockCategoryProducts);
    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledWith({
      filters: { type: [category] },
    });
  });

  it('fetches products with filters correctly', async () => {
    const filters = { region: ['Vietnam'], inStock: true };
    const mockResponse = {
      products: [],
      total: 0,
      hasMore: false,
    };
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useCoffeeProducts({ autoFetch: false })
    );

    await act(async () => {
      await result.current.fetchProducts(filters);
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalledWith({
      filters,
    });
  });

  it('handles refetch correctly', async () => {
    const mockResponse = {
      products: [],
      total: 0,
      hasMore: false,
    };
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useCoffeeProducts({ autoFetch: false })
    );

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockGetCoffeeProductsUseCase.execute).toHaveBeenCalled();
  });

  it('handles multiple consecutive requests correctly', async () => {
    // First request fails
    mockGetCoffeeProductsUseCase.execute.mockRejectedValueOnce(
      new Error('Network error')
    );

    const { result } = renderHook(() =>
      useCoffeeProducts({ autoFetch: false })
    );

    await act(async () => {
      await result.current.fetchProducts();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');

    // Second request succeeds
    const mockResponse = {
      products: [],
      total: 0,
      hasMore: false,
    };
    mockGetCoffeeProductsUseCase.execute.mockResolvedValue(mockResponse);

    await act(async () => {
      await result.current.fetchProducts();
    });

    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });
});
