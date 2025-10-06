// MongoDB Update Script for Kwabena's Lecturer Profile
// Run these commands in MongoDB shell or MongoDB Compass

// Connect to your database
use your_database_name; // Replace with your actual database name

// Option 1: Update lecturer document to include BIT course
db.lecturers.updateOne(
  { email: "kwabena@knust.edu.gh" },
  { 
    $set: { 
      courses: ["BIT"] 
    }
  }
);

// Option 2: If courses field doesn't exist, add it
db.lecturers.updateOne(
  { email: "kwabena@knust.edu.gh" },
  { 
    $set: { 
      courses: ["BIT"],
      role: "lecturer" // Ensure role is set
    }
  },
  { upsert: false }
);

// Option 3: Add BIT to existing courses array (if courses already exist)
db.lecturers.updateOne(
  { email: "kwabena@knust.edu.gh" },
  { 
    $addToSet: { 
      courses: "BIT" 
    }
  }
);

// Verify the update
db.lecturers.findOne({ email: "kwabena@knust.edu.gh" });

// Optional: Ensure BIT course exists in courses collection
db.courses.updateOne(
  { code: "BIT" },
  { 
    $set: {
      code: "BIT",
      name: "BSc in Information Technology",
      description: "Bachelor of Science in Information Technology program",
      department: "Computer Science",
      credits: 120
    }
  },
  { upsert: true }
);

// Verify courses collection
db.courses.findOne({ code: "BIT" });

// Check all lecturers with their courses (for verification)
db.lecturers.find({}, { email: 1, name: 1, courses: 1, role: 1 }).pretty();