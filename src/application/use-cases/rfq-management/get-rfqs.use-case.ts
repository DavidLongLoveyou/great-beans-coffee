import { RFQEntity } from '@/domain/entities/rfq.entity';
import { IRFQRepository } from '@/domain/repositories/rfq.repository';
import { createScopedLogger } from '@/shared/utils/logger';

export interface GetRfqsRequest {
  page?: number | undefined;
  limit?: number | undefined;
  status?: string | undefined;
  priority?: string | undefined;
  companyName?: string | undefined;
  dateFrom?: Date | undefined;
  dateTo?: Date | undefined;
  sortBy?: 'submittedAt' | 'updatedAt' | 'priority' | 'status' | undefined;
  sortOrder?: 'asc' | 'desc' | undefined;
}

export interface GetRfqsResponse {
  rfqs: RFQEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  success: boolean;
  message: string;
}

export class GetRfqsUseCase {
  private logger = createScopedLogger('GetRfqsUseCase');

  constructor(private rfqRepository: IRFQRepository) {}

  async execute(request: GetRfqsRequest = {}): Promise<GetRfqsResponse> {
    try {
      // Set defaults
      const page = request.page || 1;
      const limit = request.limit || 10;
      const sortBy = request.sortBy || 'submittedAt';
      const sortOrder = request.sortOrder || 'desc';

      // Validate pagination
      if (page < 1) {
        return {
          rfqs: [],
          total: 0,
          page: 1,
          limit,
          totalPages: 0,
          success: false,
          message: 'Page number must be greater than 0',
        };
      }

      if (limit < 1 || limit > 100) {
        return {
          rfqs: [],
          total: 0,
          page,
          limit: 10,
          totalPages: 0,
          success: false,
          message: 'Limit must be between 1 and 100',
        };
      }

      // Build filter criteria
      const filters: any = {};

      if (request.status) {
        filters.status = request.status;
      }

      if (request.priority) {
        filters.priority = request.priority;
      }

      if (request.companyName) {
        filters.companyName = {
          contains: request.companyName,
        };
      }

      if (request.dateFrom || request.dateTo) {
        filters.submittedAt = {};
        if (request.dateFrom) {
          filters.submittedAt.gte = request.dateFrom;
        }
        if (request.dateTo) {
          filters.submittedAt.lte = request.dateTo;
        }
      }

      // Get RFQs from repository
      const searchCriteria: any = {
        status: request.status as any,
        priority: request.priority as any,
        submittedAfter: request.dateFrom,
        submittedBefore: request.dateTo,
        page,
        limit,
        sortBy,
        sortOrder,
      };

      // Only add clientCompany if companyName is provided
      if (request.companyName) {
        searchCriteria.clientCompany = request.companyName;
      }

      const result = await this.rfqRepository.search(searchCriteria);

      const totalPages = Math.ceil(result.total / limit);

      return {
        rfqs: result.rfqs,
        total: result.total,
        page,
        limit,
        totalPages,
        success: true,
        message: 'RFQs retrieved successfully',
      };
    } catch (error) {
      // Application layer error logging removed for production
      return {
        rfqs: [],
        total: 0,
        page: request.page || 1,
        limit: request.limit || 10,
        totalPages: 0,
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to retrieve RFQs',
      };
    }
  }
}
