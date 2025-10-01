import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getActiveRole, getUser } from '../../utils/auth';

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
    // detect role: prefer activeRole session flag, fallback to current path semantics or stored user
    let role = getActiveRole() || '';
    if (!role) {
        if (path.startsWith('/lecturer')) role = 'lecturer';
        else if (path.startsWith('/student')) role = 'student';
        else {
            const u = getUser();
            role = (u?.role || '').toLowerCase();
        }
    }
    const isLecturer = role === 'lecturer';

    // helper: safe navigate ensuring role separation
    const go = (target: string) => {
        navigate(target);
    };

    // no-op: legacy hash navigation removed for lecturer; using path routes

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
                <li className={isActive('/student/dashboard') ? 'active' : ''} onClick={() => go('/student/dashboard')}>
                    <span className="nav-icon">🏠</span>
                    <span className="nav-text">Home</span>
                </li>
                                <li className={isActive('/student/record-attendance') ? 'active' : ''} onClick={() => navigate('/student/record-attendance')}>
                                    <span className="nav-icon">📋</span>
                                    <span className="nav-text">Attendance</span>
                                </li>
                                <li className={isActive('/student/select-result') ? 'active' : ''} onClick={() => navigate('/student/select-result', { state: { showCurrent: true } })}>
                                    <span className="nav-icon">📊</span>
                                    <span className="nav-text">Performance</span>
                                </li>
                                <li className={isActive(/\/student\/deadlines|^\/student\/notifications/) ? 'active' : ''} onClick={() => navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } })}>
                                    <span className="nav-icon">📅</span>
                                    <span className="nav-text">Deadlines</span>
                                    {unread > 0 && (
                                        <span className="notification-badge">{unread}</span>
                                    )}
                                </li>
                            </>
                        )}
            {isLecturer && (
                            <>
                <li className={path === '/lecturer/dashboard' ? 'active' : ''} onClick={() => { window.location.hash=''; go('/lecturer/dashboard'); }}>
                    <span className="nav-icon">🏠</span>
                    <span className="nav-text">Home</span>
                </li>
                                <li className={path === '/lecturer/generatesession' ? 'active' : ''} onClick={() => navigate('/lecturer/generatesession', { state: { fromNav: true } })}>
                                    <span className="nav-icon">🧾</span>
                                    <span className="nav-text">Generate</span>
                                </li>
                                <li className={path === '/lecturer/attendance' ? 'active' : ''} onClick={() => go('/lecturer/attendance')}>
                                    <span className="nav-icon">📋</span>
                                    <span className="nav-text">Attendance</span>
                                </li>
                                <li className={path === '/lecturer/assessment' ? 'active' : ''} onClick={() => go('/lecturer/assessment')}>
                                    <span className="nav-icon">📝</span>
                                    <span className="nav-text">Assessment</span>
                                </li>
                                <li className={path === '/lecturer/export' ? 'active' : ''} onClick={() => go('/lecturer/export')}>
                                    <span className="nav-icon">📤</span>
                                    <span className="nav-text">Export</span>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
            
            <div className="sidebar-footer">
                <div className="services-divider"></div>
                <div className="other-services">
                    <div className="nav-section-title">Other Services</div>
                    <ul className="services-section">
                        <li onClick={() => window.open('https://kcc.knust.edu.gh/', '_blank')}>
                            <span className="nav-icon">🧠</span>
                            <span className="nav-text">Counselling</span>
                        </li>
                        <li onClick={() => window.open('mailto:feedback@idl.knust.edu.gh', '_blank')}>
                            <span className="nav-icon">💬</span>
                            <span className="nav-text">Feedback</span>
                        </li>
                        <li onClick={() => setAboutOpen(true)}>
                            <span className="nav-icon">ℹ️</span>
                            <span className="nav-text">About Us</span>
                        </li>
                    </ul>
                </div>
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