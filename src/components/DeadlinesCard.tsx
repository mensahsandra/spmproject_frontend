import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AttendanceCard.module.css';

// Calendar-info icon approximation with rounded square and inner glyph
const CalendarInfoIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="17" rx="3" fill="rgba(0,0,0,0.7)" />
    <rect x="6" y="8" width="12" height="1.5" fill="#fff" opacity="0.4" />
    <circle cx="9" cy="14" r="1.3" fill="#fff" />
    <rect x="11.5" y="13.2" width="5" height="1.6" fill="#fff" rx="0.8" />
  </svg>
);

const DeadlinesCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.card}
      style={{ ['--top' as any]: '#C8102E', ['--bottom' as any]: '#F00C31' }}
      role="button"
      tabIndex={0}
  onClick={() => navigate('/notifications?tab=deadlines', { state: { from: 'deadlines' } })}
  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/notifications?tab=deadlines', { state: { from: 'deadlines' } }); }}
    >
      <div className={styles.sideBar}>
        <div className={styles.topBar}></div>
        <div className={styles.bottomBar}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <CalendarInfoIcon />
          <h2 className={styles.title}>Upcoming Deadlines</h2>
        </div>
        <hr className={styles.divider} />
        <p className={styles.subtitle}>
          Check all approaching assignment and project deadlines.
        </p>
      </div>
    </div>
  );
};

export default DeadlinesCard;
