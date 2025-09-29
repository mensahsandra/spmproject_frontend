import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout, getActiveRole } from '../utils/auth';
import './ProfileDropdown.css';

interface ProfileDropdownProps {
  user?: any;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user: propUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Get user data from props or from auth utils
  const userData = propUser || getUser() || {};
  const role = (userData.role || '').toLowerCase();
  
  // Construct display name
  const honor = (userData.honorific || '').trim();
  const full = (userData.name || '').trim();
  const first = (userData.firstName || '').trim() || (full.split(' ')[0] || '');
  const last = (userData.lastName || '').trim() || (full.split(' ').slice(-1)[0] || '');
  const fullName = [honor, first, last].filter(Boolean).join(' ').trim() || 
    (role === 'lecturer' ? 'Lecturer User' : 'Student User');

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    const active = (getActiveRole() || role) as string;
    logout(active || undefined);
    // Remove any legacy single-user artifacts
    try {
      localStorage.removeItem('currentCenter');
      localStorage.removeItem('selectedCenter');
    } catch {}
    navigate(active === 'lecturer' ? '/lecturer-login' : '/student-login', { replace: true });
  };

  const handleNotifications = () => {
    navigate('/notifications?tab=notifications', { state: { from: 'notifications' } });
  };

  return (
    <div className="profile-dropdown">
      <button className="profile-button" onClick={toggleDropdown}>
        <span 
          className="profile-bell" 
          onClick={(e) => { 
            e.stopPropagation(); 
            handleNotifications(); 
          }}
        >
          🔔
        </span>
        <div className="profile-avatar">
          <img
            src="/assets/images/AugustArt.png"
            alt="Profile"
            className="profile-image"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <span className="profile-name">{fullName.split(' ')[0]}</span>
        <svg className="dropdown-arrow" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="profile-dropdown-menu">
          <div className="dropdown-header">
            <div className="user-info">
              <div className="user-name">{fullName}</div>
              <div className="user-role">{role}</div>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item">Profile Settings</button>
          <button className="dropdown-item">Change Password</button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
