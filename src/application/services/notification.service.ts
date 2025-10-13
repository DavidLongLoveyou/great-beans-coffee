import { createScopedLogger } from '../../shared/utils/logger';

import { IEmailService } from './email.service';

const logger = createScopedLogger('NotificationService');

export interface NotificationService {
  sendRfqNotification(
    rfqId: string,
    status: string,
    recipientEmail: string
  ): Promise<boolean>;
  sendAdminNotification(message: string): Promise<boolean>;
  sendStatusChangeNotification(
    entityType: string,
    entityId: string,
    oldStatus: string,
    newStatus: string,
    recipientEmail: string
  ): Promise<boolean>;
}

class DefaultNotificationService implements NotificationService {
  constructor(private emailService: IEmailService) {}

  async sendRfqNotification(
    rfqId: string,
    status: string,
    recipientEmail: string
  ): Promise<boolean> {
    try {
      const subject = `RFQ ${rfqId} Status Update`;
      const content = `Your RFQ ${rfqId} status has been updated to: ${status}`;

      const success = await this.emailService.sendEmail(
        recipientEmail,
        subject,
        content
      );

      // Application layer logging removed for production
      return success;
    } catch (error) {
      // Application layer error logging removed for production
      return false;
    }
  }

  async sendAdminNotification(message: string): Promise<boolean> {
    try {
      // Application layer logging removed for production

      // In a real implementation, this would send to admin email addresses
      // For now, we'll just log it
      return true;
    } catch (error) {
      // Application layer error logging removed for production
      return false;
    }
  }

  async sendStatusChangeNotification(
    entityType: string,
    entityId: string,
    oldStatus: string,
    newStatus: string,
    recipientEmail: string
  ): Promise<boolean> {
    try {
      const subject = `${entityType} ${entityId} Status Changed`;
      const content = `Your ${entityType} ${entityId} status has changed from ${oldStatus} to ${newStatus}`;

      const success = await this.emailService.sendEmail(
        recipientEmail,
        subject,
        content
      );

      return success;
    } catch (error) {
      // Application layer error logging removed for production
      return false;
    }
  }
}

export { DefaultNotificationService };
