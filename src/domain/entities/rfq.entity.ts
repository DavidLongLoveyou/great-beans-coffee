import { z } from 'zod';

import { CoffeeTypeSchema, CertificationSchema } from './coffee-product.entity';

// RFQ Status Enum
export const RFQStatusSchema = z.enum([
  'PENDING',
  'IN_REVIEW',
  'QUOTED',
  'NEGOTIATING',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
]);

// RFQ Priority Enum
export const RFQPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);

// Packaging Type Enum
export const PackagingTypeSchema = z.enum([
  'JUTE_BAGS_60KG',
  'JUTE_BAGS_69KG',
  'PP_BAGS_60KG',
  'BULK_CONTAINER',
  'VACUUM_BAGS',
  'CUSTOM_PACKAGING',
]);

// Incoterms Enum
export const IncotermsSchema = z.enum([
  'EXW', // Ex Works
  'FCA', // Free Carrier
  'CPT', // Carriage Paid To
  'CIP', // Carriage and Insurance Paid To
  'DAP', // Delivered at Place
  'DPU', // Delivered at Place Unloaded
  'DDP', // Delivered Duty Paid
  'FAS', // Free Alongside Ship
  'FOB', // Free on Board
  'CFR', // Cost and Freight
  'CIF', // Cost, Insurance and Freight
]);

// Product Requirements Schema
export const ProductRequirementsSchema = z.object({
  coffeeType: CoffeeTypeSchema,
  grade: z.string().optional(), // Flexible grade specification
  processingMethod: z.string().optional(),
  screenSize: z.string().optional(),
  moistureMax: z.number().min(0).max(20).optional(),
  defectRateMax: z.number().min(0).max(100).optional(),
  cuppingScoreMin: z.number().min(0).max(100).optional(),
  certifications: z.array(CertificationSchema).optional(),
  origin: z.string().optional(), // Specific region/province
  harvestYear: z.string().optional(),
  additionalSpecs: z.record(z.string(), z.any()).optional(),
});

// Quantity Requirements Schema
export const QuantityRequirementsSchema = z.object({
  quantity: z.number().positive(),
  unit: z.enum(['MT', 'KG', 'LB', 'BAGS']),
  tolerance: z.number().min(0).max(100).optional(), // Percentage tolerance
  isRecurringOrder: z.boolean().default(false),
  recurringFrequency: z
    .enum(['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'])
    .optional(),
  contractDuration: z.number().positive().optional(), // Months
});

// Delivery Requirements Schema
export const DeliveryRequirementsSchema = z.object({
  incoterms: IncotermsSchema,
  destinationPort: z.string(),
  destinationCountry: z.string(),
  destinationCity: z.string().optional(),
  preferredDeliveryDate: z.date(),
  latestDeliveryDate: z.date(),
  packaging: PackagingTypeSchema,
  customPackagingSpecs: z.string().optional(),
  shippingInstructions: z.string().optional(),
});

// Payment Terms Schema
export const PaymentTermsSchema = z.object({
  preferredCurrency: z.enum(['USD', 'EUR', 'JPY', 'GBP']),
  paymentMethod: z.enum(['LC', 'TT', 'CAD', 'DP', 'DA']), // Letter of Credit, Telegraphic Transfer, Cash Against Documents, Documents against Payment, Documents against Acceptance
  paymentTerms: z.string(), // e.g., "30% advance, 70% against shipping documents"
  creditPeriod: z.number().min(0).optional(), // Days
  budgetRange: z
    .object({
      min: z.number().positive().optional(),
      max: z.number().positive().optional(),
    })
    .optional(),
});

// Company Information Schema
export const CompanyInfoSchema = z.object({
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  position: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(1),
  alternatePhone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string(),
  }),
  businessType: z.enum([
    'IMPORTER',
    'DISTRIBUTOR',
    'ROASTER',
    'RETAILER',
    'MANUFACTURER',
    'TRADER',
  ]),
  companySize: z
    .enum(['STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'])
    .optional(),
  annualVolume: z.string().optional(), // e.g., "100-500 MT"
  businessLicense: z.string().optional(),
  taxId: z.string().optional(),
});

// RFQ Documents Schema
export const RFQDocumentSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'COMPANY_PROFILE',
    'BUSINESS_LICENSE',
    'IMPORT_LICENSE',
    'SPECIFICATION_SHEET',
    'OTHER',
  ]),
  fileName: z.string(),
  fileUrl: z.string().url(),
  fileSize: z.number().positive(),
  uploadedAt: z.date(),
});

