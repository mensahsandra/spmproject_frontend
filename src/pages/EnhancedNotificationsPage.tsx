import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import type { NotificationType } from '../context/NotificationContext';
import { Bell, Check, CheckCheck, Trash2, GraduationCap, FileText, BookOpen, Clock, AlertCircle, X, Info } from 'lucide-react';

const EnhancedNotificationsPage: React.FC = () => {
  const { notifications, unreadCount, unreadByType, markAsRead, markAllAsRead, clearNotifications, addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | NotificationType>('all');
  
  // Add sample notifications for demo
  const addSampleNotifications = () => {
    // Clear existing notifications first
    clearNotifications();
    
    // Add sample notifications
    addNotification({
      type: 'deadline',
      title: 'IMPORTANT:',
      message: 'You have 3 days left to complete lecturer assessments.',
      data: { priority: 'high' }
    });
    
    addNotification({
      type: 'assessment',
      title: 'REMINDER:',
      message: 'Have you uploaded your group presentation for [Principles in Mgt]? Due today!',
      data: { course: 'Principles in Mgt' }
    });
    
    addNotification({
      type: 'general',
      title: 'REMINDER:',
      message: 'Final exams are in two weeks - check the timetable and plan ahead.',
      data: { examWeek: true }
    });
  };

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeTab);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'attendance': return <GraduationCap className="w-5 h-5" />;
      case 'assessment': return <FileText className="w-5 h-5" />;
      case 'quiz': return <BookOpen className="w-5 h-5" />;
      case 'deadline': return <Clock className="w-5 h-5" />;
      case 'general': return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getColor = (type: NotificationType) => {
    switch (type) {
      case 'attendance': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'assessment': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'quiz': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'deadline': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'general': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#007A3B] rounded-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={addSampleNotifications}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                🧪 Load Sample Data
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-2 px-4 py-2 bg-[#007A3B] text-white rounded-lg hover:bg-[#006030] transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear all</span>
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#007A3B] text-white'
                  : 'bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333333]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'attendance'
                  ? 'bg-green-500 text-white'
                  : 'bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333333]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Attendance ({unreadByType.attendance})
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'assessment'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333333]'
              }`}
            >
              <FileText className="w-4 h-4" />
              Assessment ({unreadByType.assessment})
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'quiz'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333333]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Quiz ({unreadByType.quiz})
            </button>
            <button
              onClick={() => setActiveTab('deadline')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                activeTab === 'deadline'
                  ? 'bg-red-500 text-white'
                  : 'bg-white dark:bg-[#262626] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333333]'
              }`}
            >
              <Clock className="w-4 h-4" />
              Deadlines ({unreadByType.deadline})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white dark:bg-[#262626] rounded-lg p-12 text-center">
              <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                {activeTab === 'all' ? 'No notifications yet' : `No ${activeTab} notifications`}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md relative"
              >
                {/* Left colored bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-lg ${
                  notification.type === 'deadline' ? 'bg-red-500' :
                  notification.type === 'assessment' ? 'bg-blue-500' :
                  notification.type === 'attendance' ? 'bg-green-500' :
                  notification.type === 'quiz' ? 'bg-purple-500' :
                  'bg-gray-500'
                }`}></div>
                
                <div className="flex items-start justify-between">
                  <div className="flex-1 pl-4">
                    {/* Notification type label */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold ${
                        notification.type === 'deadline' ? 'text-red-600' :
                        notification.type === 'assessment' ? 'text-blue-600' :
                        notification.type === 'attendance' ? 'text-green-600' :
                        notification.type === 'quiz' ? 'text-purple-600' :
                        'text-gray-600'
                      }`}>
                        {notification.title}
                      </span>
                      {/* Optional info icon for certain types */}
                      {(notification.type === 'assessment' || notification.type === 'deadline') && (
                        <Info className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Main message */}
                    <p className="text-gray-900 font-medium mb-3 leading-relaxed">
                      {notification.message}
                    </p>
                    
                    {/* Timestamp */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs rounded-full hover:bg-green-600 transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => {
                            // Remove notification (dismiss)
                            const updatedNotifications = notifications.filter(n => n.id !== notification.id);
                            localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
                            window.location.reload(); // Simple refresh to update state
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedNotificationsPage;
