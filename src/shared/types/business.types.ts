// ================================
// CORE BUSINESS TYPES
// ================================

import { Locale } from './locale.types';

// ================================
// COFFEE PRODUCT TYPES
// ================================

export interface CoffeeProduct {
  id: string;
  sku: string;
  coffeeType: CoffeeType;
  grade: CoffeeGrade;
  processing: ProcessingMethod;
  isActive: boolean;
  specifications: CoffeeSpecifications;
  pricing: ProductPricing;
  availability: ProductAvailability;
  originInfo: OriginInfo;
  images: string[];
  documents: string[];
  translations: Record<Locale, CoffeeProductTranslation>;
  seoMetadata: Record<Locale, ProductSEOMetadata>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface CoffeeProductTranslation {
  locale: Locale;
  name: string;
  description: string;
  shortDescription: string;
  features: string[];
  benefits: string[];
  metaTitle: string;
  metaDescription: string;
  slug: string;
}

export interface CoffeeSpecifications {
  screenSize: string;
  moisture: number;
  defects: number;
  density: number;
  cupping: CuppingProfile;
  physicalCharacteristics: PhysicalCharacteristics;
  chemicalComposition: ChemicalComposition;
  certifications: Certification[];
}

export interface CuppingProfile {
  score: number;
  aroma: number;
  flavor: number;
  aftertaste: number;
  acidity: number;
  body: number;
  balance: number;
  uniformity: number;
  cleanCup: number;
  sweetness: number;
  overall: number;
  notes: string[];
  defects: number;
}

export interface PhysicalCharacteristics {
  beanSize: string;
  color: string;
  shape: string;
  surface: string;
  uniformity: string;
}

export interface ChemicalComposition {
  caffeine: number;
  chlorogenicAcid: number;
  trigonelline: number;
  lipids: number;
  proteins: number;
  carbohydrates: number;
  ash: number;
}

export interface Certification {
  id: string;
  name: string;
  type: CertificationType;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  certificateNumber: string;
  documentUrl?: string;
  isActive: boolean;
}

export interface ProductPricing {
  basePrice: number;
  currency: Currency;
  priceBreaks: PriceBreak[];
  incoterms: Incoterm[];
  paymentTerms: PaymentTerm[];
  validFrom: Date;
  validTo: Date;
}

export interface PriceBreak {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  unit: QuantityUnit;
}

export interface ProductAvailability {
  inStock: boolean;
  stockQuantity: number;
  unit: QuantityUnit;
  leadTime: number;
  leadTimeUnit: TimeUnit;
  harvestSeason: HarvestSeason;
  nextAvailability?: Date;
  minimumOrder: number;
  maximumOrder?: number;
}

export interface OriginInfo {
  country: string;
  region: string;
  province: string;
  farm?: string;
  farmer?: string;
  altitude: AltitudeRange;
  coordinates?: Coordinates;
  soilType: string;
  climate: ClimateInfo;
  harvestMethod: HarvestMethod;
  dryingMethod: DryingMethod;
}

export interface AltitudeRange {
  min: number;
  max: number;
  unit: 'meters' | 'feet';
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ClimateInfo {
  temperature: TemperatureRange;
  rainfall: number;
  humidity: number;
  season: string;
}

export interface TemperatureRange {
  min: number;
  max: number;
  unit: 'celsius' | 'fahrenheit';
}

// ================================
// BUSINESS SERVICE TYPES
// ================================

export interface BusinessService {
  id: string;
  serviceType: ServiceType;
  isActive: boolean;
  specifications: ServiceSpecifications;
  pricing: ServicePricing;
  delivery: ServiceDelivery;
  translations: Record<Locale, ServiceTranslation>;
  seoMetadata: Record<Locale, ServiceSEOMetadata>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceTranslation {
  locale: Locale;
  name: string;
  description: string;
  shortDescription: string;
  features: string[];
  benefits: string[];
  process: ProcessStep[];
  metaTitle: string;
  metaDescription: string;
  slug: string;
}

export interface ServiceSpecifications {
  capabilities: ServiceCapability[];
  certifications: Certification[];
  qualityStandards: QualityStandard[];
  equipment: Equipment[];
  capacity: ServiceCapacity;
  customization: CustomizationOptions;
}

export interface ServiceCapability {
  name: string;
  description: string;
  specifications: Record<string, unknown>;
}

export interface QualityStandard {
  name: string;
  standard: string;
  certification?: string;
  description: string;
}

export interface Equipment {
  name: string;
  type: string;
  capacity: string;
  specifications: Record<string, unknown>;
}

export interface ServiceCapacity {
  minimum: number;
  maximum: number;
  unit: QuantityUnit;
  timeframe: string;
}

export interface CustomizationOptions {
  packaging: PackagingOption[];
  labeling: LabelingOption[];
  blending: BlendingOption[];
  processing: ProcessingOption[];
}

export interface PackagingOption {
  type: PackagingType;
  sizes: PackagingSize[];
  materials: string[];
  customization: boolean;
}

export interface LabelingOption {
  type: LabelingType;
  customization: boolean;
  languages: Locale[];
  certificationLabels: boolean;
}

export interface BlendingOption {
  available: boolean;
  ratios: BlendRatio[];
  customBlends: boolean;
}

export interface BlendRatio {
  coffeeType: CoffeeType;
  percentage: number;
}

export interface ProcessingOption {
  method: ProcessingMethod;
  available: boolean;
  customization: boolean;
}

export interface ServicePricing {
  basePrice: number;
  currency: Currency;
  pricingModel: PricingModel;
  priceBreaks: ServicePriceBreak[];
  additionalCosts: AdditionalCost[];
  paymentTerms: PaymentTerm[];
}

export interface ServicePriceBreak {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  unit: QuantityUnit;
  setupFee?: number;
}

export interface AdditionalCost {
  name: string;
  type: CostType;
  amount: number;
  unit?: string;
  description: string;
}

export interface ServiceDelivery {
  leadTime: number;
  leadTimeUnit: TimeUnit;
  shippingOptions: ShippingOption[];
  incoterms: Incoterm[];
  packaging: PackagingDetails;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
  requirements?: string[];
}

// ================================
// RFQ (REQUEST FOR QUOTE) TYPES
// ================================

export interface RFQ {
  id: string;
  rfqNumber: string;
  status: RFQStatus;
  priority: RFQPriority;
  companyInfo: CompanyInfo;
  contactInfo: ContactInfo;
  productRequirements: ProductRequirement[];
  deliveryRequirements: DeliveryRequirements;
  paymentRequirements?: PaymentRequirements;
  additionalRequirements?: string;
  sampleRequired: boolean;
  urgency: UrgencyLevel;
  locale: Locale;
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  createdBy?: string;
  responses: RFQResponse[];
  communications: RFQCommunication[];
}

export interface CompanyInfo {
  name: string;
  businessType: BusinessType;
  industry: string;
  country: string;
  city: string;
  address?: string;
  website?: string;
  yearEstablished?: number;
  employeeCount?: EmployeeRange;
  annualVolume?: VolumeRange;
}

export interface ContactInfo {
  contactPerson: string;
  title: string;
  email: string;
  phone?: string;
  alternateEmail?: string;
  alternatePhone?: string;
  preferredContactMethod: ContactMethod;
  timezone: string;
}

export interface ProductRequirement {
  productType: CoffeeType;
  grade?: CoffeeGrade;
  origin?: string;
  processingMethod?: ProcessingMethod;
  certifications: string[];
  quantity: number;
  quantityUnit: QuantityUnit;
  targetPrice?: number;
  currency?: Currency;
  qualitySpecs?: QualitySpecification[];
  packaging?: PackagingRequirement;
  customization?: CustomizationRequirement[];
}

export interface QualitySpecification {
  parameter: string;
  value: string | number;
  tolerance?: string;
  testMethod?: string;
}

export interface PackagingRequirement {
  type: PackagingType;
  size: PackagingSize;
  material: string;
  labeling: LabelingRequirement;
  customization?: string;
}

export interface LabelingRequirement {
  type: LabelingType;
  languages: Locale[];
  customDesign: boolean;
  certificationLabels: string[];
  brandingRequirements?: string;
}

export interface CustomizationRequirement {
  type: CustomizationType;
  description: string;
  specifications?: Record<string, unknown>;
}

export interface DeliveryRequirements {
  destination: DeliveryDestination;
  incoterm: Incoterm;
  preferredShipping: ShippingMethod;
  deliveryTimeline: DeliveryTimeline;
  specialRequirements?: string[];
}

export interface DeliveryDestination {
  country: string;
  city: string;
  port?: string;
  address?: string;
  coordinates?: Coordinates;
}

export interface DeliveryTimeline {
  urgency: UrgencyLevel;
  preferredDeliveryDate?: Date;
  latestDeliveryDate?: Date;
  flexibility: FlexibilityLevel;
}

export interface PaymentRequirements {
  preferredTerms: PaymentTerm[];
  currency: Currency;
  creditTerms?: CreditTerms;
  paymentMethods: PaymentMethod[];
  specialRequirements?: string;
}

export interface CreditTerms {
  creditLimit?: number;
  paymentDays: number;
  earlyPaymentDiscount?: number;
  latePaymentPenalty?: number;
}

export interface RFQResponse {
  id: string;
  rfqId: string;
  respondedBy: string;
  responseDate: Date;
  quotedProducts: QuotedProduct[];
  totalValue: number;
  currency: Currency;
  validUntil: Date;
  terms: QuoteTerms;
  attachments: string[];
  notes?: string;
  status: ResponseStatus;
}

export interface QuotedProduct {
  productId?: string;
  productName: string;
  specifications: Record<string, unknown>;
  quantity: number;
  unit: QuantityUnit;
  unitPrice: number;
  totalPrice: number;
  leadTime: number;
  leadTimeUnit: TimeUnit;
  availability: Date;
}

export interface QuoteTerms {
  incoterm: Incoterm;
  paymentTerms: PaymentTerm;
  validityPeriod: number;
  deliveryTerms: string;
  qualityGuarantee: string;
  samplePolicy: string;
  cancellationPolicy?: string;
}

export interface RFQCommunication {
  id: string;
  rfqId: string;
  type: CommunicationType;
  direction: CommunicationDirection;
  subject: string;
  content: string;
  attachments: string[];
  sentBy: string;
  sentTo: string[];
  sentAt: Date;
  readAt?: Date;
  status: CommunicationStatus;
}

// ================================
// CLIENT COMPANY TYPES
// ================================

export interface ClientCompany {
  id: string;
  companyInfo: CompanyInfo;
  primaryContact: ContactInfo;
  additionalContacts: ContactInfo[];
  businessProfile: BusinessProfile;
  tradingHistory: TradingHistory;
  preferences: ClientPreferences;
  creditInfo: CreditInfo;
  documents: CompanyDocument[];
  tags: string[];
  status: ClientStatus;
  createdAt: Date;
  updatedAt: Date;
  lastContactDate?: Date;
  assignedSalesRep?: string;
}

export interface BusinessProfile {
  businessType: BusinessType;
  industry: string;
  subIndustry?: string;
  targetMarkets: string[];
  distributionChannels: DistributionChannel[];
  certifications: Certification[];
  qualityRequirements: QualityRequirement[];
  volumeProfile: VolumeProfile;
  seasonality: SeasonalityProfile;
}

export interface TradingHistory {
  firstOrderDate?: Date;
  lastOrderDate?: Date;
  totalOrders: number;
  totalVolume: number;
  totalValue: number;
  averageOrderValue: number;
  averageOrderVolume: number;
  paymentHistory: PaymentHistoryRecord[];
  preferredProducts: string[];
  orderFrequency: OrderFrequency;
}

export interface PaymentHistoryRecord {
  orderId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  daysLate?: number;
}

export interface ClientPreferences {
  communicationPreferences: CommunicationPreferences;
  productPreferences: ProductPreferences;
  servicePreferences: ServicePreferences;
  logisticsPreferences: LogisticsPreferences;
}

export interface CommunicationPreferences {
  preferredLanguage: Locale;
  preferredContactMethod: ContactMethod;
  contactFrequency: ContactFrequency;
  marketingConsent: boolean;
  newsletterSubscription: boolean;
  priceAlerts: boolean;
  availabilityAlerts: boolean;
}

export interface ProductPreferences {
  preferredOrigins: string[];
  preferredGrades: CoffeeGrade[];
  preferredProcessing: ProcessingMethod[];
  requiredCertifications: string[];
  qualityPriority: QualityPriority;
  priceSensitivity: PriceSensitivity;
}

export interface ServicePreferences {
  preferredServices: ServiceType[];
  customizationRequirements: CustomizationType[];
  qualityAssuranceLevel: QualityAssuranceLevel;
  reportingRequirements: ReportingRequirement[];
}

export interface LogisticsPreferences {
  preferredIncoterms: Incoterm[];
  preferredShipping: ShippingMethod[];
  preferredPorts: string[];
  consolidationPreference: ConsolidationPreference;
  insuranceRequirements: InsuranceRequirement;
}

export interface CreditInfo {
  creditLimit: number;
  currency: Currency;
  paymentTerms: PaymentTerm;
  creditRating?: CreditRating;
  creditHistory: CreditHistoryRecord[];
  guarantees: Guarantee[];
  riskAssessment: RiskAssessment;
}

export interface CreditHistoryRecord {
  date: Date;
  type: CreditEventType;
  amount: number;
  description: string;
  impact: CreditImpact;
}

export interface Guarantee {
  type: GuaranteeType;
  amount: number;
  currency: Currency;
  issuer: string;
  validFrom: Date;
  validTo: Date;
  documentUrl?: string;
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  factors: RiskFactor[];
  lastAssessmentDate: Date;
  nextReviewDate: Date;
  assessedBy: string;
  notes?: string;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  score: number;
  impact: RiskImpact;
  description: string;
}

export interface CompanyDocument {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadDate: Date;
  expiryDate?: Date;
  isVerified: boolean;
  verifiedBy?: string;
  verificationDate?: Date;
}

// ================================
// ENUMS AND CONSTANTS
// ================================

export enum CoffeeType {
  ROBUSTA = 'ROBUSTA',
  ARABICA = 'ARABICA',
  BLEND = 'BLEND',
}

export enum CoffeeGrade {
  GRADE_1 = 'GRADE_1',
  GRADE_2 = 'GRADE_2',
  GRADE_3 = 'GRADE_3',
  PREMIUM = 'PREMIUM',
  SPECIALTY = 'SPECIALTY',
}

export enum ProcessingMethod {
  NATURAL = 'NATURAL',
  WASHED = 'WASHED',
  HONEY = 'HONEY',
  WET_HULLED = 'WET_HULLED',
  SEMI_WASHED = 'SEMI_WASHED',
}

export enum ServiceType {
  OEM = 'OEM',
  PRIVATE_LABEL = 'PRIVATE_LABEL',
  SOURCING = 'SOURCING',
  LOGISTICS = 'LOGISTICS',
  QUALITY_CONTROL = 'QUALITY_CONTROL',
  CONSULTING = 'CONSULTING',
}

export enum RFQStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  QUOTED = 'QUOTED',
  NEGOTIATING = 'NEGOTIATING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum RFQPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum BusinessType {
  IMPORTER = 'IMPORTER',
  DISTRIBUTOR = 'DISTRIBUTOR',
  ROASTER = 'ROASTER',
  RETAILER = 'RETAILER',
  CAFE_CHAIN = 'CAFE_CHAIN',
  FOOD_SERVICE = 'FOOD_SERVICE',
  MANUFACTURER = 'MANUFACTURER',
  TRADER = 'TRADER',
}

export enum ClientStatus {
  PROSPECT = 'PROSPECT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  BLACKLISTED = 'BLACKLISTED',
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  JPY = 'JPY',
  VND = 'VND',
  CNY = 'CNY',
  KRW = 'KRW',
}

export enum QuantityUnit {
  KG = 'KG',
  MT = 'MT',
  LB = 'LB',
  BAG = 'BAG',
  CONTAINER = 'CONTAINER',
}

export enum TimeUnit {
  DAYS = 'DAYS',
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS',
}

export enum Incoterm {
  EXW = 'EXW',
  FCA = 'FCA',
  CPT = 'CPT',
  CIP = 'CIP',
  DAP = 'DAP',
  DPU = 'DPU',
  DDP = 'DDP',
  FAS = 'FAS',
  FOB = 'FOB',
  CFR = 'CFR',
  CIF = 'CIF',
}

export enum PaymentTerm {
  CASH_ADVANCE = 'CASH_ADVANCE',
  LC_AT_SIGHT = 'LC_AT_SIGHT',
  LC_USANCE = 'LC_USANCE',
  TT_ADVANCE = 'TT_ADVANCE',
  TT_AGAINST_DOCS = 'TT_AGAINST_DOCS',
  NET_30 = 'NET_30',
  NET_60 = 'NET_60',
  NET_90 = 'NET_90',
}

export enum CertificationType {
  ORGANIC = 'ORGANIC',
  FAIR_TRADE = 'FAIR_TRADE',
  RAINFOREST_ALLIANCE = 'RAINFOREST_ALLIANCE',
  UTZ = 'UTZ',
  BIRD_FRIENDLY = 'BIRD_FRIENDLY',
  SHADE_GROWN = 'SHADE_GROWN',
  DIRECT_TRADE = 'DIRECT_TRADE',
  ISO = 'ISO',
  HACCP = 'HACCP',
  BRC = 'BRC',
  SQF = 'SQF',
}

export enum HarvestSeason {
  MAIN_CROP = 'MAIN_CROP',
  FLY_CROP = 'FLY_CROP',
  YEAR_ROUND = 'YEAR_ROUND',
}

export enum HarvestMethod {
  HAND_PICKED = 'HAND_PICKED',
  MACHINE_HARVESTED = 'MACHINE_HARVESTED',
  SELECTIVE_PICKING = 'SELECTIVE_PICKING',
}

export enum DryingMethod {
  SUN_DRIED = 'SUN_DRIED',
  MACHINE_DRIED = 'MACHINE_DRIED',
  PATIO_DRIED = 'PATIO_DRIED',
  RAISED_BEDS = 'RAISED_BEDS',
}

export enum PackagingType {
  JUTE_BAG = 'JUTE_BAG',
  PLASTIC_BAG = 'PLASTIC_BAG',
  VACUUM_BAG = 'VACUUM_BAG',
  BULK_CONTAINER = 'BULK_CONTAINER',
  CUSTOM = 'CUSTOM',
}

export enum PackagingSize {
  SIZE_60KG = '60KG',
  SIZE_69KG = '69KG',
  SIZE_1000KG = '1000KG',
  CUSTOM_SIZE = 'CUSTOM',
}

export enum LabelingType {
  STANDARD = 'STANDARD',
  PRIVATE_LABEL = 'PRIVATE_LABEL',
  CUSTOM = 'CUSTOM',
  CERTIFICATION_ONLY = 'CERTIFICATION_ONLY',
}

export enum PricingModel {
  FIXED = 'FIXED',
  VOLUME_BASED = 'VOLUME_BASED',
  MARKET_BASED = 'MARKET_BASED',
  CUSTOM = 'CUSTOM',
}

export enum CostType {
  SETUP = 'SETUP',
  PROCESSING = 'PROCESSING',
  PACKAGING = 'PACKAGING',
  SHIPPING = 'SHIPPING',
  CERTIFICATION = 'CERTIFICATION',
  TESTING = 'TESTING',
}

export enum ShippingMethod {
  SEA_FREIGHT = 'SEA_FREIGHT',
  AIR_FREIGHT = 'AIR_FREIGHT',
  LAND_TRANSPORT = 'LAND_TRANSPORT',
  MULTIMODAL = 'MULTIMODAL',
}

export enum UrgencyLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum FlexibilityLevel {
  FLEXIBLE = 'FLEXIBLE',
  SOMEWHAT_FLEXIBLE = 'SOMEWHAT_FLEXIBLE',
  FIXED = 'FIXED',
}

export enum ContactMethod {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  WHATSAPP = 'WHATSAPP',
  SKYPE = 'SKYPE',
  TEAMS = 'TEAMS',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'BANK_TRANSFER',
  LETTER_OF_CREDIT = 'LETTER_OF_CREDIT',
  CASH = 'CASH',
  CHECK = 'CHECK',
  ONLINE_PAYMENT = 'ONLINE_PAYMENT',
}

export enum ResponseStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  VIEWED = 'VIEWED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export enum CommunicationType {
  EMAIL = 'EMAIL',
  PHONE_CALL = 'PHONE_CALL',
  MEETING = 'MEETING',
  VIDEO_CALL = 'VIDEO_CALL',
  CHAT = 'CHAT',
  DOCUMENT = 'DOCUMENT',
}

export enum CommunicationDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
}

