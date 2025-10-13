import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { ICoffeeProductRepository } from '@/infrastructure/database/repositories/coffee-product.repository';
import { createScopedLogger } from '@/shared/utils/logger';

export interface GetFeaturedProductsRequest {
  limit?: number;
  locale?: string;
}

export interface GetFeaturedProductsResponse {
  products: CoffeeProductEntity[];
  total: number;
}

export class GetFeaturedProductsUseCase {
  private logger = createScopedLogger('GetFeaturedProductsUseCase');

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
      // Application layer error logging removed for production
      throw new Error('Failed to fetch featured products');
    }
  }
}
