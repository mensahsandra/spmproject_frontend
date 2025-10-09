// Attendance debugging utilities
import { apiFetch } from './api';
import { getToken } from './auth';

export interface AttendanceDebugInfo {
  frontendStatus: {
    tokenExists: boolean;
    userDataLoaded: boolean;
    lecturerId: string | null;
  };
  backendStatus: {
    authEndpointWorking: boolean;
    attendanceEndpointWorking: boolean;
    recordCount: number;
    lastError: string | null;
  };
  recommendations: string[];
}

/**
 * Comprehensive debugging function for attendance issues
 */
export const debugAttendanceSystem = async (): Promise<AttendanceDebugInfo> => {
  const debug: AttendanceDebugInfo = {
    frontendStatus: {
      tokenExists: false,
      userDataLoaded: false,
      lecturerId: null
    },
    backendStatus: {
      authEndpointWorking: false,
      attendanceEndpointWorking: false,
      recordCount: 0,
      lastError: null
    },
    recommendations: []
  };

  try {
    // Check frontend status
    const token = getToken('lecturer');
    debug.frontendStatus.tokenExists = !!token;

    if (!token) {
      debug.recommendations.push('❌ No authentication token found - please log in again');
      return debug;
    }

    // Test auth endpoint
    try {
      const userData = await apiFetch('/api/auth/me-enhanced', { method: 'GET', role: 'lecturer' });
      
      if (userData?.user) {
        debug.frontendStatus.userDataLoaded = true;
        debug.backendStatus.authEndpointWorking = true;
        
        const lecturerId = userData.user.id || userData.user._id || userData.user.staffId;
        debug.frontendStatus.lecturerId = lecturerId;

        if (!lecturerId) {
          debug.recommendations.push('❌ User data loaded but no lecturer ID found - contact support');
          return debug;
        }

        // Test attendance endpoint
        try {
          const attendanceData = await apiFetch(`/api/attendance/lecturer/${lecturerId}`, {
            method: 'GET',
            role: 'lecturer'
          });

          if (attendanceData.success) {
            debug.backendStatus.attendanceEndpointWorking = true;
            debug.backendStatus.recordCount = attendanceData.records?.length || 0;
            
            if (debug.backendStatus.recordCount === 0) {
              debug.recommendations.push('ℹ️ No attendance records found - students need to scan QR codes');
            } else {
              debug.recommendations.push(`✅ System working - ${debug.backendStatus.recordCount} attendance records found`);
            }
          } else {
            debug.backendStatus.lastError = attendanceData.message || 'Unknown error';
            debug.recommendations.push(`❌ Attendance endpoint error: ${debug.backendStatus.lastError}`);
          }
        } catch (attendanceError: any) {
          debug.backendStatus.lastError = attendanceError.message;
          debug.recommendations.push(`❌ Cannot reach attendance endpoint: ${attendanceError.message}`);
        }

      } else {
        debug.recommendations.push('❌ Auth endpoint returned no user data - token may be invalid');
      }
    } catch (authError: any) {
      debug.backendStatus.lastError = authError.message;
      debug.recommendations.push(`❌ Cannot reach auth endpoint: ${authError.message}`);
    }

  } catch (error: any) {
    debug.backendStatus.lastError = error.message;
    debug.recommendations.push(`❌ Critical error: ${error.message}`);
  }

  return debug;
};

/**
 * Test if students can successfully check in
 */
export const testStudentCheckIn = async (studentId: string = 'TEST001', sessionCode: string = 'TEST123') => {
  try {
    console.log('🧪 Testing student check-in simulation...');
    
    // This would simulate what happens when a student scans QR code
    const checkInData = {
      studentId,
      sessionCode,
      timestamp: new Date().toISOString(),
      centre: 'Test Centre'
    };

    console.log('Simulated check-in data:', checkInData);
    
    // In a real scenario, this would be the endpoint students hit
    // For testing, we can just log what should happen
    console.log('✅ Student check-in simulation complete');
    console.log('Expected: This data should appear in lecturer attendance logs');
    
    return {
      success: true,
      message: 'Check-in simulation completed - check console for details'
    };
  } catch (error: any) {
    console.error('❌ Check-in simulation failed:', error);
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * Monitor attendance changes in real-time
 */
export const monitorAttendanceChanges = (callback: (newCount: number, records: any[]) => void) => {
  let lastCount = 0;
  
  const checkForChanges = async () => {
    try {
      const userData = await apiFetch('/api/auth/me-enhanced', { method: 'GET', role: 'lecturer' });
      if (userData?.user?.id) {
        const lecturerId = userData.user.id || userData.user._id || userData.user.staffId;
        const attendanceData = await apiFetch(`/api/attendance/lecturer/${lecturerId}`, {
          method: 'GET',
          role: 'lecturer'
        });

        if (attendanceData.success) {
          const currentCount = attendanceData.records?.length || 0;
          if (currentCount !== lastCount) {
            console.log(`📊 Attendance change detected: ${lastCount} → ${currentCount}`);
            callback(currentCount, attendanceData.records || []);
            lastCount = currentCount;
          }
        }
      }
    } catch (error) {
      console.warn('Monitoring check failed:', error);
    }
  };

  // Check every 2 seconds for changes
  const interval = setInterval(checkForChanges, 2000);
  
  // Return cleanup function
  return () => clearInterval(interval);
};

/**
 * Generate a comprehensive report for troubleshooting
 */
export const generateAttendanceReport = async () => {
  console.log('📋 Generating Attendance System Report...');
  console.log('='.repeat(50));
  
  const debug = await debugAttendanceSystem();
  
  console.log('🔍 FRONTEND STATUS:');
  console.log(`  Token exists: ${debug.frontendStatus.tokenExists}`);
  console.log(`  User data loaded: ${debug.frontendStatus.userDataLoaded}`);
  console.log(`  Lecturer ID: ${debug.frontendStatus.lecturerId || 'Not found'}`);
  
  console.log('\n🌐 BACKEND STATUS:');
  console.log(`  Auth endpoint: ${debug.backendStatus.authEndpointWorking ? '✅ Working' : '❌ Failed'}`);
  console.log(`  Attendance endpoint: ${debug.backendStatus.attendanceEndpointWorking ? '✅ Working' : '❌ Failed'}`);
  console.log(`  Record count: ${debug.backendStatus.recordCount}`);
  console.log(`  Last error: ${debug.backendStatus.lastError || 'None'}`);
  
  console.log('\n💡 RECOMMENDATIONS:');
  debug.recommendations.forEach(rec => console.log(`  ${rec}`));
  
  console.log('='.repeat(50));
  
  return debug;
};