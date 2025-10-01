import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import EnhancedExportReports from '../components/Dashboard/EnhancedExportReports';

const LecturerExportPage: React.FC = () => {
  return (
    <DashboardLayout showGreeting={true}>
      <EnhancedExportReports />
    </DashboardLayout>
  );
};

export default LecturerExportPage;
