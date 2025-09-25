import './App.css'
import LandingPage from './pages/LandingPage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from './pages/RegistrationPage';
import DisplayCWAResultPage from './pages/DisplayCWAResultPage';
import StudentLoginPage from './pages/StudentLoginPage';
import LecturerLoginPage from './pages/LecturerLoginPage';
import DashboardPage from './pages/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Sidebar from './components/Dashboard/Sidebar';
import TopBar from './components/Dashboard/TopBar';
import RecordAttendancePage from './pages/AttendancePage';
import ResultsPage from './pages/SelectResultPage';
import DisplayResultPage from './pages/DisplayResultPage';
import DeadlinesPage from './pages/DeadlinePage';
import NotificationsPage from './pages/NotificationsPage';
import LecturerDashboardPage from './pages/LecturerDashboardPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // this includes Popper


// Simulated auth state (use a context or state in real app)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login/student" element={<StudentLoginPage />} />
        <Route path="/login/lecturer" element={<LecturerLoginPage />} />
        {/* Add routes that match the URLs being used */}
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/lecturer-login" element={<LecturerLoginPage />} />
        {/* Keep dashboard as-is (it already includes Sidebar/TopBar) */}
        <Route path='/dashboard' element={<DashboardPage />} />
        <Route
          path='/lecturer-dashboard'
          element={
            <ProtectedRoute requiredRole='lecturer'>
              <LecturerDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Pages below are wrapped with a persistent Sidebar + TopBar */}
        <Route
          path='/record-attendance'
          element={
            <div className="dashboard">
              <Sidebar />
              <main className="dashboard-content has-topbar">
                <TopBar />
                <RecordAttendancePage />
              </main>
            </div>
          }
        />
        <Route
          path='/select-result'
          element={
            <div className="dashboard">
              <Sidebar />
              <main className="dashboard-content has-topbar">
                <TopBar />
                <ResultsPage />
              </main>
            </div>
          }
        />
        <Route
          path='/display-result'
          element={
            <div className="dashboard">
              <Sidebar />
              <main className="dashboard-content has-topbar">
                <TopBar />
                <DisplayResultPage />
              </main>
            </div>
          }
        />
        <Route
          path='/display-cwa'
          element={
            <div className="dashboard">
              <Sidebar />
              <main className="dashboard-content has-topbar">
                <TopBar />
                <DisplayCWAResultPage />
              </main>
            </div>
          }
        />
        <Route
          path='/deadlines'
          element={
            <div className="dashboard">
              <Sidebar />
              <main className="dashboard-content has-topbar">
                <TopBar />
                <DeadlinesPage />
              </main>
            </div>
          }
        />
        <Route
          path='/notifications'
          element={
            <div className="dashboard">
              <Sidebar />
              <main className="dashboard-content has-topbar">
                <TopBar />
                <NotificationsPage />
              </main>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
