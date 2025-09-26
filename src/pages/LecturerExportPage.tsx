import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ExportReports from '../components/Dashboard/ExportReports';

const LecturerExportPage: React.FC = () => {
  return (
    <DashboardLayout showGreeting maxWidth={900}>
      <ExportReports />
    </DashboardLayout>
  );
};

export default LecturerExportPage;
