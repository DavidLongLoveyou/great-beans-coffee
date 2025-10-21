/**
 * Role-Based Access Control (RBAC) System for The Great Beans Coffee Platform
 * This file maps user roles to permissions and provides role hierarchy
 */

import {
  PERMISSION_SETS,
  createPermissionString,
  Resource,
  Action,
} from './permissions';

// Simplified role system for RBAC (used in AuthContext)
export enum SimpleRole {
  ADMIN = 'admin',
  BUYER = 'buyer',
  SUPPLIER = 'supplier',
  VIEWER = 'viewer',
}

// Detailed role system from user entity (maps to SimpleRole)
export enum DetailedRole {
  // Admin roles
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',

  // Management roles
  SALES_MANAGER = 'SALES_MANAGER',
  OPERATIONS_MANAGER = 'OPERATIONS_MANAGER',
  QUALITY_MANAGER = 'QUALITY_MANAGER',
  LOGISTICS_MANAGER = 'LOGISTICS_MANAGER',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  MARKETING_MANAGER = 'MARKETING_MANAGER',

  // Staff roles
  SALES_REPRESENTATIVE = 'SALES_REPRESENTATIVE',
  QUALITY_INSPECTOR = 'QUALITY_INSPECTOR',
  LOGISTICS_COORDINATOR = 'LOGISTICS_COORDINATOR',
  CONTENT_CREATOR = 'CONTENT_CREATOR',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',

  // External roles
  SUPPLIER = 'SUPPLIER',
  BUYER = 'BUYER',
  PARTNER = 'PARTNER',

  // Basic roles
  VIEWER = 'VIEWER',
  GUEST = 'GUEST',
}

// Role hierarchy - higher roles inherit permissions from lower roles
export const ROLE_HIERARCHY: Record<SimpleRole, number> = {
  [SimpleRole.VIEWER]: 1,
  [SimpleRole.BUYER]: 2,
  [SimpleRole.SUPPLIER]: 3,
  [SimpleRole.ADMIN]: 4,
};

// Mapping from detailed roles to simplified roles
export const DETAILED_TO_SIMPLE_ROLE_MAPPING: Record<DetailedRole, SimpleRole> =
  {
    // Admin mappings
    [DetailedRole.SUPER_ADMIN]: SimpleRole.ADMIN,
    [DetailedRole.ADMIN]: SimpleRole.ADMIN,

    // Manager mappings (all managers are admins)
    [DetailedRole.SALES_MANAGER]: SimpleRole.ADMIN,
    [DetailedRole.OPERATIONS_MANAGER]: SimpleRole.ADMIN,
    [DetailedRole.QUALITY_MANAGER]: SimpleRole.ADMIN,
    [DetailedRole.LOGISTICS_MANAGER]: SimpleRole.ADMIN,
    [DetailedRole.FINANCE_MANAGER]: SimpleRole.ADMIN,
    [DetailedRole.MARKETING_MANAGER]: SimpleRole.ADMIN,

    // Staff mappings (staff have admin privileges but limited scope)
    [DetailedRole.SALES_REPRESENTATIVE]: SimpleRole.ADMIN,
    [DetailedRole.QUALITY_INSPECTOR]: SimpleRole.ADMIN,
    [DetailedRole.LOGISTICS_COORDINATOR]: SimpleRole.ADMIN,
    [DetailedRole.CONTENT_CREATOR]: SimpleRole.ADMIN,
    [DetailedRole.CUSTOMER_SERVICE]: SimpleRole.ADMIN,

    // External mappings
    [DetailedRole.SUPPLIER]: SimpleRole.SUPPLIER,
    [DetailedRole.BUYER]: SimpleRole.BUYER,
    [DetailedRole.PARTNER]: SimpleRole.BUYER, // Partners treated as buyers

    // Basic mappings
    [DetailedRole.VIEWER]: SimpleRole.VIEWER,
    [DetailedRole.GUEST]: SimpleRole.VIEWER,
  };

