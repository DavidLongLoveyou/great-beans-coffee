import { PrismaClient } from '@prisma/client';

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
  private mapUserRole(seedRole: string): string {
    const roleMapping: Record<string, string> = {
      SUPER_ADMIN: 'ADMIN',
      ADMIN: 'ADMIN',
      SALES_MANAGER: 'MANAGER',
      SALES_REP: 'SALES',
      ACCOUNT_MANAGER: 'MANAGER',
      QUALITY_MANAGER: 'MANAGER',
      LOGISTICS_COORDINATOR: 'USER',
      CONTENT_MANAGER: 'CONTENT_MANAGER',
      MARKETING_MANAGER: 'MANAGER',
      FINANCE_MANAGER: 'MANAGER',
      CUSTOMER_SERVICE: 'USER',
      VIEWER: 'USER',
      CLIENT: 'USER',
      ANALYST: 'USER',
    };

    return roleMapping[seedRole] || 'USER';
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
        avatar: userData.avatar,
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
        website: companyData.website,
        industry: companyData.industry,
        companySize: companyData.size,
        country: companyData.addresses?.[0]?.country,
        city: companyData.addresses?.[0]?.city,
        address: companyData.addresses?.[0]?.street,
        postalCode: companyData.addresses?.[0]?.postalCode,
        notes: `${companyData.description}\n\nBusiness Model: ${companyData.businessModel}\nEstablished: ${companyData.businessProfile?.yearEstablished}`,
        status: 'ACTIVE',
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
   * Seed business services
   */
  async seedBusinessServices(): Promise<void> {
    console.log(
      `  📝 Seeding ${businessServicesData.length} business services...`
    );

    for (const serviceData of businessServicesData) {
      const service = {
        id: serviceData.id,
        name: serviceData.name,
        slug: serviceData.slug,
        type: serviceData.type,
        category: serviceData.category,
        description: serviceData.description,
        shortDescription: serviceData.shortDescription,
        features: serviceData.features,
        benefits: serviceData.benefits,
        pricing: serviceData.pricing,
        deliveryTimeline: serviceData.deliveryTimeline,
        requirements: serviceData.requirements,
        capabilities: serviceData.capabilities,
        processSteps: serviceData.processSteps,
        qualityStandards: serviceData.qualityStandards,
        certifications: serviceData.certifications,
        translations: serviceData.translations,
        images: serviceData.images,
        documents: serviceData.documents,
        tags: serviceData.tags,
        relatedServices: serviceData.relatedServices,
        isActive: serviceData.isActive,
        isFeatured: serviceData.isFeatured,
        sortOrder: serviceData.sortOrder,
        seo: serviceData.seo,
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
        coffeeType: productData.coffeeType,
        grade: productData.grade,
        processing: this.mapProcessingMethod(productData.processing),
        origin: productData.originInfo?.country || 'Vietnam', // Extract origin from originInfo
        region: productData.originInfo?.region,
        farm: productData.originInfo?.farm,
        altitude: productData.originInfo?.altitude,
        harvestSeason: productData.originInfo?.harvestSeason,
        isActive: productData.isActive,
        isFeatured: productData.isFeatured,
        sortOrder: productData.sortOrder || 0,

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
        excerpt: contentItem.excerpt,
        content: contentItem.content,
        featuredImage: contentItem.featuredImage,
        images: contentItem.images,
        videos: contentItem.videos,
        documents: contentItem.documents,
        translations: contentItem.translations,
        seo: contentItem.seo,
        tags: contentItem.tags,
        relatedContent: contentItem.relatedContent,
        authorId: contentItem.authorId,
        publishedAt: contentItem.publishedAt
          ? new Date(contentItem.publishedAt)
          : null,
        scheduledAt: contentItem.scheduledAt
          ? new Date(contentItem.scheduledAt)
          : null,
        isActive: contentItem.isActive,
        isFeatured: contentItem.isFeatured,
        sortOrder: contentItem.sortOrder,
        viewCount: contentItem.viewCount,
        shareCount: contentItem.shareCount,
        createdBy: contentItem.createdBy,
        updatedBy: contentItem.updatedBy,
        createdAt: new Date(),
        updatedAt: new Date(),
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
        status: rfqData.status,
        priority: rfqData.priority,
        type: rfqData.type,
        companyId: rfqData.companyId,
        companyName: rfqData.companyName,
        contactPerson: rfqData.contactPerson,
        email: rfqData.email,
        phone: rfqData.phone,
        country: rfqData.country,
        businessType: rfqData.businessType,
        products: rfqData.products,
        services: rfqData.services,
        requirements: rfqData.requirements,
        budget: rfqData.budget,
        shipping: rfqData.shipping,
        timeline: rfqData.timeline,
        communication: rfqData.communication,
        attachments: rfqData.attachments,
        tags: rfqData.tags,
        notes: rfqData.notes,
        assignedTo: rfqData.assignedTo,
        followUpDate: rfqData.followUpDate
          ? new Date(rfqData.followUpDate)
          : null,
        expiryDate: rfqData.expiryDate ? new Date(rfqData.expiryDate) : null,
        isActive: rfqData.isActive,
        createdBy: rfqData.createdBy,
        updatedBy: rfqData.updatedBy,
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
          coffeeType: productData.grade === 'specialty' ? 'ARABICA' : 'ROBUSTA',
          grade: this.mapCoffeeGrade(productData.grade),
          processing: this.mapProcessingMethod(productData.processingMethod),
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
          type: this.mapServiceType(serviceData.category),
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
          type: 'BLOG_POST',
          category: articleData.category,
          status: 'PUBLISHED',
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
