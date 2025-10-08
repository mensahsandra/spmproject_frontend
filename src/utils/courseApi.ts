import { apiFetch } from './api';
import { getToken } from './auth';

// Course interfaces
export interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  credits: number;
  department: string;
  semester: string;
  year: string;
  lecturer?: {
    id: string;
    name: string;
    email: string;
  };
  isActive: boolean;
  enrollmentCount?: number;
  maxEnrollment?: number;
}

export interface UserCourse {
  courseId: string;
  course: Course;
  enrollmentDate: string;
  status: 'enrolled' | 'completed' | 'dropped' | 'pending';
  grade?: string;
  credits: number;
}

export interface CourseEnrollmentRequest {
  courseIds: string[];
  semester: string;
  year: string;
}

export interface CourseApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Functions
export const courseApi = {
  // Get all available courses
  async getAvailableCourses(semester?: string, year?: string): Promise<CourseApiResponse<Course[]>> {
    try {
      const params = new URLSearchParams();
      if (semester) params.append('semester', semester);
      if (year) params.append('year', year);
      
      const response = await apiFetch(`/api/courses/available?${params.toString()}`, {
        method: 'GET',
        role: 'student'
      });

      return {
        success: response.success || false,
        data: response.courses || [],
        message: response.message
      };
    } catch (error) {
      console.error('Error fetching available courses:', error);
      return {
        success: false,
        error: 'Failed to fetch available courses',
        data: []
      };
    }
  },

  // Get user's enrolled courses
  async getUserCourses(userId?: string): Promise<CourseApiResponse<UserCourse[]>> {
    try {
      const token = getToken('student');
      if (!token && !userId) {
        return {
          success: false,
          error: 'Authentication required',
          data: []
        };
      }

      const endpoint = userId ? `/api/courses/user/${userId}` : '/api/courses/my-courses';
      const response = await apiFetch(endpoint, {
        method: 'GET',
        role: 'student'
      });

      return {
        success: response.success || false,
        data: response.courses || [],
        message: response.message
      };
    } catch (error) {
      console.error('Error fetching user courses:', error);
      return {
        success: false,
        error: 'Failed to fetch user courses',
        data: []
      };
    }
  },

  // Enroll in courses
  async enrollInCourses(enrollmentData: CourseEnrollmentRequest): Promise<CourseApiResponse<UserCourse[]>> {
    try {
      const response = await apiFetch('/api/courses/enroll', {
        method: 'POST',
        role: 'student',
        body: JSON.stringify(enrollmentData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        success: response.success || false,
        data: response.enrolledCourses || [],
        message: response.message
      };
    } catch (error) {
      console.error('Error enrolling in courses:', error);
      return {
        success: false,
        error: 'Failed to enroll in courses'
      };
    }
  },

  // Update course enrollment
  async updateCourseEnrollment(courseId: string, action: 'enroll' | 'drop'): Promise<CourseApiResponse<UserCourse>> {
    try {
      const response = await apiFetch(`/api/courses/${courseId}/${action}`, {
        method: 'POST',
        role: 'student'
      });

      return {
        success: response.success || false,
        data: response.course,
        message: response.message
      };
    } catch (error) {
      console.error(`Error ${action}ing course:`, error);
      return {
        success: false,
        error: `Failed to ${action} course`
      };
    }
  },

  // Get course details
  async getCourseDetails(courseId: string): Promise<CourseApiResponse<Course>> {
    try {
      const response = await apiFetch(`/api/courses/${courseId}`, {
        method: 'GET',
        role: 'student'
      });

      return {
        success: response.success || false,
        data: response.course,
        message: response.message
      };
    } catch (error) {
      console.error('Error fetching course details:', error);
      return {
        success: false,
        error: 'Failed to fetch course details'
      };
    }
  },

  // Search courses
  async searchCourses(query: string, filters?: {
    department?: string;
    semester?: string;
    year?: string;
    credits?: number;
  }): Promise<CourseApiResponse<Course[]>> {
    try {
      const params = new URLSearchParams();
      params.append('q', query);
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value.toString());
        });
      }

      const response = await apiFetch(`/api/courses/search?${params.toString()}`, {
        method: 'GET',
        role: 'student'
      });

      return {
        success: response.success || false,
        data: response.courses || [],
        message: response.message
      };
    } catch (error) {
      console.error('Error searching courses:', error);
      return {
        success: false,
        error: 'Failed to search courses',
        data: []
      };
    }
  },

  // Get departments
  async getDepartments(): Promise<CourseApiResponse<string[]>> {
    try {
      const response = await apiFetch('/api/courses/departments', {
        method: 'GET',
        role: 'student'
      });

      return {
        success: response.success || false,
        data: response.departments || [],
        message: response.message
      };
    } catch (error) {
      console.error('Error fetching departments:', error);
      return {
        success: false,
        error: 'Failed to fetch departments',
        data: []
      };
    }
  }
};

