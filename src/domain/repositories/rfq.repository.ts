import {
  RFQEntity,
  type RFQ,
  type RFQStatus,
  type RFQPriority,
  type Incoterms,
  type RFQCommunication,
  type RFQDocument,
} from '../entities/rfq.entity';

// Quote type for RFQ management
export interface RFQQuote {
  id: string;
  rfqId: string;
  status: 'DRAFT' | 'SENT' | 'VIEWED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  totalAmount: number;
  currency: string;
  validUntil: Date;
  createdAt: Date;
  createdBy: string;
  notes?: string;
}

// Search and filter criteria
export interface RFQSearchCriteria {
  // Status filters
  status?: RFQStatus | RFQStatus[];
  priority?: RFQPriority | RFQPriority[];

  // Client filters
  clientId?: string;
  clientCompany?: string;
  clientCountry?: string;

  // Product filters
  coffeeType?: string | string[];
  coffeeGrade?: string | string[];
  processingMethod?: string | string[];
  certifications?: string | string[];

  // Quantity filters
  minQuantity?: number;
  maxQuantity?: number;
  quantityUnit?: string;

  // Value filters
  minValue?: number;
  maxValue?: number;
  currency?: string;

  // Date filters
  submittedAfter?: Date;
  submittedBefore?: Date;
  responseDeadlineAfter?: Date;
  responseDeadlineBefore?: Date;
  deliveryAfter?: Date;
  deliveryBefore?: Date;

  // Assignment filters
  assignedTo?: string;
  unassigned?: boolean;

  // Shipping filters
  incoterms?: Incoterms | Incoterms[];
  destinationCountry?: string;
  destinationPort?: string;

  // Text search
  searchTerm?: string; // Search in company name, contact info, notes

