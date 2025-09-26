// AttendanceRecordService.js
// This service handles fetching attendance logs with aggregation, lookups, and pagination

class AttendanceRecordService {
  /**
   * Get attendance logs with aggregation, lookups, and pagination
   * @param {Object} options - Query options
   * @param {string} options.courseCode - Course code filter
   * @param {string} options.sessionCode - Session code filter
   * @param {string} options.date - Date filter (YYYY-MM-DD)
   * @param {string} options.filterType - Filter type: 'day', 'week', 'month'
   * @param {number} options.page - Page number (1-based)
   * @param {number} options.limit - Items per page
   * @returns {Promise<Object>} { logs, totalPages, totalRecords }
   */
  static async getLogs(options = {}) {
    const {
      courseCode,
      sessionCode,
      date,
      filterType = 'day',
      page = 1,
      limit = 25
    } = options;

    try {
      // In a real implementation, this would connect to MongoDB
      // For now, we'll simulate the expected data structure and aggregation
      
      // Build match conditions
      const matchConditions = {};
      
      if (courseCode) {
        matchConditions.courseCode = { $regex: courseCode, $options: 'i' };
      }
      
      if (sessionCode) {
        matchConditions.sessionCode = { $regex: sessionCode, $options: 'i' };
      }

      // Date range filtering
      if (date) {
        const baseDate = new Date(date);
        const startDate = new Date(baseDate);
        const endDate = new Date(baseDate);

        switch (filterType) {
          case 'day':
            endDate.setDate(endDate.getDate() + 1);
            break;
          case 'week':
            // Start from Monday of the week
            const dayOfWeek = startDate.getDay();
            const diffToMonday = (dayOfWeek + 6) % 7;
            startDate.setDate(startDate.getDate() - diffToMonday);
            endDate.setDate(startDate.getDate() + 7);
            break;
          case 'month':
            startDate.setDate(1);
            endDate.setMonth(startDate.getMonth() + 1);
            endDate.setDate(1);
            break;
        }

        matchConditions.scannedAt = {
          $gte: startDate,
          $lt: endDate
        };
      }

      // Simulate MongoDB aggregation pipeline
      const pipeline = [
        { $match: matchConditions },
        
        // Lookup session details
        {
          $lookup: {
            from: 'attendancesessions',
            localField: 'session',
            foreignField: '_id',
            as: 'sessionDetails'
          }
        },
        
        // Lookup student details
        {
          $lookup: {
            from: 'students',
            localField: 'studentId',
            foreignField: 'studentId',
            as: 'studentDetails'
          }
        },
        
        // Lookup course details
        {
          $lookup: {
            from: 'courses',
            localField: 'courseCode',
            foreignField: 'courseCode',
            as: 'courseDetails'
          }
        },

        // Project the required fields
        {
          $project: {
            timestamp: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: '$scannedAt'
              }
            },
            studentId: '$studentId',
            centre: { $ifNull: ['$centre', { $arrayElemAt: ['$studentDetails.centre', 0] }] },
            courseCode: '$courseCode',
            courseName: { $arrayElemAt: ['$courseDetails.courseName', 0] },
            lecturer: { $arrayElemAt: ['$sessionDetails.lecturer', 0] },
            sessionCode: { $arrayElemAt: ['$sessionDetails.sessionCode', 0] },
            scannedAt: '$scannedAt',
            createdAt: '$createdAt'
          }
        },
        
        // Sort by most recent first
        { $sort: { scannedAt: -1 } }
      ];

      // For simulation purposes, return mock data that matches the expected structure
      const mockLogs = this.generateMockLogs(matchConditions, page, limit);
      
      return {
        logs: mockLogs.data,
        totalPages: mockLogs.totalPages,
        totalRecords: mockLogs.totalRecords
      };

    } catch (error) {
      throw new Error(`Failed to get attendance logs: ${error.message}`);
    }
  }

  /**
   * Generate mock attendance logs for demonstration
   * In a real implementation, this would be replaced with actual database queries
   */
  static generateMockLogs(matchConditions, page, limit) {
    // Mock data that matches the expected frontend structure
    const allMockData = [
      {
        timestamp: '2024-01-15 09:30:00',
        studentId: '2023001',
        centre: 'Main Campus',
        courseCode: 'BIT364',
        courseName: 'Software Engineering',
        lecturer: 'Dr. Smith',
        sessionCode: 'BIT364-L01-2024'
      },
      {
        timestamp: '2024-01-15 09:32:15',
        studentId: '2023002',
        centre: 'Main Campus',
        courseCode: 'BIT364',
        courseName: 'Software Engineering',
        lecturer: 'Dr. Smith',
        sessionCode: 'BIT364-L01-2024'
      },
      {
        timestamp: '2024-01-15 14:15:30',
        studentId: '2023001',
        centre: 'Main Campus',
        courseCode: 'CSC205',
        courseName: 'Data Structures',
        lecturer: 'Prof. Johnson',
        sessionCode: 'CSC205-L02-2024'
      },
      {
        timestamp: '2024-01-14 10:45:00',
        studentId: '2023003',
        centre: 'North Campus',
        courseCode: 'BIT364',
        courseName: 'Software Engineering',
        lecturer: 'Dr. Smith',
        sessionCode: 'BIT364-L01-2024'
      },
      {
        timestamp: '2024-01-14 10:47:22',
        studentId: '2023004',
        centre: 'North Campus',
        courseCode: 'BIT364',
        courseName: 'Software Engineering',
        lecturer: 'Dr. Smith',
        sessionCode: 'BIT364-L01-2024'
      }
    ];

    // Apply basic filtering (in real implementation, this would be done in the database)
    let filteredData = allMockData;
    
    if (matchConditions.courseCode) {
      const regex = new RegExp(matchConditions.courseCode.$regex, 'i');
      filteredData = filteredData.filter(log => regex.test(log.courseCode));
    }
    
    if (matchConditions.sessionCode) {
      const regex = new RegExp(matchConditions.sessionCode.$regex, 'i');
      filteredData = filteredData.filter(log => regex.test(log.sessionCode));
    }

    // Pagination
    const totalRecords = filteredData.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      totalPages,
      totalRecords
    };
  }

  /**
   * Get database indexes recommendations
   * @returns {Array} Array of recommended indexes
   */
  static getRecommendedIndexes() {
    return [
      // Attendance Record indexes
      { collection: 'attendancerecords', index: { session: 1 } },
      { collection: 'attendancerecords', index: { scannedAt: -1 } },
      { collection: 'attendancerecords', index: { createdAt: -1 } },
      { collection: 'attendancerecords', index: { studentId: 1, scannedAt: -1 } },
      { collection: 'attendancerecords', index: { courseCode: 1, scannedAt: -1 } },
      
      // Attendance Session indexes
      { collection: 'attendancesessions', index: { courseCode: 1 } },
      { collection: 'attendancesessions', index: { sessionCode: 1 } },
      { collection: 'attendancesessions', index: { courseCode: 1, sessionCode: 1 } }
    ];
  }
}

module.exports = AttendanceRecordService;