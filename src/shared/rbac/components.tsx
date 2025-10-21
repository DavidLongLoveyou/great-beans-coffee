/**
 * RBAC-Aware React Components for The Great Beans Coffee Platform
 * These components provide conditional rendering based on user permissions and roles
 */

import React from 'react';
import { Resource, Action } from './permissions';
import { SimpleRole, DetailedRole } from './roles';
import { ResourceContext } from './rbac-service';
import {
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useRole,
  useAnyRole,
  useIsAdmin,
  useIsSupplier,
  useIsBuyer,
  useIsViewer,
} from './hooks';

// Base props for RBAC components
interface BaseRBACProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

// Permission-based component props
interface PermissionGuardProps extends BaseRBACProps {
  resource: Resource;
  action: Action;
  resourceContext?: ResourceContext | undefined;
}

// Multiple permissions component props
interface MultiplePermissionsGuardProps extends BaseRBACProps {
  permissions: Array<{ resource: Resource; action: Action }>;
  resourceContext?: ResourceContext | undefined;
  requireAll?: boolean; // If true, requires all permissions; if false, requires any permission
}

// Role-based component props
interface RoleGuardProps extends BaseRBACProps {
  role: SimpleRole | DetailedRole;
}

// Multiple roles component props
interface MultipleRolesGuardProps extends BaseRBACProps {
  roles: Array<SimpleRole | DetailedRole>;
  requireAll?: boolean; // If true, requires all roles; if false, requires any role
}

/**
 * Component that renders children only if user has the specified permission
 */
