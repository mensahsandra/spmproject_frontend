import React, { useState, useEffect } from "react";
import LecturerDashboard from "../components/Dashboard/LecutererDashboardCard";
import LecturerLayout from "../layouts/LecturerLayout";
import TopBar from '../components/Dashboard/TopBar';
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
            <LecturerLayout>
                <TopBar />
                <div style={{padding:'20px 24px', width:'100%', boxSizing:'border-box'}}>
                    <LecturerDashboard active={active} setActive={setActive} />
                </div>
            </LecturerLayout>
        );
};

export default LecturerDashboardPage;
