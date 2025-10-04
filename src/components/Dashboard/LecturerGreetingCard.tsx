import React, { useEffect, useState } from 'react';
import { getUser } from '../../utils/auth';

const LecturerGreetingCard: React.FC = () => {
    const [now, setNow] = useState(new Date());
    const [displayName, setDisplayName] = useState<string>('');

    useEffect(() => {
        const u: any = getUser() || {};
        const honor = (u.honorific || '').trim();
        const first = (u.firstName || '').trim();
        const last = (u.lastName || '').trim();
        const full = (u.name || '').trim();
        const base = [honor, first || full.split(' ')[0] || '', last || (full.split(' ').slice(-1)[0] || '')]
            .filter(Boolean)
            .join(' ')
            .trim();
        setDisplayName(base || 'Dr. Lecturer');
    }, []);

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60 * 1000);
        return () => clearInterval(id);
    }, []);

    const month = now.toLocaleString('en-US', { month: 'long' });
    const weekday = now.toLocaleString('en-US', { weekday: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();

    const ordinal = (n: number) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return (
        <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
            margin: '0 0 24px 0',
            overflow: 'hidden',
            maxWidth: '800px',
            marginLeft: '0',
            marginRight: 'auto'
        }}>
            {/* Blue Header for Lecturer */}
            <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                padding: '12px 20px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 500
            }}>
                Today is {ordinal(day)} {month} {year}, {weekday}
            </div>
            
            {/* Content */}
            <div style={{
                padding: '24px 20px',
                textAlign: 'center'
            }}>
                <h2 style={{
                    margin: '0 0 12px 0',
                    fontSize: '24px',
                    fontWeight: 600,
                    color: '#1f2937'
                }}>
                    Welcome back, {displayName}!
                </h2>
                <p style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: '#6b7280',
                    fontStyle: 'italic'
                }}>
                    Manage your courses, track attendance, and grade assessments all in one place.<br/>
                    Your teaching dashboard is ready to help you succeed.
                </p>
            </div>
        </div>
    );
};

export default LecturerGreetingCard;