export function PermissionGuard({
  resource,
  action,
  resourceContext,
  children,
  fallback = null,
  loading = null,
}: PermissionGuardProps) {
  const permissionResult = usePermission(
    resource,
    action,
    resourceContext || undefined
  );

  if (loading && permissionResult === undefined) {
    return <>{loading}</>;
  }

  if (permissionResult.allowed) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Component that renders children only if user has any/all of the specified permissions
 */
export function MultiplePermissionsGuard({
  permissions,
  resourceContext,
  requireAll = false,
  children,
  fallback = null,
  loading = null,
}: MultiplePermissionsGuardProps) {
  const anyPermissionResult = useAnyPermission(permissions, resourceContext);
  const allPermissionsResult = useAllPermissions(permissions, resourceContext);

  const permissionResult = requireAll
    ? allPermissionsResult
    : anyPermissionResult;

  if (loading && permissionResult === undefined) {
    return <>{loading}</>;
  }

  if (permissionResult.allowed) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Component that renders children only if user has the specified role
 */
export function RoleGuard({
  role,
  children,
  fallback = null,
  loading = null,
}: RoleGuardProps) {
  const hasRole = useRole(role);

  if (loading && hasRole === undefined) {
    return <>{loading}</>;
  }

  if (hasRole) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Component that renders children only if user has any/all of the specified roles
 */
export function MultipleRolesGuard({
  roles,
  requireAll = false,
  children,
  fallback = null,
  loading = null,
}: MultipleRolesGuardProps) {
  const hasAnyRole = useAnyRole(roles);

  // Get all role checks at the top level to avoid hooks in callbacks
  const roleChecks = roles.map(role => useRole(role));
  const hasAllRoles = roleChecks.every(Boolean);

  const hasRequiredRoles = requireAll ? hasAllRoles : hasAnyRole;

  if (loading && hasRequiredRoles === undefined) {
    return <>{loading}</>;
  }

  if (hasRequiredRoles) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Admin-only component
 */
export function AdminOnly({
  children,
  fallback = null,
  loading = null,
}: BaseRBACProps) {
  const isAdmin = useIsAdmin();

  if (loading && isAdmin === undefined) {
    return <>{loading}</>;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Supplier-only component
 */
export function SupplierOnly({
  children,
  fallback = null,
  loading = null,
}: BaseRBACProps) {
  const isSupplier = useIsSupplier();

  if (loading && isSupplier === undefined) {
    return <>{loading}</>;
  }

  if (isSupplier) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Buyer-only component
 */
export function BuyerOnly({
  children,
  fallback = null,
  loading = null,
}: BaseRBACProps) {
  const isBuyer = useIsBuyer();

  if (loading && isBuyer === undefined) {
    return <>{loading}</>;
  }

  if (isBuyer) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Viewer-only component (lowest access level)
 */
export function ViewerOnly({
  children,
  fallback = null,
  loading = null,
}: BaseRBACProps) {
  const isViewer = useIsViewer();

  if (loading && isViewer === undefined) {
    return <>{loading}</>;
  }

  if (isViewer) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

/**
 * Component that renders different content based on user role
 */
interface RoleBasedContentProps {
  adminContent?: React.ReactNode;
  supplierContent?: React.ReactNode;
  buyerContent?: React.ReactNode;
  viewerContent?: React.ReactNode;
  defaultContent?: React.ReactNode;
  loading?: React.ReactNode;
}

export function RoleBasedContent({
  adminContent,
  supplierContent,
  buyerContent,
  viewerContent,
  defaultContent = null,
  loading = null,
}: RoleBasedContentProps) {
  const isAdmin = useIsAdmin();
  const isSupplier = useIsSupplier();
  const isBuyer = useIsBuyer();
  const isViewer = useIsViewer();

  if (
    loading &&
    (isAdmin === undefined ||
      isSupplier === undefined ||
      isBuyer === undefined ||
      isViewer === undefined)
  ) {
    return <>{loading}</>;
  }

  if (isAdmin && adminContent) {
    return <>{adminContent}</>;
  }

  if (isSupplier && supplierContent) {
    return <>{supplierContent}</>;
  }

  if (isBuyer && buyerContent) {
    return <>{buyerContent}</>;
  }

  if (isViewer && viewerContent) {
    return <>{viewerContent}</>;
  }

  return <>{defaultContent}</>;
}

/**
 * Component for product-related permissions
 */
interface ProductGuardProps extends BaseRBACProps {
  action: Action;
  productContext?: ResourceContext;
}

export function ProductGuard({
  action,
  productContext,
  children,
  fallback = null,
  loading = null,
}: ProductGuardProps) {
  return (
    <PermissionGuard
      resource={Resource.PRODUCTS}
      action={action}
      resourceContext={productContext}
      fallback={fallback}
      loading={loading}
    >
      {children}
    </PermissionGuard>
  );
}

/**
 * Component for RFQ-related permissions
 */
interface RFQGuardProps extends BaseRBACProps {
  action: Action;
  rfqContext?: ResourceContext;
}

export function RFQGuard({
  action,
  rfqContext,
  children,
  fallback = null,
  loading = null,
}: RFQGuardProps) {
  return (
    <PermissionGuard
      resource={Resource.RFQS}
      action={action}
      resourceContext={rfqContext}
      fallback={fallback}
      loading={loading}
    >
      {children}
    </PermissionGuard>
  );
}

/**
 * Component for user management permissions
 */
interface UserManagementGuardProps extends BaseRBACProps {
  action: Action;
  userContext?: ResourceContext;
}

export function UserManagementGuard({
  action,
  userContext,
  children,
  fallback = null,
  loading = null,
}: UserManagementGuardProps) {
  return (
    <PermissionGuard
      resource={Resource.USERS}
      action={action}
      resourceContext={userContext}
      fallback={fallback}
      loading={loading}
    >
      {children}
    </PermissionGuard>
  );
}

/**
 * Component for content management permissions
 */
interface ContentManagementGuardProps extends BaseRBACProps {
  action: Action;
  contentContext?: ResourceContext;
}

export function ContentManagementGuard({
  action,
  contentContext,
  children,
  fallback = null,
  loading = null,
}: ContentManagementGuardProps) {
  return (
    <PermissionGuard
      resource={Resource.CONTENT}
      action={action}
      resourceContext={contentContext}
      fallback={fallback}
      loading={loading}
    >
      {children}
    </PermissionGuard>
  );
}

/**
 * Component for analytics permissions
 */
interface AnalyticsGuardProps extends BaseRBACProps {
  action: Action;
  analyticsContext?: ResourceContext;
}

export function AnalyticsGuard({
  action,
  analyticsContext,
  children,
  fallback = null,
  loading = null,
}: AnalyticsGuardProps) {
  return (
    <PermissionGuard
      resource={Resource.ANALYTICS}
      action={action}
      resourceContext={analyticsContext}
      fallback={fallback}
      loading={loading}
    >
      {children}
    </PermissionGuard>
  );
}

/**
 * Higher-order component for wrapping components with permission checks
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  resource: Resource,
  action: Action,
  fallback?: React.ReactNode
) {
  return function PermissionWrappedComponent(
    props: P & { resourceContext?: ResourceContext }
  ) {
    const { resourceContext, ...componentProps } = props;

    return (
      <PermissionGuard
        resource={resource}
        action={action}
        resourceContext={resourceContext}
        fallback={fallback}
      >
        <WrappedComponent {...(componentProps as P)} />
      </PermissionGuard>
    );
  };
}

/**
 * Higher-order component for wrapping components with role checks
 */
export function withRole<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  role: SimpleRole | DetailedRole,
  fallback?: React.ReactNode
) {
  return function RoleWrappedComponent(props: P) {
    return (
      <RoleGuard role={role} fallback={fallback}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };
}

/**
 * Conditional rendering based on permission check result
 */
interface ConditionalRenderProps {
  condition: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ConditionalRender({
  condition,
  children,
  fallback = null,
}: ConditionalRenderProps) {
  return condition ? <>{children}</> : <>{fallback}</>;
}

/**
 * Component that shows permission denied message
 */
interface PermissionDeniedProps {
  message?: string;
  showDetails?: boolean;
  reason?: string;
}

export function PermissionDenied({
  message = "You don't have permission to access this resource.",
  showDetails = false,
  reason,
}: PermissionDeniedProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-4">
        <svg
          className="h-16 w-16 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Access Denied
      </h3>
      <p className="mb-4 text-gray-600">{message}</p>
      {showDetails && reason && (
        <p className="text-sm text-gray-500">Reason: {reason}</p>
      )}
    </div>
  );
}
