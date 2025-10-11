// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { dashboardPath, loginPath, normalizeRole } from '../../utils/roles';

interface ProtectedRouteProps {
    requiredRole?: string;
    children: React.ReactNode;
    redirectTo?: string;
}

import { getToken } from '../../utils/auth';
import { validateUserRole } from '../../utils/roleValidation';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, redirectTo, children }) => {
    const { user, loading, role } = useAuth();
    
    console.log('🔍 [PROTECTED-ROUTE] Checking access:', {
        requiredRole,
        user: user ? { role: user.role, name: user.name, staffId: user.staffId } : null,
        loading,
        contextRole: role,
        tokenPresent: requiredRole ? !!getToken(requiredRole) : !!getToken(),
        activeRole: sessionStorage.getItem('activeRole'),
        userStorageKeys: Object.keys(localStorage).filter(k => k.includes('user')),
        allStorageKeys: Object.keys(localStorage),
        sessionStorageKeys: Object.keys(sessionStorage)
    });

    // If loading, check if we have a token - if yes, show loading, if no, redirect
    if (loading) {
        const activeRole = normalizeRole(role || requiredRole);
        const tokenPresent = requiredRole ? !!getToken(requiredRole) : !!getToken(activeRole || undefined);
        
        if (tokenPresent) {
            // We have a token, so show loading instead of redirecting
            return (
                <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:16}}>
                    <div style={{width:60,height:60,border:'6px solid #e5e7eb',borderTopColor:'#10b981',borderRadius:'50%',animation:'spinslow 1s linear infinite'}} />
                    <div style={{fontSize:14,color:'#374151'}}>Loading dashboard...</div>
                </div>
            );
        } else {
            // No token, redirect to login
            return <Navigate to={redirectTo || loginPath(requiredRole || activeRole)} replace />;
        }
    }

    // If not logged in at all OR missing user
    const activeRole = normalizeRole(role || user?.role);
    const tokenPresent = requiredRole ? !!getToken(requiredRole) : !!getToken(activeRole || undefined);
    if (!tokenPresent || !user) {
        return <Navigate to={redirectTo || loginPath(requiredRole || activeRole)} replace />;
    }

    if (requiredRole) {
        const validation = validateUserRole(requiredRole);
        
        if (!validation.isValid) {
            console.warn('Access denied:', validation.reason);
            
            // If user has a valid role but wrong one, redirect to their dashboard
            if (validation.userRole) {
                return <Navigate to={dashboardPath(validation.userRole)} replace />;
            }
            
            // Otherwise redirect to login
            return <Navigate to={redirectTo || loginPath(requiredRole)} replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
