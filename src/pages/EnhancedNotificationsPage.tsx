import React, { useState } from 'react';
import { useNotifications, NotificationType } from '../context/NotificationContext';
import { Bell, Check, CheckCheck, Trash2, GraduationCap, FileText, BookOpen, Clock, AlertCircle } from 'lucide-react';

const EnhancedNotificationsPage: React.FC = () => {
  const { notifications, unreadCount, unreadByType, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [activeTab, setActiveTab] = useState<'all' | NotificationType>('all');

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a]">
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
                className={`bg-white dark:bg-[#262626] rounded-lg p-4 transition-all hover:shadow-md ${
                  !notification.read ? 'border-l-4 border-[#007A3B]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`p-3 rounded-lg ${getColor(notification.type)}`}>
                    {getIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-[#007A3B] rounded-full"></span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="flex items-center gap-1 text-xs text-[#007A3B] hover:text-[#006030] font-medium"
                        >
                          <Check className="w-3 h-3" />
                          Mark as read
                        </button>
                      )}
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
