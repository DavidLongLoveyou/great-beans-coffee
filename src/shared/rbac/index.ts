/**
 * RBAC System Index - The Great Beans Coffee Platform
 * Centralized exports for all RBAC functionality
 */

// Core RBAC Service
export { RBACService } from './rbac-service';
export type {
  UserContext,
  ResourceContext,
  PermissionCheckResult,
} from './rbac-service';

// Permissions System
export {
  Resource,
  Action,
  PERMISSION_SETS,
  PERMISSIONS,
  createPermissionString,
  parsePermissionString,
  matchesPermissionPattern,
} from './permissions';
export type { Permission, PermissionCondition } from './permissions';

// Roles System
export {
  SimpleRole,
  DetailedRole,
  ROLE_HIERARCHY,
  DETAILED_TO_SIMPLE_ROLE_MAPPING,
  ROLE_PERMISSIONS,
  DETAILED_ROLE_PERMISSIONS,
  getSimpleRole,
  getRolePermissions,
  hasRoleHierarchy,
  isManagerRole,
  isAdminRole,
  isExternalRole,
  isInternalRole,
} from './roles';

// React Hooks
export {
  useUserContext,
  usePermission,
  useAnyPermission,
  useAllPermissions,
  useRole,
  useAnyRole,
  useUserPermissions,
  useFilteredResources,
  useCanAccessResource,
  useAccessibleResources,
  useIsResourceOwner,
  useIsSameCompany,
  useCanManageDepartment,
  useIsAdmin,
  useIsSupplier,
  useIsBuyer,
  useIsViewer,
  useCanCreate,
  useCanRead,
  useCanUpdate,
  useCanDelete,
  useCanApprove,
  useCanManage,
  useProductPermissions,
  useRFQPermissions,
  useUserManagementPermissions,
} from './hooks';

// React Components
export {
  PermissionGuard,
  MultiplePermissionsGuard,
  RoleGuard,
  MultipleRolesGuard,
  AdminOnly,
  SupplierOnly,
  BuyerOnly,
  ViewerOnly,
  RoleBasedContent,
  ProductGuard,
  RFQGuard,
  UserManagementGuard,
  ContentManagementGuard,
  AnalyticsGuard,
  withPermission,
  withRole,
  ConditionalRender,
  PermissionDenied,
} from './components';

// Utility functions are available through RBACService and individual exports
// Use RBACService.hasPermission(), RBACService.hasRole(), etc. directly

// All constants are already exported individually above
// Use the named exports directly: Resource, Action, SimpleRole, DetailedRole, etc.
