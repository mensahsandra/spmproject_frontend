import React from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="dashboard-card-original"
      onClick={() => navigate('/student/record-attendance')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/student/record-attendance'); }}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-left-bar green"></div>
      <div className="card-content-original">
        <div className="card-header">
          <span className="card-icon-original">📋</span>
          <h3 className="card-title-original">Attendance</h3>
        </div>
        <hr className="card-divider" />
        <p className="card-description-original">
          Here for today's class? Click to check in and mark your attendance.
        </p>
      </div>
    </div>
  );
};

export default AttendanceCard;