import React from 'react';
import Panel from '../components/Dashboard/Panel';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import '../css/dashboard.css';

const DashboardPage: React.FC = () => {
    return (
        <DashboardLayout showGreeting maxWidth={800}>
            <div className="panels">
                <Panel 
                    title="Attendance" 
                    description="Here for today's class? Click to check in and mark your attendance."
                    endpoint="/api/attendance"
                    icon="📋"
                />
                <Panel 
                    title="Check Performance" 
                    description="Check your grades obtained for your registered courses."
                    endpoint="/api/performance"
                    icon="📊"
                />
                <Panel 
                    title="Upcoming Deadlines" 
                    description="Check all approaching assignment and project deadlines."
                    endpoint="/api/deadlines"
                    icon="📅"
                />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
