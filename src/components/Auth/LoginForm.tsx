import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import endPoint from "../../utils/endpoint";

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [role, setRole] = useState("student");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const payload = { email, password, userId, role };
    console.log('submit handler firing (generic login)', payload);
        console.log('[LoginForm] Submitting POST', `${endPoint}/api/auth/login`, payload);

        try {
            const response = await fetch(`${endPoint}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log("Login response:", response.status, data.success ? "Success" : "Failed");

            if (data.success) {
                // Store token and user data
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                
                console.log("Login successful:", data.user);
                
                // Redirect based on role
                const userRole = (data.user?.role || '').toLowerCase();
                navigate(userRole === 'lecturer' ? "/lecturer-dashboard" : "/dashboard");
            } else {
                setError(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error (generic) endpoint=", endPoint, "payload=", payload, error);
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
                    onError={(e) => {
                        // Fallback to SVG if PNG doesn't load
                        e.currentTarget.src = "/assets/images/knust-logo.svg";
                    }}
                />
                <h2>Login</h2>
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
                <label htmlFor="role">I am a</label>
                <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-select"
                    required
                >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="user-id">
                    {role === "student" ? "Student ID" : "Staff ID"}
                </label>
                <input
                    type="text"
                    id="user-id"
                    placeholder={role === "student" ? "Enter your Student ID" : "Enter your Staff ID"}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
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

export default LoginForm;