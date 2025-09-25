// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
    const tokenPresent = requiredRole ? !!getToken(requiredRole) : !!getToken(role || undefined || undefined);
    if (!tokenPresent || !user) {
        return <Navigate to={redirectTo || "/student-login"} replace />;
    }

    // If a role is required, check stored user
    if (requiredRole) {
        try {
            const role = (user?.role || "").toLowerCase();
            if (role !== requiredRole.toLowerCase()) {
                if (role === "student") return <Navigate to="/dashboard" replace />;
                if (role === "lecturer") return <Navigate to="/lecturer-dashboard" replace />;
                return <Navigate to={redirectTo || "/student-login"} replace />;
            }
        } catch {
            return <Navigate to={redirectTo || "/student-login"} replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;
