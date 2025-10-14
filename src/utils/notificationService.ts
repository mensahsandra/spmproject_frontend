/**
 * Notification Service
 * Handles role-based notifications for students and lecturers
 */

import { getActiveRole } from './auth';

export interface NotificationData {
  type: 'attendance' | 'assessment' | 'quiz' | 'deadline' | 'general';
  title: string;
  message: string;
  data?: any;
  targetRole?: 'student' | 'lecturer' | 'both';
}

/**
 * Store notification in localStorage for the appropriate role
 */
export const storeNotification = (notification: NotificationData) => {
  const { targetRole = 'both', ...notificationContent } = notification;
  const timestamp = new Date().toISOString();
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const fullNotification = {
    id,
    ...notificationContent,
    timestamp,
    read: false
  };

  // Store for student
  if (targetRole === 'student' || targetRole === 'both') {
    const studentNotifs = getStoredNotifications('student');
    studentNotifs.unshift(fullNotification);
    localStorage.setItem('notifications_student', JSON.stringify(studentNotifs));
    console.log('📱 [NotificationService] Stored notification for students:', fullNotification);
  }

  // Store for lecturer
  if (targetRole === 'lecturer' || targetRole === 'both') {
    const lecturerNotifs = getStoredNotifications('lecturer');
    lecturerNotifs.unshift(fullNotification);
    localStorage.setItem('notifications_lecturer', JSON.stringify(lecturerNotifs));
    console.log('📱 [NotificationService] Stored notification for lecturers:', fullNotification);
  }

  // Trigger context refresh for immediate UI updates
  window.dispatchEvent(new CustomEvent('notificationsUpdated'));

  return fullNotification;
};

/**
 * Get stored notifications for a specific role
 */
