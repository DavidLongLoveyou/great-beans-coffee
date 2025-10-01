import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { ICoffeeProductRepository } from '@/infrastructure/database/repositories/coffee-product.repository';

export interface GetFeaturedProductsRequest {
  limit?: number;
  locale?: string;
}

export interface GetFeaturedProductsResponse {
  products: CoffeeProductEntity[];
  total: number;
}

export class GetFeaturedProductsUseCase {
  constructor(private coffeeProductRepository: ICoffeeProductRepository) {}

  async execute(
    request: GetFeaturedProductsRequest
  ): Promise<GetFeaturedProductsResponse> {
    const { limit = 6, locale } = request;

    try {
      // Get featured products
      const products = await this.coffeeProductRepository.findFeatured(
        limit,
        locale
      );

      return {
        products,
        total: products.length,
      };
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw new Error('Failed to fetch featured products');
    }
  }
}
