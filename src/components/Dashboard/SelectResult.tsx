import React, { useState } from 'react';
import { getUser } from '../../utils/auth';

const SelectResult: React.FC = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Get user data
  const user = getUser();

  const handleDisplayResults = () => {
    if (academicYear && semester) {
      setShowResults(true);
    } else {
      alert('Please select both Academic Year and Semester');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '12px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
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
          gridTemplateColumns: '1fr 1fr auto', 
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

        {/* Results Display */}
        {showResults && (
          <div style={{ marginTop: '30px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                KNUST – Kwame Nkrumah University of Science and Technology
              </h2>
              <p style={{ color: '#6b7280' }}>
                Report for {semester === 'First Semester' ? 'Semester 1' : 'Semester 2'}, {academicYear} Academic Year
              </p>
            </div>
            
            {/* Student Info */}
            <table style={{ 
              width: '100%', 
              border: '1px solid #d1d5db', 
              borderCollapse: 'collapse',
              marginBottom: '20px'
            }}>
              <tbody>
                <tr>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>
                    <strong>Name:</strong> {user?.name || 'Ransford Yeboah'}
                  </td>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>
                    <strong>Index No.:</strong> 20123456
                  </td>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>
                    <strong>Student ID:</strong> IDL/2024/001
                  </td>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>
                    <strong>Email:</strong> {user?.email || 'student@knust.edu.gh'}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px' }} colSpan={2}>
                    <strong>Programme:</strong> Information Systems Management
                  </td>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>
                    <strong>Level:</strong> 400
                  </td>
                  <td style={{ border: '1px solid #d1d5db', padding: '8px' }}></td>
                </tr>
              </tbody>
            </table>
            
            {/* Results Table */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ 
                marginBottom: '15px', 
                color: '#1f2937',
                fontSize: '20px',
                fontWeight: 600
              }}>
                Course Results
              </h3>
              <table style={{ 
                width: '100%', 
                border: '1px solid #d1d5db', 
                borderCollapse: 'collapse'
              }}>
                <thead style={{ backgroundColor: '#f9fafb' }}>
                  <tr>
                    <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left' }}>Course Code</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left' }}>Course Title</th>
                    <th style={{ border: '1px solid #d1d5db', padding: '12px', textAlign: 'left' }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>ISM 401</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>Database Systems</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>A</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>ISM 402</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>Systems Analysis</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>B+</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>ISM 403</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>Project Management</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>A-</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>ISM 404</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>Information Security</td>
                    <td style={{ border: '1px solid #d1d5db', padding: '8px' }}>B</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Print Button */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={() => window.print()}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#4b5563')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#6b7280')}
              >
                Print Results
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectResult;
