import React from "react";
import { useLocation } from "react-router-dom";
import RegisterForm from "../components/Auth/RegistrationForm";
import "../css/login.css";

const RegisterPage: React.FC = () => {
    const query = new URLSearchParams(useLocation().search);
    const defaultRole = query.get("role") === "lecturer" ? "lecturer" : "student";

    return (
        <div className="login-container">
            {/* Left Section: Logo and Description */}
            <div className="left-panel" style={{ flex: '0 0 30%' }}>
                <div className="logo-block">
                    <img
                        src="/assets/images/Student Performance Matrix.png"
                        alt="SPM Logo"
                        className="spm-logo"
                        onError={(e) => {
                            e.currentTarget.src = "/assets/images/spm-logo.svg";
                        }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p style={{ fontSize: '1rem', color: '#666', lineHeight: '1.5' }}>
                            Sign up to access and track performance data.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Section: Registration Form */}
            <div className="right-panel" style={{ flex: '0 0 70%', overflowY: 'auto', maxHeight: '100vh' }}>
                <RegisterForm defaultRole={defaultRole} />
            </div>
        </div>
    );
};

export default RegisterPage;
