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

        {/* Quick Stats */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-primary h-100">
              <div className="card-body text-center">
                <i className="fas fa-clipboard-check fa-2x text-primary mb-2"></i>
                <h4 className="text-primary mb-1">{stats.availableQuizzes}</h4>
                <small className="text-muted">Available Quizzes</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-warning h-100">
              <div className="card-body text-center">
                <i className="fas fa-tasks fa-2x text-warning mb-2"></i>
                <h4 className="text-warning mb-1">{stats.pendingAssignments}</h4>
                <small className="text-muted">Pending Tasks</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-success h-100">
              <div className="card-body text-center">
                <i className="fas fa-chart-line fa-2x text-success mb-2"></i>
                <h4 className="text-success mb-1">{stats.currentGPA}</h4>
                <small className="text-muted">Current GPA</small>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card border-info h-100">
              <div className="card-body text-center">
                <i className="fas fa-graduation-cap fa-2x text-info mb-2"></i>
                <h4 className="text-info mb-1">{stats.coursesEnrolled}</h4>
                <small className="text-muted">Enrolled Courses</small>
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6 mb-4">
            <div 
              className="card h-100 shadow-sm border-0 academic-card assessment-card"
              onClick={() => navigate('/student/assessment')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <div className="icon-circle bg-primary bg-opacity-10 mx-auto mb-3">
                    <i className="fas fa-clipboard-check fa-3x text-primary"></i>
                  </div>
                </div>
                
                <h4 className="card-title text-primary mb-3">Assessment Center</h4>
                <p className="card-text text-muted mb-4">
                  Take quizzes, submit assignments, and complete your academic assessments
                </p>

                {/* Assessment Stats */}
                <div className="row text-center mb-4">
                  <div className="col-6">
                    <div className="border-end">
                      <h5 className="text-primary mb-1">{stats.availableQuizzes}</h5>
                      <small className="text-muted">Available</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <h5 className="text-success mb-1">{stats.completedAssessments}</h5>
                    <small className="text-muted">Completed</small>
                  </div>
                </div>

                {stats.unreadNotifications > 0 && (
                  <div className="alert alert-info py-2 mb-3">
                    <small>
                      <i className="fas fa-bell me-1"></i>
                      {stats.unreadNotifications} new notification{stats.unreadNotifications > 1 ? 's' : ''}
                    </small>
                  </div>
                )}

                <button className="btn btn-primary btn-lg w-100">
                  <i className="fas fa-arrow-right me-2"></i>
                  Enter Assessment Center
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-5 col-md-6 mb-4">
            <div 
              className="card h-100 shadow-sm border-0 academic-card performance-card"
              onClick={() => navigate('/student/select-result')}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body text-center p-5">
                <div className="mb-4">
                  <div className="icon-circle bg-success bg-opacity-10 mx-auto mb-3">
                    <i className="fas fa-chart-line fa-3x text-success"></i>
                  </div>
                </div>
                
                <h4 className="card-title text-success mb-3">Check Performance</h4>
                <p className="card-text text-muted mb-4">
                  View your grades, academic results, and track your progress over time
                </p>

                {/* Performance Stats */}
                <div className="row text-center mb-4">
                  <div className="col-6">
                    <div className="border-end">
                      <h5 className="text-success mb-1">{stats.currentGPA}</h5>
                      <small className="text-muted">Current GPA</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <h5 className="text-info mb-1">{stats.coursesEnrolled}</h5>
                    <small className="text-muted">Courses</small>
                  </div>
                </div>

                <div className="alert alert-success py-2 mb-3">
                  <small>
                    <i className="fas fa-trophy me-1"></i>
                    Academic performance tracking available
                  </small>
                </div>

                <button className="btn btn-success btn-lg w-100">
                  <i className="fas fa-arrow-right me-2"></i>
                  View Performance
                </button>
              </div>
            </div>
          </div>
        </div>

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