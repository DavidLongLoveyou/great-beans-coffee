import { createScopedLogger } from '../../shared/utils/logger';

const logger = createScopedLogger('EmailService');

export interface EmailService {
  sendEmail(to: string, subject: string, content: string): Promise<boolean>;
}

class _MockEmailService implements EmailService {
  async sendEmail(
    to: string,
    subject: string,
    content: string
  ): Promise<boolean> {
    // Mock implementation for development
    logger.info(`Sending email to: ${to}`);
    logger.info(`Subject: ${subject}`);
    logger.debug(`Content: ${content}`);

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // In a real implementation, this would integrate with SendGrid, AWS SES, etc.
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  async sendRfqConfirmation(
    email: string,
    rfqNumber: string
  ): Promise<boolean> {
    const subject = `RFQ Confirmation - ${rfqNumber}`;
    const content = `
      Dear Customer,
      
      Thank you for submitting your Request for Quote (RFQ) ${rfqNumber}.
      
      We have received your inquiry and our team will review it shortly.
      You will receive a detailed quote within 24-48 hours.
      
      Best regards,
      The Great Beans Team
    `;

    return this.sendEmail(email, subject, content);
  }

  async sendRfqStatusUpdate(
    email: string,
    rfqNumber: string,
    status: string
  ): Promise<boolean> {
    const subject = `RFQ Status Update - ${rfqNumber}`;
    const content = `
      Dear Customer,
      
      Your RFQ ${rfqNumber} status has been updated to: ${status.toUpperCase()}
      
      Please log in to your account to view the details.
      
      Best regards,
      The Great Beans Team
    `;

    return this.sendEmail(email, subject, content);
  }
}
