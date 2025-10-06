// Backend endpoint to add to your Express.js server
// Add this to your backend at https://spmproject-backend.vercel.app

// Route: POST /api/admin/update-lecturer-courses
app.post('/api/admin/update-lecturer-courses', async (req, res) => {
  try {
    const { email, courses } = req.body;
    
    if (!email || !courses) {
      return res.status(400).json({
        success: false,
        message: 'Email and courses are required'
      });
    }
    
    // Update lecturer in database
    const updateResult = await db.collection('lecturers').updateOne(
      { email: email },
      { $set: { courses: courses } }
    );
    
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lecturer not found'
      });
    }
    
    // Fetch updated lecturer
    const updatedLecturer = await db.collection('lecturers').findOne(
      { email: email },
      { projection: { password: 0 } }
    );
    
    res.json({
      success: true,
      message: 'Lecturer courses updated successfully',
      lecturer: updatedLecturer
    });
    
  } catch (error) {
    console.error('Error updating lecturer courses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Alternative: Quick update for Kwabena specifically
app.post('/api/admin/update-kwabena-profile', async (req, res) => {
  try {
    // Direct update for Kwabena
    const updateResult = await db.collection('lecturers').updateOne(
      { email: 'kwabena@knust.edu.gh' },
      { $set: { courses: ['BIT'] } }
    );
    
    if (updateResult.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kwabena not found in lecturers collection'
      });
    }
    
    const updatedLecturer = await db.collection('lecturers').findOne(
      { email: 'kwabena@knust.edu.gh' },
      { projection: { password: 0 } }
    );
    
    res.json({
      success: true,
      message: 'Kwabena\'s profile updated with BIT course',
      lecturer: updatedLecturer
    });
    
  } catch (error) {
    console.error('Error updating Kwabena\'s profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});