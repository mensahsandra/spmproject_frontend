import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AttendanceCard.module.css';

// Simple reports icon approximating iconoir:reports-solid using three bars squares
const ReportsIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="3" width="6" height="6" fill="#757575"/>
    <rect x="9" y="9" width="6" height="10" fill="#757575"/>
    <rect x="4" y="15" width="6" height="4" fill="#757575"/>
  </svg>
);

const PerformanceCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.card}
      style={{ ['--top' as any]: '#0F793E', ['--bottom' as any]: '#53BC22' }}
      role="button"
      tabIndex={0}
      onClick={() => navigate('/select-result')}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/select-result'); }}
    >
      <div className={styles.sideBar}>
        <div className={styles.topBar}></div>
        <div className={styles.bottomBar}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <ReportsIcon />
          <h2 className={styles.title}>Check Performance</h2>
        </div>
        <hr className={styles.divider} />
        <p className={styles.subtitle}>
          Check your grades obtained for your registered courses.
        </p>
      </div>
    </div>
  );
};

export default PerformanceCard;
