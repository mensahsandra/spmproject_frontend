/**
 * Token Test Utility
 * Run this in the browser console to diagnose token issues
 */

export function testTokenStorage() {
  console.log('=== TOKEN STORAGE TEST ===');
  
  // Check localStorage
  console.log('\n📦 LocalStorage:');
  const localStorageKeys = Object.keys(localStorage);
  console.log('All keys:', localStorageKeys);
  
  const tokenKeys = localStorageKeys.filter(k => k.includes('token'));
  console.log('Token keys:', tokenKeys);
  
  tokenKeys.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`  ${key}:`, value ? `${value.substring(0, 30)}...` : 'null');
  });
  
  // Check sessionStorage
  console.log('\n📦 SessionStorage:');
  const sessionStorageKeys = Object.keys(sessionStorage);
  console.log('All keys:', sessionStorageKeys);
  
  const activeRole = sessionStorage.getItem('activeRole');
  console.log('Active role:', activeRole);
  
  // Check specific tokens
  console.log('\n🔑 Specific Token Checks:');
  console.log('token_lecturer:', localStorage.getItem('token_lecturer') ? '✅ EXISTS' : '❌ MISSING');
  console.log('token_student:', localStorage.getItem('token_student') ? '✅ EXISTS' : '❌ MISSING');
  console.log('token (legacy):', localStorage.getItem('token') ? '✅ EXISTS' : '❌ MISSING');
  
  // Check user data
  console.log('\n👤 User Data:');
  const userLecturer = localStorage.getItem('user_lecturer');
  const userStudent = localStorage.getItem('user_student');
  const userLegacy = localStorage.getItem('user');
  
  if (userLecturer) {
    try {
      const parsed = JSON.parse(userLecturer);
      console.log('user_lecturer:', parsed);
    } catch (e) {
      console.log('user_lecturer: Invalid JSON');
    }
  } else {
    console.log('user_lecturer: ❌ MISSING');
  }
  
  if (userStudent) {
    try {
      const parsed = JSON.parse(userStudent);
      console.log('user_student:', parsed);
    } catch (e) {
      console.log('user_student: Invalid JSON');
    }
  } else {
    console.log('user_student: ❌ MISSING');
  }
  
  if (userLegacy) {
    try {
      const parsed = JSON.parse(userLegacy);
      console.log('user (legacy):', parsed);
    } catch (e) {
      console.log('user (legacy): Invalid JSON');
    }
  } else {
    console.log('user (legacy): ❌ MISSING');
  }
  
  // Test token retrieval
  console.log('\n🔍 Token Retrieval Test:');
  try {
    const { getToken } = require('./auth');
    console.log('getToken("lecturer"):', getToken('lecturer') ? '✅ SUCCESS' : '❌ FAILED');
    console.log('getToken("student"):', getToken('student') ? '✅ SUCCESS' : '❌ FAILED');
    console.log('getToken():', getToken() ? '✅ SUCCESS' : '❌ FAILED');
  } catch (e) {
    console.log('Could not test getToken function:', e);
  }
  
  console.log('\n=== END TEST ===');
}

// Make it available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testTokenStorage = testTokenStorage;
}

/**
 * Quick fix function to manually set tokens
 * Use this if you have a valid token but it's not stored correctly
 */
export function fixTokenStorage(token: string, role: 'lecturer' | 'student') {
  console.log(`🔧 Fixing token storage for ${role}...`);
  
  localStorage.setItem(`token_${role}`, token);
  sessionStorage.setItem('activeRole', role);
  
  console.log('✅ Token stored');
  console.log('✅ Active role set');
  console.log('\nVerifying...');
  
  const storedToken = localStorage.getItem(`token_${role}`);
  const storedRole = sessionStorage.getItem('activeRole');
  
  if (storedToken === token && storedRole === role) {
    console.log('✅ Verification successful!');
    return true;
  } else {
    console.log('❌ Verification failed!');
    return false;
  }
}

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).fixTokenStorage = fixTokenStorage;
}

/**
 * Clear all authentication data
 */
export function clearAllAuth() {
  console.log('🧹 Clearing all authentication data...');
  
  const keysToRemove = [
    'token', 'token_lecturer', 'token_student',
    'user', 'user_lecturer', 'user_student',
    'refreshToken', 'refreshToken_lecturer', 'refreshToken_student',
    'profile'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`  Removed: ${key}`);
  });
  
  sessionStorage.removeItem('activeRole');
  console.log('  Removed: activeRole (session)');
  
  console.log('✅ All authentication data cleared');
  console.log('Please log in again');
}

// Make it available globally
if (typeof window !== 'undefined') {
  (window as any).clearAllAuth = clearAllAuth;
}

console.log('💡 Token test utilities loaded!');
console.log('Available functions:');
console.log('  - window.testTokenStorage() - Test current token storage');
console.log('  - window.fixTokenStorage(token, role) - Manually set token');
console.log('  - window.clearAllAuth() - Clear all auth data');