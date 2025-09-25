import React from 'react';
import { getUser } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
    const navigate = useNavigate();

    const [open, setOpen] = React.useState(false);
    // Pull lightweight user data from localStorage; provide safe fallbacks
    const userData: any = getUser() || {};
    const role: string = (userData.role || '').toLowerCase();
    const honor = (userData.honorific || '').trim();
    const full = (userData.name || '').trim();
    const first = (userData.firstName || '').trim() || (full.split(' ')[0] || '');
    const last = (userData.lastName || '').trim() || (full.split(' ').slice(-1)[0] || '');
    const fullName: string = [honor, first, last].filter(Boolean).join(' ').trim() || (role === 'lecturer' ? 'Lecturer User' : 'Ransford Yeboah');
    const indexNo: string = userData.indexNo || (role === 'lecturer' ? '' : '9123456');
    const studentId: string = userData.studentId || userData.lecturerId || userData.staffId || '21058161';
    const programme: string = role === 'lecturer'
        ? (userData.course || userData.programme || '—')
        : (userData.programme || 'BSc. Information Technology IDL (TOP-UP)');
    const currentCenter: string = (localStorage.getItem('currentCenter') || localStorage.getItem('selectedCenter') || userData.center || (role === 'lecturer' ? '—' : 'IDL - Kumasi Center'));
    const toggle = (e: React.MouseEvent) => { e.stopPropagation(); setOpen(v => !v); };
    React.useEffect(() => {
        const onDoc = () => setOpen(false);
        document.addEventListener('click', onDoc);
        return () => document.removeEventListener('click', onDoc);
    }, []);

    return (
        <div className="topbar">
            <div className={`profile-card ${open ? 'profile-dropdown open' : 'profile-dropdown'}`}>
                <span className="profile-bell" aria-hidden onClick={(e) => { e.stopPropagation(); navigate('/notifications?tab=notifications', { state: { from: 'notifications' } }); }}>🔔</span>
                <div className="profile-name" title={fullName}>{fullName.split(' ')[0]}</div>
                <div className="profile-image-container">
                    <img
                        src="/assets/images/AugustArt.png"
                        alt="Profile"
                        className="profile-image"
                        
                    />
                </div>
                <span className="profile-caret" aria-hidden onClick={toggle}>▾</span>

                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                    <p style={{ fontWeight: 700, marginTop: 0, marginBottom: 8 }}>{fullName}</p>
                    {role === 'lecturer' ? (
                        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 8, columnGap: 10, fontSize: 13, color: '#374151' }}>
                            <div style={{ opacity: 0.7 }}>Staff Number</div>
                            <div style={{ fontWeight: 600 }}>{studentId}</div>
                            <div style={{ opacity: 0.7 }}>Course</div>
                            <div style={{ fontWeight: 600 }}>{programme}</div>
                            <div style={{ opacity: 0.7 }}>Email</div>
                            <div style={{ fontWeight: 600 }}>{userData.email || '—'}</div>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 8, columnGap: 10, fontSize: 13, color: '#374151' }}>
                            <div style={{ opacity: 0.7 }}>Index Number</div>
                            <div style={{ fontWeight: 600 }}>{indexNo}</div>
                            <div style={{ opacity: 0.7 }}>Student Number</div>
                            <div style={{ fontWeight: 600 }}>{studentId}</div>
                            <div style={{ opacity: 0.7 }}>Programme</div>
                            <div style={{ fontWeight: 600 }}>{programme}</div>
                            <div style={{ opacity: 0.7 }}>Current Center</div>
                            <div style={{ fontWeight: 600 }}>{currentCenter}</div>
                        </div>
                    )}
                                        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '12px 0' }} />
                                        <button
                                            className="logout-btn"
                                            onClick={() => {
                                                // Clear session/auth data
                                                try {
                                                    localStorage.removeItem('token');
                                                    localStorage.removeItem('user');
                                                    localStorage.removeItem('currentCenter');
                                                    localStorage.removeItem('selectedCenter');
                                                } catch {}
                                                // Navigate to login
                                                navigate('/student-login', { replace: true });
                                            }}
                                        >
                                            Log Out
                                        </button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
