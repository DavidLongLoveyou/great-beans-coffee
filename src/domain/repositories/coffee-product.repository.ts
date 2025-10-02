import {
  CoffeeProductEntity,
  type CoffeeProduct,
  type CoffeeType,
  type CoffeeGrade,
  type ProcessingMethod,
  type Certification,
  type MultilingualContent,
} from '../entities/coffee-product.entity';

// Search and filter criteria
export interface CoffeeProductSearchCriteria {
  // Basic filters
  type?: CoffeeType | CoffeeType[];
  grade?: CoffeeGrade | CoffeeGrade[];
  processingMethod?: ProcessingMethod | ProcessingMethod[];
  certifications?: Certification | Certification[];

  // Origin filters
  origin?: string | string[];
  region?: string | string[];
  farm?: string | string[];
  altitude?: {
    min?: number;
    max?: number;
  };

  // Quality filters
  cuppingScore?: {
    min?: number;
    max?: number;
  };
  moistureContent?: {
    min?: number;
    max?: number;
  };
  screenSize?: string | string[];

  // Availability filters
  isAvailable?: boolean;
  minQuantity?: number;
  maxQuantity?: number;

  // Pricing filters
  priceRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };

  // Text search
  searchTerm?: string; // Search in name, description, tasting notes

  // Localization
  locale?: string;

  // Pagination and sorting
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'price' | 'cuppingScore' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CoffeeProductSearchResult {
  products: CoffeeProductEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CoffeeProductAnalytics {
  totalProducts: number;
  productsByType: Record<CoffeeType, number>;
  productsByGrade: Record<CoffeeGrade, number>;
  productsByOrigin: Record<string, number>;
  averageCuppingScore: number;
  totalAvailableQuantity: number;
  priceStatistics: {
    min: number;
    max: number;
    average: number;
    median: number;
    currency: string;
  };
}

// Repository interface
export interface ICoffeeProductRepository {
  // Basic CRUD operations
  findById(id: string): Promise<CoffeeProductEntity | null>;
  findBySku(sku: string): Promise<CoffeeProductEntity | null>;
  findAll(): Promise<CoffeeProductEntity[]>;
  create(
    product: Omit<CoffeeProduct, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CoffeeProductEntity>;
  update(
    id: string,
    updates: Partial<CoffeeProduct>
  ): Promise<CoffeeProductEntity>;
  delete(id: string): Promise<void>;

  // Advanced search and filtering
  search(
    criteria: CoffeeProductSearchCriteria
  ): Promise<CoffeeProductSearchResult>;
  findByType(type: CoffeeType): Promise<CoffeeProductEntity[]>;
  findByGrade(grade: CoffeeGrade): Promise<CoffeeProductEntity[]>;
  findByOrigin(origin: string): Promise<CoffeeProductEntity[]>;
  findByCertification(
    certification: Certification
  ): Promise<CoffeeProductEntity[]>;

  // Availability and inventory
  findAvailable(minQuantity?: number): Promise<CoffeeProductEntity[]>;
  updateAvailability(
    id: string,
    quantity: number,
    unit: string
  ): Promise<CoffeeProductEntity>;
  reserveQuantity(
    id: string,
    quantity: number,
    reservationId: string
  ): Promise<boolean>;
  releaseReservation(id: string, reservationId: string): Promise<boolean>;

  // Pricing operations
  updatePricing(
    id: string,
    pricing: CoffeeProduct['pricing']
  ): Promise<CoffeeProductEntity>;
  findByPriceRange(
    min: number,
    max: number,
    currency: string
  ): Promise<CoffeeProductEntity[]>;

  // Quality and specifications
  findByCuppingScore(
    minScore: number,
    maxScore?: number
  ): Promise<CoffeeProductEntity[]>;
  updateQualitySpecs(
    id: string,
    specs: CoffeeProduct['specifications']
  ): Promise<CoffeeProductEntity>;

  // Multilingual content
  findByLocale(locale: string): Promise<CoffeeProductEntity[]>;
  updateTranslation(
    id: string,
    locale: string,
    content: MultilingualContent
  ): Promise<CoffeeProductEntity>;

  // Bulk operations
  createMany(
    products: Omit<CoffeeProduct, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<CoffeeProductEntity[]>;
  updateMany(
    updates: Array<{ id: string; data: Partial<CoffeeProduct> }>
  ): Promise<CoffeeProductEntity[]>;
  deleteMany(ids: string[]): Promise<void>;

  // Analytics and reporting
  getAnalytics(): Promise<CoffeeProductAnalytics>;
  getPopularProducts(limit?: number): Promise<CoffeeProductEntity[]>;
  getLowStockProducts(threshold?: number): Promise<CoffeeProductEntity[]>;

  // Featured and recommendations
  findFeatured(): Promise<CoffeeProductEntity[]>;
  setFeatured(id: string, featured: boolean): Promise<CoffeeProductEntity>;
  findSimilar(id: string, limit?: number): Promise<CoffeeProductEntity[]>;
  findRecommended(
    criteria: Partial<CoffeeProductSearchCriteria>,
    limit?: number
  ): Promise<CoffeeProductEntity[]>;

  // Import/Export
  exportToCSV(criteria?: CoffeeProductSearchCriteria): Promise<string>;
  importFromCSV(
    csvData: string
  ): Promise<{ success: number; errors: string[] }>;

  // Audit and history
  getHistory(id: string): Promise<
    Array<{
      timestamp: Date;
      changes: Partial<CoffeeProduct>;
      changedBy: string;
    }>
  >;

  // Cache management
  clearCache(): Promise<void>;
  warmCache(): Promise<void>;
}
