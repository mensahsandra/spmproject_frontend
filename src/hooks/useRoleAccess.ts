import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateUserRole, canAccessRole } from '../utils/roleValidation';
import { normalizeRole } from '../utils/roles';

/**
 * Hook for role-based access control
 */
export function useRoleAccess() {
  const { user, role } = useAuth();
  
  const currentRole = useMemo(() => {
    return normalizeRole(role || user?.role);
  }, [role, user?.role]);
  
  const hasRole = useMemo(() => {
    return (requiredRole: string) => {
      return canAccessRole(requiredRole);
    };
  }, []);
  
  const validateRole = useMemo(() => {
    return (requiredRole: string) => {
      return validateUserRole(requiredRole);
    };
  }, []);
  
  const isStudent = useMemo(() => currentRole === 'student', [currentRole]);
  const isLecturer = useMemo(() => currentRole === 'lecturer', [currentRole]);
  
  return {
    currentRole,
    hasRole,
    validateRole,
    isStudent,
    isLecturer,
    user
  };
}