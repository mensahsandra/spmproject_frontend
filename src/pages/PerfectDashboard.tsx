import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../utils/auth';
import Sidebar from '../components/Dashboard/Sidebar';
import ProfileDropdown from '../components/ProfileDropdown';

const PerfectDashboard: React.FC = () => {
    const navigate = useNavigate();
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

    const cardStyle = {
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        overflow: 'hidden',
        cursor: 'pointer',
        marginBottom: '16px',
        transition: 'all 0.2s ease',
        width: '100%'
    };

    const greenBarStyle = {
        width: '60px',
        minWidth: '60px',
        background: 'linear-gradient(to bottom, #22c55e 0%, #22c55e 60%, #16a34a 100%)',
        display: 'flex',
        flexDirection: 'column' as const
    };

    const redBarStyle = {
        width: '60px',
        minWidth: '60px',
        background: 'linear-gradient(to bottom, #ef4444 0%, #ef4444 60%, #dc2626 100%)',
        display: 'flex',
        flexDirection: 'column' as const
    };

    const cardContentStyle = {
        flex: 1,
        padding: '20px 24px'
    };

    const cardHeaderStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
    };

    const iconStyle = {
        fontSize: '20px',
        color: '#6b7280'
    };

    const titleStyle = {
        fontSize: '18px',
        fontWeight: 600,
        color: '#1f2937',
        margin: 0
    };

    const dividerStyle = {
        border: 'none',
        height: '1px',
        background: '#e5e7eb',
        margin: '12px 0 16px 0'
    };

    const descriptionStyle = {
        fontSize: '14px',
        color: '#6b7280',
        margin: 0,
        lineHeight: 1.5,
        fontStyle: 'italic' as const
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f1f5f9',
            fontFamily: "'Segoe UI', sans-serif"
        }}>
            <Sidebar />
            
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '24px 40px',
                backgroundColor: '#f1f5f9',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                {/* Top Bar */}
                <div style={{
                    position: 'absolute',
                    top: '24px',
                    right: '40px',
                    zIndex: 100
                }}>
                    <ProfileDropdown />
                </div>

                {/* Greeting Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    margin: '60px 0 30px 0',
                    overflow: 'hidden',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '100%'
                }}>
                    {/* Green Header */}
                    <div style={{
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
                            Hello, {displayName}!
                        </h2>
                        <p style={{
                            margin: 0,
                            fontSize: '14px',
                            lineHeight: 1.6,
                            color: '#6b7280',
                            fontStyle: 'italic'
                        }}>
                            Your dashboard gives quick access to attendance, grades and notifications.<br/>
                            Helping you stay ahead every step of the way.
                        </p>
                    </div>
                </div>

                {/* Cards Container */}
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%',
                    padding: '0 20px'
                }}>
                    {/* Attendance Card */}
                    <div 
                        style={cardStyle}
                        onClick={() => navigate('/student/record-attendance')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={greenBarStyle}></div>
                        <div style={cardContentStyle}>
                            <div style={cardHeaderStyle}>
                                <span style={iconStyle}>📋</span>
                                <h3 style={titleStyle}>Attendance</h3>
                            </div>
                            <hr style={dividerStyle} />
                            <p style={descriptionStyle}>
                                Here for today's class? Click to check in and mark your attendance.
                            </p>
                        </div>
                    </div>

                    {/* Performance Card */}
                    <div 
                        style={cardStyle}
                        onClick={() => navigate('/student/select-result')}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={greenBarStyle}></div>
                        <div style={cardContentStyle}>
                            <div style={cardHeaderStyle}>
                                <span style={iconStyle}>📊</span>
                                <h3 style={titleStyle}>Check Performance</h3>
                            </div>
                            <hr style={dividerStyle} />
                            <p style={descriptionStyle}>
                                Check your grades obtained for your registered courses.
                            </p>
                        </div>
                    </div>

                    {/* Deadlines Card */}
                    <div 
                        style={cardStyle}
                        onClick={() => navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } })}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={redBarStyle}></div>
                        <div style={cardContentStyle}>
                            <div style={cardHeaderStyle}>
                                <span style={iconStyle}>📅</span>
                                <h3 style={titleStyle}>Upcoming Deadlines</h3>
                            </div>
                            <hr style={dividerStyle} />
                            <p style={descriptionStyle}>
                                Check all approaching assignment and project deadlines.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PerfectDashboard;