import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { markQuizCompleted } from '../utils/quizNotifications';
import { notifyQuizSubmission } from '../utils/notificationService';
import { getUser } from '../utils/auth';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'text' | 'file-upload';
  question: string;
  options?: string[];
  correctAnswer?: string;
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  courseName: string;
  startTime: string;
  endTime: string;
  questions: QuizQuestion[];
  restrictToAttendees: boolean;
}

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | File>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    // Simulate loading quiz data
    const loadQuiz = async () => {
      try {
        // Mock quiz data - in real app, this would come from API
        const mockQuiz: QuizData = {
          id: quizId || '',
          title: 'Web Development Basics',
          description: 'Test your understanding of HTML, CSS, and JavaScript fundamentals',
          courseCode: 'BIT364',
          courseName: 'Web Development',
          startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Started 1 hour ago
          endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Ends in 1 hour
          restrictToAttendees: false,
          questions: [
            {
              id: '1',
              type: 'multiple-choice',
              question: 'What does HTML stand for?',
              options: [
                'Hyper Text Markup Language',
                'High Tech Modern Language',
                'Home Tool Markup Language',
                'Hyperlink and Text Markup Language'
              ],
              correctAnswer: 'Hyper Text Markup Language'
            },
            {
              id: '2',
              type: 'text',
              question: 'Explain the difference between CSS Grid and Flexbox. Provide examples of when you would use each.'
            },
            {
              id: '3',
              type: 'multiple-choice',
              question: 'Which JavaScript method is used to add an element to the end of an array?',
              options: ['push()', 'pop()', 'shift()', 'unshift()'],
              correctAnswer: 'push()'
            },
            {
              id: '4',
              type: 'file-upload',
              question: 'Upload a screenshot of your completed HTML/CSS project or any relevant code files.'
            }
          ]
        };

        setQuiz(mockQuiz);
        
        // Calculate time left
        const endTime = new Date(mockQuiz.endTime).getTime();
        const now = Date.now();
        const timeLeftMs = endTime - now;
        setTimeLeft(Math.max(0, Math.floor(timeLeftMs / 1000)));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load quiz');
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: string | File) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    setSubmitting(true);
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark quiz as completed in notifications
      markQuizCompleted(quiz.id);
      
      // Send role-based notifications to both student and lecturer
      const user = getUser('student');
      const studentName = user?.name || user?.username || 'Student';
      const studentId = user?.studentId || user?.id || 'Unknown ID';
      notifyQuizSubmission(
        studentName,
        studentId,
        quiz.title,
        quiz.courseCode
      );
      
      // Navigate to results or success page
      navigate('/student/notifications', { 
        state: { 
          message: `Quiz "${quiz.title}" submitted successfully!`,
          type: 'success'
        }
      });
    } catch (err) {
      setError('Failed to submit quiz. Please try again.');
      setSubmitting(false);
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
            <span className="visually-hidden">Loading quiz...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout style={{ 
        overflow: 'hidden',
        padding: '0'
      }}>
        <div style={{
          width: '100%',
          height: '100vh',
          overflow: 'auto',
          padding: '40px'
        }}>
          <div className="alert alert-danger">
            <h4>Error</h4>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/student/notifications')}>
              Back to Notifications
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout style={{ 
        overflow: 'hidden',
        padding: '0'
      }}>
        <div style={{
          width: '100%',
          height: '100vh',
          overflow: 'auto',
          padding: '40px'
        }}>
          <div className="alert alert-warning">
            <h4>Quiz Not Found</h4>
            <p>The requested quiz could not be found.</p>
            <button className="btn btn-primary" onClick={() => navigate('/student/notifications')}>
              Back to Notifications
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const canProceed = answers[currentQuestion.id] !== undefined;

  return (
    <DashboardLayout style={{ 
      overflow: 'hidden',
      padding: '0'
    }}>
      <div style={{
        width: '100%',
        height: '100vh',
        overflow: 'auto',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Quiz Header */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="mb-1">{quiz.title}</h4>
                    <p className="text-muted mb-0">{quiz.courseCode} - {quiz.courseName}</p>
                    {quiz.description && <p className="small text-muted mt-1">{quiz.description}</p>}
                  </div>
                  <div className="text-end">
                    {timeLeft !== null && timeLeft > 0 && (
                      <div className={`badge ${timeLeft < 300 ? 'bg-danger' : 'bg-primary'} fs-6`}>
                        Time Left: {formatTime(timeLeft)}
                      </div>
                    )}
                    {timeLeft === 0 && (
                      <div className="badge bg-danger fs-6">Time's Up!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="progress" style={{ height: '8px' }}>
              <div 
                className="progress-bar" 
                role="progressbar" 
                style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
              >
              </div>
            </div>
            <div className="d-flex justify-content-between mt-2">
              <small className="text-muted">Question {currentQuestionIndex + 1} of {quiz.questions.length}</small>
              <small className="text-muted">{Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}% Complete</small>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Question {currentQuestionIndex + 1}</h5>
                <p className="card-text">{currentQuestion.question}</p>

                {/* Multiple Choice */}
                {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                  <div className="mt-3">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`question-${currentQuestion.id}`}
                          id={`option-${index}`}
                          value={option}
                          checked={answers[currentQuestion.id] === option}
                          onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                        />
                        <label className="form-check-label" htmlFor={`option-${index}`}>
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {/* Text Answer */}
                {currentQuestion.type === 'text' && (
                  <div className="mt-3">
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Type your answer here..."
                      value={answers[currentQuestion.id] as string || ''}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    />
                  </div>
                )}

                {/* File Upload */}
                {currentQuestion.type === 'file-upload' && (
                  <div className="mt-3">
                    <input
                      type="file"
                      className="form-control"
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleAnswerChange(currentQuestion.id, file);
                        }
                      }}
                    />
                    <div className="form-text">
                      Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG, ZIP (Max 10MB)
                    </div>
                    {answers[currentQuestion.id] && (
                      <div className="mt-2">
                        <small className="text-success">
                          ✓ File selected: {(answers[currentQuestion.id] as File).name}
                        </small>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>

                  <div className="d-flex gap-2">
                    {!isLastQuestion ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        disabled={!canProceed}
                      >
                        Next
                      </button>
                    ) : (
                      <button
                        className="btn btn-success"
                        onClick={handleSubmit}
                        disabled={submitting || timeLeft === 0}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                          </>
                        ) : (
                          'Submit Quiz'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Summary */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h6 className="card-title">Answer Summary</h6>
                <div className="d-flex flex-wrap gap-2">
                  {quiz.questions.map((q, index) => (
                    <button
                      key={q.id}
                      className={`btn btn-sm ${
                        answers[q.id] 
                          ? (index === currentQuestionIndex ? 'btn-primary' : 'btn-success')
                          : (index === currentQuestionIndex ? 'btn-outline-primary' : 'btn-outline-secondary')
                      }`}
                      onClick={() => setCurrentQuestionIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <small className="text-muted">
                    Answered: {Object.keys(answers).length} / {quiz.questions.length}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QuizPage;