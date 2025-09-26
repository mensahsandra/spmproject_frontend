import React, { useState, useEffect } from "react";
import LecturerDashboard from "../components/Dashboard/LecutererDashboardCard";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import "../css/dashboard.css";

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
                <DashboardLayout showGreeting maxWidth={900}>
                    <LecturerDashboard active={active} setActive={setActive} />
                </DashboardLayout>
            );
};

export default LecturerDashboardPage;
