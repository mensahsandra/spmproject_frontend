import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type NotificationType = 'attendance' | 'assessment' | 'quiz' | 'deadline' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  unreadByType: Record<NotificationType, number>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  getNotificationsByType: (type: NotificationType) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
      } catch (error) {
        console.error('Failed to parse stored notifications:', error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: `notification-${newNotification.id}`,
      });
    }

    // Show in-app toast notification
    showToast(notification.title, notification.message, notification.type);

    console.log(`🔔 Notification added: [${notification.type}] ${notification.title}`);
  };

  const showToast = (title: string, message: string, type: NotificationType) => {
    const colors: Record<NotificationType, string> = {
      attendance: 'bg-green-500',
      assessment: 'bg-blue-500',
      quiz: 'bg-purple-500',
      deadline: 'bg-red-500',
      general: 'bg-gray-500',
    };

    const icons: Record<NotificationType, string> = {
      attendance: '🎓',
      assessment: '📝',
      quiz: '📋',
      deadline: '⏰',
      general: '📢',
    };

    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-20 right-4 z-[9999] min-w-[320px] max-w-[400px] ${colors[type]} text-white rounded-lg shadow-2xl p-4 animate-slide-in-right`;
    alertDiv.style.cssText = 'animation: slideInRight 0.3s ease-out;';
    
    alertDiv.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="text-2xl flex-shrink-0">${icons[type]}</div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-sm mb-1">${title}</div>
          <div class="text-sm opacity-90 break-words">${message}</div>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-white/80 hover:text-white text-xl leading-none">&times;</button>
      </div>
    `;

    document.body.appendChild(alertDiv);

    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
          if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
          }
        }, 300);
      }
    }, 8000);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const getNotificationsByType = (type: NotificationType) => {
    return notifications.filter(notif => notif.type === type);
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const unreadByType = notifications.reduce((acc, notif) => {
    if (!notif.read) {
      acc[notif.type] = (acc[notif.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<NotificationType, number>);

  // Ensure all types have a count (even if 0)
  const completeUnreadByType: Record<NotificationType, number> = {
    attendance: unreadByType.attendance || 0,
    assessment: unreadByType.assessment || 0,
    quiz: unreadByType.quiz || 0,
    deadline: unreadByType.deadline || 0,
    general: unreadByType.general || 0,
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    unreadByType: completeUnreadByType,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    getNotificationsByType,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </NotificationContext.Provider>
  );
};
