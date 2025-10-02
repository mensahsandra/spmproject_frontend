import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

const StudentLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Use the DashboardLayout wrapper for all student pages
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default StudentLayout;
