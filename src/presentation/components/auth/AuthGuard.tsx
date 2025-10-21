'use client';

import { useAuth } from '@/shared/contexts/AuthContext';
import { navigationStorage } from '@/shared/utils/sessionStorage';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Shield, AlertTriangle, Loader2 } from '@/components/ui/icons';
import {
  RBACService,
  parsePermissionString,
  DetailedRole,
  SimpleRole,
} from '@/shared/rbac';

import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRole?: string;
  requiredRoles?: string[]; // Support multiple roles
  requiredPermissions?: string[];
  requireAllPermissions?: boolean; // Default true, set false for "any" logic
  resourceContext?: {
    resourceId?: string;
    resourceType?: string;
    ownerId?: string;
    companyId?: string;
    departmentId?: string;
  };
  fallback?: ReactNode;
  redirectTo?: string;
  showDetailedError?: boolean; // Show specific missing permissions/roles
}

export function AuthGuard({
  children,
  requireAuth = true,
  requiredRole,
  requiredRoles,
  requiredPermissions = [],
  requireAllPermissions = true,
  resourceContext,
  fallback,
  redirectTo,
  showDetailedError = false,
}: AuthGuardProps) {
  const { user, isAuthenticated, isLoading, hasRole, hasPermission } =
    useAuth();
  const t = useTranslations('auth');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      // Store current page for redirect after login
      if (pathname) {
        navigationStorage.setLoginRedirect(pathname);
      }

      const destination = redirectTo || '/auth/login';
      router.push(destination);
      return;
    }

    // Enhanced role checking with RBAC
    if (isAuthenticated && user) {
      // RBACService methods are static, no need to instantiate
      const userContext = {
        id: user.id,
        email: user.email,
        role: user.role,
        ...(user.companyId && { companyId: user.companyId }),
        ...(user.departmentId && { departmentId: user.departmentId }),
        managedDepartments: user.managedDepartments || [],
        isActive: true, // Default to true since user is authenticated
        isVerified: true, // Default to true since user is authenticated
      };

      // Check single required role
      if (
        requiredRole &&
        !RBACService.hasRole(
          userContext,
          requiredRole as DetailedRole | SimpleRole
        )
      ) {
        router.push('/unauthorized');
        return;
      }

      // Check multiple required roles (any match)
      if (requiredRoles && requiredRoles.length > 0) {
        const hasAnyRole = RBACService.hasAnyRole(
          userContext,
          requiredRoles as (DetailedRole | SimpleRole)[]
        );
        if (!hasAnyRole) {
          router.push('/unauthorized');
          return;
        }
      }

      // Enhanced permission checking with context
      if (requiredPermissions.length > 0) {
        const permissionChecks = requiredPermissions.map(permission => {
          const parsed = parsePermissionString(permission);
          if (!parsed) return false;

          const { resource, action } = parsed;
          if (resourceContext) {
            return RBACService.hasPermission(
              userContext,
              resource,
              action,
              resourceContext
            );
          }
          return RBACService.hasPermission(userContext, resource, action);
        });

        const hasRequiredPermissions = requireAllPermissions
          ? permissionChecks.every(Boolean)
          : permissionChecks.some(Boolean);

        if (!hasRequiredPermissions) {
          router.push('/unauthorized');
          return;
        }
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    user,
    requireAuth,
    requiredRole,
    requiredRoles,
    requiredPermissions,
    requireAllPermissions,
    resourceContext,
    hasRole,
    hasPermission,
    router,
    pathname,
    redirectTo,
  ]);

  // Show loading state
  if (isLoading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-sm text-muted-foreground">
              {t('common.loading')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>{t('unauthorized.title')}</CardTitle>
            <CardDescription>{t('unauthorized.loginRequired')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={() => router.push('/auth/login')}
              className="w-full"
            >
              {t('common.signIn')}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/auth/register')}
              className="w-full"
            >
              {t('register.title')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user doesn't have required role
  if (isAuthenticated && requiredRole && !hasRole(requiredRole)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>{t('unauthorized.title')}</CardTitle>
            <CardDescription>
              {t('unauthorized.roleRequired', { role: requiredRole })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {t('unauthorized.contactAdmin')}
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              {t('unauthorized.backToDashboard')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user doesn't have required permissions
  if (isAuthenticated && requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission =>
      hasPermission(permission)
    );

    if (!hasAllPermissions) {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle>{t('unauthorized.title')}</CardTitle>
              <CardDescription>
                {t('unauthorized.permissionRequired')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {t('unauthorized.missingPermissions', {
                    permissions: requiredPermissions.join(', '),
                  })}
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                onClick={() => router.push('/dashboard')}
                className="w-full"
              >
                {t('unauthorized.backToDashboard')}
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // All checks passed, render children
  return <>{children}</>;
}

// Convenience components for common use cases
export function AdminGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthGuard
      requiredRoles={['admin', 'SUPER_ADMIN', 'ADMIN']}
      fallback={fallback}
    >
      {children}
    </AuthGuard>
  );
}

export function SupplierGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthGuard requiredRoles={['supplier', 'SUPPLIER']} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function BuyerGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthGuard requiredRoles={['buyer', 'BUYER']} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

// New RBAC-specific guards
export function InternalUserGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthGuard
      requiredRoles={[
        'SUPER_ADMIN',
        'ADMIN',
        'SALES_MANAGER',
        'SALES_REP',
        'CONTENT_MANAGER',
        'ANALYST',
      ]}
      fallback={fallback}
    >
      {children}
    </AuthGuard>
  );
}

export function ManagerGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthGuard
      requiredRoles={['SUPER_ADMIN', 'ADMIN', 'SALES_MANAGER']}
      fallback={fallback}
    >
      {children}
    </AuthGuard>
  );
}

export function SalesTeamGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthGuard
      requiredRoles={['SALES_MANAGER', 'SALES_REP']}
      fallback={fallback}
    >
      {children}
    </AuthGuard>
  );
}

// Permission-based guards
export function ProductManagementGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthGuard requiredPermissions={['products:read']} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function RFQManagementGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthGuard requiredPermissions={['rfqs:read']} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}

export function UserManagementGuard({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <AuthGuard requiredPermissions={['users:read']} fallback={fallback}>
      {children}
    </AuthGuard>
  );
}
