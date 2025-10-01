import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeadlinesCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="dashboard-card"
      onClick={() => navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } }); }}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-icon deadlines">
        📅
      </div>
      <div className="card-content">
        <h3 className="card-title">Upcoming Deadlines</h3>
        <p className="card-description">
          Check all approaching assignment and project deadlines.
        </p>
      </div>
    </div>
  );
};

export default DeadlinesCard;