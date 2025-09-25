// src/pages/LandingPage.tsx
import React from "react";
import NavBar from "../components/Landing/NAV";
import HeroSection from "../components/Landing/HeroSection";

const LandingPage: React.FC = () => {
    return (
        <div>
            {/* Navbar */}
            <NavBar showButtons={true} />

            {/* Fullscreen Hero */}
            <HeroSection />

            {/* CTA Section Below Hero */}
            {/* <section className="py-5 bg-light">
                <div className="container text-center">
                    <CTAButtons />
                </div>
            </section> */}
        </div>
    );
};

export default LandingPage;
