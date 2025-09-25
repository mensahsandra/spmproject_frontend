import React from 'react';
import PerformanceCard from '../components/PerformanceCard';
import DeadlinesCard from '../components/DeadlinesCard';
import AttendanceCard from '../components/AttendanceCard';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import '../css/dashboard.css';

const DashboardPage: React.FC = () => {
    return (
        <DashboardLayout showGreeting maxWidth={800}>
            <div className="cards-grid" style={{ maxWidth: "800px", margin: "0 auto" }}>
                <AttendanceCard />
                <div style={{ height: "8px" }}></div>
                <PerformanceCard />
                <div style={{ height: "8px" }}></div>
                <DeadlinesCard />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
