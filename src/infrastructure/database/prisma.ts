import { PrismaClient } from '@prisma/client';

import { createScopedLogger } from '../../shared/utils/logger';

const logger = createScopedLogger('Database');

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with optimized configuration
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Database connection helper
export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (error) {
    logger.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Database disconnection helper
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('✅ Database disconnected successfully');
  } catch (error) {
    logger.error('❌ Database disconnection failed:', error);
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
      timestamp: new Date().toISOString(),
    };
  }
}

// Transaction helper
export async function withTransaction<T>(
  callback: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => Promise<T>
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
      updatedAt: new Date(),
    },
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
      create: item,
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
  return await prisma.content.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
        { excerpt: { contains: query } },
      ],
      status: 'PUBLISHED',
    },
    take: limit,
    orderBy: {
      publishedAt: 'desc',
    },
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
      id: true,
      title: true,
      type: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
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
  });

  return content;
}

// RFQ analytics helper
export async function getRFQAnalytics(startDate?: Date, endDate?: Date) {
  const whereClause =
    startDate && endDate
      ? {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        }
      : {};

  const [totalRFQs, statusBreakdown, averageValue] =
    await Promise.all([
      prisma.rFQ.count({ where: whereClause }),

      prisma.rFQ.groupBy({
        by: ['status'],
        where: whereClause,
        _count: true,
      }),

      prisma.rFQ.aggregate({
        where: {
          ...whereClause,
          totalValue: { not: null },
        },
        _avg: {
          totalValue: true,
        },
      }),
    ]);

  return {
    totalRFQs,
    statusBreakdown,
    averageValue: averageValue._avg.totalValue,
  };
}

// Company relationship scoring
export async function calculateCompanyScore(companyId: string) {
  const company = await prisma.clientCompany.findUnique({
    where: { id: companyId },
    include: {
      rfqs: {
        select: {
          totalValue: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!company) return null;

  // Calculate score based on various factors
  let score = 0;

  // Base score by status
  const statusScores = {
    ACTIVE: 50,
    INACTIVE: 10,
    PROSPECT: 30,
    BLACKLISTED: 0,
  };

  score += statusScores[company.status] || 0;

  // RFQ history bonus
  const totalRFQs = company.rfqs.length;
  const totalValue = company.rfqs.reduce(
    (sum, rfq) => sum + (rfq.totalValue || 0),
    0
  );

  score += Math.min(totalRFQs * 2, 20); // Max 20 points for RFQs
  score += Math.min(totalValue / 10000, 30); // Max 30 points for value

  return Math.max(0, Math.min(100, score));
}

export default prisma;
