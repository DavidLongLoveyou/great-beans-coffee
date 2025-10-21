/**
 * Comprehensive Permission System for The Great Beans Coffee Platform
 * This file defines all permissions, resources, and actions available in the system
 */

// Resource types in the system
export enum Resource {
  // User Management
  USERS = 'users',
  ROLES = 'roles',
  PERMISSIONS = 'permissions',

  // Product Management
  PRODUCTS = 'products',
  INVENTORY = 'inventory',
  PRICING = 'pricing',
  QUALITY_CERTIFICATES = 'quality_certificates',

  // Sales & Commerce
  RFQS = 'rfqs',
  QUOTES = 'quotes',
  ORDERS = 'orders',
  CONTRACTS = 'contracts',
  INVOICES = 'invoices',

  // Client Management
  CLIENTS = 'clients',
  SUPPLIERS = 'suppliers',
  LEADS = 'leads',

  // Content Management
  CONTENT = 'content',
  BLOG_POSTS = 'blog_posts',
  MARKET_REPORTS = 'market_reports',
  ORIGIN_STORIES = 'origin_stories',

  // Analytics & Reports
  ANALYTICS = 'analytics',
  REPORTS = 'reports',
  DASHBOARDS = 'dashboards',

  // System Administration
  SETTINGS = 'settings',
  AUDIT_LOGS = 'audit_logs',
  NOTIFICATIONS = 'notifications',

  // Financial
  PAYMENTS = 'payments',
  BILLING = 'billing',
  FINANCIAL_REPORTS = 'financial_reports',

  // Logistics
  SHIPMENTS = 'shipments',
  LOGISTICS = 'logistics',
  WAREHOUSES = 'warehouses',
}

// Action types that can be performed on resources
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  EXPORT = 'export',
  IMPORT = 'import',
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
  ARCHIVE = 'archive',
  RESTORE = 'restore',
  ASSIGN = 'assign',
  UNASSIGN = 'unassign',
  MANAGE = 'manage', // Full management access
}

// Permission interface
export interface Permission {
  resource: Resource;
  action: Action;
  conditions?: PermissionCondition[];
}

// Permission conditions for fine-grained access control
export interface PermissionCondition {
  field: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'in'
    | 'not_in'
    | 'greater_than'
    | 'less_than'
    | 'contains'
    | 'starts_with'
    | 'ends_with';
  value: string | number | boolean | string[] | number[];
}