export enum CommunicationStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  REPLIED = 'REPLIED',
  FAILED = 'FAILED',
}

export enum CustomizationType {
  BLENDING = 'BLENDING',
  ROASTING = 'ROASTING',
  PACKAGING = 'PACKAGING',
  LABELING = 'LABELING',
  PROCESSING = 'PROCESSING',
}

// ================================
// MISSING TYPE DEFINITIONS
// ================================

// SEO Metadata Types
export interface ProductSEOMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, unknown>;
}

export interface ServiceSEOMetadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, unknown>;
}

// Shipping and Logistics Types
export interface ShippingOption {
  id: string;
  name: string;
  method: ShippingMethod;
  estimatedDays: number;
  cost: number;
  currency: Currency;
  description?: string;
  restrictions?: string[];
}

export interface PackagingDetails {
  type: PackagingType;
  size: PackagingSize;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };
  material: string;
  customization?: string;
}

// Company Profile Types
export enum EmployeeRange {
  SMALL = '1-10',
  MEDIUM = '11-50',
  LARGE = '51-200',
  ENTERPRISE = '200+',
}

export enum VolumeRange {
  LOW = '0-100MT',
  MEDIUM = '100-500MT',
  HIGH = '500-1000MT',
  VERY_HIGH = '1000MT+',
}

