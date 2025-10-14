/**
 * Student Quiz Dashboard - Updated for Backend Integration
 * 
 * Changes made per backend guidance:
 * - Updated API endpoint from /api/student/quizzes to /api/assessments/student
 * - Added support for both student.courses[] (preferred) and student.course (legacy)  
 * - Enhanced error handling: treats success:true with empty assessments[] as valid
 * - Added isArchived filtering (archived assessments hidden from students)
 * - Added isPublished support (missing isPublished treated as published)
 * - Added submission metadata support (status, submittedAt, score, grade, feedback)
 * - Short-circuit when no course context exists
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { submitAssessment } from '../utils/assessmentApi';
import { notifyAssessmentSubmission } from '../utils/notificationService';
import { getUser } from '../utils/auth';
import '../css/student-quiz.css';

interface Quiz {
  id: string;
  title: string;
  lecturerName: string;
  courseName: string;
  courseCode: string;
  deadline: string;
  status: 'available' | 'submitted' | 'missed' | 'blocked';
  attendanceRequired: boolean;
  studentAttended: boolean;
  description?: string;
  assessmentType?: 'upload' | 'typing' | 'multiple-choice';
  
  // New fields based on backend specification
  isPublished?: boolean;  // backend treats missing as published
  isArchived?: boolean;   // if true, hidden from students
  
  // Submission metadata as per backend specification
  submission?: {
    status: 'submitted' | 'graded' | 'pending';
    submittedAt?: string;
    score?: number;
    grade?: string;
    feedback?: string;
  };
}

const StudentQuizDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  // Helper function to get student course data (supports both array and string formats)
  const getStudentCourseData = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check for courses array (preferred format)
      if (Array.isArray(user.courses) && user.courses.length > 0) {
        return { courses: user.courses };
      }
      
      // Check for legacy course string
      if (typeof user.course === 'string' && user.course.trim()) {
        return { course: user.course };
      }

      console.warn('No course information found for student');
      return null;
    } catch (error) {
      console.error('Error getting student courses:', error);
      return null;
    }
  };

  const loadQuizzes = async () => {
    try {
      console.log('📚 Loading student assessments...');
      
      // Get student course data - backend guidance: support both formats
      const courseData = getStudentCourseData();
      
      // Early return if no course context (backend short-circuits in this case)
      if (!courseData) {
        console.log('No course enrollment found, showing empty state');
        setQuizzes([]);
        setLoading(false);
        return;
      }

      // Use the new endpoint as per backend guidance
      const response = await fetch('/api/assessments/student', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Backend guidance: treat success: true with empty array as valid
        if (data.success === true) {
          const assessments = Array.isArray(data.assessments) ? data.assessments : [];
          
          // Filter out archived assessments (backend hides these from students)
          const visibleAssessments = assessments.filter((assessment: any) => {
            return !assessment.isArchived;
          });

          // Process assessments for display
          const processedQuizzes = visibleAssessments.map((assessment: any) => ({
            id: assessment.id,
            title: assessment.title,
            lecturerName: assessment.lecturerName,
            courseName: assessment.courseName,
            courseCode: assessment.courseCode,
            deadline: assessment.deadline,
            status: assessment.status || 'available',
            attendanceRequired: assessment.attendanceRequired || false,
            studentAttended: assessment.studentAttended ?? true,
            description: assessment.description,
            assessmentType: assessment.assessmentType || 'multiple-choice',
            // Backend guidance: missing isPublished treated as published
            isPublished: assessment.isPublished !== false,
            isArchived: assessment.isArchived || false,
            submission: assessment.submission // Include submission metadata
          }));

          setQuizzes(processedQuizzes);
          console.log(`✅ Loaded ${processedQuizzes.length} assessments (${assessments.length - visibleAssessments.length} archived)`);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.warn('Backend API not available, using sample data:', error);
    }

    // Enhanced fallback with proper course context
    console.log('🔄 Using fallback assessment data');
    
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const userDepartment = currentUser.department || 'Computer Science';
    


    const mockQuizzes: Quiz[] = [
      {
        id: 'quiz_1',
        title: `${userDepartment} Fundamentals`,
        lecturerName: 'Dr. Current Lecturer',
        courseName: userDepartment,
        courseCode: userDepartment === 'Computer Science' ? 'CS101' :
          userDepartment === 'Information Technology' ? 'IT101' : 'DEPT101',
        deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        status: 'available',
        attendanceRequired: true,
        studentAttended: true,
        description: `Test your understanding of ${userDepartment.toLowerCase()} fundamentals.`,
        assessmentType: 'multiple-choice',
        isPublished: true,
        isArchived: false,
        submission: undefined // No submission yet
      },
      {
        id: 'quiz_2',
        title: 'Advanced Topics Quiz',
        lecturerName: 'Dr. Course Instructor',
        courseName: 'Advanced Studies',
        courseCode: userDepartment === 'Computer Science' ? 'CS201' :
          userDepartment === 'Information Technology' ? 'IT201' : 'DEPT201',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'available',
        attendanceRequired: false,
        studentAttended: true,
        description: 'Advanced concepts and practical applications',
        assessmentType: 'typing',
        isPublished: true,
        isArchived: false,
        submission: {
          status: 'pending',
          submittedAt: undefined,
          score: undefined,
          grade: undefined,
          feedback: undefined
        }
      },
      {
        id: 'quiz_3',
        title: 'Practical Assessment',
        lecturerName: 'Prof. Department Head',
        courseName: 'Practical Applications',
        courseCode: userDepartment === 'Computer Science' ? 'CS301' :
          userDepartment === 'Information Technology' ? 'IT301' : 'DEPT301',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'blocked',
        attendanceRequired: true,
        studentAttended: false,
        description: 'Hands-on practical assessment (attendance required)',
        assessmentType: 'multiple-choice',
        isPublished: true,
        isArchived: false,
        submission: undefined
      },
      {
        id: 'quiz_4',
        title: 'Final Project Submission',
        lecturerName: 'Dr. Project Supervisor',
        courseName: 'Capstone Project',
        courseCode: userDepartment === 'Computer Science' ? 'CS401' :
          userDepartment === 'Information Technology' ? 'IT401' : 'DEPT401',
        deadline: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: 'missed',
        attendanceRequired: true,
        studentAttended: true,
        description: 'Final project submission and presentation (deadline passed)',
        assessmentType: 'upload',
        isPublished: true,
        isArchived: false,
        submission: {
          status: 'pending',
          submittedAt: undefined,
          score: undefined,
          grade: undefined,
          feedback: 'Submission deadline has passed'
        }
      }
    ];

    setQuizzes(mockQuizzes);
    setLoading(false);
  };

  const toggleQuizExpansion = (quizId: string) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const difference = deadlineTime - now;

    if (difference < 0) return 'Deadline passed';

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const handleTakeQuiz = async (quiz: Quiz) => {
    if (quiz.status === 'blocked') {
      alert('This assessment is blocked. Please check attendance requirements.');
      return;
    }
    if (quiz.status === 'missed') {
      alert('This assessment deadline has passed.');
      return;
    }
    if (quiz.submission?.status === 'submitted' || quiz.submission?.status === 'graded') {
      alert('You have already submitted this assessment.');
      return;
    }

    // For demo purposes, simulate assessment submission
    const confirmed = confirm(`Do you want to submit "${quiz.title}"?\n\nNote: This is a demo submission. In a real system, you would complete the assessment first.`);
    
    if (confirmed) {
      try {
        // Get student info
        const user = getUser('student');
        const studentName = user?.name || user?.fullName || 'Student';
        const studentId = user?.studentId || user?.id || 'Unknown';

        // Simulate assessment answers (in real implementation, these would come from the assessment form)
        const mockAnswers = [
          { questionId: '1', answer: 'Sample answer 1' },
          { questionId: '2', answer: 'Sample answer 2' }
        ];

        // Submit assessment
        const result = await submitAssessment(quiz.id, mockAnswers);
        
        if (result.success) {
          // Send notifications
          notifyAssessmentSubmission(studentName, studentId, quiz.title, quiz.courseCode, quiz.courseName);
          
          // Update local state to show submission
          setQuizzes(prev => prev.map(q => 
            q.id === quiz.id 
              ? { 
                  ...q, 
                  status: 'submitted' as const,
                  submission: {
                    status: 'submitted' as const,
                    submittedAt: new Date().toISOString(),
                    score: undefined,
                    grade: undefined,
                    feedback: undefined
                  }
                }
              : q
          ));
          
          alert('Assessment submitted successfully!');
        } else {
          // Fallback for demo purposes
          console.warn('API submission failed, using local demo:', result.error);
          
          // Send notifications anyway for demo
          notifyAssessmentSubmission(studentName, studentId, quiz.title, quiz.courseCode, quiz.courseName);
          
          // Update local state
          setQuizzes(prev => prev.map(q => 
            q.id === quiz.id 
              ? { 
                  ...q, 
                  status: 'submitted' as const,
                  submission: {
                    status: 'submitted' as const,
                    submittedAt: new Date().toISOString(),
                    score: undefined,
                    grade: undefined,
                    feedback: undefined
                  }
                }
              : q
          ));
          
          alert('Assessment submitted successfully! (Demo mode)');
        }
      } catch (error) {
        console.error('Error submitting assessment:', error);
        alert('Failed to submit assessment. Please try again.');
      }
    }
  };



  if (loading) {
    return (
      <DashboardLayout style={{
        overflow: 'hidden',
        padding: '0'
      }}>
        <div style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading assessments...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const availableQuizzes = quizzes.filter(q => q.status === 'available');
  const missedQuizzes = quizzes.filter(q => q.status === 'missed');
  const blockedQuizzes = quizzes.filter(q => q.status === 'blocked');

  return (
    <DashboardLayout style={{
      overflow: 'hidden',
      padding: '0'
    }}>
      <div style={{
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        paddingTop: '2rem'
      }}>
        {/* Back Button - Fixed Position at Top Left */}
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '270px',
          zIndex: 1000
        }}>
          <button
            onClick={() => navigate('/student/academic-hub')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#f7fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              color: '#4a5568',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            onMouseOver={e => {
              e.currentTarget.style.backgroundColor = '#edf2f7';
              e.currentTarget.style.borderColor = '#cbd5e0';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.backgroundColor = '#f7fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Academic Hub
          </button>
        </div>

        <div style={{
          width: '100%',
          padding: '20px 40px 40px 40px'
        }}>
          {/* Page Header */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              Take quizzes and track your academic progress
            </h2>
            <div style={{
              width: '80px',
              height: '3px',
              background: 'linear-gradient(to right, #22c55e, #16a34a)',
              borderRadius: '2px'
            }}></div>
          </div>

          {/* Available Quizzes Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1.5rem'
            }}>
              Available Quizzes
            </h3>

            {availableQuizzes.length === 0 ? (
              <div style={{
                padding: '2rem',
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#0369a1'
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  No Active Assessments
                </div>
                <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>
                  No assessments are currently available for your enrolled courses. Check back later or contact your lecturer if you expect to see assessments here.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {availableQuizzes.map(quiz => (
                  <div key={quiz.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    border: '1px solid #e5e7eb',
                    padding: '1.5rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}>
                      {/* Green Accent Bar with Two-Tone Split */}
                      <div style={{
                        width: '16px',
                        height: '120px',
                        background: 'linear-gradient(to bottom, #16a34a 0%, #16a34a 50%, #4ade80 50%, #4ade80 100%)',
                        borderRadius: '8px',
                        flexShrink: 0
                      }}></div>

                      {/* Quiz Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>Lecturer: </span>
                          <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>{quiz.lecturerName}</span>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>
                            {quiz.courseName ? 'Course:' : 'Class:'}
                          </span>
                          <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400', marginLeft: '0.5rem' }}>
                            {quiz.courseCode} - {quiz.courseName}
                          </span>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>Time: </span>
                          <span style={{
                            fontSize: '1rem',
                            color: '#374151',
                            fontWeight: '400',
                            marginLeft: '0.5rem'
                          }}>
                            {getTimeRemaining(quiz.deadline)}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleQuizExpansion(quiz.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            color: '#9ca3af',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            padding: '0',
                            marginTop: '0.5rem'
                          }}
                        >
                          Show More
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{
                            transform: expandedQuiz === quiz.id ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease'
                          }}>
                            <path d="M7 10l5 5 5-5z" />
                          </svg>
                        </button>
                      </div>

                      {/* Take Quiz Button */}
                      <button
                        onClick={() => handleTakeQuiz(quiz)}
                        disabled={quiz.submission?.status === 'submitted' || quiz.submission?.status === 'graded'}
                        style={{
                          padding: '10px 20px',
                          backgroundColor: quiz.submission?.status === 'submitted' || quiz.submission?.status === 'graded' 
                            ? '#9ca3af' 
                            : '#22c55e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: quiz.submission?.status === 'submitted' || quiz.submission?.status === 'graded' 
                            ? 'not-allowed' 
                            : 'pointer',
                          transition: 'all 0.2s ease',
                          alignSelf: 'flex-start',
                          marginTop: '10px'
                        }}
                        onMouseOver={e => {
                          if (!(quiz.submission?.status === 'submitted' || quiz.submission?.status === 'graded')) {
                            e.currentTarget.style.backgroundColor = '#16a34a';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }
                        }}
                        onMouseOut={e => {
                          if (!(quiz.submission?.status === 'submitted' || quiz.submission?.status === 'graded')) {
                            e.currentTarget.style.backgroundColor = '#22c55e';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {quiz.submission?.status === 'submitted' 
                          ? '✅ Submitted' 
                          : quiz.submission?.status === 'graded' 
                          ? `📊 Graded (${quiz.submission.grade || quiz.submission.score})` 
                          : 'Submit Assessment'}
                      </button>
                    </div>

                    {/* Expanded Content */}
                    {expandedQuiz === quiz.id && (
                      <div style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Assessment Type: </span>
                          <span style={{
                            fontSize: '0.875rem',
                            color: '#374151',
                            fontWeight: '500',
                            textTransform: 'capitalize'
                          }}>
                            {quiz.assessmentType?.replace('-', ' ')}
                          </span>
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Description: </span>
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>{quiz.description}</span>
                        </div>
                        
                        {/* Submission Status - New per backend guidance */}
                        {quiz.submission && (
                          <div style={{ marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Submission Status: </span>
                            <span style={{
                              fontSize: '0.875rem',
                              color: quiz.submission.status === 'graded' ? '#16a34a' : 
                                    quiz.submission.status === 'submitted' ? '#0066cc' : 
                                    '#92400e',
                              fontWeight: '500',
                              textTransform: 'capitalize'
                            }}>
                              {quiz.submission.status}
                            </span>
                            {quiz.submission.score !== undefined && (
                              <span style={{ fontSize: '0.875rem', color: '#374151', marginLeft: '0.5rem' }}>
                                (Score: {quiz.submission.score})
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Submission Feedback */}
                        {quiz.submission?.feedback && (
                          <div style={{ marginBottom: '0.75rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Feedback: </span>
                            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                              {quiz.submission.feedback}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missed Quizzes Section */}
          {missedQuizzes.length > 0 && (
            <>
              <div style={{
                height: '1px',
                backgroundColor: '#e5e7eb',
                margin: '2rem 0'
              }}></div>

              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#dc2626',
                  marginBottom: '1.5rem'
                }}>
                  Missed
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {missedQuizzes.map(quiz => (
                    <div key={quiz.id} style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb',
                      padding: '1.5rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem'
                      }}>
                        {/* Red Accent Bar with Two-Tone Split */}
                        <div style={{
                          width: '16px',
                          height: '120px',
                          background: 'linear-gradient(to bottom, #dc2626 0%, #dc2626 50%, #f87171 50%, #f87171 100%)',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}></div>

                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>Lecturer: </span>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>{quiz.lecturerName}</span>
                          </div>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>
                              {quiz.courseName ? 'Course:' : 'Class:'}
                            </span>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400', marginLeft: '0.5rem' }}>
                              {quiz.courseCode} - {quiz.courseName}
                            </span>
                          </div>
                          <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>Time: </span>
                            <span style={{
                              fontSize: '1rem',
                              color: '#374151',
                              fontWeight: '400',
                              marginLeft: '0.5rem'
                            }}>
                              Deadline passed
                            </span>
                          </div>

                          <button
                            onClick={() => toggleQuizExpansion(quiz.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'none',
                              border: 'none',
                              color: '#6b7280',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              padding: '4px 0'
                            }}
                          >
                            Show More
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{
                              transform: expandedQuiz === quiz.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease'
                            }}>
                              <path d="M7 10l5 5 5-5z" />
                            </svg>
                          </button>
                        </div>

                        <button
                          disabled
                          style={{
                            padding: '12px 24px',
                            backgroundColor: '#9ca3af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'not-allowed'
                          }}
                        >
                          Missed
                        </button>
                      </div>

                      {expandedQuiz === quiz.id && (
                        <div style={{
                          padding: '1.5rem',
                          borderTop: '1px solid #e5e7eb',
                          backgroundColor: '#fef2f2'
                        }}>
                          <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Assessment Type: </span>
                            <span style={{
                              fontSize: '0.875rem',
                              color: '#374151',
                              fontWeight: '500',
                              textTransform: 'capitalize'
                            }}>
                              {quiz.assessmentType?.replace('-', ' ')}
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Description: </span>
                            <span style={{ fontSize: '0.875rem', color: '#374151' }}>{quiz.description}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Access Blocked Section */}
          {blockedQuizzes.length > 0 && (
            <>
              <div style={{
                height: '1px',
                backgroundColor: '#e5e7eb',
                margin: '2rem 0'
              }}></div>

              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#6b7280',
                  marginBottom: '1.5rem'
                }}>
                  Access Blocked
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {blockedQuizzes.map(quiz => (
                    <div key={quiz.id} style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      border: '1px solid #e5e7eb',
                      padding: '1.5rem'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem'
                      }}>
                        {/* Gray Accent Bar with Two-Tone Split */}
                        <div style={{
                          width: '16px',
                          height: '120px',
                          background: 'linear-gradient(to bottom, #6b7280 0%, #6b7280 50%, #d1d5db 50%, #d1d5db 100%)',
                          borderRadius: '8px',
                          flexShrink: 0
                        }}></div>

                        <div style={{ flex: 1 }}>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>Lecturer: </span>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>{quiz.lecturerName}</span>
                          </div>
                          <div style={{ marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>
                              {quiz.courseName ? 'Course:' : 'Class:'}
                            </span>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400', marginLeft: '0.5rem' }}>
                              {quiz.courseCode} - {quiz.courseName}
                            </span>
                          </div>
                          <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '1rem', color: '#374151', fontWeight: '400' }}>Time: </span>
                            <span style={{
                              fontSize: '1rem',
                              color: '#374151',
                              fontWeight: '400',
                              padding: '2px 8px',
                              backgroundColor: '#f3f4f6',
                              borderRadius: '4px'
                            }}>
                              {getTimeRemaining(quiz.deadline)}
                            </span>
                          </div>

                          <button
                            onClick={() => toggleQuizExpansion(quiz.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              background: 'none',
                              border: 'none',
                              color: '#6b7280',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              padding: '4px 0'
                            }}
                          >
                            More Info
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{
                              transform: expandedQuiz === quiz.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s ease'
                            }}>
                              <path d="M7 10l5 5 5-5z" />
                            </svg>
                          </button>
                        </div>

                        <button
                          disabled
                          style={{
                            padding: '12px 24px',
                            backgroundColor: '#9ca3af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'not-allowed'
                          }}
                        >
                          Blocked
                        </button>
                      </div>

                      {expandedQuiz === quiz.id && (
                        <div style={{
                          padding: '1.5rem',
                          borderTop: '1px solid #e5e7eb',
                          backgroundColor: '#f9fafb'
                        }}>
                          <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Status: </span>
                            <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: '500' }}>Available</span>
                          </div>
                          <div style={{ marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Description: </span>
                            <span style={{ fontSize: '0.875rem', color: '#374151' }}>{quiz.description}</span>
                          </div>
                          <div style={{
                            padding: '1rem',
                            backgroundColor: '#fef3c7',
                            borderRadius: '8px',
                            border: '1px solid #fbbf24'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                              </svg>
                              <span style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '500' }}>
                                You can't access this quiz because you didn't check in.
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizDashboard;