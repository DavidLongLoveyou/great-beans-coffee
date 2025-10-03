import { z } from 'zod';

// Company Status Enum
export const CompanyStatusSchema = z.enum([
  'PROSPECT',
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'BLACKLISTED',
]);

// Company Type Enum
export const CompanyTypeSchema = z.enum([
  'IMPORTER',
  'DISTRIBUTOR',
  'ROASTER',
  'RETAILER',
  'MANUFACTURER',
  'TRADER',
  'BROKER',
  'COOPERATIVE',
  'GOVERNMENT',
  'NGO',
]);

// Company Size Enum
export const CompanySizeSchema = z.enum([
  'STARTUP', // < 10 employees
  'SMALL', // 10-50 employees
  'MEDIUM', // 50-250 employees
  'LARGE', // 250-1000 employees
  'ENTERPRISE', // > 1000 employees
]);

// Credit Rating Enum
export const CreditRatingSchema = z.enum([
  'AAA',
  'AA',
  'A',
  'BBB',
  'BB',
  'B',
  'CCC',
  'CC',
  'C',
  'D',
  'NR', // NR = Not Rated
]);

// Relationship Status Enum
export const RelationshipStatusSchema = z.enum([
  'NEW',
  'DEVELOPING',
  'ESTABLISHED',
  'STRATEGIC_PARTNER',
  'KEY_ACCOUNT',
  'AT_RISK',
  'DORMANT',
]);

// Business Model Schema
export const BusinessModelSchema = z.enum(['B2B', 'B2C', 'BOTH']);

// Risk Level Schema
export const RiskLevelSchema = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);

// Contact Person Schema
export const ContactPersonSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  position: z.string(),
  department: z.string().optional(),
  email: z.string().email(),
  phone: z.string(),
  mobile: z.string().optional(),
  isPrimary: z.boolean().default(false),
  isDecisionMaker: z.boolean().default(false),
  languages: z.array(z.string()).optional(),
  notes: z.string().optional(),
  linkedInProfile: z.string().url().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Company Address Schema
export const CompanyAddressSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['HEADQUARTERS', 'BRANCH', 'WAREHOUSE', 'FACTORY', 'OFFICE']),
  street: z.string(),
  city: z.string(),
  state: z.string().optional(),
  postalCode: z.string(),
  country: z.string(),
  countryCode: z.string().length(2), // ISO 3166-1 alpha-2
  isPrimary: z.boolean().default(false),
  coordinates: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  timeZone: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Financial Information Schema
export const FinancialInfoSchema = z.object({
  annualRevenue: z.number().positive().optional(),
  currency: z.string().length(3), // ISO 4217
  creditLimit: z.number().positive().optional(),
  creditRating: CreditRatingSchema.optional(),
  paymentTerms: z.string().optional(), // e.g., "NET 30", "LC at sight"
  preferredPaymentMethod: z.enum(['LC', 'TT', 'CAD', 'DP', 'DA']).optional(),
  bankReferences: z
    .array(
      z.object({
        bankName: z.string(),
        accountNumber: z.string().optional(),
        swiftCode: z.string().optional(),
        contactPerson: z.string().optional(),
        phone: z.string().optional(),
      })
    )
    .optional(),
  dAndBNumber: z.string().optional(), // Dun & Bradstreet number
  taxId: z.string().optional(),
  vatNumber: z.string().optional(),
  lastCreditCheck: z.date().optional(),
  creditCheckScore: z.number().min(0).max(100).optional(),
});

// Business Profile Schema
export const BusinessProfileSchema = z.object({
  foundedYear: z.number().int().min(1800).max(new Date().getFullYear()),
  employeeCount: z.number().int().positive().optional(),
  annualCoffeeVolume: z.number().positive().optional(), // in MT
  primaryMarkets: z.array(z.string()), // Countries/regions they serve
  businessModel: z.array(BusinessModelSchema),
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
  specializations: z.array(z.string()).optional(), // e.g., ["Specialty Coffee", "Instant Coffee"]
  equipmentCapacity: z
    .object({
      roastingCapacity: z.number().positive().optional(), // kg per hour
      packagingCapacity: z.number().positive().optional(), // units per hour
      storageCapacity: z.number().positive().optional(), // MT
    })
    .optional(),
  qualityStandards: z.array(z.string()).optional(),
  sustainabilityInitiatives: z.array(z.string()).optional(),
});

