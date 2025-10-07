import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { getActiveRole, getUser } from '../../utils/auth';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const path = location.pathname;
    const isActive = (to: string | RegExp) => {
        if (typeof to === 'string') return path === to;
        return to.test(path);
    };
    
    const isPerformanceActive = () => {
        return path === '/student/select-result' || path === '/student/academic-hub' || path.includes('/student/display-result');
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

    // Inline styles to ensure no CSS conflicts
    const sidebarStyle: React.CSSProperties = {
        position: 'fixed',
        left: 0,
        top: 0,
        width: '250px',
        height: '100vh',
        backgroundColor: '#F5F5F5',
        color: '#424242',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        borderRight: '1px solid #E0E0E0',
        fontFamily: "'Segoe UI', sans-serif"
    };

    const logoSectionStyle: React.CSSProperties = {
        padding: '20px',
        textAlign: 'center',
        borderBottom: '1px solid #E0E0E0'
    };

    const logoStyle: React.CSSProperties = {
        maxWidth: '120px',
        height: 'auto'
    };

    const navStyle: React.CSSProperties = {
        padding: '20px 0',
        flex: 1
    };

    const ulStyle: React.CSSProperties = {
        listStyle: 'none',
        padding: 0,
        margin: 0
    };

    const getNavItemStyle = (active: boolean): React.CSSProperties => ({
        padding: '12px 20px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: active ? 600 : 500,
        minHeight: '44px',
        color: active ? 'white' : '#424242',
        backgroundColor: active ? '#8BC34A' : 'transparent',
        margin: '8px 0',
        fontSize: '14px'
    });

    const navIconStyle: React.CSSProperties = {
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    };

    const navTextStyle: React.CSSProperties = {
        flex: 1
    };

    const notificationBadgeStyle: React.CSSProperties = {
        background: '#ef4444',
        color: 'white',
        borderRadius: '12px',
        padding: '2px 6px',
        fontSize: '11px',
        fontWeight: 600,
        marginLeft: 'auto'
    };

    const footerStyle: React.CSSProperties = {
        marginTop: 'auto',
        padding: '20px 0'
    };

    const dividerStyle: React.CSSProperties = {
        height: '1px',
        background: '#E0E0E0',
        margin: '0 20px 20px'
    };

    const sectionTitleStyle: React.CSSProperties = {
        color: '#9E9E9E',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        padding: '0 20px 16px',
        marginBottom: 0
    };

    const serviceItemStyle: React.CSSProperties = {
        color: '#424242',
        fontWeight: 400,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 20px',
        transition: 'all 0.2s ease',
        fontSize: '14px',
        cursor: 'pointer'
    };

    const serviceIconStyle: React.CSSProperties = {
        width: '16px',
        height: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.8
    };

    return (
        <aside style={sidebarStyle}>
            <div style={{ flex: 1, padding: 0 }}>
                <div style={logoSectionStyle}>
                    <img 
                        src="/assets/images/KNUST IDL Logo.png" 
                        alt="KNUST IDL Logo" 
                        style={logoStyle}
                        onError={(e) => {
                            e.currentTarget.src = "/assets/images/KNUST Logo.png";
                        }}
                    />
                </div>
                
                <nav style={navStyle}>
                    <ul style={ulStyle}>
                        {!isLecturer && (
                            <>
                                <li 
                                    style={getNavItemStyle(isActive('/student/dashboard'))}
                                    onClick={() => go('/student/dashboard')}
                                    onMouseEnter={(e) => {
                                        if (!isActive('/student/dashboard')) {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive('/student/dashboard')) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={navIconStyle}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                        </svg>
                                    </span>
                                    <span style={navTextStyle}>Home</span>
                                </li>
                                
                                <li 
                                    style={getNavItemStyle(isActive('/student/record-attendance'))}
                                    onClick={() => navigate('/student/record-attendance')}
                                    onMouseEnter={(e) => {
                                        if (!isActive('/student/record-attendance')) {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive('/student/record-attendance')) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={navIconStyle}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                                        </svg>
                                    </span>
                                    <span style={navTextStyle}>Attendance</span>
                                </li>
                                
                                <li 
                                    style={getNavItemStyle(isPerformanceActive())}
                                    onClick={() => navigate('/student/academic-hub')}
                                    onMouseEnter={(e) => {
                                        if (!isPerformanceActive()) {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isPerformanceActive()) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={navIconStyle}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M22,21H2V3H4V19H6V10H10V19H12V6H16V19H18V14H22V21Z"/>
                                        </svg>
                                    </span>
                                    <span style={navTextStyle}>Performance</span>
                                </li>
                                
                                <li 
                                    style={getNavItemStyle(isActive(/\/student\/deadlines|^\/student\/notifications/))}
                                    onClick={() => navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } })}
                                    onMouseEnter={(e) => {
                                        if (!isActive(/\/student\/deadlines|^\/student\/notifications/)) {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isActive(/\/student\/deadlines|^\/student\/notifications/)) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={navIconStyle}>
                                        <Clock size={20} />
                                    </span>
                                    <span style={navTextStyle}>Deadlines</span>
                                    {unread > 0 && (
                                        <span style={notificationBadgeStyle}>{unread}</span>
                                    )}
                                </li>
                            </>
                        )}
                        
                        {isLecturer && (
                            <>
                                <li 
                                    style={getNavItemStyle(path === '/lecturer/dashboard')}
                                    onClick={() => { window.location.hash=''; go('/lecturer/dashboard'); }}
                                    onMouseEnter={(e) => {
                                        if (path !== '/lecturer/dashboard') {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (path !== '/lecturer/dashboard') {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={navIconStyle}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                                        </svg>
                                    </span>
                                    <span style={navTextStyle}>Home</span>
                                </li>
                                
                                <li 
                                    style={getNavItemStyle(path === '/lecturer/generatesession')}
                                    onClick={() => navigate('/lecturer/generatesession', { state: { fromNav: true } })}
                                    onMouseEnter={(e) => {
                                        if (path !== '/lecturer/generatesession') {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (path !== '/lecturer/generatesession') {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={navIconStyle}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                        </svg>
                                    </span>
                                    <span style={navTextStyle}>Generate</span>
                                </li>
                                
                                <li 
                                    style={getNavItemStyle(path === '/lecturer/attendance')}
                                    onClick={() => go('/lecturer/attendance')}
                                    onMouseEnter={(e) => {
                                        if (path !== '/lecturer/attendance') {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (path !== '/lecturer/attendance') {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={navIconStyle}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                        </svg>
                                    </span>
                                    <span style={navTextStyle}>Attendance</span>
                                </li>
                                
                                <li 
                                    style={getNavItemStyle(path === '/lecturer/assessment')}
                                    onClick={() => go('/lecturer/assessment')}
                                    onMouseEnter={(e) => {
                                        if (path !== '/lecturer/assessment') {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (path !== '/lecturer/assessment') {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={navIconStyle}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14,10H19.5L14,4.5V10M5,3H15L21,9V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3M9,12H16V14H9V12M9,16H14V18H9V16Z"/>
                                        </svg>
                                    </span>
                                    <span style={navTextStyle}>Assessment</span>
                                </li>
                                
                                <li 
                                    style={getNavItemStyle(path === '/lecturer/export')}
                                    onClick={() => go('/lecturer/export')}
                                    onMouseEnter={(e) => {
                                        if (path !== '/lecturer/export') {
                                            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (path !== '/lecturer/export') {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    <span style={navIconStyle}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                        </svg>
                                    </span>
                                    <span style={navTextStyle}>Export</span>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
            
            <div style={footerStyle}>
                <div style={dividerStyle}></div>
                <div>
                    <div style={sectionTitleStyle}>OTHER SERVICES</div>
                    <ul style={ulStyle}>
                        <li 
                            style={serviceItemStyle}
                            onClick={() => window.open('https://kcc.knust.edu.gh/', '_blank')}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <span style={serviceIconStyle}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12,3C17.5,3 22,6.58 22,11C22,15.42 17.5,19 12,19C10.76,19 9.57,18.82 8.47,18.5C5.55,21 2,21 2,21C4.33,18.67 4.7,17.1 4.75,16.5C3.05,15.07 2,13.13 2,11C2,6.58 6.5,3 12,3Z"/>
                                </svg>
                            </span>
                            <span style={navTextStyle}>Counselling</span>
                        </li>
                        
                        <li 
                            style={serviceItemStyle}
                            onClick={() => setAboutOpen(true)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            <span style={serviceIconStyle}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z"/>
                                </svg>
                            </span>
                            <span style={navTextStyle}>About Us</span>
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