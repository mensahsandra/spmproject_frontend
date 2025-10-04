import React from 'react';
import { canAccessRole } from '../../utils/roleValidation';

interface RoleGuardProps {
  requiredRole: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component-level role guard that hides content if user doesn't have required role
 */
const RoleGuard: React.FC<RoleGuardProps> = ({ 
  requiredRole, 
  children, 
  fallback = null 
}) => {
  const hasAccess = canAccessRole(requiredRole);
  
  if (!hasAccess) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export default RoleGuard;