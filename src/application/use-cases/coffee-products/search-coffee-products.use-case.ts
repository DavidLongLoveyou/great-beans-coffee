import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { ICoffeeProductRepository } from '@/infrastructure/database/repositories/coffee-product.repository';

export interface SearchCoffeeProductsRequest {
  query: string;
  locale?: string;
  limit?: number;
}

export interface SearchCoffeeProductsResponse {
  products: CoffeeProductEntity[];
  total: number;
  query: string;
}

export class SearchCoffeeProductsUseCase {
  constructor(private coffeeProductRepository: ICoffeeProductRepository) {}

  async execute(
    request: SearchCoffeeProductsRequest
  ): Promise<SearchCoffeeProductsResponse> {
    const { query, locale, limit = 20 } = request;

    try {
      // Validate query
      if (!query || query.trim().length < 2) {
        return {
          products: [],
          total: 0,
          query: query.trim(),
        };
      }

      // Search products
      const allProducts = await this.coffeeProductRepository.search(
        query.trim(),
        locale
      );

      // Apply limit
      const products = limit ? allProducts.slice(0, limit) : allProducts;

      return {
        products,
        total: allProducts.length,
        query: query.trim(),
      };
    } catch (error) {
      console.error('Error searching coffee products:', error);
      throw new Error('Failed to search coffee products');
    }
  }
}
