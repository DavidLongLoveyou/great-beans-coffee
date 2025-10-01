// ================================
// LOCALE & INTERNATIONALIZATION TYPES
// ================================

export type Locale =
  | 'en'
  | 'vi'
  | 'de'
  | 'ja'
  | 'fr'
  | 'it'
  | 'es'
  | 'nl'
  | 'ko';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  currency: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: NumberFormatConfig;
  isDefault?: boolean;
  isActive: boolean;
}

export interface NumberFormatConfig {
  decimal: string;
  thousands: string;
  precision: number;
  pattern: string;
}

export interface LocalizedContent<T = string> {
  [K in Locale]?: T;
}

export interface TranslationKey {
  key: string;
  namespace: string;
  defaultValue?: string;
  description?: string;
  context?: string;
}

export interface Translation {
  key: string;
  locale: Locale;
  value: string;
  namespace: string;
  isPlural?: boolean;
  pluralRules?: PluralRule[];
  variables?: TranslationVariable[];
  lastUpdated: Date;
  updatedBy: string;
  status: TranslationStatus;
}

export interface PluralRule {
  count: number | 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
  value: string;
}

export interface TranslationVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'currency';
  format?: string;
  description?: string;
}

export enum TranslationStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
  OUTDATED = 'OUTDATED',
}

export interface LocaleMetadata {
  locale: Locale;
  completeness: number; // Percentage of translated keys
  lastUpdated: Date;
  totalKeys: number;
  translatedKeys: number;
  pendingKeys: number;
  outdatedKeys: number;
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  name: string;
  decimals: number;
  symbolPosition: 'before' | 'after';
  spaceBetween: boolean;
}

export interface DateTimeConfig {
  dateFormat: string;
  timeFormat: string;
  dateTimeFormat: string;
  timezone: string;
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday
}

export interface LocaleRoute {
  locale: Locale;
  path: string;
  alternates: LocaleAlternate[];
}

export interface LocaleAlternate {
  locale: Locale;
  href: string;
  hreflang: string;
}

export interface SEOLocaleConfig {
  locale: Locale;
  hreflang: string;
  market: string; // e.g., 'US', 'DE', 'JP'
  region?: string;
  canonical?: string;
  alternates: SEOAlternate[];
}

export interface SEOAlternate {
  locale: Locale;
  href: string;
  hreflang: string;
  market: string;
}

export interface LocalizedSEO {
  title: LocalizedContent;
  description: LocalizedContent;
  keywords: LocalizedContent<string[]>;
  slug: LocalizedContent;
  canonical: LocalizedContent;
  alternates: LocaleAlternate[];
}

export interface LocalizedProduct {
  id: string;
  translations: {
    [K in Locale]?: ProductTranslation;
  };
  seo: LocalizedSEO;
}

export interface ProductTranslation {
  locale: Locale;
  name: string;
  description: string;
  shortDescription: string;
  features: string[];
  benefits: string[];
  specifications: LocalizedSpecification[];
  metaTitle: string;
  metaDescription: string;
  slug: string;
}

export interface LocalizedSpecification {
  name: string;
  value: string;
  unit?: string;
  category: string;
}

export interface LocalizedService {
  id: string;
  translations: {
    [K in Locale]?: ServiceTranslation;
  };
  seo: LocalizedSEO;
}

export interface ServiceTranslation {
  locale: Locale;
  name: string;
  description: string;
  shortDescription: string;
  features: string[];
  benefits: string[];
  process: LocalizedProcessStep[];
  metaTitle: string;
  metaDescription: string;
  slug: string;
}

export interface LocalizedProcessStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
  requirements?: string[];
}

export interface LocalizedContent {
  id: string;
  type: ContentType;
  translations: {
    [K in Locale]?: ContentTranslation;
  };
  seo: LocalizedSEO;
}

export interface ContentTranslation {
  locale: Locale;
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  slug: string;
  tags: string[];
  category: string;
}

export enum ContentType {
  BLOG_POST = 'BLOG_POST',
  MARKET_REPORT = 'MARKET_REPORT',
  ORIGIN_STORY = 'ORIGIN_STORY',
  SERVICE_PAGE = 'SERVICE_PAGE',
  LEGAL_PAGE = 'LEGAL_PAGE',
  LANDING_PAGE = 'LANDING_PAGE',
}

export interface LocaleDetectionConfig {
  strategy: DetectionStrategy[];
  fallback: Locale;
  cookieName: string;
  cookieMaxAge: number;
  headerName: string;
  queryParam: string;
  storageKey: string;
}

