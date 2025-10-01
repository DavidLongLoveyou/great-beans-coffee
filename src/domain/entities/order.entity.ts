import { z } from 'zod';

import { IncotermsSchema } from './rfq.entity';

// Order Status Enum
export const OrderStatusSchema = z.enum([
  'DRAFT',
  'PENDING_APPROVAL',
  'CONFIRMED',
  'IN_PRODUCTION',
  'QUALITY_CHECK',
  'READY_FOR_SHIPMENT',
  'SHIPPED',
  'IN_TRANSIT',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'ON_HOLD',
  'RETURNED',
]);

// Payment Status Enum
export const PaymentStatusSchema = z.enum([
  'PENDING',
  'PARTIAL',
  'PAID',
  'OVERDUE',
  'REFUNDED',
  'CANCELLED',
]);

// Shipment Status Enum
export const ShipmentStatusSchema = z.enum([
  'NOT_SHIPPED',
  'PREPARING',
  'READY_TO_SHIP',
  'SHIPPED',
  'IN_TRANSIT',
  'CUSTOMS_CLEARANCE',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'EXCEPTION',
  'RETURNED',
]);

// Order Priority Enum
export const OrderPrioritySchema = z.enum([
  'LOW',
  'MEDIUM',
  'HIGH',
  'URGENT',
  'RUSH',
]);

// Order Item Schema
export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  productSku: z.string(),
  productName: z.string(),
  productType: z.enum(['ROBUSTA', 'ARABICA', 'BLEND', 'INSTANT']),
  grade: z.string(),
  processingMethod: z.string().optional(),

  // Quantity and pricing
  quantity: z.number().positive(),
  unit: z.enum(['MT', 'KG', 'LB', 'BAGS']),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'JPY', 'GBP']),

  // Specifications
  specifications: z.record(z.string(), z.any()).optional(),
  qualityRequirements: z
    .object({
      moisture: z.number().min(0).max(20).optional(),
      screenSize: z.string().optional(),
      defectRate: z.number().min(0).max(100).optional(),
      cuppingScore: z.number().min(0).max(100).optional(),
    })
    .optional(),

  // Packaging
  packaging: z.object({
    type: z.enum([
      'JUTE_BAGS_60KG',
      'JUTE_BAGS_69KG',
      'PP_BAGS_60KG',
      'BULK_CONTAINER',
      'VACUUM_BAGS',
      'CUSTOM_PACKAGING',
    ]),
    unitsPerPackage: z.number().positive(),
    totalPackages: z.number().positive(),
    customSpecs: z.string().optional(),
  }),

  // Delivery
  requestedDeliveryDate: z.date(),
  confirmedDeliveryDate: z.date().optional(),
  actualDeliveryDate: z.date().optional(),

  // Status tracking
  status: OrderStatusSchema,
  productionStartDate: z.date().optional(),
  qualityCheckDate: z.date().optional(),
  readyForShipmentDate: z.date().optional(),

  // Notes and special instructions
  specialInstructions: z.string().optional(),
  notes: z.string().optional(),
});

// Payment Terms Schema
export const OrderPaymentTermsSchema = z.object({
  method: z.enum(['LC', 'TT', 'CAD', 'DP', 'DA']), // Letter of Credit, Telegraphic Transfer, etc.
  terms: z.string(), // e.g., "30% advance, 70% against shipping documents"
  currency: z.enum(['USD', 'EUR', 'JPY', 'GBP']),
  creditPeriod: z.number().min(0).optional(), // Days

  // Payment schedule
  schedule: z.array(
    z.object({
      id: z.string().uuid(),
      description: z.string(),
      percentage: z.number().min(0).max(100),
      amount: z.number().positive(),
      dueDate: z.date(),
      status: PaymentStatusSchema,
      paidDate: z.date().optional(),
      paidAmount: z.number().min(0).optional(),
      reference: z.string().optional(),
    })
  ),

  // Banking details
  bankingDetails: z
    .object({
      beneficiaryName: z.string(),
      bankName: z.string(),
      accountNumber: z.string(),
      swiftCode: z.string(),
      iban: z.string().optional(),
      bankAddress: z.string(),
    })
    .optional(),
});

