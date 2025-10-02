import { z } from 'zod';

// Coffee Grade Enum
export const CoffeeGradeSchema = z.enum([
  'GRADE_1',
  'GRADE_2',
  'GRADE_3',
  'SCREEN_18',
  'SCREEN_16',
  'SCREEN_13',
  'SPECIALTY',
  'COMMERCIAL',
]);

// Processing Method Enum
export const ProcessingMethodSchema = z.enum([
  'NATURAL',
  'WASHED',
  'HONEY',
  'WET_HULLED',
  'SEMI_WASHED',
]);

// Coffee Type Enum
export const CoffeeTypeSchema = z.enum([
  'ROBUSTA',
  'ARABICA',
  'BLEND',
  'INSTANT',
]);

// Certification Enum
export const CertificationSchema = z.enum([
  'ORGANIC',
  'FAIR_TRADE',
  'RAINFOREST_ALLIANCE',
  'UTZ',
  'C_CAFE',
  'ISO_22000',
  'HACCP',
  'KOSHER',
  'HALAL',
]);

// Coffee Specifications Schema
export const CoffeeSpecificationsSchema = z.object({
  moisture: z.number().min(0).max(20), // Percentage
  screenSize: z.string(), // e.g., "18+", "16-18", "13+"
  defectRate: z.number().min(0).max(100), // Percentage
  cuppingScore: z.number().min(0).max(100).optional(), // For specialty coffee
  density: z.number().positive().optional(), // g/ml
  acidity: z.string().optional(), // Low, Medium, High
  body: z.string().optional(), // Light, Medium, Full
  flavor: z.string().optional(), // Flavor notes
});

// Pricing Schema
export const PricingSchema = z.object({
  basePrice: z.number().positive(),
  currency: z.enum(['USD', 'EUR', 'JPY', 'GBP']),
  unit: z.enum(['MT', 'KG', 'LB', 'BAG']),
  incoterms: z.enum(['FOB', 'CIF', 'CFR', 'EXW', 'FCA']),
  minimumOrder: z.number().positive(),
  priceValidUntil: z.date(),
  discountTiers: z
    .array(
      z.object({
        quantity: z.number().positive(),
        discountPercentage: z.number().min(0).max(100),
      })
    )
    .optional(),
});

// Availability Schema
export const AvailabilitySchema = z.object({
  inStock: z.boolean(),
  stockQuantity: z.number().min(0),
  harvestSeason: z.string(), // e.g., "2024/2025"
  availableFrom: z.date(),
  availableUntil: z.date().optional(),
  leadTime: z.number().positive(), // Days
  productionCapacity: z.number().positive(), // MT per month
});

// Origin Information Schema
export const OriginInfoSchema = z.object({
  region: z.string(), // e.g., "Dak Lak", "Gia Lai", "Lam Dong"
  province: z.string(),
  altitude: z.number().positive().optional(), // Meters above sea level
  farmSize: z.string().optional(), // e.g., "Small holder", "Estate"
  cooperativeName: z.string().optional(),
  coordinates: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),
  soilType: z.string().optional(),
  climate: z.string().optional(),
});

// Multilingual Content Schema
export const MultilingualContentSchema = z.object({
  en: z.string(),
  de: z.string().optional(),
  ja: z.string().optional(),
  fr: z.string().optional(),
  it: z.string().optional(),
  es: z.string().optional(),
  nl: z.string().optional(),
  ko: z.string().optional(),
});

// Coffee Product Entity Schema
export const CoffeeProductSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(1),
  name: MultilingualContentSchema,
  description: MultilingualContentSchema,
  shortDescription: MultilingualContentSchema.optional(),

  // Core Product Information
  type: CoffeeTypeSchema,
  grade: CoffeeGradeSchema,
  processingMethod: ProcessingMethodSchema,
  specifications: CoffeeSpecificationsSchema,

  // Business Information
  pricing: PricingSchema,
  availability: AvailabilitySchema,
  certifications: z.array(CertificationSchema),

  // Origin & Traceability
  origin: OriginInfoSchema,
  traceabilityCode: z.string().optional(),

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
        type: z.enum(['SPECIFICATION', 'CERTIFICATE', 'SAMPLE_REPORT', 'COA']),
        url: z.string().url(),
        name: MultilingualContentSchema,
        language: z.string().optional(),
      })
    )
    .optional(),

  // SEO & Marketing
  seoTitle: MultilingualContentSchema.optional(),
  seoDescription: MultilingualContentSchema.optional(),
  keywords: z.array(z.string()).optional(),

  // System Fields
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

// Type Exports
export type CoffeeGrade = z.infer<typeof CoffeeGradeSchema>;
export type ProcessingMethod = z.infer<typeof ProcessingMethodSchema>;
export type CoffeeType = z.infer<typeof CoffeeTypeSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type CoffeeSpecifications = z.infer<typeof CoffeeSpecificationsSchema>;
export type Pricing = z.infer<typeof PricingSchema>;
export type Availability = z.infer<typeof AvailabilitySchema>;
export type OriginInfo = z.infer<typeof OriginInfoSchema>;
export type MultilingualContent = z.infer<typeof MultilingualContentSchema>;
export type CoffeeProduct = z.infer<typeof CoffeeProductSchema>;

