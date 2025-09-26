import React, { useEffect, useMemo, useState } from 'react';
import endPoint from '../../utils/endpoint';
import { apiFetch } from '../../utils/api';
import AttendanceFilter from './AttendanceFilter';

const AttendanceLogs: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [courseCode, setCourseCode] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(25);
  // new date filter controls
  const [filterType, setFilterType] = useState<'day' | 'week' | 'month'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${day}`;
  });

  const load = async () => {
    setError(''); setLoading(true);
    try {
      const params = new URLSearchParams();
      if (courseCode) params.set('courseCode', courseCode);
      if (sessionCode) params.set('sessionCode', sessionCode);
      params.set('page', String(page));
      params.set('limit', String(limit));
  // include optional date filters for backend; if backend ignores, we'll client-filter below
  if (selectedDate) params.set('date', selectedDate);
  if (filterType) params.set('filterType', filterType);
  const data: any = await apiFetch(`/api/attendance/logs?${params.toString()}`, { method: 'GET', role: 'lecturer' });
      if (!data.ok) throw new Error(data.message || 'Request failed');
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
    } catch (e: any) {
      setError(e?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, filterType, selectedDate]);

  // client-side filter fallback by date if server didn't filter
  const filteredLogs = useMemo(() => {
    if (!selectedDate || !logs?.length) return logs;
    const base = new Date(selectedDate);
    const start = new Date(base);
    const end = new Date(base);
    if (filterType === 'day') {
      end.setDate(end.getDate() + 1);
    } else if (filterType === 'week') {
      // assume week starts on Monday
      const day = start.getDay();
      const diffToMonday = (day + 6) % 7; // 0->6, 1->0, ..., 6->5
      start.setDate(start.getDate() - diffToMonday);
      end.setDate(start.getDate() + 7);
    } else if (filterType === 'month') {
      start.setDate(1);
      end.setMonth(start.getMonth() + 1);
      end.setDate(1);
    }
    const s = start.getTime();
    const e = end.getTime();
    return logs.filter((r: any) => {
      const t = new Date(r.timestamp || r.scannedAt || r.createdAt || r.time).getTime();
      return !isNaN(t) && t >= s && t < e;
    });
  }, [logs, filterType, selectedDate]);

  const exportCsv = () => {
    const url = new URL(`${endPoint}/api/attendance/export`);
    if (courseCode) url.searchParams.set('courseCode', courseCode);
    if (sessionCode) url.searchParams.set('sessionCode', sessionCode);
    if (selectedDate) url.searchParams.set('date', selectedDate);
    if (filterType) url.searchParams.set('filterType', filterType);
    window.open(url.toString(), '_blank');
  };

  return (
    <div>
      <AttendanceFilter
        filterType={filterType}
        setFilterType={setFilterType}
        selectedDate={selectedDate}
        setSelectedDate={(v) => { setSelectedDate(v); setPage(1); }}
      />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <input placeholder="Course Code" value={courseCode} onChange={e => setCourseCode(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        <input placeholder="Session Code" value={sessionCode} onChange={e => setSessionCode(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
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
            {filteredLogs.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: 8 }}>{r.timestamp}</td>
                <td style={{ padding: 8 }}>{r.studentId}</td>
                <td style={{ padding: 8 }}>{r.centre || '-'}</td>
                <td style={{ padding: 8 }}>{r.courseCode ? `${r.courseCode} - ${r.courseName || ''}` : (r.courseName || '-')}</td>
                <td style={{ padding: 8 }}>{r.lecturer || '-'}</td>
                <td style={{ padding: 8 }}>{r.sessionCode || '-'}</td>
              </tr>
            ))}
            {filteredLogs.length === 0 && !loading && (
              <tr><td colSpan={6} style={{ padding: 12, textAlign: 'center', color: '#6b7280' }}>No records</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceLogs;
