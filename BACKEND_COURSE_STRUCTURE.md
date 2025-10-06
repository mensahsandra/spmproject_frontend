# Backend Course Structure Implementation

## Current Issue
The frontend is receiving course data but not in the expected format for specific courses.

## Backend Changes Needed

### 1. Update Lecturer Profile Endpoint

**Current Response:**
```javascript
{
  success: true,
  lecturer: {
    courses: ["BSc. Information Technology (BIT)", "BSc. Computer Science (BCS)"]
  }
}
```

**Updated Response:**
```javascript
{
  success: true,
  lecturer: {
    programs: [
      {
        code: "BIT",
        name: "BSc. Information Technology",
        courses: [
          { code: "BIT364", name: "Web Development", semester: "1" },
          { code: "BIT367", name: "Network Security", semester: "2" },
          { code: "BIT301", name: "Database Management", semester: "1" },
          { code: "ENT201", name: "Entrepreneurship", semester: "2" },
          { code: "ACC101", name: "Financial Accounting", semester: "1" },
          { code: "MGT205", name: "Project Management", semester: "2" }
        ]
      }
    ]
  }
}
```

### 2. Database Schema Update

**Add Courses Collection:**
```javascript
// courses collection
{
  _id: ObjectId("..."),
  code: "BIT364",
  name: "Web Development",
  programCode: "BIT",
  programName: "BSc. Information Technology",
  semester: "1",
  credits: 3,
  prerequisites: ["BIT301"],
  active: true
}
```

**Update Lecturer Schema:**
```javascript
// lecturers collection
{
  email: "prof.akua@knust.edu.gh",
  name: "Prof. Akua Mensah",
  assignedCourses: [
    "BIT364", "BIT367", "BIT301", "ENT201"
  ]
}
```

### 3. API Endpoint Implementation

```javascript
// GET /api/auth/lecturer/profile
app.get('/api/auth/lecturer/profile', authenticateLecturer, async (req, res) => {
  try {
    const lecturer = await Lecturer.findById(req.user.id);
    
    // Get assigned courses with full details
    const assignedCourses = await Course.find({
      code: { $in: lecturer.assignedCourses }
    });
    
    // Group courses by program
    const programs = {};
    assignedCourses.forEach(course => {
      if (!programs[course.programCode]) {
        programs[course.programCode] = {
          code: course.programCode,
          name: course.programName,
          courses: []
        };
      }
      programs[course.programCode].courses.push({
        code: course.code,
        name: course.name,
        semester: course.semester
      });
    });
    
    res.json({
      success: true,
      lecturer: {
        id: lecturer._id,
        name: lecturer.name,
        email: lecturer.email,
        programs: Object.values(programs)
      }
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
```

### 4. Sample Data Insert Script

```javascript
// Insert sample courses
const sampleCourses = [
  { code: "BIT364", name: "Web Development", programCode: "BIT", programName: "BSc. Information Technology", semester: "1" },
  { code: "BIT367", name: "Network Security", programCode: "BIT", programName: "BSc. Information Technology", semester: "2" },
  { code: "BIT301", name: "Database Management", programCode: "BIT", programName: "BSc. Information Technology", semester: "1" },
  { code: "ENT201", name: "Entrepreneurship", programCode: "BIT", programName: "BSc. Information Technology", semester: "2" },
  { code: "ACC101", name: "Financial Accounting", programCode: "BIT", programName: "BSc. Information Technology", semester: "1" },
  { code: "MGT205", name: "Project Management", programCode: "BIT", programName: "BSc. Information Technology", semester: "2" }
];

await Course.insertMany(sampleCourses);

// Update lecturer with assigned courses
await Lecturer.updateOne(
  { email: "prof.akua@knust.edu.gh" },
  { $set: { assignedCourses: ["BIT364", "BIT367", "BIT301", "ENT201"] } }
);
```