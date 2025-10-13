import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import {
  ICoffeeProductRepository,
  CoffeeProductFilters,
} from '@/infrastructure/database/repositories/coffee-product.repository';
import { createScopedLogger } from '@/shared/utils/logger';

export interface GetProductsByCategoryRequest {
  category: 'type' | 'grade' | 'origin' | 'processing';
  value: string;
  filters?: Omit<
    CoffeeProductFilters,
    'type' | 'grade' | 'region' | 'processingMethod'
  >;
  locale?: string;
}

export interface GetProductsByCategoryResponse {
  products: CoffeeProductEntity[];
  total: number;
  category: string;
  value: string;
}

export class GetProductsByCategoryUseCase {
  private logger = createScopedLogger('GetProductsByCategoryUseCase');

  constructor(private coffeeProductRepository: ICoffeeProductRepository) {}

  async execute(
    request: GetProductsByCategoryRequest
  ): Promise<GetProductsByCategoryResponse> {
    const { category, value, filters = {}, locale } = request;

    try {
      let products: CoffeeProductEntity[] = [];

      // Build filters based on category
      const categoryFilters: CoffeeProductFilters = { ...filters };

      switch (category) {
        case 'type':
          categoryFilters.type = [value];
          products = await this.coffeeProductRepository.findAll(
            categoryFilters,
            locale
          );
          break;

        case 'grade':
          categoryFilters.grade = [value];
          products = await this.coffeeProductRepository.findAll(
            categoryFilters,
            locale
          );
          break;

        case 'origin':
          categoryFilters.region = [value];
          products = await this.coffeeProductRepository.findAll(
            categoryFilters,
            locale
          );
          break;

        case 'processing':
          categoryFilters.processingMethod = [value];
          products = await this.coffeeProductRepository.findAll(
            categoryFilters,
            locale
          );
          break;

        default:
          throw new Error(`Invalid category: ${category}`);
      }

      return {
        products,
        total: products.length,
        category,
        value,
      };
    } catch (error) {
      // Application layer error logging removed for production
      throw new Error('Failed to fetch products by category');
    }
  }
}
