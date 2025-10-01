import React from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import TopBar from '../components/Dashboard/TopBar';
import GreetingSection from '../components/Dashboard/GreetingSection';
// Panel not used for the three main cards; using custom cards instead
import PerformanceCard from '../components/PerformanceCard';
import DeadlinesCard from '../components/DeadlinesCard';
import AttendanceCard from '../components/AttendanceCard';
import '../css/dashboard.css';

const DashboardPage: React.FC = () => {
    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-content has-topbar">
                <TopBar />
                {/* Greeting Card with date banner */}
                <GreetingSection />
                {/* Added spacing div */}
                <div style={{ height: "30px" }}></div>
                {/* Cards Grid */}
                <div className="cards-grid" style={{ maxWidth: "800px", margin: "0 auto" }}>
                    <AttendanceCard />
                    <div style={{ height: "8px" }}></div>
                    <PerformanceCard />
                    <div style={{ height: "8px" }}></div>
                    <DeadlinesCard />
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;