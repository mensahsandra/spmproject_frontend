import React from 'react';
import HeroSection from '../components/Landing/HeroSection';
import NavBar from '../components/Landing/NAV';

const LandingPage: React.FC = () => {
    return (
        <div style={{ margin: 0, padding: 0, overflow: 'hidden' }}>
            <NavBar showButtons={true} />
            <HeroSection />
        </div>
    );
};

export default LandingPage;