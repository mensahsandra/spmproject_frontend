const express = require('express');
const router = express.Router();
const attendanceRecordController = require('../controller/attendance_record_controller');

// Existing routes would be here...

// NEW: Attendance logs and export routes
router.get('/logs', attendanceRecordController.getLogs);
router.get('/export', attendanceRecordController.exportAttendanceCsv);

module.exports = router;