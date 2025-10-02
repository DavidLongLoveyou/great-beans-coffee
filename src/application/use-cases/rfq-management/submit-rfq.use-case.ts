import { IEmailService } from '@/application/services/email.service';
import { NotificationService } from '@/application/services/notification.service';
import { RFQEntity, type RFQ } from '@/domain/entities/rfq.entity';
import { IRFQRepository } from '@/domain/repositories/rfq.repository';

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

  // Recurring Order
  isRecurringOrder?: boolean;
  recurringFrequency?: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';

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
  rfq: RFQEntity;
  rfqNumber: string;
  success: boolean;
  message: string;
}

export class SubmitRfqUseCase {
  constructor(
    private rfqRepository: IRFQRepository,
    private emailService: IEmailService,
    private notificationService: NotificationService
  ) {}

  async execute(request: SubmitRfqRequest): Promise<SubmitRfqResponse> {
    try {
      // Validate required fields
      this.validateRequest(request);

      // Generate RFQ number
      const rfqNumber = this.generateRfqNumber();

      // Create RFQ entity
      const now = new Date();
      const rfqData: RFQ = {
        id: crypto.randomUUID(),
        rfqNumber,
        status: 'SUBMITTED',
        priority: request.urgency === 'high' ? 'HIGH' : request.urgency === 'medium' ? 'MEDIUM' : 'LOW',
        source: 'WEBSITE',
        
        productRequirements: {
          coffeeType: request.productType[0] as any, // Take first type
          grade: request.grade[0],
          processingMethod: request.processingMethod[0],
          origin: request.origin[0],
          certifications: request.certifications as any[],
        },
        
        quantityRequirements: {
          quantity: request.quantity,
          unit: request.quantityUnit as any,
          isRecurringOrder: request.isRecurringOrder || false,
          recurringFrequency: request.isRecurringOrder ? request.recurringFrequency as any : undefined,
        },
        
        deliveryRequirements: {
          incoterms: request.deliveryTerms as any,
          destinationPort: request.deliveryLocation,
          destinationCountry: request.country,
          preferredDeliveryDate: request.deliveryDate,
          latestDeliveryDate: request.deliveryDate,
          packaging: 'JUTE_BAGS_60KG' as any, // Default packaging
        },
        
        paymentTerms: {
          preferredCurrency: request.currency as any,
          paymentMethod: request.paymentMethod[0] as any,
          paymentTerms: request.paymentTerms,
        },
        
        companyInfo: {
          companyName: request.companyName,
          contactPerson: request.contactPerson,
          email: request.email,
          phone: request.phone,
          address: {
            street: '',
            city: '',
            postalCode: '',
            country: request.country,
          },
          businessType: request.businessType as any,
        },
        
        additionalRequirements: request.additionalRequirements,
        sampleRequired: request.sampleRequired,
        submittedAt: now,
        lastActivityAt: now,
        createdAt: now,
        updatedAt: now,
        updatedBy: crypto.randomUUID(), // System user ID
      };

      // Create RFQ entity and prepare data for repository
      const rfqEntity = new RFQEntity(rfqData);
      
      // Extract data without id, createdAt, updatedAt for repository
      const { id, createdAt, updatedAt, ...entityDataForRepo } = rfqEntity.toJSON();
      const savedRfq = await this.rfqRepository.create(entityDataForRepo as any);

      // Send confirmation email to customer
      await this.sendCustomerConfirmation(savedRfq);

      // Send notification to admin
      await this.sendAdminNotification(savedRfq);

      // Send internal notification
      await this.notificationService.sendAdminNotification(
        `New RFQ submitted: ${rfqNumber} from ${request.companyName}`
      );

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

  private generateRfqNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Use timestamp for unique numbering
    return `RFQ-${year}${month}${day}-${hours}${minutes}${seconds}`;
  }

  private async sendCustomerConfirmation(rfq: RFQEntity): Promise<void> {
    try {
      const subject = `RFQ Confirmation - ${rfq.rfqNumber}`;
      const content = `
        Dear ${rfq.companyInfo.contactPerson},
        
        Thank you for submitting your RFQ ${rfq.rfqNumber}.
        
        Company: ${rfq.companyInfo.companyName}
        Product Type: ${rfq.productRequirements.coffeeType}
        Quantity: ${rfq.quantityRequirements.quantity} ${rfq.quantityRequirements.unit}
        
        We will review your request and get back to you within 24 hours.
        
        Best regards,
        The Great Beans Team
      `;
      
      await this.emailService.sendEmail(rfq.companyInfo.email, subject, content);
    } catch (error) {
      console.error('Failed to send customer confirmation:', error);
      // Don't throw error to prevent RFQ submission failure
    }
  }

  private async sendAdminNotification(rfq: RFQEntity): Promise<void> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@greatbeans.com';
      const subject = `New RFQ Submitted - ${rfq.rfqNumber}`;
      const content = `
        New RFQ has been submitted:
        
        RFQ Number: ${rfq.rfqNumber}
        Company: ${rfq.companyInfo.companyName}
        Contact: ${rfq.companyInfo.contactPerson}
        Email: ${rfq.companyInfo.email}
        Product: ${rfq.productRequirements.coffeeType}
        Quantity: ${rfq.quantityRequirements.quantity} ${rfq.quantityRequirements.unit}
        Priority: ${rfq.priority}
        
        Please review and assign to appropriate team member.
      `;
      
      await this.emailService.sendEmail(adminEmail, subject, content);
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      // Don't throw error to prevent RFQ submission failure
    }
  }
}
