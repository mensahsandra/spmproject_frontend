import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import GenerateSession from '../components/Dashboard/GenerateSession';
import ErrorBoundary from '../components/common/ErrorBoundary';

const LecturerGeneratePage: React.FC = () => {
  const location = useLocation();
  const fromNav = Boolean((location.state as any)?.fromNav);
  
  console.log('LecturerGeneratePage rendered', { location, fromNav });
  
  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      <div style={{ 
        position: 'fixed', 
        top: 50, 
        left: 10, 
        background: 'red', 
        color: 'white', 
        padding: '5px', 
        zIndex: 9999 
      }}>
        LecturerGeneratePage Loaded!
      </div>
      <DashboardLayout showGreeting maxWidth={900}>
        {fromNav && (
          <div className="alert alert-info" role="status" style={{ marginBottom: 12, padding: '8px 12px' }}>
            Opening Generate Session…
          </div>
        )}
        <ErrorBoundary>
          <GenerateSession />
        </ErrorBoundary>
      </DashboardLayout>
    </div>
  );
};

export default LecturerGeneratePage;
