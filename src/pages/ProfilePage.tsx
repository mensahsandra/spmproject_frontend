import React, { useMemo } from 'react';
import { getUser } from '../utils/auth';
import DashboardLayout from '../components/Dashboard/DashboardLayout';

const field: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  marginBottom: 12,
};

const label: React.CSSProperties = {
  fontSize: 12,
  color: '#6b7280',
};

const input: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: 8,
  border: '1px solid #d1d5db',
  background: '#f9fafb',
};

const card: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '220px 1fr',
  gap: 20,
  background: '#fff',
  borderRadius: 12,
  boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
  padding: 16,
  maxWidth: 900,
  margin: '24px',
};

const ProfilePage: React.FC = () => {
  const profile = useMemo(() => {
    let base: any = {};
  try { base = getUser() || {}; } catch {}
    
    console.log('🔍 [PROFILE] User data from storage:', base);
    
    const role = (base.role || '').toLowerCase();
    if (role === 'lecturer') {
      const honor = (base.honorific || '').trim();
      const full = (base.name || '').trim();
      const first = (base.firstName || '').trim() || (full.split(' ')[0] || '');
      const last = (base.lastName || '').trim() || (full.split(' ').slice(-1)[0] || '');
      
      // Get staff ID - prioritize staffId field (NOT lecturerId which is MongoDB ObjectId)
      const staffId = base.staffId || base.staffNumber || '—';
      
      console.log('🔍 [PROFILE] Staff ID options:', {
        staffId: base.staffId,
        staffNumber: base.staffNumber,
        lecturerId: base.lecturerId, // MongoDB ObjectId - NOT staff ID
        selected: staffId
      });
      
      return {
        role,
        name: [honor, first, last].filter(Boolean).join(' ').trim() || 'Lecturer',
        staffNumber: staffId,
        course: base.course || base.subject || '—',
        email: base.email || '—',
        avatar: '/assets/images/AugustArt.png',
      };
    }
    const honor = (base.honorific || '').trim();
    const full = (base.name || '').trim();
    const first = (base.firstName || '').trim() || (full.split(' ')[0] || '');
    const last = (base.lastName || '').trim() || (full.split(' ').slice(-1)[0] || '');
    return {
      role: role || 'student',
      name: [honor, first, last].filter(Boolean).join(' ').trim() || 'Ransford Yeboah',
      studentNumber: base.studentId || base.indexNo || '—',
      indexNumber: base.indexNo || '-------',
      programme: base.programme || '—',
      gender: base.gender || '—',
      country: base.country || '—',
      email: base.email || '—',
      avatar: '/assets/images/AugustArt.png',
    };
  }, []);

  return (
    <DashboardLayout showGreeting={true}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={card as React.CSSProperties}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 160, height: 160, borderRadius: 12, overflow: 'hidden', background: '#eef2ff' }}>
            <img
              src={profile.avatar}
              alt="Profile"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/160x160?text=Photo'; }}
            />
          </div>
          <div style={{ marginTop: 6, border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', color: '#374151', background: '#fff' }}>
            {profile.role === 'lecturer' ? (
              <>
                <span style={{ opacity: 0.8, marginRight: 6 }}>Staff Number:</span>
                <strong>{profile.staffNumber}</strong>
              </>
            ) : (
              <>
                <span style={{ opacity: 0.8, marginRight: 6 }}>Student Number:</span>
                <strong>{profile.studentNumber}</strong>
              </>
            )}
          </div>
        </div>

        <div>
          <div style={field}>
            <label style={label}>Full name</label>
            <input style={input} value={profile.name} readOnly />
          </div>
          {profile.role === 'lecturer' ? (
            <>
              <div style={field}>
                <label style={label}>Course</label>
                <input style={input} value={profile.course} readOnly />
              </div>
            </>
          ) : (
            <>
              <div style={field}>
                <label style={label}>Gender</label>
                <input style={input} value={profile.gender} readOnly />
              </div>
              <div style={field}>
                <label style={label}>Country</label>
                <input style={input} value={profile.country} readOnly />
              </div>
              <div style={field}>
                <label style={label}>Index Number</label>
                <input style={input} value={profile.indexNumber} readOnly />
              </div>
              <div style={field}>
                <label style={label}>Programme</label>
                <input style={input} value={profile.programme} readOnly />
              </div>
            </>
          )}
          <div style={field}>
            <label style={label}>KNUST Email</label>
            <input style={input} value={profile.email} readOnly />
          </div>
        </div>
      </div>

        <div style={{ marginLeft: 24 }}>
          <button
            className="logout-btn"
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/student-login'; }}
          >
            Log Out
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
