import React, { useEffect, useState } from 'react';
import '../css/notifications.css';
import { apiFetch } from '../utils/api';

type Deadline = {
  title: string;
  due: string; // ISO date string
  daysLeft: number;
  priority: 'High' | 'Medium' | 'Low' | string;
};

const prBadge = (p: string) => {
  const base: React.CSSProperties = {
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    border: '1px solid transparent',
  };
  if (p === 'High') return { ...base, backgroundColor: '#FEE2E2', color: '#991B1B', borderColor: '#FCA5A5' };
  if (p === 'Medium') return { ...base, backgroundColor: '#FEF3C7', color: '#92400E', borderColor: '#FCD34D' };
  return { ...base, backgroundColor: '#DCFCE7', color: '#166534', borderColor: '#86EFAC' };
};

const DeadlinesPage: React.FC = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
  const data: any = await apiFetch('/api/deadlines', { method: 'GET', role: 'student' });
  if (active) setDeadlines(Array.isArray(data?.deadlines) ? data.deadlines : (Array.isArray(data) ? data : []));
      } catch (e: any) {
        if (active) setError(e?.message || 'Failed to load deadlines');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>Upcoming Deadlines</h1>
      </div>

      {loading && (
        <div className="notifications-container"><div className="notification-item"><div className="notification-content">Loading...</div></div></div>
      )}
      {!!error && (
        <div className="notifications-container"><div className="notification-item"><div className="notification-content" style={{ color: 'red' }}>{error}</div></div></div>
      )}

      {!loading && !error && (
        <div className="notifications-container">
          {deadlines.length === 0 && (
            <div className="notification-item">
              <div className="notification-accent completed-accent gray" />
              <div className="notification-content">
                <div className="notification-header">
                  <div className="notification-type">📅</div>
                  <h2 className="notification-title">No upcoming deadlines</h2>
                </div>
                <p className="notification-message">You're all caught up. New items will appear here.</p>
              </div>
            </div>
          )}

          {deadlines.map((d, idx) => {
            const dueDate = new Date(d.due);
            const dueStr = isNaN(dueDate as any) ? d.due : dueDate.toLocaleDateString();
            const daysLeftNum = typeof d.daysLeft === 'number' ? d.daysLeft : Number.NaN;
            const urgent = d.priority === 'High' || (Number.isFinite(daysLeftNum) && daysLeftNum <= 3);
            return (
              <div key={idx} className="notification-item">
                <div className={`notification-accent ${urgent ? 'deadline-accent' : 'general-accent'}`} />
                <div className="notification-content">
                  <div className="notification-header">
                    <div className="notification-type">🗓️</div>
                    <h3 className="notification-title" style={{ marginRight: 8 }}>{d.title}</h3>
                    <span style={prBadge(d.priority)}>{d.priority}</span>
                  </div>
                  <div className="notification-divider" />
                  <div className="notification-main-content">
                    <p className="notification-message">
                      Due: <strong>{dueStr}</strong>{Number.isFinite(daysLeftNum) ? ` • ${daysLeftNum} day${daysLeftNum === 1 ? '' : 's'} left` : ''}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeadlinesPage;
