import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();

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
                            e.currentTarget.src = "/assets/images/spm-logo.svg";
                        }}
                    />
                    <div className="idl-knust-block">
                        <img
                            src="/assets/images/KNUST Logo.png"
                            alt="KNUST Logo"
                            className="knust-logo"
                            onError={(e) => {
                                e.currentTarget.src = "/assets/images/knust-logo.svg";
                            }}
                        />
                        <span className="idl-knust-text">IDL-KNUST</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Login Options */}
            <div className="right-panel">
                <div className="login-form">
                    <div className="login-header">
                        <img
                            src="/assets/images/KNUST Logo.png"
                            alt="KNUST Logo"
                            className="knust-logo-header"
                            onError={(e) => {
                                e.currentTarget.src = "/assets/images/knust-logo.svg";
                            }}
                        />
                        <h2>Student Performance Matrix</h2>
                        <p style={{ 
                            color: '#6b7280', 
                            fontSize: '14px', 
                            marginBottom: '32px',
                            textAlign: 'center'
                        }}>
                            Choose your login type to access your dashboard
                        </p>
                    </div>

                    {/* Login Type Selection */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button
                            type="button"
                            className="sign-in-btn"
                            onClick={() => navigate('/student-login')}
                            style={{
                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                border: 'none',
                                color: 'white',
                                padding: '16px 24px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            🎓 Student Login
                        </button>

                        <button
                            type="button"
                            className="sign-in-btn"
                            onClick={() => navigate('/lecturer-login')}
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                border: 'none',
                                color: 'white',
                                padding: '16px 24px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            👨‍🏫 Lecturer Login
                        </button>
                    </div>

                    {/* Help Section */}
                    <div style={{ 
                        marginTop: '32px', 
                        textAlign: 'center',
                        borderTop: '1px solid #e5e7eb',
                        paddingTop: '24px'
                    }}>
                        <p style={{ 
                            color: '#6b7280', 
                            fontSize: '13px', 
                            marginBottom: '12px' 
                        }}>
                            Need help accessing your account?
                        </p>
                        <button
                            type="button"
                            className="need-help-btn"
                            onClick={() => window.open('https://helpdesk.knust.edu.gh/', '_blank')}
                            style={{
                                background: 'transparent',
                                border: '1px solid #d1d5db',
                                color: '#6b7280',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.borderColor = '#9ca3af';
                                e.currentTarget.style.color = '#374151';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = '#d1d5db';
                                e.currentTarget.style.color = '#6b7280';
                            }}
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;