// Role-specific permissions
export const ROLE_PERMISSIONS: Record<SimpleRole, string[]> = {
  [SimpleRole.ADMIN]: [
    // Full access to everything
    ...PERMISSION_SETS.USER_MANAGEMENT.map(p =>
      createPermissionString(p.resource, p.action)
    ),
    ...PERMISSION_SETS.PRODUCT_MANAGEMENT.map(p =>
      createPermissionString(p.resource, p.action)
    ),
    ...PERMISSION_SETS.SALES_MANAGEMENT.map(p =>
      createPermissionString(p.resource, p.action)
    ),
    ...PERMISSION_SETS.CONTENT_MANAGEMENT.map(p =>
      createPermissionString(p.resource, p.action)
    ),
    ...PERMISSION_SETS.ANALYTICS_ACCESS.map(p =>
      createPermissionString(p.resource, p.action)
    ),

    // Additional admin-only permissions
    createPermissionString(Resource.SETTINGS, Action.MANAGE),
    createPermissionString(Resource.AUDIT_LOGS, Action.READ),
    createPermissionString(Resource.ROLES, Action.MANAGE),
    createPermissionString(Resource.PERMISSIONS, Action.MANAGE),
    createPermissionString(Resource.FINANCIAL_REPORTS, Action.READ),
    createPermissionString(Resource.BILLING, Action.MANAGE),
  ],

  [SimpleRole.SUPPLIER]: [
    ...PERMISSION_SETS.SUPPLIER_ACCESS.map(p =>
      createPermissionString(p.resource, p.action)
    ),
    ...PERMISSION_SETS.BASIC_USER.map(p =>
      createPermissionString(p.resource, p.action)
    ),

    // Additional supplier permissions
    createPermissionString(Resource.SHIPMENTS, Action.CREATE),
    createPermissionString(Resource.SHIPMENTS, Action.READ),
    createPermissionString(Resource.SHIPMENTS, Action.UPDATE),
    createPermissionString(Resource.LOGISTICS, Action.READ),
  ],

  [SimpleRole.BUYER]: [
    ...PERMISSION_SETS.BASIC_USER.map(p =>
      createPermissionString(p.resource, p.action)
    ),

    // Additional buyer permissions
    createPermissionString(Resource.RFQS, Action.CREATE),
    createPermissionString(Resource.RFQS, Action.UPDATE),
    createPermissionString(Resource.QUOTES, Action.READ),
    createPermissionString(Resource.ORDERS, Action.CREATE),
    createPermissionString(Resource.ORDERS, Action.UPDATE),
    createPermissionString(Resource.CONTRACTS, Action.READ),
    createPermissionString(Resource.INVOICES, Action.READ),
    createPermissionString(Resource.PAYMENTS, Action.CREATE),
    createPermissionString(Resource.SHIPMENTS, Action.READ),
  ],

  [SimpleRole.VIEWER]: [
    ...PERMISSION_SETS.VIEWER_ACCESS.map(p =>
      createPermissionString(p.resource, p.action)
    ),
  ],
};

