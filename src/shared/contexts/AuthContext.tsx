'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SimpleRole, DetailedRole, getSimpleRole } from '@/shared/rbac';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  role: DetailedRole; // Updated to use DetailedRole from RBAC
  simpleRole?: SimpleRole; // Computed from DetailedRole
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING'; // Updated to match user entity
  emailVerified: boolean;
  company?: {
    id: string;
    name: string;
    type: string;
    country: string;
    phone?: string;
    website?: string;
  };
  companyId?: string;
  departmentId?: string;
  managedDepartments?: string[];
  permissions: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string | string[]) => boolean;
  // Legacy role checks (for backward compatibility)
  isAdmin: boolean;
  isBuyer: boolean;
  isSupplier: boolean;
  isViewer: boolean;
  // New RBAC role checks
  isInternalUser: boolean;
  isExternalUser: boolean;
  isManagerRole: boolean;
  isAdminRole: boolean;
}

export interface AuthActions {
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  checkPermission: (permission: string) => boolean;
  checkRole: (role: string | string[]) => boolean;
}

export interface AuthContextType extends AuthState, AuthActions {}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Update user state when session changes
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (status === 'unauthenticated' || !session?.user) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    // Transform session user to our User type
    const sessionUser = session.user as any;
    const userRole: DetailedRole = sessionUser.role || 'VIEWER';
    const transformedUser: User = {
      id: sessionUser.id,
      email: sessionUser.email,
      firstName: sessionUser.firstName || '',
      lastName: sessionUser.lastName || '',
      fullName:
        sessionUser.name ||
        `${sessionUser.firstName || ''} ${sessionUser.lastName || ''}`.trim(),
      role: userRole,
      simpleRole: getSimpleRole(userRole),
      status: sessionUser.status || 'ACTIVE',
      emailVerified: sessionUser.emailVerified || false,
      permissions: sessionUser.permissions || [],
      createdAt: new Date(sessionUser.createdAt || Date.now()),
      updatedAt: new Date(sessionUser.updatedAt || Date.now()),
    };

    // Add optional properties conditionally
    if (sessionUser.avatar) {
      transformedUser.avatar = sessionUser.avatar;
    }
    if (sessionUser.company) {
      transformedUser.company = sessionUser.company;
    }
    if (sessionUser.companyId) {
      transformedUser.companyId = sessionUser.companyId;
    }
    if (sessionUser.departmentId) {
      transformedUser.departmentId = sessionUser.departmentId;
    }
    if (sessionUser.managedDepartments) {
      transformedUser.managedDepartments = sessionUser.managedDepartments;
    }
    if (sessionUser.lastLoginAt) {
      transformedUser.lastLoginAt = new Date(sessionUser.lastLoginAt);
    }

    setUser(transformedUser);
    setIsLoading(false);
  }, [session, status]);

  // Check if user has specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    // Check both detailed role and simple role for admin privileges
    if (
      user.role === 'SUPER_ADMIN' ||
      user.role === 'ADMIN' ||
      user.simpleRole === 'admin'
    ) {
      return true; // Admin has all permissions
    }
    return user.permissions.includes(permission);
  };

  // Check if user has specific role(s) - supports both simple and detailed roles
  const hasRole = (role: string | string[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];

    // Check against both detailed role and simple role for backward compatibility
    return roles.some(
      r =>
        user.role === r ||
        user.simpleRole === r ||
        // Legacy role mapping
        (r === 'admin' &&
          (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN')) ||
        (r === 'buyer' && user.role === 'BUYER') ||
        (r === 'supplier' && user.role === 'SUPPLIER') ||
        (r === 'viewer' && user.role === 'VIEWER')
    );
  };

  // Sign out user
  const handleSignOut = async (): Promise<void> => {
    try {
      await signOut({
        callbackUrl: '/auth/login',
        redirect: true,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force redirect even if signOut fails
      router.push('/auth/login');
    }
  };

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    try {
      await update(); // This will trigger a session refresh
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  // Update user data locally (optimistic updates)
  const updateUser = (updates: Partial<User>): void => {
    if (!user) return;
    setUser(prev => (prev ? { ...prev, ...updates } : null));
  };

  // Permission and role checking functions
  const checkPermission = (permission: string): boolean =>
    hasPermission(permission);
  const checkRole = (role: string | string[]): boolean => hasRole(role);

  // Computed properties
  const isAuthenticated = !!user && status === 'authenticated';
  const isEmailVerified = user?.emailVerified || false;

  // Legacy role checks (for backward compatibility)
  const isAdmin =
    user?.simpleRole === 'admin' ||
    user?.role === 'SUPER_ADMIN' ||
    user?.role === 'ADMIN';
  const isBuyer = user?.simpleRole === 'buyer' || user?.role === 'BUYER';
  const isSupplier =
    user?.simpleRole === 'supplier' || user?.role === 'SUPPLIER';
  const isViewer = user?.simpleRole === 'viewer' || user?.role === 'VIEWER';

  // New RBAC role checks
  const isInternalUser = user
    ? [
        'SUPER_ADMIN',
        'ADMIN',
        'SALES_MANAGER',
        'SALES_REP',
        'CONTENT_MANAGER',
        'ANALYST',
      ].includes(user.role)
    : false;
  const isExternalUser = user
    ? ['BUYER', 'SUPPLIER', 'VIEWER'].includes(user.role)
    : false;
  const isManagerRole = user
    ? ['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER'].includes(user.role)
    : false;
  const isAdminRole = user
    ? ['SUPER_ADMIN', 'ADMIN'].includes(user.role)
    : false;

  const contextValue: AuthContextType = {
    // State
    user,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    hasPermission,
    hasRole,
    // Legacy role checks
    isAdmin,
    isBuyer,
    isSupplier,
    isViewer,
    // New RBAC role checks
    isInternalUser,
    isExternalUser,
    isManagerRole,
    isAdminRole,

    // Actions
    signOut: handleSignOut,
    refreshUser,
    updateUser,
    checkPermission,
    checkRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protected routes
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isAuthenticated, isLoading };
}

// Hook for role-based access
export function useRequireRole(
  requiredRole: string | string[],
  redirectTo: string = '/unauthorized'
) {
  const { hasRole, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasRole(requiredRole)) {
      router.push(redirectTo);
    }
  }, [hasRole, isLoading, isAuthenticated, requiredRole, redirectTo, router]);

  return { hasRole: hasRole(requiredRole), isLoading };
}

// Hook for permission-based access
export function useRequirePermission(
  requiredPermission: string,
  redirectTo: string = '/unauthorized'
) {
  const { hasPermission, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasPermission(requiredPermission)) {
      router.push(redirectTo);
    }
  }, [
    hasPermission,
    isLoading,
    isAuthenticated,
    requiredPermission,
    redirectTo,
    router,
  ]);

  return { hasPermission: hasPermission(requiredPermission), isLoading };
}
