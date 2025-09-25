import React from 'react';
import StudentSidebar from '../components/Dashboard/StudentSidebar';

const StudentLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="dashboard-container">
      <StudentSidebar />
      <div className="dashboard-content has-topbar">{children}</div>
    </div>
  );
};

export default StudentLayout;
