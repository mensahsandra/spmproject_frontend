import React from 'react';
import LecturerSidebar from '../components/Dashboard/LecturerSidebar';

const LecturerLayout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <div className="dashboard-container">
      <LecturerSidebar />
      <div className="dashboard-content has-topbar">{children}</div>
    </div>
  );
};

export default LecturerLayout;
