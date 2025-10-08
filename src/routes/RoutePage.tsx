import { Routes, Route, Navigate } from 'react-router-dom';
// LandingPage import removed - not used in current test
import Dashboard from '../pages/Dashboard';
import NewDashboard from '../pages/NewDashboard';
import NewSelectResultPage from '../pages/NewSelectResultPage';
import SimpleTestPage from '../pages/SimpleTestPage';
import RecordAttendance from '../components/Dashboard/RecordAttendance';
// SelectResult import removed - not used in current routes
import NotificationsPage from '../pages/NotificationsPage';
import QuizPage from '../pages/QuizPage';
import StudentQuizDashboard from '../pages/StudentQuizDashboard';
import StudentAcademicHub from '../pages/StudentAcademicHub';
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
import LecturerGeneratePage from '../pages/LecturerGeneratePage';
import LecturerAttendancePage from '../pages/LecturerAttendancePage';
import LecturerAssessmentPage from '../pages/LecturerAssessmentPage';
import LecturerExportPage from '../pages/LecturerExportPage';
import LecturerNotificationsPage from '../pages/LecturerNotificationsPage';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { normalizeRole } from '../utils/roles';
import StudentLayout from '../layouts/StudentLayout';
import LecturerLayout from '../layouts/LecturerLayout';
import LandingPage from '../pages/LandingPage';

const withStudent = (node: React.ReactNode) => <StudentLayout>{node}</StudentLayout>;
const withLecturer = (node: React.ReactNode) => <LecturerLayout>{node}</LecturerLayout>;

const RoutePage = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Navigate to="/student-login" />} />
      <Route path="/student-login" element={<StudentLoginPage />} />
      <Route path="/lecturer-login" element={<LecturerLoginPage />} />
      {/* Alternative login paths */}
      <Route path="/login/student" element={<StudentLoginPage />} />
      <Route path="/login/lecturer" element={<LecturerLoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      {/* Student namespaced routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute requiredRole="student">
          <Dashboard />
        </ProtectedRoute>
      } />
      {/* Test route to see new design directly */}
      <Route path="/test-dashboard" element={<SimpleTestPage />} />
      {/* New dashboard with light sidebar - bypasses cache */}
      <Route path="/student/new-dashboard" element={
        <ProtectedRoute requiredRole="student">
          <NewDashboard />
        </ProtectedRoute>
      } />
      {/* Final test route */}
      <Route path="/student/light-dashboard" element={
        <ProtectedRoute requiredRole="student">
          <NewDashboard />
        </ProtectedRoute>
      } />
      {/* New select result page - bypasses all caching */}
      <Route path="/student/fresh-select-result" element={
        <ProtectedRoute requiredRole="student">
          <NewSelectResultPage />
        </ProtectedRoute>
      } />
      {/* Test route without authentication */}
      <Route path="/test-select-result" element={<NewSelectResultPage />} />
      {/* Simple test route */}
      <Route path="/simple-test" element={<SimpleTestPage />} />
      <Route path="/student/record-attendance" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<RecordAttendance />)}
        </ProtectedRoute>
      } />
      <Route path="/student/select-result" element={
        <NewSelectResultPage />
      } />
      <Route path="/student/notifications" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<NotificationsPage />)}
        </ProtectedRoute>
      } />
      <Route path="/student/quiz/:quizId" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<QuizPage />)}
        </ProtectedRoute>
      } />
      <Route path="/student/academic-hub" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<StudentAcademicHub />)}
        </ProtectedRoute>
      } />
      <Route path="/student/assessment" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<StudentQuizDashboard />)}
        </ProtectedRoute>
      } />
      <Route path="/student/display-result" element={
        <ProtectedRoute requiredRole="student">
          <DisplayResultPage />
        </ProtectedRoute>
      } />
      <Route path="/student/display-cwa" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<DisplayCWAResultPage />)}
        </ProtectedRoute>
      } />
      <Route path="/student/deadlines" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<DeadlinesPage />)}
        </ProtectedRoute>
      } />

      {/* Fix for incorrect routes being generated */}
      <Route path="/student/assessment-hub" element={<Navigate to="/student/assessment" replace />} />
      <Route path="/student/notifications-tab-deadlines" element={<Navigate to="/student/notifications?tab=deadlines" replace />} />

      {/* Legacy student paths -> redirect to namespaced */}
      <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
      <Route path="/record-attendance" element={<Navigate to="/student/record-attendance" replace />} />
      <Route path="/select-result" element={<Navigate to="/student/select-result" replace />} />
      <Route path="/notifications" element={<Navigate to="/student/notifications" replace />} />
      <Route path="/display-result" element={<Navigate to="/student/display-result" replace />} />
      <Route path="/display-cwa" element={<Navigate to="/student/display-cwa" replace />} />
      <Route path="/deadlines" element={<Navigate to="/student/deadlines" replace />} />
      {/* Lecturer namespaced routes */}
      <Route path="/lecturer/dashboard" element={
        <ProtectedRoute requiredRole="lecturer">
          {withLecturer(<LecturerDashboardPage />)}
        </ProtectedRoute>
      } />
      <Route path="/lecturer/generate" element={
        <ProtectedRoute requiredRole="lecturer">
          {withLecturer(<LecturerGeneratePage />)}
        </ProtectedRoute>
      } />
      <Route path="/lecturer/attendance" element={
        <ProtectedRoute requiredRole="lecturer">
          {withLecturer(<LecturerAttendancePage />)}
        </ProtectedRoute>
      } />
      <Route path="/lecturer/assessment" element={
        <ProtectedRoute requiredRole="lecturer">
          {withLecturer(<LecturerAssessmentPage />)}
        </ProtectedRoute>
      } />
      <Route path="/lecturer/export" element={
        <ProtectedRoute requiredRole="lecturer">
          {withLecturer(<LecturerExportPage />)}
        </ProtectedRoute>
      } />
      <Route path="/lecturer/notifications" element={
        <ProtectedRoute requiredRole="lecturer">
          {withLecturer(<LecturerNotificationsPage />)}
        </ProtectedRoute>
      } />
      {/* Alias route for generate session */}
      <Route path="/lecturer/generatesession" element={
        <ProtectedRoute requiredRole="lecturer">
          {withLecturer(<LecturerGeneratePage />)}
        </ProtectedRoute>
      } />
      {/* Legacy lecturer path redirect */}
      <Route path="/lecturer-dashboard" element={<Navigate to="/lecturer/dashboard" replace />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          {(() => {
            const raw = localStorage.getItem('user');
            let role = 'student';
            try { if (raw) role = normalizeRole(JSON.parse(raw).role); } catch {}
            return role === 'lecturer' ? withLecturer(<ProfilePage />) : withStudent(<ProfilePage />);
          })()}
        </ProtectedRoute>
      } />

    </Routes>
  );
};

export default RoutePage;
