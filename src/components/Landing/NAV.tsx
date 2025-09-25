// src/components/Landing/NavBar.tsx
import React from "react";
import { Link } from "react-router-dom";

interface NavBarProps {
    showButtons?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ showButtons = true }) => {
    if (!showButtons) {
        return null;
    }

    return (
        <div 
            className="position-fixed top-0 end-0 p-4" 
            style={{ zIndex: 1000 }}
        >
            <div className="d-flex gap-3">
                <Link 
                    to="/login/student" 
                    className="btn btn-outline-light px-4 py-2 fw-semibold"
                    style={{
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'white',
                        borderRadius: '25px',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    Login
                </Link>
                <Link 
                    to="/register" 
                    className="btn btn-outline-light px-4 py-2 fw-semibold"
                    style={{
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        color: 'white',
                        borderRadius: '25px',
                        transition: 'all 0.3s ease',
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    Get Started
                </Link>
            </div>
        </div>
    );
};

export default NavBar;