// Shipping Details Schema
export const ShippingDetailsSchema = z.object({
  incoterms: IncotermsSchema,

  // Origin
  originPort: z.string(),
  originAddress: z.object({
    company: z.string(),
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string(),
  }),

  // Destination
  destinationPort: z.string(),
  destinationAddress: z.object({
    company: z.string(),
    contactPerson: z.string(),
    phone: z.string(),
    email: z.string().email(),
    street: z.string(),
    city: z.string(),
    state: z.string().optional(),
    postalCode: z.string(),
    country: z.string(),
  }),

  // Shipping details
  shippingLine: z.string().optional(),
  vessel: z.string().optional(),
  containerType: z.enum(['20FT', '40FT', '40FT_HC', 'BULK']).optional(),
  containerNumber: z.string().optional(),
  billOfLadingNumber: z.string().optional(),

  // Dates
  estimatedShipmentDate: z.date(),
  actualShipmentDate: z.date().optional(),
  estimatedArrivalDate: z.date(),
  actualArrivalDate: z.date().optional(),

  // Tracking
  trackingNumber: z.string().optional(),
  status: ShipmentStatusSchema,

  // Insurance
  insuranceRequired: z.boolean().default(false),
  insuranceValue: z.number().positive().optional(),
  insuranceProvider: z.string().optional(),

  // Special instructions
  shippingInstructions: z.string().optional(),
  customsInstructions: z.string().optional(),
});

// Quality Control Schema
export const QualityControlSchema = z.object({
  inspector: z.string().uuid(),
  inspectionDate: z.date(),
  inspectionLocation: z.string(),

  // Test results
  moistureContent: z.number().min(0).max(20),
  screenAnalysis: z.record(z.string(), z.number()),
  defectCount: z.number().min(0),
  cuppingScore: z.number().min(0).max(100).optional(),

  // Certificates
  qualityCertificate: z
    .object({
      certificateNumber: z.string(),
      issuedDate: z.date(),
      issuedBy: z.string(),
      fileUrl: z.string().url(),
    })
    .optional(),

  // Compliance
  certifications: z
    .array(
      z.enum([
        'ORGANIC',
        'FAIRTRADE',
        'RAINFOREST_ALLIANCE',
        'UTZ',
        'C_CAFE_PRACTICES',
        'BIRD_FRIENDLY',
        'SHADE_GROWN',
        'DIRECT_TRADE',
        'ISO_22000',
        'HACCP',
        'BRC',
        'SQF',
        'KOSHER',
        'HALAL',
      ])
    )
    .optional(),

  // Results
  passed: z.boolean(),
  notes: z.string().optional(),
  correctionRequired: z.boolean().default(false),
  correctionNotes: z.string().optional(),
});

// Order Document Schema
export const OrderDocumentSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'PURCHASE_ORDER',
    'PROFORMA_INVOICE',
    'COMMERCIAL_INVOICE',
    'PACKING_LIST',
    'BILL_OF_LADING',
    'CERTIFICATE_OF_ORIGIN',
    'QUALITY_CERTIFICATE',
    'INSURANCE_CERTIFICATE',
    'CUSTOMS_DECLARATION',
    'SHIPPING_INSTRUCTION',
    'PAYMENT_RECEIPT',
    'LETTER_OF_CREDIT',
    'OTHER',
  ]),
  fileName: z.string(),
  fileUrl: z.string().url(),
  fileSize: z.number().positive(),
  uploadedBy: z.string().uuid(),
  uploadedAt: z.date(),
  isRequired: z.boolean().default(false),
  isVerified: z.boolean().default(false),
  verifiedBy: z.string().uuid().optional(),
  verifiedAt: z.date().optional(),
  notes: z.string().optional(),
});

// Order Communication Schema
export const OrderCommunicationSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['EMAIL', 'PHONE', 'MEETING', 'NOTE', 'SYSTEM_UPDATE']),
  subject: z.string().optional(),
  content: z.string(),
  isInternal: z.boolean().default(false),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  attachments: z.array(z.string().url()).optional(),
  relatedDocuments: z.array(z.string().uuid()).optional(),
});

