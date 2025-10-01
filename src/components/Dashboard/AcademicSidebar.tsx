import { useNavigate } from "react-router-dom";
import {
  Home,
  Grid3x3,
  BarChart3,
  Calendar,
  MapPin,
  HelpCircle,
  FileText,
  Users,
} from "lucide-react";

interface AcademicSidebarProps {
  onClose?: () => void;
  userRole?: string;
  activeItem?: string;
  onItemClick?: (itemName: string) => void;
}

export default function AcademicSidebar({ 
  onClose, 
  userRole = 'student', 
  activeItem = 'Home', 
  onItemClick 
}: AcademicSidebarProps) {
  const navigate = useNavigate();

  const studentNavigationItems = [
    { name: "Home", icon: Home, route: "/student/dashboard" },
    { name: "Attendance", icon: Grid3x3, route: "/student/record-attendance" },
    { name: "Performance", icon: BarChart3, route: "/student/select-result" },
    { name: "Deadlines", icon: Calendar, route: "/student/notifications?tab=deadlines" },
  ];

  const lecturerNavigationItems = [
    { name: "Home", icon: Home, route: "/lecturer/dashboard" },
    { name: "Generate", icon: Grid3x3, route: "/lecturer/generatesession" },
    { name: "Attendance", icon: BarChart3, route: "/lecturer/attendance" },
    { name: "Assessment", icon: FileText, route: "/lecturer/assessment" },
    { name: "Export", icon: Users, route: "/lecturer/export" },
  ];

  const otherServices = [
    { name: "Counselling", icon: MapPin, action: () => window.open('https://kcc.knust.edu.gh/', '_blank') },
    { name: userRole === 'student' ? "About Us" : "Feedback", icon: HelpCircle, action: () => {} },
  ];

  const navigationItems = userRole === 'student' ? studentNavigationItems : lecturerNavigationItems;

  const handleItemClick = (itemName: string, route?: string, action?: () => void) => {
    if (onItemClick) {
      onItemClick(itemName);
    }
    
    if (action) {
      action();
    } else if (route) {
      navigate(route);
    }
    
    // Close sidebar on mobile when item is clicked
    if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <div className="w-60 bg-[#F5F5F5] dark:bg-[#1A1A1A] flex-shrink-0 flex flex-col h-full">
      {/* IDL Logo */}
      <div className="p-4 flex justify-start border-b border-[#E0E0E0] dark:border-[#333333]">
        <img 
          src="/assets/images/KNUST IDL Logo.png" 
          alt="KNUST IDL Logo" 
          className="w-12 h-12 object-contain"
          onError={(e) => {
            // Fallback to a simple logo if image fails to load
            e.currentTarget.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'w-12 h-12 bg-[#007A3B] rounded-full flex items-center justify-center';
            fallback.innerHTML = '<span class="text-white font-bold text-lg">IDL</span>';
            e.currentTarget.parentNode?.appendChild(fallback);
          }}
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 pt-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <div key={item.name}>
                <button
                  onClick={() => handleItemClick(item.name, item.route)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#8BC34A] text-white"
                      : "text-[#333333] dark:text-white/70 hover:bg-[#EEEEEE] dark:hover:bg-white/10 active:bg-[#E0E0E0] dark:active:bg-white/15 active:scale-[0.98]"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-white" : "text-[#666666] dark:text-white/70"}
                  />
                  <span className={`font-medium text-sm ${isActive ? "text-white" : "text-[#333333] dark:text-white/70"}`}>
                    {item.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* OTHER SERVICES Divider */}
        <div className="mt-8 mb-4">
          <span className="text-xs text-[#999999] dark:text-[#777777] font-medium uppercase tracking-wider">
            OTHER SERVICES
          </span>
        </div>

        {/* Other Services Menu */}
        <div className="space-y-2">
          {otherServices.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <div key={item.name}>
                <button
                  onClick={() => handleItemClick(item.name, undefined, item.action)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#8BC34A] text-white"
                      : "text-[#333333] dark:text-white/70 hover:bg-[#EEEEEE] dark:hover:bg-white/10 active:bg-[#E0E0E0] dark:active:bg-white/15 active:scale-[0.98]"
                  }`}
                >
                  <Icon
                    size={20}
                    className={isActive ? "text-white" : "text-[#666666] dark:text-white/70"}
                  />
                  <span className={`font-medium text-sm ${isActive ? "text-white" : "text-[#333333] dark:text-white/70"}`}>
                    {item.name}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </nav>
    </div>
  );
}