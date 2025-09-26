import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import AttendanceLogs from '../components/Dashboard/AttendanceLogs';

const LecturerAttendancePage: React.FC = () => {
  return (
    <DashboardLayout showGreeting maxWidth={900}>
      <AttendanceLogs />
    </DashboardLayout>
  );
};

export default LecturerAttendancePage;
