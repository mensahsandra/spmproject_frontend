import React, { useState, useEffect } from 'react';
import { Bell, Users, FileText, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'attendance' | 'assessment' | 'system' | 'alert';
  priority: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon?: React.ReactNode;
}

const LecturerNotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'attendance' | 'assessment' | 'system' | 'alert'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Mock data - in real app, this would come from API
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'attendance',
          priority: 'medium',
          title: 'New Student Check-in',
          message: 'Ransford Student checked in to CS101 session (ABC123)',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          read: false,
          icon: <Users size={16} className="text-success" />
        },
        {
          id: '2',
          type: 'assessment',
          priority: 'medium',
          title: 'Quiz Submission Received',
          message: 'Jane Smith submitted Web Development Basics quiz',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          read: false,
          icon: <FileText size={16} className="text-primary" />
        },
        {
          id: '3',
          type: 'system',
          priority: 'low',
          title: 'Session Generated',
          message: 'Session code ABC123 created successfully for CS101',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          read: true,
          icon: <Settings size={16} className="text-info" />
        },
        {
          id: '4',
          type: 'alert',
          priority: 'high',
          title: 'Low Attendance Alert',
          message: 'Only 8 out of 30 students present in Database Management class',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          read: false,
          icon: <AlertTriangle size={16} className="text-warning" />
        },
        {
          id: '5',
          type: 'assessment',
          priority: 'medium',
          title: 'Multiple Submissions',
          message: '5 students completed JavaScript Fundamentals quiz',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          read: true,
          icon: <CheckCircle size={16} className="text-success" />
        },
        {
          id: '6',
          type: 'attendance',
          priority: 'low',
          title: 'Session Ended',
          message: 'CS101 session ended with 23 total attendees',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: true,
          icon: <Clock size={16} className="text-muted" />
        }
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || notif.type === filter
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-danger';
      case 'medium': return 'border-warning';
      case 'low': return 'border-success';
      default: return 'border-secondary';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 d-flex align-items-center gap-2">
            <Bell size={24} className="text-primary" />
            Notifications
            {unreadCount > 0 && (
              <span className="badge bg-danger rounded-pill">{unreadCount}</span>
            )}
          </h2>
          <p className="text-muted mb-0">Stay updated with your classes and student activities</p>
        </div>
        {unreadCount > 0 && (
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={markAllAsRead}
          >
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-3">
          <div className="btn-group w-100" role="group">
            <input 
              type="radio" 
              className="btn-check" 
              name="filter" 
              id="all" 
              checked={filter === 'all'}
              onChange={() => setFilter('all')}
            />
            <label className="btn btn-outline-primary" htmlFor="all">
              All ({notifications.length})
            </label>

            <input 
              type="radio" 
              className="btn-check" 
              name="filter" 
              id="attendance" 
              checked={filter === 'attendance'}
              onChange={() => setFilter('attendance')}
            />
            <label className="btn btn-outline-success" htmlFor="attendance">
              <Users size={16} className="me-1" />
              Attendance ({notifications.filter(n => n.type === 'attendance').length})
            </label>

            <input 
              type="radio" 
              className="btn-check" 
              name="filter" 
              id="assessment" 
              checked={filter === 'assessment'}
              onChange={() => setFilter('assessment')}
            />
            <label className="btn btn-outline-info" htmlFor="assessment">
              <FileText size={16} className="me-1" />
              Assessment ({notifications.filter(n => n.type === 'assessment').length})
            </label>

            <input 
              type="radio" 
              className="btn-check" 
              name="filter" 
              id="system" 
              checked={filter === 'system'}
              onChange={() => setFilter('system')}
            />
            <label className="btn btn-outline-secondary" htmlFor="system">
              <Settings size={16} className="me-1" />
              System ({notifications.filter(n => n.type === 'system').length})
            </label>

            <input 
              type="radio" 
              className="btn-check" 
              name="filter" 
              id="alert" 
              checked={filter === 'alert'}
              onChange={() => setFilter('alert')}
            />
            <label className="btn btn-outline-warning" htmlFor="alert">
              <AlertTriangle size={16} className="me-1" />
              Alerts ({notifications.filter(n => n.type === 'alert').length})
            </label>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="row">
        <div className="col-12">
          {filteredNotifications.length === 0 ? (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center py-5">
                <Bell size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No notifications</h5>
                <p className="text-muted mb-0">
                  {filter === 'all' 
                    ? "You're all caught up! No new notifications."
                    : `No ${filter} notifications at the moment.`
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="list-group">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`list-group-item list-group-item-action border-start border-3 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? 'bg-light' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    <div className="d-flex align-items-start gap-3">
                      <div className="mt-1">
                        {notification.icon}
                      </div>
                      <div>
                        <h6 className={`mb-1 ${!notification.read ? 'fw-bold' : ''}`}>
                          {notification.title}
                          {!notification.read && (
                            <span className="badge bg-primary ms-2">New</span>
                          )}
                        </h6>
                        <p className="mb-1 text-muted">{notification.message}</p>
                        <small className="text-muted">
                          <Clock size={12} className="me-1" />
                          {formatTimeAgo(notification.timestamp)}
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
                      <span className={`badge ${
                        notification.priority === 'high' ? 'bg-danger' :
                        notification.priority === 'medium' ? 'bg-warning' : 'bg-success'
                      }`}>
                        {notification.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturerNotificationsPage;