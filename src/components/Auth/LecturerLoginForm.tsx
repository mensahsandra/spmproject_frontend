import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiBase } from "../../utils/endpoint";
import { attemptLogin } from "../../utils/loginApi";
import { storeToken, storeRefreshToken, storeUser, setActiveRole } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';

const LecturerLoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [staffId, setStaffId] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { refresh, switchRole } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Normalize / sanitize inputs
        const normalizedEmail = email.trim().toLowerCase();
    // const normalizedStaffId = staffId.trim(); // not needed for current minimal payload
        const normalizedPassword = password.trim();
        // Start minimal: backend message only documents { email, password, studentId? } so for lecturer try without extra ids first.
        const payload = {
            email: normalizedEmail,
            password: normalizedPassword,
        };
        console.log('submit handler firing (lecturer)', payload);
        const apiBase = getApiBase();
        console.log('[LecturerLogin] Using API base:', apiBase);
        console.log('[LecturerLogin] Submitting POST', `${apiBase}/api/auth/login`, payload);

        try {
            const variants = [
                payload,
                { ...payload, studentId: staffId },
                { ...payload, staffId },
                { ...payload, lecturerId: staffId },
            ];
            const { response, data, variantIndex, variantPayload } = await attemptLogin(`${apiBase}/api/auth/login`, variants, { debug: true });
            console.log('[LecturerLogin] Final attempt result', { variantIndex, variantPayload, status: response.status, body: data });
            if (response.ok && (data?.success || data?.ok)) {
                // Use backend-provided role, but validate it's actually a lecturer
                const backendRole = (data.user?.role || '').toLowerCase();
                if (backendRole !== 'lecturer') {
                    setError("Invalid credentials. This login is for lecturers only.");
                    return;
                }
                
                const user = {
                    ...data.user,
                    role: backendRole,
                    staffId: data.user?.staffId || staffId,
                    lecturerId: data.user?.lecturerId || staffId,
                };
                const role = backendRole;
                storeToken(role, data.token);
                if (data.refreshToken) storeRefreshToken(role, data.refreshToken);
                storeUser(role, user);
                setActiveRole(role);
                switchRole(role);
                await refresh(role);
                
                // Fetch lecturer profile to get courses data
                try {
                    const { apiFetch } = await import('../../utils/api');
                    const profileData = await apiFetch('/api/auth/lecturer/profile', { 
                        method: 'GET', 
                        role: 'lecturer' 
                    });
                    
                    console.log('Profile fetch response:', profileData);
                    
                    if (profileData?.success && profileData?.lecturer) {
                        // Store profile data for components that need it
                        localStorage.setItem('profile', JSON.stringify(profileData));
                        console.log('✅ Lecturer profile stored:', profileData);
                        
                        // Also update the user data with courses if available
                        if (profileData.lecturer.courses) {
                            const updatedUser = { ...user, courses: profileData.lecturer.courses };
                            storeUser(role, updatedUser);
                            console.log('✅ User data updated with courses:', updatedUser);
                        }
                    } else {
                    }
                } catch (profileError) {
                    console.error('❌ Profile fetch error:', profileError);
                }
                
                console.log("✅ [LOGIN] Login successful:", user);
                console.log("✅ [LOGIN] Backend response data:", data);
                console.log("✅ [LOGIN] User object from backend:", data.user);
                console.log("✅ [LOGIN] About to navigate to /lecturer/dashboard");
                console.log("✅ [LOGIN] Current role:", role);
                console.log("✅ [LOGIN] Token stored:", !!data.token);
                console.log("✅ [LOGIN] User stored (legacy):", localStorage.getItem('user'));
                console.log("✅ [LOGIN] User stored (namespaced):", localStorage.getItem('user_lecturer'));
                console.log("✅ [LOGIN] Token stored (namespaced):", localStorage.getItem('token_lecturer'));
                console.log("✅ [LOGIN] Active role (session):", sessionStorage.getItem('activeRole'));
                console.log("✅ [LOGIN] All localStorage keys:", Object.keys(localStorage));
                
                // Additional debugging for role validation
                console.log("🔍 [LOGIN] Role validation check:");
                console.log("🔍 [LOGIN] - Backend role:", data.user?.role);
                console.log("🔍 [LOGIN] - Normalized role:", backendRole);
                console.log("🔍 [LOGIN] - Stored user role:", user.role);
                console.log("🔍 [LOGIN] - Staff ID from backend:", data.user?.staffId);
                console.log("🔍 [LOGIN] - Staff ID from input:", staffId);
                
                // Add a small delay to ensure storage is complete
                setTimeout(() => {
                    console.log("✅ [LOGIN] Navigating now...");
                    navigate("/lecturer/dashboard");
                }, 100);
            } else {
                console.warn('Lecturer login failed response:', data);
                const serverMessage = data?.message || data?.error || data?.details;
                setError(serverMessage || `Login failed (${response.status}) after trying ${variantIndex + 1} variant(s)`);
            }
        } catch (error) {
            console.error("Login error (lecturer) endpoint=", apiBase, "payload=", payload, error);
            setError("Network/connection error. Backend unreachable or blocked.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
    <form className="login-form" method="post" onSubmit={handleSubmit} autoComplete="off">
            <div className="login-header">
                <img 
                    src="/assets/images/KNUST Logo.png" 
                    alt="KNUST Logo" 
                    className="knust-logo-header"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                    onError={(e) => {
                        // Fallback to SVG if PNG doesn't load
                        e.currentTarget.src = "/assets/images/knust-logo.svg";
                    }}
                />
                <h2>Lecturer Login</h2>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                    type="email"
                    id="username"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                        aria-label="Show password"
                    >
                        <i className={`fa-regular ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <div className="form-group">
                <label htmlFor="staff-id">Staff ID</label>
                <input
                    type="text"
                    id="staff-id"
                    placeholder="Enter your Staff ID"
                    value={staffId}
                    onChange={(e) => setStaffId(e.target.value)}
                    required
                />
            </div>
            {/* Course field removed as requested */}

            <button type="submit" className="sign-in-btn">
                Sign In
            </button>

            <button 
                type="button" 
                className="need-help-btn"
                onClick={() => window.open('https://helpdesk.knust.edu.gh/', '_blank')}
            >
                Need Help?
            </button>
        </form>
    );
};

export default LecturerLoginForm;