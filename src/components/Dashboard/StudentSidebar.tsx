import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../utils/auth';

const StudentSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const active = (p: string | RegExp) => typeof p === 'string' ? path === p : p.test(path);
  const unread = Number(localStorage.getItem('unreadNotifications') || '0');

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="logo-section" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <img src="/assets/images/KNUST IDL Logo.png" alt="IDL Logo" className="sidebar-logo" />
        </div>
        <nav className="main-nav">
          <ul>
            <li className={active('/dashboard') ? 'active' : ''} onClick={() => navigate('/dashboard')}>🏠 Home</li>
            <li className={active('/record-attendance') ? 'active' : ''} onClick={() => navigate('/record-attendance')}>📋 Attendance</li>
            <li className={active('/select-result') ? 'active' : ''} onClick={() => navigate('/select-result', { state: { showCurrent: true } })}>📊 Performance</li>
            <li className={active(/\/deadlines|^\/notifications/) ? 'active' : ''} onClick={() => navigate('/notifications?tab=deadlines', { state: { from: 'deadlines' } })}>
              📅 Deadlines {unread > 0 && <span style={{ marginLeft: 6, background: '#ef4444', color: '#fff', borderRadius: 12, padding: '0 6px', fontSize: 11 }}>{unread}</span>}
            </li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-footer">
        <button onClick={() => { logout(); navigate('/student-login'); }} className="sign-in-btn" style={{ width: '90%', margin: '10px auto' }}>Logout</button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
