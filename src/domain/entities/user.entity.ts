import { z } from 'zod';

// User Role Enum
export const UserRoleSchema = z.enum([
  'SUPER_ADMIN',
  'ADMIN',
  'SALES_MANAGER',
  'SALES_REP',
  'ACCOUNT_MANAGER',
  'QUALITY_MANAGER',
  'LOGISTICS_COORDINATOR',
  'CONTENT_MANAGER',
  'MARKETING_MANAGER',
  'FINANCE_MANAGER',
  'CUSTOMER_SERVICE',
  'VIEWER',
]);

// User Status Enum
export const UserStatusSchema = z.enum([
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'PENDING_VERIFICATION',
  'LOCKED',
]);

// User Department Enum
export const UserDepartmentSchema = z.enum([
  'ADMINISTRATION',
  'SALES',
  'MARKETING',
  'OPERATIONS',
  'QUALITY_CONTROL',
  'LOGISTICS',
  'FINANCE',
  'CUSTOMER_SERVICE',
  'IT',
  'MANAGEMENT',
]);

// Permission Schema
export const PermissionSchema = z.object({
  resource: z.string(), // e.g., 'coffee-products', 'rfqs', 'clients'
  actions: z.array(
    z.enum(['CREATE', 'READ', 'UPDATE', 'DELETE', 'APPROVE', 'EXPORT'])
  ),
  conditions: z.record(z.string(), z.any()).optional(), // Additional conditions
});

// User Preferences Schema
export const UserPreferencesSchema = z.object({
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
  dateFormat: z
    .enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'])
    .default('DD/MM/YYYY'),
  timeFormat: z.enum(['12h', '24h']).default('24h'),
  currency: z.enum(['USD', 'EUR', 'JPY', 'GBP']).default('USD'),
  notifications: z.object({
    email: z.boolean().default(true),
    browser: z.boolean().default(true),
    mobile: z.boolean().default(false),
    rfqUpdates: z.boolean().default(true),
    orderUpdates: z.boolean().default(true),
    systemAlerts: z.boolean().default(true),
    marketingEmails: z.boolean().default(false),
  }),
  dashboard: z.object({
    defaultView: z
      .enum(['OVERVIEW', 'RFQS', 'ORDERS', 'CLIENTS', 'ANALYTICS'])
      .default('OVERVIEW'),
    widgetPreferences: z.record(z.string(), z.any()).optional(),
  }),
});

// User Profile Schema
export const UserProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  displayName: z.string().optional(),
  avatar: z.string().url().optional(),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
  mobileNumber: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  socialLinks: z
    .object({
      linkedin: z.string().url().optional(),
      twitter: z.string().url().optional(),
      website: z.string().url().optional(),
    })
    .optional(),
  expertise: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  emergencyContact: z
    .object({
      name: z.string(),
      relationship: z.string(),
      phone: z.string(),
    })
    .optional(),
});

// User Security Schema
export const UserSecuritySchema = z.object({
  passwordHash: z.string(),
  passwordSalt: z.string(),
  lastPasswordChange: z.date(),
  passwordExpiresAt: z.date().optional(),
  mfaEnabled: z.boolean().default(false),
  mfaSecret: z.string().optional(),
  backupCodes: z.array(z.string()).optional(),
  loginAttempts: z.number().min(0).default(0),
  lockedUntil: z.date().optional(),
  lastLoginAt: z.date().optional(),
  lastLoginIP: z.string().optional(),
  sessionTokens: z
    .array(
      z.object({
        token: z.string(),
        expiresAt: z.date(),
        device: z.string().optional(),
        ipAddress: z.string().optional(),
      })
    )
    .optional(),
});

// User Activity Schema
export const UserActivitySchema = z.object({
  lastActiveAt: z.date(),
  totalLogins: z.number().min(0).default(0),
  totalRFQsHandled: z.number().min(0).default(0),
  totalOrdersProcessed: z.number().min(0).default(0),
  totalClientsManaged: z.number().min(0).default(0),
  performanceMetrics: z
    .object({
      averageResponseTime: z.number().min(0).optional(), // in hours
      customerSatisfactionScore: z.number().min(0).max(10).optional(),
      salesTargetAchievement: z.number().min(0).max(200).optional(), // percentage
      qualityScore: z.number().min(0).max(100).optional(),
    })
    .optional(),
});

// User Employment Schema
export const UserEmploymentSchema = z.object({
  employeeId: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().optional(),
  jobTitle: z.string(),
  department: UserDepartmentSchema,
  manager: z.string().uuid().optional(),
  directReports: z.array(z.string().uuid()).optional(),
  workLocation: z.enum(['OFFICE', 'REMOTE', 'HYBRID']).default('OFFICE'),
  contractType: z
    .enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'])
    .default('FULL_TIME'),
  salaryGrade: z.string().optional(),
  costCenter: z.string().optional(),
});

// Main User Schema
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  username: z.string().min(3).optional(),

  // Core user information
  profile: UserProfileSchema,
  role: UserRoleSchema,
  status: UserStatusSchema,
  permissions: z.array(PermissionSchema).optional(),

  // User preferences and settings
  preferences: UserPreferencesSchema,

  // Security information
  security: UserSecuritySchema,

  // Activity tracking
  activity: UserActivitySchema,

  // Employment information
  employment: UserEmploymentSchema,

  // Account verification
  emailVerified: z.boolean().default(false),
  emailVerificationToken: z.string().optional(),
  emailVerificationExpiresAt: z.date().optional(),

  // Password reset
  passwordResetToken: z.string().optional(),
  passwordResetExpiresAt: z.date().optional(),

  // Audit fields
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string().uuid().optional(),
  updatedBy: z.string().uuid(),
});

// Type exports
export type UserRole = z.infer<typeof UserRoleSchema>;
export type UserStatus = z.infer<typeof UserStatusSchema>;
export type UserDepartment = z.infer<typeof UserDepartmentSchema>;
export type Permission = z.infer<typeof PermissionSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserSecurity = z.infer<typeof UserSecuritySchema>;
export type UserActivity = z.infer<typeof UserActivitySchema>;
export type UserEmployment = z.infer<typeof UserEmploymentSchema>;
export type User = z.infer<typeof UserSchema>;

// User Entity Class
export class UserEntity {
  constructor(private readonly data: User) {
    UserEntity.validate(data);
  }

  // Getters
  get id(): string {
    return this.data.id;
  }
  get email(): string {
    return this.data.email;
  }
  get role(): UserRole {
    return this.data.role;
  }
  get status(): UserStatus {
    return this.data.status;
  }
  get profile(): UserProfile {
    return this.data.profile;
  }
  get preferences(): UserPreferences {
    return this.data.preferences;
  }
  get activity(): UserActivity {
    return this.data.activity;
  }
  get employment(): UserEmployment {
    return this.data.employment;
  }
  get createdAt(): Date {
    return this.data.createdAt;
  }
  get updatedAt(): Date {
    return this.data.updatedAt;
  }

  // Business logic methods
  isActive(): boolean {
    return this.data.status === 'ACTIVE';
  }

  isAdmin(): boolean {
    return ['SUPER_ADMIN', 'ADMIN'].includes(this.data.role);
  }

  isSalesRole(): boolean {
    return ['SALES_MANAGER', 'SALES_REP', 'ACCOUNT_MANAGER'].includes(
      this.data.role
    );
  }

  canManageRFQs(): boolean {
    return this.isSalesRole() || this.isAdmin();
  }

  canManageClients(): boolean {
    return (
      this.isSalesRole() ||
      this.isAdmin() ||
      this.data.role === 'CUSTOMER_SERVICE'
    );
  }

  canManageProducts(): boolean {
    return (
      this.isAdmin() ||
      ['SALES_MANAGER', 'QUALITY_MANAGER'].includes(this.data.role)
    );
  }

  canManageContent(): boolean {
    return (
      this.isAdmin() ||
      ['CONTENT_MANAGER', 'MARKETING_MANAGER'].includes(this.data.role)
    );
  }

  hasPermission(resource: string, action: string): boolean {
    if (this.isAdmin()) return true;

    return (
      this.data.permissions?.some(
        permission =>
          permission.resource === resource &&
          permission.actions.includes(action as any)
      ) || false
    );
  }

