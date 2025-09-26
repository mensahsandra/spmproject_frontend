import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

interface EnrolledStudent {
  id: string;
  studentId: string;
  name: string;
  currentGrade: string | number | null;
}

interface GradeUpdate {
  studentId: string;
  grade: string | number;
}

interface GradeHistory {
  id: string;
  changedAt: string;
  studentName: string;
  studentId: string;
  courseCode: string;
  oldGrade: string | number | null;
  newGrade: string | number;
  changedBy: string;
}

const UpdateGrades: React.FC = () => {
  const [courseCode, setCourseCode] = useState('BIT364');
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [gradeUpdates, setGradeUpdates] = useState<Record<string, string | number>>({});
  const [history, setHistory] = useState<GradeHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const loadEnrolledStudents = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      const params = new URLSearchParams();
      if (courseCode) params.set('courseCode', courseCode);
      const data: { ok: boolean; students: EnrolledStudent[]; message?: string } = await apiFetch(`/api/grades/enrolled?${params.toString()}`, { method: 'GET', role: 'lecturer' });
      if (!data.ok) throw new Error(data.message || 'Request failed');
      setStudents(data.students || []);
      // Initialize gradeUpdates with current grades
      const initialUpdates: Record<string, string | number> = {};
      data.students?.forEach(student => {
        if (student.currentGrade !== null && student.currentGrade !== undefined) {
          initialUpdates[student.studentId] = student.currentGrade;
        }
      });
      setGradeUpdates(initialUpdates);
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Failed to load students');
    } finally { 
      setLoading(false); 
    }
  };

  const loadHistory = async () => {
    if (!showHistory) return;
    try {
      const params = new URLSearchParams();
      if (courseCode) params.set('courseCode', courseCode);
      const data: { ok: boolean; history: GradeHistory[]; message?: string } = await apiFetch(`/api/grades/history?${params.toString()}`, { method: 'GET', role: 'lecturer' });
      if (data.ok) {
        setHistory(data.history || []);
      }
    } catch (e: unknown) {
      console.warn('Failed to load grade history:', (e as Error)?.message);
    }
  };

  useEffect(() => { 
    loadEnrolledStudents(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseCode]);

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showHistory, courseCode]);

  const handleGradeChange = (studentId: string, grade: string | number) => {
    setGradeUpdates(prev => ({
      ...prev,
      [studentId]: grade
    }));
  };

  const saveBulkUpdates = async () => {
    setError(''); setSuccess('');
    try {
      const updates: GradeUpdate[] = Object.entries(gradeUpdates).map(([studentId, grade]) => ({
        studentId,
        grade
      }));
      
      if (updates.length === 0) {
        setError('No grades to update');
        return;
      }

      const body = { courseCode, updates };
      const data: { ok: boolean; message?: string } = await apiFetch('/api/grades/bulk-update', {
        method: 'POST',
        role: 'lecturer',
        body: JSON.stringify(body)
      });
      if (!data.ok) throw new Error(data.message || 'Request failed');
      setSuccess('Grades updated successfully');
      await loadEnrolledStudents();
      if (showHistory) await loadHistory();
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Failed to save grades');
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, maxWidth: 720, alignItems: 'center' }}>
        <div>
          <label>Course Code</label>
          <input 
            value={courseCode} 
            onChange={e => setCourseCode(e.target.value)} 
            style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} 
          />
        </div>
        <div style={{ paddingTop: '20px' }}>
          <button 
            onClick={() => setShowHistory(!showHistory)} 
            style={{ 
              background: '#6b7280', 
              color: '#fff', 
              border: 'none', 
              padding: '10px 16px', 
              borderRadius: 10, 
              cursor: 'pointer' 
            }}
          >
            {showHistory ? 'Hide History' : 'Show History'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button 
          onClick={saveBulkUpdates} 
          disabled={loading}
          style={{ 
            background: '#10A75B', 
            color: '#fff', 
            border: 'none', 
            padding: '10px 16px', 
            borderRadius: 10, 
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Saving...' : 'Save All Changes'}
        </button>
        <button 
          onClick={loadEnrolledStudents} 
          disabled={loading} 
          style={{ 
            background: '#047857', 
            color: '#fff', 
            border: 'none', 
            padding: '10px 16px', 
            borderRadius: 10, 
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      {error && <div style={{ color: '#dc2626', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: '#16a34a', marginTop: 8 }}>{success}</div>}

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <h3 style={{ margin: '16px 0 8px 0' }}>Enrolled Students</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Student ID</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Name</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Current Grade</th>
              <th style={{ textAlign: 'left', padding: 8 }}>New Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: 8 }}>{student.studentId}</td>
                <td style={{ padding: 8 }}>{student.name}</td>
                <td style={{ padding: 8 }}>{student.currentGrade ?? '-'}</td>
                <td style={{ padding: 8 }}>
                  <input
                    type="text"
                    value={gradeUpdates[student.studentId] || ''}
                    onChange={(e) => handleGradeChange(student.studentId, e.target.value)}
                    placeholder="A, B+, 85, etc."
                    style={{ 
                      padding: 6, 
                      borderRadius: 4, 
                      border: '1px solid #d1d5db', 
                      width: '100px' 
                    }}
                  />
                </td>
              </tr>
            ))}
            {students.length === 0 && !loading && (
              <tr><td colSpan={4} style={{ padding: 12, textAlign: 'center', color: '#6b7280' }}>No enrolled students found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showHistory && (
        <div style={{ marginTop: 20, overflowX: 'auto' }}>
          <h3 style={{ margin: '16px 0 8px 0' }}>Grade Change History</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ textAlign: 'left', padding: 8 }}>Date</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Student</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Old Grade</th>
                <th style={{ textAlign: 'left', padding: 8 }}>New Grade</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Changed By</th>
              </tr>
            </thead>
            <tbody>
              {history.map((change) => (
                <tr key={change.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 8 }}>{new Date(change.changedAt).toLocaleDateString()}</td>
                  <td style={{ padding: 8 }}>{change.studentName} ({change.studentId})</td>
                  <td style={{ padding: 8 }}>{change.oldGrade ?? '-'}</td>
                  <td style={{ padding: 8 }}>{change.newGrade}</td>
                  <td style={{ padding: 8 }}>{change.changedBy}</td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr><td colSpan={5} style={{ padding: 12, textAlign: 'center', color: '#6b7280' }}>No grade changes recorded</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UpdateGrades;
