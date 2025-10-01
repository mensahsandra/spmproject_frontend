import React from 'react';
import PerformanceCard from '../components/PerformanceCard';
import DeadlinesCard from '../components/DeadlinesCard';
import AttendanceCard from '../components/AttendanceCard';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import '../css/dashboard.css';

const DashboardPage: React.FC = () => {
    return (
        <DashboardLayout showGreeting maxWidth={800}>
            <div className="cards-grid">
                <AttendanceCard />
                <PerformanceCard />
                <DeadlinesCard />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
