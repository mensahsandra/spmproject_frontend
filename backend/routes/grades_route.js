const express = require('express');
const GradeController = require('../controller/grade_controller');

const router = express.Router();

// GET /api/grades/enrolled - Get enrolled students for a course
router.get('/enrolled', GradeController.getEnrolled);

// POST /api/grades/bulk-update - Bulk update grades
router.post('/bulk-update', GradeController.bulkUpdate);

// GET /api/grades/history - Get grade history
router.get('/history', GradeController.getHistory);

module.exports = router;