import React from 'react';
import Sidebar from './Sidebar';
import ProfileDropdown from '../ProfileDropdown';
import '../../css/assessment.css';

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
        padding: '20px 40px 20px 20px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh',
        maxHeight: '100vh',
        position: 'relative',
        overflow: 'auto',
        overflowX: 'hidden',
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #f1f1f1',
        ...style
      }}
      className="custom-scrollbar">
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '40px',
          zIndex: 1002
        }}>
          <ProfileDropdown />
        </div>
        <div style={{ 
          paddingTop: '40px',
          width: '100%',
          maxWidth: '1100px',
          margin: '0 20px 0 0',
          marginLeft: '0px',
          paddingBottom: '40px'
        }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
