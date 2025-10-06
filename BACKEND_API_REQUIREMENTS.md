# Backend API Requirements for Quiz Creation and Bulk Grading

## New Endpoints Required

### 1. Quiz Creation Endpoint

**Endpoint:** `POST /api/quizzes/create`

**Headers:**
- `Authorization: Bearer <lecturer_token>`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
```javascript
{
  courseCode: string,        // Course identifier
  title: string,            // Quiz title (required)
  description: string,      // Quiz description (optional)
  startTime: string,        // ISO datetime string (optional)
  endTime: string,          // ISO datetime string (optional)
  restrictToAttendees: boolean, // true/false
  file?: File              // Optional file upload
}
```

**Response:**
```javascript
{
  ok: boolean,
  message: string,
  quiz?: {
    id: string,
    title: string,
    courseCode: string,
    createdAt: string,
    startTime?: string,
    endTime?: string,
    restrictToAttendees: boolean,
    fileUrl?: string
  }
}
```

**Functionality:**
- Create a new quiz for the specified course
- Store quiz metadata in database
- Handle optional file upload (store in file system/cloud storage)
- Send notifications to enrolled students (or only attendees if restricted)
- Return success/error response

---

### 2. Bulk Grade Assignment Endpoint

**Endpoint:** `POST /api/grades/bulk-assign`

**Headers:**
- `Authorization: Bearer <lecturer_token>`
- `Content-Type: application/json`

**Request Body:**
```javascript
{
  courseCode: string,       // Course identifier
  score: string,           // Grade to assign (A, B+, 85, etc.)
  target: 'all' | 'attendees' | 'quiz_submitters'  // Target group
}
```

**Response:**
```javascript
{
  ok: boolean,
  message: string,
  updated: number,         // Number of students updated
  students?: Array<{
    studentId: string,
    name: string,
    previousGrade?: string,
    newGrade: string
  }>
}
```

**Functionality:**
- Validate the grade format using existing grade validation
- Filter students based on target:
  - `all`: All enrolled students in the course
  - `attendees`: Only students who attended recent sessions
  - `quiz_submitters`: Only students who submitted quizzes
- Bulk update grades in database
- Return list of updated students

---

## Database Schema Updates

### Quiz Table (if not exists)
```sql
CREATE TABLE quizzes (
  id VARCHAR(255) PRIMARY KEY,
  course_code VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time DATETIME,
  end_time DATETIME,
  restrict_to_attendees BOOLEAN DEFAULT FALSE,
  file_url VARCHAR(500),
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Quiz Submissions Table (if not exists)
```sql
CREATE TABLE quiz_submissions (
  id VARCHAR(255) PRIMARY KEY,
  quiz_id VARCHAR(255) NOT NULL,
  student_id VARCHAR(255) NOT NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
  UNIQUE KEY unique_submission (quiz_id, student_id)
);
```

---

## Integration Notes

### Current Frontend Implementation
- Quiz creation uses FormData for file upload support
- Bulk grading integrates with existing grade validation
- Both features include success/error handling
- UI shows loading states during API calls

### Error Handling
Both endpoints should return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (validation errors)
- `401`: Unauthorized
- `403`: Forbidden (not lecturer for this course)
- `500`: Internal server error

### File Upload Considerations
- Support common file types: .pdf, .doc, .docx, .txt
- Implement file size limits (e.g., 10MB max)
- Store files securely with unique names
- Return accessible file URLs

### Notification System
For quiz creation, consider implementing:
- Email notifications to students
- In-app notifications
- SMS notifications (if available)
- Respect student notification preferences

---

## Testing Endpoints

### Quiz Creation Test
```bash
curl -X POST http://localhost:3000/api/quizzes/create \
  -H "Authorization: Bearer <lecturer_token>" \
  -F "courseCode=CS101" \
  -F "title=Midterm Quiz" \
  -F "description=Chapter 1-5 quiz" \
  -F "startTime=2024-12-15T10:00:00Z" \
  -F "endTime=2024-12-15T11:00:00Z" \
  -F "restrictToAttendees=true"
```

### Bulk Grade Assignment Test
```bash
curl -X POST http://localhost:3000/api/grades/bulk-assign \
  -H "Authorization: Bearer <lecturer_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "courseCode": "CS101",
    "score": "B+",
    "target": "attendees"
  }'
```