import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma';

export interface SeedResult {
  success: boolean;
  message: string;
  seeded: string[];
  error?: string;
}

export class DatabaseSeeders {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * Run all seeders
   */
  async runAllSeeders(): Promise<SeedResult> {
    try {
      console.log('🌱 Starting database seeding...');
      
      const seeded: string[] = [];
      
      // Run seeders in dependency order
      await this.seedUsers();
      seeded.push('users');
      
      await this.seedCoffeeProducts();
      seeded.push('coffee-products');
      
      await this.seedContent();
      seeded.push('content');
      
      await this.seedSampleRFQs();
      seeded.push('sample-rfqs');
      
      console.log('✅ Database seeding completed successfully');
      return {
        success: true,
        message: 'All seeders completed successfully',
        seeded
      };
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      return {
        success: false,
        message: 'Seeding failed',
        seeded: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Seed initial users
   */
  async seedUsers(): Promise<void> {
    console.log('🌱 Seeding users...');
    
    const users = [
      {
        id: 'admin-001',
        email: 'admin@greatbeans.com',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true
      },
      {
        id: 'sales-001',
        email: 'sales@greatbeans.com',
        name: 'Sales Manager',
        role: 'SALES',
        isActive: true
      },
      {
        id: 'content-001',
        email: 'content@greatbeans.com',
        name: 'Content Manager',
        role: 'CONTENT_MANAGER',
        isActive: true
      }
    ];

    for (const user of users) {
      await this.prisma.user.upsert({
        where: { email: user.email },
        update: {},
        create: user
      });
    }
    
    console.log(`✅ Seeded ${users.length} users`);
  }

  /**
   * Seed coffee products
   */
  async seedCoffeeProducts(): Promise<void> {
    console.log('🌱 Seeding coffee products...');
    
    const products = [
      {
        id: 'robusta-grade1-001',
        sku: 'ROB-G1-001',
        coffeeType: 'ROBUSTA',
        grade: 'GRADE_1',
        processing: 'NATURAL',
        specifications: JSON.stringify({
          moisture: '12.5%',
          defects: '< 5%',
          screenSize: '18+',
          density: '0.7 g/ml'
        }),
        pricing: JSON.stringify({
          basePrice: 2850,
          currency: 'USD',
          unit: 'MT',
          minOrder: 20
        }),
        availability: JSON.stringify({
          inStock: true,
          quantity: 500,
          harvestSeason: '2024',
          availableFrom: '2024-01-01'
        }),
        originInfo: JSON.stringify({
          region: 'Dak Lak',
          farm: 'Highland Farms',
          altitude: '500-800m',
          coordinates: { lat: 12.7, lng: 108.2 }
        }),
        images: 'robusta-beans-1.jpg,robusta-farm-1.jpg,robusta-processing-1.jpg',
        documents: 'robusta-spec-sheet.pdf,robusta-certificate.pdf',
        createdBy: 'admin-001',
        updatedBy: 'admin-001'
      },
      {
        id: 'arabica-premium-001',
        sku: 'ARA-PREM-001',
        coffeeType: 'ARABICA',
        grade: 'PREMIUM',
        processing: 'WASHED',
        specifications: JSON.stringify({
          moisture: '11.5%',
          defects: '< 3%',
          screenSize: '16+',
          density: '0.75 g/ml'
        }),
        pricing: JSON.stringify({
          basePrice: 4200,
          currency: 'USD',
          unit: 'MT',
          minOrder: 10
        }),
        availability: JSON.stringify({
          inStock: true,
          quantity: 200,
          harvestSeason: '2024',
          availableFrom: '2024-02-01'
        }),
        originInfo: JSON.stringify({
          region: 'Da Lat',
          farm: 'Mountain Coffee Estate',
          altitude: '1200-1500m',
          coordinates: { lat: 11.9, lng: 108.4 }
        }),
        images: 'arabica-beans-1.jpg,arabica-farm-1.jpg,arabica-processing-1.jpg',
        documents: 'arabica-spec-sheet.pdf,arabica-certificate.pdf',
        createdBy: 'admin-001',
        updatedBy: 'admin-001'
      }
    ];

    for (const product of products) {
      const createdProduct = await this.prisma.coffeeProduct.upsert({
        where: { sku: product.sku },
        update: {},
        create: product
      });

      // Create translations
      const translations = [
        {
          locale: 'en',
          name: product.coffeeType === 'ROBUSTA' ? 'Premium Robusta Grade 1' : 'Premium Arabica',
          description: product.coffeeType === 'ROBUSTA' 
            ? 'High-quality Robusta beans from the Central Highlands of Vietnam. Known for their strong flavor and low acidity.'
            : 'Premium Arabica beans from the mountainous regions of Da Lat. Characterized by their smooth, complex flavor profile.',
          shortDescription: product.coffeeType === 'ROBUSTA' 
            ? 'Premium Vietnamese Robusta with strong flavor'
            : 'Premium Vietnamese Arabica with smooth taste',
          features: JSON.stringify([
            'Single origin',
            'Sustainably sourced',
            'Quality certified',
            'Direct trade'
          ]),
          benefits: JSON.stringify([
            'Consistent quality',
            'Competitive pricing',
            'Reliable supply',
            'Full traceability'
          ]),
          slug: product.coffeeType === 'ROBUSTA' ? 'premium-robusta-grade-1' : 'premium-arabica',
          metaTitle: product.coffeeType === 'ROBUSTA' 
            ? 'Premium Robusta Grade 1 Coffee Beans | Great Beans Coffee'
            : 'Premium Arabica Coffee Beans | Great Beans Coffee',
          metaDescription: product.coffeeType === 'ROBUSTA'
            ? 'High-quality Vietnamese Robusta Grade 1 coffee beans. Strong flavor, low acidity. Perfect for espresso blends.'
            : 'Premium Vietnamese Arabica coffee beans. Smooth, complex flavor from Da Lat highlands. Perfect for specialty coffee.',
          productId: createdProduct.id
        },
        {
          locale: 'vi',
          name: product.coffeeType === 'ROBUSTA' ? 'Cà Phê Robusta Cao Cấp Loại 1' : 'Cà Phê Arabica Cao Cấp',
          description: product.coffeeType === 'ROBUSTA'
            ? 'Hạt cà phê Robusta chất lượng cao từ Tây Nguyên Việt Nam. Nổi tiếng với hương vị đậm đà và độ acid thấp.'
            : 'Hạt cà phê Arabica cao cấp từ vùng núi Đà Lạt. Đặc trưng bởi hương vị mềm mại, phức hợp.',
          shortDescription: product.coffeeType === 'ROBUSTA'
            ? 'Robusta Việt Nam cao cấp với hương vị đậm đà'
            : 'Arabica Việt Nam cao cấp với vị mềm mại',
          features: JSON.stringify([
            'Nguồn gốc đơn nhất',
            'Canh tác bền vững',
            'Chứng nhận chất lượng',
            'Thương mại trực tiếp'
          ]),
          benefits: JSON.stringify([
            'Chất lượng ổn định',
            'Giá cả cạnh tranh',
            'Nguồn cung đáng tin cậy',
            'Truy xuất nguồn gốc đầy đủ'
          ]),
          slug: product.coffeeType === 'ROBUSTA' ? 'ca-phe-robusta-cao-cap-loai-1' : 'ca-phe-arabica-cao-cap',
          metaTitle: product.coffeeType === 'ROBUSTA'
            ? 'Cà Phê Robusta Cao Cấp Loại 1 | Great Beans Coffee'
            : 'Cà Phê Arabica Cao Cấp | Great Beans Coffee',
          metaDescription: product.coffeeType === 'ROBUSTA'
            ? 'Hạt cà phê Robusta Việt Nam loại 1 chất lượng cao. Hương vị đậm đà, độ acid thấp. Hoàn hảo cho espresso.'
            : 'Hạt cà phê Arabica Việt Nam cao cấp. Hương vị mềm mại, phức hợp từ cao nguyên Đà Lạt.',
          productId: createdProduct.id
        }
      ];

      for (const translation of translations) {
        await this.prisma.coffeeProductTranslation.upsert({
          where: {
            productId_locale: {
              productId: createdProduct.id,
              locale: translation.locale
            }
          },
          update: {},
          create: translation
        });
      }
    }
    
    console.log(`✅ Seeded ${products.length} coffee products with translations`);
  }

  /**
   * Seed content
   */
  async seedContent(): Promise<void> {
    console.log('🌱 Seeding content...');
    
    const contents = [
      {
        id: 'blog-001',
        type: 'BLOG_POST',
        status: 'PUBLISHED',
        locale: 'en',
        title: 'The Art of Vietnamese Coffee: From Bean to Cup',
        slug: 'art-of-vietnamese-coffee',
        excerpt: 'Discover the rich tradition and unique processing methods that make Vietnamese coffee special.',
        content: `# The Art of Vietnamese Coffee: From Bean to Cup

Vietnamese coffee has a rich history spanning over 150 years. From the French colonial introduction of coffee plants to the development of unique processing methods, Vietnam has become the world's second-largest coffee producer.

## Our Coffee Regions

### Central Highlands (Tây Nguyên)
The heart of Vietnamese coffee production, known for:
- Ideal climate conditions
- Rich volcanic soil
- Traditional farming methods
- Premium Robusta varieties

### Northern Mountains
Home to specialty Arabica varieties:
- High altitude cultivation
- Cool mountain climate
- Artisanal processing methods
- Unique flavor profiles

## Processing Methods

We employ various processing methods to bring out the best in our beans:
- **Natural Processing**: Sun-dried for full-bodied flavor
- **Washed Processing**: Clean, bright taste profiles
- **Honey Processing**: Balanced sweetness and acidity

## Quality Commitment

Every batch undergoes rigorous quality control:
- Hand-picking of ripe cherries
- Careful processing and drying
- Multiple quality checkpoints
- Cupping and grading by experts

Join us on this journey from bean to cup, where tradition meets innovation in every sip.`,
        featuredImage: 'vietnamese-coffee-art.jpg',
        media: JSON.stringify([
          'coffee-plantation.jpg',
          'processing-facility.jpg',
          'quality-control.jpg'
        ]),
        metaTitle: 'The Art of Vietnamese Coffee: From Bean to Cup | Great Beans Coffee',
        metaDescription: 'Discover the rich tradition and unique processing methods that make Vietnamese coffee special. Learn about our regions, processing, and quality commitment.',
        keywords: 'Vietnamese coffee, coffee processing, Robusta, Arabica, Central Highlands, coffee quality',
        tags: 'coffee education,Vietnamese coffee,processing methods,quality',
        category: 'Education',
        publishedAt: new Date('2024-01-15'),
        authorId: 'content-001'
      },
      {
        id: 'market-001',
        type: 'MARKET_REPORT',
        status: 'PUBLISHED',
        locale: 'en',
        title: 'Global Coffee Market Outlook 2024',
        slug: 'global-coffee-market-outlook-2024',
        excerpt: 'Comprehensive analysis of global coffee market trends, pricing, and opportunities for 2024.',
        content: `# Global Coffee Market Outlook 2024

## Executive Summary

The global coffee market continues to show resilience and growth potential in 2024, with emerging markets driving demand and sustainability becoming a key differentiator.

## Market Trends

### Demand Patterns
- **Specialty Coffee Growth**: 8-10% annual growth
- **Instant Coffee Stability**: Steady 3-5% growth
- **Cold Brew Expansion**: 15-20% growth in developed markets

### Regional Insights

#### Asia-Pacific
- Fastest growing region
- Rising middle class consumption
- Café culture expansion

#### Europe
- Premium quality focus
- Sustainability requirements
- Direct trade preferences

#### North America
- Specialty coffee dominance
- Convenience products growth
- Health-conscious consumption

## Price Analysis

### Robusta Market
- Current price range: $2,800-3,200/MT
- Supply stability from Vietnam
- Growing demand from instant coffee sector

### Arabica Market
- Premium pricing for specialty grades
- Climate challenges affecting supply
- Increased focus on traceability

## Opportunities for Exporters

1. **Sustainability Certification**
   - Organic certification premium: 15-25%
   - Fair trade market growth
   - Carbon neutral initiatives

2. **Direct Trade Relationships**
   - Bypass traditional intermediaries
   - Better margins for producers
   - Quality consistency

3. **Value-Added Services**
   - Custom processing methods
   - Private label opportunities
   - Technical support

## Challenges and Risks

- Climate change impacts
- Supply chain disruptions
- Currency fluctuations
- Regulatory changes

## Conclusion

2024 presents significant opportunities for Vietnamese coffee exporters who can adapt to changing market demands while maintaining quality and sustainability standards.`,
        featuredImage: 'global-coffee-market.jpg',
        media: JSON.stringify([
          'market-chart-1.jpg',
          'price-analysis.jpg',
          'regional-demand.jpg'
        ]),
        metaTitle: 'Global Coffee Market Outlook 2024 | Market Analysis | Great Beans Coffee',
        metaDescription: 'Comprehensive analysis of global coffee market trends, pricing, and opportunities for 2024. Expert insights for coffee industry professionals.',
        keywords: 'coffee market,market analysis,coffee prices,global trends,coffee export,market outlook',
        tags: 'market analysis,global trends,coffee industry,export opportunities',
        category: 'Market Intelligence',
        publishedAt: new Date('2024-02-01'),
        authorId: 'content-001'
      }
    ];

    for (const content of contents) {
      await this.prisma.content.upsert({
        where: {
          locale_slug: {
            locale: content.locale,
            slug: content.slug
          }
        },
        update: {},
        create: content
      });
    }
    
    console.log(`✅ Seeded ${contents.length} content items`);
  }

  /**
   * Seed sample RFQs
   */
  async seedSampleRFQs(): Promise<void> {
    console.log('🌱 Seeding sample RFQs...');
    
    const rfqs = [
      {
        id: 'rfq-001',
        rfqNumber: 'RFQ-2024-001',
        status: 'PENDING',
        priority: 'MEDIUM',
        companyName: 'European Coffee Importers Ltd',
        contactPerson: 'John Smith',
        email: 'john.smith@europeancoffee.com',
        phone: '+44 20 7123 4567',
        country: 'United Kingdom',
        businessType: 'Importer/Distributor',
        productRequirements: JSON.stringify({
          coffeeType: 'ROBUSTA',
          grade: 'GRADE_1',
          processing: 'NATURAL',
          quantity: 100,
          quantityUnit: 'MT',
          packaging: '60kg jute bags',
          certifications: ['Organic', 'Fair Trade']
        }),
        deliveryRequirements: JSON.stringify({
          incoterms: 'CIF',
          destination: 'Hamburg, Germany',
          deliveryDate: '2024-04-15',
          packaging: 'Jute bags, 60kg each'
        }),
        paymentRequirements: JSON.stringify({
          terms: 'LC at sight',
          currency: 'USD'
        }),
        additionalRequirements: 'Need samples before final order. Quality certificate required.',
        sampleRequired: true,
        urgency: 'medium',
        locale: 'en',
        createdBy: 'sales-001'
      },
      {
        id: 'rfq-002',
        rfqNumber: 'RFQ-2024-002',
        status: 'IN_REVIEW',
        priority: 'HIGH',
        companyName: 'American Specialty Coffee Co.',
        contactPerson: 'Sarah Johnson',
        email: 'sarah.j@americanspecialty.com',
        phone: '+1 555 123 4567',
        country: 'United States',
        businessType: 'Roaster/Retailer',
        productRequirements: JSON.stringify({
          coffeeType: 'ARABICA',
          grade: 'PREMIUM',
          processing: 'WASHED',
          quantity: 50,
          quantityUnit: 'MT',
          packaging: '69kg jute bags',
          certifications: ['Organic', 'Rainforest Alliance']
        }),
        deliveryRequirements: JSON.stringify({
          incoterms: 'FOB',
          destination: 'Ho Chi Minh Port',
          deliveryDate: '2024-03-30',
          packaging: 'Jute bags, 69kg each'
        }),
        paymentRequirements: JSON.stringify({
          terms: 'T/T 30% advance, 70% against documents',
          currency: 'USD'
        }),
        additionalRequirements: 'Looking for long-term partnership. Monthly shipments preferred.',
        sampleRequired: true,
        urgency: 'high',
        locale: 'en',
        createdBy: 'sales-001',
        assignedTo: 'sales-001'
      }
    ];

    for (const rfq of rfqs) {
      const createdRfq = await this.prisma.rFQ.upsert({
        where: { rfqNumber: rfq.rfqNumber },
        update: {},
        create: rfq
      });

      // Create RFQ products
      const rfqProducts = [
        {
          rfqId: createdRfq.id,
          productType: rfq.id === 'rfq-001' ? 'ROBUSTA' : 'ARABICA',
          grade: rfq.id === 'rfq-001' ? 'GRADE_1' : 'PREMIUM',
          origin: 'Vietnam',
          processingMethod: rfq.id === 'rfq-001' ? 'NATURAL' : 'WASHED',
          certifications: JSON.stringify(rfq.id === 'rfq-001' ? ['Organic', 'Fair Trade'] : ['Organic', 'Rainforest Alliance']),
          quantity: rfq.id === 'rfq-001' ? 100 : 50,
          quantityUnit: 'MT',
          targetPrice: rfq.id === 'rfq-001' ? 2900 : 4300,
          currency: 'USD'
        }
      ];

      for (const rfqProduct of rfqProducts) {
        await this.prisma.rFQProduct.create({
          data: rfqProduct
        });
      }
    }
    
    console.log(`✅ Seeded ${rfqs.length} sample RFQs with products`);
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
        seeded: []
      };
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      return {
        success: false,
        message: 'Failed to clear data',
        seeded: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const databaseSeeders = new DatabaseSeeders();