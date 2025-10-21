/**
 * RBAC React Hooks for The Great Beans Coffee Platform
 * These hooks provide easy integration of RBAC functionality in React components
 */

import { useMemo } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import {
  RBACService,
  UserContext,
  ResourceContext,
  PermissionCheckResult,
} from './rbac-service';
import { Resource, Action } from './permissions';
import { SimpleRole, DetailedRole, getSimpleRole } from './roles';

/**
 * Hook to get current user's RBAC context
 */
export function useUserContext(): UserContext | null {
  const { user, isAuthenticated } = useAuth();

  return useMemo(() => {
    if (!isAuthenticated || !user) {
      return null;
    }

    const userContext: UserContext = {
      id: user.id,
      email: user.email,
      role: user.role as DetailedRole,
      simpleRole: getSimpleRole(user.role as DetailedRole),
      permissions: user.permissions,
      isActive: user.status === 'ACTIVE',
      isVerified: user.emailVerified || false,
    };

    // Only add optional properties if they exist
    if (user.companyId) {
      userContext.companyId = user.companyId;
    }
    if (user.departmentId) {
      userContext.departmentId = user.departmentId;
    }
    if (user.managedDepartments) {
      userContext.managedDepartments = user.managedDepartments;
    }

    return userContext;
  }, [user, isAuthenticated]);
}

/**
 * Hook to check if user has a specific permission
 */
export function usePermission(
  resource: Resource,
  action: Action,
  resourceContext?: ResourceContext
): PermissionCheckResult {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return { allowed: false, reason: 'User not authenticated' };
    }

    return RBACService.hasPermission(
      userContext,
      resource,
      action,
      resourceContext
    );
  }, [userContext, resource, action, resourceContext]);
}

/**
 * Hook to check if user has any of the specified permissions
 */
export function useAnyPermission(
  permissions: Array<{ resource: Resource; action: Action }>,
  resourceContext?: ResourceContext
): PermissionCheckResult {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return { allowed: false, reason: 'User not authenticated' };
    }

    return RBACService.hasAnyPermission(
      userContext,
      permissions,
      resourceContext
    );
  }, [userContext, permissions, resourceContext]);
}

/**
 * Hook to check if user has all of the specified permissions
 */
export function useAllPermissions(
  permissions: Array<{ resource: Resource; action: Action }>,
  resourceContext?: ResourceContext
): PermissionCheckResult {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return { allowed: false, reason: 'User not authenticated' };
    }

    return RBACService.hasAllPermissions(
      userContext,
      permissions,
      resourceContext
    );
  }, [userContext, permissions, resourceContext]);
}

/**
 * Hook to check if user has a specific role
 */
export function useRole(role: SimpleRole | DetailedRole): boolean {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return false;
    }

    return RBACService.hasRole(userContext, role);
  }, [userContext, role]);
}

/**
 * Hook to check if user has any of the specified roles
 */
export function useAnyRole(roles: Array<SimpleRole | DetailedRole>): boolean {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return false;
    }

    return RBACService.hasAnyRole(userContext, roles);
  }, [userContext, roles]);
}

/**
 * Hook to get user's permissions
 */
export function useUserPermissions(): string[] {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return [];
    }

    return RBACService.getUserPermissions(userContext);
  }, [userContext]);
}

/**
 * Hook to filter resources based on user permissions
 */
export function useFilteredResources<T extends ResourceContext>(
  resources: T[],
  resource: Resource,
  action: Action
): T[] {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return [];
    }

    return RBACService.filterResources(
      userContext,
      resources,
      resource,
      action
    );
  }, [userContext, resources, resource, action]);
}

/**
 * Hook to check if user can access a specific resource instance
 */
export function useCanAccessResource(
  resource: Resource,
  action: Action,
  resourceContext: ResourceContext
): boolean {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return false;
    }

    return RBACService.canAccessResource(
      userContext,
      resource,
      action,
      resourceContext
    );
  }, [userContext, resource, action, resourceContext]);
}

/**
 * Hook to get user's accessible resources for a given action
 */
export function useAccessibleResources(action: Action): Resource[] {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return [];
    }

    return RBACService.getAccessibleResources(userContext, action);
  }, [userContext, action]);
}

/**
 * Hook to check if user is resource owner
 */
