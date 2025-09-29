import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { ICoffeeProductRepository, CoffeeProductFilters } from '@/infrastructure/database/repositories/coffee-product.repository';

export interface GetProductsByCategoryRequest {
  category: 'type' | 'grade' | 'origin' | 'processing';
  value: string;
  filters?: Omit<CoffeeProductFilters, 'type' | 'grade' | 'region' | 'processingMethod'>;
  locale?: string;
}

export interface GetProductsByCategoryResponse {
  products: CoffeeProductEntity[];
  total: number;
  category: string;
  value: string;
}

export class GetProductsByCategoryUseCase {
  constructor(private coffeeProductRepository: ICoffeeProductRepository) {}

  async execute(request: GetProductsByCategoryRequest): Promise<GetProductsByCategoryResponse> {
    const { category, value, filters = {}, locale } = request;

    try {
      let products: CoffeeProductEntity[] = [];

      // Build filters based on category
      const categoryFilters: CoffeeProductFilters = { ...filters };

      switch (category) {
        case 'type':
          categoryFilters.type = [value];
          products = await this.coffeeProductRepository.findAll(categoryFilters, locale);
          break;

        case 'grade':
          categoryFilters.grade = [value];
          products = await this.coffeeProductRepository.findAll(categoryFilters, locale);
          break;

        case 'origin':
          categoryFilters.region = [value];
          products = await this.coffeeProductRepository.findAll(categoryFilters, locale);
          break;

        case 'processing':
          categoryFilters.processingMethod = [value];
          products = await this.coffeeProductRepository.findAll(categoryFilters, locale);
          break;

        default:
          throw new Error(`Invalid category: ${category}`);
      }

      return {
        products,
        total: products.length,
        category,
        value
      };
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw new Error('Failed to fetch products by category');
    }
  }
}