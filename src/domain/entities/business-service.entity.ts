import { z } from 'zod';

import {
  MultilingualContentSchema,
  type MultilingualContent,
} from './coffee-product.entity';

// Service Type Enum
export const ServiceTypeSchema = z.enum([
  'OEM_MANUFACTURING',
  'PRIVATE_LABEL',
  'COFFEE_SOURCING',
  'LOGISTICS_SHIPPING',
  'QUALITY_CONTROL',
  'MARKET_CONSULTING',
  'CUSTOM_BLENDING',
  'PACKAGING_DESIGN',
  'CERTIFICATION_SUPPORT',
  'SUPPLY_CHAIN_MANAGEMENT',
]);

// Service Category Enum
export const ServiceCategorySchema = z.enum([
  'MANUFACTURING',
  'SOURCING',
  'LOGISTICS',
  'CONSULTING',
  'QUALITY_ASSURANCE',
  'BRANDING',
]);

// Service Pricing Model Enum
export const PricingModelSchema = z.enum([
  'FIXED_RATE',
  'PERCENTAGE_BASED',
  'VOLUME_BASED',
  'HOURLY_RATE',
  'PROJECT_BASED',
  'CUSTOM_QUOTE',
]);

// Service Delivery Timeline Schema
export const DeliveryTimelineSchema = z.object({
  minimumDays: z.number().positive(),
  maximumDays: z.number().positive(),
  averageDays: z.number().positive(),
  rushAvailable: z.boolean().default(false),
  rushSurcharge: z.number().min(0).optional(),
});

// Service Pricing Schema
export const ServicePricingSchema = z.object({
  model: PricingModelSchema,
  basePrice: z.number().positive().optional(),
  currency: z.enum(['USD', 'EUR', 'JPY', 'GBP']),
  minimumOrder: z.number().positive().optional(),
  maximumOrder: z.number().positive().optional(),
  volumeDiscounts: z
    .array(
      z.object({
        threshold: z.number().positive(),
        discountPercentage: z.number().min(0).max(100),
      })
    )
    .optional(),
  customQuoteRequired: z.boolean().default(false),
});

// Service Requirements Schema
export const ServiceRequirementsSchema = z.object({
  minimumQuantity: z.number().positive().optional(),
  leadTimeRequired: z.number().positive(), // Days
  documentsRequired: z.array(z.string()),
  certificationsRequired: z.array(z.string()).optional(),
  technicalSpecs: z.record(z.string(), z.any()).optional(),
});

// Service Capabilities Schema
export const ServiceCapabilitiesSchema = z.object({
  maxCapacityPerMonth: z.number().positive().optional(), // MT or units
  supportedPackaging: z.array(z.string()),
  supportedCertifications: z.array(z.string()),
  qualityStandards: z.array(z.string()),
  geographicCoverage: z.array(z.string()), // Countries/regions
  languageSupport: z.array(z.string()),
});

// Service Process Steps Schema
export const ProcessStepSchema = z.object({
  stepNumber: z.number().positive(),
  name: MultilingualContentSchema,
  description: MultilingualContentSchema,
  estimatedDuration: z.number().positive(), // Days
  deliverables: z.array(z.string()),
  clientInvolvementRequired: z.boolean().default(false),
});

