export interface IEmailService {
  sendEmail(to: string, subject: string, content: string): Promise<boolean>;
  sendRfqConfirmation(email: string, rfqNumber: string): Promise<boolean>;
  sendRfqStatusUpdate(email: string, rfqNumber: string, status: string): Promise<boolean>;
}

export class EmailService implements IEmailService {
  async sendEmail(to: string, subject: string, content: string): Promise<boolean> {
    try {
      // In a real implementation, this would integrate with an email service like SendGrid, AWS SES, etc.
      console.log(`Sending email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Content: ${content}`);
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  async sendRfqConfirmation(email: string, rfqNumber: string): Promise<boolean> {
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

  async sendRfqStatusUpdate(email: string, rfqNumber: string, status: string): Promise<boolean> {
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