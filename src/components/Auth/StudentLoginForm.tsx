import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiBase } from "../../utils/endpoint";
import { attemptLogin } from "../../utils/loginApi";
import { storeToken, storeRefreshToken, storeUser, setActiveRole } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';

const StudentLoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [studentId, setStudentId] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { refresh, switchRole } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Normalize / sanitize inputs
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedStudentId = studentId.trim();
        const normalizedPassword = password.trim();
        const payload = { email: normalizedEmail, password: normalizedPassword, studentId: normalizedStudentId };
        
        const apiBase = getApiBase();
        console.log('submit handler firing (student)', payload);
        console.log('[StudentLogin] Using API base:', apiBase);
        console.log('[StudentLogin] Submitting POST', `${apiBase}/api/auth/login`, payload);

        try {
            // Build variants: start with original then alternative key spellings/backends.
            // Only send backend-documented fields to avoid schema rejection.
            // Backend doc (login endpoint message) says: { email, password, studentId? }
            const variants = [ payload ];
            const { response, data, variantIndex, variantPayload } = await attemptLogin(`${apiBase}/api/auth/login`, variants, { debug: true });
            console.log('[StudentLogin] Final attempt result', { variantIndex, variantPayload, status: response.status, body: data });
            if (response.ok && (data?.success || data?.ok)) {
                const user = {
                    ...data.user,
                    role: 'student',
                    studentId: data.user?.studentId || normalizedStudentId,
                };
                const role = 'student';
                storeToken(role, data.token);
                if (data.refreshToken) storeRefreshToken(role, data.refreshToken);
                storeUser(role, user);
                setActiveRole(role);
                switchRole(role);
                await refresh(role);
                console.log("Login successful:", user);
                navigate("/student/dashboard");
            } else {
                console.warn('Student login failed response:', data);
                const serverMessage = data?.message || data?.error || data?.details;
                setError(serverMessage || `Login failed (${response.status}) after trying ${variantIndex + 1} variant(s)`);
            }
        } catch (error) {
            console.error("Login error (student) endpoint=", apiBase, "payload=", payload, error);
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
                <h2>Student Login</h2>
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
                <label htmlFor="student-id">Student ID</label>
                <input
                    type="text"
                    id="student-id"
                    placeholder="Enter your Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                />
            </div>

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

export default StudentLoginForm;