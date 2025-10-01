import {
  ClientCompanyEntity,
  type ClientCompany,
  type CompanyStatus,
  type CompanyType,
  type CompanySize,
  type CreditRating,
  type RelationshipStatus,
} from '../entities/client-company.entity';

// Search and filter criteria
export interface ClientCompanySearchCriteria {
  // Basic filters
  status?: CompanyStatus | CompanyStatus[];
  type?: CompanyType | CompanyType[];
  size?: CompanySize | CompanySize[];
  creditRating?: CreditRating | CreditRating[];
  relationshipStatus?: RelationshipStatus | RelationshipStatus[];

  // Geographic filters
  country?: string | string[];
  region?: string | string[];
  city?: string | string[];

  // Business filters
  industry?: string | string[];
  annualRevenueMin?: number;
  annualRevenueMax?: number;
  employeeCountMin?: number;
  employeeCountMax?: number;

  // Trading history filters
  hasOrderHistory?: boolean;
  minOrderValue?: number;
  maxOrderValue?: number;
  lastOrderAfter?: Date;
  lastOrderBefore?: Date;

  // Risk assessment
  isHighRisk?: boolean;
  maxRiskScore?: number;

  // Relationship metrics
  minRelationshipScore?: number;
  hasActiveProjects?: boolean;

  // Text search
  searchTerm?: string; // Search in company name, contact names, notes

