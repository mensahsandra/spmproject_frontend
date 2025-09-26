const AttendanceRecord = require('../model/attendance_record_model');
const AttendanceSession = require('../model/attendance_session_model');

class AttendanceRecordService {
  // Existing methods would be here...

  // NEW: Get attendance logs with filtering and pagination
  static async getLogs({ courseCode, sessionCode, date, filterType = 'day', page = 1, limit = 25 }) {
    // Build date range
    let start = null, end = null;
    if (date) {
      const base = new Date(date);
      if (!isNaN(base.getTime())) {
        const s = new Date(base);
        const e = new Date(base);
        if (filterType === 'day') {
          e.setDate(e.getDate() + 1);
        } else if (filterType === 'week') {
          const d = s.getDay(); // 0=Sun
          const diffToMonday = (d + 6) % 7;
          s.setDate(s.getDate() - diffToMonday);
          e.setDate(s.getDate() + 7);
        } else if (filterType === 'month') {
          s.setDate(1);
          e.setMonth(s.getMonth() + 1);
          e.setDate(1);
        } else {
          e.setDate(e.getDate() + 1);
        }
        start = s; end = e;
      }
    }

    const match = {};
    if (start && end) {
      match.$or = [
        { scannedAt: { $gte: start, $lt: end } },
        { createdAt: { $gte: start, $lt: end } },
      ];
    }

    // For $lookup collection names, adjust if your schemas use custom 'collection'
    const pipeline = [
      { $match: match },
      { $lookup: { from: 'attendancesessions', localField: 'session', foreignField: '_id', as: 'session' } },
      { $unwind: '$session' },
      { $lookup: { from: 'students', localField: 'student', foreignField: '_id', as: 'student' } },
      { $unwind: '$student' },
    ];

    const sessionMatch = {};
    if (courseCode) sessionMatch['session.courseCode'] = courseCode;
    if (sessionCode) sessionMatch['session.sessionCode'] = sessionCode;
    if (Object.keys(sessionMatch).length) pipeline.push({ $match: sessionMatch });

    pipeline.push(
      { $sort: { scannedAt: -1, createdAt: -1 } },
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                timestamp: { $ifNull: ['$scannedAt', '$createdAt'] },
                studentId: '$student.studentId',
                centre: '$student.department', // UI maps this as 'Centre'
                courseCode: '$session.courseCode',
                courseName: '$session.courseName',
                lecturer: '$session.lecturer',
                sessionCode: '$session.sessionCode',
              }
            }
          ],
          total: [{ $count: 'count' }]
        }
      }
    );

    const result = await AttendanceRecord.aggregate(pipeline);
    const data = (result[0]?.data) || [];
    const total = (result[0]?.total?.[0]?.count) || 0;
    return { records: data, total };
  }
}

module.exports = AttendanceRecordService;