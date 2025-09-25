import React, { useEffect, useState } from 'react';
import { getUser } from '../../utils/auth';

const GreetingSection: React.FC = () => {
    const [now, setNow] = useState(new Date());
    const [displayName, setDisplayName] = useState<string>('');

    useEffect(() => {
        // Pull role-aware user and construct preferred display name
        const u: any = getUser() || {};
        const honor = (u.honorific || '').trim();
        const first = (u.firstName || '').trim();
        const last = (u.lastName || '').trim();
        const full = (u.name || '').trim();
        const base = [honor, first || full.split(' ')[0] || '', last || (full.split(' ').slice(-1)[0] || '')]
            .filter(Boolean)
            .join(' ')
            .trim();
        setDisplayName(base || 'Ransford Yeboah');
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
        <div className="greeting-panel">
            <div className="date-pill">Today is {ordinal(day)} {month} {year}, {weekday}</div>
            <h1 style={{ marginTop: "8px", marginBottom: "8px" }}>Hello, {displayName}!</h1>
            <p style={{ margin: 0, textAlign: 'center', lineHeight: 1.4 }}>
                Your dashboard gives quick access to attendance, grades and notifications.<br/>
                Helping you stay ahead every step of the way.
            </p>
        </div>
    );
};

export default GreetingSection;