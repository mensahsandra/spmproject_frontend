import React from 'react';
import Sidebar from './Sidebar';
import ProfileDropdown from '../ProfileDropdown';
import GreetingSection from './GreetingSection';
import { useShowGreeting } from '../../hooks/useShowGreeting';

interface NewDashboardLayoutProps {
  children: React.ReactNode;
  showGreeting?: boolean;
  maxWidth?: number;
  style?: React.CSSProperties;
}

const NewDashboardLayout: React.FC<NewDashboardLayoutProps> = ({ 
  children, 
  showGreeting = false, 
  maxWidth = 1000, 
  style 
}) => {
  const shouldShowGreeting = useShowGreeting();
  const displayGreeting = showGreeting || shouldShowGreeting;

  return (
    <div className="new-dashboard-layout">
      <Sidebar />
      <main className="new-dashboard-content">
        {/* Top Bar with Profile */}
        <div className="new-topbar">
          <ProfileDropdown />
        </div>
        
        {/* Main Content Area */}
        <div className="new-main-content">
          {displayGreeting && <GreetingSection />}
          <div className="new-content-wrapper" style={{ maxWidth }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewDashboardLayout;