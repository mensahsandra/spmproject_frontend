import React, { useEffect, useState } from 'react';
import endPoint from '../../utils/endpoint';
import { apiFetch } from '../../utils/api';

type FilterType = 'day' | 'week' | 'month';

interface AttendanceLog {
  timestamp: string;
  studentId: string;
  centre: string;
  courseCode: string;
  courseName: string;
  lecturer: string;
  sessionCode: string;
}

const AttendanceLogs: React.FC = () => {
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [courseCode, setCourseCode] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [date, setDate] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('day');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(25);

  const load = async () => {
    setError(''); setLoading(true);
    try {
      const params = new URLSearchParams();
      if (courseCode) params.set('courseCode', courseCode);
      if (sessionCode) params.set('sessionCode', sessionCode);
      if (date) params.set('date', date);
      params.set('filterType', filterType);
      params.set('page', String(page));
      params.set('limit', String(limit));
      const data: { ok: boolean; logs: AttendanceLog[]; totalPages: number; message?: string } = await apiFetch(`/api/attendance/logs?${params.toString()}`, { method: 'GET', role: 'lecturer' });
      if (!data.ok) throw new Error(data.message || 'Request failed');
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
    } catch (e: unknown) {
      setError((e as Error)?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  const exportCsv = () => {
    const url = new URL(`${endPoint}/api/attendance/export`);
    if (courseCode) url.searchParams.set('courseCode', courseCode);
    if (sessionCode) url.searchParams.set('sessionCode', sessionCode);
    if (date) url.searchParams.set('date', date);
    url.searchParams.set('filterType', filterType);
    window.open(url.toString(), '_blank');
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input placeholder="Course Code" value={courseCode} onChange={e => setCourseCode(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input placeholder="Session Code" value={sessionCode} onChange={e => setSessionCode(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input 
          type="date" 
          value={date} 
          onChange={e => setDate(e.target.value)} 
          style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} 
        />
        <select 
          value={filterType} 
          onChange={e => setFilterType(e.target.value as FilterType)} 
          style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}
        >
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <button onClick={() => { setPage(1); load(); }} disabled={loading} style={{ background: '#10A75B', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>{loading ? 'Loading...' : 'Filter'}</button>
        <button onClick={exportCsv} style={{ background: '#047857', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Export CSV</button>
        <select value={limit} onChange={e => { setLimit(Number(e.target.value)); setPage(1);} } style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }}>
          {[10,25,50,100].map(l => <option key={l} value={l}>{l}/page</option>)}
        </select>
      </div>
      <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button disabled={page<=1} onClick={() => setPage(p=>Math.max(1,p-1))} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: page<=1? '#f3f4f6':'#fff', cursor: page<=1? 'not-allowed':'pointer' }}>Prev</button>
        <div style={{ fontSize: 13 }}>Page {page} / {totalPages}</div>
        <button disabled={page>=totalPages} onClick={() => setPage(p=>Math.min(totalPages,p+1))} style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #d1d5db', background: page>=totalPages? '#f3f4f6':'#fff', cursor: page>=totalPages? 'not-allowed':'pointer' }}>Next</button>
      </div>
      {error && <div style={{ color: '#dc2626', marginTop: 8 }}>{error}</div>}
      <div style={{ marginTop: 12, overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Time</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Student ID</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Centre</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Course</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Lecturer</th>
              <th style={{ textAlign: 'left', padding: 8 }}>Session Code</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: 8 }}>{r.timestamp}</td>
                <td style={{ padding: 8 }}>{r.studentId}</td>
                <td style={{ padding: 8 }}>{r.centre || '-'}</td>
                <td style={{ padding: 8 }}>{r.courseCode ? `${r.courseCode} - ${r.courseName || ''}` : (r.courseName || '-')}</td>
                <td style={{ padding: 8 }}>{r.lecturer || '-'}</td>
                <td style={{ padding: 8 }}>{r.sessionCode || '-'}</td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr><td colSpan={6} style={{ padding: 12, textAlign: 'center', color: '#6b7280' }}>No records</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceLogs;