export const getStoredNotifications = (role: 'student' | 'lecturer'): any[] => {
  try {
    const key = `notifications_${role}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to parse stored notifications:', error);
  }
  return [];
};

/**
 * Get notifications for the current active role
 */
export const getCurrentRoleNotifications = (): any[] => {
  const role = getActiveRole();
  if (role === 'student' || role === 'lecturer') {
    return getStoredNotifications(role);
  }
  return [];
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = (notificationId: string, role: 'student' | 'lecturer') => {
  const notifications = getStoredNotifications(role);
  const updated = notifications.map(notif => 
    notif.id === notificationId ? { ...notif, read: true } : notif
  );
  localStorage.setItem(`notifications_${role}`, JSON.stringify(updated));
};

/**
 * Clear all notifications for a role
 */
export const clearNotifications = (role: 'student' | 'lecturer') => {
  localStorage.setItem(`notifications_${role}`, JSON.stringify([]));
};

/**
 * Get unread count for a role
 */
export const getUnreadCount = (role: 'student' | 'lecturer'): number => {
  const notifications = getStoredNotifications(role);
  return notifications.filter(notif => !notif.read).length;
};

/**
 * Notification helpers for specific events
 */

// Quiz created by lecturer
export const notifyQuizCreated = (quizTitle: string, courseCode: string, courseName: string, deadline?: string) => {
  // Notify lecturer
  storeNotification({
    type: 'quiz',
    title: '✅ Quiz Created',
    message: `Quiz "${quizTitle}" for ${courseCode} has been created successfully.`,
    data: { quizTitle, courseCode, courseName, deadline },
    targetRole: 'lecturer'
  });

  // Notify students
  storeNotification({
    type: 'quiz',
    title: '📝 New Quiz Available',
    message: `New quiz "${quizTitle}" is available for ${courseName} (${courseCode})${deadline ? `. Due: ${new Date(deadline).toLocaleDateString()}` : ''}`,
    data: { quizTitle, courseCode, courseName, deadline },
    targetRole: 'student'
  });
};

// Student scans QR code
export const notifyAttendanceCheckIn = (studentName: string, studentId: string, courseCode: string, sessionCode: string) => {
  // Notify lecturer
  storeNotification({
    type: 'attendance',
    title: '🎓 New Student Check-in',
    message: `${studentName} (${studentId}) checked in for ${courseCode} session ${sessionCode}`,
    data: { studentName, studentId, courseCode, sessionCode, timestamp: new Date().toISOString() },
    targetRole: 'lecturer'
  });

  // Notify student (confirmation)
  storeNotification({
    type: 'attendance',
    title: '✅ Attendance Recorded',
    message: `Your attendance for ${courseCode} has been recorded successfully.`,
    data: { courseCode, sessionCode, timestamp: new Date().toISOString() },
    targetRole: 'student'
  });
};

// Student submits quiz
export const notifyQuizSubmission = (studentName: string, studentId: string, quizTitle: string, courseCode: string) => {
  // Notify lecturer
  storeNotification({
    type: 'assessment',
    title: '📋 Quiz Submission Received',
    message: `${studentName} submitted "${quizTitle}" for ${courseCode}`,
    data: { studentName, studentId, quizTitle, courseCode, timestamp: new Date().toISOString() },
    targetRole: 'lecturer'
  });

  // Notify student (confirmation)
  storeNotification({
    type: 'assessment',
    title: '✅ Quiz Submitted',
    message: `Your submission for "${quizTitle}" has been received. You'll be notified when it's graded.`,
    data: { quizTitle, courseCode, timestamp: new Date().toISOString() },
    targetRole: 'student'
  });
};

// Student submits assessment
export const notifyAssessmentSubmission = (studentName: string, studentId: string, assessmentTitle: string, courseCode: string, courseName?: string) => {
  // Notify lecturer
  storeNotification({
    type: 'assessment',
    title: '📋 Assessment Submission Received',
    message: `${studentName} (${studentId}) submitted "${assessmentTitle}" for ${courseName || courseCode}`,
    data: { studentName, studentId, assessmentTitle, courseCode, courseName, timestamp: new Date().toISOString() },
    targetRole: 'lecturer'
  });

  // Notify student (confirmation)
  storeNotification({
    type: 'assessment',
    title: '✅ Assessment Submitted',
    message: `Your submission for "${assessmentTitle}" has been received. You'll be notified when it's graded.`,
    data: { assessmentTitle, courseCode, courseName, timestamp: new Date().toISOString() },
    targetRole: 'student'
  });
};

// Lecturer grades quiz
export const notifyQuizGraded = (studentName: string, studentId: string, quizTitle: string, courseCode: string, grade: string) => {
  // Notify student
  storeNotification({
    type: 'assessment',
    title: '📊 Quiz Graded',
    message: `Your quiz "${quizTitle}" for ${courseCode} has been graded. Score: ${grade}`,
    data: { quizTitle, courseCode, grade, timestamp: new Date().toISOString() },
    targetRole: 'student'
  });

  // Notify lecturer (confirmation)
  storeNotification({
    type: 'assessment',
    title: '✅ Grading Complete',
    message: `Grade submitted for ${studentName}: ${quizTitle} - ${grade}`,
    data: { studentName, studentId, quizTitle, courseCode, grade, timestamp: new Date().toISOString() },
    targetRole: 'lecturer'
  });
};

// Bulk grading
export const notifyBulkGrading = (courseCode: string, courseName: string, studentCount: number, grade: string) => {
  // Notify lecturer
  storeNotification({
    type: 'assessment',
    title: '✅ Bulk Grading Complete',
    message: `Successfully graded ${studentCount} students for ${courseName} (${courseCode})`,
    data: { courseCode, courseName, studentCount, grade, timestamp: new Date().toISOString() },
    targetRole: 'lecturer'
  });

  // Notify students (they'll see individual grades)
  storeNotification({
    type: 'assessment',
    title: '📊 New Grade Posted',
    message: `Your grade for ${courseName} (${courseCode}) has been updated.`,
    data: { courseCode, courseName, timestamp: new Date().toISOString() },
    targetRole: 'student'
  });
};