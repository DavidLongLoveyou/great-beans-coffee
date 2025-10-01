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

      logger.info(`RFQ notification sent for ${rfqId} with status ${status}`);
      return success;
    } catch (error) {
      logger.error('Failed to send RFQ notification:', error);
      return false;
    }
  }

  async sendAdminNotification(message: string): Promise<boolean> {
    try {
      logger.info(`Admin notification: ${message}`);

      // In a real implementation, this would send to admin email addresses
      // For now, we'll just log it
      return true;
    } catch (error) {
      logger.error('Failed to send admin notification:', error);
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
      logger.error('Failed to send status change notification:', error);
      return false;
    }
  }
}

export { NotificationService, DefaultNotificationService };
