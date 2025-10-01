import { IEmailService } from '@/application/services/email.service';
import { INotificationService } from '@/application/services/notification.service';
import { RfqEntity } from '@/domain/entities/rfq.entity';
import { IRfqRepository } from '@/infrastructure/database/repositories/rfq.repository';

export interface SubmitRfqRequest {
  // Product Requirements
  productType: string[];
  grade: string[];
  origin: string[];
  processingMethod: string[];
  certifications: string[];

  // Quantity & Delivery
  quantity: number;
  quantityUnit: string;
  deliveryTerms: string;
  targetPrice: number;
  currency: string;
  deliveryDate: Date;
  deliveryLocation: string;

  // Payment Terms
  paymentTerms: string;
  paymentMethod: string[];

  // Company Information
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  businessType: string;

  // Additional Details
  additionalRequirements?: string;
  sampleRequired: boolean;
  urgency: 'low' | 'medium' | 'high';

  // Metadata
  locale?: string;
}

export interface SubmitRfqResponse {
  rfq: RfqEntity;
  rfqNumber: string;
  success: boolean;
  message: string;
}

export class SubmitRfqUseCase {
  constructor(
    private rfqRepository: IRfqRepository,
    private emailService: IEmailService,
    private notificationService: INotificationService
  ) {}

  async execute(request: SubmitRfqRequest): Promise<SubmitRfqResponse> {
    try {
      // Validate required fields
      this.validateRequest(request);

      // Generate RFQ number
      const rfqNumber = await this.generateRfqNumber();

      // Create RFQ entity
      const rfqData: Partial<RfqEntity> = {
        rfqNumber,
        productType: request.productType,
        grade: request.grade,
        origin: request.origin,
        processingMethod: request.processingMethod,
        certifications: request.certifications,
        quantity: request.quantity,
        quantityUnit: request.quantityUnit,
        deliveryTerms: request.deliveryTerms,
        targetPrice: request.targetPrice,
        currency: request.currency,
        deliveryDate: request.deliveryDate,
        deliveryLocation: request.deliveryLocation,
        paymentTerms: request.paymentTerms,
        paymentMethod: request.paymentMethod,
        companyName: request.companyName,
        contactPerson: request.contactPerson,
        email: request.email,
        phone: request.phone,
        country: request.country,
        businessType: request.businessType,
        additionalRequirements: request.additionalRequirements,
        sampleRequired: request.sampleRequired,
        urgency: request.urgency,
        status: 'pending',
        submittedAt: new Date(),
        locale: request.locale || 'en',
      };

      // Save RFQ to database
      const savedRfq = await this.rfqRepository.create(rfqData as RfqEntity);

      // Send confirmation email to customer
      await this.sendCustomerConfirmation(savedRfq);

      // Send notification to admin
      await this.sendAdminNotification(savedRfq);

      // Send internal notification
      await this.notificationService.sendRfqSubmissionNotification(savedRfq);

      return {
        rfq: savedRfq,
        rfqNumber,
        success: true,
        message: 'RFQ submitted successfully',
      };
    } catch (error) {
      console.error('Error submitting RFQ:', error);
      throw new Error('Failed to submit RFQ');
    }
  }

  private validateRequest(request: SubmitRfqRequest): void {
    const requiredFields = [
      'productType',
      'quantity',
      'quantityUnit',
      'deliveryTerms',
      'companyName',
      'contactPerson',
      'email',
      'phone',
      'country',
    ];

    for (const field of requiredFields) {
      if (!request[field as keyof SubmitRfqRequest]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }

    // Validate quantity
    if (request.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
  }

  private async generateRfqNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');

    // Get count of RFQs today for sequential numbering
    const todayCount = await this.rfqRepository.getCountByDate(now);
    const sequence = String(todayCount + 1).padStart(3, '0');

    return `RFQ-${year}${month}${day}-${sequence}`;
  }

  private async sendCustomerConfirmation(rfq: RfqEntity): Promise<void> {
    try {
      await this.emailService.sendRfqConfirmation({
        to: rfq.email,
        customerName: rfq.contactPerson,
        rfqNumber: rfq.rfqNumber,
        rfqDetails: rfq,
        locale: rfq.locale,
      });
    } catch (error) {
      console.error('Failed to send customer confirmation email:', error);
      // Don't throw error - RFQ submission should still succeed
    }
  }

  private async sendAdminNotification(rfq: RfqEntity): Promise<void> {
    try {
      await this.emailService.sendRfqAdminNotification({
        rfq,
        adminEmail: process.env.ADMIN_EMAIL || 'admin@greatbeans.com',
      });
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
      // Don't throw error - RFQ submission should still succeed
    }
  }
}
