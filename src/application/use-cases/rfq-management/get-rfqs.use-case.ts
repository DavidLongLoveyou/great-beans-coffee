import { RFQEntity } from '@/domain/entities/rfq.entity';
import { IRFQRepository } from '@/infrastructure/database/repositories/rfq.repository';

export interface GetRfqsRequest {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  companyName?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: 'submittedAt' | 'updatedAt' | 'priority' | 'status';
  sortOrder?: 'asc' | 'desc';
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
          mode: 'insensitive',
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
      const result = await this.rfqRepository.findMany({
        filters,
        page,
        limit,
        sortBy,
        sortOrder,
      });

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
      console.error('Error getting RFQs:', error);
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
