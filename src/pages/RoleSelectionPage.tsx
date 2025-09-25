import React from "react";
import { Link } from "react-router-dom";

const RoleSelectionPage: React.FC = () => {
    return (
        <div 
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem 1rem'
            }}
        >
            <div 
                style={{
                    backgroundColor: 'white',
                    padding: '3rem 2rem',
                    borderRadius: '20px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    maxWidth: '500px',
                    width: '100%'
                }}
            >
                <div style={{ marginBottom: '2rem' }}>
                    <img 
                        src="/assets/images/KNUST Logo.png" 
                        alt="KNUST Logo" 
                        style={{ width: '80px', height: 'auto', marginBottom: '1rem' }}
                        onError={(e) => {
                            e.currentTarget.src = "/assets/images/knust-logo.svg";
                        }}
                    />
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
                        Welcome to SPM
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                        Please select your role to continue
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link 
                        to="/login/student" 
                        style={{
                            display: 'block',
                            padding: '1rem 2rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            border: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#2563eb';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#3b82f6';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        🎓 I'm a Student
                    </Link>
                    
                    <Link 
                        to="/login/lecturer" 
                        style={{
                            display: 'block',
                            padding: '1rem 2rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            border: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#059669';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#10b981';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        👨‍🏫 I'm a Lecturer
                    </Link>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>
                        Don't have an account?
                    </p>
                    <Link 
                        to="/register" 
                        style={{
                            color: '#3b82f6',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.textDecoration = 'none';
                        }}
                    >
                        Create an Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RoleSelectionPage;