export enum DistributionChannel {
  RETAIL = 'RETAIL',
  WHOLESALE = 'WHOLESALE',
  ONLINE = 'ONLINE',
  FOOD_SERVICE = 'FOOD_SERVICE',
  EXPORT = 'EXPORT',
}

// Quality and Requirements Types
export interface QualityRequirement {
  parameter: string;
  requirement: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  testMethod?: string;
}

export interface VolumeProfile {
  annualVolume: number;
  unit: QuantityUnit;
  seasonalVariation: number;
  growthRate: number;
}

export interface SeasonalityProfile {
  peakMonths: string[];
  lowMonths: string[];
  variationPercentage: number;
}

export enum OrderFrequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  IRREGULAR = 'IRREGULAR',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PARTIAL = 'PARTIAL',
  CANCELLED = 'CANCELLED',
}

export enum ContactFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  AS_NEEDED = 'AS_NEEDED',
}

export enum QualityPriority {
  PREMIUM = 'PREMIUM',
  STANDARD = 'STANDARD',
  COMMERCIAL = 'COMMERCIAL',
}

export enum PriceSensitivity {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum QualityAssuranceLevel {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  CUSTOM = 'CUSTOM',
}

export enum ReportingRequirement {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUALLY = 'ANNUALLY',
  ON_DEMAND = 'ON_DEMAND',
}

export enum ConsolidationPreference {
  FULL_CONTAINER = 'FULL_CONTAINER',
  LCL_ACCEPTABLE = 'LCL_ACCEPTABLE',
  FLEXIBLE = 'FLEXIBLE',
}

export enum InsuranceRequirement {
  BASIC = 'BASIC',
  COMPREHENSIVE = 'COMPREHENSIVE',
  CUSTOM = 'CUSTOM',
  NOT_REQUIRED = 'NOT_REQUIRED',
}

// Credit and Risk Types
export enum CreditRating {
  AAA = 'AAA',
  AA = 'AA',
  A = 'A',
  BBB = 'BBB',
  BB = 'BB',
  B = 'B',
  CCC = 'CCC',
  CC = 'CC',
  C = 'C',
  D = 'D',
}

export enum CreditEventType {
  PAYMENT = 'PAYMENT',
  LATE_PAYMENT = 'LATE_PAYMENT',
  DEFAULT = 'DEFAULT',
  CREDIT_INCREASE = 'CREDIT_INCREASE',
  CREDIT_DECREASE = 'CREDIT_DECREASE',
}

export enum CreditImpact {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  NEUTRAL = 'NEUTRAL',
}

export enum GuaranteeType {
  BANK_GUARANTEE = 'BANK_GUARANTEE',
  LETTER_OF_CREDIT = 'LETTER_OF_CREDIT',
  INSURANCE = 'INSURANCE',
  CORPORATE_GUARANTEE = 'CORPORATE_GUARANTEE',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum RiskImpact {
  MINIMAL = 'MINIMAL',
  MODERATE = 'MODERATE',
  SIGNIFICANT = 'SIGNIFICANT',
  SEVERE = 'SEVERE',
}

// Document Types
export enum DocumentType {
  BUSINESS_LICENSE = 'BUSINESS_LICENSE',
  TAX_CERTIFICATE = 'TAX_CERTIFICATE',
  IMPORT_LICENSE = 'IMPORT_LICENSE',
  QUALITY_CERTIFICATE = 'QUALITY_CERTIFICATE',
  INSURANCE_CERTIFICATE = 'INSURANCE_CERTIFICATE',
  BANK_REFERENCE = 'BANK_REFERENCE',
  TRADE_REFERENCE = 'TRADE_REFERENCE',
  OTHER = 'OTHER',
}

// Additional supporting types and interfaces would continue here...
// This represents a comprehensive foundation for The Great Beans business domain
