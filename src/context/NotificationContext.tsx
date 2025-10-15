import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getActiveRole } from '../utils/auth';
import type { NotificationMetadata } from '../utils/notificationService';

export type NotificationType = 'attendance' | 'assessment' | 'quiz' | 'deadline' | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: NotificationMetadata;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  unreadByType: Record<NotificationType, number>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
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

  // Get the storage key based on active role
  const getStorageKey = () => {
    const role = getActiveRole();
    if (role === 'student' || role === 'lecturer') {
      return `notifications_${role}`;
    }
    return 'notifications'; // fallback
  };

  // Load notifications from localStorage on mount and when role changes
  useEffect(() => {
    const loadNotifications = () => {
      const storageKey = getStorageKey();
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setNotifications(parsed);
          console.log(`📱 [NotificationContext] Loaded ${parsed.length} notifications for ${storageKey}`);
        } catch (error) {
          console.error('Failed to parse stored notifications:', error);
        }
      } else {
        setNotifications([]);
      }
    };

    loadNotifications();

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === getStorageKey() && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setNotifications(parsed);
        } catch (error) {
          console.error('Failed to parse storage change:', error);
        }
      }
    };

    // Listen for custom notification update events
    const handleNotificationUpdate = () => {
      console.log('📱 [NotificationContext] Reloading notifications due to update event');
      loadNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notificationsUpdated', handleNotificationUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notificationsUpdated', handleNotificationUpdate);
    };
  }, []); // Only run on mount

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    const storageKey = getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    console.log('🔔 [NotificationContext] addNotification called:', notification);
    
    const newNotification: Notification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    console.log('🔔 [NotificationContext] New notification created:', newNotification);
    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      console.log('🔔 [NotificationContext] Notifications updated. Total:', updated.length);
      return updated;
    });

    // Show browser notification if permission granted
    console.log('🔔 [NotificationContext] Browser notification permission:', Notification.permission);
    if (Notification.permission === 'granted') {
      console.log('🔔 [NotificationContext] Showing browser notification');
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: `notification-${newNotification.id}`,
      });
    } else {
      console.log('⚠️ [NotificationContext] Browser notifications not granted');
    }

    // Show in-app toast notification
    console.log('🔔 [NotificationContext] Showing toast notification');
    showToast(notification.title, notification.message, notification.type);

    console.log(`✅ [NotificationContext] Notification added: [${notification.type}] ${notification.title}`);
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

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
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
    removeNotification,
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
