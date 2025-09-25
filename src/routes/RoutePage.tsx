import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import Dashboard from '../pages/Dashboard';
import RecordAttendance from '../components/Dashboard/RecordAttendance';
import SelectResult from '../components/Dashboard/SelectResult';
import NotificationsPage from '../pages/NotificationsPage';
// Old unified Sidebar removed in favor of role-specific layouts
import StudentLoginPage from '../pages/StudentLoginPage';
import LecturerLoginPage from '../pages/LecturerLoginPage';
import RegistrationPage from '../pages/RegistrationPage';
import RoleSelectionPage from '../pages/RoleSelectionPage';
import DisplayResultPage from '../pages/DisplayResultPage';
import DisplayCWAResultPage from '../pages/DisplayCWAResultPage';
import ProfilePage from '../pages/ProfilePage';
import DeadlinesPage from '../pages/DeadlinesPage';
import React from 'react';
import LecturerDashboardPage from '../pages/LecturerDashboardPage';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import StudentLayout from '../layouts/StudentLayout';
import LecturerLayout from '../layouts/LecturerLayout';

const withStudent = (node: React.ReactNode) => <StudentLayout>{node}</StudentLayout>;
const withLecturer = (node: React.ReactNode) => <LecturerLayout>{node}</LecturerLayout>;

const RoutePage = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Navigate to="/student-login" />} />
      <Route path="/student-login" element={<StudentLoginPage />} />
      <Route path="/lecturer-login" element={<LecturerLoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<Dashboard />)}
        </ProtectedRoute>
      } />
      <Route path="/lecturer-dashboard" element={
        <ProtectedRoute requiredRole="lecturer">
          {withLecturer(<LecturerDashboardPage />)}
        </ProtectedRoute>
      } />
      <Route path="/record-attendance" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<RecordAttendance />)}
        </ProtectedRoute>
      } />
      <Route path="/select-result" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<SelectResult />)}
        </ProtectedRoute>
      } />
      <Route path="/notifications" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<NotificationsPage />)}
        </ProtectedRoute>
      } />
      <Route path="/display-result" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<DisplayResultPage />)}
        </ProtectedRoute>
      } />
      <Route path="/display-cwa" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<DisplayCWAResultPage />)}
        </ProtectedRoute>
      } />
      <Route path="/deadlines" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<DeadlinesPage />)}
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute
          requiredRole={(() => {
            const raw = localStorage.getItem('user');
            try { return raw ? (JSON.parse(raw)?.role || 'student') : 'student'; } catch { return 'student'; }
          })()}
        >
          {(() => {
            const raw = localStorage.getItem('user');
            let role = 'student';
            try { if (raw) role = (JSON.parse(raw).role || 'student').toLowerCase(); } catch {}
            return role === 'lecturer' ? withLecturer(<ProfilePage />) : withStudent(<ProfilePage />);
          })()}
        </ProtectedRoute>
      } />
    </Routes>
  );
};

export default RoutePage;
