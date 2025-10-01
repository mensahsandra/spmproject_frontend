import React from 'react';
import Sidebar from './Sidebar';
import ProfileDropdown from '../ProfileDropdown';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showGreeting?: boolean;
  style?: React.CSSProperties;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, style }) => {

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main-content" style={style}>
        <div className="header-section">
          <ProfileDropdown />
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
