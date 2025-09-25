import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../utils/auth';

const LecturerSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setSection = (section: string) => {
    if (location.pathname !== '/lecturer-dashboard') navigate('/lecturer-dashboard');
    window.location.hash = section;
  };
  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="logo-section" onClick={() => navigate('/lecturer-dashboard')} style={{ cursor: 'pointer' }}>
          <img src="/assets/images/KNUST IDL Logo.png" alt="IDL Logo" className="sidebar-logo" />
        </div>
        <nav className="main-nav">
          <ul>
            <li className={location.pathname === '/lecturer-dashboard' && !location.hash ? 'active' : ''} onClick={() => navigate('/lecturer-dashboard')}>🏠 Home</li>
            <li className={location.hash === '#Generate-Session-Code' ? 'active' : ''} onClick={() => setSection('Generate-Session-Code')}>🧾 Generate Session</li>
            <li className={location.hash === '#View-Attendance-Log' ? 'active' : ''} onClick={() => setSection('View-Attendance-Log')}>📋 View Attendance</li>
            <li className={location.hash === '#Update-Grade' ? 'active' : ''} onClick={() => setSection('Update-Grade')}>📝 Update Grades</li>
            <li className={location.hash === '#Export' ? 'active' : ''} onClick={() => setSection('Export')}>📤 Export</li>
          </ul>
        </nav>
      </div>
      <div className="sidebar-footer">
        <button onClick={() => { logout(); navigate('/lecturer-login'); }} className="sign-in-btn" style={{ width: '90%', margin: '10px auto' }}>Logout</button>
      </div>
    </aside>
  );
};

export default LecturerSidebar;
