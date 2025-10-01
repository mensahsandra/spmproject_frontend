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

  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'long' });
  const weekday = now.toLocaleString('en-US', { weekday: 'long' });
  const day = now.getDate();
  const year = now.getFullYear();

  const ordinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f1f5f9',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      {/* Keep the beautiful new sidebar */}
      <AcademicSidebar
        onClose={() => setSidebarOpen(false)}
        userRole={user.role}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
      
      <main style={{
        flex: 1,
        marginLeft: '240px',
        padding: '24px 40px',
        backgroundColor: '#f1f5f9',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Top Bar with Profile */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '40px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'white',
          padding: '8px 16px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <span style={{ fontSize: '18px' }}>🔔</span>
          <img 
            src={user?.profilePicture || 'https://i.pravatar.cc/40'} 
            alt="Profile" 
            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
          />
          <span style={{ fontWeight: 600, fontSize: '14px' }}>
            {user?.name?.split(' ')[0] || 'Student'}
          </span>
          <span style={{ fontSize: '12px' }}>▼</span>
        </div>

        {/* Greeting Card with Green Header */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb',
          margin: '60px 0 30px 0',
          overflow: 'hidden',
          maxWidth: '800px',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: '100%'
        }}>
          {/* Green Header */}
          <div style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            padding: '12px 20px',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 500
          }}>
            Today is {ordinal(day)} {month} {year}, {weekday}
          </div>
          
          {/* Content */}
          <div style={{
            padding: '24px 20px',
            textAlign: 'center'
          }}>
            <h2 style={{
              margin: '0 0 12px 0',
              fontSize: '24px',
              fontWeight: 600,
              color: '#1f2937'
            }}>
              Hello, {user?.name || 'Ransford Yeboah'}!
            </h2>
            <p style={{
              margin: 0,
              fontSize: '14px',
              lineHeight: 1.6,
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              Your dashboard gives quick access to attendance, grades and notifications.<br/>
              Helping you stay ahead every step of the way.
            </p>
          </div>
        </div>

        {/* Cards Container */}
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
          padding: '0 20px'
        }}>
          {/* Attendance Card */}
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              overflow: 'hidden',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onClick={() => window.location.href = '/student/record-attendance'}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: '60px',
              minWidth: '60px',
              background: 'linear-gradient(to bottom, #22c55e 0%, #22c55e 60%, #16a34a 100%)',
              display: 'flex',
              flexDirection: 'column'
            }}></div>
            <div style={{ flex: 1, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px', color: '#6b7280' }}>📋</span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                  Attendance
                </h3>
              </div>
              <hr style={{ border: 'none', height: '1px', background: '#e5e7eb', margin: '12px 0 16px 0' }} />
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: 0, 
                lineHeight: 1.5, 
                fontStyle: 'italic' 
              }}>
                Here for today's class? Click to check in and mark your attendance.
              </p>
            </div>
          </div>

          {/* Performance Card */}
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              overflow: 'hidden',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onClick={() => window.location.href = '/student/select-result'}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: '60px',
              minWidth: '60px',
              background: 'linear-gradient(to bottom, #22c55e 0%, #22c55e 60%, #16a34a 100%)',
              display: 'flex',
              flexDirection: 'column'
            }}></div>
            <div style={{ flex: 1, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px', color: '#6b7280' }}>📊</span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                  Check Performance
                </h3>
              </div>
              <hr style={{ border: 'none', height: '1px', background: '#e5e7eb', margin: '12px 0 16px 0' }} />
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: 0, 
                lineHeight: 1.5, 
                fontStyle: 'italic' 
              }}>
                Check your grades obtained for your registered courses.
              </p>
            </div>
          </div>

          {/* Deadlines Card */}
          <div 
            style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              overflow: 'hidden',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all 0.2s ease',
              width: '100%'
            }}
            onClick={() => window.location.href = '/student/notifications?tab=deadlines'}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{
              width: '60px',
              minWidth: '60px',
              background: 'linear-gradient(to bottom, #ef4444 0%, #ef4444 60%, #dc2626 100%)',
              display: 'flex',
              flexDirection: 'column'
            }}></div>
            <div style={{ flex: 1, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px', color: '#6b7280' }}>📅</span>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                  Upcoming Deadlines
                </h3>
              </div>
              <hr style={{ border: 'none', height: '1px', background: '#e5e7eb', margin: '12px 0 16px 0' }} />
              <p style={{ 
                fontSize: '14px', 
                color: '#6b7280', 
                margin: 0, 
                lineHeight: 1.5, 
                fontStyle: 'italic' 
              }}>
                Check all approaching assignment and project deadlines.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;