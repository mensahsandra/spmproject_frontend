const AttendanceRecordService = require('../services/attendance_record_service');

class AttendanceRecordController {
  /**
   * Get attendance logs with filtering and pagination
   * GET /api/attendance/logs
   */
  static async getLogs(req, res) {
    try {
      const {
        courseCode,
        sessionCode,
        date,
        filterType = 'day',
        page = 1,
        limit = 25
      } = req.query;

      // Validate pagination parameters
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 25));

      const options = {
        courseCode,
        sessionCode,
        date,
        filterType,
        page: pageNum,
        limit: limitNum
      };

      const result = await AttendanceRecordService.getLogs(options);

      return res.status(200).json({
        ok: true,
        logs: result.logs,
        totalPages: result.totalPages,
        totalRecords: result.totalRecords,
        currentPage: pageNum,
        limit: limitNum
      });

    } catch (error) {
      console.error('Error getting attendance logs:', error);
      return res.status(500).json({
        ok: false,
        message: error.message || 'Failed to get attendance logs'
      });
    }
  }

  /**
   * Export attendance logs as CSV
   * GET /api/attendance/export
   */
  static async exportAttendanceCsv(req, res) {
    try {
      const {
        courseCode,
        sessionCode,
        date,
        filterType = 'day'
      } = req.query;

      // Get all logs without pagination for export
      const options = {
        courseCode,
        sessionCode,
        date,
        filterType,
        page: 1,
        limit: 10000 // Large limit to get all records for export
      };

      const result = await AttendanceRecordService.getLogs(options);
      const logs = result.logs;

      // CSV headers
      const headers = [
        'Timestamp',
        'Student ID',
        'Centre',
        'Course Code',
        'Course Name',
        'Lecturer',
        'Session Code'
      ];

      // Convert logs to CSV format
      const csvRows = [headers.join(',')];
      
      for (const log of logs) {
        const row = [
          `"${log.timestamp || ''}"`,
          `"${log.studentId || ''}"`,
          `"${log.centre || ''}"`,
          `"${log.courseCode || ''}"`,
          `"${log.courseName || ''}"`,
          `"${log.lecturer || ''}"`,
          `"${log.sessionCode || ''}"`
        ];
        csvRows.push(row.join(','));
      }

      const csvContent = csvRows.join('\n');

      // Generate filename with current date and filters
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      let filename = `attendance_logs_${dateStr}`;
      
      if (courseCode) filename += `_${courseCode}`;
      if (sessionCode) filename += `_${sessionCode}`;
      filename += '.csv';

      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Cache-Control', 'no-cache');
      
      return res.status(200).send(csvContent);

    } catch (error) {
      console.error('Error exporting attendance CSV:', error);
      return res.status(500).json({
        ok: false,
        message: error.message || 'Failed to export attendance CSV'
      });
    }
  }

  /**
   * Get recommended database indexes for attendance records
   * GET /api/attendance/indexes (for admin/development use)
   */
  static async getRecommendedIndexes(req, res) {
    try {
      const indexes = AttendanceRecordService.getRecommendedIndexes();
      
      return res.status(200).json({
        ok: true,
        indexes,
        message: 'Recommended indexes for optimal attendance query performance'
      });

    } catch (error) {
      console.error('Error getting recommended indexes:', error);
      return res.status(500).json({
        ok: false,
        message: error.message || 'Failed to get recommended indexes'
      });
    }
  }
}

module.exports = AttendanceRecordController;