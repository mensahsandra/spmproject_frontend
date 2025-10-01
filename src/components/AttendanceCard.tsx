import React from 'react';
import { useNavigate } from 'react-router-dom';

const AttendanceCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="dashboard-card"
      onClick={() => navigate('/student/record-attendance')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/student/record-attendance'); }}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-icon attendance">
        📋
      </div>
      <div className="card-content">
        <h3 className="card-title">Attendance</h3>
        <p className="card-description">
          Here for today's class? Click to check in and mark your attendance.
        </p>
      </div>
    </div>
  );
};

export default AttendanceCard;