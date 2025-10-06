// Test setup utility for development/testing purposes
// This file helps set up test data for lecturer accounts

export const setupLecturerProfile = (email: string, courses: string[]) => {
  const profileData = {
    success: true,
    lecturer: {
      id: 'lecturer_' + email.split('@')[0],
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email: email,
      role: 'lecturer',
      staffId: 'STAFF_' + email.split('@')[0].toUpperCase(),
      courses: courses
    },
    data: {
      courses: courses
    }
  };

  // Store in localStorage for UpdateGrades component
  localStorage.setItem('profile', JSON.stringify(profileData));
  
  console.log('Lecturer profile set up:', profileData);
  return profileData;
};

export const setupKwabenaProfile = () => {
  return setupLecturerProfile('kwabena@knust.edu.gh', ['BIT']);
};

// Function to clear test profile
export const clearTestProfile = () => {
  localStorage.removeItem('profile');
  console.log('Test profile cleared');
};

// Function to check current profile
export const getCurrentProfile = () => {
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(profile) : null;
};