// Detailed role-specific permissions (for fine-grained control)
export const DETAILED_ROLE_PERMISSIONS: Record<DetailedRole, string[]> = {
  // Super Admin - all permissions
  [DetailedRole.SUPER_ADMIN]: [
    '*:*', // Wildcard permission for everything
  ],

  // Admin - most permissions except super admin functions
  [DetailedRole.ADMIN]: ROLE_PERMISSIONS[SimpleRole.ADMIN],

  // Sales Manager
  [DetailedRole.SALES_MANAGER]: [
    ...PERMISSION_SETS.SALES_MANAGEMENT.map(p =>
      createPermissionString(p.resource, p.action)
    ),
    ...PERMISSION_SETS.ANALYTICS_ACCESS.map(p =>
      createPermissionString(p.resource, p.action)
    ),
    createPermissionString(Resource.CLIENTS, Action.MANAGE),
    createPermissionString(Resource.LEADS, Action.MANAGE),
    createPermissionString(Resource.CONTRACTS, Action.CREATE),
    createPermissionString(Resource.CONTRACTS, Action.UPDATE),
    createPermissionString(Resource.PRICING, Action.UPDATE),
  ],

  // Operations Manager
  [DetailedRole.OPERATIONS_MANAGER]: [
    ...PERMISSION_SETS.PRODUCT_MANAGEMENT.map(p =>
      createPermissionString(p.resource, p.action)
    ),
    createPermissionString(Resource.INVENTORY, Action.MANAGE),
    createPermissionString(Resource.SUPPLIERS, Action.MANAGE),
    createPermissionString(Resource.LOGISTICS, Action.MANAGE),
    createPermissionString(Resource.WAREHOUSES, Action.MANAGE),
  ],

  // Quality Manager
  [DetailedRole.QUALITY_MANAGER]: [
    createPermissionString(Resource.PRODUCTS, Action.READ),
    createPermissionString(Resource.PRODUCTS, Action.UPDATE),
    createPermissionString(Resource.QUALITY_CERTIFICATES, Action.MANAGE),
    createPermissionString(Resource.SUPPLIERS, Action.READ),
    createPermissionString(Resource.SUPPLIERS, Action.UPDATE),
    createPermissionString(Resource.INVENTORY, Action.READ),
  ],

  // Logistics Manager
  [DetailedRole.LOGISTICS_MANAGER]: [
    createPermissionString(Resource.SHIPMENTS, Action.MANAGE),
    createPermissionString(Resource.LOGISTICS, Action.MANAGE),
    createPermissionString(Resource.WAREHOUSES, Action.MANAGE),
    createPermissionString(Resource.ORDERS, Action.READ),
    createPermissionString(Resource.ORDERS, Action.UPDATE),
    createPermissionString(Resource.INVENTORY, Action.READ),
  ],

  // Finance Manager
  [DetailedRole.FINANCE_MANAGER]: [
    createPermissionString(Resource.FINANCIAL_REPORTS, Action.MANAGE),
    createPermissionString(Resource.BILLING, Action.MANAGE),
    createPermissionString(Resource.PAYMENTS, Action.MANAGE),
    createPermissionString(Resource.INVOICES, Action.MANAGE),
    createPermissionString(Resource.CONTRACTS, Action.READ),
    createPermissionString(Resource.ORDERS, Action.READ),
    createPermissionString(Resource.ANALYTICS, Action.READ),
  ],

  // Marketing Manager
  [DetailedRole.MARKETING_MANAGER]: [
    ...PERMISSION_SETS.CONTENT_MANAGEMENT.map(p =>
      createPermissionString(p.resource, p.action)
    ),
    createPermissionString(Resource.ANALYTICS, Action.READ),
    createPermissionString(Resource.LEADS, Action.MANAGE),
    createPermissionString(Resource.MARKET_REPORTS, Action.MANAGE),
  ],

  // Sales Representative
  [DetailedRole.SALES_REPRESENTATIVE]: [
    createPermissionString(Resource.RFQS, Action.READ),
    createPermissionString(Resource.RFQS, Action.UPDATE),
    createPermissionString(Resource.QUOTES, Action.CREATE),
    createPermissionString(Resource.QUOTES, Action.UPDATE),
    createPermissionString(Resource.CLIENTS, Action.READ),
    createPermissionString(Resource.CLIENTS, Action.UPDATE),
    createPermissionString(Resource.LEADS, Action.READ),
    createPermissionString(Resource.LEADS, Action.UPDATE),
    createPermissionString(Resource.PRODUCTS, Action.READ),
  ],

  // Quality Inspector
  [DetailedRole.QUALITY_INSPECTOR]: [
    createPermissionString(Resource.PRODUCTS, Action.READ),
    createPermissionString(Resource.QUALITY_CERTIFICATES, Action.CREATE),
    createPermissionString(Resource.QUALITY_CERTIFICATES, Action.READ),
    createPermissionString(Resource.QUALITY_CERTIFICATES, Action.UPDATE),
    createPermissionString(Resource.INVENTORY, Action.READ),
  ],

  // Logistics Coordinator
  [DetailedRole.LOGISTICS_COORDINATOR]: [
    createPermissionString(Resource.SHIPMENTS, Action.CREATE),
    createPermissionString(Resource.SHIPMENTS, Action.READ),
    createPermissionString(Resource.SHIPMENTS, Action.UPDATE),
    createPermissionString(Resource.LOGISTICS, Action.READ),
    createPermissionString(Resource.LOGISTICS, Action.UPDATE),
    createPermissionString(Resource.ORDERS, Action.READ),
    createPermissionString(Resource.WAREHOUSES, Action.READ),
  ],

  // Content Creator
  [DetailedRole.CONTENT_CREATOR]: [
    createPermissionString(Resource.CONTENT, Action.CREATE),
    createPermissionString(Resource.CONTENT, Action.READ),
    createPermissionString(Resource.CONTENT, Action.UPDATE),
    createPermissionString(Resource.BLOG_POSTS, Action.CREATE),
    createPermissionString(Resource.BLOG_POSTS, Action.READ),
    createPermissionString(Resource.BLOG_POSTS, Action.UPDATE),
    createPermissionString(Resource.MARKET_REPORTS, Action.CREATE),
    createPermissionString(Resource.MARKET_REPORTS, Action.READ),
    createPermissionString(Resource.MARKET_REPORTS, Action.UPDATE),
  ],

  // Customer Service
  [DetailedRole.CUSTOMER_SERVICE]: [
    createPermissionString(Resource.CLIENTS, Action.READ),
    createPermissionString(Resource.CLIENTS, Action.UPDATE),
    createPermissionString(Resource.RFQS, Action.READ),
    createPermissionString(Resource.QUOTES, Action.READ),
    createPermissionString(Resource.ORDERS, Action.READ),
    createPermissionString(Resource.ORDERS, Action.UPDATE),
    createPermissionString(Resource.PRODUCTS, Action.READ),
    createPermissionString(Resource.NOTIFICATIONS, Action.CREATE),
  ],

  // External roles
  [DetailedRole.SUPPLIER]: ROLE_PERMISSIONS[SimpleRole.SUPPLIER],
  [DetailedRole.BUYER]: ROLE_PERMISSIONS[SimpleRole.BUYER],
  [DetailedRole.PARTNER]: ROLE_PERMISSIONS[SimpleRole.BUYER],

  // Basic roles
  [DetailedRole.VIEWER]: ROLE_PERMISSIONS[SimpleRole.VIEWER],
  [DetailedRole.GUEST]: [
    createPermissionString(Resource.PRODUCTS, Action.READ),
    createPermissionString(Resource.CONTENT, Action.READ),
    createPermissionString(Resource.BLOG_POSTS, Action.READ),
  ],
};

