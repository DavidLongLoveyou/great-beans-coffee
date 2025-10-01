import {
  BusinessServiceEntity,
  type BusinessService,
  type ServiceType,
  type ServiceCategory,
  type PricingModel,
} from '../entities/business-service.entity';

// Search and filter criteria
export interface BusinessServiceSearchCriteria {
  // Basic filters
  type?: ServiceType | ServiceType[];
  category?: ServiceCategory | ServiceCategory[];
  pricingModel?: PricingModel | PricingModel[];

  // Availability filters
  isActive?: boolean;
  isAvailable?: boolean;

  // Capacity filters
  minCapacity?: number;
  maxCapacity?: number;

  // Timeline filters
  maxLeadTime?: number; // in days

  // Requirements filters
  hasMinimumOrder?: boolean;
  acceptsCustomRequirements?: boolean;

  // Text search
  searchTerm?: string; // Search in name, description, capabilities

  // Localization
  locale?: string;

  // Pagination and sorting
  page?: number;
  limit?: number;
  sortBy?:
    | 'name'
    | 'type'
    | 'leadTime'
    | 'capacity'
    | 'createdAt'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface BusinessServiceSearchResult {
  services: BusinessServiceEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface BusinessServiceAnalytics {
  totalServices: number;
  servicesByType: Record<ServiceType, number>;
  servicesByCategory: Record<ServiceCategory, number>;
  servicesByPricingModel: Record<PricingModel, number>;
  averageLeadTime: number;
  totalCapacity: number;
  utilizationRate: number;
  popularServices: Array<{ serviceId: string; requestCount: number }>;
}

export interface ServiceCapacityInfo {
  serviceId: string;
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  utilizationPercentage: number;
  nextAvailableSlot?: Date;
}

// Repository interface
export interface IBusinessServiceRepository {
  // Basic CRUD operations
  findById(id: string): Promise<BusinessServiceEntity | null>;
  findBySlug(slug: string): Promise<BusinessServiceEntity | null>;
  findAll(): Promise<BusinessServiceEntity[]>;
  create(
    service: Omit<BusinessService, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<BusinessServiceEntity>;
  update(
    id: string,
    updates: Partial<BusinessService>
  ): Promise<BusinessServiceEntity>;
  delete(id: string): Promise<void>;

  // Advanced search and filtering
  search(
    criteria: BusinessServiceSearchCriteria
  ): Promise<BusinessServiceSearchResult>;
  findByType(type: ServiceType): Promise<BusinessServiceEntity[]>;
  findByCategory(category: ServiceCategory): Promise<BusinessServiceEntity[]>;
  findByPricingModel(
    pricingModel: PricingModel
  ): Promise<BusinessServiceEntity[]>;

  // Availability and capacity management
  findAvailable(): Promise<BusinessServiceEntity[]>;
  getCapacityInfo(id: string): Promise<ServiceCapacityInfo>;
  getAllCapacityInfo(): Promise<ServiceCapacityInfo[]>;
  updateCapacity(id: string, capacity: number): Promise<BusinessServiceEntity>;
  reserveCapacity(
    id: string,
    amount: number,
    reservationId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean>;
  releaseCapacity(id: string, reservationId: string): Promise<boolean>;

  // Service requirements and capabilities
  findByRequirements(
    requirements: Record<string, any>
  ): Promise<BusinessServiceEntity[]>;
  updateRequirements(
    id: string,
    requirements: BusinessService['requirements']
  ): Promise<BusinessServiceEntity>;
  updateCapabilities(
    id: string,
    capabilities: BusinessService['capabilities']
  ): Promise<BusinessServiceEntity>;

  // Pricing operations
  updatePricing(
    id: string,
    pricing: BusinessService['pricing']
  ): Promise<BusinessServiceEntity>;
  findByPriceRange(
    min: number,
    max: number,
    currency: string
  ): Promise<BusinessServiceEntity[]>;
  calculateServiceCost(
    id: string,
    quantity: number,
    customRequirements?: Record<string, any>
  ): Promise<number>;

  // Timeline and scheduling
  findByLeadTime(maxDays: number): Promise<BusinessServiceEntity[]>;
  updateDeliveryTimeline(
    id: string,
    timeline: BusinessService['deliveryTimeline']
  ): Promise<BusinessServiceEntity>;
  getAvailableSlots(
    id: string,
    startDate: Date,
    endDate: Date
  ): Promise<Date[]>;

  // Process management
  updateProcessSteps(
    id: string,
    steps: BusinessService['processSteps']
  ): Promise<BusinessServiceEntity>;
  getProcessTemplate(
    type: ServiceType
  ): Promise<BusinessService['processSteps']>;

  // Multilingual content
  findByLocale(locale: string): Promise<BusinessServiceEntity[]>;
  updateTranslation(
    id: string,
    locale: string,
    content: BusinessService['multilingualContent'][string]
  ): Promise<BusinessServiceEntity>;

  // Service status management
  activate(id: string): Promise<BusinessServiceEntity>;
  deactivate(id: string): Promise<BusinessServiceEntity>;
  setAvailability(
    id: string,
    available: boolean
  ): Promise<BusinessServiceEntity>;

  // Bulk operations
  createMany(
    services: Omit<BusinessService, 'id' | 'createdAt' | 'updatedAt'>[]
  ): Promise<BusinessServiceEntity[]>;
  updateMany(
    updates: Array<{ id: string; data: Partial<BusinessService> }>
  ): Promise<BusinessServiceEntity[]>;
  deleteMany(ids: string[]): Promise<void>;

  // Analytics and reporting
  getAnalytics(): Promise<BusinessServiceAnalytics>;
  getPopularServices(limit?: number): Promise<BusinessServiceEntity[]>;
  getUnderutilizedServices(
    threshold?: number
  ): Promise<BusinessServiceEntity[]>;
  getServicePerformance(id: string): Promise<{
    requestCount: number;
    completionRate: number;
    averageRating: number;
    averageDeliveryTime: number;
  }>;

  // Featured and recommendations
  findFeatured(): Promise<BusinessServiceEntity[]>;
  setFeatured(id: string, featured: boolean): Promise<BusinessServiceEntity>;
  findSimilar(id: string, limit?: number): Promise<BusinessServiceEntity[]>;
  findRecommended(
    criteria: Partial<BusinessServiceSearchCriteria>,
    limit?: number
  ): Promise<BusinessServiceEntity[]>;

  // Service combinations and packages
  findCompatibleServices(serviceId: string): Promise<BusinessServiceEntity[]>;
  createServicePackage(
    name: string,
    serviceIds: string[],
    discount?: number
  ): Promise<string>;
  getServicePackages(): Promise<
    Array<{
      id: string;
      name: string;
      services: BusinessServiceEntity[];
      discount: number;
      totalPrice: number;
    }>
  >;

  // Quality and compliance
  updateQualityStandards(
    id: string,
    standards: string[]
  ): Promise<BusinessServiceEntity>;
  findByQualityStandard(standard: string): Promise<BusinessServiceEntity[]>;
  getCertifications(id: string): Promise<string[]>;
  updateCertifications(
    id: string,
    certifications: string[]
  ): Promise<BusinessServiceEntity>;

  // Client and project management
  getServiceHistory(clientId: string): Promise<
    Array<{
      serviceId: string;
      projectId: string;
      startDate: Date;
      endDate: Date;
      status: string;
      satisfaction: number;
    }>
  >;

  // Import/Export
  exportToCSV(criteria?: BusinessServiceSearchCriteria): Promise<string>;
  importFromCSV(
    csvData: string
  ): Promise<{ success: number; errors: string[] }>;

  // Audit and history
  getHistory(id: string): Promise<
    Array<{
      timestamp: Date;
      changes: Partial<BusinessService>;
      changedBy: string;
    }>
  >;

  // Cache management
  clearCache(): Promise<void>;
  warmCache(): Promise<void>;
}