export enum DetectionStrategy {
  COOKIE = 'COOKIE',
  HEADER = 'HEADER',
  QUERY = 'QUERY',
  SUBDOMAIN = 'SUBDOMAIN',
  PATH = 'PATH',
  STORAGE = 'STORAGE',
  NAVIGATOR = 'NAVIGATOR',
}

export interface LocaleMiddlewareConfig {
  locales: Locale[];
  defaultLocale: Locale;
  localePrefix: 'always' | 'as-needed' | 'never';
  localeDetection: boolean;
  pathnames: Record<string, LocalizedPathname>;
  domains?: LocaleDomain[];
}

export interface LocalizedPathname {
  [K in Locale]?: string;
}

export interface LocaleDomain {
  domain: string;
  defaultLocale: Locale;
  locales?: Locale[];
}

export interface TranslationNamespace {
  name: string;
  description: string;
  keys: TranslationKey[];
  isCore: boolean; // Core namespaces are always loaded
  loadStrategy: LoadStrategy;
}

export enum LoadStrategy {
  EAGER = 'EAGER', // Load immediately
  LAZY = 'LAZY', // Load on demand
  PRELOAD = 'PRELOAD', // Preload in background
}

export interface TranslationBundle {
  locale: Locale;
  namespace: string;
  translations: Record<string, unknown>;
  version: string;
  lastModified: Date;
  size: number;
}

export interface LocaleStats {
  locale: Locale;
  totalKeys: number;
  translatedKeys: number;
  pendingKeys: number;
  outdatedKeys: number;
  completeness: number;
  lastUpdated: Date;
  contributors: string[];
}

export interface TranslationProject {
  id: string;
  name: string;
  description: string;
  sourceLocale: Locale;
  targetLocales: Locale[];
  namespaces: string[];
  status: ProjectStatus;
  deadline?: Date;
  progress: ProjectProgress;
  team: ProjectMember[];
}

export interface ProjectProgress {
  overall: number;
  byLocale: Record<Locale, number>;
  byNamespace: Record<string, number>;
}

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  locales: Locale[];
  permissions: ProjectPermission[];
}

export enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  REVIEW = 'REVIEW',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export enum ProjectRole {
  MANAGER = 'MANAGER',
  TRANSLATOR = 'TRANSLATOR',
  REVIEWER = 'REVIEWER',
  DEVELOPER = 'DEVELOPER',
}

export enum ProjectPermission {
  READ = 'READ',
  WRITE = 'WRITE',
  REVIEW = 'REVIEW',
  APPROVE = 'APPROVE',
  MANAGE = 'MANAGE',
}

export interface TranslationMemory {
  id: string;
  sourceText: string;
  targetText: string;
  sourceLocale: Locale;
  targetLocale: Locale;
  context?: string;
  domain?: string;
  quality: number; // 0-100
  lastUsed: Date;
  usageCount: number;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  translations: Record<Locale, GlossaryTranslation>;
  domain: string;
  isApproved: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface GlossaryTranslation {
  term: string;
  definition: string;
  notes?: string;
  status: TranslationStatus;
  lastUpdated: Date;
  updatedBy: string;
}

export interface LocaleValidationRule {
  field: string;
  rule: ValidationRuleType;
  params?: unknown;
  message: LocalizedContent;
}

export enum ValidationRuleType {
  REQUIRED = 'REQUIRED',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  PATTERN = 'PATTERN',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  URL = 'URL',
  DATE = 'DATE',
  NUMBER = 'NUMBER',
  CURRENCY = 'CURRENCY',
}

export interface LocaleFormConfig {
  locale: Locale;
  fields: LocaleFieldConfig[];
  validationRules: LocaleValidationRule[];
  submitButton: string;
  cancelButton: string;
  resetButton: string;
}

export interface LocaleFieldConfig {
  name: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  errorMessage?: string;
  options?: SelectOption[];
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface LocaleEmailTemplate {
  id: string;
  name: string;
  subject: LocalizedContent;
  htmlContent: LocalizedContent;
  textContent: LocalizedContent;
  variables: TemplateVariable[];
  category: string;
  isActive: boolean;
}

export interface TemplateVariable {
  name: string;
  type: VariableType;
  description: LocalizedContent;
  required: boolean;
  defaultValue?: unknown;
}

export enum VariableType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  CURRENCY = 'CURRENCY',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
}

export interface LocaleNotification {
  id: string;
  type: NotificationType;
  title: LocalizedContent;
  message: LocalizedContent;
  actions?: LocaleNotificationAction[];
  targetLocales: Locale[];
  isActive: boolean;
}

export interface LocaleNotificationAction {
  label: LocalizedContent;
  action: string;
  primary?: boolean;
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  MARKETING = 'MARKETING',
  SYSTEM = 'SYSTEM',
}