// Coffee Product Entity Class
export class CoffeeProductEntity {
  constructor(private readonly data: CoffeeProduct) {
    CoffeeProductSchema.parse(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get sku(): string {
    return this.data.sku;
  }
  get name(): MultilingualContent {
    return this.data.name;
  }
  get type(): CoffeeType {
    return this.data.type;
  }
  get grade(): CoffeeGrade {
    return this.data.grade;
  }
  get pricing(): Pricing {
    return this.data.pricing;
  }
  get availability(): Availability {
    return this.data.availability;
  }
  get isActive(): boolean {
    return this.data.isActive;
  }
  get description(): MultilingualContent {
    return this.data.description;
  }
  get origin(): OriginInfo {
    return this.data.origin;
  }
  get processingMethod(): ProcessingMethod {
    return this.data.processingMethod;
  }
  get certifications(): Certification[] {
    return this.data.certifications;
  }
  get specifications(): CoffeeSpecifications {
    return this.data.specifications;
  }
  get images(): Array<{ url: string; alt: MultilingualContent; isPrimary: boolean }> {
    return this.data.images;
  }
  get documents() {
    return this.data.documents;
  }
  get isFeatured(): boolean {
    return this.data.isFeatured;
  }
  get sortOrder(): number {
    return this.data.sortOrder;
  }
  get createdAt(): Date {
    return this.data.createdAt;
  }
  get updatedAt(): Date {
    return this.data.updatedAt;
  }
  get createdBy(): string {
    return this.data.createdBy;
  }
  get updatedBy(): string {
    return this.data.updatedBy;
  }

  // Business Logic Methods
  isAvailable(): boolean {
    const now = new Date();
    return (
      this.data.isActive &&
      this.data.availability.inStock &&
      this.data.availability.availableFrom <= now &&
      (this.data.availability.availableUntil === undefined ||
        this.data.availability.availableUntil >= now)
    );
  }

  canFulfillOrder(quantity: number): boolean {
    return (
      this.isAvailable() &&
      quantity >= this.data.pricing.minimumOrder &&
      quantity <= this.data.availability.stockQuantity
    );
  }

  calculatePrice(quantity: number, incoterms?: string): number {
    let basePrice = this.data.pricing.basePrice;

    // Apply quantity discounts
    if (this.data.pricing.discountTiers) {
      const applicableDiscount = this.data.pricing.discountTiers
        .filter(tier => quantity >= tier.quantity)
        .sort((a, b) => b.quantity - a.quantity)[0];

      if (applicableDiscount) {
        basePrice *= 1 - applicableDiscount.discountPercentage / 100;
      }
    }

    // Adjust price based on incoterms if different from default
    if (incoterms && incoterms !== this.data.pricing.incoterms) {
      const incotermAdjustments: Record<string, number> = {
        EXW: 0.95, // Ex Works - buyer handles all shipping
        FCA: 0.97, // Free Carrier - minimal seller responsibility
        FOB: 1.0, // Free on Board - baseline
        CFR: 1.03, // Cost and Freight - seller pays freight
        CIF: 1.05, // Cost, Insurance and Freight - seller pays freight + insurance
      };

      const adjustment = incotermAdjustments[incoterms] || 1.0;
      basePrice *= adjustment;
    }

    return basePrice * quantity;
  }

  getLocalizedName(locale: string): string {
    const localeKey = locale.split('-')[0] as keyof MultilingualContent;
    return this.data.name[localeKey] || this.data.name.en;
  }

  getLocalizedDescription(locale: string): string {
    const localeKey = locale.split('-')[0] as keyof MultilingualContent;
    return this.data.description[localeKey] || this.data.description.en;
  }

  hasCertification(certification: Certification): boolean {
    return this.data.certifications.includes(certification);
  }

  isSpecialtyGrade(): boolean {
    return (
      this.data.grade === 'SPECIALTY' ||
      (this.data.specifications.cuppingScore !== undefined &&
        this.data.specifications.cuppingScore >= 80)
    );
  }

  getEstimatedDeliveryDate(): Date {
    const deliveryDate = new Date();
    deliveryDate.setDate(
      deliveryDate.getDate() + this.data.availability.leadTime
    );
    return deliveryDate;
  }

  // Validation Methods
  static validate(data: unknown): CoffeeProduct {
    return CoffeeProductSchema.parse(data);
  }

  static isValid(data: unknown): boolean {
    try {
      CoffeeProductSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  // Factory Methods
  static create(
    data: Omit<CoffeeProduct, 'id' | 'createdAt' | 'updatedAt'>
  ): CoffeeProductEntity {
    const now = new Date();
    const productData: CoffeeProduct = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    return new CoffeeProductEntity(productData);
  }

  // Update Methods
  updatePricing(pricing: Pricing): CoffeeProductEntity {
    const updatedData: CoffeeProduct = {
      ...this.data,
      pricing,
      updatedAt: new Date(),
    };

    return new CoffeeProductEntity(updatedData);
  }

  updateAvailability(availability: Availability): CoffeeProductEntity {
    const updatedData: CoffeeProduct = {
      ...this.data,
      availability,
      updatedAt: new Date(),
    };

    return new CoffeeProductEntity(updatedData);
  }

  toJSON(): CoffeeProduct {
    return { ...this.data };
  }
}
