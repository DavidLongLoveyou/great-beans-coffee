import { RFQEntity, RFQStatus } from '@/domain/entities/rfq.entity';
import { IRFQRepository } from '@/infrastructure/database/repositories/rfq.repository';
import { INotificationService } from '@/infrastructure/services/notification.service';

export interface UpdateRfqStatusRequest {
  id: string;
  status: 'pending' | 'under_review' | 'quoted' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  updatedBy?: string;
}

export interface UpdateRfqStatusResponse {
  rfq: RFQEntity;
  success: boolean;
  message: string;
}

export class UpdateRfqStatusUseCase {
  constructor(
    private rfqRepository: IRFQRepository,
    private notificationService: INotificationService
  ) {}

  async execute(request: UpdateRfqStatusRequest): Promise<UpdateRfqStatusResponse> {
    try {
      // Validate input
      if (!request.id) {
        return {
          rfq: null,
          success: false,
          message: 'RFQ ID is required'
        };
      }

      if (!request.status) {
        return {
          rfq: null,
          success: false,
          message: 'Status is required'
        };
      }

      // Validate status
      const validStatuses = ['pending', 'under_review', 'quoted', 'accepted', 'rejected', 'expired'];
      if (!validStatuses.includes(request.status)) {
        return {
          rfq: null,
          success: false,
          message: 'Invalid status provided'
        };
      }

      // Get existing RFQ
      const existingRfq = await this.rfqRepository.findById(request.id);
      if (!existingRfq) {
        return {
          rfq: null,
          success: false,
          message: 'RFQ not found'
        };
      }

      // Update RFQ status
      const updateData: any = {
        status: request.status,
        updatedAt: new Date()
      };

      if (request.notes) {
        updateData.internalNotes = request.notes;
      }

      if (request.updatedBy) {
        updateData.updatedBy = request.updatedBy;
      }

      // Update in repository
      const updatedRfq = await this.rfqRepository.update(request.id, updateData);

      if (!updatedRfq) {
        return {
          rfq: null,
          success: false,
          message: 'Failed to update RFQ status'
        };
      }

      // Send notification if status changed significantly
      if (this.shouldNotifyStatusChange(existingRfq.status, request.status)) {
        try {
          await this.notificationService.sendRfqStatusUpdate({
            rfq: updatedRfq,
            previousStatus: existingRfq.status,
            newStatus: request.status
          });
        } catch (notificationError) {
          console.error('Failed to send status update notification:', notificationError);
          // Don't fail the entire operation if notification fails
        }
      }

      return {
        rfq: updatedRfq,
        success: true,
        message: 'RFQ status updated successfully'
      };
    } catch (error) {
      console.error('Error updating RFQ status:', error);
      return {
        rfq: null,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update RFQ status'
      };
    }
  }

  private shouldNotifyStatusChange(oldStatus: string, newStatus: string): boolean {
    // Notify on significant status changes
    const significantChanges = [
      { from: 'pending', to: 'under_review' },
      { from: 'under_review', to: 'quoted' },
      { from: 'quoted', to: 'accepted' },
      { from: 'quoted', to: 'rejected' },
      { from: 'pending', to: 'expired' },
      { from: 'under_review', to: 'expired' }
    ];

    return significantChanges.some(change => 
      change.from === oldStatus && change.to === newStatus
    );
  }
}