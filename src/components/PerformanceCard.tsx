import React from 'react';
import { useNavigate } from 'react-router-dom';

const PerformanceCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="dashboard-card"
      onClick={() => navigate('/student/select-result')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/student/select-result'); }}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-icon performance">
        📊
      </div>
      <div className="card-content">
        <h3 className="card-title">Check Performance</h3>
        <p className="card-description">
          Check your grades obtained for your registered courses.
        </p>
      </div>
    </div>
  );
};

export default PerformanceCard;