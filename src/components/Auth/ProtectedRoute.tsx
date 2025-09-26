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

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, redirectTo, children }) => {
    const { user, loading, role } = useAuth();

    if (loading) return null; // AuthProvider already shows splash

    // If not logged in at all OR missing user
    const activeRole = normalizeRole(role || user?.role);
    const tokenPresent = requiredRole ? !!getToken(requiredRole) : !!getToken(activeRole || undefined);
    if (!tokenPresent || !user) {
        return <Navigate to={redirectTo || loginPath(requiredRole || activeRole)} replace />;
    }

    if (requiredRole) {
        const userRole = normalizeRole(user?.role);
        if (userRole !== normalizeRole(requiredRole)) {
            return <Navigate to={dashboardPath(userRole)} replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
