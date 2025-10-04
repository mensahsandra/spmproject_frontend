// Role validation utilities for enhanced security
import { getUser, getActiveRole, logout } from './auth';
import { normalizeRole } from './roles';

export interface RoleValidationResult {
  isValid: boolean;
  userRole: string | null;
  expectedRole: string | null;
  reason?: string;
}

/**
 * Validates if the current user has the required role
 * Performs multiple checks for security
 */
export function validateUserRole(requiredRole: string): RoleValidationResult {
  const user = getUser();
  const activeRole = getActiveRole();
  const userRole = normalizeRole(user?.role);
  const expectedRole = normalizeRole(requiredRole);
  
  // Check 1: User must exist
  if (!user) {
    return {
      isValid: false,
      userRole: null,
      expectedRole,
      reason: 'No user found'
    };
  }
  
  // Check 2: User role must match required role
  if (userRole !== expectedRole) {
    return {
      isValid: false,
      userRole,
      expectedRole,
      reason: `User role '${userRole}' does not match required role '${expectedRole}'`
    };
  }
  
  // Check 3: Active role must match user role
  if (activeRole && normalizeRole(activeRole) !== userRole) {
    return {
      isValid: false,
      userRole,
      expectedRole,
      reason: `Active role '${activeRole}' does not match user role '${userRole}'`
    };
  }
  
  return {
    isValid: true,
    userRole,
    expectedRole
  };
}

/**
 * Enforces role validation and logs out user if validation fails
 */
export function enforceRoleValidation(requiredRole: string): boolean {
  const validation = validateUserRole(requiredRole);
  
  if (!validation.isValid) {
    console.warn('Role validation failed:', validation.reason);
    
    // If user has wrong role, redirect to their correct dashboard
    // If no user or other issues, log out completely
    if (validation.userRole && validation.userRole !== validation.expectedRole) {
      // Don't logout, just redirect - handled by ProtectedRoute
      return false;
    } else {
      // Complete logout for security
      logout();
      return false;
    }
  }
  
  return true;
}

/**
 * Checks if current user can access a specific role's features
 */
export function canAccessRole(targetRole: string): boolean {
  const validation = validateUserRole(targetRole);
  return validation.isValid;
}