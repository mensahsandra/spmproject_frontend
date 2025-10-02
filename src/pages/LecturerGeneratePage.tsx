import React from 'react';
import { useLocation } from 'react-router-dom';
import GenerateSession from '../components/Dashboard/GenerateSession';
import ErrorBoundary from '../components/common/ErrorBoundary';

const LecturerGeneratePage: React.FC = () => {
  const location = useLocation();
  const fromNav = Boolean((location.state as any)?.fromNav);
  
  return (
    <div>
      {fromNav && (
        <div className="alert alert-info" role="status" style={{ marginBottom: 12, padding: '8px 12px' }}>
          Opening Generate Session…
        </div>
      )}
      <ErrorBoundary>
        <GenerateSession />
      </ErrorBoundary>
    </div>
  );
};

export default LecturerGeneratePage;