// Predefined permission sets for common use cases
export const PERMISSION_SETS = {
  // User Management Permissions
  USER_MANAGEMENT: [
    { resource: Resource.USERS, action: Action.CREATE },
    { resource: Resource.USERS, action: Action.READ },
    { resource: Resource.USERS, action: Action.UPDATE },
    { resource: Resource.USERS, action: Action.DELETE },
    { resource: Resource.ROLES, action: Action.READ },
    { resource: Resource.ROLES, action: Action.ASSIGN },
  ],

  // Product Management Permissions
  PRODUCT_MANAGEMENT: [
    { resource: Resource.PRODUCTS, action: Action.CREATE },
    { resource: Resource.PRODUCTS, action: Action.READ },
    { resource: Resource.PRODUCTS, action: Action.UPDATE },
    { resource: Resource.PRODUCTS, action: Action.DELETE },
    { resource: Resource.INVENTORY, action: Action.READ },
    { resource: Resource.INVENTORY, action: Action.UPDATE },
    { resource: Resource.PRICING, action: Action.READ },
    { resource: Resource.PRICING, action: Action.UPDATE },
    { resource: Resource.QUALITY_CERTIFICATES, action: Action.CREATE },
    { resource: Resource.QUALITY_CERTIFICATES, action: Action.READ },
    { resource: Resource.QUALITY_CERTIFICATES, action: Action.UPDATE },
  ],

  // Sales Permissions
  SALES_MANAGEMENT: [
    { resource: Resource.RFQS, action: Action.READ },
    { resource: Resource.RFQS, action: Action.UPDATE },
    { resource: Resource.RFQS, action: Action.APPROVE },
    { resource: Resource.QUOTES, action: Action.CREATE },
    { resource: Resource.QUOTES, action: Action.READ },
    { resource: Resource.QUOTES, action: Action.UPDATE },
    { resource: Resource.ORDERS, action: Action.READ },
    { resource: Resource.ORDERS, action: Action.UPDATE },
    { resource: Resource.CLIENTS, action: Action.READ },
    { resource: Resource.CLIENTS, action: Action.UPDATE },
    { resource: Resource.LEADS, action: Action.READ },
    { resource: Resource.LEADS, action: Action.UPDATE },
  ],

  // Content Management Permissions
  CONTENT_MANAGEMENT: [
    { resource: Resource.CONTENT, action: Action.CREATE },
    { resource: Resource.CONTENT, action: Action.READ },
    { resource: Resource.CONTENT, action: Action.UPDATE },
    { resource: Resource.CONTENT, action: Action.DELETE },
    { resource: Resource.CONTENT, action: Action.PUBLISH },
    { resource: Resource.CONTENT, action: Action.UNPUBLISH },
    { resource: Resource.BLOG_POSTS, action: Action.CREATE },
    { resource: Resource.BLOG_POSTS, action: Action.READ },
    { resource: Resource.BLOG_POSTS, action: Action.UPDATE },
    { resource: Resource.BLOG_POSTS, action: Action.DELETE },
    { resource: Resource.MARKET_REPORTS, action: Action.CREATE },
    { resource: Resource.MARKET_REPORTS, action: Action.READ },
    { resource: Resource.MARKET_REPORTS, action: Action.UPDATE },
  ],

  // Analytics & Reporting Permissions
  ANALYTICS_ACCESS: [
    { resource: Resource.ANALYTICS, action: Action.READ },
    { resource: Resource.REPORTS, action: Action.READ },
    { resource: Resource.REPORTS, action: Action.EXPORT },
    { resource: Resource.DASHBOARDS, action: Action.READ },
  ],

  // Basic User Permissions
  BASIC_USER: [
    { resource: Resource.PRODUCTS, action: Action.READ },
    { resource: Resource.RFQS, action: Action.CREATE },
    {
      resource: Resource.RFQS,
      action: Action.READ,
      conditions: [{ field: 'createdBy', operator: 'equals', value: 'self' }],
    },
    {
      resource: Resource.QUOTES,
      action: Action.READ,
      conditions: [{ field: 'clientId', operator: 'equals', value: 'self' }],
    },
    {
      resource: Resource.ORDERS,
      action: Action.READ,
      conditions: [{ field: 'clientId', operator: 'equals', value: 'self' }],
    },
    { resource: Resource.CONTENT, action: Action.READ },
    { resource: Resource.BLOG_POSTS, action: Action.READ },
    { resource: Resource.MARKET_REPORTS, action: Action.READ },
  ],

  // Supplier Permissions
  SUPPLIER_ACCESS: [
    { resource: Resource.PRODUCTS, action: Action.CREATE },
    { resource: Resource.PRODUCTS, action: Action.READ },
    {
      resource: Resource.PRODUCTS,
      action: Action.UPDATE,
      conditions: [{ field: 'supplierId', operator: 'equals', value: 'self' }],
    },
    { resource: Resource.INVENTORY, action: Action.READ },
    {
      resource: Resource.INVENTORY,
      action: Action.UPDATE,
      conditions: [{ field: 'supplierId', operator: 'equals', value: 'self' }],
    },
    { resource: Resource.RFQS, action: Action.READ },
    { resource: Resource.QUOTES, action: Action.CREATE },
    { resource: Resource.QUOTES, action: Action.READ },
    {
      resource: Resource.QUOTES,
      action: Action.UPDATE,
      conditions: [{ field: 'supplierId', operator: 'equals', value: 'self' }],
    },
    { resource: Resource.ORDERS, action: Action.READ },
    {
      resource: Resource.ORDERS,
      action: Action.UPDATE,
      conditions: [{ field: 'supplierId', operator: 'equals', value: 'self' }],
    },
    { resource: Resource.QUALITY_CERTIFICATES, action: Action.CREATE },
    { resource: Resource.QUALITY_CERTIFICATES, action: Action.READ },
    {
      resource: Resource.QUALITY_CERTIFICATES,
      action: Action.UPDATE,
      conditions: [{ field: 'supplierId', operator: 'equals', value: 'self' }],
    },
  ],

  // Viewer Permissions (Read-only access)
  VIEWER_ACCESS: [
    { resource: Resource.PRODUCTS, action: Action.READ },
    { resource: Resource.INVENTORY, action: Action.READ },
    { resource: Resource.PRICING, action: Action.READ },
    { resource: Resource.RFQS, action: Action.READ },
    { resource: Resource.QUOTES, action: Action.READ },
    { resource: Resource.ORDERS, action: Action.READ },
    { resource: Resource.CLIENTS, action: Action.READ },
    { resource: Resource.CONTENT, action: Action.READ },
    { resource: Resource.ANALYTICS, action: Action.READ },
    { resource: Resource.REPORTS, action: Action.READ },
  ],
} as const;

