// RFQ (Request for Quote) DTOs for application layer communication
import { CoffeeGrade, CoffeeVariety, ProcessingMethod, CoffeeCertification } from '@/shared/components/design-system/types';

export interface RfqDto {
  id: string;
  rfqNumber: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'QUOTED' | 'NEGOTIATING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  
  // Client Information
  clientInfo: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone?: string;
    country: string;
    businessType: 'IMPORTER' | 'ROASTER' | 'DISTRIBUTOR' | 'RETAILER' | 'OTHER';
    annualVolume?: number;
    website?: string;
  };

  // Product Requirements
  productRequirements: Array<{
    id: string;
    variety: CoffeeVariety;
    grade?: CoffeeGrade;
    processingMethod?: ProcessingMethod;
    origin?: {
      country?: string;
      region?: string;
    };
    certifications?: CoffeeCertification[];
    quantity: number;
    unit: 'KG' | 'TONS' | 'BAGS' | 'CONTAINERS';
    packaging?: string;
    specifications?: {
      moistureContent?: number;
      screenSize?: string;
      defectRate?: number;
      cupScore?: number;
    };
    notes?: string;
  }>;

  // Shipping & Logistics
  shipping: {
    incoterms: 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';
    destination: {
      port?: string;
      city: string;
      country: string;
    };
    preferredShippingDate?: Date;
    urgency: 'STANDARD' | 'URGENT' | 'FLEXIBLE';
  };

  // Payment Terms
  paymentTerms?: {
    method: 'LETTER_OF_CREDIT' | 'TELEGRAPHIC_TRANSFER' | 'CASH_ADVANCE' | 'OPEN_ACCOUNT' | 'OTHER';
    terms: string;
    currency?: string;
  };

  // Additional Requirements
  additionalRequirements?: {
    sampleRequired: boolean;
    qualityCertificates: string[];
    customPackaging?: string;
    privateLabel?: boolean;
    sustainabilityRequirements?: string[];
    otherRequirements?: string;
  };

  // Metadata
  source: 'WEBSITE' | 'EMAIL' | 'PHONE' | 'TRADE_SHOW' | 'REFERRAL' | 'OTHER';
  validUntil?: Date;
  estimatedValue?: number;
  currency?: string;
  
  // Tracking
  submittedAt: Date;
  lastUpdated: Date;
  assignedTo?: string;
  tags?: string[];
  notes?: string;
  
  // Related entities
  quotes?: string[]; // Quote IDs
  communications?: string[]; // Communication IDs
  attachments?: Array<{
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: Date;
  }>;
}

export interface CreateRfqDto {
  clientInfo: RfqDto['clientInfo'];
  productRequirements: RfqDto['productRequirements'];
  shipping: RfqDto['shipping'];
  paymentTerms?: RfqDto['paymentTerms'];
  additionalRequirements?: RfqDto['additionalRequirements'];
  source: RfqDto['source'];
  validUntil?: Date;
  estimatedValue?: number;
  currency?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateRfqDto extends Partial<CreateRfqDto> {
  id: string;
  status?: RfqDto['status'];
  priority?: RfqDto['priority'];
  assignedTo?: string;
}

export interface RfqSearchDto {
  query?: string;
  status?: RfqDto['status'][];
  priority?: RfqDto['priority'][];
  clientCountry?: string[];
  variety?: CoffeeVariety[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  assignedTo?: string[];
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'submittedAt' | 'lastUpdated' | 'estimatedValue' | 'validUntil';
  sortOrder?: 'asc' | 'desc';
}

export interface RfqListDto {
  rfqs: RfqDto[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface RfqStatsDto {
  totalRfqs: number;
  byStatus: Record<RfqDto['status'], number>;
  byPriority: Record<RfqDto['priority'], number>;
  averageResponseTime: number; // in hours
  conversionRate: number; // percentage
  totalEstimatedValue: number;
  currency: string;
}