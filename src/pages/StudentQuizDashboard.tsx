import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
// import { getQuizNotifications } from '../utils/quizNotifications'; // Will be used when connecting to real backend
import '../css/student-quiz.css';

interface Quiz {
  id: string;
  title: string;
  lecturerName: string;
  courseName: string;
  courseCode: string;
  deadline: string;
  status: 'available' | 'submitted' | 'missed' | 'blocked';
  attendanceRequired: boolean;
  studentAttended: boolean;
  description?: string;
}

interface NotificationBanner {
  id: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  message: string;
  timestamp: Date;
}

const StudentQuizDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [notifications, setNotifications] = useState<NotificationBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
    loadNotifications();
  }, []);

  const loadQuizzes = () => {
    // Simulate loading quizzes for the student's courses
    // In real app, this would fetch from API based on student's enrolled courses
    const mockQuizzes: Quiz[] = [
      {
        id: 'quiz_1',
        title: 'Web Development Basics',
        lecturerName: 'Dr. Kwabena Mensah',
        courseName: 'Web Development',
        courseCode: 'BIT364',
        deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        status: 'available',
        attendanceRequired: true,
        studentAttended: true,
        description: 'Test your understanding of HTML, CSS, and JavaScript fundamentals'
      },
      {
        id: 'quiz_2',
        title: 'Database Design Quiz',
        lecturerName: 'Prof. Sarah Johnson',
        courseName: 'Database Management',
        courseCode: 'BIT301',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
        status: 'available',
        attendanceRequired: true,
        studentAttended: false, // Student missed attendance
        description: 'Quiz on database normalization and ER diagrams'
      },
      {
        id: 'quiz_3',
        title: 'Network Security Assessment',
        lecturerName: 'Dr. Michael Brown',
        courseName: 'Network Security',
        courseCode: 'BIT367',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
        status: 'available',
        attendanceRequired: false,
        studentAttended: true,
        description: 'Comprehensive assessment on network security principles'
      },
      {
        id: 'quiz_4',
        title: 'JavaScript Fundamentals',
        lecturerName: 'Dr. Kwabena Mensah',
        courseName: 'Web Development',
        courseCode: 'BIT364',
        deadline: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago (missed)
        status: 'missed',
        attendanceRequired: true,
        studentAttended: true,
        description: 'Quiz on JavaScript basics and DOM manipulation'
      }
    ];

    setQuizzes(mockQuizzes);
    setLoading(false);
  };

  const loadNotifications = () => {
    const mockNotifications: NotificationBanner[] = [
      {
        id: 'notif_1',
        type: 'info',
        message: 'New quiz available for Web Development. Due in 2 hours.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000) // 10 minutes ago
      },
      {
        id: 'notif_2',
        type: 'warning',
        message: 'Deadline approaching for Database Design Quiz. Due in 1 day.',
        timestamp: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      }
    ];

    setNotifications(mockNotifications);
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const difference = deadlineTime - now;

    if (difference < 0) return 'Deadline passed';

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getQuizCardClass = (quiz: Quiz) => {
    if (quiz.attendanceRequired && !quiz.studentAttended) {
      return 'card quiz-card blocked-quiz';
    }
    if (quiz.status === 'missed') {
      return 'card quiz-card missed-quiz';
    }
    if (quiz.status === 'submitted') {
      return 'card quiz-card submitted-quiz';
    }
    return 'card quiz-card available-quiz';
  };

  const handleTakeQuiz = (quiz: Quiz) => {
    if (quiz.attendanceRequired && !quiz.studentAttended) {
      alert("You can't access this quiz because you didn't check in for the session.");
      return;
    }
    if (quiz.status === 'missed') {
      alert("This quiz deadline has passed.");
      return;
    }
    navigate(`/student/quiz/${quiz.id}`);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading quizzes...</span>
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
          <h3 className="mb-1">Assessment Center</h3>
          <p className="text-muted mb-0">Take quizzes and track your academic progress</p>
        </div>

        {/* Notification Banners */}
        {notifications.length > 0 && (
          <div className="mb-4">
            {notifications.map(notification => (
              <div key={notification.id} className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
                <div className="d-flex justify-content-between align-items-center">
                  <span>{notification.message}</span>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => dismissNotification(notification.id)}
                    aria-label="Close"
                  ></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Navigation Cards */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card h-100 nav-card" onClick={() => navigate('/student/academic-hub')} style={{ cursor: 'pointer' }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="fas fa-arrow-left fa-3x text-secondary"></i>
                </div>
                <h5 className="card-title">Back to Academic Hub</h5>
                <p className="card-text text-muted">Return to main academic options</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card h-100 nav-card assessment-active" style={{ cursor: 'default' }}>
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="fas fa-clipboard-check fa-3x text-success"></i>
                </div>
                <h5 className="card-title">Assessment Center</h5>
                <p className="card-text text-muted">Take quizzes and submit assignments</p>
                <span className="badge bg-success">Current Page</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Cards */}
        <div className="row">
          <div className="col-12">
            <h4 className="mb-3">Available Quizzes ({quizzes.filter(q => q.status === 'available').length})</h4>
            {quizzes.length === 0 ? (
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2"></i>
                No quizzes available at the moment. Check back later!
              </div>
            ) : (
              <div className="row">
                {quizzes.map(quiz => (
                  <div key={quiz.id} className="col-lg-6 col-xl-4 mb-4">
                    <div className={getQuizCardClass(quiz)}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="card-title mb-0">{quiz.title}</h6>
                          <span className={`badge ${
                            quiz.status === 'available' ? 'bg-success' :
                            quiz.status === 'submitted' ? 'bg-primary' :
                            quiz.status === 'missed' ? 'bg-danger' : 'bg-secondary'
                          }`}>
                            {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="mb-2">
                          <small className="text-muted">
                            <i className="fas fa-user me-1"></i>
                            {quiz.lecturerName}
                          </small>
                        </div>
                        
                        <div className="mb-2">
                          <small className="text-muted">
                            <i className="fas fa-book me-1"></i>
                            {quiz.courseCode} - {quiz.courseName}
                          </small>
                        </div>

                        <div className="mb-3">
                          <small className="text-muted">
                            <i className="fas fa-clock me-1"></i>
                            {getTimeRemaining(quiz.deadline)}
                          </small>
                        </div>

                        {quiz.description && (
                          <p className="card-text small text-muted mb-3">{quiz.description}</p>
                        )}

                        {quiz.attendanceRequired && !quiz.studentAttended ? (
                          <div className="alert alert-warning py-2 px-3 mb-3">
                            <small>
                              <i className="fas fa-exclamation-triangle me-1"></i>
                              You can't access this quiz because you didn't check in.
                            </small>
                          </div>
                        ) : null}

                        <button 
                          className={`btn btn-sm w-100 ${
                            quiz.attendanceRequired && !quiz.studentAttended ? 'btn-outline-secondary' :
                            quiz.status === 'available' ? 'btn-primary' :
                            quiz.status === 'submitted' ? 'btn-outline-success' :
                            'btn-outline-danger'
                          }`}
                          onClick={() => handleTakeQuiz(quiz)}
                          disabled={quiz.status === 'missed' || quiz.status === 'submitted' || (quiz.attendanceRequired && !quiz.studentAttended)}
                        >
                          {quiz.status === 'submitted' ? 'Submitted' :
                           quiz.status === 'missed' ? 'Deadline Passed' :
                           quiz.attendanceRequired && !quiz.studentAttended ? 'Access Blocked' :
                           'Take Quiz'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizDashboard;