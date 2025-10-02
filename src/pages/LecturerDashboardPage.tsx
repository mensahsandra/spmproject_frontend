import React, { useState, useEffect } from "react";
import LecturerDashboard from "../components/Dashboard/LecutererDashboardCard";

const LecturerDashboardPage: React.FC = () => {
    const [active, setActive] = useState<string>("");

    // Sync with hash navigation from sidebar
    useEffect(() => {
        const applyHash = () => {
            const h = window.location.hash.replace('#','');
            setActive(h);
        };
        applyHash();
        window.addEventListener('hashchange', applyHash);
        return () => window.removeEventListener('hashchange', applyHash);
    }, []);
    
    return (
        <LecturerDashboard active={active} />
    );
};

export default LecturerDashboardPage;
