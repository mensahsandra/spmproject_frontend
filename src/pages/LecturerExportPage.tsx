import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import EnhancedExportReports from '../components/Dashboard/EnhancedExportReports';

const LecturerExportPage: React.FC = () => {
  return (
    <DashboardLayout showGreeting={true} maxWidth={1200}>
      <EnhancedExportReports />
    </DashboardLayout>
  );
};

export default LecturerExportPage;
