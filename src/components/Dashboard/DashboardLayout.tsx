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
        padding: '24px 40px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        position: 'relative',
        ...style
      }}>
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '40px',
          zIndex: 100
        }}>
          <ProfileDropdown />
        </div>
        <div style={{ 
          paddingTop: '60px',
          width: '100%',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
