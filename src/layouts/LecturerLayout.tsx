import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

const LecturerLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  
  // For the main dashboard page, don't wrap with DashboardLayout since it has its own layout
  if (location.pathname === '/lecturer/dashboard') {
    return <>{children}</>;
  }
  
  // For other pages, use the DashboardLayout wrapper
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default LecturerLayout;
