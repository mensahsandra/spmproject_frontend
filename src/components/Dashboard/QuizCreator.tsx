import React, { useState } from 'react';
import { addQuizNotification } from '../../utils/quizNotifications';
import '../../css/assessment.css';

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'text' | 'file-upload';
  question: string;
  options?: string[];
  correctAnswer?: string;
}

interface QuizCreatorProps {
  selectedCourseId: string;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

// Helper function to get course info from course code
const getCourseInfo = (courseCode: string) => {
  const courseMap: Record<string, { name: string; program: string }> = {
    'BIT364': { name: 'Web Development', program: 'Information Technology' },
    'BIT367': { name: 'Network Security', program: 'Information Technology' },
    'BIT301': { name: 'Database Management', program: 'Information Technology' },
    'ENT201': { name: 'Entrepreneurship', program: 'Information Technology' },
    'ACC101': { name: 'Financial Accounting', program: 'Information Technology' },
    'MGT205': { name: 'Project Management', program: 'Information Technology' },
    'CS301': { name: 'Data Structures', program: 'Computer Science' },
    'CS405': { name: 'Software Engineering', program: 'Computer Science' },
    'CS501': { name: 'Artificial Intelligence', program: 'Computer Science' },
    'CS403': { name: 'Computer Networks', program: 'Computer Science' },
    'MAT301': { name: 'Discrete Mathematics', program: 'Computer Science' }
  };
  
  return courseMap[courseCode] || { name: courseCode, program: 'Unknown' };
};

const QuizCreator: React.FC<QuizCreatorProps> = ({
  selectedCourseId,
  onSuccess,
  onError,
  onCancel
}) => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    restrictToAttendees: false
  });

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    type: 'text' as QuizQuestion['type'],
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) return;

    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      type: currentQuestion.type,
      question: currentQuestion.question,
      ...(currentQuestion.type === 'multiple-choice' && {
        options: currentQuestion.options.filter(opt => opt.trim()),
        correctAnswer: currentQuestion.correctAnswer
      })
    };

    setQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestion({
      type: 'text',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
    setShowAddQuestion(false);
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const createQuiz = async () => {
    if (!quizData.title.trim()) {
      onError('Quiz title is required');
      return;
    }

    if (questions.length === 0 && !file) {
      onError('Please add at least one question or upload a file');
      return;
    }

    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('courseCode', selectedCourseId);
      formData.append('title', quizData.title);
      formData.append('description', quizData.description);
      formData.append('startTime', quizData.startTime);
      formData.append('endTime', quizData.endTime);
      formData.append('restrictToAttendees', quizData.restrictToAttendees.toString());
      formData.append('questions', JSON.stringify(questions));
      
      if (file) {
        formData.append('file', file);
      }

      // For now, simulate API call since backend might not exist
      // Replace this with actual API call when backend is ready
      const mockResponse = {
        ok: true,
        message: 'Quiz created successfully',
        quizId: Date.now().toString()
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (mockResponse.ok) {
        // Add notification for students
        const courseInfo = getCourseInfo(selectedCourseId);
        addQuizNotification(
          quizData.title,
          selectedCourseId,
          courseInfo.name,
          mockResponse.quizId,
          quizData.endTime,
          quizData.restrictToAttendees
        );

        const studentCount = quizData.restrictToAttendees ? 'attendees' : 'all enrolled students';
        onSuccess(`Quiz "${quizData.title}" created successfully! Notifications sent to ${studentCount}.`);
        // Reset form
        setQuizData({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          restrictToAttendees: false
        });
        setQuestions([]);
        setFile(null);
      } else {
        throw new Error(mockResponse.message || 'Failed to create quiz');
      }
    } catch (error: any) {
      onError(error.message || 'Failed to create quiz');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-3 assessment-card quiz-creator-container">
      <div className="card-body">
        <h6 className="card-title">Create New Quiz</h6>
        
        {/* Basic Quiz Info */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Quiz Title *</label>
            <input
              type="text"
              className="form-control"
              value={quizData.title}
              onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter quiz title"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              value={quizData.description}
              onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Start Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={quizData.startTime}
              onChange={(e) => setQuizData(prev => ({ ...prev, startTime: e.target.value }))}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">End Time</label>
            <input
              type="datetime-local"
              className="form-control"
              value={quizData.endTime}
              onChange={(e) => setQuizData(prev => ({ ...prev, endTime: e.target.value }))}
            />
          </div>
        </div>

        {/* Questions Section */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label mb-0">Questions ({questions.length})</label>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              onClick={() => setShowAddQuestion(!showAddQuestion)}
            >
              {showAddQuestion ? 'Cancel' : 'Add Question'}
            </button>
          </div>

          {/* Add Question Form */}
          {showAddQuestion && (
            <div className="border rounded p-3 mb-3 bg-light">
              <div className="mb-3">
                <label className="form-label">Question Type</label>
                <select
                  className="form-select"
                  value={currentQuestion.type}
                  onChange={(e) => setCurrentQuestion(prev => ({ 
                    ...prev, 
                    type: e.target.value as QuizQuestion['type'] 
                  }))}
                >
                  <option value="text">Text Answer</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="file-upload">File Upload</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Question *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion(prev => ({ 
                    ...prev, 
                    question: e.target.value 
                  }))}
                  placeholder="Type your question here..."
                />
              </div>

              {currentQuestion.type === 'multiple-choice' && (
                <div className="mb-3">
                  <label className="form-label">Options</label>
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentQuestion.options];
                          newOptions[index] = e.target.value;
                          setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                        }}
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                  <div className="mt-2">
                    <label className="form-label">Correct Answer</label>
                    <select
                      className="form-select"
                      value={currentQuestion.correctAnswer}
                      onChange={(e) => setCurrentQuestion(prev => ({ 
                        ...prev, 
                        correctAnswer: e.target.value 
                      }))}
                    >
                      <option value="">Select correct answer</option>
                      {currentQuestion.options.map((option, index) => (
                        option.trim() && (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        )
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={addQuestion}
                  disabled={!currentQuestion.question.trim()}
                >
                  Add Question
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setShowAddQuestion(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Questions List */}
          {questions.length > 0 && (
            <div className="border rounded p-3 mb-3">
              <h6>Added Questions:</h6>
              {questions.map((q, index) => (
                <div key={q.id} className="border-bottom pb-2 mb-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <strong>Q{index + 1}:</strong> {q.question}
                      <div className="text-muted small">Type: {q.type}</div>
                      {q.options && (
                        <div className="text-muted small">
                          Options: {q.options.join(', ')}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeQuestion(q.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* File Upload Option */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Optional File Upload</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx,.txt"
            />
            <div className="form-text">Upload additional quiz materials (PDF, DOC, etc.)</div>
          </div>
          <div className="col-md-6 mb-3 d-flex align-items-end">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="restrictToAttendees"
                checked={quizData.restrictToAttendees}
                onChange={(e) => setQuizData(prev => ({ 
                  ...prev, 
                  restrictToAttendees: e.target.checked 
                }))}
              />
              <label className="form-check-label" htmlFor="restrictToAttendees">
                Restrict to students who attended this session
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-2">
          <button 
            className="btn btn-outline-secondary"
            onClick={onCancel}
            disabled={creating}
          >
            Cancel
          </button>
          <button 
            className="btn btn-success"
            onClick={createQuiz}
            disabled={creating || !quizData.title.trim()}
          >
            {creating ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Creating Quiz...
              </>
            ) : (
              'Create Quiz'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;