# Students Performance Metric Backend

This backend provides API endpoints for attendance logging/export and grading functionality for the lecturer tools.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your MongoDB connection string

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

## API Endpoints

### Attendance Endpoints

#### GET `/api/attendance/logs`
Retrieve attendance logs with filtering and pagination.

**Query Parameters:**
- `courseCode` (optional): Filter by course code
- `sessionCode` (optional): Filter by session code
- `date` (optional): Filter by date (YYYY-MM-DD format)
- `filterType` (optional): 'day', 'week', or 'month' (default: 'day')
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 25, max: 200)

**Response:**
```json
{
  "ok": true,
  "logs": [
    {
      "timestamp": "2023-12-01T10:30:00Z",
      "studentId": "12345",
      "centre": "Computer Science",
      "courseCode": "CS101",
      "courseName": "Introduction to Programming",
      "lecturer": "Dr. Smith",
      "sessionCode": "CS101-001"
    }
  ],
  "totalPages": 5
}
```

#### GET `/api/attendance/export`
Export attendance logs as CSV file.

**Query Parameters:** Same as `/logs` endpoint

**Response:** CSV file with headers: Time, Student ID, Centre, Course Code, Course Name, Lecturer, Session Code

### Grades Endpoints

#### GET `/api/grades/enrolled?courseCode=CS101`
Get list of enrolled students for a course.

**Response:**
```json
{
  "ok": true,
  "students": [
    {
      "id": "objectid",
      "studentId": "12345",
      "name": "John Doe",
      "currentGrade": "A"
    }
  ]
}
```

#### POST `/api/grades/bulk-update`
Update grades for multiple students.

**Request Body:**
```json
{
  "courseCode": "CS101",
  "updates": [
    {
      "studentId": "12345",
      "grade": "A"
    }
  ]
}
```

**Response:**
```json
{
  "ok": true
}
```

#### GET `/api/grades/history?courseCode=CS101`
Get grade change history for a course.

**Response:**
```json
{
  "ok": true,
  "history": [
    {
      "id": "unique-id",
      "changedAt": "2023-12-01T10:30:00Z",
      "studentId": "12345",
      "courseCode": "CS101",
      "oldGrade": "B",
      "newGrade": "A",
      "changedBy": "lecturer@example.com"
    }
  ]
}
```

## Testing

Run the test suite:
```bash
npm test          # Test database operations
npm run test:api  # Test HTTP endpoints (requires server running)
```

## Database Models

### AttendanceRecord
- `session`: Reference to AttendanceSession
- `student`: Reference to Student
- `scannedAt`: When attendance was recorded
- Indexes: `{ session: 1, scannedAt: -1, createdAt: -1 }`

### AttendanceSession  
- `courseCode`: Course identifier
- `sessionCode`: Session identifier
- `courseName`: Display name for course
- `lecturer`: Lecturer name
- `date`: Session date
- Indexes: `{ courseCode: 1 }`, `{ sessionCode: 1 }`

### Grade
- `courseCode`: Course identifier
- `student`: Reference to Student
- `studentId`: Student identifier
- `currentGrade`: Current grade value
- `history`: Array of grade changes
- Indexes: `{ courseCode: 1, studentId: 1 }` (unique)

## Notes

- Collection names in MongoDB are auto-pluralized by Mongoose (e.g., `attendancesessions`, `students`)
- CSV export is limited to 100,000 records
- All endpoints return consistent `{ ok: boolean, ... }` response format
- Grade history is sorted newest first