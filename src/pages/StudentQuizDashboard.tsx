import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
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
}

const StudentQuizDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuiz, setExpandedQuiz] = useState<string | null>(null);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      // Try to fetch real quiz data from backend
      const response = await fetch('/api/student/quizzes', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.quizzes) {
          setQuizzes(data.quizzes);
          setLoading(false);
          return;
        }
      }
    } catch (error) {
      console.warn('Backend API not available, using sample data:', error);
    }

    // Fallback to sample data with current user context
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
        assessmentType: 'multiple-choice'
      },
      {
        id: 'quiz_2',
        title: 'Advanced Topics',
        lecturerName: 'Dr. Course Instructor',
        courseName: 'Advanced Studies',
        courseCode: userDepartment === 'Computer Science' ? 'CS201' :
          userDepartment === 'Information Technology' ? 'IT201' : 'DEPT201',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'available',
        attendanceRequired: false,
        studentAttended: true,
        description: 'Advanced concepts and practical applications',
        assessmentType: 'typing'
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
        description: 'Hands-on practical assessment',
        assessmentType: 'multiple-choice'
      },
      {
        id: 'quiz_4',
        title: 'Final Project',
        lecturerName: 'Dr. Project Supervisor',
        courseName: 'Capstone Project',
        courseCode: userDepartment === 'Computer Science' ? 'CS401' :
          userDepartment === 'Information Technology' ? 'IT401' : 'DEPT401',
        deadline: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: 'missed',
        attendanceRequired: true,
        studentAttended: true,
        description: 'Final project submission and presentation',
        assessmentType: 'upload'
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

  const handleTakeQuiz = (quiz: Quiz) => {
    if (quiz.status === 'blocked') {
      return;
    }
    if (quiz.status === 'missed') {
      return;
    }
    navigate(`/student/quiz/${quiz.id}`);
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
                No quizzes available at the moment. Check back later!
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
                        style={{
                          padding: '10px 20px',
                          backgroundColor: '#22c55e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          alignSelf: 'flex-start',
                          marginTop: '10px'
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.backgroundColor = '#16a34a';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.backgroundColor = '#22c55e';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        Take Quiz
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
                        <div>
                          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Description: </span>
                          <span style={{ fontSize: '0.875rem', color: '#374151' }}>{quiz.description}</span>
                        </div>
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