const GradeService = require('../services/grade_service');

class GradeController {
  /**
   * Get enrolled students for a course
   * GET /api/grades/enrolled?courseCode=...
   */
  static async getEnrolled(req, res) {
    try {
      const { courseCode } = req.query;
      
      if (!courseCode) {
        return res.status(400).json({
          ok: false,
          message: 'Course code is required'
        });
      }

      const students = await GradeService.getEnrolledStudents(courseCode);
      
      return res.status(200).json({
        ok: true,
        students,
        count: students.length
      });
    } catch (error) {
      console.error('Error getting enrolled students:', error);
      return res.status(500).json({
        ok: false,
        message: error.message || 'Failed to get enrolled students'
      });
    }
  }

  /**
   * Bulk update grades for multiple students
   * POST /api/grades/bulk-update
   * Body: { courseCode, updates: [{ studentId, grade, score?, student? }] }
   */
  static async bulkUpdate(req, res) {
    try {
      const { courseCode, updates } = req.body;
      
      if (!courseCode || !Array.isArray(updates)) {
        return res.status(400).json({
          ok: false,
          message: 'Course code and updates array are required'
        });
      }

      if (updates.length === 0) {
        return res.status(400).json({
          ok: false,
          message: 'Updates array cannot be empty'
        });
      }

      // Add updatedBy from request if available (e.g., from auth middleware)
      const updatedBy = req.user?.id || req.user?.name || 'system';
      const updatesWithUser = updates.map(update => ({
        ...update,
        updatedBy
      }));

      const results = await GradeService.bulkUpdate(courseCode, updatesWithUser);
      
      return res.status(200).json({
        ok: true,
        message: `Updated ${results.success} grades successfully`,
        results
      });
    } catch (error) {
      console.error('Error bulk updating grades:', error);
      return res.status(500).json({
        ok: false,
        message: error.message || 'Failed to update grades'
      });
    }
  }

  /**
   * Get grade history for a course or specific student
   * GET /api/grades/history?courseCode=...&studentId=...
   */
  static async getHistory(req, res) {
    try {
      const { courseCode, studentId } = req.query;
      
      if (!courseCode) {
        return res.status(400).json({
          ok: false,
          message: 'Course code is required'
        });
      }

      const history = await GradeService.getHistory(courseCode, studentId);
      
      return res.status(200).json({
        ok: true,
        history,
        count: history.length
      });
    } catch (error) {
      console.error('Error getting grade history:', error);
      return res.status(500).json({
        ok: false,
        message: error.message || 'Failed to get grade history'
      });
    }
  }
}

module.exports = GradeController;