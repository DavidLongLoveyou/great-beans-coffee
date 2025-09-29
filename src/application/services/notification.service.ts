import { IEmailService } from './email.service';

export interface INotificationService {
  sendRfqNotification(rfqId: string, status: string, email: string): Promise<boolean>;
  sendAdminNotification(message: string): Promise<boolean>;
  sendStatusChangeNotification(rfqId: string, oldStatus: string, newStatus: string, email: string): Promise<boolean>;
}

export class NotificationService implements INotificationService {
  constructor(private emailService: IEmailService) {}

  async sendRfqNotification(rfqId: string, status: string, email: string): Promise<boolean> {
    try {
      const success = await this.emailService.sendRfqStatusUpdate(email, rfqId, status);
      
      if (success) {
        console.log(`RFQ notification sent for ${rfqId} with status ${status}`);
      }
      
      return success;
    } catch (error) {
      console.error('Failed to send RFQ notification:', error);
      return false;
    }
  }

  async sendAdminNotification(message: string): Promise<boolean> {
    try {
      // In a real implementation, this would send to admin email or Slack
      console.log(`Admin notification: ${message}`);
      
      // Simulate notification sending
      await new Promise(resolve => setTimeout(resolve, 50));
      
      return true;
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      return false;
    }
  }

  async sendStatusChangeNotification(
    rfqId: string, 
    oldStatus: string, 
    newStatus: string, 
    email: string
  ): Promise<boolean> {
    try {
      const message = `RFQ ${rfqId} status changed from ${oldStatus} to ${newStatus}`;
      
      // Send notification to customer
      const customerNotified = await this.emailService.sendRfqStatusUpdate(email, rfqId, newStatus);
      
      // Send notification to admin
      const adminNotified = await this.sendAdminNotification(message);
      
      return customerNotified && adminNotified;
    } catch (error) {
      console.error('Failed to send status change notification:', error);
      return false;
    }
  }
}