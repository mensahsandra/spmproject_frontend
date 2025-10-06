# Backend API Endpoint to Update Kwabena's Profile

## Quick Update Endpoint

Create this endpoint in your backend to update Kwabena's profile with the BIT course:

### Endpoint: `POST /api/admin/update-kwabena-profile`

```javascript
// Add this to your backend routes (e.g., routes/admin.js or routes/auth.js)

app.post('/api/admin/update-kwabena-profile', async (req, res) => {
  try {
    // Update Kwabena's profile with BIT course
    const result = await Lecturer.updateOne(
      { email: 'kwabena@knust.edu.gh' },
      { 
        $set: { 
          courses: ['BIT'],
          role: 'lecturer'
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lecturer not found'
      });
    }

    // Fetch updated profile
    const updatedLecturer = await Lecturer.findOne(
      { email: 'kwabena@knust.edu.gh' },
      { password: 0 } // Exclude password
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      lecturer: updatedLecturer
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

### Test the endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/update-kwabena-profile \
  -H "Content-Type: application/json"
```

## Alternative: Direct Profile Update Endpoint

If you want a more flexible approach:

```javascript
app.put('/api/admin/lecturer/:email/courses', async (req, res) => {
  try {
    const { email } = req.params;
    const { courses } = req.body; // Array of course codes

    const result = await Lecturer.updateOne(
      { email: email },
      { $set: { courses: courses } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lecturer not found'
      });
    }

    const updatedLecturer = await Lecturer.findOne(
      { email: email },
      { password: 0 }
    );

    res.json({
      success: true,
      message: 'Courses updated successfully',
      lecturer: updatedLecturer
    });

  } catch (error) {
    console.error('Error updating courses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});
```

### Test with specific courses:

```bash
curl -X PUT http://localhost:3000/api/admin/lecturer/kwabena@knust.edu.gh/courses \
  -H "Content-Type: application/json" \
  -d '{"courses": ["BIT"]}'
```