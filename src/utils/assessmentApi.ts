/**
 * Assessment API Utilities
 * 
 * Comprehensive API functions for the lecturer assessment management system
 */

import { apiFetch } from './api';

// Interface definitions
export interface Assessment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  assessmentType: 'Class Assessment' | 'Mid Semester' | 'End of Semester';
  format: 'Multiple Choice' | 'Description/Typing' | 'File/Document Upload';
  questions?: MultipleChoiceQuestion[] | DescriptionQuestion[] | FileUploadQuestion[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  isPublished?: boolean;
  submissions?: AssessmentSubmission[];
  academicYear: string;
  semester: string;
  block: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
}

export interface DescriptionQuestion {
  id: string;
  question: string;
  maxWords?: number;
  instructions?: string;
}

export interface FileUploadQuestion {
  id: string;
  question: string;
  acceptedFormats: string[];
  maxFileSize: number; // in MB
  instructions?: string;
}

export interface AssessmentSubmission {
  id: string;
  studentId: string;
  studentName: string;
  assessmentId: string;
  answers: any[];
  submittedAt: string;
  score?: number;
  maxScore: number;
  isGraded: boolean;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

export interface CreateAssessmentRequest {
  title: string;
  courseCode: string;
  courseName: string;
  assessmentType: 'Class Assessment' | 'Mid Semester' | 'End of Semester';
  format: 'Multiple Choice' | 'Description/Typing' | 'File/Document Upload';
  questions: any[];
  academicYear: string;
  semester: string;
  block: string;
  isPublished?: boolean;
}

export interface StudentGrade {
  studentId: string;
  studentName: string;
  courseCode: string;
  assessmentType: 'Class Assessment' | 'Mid Semester' | 'End of Semester';
  score: number;
  maxScore: number;
  gradedAt: string;
  gradedBy: string;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  classAssessment?: number;
  midSemester?: number;
  endOfSemester?: number;
}

/**
 * Create a new assessment
 */
export const createAssessment = async (
  assessmentData: CreateAssessmentRequest
): Promise<{ success: boolean; assessment?: Assessment; error?: string }> => {
  try {
    console.log('📝 Creating assessment:', assessmentData);
    
    const response = await apiFetch('/api/assessments/create', {
      method: 'POST',
      role: 'lecturer',
      body: JSON.stringify({
        ...assessmentData,
        createdAt: new Date().toISOString(),
        isPublished: assessmentData.isPublished !== false // Default to published
      })
    });

    if (response.success) {
      console.log('✅ Assessment created successfully:', response.assessment?.id);
      return {
        success: true,
        assessment: response.assessment
      };
    }

    return {
      success: false,
      error: response.message || 'Failed to create assessment'
    };

  } catch (error) {
    console.error('❌ Error creating assessment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Get all assessments for a lecturer
 */
export const getLecturerAssessments = async (
  filters?: {
    courseCode?: string;
    assessmentType?: string;
    academicYear?: string;
    semester?: string;
    block?: string;
  }
): Promise<{ success: boolean; assessments: Assessment[]; error?: string }> => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const queryString = params.toString();
    const url = `/api/assessments/lecturer${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiFetch(url, {
      method: 'GET',
      role: 'lecturer'
    });

    if (response.success) {
      return {
        success: true,
        assessments: response.assessments || []
      };
    }

    return {
      success: false,
      assessments: [],
      error: response.message || 'Failed to fetch assessments'
    };

  } catch (error) {
    console.error('❌ Error fetching lecturer assessments:', error);
    return {
      success: false,
      assessments: [],
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Get assessment submissions for grading
 */
export const getAssessmentSubmissions = async (
  assessmentId: string
): Promise<{ success: boolean; submissions: AssessmentSubmission[]; error?: string }> => {
  try {
    const response = await apiFetch(`/api/assessments/${assessmentId}/submissions`, {
      method: 'GET',
      role: 'lecturer'
    });

    if (response.success) {
      return {
        success: true,
        submissions: response.submissions || []
      };
    }

    return {
      success: false,
      submissions: [],
      error: response.message || 'Failed to fetch submissions'
    };

  } catch (error) {
    console.error('❌ Error fetching assessment submissions:', error);
    return {
      success: false,
      submissions: [],
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Grade individual submission
 */
export const gradeSubmission = async (
  submissionId: string,
  score: number,
  maxScore: number,
  feedback?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiFetch(`/api/submissions/${submissionId}/grade`, {
      method: 'POST',
      role: 'lecturer',
      body: JSON.stringify({
        score,
        maxScore,
        feedback,
        gradedAt: new Date().toISOString()
      })
    });

    if (response.success) {
      console.log('✅ Submission graded successfully');
      return { success: true };
    }

    return {
      success: false,
      error: response.message || 'Failed to grade submission'
    };

  } catch (error) {
    console.error('❌ Error grading submission:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Bulk grade submissions
 */
export const bulkGradeSubmissions = async (
  assessmentId: string,
  grade: number,
  assessmentType: 'Class Assessment' | 'Mid Semester' | 'End of Semester',
  courseCode: string
): Promise<{ success: boolean; updatedCount?: number; error?: string }> => {
  try {
    const response = await apiFetch(`/api/assessments/${assessmentId}/bulk-grade`, {
      method: 'POST',
      role: 'lecturer',
      body: JSON.stringify({
        grade,
        assessmentType,
        courseCode,
        gradedAt: new Date().toISOString()
      })
    });

    if (response.success) {
      console.log(`✅ Bulk grading completed: ${response.updatedCount} submissions updated`);
      return {
        success: true,
        updatedCount: response.updatedCount
      };
    }

    return {
      success: false,
      error: response.message || 'Failed to apply bulk grades'
    };

  } catch (error) {
    console.error('❌ Error applying bulk grades:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Get student performance log for a course
 */
export const getStudentPerformanceLog = async (
  courseCode: string,
  filters?: {
    academicYear?: string;
    semester?: string;
    block?: string;
  }
): Promise<{ success: boolean; students: StudentPerformance[]; error?: string }> => {
  try {
    const params = new URLSearchParams({ courseCode });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const response = await apiFetch(`/api/students/performance?${params.toString()}`, {
      method: 'GET',
      role: 'lecturer'
    });

    if (response.success) {
      return {
        success: true,
        students: response.students || []
      };
    }

    return {
      success: false,
      students: [],
      error: response.message || 'Failed to fetch student performance'
    };

  } catch (error) {
    console.error('❌ Error fetching student performance:', error);
    return {
      success: false,
      students: [],
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Update individual student grade
 */
export const updateStudentGrade = async (
  studentId: string,
  courseCode: string,
  assessmentType: 'Class Assessment' | 'Mid Semester' | 'End of Semester',
  score: number,
  maxScore?: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiFetch('/api/grades/update', {
      method: 'POST',
      role: 'lecturer',
      body: JSON.stringify({
        studentId,
        courseCode,
        assessmentType,
        score,
        maxScore: maxScore || 100,
        gradedAt: new Date().toISOString()
      })
    });

    if (response.success) {
      console.log('✅ Student grade updated successfully');
      return { success: true };
    }

    return {
      success: false,
      error: response.message || 'Failed to update grade'
    };

  } catch (error) {
    console.error('❌ Error updating student grade:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Send notification to student when graded
 */
export const notifyStudentGraded = async (
  studentId: string,
  assessmentTitle: string,
  courseCode: string,
  score: number,
  maxScore: number
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await apiFetch('/api/notifications/grade-notification', {
      method: 'POST',
      role: 'lecturer',
      body: JSON.stringify({
        studentId,
        type: 'grade_released',
        title: 'Assessment Graded',
        message: `Your assessment "${assessmentTitle}" for ${courseCode} has been graded. Score: ${score}/${maxScore}`,
        data: {
          assessmentTitle,
          courseCode,
          score,
          maxScore,
          gradedAt: new Date().toISOString()
        }
      })
    });

    if (response.success) {
      console.log('✅ Grade notification sent to student');
      return { success: true };
    }

    return {
      success: false,
      error: response.message || 'Failed to send notification'
    };

  } catch (error) {
    console.error('❌ Error sending grade notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Get courses assigned to current lecturer
 */
export const getLecturerCourses = async (): Promise<{
  success: boolean;
  courses: Array<{ code: string; name: string; students: number }>;
  error?: string;
}> => {
  try {
    const response = await apiFetch('/api/courses/lecturer', {
      method: 'GET',
      role: 'lecturer'
    });

    if (response.success) {
      return {
        success: true,
        courses: response.courses || []
      };
    }

    return {
      success: false,
      courses: [],
      error: response.message || 'Failed to fetch courses'
    };

  } catch (error) {
    console.error('❌ Error fetching lecturer courses:', error);
    return {
      success: false,
      courses: [],
      error: error instanceof Error ? error.message : 'Network error occurred'
    };
  }
};

/**
 * Mock data for development and testing
 */
export const getMockStudentPerformance = (): StudentPerformance[] => {
  return [
    {
      studentId: 'BIT/2024/001',
      studentName: 'Doe Kwaku Joe',
      classAssessment: 10,
      midSemester: 15,
      endOfSemester: 50
    },
    {
      studentId: 'BIT/2024/002',
      studentName: 'Saaed Hawa',
      classAssessment: 10,
      midSemester: 10,
      endOfSemester: 55
    },
    {
      studentId: 'BIT/2024/003',
      studentName: 'Johnson Robert',
      classAssessment: 10,
      midSemester: 12,
      endOfSemester: 40
    },
    {
      studentId: 'BIT/2024/004',
      studentName: 'Kwarteng Samuel',
      classAssessment: 10,
      midSemester: 15,
      endOfSemester: 51
    },
    {
      studentId: 'BIT/2024/005',
      studentName: 'Owusu Agyeman Nana',
      classAssessment: 10,
      midSemester: 13,
      endOfSemester: 45
    },
    {
      studentId: 'BIT/2024/006',
      studentName: 'Nashiru Alhassan',
      classAssessment: 10,
      midSemester: 10,
      endOfSemester: 54
    },
    {
      studentId: 'BIT/2024/007',
      studentName: 'Smith Alice',
      classAssessment: 10,
      midSemester: 11,
      endOfSemester: 50
    },
    {
      studentId: 'BIT/2024/008',
      studentName: 'Iddrisu Abdul Lateefa',
      classAssessment: 10,
      midSemester: 12,
      endOfSemester: 40
    }
  ];
};

/**
 * Development mode flag for API calls
 * Returns true only for actual development environments and localhost
 * 
 * FIXED: Previously included 'vercel.app' which incorrectly treated production
 * Vercel deployments as development mode, causing demo banners in production.
 * 
 * Now only considers development mode for:
 * 1. Vite development mode (import.meta.env.MODE === 'development')
 * 2. Localhost/127.0.0.1 (for local development)
 */
export const isDevelopmentMode = (): boolean => {
  return import.meta.env.MODE === 'development' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1' ||
         (window.location.port !== '' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));
};

/**
 * Development mode authentication bypass - for testing only
 */
export const bypassAuthForDevelopment = () => {
  if (isDevelopmentMode()) {
    const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRyLiBKb2huIERvZSIsInJvbGUiOiJsZWN0dXJlciIsImVtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJzdGFmZklkIjoiMTIzNDUiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTc2MDAwMDAwMH0.fake_signature";
    localStorage.setItem('token_lecturer', testToken);
    localStorage.setItem('user_lecturer', JSON.stringify({
      name: 'Dr. John Doe',
      email: 'john.doe@example.com',
      role: 'lecturer',
      staffId: '12345'
    }));
    sessionStorage.setItem('activeRole', 'lecturer');
    return true;
  }
  return false;
};