// RFQ Communication Schema
export const RFQCommunicationSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'NOTE',
    'EMAIL',
    'PHONE_CALL',
    'MEETING',
    'QUOTE_SENT',
    'SAMPLE_SENT',
  ]),
  subject: z.string().optional(),
  content: z.string(),
  isInternal: z.boolean().default(false),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  attachments: z.array(z.string().url()).optional(),
});

// RFQ Entity Schema
export const RFQSchema = z.object({
  id: z.string().uuid(),
  rfqNumber: z.string().min(1), // Auto-generated unique number

  // RFQ Status & Metadata
  status: RFQStatusSchema,
  priority: RFQPrioritySchema,

  // Requirements
  productRequirements: ProductRequirementsSchema,
  quantityRequirements: QuantityRequirementsSchema,
  deliveryRequirements: DeliveryRequirementsSchema,
  paymentTerms: PaymentTermsSchema,

  // Company Information
  companyInfo: CompanyInfoSchema,

  // Additional Information
  additionalRequirements: z.string().optional(),
  sampleRequired: z.boolean().default(false),
  sampleAddress: z.string().optional(),
  urgencyReason: z.string().optional(),

  // Internal Fields
  assignedTo: z.string().uuid().optional(),
  estimatedValue: z.number().positive().optional(),
  probability: z.number().min(0).max(100).optional(), // Closing probability
  competitorInfo: z.string().optional(),

  // Documents & Communications
  documents: z.array(RFQDocumentSchema).optional(),
  communications: z.array(RFQCommunicationSchema).optional(),

  // Quotes & Follow-ups
  quoteSentAt: z.date().optional(),
  quoteValidUntil: z.date().optional(),
  followUpDate: z.date().optional(),

  // System Fields
  submittedAt: z.date(),
  lastActivityAt: z.date(),
  expiresAt: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid().optional(), // Optional for public submissions
  updatedBy: z.string().uuid(),
});

// Type Exports
export type RFQStatus = z.infer<typeof RFQStatusSchema>;
export type RFQPriority = z.infer<typeof RFQPrioritySchema>;
export type PackagingType = z.infer<typeof PackagingTypeSchema>;
export type Incoterms = z.infer<typeof IncotermsSchema>;

// Aliases for seed data compatibility
export type Priority = RFQPriority;
export type ShippingTerms = Incoterms;
export type ProductRequirements = z.infer<typeof ProductRequirementsSchema>;
export type QuantityRequirements = z.infer<typeof QuantityRequirementsSchema>;
export type DeliveryRequirements = z.infer<typeof DeliveryRequirementsSchema>;
export type PaymentTerms = z.infer<typeof PaymentTermsSchema>;
export type CompanyInfo = z.infer<typeof CompanyInfoSchema>;
export type RFQDocument = z.infer<typeof RFQDocumentSchema>;
export type RFQCommunication = z.infer<typeof RFQCommunicationSchema>;
export type RFQ = z.infer<typeof RFQSchema>;

