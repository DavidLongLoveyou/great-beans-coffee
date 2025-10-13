import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { ICoffeeProductRepository } from '@/infrastructure/database/repositories/coffee-product.repository';
import { createScopedLogger } from '@/shared/utils/logger';

export interface GetCoffeeProductBySlugRequest {
  slug: string;
  locale?: string;
}

export interface GetCoffeeProductBySlugResponse {
  product: CoffeeProductEntity | null;
  relatedProducts: CoffeeProductEntity[];
}

export class GetCoffeeProductBySlugUseCase {
  private logger = createScopedLogger('GetCoffeeProductBySlugUseCase');

  constructor(private coffeeProductRepository: ICoffeeProductRepository) {}

  async execute(
    request: GetCoffeeProductBySlugRequest
  ): Promise<GetCoffeeProductBySlugResponse> {
    const { slug, locale } = request;

    try {
      // Get the main product
      const product = await this.coffeeProductRepository.findBySlug(
        slug,
        locale
      );

      if (!product) {
        return {
          product: null,
          relatedProducts: [],
        };
      }

      // Get related products (same type or origin)
      const relatedProducts = await this.getRelatedProducts(product, locale);

      return {
        product,
        relatedProducts,
      };
    } catch (error) {
      // Application layer error logging removed for production
      throw new Error('Failed to fetch coffee product');
    }
  }

  private async getRelatedProducts(
    product: CoffeeProductEntity,
    locale?: string
  ): Promise<CoffeeProductEntity[]> {
    try {
      // First try to get products of the same type
      let relatedProducts =
        await this.coffeeProductRepository.getProductsByType(
          product.type,
          locale
        );

      // Filter out the current product
      relatedProducts = relatedProducts.filter(p => p.id !== product.id);

      // If we don't have enough, add products from the same origin
      const productOrigin = product.origin;
      if (relatedProducts.length < 4 && productOrigin?.region) {
        const originProducts =
          await this.coffeeProductRepository.getProductsByOrigin(
            productOrigin.region,
            locale
          );

        // Add products that aren't already in the list
        const additionalProducts = originProducts.filter(
          p =>
            p.id !== product.id && !relatedProducts.some(rp => rp.id === p.id)
        );

        relatedProducts = [...relatedProducts, ...additionalProducts];
      }

      // Return max 4 related products
      return relatedProducts.slice(0, 4);
    } catch (error) {
      // Application layer error logging removed for production
      return [];
    }
  }
}
