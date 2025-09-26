const mongoose = require('mongoose');

const gradeHistorySchema = new mongoose.Schema({
  grade: { type: String, required: true },
  score: { type: Number, required: true },
  updatedBy: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  comment: { type: String, default: '' }
});

const gradeSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  student: { type: String, required: true }, // student name
  studentId: { type: String, required: true },
  currentGrade: { type: String, default: null },
  currentScore: { type: Number, default: 0 },
  history: [gradeHistorySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create unique compound index on courseCode and studentId
gradeSchema.index({ courseCode: 1, studentId: 1 }, { unique: true });

// Index for performance on courseCode queries
gradeSchema.index({ courseCode: 1 });

// Update the updatedAt field before saving
gradeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;