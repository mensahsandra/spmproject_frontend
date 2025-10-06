import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import ProfileDropdown from '../components/ProfileDropdown';

const NewSelectResultPage: React.FC = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');

  const handleDisplayResults = () => {
    console.log('Form values:', { academicYear, semester, selectedBlock }); // Debug log
    
    if (!academicYear) {
      alert('Please select an Academic Year');
      return;
    }
    if (!semester) {
      alert('Please select a Semester');
      return;
    }
    if (!selectedBlock) {
      alert('Please select a Block');
      return;
    }

    // Navigate to display-result page with selected parameters
    const params = new URLSearchParams({
      year: academicYear,
      semester: semester,
      block: selectedBlock
    });
    
    console.log('Navigating to:', `/student/display-result?${params.toString()}`); // Debug log
    window.location.href = `/student/display-result?${params.toString()}`;
  };

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc' 
    }}>
      {/* SIDEBAR */}
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
              <Clock size={20} />
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
                <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z"/>
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

      {/* Main Content Area */}
      <main style={{
        marginLeft: '250px',
        flex: 1,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        {/* Profile Dropdown - Fixed Position */}
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          zIndex: 1001
        }}>
          <ProfileDropdown />
        </div>

        {/* Centered Card - Extended Width */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          padding: '60px 70px',
          width: '100%',
          maxWidth: '650px',
          textAlign: 'center'
        }}>
        {/* Title */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#2d3748',
          marginBottom: '40px',
          letterSpacing: '-0.5px'
        }}>
          Check Grade
        </h1>

        {/* Form Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          {/* Academic Year */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 600,
              color: '#4a5568',
              marginBottom: '12px',
              textAlign: 'left'
            }}>
              Select Academic Year
            </label>
            <select
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#f7fafc',
                color: '#2d3748',
                outline: 'none',
                transition: 'all 0.2s ease',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 16px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px',
                paddingRight: '50px'
              }}
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#4299e1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="">Select Academic Year</option>
              <option value="2023-2024">2023 - 2024</option>
              <option value="2024-2025">2024 - 2025</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 600,
              color: '#4a5568',
              marginBottom: '12px',
              textAlign: 'left'
            }}>
              Select Semester
            </label>
            <select
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#f7fafc',
                color: '#2d3748',
                outline: 'none',
                transition: 'all 0.2s ease',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 16px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px',
                paddingRight: '50px'
              }}
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#4299e1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="">Select Semester</option>
              <option value="First Semester">First Semester</option>
              <option value="Second Semester">Second Semester</option>
            </select>
          </div>

          {/* Block */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '16px',
              fontWeight: 600,
              color: '#4a5568',
              marginBottom: '12px',
              textAlign: 'left'
            }}>
              Select Block
            </label>
            <select
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#f7fafc',
                color: '#2d3748',
                outline: 'none',
                transition: 'all 0.2s ease',
                appearance: 'none',
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                backgroundPosition: 'right 16px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '16px',
                paddingRight: '50px'
              }}
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = '#4299e1'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            >
              <option value="">Select Block</option>
              <option value="Block 1">Block 1</option>
              <option value="Block 2">Block 2</option>
              <option value="Block 3">Block 3</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleDisplayResults}
            style={{
              width: '100%',
              padding: '18px 24px',
              backgroundColor: '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '20px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#38a169';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(72, 187, 120, 0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#48bb78';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(72, 187, 120, 0.3)';
            }}
          >
            Display Results
          </button>
        </div>
        </div>
      </main>
    </div>
  );
};

export default NewSelectResultPage;