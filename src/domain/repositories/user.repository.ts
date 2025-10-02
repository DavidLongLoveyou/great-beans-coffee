import {
  UserEntity,
  type User,
  type UserRole,
  type UserStatus,
  type UserDepartment,
  type Permission,
  type UserActivity,
} from '../entities/user.entity';

// Search and filter criteria
export interface UserSearchCriteria {
  // Basic filters
  role?: UserRole | UserRole[];
  status?: UserStatus | UserStatus[];
  department?: UserDepartment | UserDepartment[];

  // Employment filters
  isActive?: boolean;
  isVerified?: boolean;
  hasCompletedOnboarding?: boolean;

  // Date filters
  createdAfter?: Date;
  createdBefore?: Date;
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;

  // Performance filters
  minPerformanceScore?: number;
  maxPerformanceScore?: number;

  // Location filters
  country?: string;
  city?: string;
  timezone?: string;

  // Text search
  searchTerm?: string; // Search in name, email, username

  // Pagination and sorting
  page?: number;
  limit?: number;
  sortBy?:
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'createdAt'
    | 'lastLoginAt'
    | 'performanceScore';
  sortOrder?: 'asc' | 'desc';
}

export interface UserSearchResult {
  users: UserEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface UserAnalytics {
  totalUsers: number;
  usersByRole: Record<UserRole, number>;
  usersByStatus: Record<UserStatus, number>;
  usersByDepartment: Record<UserDepartment, number>;
  activeUsers: number;
  newUsersThisMonth: number;
  averagePerformanceScore: number;
  loginFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
    inactive: number;
  };
  topPerformers: Array<{ userId: string; name: string; score: number }>;
}

export interface UserActivitySummary {
  userId: string;
  totalLogins: number;
  lastLoginAt?: Date;
  averageSessionDuration: number;
  totalActions: number;
  recentActions: Array<{
    action: string;
    timestamp: Date;
    details?: any;
  }>;
  performanceMetrics: {
    tasksCompleted: number;
    averageTaskTime: number;
    qualityScore: number;
  };
}

// Repository interface
export interface IUserRepository {
  // Basic CRUD operations
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByUsername(username: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  create(
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<UserEntity>;
  update(id: string, updates: Partial<User>): Promise<UserEntity>;
  delete(id: string): Promise<void>;

  // Advanced search and filtering
  search(criteria: UserSearchCriteria): Promise<UserSearchResult>;
  findByRole(role: UserRole): Promise<UserEntity[]>;
  findByStatus(status: UserStatus): Promise<UserEntity[]>;
  findByDepartment(department: UserDepartment): Promise<UserEntity[]>;

  // Authentication and security
  findByCredentials(
    email: string,
    passwordHash: string
  ): Promise<UserEntity | null>;
  updatePassword(id: string, newPasswordHash: string): Promise<UserEntity>;
  updateLastLogin(
    id: string,
    loginTime: Date,
    ipAddress?: string
  ): Promise<UserEntity>;
  findByResetToken(token: string): Promise<UserEntity | null>;
  setPasswordResetToken(
    id: string,
    token: string,
    expiresAt: Date
  ): Promise<UserEntity>;
  clearPasswordResetToken(id: string): Promise<UserEntity>;

  // Email verification
  findByVerificationToken(token: string): Promise<UserEntity | null>;
  setEmailVerificationToken(id: string, token: string): Promise<UserEntity>;
  verifyEmail(id: string): Promise<UserEntity>;

  // Two-factor authentication
  enableTwoFactor(
    id: string,
    secret: string,
    backupCodes: string[]
  ): Promise<UserEntity>;
  disableTwoFactor(id: string): Promise<UserEntity>;
  updateTwoFactorBackupCodes(
    id: string,
    backupCodes: string[]
  ): Promise<UserEntity>;

  // Profile management
  updateProfile(id: string, profile: User['profile']): Promise<UserEntity>;
  updatePreferences(
    id: string,
    preferences: User['preferences']
  ): Promise<UserEntity>;
  updateAvatar(id: string, avatarUrl: string): Promise<UserEntity>;

  // Employment and role management
  updateEmployment(
    id: string,
    employment: User['employment']
  ): Promise<UserEntity>;
  updateRole(
    id: string,
    role: UserRole,
    updatedBy: string
  ): Promise<UserEntity>;
  updateDepartment(
    id: string,
    department: UserDepartment,
    updatedBy: string
  ): Promise<UserEntity>;
  updateManager(id: string, managerId: string): Promise<UserEntity>;

  // Permission management
  addPermission(
    id: string,
    permission: Permission
  ): Promise<UserEntity>;
  removePermission(id: string, permissionId: string): Promise<UserEntity>;
  updatePermissions(
    id: string,
    permissions: Permission[]
  ): Promise<UserEntity>;
  findByPermission(permission: string): Promise<UserEntity[]>;
  hasPermission(id: string, permission: string): Promise<boolean>;

  // Status management
  activate(id: string, activatedBy: string): Promise<UserEntity>;
  deactivate(
    id: string,
    deactivatedBy: string,
    reason?: string
  ): Promise<UserEntity>;
  suspend(
    id: string,
    suspendedBy: string,
    reason: string,
    until?: Date
  ): Promise<UserEntity>;
  unsuspend(id: string, unsuspendedBy: string): Promise<UserEntity>;

  // Activity tracking
  recordActivity(
    id: string,
    activity: Omit<UserActivity, 'id' | 'timestamp'>
  ): Promise<UserEntity>;
  getActivityHistory(id: string, limit?: number): Promise<UserActivity[]>;
  getActivitySummary(id: string): Promise<UserActivitySummary>;
  updateLastActivity(id: string): Promise<UserEntity>;

  // Performance management
  updatePerformanceScore(
    id: string,
    score: number,
    evaluatedBy: string,
    notes?: string
  ): Promise<UserEntity>;
  getPerformanceHistory(id: string): Promise<
    Array<{
      score: number;
      evaluatedBy: string;
      evaluatedAt: Date;
      notes?: string;
    }>
  >;
  findTopPerformers(limit?: number): Promise<UserEntity[]>;
  findUnderperformers(threshold?: number): Promise<UserEntity[]>;

  // Team and hierarchy
  findByManager(managerId: string): Promise<UserEntity[]>;
  findTeamMembers(userId: string): Promise<UserEntity[]>;
  getOrganizationChart(): Promise<any>;
  findPeers(userId: string): Promise<UserEntity[]>;

  // Session management
  createSession(userId: string, sessionData: any): Promise<string>;
  findSession(sessionId: string): Promise<any>;
  updateSession(sessionId: string, data: any): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  deleteAllUserSessions(userId: string): Promise<void>;
  findActiveSessions(userId: string): Promise<any[]>;

  // Notification preferences
  updateNotificationPreferences(
    id: string,
    preferences: any
  ): Promise<UserEntity>;
  findUsersForNotification(type: string, criteria?: any): Promise<UserEntity[]>;

  // Onboarding and training
  updateOnboardingProgress(
    id: string,
    step: string,
    completed: boolean
  ): Promise<UserEntity>;
  getOnboardingStatus(
    id: string
  ): Promise<{ totalSteps: number; completedSteps: number; progress: number }>;
  findUsersNeedingOnboarding(): Promise<UserEntity[]>;

  // Bulk operations
  updateMany(
    updates: Array<{ id: string; data: Partial<User> }>
  ): Promise<UserEntity[]>;
  deleteMany(ids: string[]): Promise<void>;
  bulkUpdateRole(
    ids: string[],
    role: UserRole,
    updatedBy: string
  ): Promise<UserEntity[]>;
  bulkUpdateStatus(
    ids: string[],
    status: UserStatus,
    updatedBy: string
  ): Promise<UserEntity[]>;

  // Analytics and reporting
  getAnalytics(dateRange?: { start: Date; end: Date }): Promise<UserAnalytics>;
  getUserGrowthTrends(): Promise<
    Array<{ month: string; newUsers: number; activeUsers: number }>
  >;
  getDepartmentStatistics(): Promise<
    Record<
      UserDepartment,
      { total: number; active: number; avgPerformance: number }
    >
  >;
  getLoginStatistics(): Promise<{
    dailyLogins: number;
    weeklyLogins: number;
    monthlyLogins: number;
  }>;

  // Security and compliance
  findInactiveUsers(daysSinceLastLogin: number): Promise<UserEntity[]>;
  findUsersWithExpiredPasswords(daysSinceChange: number): Promise<UserEntity[]>;
  findUsersWithoutTwoFactor(): Promise<UserEntity[]>;
  auditUserAccess(userId: string): Promise<any>;

  // Data export and import
  exportToCSV(criteria?: UserSearchCriteria): Promise<string>;
  exportUserData(userId: string): Promise<any>;
  importUsers(userData: any[]): Promise<{ success: number; errors: string[] }>;

  // GDPR and privacy
  anonymizeUser(id: string): Promise<void>;
  exportUserData(id: string): Promise<any>;
  deleteUserData(id: string, keepAuditTrail?: boolean): Promise<void>;

  // Integration hooks
  syncWithHR(userId: string): Promise<UserEntity>;
  syncWithDirectory(userId: string): Promise<UserEntity>;

  // Audit and history
  getHistory(
    id: string
  ): Promise<
    Array<{ timestamp: Date; changes: Partial<User>; changedBy: string }>
  >;
  getLoginHistory(
    id: string,
    limit?: number
  ): Promise<
    Array<{
      timestamp: Date;
      ipAddress?: string;
      userAgent?: string;
      success: boolean;
    }>
  >;
  getSecurityEvents(
    id: string
  ): Promise<Array<{ timestamp: Date; event: string; details: any }>>;

  // Cache management
  clearCache(): Promise<void>;
  warmCache(): Promise<void>;
  invalidateUserCache(id: string): Promise<void>;
}
