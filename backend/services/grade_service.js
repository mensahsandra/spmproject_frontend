// Mock Grade model for demonstration (replace with actual database implementation)
class MockGrade {
  static mockData = [
    { courseCode: 'BIT364', studentId: '2023001', student: 'John Doe', currentGrade: 'A', currentScore: 85, updatedAt: '2024-01-15T10:30:00Z' },
    { courseCode: 'BIT364', studentId: '2023002', student: 'Jane Smith', currentGrade: 'B+', currentScore: 78, updatedAt: '2024-01-15T10:30:00Z' },
    { courseCode: 'BIT364', studentId: '2023003', student: 'Bob Johnson', currentGrade: 'A-', currentScore: 82, updatedAt: '2024-01-15T10:30:00Z' },
    { courseCode: 'CSC205', studentId: '2023001', student: 'John Doe', currentGrade: 'B', currentScore: 75, updatedAt: '2024-01-15T10:30:00Z' },
    { courseCode: 'CSC205', studentId: '2023004', student: 'Alice Brown', currentGrade: 'A+', currentScore: 92, updatedAt: '2024-01-15T10:30:00Z' }
  ];

  static find(query) {
    let results = this.mockData;
    if (query.courseCode) {
      results = results.filter(item => item.courseCode === query.courseCode);
    }
    return {
      select: () => ({
        sort: () => results
      })
    };
  }

  static findOne(query) {
    return this.mockData.find(item => 
      item.courseCode === query.courseCode && item.studentId === query.studentId
    );
  }

  static mockHistory = [
    { courseCode: 'BIT364', studentId: '2023001', student: 'John Doe', grade: 'B+', score: 80, updatedAt: '2024-01-10T10:30:00Z', updatedBy: 'Dr. Smith', isCurrent: false },
    { courseCode: 'BIT364', studentId: '2023001', student: 'John Doe', grade: 'A', score: 85, updatedAt: '2024-01-15T10:30:00Z', updatedBy: 'Dr. Smith', isCurrent: true }
  ];
}

class GradeService {
  /**
   * Get enrolled students for a course
   * @param {string} courseCode - Course code to filter by
   * @returns {Promise<Array>} List of enrolled students with their grades
   */
  static async getEnrolledStudents(courseCode) {
    if (!courseCode) {
      throw new Error('Course code is required');
    }

    try {
      // Using mock data for demonstration
      const students = MockGrade.find({ courseCode }).select().sort();
      return students;
    } catch (error) {
      throw new Error(`Failed to get enrolled students: ${error.message}`);
    }
  }

  /**
   * Bulk update grades for multiple students
   * @param {string} courseCode - Course code
   * @param {Array} updates - Array of {studentId, grade, score, updatedBy} objects
   * @returns {Promise<Object>} Update results
   */
  static async bulkUpdate(courseCode, updates) {
    if (!courseCode || !Array.isArray(updates) || updates.length === 0) {
      throw new Error('Course code and updates array are required');
    }

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const update of updates) {
      try {
        const { studentId, grade, score, updatedBy = 'system' } = update;
        
        if (!studentId || grade === undefined) {
          results.failed++;
          results.errors.push(`Missing studentId or grade for update: ${JSON.stringify(update)}`);
          continue;
        }

        // Simulate database update
        console.log(`Mock update: ${courseCode} - ${studentId} -> ${grade} (${score})`);
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Failed to update ${update.studentId}: ${error.message}`);
      }
    }

    return results;
  }

  /**
   * Get grade history for a course
   * @param {string} courseCode - Course code to filter by
   * @param {string} studentId - Optional student ID to filter by specific student
   * @returns {Promise<Array>} Grade history records
   */
  static async getHistory(courseCode, studentId = null) {
    if (!courseCode) {
      throw new Error('Course code is required');
    }

    try {
      let history = MockGrade.mockHistory.filter(item => item.courseCode === courseCode);
      
      if (studentId) {
        history = history.filter(item => item.studentId === studentId);
      }

      return history.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      throw new Error(`Failed to get grade history: ${error.message}`);
    }
  }
}

module.exports = GradeService;