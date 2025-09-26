import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import endPoint from "../../utils/endpoint";
import { attemptLogin } from "../../utils/loginApi";
import { storeToken, storeRefreshToken, storeUser, setActiveRole } from '../../utils/auth';

const LecturerLoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [staffId, setStaffId] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

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
        console.log('[LecturerLogin] Submitting POST', `${endPoint}/api/auth/login`, payload);

        try {
            const variants = [ payload, { ...payload, studentId: staffId } ]; // second variant if backend reuses studentId for all users
            const { response, data, variantIndex, variantPayload } = await attemptLogin(`${endPoint}/api/auth/login`, variants, { debug: true });
            console.log('[LecturerLogin] Final attempt result', { variantIndex, variantPayload, status: response.status, body: data });
            if (response.ok && (data?.success || data?.ok)) {
                const user = {
                    ...data.user,
                    role: 'lecturer',
                    staffId: data.user?.staffId || staffId,
                    lecturerId: data.user?.lecturerId || staffId,
                };
                const role = 'lecturer';
                storeToken(role, data.token);
                if (data.refreshToken) storeRefreshToken(role, data.refreshToken);
                storeUser(role, user);
                setActiveRole(role);
                console.log("Login successful:", user);
                navigate("/lecturer-dashboard");
            } else {
                console.warn('Lecturer login failed response:', data);
                const serverMessage = data?.message || data?.error || data?.details;
                setError(serverMessage || `Login failed (${response.status}) after trying ${variantIndex + 1} variant(s)`);
            }
        } catch (error) {
            console.error("Login error (lecturer) endpoint=", endPoint, "payload=", payload, error);
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