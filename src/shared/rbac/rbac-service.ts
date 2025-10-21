/**
 * RBAC Service - Core permission checking logic with conditions and context
 * This service handles all permission validation for The Great Beans Coffee Platform
 */

import {
  PermissionCondition,
  Resource,
  Action,
  matchesPermissionPattern,
  parsePermissionString,
} from './permissions';
import {
  SimpleRole,
  DetailedRole,
  getRolePermissions,
  getSimpleRole,
  hasRoleHierarchy,
  isManagerRole,
  isAdminRole,
} from './roles';

// User context for permission checking
export interface UserContext {
  id: string;
  email: string;
  role: DetailedRole;
  simpleRole?: SimpleRole;
  permissions?: string[];
  companyId?: string;
  departmentId?: string;
  managedDepartments?: string[];
  isActive: boolean;
  isVerified: boolean;
}

// Resource context for condition checking
export interface ResourceContext {
  [key: string]: string | number | boolean | undefined;
  id?: string;
  createdBy?: string;
  ownerId?: string;
  companyId?: string;
  departmentId?: string;
  status?: string;
  visibility?: 'public' | 'private' | 'internal';
}

// Permission check result
export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  conditions?: PermissionCondition[];
}

// RBAC Service class
export class RBACService {
  /**
   * Check if a user has a specific permission
   */
  static hasPermission(
    user: UserContext,
    resource: Resource,
    action: Action,
    resourceContext?: ResourceContext
  ): PermissionCheckResult {
    // Check if user is active and verified
    if (!user.isActive || !user.isVerified) {
      return {
        allowed: false,
        reason: 'User is not active or verified',
      };
    }

    // Get user's permissions
    const userPermissions = this.getUserPermissions(user);
    const permissionString = `${action}:${resource}`;

    // Check for exact permission match
    if (userPermissions.includes(permissionString)) {
      return this.checkPermissionConditions(
        user,
        resource,
        action,
        resourceContext
      );
    }

    // Check for wildcard permissions
    const wildcardPermissions = [
      '*:*', // All permissions
      `${action}:*`, // All resources for this action
      `*:${resource}`, // All actions for this resource
    ];

    for (const wildcardPerm of wildcardPermissions) {
      if (userPermissions.includes(wildcardPerm)) {
        return this.checkPermissionConditions(
          user,
          resource,
          action,
          resourceContext
        );
      }
    }

    // Check pattern matching
    for (const userPerm of userPermissions) {
      if (matchesPermissionPattern(permissionString, userPerm)) {
        return this.checkPermissionConditions(
          user,
          resource,
          action,
          resourceContext
        );
      }
    }

    return {
      allowed: false,
      reason: `User does not have permission: ${permissionString}`,
    };
  }

  /**
   * Check if a user has any of the specified permissions
   */
  static hasAnyPermission(
    user: UserContext,
    permissions: Array<{ resource: Resource; action: Action }>,
    resourceContext?: ResourceContext
  ): PermissionCheckResult {
    for (const perm of permissions) {
      const result = this.hasPermission(
        user,
        perm.resource,
        perm.action,
        resourceContext
      );
      if (result.allowed) {
        return result;
      }
    }

    return {
      allowed: false,
      reason: 'User does not have any of the required permissions',
    };
  }

  /**
   * Check if a user has all of the specified permissions
   */
  static hasAllPermissions(
    user: UserContext,
    permissions: Array<{ resource: Resource; action: Action }>,
    resourceContext?: ResourceContext
  ): PermissionCheckResult {
    for (const perm of permissions) {
      const result = this.hasPermission(
        user,
        perm.resource,
        perm.action,
        resourceContext
      );
      if (!result.allowed) {
        return result;
      }
    }

    return { allowed: true };
  }

  /**
   * Check if a user has a specific role
   */
  static hasRole(user: UserContext, role: SimpleRole | DetailedRole): boolean {
    if (Object.values(SimpleRole).includes(role as SimpleRole)) {
      const userSimpleRole = user.simpleRole || getSimpleRole(user.role);
      return hasRoleHierarchy(userSimpleRole, role as SimpleRole);
    }

    return user.role === role;
  }

  /**
   * Check if a user has any of the specified roles
   */
  static hasAnyRole(
    user: UserContext,
    roles: Array<SimpleRole | DetailedRole>
  ): boolean {
    return roles.some(role => this.hasRole(user, role));
  }

  /**
   * Get all permissions for a user
   */
  static getUserPermissions(user: UserContext): string[] {
    // Start with role-based permissions
    const rolePermissions = getRolePermissions(user.role);

    // Add any additional user-specific permissions
    const userPermissions = user.permissions || [];

    // Combine and deduplicate
    const allPermissions = [
      ...new Set([...rolePermissions, ...userPermissions]),
    ];

    return allPermissions;
  }

