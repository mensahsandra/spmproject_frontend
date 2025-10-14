import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import LecturerLoginForm from "../components/Auth/LecturerLoginForm";
import "../css/login.css";

const LecturerLoginPage: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => {
        try {
            const token = localStorage.getItem('token');
            const raw = localStorage.getItem('user');
            if (token && raw) {
                const role = (JSON.parse(raw).role || '').toLowerCase();
                if (role === 'lecturer')  {
                    navigate('/lecturer-dashboard')
                } else if (role === 'student') {
                    navigate('/dashboard');
                }                
            }
        } catch {}
    }, [navigate]);

    return (
        <div className="login-container">
            {/* Left Section: Logo and Title */}
            <div className="left-panel">
                <div className="logo-block">
                    <img
                        src="/assets/images/Student Performance Matrix.png"
                        alt="SPM Logo"
                        className="spm-logo"
                        onError={(e) => {
                            // Fallback to SVG if PNG doesn't load
                            e.currentTarget.src = "/assets/images/spm-logo.svg";
                        }}
                    />
                    <div className="idl-knust-block">
                        <img
                            src="/assets/images/KNUST Logo.png"
                            alt="KNUST Logo"
                            className="knust-logo"
                            onError={(e) => {
                                // Fallback to SVG if PNG doesn't load
                                e.currentTarget.src = "/assets/images/knust-logo.svg";
                            }}
                        />
                        <span className="idl-knust-text">IDL-KNUST</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Login Form */}
            <div className="right-panel">
                <LecturerLoginForm />
            </div>
        </div>
    );
};

export default LecturerLoginPage;