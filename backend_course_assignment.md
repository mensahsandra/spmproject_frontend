# Backend Course Assignment Implementation

## Create API Endpoint for Course Assignment

### 1. Add Course Assignment Endpoint

**Endpoint:** `POST /api/admin/assign-course`

**Headers:**
- `Authorization: Bearer <admin_token>`
- `Content-Type: application/json`

**Request Body:**
```javascript
{
  lecturerEmail: "kwabena@knust.edu.gh",
  courseCode: "BIT",
  courseName: "BSc in Information Technology"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Course assigned successfully",
  lecturer: {
    id: "lecturer_id",
    email: "kwabena@knust.edu.gh",
    courses: ["BIT"]
  }
}
```

### 2. Backend Implementation Example (Node.js/Express)

```javascript
// routes/admin.js
app.post('/api/admin/assign-course', authenticateAdmin, async (req, res) => {
  try {
    const { lecturerEmail, courseCode, courseName } = req.body;
    
    // Find lecturer by email
    const lecturer = await Lecturer.findOne({ email: lecturerEmail });
    if (!lecturer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lecturer not found' 
      });
    }
    
    // Add course to lecturer's courses array (if not already present)
    if (!lecturer.courses.includes(courseCode)) {
      lecturer.courses.push(courseCode);
      await lecturer.save();
    }
    
    // Optionally, ensure course exists in courses table
    await Course.findOneAndUpdate(
      { code: courseCode },
      { code: courseCode, name: courseName },
      { upsert: true }
    );
    
    res.json({
      success: true,
      message: 'Course assigned successfully',
      lecturer: {
        id: lecturer._id,
        email: lecturer.email,
        courses: lecturer.courses
      }
    });
    
  } catch (error) {
    console.error('Error assigning course:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});
```

### 3. Database Schema Update

Ensure your lecturer schema includes courses:

```javascript
// models/Lecturer.js (Mongoose example)
const lecturerSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  staffId: { type: String, required: true },
  password: { type: String, required: true },
  courses: [{ type: String }], // Array of course codes
  role: { type: String, default: 'lecturer' },
  createdAt: { type: Date, default: Date.now }
});
```

### 4. Update Lecturer Profile Endpoint

Ensure `/api/auth/lecturer/profile` returns courses:

```javascript
// routes/auth.js
app.get('/api/auth/lecturer/profile', authenticateLecturer, async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      lecturer: {
        id: lecturer._id,
        name: lecturer.name,
        email: lecturer.email,
        staffId: lecturer.staffId,
        courses: lecturer.courses || [], // Ensure courses are included
        role: lecturer.role
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

## Quick Test Commands

### Using cURL to assign course:
```bash
curl -X POST http://localhost:3000/api/admin/assign-course \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "lecturerEmail": "kwabena@knust.edu.gh",
    "courseCode": "BIT",
    "courseName": "BSc in Information Technology"
  }'
```

### Using MongoDB directly:
```javascript
// MongoDB shell commands
use your_database_name;

// Update lecturer with courses
db.lecturers.updateOne(
  { email: "kwabena@knust.edu.gh" },
  { $set: { courses: ["BIT"] } }
);

// Verify update
db.lecturers.findOne({ email: "kwabena@knust.edu.gh" });
```