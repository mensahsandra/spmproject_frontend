import React, { useEffect } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { setActiveRole } from '../utils/auth';

const StudentLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Ensure the active role is set to 'student' when using student layout
  useEffect(() => {
    setActiveRole('student');
    console.log('🎓 [StudentLayout] Active role set to student');
  }, []);

  // Use the DashboardLayout wrapper for all student pages
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
};

export default StudentLayout;