// Main Order Schema
export const OrderSchema = z.object({
  id: z.string().uuid(),
  orderNumber: z.string().min(1), // Auto-generated unique number

  // Related entities
  rfqId: z.string().uuid().optional(), // If order originated from RFQ
  clientId: z.string().uuid(),

  // Order details
  status: OrderStatusSchema,
  priority: OrderPrioritySchema,
  type: z.enum(['STANDARD', 'RUSH', 'SAMPLE', 'TRIAL', 'RECURRING']),

  // Items and pricing
  items: z.array(OrderItemSchema).min(1),
  subtotal: z.number().positive(),
  taxes: z.number().min(0).default(0),
  shippingCost: z.number().min(0).default(0),
  insuranceCost: z.number().min(0).default(0),
  otherCharges: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  totalAmount: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'JPY', 'GBP']),

  // Payment and shipping
  paymentTerms: OrderPaymentTermsSchema,
  paymentStatus: PaymentStatusSchema,
  shippingDetails: ShippingDetailsSchema,

  // Quality control
  qualityControl: QualityControlSchema.optional(),

  // Documents and communications
  documents: z.array(OrderDocumentSchema).optional(),
  communications: z.array(OrderCommunicationSchema).optional(),

  // Dates
  orderDate: z.date(),
  confirmedDate: z.date().optional(),
  requestedDeliveryDate: z.date(),
  promisedDeliveryDate: z.date().optional(),
  actualDeliveryDate: z.date().optional(),

  // Assignment and tracking
  assignedTo: z.string().uuid().optional(),
  salesRep: z.string().uuid(),
  accountManager: z.string().uuid().optional(),

  // Contract details
  contractNumber: z.string().optional(),
  contractTerms: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurringFrequency: z
    .enum(['MONTHLY', 'QUARTERLY', 'SEMI_ANNUAL', 'ANNUAL'])
    .optional(),

  // Special requirements
  specialInstructions: z.string().optional(),
  internalNotes: z.string().optional(),

  // Audit fields
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

// Type exports
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;
export type ShipmentStatus = z.infer<typeof ShipmentStatusSchema>;
export type OrderPriority = z.infer<typeof OrderPrioritySchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type OrderPaymentTerms = z.infer<typeof OrderPaymentTermsSchema>;
export type ShippingDetails = z.infer<typeof ShippingDetailsSchema>;
export type QualityControl = z.infer<typeof QualityControlSchema>;
export type OrderDocument = z.infer<typeof OrderDocumentSchema>;
export type OrderCommunication = z.infer<typeof OrderCommunicationSchema>;
export type Order = z.infer<typeof OrderSchema>;

