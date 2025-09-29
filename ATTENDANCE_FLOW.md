# Student Attendance System Flow

## How the QR Code Attendance System Works

### 1. **Lecturer Generates Session**
- Lecturer logs in and goes to Generate Session page
- Sets course code and expiry time
- Clicks "Generate QR Code"
- System creates a unique session with:
  - Session Code (e.g., "ABC123")
  - Course Code
  - Lecturer ID
  - Expiry timestamp
  - QR code containing the session code

### 2. **Student Scans QR Code**
When a student scans the QR code or enters the session code manually:

**Frontend (Student App):**
```javascript
// Student scans QR code or enters session code
const sessionCode = "ABC123"; // From QR scan or manual entry
const studentData = {
  sessionCode: sessionCode,
  studentId: "1234567",
  timestamp: new Date().toISOString()
};

// Send attendance request to backend
fetch('/api/attendance/mark', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(studentData)
});
```

**Backend API Endpoint:**
```javascript
// POST /api/attendance/mark
{
  "sessionCode": "ABC123",
  "studentId": "1234567", 
  "timestamp": "2025-01-26T10:30:00Z"
}

// Backend validates:
// 1. Session exists and is not expired
// 2. Student exists in system
// 3. Student hasn't already marked attendance for this session
// 4. Records attendance in database
```

### 3. **Real-Time Updates**
- Backend stores attendance record
- Lecturer's attendance page polls for updates every 10 seconds
- New attendance appears in real-time table

### 4. **Database Schema**

**Sessions Table:**
```sql
CREATE TABLE attendance_sessions (
  id VARCHAR PRIMARY KEY,
  session_code VARCHAR UNIQUE,
  lecturer_id VARCHAR,
  course_code VARCHAR,
  expires_at TIMESTAMP,
  created_at TIMESTAMP
);
```

**Attendance Records Table:**
```sql
CREATE TABLE attendance_records (
  id VARCHAR PRIMARY KEY,
  session_id VARCHAR,
  student_id VARCHAR,
  student_name VARCHAR,
  centre VARCHAR,
  timestamp TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES attendance_sessions(id)
);
```

### 5. **Required Backend Endpoints**

1. **Create Session** (Already exists)
   - `POST /api/attendance-sessions`

2. **Mark Attendance** (Needs to be created)
   - `POST /api/attendance/mark`
   - Validates session and records attendance

3. **Get Attendance Records** (Needs to be created)
   - `GET /api/attendance/lecturer/{lecturerId}`
   - Returns all attendance for lecturer's active sessions

4. **Validate Session** (Needs to be created)
   - `GET /api/attendance/session/{sessionCode}`
   - Checks if session is valid and not expired

### 6. **Student Mobile App Integration**

Students would use a mobile app or web interface with:
- QR code scanner (using device camera)
- Manual session code entry
- Attendance history
- Real-time feedback on successful attendance marking

### 7. **Security Considerations**

- Session codes expire automatically
- One attendance per student per session
- Geolocation validation (optional)
- Rate limiting to prevent spam
- Encrypted QR codes (optional)

## Current Implementation Status

✅ **Completed:**
- Lecturer session generation
- QR code display with timer
- Session persistence across page navigation
- Attendance logs UI (with mock data)

🔄 **Needs Backend Support:**
- Student attendance marking endpoint
- Real attendance data retrieval
- Session validation
- Student profile integration

📱 **Future Enhancements:**
- Student mobile app
- Geolocation verification
- Attendance analytics
- Export functionality