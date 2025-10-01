import { useState } from "react";
import { Bell, ChevronDown, Menu } from "lucide-react";

interface AcademicHeaderProps {
  onMenuClick?: () => void;
  user?: {
    name?: string;
    profilePicture?: string;
    role?: string;
    identifier?: string;
    additionalInfo?: string;
  };
  notificationCount?: number;
  onNotificationClick?: () => void;
  onLogout?: () => void;
}

export default function AcademicHeader({ 
  onMenuClick, 
  user, 
  notificationCount = 0, 
  onNotificationClick, 
  onLogout 
}: AcademicHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const formatDate = (dateStr: Date) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                   day === 2 || day === 22 ? 'nd' :
                   day === 3 || day === 23 ? 'rd' : 'th';
    
    return `Today is ${day}${suffix} ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}, ${date.toLocaleDateString('en-US', { weekday: 'long' })}`;
  };

  return (
    <div className="h-16 bg-[#007A3B] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      {/* Left side - Mobile menu button and Date */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg transition-all duration-150 hover:bg-white/10 active:bg-white/20 active:scale-95"
        >
          <Menu size={20} className="text-white" />
        </button>

        <span className="text-white text-sm font-inter hidden md:block">
          {formatDate(new Date())}
        </span>
        <span className="text-white text-sm font-inter md:hidden">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Right side - Notifications and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <button 
          onClick={onNotificationClick}
          className="relative p-2 rounded-lg transition-all duration-150 hover:bg-white/10 active:bg-white/20 active:scale-95"
        >
          <Bell size={20} className="text-white" />
          {notificationCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {notificationCount > 9 ? '9+' : notificationCount}
            </div>
          )}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg transition-all duration-150 hover:bg-white/10 active:bg-white/20 active:scale-95"
          >
            <img
              src={user?.profilePicture || 'https://i.pravatar.cc/80'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-white font-medium text-sm hidden sm:block">
              {user?.name?.split(' ')[0] || 'User'}
            </span>
            <ChevronDown size={16} className="text-white" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#262626] border border-[#E0E0E0] dark:border-[#404040] rounded-lg shadow-lg z-50">
              <div className="p-4 border-b border-[#E0E0E0] dark:border-[#404040]">
                <p className="font-medium text-[#333333] dark:text-white">{user?.name}</p>
                <p className="text-sm text-[#666666] dark:text-[#AAAAAA]">
                  {user?.role === 'student' ? `Student ID: ${user?.identifier}` : `Lecturer ID: ${user?.identifier}`}
                </p>
                <p className="text-sm text-[#666666] dark:text-[#AAAAAA]">
                  {user?.additionalInfo}
                </p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#DC2626] hover:bg-[#FEE2E2] dark:hover:bg-[#991B1B]/20 rounded transition-colors duration-150"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
}