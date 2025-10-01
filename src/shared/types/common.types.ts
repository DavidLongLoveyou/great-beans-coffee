// ================================
// COMMON TYPES
// ================================

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditableEntity extends BaseEntity {
  createdBy: string;
  updatedBy: string;
}

export interface SoftDeletableEntity extends AuditableEntity {
  deletedAt?: Date;
  deletedBy?: string;
  isDeleted: boolean;
}

export interface LocalizedEntity {
  locale: string;
}

export interface SEOEntity {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  slug: string;
}

export interface MediaEntity {
  url: string;
  alt?: string;
  caption?: string;
  type: MediaType;
  size?: number;
  dimensions?: Dimensions;
}

export interface Dimensions {
  width: number;
  height: number;
}

export enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  AUDIO = 'AUDIO',
}

export interface Address {
  street?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  coordinates?: Coordinates;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ContactInfo {
  email: string;
  phone?: string;
  website?: string;
  socialMedia?: SocialMediaLinks;
}

export interface SocialMediaLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface NumberRange {
  min: number;
  max: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface FilterParams {
  search?: string;
  filters?: Record<string, unknown>;
  dateRange?: DateRange;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  meta?: ResponseMeta;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ResponseMeta {
  timestamp: Date;
  requestId: string;
  version: string;
  pagination?: PaginationResult<unknown>['pagination'];
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

export interface TreeNode<T = unknown> {
  id: string;
  label: string;
  value: T;
  children?: TreeNode<T>[];
  parent?: string;
  level: number;
  expanded?: boolean;
  selected?: boolean;
}

export interface FileUpload {
  file: File;
  progress: number;
  status: UploadStatus;
  error?: string;
  url?: string;
}

export enum UploadStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actions?: NotificationAction[];
}

export enum NotificationType {
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
}

export interface NotificationAction {
  label: string;
  action: string;
  primary?: boolean;
}

export interface Theme {
  name: string;
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  breakpoints: Breakpoints;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Typography {
  fontFamily: string;
  fontSize: FontSizes;
  fontWeight: FontWeights;
  lineHeight: LineHeights;
}

export interface FontSizes {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface FontWeights {
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
}

export interface LineHeights {
  tight: number;
  normal: number;
  relaxed: number;
}

export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: Date;
}

export interface AsyncState<T> extends LoadingState {
  data?: T;
}

export interface FormState<T = Record<string, unknown>> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

export interface TableColumn<T = Record<string, unknown>> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface TableState<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  pagination: PaginationParams;
  filters: FilterParams;
  selection: string[];
  loading: boolean;
}

export interface ModalState {
  isOpen: boolean;
  title?: string;
  content?: React.ReactNode;
  size?: ModalSize;
  closable?: boolean;
}

export enum ModalSize {
  SM = 'SM',
  MD = 'MD',
  LG = 'LG',
  XL = 'XL',
  FULL = 'FULL',
}

export interface ToastState {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: MenuItem[];
  badge?: string;
  disabled?: boolean;
  external?: boolean;
}

export interface UserSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    avatar?: string;
  };
  token: string;
  expiresAt: Date;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface SystemHealth {
  status: HealthStatus;
  services: ServiceHealth[];
  timestamp: Date;
  uptime: number;
}

export enum HealthStatus {
  HEALTHY = 'HEALTHY',
  DEGRADED = 'DEGRADED',
  UNHEALTHY = 'UNHEALTHY',
}

export interface ServiceHealth {
  name: string;
  status: HealthStatus;
  responseTime?: number;
  lastCheck: Date;
  error?: string;
}

export interface Configuration {
  key: string;
  value: unknown;
  type: ConfigurationType;
  description?: string;
  category: string;
  isSecret: boolean;
  updatedAt: Date;
  updatedBy: string;
}

export enum ConfigurationType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  ARRAY = 'ARRAY',
}

export interface CacheEntry<T = unknown> {
  key: string;
  value: T;
  expiresAt: Date;
  tags?: string[];
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: TemplateVariable[];
  category: string;
  isActive: boolean;
}

export interface TemplateVariable {
  name: string;
  type: VariableType;
  description: string;
  required: boolean;
  defaultValue?: unknown;
}

export enum VariableType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  OBJECT = 'OBJECT',
  ARRAY = 'ARRAY',
}

export interface WebhookEvent {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  timestamp: Date;
  source: string;
  processed: boolean;
  attempts: number;
  lastAttempt?: Date;
  error?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  config: Record<string, unknown>;
  isActive: boolean;
  lastSync?: Date;
  syncStatus?: SyncStatus;
  error?: string;
}

export enum IntegrationType {
  CRM = 'CRM',
  ERP = 'ERP',
  PAYMENT = 'PAYMENT',
  SHIPPING = 'SHIPPING',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  ANALYTICS = 'ANALYTICS',
}

export enum SyncStatus {
  PENDING = 'PENDING',
  SYNCING = 'SYNCING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
