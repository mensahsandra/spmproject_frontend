import React, { useState } from 'react';
import AcademicYearSelect from './AcademicYearSelect';
import SemesterSelect from './SemesterSelect';
import DisplayButton from './DisplayButton';
import ResultHeader from './ResultHeader';
import StudentInfoTable from './StudentInfoTable';
import ResultsTable from './ResultsTable';
import { getUser } from '../../utils/auth';

const SelectResult: React.FC = () => {
  const [academicYear, setAcademicYear] = useState('');
  const [semester, setSemester] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Get user data
  const user = getUser();
  
  // Sample student data - replace with actual data from your API
  const studentInfo = {
    name: user?.name || 'Ransford Yeboah',
    indexNo: user?.indexNo || '20123456',
    studentId: user?.studentId || 'IDL/2024/001',
    email: user?.email || 'student@knust.edu.gh',
    programme: 'Information Systems Management',
    level: 400
  };

  // Sample results data - replace with actual data from your API
  const resultsData = [
    { courseCode: 'ISM 401', courseTitle: 'Database Systems', grade: 'A' },
    { courseCode: 'ISM 402', courseTitle: 'Systems Analysis', grade: 'B+' },
    { courseCode: 'ISM 403', courseTitle: 'Project Management', grade: 'A-' },
    { courseCode: 'ISM 404', courseTitle: 'Information Security', grade: 'B' },
  ];

  const handleDisplayResults = () => {
    if (academicYear && semester) {
      setShowResults(true);
    } else {
      alert('Please select both Academic Year and Semester');
    }
  };

  const getSemesterNumber = (semesterText: string) => {
    return semesterText === 'First Semester' ? 1 : 2;
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
            <AcademicYearSelect year={academicYear} setYear={setAcademicYear} />
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
            <SemesterSelect semester={semester} setSemester={setSemester} />
          </div>
          
          <div>
            <DisplayButton onClick={handleDisplayResults} />
          </div>
        </div>

        {/* Results Display */}
        {showResults && (
          <div style={{ marginTop: '30px' }}>
            <ResultHeader 
              semester={getSemesterNumber(semester)} 
              academicYear={academicYear} 
            />
            
            <StudentInfoTable {...studentInfo} />
            
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ 
                marginBottom: '15px', 
                color: '#1f2937',
                fontSize: '20px',
                fontWeight: 600
              }}>
                Course Results
              </h3>
              <ResultsTable data={resultsData} />
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