  // Pagination and sorting
  page?: number;
  limit?: number;
  sortBy?:
    | 'submittedAt'
    | 'responseDeadline'
    | 'estimatedValue'
    | 'priority'
    | 'status'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface RFQSearchResult {
  rfqs: RFQEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface RFQAnalytics {
  totalRFQs: number;
  rfqsByStatus: Record<RFQStatus, number>;
  rfqsByPriority: Record<RFQPriority, number>;
  rfqsByCountry: Record<string, number>;
  averageResponseTime: number; // in hours
  conversionRate: number; // percentage of RFQs that become orders
  totalEstimatedValue: number;
  averageRFQValue: number;
  topRequestedProducts: Array<{ product: string; count: number }>;
  monthlyTrends: Array<{ month: string; count: number; value: number }>;
}

export interface RFQPerformanceMetrics {
  responseTimeMetrics: {
    average: number;
    median: number;
    fastest: number;
    slowest: number;
  };
  conversionMetrics: {
    totalRFQs: number;
    convertedToOrders: number;
    conversionRate: number;
    averageOrderValue: number;
  };
  assignmentMetrics: {
    totalAssigned: number;
    averagePerAssignee: number;
    topPerformers: Array<{
      assigneeId: string;
      rfqCount: number;
      conversionRate: number;
    }>;
  };
}

// Repository interface
export interface IRFQRepository {
  // Basic CRUD operations
  findById(id: string): Promise<RFQEntity | null>;
  findByRfqNumber(rfqNumber: string): Promise<RFQEntity | null>;
  findAll(): Promise<RFQEntity[]>;
  create(
    rfq: Omit<RFQ, 'id' | 'rfqNumber' | 'submittedAt' | 'updatedAt'>
  ): Promise<RFQEntity>;
  update(id: string, updates: Partial<RFQ>): Promise<RFQEntity>;
  delete(id: string): Promise<void>;

  // Advanced search and filtering
  search(criteria: RFQSearchCriteria): Promise<RFQSearchResult>;
  findByStatus(status: RFQStatus): Promise<RFQEntity[]>;
  findByPriority(priority: RFQPriority): Promise<RFQEntity[]>;
  findByClient(clientId: string): Promise<RFQEntity[]>;
  findByAssignee(assigneeId: string): Promise<RFQEntity[]>;

  // Status management
  updateStatus(
    id: string,
    status: RFQStatus,
    updatedBy: string,
    notes?: string
  ): Promise<RFQEntity>;
  findPendingRFQs(): Promise<RFQEntity[]>;
  findOverdueRFQs(): Promise<RFQEntity[]>;
  findExpiredRFQs(): Promise<RFQEntity[]>;

  // Assignment management
  assign(
    id: string,
    assigneeId: string,
    assignedBy: string
  ): Promise<RFQEntity>;
  unassign(id: string, unassignedBy: string): Promise<RFQEntity>;
  reassign(
    id: string,
    newAssigneeId: string,
    reassignedBy: string
  ): Promise<RFQEntity>;
  findUnassigned(): Promise<RFQEntity[]>;

  // Priority management
  updatePriority(
    id: string,
    priority: RFQPriority,
    updatedBy: string
  ): Promise<RFQEntity>;
  findHighPriorityRFQs(): Promise<RFQEntity[]>;
  findUrgentRFQs(): Promise<RFQEntity[]>;

  // Communication management
  addCommunication(
    id: string,
    communication: Omit<RFQCommunication, 'id' | 'timestamp'>
  ): Promise<RFQEntity>;
  getCommunicationHistory(id: string): Promise<RFQCommunication[]>;
  markAsRead(
    id: string,
    communicationId: string,
    readBy: string
  ): Promise<RFQEntity>;

  // Quote management
  addQuote(
    id: string,
    quote: Omit<RFQQuote, 'id' | 'createdAt'>
  ): Promise<RFQEntity>;
  updateQuote(
    id: string,
    quoteId: string,
    updates: Partial<RFQQuote>
  ): Promise<RFQEntity>;
  acceptQuote(
    id: string,
    quoteId: string,
    acceptedBy: string
  ): Promise<RFQEntity>;
  rejectQuote(
    id: string,
    quoteId: string,
    rejectedBy: string,
    reason?: string
  ): Promise<RFQEntity>;

  // Document management
  addDocument(
    id: string,
    document: Omit<RFQDocument, 'id' | 'uploadedAt'>
  ): Promise<RFQEntity>;
  removeDocument(id: string, documentId: string): Promise<RFQEntity>;
  getDocuments(id: string): Promise<RFQDocument[]>;

  // Deadline management
  findByResponseDeadline(before: Date): Promise<RFQEntity[]>;
  findByDeliveryDeadline(before: Date): Promise<RFQEntity[]>;
  updateResponseDeadline(
    id: string,
    deadline: Date,
    updatedBy: string
  ): Promise<RFQEntity>;
  updateDeliveryDeadline(
    id: string,
    deadline: Date,
    updatedBy: string
  ): Promise<RFQEntity>;

  // Value and pricing
  updateEstimatedValue(
    id: string,
    value: number,
    currency: string
  ): Promise<RFQEntity>;
  findByValueRange(
    min: number,
    max: number,
    currency: string
  ): Promise<RFQEntity[]>;
  calculateTotalPipelineValue(status?: RFQStatus[]): Promise<number>;

  // Geographic and shipping
  findByDestination(country: string, port?: string): Promise<RFQEntity[]>;
  findByIncoterms(incoterms: Incoterms): Promise<RFQEntity[]>;
  updateShippingRequirements(
    id: string,
    requirements: RFQ['deliveryRequirements']
  ): Promise<RFQEntity>;

  // Product requirements
  findByProductRequirements(
    requirements: Partial<RFQ['productRequirements']>
  ): Promise<RFQEntity[]>;
  updateProductRequirements(
    id: string,
    requirements: RFQ['productRequirements']
  ): Promise<RFQEntity>;

  // Bulk operations
  updateMany(
    updates: Array<{ id: string; data: Partial<RFQ> }>
  ): Promise<RFQEntity[]>;
  deleteMany(ids: string[]): Promise<void>;
  bulkAssign(
    ids: string[],
    assigneeId: string,
    assignedBy: string
  ): Promise<RFQEntity[]>;
  bulkUpdateStatus(
    ids: string[],
    status: RFQStatus,
    updatedBy: string
  ): Promise<RFQEntity[]>;

  // Analytics and reporting
  getAnalytics(dateRange?: { start: Date; end: Date }): Promise<RFQAnalytics>;
  getPerformanceMetrics(
    assigneeId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<RFQPerformanceMetrics>;
  getConversionFunnel(): Promise<
    Array<{ status: RFQStatus; count: number; percentage: number }>
  >;
  getTopClients(
    limit?: number
  ): Promise<Array<{ clientId: string; rfqCount: number; totalValue: number }>>;

  // Follow-up and reminders
  findRequiringFollowUp(): Promise<RFQEntity[]>;
  setFollowUpReminder(
    id: string,
    reminderDate: Date,
    assigneeId: string
  ): Promise<RFQEntity>;
  getUpcomingReminders(
    assigneeId?: string
  ): Promise<Array<{ rfqId: string; reminderDate: Date; assigneeId: string }>>;

  // Duplicate detection
  findSimilarRFQs(rfq: Partial<RFQ>): Promise<RFQEntity[]>;
  findDuplicates(
    clientId: string,
    productRequirements: RFQ['productRequirements']
  ): Promise<RFQEntity[]>;

  // Export and reporting
  exportToCSV(criteria?: RFQSearchCriteria): Promise<string>;
  exportToExcel(criteria?: RFQSearchCriteria): Promise<Buffer>;
  generateReport(
    type: 'summary' | 'detailed' | 'performance',
    criteria?: RFQSearchCriteria
  ): Promise<any>;

  // Audit and history
  getHistory(
    id: string
  ): Promise<
    Array<{ timestamp: Date; changes: Partial<RFQ>; changedBy: string }>
  >;
  getStatusHistory(id: string): Promise<
    Array<{
      status: RFQStatus;
      timestamp: Date;
      changedBy: string;
      notes?: string;
    }>
  >;

  // Cache management
  clearCache(): Promise<void>;
  warmCache(): Promise<void>;
}
