import React, { useState, useEffect } from 'react';

const WelcomePanel: React.FC = () => {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const displayName = (user?.name || '').trim() || 'Ransford Yeboah';
    return (
        <section className="welcome-panel">
            <h1>Hello, {displayName}!</h1>
            <p>Your dashboard gives quick access to attendance, grades and notifications. Helping you stay ahead every step of the way.</p>
        </section>
    );
};

export default WelcomePanel;