// Dependency Injection Container
// This file wires up all dependencies for the application

// External libraries
import { PrismaClient } from '@prisma/client';

// Application services
import { AnalyticsService } from '@/application/services/analytics.service';
import { CacheService } from '@/application/services/cache.service';
import { createEmailService } from '@/application/services/email.service';
import type { IEmailService } from '@/application/services/email.service';
import { FileUploadService } from '@/application/services/file-upload.service';
import { NotificationService, DefaultNotificationService } from '@/application/services/notification.service';
import { SearchService } from '@/application/services/search.service';
import { SEOService } from '@/application/services/seo.service';
import { TranslationService } from '@/application/services/translation.service';
// Use cases
import {
  GetCoffeeProductsUseCase,
  GetCoffeeProductBySlugUseCase,
  SearchCoffeeProductsUseCase,
  GetFeaturedProductsUseCase,
  GetProductsByCategoryUseCase,
} from '@/application/use-cases/coffee-products';
import {
  SubmitRfqUseCase,
  GetRfqByIdUseCase,
  GetRfqsUseCase,
  UpdateRfqStatusUseCase,
} from '@/application/use-cases/rfq-management';
// Infrastructure repositories
import { CoffeeProductRepository } from '@/infrastructure/database/repositories/coffee-product.repository';
import { ContentRepository } from '@/infrastructure/database/repositories/content.repository';
import { RFQRepositoryAdapter } from '@/infrastructure/database/repositories/rfq-repository-adapter';
import type { IRFQRepository } from '@/domain/repositories/rfq.repository';

// Database connection

class DIContainer {
  private static instance: DIContainer;
  private _prisma: PrismaClient | null = null;

  // Repositories
  private _coffeeProductRepository: CoffeeProductRepository | null = null;
  private _rfqRepository: IRFQRepository | null = null;
  private _contentRepository: ContentRepository | null = null;

  // Services
  private _emailService: IEmailService | null = null;
  private _notificationService: NotificationService | null = null;
  private _fileUploadService: FileUploadService | null = null;
  private _cacheService: CacheService | null = null;
  private _searchService: SearchService | null = null;
  private _translationService: TranslationService | null = null;
  private _analyticsService: AnalyticsService | null = null;
  private _seoService: SEOService | null = null;

  // Use Cases - Coffee Products
  private _getCoffeeProductsUseCase: GetCoffeeProductsUseCase | null = null;
  private _getCoffeeProductBySlugUseCase: GetCoffeeProductBySlugUseCase | null =
    null;
  private _searchCoffeeProductsUseCase: SearchCoffeeProductsUseCase | null =
    null;
  private _getFeaturedProductsUseCase: GetFeaturedProductsUseCase | null = null;
  private _getProductsByCategoryUseCase: GetProductsByCategoryUseCase | null =
    null;

  // Use Cases - RFQ Management
  private _submitRfqUseCase: SubmitRfqUseCase | null = null;
  private _getRfqByIdUseCase: GetRfqByIdUseCase | null = null;
  private _getRfqsUseCase: GetRfqsUseCase | null = null;
  private _updateRfqStatusUseCase: UpdateRfqStatusUseCase | null = null;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Database
  get prisma(): PrismaClient {
    if (!this._prisma) {
      this._prisma = new PrismaClient();
    }
    return this._prisma;
  }

  // Repositories
  get coffeeProductRepository(): CoffeeProductRepository {
    if (!this._coffeeProductRepository) {
      this._coffeeProductRepository = new CoffeeProductRepository();
    }
    return this._coffeeProductRepository;
  }

  get rfqRepository(): IRFQRepository {
    if (!this._rfqRepository) {
      this._rfqRepository = new RFQRepositoryAdapter();
    }
    return this._rfqRepository;
  }

  get contentRepository(): ContentRepository {
    if (!this._contentRepository) {
      this._contentRepository = new ContentRepository();
    }
    return this._contentRepository;
  }

  // Services
  get emailService(): IEmailService {
    if (!this._emailService) {
      this._emailService = createEmailService();
    }
    return this._emailService;
  }

  get notificationService(): NotificationService {
    if (!this._notificationService) {
      this._notificationService = new DefaultNotificationService(this.emailService);
    }
    return this._notificationService;
  }

  get fileUploadService(): FileUploadService {
    if (!this._fileUploadService) {
      this._fileUploadService = new FileUploadService();
    }
    return this._fileUploadService;
  }

  get cacheService(): CacheService {
    if (!this._cacheService) {
      this._cacheService = new CacheService();
    }
    return this._cacheService;
  }

