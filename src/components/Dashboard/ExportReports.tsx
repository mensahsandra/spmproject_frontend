import React, { useState } from 'react';
import endPoint from '../../utils/endpoint';
import { getToken } from '../../utils/auth';

const ExportReports: React.FC = () => {
  const [courseCode, setCourseCode] = useState('BIT364');
  const [sessionCode, setSessionCode] = useState('');

  const exportAttendance = () => {
    const url = new URL(`${endPoint}/api/attendance/export`);
    if (courseCode) url.searchParams.set('courseCode', courseCode);
    if (sessionCode) url.searchParams.set('sessionCode', sessionCode);
    const token = getToken('lecturer');
    if (token) url.searchParams.set('auth', token); // backend can optionally read ?auth= as fallback
    window.open(url.toString(), '_blank');
  };

  const exportGrades = () => {
    const url = new URL(`${endPoint}/api/grades/export`);
    if (courseCode) url.searchParams.set('courseCode', courseCode);
    const token = getToken('lecturer');
    if (token) url.searchParams.set('auth', token);
    window.open(url.toString(), '_blank');
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, maxWidth: 720 }}>
        <div>
          <label>Course Code</label>
          <input value={courseCode} onChange={e => setCourseCode(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        </div>
        <div>
          <label>Session Code (optional)</label>
          <input value={sessionCode} onChange={e => setSessionCode(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button onClick={exportAttendance} style={{ background: '#10A75B', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 10, cursor: 'pointer' }}>Export Attendance CSV</button>
        <button onClick={exportGrades} style={{ background: '#047857', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 10, cursor: 'pointer' }}>Export Grades CSV</button>
      </div>
    </div>
  );
};

export default ExportReports;