// RFQ Entity Class
export class RFQEntity {
  constructor(private readonly data: RFQ) {
    RFQSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get rfqNumber(): string {
    return this.data.rfqNumber;
  }
  get status(): RFQStatus {
    return this.data.status;
  }
  get priority(): RFQPriority {
    return this.data.priority;
  }
  get companyInfo(): CompanyInfo {
    return this.data.companyInfo;
  }
  get productRequirements(): ProductRequirements {
    return this.data.productRequirements;
  }
  get quantityRequirements(): QuantityRequirements {
    return this.data.quantityRequirements;
  }
  get deliveryRequirements(): DeliveryRequirements {
    return this.data.deliveryRequirements;
  }
  get submittedAt(): Date {
    return this.data.submittedAt;
  }

  // Business Logic Methods
  isActive(): boolean {
    return !['EXPIRED', 'CANCELLED', 'REJECTED'].includes(this.data.status);
  }

  isExpired(): boolean {
    if (!this.data.expiresAt) return false;
    return new Date() > this.data.expiresAt;
  }

  canBeQuoted(): boolean {
    return (
      this.isActive() &&
      !this.isExpired() &&
      ['SUBMITTED', 'UNDER_REVIEW'].includes(this.data.status)
    );
  }

  requiresUrgentAttention(): boolean {
    return (
      this.data.priority === 'URGENT' ||
      Boolean(this.data.followUpDate && new Date() >= this.data.followUpDate)
    );
  }

  calculateEstimatedValue(): number | null {
    if (this.data.estimatedValue) return this.data.estimatedValue;

    // Basic estimation based on quantity and market prices
    const { quantity, unit } = this.data.quantityRequirements;
    const { budgetRange } = this.data.paymentTerms;

    if (budgetRange?.max) return budgetRange.max;
    if (budgetRange?.min) return budgetRange.min;

    // Fallback estimation (would use market data in real implementation)
    let estimatedPricePerUnit = 0;
    switch (this.data.productRequirements.coffeeType) {
      case 'ROBUSTA':
        estimatedPricePerUnit = 2500; // USD per MT
        break;
      case 'ARABICA':
        estimatedPricePerUnit = 4000; // USD per MT
        break;
      case 'BLEND':
        estimatedPricePerUnit = 3500; // USD per MT
        break;
      case 'INSTANT':
        estimatedPricePerUnit = 6000; // USD per MT
        break;
      default:
        estimatedPricePerUnit = 3000;
    }

    // Convert to MT if needed
    let quantityInMT = quantity;
    if (unit === 'KG') quantityInMT = quantity / 1000;
    if (unit === 'LB') quantityInMT = quantity / 2204.62;
    if (unit === 'BAGS') quantityInMT = quantity * 0.06; // Assuming 60kg bags

    return quantityInMT * estimatedPricePerUnit;
  }

  getDaysUntilDelivery(): number {
    const now = new Date();
    const deliveryDate = this.data.deliveryRequirements.preferredDeliveryDate;
    return Math.ceil(
      (deliveryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  isRecurringBusiness(): boolean {
    return this.data.quantityRequirements.isRecurringOrder;
  }

  getAnnualVolumePotential(): number | null {
    if (!this.isRecurringBusiness()) return null;

    const { quantity, recurringFrequency } = this.data.quantityRequirements;
    if (!recurringFrequency) return null;

    const multipliers = {
      MONTHLY: 12,
      QUARTERLY: 4,
      SEMI_ANNUAL: 2,
      ANNUAL: 1,
    };

    return quantity * multipliers[recurringFrequency];
  }

  addCommunication(
    communication: Omit<RFQCommunication, 'id' | 'createdAt'>
  ): RFQEntity {
    const newCommunication: RFQCommunication = {
      ...communication,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    const updatedData: RFQ = {
      ...this.data,
      communications: [...(this.data.communications || []), newCommunication],
      lastActivityAt: new Date(),
      updatedAt: new Date(),
    };

    return new RFQEntity(updatedData);
  }

  updateStatus(status: RFQStatus, updatedBy: string): RFQEntity {
    const updatedData: RFQ = {
      ...this.data,
      status,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
      updatedBy,
    };

    // Set quote sent timestamp
    if (status === 'QUOTED' && !this.data.quoteSentAt) {
      updatedData.quoteSentAt = new Date();
    }

    return new RFQEntity(updatedData);
  }

  assignTo(userId: string, updatedBy: string): RFQEntity {
    const updatedData: RFQ = {
      ...this.data,
      assignedTo: userId,
      lastActivityAt: new Date(),
      updatedAt: new Date(),
      updatedBy,
    };

    return new RFQEntity(updatedData);
  }

  setFollowUpDate(followUpDate: Date, updatedBy: string): RFQEntity {
    const updatedData: RFQ = {
      ...this.data,
      followUpDate,
      updatedAt: new Date(),
      updatedBy,
    };

    return new RFQEntity(updatedData);
  }

  // Validation Methods
  static validate(data: unknown): RFQ {
    return RFQSchema.parse(data);
  }

  static isValid(data: unknown): boolean {
    try {
      RFQSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  // Factory Methods
  static create(
    data: Omit<
      RFQ,
      | 'id'
      | 'rfqNumber'
      | 'createdAt'
      | 'updatedAt'
      | 'submittedAt'
      | 'lastActivityAt'
    >
  ): RFQEntity {
    const now = new Date();
    const rfqNumber = RFQEntity.generateRFQNumber();

    const rfqData: RFQ = {
      ...data,
      id: crypto.randomUUID(),
      rfqNumber,
      submittedAt: now,
      lastActivityAt: now,
      createdAt: now,
      updatedAt: now,
    };

    return new RFQEntity(rfqData);
  }

  static generateRFQNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);

    return `RFQ-${year}${month}${day}-${timestamp}`;
  }

  toJSON(): RFQ {
    return { ...this.data };
  }
}
