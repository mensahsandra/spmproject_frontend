import React from 'react';
import ExactDashboardCard from '../components/Dashboard/ExactDashboardCard';
import ExactGreetingCard from '../components/Dashboard/ExactGreetingCard';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import '../css/dashboard.css';

const DashboardPage: React.FC = () => {
    return (
        <DashboardLayout>
            <div className="exact-dashboard-container">
                <ExactGreetingCard />
                <ExactDashboardCard 
                    title="Attendance" 
                    description="Here for today's class? Click to check in and mark your attendance."
                    icon="📋"
                    color="green"
                    navigateTo="/student/record-attendance"
                />
                <ExactDashboardCard 
                    title="Check Performance" 
                    description="Check your grades obtained for your registered courses."
                    icon="📊"
                    color="green"
                    navigateTo="/student/select-result"
                />
                <ExactDashboardCard 
                    title="Upcoming Deadlines" 
                    description="Check all approaching assignment and project deadlines."
                    icon="📅"
                    color="red"
                    navigateTo="/student/notifications?tab=deadlines"
                />
            </div>
        </DashboardLayout>
    );
};

export default DashboardPage;
