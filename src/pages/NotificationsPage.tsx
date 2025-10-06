import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import '../css/notifications.css';

interface NotificationItem {
    id: number;
    type: 'IMPORTANT' | 'REMINDER' | 'INFO';
    message: string;
    timeAgo: string;
    category: 'deadline' | 'general' | 'completed';
    details?: string;
    actionButton?: {
        text: string;
        action: 'link' | 'page' | 'file';
        url?: string;
        route?: string;
    };
}

const NotificationsPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [expandedNotifications, setExpandedNotifications] = React.useState<Set<number>>(new Set());
    // Clear unread badge when visiting notifications
    React.useEffect(() => {
        try {
            localStorage.setItem('unreadNotifications', '0');
            const prev: any = history.state || {};
            history.replaceState({ ...prev, unreadCount: 0 }, '');
        } catch {}
    }, []);
    
    // Check if we came from deadlines (will show only deadline notifications)
    const isDeadlineView = location.state?.from === 'deadlines';
    const isNotificationsView = location.state?.from === 'notifications';
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    // Prefer completed tab when we come from injected attendance state
    const fromTabState = (history.state as any)?.fromTab;
    const [activeTab, setActiveTab] = React.useState<'overview' | 'deadlines' | 'notifications' | 'completed'>(() => {
        if (tabParam === 'deadlines') return 'deadlines';
        if (tabParam === 'notifications') return 'notifications';
        if (tabParam === 'completed') return 'completed';
        if (isDeadlineView) return 'deadlines';
        if (fromTabState === 'completed') return 'completed';
        if (isNotificationsView) return 'notifications';
        return 'overview';
    });
    
    // Defaults
    let notifications: NotificationItem[] = [
        {
            id: 1,
            type: 'IMPORTANT',
            message: 'You have 3 days left to complete lecturer assessments.',
            timeAgo: '10 mins ago',
            category: 'deadline',
            details: 'The lecturer assessment period ends on December 15th, 2024. Please evaluate all your lecturers for this semester to help improve the quality of education. Your feedback is anonymous and valuable.',
            actionButton: {
                text: 'Assess Lecturers',
                action: 'link',
                url: '#' // Will be provided later
            }
        },
        {
            id: 2,
            type: 'REMINDER',
            message: 'Have you uploaded your group presentation for [Principles in Mgt]? Due today!',
            timeAgo: '20 mins ago',
            category: 'deadline',
            details: 'Your group presentation for Principles in Management is due today at 11:59 PM. Make sure all group members have contributed and the final presentation meets the requirements outlined in the course syllabus.',
            actionButton: {
                text: 'Upload Assignment',
                action: 'link',
                url: '#' // Will be provided later
            }
        },
        {
            id: 3,
            type: 'REMINDER',
            message: 'Final exams are in two weeks - check the timetable and plan ahead.',
            timeAgo: '1hr ago',
            category: 'deadline',
            details: 'Final examinations for the semester will begin on January 8th, 2025. Review your exam schedule, prepare study materials, and ensure you know the exam venues and times for each course.',
            actionButton: {
                text: 'Check Timetable',
                action: 'link',
                url: '#' // Will be provided later
            }
        },
        {
            id: 4,
            type: 'IMPORTANT',
            message: 'Settle outstanding balance. Pay at least 70% of your fees by [12/07/2025].',
            timeAgo: '2hrs ago',
            category: 'deadline',
            details: 'Your current outstanding balance is GHS 2,450. To avoid registration issues for next semester, please pay at least 70% (GHS 1,715) by December 7th, 2025. You can pay online or visit the finance office.',
            actionButton: {
                text: 'Pay Fees',
                action: 'link',
                url: '#' // Will be provided later
            }
        },
        {
            id: 5,
            type: 'REMINDER',
            message: 'Heads up! Mid-semester exams begin in one week. Prepare well.',
            timeAgo: '1 day ago',
            category: 'deadline',
            details: 'Mid-semester examinations will commence on November 20th, 2024. Review your course materials, attend revision sessions, and ensure you have all necessary materials for the exams.',
            actionButton: {
                text: 'Check Timetable',
                action: 'link',
                url: '#' // Will be provided later
            }
        },
        {
            id: 6,
            type: 'REMINDER',
            message: 'New course materials have been uploaded to your portal.',
            timeAgo: '2 days ago',
            category: 'general',
            details: 'Updated lecture notes and reading materials for Information Systems Management and Database Systems have been uploaded. Please download and review them before the next class.',
            actionButton: {
                text: 'View Materials',
                action: 'link',
                url: '#' // Will be provided later
            }
        },
        {
            id: 7,
            type: 'IMPORTANT',
            message: 'System maintenance scheduled for this weekend. Plan accordingly.',
            timeAgo: '3 days ago',
            category: 'general',
            details: 'The student portal will be unavailable from Saturday 2:00 AM to Sunday 6:00 AM for scheduled maintenance. Please complete any urgent tasks before this time.',
            actionButton: {
                text: 'More Info',
                action: 'link',
                url: '#' // Will be provided later
            }
        },
        {
            id: 9,
            type: 'INFO',
            message: 'Welcome to the new semester! Check out the updated features.',
            timeAgo: '1 week ago',
            category: 'general',
            details: 'We have added new features to improve your learning experience including enhanced grade tracking, better notification system, and improved mobile interface.',
            actionButton: {
                text: 'Explore Features',
                action: 'link',
                url: '#'
            }
        },
        {
            id: 10,
            type: 'INFO',
            message: 'Library hours extended during exam period.',
            timeAgo: '1 week ago',
            category: 'general',
            details: 'The university library will be open 24/7 during the examination period from December 1st to December 20th. Additional study spaces and resources are available.',
            actionButton: {
                text: 'Library Info',
                action: 'link',
                url: '#'
            }
        },
        {
            id: 11,
            type: 'REMINDER',
            message: 'Student counselling services are available. Book your session.',
            timeAgo: '2 weeks ago',
            category: 'general',
            details: 'Free counselling services are available for all students. Whether you need academic guidance, personal support, or career advice, our qualified counsellors are here to help.',
            actionButton: {
                text: 'Book Session',
                action: 'link',
                url: 'https://kcc.knust.edu.gh/'
            }
        },
        {
            id: 8,
            type: 'REMINDER',
            message: 'Project proposal reviewed. Task marked as completed.',
            timeAgo: '3 days ago',
            category: 'completed',
            details: 'Your supervisor has reviewed and accepted your project proposal. Next milestone will be shared soon.'
        }
    ];

    // Load persisted notifications from localStorage
    try {
        const raw = localStorage.getItem('notifications');
        const saved = raw ? JSON.parse(raw) as NotificationItem[] : [];
        if (Array.isArray(saved) && saved.length) {
            // Prepend saved to show most recent first
            notifications = [...saved, ...notifications];
        }
    } catch {}
    // Include injected notification from attendance (if present)
    const injected = (history.state as any)?.injectedNotification;
    if (injected) {
        notifications = [injected as NotificationItem, ...notifications];
    }

    // Filter notifications based on active tab
    const filteredNotifications = (() => {
        switch (activeTab) {
            case 'deadlines':
                return notifications.filter(n => n.category === 'deadline');
            case 'notifications':
                return notifications.filter(n => n.category === 'general');
            case 'completed':
                return notifications.filter(n => n.category === 'completed');
            default:
                return notifications;
        }
    })();

    // Back navigation handled via persistent sidebar; no back button here

    const handleDismiss = (id: number) => {
        // Handle notification dismissal
        console.log('Dismissing notification:', id);
    };

    const toggleExpanded = (id: number) => {
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
            case 'link':
                if (actionButton.url && actionButton.url !== '#') {
                    window.open(actionButton.url, '_blank');
                } else {
                    alert(`${actionButton.text} - Link will be provided soon`);
                }
                break;
            case 'page':
                if (actionButton.route) {
                    navigate(actionButton.route);
                } else {
                    alert(`${actionButton.text} - Page will be available soon`);
                }
                break;
            case 'file':
                if (actionButton.url) {
                    window.open(actionButton.url, '_blank');
                } else {
                    alert(`${actionButton.text} - File will be available soon`);
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
        if (message.includes('lecturer assessment')) return 'Lecturer Assessment';
        if (message.includes('presentation') || message.includes('upload')) return 'Assignment Due';
        if (message.includes('exam')) return 'Exam Schedule';
        if (message.includes('fees') || message.includes('balance')) return 'Fee Payment';
        if (message.includes('materials')) return 'Course Materials';
        if (message.includes('maintenance')) return 'System Update';
        return 'Notification';
    };

    return (
        <DashboardLayout showGreeting={true}>
            <div className="notifications-page">
                <div className="notifications-header">
                    {activeTab !== 'deadlines' && <h1>Notifications</h1>}
                </div>
            <div className="notifications-tabs">
                <button 
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >Overview</button>
                <button 
                    className={`tab ${activeTab === 'deadlines' ? 'active' : ''}`}
                    onClick={() => setActiveTab('deadlines')}
                >Deadlines</button>
                <button 
                    className={`tab ${activeTab === 'notifications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('notifications')}
                >Notifications</button>
                <button 
                    className={`tab ${activeTab === 'completed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('completed')}
                >Completed</button>
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
                                notification.category === 'deadline' ? 'deadline-accent' :
                                notification.category === 'completed' ? 'completed-accent blue' :
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
                                        {/* Academic Calendar shown if message or details mention calendar */}
                                        {(notification.message.toLowerCase().includes('calendar') || (notification.details && notification.details.toLowerCase().includes('calendar'))) && (
                                            <div className="academic-calendar">
                                                <h4>Academic Calendar</h4>
                                                <ul>
                                                    <li>Semester Start: September 15, 2025</li>
                                                    <li>Mid-Semester Exams: November 20, 2025</li>
                                                    <li>Final Exams: January 8, 2026</li>
                                                    <li>Semester End: January 20, 2026</li>
                                                </ul>
                                            </div>
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

export default NotificationsPage;