const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, index: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentId: { type: String, required: true, index: true },
  currentGrade: { type: String },
  history: [{
    oldGrade: { type: String },
    newGrade: { type: String, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String }, // lecturer id/email/name
  }]
}, { timestamps: true });

gradeSchema.index({ courseCode: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Grade', gradeSchema);