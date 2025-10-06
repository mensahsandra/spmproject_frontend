# Course Hierarchy Design for Academic System

## Current Issue
- Lecturers are assigned to broad programs (e.g., "Information Technology")
- But they actually teach specific courses within those programs
- Need to show the relationship: Program → Specific Courses

## Proposed Solution

### 1. Database Structure
```javascript
// Lecturer Document
{
  email: "prof.akua@knust.edu.gh",
  name: "Prof. Akua Mensah",
  programs: [
    {
      programCode: "BIT",
      programName: "BSc. Information Technology",
      courses: [
        { code: "BIT364", name: "Web Development", semester: "1" },
        { code: "BIT367", name: "Network Security", semester: "2" },
        { code: "ENT201", name: "Entrepreneurship", semester: "1" }
      ]
    },
    {
      programCode: "BCS",
      programName: "BSc. Computer Science", 
      courses: [
        { code: "CS301", name: "Database Systems", semester: "1" },
        { code: "CS405", name: "Software Engineering", semester: "2" }
      ]
    }
  ]
}
```

### 2. UI Design Options

#### Option A: Grouped Dropdown
```
Select Course:
├── BSc. Information Technology
│   ├── BIT364 - Web Development
│   ├── BIT367 - Network Security
│   └── ENT201 - Entrepreneurship
└── BSc. Computer Science
    ├── CS301 - Database Systems
    └── CS405 - Software Engineering
```

#### Option B: Two-Step Selection
```
Step 1: Select Program
[BSc. Information Technology ▼]

Step 2: Select Course
[BIT364 - Web Development ▼]
```

#### Option C: Flat List with Program Context
```
Select Course:
├── BIT364 - Web Development (Information Technology)
├── BIT367 - Network Security (Information Technology)  
├── ENT201 - Entrepreneurship (Information Technology)
├── CS301 - Database Systems (Computer Science)
└── CS405 - Software Engineering (Computer Science)
```

### 3. Sample Course Data for Demo
```javascript
const sampleCourses = {
  "Information Technology": [
    "BIT364 - Web Development",
    "BIT367 - Network Security", 
    "BIT301 - Database Management",
    "ENT201 - Entrepreneurship",
    "ACC101 - Financial Accounting",
    "MGT205 - Project Management"
  ],
  "Computer Science": [
    "CS301 - Data Structures",
    "CS405 - Software Engineering",
    "CS501 - Artificial Intelligence", 
    "CS403 - Computer Networks",
    "MAT301 - Discrete Mathematics"
  ]
}
```

## Implementation Priority
1. **Quick Demo**: Add sample specific courses for current programs
2. **Full Implementation**: Update database structure and backend
3. **Advanced Features**: Course prerequisites, semester scheduling