// Helper functions
export function getSimpleRole(detailedRole: DetailedRole): SimpleRole {
  return DETAILED_TO_SIMPLE_ROLE_MAPPING[detailedRole] || SimpleRole.VIEWER;
}

export function getRolePermissions(role: SimpleRole | DetailedRole): string[] {
  if (Object.values(SimpleRole).includes(role as SimpleRole)) {
    return ROLE_PERMISSIONS[role as SimpleRole] || [];
  }

  if (Object.values(DetailedRole).includes(role as DetailedRole)) {
    return DETAILED_ROLE_PERMISSIONS[role as DetailedRole] || [];
  }

  return [];
}

export function hasRoleHierarchy(
  userRole: SimpleRole,
  requiredRole: SimpleRole
): boolean {
  const userLevel = ROLE_HIERARCHY[userRole] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
}

export function isManagerRole(role: DetailedRole): boolean {
  const managerRoles = [
    DetailedRole.SALES_MANAGER,
    DetailedRole.OPERATIONS_MANAGER,
    DetailedRole.QUALITY_MANAGER,
    DetailedRole.LOGISTICS_MANAGER,
    DetailedRole.FINANCE_MANAGER,
    DetailedRole.MARKETING_MANAGER,
  ];
  return managerRoles.includes(role);
}

export function isAdminRole(role: DetailedRole): boolean {
  return role === DetailedRole.SUPER_ADMIN || role === DetailedRole.ADMIN;
}

export function isExternalRole(role: DetailedRole): boolean {
  const externalRoles = [
    DetailedRole.SUPPLIER,
    DetailedRole.BUYER,
    DetailedRole.PARTNER,
  ];
  return externalRoles.includes(role);
}

export function isInternalRole(role: DetailedRole): boolean {
  return !isExternalRole(role) && role !== DetailedRole.GUEST;
}