// Trading History Schema
export const TradingHistorySchema = z.object({
  firstOrderDate: z.date().optional(),
  lastOrderDate: z.date().optional(),
  totalOrders: z.number().int().min(0).default(0),
  totalVolume: z.number().min(0).default(0), // in MT
  totalValue: z.number().min(0).default(0), // in USD
  averageOrderValue: z.number().min(0).default(0),
  averageOrderVolume: z.number().min(0).default(0),
  preferredProducts: z.array(z.string()).optional(),
  seasonalPatterns: z.record(z.string(), z.any()).optional(),
  paymentHistory: z
    .object({
      onTimePayments: z.number().int().min(0).default(0),
      latePayments: z.number().int().min(0).default(0),
      averagePaymentDays: z.number().min(0).optional(),
      outstandingAmount: z.number().min(0).default(0),
    })
    .optional(),
});

// Company Document Schema
export const CompanyDocumentSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'BUSINESS_LICENSE',
    'IMPORT_LICENSE',
    'EXPORT_LICENSE',
    'TAX_CERTIFICATE',
    'BANK_REFERENCE',
    'CREDIT_REPORT',
    'INSURANCE_CERTIFICATE',
    'QUALITY_CERTIFICATE',
    'COMPANY_PROFILE',
    'FINANCIAL_STATEMENT',
    'TRADE_REFERENCE',
    'OTHER',
  ]),
  fileName: z.string(),
  fileUrl: z.string().url(),
  fileSize: z.number().positive(),
  expiryDate: z.date().optional(),
  isVerified: z.boolean().default(false),
  verifiedBy: z.string().uuid().optional(),
  verifiedAt: z.date().optional(),
  notes: z.string().optional(),
  uploadedAt: z.date(),
  uploadedBy: z.string().uuid(),
});

// Company Note Schema
export const CompanyNoteSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([
    'GENERAL',
    'SALES',
    'CREDIT',
    'QUALITY',
    'LOGISTICS',
    'COMPLIANCE',
  ]),
  subject: z.string(),
  content: z.string(),
  isPrivate: z.boolean().default(false),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
  tags: z.array(z.string()).optional(),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Client Company Entity Schema
