// Coffee Product DTOs for application layer communication
import { CoffeeGrade, CoffeeVariety, ProcessingMethod, CoffeeCertification } from '@/shared/components/design-system/types';

export interface CoffeeProductDto {
  id: string;
  sku: string;
  name: {
    en: string;
    de?: string;
    ja?: string;
    fr?: string;
    it?: string;
    es?: string;
    nl?: string;
    ko?: string;
  };
  description: {
    en: string;
    de?: string;
    ja?: string;
    fr?: string;
    it?: string;
    es?: string;
    nl?: string;
    ko?: string;
  };
  variety: CoffeeVariety;
  grade: CoffeeGrade;
  processingMethod: ProcessingMethod;
  origin: {
    country: string;
    region: string;
    province?: string;
    farm?: string;
    altitude?: number;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  certifications: CoffeeCertification[];
  pricing: {
    basePrice: number;
    currency: string;
    unit: string;
    minimumOrder: number;
    priceBreaks?: Array<{
      quantity: number;
      price: number;
    }>;
  };
  availability: {
    status: 'IN_STOCK' | 'LIMITED' | 'OUT_OF_STOCK' | 'SEASONAL';
    quantity?: number;
    harvestSeason?: string;
    nextAvailable?: Date;
  };
  specifications: {
    moistureContent: number;
    screenSize: string;
    defectRate: number;
    cupping?: {
      score: number;
      notes: string[];
      aroma: number;
      flavor: number;
      acidity: number;
      body: number;
    };
  };
  images: Array<{
    url: string;
    alt: string;
    type: 'MAIN' | 'GALLERY' | 'CERTIFICATE' | 'FARM';
  }>;
  seoMetadata?: {
    title: string;
    description: string;
    keywords: string[];
    canonicalUrl?: string;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCoffeeProductDto {
  sku: string;
  name: CoffeeProductDto['name'];
  description: CoffeeProductDto['description'];
  variety: CoffeeVariety;
  grade: CoffeeGrade;
  processingMethod: ProcessingMethod;
  origin: CoffeeProductDto['origin'];
  certifications: CoffeeCertification[];
  pricing: CoffeeProductDto['pricing'];
  availability: CoffeeProductDto['availability'];
  specifications: CoffeeProductDto['specifications'];
  images: CoffeeProductDto['images'];
  seoMetadata?: CoffeeProductDto['seoMetadata'];
  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateCoffeeProductDto extends Partial<CreateCoffeeProductDto> {
  id: string;
}

export interface CoffeeProductSearchDto {
  query?: string;
  variety?: CoffeeVariety[];
  grade?: CoffeeGrade[];
  processingMethod?: ProcessingMethod[];
  origin?: string[];
  certifications?: CoffeeCertification[];
  priceRange?: {
    min: number;
    max: number;
  };
  availability?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'price' | 'grade' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CoffeeProductListDto {
  products: CoffeeProductDto[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}