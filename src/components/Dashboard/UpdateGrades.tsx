import React, { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../../utils/api';
import CourseSelector from './CourseSelector';
import StudentGradeTable from './StudentGradeTable';
import GradeSubmissionActions from './GradeSubmissionActions';
import GradeHistoryViewer from './GradeHistoryViewer';
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

  return (
    <div>
      <CourseSelector
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
      />

      {error && <div className="alert alert-danger">{error}</div>}

      <StudentGradeTable
        students={students}
        editedGrades={editedGrades}
        onGradeChange={onGradeChange}
        loading={loading}
      />

      <GradeSubmissionActions
        onSave={onSave}
        onReset={onReset}
        disabled={saving || loading || !selectedCourseId}
        dirtyCount={dirtyCount}
      />

      <GradeHistoryViewer history={history} />
    </div>
  );
};

export default UpdateGrades;
