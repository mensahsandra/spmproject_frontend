const express = require('express');
const AttendanceRecordController = require('../controller/attendance_record_controller');

const router = express.Router();

// GET /api/attendance/logs - Get attendance logs with filtering and pagination
router.get('/logs', AttendanceRecordController.getLogs);

// GET /api/attendance/export - Export attendance logs as CSV
router.get('/export', AttendanceRecordController.exportAttendanceCsv);

// GET /api/attendance/indexes - Get recommended database indexes (for admin use)
router.get('/indexes', AttendanceRecordController.getRecommendedIndexes);

module.exports = router;