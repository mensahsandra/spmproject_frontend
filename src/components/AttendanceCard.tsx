import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AttendanceCard.module.css';

const AttendanceCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className={styles.card}
      style={{ ['--top' as any]: '#0F793E', ['--bottom' as any]: '#53BC22' }}
      onClick={() => navigate('/record-attendance')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate('/record-attendance'); }}
    >
      <div className={styles.sideBar}>
        <div className={styles.topBar}></div>
        <div className={styles.bottomBar}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.iconBadge} aria-hidden>📋</span>
          <h2 className={styles.title}>Attendance</h2>
        </div>
        <hr className={styles.divider} />
        <p className={styles.subtitle}>
          Here for today’s class? Click to check in and mark your attendance.
        </p>
      </div>
    </div>
  );
};

export default AttendanceCard;