  get searchService(): SearchService {
    if (!this._searchService) {
      this._searchService = new SearchService(this.coffeeProductRepository);
    }
    return this._searchService;
  }

  get translationService(): TranslationService {
    if (!this._translationService) {
      this._translationService = new TranslationService();
    }
    return this._translationService;
  }

  get analyticsService(): AnalyticsService {
    if (!this._analyticsService) {
      this._analyticsService = new AnalyticsService();
    }
    return this._analyticsService;
  }

  get seoService(): SEOService {
    if (!this._seoService) {
      this._seoService = new SEOService();
    }
    return this._seoService;
  }

  // Use Cases - Coffee Products
  get getCoffeeProductsUseCase(): GetCoffeeProductsUseCase {
    if (!this._getCoffeeProductsUseCase) {
      this._getCoffeeProductsUseCase = new GetCoffeeProductsUseCase(
        this.coffeeProductRepository
      );
    }
    return this._getCoffeeProductsUseCase;
  }

  get getCoffeeProductBySlugUseCase(): GetCoffeeProductBySlugUseCase {
    if (!this._getCoffeeProductBySlugUseCase) {
      this._getCoffeeProductBySlugUseCase = new GetCoffeeProductBySlugUseCase(
        this.coffeeProductRepository
      );
    }
    return this._getCoffeeProductBySlugUseCase;
  }

  get searchCoffeeProductsUseCase(): SearchCoffeeProductsUseCase {
    if (!this._searchCoffeeProductsUseCase) {
      this._searchCoffeeProductsUseCase = new SearchCoffeeProductsUseCase(
        this.coffeeProductRepository
      );
    }
    return this._searchCoffeeProductsUseCase;
  }

  get getFeaturedProductsUseCase(): GetFeaturedProductsUseCase {
    if (!this._getFeaturedProductsUseCase) {
      this._getFeaturedProductsUseCase = new GetFeaturedProductsUseCase(
        this.coffeeProductRepository
      );
    }
    return this._getFeaturedProductsUseCase;
  }

  get getProductsByCategoryUseCase(): GetProductsByCategoryUseCase {
    if (!this._getProductsByCategoryUseCase) {
      this._getProductsByCategoryUseCase = new GetProductsByCategoryUseCase(
        this.coffeeProductRepository
      );
    }
    return this._getProductsByCategoryUseCase;
  }

  // Use Cases - RFQ Management
  get submitRfqUseCase(): SubmitRfqUseCase {
    if (!this._submitRfqUseCase) {
      this._submitRfqUseCase = new SubmitRfqUseCase(
        this.rfqRepository,
        this.emailService,
        this.notificationService
      );
    }
    return this._submitRfqUseCase;
  }

  get getRfqByIdUseCase(): GetRfqByIdUseCase {
    if (!this._getRfqByIdUseCase) {
      this._getRfqByIdUseCase = new GetRfqByIdUseCase(this.rfqRepository);
    }
    return this._getRfqByIdUseCase;
  }

  get getRfqsUseCase(): GetRfqsUseCase {
    if (!this._getRfqsUseCase) {
      this._getRfqsUseCase = new GetRfqsUseCase(this.rfqRepository);
    }
    return this._getRfqsUseCase;
  }

  get updateRfqStatusUseCase(): UpdateRfqStatusUseCase {
    if (!this._updateRfqStatusUseCase) {
      this._updateRfqStatusUseCase = new UpdateRfqStatusUseCase(
        this.rfqRepository,
        this.notificationService
      );
    }
    return this._updateRfqStatusUseCase;
  }

  // Cleanup method for testing
  async cleanup(): Promise<void> {
    if (this._prisma) {
      await this._prisma.$disconnect();
      this._prisma = null;
    }
  }
}

// Export singleton instance
export const container = DIContainer.getInstance();

// Export individual getters for convenience
export const {
  // Repositories
  coffeeProductRepository,
  rfqRepository,
  contentRepository,

  // Services
  emailService,
  notificationService,
  fileUploadService,
  cacheService,
  searchService,
  translationService,
  analyticsService,
  seoService,

  // Use Cases - Coffee Products
  getCoffeeProductsUseCase,
  getCoffeeProductBySlugUseCase,
  searchCoffeeProductsUseCase,
  getFeaturedProductsUseCase,
  getProductsByCategoryUseCase,

  // Use Cases - RFQ Management
  submitRfqUseCase,
  getRfqByIdUseCase,
  getRfqsUseCase,
  updateRfqStatusUseCase,
} = container;
