import { describe, it, expect } from '@jest/globals';
import {
  validateMetaDescription,
  validatePageTitle,
} from '@/shared/utils/seo-testing';
import { SchemaGenerators } from '@/shared/utils/schema-generators';
import {
  AdvancedSEOManager,
  type SchemaOrgData,
} from '@/shared/utils/advanced-seo-manager';
import {
  generateOrganizationSchema,
  generateProductSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
} from '@/shared/utils/seo-utils';
import { seoConfig, localizedSeoConfig } from '@/shared/config/seo';

describe('SEO Structured Data Validation', () => {
  const schemaGenerators = new SchemaGenerators();
  const seoManager = new AdvancedSEOManager();

  describe('Schema.org JSON-LD Validation', () => {
    it('should generate valid Organization schema', () => {
      const organizationSchema = generateOrganizationSchema();

      expect(organizationSchema['@context']).toBe('https://schema.org');
      expect(organizationSchema['@type']).toBe('Organization');
      expect(organizationSchema.name).toBeDefined();
      expect(organizationSchema.url).toBeDefined();
      expect(organizationSchema.address).toBeDefined();
    });

    it('should generate valid Product schema for coffee products', () => {
      const mockProduct = {
        name: 'Premium Coffee Beans',
        description: 'High-quality coffee beans',
        images: ['/images/coffee.jpg'],
        category: 'Coffee Beans',
        price: '25.99',
        currency: 'USD',
      };

      const productSchema = generateProductSchema(mockProduct);

      expect(productSchema['@context']).toBe('https://schema.org');
      expect(productSchema['@type']).toBe('Product');
      expect(productSchema.name).toBe(mockProduct.name);
      expect(productSchema.description).toBe(mockProduct.description);
      expect(productSchema.offers).toBeDefined();
    });

    it('should generate valid Service schema for B2B services', () => {
      const mockService = {
        name: 'Private Label Coffee Manufacturing',
        description: 'Custom coffee manufacturing and packaging services',
        serviceType: 'Manufacturing',
        price: '15000',
        currency: 'USD',
      };

      const serviceSchema = generateServiceSchema(mockService);

      expect(serviceSchema['@context']).toBe('https://schema.org');
      expect(serviceSchema['@type']).toBe('Service');
      expect(serviceSchema.name).toBe(mockService.name);
      expect(serviceSchema.description).toBe(mockService.description);
      expect(serviceSchema.provider).toBeDefined();
    });

    it('should generate valid coffee-specific schemas', () => {
      const coffeeProductData = {
        id: 'ARAB-TYP-001',
        name: 'Specialty Arabica Beans',
        description: 'Premium single-origin Arabica coffee',
        variety: 'Typica',
        origin: 'Colombia',
        processingMethod: 'Washed',
        roastLevel: 'Medium',
        flavorProfile: ['Chocolate', 'Nutty', 'Citrus'],
        certifications: ['Organic', 'Rainforest Alliance'],
        price: {
          amount: '8.50',
          currency: 'USD',
          unit: 'per kg',
        },
        availability: 'InStock' as const,
        minimumOrderQuantity: '50kg',
        harvestSeason: '2024',
        altitude: '1200-1500m',
        images: [
          {
            url: '/images/arabica-typica.jpg',
            alt: 'Specialty Arabica Typica Coffee Beans',
          },
        ],
        specifications: {
          moisture: '11%',
          screenSize: '17+',
          density: '0.75g/ml',
          defects: '<3%',
        },
      };

      const coffeeSchema = schemaGenerators.generateCoffeeProductSchema(
        coffeeProductData,
        'en'
      );

      expect(coffeeSchema['@context']).toBe('https://schema.org');
      expect(coffeeSchema['@type']).toBe('Product');
      expect(coffeeSchema.name).toBe(coffeeProductData.name);
      expect(coffeeSchema.description).toBe(coffeeProductData.description);
    });

    it('should generate valid B2B service schemas', () => {
      const b2bServiceData = {
        id: 'CONSULT-001',
        name: 'Coffee Sourcing Consultation',
        description: 'Expert consultation for coffee sourcing strategies',
        serviceType: 'consulting' as const,
        targetMarkets: ['North America', 'Europe', 'Asia'],
        certifications: ['ISO 9001', 'Fair Trade Certified'],
        features: [
          'Quality Assurance',
          'Logistics Management',
          'Documentation Support',
          'Custom Packaging',
        ],
        areaServed: ['United States', 'Canada', 'Germany', 'Japan'],
        price: {
          type: 'fixed' as const,
          amount: '2500',
          currency: 'USD',
          unit: 'per project',
        },
        deliveryTime: '2-4 weeks',
        minimumOrder: '1 project',
      };

      const b2bSchema = schemaGenerators.generateB2BServiceSchema(
        b2bServiceData,
        'en'
      );

      expect(b2bSchema['@context']).toBe('https://schema.org');
      expect(b2bSchema['@type']).toBe('Service');
      expect(b2bSchema.name).toBe(b2bServiceData.name);
      expect(b2bSchema.description).toBe(b2bServiceData.description);
    });
  });

  describe('SEO Manager Validation', () => {
    it('should validate structured data correctly', () => {
      const validSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Test Organization',
        url: 'https://example.com',
      };

      const invalidSchema = {
        name: 'Test Organization',
        // Missing @context and @type
      } as unknown as SchemaOrgData; // Intentionally invalid for testing

      expect(seoManager.validateStructuredData(validSchema)).toBe(true);
      expect(seoManager.validateStructuredData(invalidSchema)).toBe(false);

      // Additional validation checks
      expect(validSchema['@context']).toBe('https://schema.org');
      expect(validSchema['@type']).toBe('Organization');
      expect(validSchema.name).toBeDefined();
    });

    it('should generate Next.js metadata', () => {
      const metadata = {
        title: 'Premium Vietnamese Coffee Beans | The Great Beans',
        description:
          'High-quality Robusta and Arabica coffee beans from Vietnam. Direct sourcing, sustainable farming, B2B wholesale.',
        keywords: [
          'vietnamese coffee',
          'robusta beans',
          'arabica beans',
          'coffee export',
        ],
        contentType: 'article' as const,
        locale: 'en' as const,
      };

      const nextMetadata = seoManager.generateMetadata(metadata);

      expect(nextMetadata.title).toBe(metadata.title);
      expect(nextMetadata.description).toBe(metadata.description);
      expect(nextMetadata.keywords).toContain('vietnamese coffee');
    });
  });

  describe('Meta Tags Validation', () => {
    it('should validate meta descriptions correctly', () => {
      const validDescription =
        'High-quality Vietnamese coffee beans for wholesale. Premium Robusta and Arabica varieties with sustainable sourcing and direct trade.';
      const shortDescription = 'Short description';
      const longDescription =
        'This is a very long meta description that exceeds the recommended 160 character limit for search engine optimization and may be truncated in search results which is not ideal for SEO performance and user experience in search engine result pages.';

      const validResult = validateMetaDescription(validDescription);
      const shortResult = validateMetaDescription(shortDescription);
      const longResult = validateMetaDescription(longDescription);

      expect(validResult.valid).toBe(true);
      expect(validResult.issues).toHaveLength(0);

      expect(shortResult.valid).toBe(false);
      expect(shortResult.issues).toContain(
        'Meta description is too short (< 120 characters)'
      );

      expect(longResult.valid).toBe(false);
      expect(longResult.issues).toContain(
        'Meta description is too long (> 160 characters)'
      );
    });

    it('should validate page titles correctly', () => {
      const validTitle = 'Premium Vietnamese Coffee Beans | The Great Beans';
      const shortTitle = 'Coffee';
      const longTitle =
        'This is a very long page title that exceeds the recommended 60 character limit for SEO';

      const validResult = validatePageTitle(validTitle);
      const shortResult = validatePageTitle(shortTitle);
      const longResult = validatePageTitle(longTitle);

      expect(validResult.valid).toBe(true);
      expect(validResult.issues).toHaveLength(0);

      expect(shortResult.valid).toBe(false);
      expect(shortResult.issues).toContain(
        'Page title is too short (< 30 characters)'
      );

      expect(longResult.valid).toBe(false);
      expect(longResult.issues).toContain(
        'Page title is too long (> 60 characters)'
      );
    });
  });

  describe('SEO Configuration Validation', () => {
    it('should have valid SEO configuration', () => {
      expect(seoConfig.siteName).toBeDefined();
      expect(seoConfig.siteUrl).toBeDefined();
      expect(seoConfig.business).toBeDefined();
      expect(seoConfig.business.name).toBeDefined();
      expect(seoConfig.defaultLocale).toBeDefined();
      expect(Array.isArray(seoConfig.supportedLocales)).toBe(true);
      expect(seoConfig.supportedLocales.length).toBeGreaterThan(0);
    });

    it('should have valid business data', () => {
      expect(seoConfig.business).toBeDefined();
      expect(seoConfig.business.name).toBeDefined();
      expect(seoConfig.business.address).toBeDefined();
      expect(seoConfig.business.contact).toBeDefined();
      expect(seoConfig.business.social).toBeDefined();
      expect(Array.isArray(seoConfig.business.certifications)).toBe(true);
    });

    it('should have valid social media configuration', () => {
      expect(seoConfig.business.social).toBeDefined();
      expect(seoConfig.business.social.twitter).toBeDefined();
      expect(seoConfig.business.social.linkedin).toBeDefined();
      expect(seoConfig.business.social.facebook).toBeDefined();
    });

    it('should have valid localized configurations', () => {
      expect(localizedSeoConfig).toBeDefined();
      expect(localizedSeoConfig.en).toBeDefined();
      expect(localizedSeoConfig.en.siteName).toBeDefined();
      expect(localizedSeoConfig.en.siteDescription).toBeDefined();
      expect(Array.isArray(localizedSeoConfig.en.keywords)).toBe(true);
      expect(localizedSeoConfig.en.keywords.length).toBeGreaterThan(0);
    });
  });

  describe('Structured Data Coverage', () => {
    it('should cover all major content types', () => {
      // Test that we have schema generators for all major content types
      expect(typeof schemaGenerators.generateCoffeeProductSchema).toBe(
        'function'
      );
      expect(typeof schemaGenerators.generateB2BServiceSchema).toBe('function');
      expect(typeof schemaGenerators.generateArticleSchema).toBe('function');
      expect(typeof schemaGenerators.generateMarketReportSchema).toBe(
        'function'
      );
      expect(typeof schemaGenerators.generateOriginStorySchema).toBe(
        'function'
      );
    });

    it('should generate breadcrumb schemas', () => {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Products', url: '/products' },
        { name: 'Robusta Coffee', url: '/products/robusta' },
      ];

      const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

      // Validate schema structure directly
      expect(breadcrumbSchema['@context']).toBe('https://schema.org');
      expect(breadcrumbSchema['@type']).toBe('BreadcrumbList');
      expect(breadcrumbSchema.itemListElement).toHaveLength(3);

      // Validate JSON-LD format
      expect(breadcrumbSchema.itemListElement[0]?.position).toBe(1);
      expect(breadcrumbSchema.itemListElement[0]?.name).toBe('Home');
      expect(breadcrumbSchema.itemListElement[2]?.position).toBe(3);
      expect(breadcrumbSchema.itemListElement[2]?.name).toBe('Robusta Coffee');
    });
  });
});
