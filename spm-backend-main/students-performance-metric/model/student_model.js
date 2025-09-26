const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  user: {
    name: { type: String, required: true }
  },
  department: { type: String }, // Used as 'Centre' in attendance logs
  programme: { type: String },
  indexNo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);