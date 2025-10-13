import { NotificationService } from '@/application/services/notification.service';
import { RFQEntity, RFQStatus, type RFQ } from '@/domain/entities/rfq.entity';
import { IRFQRepository } from '@/domain/repositories/rfq.repository';
import { createScopedLogger } from '@/shared/utils/logger';

export interface UpdateRfqStatusRequest {
  id: string;
  status: RFQStatus;
  notes?: string;
  updatedBy?: string;
}

export interface UpdateRfqStatusResponse {
  rfq: RFQEntity | null;
  success: boolean;
  message: string;
}

export class UpdateRfqStatusUseCase {
  private logger = createScopedLogger('UpdateRfqStatusUseCase');

  constructor(
    private rfqRepository: IRFQRepository,
    private notificationService: NotificationService
  ) {}

  async execute(
    request: UpdateRfqStatusRequest
  ): Promise<UpdateRfqStatusResponse> {
    try {
      // Validate input
      if (!request.id) {
        return {
          rfq: null,
          success: false,
          message: 'RFQ ID is required',
        };
      }

      if (!request.status) {
        return {
          rfq: null,
          success: false,
          message: 'Status is required',
        };
      }

      // Validate status
      const validStatuses = [
        'pending',
        'under_review',
        'quoted',
        'accepted',
        'rejected',
        'expired',
      ];
      if (!validStatuses.includes(request.status)) {
        return {
          rfq: null,
          success: false,
          message: 'Invalid status provided',
        };
      }

      // Get existing RFQ
      const existingRfq = await this.rfqRepository.findById(request.id);
      if (!existingRfq) {
        return {
          rfq: null,
          success: false,
          message: 'RFQ not found',
        };
      }

      // Update RFQ status
      const updateData: Partial<RFQ> = {
        status: request.status as RFQStatus,
        updatedAt: new Date(),
      };

      if (request.notes) {
        updateData.internalNotes = request.notes;
      }

      if (request.updatedBy) {
        updateData.updatedBy = request.updatedBy;
      }

      // Update in repository
      const updatedRfq = await this.rfqRepository.update(
        request.id,
        updateData
      );

      if (!updatedRfq) {
        return {
          rfq: null,
          success: false,
          message: 'Failed to update RFQ status',
        };
      }

      // Send notification if status changed significantly
      if (this.shouldNotifyStatusChange(existingRfq.status, request.status)) {
        try {
          await this.notificationService.sendAdminNotification(
            `RFQ ${updatedRfq.rfqNumber} status changed from ${existingRfq.status} to ${request.status}`
          );
        } catch (notificationError) {
          // Application layer error logging removed for production
          // Don't fail the entire operation if notification fails
        }
      }

      return {
        rfq: updatedRfq,
        success: true,
        message: 'RFQ status updated successfully',
      };
    } catch (error) {
      // Application layer error logging removed for production
      return {
        rfq: null,
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update RFQ status',
      };
    }
  }

  private shouldNotifyStatusChange(
    oldStatus: string,
    newStatus: string
  ): boolean {
    // Notify on significant status changes
    const significantChanges = [
      { from: 'pending', to: 'under_review' },
      { from: 'under_review', to: 'quoted' },
      { from: 'quoted', to: 'accepted' },
      { from: 'quoted', to: 'rejected' },
      { from: 'pending', to: 'expired' },
      { from: 'under_review', to: 'expired' },
    ];

    return significantChanges.some(
      change => change.from === oldStatus && change.to === newStatus
    );
  }
}
