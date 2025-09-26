const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  sessionCode: { type: String, required: true },
  lecturer: { type: String, required: true },
  date: { type: Date, required: true },
  startTime: { type: Date },
  endTime: { type: Date }
}, { timestamps: true });

// Add recommended indexes for performance
attendanceSessionSchema.index({ courseCode: 1 });
attendanceSessionSchema.index({ sessionCode: 1 });

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);