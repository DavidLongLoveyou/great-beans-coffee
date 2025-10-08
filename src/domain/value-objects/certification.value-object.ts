import { z } from 'zod';

import {
  MultilingualContentSchema,
  type MultilingualContent,
} from '../entities/coffee-product.entity';

// Certification Authority Schema
export const CertificationAuthoritySchema = z.object({
  name: z.string(),
  code: z.string(),
  website: z.string().url(),
  country: z.string(),
  accreditation: z.string().optional(),
});

// Certification Level Schema
export const CertificationLevelSchema = z.enum([
  'BASIC',
  'INTERMEDIATE',
  'ADVANCED',
  'PREMIUM',
]);

// Certification Status Schema
export const CertificationStatusSchema = z.enum([
  'ACTIVE',
  'PENDING',
  'EXPIRED',
  'SUSPENDED',
  'REVOKED',
]);

// Certification Scope Schema
export const CertificationScopeSchema = z.object({
  products: z.array(z.string()), // Product types covered
  processes: z.array(z.string()), // Processes covered
  facilities: z.array(z.string()), // Facility types covered
  geographicScope: z.array(z.string()), // Geographic coverage
});

// Certification Value Object Schema
export const CertificationValueObjectSchema = z.object({
  // Basic Information
  type: z.string(), // e.g., 'ORGANIC', 'FAIR_TRADE', 'RAINFOREST_ALLIANCE'
  name: MultilingualContentSchema,
  description: MultilingualContentSchema,
  shortDescription: MultilingualContentSchema.optional(),

  // Certification Details
  certificateNumber: z.string(),
  authority: CertificationAuthoritySchema,
  level: CertificationLevelSchema,
  status: CertificationStatusSchema,
  scope: CertificationScopeSchema,

  // Validity Information
  issuedDate: z.date(),
  validFrom: z.date(),
  validUntil: z.date(),
  renewalRequired: z.boolean().default(true),
  renewalPeriodMonths: z.number().positive(),

  // Documentation
  certificateUrl: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  verificationUrl: z.string().url().optional(),

  // Standards & Requirements
  standards: z.array(z.string()), // Standards met (e.g., ISO 14001, USDA Organic)
  requirements: z.array(MultilingualContentSchema), // Key requirements
  benefits: z.array(MultilingualContentSchema), // Benefits for buyers

  // Market Information
  recognizedMarkets: z.array(z.string()), // Countries/regions where recognized
  marketPremium: z.number().min(0).optional(), // Typical premium percentage
  marketDemand: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']).optional(),

  // Compliance & Auditing
  lastAuditDate: z.date().optional(),
  nextAuditDate: z.date().optional(),
  auditFrequencyMonths: z.number().positive(),
  complianceScore: z.number().min(0).max(100).optional(),

  // Additional Metadata
  tags: z.array(z.string()).optional(),
  priority: z.number().min(1).max(10).default(5), // Display priority
  isVisible: z.boolean().default(true),
});

// Type Exports
export type CertificationAuthority = z.infer<
  typeof CertificationAuthoritySchema
>;
export type CertificationLevel = z.infer<typeof CertificationLevelSchema>;
export type CertificationStatus = z.infer<typeof CertificationStatusSchema>;
export type CertificationScope = z.infer<typeof CertificationScopeSchema>;
export type CertificationValueObject = z.infer<
  typeof CertificationValueObjectSchema
>;

// Certification Value Object Class
export class CertificationVO {
  constructor(private readonly data: CertificationValueObject) {
    CertificationValueObjectSchema.parse(data);
  }

  // Getters
  get type(): string {
    return this.data.type;
  }

  get name(): MultilingualContent {
    return this.data.name;
  }

  get certificateNumber(): string {
    return this.data.certificateNumber;
  }

  get authority(): CertificationAuthority {
    return this.data.authority;
  }

  get status(): CertificationStatus {
    return this.data.status;
  }

  get validFrom(): Date {
    return this.data.validFrom;
  }

  get validUntil(): Date {
    return this.data.validUntil;
  }

  get logoUrl(): string | undefined {
    return this.data.logoUrl;
  }

  get recognizedMarkets(): string[] {
    return this.data.recognizedMarkets;
  }

