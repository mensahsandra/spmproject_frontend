import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../utils/api';
import CourseSelector from './CourseSelector';
import StudentGradeTable from './StudentGradeTable';
import GradeHistoryViewer from './GradeHistoryViewer';
import { clearTestProfile } from '../../utils/testSetup';
import { setupKwabenaWithBIT, checkCurrentSetup } from '../../utils/quickSetup';
import type { Course, EnrolledStudent, GradeChangeLog } from '../../types/grade';

const UpdateGrades: React.FC = () => {
  // Courses from lecturer profile
  const profileDataRaw = localStorage.getItem('profile');
  const profileData = profileDataRaw ? JSON.parse(profileDataRaw) : null;
  const courseIds: string[] = profileData?.data?.courses || [];
  const courses: Course[] = useMemo(() => courseIds.map((id: string) => ({ id, code: id, title: id, semester: '' })), [courseIds]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [editedGrades, setEditedGrades] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<GradeChangeLog[]>([]);
  
  // Quiz creation state
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    file: null as File | null,
    restrictToAttendees: false
  });
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
      // refresh students list to reflect current grades
      setEditedGrades({});
      const refreshed: any = await apiFetch(`/api/grades/enrolled?courseCode=${encodeURIComponent(selectedCourseId)}`, { method: 'GET', role: 'lecturer' });
      setStudents(refreshed?.students || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to save grades');
    } finally { setSaving(false); }
  };

  const onCreateQuiz = async () => {
    if (!selectedCourseId || !quizData.title.trim()) return;
    
    try {
      const formData = new FormData();
      formData.append('courseCode', selectedCourseId);
      formData.append('title', quizData.title);
      formData.append('description', quizData.description);
      formData.append('startTime', quizData.startTime);
      formData.append('endTime', quizData.endTime);
      formData.append('restrictToAttendees', quizData.restrictToAttendees.toString());
      if (quizData.file) {
        formData.append('file', quizData.file);
      }

      // API call to create quiz
      const response = await fetch('/api/quizzes/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lecturerToken') || localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const data = await response.json();
      if (!data.ok) throw new Error(data.message || 'Failed to create quiz');
      
      setQuizSuccess('Quiz created and students notified.');
      setShowQuizForm(false);
      setQuizData({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        file: null,
        restrictToAttendees: false
      });
      
      setTimeout(() => setQuizSuccess(''), 5000);
    } catch (e: any) {
      setError(e?.message || 'Failed to create quiz');
    }
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
      setBulkSuccess(`Score ${bulkScore} assigned to ${targetText}. ${data.updated || 0} students updated.`);
      setShowBulkModal(false);
      setBulkScore('');
      setBulkTarget('all');
      
      // Refresh students list
      const refreshed: any = await apiFetch(`/api/grades/enrolled?courseCode=${encodeURIComponent(selectedCourseId)}`, { method: 'GET', role: 'lecturer' });
      setStudents(refreshed?.students || []);
      
      setTimeout(() => setBulkSuccess(''), 5000);
    } catch (e: any) {
      setError(e?.message || 'Failed to assign bulk scores');
    }
  };

  return (
    <div>
      {/* Development Helper - Remove in production */}
      {import.meta.env.DEV && (
        <div className="alert alert-success mb-3">
          <strong>🚀 Quick Setup for Testing:</strong>
          <div className="d-flex gap-2 mt-2">
            <button 
              className="btn btn-sm btn-success"
              onClick={() => {
                setupKwabenaWithBIT();
                window.location.reload();
              }}
            >
              ⚡ Setup Kwabena + BIT Course (Instant)
            </button>
            <button 
              className="btn btn-sm btn-outline-info"
              onClick={() => {
                const setup = checkCurrentSetup();
                const courses = setup.profile?.data?.courses || [];
                alert(`Current setup:\nCourses: ${courses.join(', ') || 'None'}\nReady for testing: ${courses.includes('BIT') ? 'YES ✅' : 'NO ❌'}`);
              }}
            >
              Check Setup
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => {
                clearTestProfile();
                window.location.reload();
              }}
            >
              Clear Setup
            </button>
          </div>
          <small className="text-muted d-block mt-2">
            💡 Click "Setup Kwabena + BIT Course" to instantly enable quiz creation testing
          </small>
        </div>
      )}

      <CourseSelector
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
      />

      {error && <div className="alert alert-danger">{error}</div>}
      {quizSuccess && <div className="alert alert-success">{quizSuccess}</div>}
      {bulkSuccess && <div className="alert alert-success">{bulkSuccess}</div>}

      {/* Quiz Creation Section */}
      <div className="mb-4">
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
            <div className="card shadow-sm border-0 mb-3">
              <div className="card-body">
                <h6 className="card-title">Create New Quiz</h6>
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
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Optional File Upload</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => setQuizData(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </div>
                  <div className="col-md-6 mb-3 d-flex align-items-end">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="restrictToAttendees"
                        checked={quizData.restrictToAttendees}
                        onChange={(e) => setQuizData(prev => ({ ...prev, restrictToAttendees: e.target.checked }))}
                      />
                      <label className="form-check-label" htmlFor="restrictToAttendees">
                        Restrict to students who attended this session
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowQuizForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-success"
                    onClick={onCreateQuiz}
                    disabled={!quizData.title.trim()}
                  >
                    Create Quiz
                  </button>
                </div>
              </div>
            </div>
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