export const ClientCompanySchema = z.object({
  id: z.string().uuid(),
  companyCode: z.string().min(1), // Auto-generated unique code

  // Basic Information
  legalName: z.string().min(1),
  tradingName: z.string().optional(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),

  // Classification
  status: CompanyStatusSchema,
  type: CompanyTypeSchema,
  size: CompanySizeSchema.optional(),
  relationshipStatus: RelationshipStatusSchema,

  // Contact Information
  contacts: z.array(ContactPersonSchema),
  addresses: z.array(CompanyAddressSchema),

  // Business Information
  businessProfile: BusinessProfileSchema.optional(),
  financialInfo: FinancialInfoSchema.optional(),
  tradingHistory: TradingHistorySchema.optional(),

  // Preferences
  preferredLanguages: z.array(z.string()).optional(),
  preferredCommunicationMethod: z
    .enum(['EMAIL', 'PHONE', 'WHATSAPP', 'TEAMS', 'ZOOM'])
    .optional(),
  timeZone: z.string().optional(),

  // Internal Management
  assignedSalesRep: z.string().uuid().optional(),
  accountManager: z.string().uuid().optional(),
  riskLevel: RiskLevelSchema.default('MEDIUM'),

  // Documents & Notes
  documents: z.array(CompanyDocumentSchema).optional(),
  notes: z.array(CompanyNoteSchema).optional(),

  // Marketing & Communication
  marketingConsent: z.boolean().default(false),
  newsletterSubscription: z.boolean().default(false),
  eventInvitations: z.boolean().default(false),

  // System Fields
  source: z
    .enum([
      'WEBSITE',
      'TRADE_SHOW',
      'REFERRAL',
      'COLD_OUTREACH',
      'SOCIAL_MEDIA',
      'PARTNER',
      'OTHER',
    ])
    .optional(),
  tags: z.array(z.string()).optional(),
  lastContactDate: z.date().optional(),
  nextFollowUpDate: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

// Type Exports
export type CompanyStatus = z.infer<typeof CompanyStatusSchema>;
export type CompanyType = z.infer<typeof CompanyTypeSchema>;
export type CompanySize = z.infer<typeof CompanySizeSchema>;
export type CreditRating = z.infer<typeof CreditRatingSchema>;
export type RelationshipStatus = z.infer<typeof RelationshipStatusSchema>;
export type ContactPerson = z.infer<typeof ContactPersonSchema>;
export type CompanyAddress = z.infer<typeof CompanyAddressSchema>;
export type FinancialInfo = z.infer<typeof FinancialInfoSchema>;
export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;
export type TradingHistory = z.infer<typeof TradingHistorySchema>;
export type CompanyDocument = z.infer<typeof CompanyDocumentSchema>;
export type CompanyNote = z.infer<typeof CompanyNoteSchema>;
export type ClientCompany = z.infer<typeof ClientCompanySchema>;
export type BusinessModel = z.infer<typeof BusinessModelSchema>;
export type RiskLevel = z.infer<typeof RiskLevelSchema>;

// Client Company Entity Class
export class ClientCompanyEntity {
  constructor(private readonly data: ClientCompany) {
    ClientCompanySchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get companyCode(): string {
    return this.data.companyCode;
  }
  get legalName(): string {
    return this.data.legalName;
  }
  get tradingName(): string | undefined {
    return this.data.tradingName;
  }
  get status(): CompanyStatus {
    return this.data.status;
  }
  get type(): CompanyType {
    return this.data.type;
  }
  get relationshipStatus(): RelationshipStatus {
    return this.data.relationshipStatus;
  }
  get contacts(): ContactPerson[] {
    return this.data.contacts;
  }
  get addresses(): CompanyAddress[] {
    return this.data.addresses;
  }

  // Business Logic Methods
  isActive(): boolean {
    return this.data.status === 'ACTIVE';
  }

  canTrade(): boolean {
    return ['ACTIVE', 'PROSPECT'].includes(this.data.status);
  }

  isHighRisk(): boolean {
    return this.data.riskLevel === 'HIGH' || this.data.riskLevel === 'CRITICAL';
  }

  getPrimaryContact(): ContactPerson | null {
    return (
      this.data.contacts.find(contact => contact.isPrimary) ||
      this.data.contacts[0] ||
      null
    );
  }

  getPrimaryAddress(): CompanyAddress | null {
    return (
      this.data.addresses.find(address => address.isPrimary) ||
      this.data.addresses[0] ||
      null
    );
  }

  getDecisionMakers(): ContactPerson[] {
    return this.data.contacts.filter(contact => contact.isDecisionMaker);
  }

  getCreditLimit(): number {
    return this.data.financialInfo?.creditLimit || 0;
  }

  getOutstandingAmount(): number {
    return this.data.tradingHistory?.paymentHistory?.outstandingAmount || 0;
  }

  getAvailableCredit(): number {
    return this.getCreditLimit() - this.getOutstandingAmount();
  }

  hasValidDocuments(): boolean {
    if (!this.data.documents) return false;

    const now = new Date();
    return this.data.documents.some(
      doc => doc.isVerified && (!doc.expiryDate || doc.expiryDate > now)
    );
  }

  needsFollowUp(): boolean {
    if (!this.data.nextFollowUpDate) return false;
    return new Date() >= this.data.nextFollowUpDate;
  }

  calculateRelationshipScore(): number {
    let score = 0;

    // Base score by relationship status
    const statusScores = {
      NEW: 10,
      DEVELOPING: 30,
      ESTABLISHED: 60,
      STRATEGIC_PARTNER: 90,
      KEY_ACCOUNT: 100,
      AT_RISK: 20,
      DORMANT: 5,
    };
    score += statusScores[this.data.relationshipStatus];

    // Trading history bonus
    if (this.data.tradingHistory) {
      const { totalOrders, totalValue } = this.data.tradingHistory;
      score += Math.min(totalOrders * 2, 20); // Max 20 points for orders
      score += Math.min(totalValue / 10000, 30); // Max 30 points for value
    }

    // Payment history bonus
    const paymentHistory = this.data.tradingHistory?.paymentHistory;
    if (paymentHistory) {
      const totalPayments =
        paymentHistory.onTimePayments + paymentHistory.latePayments;
      if (totalPayments > 0) {
        const onTimeRate = paymentHistory.onTimePayments / totalPayments;
        score += onTimeRate * 20; // Max 20 points for payment reliability
      }
    }

    // Risk penalty
    const riskPenalties = { LOW: 0, MEDIUM: -5, HIGH: -15, CRITICAL: -30 };
    score += riskPenalties[this.data.riskLevel];

    return Math.max(0, Math.min(100, score));
  }

  getAnnualVolumePotential(): number {
    return this.data.businessProfile?.annualCoffeeVolume || 0;
  }

  isStrategicAccount(): boolean {
    return ['STRATEGIC_PARTNER', 'KEY_ACCOUNT'].includes(
      this.data.relationshipStatus
    );
  }

  addContact(
    contact: Omit<ContactPerson, 'id' | 'createdAt' | 'updatedAt'>
  ): ClientCompanyEntity {
    const newContact: ContactPerson = {
      ...contact,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedData: ClientCompany = {
      ...this.data,
      contacts: [...this.data.contacts, newContact],
      updatedAt: new Date(),
    };

    return new ClientCompanyEntity(updatedData);
  }

  addNote(
    note: Omit<CompanyNote, 'id' | 'createdAt' | 'updatedAt'>
  ): ClientCompanyEntity {
    const newNote: CompanyNote = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedData: ClientCompany = {
      ...this.data,
      notes: [...(this.data.notes || []), newNote],
      updatedAt: new Date(),
    };

    return new ClientCompanyEntity(updatedData);
  }

  updateStatus(status: CompanyStatus, updatedBy: string): ClientCompanyEntity {
    const updatedData: ClientCompany = {
      ...this.data,
      status,
      updatedAt: new Date(),
      updatedBy,
    };

    return new ClientCompanyEntity(updatedData);
  }

  updateRelationshipStatus(
    relationshipStatus: RelationshipStatus,
    updatedBy: string
  ): ClientCompanyEntity {
    const updatedData: ClientCompany = {
      ...this.data,
      relationshipStatus,
      updatedAt: new Date(),
      updatedBy,
    };

    return new ClientCompanyEntity(updatedData);
  }

  setNextFollowUp(date: Date, updatedBy: string): ClientCompanyEntity {
    const updatedData: ClientCompany = {
      ...this.data,
      nextFollowUpDate: date,
      updatedAt: new Date(),
      updatedBy,
    };

    return new ClientCompanyEntity(updatedData);
  }

  // Validation Methods
  static validate(data: unknown): ClientCompany {
    return ClientCompanySchema.parse(data);
  }

  static isValid(data: unknown): boolean {
    try {
      ClientCompanySchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  // Factory Methods
  static create(
    data: Omit<ClientCompany, 'id' | 'companyCode' | 'createdAt' | 'updatedAt'>
  ): ClientCompanyEntity {
    const now = new Date();
    const companyCode = ClientCompanyEntity.generateCompanyCode(data.legalName);

    const companyData: ClientCompany = {
      ...data,
      id: crypto.randomUUID(),
      companyCode,
      createdAt: now,
      updatedAt: now,
    };

    return new ClientCompanyEntity(companyData);
  }

  static generateCompanyCode(companyName: string): string {
    // Generate a unique company code based on name and timestamp
    const namePrefix = companyName
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 4)
      .toUpperCase();

    const timestamp = Date.now().toString().slice(-6);
    return `${namePrefix}${timestamp}`;
  }

  toJSON(): ClientCompany {
    return { ...this.data };
  }
}
