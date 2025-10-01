import React from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleDeadlinesCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div
      onClick={() => navigate('/student/notifications?tab=deadlines', { state: { from: 'deadlines' } })}
      style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        overflow: 'hidden',
        cursor: 'pointer',
        marginBottom: '8px',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Red Left Bar */}
      <div
        style={{
          width: '60px',
          minWidth: '60px',
          background: 'linear-gradient(to bottom, #ef4444 0%, #ef4444 60%, #dc2626 100%)',
          display: 'flex',
          flexDirection: 'column'
        }}
      ></div>
      
      {/* Card Content */}
      <div style={{ flex: 1, padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px', color: '#6b7280' }}>📅</span>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: 0 }}>
            Upcoming Deadlines
          </h3>
        </div>
        <hr style={{ border: 'none', height: '1px', background: '#e5e7eb', margin: '12px 0 16px 0' }} />
        <p style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          margin: 0, 
          lineHeight: 1.5, 
          fontStyle: 'italic' 
        }}>
          Check all approaching assignment and project deadlines.
        </p>
      </div>
    </div>
  );
};

export default SimpleDeadlinesCard;