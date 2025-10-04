import React from 'react';
import { useRoleAccess } from '../../hooks/useRoleAccess';
import RoleGuard from './RoleGuard';

/**
 * Demo component to show role-based access control in action
 */
const RoleValidationDemo: React.FC = () => {
  const { currentRole, isStudent, isLecturer, hasRole } = useRoleAccess();
  
  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid #e5e7eb', 
      borderRadius: '8px', 
      margin: '20px 0',
      backgroundColor: '#f9fafb'
    }}>
      <h3 style={{ color: '#1f2937', marginBottom: '16px' }}>🔒 Role Validation Status</h3>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Current Role:</strong> <span style={{ 
          color: currentRole === 'student' ? '#059669' : '#dc2626',
          fontWeight: 'bold'
        }}>{currentRole || 'None'}</span>
      </div>
      
      <div style={{ marginBottom: '12px' }}>
        <strong>Is Student:</strong> <span style={{ color: isStudent ? '#059669' : '#6b7280' }}>
          {isStudent ? '✅ Yes' : '❌ No'}
        </span>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Is Lecturer:</strong> <span style={{ color: isLecturer ? '#059669' : '#6b7280' }}>
          {isLecturer ? '✅ Yes' : '❌ No'}
        </span>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <strong>Access Tests:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Can access student features: <span style={{ color: hasRole('student') ? '#059669' : '#dc2626' }}>
            {hasRole('student') ? '✅ Yes' : '❌ No'}
          </span></li>
          <li>Can access lecturer features: <span style={{ color: hasRole('lecturer') ? '#059669' : '#dc2626' }}>
            {hasRole('lecturer') ? '✅ Yes' : '❌ No'}
          </span></li>
        </ul>
      </div>
      
      <div>
        <strong>Role-Protected Content:</strong>
        <div style={{ marginTop: '8px', padding: '12px', backgroundColor: 'white', borderRadius: '4px' }}>
          <RoleGuard 
            requiredRole="student" 
            fallback={<span style={{ color: '#6b7280', fontStyle: 'italic' }}>Student content hidden</span>}
          >
            <span style={{ color: '#059669' }}>🎓 This content is only visible to students</span>
          </RoleGuard>
          
          <br />
          
          <RoleGuard 
            requiredRole="lecturer" 
            fallback={<span style={{ color: '#6b7280', fontStyle: 'italic' }}>Lecturer content hidden</span>}
          >
            <span style={{ color: '#dc2626' }}>👨‍🏫 This content is only visible to lecturers</span>
          </RoleGuard>
        </div>
      </div>
    </div>
  );
};

export default RoleValidationDemo;