import { PrismaClient } from '@prisma/client';

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized configuration
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database connection helper
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Database disconnection helper
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
}

// Health check function
export async function checkDatabaseHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    return { 
      status: 'unhealthy', 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString() 
    };
  }
}

// Transaction helper
export async function withTransaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(callback);
}

// Soft delete helper (for entities that support it)
export async function softDelete(model: string, id: string) {
  const modelDelegate = (prisma as any)[model];
  if (!modelDelegate) {
    throw new Error(`Model ${model} not found`);
  }
  
  return await modelDelegate.update({
    where: { id },
    data: { 
      isActive: false,
      updatedAt: new Date()
    }
  });
}

// Bulk operations helper
export async function bulkUpsert<T>(
  model: string,
  data: T[],
  uniqueField: string = 'id'
) {
  const modelDelegate = (prisma as any)[model];
  if (!modelDelegate) {
    throw new Error(`Model ${model} not found`);
  }

  const operations = data.map((item: any) => 
    modelDelegate.upsert({
      where: { [uniqueField]: item[uniqueField] },
      update: item,
      create: item
    })
  );

  return await Promise.all(operations);
}

// Search helper with full-text search
export async function searchContent(
  query: string,
  locale: string = 'en',
  limit: number = 10
) {
  return await prisma.contentTranslation.findMany({
    where: {
      locale,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } }
      ],
      contentItem: {
        status: 'PUBLISHED'
      }
    },
    include: {
      contentItem: {
        select: {
          id: true,
          type: true,
          category: true,
          publishedAt: true
        }
      }
    },
    take: limit,
    orderBy: {
      contentItem: {
        publishedAt: 'desc'
      }
    }
  });
}

// Analytics helper
export async function getContentAnalytics(
  contentId: string,
  startDate?: Date,
  endDate?: Date
) {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    select: {
      analytics: true,
      translations: {
        select: {
          locale: true,
          title: true
        }
      }
    }
  });

  return content;
}

// Multi-language content helper
export async function getLocalizedContent(
  contentId: string,
  locale: string,
  fallbackLocale: string = 'en'
) {
  const content = await prisma.content.findUnique({
    where: { id: contentId },
    include: {
      translations: {
        where: {
          OR: [
            { locale },
            { locale: fallbackLocale }
          ]
        }
      },
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!content) return null;

  // Prefer requested locale, fallback to default
  const translation = content.translations.find(t => t.locale === locale) ||
                     content.translations.find(t => t.locale === fallbackLocale) ||
                     content.translations[0];

  return {
    ...content,
    translation
  };
}

// RFQ analytics helper
export async function getRFQAnalytics(
  startDate?: Date,
  endDate?: Date
) {
  const whereClause = startDate && endDate ? {
    createdAt: {
      gte: startDate,
      lte: endDate
    }
  } : {};

  const [
    totalRFQs,
    statusBreakdown,
    sourceBreakdown,
    averageValue
  ] = await Promise.all([
    prisma.rFQ.count({ where: whereClause }),
    
    prisma.rFQ.groupBy({
      by: ['status'],
      where: whereClause,
      _count: true
    }),
    
    prisma.rFQ.groupBy({
      by: ['source'],
      where: whereClause,
      _count: true
    }),
    
    prisma.rFQ.aggregate({
      where: {
        ...whereClause,
        estimatedValue: { not: null }
      },
      _avg: {
        estimatedValue: true
      }
    })
  ]);

  return {
    totalRFQs,
    statusBreakdown,
    sourceBreakdown,
    averageValue: averageValue._avg.estimatedValue
  };
}

// Company relationship scoring
export async function calculateCompanyScore(companyId: string) {
  const company = await prisma.clientCompany.findUnique({
    where: { id: companyId },
    include: {
      orders: {
        select: {
          totalAmount: true,
          status: true,
          createdAt: true
        }
      },
      notes: {
        where: {
          type: 'SALES'
        },
        select: {
          priority: true
        }
      }
    }
  });

  if (!company) return null;

  // Calculate score based on various factors
  let score = 0;
  
  // Base score by relationship status
  const statusScores = {
    'NEW': 10,
    'DEVELOPING': 30,
    'ESTABLISHED': 60,
    'STRATEGIC_PARTNER': 90,
    'KEY_ACCOUNT': 100,
    'AT_RISK': 20,
    'DORMANT': 5
  };
  
  score += statusScores[company.relationshipStatus] || 0;
  
  // Order history bonus
  const totalOrders = company.orders.length;
  const totalValue = company.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  score += Math.min(totalOrders * 2, 20); // Max 20 points for orders
  score += Math.min(totalValue / 10000, 30); // Max 30 points for value
  
  // Risk penalty
  const riskPenalties = { 'LOW': 0, 'MEDIUM': -5, 'HIGH': -15, 'CRITICAL': -30 };
  score += riskPenalties[company.riskLevel] || 0;
  
  return Math.max(0, Math.min(100, score));
}

export default prisma;