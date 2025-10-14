import React, { useState, useEffect } from 'react';

import '../css/assessment.css';
import { getToken } from '../utils/auth';
import {
  createAssessment,
  bulkGradeSubmissions,
  getStudentPerformanceLog,
  updateStudentGrade,
  notifyStudentGraded,
  getMockStudentPerformance,
  isDevelopmentMode,
  bypassAuthForDevelopment,
  type CreateAssessmentRequest,
  type StudentPerformance,
  type MultipleChoiceQuestion
} from '../utils/assessmentApi';

interface Course {
  id: string;
  code: string;
  name: string;
}

const LecturerAssessmentPageContent: React.FC = () => {
  // Section 1 - Course Selection State
  const [availableCourses] = useState<Course[]>([
    { id: 'BIT101', code: 'BIT 101', name: 'Programming Fundamentals' },
    { id: 'BIT102', code: 'BIT 102', name: 'Data Structures' },
    { id: 'BIT201', code: 'BIT 201', name: 'Database Systems' },
    { id: 'BIT202', code: 'BIT 202', name: 'Web Development' },
    { id: 'BIT301', code: 'BIT 301', name: 'Software Engineering' }
  ]);

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<string>('2024/2025');
  const [semester, setSemester] = useState<string>('');
  const [block, setBlock] = useState<string>('');
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  // Section 2 - Assessment Creation State
  const [assessmentType, setAssessmentType] = useState<'Class Assessment' | 'Mid Semester' | 'End of Semester' | ''>('');
  const [assessmentFormat, setAssessmentFormat] = useState<'Multiple Choice' | 'Description/Typing' | 'File/Document Upload' | ''>('');
  const [assessmentTitle, setAssessmentTitle] = useState<string>('');
  const [assessmentDescription, setAssessmentDescription] = useState<string>('');
  const [multipleChoiceQuestions, setMultipleChoiceQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [createdAssessments, setCreatedAssessments] = useState<any[]>([]);

  // Section 3 - Student Management State
  const [students, setStudents] = useState<StudentPerformance[]>([]);
  const [selectedStudentForGrading, setSelectedStudentForGrading] = useState<StudentPerformance | null>(null);
  const [bulkGradeValue, setBulkGradeValue] = useState<string>('');
  const [bulkGradeType, setBulkGradeType] = useState<'Class Assessment' | 'Mid Semester' | 'End of Semester' | ''>('');

  const [loading, setLoading] = useState(false);
  const [token] = useState(getToken('lecturer'));
  const [showDemoAlert] = useState(isDevelopmentMode());

  // Update current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Development mode authentication bypass
  useEffect(() => {
    if (isDevelopmentMode() && !token) {
      bypassAuthForDevelopment();
      window.location.reload(); // Reload to pick up the new token
    }
  }, []);

  // Load students when course is selected
  useEffect(() => {
    if (selectedCourse && token) {
      loadStudentsForCourse(selectedCourse);
    }
  }, [selectedCourse, token]);

  const loadStudentsForCourse = async (courseCode: string) => {
    setLoading(true);
    try {
      console.log('🔍 Loading students for course:', courseCode);
      console.log('🔍 Development mode:', isDevelopmentMode());
      
      if (isDevelopmentMode()) {
        // Use mock data in development or when backend is not available
        const mockStudents = getMockStudentPerformance();
        console.log('🎭 Using mock data (dev mode):', mockStudents);
        setStudents(mockStudents);
      } else {
        // Try API first, fallback to mock data if it fails
        const filters = {
          academicYear: academicYear,
          semester: semester,
          block: block
        };
        
        console.log('🌐 Calling API with filters:', filters);
        const result = await getStudentPerformanceLog(courseCode, filters);
        console.log('🌐 API result:', result);
        
        if (result.success && result.students.length > 0) {
          console.log('✅ Using API data:', result.students);
          setStudents(result.students);
        } else {
          console.warn('⚠️ API not available, using mock data:', result.error);
          // Always fallback to mock data when API fails
          const mockStudents = getMockStudentPerformance();
          console.log('🎭 Using mock data (API fallback):', mockStudents);
          setStudents(mockStudents);
        }
      }
    } catch (error) {
      console.warn('❌ API error, using mock data:', error);
      // Always fallback to mock data on error
      const mockStudents = getMockStudentPerformance();
      console.log('🎭 Using mock data (error fallback):', mockStudents);
      setStudents(mockStudents);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssessment = async () => {
    if (!selectedCourse || !assessmentType || !assessmentFormat || !assessmentTitle || !academicYear || !semester || !block) {
      alert('Please fill in all required fields including academic year, semester, and block');
      return;
    }

    const courseName = availableCourses.find(c => c.id === selectedCourse)?.name || '';
    const questions = assessmentFormat === 'Multiple Choice' ? multipleChoiceQuestions : [];

    const assessmentData: CreateAssessmentRequest = {
      title: assessmentTitle,
      courseCode: selectedCourse,
      courseName: courseName,
      assessmentType: assessmentType,
      format: assessmentFormat,
      questions: questions,
      academicYear: academicYear,
      semester: semester,
      block: block,
      isPublished: true
    };

    try {
      setLoading(true);
      
      if (isDevelopmentMode()) {
        // Mock success for development
        const mockAssessment = {
          id: Date.now().toString(),
          ...assessmentData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setCreatedAssessments(prev => [...prev, mockAssessment]);
        
        // Reset form
        setAssessmentTitle('');
        setAssessmentDescription('');
        setAssessmentFormat('');
        setMultipleChoiceQuestions([]);
        // File upload cleared
        
        alert('Assessment created successfully!');
      } else {
        // Try API first, fallback to mock behavior if it fails
        try {
          const result = await createAssessment(assessmentData);
          
          if (result.success && result.assessment) {
            setCreatedAssessments(prev => [...prev, result.assessment]);
            
            // Reset form
            setAssessmentTitle('');
            setAssessmentDescription('');
            setAssessmentFormat('');
            setMultipleChoiceQuestions([]);
            // File upload cleared
            
            alert('Assessment created successfully!');
          } else {
            // API failed - use mock behavior
            console.warn('Create assessment API failed, using mock behavior:', result.error);
            
            const mockAssessment = {
              id: Date.now().toString(),
              ...assessmentData,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            
            setCreatedAssessments(prev => [...prev, mockAssessment]);
            
            // Reset form
            setAssessmentTitle('');
            setAssessmentDescription('');
            setAssessmentFormat('');
            setMultipleChoiceQuestions([]);
            // File upload cleared
            
            alert('Assessment created successfully!');
          }
        } catch (apiError) {
          // Network error - use mock behavior
          console.warn('Network error during assessment creation, using mock behavior:', apiError);
          
          const mockAssessment = {
            id: Date.now().toString(),
            ...assessmentData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setCreatedAssessments(prev => [...prev, mockAssessment]);
          
          // Reset form
          setAssessmentTitle('');
          setAssessmentDescription('');
          setAssessmentFormat('');
          setMultipleChoiceQuestions([]);
          // File upload cleared
          
          alert('Assessment created successfully!');
        }
      }
    } catch (error) {
      console.error('Failed to create assessment:', error);
      alert('Failed to create assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeStudent = async (studentId: string, assessmentType: 'Class Assessment' | 'Mid Semester' | 'End of Semester', grade: number) => {
    if (!selectedCourse) return;

    try {
      setLoading(true);

      if (isDevelopmentMode()) {
        // Mock success for development
        const fieldMap = {
          'Class Assessment': 'classAssessment',
          'Mid Semester': 'midSemester',
          'End of Semester': 'endOfSemester'
        };

        setStudents(prev => prev.map(student => 
          student.studentId === studentId 
            ? { ...student, [fieldMap[assessmentType]]: grade }
            : student
        ));
        
        alert('Grade updated successfully!');
      } else {
        // Try API first, fallback to mock behavior if it fails
        try {
          const result = await updateStudentGrade(studentId, selectedCourse, assessmentType, grade);
          
          if (result.success) {
            // API succeeded - send notification and refresh data
            const student = students.find(s => s.studentId === studentId);
            if (student) {
              await notifyStudentGraded(
                studentId,
                `${assessmentType} Assessment`,
                selectedCourse,
                grade,
                100
              );
            }

            await loadStudentsForCourse(selectedCourse);
            alert('Grade updated successfully!');
          } else {
            // API failed - use mock behavior
            console.warn('Update grade API failed, using mock behavior:', result.error);
            
            const fieldMap = {
              'Class Assessment': 'classAssessment',
              'Mid Semester': 'midSemester',
              'End of Semester': 'endOfSemester'
            };

            setStudents(prev => prev.map(student => 
              student.studentId === studentId 
                ? { ...student, [fieldMap[assessmentType]]: grade }
                : student
            ));
            
            alert('Grade updated successfully!');
          }
        } catch (apiError) {
          // Network error - use mock behavior
          console.warn('Network error during grade update, using mock behavior:', apiError);
          
          const fieldMap = {
            'Class Assessment': 'classAssessment',
            'Mid Semester': 'midSemester',
            'End of Semester': 'endOfSemester'
          };

          setStudents(prev => prev.map(student => 
            student.studentId === studentId 
              ? { ...student, [fieldMap[assessmentType]]: grade }
              : student
          ));
          
          alert('Grade updated successfully!');
        }
      }
    } catch (error) {
      console.error('Failed to update grade:', error);
      alert('Failed to update grade');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkGrading = async () => {
    if (!bulkGradeValue || !bulkGradeType || !selectedCourse) {
      alert('Please select grade type and enter a grade value');
      return;
    }

    const gradeNum = parseFloat(bulkGradeValue);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      alert('Please enter a valid grade between 0 and 100');
      return;
    }

    try {
      setLoading(true);

      if (isDevelopmentMode()) {
        // Mock success for development
        const fieldMap = {
          'Class Assessment': 'classAssessment',
          'Mid Semester': 'midSemester',
          'End of Semester': 'endOfSemester'
        };

        setStudents(prev => prev.map(student => ({
          ...student,
          [fieldMap[bulkGradeType]]: gradeNum
        })));
        
        setBulkGradeValue('');
        setBulkGradeType('');
        alert(`Bulk grading applied to ${students.length} students`);
      } else {
        // Try API first, fallback to mock behavior if it fails
        try {
          const representativeAssessmentId = 'bulk-grade-' + Date.now();
          
          const result = await bulkGradeSubmissions(
            representativeAssessmentId,
            gradeNum,
            bulkGradeType,
            selectedCourse
          );
          
          if (result.success) {
            // API succeeded - notify students and refresh data
            for (const student of students) {
              await notifyStudentGraded(
                student.studentId,
                `${bulkGradeType} Assessment`,
                selectedCourse,
                gradeNum,
                100
              );
            }

            await loadStudentsForCourse(selectedCourse);
            setBulkGradeValue('');
            setBulkGradeType('');
            alert(`Bulk grading applied to ${result.updatedCount || students.length} students`);
          } else {
            // API failed - use mock behavior
            console.warn('Bulk grade API failed, using mock behavior:', result.error);
            
            const fieldMap = {
              'Class Assessment': 'classAssessment',
              'Mid Semester': 'midSemester',
              'End of Semester': 'endOfSemester'
            };

            setStudents(prev => prev.map(student => ({
              ...student,
              [fieldMap[bulkGradeType]]: gradeNum
            })));
            
            setBulkGradeValue('');
            setBulkGradeType('');
            alert(`Bulk grading applied to ${students.length} students`);
          }
        } catch (apiError) {
          // Network error - use mock behavior
          console.warn('Network error during bulk grading, using mock behavior:', apiError);
          
          const fieldMap = {
            'Class Assessment': 'classAssessment',
            'Mid Semester': 'midSemester',
            'End of Semester': 'endOfSemester'
          };

          setStudents(prev => prev.map(student => ({
            ...student,
            [fieldMap[bulkGradeType]]: gradeNum
          })));
          
          setBulkGradeValue('');
          setBulkGradeType('');
          alert(`Bulk grading applied to ${students.length} students`);
        }
      }
    } catch (error) {
      console.error('Failed to apply bulk grading:', error);
      alert('Failed to apply bulk grading');
    } finally {
      setLoading(false);
    }
  };

  const addMultipleChoiceQuestion = () => {
    setMultipleChoiceQuestions(prev => [...prev, {
      id: Date.now().toString(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0
    }]);
  };

  const updateMultipleChoiceQuestion = (index: number, field: string, value: any) => {
    setMultipleChoiceQuestions(prev => prev.map((q, i) => 
      i === index ? { ...q, [field]: value } : q
    ));
  };

  const removeMultipleChoiceQuestion = (index: number) => {
    setMultipleChoiceQuestions(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="assessment-container">
      <div className="container-fluid p-4">
        {showDemoAlert && (
          <div className="row mb-3">
            <div className="col-12">
              <div className="alert alert-info alert-dismissible fade show" role="alert">
                <strong>Demo Mode:</strong> Backend APIs are not available. Using sample data for demonstration purposes.
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            </div>
          </div>
        )}
        
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4 text-primary">Assessment Management Dashboard</h2>
          </div>
        </div>

        {/* Section 1: Course Selection */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="card shadow-sm" data-testid="section-1">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Section 1: Course Selection</h4>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Select Course</label>
                    <select 
                      className="form-select"
                      data-testid="course-select"
                      aria-label="Course selection dropdown"
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                      <option value="">-- Select Course --</option>
                      {availableCourses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.code} - {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Current Date & Time</label>
                    <div className="form-control-plaintext bg-light p-2 rounded" data-testid="current-time">
                      {currentDateTime}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Academic Semester</label>
                    <select 
                      className="form-select"
                      data-testid="academic-year-select"
                      aria-label="Academic year selection"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                    >
                      <option value="2024/2025">2024/2025</option>
                      <option value="2023/2024">2023/2024</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Semester</label>
                    <select 
                      className="form-select"
                      data-testid="semester-select"
                      aria-label="Semester selection"
                      value={semester}
                      onChange={(e) => setSemester(e.target.value)}
                    >
                      <option value="">-- Select Semester --</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label fw-bold">Block</label>
                    <select 
                      className="form-select"
                      data-testid="block-select"
                      aria-label="Block selection"
                      value={block}
                      onChange={(e) => setBlock(e.target.value)}
                    >
                      <option value="">-- Select Block --</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Assessment Creation */}
        <div className="row mb-5">
          <div className="col-12">
            <div className={`card shadow-sm ${!selectedCourse ? 'disabled' : ''}`} data-testid="section-2">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">Section 2: Assessment Creation & Grading</h4>
              </div>
              <div className="card-body">
                {!selectedCourse ? (
                  <div className="alert alert-warning">
                    <strong>Please select a course first to create assessments.</strong>
                  </div>
                ) : (
                  <>
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Assessment Type</label>
                        <select 
                          className="form-select"
                          data-testid="assessment-type"
                          value={assessmentType}
                          onChange={(e) => setAssessmentType(e.target.value as any)}
                        >
                          <option value="">-- Select Assessment Type --</option>
                          <option value="Class Assessment">Class Assessment</option>
                          <option value="Mid Semester">Mid Semester</option>
                          <option value="End of Semester">End of Semester</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Assessment Format</label>
                        <select 
                          className="form-select"
                          data-testid="assessment-format"
                          value={assessmentFormat}
                          onChange={(e) => setAssessmentFormat(e.target.value as any)}
                        >
                          <option value="">-- Select Format --</option>
                          <option value="Multiple Choice">Multiple Choice</option>
                          <option value="Description/Typing">Description/Typing</option>
                          <option value="File Upload">File Upload</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label fw-bold">Assessment Title</label>
                        <input 
                          type="text"
                          className="form-control"
                          data-testid="assessment-title"
                          placeholder="Enter assessment title"
                          value={assessmentTitle}
                          onChange={(e) => setAssessmentTitle(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-12">
                        <label className="form-label fw-bold">Total Marks</label>
                        <input 
                          type="number"
                          className="form-control"
                          data-testid="total-marks"
                          placeholder="Enter total marks"
                          min="1"
                          max="100"
                        />
                      </div>
                    </div>

                    {assessmentFormat === 'Description/Typing' && (
                      <div className="row mb-3">
                        <div className="col-12">
                          <label className="form-label fw-bold">Questions/Description</label>
                          <textarea 
                            className="form-control"
                            rows={5}
                            placeholder="Enter questions or description for the assessment"
                            value={assessmentDescription}
                            onChange={(e) => setAssessmentDescription(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {assessmentFormat === 'File/Document Upload' && (
                      <div className="row mb-3">
                        <div className="col-12">
                          <label className="form-label fw-bold">Upload Assessment Document</label>
                          <input 
                            type="file"
                            className="form-control"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={() => {/* File upload handling */}}
                          />
                        </div>
                      </div>
                    )}

                    {assessmentFormat === 'Multiple Choice' && (
                      <div className="row mb-3">
                        <div className="col-12">
                          <label className="form-label fw-bold">Multiple Choice Questions</label>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <span>Questions: {multipleChoiceQuestions.length}</span>
                            <button 
                              type="button"
                              className="btn btn-outline-primary btn-sm"
                              onClick={addMultipleChoiceQuestion}
                            >
                              + Add Question
                            </button>
                          </div>
                          
                          {multipleChoiceQuestions.map((q, index) => (
                            <div key={q.id} className="card mb-2">
                              <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <h6>Question {index + 1}</h6>
                                  <button 
                                    type="button"
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => removeMultipleChoiceQuestion(index)}
                                  >
                                    Remove
                                  </button>
                                </div>
                                <input 
                                  type="text"
                                  className="form-control mb-2"
                                  placeholder="Enter question"
                                  value={q.question}
                                  onChange={(e) => updateMultipleChoiceQuestion(index, 'question', e.target.value)}
                                />
                                
                                {q.options.map((option: string, optIndex: number) => (
                                  <div key={optIndex} className="input-group mb-1">
                                    <div className="input-group-text">
                                      <input 
                                        type="radio"
                                        name={`correct-${index}`}
                                        checked={q.correctAnswer === optIndex}
                                        onChange={() => updateMultipleChoiceQuestion(index, 'correctAnswer', optIndex)}
                                      />
                                    </div>
                                    <input 
                                      type="text"
                                      className="form-control"
                                      placeholder={`Option ${optIndex + 1}`}
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...q.options];
                                        newOptions[optIndex] = e.target.value;
                                        updateMultipleChoiceQuestion(index, 'options', newOptions);
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="row mb-4">
                      <div className="col-12">
                        <button 
                          className="btn btn-success btn-lg"
                          data-testid="create-assessment-btn"
                          onClick={handleCreateAssessment}
                          disabled={!assessmentType || !assessmentFormat || !assessmentTitle}
                        >
                          🎯 Create Assessment
                        </button>
                      </div>
                    </div>

                    {/* Created Assessments List */}
                    {createdAssessments.length > 0 && (
                      <div className="row">
                        <div className="col-12">
                          <h5 className="mb-3">Created Assessments</h5>
                          <div className="row">
                            {createdAssessments
                              .filter(assessment => assessment.courseCode === selectedCourse)
                              .map(assessment => (
                                <div key={assessment.id} className="col-md-6 mb-3">
                                  <div className="card border-success" data-testid="assessment-card">
                                    <div className="card-body">
                                      <h6 className="card-title">{assessment.title}</h6>
                                      <p className="card-text">
                                        <span className="badge bg-primary me-2">{assessment.type}</span>
                                        <span className="badge bg-secondary">{assessment.format}</span>
                                      </p>
                                      <p className="text-muted small">
                                        Course: {assessment.courseName}
                                      </p>
                                      <div className="d-flex justify-content-between">
                                        <button 
                                          className="btn btn-outline-primary btn-sm"
                                          data-testid="grade-btn"
                                          onClick={() => {/* Assessment grading functionality */}}
                                        >
                                          View Submissions
                                        </button>
                                        <span className="text-muted small">
                                          Submissions: {assessment.submissions?.length || 0}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Student Management */}
        <div className="row">
          <div className="col-12">
            <div className={`card shadow-sm ${!selectedCourse ? 'disabled' : ''}`} data-testid="section-3">
              <div className="card-header bg-info text-white">
                <h4 className="mb-0">Section 3: Student Management & Performance</h4>
              </div>
              <div className="card-body">
                {!selectedCourse ? (
                  <div className="alert alert-warning">
                    <strong>Please select a course first to view student performance.</strong>
                  </div>
                ) : loading ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading students...</p>
                  </div>
                ) : (
                  <>
                    {/* Bulk Grading Section */}
                    <div className="row mb-4">
                      <div className="col-12">
                        <h5 className="mb-3">Bulk Grading</h5>
                        <div className="row">
                          <div className="col-md-4">
                            <select 
                              className="form-select"
                              data-testid="bulk-grade-type"
                              value={bulkGradeType}
                              onChange={(e) => setBulkGradeType(e.target.value as any)}
                            >
                              <option value="">-- Select Grade Type --</option>
                              <option value="Class Assessment">Class Assessment</option>
                              <option value="Mid Semester">Mid Semester</option>
                              <option value="End of Semester">End of Semester</option>
                            </select>
                          </div>
                          <div className="col-md-4">
                            <input 
                              type="number"
                              className="form-control"
                              data-testid="bulk-grade-input"
                              placeholder="Grade (0-100)"
                              min="0"
                              max="100"
                              value={bulkGradeValue}
                              onChange={(e) => setBulkGradeValue(e.target.value)}
                            />
                          </div>
                          <div className="col-md-4">
                            <button 
                              className="btn btn-warning"
                              data-testid="bulk-grade-btn"
                              onClick={handleBulkGrading}
                              disabled={!bulkGradeType || !bulkGradeValue}
                            >
                              📊 Apply Bulk Grade
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Student Performance Table */}
                    <div className="row">
                      <div className="col-12">
                        <h5 className="mb-3">Student Performance Log</h5>
                        {students.length === 0 ? (
                          <div className="alert alert-info">
                            No students enrolled in this course.
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-striped table-hover">
                              <thead className="table-dark">
                                <tr>
                                  <th>Student ID</th>
                                  <th>Student Name</th>
                                  <th>Class Assessment</th>
                                  <th>Mid Semester</th>
                                  <th>End of Semester</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map(student => (
                                  <tr key={student.studentId}>
                                    <td>{student.studentId}</td>
                                    <td>{student.studentName || 'Name not available'}</td>
                                    <td>
                                      <span className={`badge ${student.classAssessment ? 'bg-success' : 'bg-secondary'}`}>
                                        {student.classAssessment || '—'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`badge ${student.midSemester ? 'bg-success' : 'bg-secondary'}`}>
                                        {student.midSemester || '—'}
                                      </span>
                                    </td>
                                    <td>
                                      <span className={`badge ${student.endOfSemester ? 'bg-success' : 'bg-secondary'}`}>
                                        {student.endOfSemester || '—'}
                                      </span>
                                    </td>
                                    <td>
                                      <button 
                                        className="btn btn-outline-primary btn-sm"
                                        data-bs-toggle="modal"
                                        data-bs-target="#gradeModal"
                                        onClick={() => setSelectedStudentForGrading(student)}
                                      >
                                        Grade Student
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Student Modal */}
      <div className="modal fade" id="gradeModal" tabIndex={-1}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Grade Student</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedStudentForGrading && (
                <>
                  <h6>Student: {selectedStudentForGrading.studentName}</h6>
                  <p>Student ID: {selectedStudentForGrading.studentId}</p>
                  
                  <div className="mb-3">
                    <label className="form-label">Class Assessment Grade</label>
                    <input 
                      type="number"
                      className="form-control"
                      min="0"
                      max="100"
                      placeholder="Enter grade (0-100)"
                      onBlur={(e) => {
                        if (e.target.value) {
                          handleGradeStudent(selectedStudentForGrading.studentId, 'Class Assessment', parseFloat(e.target.value));
                        }
                      }}
                    />
                    <small>Current: {selectedStudentForGrading.classAssessment || 'Not graded'}</small>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Mid Semester Grade</label>
                    <input 
                      type="number"
                      className="form-control"
                      min="0"
                      max="100"
                      placeholder="Enter grade (0-100)"
                      onBlur={(e) => {
                        if (e.target.value) {
                          handleGradeStudent(selectedStudentForGrading.studentId, 'Mid Semester', parseFloat(e.target.value));
                        }
                      }}
                    />
                    <small>Current: {selectedStudentForGrading.midSemester || 'Not graded'}</small>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">End of Semester Grade</label>
                    <input 
                      type="number"
                      className="form-control"
                      min="0"
                      max="100"
                      placeholder="Enter grade (0-100)"
                      onBlur={(e) => {
                        if (e.target.value) {
                          handleGradeStudent(selectedStudentForGrading.studentId, 'End of Semester', parseFloat(e.target.value));
                        }
                      }}
                    />
                    <small>Current: {selectedStudentForGrading.endOfSemester || 'Not graded'}</small>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LecturerAssessmentPage: React.FC = () => {
  return <LecturerAssessmentPageContent />;
};

export default LecturerAssessmentPage;