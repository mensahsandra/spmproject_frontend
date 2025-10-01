import React from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import GenerateSession from '../components/Dashboard/GenerateSession';
import ErrorBoundary from '../components/common/ErrorBoundary';

const LecturerGeneratePage: React.FC = () => {
  const location = useLocation();
  const fromNav = Boolean((location.state as any)?.fromNav);
  
  return (
    <DashboardLayout showGreeting>
      {fromNav && (
        <div className="alert alert-info" role="status" style={{ marginBottom: 12, padding: '8px 12px' }}>
          Opening Generate Session…
        </div>
      )}
      <ErrorBoundary>
        <GenerateSession />
      </ErrorBoundary>
    </DashboardLayout>
  );
};

export default LecturerGeneratePage;
