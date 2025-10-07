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
  // Updated for Academic Hub navigation - v5 (Added header, direct navigation to select-result)
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
    console.log('StudentAcademicHub v5 loaded - Added header, direct navigation to select-result');
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
      <DashboardLayout style={{ 
        overflow: 'hidden',
        padding: '0'
      }}>
        <div className="academic-hub-wrapper" style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading academic hub...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout style={{ 
      overflow: 'hidden',
      padding: '0'
    }}>
      <div className="academic-hub-wrapper" style={{
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '2rem'
      }}>
        <div className="container academic-hub-container" style={{ 
          maxWidth: '900px', 
          width: '100%',
          padding: '0 2rem 2rem 2rem'
        }}>

        {/* Page Header */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="academic-hub-title" style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Access your assessments and academic performance
            </h2>
            <div style={{
              width: '80px',
              height: '3px',
              background: 'linear-gradient(to right, #22c55e, #16a34a)',
              margin: '0 auto',
              borderRadius: '2px'
            }}></div>
          </div>
        </div>

        {/* Quick Stats - Clean Design */}
        <div className="row mb-5">
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
        <div className="row mb-4">
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
              onClick={() => navigate('/student/select-result')}
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




        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAcademicHub;