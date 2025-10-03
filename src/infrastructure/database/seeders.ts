import { PrismaClient, UserRole, ClientStatus, ServiceType, CoffeeType, CoffeeGrade, ProcessingMethod, ContentType, ContentStatus } from '@prisma/client';

import {
  CLUSTER_PRODUCTS,
  CLUSTER_SERVICES,
  CLUSTER_ARTICLES,
} from '@/lib/cluster-data';

import { prisma } from './prisma';
import {
  seedDataStats,
  seedDataValidation,
  usersData,
  coffeeProductsData,
  businessServicesData,
  rfqsData,
  clientCompaniesData,
  contentData,
} from './seed-data';

export interface SeedResult {
  success: boolean;
  message: string;
  seeded: string[];
  stats?: typeof seedDataStats;
  error?: string;
}

export class DatabaseSeeders {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Run all seeders with comprehensive data
   */
  async runAllSeeders(): Promise<SeedResult> {
    try {
      console.log('🌱 Starting comprehensive database seeding...');
      console.log(
        `📊 Seeding ${seedDataStats.total} records across ${Object.keys(seedDataStats).length - 1} entity types`
      );

      // Validate seed data before proceeding
      if (!seedDataValidation.isValid) {
        console.error('❌ Seed data validation failed:');
        seedDataValidation.errors.forEach(error =>
          console.error(`  - ${error}`)
        );
        throw new Error('Seed data validation failed');
      }

      const seeded: string[] = [];

      // Run seeders in dependency order
      console.log('👥 Seeding users...');
      await this.seedUsers();
      seeded.push('users');

      console.log('🏢 Seeding client companies...');
      await this.seedClientCompanies();
      seeded.push('client-companies');

      console.log('☕ Seeding coffee products...');
      await this.seedCoffeeProducts();
      seeded.push('coffee-products');

      console.log('🛠️ Seeding business services...');
      await this.seedBusinessServices();
      seeded.push('business-services');

      console.log('📝 Seeding content...');
      await this.seedContent();
      seeded.push('content');

      console.log('🔗 Seeding cluster data...');
      await this.seedClusterData();
      seeded.push('cluster-data');

      console.log('💼 Seeding RFQs...');
      await this.seedRFQs();
      seeded.push('rfqs');

      console.log('✅ Database seeding completed successfully');
      console.log(`📈 Seeded ${seedDataStats.total} total records`);

      return {
        success: true,
        message: 'All seeders completed successfully',
        seeded,
        stats: seedDataStats,
      };
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      return {
        success: false,
        message: 'Seeding failed',
        seeded: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Map seed user roles to Prisma UserRole enum values
   */
  private mapUserRole(seedRole: string): UserRole {
    const roleMapping: Record<string, UserRole> = {
      SUPER_ADMIN: UserRole.ADMIN,
      ADMIN: UserRole.ADMIN,
      SALES_MANAGER: UserRole.MANAGER,
      SALES_REP: UserRole.SALES,
      ACCOUNT_MANAGER: UserRole.SALES,
      QUALITY_MANAGER: UserRole.MANAGER,
      LOGISTICS_COORDINATOR: UserRole.USER,
      CONTENT_MANAGER: UserRole.CONTENT_MANAGER,
      MARKETING_MANAGER: UserRole.MANAGER,
      FINANCE_MANAGER: UserRole.MANAGER,
      CUSTOMER_SERVICE: UserRole.USER,
      VIEWER: UserRole.USER,
      CLIENT: UserRole.USER, // Map CLIENT to USER as it's not in enum
      ANALYST: UserRole.USER, // Map ANALYST to USER as it's not in enum
    };

    return roleMapping[seedRole] || UserRole.USER;
  }

  /**
   * Map seed processing methods to Prisma ProcessingMethod enum values
   */
  private mapProcessingMethod(seedProcessing: string): string {
    const processingMapping: Record<string, string> = {
      NATURAL: 'NATURAL',
      WASHED: 'WASHED',
      HONEY: 'HONEY',
      WET_HULLED: 'WET_HULLED',
      SEMI_WASHED: 'SEMI_WASHED',
      MIXED: 'NATURAL', // Default mixed to natural
      BLEND: 'NATURAL', // Default blend to natural
    };

    return processingMapping[seedProcessing] || 'NATURAL';
  }

  /**
   * Seed comprehensive user data
   */
  async seedUsers(): Promise<void> {
    console.log(`  📝 Seeding ${usersData.length} users...`);

    for (const userData of usersData) {
      const user = {
        id: userData.id,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
        role: this.mapUserRole(userData.role),
        avatar: userData.avatar || null,
        isActive: userData.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.prisma.user.upsert({
        where: { email: user.email },
        update: user,
        create: user,
      });
    }

    console.log(`  ✅ Successfully seeded ${usersData.length} users`);
  }

  /**
   * Seed client companies
   */
  async seedClientCompanies(): Promise<void> {
    console.log(
      `  📝 Seeding ${clientCompaniesData.length} client companies...`
    );

    for (const companyData of clientCompaniesData) {
      // Map complex seed data to simple Prisma schema
      const company = {
        id: companyData.id,
        name: companyData.tradingName || companyData.legalName,
        email: companyData.email,
        phone: companyData.phone,
        website: companyData.website || null,
        industry: companyData.industry,
        companySize: companyData.size,
        country: companyData.addresses?.[0]?.country || null,
        city: companyData.addresses?.[0]?.city || null,
        address: companyData.addresses?.[0]?.street || null,
        postalCode: companyData.addresses?.[0]?.postalCode || null,
        notes: `${companyData.description}\n\nBusiness Model: ${companyData.businessModel}\nEstablished: ${companyData.businessProfile?.yearEstablished}`,
        status: ClientStatus.ACTIVE,
        source: 'SEED_DATA',
        assignedTo: companyData.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.prisma.clientCompany.upsert({
        where: { id: company.id },
        update: company,
        create: company,
      });
    }

    console.log(
      `  ✅ Successfully seeded ${clientCompaniesData.length} client companies`
    );
  }

  /**
   * Map seed service type to Prisma ServiceType enum
   */
  private mapServiceTypeFromSeed(seedType: string): ServiceType {
    const typeMapping: Record<string, ServiceType> = {
      'PRIVATE_LABEL': ServiceType.PRIVATE_LABEL,
      'OEM_MANUFACTURING': ServiceType.OEM_MANUFACTURING,
      'QUALITY_CONTROL': ServiceType.QUALITY_CONTROL,
      'CUSTOM_BLENDING': ServiceType.CUSTOM_BLENDING,
      'COFFEE_SOURCING': ServiceType.SOURCING,
      'LOGISTICS_SHIPPING': ServiceType.LOGISTICS,
      'MARKET_CONSULTING': ServiceType.CONSULTING,
      'PACKAGING_DESIGN': ServiceType.PACKAGING,
      'CERTIFICATION_SUPPORT': ServiceType.CONSULTING,
      'SUPPLY_CHAIN_MANAGEMENT': ServiceType.LOGISTICS,
    };

    return typeMapping[seedType] || ServiceType.CONSULTING;
  }

  /**
   * Map seed coffee type to Prisma CoffeeType enum
   */
  private mapCoffeeTypeFromSeed(seedType: string): CoffeeType {
    switch (seedType) {
      case 'ROBUSTA':
        return CoffeeType.ROBUSTA;
      case 'ARABICA':
        return CoffeeType.ARABICA;
      case 'BLEND':
        return CoffeeType.BLEND;
      case 'INSTANT':
        return CoffeeType.SPECIALTY; // Map INSTANT to SPECIALTY since INSTANT doesn't exist in Prisma
      default:
        return CoffeeType.BLEND;
    }
  }

  private mapCoffeeGradeFromSeed(seedGrade: string): CoffeeGrade {
    switch (seedGrade) {
      case 'GRADE_1':
        return CoffeeGrade.GRADE_1;
      case 'GRADE_2':
        return CoffeeGrade.GRADE_2;
      case 'GRADE_3':
        return CoffeeGrade.GRADE_3;
      case 'COMMERCIAL':
        return CoffeeGrade.GRADE_2; // Map COMMERCIAL to GRADE_2
      case 'SCREEN_18':
      case 'SCREEN_16':
      case 'SCREEN_13':
        return CoffeeGrade.PREMIUM; // Map screen sizes to PREMIUM
      case 'SPECIALTY':
        return CoffeeGrade.SPECIALTY;
      default:
        return CoffeeGrade.GRADE_2;
    }
  }

  private mapProcessingMethodFromSeed(seedMethod: string): ProcessingMethod {
    switch (seedMethod) {
      case 'NATURAL':
        return ProcessingMethod.NATURAL;
      case 'WASHED':
        return ProcessingMethod.WASHED;
      case 'HONEY':
        return ProcessingMethod.HONEY;
      case 'WET_HULLED':
        return ProcessingMethod.WET_HULLED;
      case 'SEMI_WASHED':
        return ProcessingMethod.SEMI_WASHED;
      case 'MIXED':
        return ProcessingMethod.MIXED;
      default:
        return ProcessingMethod.WASHED;
    }
  }

  private mapContentTypeFromSeed(seedType: string): ContentType {
    switch (seedType.toLowerCase()) {
      case 'page':
        return ContentType.PAGE;
      case 'blog_post':
      case 'blog':
      case 'article':
        return ContentType.BLOG_POST;
      case 'market_report':
      case 'report':
        return ContentType.MARKET_REPORT;
      case 'origin_story':
      case 'story':
        return ContentType.ORIGIN_STORY;
      case 'service_page':
      case 'service':
        return ContentType.SERVICE_PAGE;
      case 'product_description':
      case 'product':
        return ContentType.PRODUCT_DESCRIPTION;
      case 'faq':
        return ContentType.FAQ;
      case 'testimonial':
        return ContentType.TESTIMONIAL;
      default:
        return ContentType.BLOG_POST;
    }
  }

  private mapContentStatusFromSeed(seedStatus: string): ContentStatus {
    switch (seedStatus.toLowerCase()) {
      case 'draft':
        return ContentStatus.DRAFT;
      case 'in_review':
      case 'review':
        return ContentStatus.IN_REVIEW;
      case 'approved':
        return ContentStatus.APPROVED;
      case 'published':
        return ContentStatus.PUBLISHED;
      case 'archived':
        return ContentStatus.ARCHIVED;
      case 'rejected':
        return ContentStatus.REJECTED;
      default:
        return ContentStatus.PUBLISHED;
    }
  }

  /**
   * Seed business services
   */
  async seedBusinessServices(): Promise<void> {
    console.log(
      `  📝 Seeding ${businessServicesData.length} business services...`
    );

    for (const serviceData of businessServicesData) {
      // Get English translation for basic fields
      const enTranslation = serviceData.translations.en;
      
      const service = {
        id: serviceData.id,
        name: enTranslation?.name || serviceData.serviceCode,
        slug: serviceData.serviceCode.toLowerCase().replace(/_/g, '-'),
        type: this.mapServiceTypeFromSeed(serviceData.type),
        category: serviceData.category,
        description: enTranslation?.description || '',
        shortDescription: enTranslation?.shortDescription || '',
        features: enTranslation?.features || [],
        benefits: enTranslation?.benefits || [],
        pricing: serviceData.pricing,
        deliveryTimeline: serviceData.deliveryTimeline,
        requirements: serviceData.requirements,
        capabilities: serviceData.capabilities,
        processSteps: serviceData.processSteps,
        qualityStandards: [],
        certifications: [],
        translations: serviceData.translations,
        images: serviceData.images,
        documents: serviceData.documents,
        tags: serviceData.tags,
        relatedServices: [],
        isActive: serviceData.isActive,
        isFeatured: serviceData.isFeatured,
        sortOrder: 0,
        seo: {},
        createdBy: serviceData.createdBy,
        updatedBy: serviceData.updatedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.prisma.businessService.upsert({
        where: { id: service.id },
        update: service,
        create: service,
      });
    }

    console.log(
      `  ✅ Successfully seeded ${businessServicesData.length} business services`
    );
  }

  /**
   * Seed coffee products
   */
  async seedCoffeeProducts(): Promise<void> {
    console.log(`  📝 Seeding ${coffeeProductsData.length} coffee products...`);

    for (const productData of coffeeProductsData) {
      // Map seed data to Prisma schema fields
      const product = {
        id: productData.id,
        sku: productData.sku,
        coffeeType: this.mapCoffeeTypeFromSeed(productData.coffeeType),
        grade: this.mapCoffeeGradeFromSeed(productData.grade),
        processing: this.mapProcessingMethodFromSeed(productData.processing),
        origin: productData.originInfo?.region || 'Vietnam', // Extract origin from originInfo
        region: productData.originInfo?.region,
        farm: productData.originInfo?.farm,
        altitude: productData.originInfo?.altitude,
        harvestSeason: productData.availability?.harvestSeason,
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
        sortOrder: 0,

        // Store complex data as JSON
        specifications: productData.specifications,
        pricing: productData.pricing,
        availability: productData.availability,
        originInfo: productData.originInfo,

        // Media as JSON
        images: productData.images,
        documents: productData.documents,

        // System fields
        createdBy: productData.createdBy,
        updatedBy: productData.updatedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.prisma.coffeeProduct.upsert({
        where: { id: product.id },
        update: product,
        create: product,
      });
    }

    console.log(
      `  ✅ Successfully seeded ${coffeeProductsData.length} coffee products`
    );
  }

  /**
   * Seed content
   */
  async seedContent(): Promise<void> {
    console.log(`  📝 Seeding ${contentData.length} content items...`);

    for (const contentItem of contentData) {
      const content = {
        id: contentItem.id,
        type: contentItem.type,
        category: contentItem.category,
        status: contentItem.status,
        title: contentItem.title,
        slug: contentItem.slug,
        excerpt: contentItem.excerpt || null,
        content: contentItem.content || '',
        metaTitle: contentItem.metaTitle || null,
        metaDescription: contentItem.metaDescription || null,
        keywords: contentItem.keywords || null,
        featuredImage: contentItem.featuredImage || null,
        images: contentItem.images,
        translations: contentItem.translations,
        seo: contentItem.seo,
        tags: contentItem.tags,
        relatedContent: contentItem.relatedContent,
        publishedAt: contentItem.publishedAt
          ? new Date(contentItem.publishedAt)
          : null,
        scheduledAt: contentItem.scheduledAt
          ? new Date(contentItem.scheduledAt)
          : null,
        readingTime: contentItem.readingTime,
        viewCount: contentItem.viewCount,
        shareCount: contentItem.shareCount,
        isFeatured: contentItem.isFeatured,
        isSticky: contentItem.isSticky,
        authorId: contentItem.createdBy, // Use createdBy as authorId
        createdBy: contentItem.createdBy,
        updatedBy: contentItem.updatedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        locale: 'en', // Add required locale field
      };

      await this.prisma.content.upsert({
        where: { id: content.id },
        update: content,
        create: content,
      });
    }

    console.log(`  ✅ Successfully seeded ${contentData.length} content items`);
  }

  /**
   * Seed RFQs
   */
  async seedRFQs(): Promise<void> {
    console.log(`  📝 Seeding ${rfqsData.length} RFQs...`);

    for (const rfqData of rfqsData) {
      const rfq = {
        id: rfqData.id,
        rfqNumber: rfqData.rfqNumber,
        clientId: rfqData.clientCompanyId,
        status: rfqData.status,
        priority: rfqData.priority,
        companyName: rfqData.title, // Use title as company name for now
        contactPerson: 'Contact Person', // Default value
        email: 'contact@example.com', // Default value
        phone: '+84-123-456-789', // Default value
        country: rfqData.shipping?.destination?.country || 'Vietnam',
        businessType: 'Coffee Trading',
        productRequirements: rfqData.requirements,
        deliveryRequirements: rfqData.shipping,
        paymentRequirements: rfqData.budget,
        additionalRequirements: rfqData.description,
        totalValue: rfqData.budget?.estimatedValue,
        currency: rfqData.budget?.currency || 'USD',
        incoterms: rfqData.shipping?.incoterms,
        destination: rfqData.shipping?.destination?.city,
        deadline: rfqData.timeline?.responseDeadline ? new Date(rfqData.timeline.responseDeadline) : null,
        assignedTo: rfqData.assignedTo || null,
        createdBy: rfqData.createdBy,
        updatedBy: rfqData.updatedBy,
        notes: `Tags: ${rfqData.tags?.join(', ')}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.prisma.rFQ.upsert({
        where: { id: rfq.id },
        update: rfq,
        create: rfq,
      });
    }

    console.log(`  ✅ Successfully seeded ${rfqsData.length} RFQs`);
  }

  /**
   * Seed cluster data (products, services, articles)
   */
  async seedClusterData(): Promise<void> {
    console.log(`  📝 Seeding cluster data...`);

    let totalProducts = 0;
    let totalServices = 0;
    let totalArticles = 0;

    // Get admin user for created/updated by fields
    const adminUser = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (!adminUser) {
      throw new Error('Admin user not found. Please seed users first.');
    }

    // Seed cluster products
    for (const [clusterId, products] of Object.entries(CLUSTER_PRODUCTS)) {
      console.log(`    📦 Seeding products for cluster: ${clusterId}`);

      for (const productData of products) {
        // Map cluster product data to database schema
        const product = {
          id: productData.id,
          sku: productData.id.toUpperCase(),
          coffeeType: productData.grade === 'specialty' ? CoffeeType.ARABICA : CoffeeType.ROBUSTA,
          grade: this.mapCoffeeGradeFromSeed(productData.grade),
          processing: this.mapProcessingMethodFromSeed(productData.processingMethod),
          origin: productData.origin.country,
          region: productData.origin.region,
          farm: null,
          altitude: null,
          harvestSeason: null,
          cuppingScore: productData.specifications?.cuppingScore || null,
          moisture: productData.specifications?.moisture || null,
          screenSize: productData.specifications?.screenSize || null,
          defectRate: productData.specifications?.defectRate || null,
          leadTime: productData.leadTime,
          inStock: productData.inStock,
          minimumOrder: '1 container',
          features: productData.features,
          isActive: true,
          isFeatured: productData.isFeatured || false,
          sortOrder: 0,
          specifications: productData.specifications || {},
          pricing: { fobPrice: productData.price },
          availability: {
            inStock: productData.inStock,
            leadTime: productData.leadTime,
          },
          originInfo: productData.origin,
          images: [productData.image],
          documents: [],
          createdBy: adminUser.id,
          updatedBy: adminUser.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await this.prisma.coffeeProduct.upsert({
          where: { id: product.id },
          update: product,
          create: product,
        });

        // Create product translations
        const translation = {
          productId: product.id,
          locale: 'en',
          slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: productData.name,
          description: productData.description,
          shortDescription: productData.description.substring(0, 150) + '...',
          tastingNotes: null,
          processingNotes: null,
          features: productData.features,
          benefits: [],
          seoTitle: productData.name,
          seoDescription: productData.description,
          seoKeywords: [
            productData.grade,
            productData.origin.country,
            productData.processingMethod,
          ],
        };

        await this.prisma.coffeeProductTranslation.upsert({
          where: {
            productId_locale: {
              productId: product.id,
              locale: 'en',
            },
          },
          update: translation,
          create: translation,
        });

        totalProducts++;
      }
    }

    // Seed cluster services
    for (const [clusterId, services] of Object.entries(CLUSTER_SERVICES)) {
      console.log(`    🔧 Seeding services for cluster: ${clusterId}`);

      for (const serviceData of services) {
        const service = {
          id: serviceData.id,
          name: serviceData.name,
          slug: serviceData.id,
          type: this.mapServiceTypeFromSeed(serviceData.category),
          category: serviceData.category,
          description: serviceData.description,
          shortDescription: serviceData.description.substring(0, 150) + '...',
          features: serviceData.features,
          benefits: [],
          pricing: {},
          deliveryTimeline: serviceData.capabilities?.leadTime || null,
          requirements: [],
          capabilities: serviceData.capabilities || {},
          processSteps: [],
          qualityStandards: [],
          certifications: [],
          translations: {},
          images: [],
          documents: [],
          tags: [],
          relatedServices: [],
          isActive: true,
          isFeatured: serviceData.isPopular || false,
          sortOrder: 0,
          seo: {},
          createdBy: adminUser.id,
          updatedBy: adminUser.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await this.prisma.businessService.upsert({
          where: { id: service.id },
          update: service,
          create: service,
        });

        // Create service translations
        const translation = {
          serviceId: service.id,
          locale: 'en',
          slug: serviceData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          name: serviceData.name,
          description: serviceData.description,
          shortDescription: service.shortDescription,
          features: serviceData.features,
          benefits: [],
          seoTitle: serviceData.name,
          seoDescription: serviceData.description,
          seoKeywords: [serviceData.category, 'coffee', 'vietnam'],
        };

        await this.prisma.businessServiceTranslation.upsert({
          where: {
            serviceId_locale: {
              serviceId: service.id,
              locale: 'en',
            },
          },
          update: translation,
          create: translation,
        });

        totalServices++;
      }
    }

    // Seed cluster articles
    for (const [clusterId, articles] of Object.entries(CLUSTER_ARTICLES)) {
      console.log(`    📰 Seeding articles for cluster: ${clusterId}`);

      for (const articleData of articles) {
        const article = {
          id: articleData.id,
          locale: 'en',
          type: this.mapContentTypeFromSeed('blog_post'),
          category: articleData.category,
          status: this.mapContentStatusFromSeed('published'),
          title: articleData.title,
          slug: articleData.id,
          excerpt: articleData.excerpt,
          content: `# ${articleData.title}\n\n${articleData.excerpt}\n\n*This is a sample article content. Full content would be provided in a real implementation.*`,
          featuredImage: articleData.image,
          images: [articleData.image],
          videos: [],
          documents: [],
          translations: {},
          seo: {},
          tags: articleData.tags,
          relatedContent: [],
          authorId: adminUser.id,
          publishedAt: new Date(articleData.publishedAt),
          scheduledAt: null,
          isActive: true,
          isFeatured: articleData.isFeatured || false,
          sortOrder: 0,
          viewCount: 0,
          shareCount: 0,
          createdBy: adminUser.id,
          updatedBy: adminUser.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await this.prisma.content.upsert({
          where: { id: article.id },
          update: article,
          create: article,
        });

        totalArticles++;
      }
    }

    console.log(
      `  ✅ Successfully seeded cluster data: ${totalProducts} products, ${totalServices} services, ${totalArticles} articles`
    );
  }

  /**
   * Map cluster grade to database enum
   */
  private mapCoffeeGrade(grade: string) {
    const gradeMap: Record<string, string> = {
      grade1: 'GRADE_1',
      grade2: 'GRADE_2',
      specialty: 'SPECIALTY',
      custom: 'CUSTOM',
    };
    return gradeMap[grade] || 'GRADE_1';
  }

  /**
   * Map service category to service type enum
   */
  private mapServiceType(category: string) {
    const typeMap: Record<string, string> = {
      Sourcing: 'SOURCING',
      'Quality Assurance': 'QUALITY_CONTROL',
      'Specialty Sourcing': 'SOURCING',
      Manufacturing: 'PRIVATE_LABEL',
      OEM: 'OEM',
    };
    return typeMap[category] || 'SOURCING';
  }

  /**
   * Clear all data (development only)
   */
  async clearAllData(): Promise<SeedResult> {
    try {
      console.log('🧹 Clearing all data...');

      // Delete in reverse dependency order
      await this.prisma.rFQProduct.deleteMany();
      await this.prisma.rFQ.deleteMany();
      await this.prisma.content.deleteMany();
      await this.prisma.coffeeProductTranslation.deleteMany();
      await this.prisma.coffeeProduct.deleteMany();
      await this.prisma.user.deleteMany();

      console.log('✅ All data cleared successfully');
      return {
        success: true,
        message: 'All data cleared successfully',
        seeded: [],
      };
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      return {
        success: false,
        message: 'Failed to clear data',
        seeded: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

export const databaseSeeders = new DatabaseSeeders();
