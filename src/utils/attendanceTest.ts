/**
 * Attendance Flow Test Utility
 * Use this to diagnose attendance linking issues
 */

import { apiFetch } from './api';
// import { getToken } from './auth'; // Unused for now

export async function testAttendanceFlow() {
  console.log('===== ATTENDANCE FLOW TEST =====');
  
  try {
    // Step 1: Get lecturer info
    console.log('\nStep 1: Getting lecturer info...');
    const userData = await apiFetch('/api/auth/me-enhanced', { 
      method: 'GET', 
      role: 'lecturer' 
    });
    
    const lecturerId = userData?.user?.id || userData?.user?._id || userData?.user?.staffId;
    console.log('Lecturer ID:', lecturerId);
    console.log('Lecturer Name:', userData?.user?.name);
    
    if (!lecturerId) {
      console.error('No lecturer ID found!');
      return;
    }
    
    // Step 2: Check for active sessions
    console.log('\nStep 2: Checking for sessions...');
    try {
      const sessions = await apiFetch('/api/attendance-sessions', {
        method: 'GET',
        role: 'lecturer'
      });
      console.log('Sessions response:', sessions);
    } catch (e) {
      console.log('Could not fetch sessions:', e);
    }
    
    // Step 3: Get attendance records
    console.log('\nStep 3: Fetching attendance records...');
    const attendanceData = await apiFetch(`/api/attendance/lecturer/${lecturerId}`, {
      method: 'GET',
      role: 'lecturer'
    });
    
    console.log('Attendance response:', attendanceData);
    console.log('Number of records:', attendanceData?.records?.length || 0);
    
    if (attendanceData?.records?.length > 0) {
      console.log('\nSample record:');
      console.log(JSON.stringify(attendanceData.records[0], null, 2));
      
      // Check if records have lecturer ID
      const firstRecord = attendanceData.records[0];
      if (firstRecord.lecturerId || firstRecord.lecturer) {
        console.log('Records have lecturer ID field');
      } else {
        console.error('Records are MISSING lecturer ID field!');
        console.error('This is why attendance doesn\'t appear!');
      }
    } else {
      console.log('No attendance records found');
      console.log('Either no students have checked in, or records are not linked to this lecturer ID');
    }
    
    // Step 4: Try to fetch ALL attendance (for debugging)
    console.log('\nStep 4: Checking if ANY attendance records exist...');
    try {
      const allAttendance = await apiFetch('/api/attendance', {
        method: 'GET',
        role: 'lecturer'
      });
      console.log('All attendance response:', allAttendance);
    } catch (e) {
      console.log('Could not fetch all attendance (endpoint may not exist)');
    }
    
    console.log('\n===== TEST COMPLETE =====');
    console.log('\nSummary:');
    console.log(`- Lecturer ID: ${lecturerId}`);
    console.log(`- Records found: ${attendanceData?.records?.length || 0}`);
    
    if (attendanceData?.records?.length === 0) {
      console.log('\nPossible issues:');
      console.log('1. No students have checked in yet');
      console.log('2. Backend is not linking attendance to lecturer ID');
      console.log('3. Lecturer ID mismatch between session and retrieval');
      console.log('\nSolution: Check BACKEND_FIX_REQUIRED.md');
    }
    
    return {
      lecturerId,
      recordCount: attendanceData?.records?.length || 0,
      records: attendanceData?.records || []
    };
    
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}

// Export for use in console
if (typeof window !== 'undefined') {
  (window as any).testAttendanceFlow = testAttendanceFlow;
}
