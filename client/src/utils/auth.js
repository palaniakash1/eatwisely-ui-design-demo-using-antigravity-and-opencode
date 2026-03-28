/**
 * =============================================================================
 * AUTH UTILITIES - Role and Permission Helpers
 * =============================================================================
 * 
 * This module provides utilities for handling user roles and permissions.
 * 
 * ROLE NAMING CONVENTION:
 * - Backend stores: 'user', 'admin', 'superAdmin', 'storeManager' (camelCase)
 * - Frontend constants: 'user', 'admin', 'superAdmin', 'storeManager' (camelCase)
 * - We NORMALIZE all incoming roles to match these conventions
 * 
 * SECURITY: Role checks are case-insensitive to handle variations from different sources
 */

export const ROLES = {
  SUPERADMIN: 'superAdmin',
  ADMIN: 'admin',
  STORE_MANAGER: 'storeManager',
  USER: 'user',
};

// Backend might return lowercase, this maps to our camelCase format
const ROLE_MAPPING = {
  'superadmin': 'superAdmin',
  'super_admin': 'superAdmin',
  'admin': 'admin',
  'storemanager': 'storeManager',
  'store_manager': 'storeManager',
  'user': 'user',
};

export const ROLE_LABELS = {
  superAdmin: 'Super Admin',
  admin: 'Admin',
  storeManager: 'Store Manager',
  user: 'User',
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPERADMIN]: [
    'create_admin',
    'create_user',
    'manage_menus',
    'manage_categories',
    'manage_reviews',
    'view_audit_log',
    'manage_restaurants',
    'view_all_users',
    'full_system_access',
  ],
  [ROLES.ADMIN]: [
    'manage_restaurant',
    'create_restaurant',
    'manage_menu_items',
    'manage_categories',
    'view_restaurant_audit_log',
    'view_users',
  ],
  [ROLES.STORE_MANAGER]: [
    'manage_food_items',
    'view_own_restaurant',
    'view_own_menu',
  ],
  [ROLES.USER]: [
    'browse_restaurants',
    'view_menus',
    'submit_reviews',
    'update_profile',
  ],
};

export const ROLE_DASHBOARD_ROUTES = {
  [ROLES.SUPERADMIN]: '/superadmin',
  [ROLES.ADMIN]: '/admin',
  [ROLES.STORE_MANAGER]: '/manager',
  [ROLES.USER]: '/user-dashboard',
};

export const hasPermission = (role, permission) => {
  if (!role || !ROLE_PERMISSIONS[role]) {
    return false;
  }
  return ROLE_PERMISSIONS[role].includes(permission);
};

export const hasAnyPermission = (role, permissions) => {
  if (!role || !ROLE_PERMISSIONS[role]) {
    return false;
  }
  return permissions.some((permission) =>
    ROLE_PERMISSIONS[role].includes(permission)
  );
};

export const getDashboardRoute = (role) => {
  return ROLE_DASHBOARD_ROUTES[role] || '/';
};

export const isRoleAccessible = (userRole, allowedRoles) => {
  if (!userRole) return false;
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole);
  }
  return userRole === allowedRoles;
};

export const getUserRole = (user) => {
  if (!user) return null;
  return user.role || user.userRole || ROLES.USER;
};

export const ADMIN_ROUTES = [
  '/superadmin',
  '/admin',
  '/manager',
];

export const isAdminRoute = (pathname) => {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
};

export const getDefaultRouteByRole = (role) => {
  switch (role) {
    case ROLES.SUPERADMIN:
      return '/superadmin';
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.STORE_MANAGER:
      return '/manager';
    case ROLES.USER:
    default:
      return '/user-dashboard';
  }
};

export const normalizeRole = (role) => {
  if (!role) return ROLES.USER;
  const normalizedRole = role.toLowerCase();
  return ROLE_MAPPING[normalizedRole] || ROLES.USER;
};
