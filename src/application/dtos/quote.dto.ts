// Quote DTOs for application layer communication
import { CoffeeGrade, CoffeeVariety, ProcessingMethod, CoffeeCertification } from '@/shared/components/design-system/types';

export interface QuoteDto {
  id: string;
  quoteNumber: string;
  rfqId: string;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'REVISED';
  version: number;
  
  // Client Information (from RFQ)
  clientInfo: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string;
    country: string;
  };

  // Quote Items
  items: Array<{
    id: string;
    productId?: string;
    description: string;
    variety: CoffeeVariety;
    grade: CoffeeGrade;
    processingMethod: ProcessingMethod;
    origin: {
      country: string;
      region: string;
      province?: string;
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
    availability: {
      status: 'AVAILABLE' | 'LIMITED' | 'ON_REQUEST';
      deliveryTime: string;
      harvestSeason?: string;
    };
    notes?: string;
  }>;

  // Pricing Summary
  pricing: {
    subtotal: number;
    currency: string;
    incoterms: 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';
    additionalCosts?: Array<{
      description: string;
      amount: number;
      type: 'SHIPPING' | 'INSURANCE' | 'HANDLING' | 'CERTIFICATION' | 'OTHER';
    }>;
    totalAmount: number;
    validUntil: Date;
  };

  // Terms & Conditions
  terms: {
    paymentTerms: string;
    deliveryTerms: string;
    qualityTerms: string;
    packagingTerms: string;
    shippingTerms: string;
    warrantyTerms?: string;
    cancellationPolicy?: string;
    forcemajeure?: string;
  };

  // Shipping Information
  shipping: {
    origin: {
      port: string;
      city: string;
      country: string;
    };
    destination: {
      port?: string;
      city: string;
      country: string;
    };
    estimatedShippingTime: string;
    shippingMethod: 'SEA_FREIGHT' | 'AIR_FREIGHT' | 'LAND_TRANSPORT' | 'MULTIMODAL';
    containerType?: string;
    estimatedShippingCost?: number;
  };

  // Quality Assurance
  qualityAssurance: {
    samplesAvailable: boolean;
    qualityCertificates: string[];
    inspectionRights: string;
    qualityGuarantee: string;
    defectPolicy: string;
  };

  // Metadata
  createdBy: string;
  createdAt: Date;
  sentAt?: Date;
  viewedAt?: Date;
  respondedAt?: Date;
  expiresAt: Date;
  lastUpdated: Date;
  
  // Communication
  notes?: string;
  internalNotes?: string;
  revisionHistory?: Array<{
    version: number;
    changes: string;
    updatedBy: string;
    updatedAt: Date;
  }>;
  
  // Attachments
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    description?: string;
    uploadedAt: Date;
  }>;
}

export interface CreateQuoteDto {
  rfqId: string;
  items: QuoteDto['items'];
  pricing: Omit<QuoteDto['pricing'], 'totalAmount'>;
  terms: QuoteDto['terms'];
  shipping: QuoteDto['shipping'];
  qualityAssurance: QuoteDto['qualityAssurance'];
  expiresAt: Date;
  notes?: string;
  internalNotes?: string;
}

export interface UpdateQuoteDto extends Partial<CreateQuoteDto> {
  id: string;
  status?: QuoteDto['status'];
}

export interface QuoteSearchDto {
  query?: string;
  status?: QuoteDto['status'][];
  clientCountry?: string[];
  variety?: CoffeeVariety[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  createdBy?: string[];
  amountRange?: {
    min: number;
    max: number;
  };
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'sentAt' | 'expiresAt' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface QuoteListDto {
  quotes: QuoteDto[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface QuoteStatsDto {
  totalQuotes: number;
  byStatus: Record<QuoteDto['status'], number>;
  averageQuoteValue: number;
  acceptanceRate: number; // percentage
  averageResponseTime: number; // in hours
  totalQuotedValue: number;
  currency: string;
  conversionRate: number; // percentage
}

export interface QuoteRevisionDto {
  quoteId: string;
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    reason?: string;
  }>;
  notes?: string;
}