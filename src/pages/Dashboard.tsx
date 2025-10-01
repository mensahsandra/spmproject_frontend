import React from 'react';
import Sidebar from '../components/Dashboard/Sidebar';
import TopBar from '../components/Dashboard/TopBar';
import SimpleGreetingCard from '../components/SimpleGreetingCard';
import SimpleAttendanceCard from '../components/SimpleAttendanceCard';
import SimplePerformanceCard from '../components/SimplePerformanceCard';
import SimpleDeadlinesCard from '../components/SimpleDeadlinesCard';
import '../css/dashboard.css';

const DashboardPage: React.FC = () => {
    return (
        <div className="dashboard">
            <Sidebar />
            <main className="dashboard-content has-topbar">
                <TopBar />
                {/* Greeting Card with date banner */}
                <SimpleGreetingCard />
                {/* Added spacing div */}
                <div style={{ height: "30px" }}></div>
                {/* Cards Grid */}
                <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>
                    <SimpleAttendanceCard />
                    <div style={{ height: "8px" }}></div>
                    <SimplePerformanceCard />
                    <div style={{ height: "8px" }}></div>
                    <SimpleDeadlinesCard />
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;