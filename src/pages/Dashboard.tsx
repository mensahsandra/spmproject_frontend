import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f0f0f0', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Simple test to see if changes are working */}
      <div style={{
        backgroundColor: '#007A3B',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>
          🎉 NEW DASHBOARD DESIGN TEST 🎉
        </h1>
        <p style={{ margin: '10px 0 0 0' }}>
          If you can see this green header, the changes are working!
        </p>
      </div>

      {/* Test cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#007A3B', margin: '0 0 10px 0' }}>✅ Attendance</h3>
          <p style={{ margin: 0, color: '#666' }}>This should be a clean white card</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#007A3B', margin: '0 0 10px 0' }}>📊 Performance</h3>
          <p style={{ margin: 0, color: '#666' }}>This should be a clean white card</p>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h3 style={{ color: '#DC2626', margin: '0 0 10px 0' }}>📅 Deadlines</h3>
          <p style={{ margin: 0, color: '#666' }}>This should be a clean white card</p>
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        marginTop: '20px',
        border: '1px solid #e0e0e0'
      }}>
        <h2 style={{ color: '#333', margin: '0 0 15px 0' }}>🔍 Debug Information</h2>
        <p style={{ margin: '5px 0', color: '#666' }}>
          <strong>Current Time:</strong> {new Date().toLocaleString()}
        </p>
        <p style={{ margin: '5px 0', color: '#666' }}>
          <strong>Component:</strong> Simple Test Dashboard (No Tailwind, No Complex Components)
        </p>
        <p style={{ margin: '5px 0', color: '#666' }}>
          <strong>Status:</strong> If you see this, the routing and component loading works
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;