import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

interface Deadline {
  id: string;
  title: string;
  due: string;
  course: string;
  type: string;
  status?: 'pending' | 'completed' | 'overdue';
}

export function useDeadlineNotifications() {
  const [deadlineCount, setDeadlineCount] = useState(0);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchDeadlines = async () => {
      try {
        setLoading(true);
        const data: any = await apiFetch('/api/deadlines', { 
          method: 'GET', 
          role: 'student' 
        });
        
        if (!active) return;

        const deadlinesList = Array.isArray(data?.deadlines) 
          ? data.deadlines 
          : (Array.isArray(data) ? data : []);

        // Filter for pending/upcoming deadlines only
        const now = new Date();
        const pendingDeadlines = deadlinesList.filter((deadline: Deadline) => {
          const dueDate = new Date(deadline.due);
          return !isNaN(dueDate.getTime()) && 
                 dueDate > now && 
                 deadline.status !== 'completed';
        });

        setDeadlines(pendingDeadlines);
        setDeadlineCount(pendingDeadlines.length);
        
        // Store in localStorage for quick access
        localStorage.setItem('deadlineCount', pendingDeadlines.length.toString());
        
      } catch (error) {
        console.warn('Failed to fetch deadlines:', error);
        
        // Fallback to localStorage or default mock data
        const fallbackCount = localStorage.getItem('deadlineCount');
        if (fallbackCount) {
          setDeadlineCount(parseInt(fallbackCount, 10) || 0);
        } else {
          // Mock data for demonstration
          const mockDeadlines = [
            {
              id: '1',
              title: 'Assignment 1 Submission',
              due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
              course: 'BIT 364',
              type: 'Assignment',
              status: 'pending' as const
            },
            {
              id: '2', 
              title: 'Mid Semester Project',
              due: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
              course: 'BIT 365',
              type: 'Project',
              status: 'pending' as const
            }
          ];
          
          setDeadlines(mockDeadlines);
          setDeadlineCount(mockDeadlines.length);
          localStorage.setItem('deadlineCount', mockDeadlines.length.toString());
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDeadlines();

    // Refresh every 5 minutes
    const interval = setInterval(fetchDeadlines, 5 * 60 * 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Function to manually refresh deadlines
  const refreshDeadlines = async () => {
    setLoading(true);
    // Trigger useEffect by updating a dependency or call fetchDeadlines directly
    window.location.reload(); // Simple approach for now
  };

  return {
    deadlineCount,
    deadlines,
    loading,
    refreshDeadlines
  };
}