  get marketPremium(): number | undefined {
    return this.data.marketPremium;
  }

  get priority(): number {
    return this.data.priority;
  }

  get isVisible(): boolean {
    return this.data.isVisible;
  }

  // Business Logic Methods
  isValid(): boolean {
    const now = new Date();
    return (
      this.data.status === 'ACTIVE' &&
      this.data.validFrom <= now &&
      this.data.validUntil >= now
    );
  }

  isExpiringSoon(daysThreshold = 90): boolean {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);

    return this.data.validUntil <= thresholdDate;
  }

  getDaysUntilExpiry(): number {
    const now = new Date();
    const diffTime = this.data.validUntil.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isRecognizedInMarket(market: string): boolean {
    return (
      this.data.recognizedMarkets.includes(market) ||
      this.data.recognizedMarkets.includes('GLOBAL')
    );
  }

  getLocalizedName(locale: string): string {
    const localeKey = locale.split('-')[0] as keyof MultilingualContent;
    return this.data.name[localeKey] || this.data.name.en;
  }

  getLocalizedDescription(locale: string): string {
    const localeKey = locale.split('-')[0] as keyof MultilingualContent;
    return this.data.description[localeKey] || this.data.description.en;
  }

  getLocalizedBenefits(locale: string): string[] {
    const localeKey = locale.split('-')[0] as keyof MultilingualContent;
    return this.data.benefits.map(benefit => benefit[localeKey] || benefit.en);
  }

  getLocalizedRequirements(locale: string): string[] {
    const localeKey = locale.split('-')[0] as keyof MultilingualContent;
    return this.data.requirements.map(
      requirement => requirement[localeKey] || requirement.en
    );
  }

  needsRenewal(): boolean {
    if (!this.data.renewalRequired) return false;

    const now = new Date();
    const renewalDate = new Date(this.data.validUntil);
    renewalDate.setMonth(renewalDate.getMonth() - 3); // 3 months before expiry

    return now >= renewalDate;
  }

  getComplianceLevel(): 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'UNKNOWN' {
    if (!this.data.complianceScore) return 'UNKNOWN';

    if (this.data.complianceScore >= 95) return 'EXCELLENT';
    if (this.data.complianceScore >= 85) return 'GOOD';
    if (this.data.complianceScore >= 70) return 'FAIR';
    return 'POOR';
  }

  // Validation Methods
  static validate(data: unknown): CertificationValueObject {
    return CertificationValueObjectSchema.parse(data);
  }

  static isValid(data: unknown): boolean {
    try {
      CertificationValueObjectSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  // Factory Methods
  static create(data: CertificationValueObject): CertificationVO {
    return new CertificationVO(data);
  }

  // Comparison Methods
  equals(other: CertificationVO): boolean {
    return (
      this.data.certificateNumber === other.data.certificateNumber &&
      this.data.authority.code === other.data.authority.code
    );
  }

  // Serialization
  toJSON(): CertificationValueObject {
    return { ...this.data };
  }

  // Display helpers
  getDisplayBadge(): {
    text: string;
    color: 'green' | 'yellow' | 'red' | 'gray';
    icon?: string;
  } {
    if (!this.isValid()) {
      return {
        text: 'Expired',
        color: 'red',
        icon: 'alert-circle',
      };
    }

    if (this.isExpiringSoon()) {
      return {
        text: 'Expiring Soon',
        color: 'yellow',
        icon: 'clock',
      };
    }

    return {
      text: 'Valid',
      color: 'green',
      icon: 'check-circle',
    };
  }
}

// Predefined Certification Templates
export const CERTIFICATION_TEMPLATES = {
  ORGANIC: {
    type: 'ORGANIC',
    name: {
      en: 'Organic Certification',
      de: 'Bio-Zertifizierung',
      ja: 'オーガニック認証',
      fr: 'Certification Biologique',
      it: 'Certificazione Biologica',
      es: 'Certificación Orgánica',
      nl: 'Biologische Certificering',
      ko: '유기농 인증',
    },
    description: {
      en: 'Certified organic coffee grown without synthetic pesticides, herbicides, or fertilizers',
      de: 'Zertifizierter Bio-Kaffee, angebaut ohne synthetische Pestizide, Herbizide oder Düngemittel',
      ja: '合成農薬、除草剤、肥料を使用せずに栽培された認定オーガニックコーヒー',
      fr: 'Café biologique certifié cultivé sans pesticides, herbicides ou engrais synthétiques',
      it: 'Caffè biologico certificato coltivato senza pesticidi, erbicidi o fertilizzanti sintetici',
      es: 'Café orgánico certificado cultivado sin pesticidas, herbicidas o fertilizantes sintéticos',
      nl: 'Gecertificeerde biologische koffie geteeld zonder synthetische pesticiden, herbiciden of meststoffen',
      ko: '합성 살충제, 제초제 또는 비료 없이 재배된 인증 유기농 커피',
    },
    recognizedMarkets: ['US', 'EU', 'JP', 'CA', 'AU', 'GLOBAL'],
    marketPremium: 15,
    marketDemand: 'HIGH' as const,
  },
  FAIR_TRADE: {
    type: 'FAIR_TRADE',
    name: {
      en: 'Fair Trade Certified',
      de: 'Fairtrade-Zertifiziert',
      ja: 'フェアトレード認証',
      fr: 'Certifié Commerce Équitable',
      it: 'Certificato Commercio Equo',
      es: 'Certificado Comercio Justo',
      nl: 'Fairtrade Gecertificeerd',
      ko: '공정무역 인증',
    },
    description: {
      en: 'Ensures fair prices and working conditions for coffee farmers and workers',
      de: 'Gewährleistet faire Preise und Arbeitsbedingungen für Kaffeebauern und -arbeiter',
      ja: 'コーヒー農家と労働者の公正な価格と労働条件を保証',
      fr: 'Garantit des prix équitables et des conditions de travail pour les producteurs et travailleurs de café',
      it: 'Garantisce prezzi equi e condizioni di lavoro per i coltivatori e lavoratori del caffè',
      es: 'Garantiza precios justos y condiciones laborales para los productores y trabajadores del café',
      nl: 'Zorgt voor eerlijke prijzen en arbeidsomstandigheden voor koffieboeren en -werkers',
      ko: '커피 농부와 노동자를 위한 공정한 가격과 근무 조건을 보장',
    },
    recognizedMarkets: ['US', 'EU', 'CA', 'AU', 'GLOBAL'],
    marketPremium: 12,
    marketDemand: 'HIGH' as const,
  },
  RAINFOREST_ALLIANCE: {
    type: 'RAINFOREST_ALLIANCE',
    name: {
      en: 'Rainforest Alliance Certified',
      de: 'Rainforest Alliance Zertifiziert',
      ja: 'レインフォレスト・アライアンス認証',
      fr: 'Certifié Rainforest Alliance',
      it: 'Certificato Rainforest Alliance',
      es: 'Certificado Rainforest Alliance',
      nl: 'Rainforest Alliance Gecertificeerd',
      ko: '레인포레스트 얼라이언스 인증',
    },
    description: {
      en: 'Promotes sustainable farming practices that protect biodiversity and improve livelihoods',
      de: 'Fördert nachhaltige Anbaumethoden, die die Biodiversität schützen und Lebensgrundlagen verbessern',
      ja: '生物多様性を保護し、生活を改善する持続可能な農業慣行を促進',
      fr: 'Promeut des pratiques agricoles durables qui protègent la biodiversité et améliorent les moyens de subsistance',
      it: 'Promuove pratiche agricole sostenibili che proteggono la biodiversità e migliorano i mezzi di sussistenza',
      es: 'Promueve prácticas agrícolas sostenibles que protegen la biodiversidad y mejoran los medios de vida',
      nl: 'Bevordert duurzame landbouwpraktijken die biodiversiteit beschermen en levensomstandigheden verbeteren',
      ko: '생물다양성을 보호하고 생계를 개선하는 지속가능한 농업 관행을 촉진',
    },
    recognizedMarkets: ['US', 'EU', 'JP', 'CA', 'AU', 'GLOBAL'],
    marketPremium: 8,
    marketDemand: 'MEDIUM' as const,
  },
} as const;
