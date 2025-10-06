// Quick setup utility to simulate backend profile data
// This bypasses the need for database updates for testing

export const setupKwabenaWithBIT = () => {
  // Simulate the profile data that would come from the backend
  const profileData = {
    success: true,
    lecturer: {
      id: 'lecturer_kwabena',
      name: 'Kwabena Lecturer',
      email: 'kwabena@knust.edu.gh',
      role: 'lecturer',
      staffId: 'STF123',
      courses: ['BIT']
    },
    data: {
      courses: ['BIT']
    }
  };

  // Store in localStorage (this is what UpdateGrades reads)
  localStorage.setItem('profile', JSON.stringify(profileData));
  
  // Also update the user data to ensure consistency
  const userData = {
    id: 'lecturer_kwabena',
    name: 'Kwabena Lecturer',
    email: 'kwabena@knust.edu.gh',
    role: 'lecturer',
    staffId: 'STF123',
    courses: ['BIT']
  };
  
  localStorage.setItem('user_lecturer', JSON.stringify(userData));
  
  console.log('✅ Kwabena profile setup complete with BIT course');
  return profileData;
};

export const checkCurrentSetup = () => {
  const profile = localStorage.getItem('profile');
  const user = localStorage.getItem('user_lecturer');
  
  console.log('Current profile:', profile ? JSON.parse(profile) : 'None');
  console.log('Current user:', user ? JSON.parse(user) : 'None');
  
  return {
    profile: profile ? JSON.parse(profile) : null,
    user: user ? JSON.parse(user) : null
  };
};