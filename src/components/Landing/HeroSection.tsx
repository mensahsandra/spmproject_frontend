import React from "react";
import { Link } from "react-router-dom";

const HeroSection: React.FC = () => {
    return (
        <section
            className="position-relative text-white"
            style={{
                backgroundImage: "url('/assets/illustration.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "100vh",
                width: "100vw",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 0,
                padding: 0,
            }}
            aria-label="Hero section showcasing the Student Performance Matrix (SPM) platform"
        >
            {/* Dark Overlay */}
            <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", zIndex: 1 }}
                aria-hidden="true"
            />

            {/* Content */}
            <div
                className="text-center position-relative"
                style={{
                    zIndex: 2,
                    padding: "2rem 1rem",
                    width: "100%",
                    maxWidth: "960px",
                    margin: "0 auto",
                }}
            >
                <h1 className="fw-bold mb-4 display-4 display-md-3">
                    Student Performance Matrix (SPM) <br /> Made Smart & Seamless
                </h1>
                <p className="lead mx-auto" style={{ maxWidth: "750px" }}>
                    Track attendance, monitor performance in real-time, and empower academic
                    decision-making — all from one unified platform.
                </p>
                <div className="mt-4 d-flex flex-wrap justify-content-center gap-3">
                    <Link 
                        to="/login/student" 
                        className="btn btn-outline-light px-5 py-3 fw-semibold"
                        style={{
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            color: 'white',
                            borderRadius: '25px',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            fontSize: '1.1rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        I'm a Student
                    </Link>
                    <Link 
                        to="/login/lecturer" 
                        className="btn btn-outline-light px-5 py-3 fw-semibold"
                        style={{
                            borderColor: 'rgba(255, 255, 255, 0.8)',
                            color: 'white',
                            borderRadius: '25px',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            fontSize: '1.1rem'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        I'm a Lecturer
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