  // Pagination and sorting
  page?: number;
  limit?: number;
  sortBy?:
    | 'companyName'
    | 'relationshipScore'
    | 'totalOrderValue'
    | 'lastOrderDate'
    | 'createdAt'
    | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ClientCompanySearchResult {
  companies: ClientCompanyEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ClientCompanyAnalytics {
  totalCompanies: number;
  companiesByStatus: Record<CompanyStatus, number>;
  companiesByType: Record<CompanyType, number>;
  companiesBySize: Record<CompanySize, number>;
  companiesByRegion: Record<string, number>;
  averageRelationshipScore: number;
  totalOrderValue: number;
  averageOrderValue: number;
  topClientsByValue: Array<{
    companyId: string;
    companyName: string;
    totalValue: number;
  }>;
  riskDistribution: Record<CreditRating, number>;
}

export interface ClientRelationshipMetrics {
  companyId: string;
  relationshipScore: number;
  totalOrders: number;
  totalOrderValue: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  daysSinceLastOrder?: number;
  communicationFrequency: number;
  satisfactionScore?: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  growthTrend: 'GROWING' | 'STABLE' | 'DECLINING';
}

// Repository interface
export interface IClientCompanyRepository {
  // Basic CRUD operations
  findById(id: string): Promise<ClientCompanyEntity | null>;
  findByCompanyName(name: string): Promise<ClientCompanyEntity | null>;
  findByTaxId(taxId: string): Promise<ClientCompanyEntity | null>;
  findAll(): Promise<ClientCompanyEntity[]>;
  create(
    company: Omit<ClientCompany, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ClientCompanyEntity>;
  update(
    id: string,
    updates: Partial<ClientCompany>
  ): Promise<ClientCompanyEntity>;
  delete(id: string): Promise<void>;

  // Advanced search and filtering
  search(
    criteria: ClientCompanySearchCriteria
  ): Promise<ClientCompanySearchResult>;
  findByStatus(status: CompanyStatus): Promise<ClientCompanyEntity[]>;
  findByType(type: CompanyType): Promise<ClientCompanyEntity[]>;
  findBySize(size: CompanySize): Promise<ClientCompanyEntity[]>;
  findByCreditRating(rating: CreditRating): Promise<ClientCompanyEntity[]>;
  findByRelationshipStatus(
    status: RelationshipStatus
  ): Promise<ClientCompanyEntity[]>;

  // Geographic operations
  findByCountry(country: string): Promise<ClientCompanyEntity[]>;
  findByRegion(region: string): Promise<ClientCompanyEntity[]>;
  findByCity(city: string): Promise<ClientCompanyEntity[]>;
  getGeographicDistribution(): Promise<Record<string, number>>;

  // Contact management
  addContact(
    companyId: string,
    contact: Omit<ClientCompany['contacts'][0], 'id' | 'createdAt'>
  ): Promise<ClientCompanyEntity>;
  updateContact(
    companyId: string,
    contactId: string,
    updates: Partial<ClientCompany['contacts'][0]>
  ): Promise<ClientCompanyEntity>;
  removeContact(
    companyId: string,
    contactId: string
  ): Promise<ClientCompanyEntity>;
  findByContactEmail(email: string): Promise<ClientCompanyEntity | null>;
  findByContactPhone(phone: string): Promise<ClientCompanyEntity | null>;
  setPrimaryContact(
    companyId: string,
    contactId: string
  ): Promise<ClientCompanyEntity>;

  // Address management
  addAddress(
    companyId: string,
    address: Omit<ClientCompany['addresses'][0], 'id' | 'createdAt'>
  ): Promise<ClientCompanyEntity>;
  updateAddress(
    companyId: string,
    addressId: string,
    updates: Partial<ClientCompany['addresses'][0]>
  ): Promise<ClientCompanyEntity>;
  removeAddress(
    companyId: string,
    addressId: string
  ): Promise<ClientCompanyEntity>;
  setPrimaryAddress(
    companyId: string,
    addressId: string
  ): Promise<ClientCompanyEntity>;

  // Financial information
  updateFinancialInfo(
    companyId: string,
    financialInfo: ClientCompany['financialInfo']
  ): Promise<ClientCompanyEntity>;
  updateCreditRating(
    companyId: string,
    rating: CreditRating,
    ratedBy: string,
    notes?: string
  ): Promise<ClientCompanyEntity>;
  findByCreditLimit(min: number, max?: number): Promise<ClientCompanyEntity[]>;

  // Business profile
  updateBusinessProfile(
    companyId: string,
    profile: ClientCompany['businessProfile']
  ): Promise<ClientCompanyEntity>;
  findByIndustry(industry: string): Promise<ClientCompanyEntity[]>;
  findByAnnualRevenue(
    min: number,
    max?: number
  ): Promise<ClientCompanyEntity[]>;
  findByEmployeeCount(
    min: number,
    max?: number
  ): Promise<ClientCompanyEntity[]>;

  // Trading history
  addTradingRecord(
    companyId: string,
    record: Omit<ClientCompany['tradingHistory'][0], 'id' | 'createdAt'>
  ): Promise<ClientCompanyEntity>;
  updateTradingRecord(
    companyId: string,
    recordId: string,
    updates: Partial<ClientCompany['tradingHistory'][0]>
  ): Promise<ClientCompanyEntity>;
  getTradingHistory(
    companyId: string,
    limit?: number
  ): Promise<ClientCompany['tradingHistory']>;
  calculateTotalOrderValue(companyId: string): Promise<number>;
  getLastOrderDate(companyId: string): Promise<Date | null>;

  // Document management
  addDocument(
    companyId: string,
    document: Omit<ClientCompany['documents'][0], 'id' | 'uploadedAt'>
  ): Promise<ClientCompanyEntity>;
  removeDocument(
    companyId: string,
    documentId: string
  ): Promise<ClientCompanyEntity>;
  getDocuments(
    companyId: string,
    type?: string
  ): Promise<ClientCompany['documents']>;
  verifyDocument(
    companyId: string,
    documentId: string,
    verifiedBy: string
  ): Promise<ClientCompanyEntity>;

  // Notes and communication
  addNote(
    companyId: string,
    note: Omit<ClientCompany['notes'][0], 'id' | 'createdAt'>
  ): Promise<ClientCompanyEntity>;
  updateNote(
    companyId: string,
    noteId: string,
    updates: Partial<ClientCompany['notes'][0]>
  ): Promise<ClientCompanyEntity>;
  removeNote(companyId: string, noteId: string): Promise<ClientCompanyEntity>;
  getNotes(companyId: string, type?: string): Promise<ClientCompany['notes']>;

  // Status management
  activate(
    companyId: string,
    activatedBy: string
  ): Promise<ClientCompanyEntity>;
  deactivate(
    companyId: string,
    deactivatedBy: string,
    reason?: string
  ): Promise<ClientCompanyEntity>;
  suspend(
    companyId: string,
    suspendedBy: string,
    reason: string
  ): Promise<ClientCompanyEntity>;
  updateRelationshipStatus(
    companyId: string,
    status: RelationshipStatus,
    updatedBy: string
  ): Promise<ClientCompanyEntity>;

  // Risk assessment
  updateRiskAssessment(
    companyId: string,
    assessment: { score: number; factors: string[]; assessedBy: string }
  ): Promise<ClientCompanyEntity>;
  findHighRiskCompanies(): Promise<ClientCompanyEntity[]>;
  findLowRiskCompanies(): Promise<ClientCompanyEntity[]>;
  calculateRiskScore(companyId: string): Promise<number>;

  // Relationship management
  calculateRelationshipScore(companyId: string): Promise<number>;
  updateRelationshipScore(
    companyId: string,
    score: number
  ): Promise<ClientCompanyEntity>;
  findTopClients(limit?: number): Promise<ClientCompanyEntity[]>;
  findInactiveClients(
    daysSinceLastContact: number
  ): Promise<ClientCompanyEntity[]>;
  getRelationshipMetrics(companyId: string): Promise<ClientRelationshipMetrics>;

  // Segmentation and targeting
  findProspects(): Promise<ClientCompanyEntity[]>;
  findActiveClients(): Promise<ClientCompanyEntity[]>;
  findChurnRiskClients(): Promise<ClientCompanyEntity[]>;
  findGrowthOpportunities(): Promise<ClientCompanyEntity[]>;
  segmentByValue(): Promise<{
    high: ClientCompanyEntity[];
    medium: ClientCompanyEntity[];
    low: ClientCompanyEntity[];
  }>;

  // Bulk operations
  updateMany(
    updates: Array<{ id: string; data: Partial<ClientCompany> }>
  ): Promise<ClientCompanyEntity[]>;
  deleteMany(ids: string[]): Promise<void>;
  bulkUpdateStatus(
    ids: string[],
    status: CompanyStatus,
    updatedBy: string
  ): Promise<ClientCompanyEntity[]>;

  // Analytics and reporting
  getAnalytics(dateRange?: {
    start: Date;
    end: Date;
  }): Promise<ClientCompanyAnalytics>;
  getClientPortfolioSummary(): Promise<{
    totalClients: number;
    activeClients: number;
    totalValue: number;
    averageOrderValue: number;
    topIndustries: Array<{ industry: string; count: number; value: number }>;
  }>;
  getChurnAnalysis(): Promise<{
    churnRate: number;
    atRiskClients: number;
    retentionRate: number;
    averageLifetime: number;
  }>;

  // Compliance and verification
  findUnverifiedCompanies(): Promise<ClientCompanyEntity[]>;
  findExpiredDocuments(): Promise<
    Array<{ companyId: string; documentId: string; expiryDate: Date }>
  >;
  updateComplianceStatus(
    companyId: string,
    status: boolean,
    checkedBy: string
  ): Promise<ClientCompanyEntity>;

  // Integration and synchronization
  syncWithCRM(companyId: string): Promise<ClientCompanyEntity>;
  exportToCRM(
    companyIds: string[]
  ): Promise<{ success: number; errors: string[] }>;
  importFromCRM(crmData: any[]): Promise<{ success: number; errors: string[] }>;

  // Export and reporting
  exportToCSV(criteria?: ClientCompanySearchCriteria): Promise<string>;
  exportToExcel(criteria?: ClientCompanySearchCriteria): Promise<Buffer>;
  generateClientReport(companyId: string): Promise<any>;

  // Audit and history
  getHistory(id: string): Promise<
    Array<{
      timestamp: Date;
      changes: Partial<ClientCompany>;
      changedBy: string;
    }>
  >;
  getContactHistory(companyId: string): Promise<
    Array<{
      timestamp: Date;
      type: string;
      summary: string;
      contactedBy: string;
    }>
  >;

  // Cache management
  clearCache(): Promise<void>;
  warmCache(): Promise<void>;
}
