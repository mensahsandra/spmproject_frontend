import React, { useEffect } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { setActiveRole } from '../utils/auth';

const LecturerLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Ensure the active role is set to 'lecturer' when using lecturer layout
  useEffect(() => {
    setActiveRole('lecturer');
    console.log('👨‍🏫 [LecturerLayout] Active role set to lecturer');
  }, []);

  // Use the DashboardLayout wrapper for all lecturer pages
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default LecturerLayout;