  /**
   * Check permission conditions
   */
  private static checkPermissionConditions(
    user: UserContext,
    resource: Resource,
    action: Action,
    resourceContext?: ResourceContext
  ): PermissionCheckResult {
    // If no resource context provided, allow the permission
    if (!resourceContext) {
      return { allowed: true };
    }

    // Get conditions for this permission (this would typically come from a database)
    const conditions = this.getPermissionConditions(user, resource, action);

    if (!conditions || conditions.length === 0) {
      return { allowed: true };
    }

    // Check all conditions
    for (const condition of conditions) {
      if (!this.evaluateCondition(condition, user, resourceContext)) {
        return {
          allowed: false,
          reason: `Condition not met: ${condition.field} ${condition.operator} ${condition.value}`,
          conditions,
        };
      }
    }

    return { allowed: true, conditions };
  }

  /**
   * Get permission conditions for a user, resource, and action
   */
  private static getPermissionConditions(
    user: UserContext,
    resource: Resource,
    action: Action
  ): PermissionCondition[] {
    const conditions: PermissionCondition[] = [];

    // Add ownership conditions for non-admin users
    if (!isAdminRole(user.role)) {
      // Users can only access their own resources for certain actions
      if ([Action.UPDATE, Action.DELETE].includes(action)) {
        conditions.push({
          field: 'createdBy',
          operator: 'equals',
          value: user.id,
        });
      }

      // Company-based access control
      if (user.companyId) {
        conditions.push({
          field: 'companyId',
          operator: 'equals',
          value: user.companyId,
        });
      }
    }

    // Add manager-specific conditions
    if (isManagerRole(user.role) && user.managedDepartments) {
      conditions.push({
        field: 'departmentId',
        operator: 'in',
        value: user.managedDepartments,
      });
    }

    return conditions;
  }

  /**
   * Evaluate a single condition
   */
  private static evaluateCondition(
    condition: PermissionCondition,
    user: UserContext,
    resourceContext: ResourceContext
  ): boolean {
    let resourceValue = resourceContext[condition.field];
    let conditionValue = condition.value;

    // Handle special values
    if (conditionValue === 'self') {
      conditionValue = user.id;
    }

    // Handle different operators
    switch (condition.operator) {
      case 'equals':
        return resourceValue === conditionValue;

      case 'not_equals':
        return resourceValue !== conditionValue;

      case 'in':
        return (
          Array.isArray(conditionValue) &&
          conditionValue.includes(resourceValue)
        );

      case 'not_in':
        return (
          Array.isArray(conditionValue) &&
          !conditionValue.includes(resourceValue)
        );

      case 'greater_than':
        return Number(resourceValue) > Number(conditionValue);

      case 'less_than':
        return Number(resourceValue) < Number(conditionValue);

      case 'contains':
        return String(resourceValue).includes(String(conditionValue));

      case 'starts_with':
        return String(resourceValue).startsWith(String(conditionValue));

      case 'ends_with':
        return String(resourceValue).endsWith(String(conditionValue));

      default:
        return false;
    }
  }

  /**
   * Get filtered resources based on user permissions
   */
  static filterResources<T extends ResourceContext>(
    user: UserContext,
    resources: T[],
    resource: Resource,
    action: Action
  ): T[] {
    return resources.filter(resourceItem => {
      const result = this.hasPermission(user, resource, action, resourceItem);
      return result.allowed;
    });
  }

  /**
   * Check if user can access a specific resource instance
   */
  static canAccessResource(
    user: UserContext,
    resource: Resource,
    action: Action,
    resourceContext: ResourceContext
  ): boolean {
    const result = this.hasPermission(user, resource, action, resourceContext);
    return result.allowed;
  }

  /**
   * Get user's accessible resources for a given action
   */
  static getAccessibleResources(user: UserContext, action: Action): Resource[] {
    const userPermissions = this.getUserPermissions(user);
    const accessibleResources: Resource[] = [];

    for (const permission of userPermissions) {
      const parsed = parsePermissionString(permission);
      if (
        parsed &&
        (parsed.action === action || parsed.action === Action.MANAGE)
      ) {
        if (!accessibleResources.includes(parsed.resource)) {
          accessibleResources.push(parsed.resource);
        }
      }
    }

    return accessibleResources;
  }

  /**
   * Check if user is resource owner
   */
  static isResourceOwner(
    user: UserContext,
    resourceContext: ResourceContext
  ): boolean {
    return (
      resourceContext.createdBy === user.id ||
      resourceContext.ownerId === user.id
    );
  }

  /**
   * Check if user is in same company as resource
   */
  static isSameCompany(
    user: UserContext,
    resourceContext: ResourceContext
  ): boolean {
    return user.companyId === resourceContext.companyId;
  }

  /**
   * Check if user can manage department
   */
  static canManageDepartment(user: UserContext, departmentId: string): boolean {
    if (isAdminRole(user.role)) {
      return true;
    }

    if (isManagerRole(user.role) && user.managedDepartments) {
      return user.managedDepartments.includes(departmentId);
    }

    return false;
  }
}
