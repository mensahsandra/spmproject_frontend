const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Mount routes
app.use('/api/attendance', require('./routes/attendance_record_route'));
app.use('/api/grades', require('./routes/grades_route'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'SPM Project Backend API',
    endpoints: {
      attendance: {
        logs: 'GET /api/attendance/logs',
        export: 'GET /api/attendance/export',
        indexes: 'GET /api/attendance/indexes'
      },
      grades: {
        enrolled: 'GET /api/grades/enrolled',
        bulkUpdate: 'POST /api/grades/bulk-update',
        history: 'GET /api/grades/history'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ ok: false, message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ ok: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;