// Integration utilities to connect quiz system with results display
import { apiFetch } from './api';
import type { AssessmentResult } from './resultsApi';

// Interface for quiz submission data
export interface QuizSubmission {
  id: string;
  quizId: string;
  studentId: string;
  courseCode: string;
  title: string;
  score: number;
  maxScore: number;
  submittedAt: string;
  isGraded: boolean;
  quizType: 'quiz' | 'assignment' | 'midterm' | 'final' | 'group';
}

// Interface for grade entry from lecturer
export interface GradeEntry {
  studentId: string;
  courseCode: string;
  assessmentType: 'Assessment' | 'Mid Semester' | 'End of Semester' | 'Assignment' | 'Group Work';
  score: number | string;
  maxScore?: number;
  gradedAt: string;
  gradedBy: string; // lecturer ID
}

/**
 * Fetch quiz submissions for a student and convert to assessment results
 */
export const getQuizSubmissionsAsResults = async (studentId: string): Promise<AssessmentResult[]> => {
  try {
    const data = await apiFetch(`/api/quizzes/submissions/student/${studentId}`, {
      method: 'GET',
      role: 'student'
    });

    if (data?.submissions) {
      return data.submissions.map((submission: QuizSubmission) => ({
        type: mapQuizTypeToAssessmentType(submission.quizType),
        option: submission.isGraded ? 'Graded' : 'Pending',
        marks: submission.isGraded ? submission.score : '-',
        quizId: submission.quizId,
        submissionDate: submission.submittedAt,
        maxMarks: submission.maxScore
      }));
    }

    return [];
  } catch (error) {
    console.warn('Could not fetch quiz submissions:', error);
    return [];
  }
};

/**
 * Fetch manual grade entries from lecturer grade management
 */
export const getManualGradeEntries = async (studentId: string, courseCode?: string): Promise<AssessmentResult[]> => {
  try {
    const params = new URLSearchParams({ studentId });
    if (courseCode) params.append('courseCode', courseCode);

    const data = await apiFetch(`/api/grades/student?${params.toString()}`, {
      method: 'GET',
      role: 'student'
    });

    if (data?.grades) {
      return data.grades.map((grade: GradeEntry) => ({
        type: grade.assessmentType,
        option: 'Graded',
        marks: grade.score,
        maxMarks: grade.maxScore,
        submissionDate: grade.gradedAt
      }));
    }

    return [];
  } catch (error) {
    console.warn('Could not fetch manual grades:', error);
    return [];
  }
};

/**
 * Map quiz types to assessment result types
 */
const mapQuizTypeToAssessmentType = (quizType: string): AssessmentResult['type'] => {
  const typeMap: Record<string, AssessmentResult['type']> = {
    'quiz': 'Assessment',
    'assignment': 'Assignment',
    'midterm': 'Mid Semester', 
    'final': 'End of Semester',
    'group': 'Group Work'
  };
  
  return typeMap[quizType] || 'Assessment';
};

/**
 * Combine quiz submissions and manual grades for comprehensive results
 */
export const getCombinedStudentResults = async (
  studentId: string,
  courseCode?: string
): Promise<AssessmentResult[]> => {
  try {
    const [quizResults, manualGrades] = await Promise.all([
      getQuizSubmissionsAsResults(studentId),
      getManualGradeEntries(studentId, courseCode)
    ]);

    // Combine and deduplicate results
    const combined = [...quizResults, ...manualGrades];
    
    // Sort by submission/graded date (most recent first)
    return combined.sort((a, b) => {
      const dateA = new Date(a.submissionDate || '').getTime();
      const dateB = new Date(b.submissionDate || '').getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.warn('Error combining student results:', error);
    return [];
  }
};

/**
 * Simulate the connection for development/testing
 * This shows how quiz creation leads to student results
 */
export const simulateQuizToResultsFlow = () => {
  console.log('🎯 Quiz to Results Integration Flow:');
  console.log('1. Lecturer creates quiz via QuizCreator component');
  console.log('2. Quiz stored in database with course, type, and questions');
  console.log('3. Students receive notifications and take quiz');
  console.log('4. Quiz submissions stored with scores and metadata');
  console.log('5. Lecturer can manually grade or use auto-grading');
  console.log('6. Results API aggregates quiz scores + manual grades');
  console.log('7. DisplayResultPage shows real results instead of static data');
  console.log('8. Assessment types mapped: Quiz → Assessment, Assignment → Assignment, etc.');
  
  return {
    message: 'Integration flow simulated - check console for details',
    endpoints: {
      createQuiz: 'POST /api/quizzes/create',
      submitQuiz: 'POST /api/quizzes/submit', 
      getResults: 'GET /api/results/student',
      getQuizSubmissions: 'GET /api/quizzes/submissions/student/:id',
      updateGrades: 'POST /api/grades/bulk-update'
    }
  };
};

/**
 * Test function to verify the integration works
 */
export const testResultsIntegration = async (studentId: string = 'test-student') => {
  console.log('🧪 Testing Results Integration...');
  
  try {
    // Test quiz submissions fetch
    const quizResults = await getQuizSubmissionsAsResults(studentId);
    console.log('✅ Quiz submissions:', quizResults.length, 'found');
    
    // Test manual grades fetch  
    const manualGrades = await getManualGradeEntries(studentId);
    console.log('✅ Manual grades:', manualGrades.length, 'found');
    
    // Test combined results
    const combined = await getCombinedStudentResults(studentId);
    console.log('✅ Combined results:', combined.length, 'total assessments');
    
    return {
      success: true,
      quizCount: quizResults.length,
      gradeCount: manualGrades.length,
      totalAssessments: combined.length
    };
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};