// Mock data for development/fallback
export const mockCourses: Course[] = [
  {
    id: 'cs101',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    description: 'Fundamental concepts of computer science and programming',
    credits: 3,
    department: 'Computer Science',
    semester: 'Fall',
    year: '2024',
    lecturer: {
      id: 'lec1',
      name: 'Dr. Kwabena Mensah',
      email: 'kwabena@university.edu'
    },
    isActive: true,
    enrollmentCount: 45,
    maxEnrollment: 60
  },
  {
    id: 'bit364',
    code: 'BIT364',
    name: 'Web Development',
    description: 'Modern web development technologies and frameworks',
    credits: 4,
    department: 'Information Technology',
    semester: 'Fall',
    year: '2024',
    lecturer: {
      id: 'lec2',
      name: 'Dr. Abena Ayimadu',
      email: 'abena@university.edu'
    },
    isActive: true,
    enrollmentCount: 32,
    maxEnrollment: 40
  },
  {
    id: 'bit301',
    code: 'BIT301',
    name: 'Database Management',
    description: 'Database design, implementation, and management',
    credits: 3,
    department: 'Information Technology',
    semester: 'Fall',
    year: '2024',
    lecturer: {
      id: 'lec3',
      name: 'Prof. Sarah Opoku Agyeman',
      email: 'sarah@university.edu'
    },
    isActive: true,
    enrollmentCount: 28,
    maxEnrollment: 35
  },
  {
    id: 'bit367',
    code: 'BIT367',
    name: 'Network Security',
    description: 'Network security principles and implementation',
    credits: 3,
    department: 'Information Technology',
    semester: 'Fall',
    year: '2024',
    lecturer: {
      id: 'lec4',
      name: 'Dr. Michael Johnson',
      email: 'michael@university.edu'
    },
    isActive: true,
    enrollmentCount: 22,
    maxEnrollment: 30
  }
];

// Utility functions
export const courseUtils = {
  // Get course by code
  getCourseByCode: (courses: Course[], code: string): Course | undefined => {
    return courses.find(course => course.code.toLowerCase() === code.toLowerCase());
  },

  // Filter courses by department
  filterByDepartment: (courses: Course[], department: string): Course[] => {
    return courses.filter(course => course.department === department);
  },

  // Get unique departments
  getUniqueDepartments: (courses: Course[]): string[] => {
    return [...new Set(courses.map(course => course.department))].sort();
  },

  // Check if course is full
  isCourseFullyEnrolled: (course: Course): boolean => {
    return course.maxEnrollment ? (course.enrollmentCount || 0) >= course.maxEnrollment : false;
  },

  // Format course display name
  formatCourseDisplayName: (course: Course): string => {
    return `${course.code} - ${course.name}`;
  },

  // Calculate total credits
  calculateTotalCredits: (courses: Course[]): number => {
    return courses.reduce((total, course) => total + course.credits, 0);
  }
};