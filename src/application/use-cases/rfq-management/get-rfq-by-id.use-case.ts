import { RFQEntity } from '@/domain/entities/rfq.entity';
import { IRFQRepository } from '@/domain/repositories/rfq.repository';
import { createScopedLogger } from '@/shared/utils/logger';

export interface GetRfqByIdRequest {
  id: string;
}

export interface GetRfqByIdResponse {
  rfq: RFQEntity | null;
  success: boolean;
  message: string;
}

export class GetRfqByIdUseCase {
  private logger = createScopedLogger('GetRfqByIdUseCase');

  constructor(private rfqRepository: IRFQRepository) {}

  async execute(request: GetRfqByIdRequest): Promise<GetRfqByIdResponse> {
    try {
      // Validate input
      if (!request.id) {
        return {
          rfq: null,
          success: false,
          message: 'RFQ ID is required',
        };
      }

      // Get RFQ from repository
      const rfq = await this.rfqRepository.findById(request.id);

      if (!rfq) {
        return {
          rfq: null,
          success: false,
          message: 'RFQ not found',
        };
      }

      return {
        rfq,
        success: true,
        message: 'RFQ retrieved successfully',
      };
    } catch (error) {
      // Application layer error logging removed for production
      return {
        rfq: null,
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to retrieve RFQ',
      };
    }
  }
}
