import React, { useState, useEffect } from 'react';
import { getUser, logout } from '../utils/auth';
import AcademicSidebar from '../components/Dashboard/AcademicSidebar';
import AcademicHeader from '../components/Dashboard/AcademicHeader';
import StudentDashboard from '../components/Dashboard/StudentDashboard';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Home");
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from your existing auth system
    const userData = getUser();
    if (userData) {
      // Transform your existing user data to match the new component interface
      const transformedUser = {
        userId: userData.id || userData.studentId || userData.lecturerId,
        name: userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        email: userData.email,
        role: userData.role?.toLowerCase() || 'student',
        profilePicture: userData.profilePicture || `https://i.pravatar.cc/150?u=${userData.email}`,
        identifier: userData.studentId || userData.lecturerId || userData.id,
        additionalInfo: userData.department || userData.course || 'Student',
      };
      setUser(transformedUser);
    }
    setIsLoading(false);
  }, []);

  // Mock dashboard data - replace with your actual API calls
  const dashboardData = {
    stats: {
      totalAttended: 24,
      coursesEnrolled: 6,
      unreadNotifications: 3,
    },
    notifications: [
      {
        id: '1',
        title: 'Assignment Due Soon',
        message: 'Computer Networks assignment is due in 2 days',
        priority: 'urgent' as const,
        daysLeft: 2,
      },
      {
        id: '2',
        title: 'Exam Schedule Released',
        message: 'Mid-semester exam schedule has been published',
        priority: 'normal' as const,
        daysLeft: 7,
      },
    ],
  };

  const handleLogout = () => {
    logout(); // Use your existing logout function
    window.location.href = '/student-login'; // Redirect to your login page
  };

  const handleNotificationClick = () => {
    setActiveItem("Deadlines");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007A3B] mx-auto mb-4"></div>
          <p className="text-[#666666] dark:text-[#AAAAAA]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F3F3] dark:bg-[#0A0A0A]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#333333] dark:text-white mb-4">
            Welcome to KNUST IDL
          </h1>
          <p className="text-[#666666] dark:text-[#AAAAAA] mb-6">
            Please log in to access your dashboard
          </p>
          <button
            onClick={() => (window.location.href = "/student-login")}
            className="px-6 py-3 bg-[#007A3B] text-white rounded-lg hover:bg-[#006530] transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F3F3F3] dark:bg-[#0A0A0A]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive: hidden on mobile, toggleable via overlay */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <AcademicSidebar
          onClose={() => setSidebarOpen(false)}
          userRole={user.role}
          activeItem={activeItem}
          onItemClick={setActiveItem}
        />
      </div>

      {/* Main content area - Takes remaining width, contains header and main sections */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Fixed top bar spanning full width of main content area */}
        <AcademicHeader
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          notificationCount={dashboardData?.stats?.unreadNotifications || 0}
          onNotificationClick={handleNotificationClick}
          onLogout={handleLogout}
        />

        {/* Content area below header - Scrollable, contains main dashboard sections */}
        <div className="flex-1 overflow-y-auto">
          <StudentDashboard user={user} data={dashboardData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;