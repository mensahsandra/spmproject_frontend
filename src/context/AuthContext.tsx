import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchUser } from '../utils/api';
import { getUser, isAuthenticated, logout, getActiveRole, setActiveRole, storeUser } from '../utils/auth';
import { loginPath, normalizeRole } from '../utils/roles';

interface AuthState {
  user: any | null;
  role: string | null;
  loading: boolean;
  refresh: (role?: string) => Promise<void>;
  switchRole: (role: string) => void;
  logoutUser: (role?: string) => void;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(getActiveRole());
  const [user, setUser] = useState<any | null>(getUser(role || undefined));
  const [loading, setLoading] = useState(true);

  const refresh = async (r?: string) => {
    const targetRole = (r || role || getActiveRole() || '').toLowerCase();
    if (!targetRole) { setLoading(false); return; }
    setLoading(true);
    
    // Check if we're in development mode and should skip API calls
    const isDevMode = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      import.meta.env.MODE === 'development';
    
    if (isDevMode && targetRole === 'lecturer') {
      // Use demo user data in development mode
      const demoUser = {
        name: 'Dr. John Doe',
        email: 'john.doe@example.com',
        role: 'lecturer',
        staffId: '12345'
      };
      storeUser(targetRole, demoUser);
      setUser(demoUser);
      setRole(targetRole);
      setActiveRole(targetRole);
      setLoading(false);
      return;
    }
    
    const u = await fetchUser(targetRole);
    if (u) {
      storeUser(targetRole, u);
      setUser(u);
      setRole(targetRole);
      setActiveRole(targetRole);
    }
    setLoading(false);
  };

  useEffect(() => {
    const currentRole = role || getActiveRole();
    if (isAuthenticated(currentRole || undefined)) {
      refresh(currentRole || undefined);
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  const switchRole = (newRole: string) => {
    setActiveRole(newRole);
    setRole(newRole);
    setUser(getUser(newRole));
  };

  const logoutUser = (r?: string) => {
    const normalized = r ? normalizeRole(r) : undefined;
    logout(normalized);
    if (!normalized || (normalized && role === normalized)) {
      setUser(null);
      setRole(null);
      window.location.href = loginPath(normalized);
    }
  };

  return (
  <AuthContext.Provider value={{ user, role, loading, refresh, switchRole, logoutUser }}>
      {loading ? (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:16}}>
          <div style={{width:60,height:60,border:'6px solid #e5e7eb',borderTopColor:'#10b981',borderRadius:'50%',animation:'spinslow 1s linear infinite'}} />
          <div style={{fontSize:14,color:'#374151'}}>Checking authentication...</div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// simple keyframes injection (one-time)
(function addStyle(){
  if (document.getElementById('auth-spinner-style')) return;
  const style = document.createElement('style');
  style.id='auth-spinner-style';
  style.innerHTML='@keyframes spinslow{to{transform:rotate(360deg)}}';
  document.head.appendChild(style);
})();
