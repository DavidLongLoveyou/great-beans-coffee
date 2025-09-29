import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { ICoffeeProductRepository, CoffeeProductFilters } from '@/infrastructure/database/repositories/coffee-product.repository';

export interface GetCoffeeProductsRequest {
  filters?: CoffeeProductFilters;
  locale?: string;
}

export interface GetCoffeeProductsResponse {
  products: CoffeeProductEntity[];
  total: number;
  hasMore: boolean;
}

export class GetCoffeeProductsUseCase {
  constructor(private coffeeProductRepository: ICoffeeProductRepository) {}

  async execute(request: GetCoffeeProductsRequest): Promise<GetCoffeeProductsResponse> {
    const { filters, locale } = request;

    try {
      // Get products with filters
      const products = await this.coffeeProductRepository.findAll(filters, locale);

      // Calculate pagination info
      const total = products.length;
      const hasMore = filters?.limit ? total >= filters.limit : false;

      return {
        products,
        total,
        hasMore
      };
    } catch (error) {
      console.error('Error fetching coffee products:', error);
      throw new Error('Failed to fetch coffee products');
    }
  }
}