import React from 'react';
import Sidebar from './Sidebar';
import ProfileDropdown from '../ProfileDropdown';
import GreetingSection from './GreetingSection';
import { useShowGreeting } from '../../hooks/useShowGreeting';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showGreeting?: boolean;
  maxWidth?: number;
  style?: React.CSSProperties;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, showGreeting = false, maxWidth = 1000, style }) => {
  const shouldShowGreeting = useShowGreeting();
  const displayGreeting = showGreeting || shouldShowGreeting;

  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-content has-topbar" style={style}>
        <div className="topbar">
          <div className="topbar-left"></div>
          <div className="topbar-right">
            <ProfileDropdown />
          </div>
        </div>
        <div className="main-content">
          {displayGreeting && <GreetingSection />}
          <div style={{ maxWidth, margin: '0 auto', width: '100%', padding: '20px' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