export function useIsResourceOwner(resourceContext: ResourceContext): boolean {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return false;
    }

    return RBACService.isResourceOwner(userContext, resourceContext);
  }, [userContext, resourceContext]);
}

/**
 * Hook to check if user is in same company as resource
 */
export function useIsSameCompany(resourceContext: ResourceContext): boolean {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return false;
    }

    return RBACService.isSameCompany(userContext, resourceContext);
  }, [userContext, resourceContext]);
}

/**
 * Hook to check if user can manage a department
 */
export function useCanManageDepartment(departmentId: string): boolean {
  const userContext = useUserContext();

  return useMemo(() => {
    if (!userContext) {
      return false;
    }

    return RBACService.canManageDepartment(userContext, departmentId);
  }, [userContext, departmentId]);
}

/**
 * Hook for admin-only access
 */
export function useIsAdmin(): boolean {
  return useRole(SimpleRole.ADMIN);
}

/**
 * Hook for supplier access
 */
export function useIsSupplier(): boolean {
  return useRole(SimpleRole.SUPPLIER);
}

/**
 * Hook for buyer access
 */
export function useIsBuyer(): boolean {
  return useRole(SimpleRole.BUYER);
}

/**
 * Hook for viewer access
 */
export function useIsViewer(): boolean {
  return useRole(SimpleRole.VIEWER);
}

/**
 * Hook to check if user can create resources
 */
export function useCanCreate(resource: Resource): boolean {
  const result = usePermission(resource, Action.CREATE);
  return result.allowed;
}

/**
 * Hook to check if user can read resources
 */
export function useCanRead(
  resource: Resource,
  resourceContext?: ResourceContext
): boolean {
  const result = usePermission(resource, Action.READ, resourceContext);
  return result.allowed;
}

/**
 * Hook to check if user can update resources
 */
export function useCanUpdate(
  resource: Resource,
  resourceContext?: ResourceContext
): boolean {
  const result = usePermission(resource, Action.UPDATE, resourceContext);
  return result.allowed;
}

/**
 * Hook to check if user can delete resources
 */
export function useCanDelete(
  resource: Resource,
  resourceContext?: ResourceContext
): boolean {
  const result = usePermission(resource, Action.DELETE, resourceContext);
  return result.allowed;
}

/**
 * Hook to check if user can approve resources
 */
export function useCanApprove(
  resource: Resource,
  resourceContext?: ResourceContext
): boolean {
  const result = usePermission(resource, Action.APPROVE, resourceContext);
  return result.allowed;
}

/**
 * Hook to check if user can manage resources (full access)
 */
export function useCanManage(
  resource: Resource,
  resourceContext?: ResourceContext
): boolean {
  const result = usePermission(resource, Action.MANAGE, resourceContext);
  return result.allowed;
}

/**
 * Convenience hook for common product permissions
 */
export function useProductPermissions(productContext?: ResourceContext) {
  const canCreate = useCanCreate(Resource.PRODUCTS);
  const canRead = useCanRead(Resource.PRODUCTS, productContext);
  const canUpdate = useCanUpdate(Resource.PRODUCTS, productContext);
  const canDelete = useCanDelete(Resource.PRODUCTS, productContext);
  const canManage = useCanManage(Resource.PRODUCTS, productContext);

  return {
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canManage,
  };
}

/**
 * Convenience hook for common RFQ permissions
 */
export function useRFQPermissions(rfqContext?: ResourceContext) {
  const canCreate = useCanCreate(Resource.RFQS);
  const canRead = useCanRead(Resource.RFQS, rfqContext);
  const canUpdate = useCanUpdate(Resource.RFQS, rfqContext);
  const canDelete = useCanDelete(Resource.RFQS, rfqContext);
  const canApprove = useCanApprove(Resource.RFQS, rfqContext);

  return {
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canApprove,
  };
}

/**
 * Convenience hook for common user management permissions
 */
export function useUserManagementPermissions(userContext?: ResourceContext) {
  const canCreate = useCanCreate(Resource.USERS);
  const canRead = useCanRead(Resource.USERS, userContext);
  const canUpdate = useCanUpdate(Resource.USERS, userContext);
  const canDelete = useCanDelete(Resource.USERS, userContext);
  const canManage = useCanManage(Resource.USERS, userContext);

  return {
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canManage,
  };
}
