// User DTOs for application layer communication

export interface UserDto {
  id: string;
  email: string;
  username?: string;
  role: 'ADMIN' | 'SALES_MANAGER' | 'SALES_REP' | 'CONTENT_MANAGER' | 'VIEWER' | 'CLIENT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  
  // Personal Information
  profile: {
    firstName: string;
    lastName: string;
    displayName?: string;
    avatar?: string;
    phone?: string;
    timezone?: string;
    language: string;
    country?: string;
  };
  
  // Company Information (for clients)
  company?: {
    name: string;
    type: 'IMPORTER' | 'ROASTER' | 'DISTRIBUTOR' | 'RETAILER' | 'CAFE_CHAIN' | 'OTHER';
    website?: string;
    address: {
      street: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
    };
    businessRegistration?: string;
    taxId?: string;
    annualVolume?: number;
    establishedYear?: number;
    employeeCount?: number;
    description?: string;
  };
  
  // Permissions & Access
  permissions: {
    canViewRfqs: boolean;
    canCreateRfqs: boolean;
    canEditRfqs: boolean;
    canDeleteRfqs: boolean;
    canViewQuotes: boolean;
    canCreateQuotes: boolean;
    canEditQuotes: boolean;
    canDeleteQuotes: boolean;
    canViewProducts: boolean;
    canEditProducts: boolean;
    canViewContent: boolean;
    canEditContent: boolean;
    canViewAnalytics: boolean;
    canManageUsers: boolean;
    canAccessAdmin: boolean;
  };
  
  // Preferences
  preferences: {
    emailNotifications: {
      newRfq: boolean;
      quoteUpdates: boolean;
      marketReports: boolean;
      productUpdates: boolean;
      systemUpdates: boolean;
    };
    dashboardLayout?: Record<string, any>;
    defaultCurrency: string;
    defaultLanguage: string;
    timeFormat: '12h' | '24h';
    dateFormat: string;
  };
  
  // Activity Tracking
  lastLoginAt?: Date;
  lastActiveAt?: Date;
  loginCount: number;
  
  // Security
  emailVerifiedAt?: Date;
  phoneVerifiedAt?: Date;
  twoFactorEnabled: boolean;
  passwordChangedAt?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  
  // Client-specific fields
  clientMetadata?: {
    leadSource: 'WEBSITE' | 'TRADE_SHOW' | 'REFERRAL' | 'COLD_OUTREACH' | 'PARTNER' | 'OTHER';
    assignedSalesRep?: string;
    accountManager?: string;
    creditLimit?: number;
    paymentTerms?: string;
    preferredIncoterms?: string;
    shippingAddresses?: Array<{
      id: string;
      name: string;
      address: NonNullable<UserDto['company']>['address'];
      isDefault: boolean;
    }>;
    tags?: string[];
    notes?: string;
    lastOrderDate?: Date;
    totalOrderValue?: number;
    averageOrderValue?: number;
    orderCount: number;
  };
}

export interface CreateUserDto {
  email: string;
  username?: string;
  role: UserDto['role'];
  profile: UserDto['profile'];
  company?: UserDto['company'];
  permissions?: Partial<UserDto['permissions']>;
  preferences?: Partial<UserDto['preferences']>;
  clientMetadata?: UserDto['clientMetadata'];
  password?: string; // For internal users
  sendWelcomeEmail?: boolean;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: string;
  status?: UserDto['status'];
  updatedBy: string;
}

export interface UserSearchDto {
  query?: string;
  role?: UserDto['role'][];
  status?: UserDto['status'][];
  companyType?: string[];
  country?: string[];
  assignedSalesRep?: string[];
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'company.name' | 'profile.lastName';
  sortOrder?: 'asc' | 'desc';
}

export interface UserListDto {
  users: UserDto[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface UserStatsDto {
  totalUsers: number;
  byRole: Record<UserDto['role'], number>;
  byStatus: Record<UserDto['status'], number>;
  byCompanyType: Record<string, number>;
  activeUsers: number;
  newUsersThisMonth: number;
  topCountries: Array<{
    country: string;
    count: number;
  }>;
}

export interface UserActivityDto {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface UserSessionDto {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date;
}

export interface PasswordResetDto {
  email: string;
  token: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

export interface EmailVerificationDto {
  email: string;
  token: string;
  expiresAt: Date;
  verifiedAt?: Date;
  createdAt: Date;
}