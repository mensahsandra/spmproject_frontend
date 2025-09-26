import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import GenerateSession from '../components/Dashboard/GenerateSession';

const LecturerGeneratePage: React.FC = () => {
  return (
    <DashboardLayout showGreeting maxWidth={900}>
      <GenerateSession />
    </DashboardLayout>
  );
};

export default LecturerGeneratePage;
