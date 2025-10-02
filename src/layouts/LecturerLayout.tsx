import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

const LecturerLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Use the DashboardLayout wrapper for all lecturer pages
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default LecturerLayout;
