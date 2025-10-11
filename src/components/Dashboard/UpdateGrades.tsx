import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../utils/api';
import CourseSelector from './CourseSelector';
import StudentGradeTable from './StudentGradeTable';
import GradeHistoryViewer from './GradeHistoryViewer';
import QuizCreator from './QuizCreator';
import { clearTestProfile } from '../../utils/testSetup';
import { setupKwabenaWithBIT } from '../../utils/quickSetup';
import { simulateStudentQuizNotifications } from '../../utils/quizNotifications';
import { useAssessmentNotifications } from '../../hooks/useAssessmentNotifications';
import { notifyQuizGraded, notifyBulkGrading } from '../../utils/notificationService';
import { getUser } from '../../utils/auth';
import type { Course, EnrolledStudent, GradeChangeLog } from '../../types/grade';
import '../../css/assessment.css';

const UpdateGrades: React.FC = () => {
  const { notifyBulkGradesSubmitted, notifyGradeError } = useAssessmentNotifications(); // keep helper for real assessment events
  // Courses from lecturer profile
  const profileDataRaw = localStorage.getItem('profile');
  const profileData = profileDataRaw ? JSON.parse(profileDataRaw) : null;
  
  // Fallback: try to get courses from user data if profile is missing
  const userDataRaw = localStorage.getItem('user_lecturer');
  const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
  
  const courseIds: string[] = profileData?.data?.courses || 
                              profileData?.lecturer?.courses || 
                              userData?.courses || 
                              [];
  const courses: Course[] = useMemo(() => {
    console.log('Raw course data:', courseIds);
    
    // Sample specific courses for demonstration
    const specificCourses = {
      'BIT': [
        { code: 'BIT364', name: 'Web Development' },
        { code: 'BIT367', name: 'Network Security' },
        { code: 'BIT301', name: 'Database Management' },
        { code: 'ENT201', name: 'Entrepreneurship' },
        { code: 'ACC101', name: 'Financial Accounting' },
        { code: 'MGT205', name: 'Project Management' }
      ],
      'BCS': [
        { code: 'CS301', name: 'Data Structures' },
        { code: 'CS405', name: 'Software Engineering' },
        { code: 'CS501', name: 'Artificial Intelligence' },
        { code: 'CS403', name: 'Computer Networks' },
        { code: 'MAT301', name: 'Discrete Mathematics' }
      ]
    };
    
    const allCourses: Course[] = [];
    
    courseIds.forEach((courseString: string) => {
      console.log('Processing course string:', courseString);
      
      // Multiple parsing strategies
      let programCode = '';
      let programTitle = '';
      
      // Strategy 1: Extract from parentheses like "BSc. Information Technology (BIT)"
      const parenthesesMatch = courseString.match(/\(([^)]+)\)$/);
      if (parenthesesMatch) {
        programCode = parenthesesMatch[1];
        programTitle = courseString.replace(/\s*\([^)]+\)$/, '');
      }
      // Strategy 2: Look for "Information Technology" or "Computer Science" keywords
      else if (courseString.toLowerCase().includes('information technology')) {
        programCode = 'BIT';
        programTitle = 'Information Technology';
      }
      else if (courseString.toLowerCase().includes('computer science')) {
        programCode = 'BCS';
        programTitle = 'Computer Science';
      }
      // Strategy 3: Fallback to first word
      else {
        programCode = courseString.split(' ')[0] || courseString;
        programTitle = courseString;
      }
      
      console.log('Parsed - Code:', programCode, 'Title:', programTitle);
      
      // Get specific courses for this program
      const programCourses = specificCourses[programCode as keyof typeof specificCourses] || [];
      
      if (programCourses.length > 0) {
        console.log('Found', programCourses.length, 'specific courses for', programCode);
        // Add specific courses
        programCourses.forEach(course => {
          allCourses.push({
            id: course.code,
            code: course.code,
            title: `${course.name} (${programTitle})` // Clean title without semester numbers
          });
        });
      } else {
        console.log('No specific courses found for', programCode, '- adding program-level course');
        // Fallback to program-level course
        allCourses.push({
          id: programCode,
          code: programCode,
          title: programTitle
        });
      }
    });
    
    console.log('Final courses:', allCourses);
    return allCourses;
  }, [courseIds]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  
  // Handle course selection with notification
  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
  };
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [editedGrades, setEditedGrades] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<GradeChangeLog[]>([]);
  
  // Quiz creation state
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState('');
  
  // Bulk grading state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkScore, setBulkScore] = useState('');
  const [bulkTarget, setBulkTarget] = useState('all');
  const [bulkSuccess, setBulkSuccess] = useState('');
  


  // Load enrolled students when course changes
  useEffect(() => {
    const load = async () => {
      setError('');
      setStudents([]);
      if (!selectedCourseId) return;
      setLoading(true);
      try {
        const data: any = await apiFetch(`/api/grades/enrolled?courseCode=${encodeURIComponent(selectedCourseId)}`, { method: 'GET', role: 'lecturer' });
        // Expect shape { ok, students: [{ id, studentId, name, currentGrade }] }
        const ss: EnrolledStudent[] = data?.students || [];
        setStudents(ss);
        setEditedGrades({});
        
        const courseName = courses.find(c => c.id === selectedCourseId)?.title || selectedCourseId;
        console.log(`ℹ️ [UpdateGrades] Loaded ${ss.length} students for ${courseName}`);
      } catch (e: any) {
        setError(e?.message || 'Failed to load students');
      } finally { setLoading(false); }
    };
    load();
  }, [selectedCourseId]);

  // Load grade change history (optional; safe if endpoint missing)
  useEffect(() => {
    const loadHistory = async () => {
      setHistory([]);
      if (!selectedCourseId) return;
      try {
        const data: any = await apiFetch(`/api/grades/history?courseCode=${encodeURIComponent(selectedCourseId)}`, { method: 'GET', role: 'lecturer' });
        setHistory(data?.history || []);
      } catch { /* ignore */ }
    };
    loadHistory();
  }, [selectedCourseId]);

  const dirtyCount = Object.keys(editedGrades).length;

  const onGradeChange = (studentId: string, grade: string) => {
    setEditedGrades(prev => ({ ...prev, [studentId]: grade }));
  };

  const onReset = () => setEditedGrades({});

  const onSave = async () => {
    if (!selectedCourseId || dirtyCount === 0) return;
    setSaving(true); setError('');
    try {
      // Transform into payload array
      const updates = Object.entries(editedGrades).map(([studentId, grade]) => ({ studentId, grade }));
      const data: any = await apiFetch('/api/grades/bulk-update', {
        method: 'POST',
        role: 'lecturer',
        body: JSON.stringify({ courseCode: selectedCourseId, updates })
      });
      if (!data?.ok) throw new Error(data?.message || 'Save failed');
      
      // Show notification for successful grade submission
      const courseName = courses.find(c => c.id === selectedCourseId)?.title || selectedCourseId;
      notifyBulkGradesSubmitted(updates.length, courseName);
      
      // Send role-based grading notifications to students
      const lecturer = getUser('lecturer');
      const lecturerName = lecturer?.name || lecturer?.username || 'Lecturer';

      // Send bulk grading notification
      notifyBulkGrading(selectedCourseId, courseName, updates.length, lecturerName);

      // Send individual notifications to each student
      updates.forEach(update => {
        const student = students.find(s => s.studentId === update.studentId);
        if (student) {
          // Parse grade as score (assuming format like "85" or "85/100")
          const gradeStr = update.grade.toString();
          const score = parseFloat(gradeStr.split('/')[0]) || 0;
          const maxScore = gradeStr.includes('/') ? parseFloat(gradeStr.split('/')[1]) : 100;

          notifyQuizGraded(student.name, student.studentId, courseName, selectedCourseId, `${score}/${maxScore}`);
        }
      });
      
      // refresh students list to reflect current grades
      setEditedGrades({});
      const refreshed: any = await apiFetch(`/api/grades/enrolled?courseCode=${encodeURIComponent(selectedCourseId)}`, { method: 'GET', role: 'lecturer' });
      setStudents(refreshed?.students || []);
    } catch (e: any) {
      const errorMsg = e?.message || 'Failed to save grades';
      setError(errorMsg);
      notifyGradeError('multiple students', errorMsg);
    } finally { setSaving(false); }
  };

  const handleQuizSuccess = (message: string) => {
    setQuizSuccess(message);
    setShowQuizForm(false);
    setTimeout(() => setQuizSuccess(''), 5000);
  };

  const handleQuizError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const onBulkAssign = async () => {
    if (!selectedCourseId || !bulkScore.trim()) return;
    
    try {
      // API call to bulk assign grades
      const data: any = await apiFetch('/api/grades/bulk-assign', {
        method: 'POST',
        role: 'lecturer',
        body: JSON.stringify({
          courseCode: selectedCourseId,
          score: bulkScore,
          target: bulkTarget
        })
      });
      
      if (!data?.ok) throw new Error(data?.message || 'Failed to assign bulk scores');
      
      const targetText = bulkTarget === 'all' ? 'all students' : 
                        bulkTarget === 'attendees' ? 'attendees only' : 
                        'quiz submitters only';
      const updatedCount = data.updated || 0;
      setBulkSuccess(`Score ${bulkScore} assigned to ${targetText}. ${updatedCount} students updated.`);
      
      // Show notification for bulk assignment
      const courseName = courses.find(c => c.id === selectedCourseId)?.title || selectedCourseId;
      notifyBulkGradesSubmitted(updatedCount, courseName);
      
      setShowBulkModal(false);
      setBulkScore('');
      setBulkTarget('all');
      
      // Refresh students list
      const refreshed: any = await apiFetch(`/api/grades/enrolled?courseCode=${encodeURIComponent(selectedCourseId)}`, { method: 'GET', role: 'lecturer' });
      setStudents(refreshed?.students || []);
      
      setTimeout(() => setBulkSuccess(''), 5000);
    } catch (e: any) {
      const errorMsg = e?.message || 'Failed to assign bulk scores';
      setError(errorMsg);
      notifyGradeError('bulk assignment', errorMsg);
    }
  };

  return (
    <div className="container-fluid" style={{ 
      width: '100%', 
      maxWidth: 'none',
      padding: '0',
      overflow: 'visible'
    }}>
      {/* Page Header */}
      <div className="mb-4">
        <h3 className="mb-1">Assessment Management</h3>
        <p className="text-muted mb-0">Create quizzes, manage grades, and track student performance</p>
      </div>

      {/* Development Helper - Only show in development mode */}
      {import.meta.env.DEV && (
        <div className="alert alert-info mb-3">
          <details>
            <summary className="fw-bold" style={{ cursor: 'pointer' }}>🔧 Development Tools</summary>
            <div className="mt-2">
              <small className="d-block mb-2">
                <strong>Programs:</strong> {JSON.stringify(courseIds)}<br/>
                <strong>Courses:</strong> {courses.length} available
              </small>
              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-sm btn-outline-primary" onClick={() => { setupKwabenaWithBIT(); window.location.reload(); }}>
                  Setup Test Data
                </button>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => { clearTestProfile(); window.location.reload(); }}>
                  Clear Data
                </button>
                <button className="btn btn-sm btn-outline-info" onClick={() => { simulateStudentQuizNotifications(); alert('Demo notifications sent!'); }}>
                  Demo Notifications
                </button>
              </div>
            </div>
          </details>
        </div>
      )}

      <CourseSelector
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={handleCourseSelect}
      />

      {error && <div className="alert alert-danger">{error}</div>}
      {quizSuccess && <div className="alert alert-success">{quizSuccess}</div>}
      {bulkSuccess && <div className="alert alert-success">{bulkSuccess}</div>}

      {/* Quiz Creation Section */}
      <div className="mb-4 assessment-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Quiz Management</h5>
          <button 
            className="btn btn-success"
            onClick={() => setShowQuizForm(!showQuizForm)}
            disabled={loading || !selectedCourseId}
            title={!selectedCourseId ? "Please select a course first" : ""}
          >
            {showQuizForm ? 'Cancel' : 'Create Quiz'}
          </button>
        </div>
        
        {!selectedCourseId && (
          <div className="alert alert-info">
            <small>Please select a course to create quizzes and manage grades.</small>
          </div>
        )}

          {showQuizForm && (
            <QuizCreator
              selectedCourseId={selectedCourseId}
              onSuccess={handleQuizSuccess}
              onError={handleQuizError}
              onCancel={() => setShowQuizForm(false)}
            />
          )}
      </div>

      <StudentGradeTable
        students={students}
        editedGrades={editedGrades}
        onGradeChange={onGradeChange}
        loading={loading}
      />

      <div className="d-flex justify-content-between align-items-center gap-3 mt-3">
        <div className="text-muted">
          {dirtyCount > 0 ? `${dirtyCount} unsaved change(s)` : "No pending changes"}
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={onReset} disabled={saving || loading}>
            Reset
          </button>
          <button 
            className="btn btn-warning"
            onClick={() => setShowBulkModal(true)}
            disabled={saving || loading || !selectedCourseId}
          >
            Bulk Assign Score
          </button>
          <button className="btn btn-primary" onClick={onSave} disabled={saving || loading || !selectedCourseId || dirtyCount === 0}>
            Save Grades
          </button>
        </div>
      </div>

      {/* Bulk Assign Modal */}
      {showBulkModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bulk Assign Score</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowBulkModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Score to Assign</label>
                  <input
                    type="text"
                    className="form-control"
                    value={bulkScore}
                    onChange={(e) => setBulkScore(e.target.value)}
                    placeholder="Enter score (A, B+, 85, etc.)"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apply to:</label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="bulkTarget"
                      id="allStudents"
                      value="all"
                      checked={bulkTarget === 'all'}
                      onChange={(e) => setBulkTarget(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="allStudents">
                      All students
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="bulkTarget"
                      id="attendeesOnly"
                      value="attendees"
                      checked={bulkTarget === 'attendees'}
                      onChange={(e) => setBulkTarget(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="attendeesOnly">
                      Only attendees
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="bulkTarget"
                      id="quizSubmitters"
                      value="quiz_submitters"
                      checked={bulkTarget === 'quiz_submitters'}
                      onChange={(e) => setBulkTarget(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="quizSubmitters">
                      Only quiz submitters
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary"
                  onClick={() => setShowBulkModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-warning"
                  onClick={onBulkAssign}
                  disabled={!bulkScore.trim()}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <GradeHistoryViewer history={history} />
    </div>
  );
};

export default UpdateGrades;
