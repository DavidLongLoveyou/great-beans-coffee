import { CoffeeProductEntity } from '@/domain/entities/coffee-product.entity';
import { ICoffeeProductRepository } from '@/infrastructure/database/repositories/coffee-product.repository';

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
  searchProducts(query: string, filters?: SearchFilters, page?: number, limit?: number): Promise<SearchResult<CoffeeProductEntity>>;
  getSearchSuggestions(query: string): Promise<string[]>;
  getPopularSearchTerms(): Promise<string[]>;
}

export class SearchService implements ISearchService {
  constructor(private coffeeProductRepository: ICoffeeProductRepository) {}

  async searchProducts(
    query: string, 
    filters: SearchFilters = {}, 
    page: number = 1, 
    limit: number = 20
  ): Promise<SearchResult<CoffeeProductEntity>> {
    try {
      console.log(`Searching products with query: "${query}"`);
      
      // Get all products first (in a real implementation, this would be optimized)
      const allProducts = await this.coffeeProductRepository.findAll();
      
      // Filter products based on query and filters
      let filteredProducts = allProducts.filter(product => {
        // Text search
        const matchesQuery = !query || 
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.origin.toLowerCase().includes(query.toLowerCase());
        
        // Category filter
        const matchesCategory = !filters.category || 
          product.category.toLowerCase() === filters.category.toLowerCase();
        
        // Origin filter
        const matchesOrigin = !filters.origin?.length || 
          filters.origin.some(origin => 
            product.origin.toLowerCase().includes(origin.toLowerCase())
          );
        
        // Grade filter
        const matchesGrade = !filters.grade?.length || 
          filters.grade.some(grade => 
            product.grade.toLowerCase().includes(grade.toLowerCase())
          );
        
        // Processing method filter
        const matchesProcessing = !filters.processingMethod?.length || 
          filters.processingMethod.some(method => 
            product.processingMethod.toLowerCase().includes(method.toLowerCase())
          );
        
        // Certifications filter
        const matchesCertifications = !filters.certifications?.length || 
          filters.certifications.some(cert => 
            product.certifications.some(productCert => 
              productCert.toLowerCase().includes(cert.toLowerCase())
            )
          );
        
        // Price range filter
        const matchesPrice = !filters.priceRange || 
          (product.pricePerKg >= filters.priceRange.min && 
           product.pricePerKg <= filters.priceRange.max);
        
        return matchesQuery && matchesCategory && matchesOrigin && 
               matchesGrade && matchesProcessing && matchesCertifications && matchesPrice;
      });
      
      // Calculate pagination
      const total = filteredProducts.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      // Get paginated results
      const items = filteredProducts.slice(startIndex, endIndex);
      
      console.log(`Found ${total} products matching search criteria`);
      
      return {
        items,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('Search failed:', error);
      return {
        items: [],
        total: 0,
        page,
        limit,
        totalPages: 0
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
        if (product.name.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.name);
        }
        if (product.origin.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.origin);
        }
        if (product.category.toLowerCase().includes(query.toLowerCase())) {
          suggestions.add(product.category);
        }
      });
      
      return Array.from(suggestions).slice(0, 10);
    } catch (error) {
      console.error('Failed to get search suggestions:', error);
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
        'Green Beans'
      ];
      
      return popularTerms;
    } catch (error) {
      console.error('Failed to get popular search terms:', error);
      return [];
    }
  }
}