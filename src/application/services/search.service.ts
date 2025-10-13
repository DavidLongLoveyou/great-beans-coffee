import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { ICoffeeProductRepository } from '@/infrastructure/database/repositories/coffee-product.repository';
import { createScopedLogger } from '@/shared/utils/logger';

export interface SearchFilters {
  category?: string;
  origin?: string[];
  grade?: string[];
  processingMethod?: string[];
  certifications?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ISearchService {
  searchProducts(
    query: string,
    filters?: SearchFilters,
    page?: number,
    limit?: number
  ): Promise<SearchResult<CoffeeProductEntity>>;
  getSearchSuggestions(query: string): Promise<string[]>;
  getPopularSearchTerms(): Promise<string[]>;
}

export class SearchService implements ISearchService {
  private logger = createScopedLogger('SearchService');

  constructor(private coffeeProductRepository: ICoffeeProductRepository) {}

  async searchProducts(
    query: string,
    filters: SearchFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<SearchResult<CoffeeProductEntity>> {
    try {
      // Get all products first (in a real implementation, this would be optimized)
      const allProducts = await this.coffeeProductRepository.findAll();

      // Filter products based on query and filters
      let filteredProducts = allProducts.filter(product => {
        // Text search - handle multilingual properties using getters
        const productName = product.name?.en || '';
        const productDescription = product.description?.en || '';
        const productOriginData = product.origin;
        const productOrigin = productOriginData?.region || '';

        const matchesQuery =
          !query ||
          productName.toLowerCase().includes(query.toLowerCase()) ||
          productDescription.toLowerCase().includes(query.toLowerCase()) ||
          productOrigin.toLowerCase().includes(query.toLowerCase());

        // Category filter (using type instead of category)
        const matchesCategory =
          !filters.category ||
          product.type.toLowerCase() === filters.category.toLowerCase();

        // Origin filter
        const matchesOrigin =
          !filters.origin?.length ||
          filters.origin.some(origin =>
            productOrigin.toLowerCase().includes(origin.toLowerCase())
          );

        // Grade filter
        const matchesGrade =
          !filters.grade?.length ||
          filters.grade.some(grade =>
            product.grade.toLowerCase().includes(grade.toLowerCase())
          );

        // Processing method filter
        const matchesProcessing =
          !filters.processingMethod?.length ||
          filters.processingMethod.some(method =>
            product.processingMethod
              .toLowerCase()
              .includes(method.toLowerCase())
          );

        // Certifications filter - use hasCertification method
        const matchesCertifications =
          !filters.certifications?.length ||
          filters.certifications.some(cert =>
            product.hasCertification(cert as any)
          );

        // Price range filter (using pricing.basePrice)
        const matchesPrice =
          !filters.priceRange ||
          (product.pricing.basePrice >= filters.priceRange.min &&
            product.pricing.basePrice <= filters.priceRange.max);

        return (
          matchesQuery &&
          matchesCategory &&
          matchesOrigin &&
          matchesGrade &&
          matchesProcessing &&
          matchesCertifications &&
          matchesPrice
        );
      });

      // Calculate pagination
      const total = filteredProducts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      // Get paginated results
      const items = filteredProducts.slice(startIndex, endIndex);

      return {
        items,
        total,
        page,
        limit,
        totalPages,
      };
    } catch (error) {
      // Application layer error logging removed for production
      return {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
      };
    }
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      if (!query || query.length < 2) {
        return [];
      }

      const allProducts = await this.coffeeProductRepository.findAll();
      const suggestions = new Set<string>();

      // Extract suggestions from product names, origins, and categories
      allProducts.forEach(product => {
        const productName = product.name?.en || '';
        const productOriginData = product.origin;
        const productOrigin = productOriginData?.region || '';

        if (productName.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(productName);
        }
        if (productOrigin.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(productOrigin);
        }
        if (product.type.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.type);
        }
      });

      return Array.from(suggestions).slice(0, 10);
    } catch (error) {
      // Application layer error logging removed for production
      return [];
    }
  }

  async getPopularSearchTerms(): Promise<string[]> {
    try {
      // In a real implementation, this would come from analytics data
      const popularTerms = [
        'Robusta',
        'Arabica',
        'Organic',
        'Fair Trade',
        'Dak Lak',
        'Gia Lai',
        'Premium',
        'Specialty',
        'Instant Coffee',
        'Green Beans',
      ];

      return popularTerms;
    } catch (error) {
      // Application layer error logging removed for production
      return [];
    }
  }
}
