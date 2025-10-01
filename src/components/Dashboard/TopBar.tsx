import React from 'react';
import ProfileDropdown from '../ProfileDropdown';

const TopBar: React.FC = () => {
  return (
    <div className="topbar">
      <ProfileDropdown />
    </div>
  );
};

export default TopBar;