// Helper function to create a permission string
export function createPermissionString(
  resource: Resource,
  action: Action
): string {
  return `${action}:${resource}`;
}

// Helper function to parse a permission string
export function parsePermissionString(
  permissionString: string
): { resource: Resource; action: Action } | null {
  const [action, resource] = permissionString.split(':');

  if (!action || !resource) return null;

  if (
    !Object.values(Action).includes(action as Action) ||
    !Object.values(Resource).includes(resource as Resource)
  ) {
    return null;
  }

  return {
    action: action as Action,
    resource: resource as Resource,
  };
}

// Helper function to check if a permission matches a pattern
export function matchesPermissionPattern(
  permission: string,
  pattern: string
): boolean {
  // Support wildcards like "read:*" or "*:products"
  const permissionParts = permission.split(':');
  const patternParts = pattern.split(':');

  if (permissionParts.length !== 2 || patternParts.length !== 2) {
    return false;
  }

  const [permAction, permResource] = permissionParts;
  const [patternAction, patternResource] = patternParts;

  const actionMatches = patternAction === '*' || patternAction === permAction;
  const resourceMatches =
    patternResource === '*' || patternResource === permResource;

  return actionMatches && resourceMatches;
}

// Export all permissions as strings for easy use
export const PERMISSIONS = {
  // User Management
  CREATE_USERS: createPermissionString(Resource.USERS, Action.CREATE),
  READ_USERS: createPermissionString(Resource.USERS, Action.READ),
  UPDATE_USERS: createPermissionString(Resource.USERS, Action.UPDATE),
  DELETE_USERS: createPermissionString(Resource.USERS, Action.DELETE),

  // Product Management
  CREATE_PRODUCTS: createPermissionString(Resource.PRODUCTS, Action.CREATE),
  READ_PRODUCTS: createPermissionString(Resource.PRODUCTS, Action.READ),
  UPDATE_PRODUCTS: createPermissionString(Resource.PRODUCTS, Action.UPDATE),
  DELETE_PRODUCTS: createPermissionString(Resource.PRODUCTS, Action.DELETE),

  // RFQ Management
  CREATE_RFQS: createPermissionString(Resource.RFQS, Action.CREATE),
  READ_RFQS: createPermissionString(Resource.RFQS, Action.READ),
  UPDATE_RFQS: createPermissionString(Resource.RFQS, Action.UPDATE),
  DELETE_RFQS: createPermissionString(Resource.RFQS, Action.DELETE),
  APPROVE_RFQS: createPermissionString(Resource.RFQS, Action.APPROVE),

  // Content Management
  CREATE_CONTENT: createPermissionString(Resource.CONTENT, Action.CREATE),
  READ_CONTENT: createPermissionString(Resource.CONTENT, Action.READ),
  UPDATE_CONTENT: createPermissionString(Resource.CONTENT, Action.UPDATE),
  DELETE_CONTENT: createPermissionString(Resource.CONTENT, Action.DELETE),
  PUBLISH_CONTENT: createPermissionString(Resource.CONTENT, Action.PUBLISH),

  // Analytics
  READ_ANALYTICS: createPermissionString(Resource.ANALYTICS, Action.READ),
  READ_REPORTS: createPermissionString(Resource.REPORTS, Action.READ),
  EXPORT_REPORTS: createPermissionString(Resource.REPORTS, Action.EXPORT),

  // Settings
  READ_SETTINGS: createPermissionString(Resource.SETTINGS, Action.READ),
  UPDATE_SETTINGS: createPermissionString(Resource.SETTINGS, Action.UPDATE),
} as const;
