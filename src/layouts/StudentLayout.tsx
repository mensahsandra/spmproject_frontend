import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

const StudentLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default StudentLayout;
