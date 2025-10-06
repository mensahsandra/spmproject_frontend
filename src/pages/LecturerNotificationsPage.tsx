import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

interface QuizSubmission {
  id: string;
  quizTitle: string;
  studentName: string;
  studentId: string;
  courseCode: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  grade?: string;
}

interface LecturerNotification {
  id: string;
  type: 'quiz_submission' | 'quiz_created' | 'deadline_reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  data?: any;
}

const LecturerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<LecturerNotification[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'submissions'>('notifications');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadSubmissions();
  }, []);

  const loadNotifications = () => {
    // Mock lecturer notifications
    const mockNotifications: LecturerNotification[] = [
      {
        id: 'notif_1',
        type: 'quiz_submission',
        title: 'New Quiz Submission',
        message: 'John Doe submitted "Web Development Basics" quiz',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        isRead: false,
        data: { studentName: 'John Doe', quizTitle: 'Web Development Basics' }
      },
      {
        id: 'notif_2',
        type: 'quiz_submission',
        title: 'New Quiz Submission',
        message: 'Jane Smith submitted "Web Development Basics" quiz',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        isRead: false,
        data: { studentName: 'Jane Smith', quizTitle: 'Web Development Basics' }
      },
      {
        id: 'notif_3',
        type: 'quiz_created',
        title: 'Quiz Created Successfully',
        message: 'Your quiz "Database Design Quiz" has been created and shared with students',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        data: { quizTitle: 'Database Design Quiz' }
      },
      {
        id: 'notif_4',
        type: 'deadline_reminder',
        title: 'Quiz Deadline Approaching',
        message: 'Web Development Basics quiz deadline is in 2 hours',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        data: { quizTitle: 'Web Development Basics', timeLeft: '2 hours' }
      }
    ];

    setNotifications(mockNotifications);
  };

  const loadSubmissions = () => {
    // Mock quiz submissions
    const mockSubmissions: QuizSubmission[] = [
      {
        id: 'sub_1',
        quizTitle: 'Web Development Basics',
        studentName: 'John Doe',
        studentId: 'STU001',
        courseCode: 'BIT364',
        submittedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        status: 'pending'
      },
      {
        id: 'sub_2',
        quizTitle: 'Web Development Basics',
        studentName: 'Jane Smith',
        studentId: 'STU002',
        courseCode: 'BIT364',
        submittedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        status: 'pending'
      },
      {
        id: 'sub_3',
        quizTitle: 'Database Design Quiz',
        studentName: 'Mike Johnson',
        studentId: 'STU003',
        courseCode: 'BIT301',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'graded',
        grade: 'A'
      },
      {
        id: 'sub_4',
        quizTitle: 'Network Security Assessment',
        studentName: 'Sarah Wilson',
        studentId: 'STU004',
        courseCode: 'BIT367',
        submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'graded',
        grade: 'B+'
      }
    ];

    setSubmissions(mockSubmissions);
    setLoading(false);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'quiz_submission':
        return <i className="fas fa-file-alt text-primary"></i>;
      case 'quiz_created':
        return <i className="fas fa-check-circle text-success"></i>;
      case 'deadline_reminder':
        return <i className="fas fa-clock text-warning"></i>;
      default:
        return <i className="fas fa-bell text-info"></i>;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const difference = now - time;

    const minutes = Math.floor(difference / (1000 * 60));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const pendingSubmissions = submissions.filter(s => s.status === 'pending').length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading notifications...</span>
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
          <h3 className="mb-1">Notifications & Submissions</h3>
          <p className="text-muted mb-0">Stay updated with quiz submissions and important alerts</p>
        </div>

        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-6 mb-3">
            <div className="card border-primary">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-primary mb-1">Unread Notifications</h6>
                    <h4 className="mb-0">{unreadCount}</h4>
                  </div>
                  <i className="fas fa-bell fa-2x text-primary opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card border-warning">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="card-title text-warning mb-1">Pending Submissions</h6>
                    <h4 className="mb-0">{pendingSubmissions}</h4>
                  </div>
                  <i className="fas fa-hourglass-half fa-2x text-warning opacity-50"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card">
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs" role="tablist">
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                  type="button"
                >
                  <i className="fas fa-bell me-2"></i>
                  Notifications
                  {unreadCount > 0 && (
                    <span className="badge bg-danger ms-2">{unreadCount}</span>
                  )}
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'submissions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('submissions')}
                  type="button"
                >
                  <i className="fas fa-file-alt me-2"></i>
                  Quiz Submissions
                  {pendingSubmissions > 0 && (
                    <span className="badge bg-warning ms-2">{pendingSubmissions}</span>
                  )}
                </button>
              </li>
            </ul>
          </div>

          <div className="card-body">
            {activeTab === 'notifications' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Recent Notifications</h6>
                  {unreadCount > 0 && (
                    <button className="btn btn-sm btn-outline-primary" onClick={markAllAsRead}>
                      Mark All as Read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No notifications yet</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {notifications.map(notification => (
                      <div 
                        key={notification.id} 
                        className={`list-group-item list-group-item-action ${!notification.isRead ? 'bg-light' : ''}`}
                        onClick={() => markAsRead(notification.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="d-flex align-items-start">
                            <div className="me-3 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{notification.title}</h6>
                              <p className="mb-1 text-muted">{notification.message}</p>
                              <small className="text-muted">{formatTimeAgo(notification.timestamp)}</small>
                            </div>
                          </div>
                          {!notification.isRead && (
                            <span className="badge bg-primary">New</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'submissions' && (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="mb-0">Quiz Submissions</h6>
                  <div className="d-flex gap-2">
                    <span className="badge bg-warning">Pending: {pendingSubmissions}</span>
                    <span className="badge bg-success">Graded: {submissions.filter(s => s.status === 'graded').length}</span>
                  </div>
                </div>

                {submissions.length === 0 ? (
                  <div className="text-center py-4">
                    <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                    <p className="text-muted">No submissions yet</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Quiz Title</th>
                          <th>Course</th>
                          <th>Submitted</th>
                          <th>Status</th>
                          <th>Grade</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submissions.map(submission => (
                          <tr key={submission.id}>
                            <td>
                              <div>
                                <strong>{submission.studentName}</strong>
                                <br />
                                <small className="text-muted">{submission.studentId}</small>
                              </div>
                            </td>
                            <td>{submission.quizTitle}</td>
                            <td>
                              <span className="badge bg-info">{submission.courseCode}</span>
                            </td>
                            <td>
                              <small>{formatTimeAgo(submission.submittedAt)}</small>
                            </td>
                            <td>
                              <span className={`badge ${
                                submission.status === 'pending' ? 'bg-warning' : 'bg-success'
                              }`}>
                                {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              {submission.grade ? (
                                <span className="badge bg-primary">{submission.grade}</span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                            <td>
                              <div className="btn-group btn-group-sm">
                                <button className="btn btn-outline-primary" title="View Submission">
                                  <i className="fas fa-eye"></i>
                                </button>
                                {submission.status === 'pending' && (
                                  <button className="btn btn-outline-success" title="Grade Submission">
                                    <i className="fas fa-edit"></i>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LecturerNotificationsPage;