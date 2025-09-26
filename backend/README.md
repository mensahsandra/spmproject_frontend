# SPM Project Backend API

This backend provides APIs for attendance logs/export and grading functionality for the Student Performance Metrics project.

## Features

### Attendance APIs
- **GET /api/attendance/logs** - Get attendance logs with filtering and pagination
- **GET /api/attendance/export** - Export attendance logs as CSV
- **GET /api/attendance/indexes** - Get recommended database indexes

### Grades APIs  
- **GET /api/grades/enrolled** - Get enrolled students for a course
- **POST /api/grades/bulk-update** - Bulk update grades for multiple students
- **GET /api/grades/history** - Get grade history for a course

## Installation

```bash
cd backend
npm install
npm start
```

## API Documentation

### Attendance Logs
- **Endpoint**: `GET /api/attendance/logs`
- **Query Parameters**:
  - `courseCode` (optional) - Filter by course code
  - `sessionCode` (optional) - Filter by session code  
  - `date` (optional) - Filter by date (YYYY-MM-DD)
  - `filterType` (optional) - 'day', 'week', 'month' (default: 'day')
  - `page` (optional) - Page number (default: 1)
  - `limit` (optional) - Items per page (default: 25, max: 100)

**Response**:
```json
{
  "ok": true,
  "logs": [
    {
      "timestamp": "2024-01-15 09:30:00",
      "studentId": "2023001", 
      "centre": "Main Campus",
      "courseCode": "BIT364",
      "courseName": "Software Engineering",
      "lecturer": "Dr. Smith",
      "sessionCode": "BIT364-L01-2024"
    }
  ],
  "totalPages": 1,
  "totalRecords": 5,
  "currentPage": 1,
  "limit": 25
}
```

### Export Attendance CSV
- **Endpoint**: `GET /api/attendance/export`
- **Query Parameters**: Same as logs endpoint
- **Response**: CSV file download with headers

### Enrolled Students
- **Endpoint**: `GET /api/grades/enrolled?courseCode=BIT364`
- **Response**:
```json
{
  "ok": true,
  "students": [
    {
      "studentId": "2023001",
      "student": "John Doe", 
      "currentGrade": "A",
      "currentScore": 85,
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 3
}
```

### Bulk Update Grades
- **Endpoint**: `POST /api/grades/bulk-update`
- **Body**:
```json
{
  "courseCode": "BIT364",
  "updates": [
    { "studentId": "2023001", "grade": "A+", "score": 95 },
    { "studentId": "2023002", "grade": "A", "score": 88 }
  ]
}
```

### Grade History
- **Endpoint**: `GET /api/grades/history?courseCode=BIT364&studentId=2023001`
- **Response**:
```json
{
  "ok": true,
  "history": [
    {
      "courseCode": "BIT364",
      "studentId": "2023001",
      "student": "John Doe",
      "grade": "A",
      "score": 85,
      "updatedAt": "2024-01-15T10:30:00Z",
      "isCurrent": true
    }
  ],
  "count": 1
}
```

## Recommended Database Indexes

For optimal performance, create these indexes:

### Attendance Records Collection
```javascript
// Core indexes for attendance queries
db.attendancerecords.createIndex({ "session": 1 })
db.attendancerecords.createIndex({ "scannedAt": -1 })
db.attendancerecords.createIndex({ "createdAt": -1 })

// Compound indexes for common query patterns
db.attendancerecords.createIndex({ "studentId": 1, "scannedAt": -1 })
db.attendancerecords.createIndex({ "courseCode": 1, "scannedAt": -1 })
```

### Attendance Sessions Collection
```javascript
db.attendancesessions.createIndex({ "courseCode": 1 })
db.attendancesessions.createIndex({ "sessionCode": 1 })
db.attendancesessions.createIndex({ "courseCode": 1, "sessionCode": 1 })
```

### Grades Collection
```javascript
// Unique compound index for course-student combination
db.grades.createIndex({ "courseCode": 1, "studentId": 1 }, { unique: true })

// Performance index for course queries
db.grades.createIndex({ "courseCode": 1 })
```

## Architecture

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic and data processing
- **Models**: Define data schemas (MongoDB/Mongoose)
- **Routes**: Define API endpoints and route handlers

## Development

This implementation uses mock data for demonstration. In production:

1. Replace mock services with actual MongoDB connections
2. Add authentication/authorization middleware
3. Add input validation and sanitization
4. Add rate limiting and security headers
5. Add comprehensive error logging