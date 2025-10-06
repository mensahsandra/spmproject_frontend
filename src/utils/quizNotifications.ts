interface QuizNotification {
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
  quizId?: string;
  courseCode?: string;
  dueDate?: string;
}

export const addQuizNotification = (
  quizTitle: string,
  courseCode: string,
  courseName: string,
  quizId: string,
  dueDate?: string,
  restrictToAttendees: boolean = false
) => {
  try {
    // Get existing notifications
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    
    // Create new quiz notification
    const newNotification: QuizNotification = {
      id: Date.now(),
      type: 'IMPORTANT',
      message: `New quiz available: "${quizTitle}" for ${courseCode}`,
      timeAgo: 'Just now',
      category: 'deadline',
      details: `A new quiz "${quizTitle}" has been created for ${courseCode} - ${courseName}. ${
        restrictToAttendees 
          ? 'This quiz is only available to students who attended the session.' 
          : 'All enrolled students can take this quiz.'
      }${dueDate ? ` Due: ${new Date(dueDate).toLocaleString()}` : ''}`,
      actionButton: {
        text: 'Take Quiz',
        action: 'page',
        route: `/student/quiz/${quizId}`
      },
      quizId,
      courseCode,
      dueDate
    };

    // Add to notifications array
    const updatedNotifications = [newNotification, ...existingNotifications];
    
    // Save to localStorage
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    
    // Update unread count
    const currentUnread = parseInt(localStorage.getItem('unreadNotifications') || '0');
    localStorage.setItem('unreadNotifications', (currentUnread + 1).toString());
    
    console.log('Quiz notification added:', newNotification);
    return newNotification;
  } catch (error) {
    console.error('Failed to add quiz notification:', error);
    return null;
  }
};

export const markQuizCompleted = (quizId: string) => {
  try {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = notifications.map((notification: QuizNotification) => {
      if (notification.quizId === quizId) {
        return {
          ...notification,
          category: 'completed',
          type: 'INFO' as const,
          message: notification.message.replace('New quiz available:', 'Quiz completed:'),
          actionButton: {
            text: 'View Results',
            action: 'page' as const,
            route: `/student/quiz/${quizId}/results`
          }
        };
      }
      return notification;
    });
    
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    return true;
  } catch (error) {
    console.error('Failed to mark quiz as completed:', error);
    return false;
  }
};

export const getQuizNotifications = () => {
  try {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifications.filter((n: QuizNotification) => n.quizId);
  } catch (error) {
    console.error('Failed to get quiz notifications:', error);
    return [];
  }
};

export const simulateStudentQuizNotifications = () => {
  // Simulate receiving quiz notifications for demo purposes
  const sampleQuizzes = [
    {
      title: 'Web Development Basics',
      courseCode: 'BIT364',
      courseName: 'Web Development',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
      restrictToAttendees: false
    },
    {
      title: 'Database Design Quiz',
      courseCode: 'BIT301',
      courseName: 'Database Management',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      restrictToAttendees: true
    }
  ];

  sampleQuizzes.forEach((quiz, index) => {
    setTimeout(() => {
      addQuizNotification(
        quiz.title,
        quiz.courseCode,
        quiz.courseName,
        `quiz_${Date.now()}_${index}`,
        quiz.dueDate,
        quiz.restrictToAttendees
      );
    }, index * 1000); // Stagger notifications
  });
};