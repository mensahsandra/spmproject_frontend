const express = require('express');
const router = express.Router();
const GradeController = require('../controller/grade_controller');

// GET /api/grades/enrolled?courseCode=...
router.get('/enrolled', GradeController.getEnrolled);

// POST /api/grades/bulk-update
router.post('/bulk-update', GradeController.bulkUpdate);

// GET /api/grades/history?courseCode=...
router.get('/history', GradeController.getHistory);

module.exports = router;