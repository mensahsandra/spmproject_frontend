import React from 'react';
import UpdateGrades from '../components/Dashboard/UpdateGrades';
import '../css/assessment.css';

const LecturerAssessmentPage: React.FC = () => {
  return (
    <div className="assessment-container">
      <UpdateGrades />
    </div>
  );
};

export default LecturerAssessmentPage;
