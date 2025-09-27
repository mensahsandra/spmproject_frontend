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
import LecturerGeneratePage from '../pages/LecturerGeneratePage';
import LecturerAttendancePage from '../pages/LecturerAttendancePage';
import LecturerAssessmentPage from '../pages/LecturerAssessmentPage';
import LecturerExportPage from '../pages/LecturerExportPage';
import ProtectedRoute from '../components/Auth/ProtectedRoute';
import { normalizeRole } from '../utils/roles';
import StudentLayout from '../layouts/StudentLayout';

const withStudent = (node: React.ReactNode) => <StudentLayout>{node}</StudentLayout>;
const withLecturer = (node: React.ReactNode) => <>{node}</>;

const RoutePage = () => {
  console.log('RoutePage rendering...');
  
  return (
    <Routes>
      <Route path="/test" element={
        <div style={{ padding: '20px', background: 'red', color: 'white', minHeight: '100vh' }}>
          <h1>BASIC TEST PAGE</h1>
          <p>React is working!</p>
          <p>Current URL: {window.location.href}</p>
        </div>
      } />
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Navigate to="/student-login" />} />
      <Route path="/student-login" element={<StudentLoginPage />} />
      <Route path="/lecturer-login" element={<LecturerLoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/role-selection" element={<RoleSelectionPage />} />
      {/* Student namespaced routes */}
      <Route path="/student/dashboard" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<Dashboard />)}
        </ProtectedRoute>
      } />
      <Route path="/student/record-attendance" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<RecordAttendance />)}
        </ProtectedRoute>
      } />
      <Route path="/student/select-result" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<SelectResult />)}
        </ProtectedRoute>
      } />
      <Route path="/student/notifications" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<NotificationsPage />)}
        </ProtectedRoute>
      } />
      <Route path="/student/display-result" element={
        <ProtectedRoute requiredRole="student">
          {withStudent(<DisplayResultPage />)}
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
      {/* Alias route for generate session */}
      <Route path="/lecturer/generatesession" element={
        <div style={{ padding: '20px', background: 'white', minHeight: '100vh' }}>
          <h1>Generate Session Test Page</h1>
          <p>If you can see this, routing is working!</p>
          <p>Path: /lecturer/generatesession</p>
        </div>
      } />
      <Route path="/lecturer/generatesession-protected" element={
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
      {/* Catch-all route for debugging */}
      <Route path="*" element={
        <div style={{ padding: '20px', background: 'orange', color: 'black', minHeight: '100vh' }}>
          <h1>Route Not Found</h1>
          <p>Current path: {window.location.pathname}</p>
          <p>Available routes:</p>
          <ul>
            <li>/test - Basic test page</li>
            <li>/lecturer/generatesession - Generate session test</li>
            <li>/lecturer/dashboard - Lecturer dashboard</li>
            <li>/student/dashboard - Student dashboard</li>
          </ul>
        </div>
      } />
    </Routes>
  );
};

export default RoutePage;
