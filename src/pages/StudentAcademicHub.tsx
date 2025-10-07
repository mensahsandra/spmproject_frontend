import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import '../css/academic-hub.css';

interface AcademicStats {
  availableQuizzes: number;
  pendingAssignments: number;
  unreadNotifications: number;
  coursesEnrolled: number;
  currentGPA: string;
  completedAssessments: number;
}

const StudentAcademicHub: React.FC = () => {
  const navigate = useNavigate();
  // Updated for Academic Hub navigation - v2
  const [stats, setStats] = useState<AcademicStats>({
    availableQuizzes: 0,
    pendingAssignments: 0,
    unreadNotifications: 0,
    coursesEnrolled: 6,
    currentGPA: '3.45',
    completedAssessments: 12
  });
  const [loading, setLoading] = useState(true);
  const [showPerformanceSection, setShowPerformanceSection] = useState(false);

  useEffect(() => {
    loadAcademicStats();
  }, []);

  const loadAcademicStats = () => {
    // Simulate loading academic statistics
    // In real app, this would fetch from API
    setTimeout(() => {
      setStats({
        availableQuizzes: 3,
        pendingAssignments: 2,
        unreadNotifications: 5,
        coursesEnrolled: 6,
        currentGPA: '3.45',
        completedAssessments: 12
      });
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading academic hub...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        {/* Page Header */}
        <div className="mb-4">
          <h3 className="mb-1">Academic Hub</h3>
          <p className="text-muted mb-0">Access your assessments and academic performance</p>
        </div>

        {/* Quick Stats - Clean Design */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card clean-stat-card">
              <div className="card-body d-flex align-items-center">
                <div className="green-accent-bar"></div>
                <div className="ms-3 text-center flex-grow-1">
                  <div className="stat-label text-muted mb-1">Available Quizzes</div>
                  <div className="stat-value text-success">{stats.availableQuizzes}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card clean-stat-card">
              <div className="card-body d-flex align-items-center">
                <div className="green-accent-bar"></div>
                <div className="ms-3 text-center flex-grow-1">
                  <div className="stat-label text-muted mb-1">Pending Tasks</div>
                  <div className="stat-value text-success">{stats.pendingAssignments}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card clean-stat-card">
              <div className="card-body d-flex align-items-center">
                <div className="green-accent-bar"></div>
                <div className="ms-3 text-center flex-grow-1">
                  <div className="stat-label text-muted mb-1">Current CWA</div>
                  <div className="stat-value text-success">{stats.currentGPA}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Cards - Clean Design */}
        <div className="row">
          <div className="col-12 mb-4">
            <div 
              className="card clean-action-card"
              onClick={() => navigate('/student/assessment')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body d-flex align-items-center">
                <div className="green-accent-bar-large"></div>
                <div className="ms-4 flex-grow-1">
                  <h4 className="card-title mb-2">Assessment Center</h4>
                  <hr className="title-underline mb-3" />
                  <p className="card-text text-muted mb-0">
                    Take quizzes, submit assignments, and complete your academic assessments
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 mb-4">
            <div 
              className="card clean-action-card"
              onClick={() => setShowPerformanceSection(true)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body d-flex align-items-center">
                <div className="green-accent-bar-large"></div>
                <div className="ms-4 flex-grow-1">
                  <h4 className="card-title mb-2">Check Performance</h4>
                  <hr className="title-underline mb-3" />
                  <p className="card-text text-muted mb-0">
                    View your grades, academic results, and track your progress over time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Section */}
        {showPerformanceSection && (
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-success text-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="fas fa-chart-line me-2"></i>
                      Check Your Performance
                    </h5>
                    <button 
                      className="btn btn-sm btn-outline-light"
                      onClick={() => setShowPerformanceSection(false)}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Select Academic Year</label>
                      <select className="form-select">
                        <option value="">Select Academic Year</option>
                        <option value="2024-2025">2024-2025</option>
                        <option value="2023-2024">2023-2024</option>
                        <option value="2022-2023">2022-2023</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Select Semester</label>
                      <select className="form-select">
                        <option value="">Select Semester</option>
                        <option value="First Semester">First Semester</option>
                        <option value="Second Semester">Second Semester</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Select Block</label>
                      <select className="form-select">
                        <option value="">Select Block</option>
                        <option value="Block 1">Block 1</option>
                        <option value="Block 2">Block 2</option>
                        <option value="Block 3">Block 3</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-success"
                      onClick={() => navigate('/student/display-result')}
                    >
                      <i className="fas fa-chart-bar me-2"></i>
                      Display Results
                    </button>
                    <button 
                      className="btn btn-outline-success"
                      onClick={() => navigate('/student/select-result')}
                    >
                      <i className="fas fa-search me-2"></i>
                      Advanced Grade Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card bg-light border-0">
              <div className="card-body">
                <h6 className="card-title mb-3">Quick Actions</h6>
                <div className="d-flex flex-wrap gap-2">
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => navigate('/student/notifications')}
                  >
                    <i className="fas fa-bell me-1"></i>
                    View All Notifications
                  </button>
                  <button 
                    className="btn btn-outline-success btn-sm"
                    onClick={() => navigate('/student/record-attendance')}
                  >
                    <i className="fas fa-user-check me-1"></i>
                    Record Attendance
                  </button>
                  <button 
                    className="btn btn-outline-info btn-sm"
                    onClick={() => navigate('/student/deadlines')}
                  >
                    <i className="fas fa-clock me-1"></i>
                    Upcoming Deadlines
                  </button>
                  {!showPerformanceSection && (
                    <button 
                      className="btn btn-outline-success btn-sm"
                      onClick={() => setShowPerformanceSection(true)}
                    >
                      <i className="fas fa-chart-line me-1"></i>
                      Check Performance
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAcademicHub;