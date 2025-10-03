import React, { useState } from 'react';
import ProfileDropdown from '../components/ProfileDropdown';

const NewSelectResultPage: React.FC = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');

  const handleDisplayResults = () => {
    if (academicYear && semester && selectedBlock) {
      // Navigate to display-result page with selected parameters
      const params = new URLSearchParams({
        year: academicYear,
        semester: semester,
        block: selectedBlock
      });
      window.location.href = `/student/display-result?${params.toString()}`;
    } else {
      alert('Please select Academic Year, Semester, and Block');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc' 
    }}>
      {/* LIGHT GRAY SIDEBAR - SAME AS NOTIFICATIONS */}
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
              color: '#424242',
              margin: '8px 0',
              fontSize: '14px',
              minHeight: '44px',
              transition: 'background-color 0.2s'
            }}
            onClick={() => window.location.href = '/student/dashboard'}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
              fontWeight: 600,
              color: 'white',
              backgroundColor: '#8BC34A',
              margin: '8px 0',
              fontSize: '14px',
              minHeight: '44px'
            }}>
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
      <main style={{ 
        marginLeft: '250px', 
        flex: 1, 
        padding: '40px',
        maxWidth: '1000px'
      }}>
        {/* Profile Dropdown - Same as record-attendance */}
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 1001
        }}>
          <ProfileDropdown />
        </div>



        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
          marginTop: '20px'
        }}>
          <h1 style={{ 
            textAlign: 'center', 
            marginBottom: '30px', 
            color: '#1f2937',
            fontSize: '28px',
            fontWeight: 600
          }}>
            Select Academic Results
          </h1>

          {/* Selection Form */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr auto', 
            gap: '20px', 
            alignItems: 'end',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px'
          }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500,
                color: '#374151'
              }}>
                Academic Year
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
              >
                <option value="">Select Academic Year</option>
                <option value="2023-2024">2023-2024</option>
                <option value="2024-2025">2024-2025</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500,
                color: '#374151'
              }}>
                Semester
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="">Select Semester</option>
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>
            </div>
            
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 500,
                color: '#374151'
              }}>
                Select Block
              </label>
              <select
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
              >
                <option value="">Select Block</option>
                <option value="Block 1">Block 1</option>
                <option value="Block 2">Block 2</option>
                <option value="Block 3">Block 3</option>
              </select>
            </div>
            
            <div>
              <button
                onClick={handleDisplayResults}
                style={{
                  fontWeight: 700,
                  backgroundColor: '#22c55e',
                  border: 'none',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(34,197,94,0.15)',
                  transition: 'background 0.2s, transform 0.2s',
                  cursor: 'pointer'
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#16a34a')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#22c55e')}
              >
                Display Results
              </button>
            </div>
          </div>

          {/* Info Message */}
          <div style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#f0f9ff',
            borderRadius: '8px',
            border: '1px solid #0ea5e9',
            marginTop: '20px'
          }}>
            <p style={{ color: '#0369a1', margin: 0 }}>
              Select your Academic Year, Semester, and Block to view your results. 
              Each block contains 1-3 courses based on your timetable.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewSelectResultPage;