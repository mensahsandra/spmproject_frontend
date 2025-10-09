import { apiFetch } from './api';

// Interfaces for student results
export interface AssessmentResult {
  type: 'Assessment' | 'Mid Semester' | 'End of Semester' | 'Assignment' | 'Group Work';
  option: 'Graded' | 'Pending';
  marks: number | string;
  quizId?: string;
  submissionDate?: string;
  maxMarks?: number;
}

export interface CourseResult {
  code: string;
  name: string;
  rows: AssessmentResult[];
}

export interface StudentResultsData {
  [blockName: string]: CourseResult[];
}

// Map quiz types to assessment categories
export const mapQuizTypeToAssessmentType = (quizType: string): AssessmentResult['type'] => {
  const typeMap: Record<string, AssessmentResult['type']> = {
    'quiz': 'Assessment',
    'assignment': 'Assignment', 
    'midterm': 'Mid Semester',
    'final': 'End of Semester',
    'group': 'Group Work',
    'project': 'Assignment',
    'exam': 'End of Semester',
    'test': 'Assessment'
  };
  
  const lowerType = quizType.toLowerCase();
  return typeMap[lowerType] || 'Assessment';
};

// Fetch student results from backend
export const fetchStudentResults = async (
  year: string, 
  semester: string, 
  block: string
): Promise<StudentResultsData> => {
  try {
    const data = await apiFetch(
      `/api/results/student?year=${encodeURIComponent(year)}&semester=${encodeURIComponent(semester)}&block=${encodeURIComponent(block)}`,
      { method: 'GET', role: 'student' }
    );
    
    if (data?.results) {
      return data.results;
    }
    
    throw new Error('No results data received from server');
  } catch (error) {
    console.warn('Backend results API not available:', error);
    throw error;
  }
};

// Fetch quiz results and map them to assessment format
export const fetchQuizResults = async (studentId: string): Promise<AssessmentResult[]> => {
  try {
    // Import here to avoid circular dependencies
    const { getCombinedStudentResults } = await import('./resultsIntegration');
    return await getCombinedStudentResults(studentId);
  } catch (error) {
    console.warn('Quiz results integration not available:', error);
    return [];
  }
};

// Mock data for development/fallback
export const getMockResultsData = (): StudentResultsData => ({
  "Block 1": [
    {
      code: "BIT 364",
      name: "ENTREPRENEURSHIP",
      rows: [
        { type: "Assessment", option: "Pending", marks: "-" },
        { type: "Mid Semester", option: "Graded", marks: 15 },
        { type: "Group Work", option: "Graded", marks: 60 },
      ],
    },
    {
      code: "BIT 364", 
      name: "COMPUTER GRAPHICS & IMAGE PROCESSING",
      rows: [
        { type: "Assessment", option: "Graded", marks: 5 },
        { type: "Mid Semester", option: "Graded", marks: 10 },
        { type: "Group Work", option: "Pending", marks: "-" },
      ],
    },
  ],
  "Block 2": [
    {
      code: "BIT 365",
      name: "WEB DEVELOPMENT", 
      rows: [
        { type: "Assessment", option: "Graded", marks: 8 },
        { type: "Mid Semester", option: "Graded", marks: 12 },
        { type: "Group Work", option: "Graded", marks: 55 },
      ],
    },
  ],
  "Block 3": [
    {
      code: "BIT 366",
      name: "DATABASE MANAGEMENT",
      rows: [
        { type: "Assessment", option: "Graded", marks: 10 },
        { type: "Mid Semester", option: "Graded", marks: 14 },
        { type: "Group Work", option: "Graded", marks: 58 },
      ],
    },
    {
      code: "BIT 367", 
      name: "NETWORK SECURITY",
      rows: [
        { type: "Assessment", option: "Graded", marks: 7 },
        { type: "Mid Semester", option: "Pending", marks: 11 },
        { type: "Group Work", option: "Graded", marks: 52 },
      ],
    },
    {
      code: "BIT 368",
      name: "MOBILE APP DEVELOPMENT",
      rows: [
        { type: "Assessment", option: "Graded", marks: 9 },
        { type: "Mid Semester", option: "Graded", marks: 13 },
        { type: "Group Work", option: "Pending", marks: 60 },
      ],
    },
  ],
});

// Enhanced results fetcher that combines multiple data sources
export const fetchEnhancedStudentResults = async (
  year: string,
  semester: string, 
  block: string,
  studentId?: string
): Promise<StudentResultsData> => {
  try {
    // Try to get comprehensive results from main endpoint
    const results = await fetchStudentResults(year, semester, block);
    
    // If we have student ID, try to enhance with quiz data
    if (studentId) {
      // Future enhancement: merge quiz results into main results
      // This would need more sophisticated logic based on course matching
      // For now, we'll just return the main results
      await fetchQuizResults(studentId);
    }
    
    return results;
  } catch (error) {
    // Fallback to mock data
    console.warn('Using mock data due to API unavailability');
    return getMockResultsData();
  }
};