import React, { useEffect, useState } from 'react';
import { getUser, isAuthenticated, getActiveRole } from '../utils/auth';

const LoginDebugPage: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const collectDebugInfo = () => {
      const activeRole = getActiveRole();
      const user = getUser();
      const isAuth = isAuthenticated();
      
      const info = {
        timestamp: new Date().toISOString(),
        activeRole,
        isAuthenticated: isAuth,
        user,
        localStorage: {
          user: localStorage.getItem('user'),
          lecturer: localStorage.getItem('lecturer'),
          student: localStorage.getItem('student'),
          activeRole: localStorage.getItem('activeRole'),
          token: localStorage.getItem('token'),
          lecturerToken: localStorage.getItem('lecturer_token'),
          profile: localStorage.getItem('profile')
        },
        sessionStorage: {
          user: sessionStorage.getItem('user'),
          token: sessionStorage.getItem('token')
        },
        cookies: document.cookie
      };
      
      console.log('🔍 [DEBUG] Complete authentication state:', info);
      setDebugInfo(info);
    };

    collectDebugInfo();
    
    // Refresh every 2 seconds
    const interval = setInterval(collectDebugInfo, 2000);
    return () => clearInterval(interval);
  }, []);

  const clearAllStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.reload();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'monospace', fontSize: 12 }}>
      <h2>🔍 Login Debug Information</h2>
      
      <div style={{ marginBottom: 20 }}>
        <button 
          onClick={clearAllStorage}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#dc2626', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Clear All Storage & Reload
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Quick Status:</h3>
        <div>✅ Active Role: <strong>{debugInfo.activeRole || 'None'}</strong></div>
        <div>✅ Is Authenticated: <strong>{debugInfo.isAuthenticated ? 'Yes' : 'No'}</strong></div>
        <div>✅ User Name: <strong>{debugInfo.user?.name || 'None'}</strong></div>
        <div>✅ Staff ID: <strong>{debugInfo.user?.staffId || debugInfo.user?.userId || 'None'}</strong></div>
      </div>

      <details>
        <summary>📋 Full Debug Data (Click to expand)</summary>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: 10, 
          borderRadius: 4, 
          overflow: 'auto',
          maxHeight: 400
        }}>
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>

      <div style={{ marginTop: 20 }}>
        <h3>🧪 Test Actions:</h3>
        <button 
          onClick={() => window.location.href = '/lecturer-login'}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#10b981', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer',
            marginRight: 10
          }}
        >
          Go to Lecturer Login
        </button>
        
        <button 
          onClick={() => window.location.href = '/lecturer/dashboard'}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: 4,
            cursor: 'pointer'
          }}
        >
          Try Lecturer Dashboard
        </button>
      </div>

      <div style={{ marginTop: 20, fontSize: 10, color: '#666' }}>
        Last updated: {debugInfo.timestamp}
      </div>
    </div>
  );
};

export default LoginDebugPage;
