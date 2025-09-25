import React from "react";
import LoginForm from "../components/Auth/LoginForm";
import NavBar from "../components/Landing/NAV";
import "../css/login.css";

const LoginPage: React.FC = () => {
    return (
        <div className="login-container">
            <NavBar />
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
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;