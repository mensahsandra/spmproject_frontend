import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

type GradeItem = { courseCode: string; studentId: string; score: number; grade: string | null; updatedAt: string };

const UpdateGrades: React.FC = () => {
  const [courseCode, setCourseCode] = useState('BIT364');
  const [studentId, setStudentId] = useState('');
  const [score, setScore] = useState<number>(0);
  const [grade, setGrade] = useState<string>('');
  const [list, setList] = useState<GradeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      const params = new URLSearchParams();
      if (courseCode) params.set('courseCode', courseCode);
      const data: any = await apiFetch(`/api/grades/list?${params.toString()}` , { method: 'GET', role: 'lecturer' });
      if (!data.ok) throw new Error(data.message || 'Request failed');
      setList(data.grades || []);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const save = async () => {
    setError(''); setSuccess('');
    try {
      const body = { courseCode, studentId, score, grade };
      const data: any = await apiFetch('/api/grades/update', {
        method: 'POST',
        role: 'lecturer',
        body: JSON.stringify(body)
      });
      if (!data.ok) throw new Error(data.message || 'Request failed');
      setSuccess('Grade saved');
      await load();
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, maxWidth: 720 }}>
        <div>
          <label>Course Code</label>
          <input value={courseCode} onChange={e => setCourseCode(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        </div>
        <div>
          <label>Student ID</label>
          <input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="e.g. 9123456" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        </div>
        <div>
          <label>Score</label>
          <input type="number" value={score} onChange={e => setScore(Number(e.target.value))} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        </div>
        <div>
          <label>Grade</label>
          <input value={grade} onChange={e => setGrade(e.target.value)} placeholder="e.g. A, B+" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button onClick={save} style={{ background: '#10A75B', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 10, cursor: 'pointer' }}>Save</button>
        <button onClick={load} disabled={loading} style={{ background: '#047857', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 10, cursor: 'pointer' }}>{loading ? 'Loading...' : 'Refresh'}</button>
      </div>
      {error && <div style={{ color: '#dc2626', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: '#16a34a', marginTop: 8 }}>{success}</div>}

      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Updated</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Course</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Student ID</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Score</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Grade</th>
            </tr>
          </thead>
          <tbody>
            {list.map((g, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: 8 }}>{g.updatedAt}</td>
                <td style={{ padding: 8 }}>{g.courseCode}</td>
                <td style={{ padding: 8 }}>{g.studentId}</td>
                <td style={{ padding: 8 }}>{g.score}</td>
                <td style={{ padding: 8 }}>{g.grade ?? '-'}</td>
              </tr>
            ))}
            {list.length === 0 && !loading && (
              <tr><td colSpan={5} style={{ padding: 12, textAlign: 'center', color: '#6b7280' }}>No grades</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpdateGrades;
