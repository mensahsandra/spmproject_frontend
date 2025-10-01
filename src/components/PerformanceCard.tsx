import React from 'react';
import { useNavigate } from 'react-router-dom';

const PerformanceCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="dashboard-card-original"
      onClick={() => navigate('/student/select-result')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/student/select-result'); }}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-left-bar green"></div>
      <div className="card-content-original">
        <div className="card-header">
          <span className="card-icon-original">📊</span>
          <h3 className="card-title-original">Check Performance</h3>
        </div>
        <hr className="card-divider" />
        <p className="card-description-original">
          Check your grades obtained for your registered courses.
        </p>
      </div>
    </div>
  );
};

export default PerformanceCard;