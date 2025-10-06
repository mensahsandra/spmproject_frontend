import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Clock } from "lucide-react";
import { useDeadlineNotifications } from "../../hooks/useDeadlineNotifications";

interface StudentDashboardProps {
  user?: {
    name?: string;
    role?: string;
    identifier?: string;
  };
  data?: {
    stats?: {
      totalAttended?: number;
      coursesEnrolled?: number;
      unreadNotifications?: number;
    };
    notifications?: Array<{
      id: string;
      title: string;
      message: string;
      priority: 'urgent' | 'normal';
      daysLeft: number | null;
    }>;
  };
}

export default function StudentDashboard({ user, data }: StudentDashboardProps) {
  const navigate = useNavigate();
  const { deadlineCount } = useDeadlineNotifications();

  // Mock data if not provided
  const mockData = {
    stats: {
      totalAttended: data?.stats?.totalAttended || 24,
      coursesEnrolled: data?.stats?.coursesEnrolled || 6,
      unreadNotifications: data?.stats?.unreadNotifications || 3,
    },
    notifications: data?.notifications || [
      {
        id: '1',
        title: 'Assignment Due Soon',
        message: 'Computer Networks assignment is due in 2 days',
        priority: 'urgent' as const,
        daysLeft: 2,
      },
      {
        id: '2',
        title: 'Exam Schedule Released',
        message: 'Mid-semester exam schedule has been published',
        priority: 'normal' as const,
        daysLeft: 7,
      },
    ],
  };

  const dashboardData = data || mockData;

  return (
    <div className="p-4 md:p-8">
      {/* Welcome Banner */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 md:p-8 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-2 font-sora">
          Hello, {user?.name?.split(' ')[0] || 'Student'}!
        </h1>
        <p className="text-[#666666] dark:text-[#AAAAAA] font-inter">
          Welcome to your student dashboard. Here you can check attendance, view grades, and stay updated with important deadlines.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Attendance Card */}
        <div
          className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          onClick={() => navigate('/student/record-attendance')}
        >
          <div className="flex items-start gap-4">
            {/* Status Bar */}
            <div className="w-1 h-16 rounded-full bg-gradient-to-b from-[#006530] to-[#8BC34A] flex-shrink-0"></div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Users size={24} className="text-[#007A3B]" />
                <h3 className="text-lg font-semibold text-black dark:text-white font-bricolage">
                  Attendance
                </h3>
              </div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-4 font-inter">
                Record your class attendance quickly
              </p>
              <div className="text-xs text-[#007A3B] font-medium">
                Total Attended: {dashboardData.stats?.totalAttended || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Check Performance Card */}
        <div
          className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          onClick={() => navigate('/student/select-result')}
        >
          <div className="flex items-start gap-4">
            {/* Status Bar */}
            <div className="w-1 h-16 rounded-full bg-gradient-to-b from-[#006530] to-[#8BC34A] flex-shrink-0"></div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <BookOpen size={24} className="text-[#007A3B]" />
                <h3 className="text-lg font-semibold text-black dark:text-white font-bricolage">
                  Check Performance
                </h3>
              </div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-4 font-inter">
                View your academic grades and results
              </p>
              <div className="text-xs text-[#007A3B] font-medium">
                Courses Enrolled: {dashboardData.stats?.coursesEnrolled || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Card */}
        <div
          className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          onClick={() => navigate('/student/assessment')}
        >
          <div className="flex items-start gap-4">
            {/* Status Bar */}
            <div className="w-1 h-16 rounded-full bg-gradient-to-b from-[#0066CC] to-[#4A90E2] flex-shrink-0"></div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#0066CC]">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3 className="text-lg font-semibold text-black dark:text-white font-bricolage">
                  Assessment
                </h3>
                {dashboardData.stats?.unreadNotifications && dashboardData.stats.unreadNotifications > 0 && (
                  <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[20px] text-center">
                    {dashboardData.stats.unreadNotifications}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-4 font-inter">
                Take quizzes and submit assignments
              </p>
              <div className="text-xs text-[#0066CC] font-medium">
                {dashboardData.stats?.unreadNotifications ? `${dashboardData.stats.unreadNotifications} new quiz${dashboardData.stats.unreadNotifications > 1 ? 'zes' : ''}` : 'No new assessments'}
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines Card */}
        <div
          className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
          onClick={() => navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } })}
        >
          <div className="flex items-start gap-4">
            {/* Status Bar - Red for urgent */}
            <div className="w-1 h-16 rounded-full bg-gradient-to-b from-[#DC2626] to-[#FF6B6B] flex-shrink-0"></div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Clock size={24} className="text-[#DC2626]" />
                <h3 className="text-lg font-semibold text-black dark:text-white font-bricolage">
                  Upcoming Deadlines
                </h3>
                {deadlineCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full min-w-[20px] text-center">
                    {deadlineCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-4 font-inter">
                Stay on top of important deadlines
              </p>
              <div className="text-xs text-[#DC2626] font-medium">
                {deadlineCount > 0 ? `${deadlineCount} pending deadline${deadlineCount > 1 ? 's' : ''}` : 'No pending deadlines'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications */}
      {dashboardData.notifications && dashboardData.notifications.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-4 font-bricolage">
            Recent Notifications
          </h2>
          <div className="space-y-4">
            {dashboardData.notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-[#E6E6E6] dark:border-[#333333] p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-1 h-12 rounded-full flex-shrink-0 ${notification.priority === 'urgent' ? 'bg-gradient-to-b from-[#DC2626] to-[#FF6B6B]' : 'bg-gradient-to-b from-[#F59E0B] to-[#FCD34D]'
                    }`}></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-black dark:text-white mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-sm text-[#666666] dark:text-[#AAAAAA] mb-2">
                      {notification.message}
                    </p>
                    {notification.daysLeft !== null && (
                      <div className="text-xs text-[#DC2626] font-medium">
                        {notification.daysLeft > 0 ? `${notification.daysLeft} days left` : 'Due today!'}
                      </div>
                    )}
                  </div>
                  {notification.priority === 'urgent' && (
                    <button className="px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-sm font-medium hover:bg-[#2563EB] transition-colors">
                      Take Action
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}