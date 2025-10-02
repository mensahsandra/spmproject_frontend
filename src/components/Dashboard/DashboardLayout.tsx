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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        flex: 1,
        marginLeft: '250px',
        padding: '24px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        position: 'relative',
        ...style
      }}>
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          zIndex: 100
        }}>
          <ProfileDropdown />
        </div>
        <div style={{ paddingTop: '60px' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
