import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import endPoint from "../../utils/endpoint";
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

        const payload = {
            email,
            password,
            staffId,
            userId: staffId,
            lecturerId: staffId,
        };
    console.log('submit handler firing (lecturer)', payload);
        console.log('[LecturerLogin] Submitting POST', `${endPoint}/api/auth/login`, payload);

        try {
    const response = await fetch(`${endPoint}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

    if (response.ok && (data.success || data.ok)) {
        // Merge/augment user with staff and course if not provided by backend
    const user = {
            ...data.user,
            role: 'lecturer', // force lecturer role for this form
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
        setError(data.message || data.error || `Login failed (${response.status})`);
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Network error. Please check if the backend server is running.");
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