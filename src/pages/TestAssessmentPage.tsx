import React from 'react';
import LecturerAssessmentPage from './LecturerAssessmentPage';
import '../css/assessment.css';

// Test page to bypass authentication for testing the assessment UI
const TestAssessmentPage: React.FC = () => {
  // Mock auth data in localStorage for testing
  React.useEffect(() => {
    localStorage.setItem('authToken_lecturer', 'test-lecturer-token-12345');
    localStorage.setItem('user_lecturer', JSON.stringify({
      role: 'lecturer',
      name: 'Test Lecturer',
      courses: ['BIT364', 'BIT376', 'BIT372'],
      id: 'lecturer001',
      username: 'testlecturer'
    }));
    localStorage.setItem('profile', JSON.stringify({
      data: {
        courses: ['BSc. Information Technology (BIT)', 'BSc. Computer Science (BCS)'],
        lecturer: {
          courses: ['BIT364', 'BIT376', 'BIT372', 'BIT368', 'BIT366']
        }
      }
    }));
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="alert alert-info mb-4">
        <h4>🧪 Test Mode - Assessment Page</h4>
        <p className="mb-0">This is a test version of the lecturer assessment page with mock authentication.</p>
      </div>
      <LecturerAssessmentPage />
    </div>
  );
};

export default TestAssessmentPage;