// Business Service Entity Schema
export const BusinessServiceSchema = z.object({
  id: z.string().uuid(),
  serviceCode: z.string().min(1),
  name: MultilingualContentSchema,
  description: MultilingualContentSchema,
  shortDescription: MultilingualContentSchema.optional(),

  // Service Classification
  type: ServiceTypeSchema,
  category: ServiceCategorySchema,
  subCategory: z.string().optional(),

  // Service Details
  pricing: ServicePricingSchema,
  timeline: DeliveryTimelineSchema,
  requirements: ServiceRequirementsSchema,
  capabilities: ServiceCapabilitiesSchema,

  // Process Information
  processSteps: z.array(ProcessStepSchema),

  // Features & Benefits
  keyFeatures: z.array(MultilingualContentSchema),
  benefits: z.array(MultilingualContentSchema),

  // Media & Documentation
  images: z.array(
    z.object({
      url: z.string().url(),
      alt: MultilingualContentSchema,
      isPrimary: z.boolean().default(false),
    })
  ),
  documents: z
    .array(
      z.object({
        type: z.enum(['BROCHURE', 'CASE_STUDY', 'SPECIFICATION', 'TEMPLATE']),
        url: z.string().url(),
        name: MultilingualContentSchema,
        language: z.string().optional(),
      })
    )
    .optional(),

  // Case Studies & Portfolio
  caseStudies: z
    .array(
      z.object({
        id: z.string().uuid(),
        title: MultilingualContentSchema,
        summary: MultilingualContentSchema,
        industry: z.string(),
        results: z.array(z.string()),
        imageUrl: z.string().url().optional(),
      })
    )
    .optional(),

  // SEO & Marketing
  seoTitle: MultilingualContentSchema.optional(),
  seoDescription: MultilingualContentSchema.optional(),
  keywords: z.array(z.string()).optional(),

  // Business Rules
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  requiresConsultation: z.boolean().default(false),
  availableForQuote: z.boolean().default(true),
  sortOrder: z.number().default(0),

  // System Fields
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

// Type Exports
export type ServiceType = z.infer<typeof ServiceTypeSchema>;
export type ServiceCategory = z.infer<typeof ServiceCategorySchema>;
export type PricingModel = z.infer<typeof PricingModelSchema>;
export type DeliveryTimeline = z.infer<typeof DeliveryTimelineSchema>;
export type ServicePricing = z.infer<typeof ServicePricingSchema>;
export type ServiceRequirements = z.infer<typeof ServiceRequirementsSchema>;
export type ServiceCapabilities = z.infer<typeof ServiceCapabilitiesSchema>;
export type ProcessStep = z.infer<typeof ProcessStepSchema>;
export type BusinessService = z.infer<typeof BusinessServiceSchema>;

// Business Service Entity Class
export class BusinessServiceEntity {
  constructor(private readonly data: BusinessService) {
    BusinessServiceSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get serviceCode(): string {
    return this.data.serviceCode;
  }
  get name(): MultilingualContent {
    return this.data.name;
  }
  get type(): ServiceType {
    return this.data.type;
  }
  get category(): ServiceCategory {
    return this.data.category;
  }
  get pricing(): ServicePricing {
    return this.data.pricing;
  }
  get timeline(): DeliveryTimeline {
    return this.data.timeline;
  }
  get isActive(): boolean {
    return this.data.isActive;
  }

  // Business Logic Methods
  isAvailableForQuote(): boolean {
    return this.data.isActive && this.data.availableForQuote;
  }

  requiresCustomQuote(): boolean {
    return (
      this.data.pricing.customQuoteRequired || this.data.requiresConsultation
    );
  }

  canHandleVolume(quantity: number): boolean {
    const { minimumOrder, maximumOrder } = this.data.pricing;
    const { maxCapacityPerMonth } = this.data.capabilities;

    const meetsMinimum = !minimumOrder || quantity >= minimumOrder;
    const meetsMaximum = !maximumOrder || quantity <= maximumOrder;
    const withinCapacity =
      !maxCapacityPerMonth || quantity <= maxCapacityPerMonth;

    return meetsMinimum && meetsMaximum && withinCapacity;
  }

  calculateEstimatedPrice(
    quantity?: number,
    rushDelivery = false
  ): number | null {
    if (this.data.pricing.customQuoteRequired) {
      return null; // Requires custom quote
    }

    let basePrice = this.data.pricing.basePrice;
    if (!basePrice) return null;

    let totalPrice = basePrice;

    // Apply quantity if provided
    if (quantity) {
      totalPrice *= quantity;

      // Apply volume discounts
      if (this.data.pricing.volumeDiscounts) {
        const applicableDiscount = this.data.pricing.volumeDiscounts
          .filter(discount => quantity >= discount.threshold)
          .sort((a, b) => b.threshold - a.threshold)[0];

        if (applicableDiscount) {
          totalPrice *= 1 - applicableDiscount.discountPercentage / 100;
        }
      }
    }

    // Apply rush surcharge
    if (
      rushDelivery &&
      this.data.timeline.rushAvailable &&
      this.data.timeline.rushSurcharge
    ) {
      totalPrice *= 1 + this.data.timeline.rushSurcharge / 100;
    }

    return totalPrice;
  }

  getEstimatedDeliveryTime(rushDelivery = false): {
    min: number;
    max: number;
    average: number;
  } {
    if (rushDelivery && this.data.timeline.rushAvailable) {
      // Assume rush delivery is 50% faster
      return {
        min: Math.ceil(this.data.timeline.minimumDays * 0.5),
        max: Math.ceil(this.data.timeline.maximumDays * 0.5),
        average: Math.ceil(this.data.timeline.averageDays * 0.5),
      };
    }

    return {
      min: this.data.timeline.minimumDays,
      max: this.data.timeline.maximumDays,
      average: this.data.timeline.averageDays,
    };
  }

  getLocalizedName(locale: string): string {
    const localeKey = locale.split('-')[0] as keyof MultilingualContent;
    return this.data.name[localeKey] || this.data.name.en;
  }

  getLocalizedDescription(locale: string): string {
    const localeKey = locale.split('-')[0] as keyof MultilingualContent;
    return this.data.description[localeKey] || this.data.description.en;
  }

  supportsGeography(country: string): boolean {
    return (
      this.data.capabilities.geographicCoverage.includes(country) ||
      this.data.capabilities.geographicCoverage.includes('GLOBAL')
    );
  }

  supportsCertification(certification: string): boolean {
    return this.data.capabilities.supportedCertifications.includes(
      certification
    );
  }

  getProcessStepsByLocale(locale: string): Array<{
    stepNumber: number;
    name: string;
    description: string;
    estimatedDuration: number;
    deliverables: string[];
    clientInvolvementRequired: boolean;
  }> {
    const localeKey = locale.split('-')[0] as keyof MultilingualContent;

    return this.data.processSteps.map(step => ({
      stepNumber: step.stepNumber,
      name: step.name[localeKey] || step.name.en,
      description: step.description[localeKey] || step.description.en,
      estimatedDuration: step.estimatedDuration,
      deliverables: step.deliverables,
      clientInvolvementRequired: step.clientInvolvementRequired,
    }));
  }

  // Validation Methods
  static validate(data: unknown): BusinessService {
    return BusinessServiceSchema.parse(data);
  }

  static isValid(data: unknown): boolean {
    try {
      BusinessServiceSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  // Factory Methods
  static create(
    data: Omit<BusinessService, 'id' | 'createdAt' | 'updatedAt'>
  ): BusinessServiceEntity {
    const now = new Date();
    const serviceData: BusinessService = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    return new BusinessServiceEntity(serviceData);
  }

  // Update Methods
  updatePricing(pricing: ServicePricing): BusinessServiceEntity {
    const updatedData: BusinessService = {
      ...this.data,
      pricing,
      updatedAt: new Date(),
    };

    return new BusinessServiceEntity(updatedData);
  }

  updateTimeline(timeline: DeliveryTimeline): BusinessServiceEntity {
    const updatedData: BusinessService = {
      ...this.data,
      timeline,
      updatedAt: new Date(),
    };

    return new BusinessServiceEntity(updatedData);
  }

  addCaseStudy(
    caseStudy: BusinessService['caseStudies'][0]
  ): BusinessServiceEntity {
    const updatedData: BusinessService = {
      ...this.data,
      caseStudies: [...(this.data.caseStudies || []), caseStudy],
      updatedAt: new Date(),
    };

    return new BusinessServiceEntity(updatedData);
  }

  toJSON(): BusinessService {
    return { ...this.data };
  }
}
