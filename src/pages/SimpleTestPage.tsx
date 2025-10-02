import React from 'react';

const SimpleTestPage: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: 'green', textAlign: 'center' }}>
        ✅ SIMPLE TEST PAGE WORKING!
      </h1>
      <p style={{ textAlign: 'center', fontSize: '18px' }}>
        If you can see this, the routing is working fine.
      </p>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px auto',
        maxWidth: '600px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2>Test Information:</h2>
        <ul>
          <li>Route: /simple-test</li>
          <li>Component: SimpleTestPage</li>
          <li>No authentication required</li>
          <li>No external dependencies</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleTestPage;