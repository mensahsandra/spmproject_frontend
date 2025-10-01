import React from 'react';
import Sidebar from './Sidebar';
import ProfileDropdown from '../ProfileDropdown';
import GreetingSection from './GreetingSection';
import { useShowGreeting } from '../../hooks/useShowGreeting';

interface DashboardLayoutProps {
  children: React.ReactNode;
  showGreeting?: boolean;
  style?: React.CSSProperties;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, showGreeting = false, style }) => {
  const shouldShowGreeting = useShowGreeting();
  const displayGreeting = showGreeting || shouldShowGreeting;

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