// Order Entity Class
export class OrderEntity {
  constructor(private readonly data: Order) {
    OrderEntity.validate(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get orderNumber(): string {
    return this.data.orderNumber;
  }
  get status(): OrderStatus {
    return this.data.status;
  }
  get priority(): OrderPriority {
    return this.data.priority;
  }
  get clientId(): string {
    return this.data.clientId;
  }
  get totalAmount(): number {
    return this.data.totalAmount;
  }
  get currency(): string {
    return this.data.currency;
  }
  get items(): OrderItem[] {
    return this.data.items;
  }
  get paymentStatus(): PaymentStatus {
    return this.data.paymentStatus;
  }
  get createdAt(): Date {
    return this.data.createdAt;
  }
  get updatedAt(): Date {
    return this.data.updatedAt;
  }

  // Business logic methods
  isActive(): boolean {
    return !['COMPLETED', 'CANCELLED'].includes(this.data.status);
  }

  isInProduction(): boolean {
    return ['IN_PRODUCTION', 'QUALITY_CHECK', 'READY_FOR_SHIPMENT'].includes(
      this.data.status
    );
  }

  isShipped(): boolean {
    return ['SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'].includes(
      this.data.status
    );
  }

  isCompleted(): boolean {
    return this.data.status === 'COMPLETED';
  }

  isOverdue(): boolean {
    if (this.isCompleted()) return false;
    return this.data.requestedDeliveryDate < new Date();
  }

  isRushOrder(): boolean {
    return this.data.priority === 'RUSH' || this.data.type === 'RUSH';
  }

  isPaid(): boolean {
    return this.data.paymentStatus === 'PAID';
  }

  hasOutstandingPayment(): boolean {
    return ['PENDING', 'PARTIAL', 'OVERDUE'].includes(this.data.paymentStatus);
  }

  getTotalWeight(): number {
    return this.data.items.reduce((total, item) => {
      // Convert all to MT for consistency
      let weightInMT = item.quantity;
      switch (item.unit) {
        case 'KG':
          weightInMT = item.quantity / 1000;
          break;
        case 'LB':
          weightInMT = item.quantity / 2204.62;
          break;
        case 'BAGS':
          weightInMT = (item.quantity * 60) / 1000; // Assuming 60kg bags
          break;
      }
      return total + weightInMT;
    }, 0);
  }

  getTotalPackages(): number {
    return this.data.items.reduce(
      (total, item) => total + item.packaging.totalPackages,
      0
    );
  }

  getDaysUntilDelivery(): number {
    const targetDate =
      this.data.promisedDeliveryDate || this.data.requestedDeliveryDate;
    const now = new Date();
    return Math.ceil(
      (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  getOutstandingAmount(): number {
    const paidAmount = this.data.paymentTerms.schedule.reduce(
      (total, payment) => {
        return total + (payment.paidAmount || 0);
      },
      0
    );
    return this.data.totalAmount - paidAmount;
  }

  getPaymentProgress(): number {
    const paidAmount = this.data.totalAmount - this.getOutstandingAmount();
    return (paidAmount / this.data.totalAmount) * 100;
  }

  requiresQualityCheck(): boolean {
    return this.data.items.some(
      item =>
        item.qualityRequirements &&
        Object.keys(item.qualityRequirements).length > 0
    );
  }

  hasRequiredDocuments(): boolean {
    const requiredDocs =
      this.data.documents?.filter(doc => doc.isRequired) || [];
    return requiredDocs.every(doc => doc.isVerified);
  }

  canBeShipped(): boolean {
    return (
      this.data.status === 'READY_FOR_SHIPMENT' &&
      this.hasRequiredDocuments() &&
      (!this.requiresQualityCheck() || this.data.qualityControl?.passed)
    );
  }

  // Update methods
  updateStatus(status: OrderStatus, updatedBy: string): OrderEntity {
    return new OrderEntity({
      ...this.data,
      status,
      updatedAt: new Date(),
      updatedBy,
    });
  }

  updatePaymentStatus(
    paymentStatus: PaymentStatus,
    updatedBy: string
  ): OrderEntity {
    return new OrderEntity({
      ...this.data,
      paymentStatus,
      updatedAt: new Date(),
      updatedBy,
    });
  }

  addCommunication(
    communication: Omit<OrderCommunication, 'id' | 'createdAt'>
  ): OrderEntity {
    const newCommunication: OrderCommunication = {
      ...communication,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    return new OrderEntity({
      ...this.data,
      communications: [...(this.data.communications || []), newCommunication],
      updatedAt: new Date(),
    });
  }

  addDocument(document: Omit<OrderDocument, 'id' | 'uploadedAt'>): OrderEntity {
    const newDocument: OrderDocument = {
      ...document,
      id: crypto.randomUUID(),
      uploadedAt: new Date(),
    };

    return new OrderEntity({
      ...this.data,
      documents: [...(this.data.documents || []), newDocument],
      updatedAt: new Date(),
    });
  }

  recordPayment(
    paymentId: string,
    amount: number,
    reference?: string
  ): OrderEntity {
    const updatedSchedule = this.data.paymentTerms.schedule.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status: 'PAID' as PaymentStatus,
          paidDate: new Date(),
          paidAmount: amount,
          reference,
        };
      }
      return payment;
    });

    // Determine overall payment status
    const totalPaid = updatedSchedule.reduce(
      (sum, p) => sum + (p.paidAmount || 0),
      0
    );
    let paymentStatus: PaymentStatus = 'PENDING';

    if (totalPaid >= this.data.totalAmount) {
      paymentStatus = 'PAID';
    } else if (totalPaid > 0) {
      paymentStatus = 'PARTIAL';
    }

    return new OrderEntity({
      ...this.data,
      paymentTerms: {
        ...this.data.paymentTerms,
        schedule: updatedSchedule,
      },
      paymentStatus,
      updatedAt: new Date(),
    });
  }

  setQualityControl(qualityControl: QualityControl): OrderEntity {
    const newStatus = qualityControl.passed
      ? 'READY_FOR_SHIPMENT'
      : 'QUALITY_CHECK';

    return new OrderEntity({
      ...this.data,
      qualityControl,
      status: newStatus,
      updatedAt: new Date(),
    });
  }

  // Static methods
  static validate(data: unknown): Order {
    return OrderSchema.parse(data);
  }

  static isValid(data: unknown): boolean {
    try {
      OrderSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  static create(
    data: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ): OrderEntity {
    const now = new Date();
    const orderData: Order = {
      ...data,
      id: crypto.randomUUID(),
      orderNumber: OrderEntity.generateOrderNumber(),
      createdAt: now,
      updatedAt: now,
    };

    return new OrderEntity(orderData);
  }

  static generateOrderNumber(): string {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-6);
    return `ORD-${year}${month}-${timestamp}`;
  }

  toJSON(): Order {
    return { ...this.data };
  }
}
