// Order DTOs for application layer communication
import { CoffeeGrade, CoffeeVariety, ProcessingMethod, CoffeeCertification } from '@/shared/components/design-system/types';

export interface OrderDto {
  id: string;
  orderNumber: string;
  quoteId?: string;
  rfqId?: string;
  status: 'DRAFT' | 'CONFIRMED' | 'PRODUCTION' | 'QUALITY_CHECK' | 'READY_TO_SHIP' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  // Client Information
  client: {
    id: string;
    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string;
    country: string;
  };
  
  // Order Items
  items: Array<{
    id: string;
    productId?: string;
    sku?: string;
    description: string;
    variety: CoffeeVariety;
    grade: CoffeeGrade;
    processingMethod: ProcessingMethod;
    origin: {
      country: string;
      region: string;
      province?: string;
      farm?: string;
    };
    certifications: CoffeeCertification[];
    quantity: number;
    unit: 'KG' | 'TONS' | 'BAGS' | 'CONTAINERS';
    unitPrice: number;
    totalPrice: number;
    packaging: string;
    specifications: {
      moistureContent: number;
      screenSize: string;
      defectRate: number;
      cupScore?: number;
    };
    productionStatus: 'PENDING' | 'IN_PRODUCTION' | 'QUALITY_CHECK' | 'READY' | 'SHIPPED';
    notes?: string;
  }>;
  
  // Financial Information
  financial: {
    subtotal: number;
    currency: string;
    incoterms: 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';
    additionalCosts: Array<{
      description: string;
      amount: number;
      type: 'SHIPPING' | 'INSURANCE' | 'HANDLING' | 'CERTIFICATION' | 'CUSTOMS' | 'OTHER';
    }>;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    exchangeRate?: number;
    baseCurrency?: string;
  };
  
  // Payment Information
  payment: {
    terms: string;
    method: 'LETTER_OF_CREDIT' | 'TELEGRAPHIC_TRANSFER' | 'CASH_ADVANCE' | 'OPEN_ACCOUNT' | 'OTHER';
    dueDate?: Date;
    installments?: Array<{
      amount: number;
      dueDate: Date;
      status: 'PENDING' | 'PAID' | 'OVERDUE';
      paidAt?: Date;
      reference?: string;
    }>;
    bankDetails?: {
      bankName: string;
      accountNumber: string;
      swiftCode: string;
      iban?: string;
      beneficiary: string;
    };
  };
  
  // Shipping Information
  shipping: {
    origin: {
      warehouse: string;
      address: string;
      port: string;
      city: string;
      country: string;
    };
    destination: {
      companyName: string;
      address: string;
      port?: string;
      city: string;
      country: string;
      contactPerson: string;
      phone?: string;
    };
    method: 'SEA_FREIGHT' | 'AIR_FREIGHT' | 'LAND_TRANSPORT' | 'MULTIMODAL';
    carrier?: string;
    trackingNumber?: string;
    containerType?: string;
    containerNumber?: string;
    estimatedShippingDate?: Date;
    actualShippingDate?: Date;
    estimatedDeliveryDate?: Date;
    actualDeliveryDate?: Date;
    shippingCost?: number;
    shippingDocuments?: Array<{
      type: 'BILL_OF_LADING' | 'COMMERCIAL_INVOICE' | 'PACKING_LIST' | 'CERTIFICATE_OF_ORIGIN' | 'PHYTOSANITARY' | 'OTHER';
      fileName: string;
      fileUrl: string;
      uploadedAt: Date;
    }>;
  };
  
  // Quality Control
  qualityControl: {
    preShipmentInspection: {
      required: boolean;
      completed: boolean;
      inspector?: string;
      inspectionDate?: Date;
      report?: string;
      passed: boolean;
      notes?: string;
    };
    certificates: Array<{
      type: string;
      issuer: string;
      number: string;
      issuedDate: Date;
      expiryDate?: Date;
      fileUrl?: string;
    }>;
    samples: Array<{
      id: string;
      type: 'PRE_PRODUCTION' | 'PRODUCTION' | 'PRE_SHIPMENT';
      sentDate: Date;
      approvedDate?: Date;
      approved: boolean;
      notes?: string;
    }>;
  };
  
  // Timeline & Tracking
  timeline: Array<{
    id: string;
    status: OrderDto['status'];
    timestamp: Date;
    description: string;
    updatedBy: string;
    notes?: string;
    attachments?: Array<{
      fileName: string;
      fileUrl: string;
    }>;
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  assignedTo?: string;
  salesRep?: string;
  productionManager?: string;
  
  // Communication
  notes?: string;
  internalNotes?: string;
  tags?: string[];
  
  // Related Documents
  documents: Array<{
    id: string;
    type: 'CONTRACT' | 'PROFORMA_INVOICE' | 'COMMERCIAL_INVOICE' | 'PACKING_LIST' | 'CERTIFICATE' | 'OTHER';
    fileName: string;
    fileUrl: string;
    description?: string;
    uploadedAt: Date;
    uploadedBy: string;
  }>;
}

export interface CreateOrderDto {
  quoteId?: string;
  rfqId?: string;
  client: OrderDto['client'];
  items: OrderDto['items'];
  financial: Omit<OrderDto['financial'], 'paidAmount' | 'remainingAmount'>;
  payment: OrderDto['payment'];
  shipping: OrderDto['shipping'];
  qualityControl: OrderDto['qualityControl'];
  assignedTo?: string;
  salesRep?: string;
  productionManager?: string;
  notes?: string;
  internalNotes?: string;
  tags?: string[];
}

export interface UpdateOrderDto extends Partial<CreateOrderDto> {
  id: string;
  status?: OrderDto['status'];
  priority?: OrderDto['priority'];
  updatedBy: string;
}

export interface OrderSearchDto {
  query?: string;
  status?: OrderDto['status'][];
  priority?: OrderDto['priority'][];
  clientCountry?: string[];
  variety?: CoffeeVariety[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  assignedTo?: string[];
  salesRep?: string[];
  tags?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'totalAmount' | 'estimatedDeliveryDate';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderListDto {
  orders: OrderDto[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface OrderStatsDto {
  totalOrders: number;
  byStatus: Record<OrderDto['status'], number>;
  byPriority: Record<OrderDto['priority'], number>;
  totalValue: number;
  averageOrderValue: number;
  currency: string;
  onTimeDeliveryRate: number; // percentage
  qualityPassRate: number; // percentage
  monthlyTrends: Array<{
    month: string;
    orderCount: number;
    totalValue: number;
    averageValue: number;
  }>;
}

export interface OrderTimelineEventDto {
  id: string;
  orderId: string;
  status: OrderDto['status'];
  timestamp: Date;
  description: string;
  updatedBy: string;
  notes?: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
  }>;
}

export interface OrderPaymentDto {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: OrderDto['payment']['method'];
  reference: string;
  paidAt: Date;
  processedBy: string;
  notes?: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
  }>;
}