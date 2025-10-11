import React, { useEffect, useState } from 'react';
import { getToken, getActiveRole, getUser } from '../../utils/auth';

/**
 * Debug component to display authentication state
 * Use this temporarily to diagnose token issues
 */
const TokenDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const info = {
      activeRole: getActiveRole(),
      lecturerToken: getToken('lecturer'),
      studentToken: getToken('student'),
      legacyToken: localStorage.getItem('token'),
      lecturerUser: getUser('lecturer'),
      studentUser: getUser('student'),
      legacyUser: localStorage.getItem('user'),
      allLocalStorageKeys: Object.keys(localStorage),
      allSessionStorageKeys: Object.keys(sessionStorage),
    };
    setDebugInfo(info);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      maxWidth: 400,
      maxHeight: 500,
      overflow: 'auto',
      backgroundColor: '#1f2937',
      color: '#f3f4f6',
      padding: 16,
      borderRadius: 8,
      fontSize: 12,
      fontFamily: 'monospace',
      zIndex: 9999,
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#10b981' }}>🔍 Auth Debug Info</h4>
      
      <div style={{ marginBottom: 8 }}>
        <strong style={{ color: '#60a5fa' }}>Active Role:</strong>
        <div style={{ color: debugInfo.activeRole ? '#10b981' : '#ef4444' }}>
          {debugInfo.activeRole || 'NOT SET'}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong style={{ color: '#60a5fa' }}>Lecturer Token:</strong>
        <div style={{ 
          color: debugInfo.lecturerToken ? '#10b981' : '#ef4444',
          wordBreak: 'break-all'
        }}>
          {debugInfo.lecturerToken ? `${debugInfo.lecturerToken.substring(0, 30)}...` : 'NOT FOUND'}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong style={{ color: '#60a5fa' }}>Student Token:</strong>
        <div style={{ 
          color: debugInfo.studentToken ? '#10b981' : '#ef4444',
          wordBreak: 'break-all'
        }}>
          {debugInfo.studentToken ? `${debugInfo.studentToken.substring(0, 30)}...` : 'NOT FOUND'}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong style={{ color: '#60a5fa' }}>Legacy Token:</strong>
        <div style={{ 
          color: debugInfo.legacyToken ? '#10b981' : '#ef4444',
          wordBreak: 'break-all'
        }}>
          {debugInfo.legacyToken ? `${debugInfo.legacyToken.substring(0, 30)}...` : 'NOT FOUND'}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong style={{ color: '#60a5fa' }}>Lecturer User:</strong>
        <div style={{ color: debugInfo.lecturerUser ? '#10b981' : '#ef4444' }}>
          {debugInfo.lecturerUser ? JSON.stringify(debugInfo.lecturerUser, null, 2) : 'NOT FOUND'}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong style={{ color: '#60a5fa' }}>LocalStorage Keys:</strong>
        <div style={{ color: '#9ca3af' }}>
          {debugInfo.allLocalStorageKeys?.join(', ') || 'none'}
        </div>
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong style={{ color: '#60a5fa' }}>SessionStorage Keys:</strong>
        <div style={{ color: '#9ca3af' }}>
          {debugInfo.allSessionStorageKeys?.join(', ') || 'none'}
        </div>
      </div>

      <button
        onClick={() => {
          console.log('=== FULL DEBUG INFO ===');
          console.log('Active Role:', debugInfo.activeRole);
          console.log('Lecturer Token:', debugInfo.lecturerToken);
          console.log('Student Token:', debugInfo.studentToken);
          console.log('Legacy Token:', debugInfo.legacyToken);
          console.log('Lecturer User:', debugInfo.lecturerUser);
          console.log('Student User:', debugInfo.studentUser);
          console.log('Legacy User:', debugInfo.legacyUser);
          console.log('All LocalStorage:', debugInfo.allLocalStorageKeys);
          console.log('All SessionStorage:', debugInfo.allSessionStorageKeys);
          console.log('======================');
        }}
        style={{
          marginTop: 8,
          padding: '6px 12px',
          backgroundColor: '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 11,
          width: '100%'
        }}
      >
        Log Full Info to Console
      </button>
    </div>
  );
};

export default TokenDebug;