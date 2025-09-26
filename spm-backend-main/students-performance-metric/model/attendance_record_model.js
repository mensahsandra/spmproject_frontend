const mongoose = require('mongoose');

const attendanceRecordSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'AttendanceSession', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  scannedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Add recommended indexes for performance
attendanceRecordSchema.index({ session: 1, scannedAt: -1, createdAt: -1 });

module.exports = mongoose.model('AttendanceRecord', attendanceRecordSchema);