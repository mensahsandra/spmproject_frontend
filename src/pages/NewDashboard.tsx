import React, { useState, useEffect } from 'react';
import { getUser } from '../utils/auth';

const NewDashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getUser();
    if (userData) {
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

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F3F3]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007A3B] mx-auto mb-4"></div>
          <p className="text-[#666666]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F3F3F3]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#333333] mb-4">Welcome to KNUST IDL</h1>
          <p className="text-[#666666] mb-6">Please log in to access your dashboard</p>
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* LIGHT GRAY SIDEBAR - EXACTLY LIKE NOTIFICATIONS */}
      <aside style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '250px',
        height: '100vh',
        backgroundColor: '#F5F5F5',
        color: '#424242',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        borderRight: '1px solid #E0E0E0',
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        {/* Logo Section */}
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          borderBottom: '1px solid #E0E0E0' 
        }}>
          <img 
            src="/assets/images/KNUST IDL Logo.png" 
            alt="KNUST IDL Logo" 
            style={{ maxWidth: '120px', height: 'auto' }}
            onError={(e) => {
              e.currentTarget.src = "/assets/images/KNUST Logo.png";
            }}
          />
        </div>
        
        {/* Navigation */}
        <nav style={{ padding: '20px 0', flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: 600,
              color: 'white',
              backgroundColor: '#8BC34A',
              margin: '8px 0',
              fontSize: '14px',
              minHeight: '44px'
            }}
            onClick={() => window.location.href = '/student/dashboard'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
              <span>Home</span>
            </li>
            
            <li style={{
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#424242',
              margin: '8px 0',
              fontSize: '14px',
              minHeight: '44px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => window.location.href = '/student/record-attendance'}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
              </svg>
              <span>Attendance</span>
            </li>
            
            <li style={{
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#424242',
              margin: '8px 0',
              fontSize: '14px',
              minHeight: '44px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => window.location.href = '/student/select-result'}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
              </svg>
              <span>Performance</span>
            </li>
            
            <li style={{
              padding: '12px 20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              color: '#424242',
              margin: '8px 0',
              fontSize: '14px',
              minHeight: '44px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => window.location.href = '/student/notifications?tab=deadlines'}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <span>Deadlines</span>
            </li>
          </ul>
        </nav>
        
        {/* Other Services */}
        <div style={{ marginTop: 'auto', padding: '20px 0' }}>
          <div style={{ 
            height: '1px', 
            background: '#E0E0E0', 
            margin: '0 20px 20px' 
          }}></div>
          <div style={{ 
            color: '#9E9E9E', 
            fontSize: '11px', 
            fontWeight: 600, 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            padding: '0 20px 16px' 
          }}>
            OTHER SERVICES
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ 
              padding: '10px 20px', 
              fontSize: '14px', 
              color: '#424242', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => window.open('https://kcc.knust.edu.gh/', '_blank')}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,2A2,2 0 0,1 14,4A2,2 0 0,1 12,6A2,2 0 0,1 10,4A2,2 0 0,1 12,2M21,9V7L15,1H5C3.89,1 3,1.89 3,3V7H9V9H3V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V9M7,15V17H17V15H7Z"/>
              </svg>
              <span>Counselling</span>
            </li>
            <li style={{ 
              padding: '10px 20px', 
              fontSize: '14px', 
              color: '#424242', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
              </svg>
              <span>About Us</span>
            </li>
          </ul>
        </div>
      </aside>
      
      {/* Main Content */}
      <main style={{ marginLeft: '250px', flex: 1, padding: '20px' }}>
        {/* SUCCESS INDICATOR */}
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          background: '#22c55e', 
          color: 'white', 
          padding: '8px 12px', 
          fontSize: '12px', 
          fontWeight: 600,
          borderRadius: '6px',
          zIndex: 9999,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          ✅ LIGHT SIDEBAR SUCCESS!
        </div>
        
        <div style={{
          backgroundColor: '#f1f5f9',
          minHeight: '100vh',
          padding: '20px',
          fontFamily: "'Segoe UI', sans-serif"
        }}>
          {/* Greeting Card */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            margin: '20px 0 30px 0',
            overflow: 'hidden',
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '100%'
          }}>
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
                Hello, {user?.name || 'Student'}!
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

          {/* Dashboard Cards */}
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Attendance Card */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
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
                background: 'linear-gradient(to bottom, #22c55e 0%, #22c55e 60%, #16a34a 100%)'
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
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
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
                background: 'linear-gradient(to bottom, #22c55e 0%, #22c55e 60%, #16a34a 100%)'
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
            <div style={{
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e5e7eb',
              display: 'flex',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
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
                background: 'linear-gradient(to bottom, #ef4444 0%, #ef4444 60%, #dc2626 100%)'
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
        </div>
      </main>
    </div>
  );
};

export default NewDashboard;