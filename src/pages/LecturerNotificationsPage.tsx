import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getStoredNotifications } from '../utils/notificationService';
import { useNotifications } from '../context/NotificationContext';
import '../css/notifications.css';

interface NotificationItem {
  id: string | number;
  type: 'IMPORTANT' | 'REMINDER' | 'INFO';
  message: string;
  timeAgo?: string;
  timestamp?: string;
  category: 'attendance' | 'assessment' | 'system' | 'alert' | 'quiz';
  details?: string;
  read?: boolean;
  actionButton?: {
    text: string;
    action: 'link' | 'page' | 'file';
    url?: string;
    route?: string;
  };
}

// Helper function to calculate time ago
const getTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return past.toLocaleDateString();
};

const LecturerNotificationsPage: React.FC = () => {
  const [expandedNotifications, setExpandedNotifications] = useState<Set<string | number>>(new Set());
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'assessment' | 'system' | 'alert'>('overview');
  const { notifications: contextNotifications, markAsRead } = useNotifications();
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>([]);

  // Load notifications on mount and when context updates
  useEffect(() => {
    // Get role-based notifications from localStorage
    getStoredNotifications('lecturer');
    
    // Convert context notifications to NotificationItem format
    const contextNotifs: NotificationItem[] = contextNotifications.map(notif => ({
      id: notif.id,
      type: notif.type === 'attendance' ? 'REMINDER' : 
            notif.type === 'assessment' || notif.type === 'quiz' ? 'INFO' : 'REMINDER',
      message: notif.message,
      timestamp: notif.timestamp,
      timeAgo: getTimeAgo(notif.timestamp),
      category: notif.type === 'quiz' ? 'assessment' : notif.type as any,
      details: notif.data ? JSON.stringify(notif.data, null, 2) : undefined,
      read: notif.read
    }));

    // Combine with mock data (for demo purposes)
    const mockNotifications: NotificationItem[] = [
    {
      id: 1,
      type: 'IMPORTANT',
      message: 'Low attendance alert: Only 8 out of 30 students present in Database Management class',
      timeAgo: '5 mins ago',
      category: 'alert',
      details: 'The attendance rate for today\'s Database Management class is significantly below average (26.7%). Consider reaching out to absent students or reviewing the session content to ensure engagement.',
      actionButton: {
        text: 'View Attendance',
        action: 'page',
        route: '/lecturer/attendance'
      }
    },
    {
      id: 2,
      type: 'REMINDER',
      message: 'New student check-in: Ransford Student joined CS101 session (ABC123)',
      timeAgo: '10 mins ago',
      category: 'attendance',
      details: 'Student ID: 1234567 checked in at 7:25 PM from Kumasi center. Total attendees for this session: 24 students.',
      actionButton: {
        text: 'View Session',
        action: 'page',
        route: '/lecturer/attendance'
      }
    },
    {
      id: 3,
      type: 'INFO',
      message: 'Quiz submission received: Jane Smith completed Web Development Basics quiz',
      timeAgo: '15 mins ago',
      category: 'assessment',
      details: 'Student submitted quiz with 85% completion rate. Quiz duration: 45 minutes. Auto-graded questions scored 17/20. Manual review required for essay questions.',
      actionButton: {
        text: 'Review Submission',
        action: 'page',
        route: '/lecturer/assessment'
      }
    },
    {
      id: 4,
      type: 'INFO',
      message: 'Session code ABC123 generated successfully for CS101 - Introduction to Computer Science',
      timeAgo: '30 mins ago',
      category: 'system',
      details: 'Session is active and ready for student check-ins. Session expires in 2 hours. QR code and session details have been generated for distribution.',
      actionButton: {
        text: 'Manage Session',
        action: 'page',
        route: '/lecturer/generatesession'
      }
    },
    {
      id: 5,
      type: 'REMINDER',
      message: 'Multiple quiz submissions: 5 students completed JavaScript Fundamentals assessment',
      timeAgo: '1hr ago',
      category: 'assessment',
      details: 'Recent submissions from: Michael Johnson, Sarah Wilson, David Brown, Lisa Davis, and Kevin Miller. Average completion time: 38 minutes. Overall class performance: 78%.',
      actionButton: {
        text: 'View Results',
        action: 'page',
        route: '/lecturer/assessment'
      }
    },
    {
      id: 6,
      type: 'INFO',
      message: 'Session ended: CS101 session completed with 23 total attendees',
      timeAgo: '2hrs ago',
      category: 'attendance',
      details: 'Session ABC123 has been closed. Final attendance: 23/30 students (76.7%). Session duration: 2 hours 15 minutes. Attendance data exported to records.',
      actionButton: {
        text: 'Export Data',
        action: 'page',
        route: '/lecturer/export'
      }
    }
  ];

    // Merge real notifications with mock data (real ones first)
    const merged = [...contextNotifs, ...mockNotifications];
    setAllNotifications(merged);
    console.log(`📱 [LecturerNotifications] Loaded ${merged.length} total notifications (${contextNotifs.length} real, ${mockNotifications.length} mock)`);
  }, [contextNotifications]);

  // Filter notifications based on active tab
  const filteredNotifications = (() => {
    switch (activeTab) {
      case 'attendance':
        return allNotifications.filter(n => n.category === 'attendance');
      case 'assessment':
        return allNotifications.filter(n => n.category === 'assessment' || n.category === 'quiz');
      case 'system':
        return allNotifications.filter(n => n.category === 'system');
      case 'alert':
        return allNotifications.filter(n => n.category === 'alert');
      default:
        return allNotifications;
    }
  })();

  const handleDismiss = (id: string | number) => {
    console.log('Dismissing notification:', id);
    if (typeof id === 'string') {
      markAsRead(id);
    }
  };

  const toggleExpanded = (id: string | number) => {
    const newExpanded = new Set(expandedNotifications);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNotifications(newExpanded);
  };

  const handleActionClick = (actionButton: NotificationItem['actionButton']) => {
    if (!actionButton) return;

    switch (actionButton.action) {
      case 'page':
        if (actionButton.route) {
          window.location.href = actionButton.route;
        }
        break;
      case 'link':
        if (actionButton.url) {
          window.open(actionButton.url, '_blank');
        }
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'IMPORTANT':
        return '⚠️';
      case 'REMINDER':
        return '🔔';
      default:
        return '📋';
    }
  };

  const getNotificationTitle = (message: string) => {
    if (message.includes('attendance') || message.includes('check-in')) return 'Attendance Update';
    if (message.includes('quiz') || message.includes('submission')) return 'Assessment Activity';
    if (message.includes('session') || message.includes('generated')) return 'Session Management';
    if (message.includes('alert') || message.includes('low')) return 'Alert';
    return 'Notification';
  };

  return (
    <DashboardLayout showGreeting={true}>
      <div className="notifications-page">
        <div className="notifications-tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            className={`tab ${activeTab === 'assessment' ? 'active' : ''}`}
            onClick={() => setActiveTab('assessment')}
          >
            Assessment
          </button>
          <button 
            className={`tab ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            System
          </button>
          <button 
            className={`tab ${activeTab === 'alert' ? 'active' : ''}`}
            onClick={() => setActiveTab('alert')}
          >
            Alerts
          </button>
        </div>

        <div className="notifications-container">
          {filteredNotifications.map((notification) => {
            const isExpanded = expandedNotifications.has(notification.id);
            return (
              <div 
                key={notification.id} 
                className={`notification-item ${isExpanded ? 'expanded' : ''}`}
              >
                <div className={`notification-accent ${
                  notification.category === 'alert' ? 'deadline-accent' :
                  notification.category === 'attendance' ? 'completed-accent gray' :
                  notification.category === 'assessment' ? 'completed-accent gray' :
                  'general-accent'
                }`}></div>
                <div className="notification-content">
                  <div className="notification-header">
                    <div className="notification-type">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <h3 className="notification-title">
                      {notification.type}: {getNotificationTitle(notification.message)}
                    </h3>
                    <div className="notification-actions">
                      <span className="notification-time">{notification.timeAgo}</span>
                      <button 
                        className="dismiss-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDismiss(notification.id);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="notification-divider"></div>
                  <div 
                    className="notification-main-content"
                    onClick={() => toggleExpanded(notification.id)}
                  >
                    <p className="notification-message">{notification.message}</p>
                    {notification.details && (
                      <button className="expand-btn">
                        {isExpanded ? 'Show Less' : 'Show More'} {isExpanded ? '▲' : '▼'}
                      </button>
                    )}
                  </div>
                  
                  {isExpanded && notification.details && (
                    <div className="notification-details">
                      <div className="details-divider"></div>
                      <p className="notification-details-text">{notification.details}</p>
                      {notification.actionButton && (
                        <button 
                          className="action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActionClick(notification.actionButton);
                          }}
                        >
                          {notification.actionButton.text}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LecturerNotificationsPage;