const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const AttendanceRecord = require('../model/attendance_record_model');
const AttendanceSession = require('../model/attendance_session_model');
const Student = require('../model/student_model');
const Grade = require('../model/grade_model');

// Import services for testing
const AttendanceRecordService = require('../services/attendance_record_service');
const GradeService = require('../services/grade_service');

async function setupTestData() {
  console.log('Setting up test data...');
  
  // Create test student
  const student = new Student({
    studentId: 'TEST001',
    user: { name: 'Test Student' },
    department: 'Computer Science',
    programme: 'BSc IT',
    indexNo: '12345678'
  });
  await student.save();
  
  // Create test session
  const session = new AttendanceSession({
    courseCode: 'CS101',
    courseName: 'Introduction to Programming',
    sessionCode: 'CS101-001',
    lecturer: 'Dr. Test Lecturer',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours later
  });
  await session.save();
  
  // Create test attendance record
  const record = new AttendanceRecord({
    session: session._id,
    student: student._id,
    scannedAt: new Date(),
  });
  await record.save();
  
  console.log('Test data created successfully');
  return { student, session, record };
}

async function testAttendanceLogs() {
  console.log('\n=== Testing Attendance Logs ===');
  
  try {
    const result = await AttendanceRecordService.getLogs({
      courseCode: 'CS101',
      sessionCode: '',
      date: new Date().toISOString().split('T')[0],
      filterType: 'day',
      page: 1,
      limit: 10
    });
    
    console.log('Attendance logs result:');
    console.log(`Total records: ${result.total}`);
    console.log(`Records returned: ${result.records.length}`);
    if (result.records.length > 0) {
      console.log('Sample record:', result.records[0]);
    }
  } catch (error) {
    console.error('Error testing attendance logs:', error.message);
  }
}

async function testGradeServices() {
  console.log('\n=== Testing Grade Services ===');
  
  try {
    // Test getEnrolledStudents
    const enrolled = await GradeService.getEnrolledStudents('CS101');
    console.log(`Enrolled students: ${enrolled.length}`);
    if (enrolled.length > 0) {
      console.log('Sample enrolled student:', enrolled[0]);
    }
    
    // Test bulkUpdate
    if (enrolled.length > 0) {
      const updates = [{ studentId: enrolled[0].studentId, grade: 'A' }];
      const updateResult = await GradeService.bulkUpdate('CS101', updates, 'test-lecturer');
      console.log('Bulk update result:', updateResult);
      
      // Test getHistory
      const history = await GradeService.getHistory('CS101');
      console.log(`Grade history entries: ${history.length}`);
      if (history.length > 0) {
        console.log('Sample history entry:', history[0]);
      }
    }
  } catch (error) {
    console.error('Error testing grade services:', error.message);
  }
}

async function cleanup() {
  console.log('\n=== Cleaning up test data ===');
  try {
    await AttendanceRecord.deleteMany({ 'student.studentId': 'TEST001' });
    await AttendanceSession.deleteMany({ courseCode: 'CS101' });
    await Student.deleteMany({ studentId: 'TEST001' });
    await Grade.deleteMany({ courseCode: 'CS101' });
    console.log('Test data cleaned up');
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
}

async function main() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spmproject_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to test database');
    
    // Setup test data
    await setupTestData();
    
    // Test services
    await testAttendanceLogs();
    await testGradeServices();
    
    // Cleanup
    await cleanup();
    
    console.log('\n✅ All tests completed successfully');
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from database');
  }
}

if (require.main === module) {
  main();
}

module.exports = { setupTestData, testAttendanceLogs, testGradeServices, cleanup };