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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
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

      {/* Centered Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        padding: '60px 50px',
        width: '100%',
        maxWidth: '500px',
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
              <option value="">2024 - 2025</option>
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
              <option value="">----</option>
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
              <option value="">----</option>
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
    </div>
  );
};

export default NewSelectResultPage;