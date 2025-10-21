import bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a random password for OAuth users
 */
export function generateRandomPassword(): string {
  const length = 16;
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.USER]: 0,
    [UserRole.CONTENT_MANAGER]: 1,
    [UserRole.SALES]: 2,
    [UserRole.MANAGER]: 3,
    [UserRole.ADMIN]: 4,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user has any of the required roles
 */
export function hasAnyRole(
  userRole: UserRole,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.some(role => hasRole(userRole, role));
}

/**
 * Get user permissions based on role
 */
export function getUserPermissions(role: UserRole): string[] {
  const permissions: Record<UserRole, string[]> = {
    [UserRole.USER]: [
      'read:profile',
      'update:profile',
      'create:rfq',
      'read:products',
    ],
    [UserRole.CONTENT_MANAGER]: [
      'read:profile',
      'update:profile',
      'create:rfq',
      'read:products',
      'create:content',
      'update:content',
      'delete:content',
      'read:content',
    ],
    [UserRole.SALES]: [
      'read:profile',
      'update:profile',
      'create:rfq',
      'read:products',
      'read:rfqs',
      'update:rfqs',
      'read:clients',
      'create:clients',
      'update:clients',
    ],
    [UserRole.MANAGER]: [
      'read:profile',
      'update:profile',
      'create:rfq',
      'read:products',
      'create:content',
      'update:content',
      'delete:content',
      'read:content',
      'read:rfqs',
      'update:rfqs',
      'delete:rfqs',
      'read:clients',
      'create:clients',
      'update:clients',
      'delete:clients',
      'read:analytics',
      'read:reports',
    ],
    [UserRole.ADMIN]: [
      'read:profile',
      'update:profile',
      'create:rfq',
      'read:products',
      'create:content',
      'update:content',
      'delete:content',
      'read:content',
      'read:rfqs',
      'update:rfqs',
      'delete:rfqs',
      'read:clients',
      'create:clients',
      'update:clients',
      'delete:clients',
      'read:analytics',
      'read:reports',
      'create:products',
      'update:products',
      'delete:products',
      'read:users',
      'create:users',
      'update:users',
      'delete:users',
      'read:settings',
      'update:settings',
    ],
  };

  return permissions[role] || [];
}

/**
 * Check if user has specific permission
 */
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const userPermissions = getUserPermissions(userRole);
  return userPermissions.includes(permission);
}

/**
 * Validate password strength
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generate email verification token
 */
export function generateVerificationToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

/**
 * Check if email verification token is expired
 */
export function isTokenExpired(
  tokenDate: Date,
  expirationHours: number = 24
): boolean {
  const now = new Date();
  const expirationTime = new Date(
    tokenDate.getTime() + expirationHours * 60 * 60 * 1000
  );
  return now > expirationTime;
}
