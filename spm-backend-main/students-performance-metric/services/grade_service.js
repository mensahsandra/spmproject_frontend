const Grade = require('../model/grade_model');
const AttendanceSession = require('../model/attendance_session_model');
const AttendanceRecord = require('../model/attendance_record_model');
const Student = require('../model/student_model');

class GradeService {
  // Build enrolled list from attendance records for the course (fallback if you lack enrollments)
  static async getEnrolledStudents(courseCode) {
    // Find sessions for course
    const sessions = await AttendanceSession.find({ courseCode }).select('_id');
    const sessionIds = sessions.map(s => s._id);

    let students = [];
    if (sessionIds.length) {
      const records = await AttendanceRecord.find({ session: { $in: sessionIds } }).populate('student');
      const map = new Map();
      for (const r of records) {
        const s = r.student;
        if (s && !map.has(s.studentId)) {
          map.set(s.studentId, { id: String(s._id), studentId: s.studentId, name: s.user?.name || s.studentId });
        }
      }
      students = Array.from(map.values());
    } else {
      // Fallback: return none (or a limited set)
      students = [];
    }

    // Attach currentGrade if exists
    const studentIds = students.map(s => s.studentId);
    const grades = await Grade.find({ courseCode, studentId: { $in: studentIds } });
    const gradeByStudent = new Map(grades.map(g => [g.studentId, g.currentGrade]));
    return students.map(s => ({ ...s, currentGrade: gradeByStudent.get(s.studentId) ?? null }));
  }

  static async bulkUpdate(courseCode, updates, changedBy) {
    for (const { studentId, grade } of updates) {
      const existing = await Grade.findOne({ courseCode, studentId });
      const oldGrade = existing?.currentGrade ?? null;

      await Grade.findOneAndUpdate(
        { courseCode, studentId },
        {
          $set: { currentGrade: String(grade) },
          $setOnInsert: { student: (await Student.findOne({ studentId }))?._id || undefined },
          $push: { history: { oldGrade, newGrade: String(grade), changedBy } }
        },
        { upsert: true, new: true }
      );
    }
    return { ok: true };
  }

  static async getHistory(courseCode) {
    const docs = await Grade.find({ courseCode }).lean();
    const history = [];
    for (const g of docs) {
      for (const h of (g.history || [])) {
        history.push({
          id: `${g._id}-${h.changedAt?.getTime?.() || Date.now()}`,
          changedAt: h.changedAt,
          studentName: g.studentName || '', // optional
          studentId: g.studentId,
          courseCode,
          oldGrade: h.oldGrade,
          newGrade: h.newGrade,
          changedBy: h.changedBy || '',
        });
      }
    }
    // newest first
    history.sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt));
    return history;
  }
}

module.exports = GradeService;