import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeadlinesCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="dashboard-card-original"
      onClick={() => navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } }); }}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-left-bar red"></div>
      <div className="card-content-original">
        <div className="card-header">
          <span className="card-icon-original">📅</span>
          <h3 className="card-title-original">Upcoming Deadlines</h3>
        </div>
        <hr className="card-divider" />
        <p className="card-description-original">
          Check all approaching assignment and project deadlines.
        </p>
      </div>
    </div>
  );
};

export default DeadlinesCard;