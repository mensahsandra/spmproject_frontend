import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import endPoint from "../../utils/endpoint";
import { storeUser, setActiveRole, storeToken, storeRefreshToken } from '../../utils/auth';

interface FormData {
    name: string;
    honorific?: string;
    email: string;
    password: string;
    role: "student" | "lecturer";
    studentId?: string;
    department?: string;
    lecturerId?: string;
    courses?: string;
}

interface RegistrationFormProps {
    defaultRole: "student" | "lecturer";
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ defaultRole }) => {
    const [formData, setFormData] = useState<FormData>({
        name: "",
    honorific: "",
        email: "",
        password: "",
        role: defaultRole,
        studentId: "",
        department: "",
        lecturerId: "",
        courses: "",
    });

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true)

        try {
        const res = await fetch(`${endPoint}/api/auth/register`,
                //"http://192.168.210.143:5000/api/auth/register",

                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
            body: JSON.stringify(formData),
                });

            if (!res.ok) {
                const { message } = await res.json();
                throw new Error(message || "Registration failed");
            }

            const data = await res.json();
            console.log("Registered:", data);

            // Persist minimal user profile locally for UI personalization (role-aware)
            try {
                const [firstName, ...rest] = (formData.name || '').trim().split(/\s+/);
                const lastName = rest.length ? rest[rest.length - 1] : '';
                const role = formData.role;
                const storedUser = {
                    name: formData.name,
                    firstName,
                    lastName,
                    honorific: formData.honorific || '',
                    email: formData.email,
                    role,
                    studentId: role === 'student' ? formData.studentId : undefined,
                    lecturerId: role === 'lecturer' ? formData.lecturerId : undefined,
                } as any;
                storeUser(role, storedUser);
                setActiveRole(role);
                if (data.token) storeToken(role, data.token);
                if (data.refreshToken) storeRefreshToken(role, data.refreshToken);
            } catch {}

            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false); // ✅ Stop loading
        }

    };

    return (
        <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
            <div className="login-header">
                <img 
                    src="/assets/images/KNUST Logo.png" 
                    alt="KNUST Logo" 
                    className="knust-logo-header"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                    onError={(e) => {
                        e.currentTarget.src = "/assets/images/knust-logo.svg";
                    }}
                />
                <h2>Register</h2>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="form-group">
                <label htmlFor="honorific">Honorific</label>
                <select
                    id="honorific"
                    name="honorific"
                    value={formData.honorific}
                    onChange={handleChange}
                >
                    <option value="">Select honorific</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Rev.">Rev.</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="role">Role</label>
                <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                >
                    <option value="student">Student</option>
                    <option value="lecturer">Lecturer</option>
                </select>
            </div>

            {/* Student-specific fields */}
            {formData.role === "student" && (
                <div className="form-group">
                    <label htmlFor="studentId">Student ID</label>
                    <input
                        type="text"
                        id="studentId"
                        name="studentId"
                        placeholder="Enter your Student ID"
                        value={formData.studentId}
                        onChange={handleChange}
                    />
                </div>
            )}

            {/* Lecturer-specific fields */}
            {formData.role === "lecturer" && (
                <div className="form-group">
                    <label htmlFor="lecturerId">Staff ID</label>
                    <input
                        type="text"
                        id="lecturerId"
                        name="lecturerId"
                        placeholder="Enter your Staff ID"
                        value={formData.lecturerId}
                        onChange={handleChange}
                    />
                </div>
            )}

            <button type="submit" className="sign-in-btn" disabled={loading}>
                {loading && (
                    <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                        style={{ marginRight: '8px' }}
                    />
                )}
                {loading ? "Registering..." : "Register"}
            </button>

            <button 
                type="button" 
                className="need-help-btn"
                onClick={() => window.location.href = '/login/student'}
            >
                Already have an account? Login
            </button>
        </form>
    );
};

export default RegistrationForm;
