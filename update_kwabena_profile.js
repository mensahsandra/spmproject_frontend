// Script to update Kwabena's profile with BIT course via backend API
// Run this script with: node update_kwabena_profile.js

import https from 'https';

const BACKEND_URL = 'https://spmproject-backend.vercel.app';

// Function to make HTTP requests
function makeRequest(url, options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({ status: res.statusCode, data: jsonBody });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

async function updateKwabenaProfile() {
  try {
    console.log('🔄 Attempting to update Kwabena\'s profile...');
    
    // First, let's try to login as Kwabena to get a token
    console.log('🔐 Attempting to login as Kwabena...');
    
    const loginData = JSON.stringify({
      email: 'kwabena@knust.edu.gh',
      password: 'your_password_here' // You'll need to provide the actual password
    });
    
    const loginOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js Script'
      }
    };
    
    // Try login first (you'll need to provide the password)
    console.log('⚠️  Note: You need to provide Kwabena\'s password in this script');
    console.log('⚠️  Or we can try a direct database update approach');
    
    // Alternative: Direct backend endpoint to update profile
    console.log('🔄 Trying direct profile update...');
    
    const updateData = JSON.stringify({
      email: 'kwabena@knust.edu.gh',
      courses: ['BIT']
    });
    
    const updateOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js Script'
      }
    };
    
    // Try the admin update endpoint (if it exists)
    try {
      const result = await makeRequest(
        `${BACKEND_URL}/api/admin/update-lecturer-courses`,
        updateOptions,
        updateData
      );
      
      console.log('📊 Update result:', result);
      
      if (result.status === 200 && result.data.success) {
        console.log('✅ Successfully updated Kwabena\'s profile with BIT course');
        console.log('📋 Updated profile:', JSON.stringify(result.data.lecturer, null, 2));
      } else {
        console.log('❌ Update failed:', result.data);
      }
      
    } catch (error) {
      console.log('⚠️  Direct update endpoint not available');
      console.log('💡 You need to update the database directly or create the backend endpoint');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Alternative function to create the MongoDB update command
function generateMongoCommand() {
  console.log('\n📋 MongoDB Commands to run manually:');
  console.log('=====================================');
  console.log('// Connect to your MongoDB Atlas database');
  console.log('use your_database_name; // Replace with your actual database name');
  console.log('');
  console.log('// Update Kwabena\'s profile');
  console.log('db.lecturers.updateOne(');
  console.log('  { email: "kwabena@knust.edu.gh" },');
  console.log('  { $set: { courses: ["BIT"] } }');
  console.log(');');
  console.log('');
  console.log('// Verify the update');
  console.log('db.lecturers.findOne({ email: "kwabena@knust.edu.gh" });');
  console.log('=====================================\n');
}

// Run the update
console.log('🚀 Starting Kwabena profile update process...');
updateKwabenaProfile().then(() => {
  console.log('\n💡 If the API update didn\'t work, use the MongoDB commands below:');
  generateMongoCommand();
});