import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import UpdateGrades from '../components/Dashboard/UpdateGrades';

const LecturerAssessmentPage: React.FC = () => {
  return (
    <DashboardLayout showGreeting maxWidth={900}>
      <UpdateGrades />
    </DashboardLayout>
  );
};

export default LecturerAssessmentPage;
