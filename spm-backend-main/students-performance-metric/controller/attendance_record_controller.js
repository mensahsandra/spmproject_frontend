const AttendanceRecordService = require('../services/attendance_record_service');

// Existing controller methods would be here...

// NEW: GET /api/attendance/logs
exports.getLogs = async (req, res) => {
  try {
    const {
      courseCode = '',
      sessionCode = '',
      date = '',
      filterType = 'day', // 'day' | 'week' | 'month'
      page = '1',
      limit = '25',
    } = req.query;

    const p = Math.max(1, parseInt(page, 10) || 1);
    const l = Math.min(200, Math.max(1, parseInt(limit, 10) || 25));

    const { records, total } = await AttendanceRecordService.getLogs({
      courseCode: String(courseCode).trim(),
      sessionCode: String(sessionCode).trim(),
      date: String(date).trim(),
      filterType: String(filterType).trim() || 'day',
      page: p,
      limit: l,
    });

    return res.status(200).json({
      ok: true,
      logs: records,
      totalPages: Math.max(1, Math.ceil(total / l)),
    });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};

// NEW: GET /api/attendance/export
exports.exportAttendanceCsv = async (req, res) => {
  try {
    const {
      courseCode = '',
      sessionCode = '',
      date = '',
      filterType = 'day',
    } = req.query;

    const { records } = await AttendanceRecordService.getLogs({
      courseCode: String(courseCode).trim(),
      sessionCode: String(sessionCode).trim(),
      date: String(date).trim(),
      filterType: String(filterType).trim() || 'day',
      page: 1,
      limit: 100000, // export up to 100k
    });

    const headers = [
      'Time',
      'Student ID',
      'Centre',
      'Course Code',
      'Course Name',
      'Lecturer',
      'Session Code',
    ];

    const rows = records.map(r => ([
      r.timestamp || '',
      r.studentId || '',
      r.centre || '',
      r.courseCode || '',
      r.courseName || '',
      r.lecturer || '',
      r.sessionCode || '',
    ]));

    const csv = [headers, ...rows]
      .map(cols => cols.map(v => {
        const s = String(v ?? '');
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="attendance_export.csv"');
    return res.status(200).send(csv);
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
};