  isAccountLocked(): boolean {
    return (
      this.data.status === 'LOCKED' ||
      Boolean(this.data.security.lockedUntil &&
        this.data.security.lockedUntil > new Date())
    );
  }

  needsPasswordChange(): boolean {
    return this.data.security.passwordExpiresAt
      ? this.data.security.passwordExpiresAt < new Date()
      : false;
  }

  isMFAEnabled(): boolean {
    return this.data.security.mfaEnabled;
  }

  getFullName(): string {
    return `${this.data.profile.firstName} ${this.data.profile.lastName}`;
  }

  getDisplayName(): string {
    return this.data.profile.displayName || this.getFullName();
  }

  getDaysSinceLastLogin(): number {
    if (!this.data.security.lastLoginAt) return Infinity;
    const now = new Date();
    const lastLogin = this.data.security.lastLoginAt;
    return Math.floor(
      (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  getPerformanceScore(): number {
    const metrics = this.data.activity.performanceMetrics;
    if (!metrics) return 0;

    let score = 0;
    let factors = 0;

    if (metrics.customerSatisfactionScore !== undefined) {
      score += (metrics.customerSatisfactionScore / 10) * 100;
      factors++;
    }

    if (metrics.salesTargetAchievement !== undefined) {
      score += Math.min(metrics.salesTargetAchievement, 100);
      factors++;
    }

    if (metrics.qualityScore !== undefined) {
      score += metrics.qualityScore;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  // Update methods
  updateProfile(profileUpdates: Partial<UserProfile>): UserEntity {
    return new UserEntity({
      ...this.data,
      profile: { ...this.data.profile, ...profileUpdates },
      updatedAt: new Date(),
    });
  }

  updatePreferences(preferencesUpdates: Partial<UserPreferences>): UserEntity {
    return new UserEntity({
      ...this.data,
      preferences: { ...this.data.preferences, ...preferencesUpdates },
      updatedAt: new Date(),
    });
  }

  updateStatus(status: UserStatus, updatedBy: string): UserEntity {
    return new UserEntity({
      ...this.data,
      status,
      updatedAt: new Date(),
      updatedBy,
    });
  }

  updateRole(role: UserRole, updatedBy: string): UserEntity {
    return new UserEntity({
      ...this.data,
      role,
      updatedAt: new Date(),
      updatedBy,
    });
  }

  recordLogin(ipAddress?: string): UserEntity {
    return new UserEntity({
      ...this.data,
      security: {
        ...this.data.security,
        lastLoginAt: new Date(),
        lastLoginIP: ipAddress,
        loginAttempts: 0, // Reset failed attempts on successful login
      },
      activity: {
        ...this.data.activity,
        lastActiveAt: new Date(),
        totalLogins: this.data.activity.totalLogins + 1,
      },
      updatedAt: new Date(),
    });
  }

  incrementFailedLogin(): UserEntity {
    const newAttempts = this.data.security.loginAttempts + 1;
    const shouldLock = newAttempts >= 5;

    return new UserEntity({
      ...this.data,
      status: shouldLock ? 'LOCKED' : this.data.status,
      security: {
        ...this.data.security,
        loginAttempts: newAttempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + 30 * 60 * 1000)
          : undefined, // 30 minutes
      },
      updatedAt: new Date(),
    });
  }

  // Static methods
  static validate(data: unknown): User {
    return UserSchema.parse(data);
  }

  static isValid(data: unknown): boolean {
    try {
      UserSchema.parse(data);
      return true;
    } catch {
      return false;
    }
  }

  static create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): UserEntity {
    const now = new Date();
    const userData: User = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    return new UserEntity(userData);
  }

  static generateUsername(firstName: string, lastName: string): string {
    const base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    return base.replace(/[^a-z0-9.]/g, '');
  }

  toJSON(): User {
    return { ...this.data };
  }

  // Security-safe version without sensitive data
  toSafeJSON(): Omit<User, 'security'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { security: _security, ...safeData } = this.data;
    return safeData;
  }
}
