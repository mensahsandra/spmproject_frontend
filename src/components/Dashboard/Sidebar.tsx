import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const isActive = (to: string | RegExp) => {
        if (typeof to === 'string') return path === to;
        return to.test(path);
    };
        // lightweight unread count: prefer injected count in history.state, fallback to localStorage
        let unread = 0;
        try {
                const hs: any = history.state || {};
                unread = hs.unreadCount ?? Number(localStorage.getItem('unreadNotifications') || '0');
        } catch {}
    const [aboutOpen, setAboutOpen] = React.useState(false);
    // detect role
    let role = '';
    try { const raw = localStorage.getItem('user'); if (raw) role = (JSON.parse(raw).role || '').toLowerCase(); } catch {}

    const isLecturer = role === 'lecturer';

    // helper: safe navigate ensuring role separation
    const go = (target: string) => {
        navigate(target);
    };

    const setLecturerSection = (section: string) => {
        // keep same base path
    if (location.pathname !== '/lecturer/dashboard') navigate('/lecturer/dashboard');
        // update hash for dashboard content to react to
        window.location.hash = section;
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-content">
                <div className="logo-section">
                    <img 
                        src="/assets/images/KNUST IDL Logo.png" 
                        alt="KNUST IDL Logo" 
                        className="sidebar-logo"
                        onError={(e) => {
                            e.currentTarget.src = "/assets/images/KNUST Logo.png";
                        }}
                    />
                </div>
                <nav className="main-nav">
                    <ul>
            {!isLecturer && (
                            <>
                <li className={isActive('/student/dashboard') ? 'active' : ''} onClick={() => go('/student/dashboard')}>🏠 Home (Student)</li>
                                <li className={isActive('/student/record-attendance') ? 'active' : ''} onClick={() => navigate('/student/record-attendance')}>📋 Attendance (Student)</li>
                                <li className={isActive('/student/select-result') ? 'active' : ''} onClick={() => navigate('/student/select-result', { state: { showCurrent: true } })}>📊 Performance (Student)</li>
                                <li className={isActive(/\/student\/deadlines|^\/student\/notifications/) ? 'active' : ''} onClick={() => navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } })}>
                                    📅 Deadlines
                                    {unread > 0 && (
                                        <span style={{
                                            marginLeft: 8,
                                            background: '#ef4444',
                                            color: 'white',
                                            borderRadius: 999,
                                            padding: '2px 8px',
                                            fontSize: 12,
                                            fontWeight: 700
                                        }}>{unread}</span>
                                    )}
                                </li>
                            </>
                        )}
            {isLecturer && (
                            <>
                <li className={path === '/lecturer/dashboard' && !location.hash ? 'active' : ''} onClick={() => { window.location.hash=''; go('/lecturer/dashboard'); }}>🏠 Home</li>
                                <li className={location.hash === '#Generate-Session-Code' ? 'active' : ''} onClick={() => setLecturerSection('Generate-Session-Code')}>🧾 Generate</li>
                                <li className={location.hash === '#View-Attendance-Log' ? 'active' : ''} onClick={() => setLecturerSection('View-Attendance-Log')}>📋 Attendance</li>
                                <li className={location.hash === '#Update-Grade' ? 'active' : ''} onClick={() => setLecturerSection('Update-Grade')}>📝 Assessment</li>
                                <li className={location.hash === '#Export' ? 'active' : ''} onClick={() => setLecturerSection('Export')}>📤 Export</li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
            
            <div className="sidebar-footer">
                <div className="services-divider"></div>
                <ul className="services-section">
                    <li className="section-header">Other Services</li>
                    <li onClick={() => window.open('https://kcc.knust.edu.gh/', '_blank')}>🧠 Counselling</li>
                                        <li onClick={() => setAboutOpen(true)}>ℹ️ About Us</li>
                </ul>
            </div>

                        {aboutOpen && (
                            <div
                                role="dialog"
                                aria-modal="true"
                                style={{
                                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000
                                }}
                                onClick={() => setAboutOpen(false)}
                            >
                                <div
                                    style={{ background: '#fff', width: 'min(560px, 92vw)', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ fontWeight: 700, fontSize: 18 }}>About Student Performance Matrix (SPM)</div>
                                        <button onClick={() => setAboutOpen(false)} style={{ border: 'none', background: 'transparent', fontSize: 20, cursor: 'pointer' }}>×</button>
                                    </div>
                                    <div style={{ padding: 20, color: '#374151', lineHeight: 1.6 }}>
                                        <p>
                                            Student Performance Matrix (SPM) is built to complement the existing systems for the Institute of Distance Learning (IDL).
                                            It was created as a final-year project to enhance automated attendance and performance tracking for IDL students.
                                        </p>
                                        <p>
                                            The platform provides a streamlined dashboard, QR-based attendance, results viewing, and deadline tracking—aimed at improving the
                                            overall learning experience and administrative efficiency for distance learners.
                                        </p>
                                    </div>
                                    <div style={{ padding: '10px 20px 18px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                                        <button onClick={() => setAboutOpen(false)} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontWeight: 600, cursor: 'pointer' }}>Close</button>
                                    </div>
                                </div>
                            </div>
                        )}
        </aside>
    );
};

export default Sidebar;