import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { rfqRepository } from '../../../../infrastructure/di/container';
import { createScopedLogger } from '../../../../shared/utils/logger';

const logger = createScopedLogger('RFQ-Analytics-API');

// Validation schema for analytics query parameters
const analyticsQuerySchema = z.object({
  dateFrom: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  dateTo: z
    .string()
    .transform(str => new Date(str))
    .optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  country: z.string().optional(),
  businessType: z.string().optional(),
});

/**
 * GET /api/rfq/analytics - Get RFQ analytics and metrics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Convert search params to object
    const params = Object.fromEntries(searchParams.entries());

    // Validate query parameters
    const validatedParams = analyticsQuerySchema.parse(params);

    logger.info('Fetching RFQ analytics', validatedParams);

    // Convert dateFrom/dateTo to dateRange format
    const dateRange =
      validatedParams.dateFrom && validatedParams.dateTo
        ? {
            start: new Date(validatedParams.dateFrom),
            end: new Date(validatedParams.dateTo),
          }
        : undefined;

    // Get analytics data from repository
    const analytics = await rfqRepository.getAnalytics(dateRange);

    // Get performance metrics
    const performanceMetrics = await rfqRepository.getPerformanceMetrics(
      undefined, // assigneeId
      dateRange
    );

    // Calculate additional metrics
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(
      currentDate.getTime() - 30 * 24 * 60 * 60 * 1000
    );

    // Get recent RFQs for trend analysis
    const recentRfqs = await rfqRepository.search({
      submittedAfter: thirtyDaysAgo,
      sortBy: 'submittedAt',
      sortOrder: 'desc',
      limit: 100,
    });

    // Calculate monthly trends (simplified)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthEnd = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i + 1,
        0
      );

      const monthRfqs = recentRfqs.rfqs.filter(
        rfq => rfq.submittedAt >= monthStart && rfq.submittedAt <= monthEnd
      );

      monthlyTrends.push({
        month: monthStart.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        }),
        count: monthRfqs.length,
        value: monthRfqs.reduce(
          (sum, rfq) => sum + (rfq.estimatedValue || 0),
          0
        ),
      });
    }

    // Calculate top requested products (simplified)
    const productCounts: Record<string, number> = {};
    recentRfqs.rfqs.forEach(rfq => {
      const productType = rfq.productRequirements?.coffeeType || 'Unknown';
      productCounts[productType] = (productCounts[productType] || 0) + 1;
    });

    const topRequestedProducts = Object.entries(productCounts)
      .map(([product, count]) => ({ product, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    logger.info('RFQ analytics fetched successfully', {
      totalRFQs: analytics.totalRFQs,
      conversionRate: analytics.conversionRate,
    });

    return NextResponse.json({
      success: true,
      message: 'RFQ analytics retrieved successfully',
      data: {
        overview: {
          totalRFQs: analytics.totalRFQs,
          totalEstimatedValue: analytics.totalEstimatedValue,
          averageRFQValue: analytics.averageRFQValue,
          conversionRate: analytics.conversionRate,
          averageResponseTime: analytics.averageResponseTimeHours,
        },
        breakdowns: {
          byStatus: analytics.statusBreakdown,
          byPriority: analytics.priorityBreakdown,
          byBusinessType: analytics.businessTypeBreakdown,
          byCountry: analytics.countryBreakdown,
        },
        performance: {
          responseTime: performanceMetrics.responseTimeMetrics,
          conversion: performanceMetrics.conversionMetrics,
          assignment: performanceMetrics.assignmentMetrics,
        },
        trends: {
          monthly: monthlyTrends,
          topProducts: topRequestedProducts,
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          dateRange: {
            from: validatedParams.dateFrom?.toISOString(),
            to: validatedParams.dateTo?.toISOString(),
          },
          filters: {
            status: validatedParams.status,
            priority: validatedParams.priority,
            country: validatedParams.country,
            businessType: validatedParams.businessType,
          },
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching RFQ analytics:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid query parameters',
          errors: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
