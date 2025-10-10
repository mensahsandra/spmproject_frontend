import { useEffect, useState } from 'react';
import { Users, Clock, MapPin, User, Book, UserCheck } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { getToken, getUser, getActiveRole } from '../../utils/auth';
import { generateAttendanceReport } from '../../utils/attendanceDebug';
import { useNotifications } from '../../context/NotificationContext';



type AttendanceRecord = {
  _id: string;
  studentId: string;
  studentName: string;
  centre: string;
  timestamp: string;
  sessionCode: string;
  courseCode: string;
};

type SessionInfo = {
  lecturer: string;
  courseCode: string;
  classRepresentative: string;
  totalAttendees: number;
};

export default function AttendanceLogs() {
  const { addNotification } = useNotifications();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRecordCount, setLastRecordCount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Request notification permission on mount
    if (Notification.permission === 'default') {
      console.log('📱 Requesting notification permission on mount...');
      Notification.requestPermission().then(permission => {
        console.log('📱 Notification permission:', permission);
      });
    }

    fetchAttendanceData();

    // Set up polling to refresh data every 10 seconds
    const interval = setInterval(fetchAttendanceData, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []); // Remove dependency to prevent infinite re-renders

  // Separate useEffect for real-time updates
  useEffect(() => {
    const checkForUpdates = async () => {
      setIsChecking(true);
      try {
        // Skip check if we don't have initial data yet
        if (lastRecordCount === 0 && attendanceRecords.length === 0) {
          console.log('⏭️ Skipping real-time check - waiting for initial data');
          return;
        }

        const userData = await apiFetch('/api/auth/me-enhanced', { method: 'GET', role: 'lecturer' });
        
        if (!userData?.user) {
          console.warn('⚠️ No user data available for real-time check');
          return;
        }
        
        const lecturerId = userData.user.id || userData.user._id || userData.user.lecturerId || userData.user.staffId;
        
        if (!lecturerId) {
          console.warn('⚠️ No lecturer ID found for real-time check');
          return;
        }

        console.log('🔍 Real-time check - Lecturer ID:', lecturerId);

        // Fetch latest attendance data without showing loading state
        const attendanceData = await apiFetch(`/api/attendance/lecturer/${lecturerId}`, {
          method: 'GET',
          role: 'lecturer'
        });

        if (attendanceData.success) {
          const newRecords = attendanceData.records || [];
          console.log(`🔍 Real-time check - Records: ${newRecords.length}, Last count: ${lastRecordCount}`);

          // Check if there are new records (skip initial load)
          if (newRecords.length > lastRecordCount && lastRecordCount > 0) {
            console.log(`🔔 NEW ATTENDANCE DETECTED! ${newRecords.length - lastRecordCount} new students`);

            // Show notifications for new students (only the new ones at the beginning of array)
            const newStudents = newRecords.slice(0, newRecords.length - lastRecordCount);
            newStudents.forEach((record: AttendanceRecord) => {
              console.log(`📢 Showing notification for: ${record.studentName}`);
              // Use the notification context instead of the old function
              addNotification({
                type: 'attendance',
                title: '🎓 New Student Check-in',
                message: `${record.studentName} just checked in at ${new Date(record.timestamp).toLocaleTimeString()}`,
                data: record
              });
            });

            // Update the records and session info
            setAttendanceRecords(newRecords);
            setSessionInfo(prev => prev ? {
              ...prev,
              totalAttendees: newRecords.length
            } : null);

            setLastRecordCount(newRecords.length);
          } else if (newRecords.length < lastRecordCount) {
            // Handle case where records might have been reset
            console.log('🔄 Record count decreased, updating...');
            setAttendanceRecords(newRecords);
            setLastRecordCount(newRecords.length);
          }
        }
      } catch (error: any) {
        console.error('❌ Real-time update check failed:', error);
        console.error('❌ Error details:', {
          message: error?.message,
          name: error?.name,
          stack: error?.stack
        });
        // Don't stop polling on error, just log it
      } finally {
        setIsChecking(false);
      }
    };

    // Start checking for updates every 2 seconds
    const updateInterval = setInterval(checkForUpdates, 2000);

    return () => {
      clearInterval(updateInterval);
    };
  }, [lastRecordCount, attendanceRecords.length, addNotification]); // Dependencies for comparison

  const fetchAttendanceData = async () => {
    setLoading(true);

    try {
      const token = getToken('lecturer');
      console.log('🔍 Debug - Token retrieved:', token ? 'Token exists' : 'No token found');

      if (!token) {
        setError('Please log in as a lecturer to view attendance.');
        setLoading(false);
        return;
      }

      // First, get current user data using the enhanced endpoint
      const userData = await apiFetch('/api/auth/me-enhanced', {
        method: 'GET',
        role: 'lecturer'
      });

      console.log('🔍 Debug - User data from enhanced endpoint:', userData);

      if (!userData?.user) {
        setError('Failed to get user information. Please log in again.');
        setLoading(false);
        return;
      }

      const user = userData.user;

      // Extract lecturer ID - try multiple field names as backend suggested
      const lecturerId = user.id || user._id || user.lecturerId || user.staffId;
      console.log('🔍 Debug - Lecturer ID extracted:', lecturerId);

      if (!lecturerId) {
        setError('Invalid user data: No lecturer ID found. Please contact support.');
        setLoading(false);
        return;
      }

      // Get lecturer name with honorific if available
      const lecturerName = user.fullName ||
        (user.honorific ? `${user.honorific} ${user.name}` : user.name) ||
        'Current Lecturer';

      // Get course information
      const courseInfo = user.courses && user.courses.length > 0
        ? `${user.courses[0].code || user.courses[0]} - ${user.courses[0].name || 'Course'}`
        : user.course || 'No Active Course';

      console.log('🔍 Debug - Lecturer name:', lecturerName);
      console.log('🔍 Debug - Course info:', courseInfo);

      // Fetch attendance records from backend
      try {
        console.log('🔍 [ATTENDANCE-LOGS] Fetching attendance for lecturer ID:', lecturerId);
        console.log('🔍 [ATTENDANCE-LOGS] API endpoint:', `/api/attendance/lecturer/${lecturerId}`);
        
        const attendanceData = await apiFetch(`/api/attendance/lecturer/${lecturerId}`, {
          method: 'GET',
          role: 'lecturer'
        });

        console.log('✅ [ATTENDANCE-LOGS] Backend response:', attendanceData);
        console.log('✅ [ATTENDANCE-LOGS] Number of records:', attendanceData.records?.length || 0);

        if (attendanceData.success) {
          const records = attendanceData.records || [];
          setAttendanceRecords(records);

          // Use backend session info if available, otherwise use user data
          setSessionInfo({
            lecturer: attendanceData.lecturerName || lecturerName,
            courseCode: attendanceData.course || courseInfo,
            classRepresentative: attendanceData.classRep || 'To be assigned',
            totalAttendees: attendanceData.totalAttendees || records.length
          });

          setError(null);
          console.log('✅ Successfully loaded attendance data:', records.length, 'records');

          // Initialize the record count for real-time tracking
          setLastRecordCount(records.length);

          return;
        } else {
          throw new Error(attendanceData.message || 'Failed to fetch attendance data');
        }
      } catch (apiError: any) {
        console.warn('⚠️ Attendance API error:', apiError);

        // Show user info but indicate no attendance data
        setSessionInfo({
          lecturer: lecturerName,
          courseCode: courseInfo,
          classRepresentative: 'To be assigned',
          totalAttendees: 0
        });

        setAttendanceRecords([]);
        setError(`No attendance session active. ${apiError.message || 'Generate a session code for students to scan.'}`);
      }

    } catch (err: any) {
      console.error('❌ Critical error in fetchAttendanceData:', err);

      // Try to get basic user info as fallback
      const currentUser = getUser();
      const fallbackName = currentUser?.name || 'Current Lecturer';

      setSessionInfo({
        lecturer: fallbackName,
        courseCode: 'Unable to load course info',
        classRepresentative: 'N/A',
        totalAttendees: 0
      });

      setAttendanceRecords([]);
      setError(`Connection error: ${err.message || 'Please check your internet connection and try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading attendance data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
      {/* Session Header */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-4">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="mb-3 fw-bold text-primary d-flex align-items-center gap-2">
                <Users size={24} /> Attendance Logs
              </h3>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <User size={16} className="text-success" />
                    <span className="fw-semibold">Lecturer:</span>
                    <span>{sessionInfo?.lecturer}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <Book size={16} className="text-success" />
                    <span className="fw-semibold">Course:</span>
                    <span>{sessionInfo?.courseCode}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <UserCheck size={16} className="text-success" />
                    <span className="fw-semibold">Class Rep:</span>
                    <span>{sessionInfo?.classRepresentative}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <Users size={16} className="text-success" />
                    <span className="fw-semibold">Total Attendees:</span>
                    <span className="badge bg-success">{sessionInfo?.totalAttendees}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <div className="text-muted">
                <small>Last updated: {new Date().toLocaleTimeString()}</small>
              </div>
              <button
                onClick={fetchAttendanceData}
                className={`btn ${loading ? 'btn-primary' : 'btn-outline-primary'} btn-sm mt-2`}
                disabled={loading}
                style={{ minWidth: '120px' }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="me-1">
                      <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
                    </svg>
                    Refresh Data
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {error && (
        <div className="alert alert-info mb-4">
          <strong>Status:</strong> {error}
        </div>
      )}

      {/* Debug Panel - Only show in development */}
      {import.meta.env.DEV && (
        <div className="card border-warning mb-4">
          <div className="card-body">
            <details>
              <summary className="fw-bold text-warning" style={{ cursor: 'pointer' }}>
                🔧 Debug Information
              </summary>
              <div className="mt-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6>Authentication Status:</h6>
                    <ul className="list-unstyled small">
                      <li>✅ Token exists: {getToken('lecturer') ? 'Yes' : 'No'}</li>
                      <li>✅ Active role: {getActiveRole() || 'None'}</li>
                      <li>✅ User data: {getUser()?.name || 'Not loaded'}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>Backend Connection:</h6>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={async () => {
                        console.log('🧪 Starting comprehensive backend test...');

                        try {
                          // Test 1: Check if we can reach the backend
                          console.log('Test 1: Basic connectivity...');
                          const response = await fetch('https://spmproject-backend.vercel.app/api/auth/me-enhanced', {
                            method: 'GET',
                            headers: {
                              'Authorization': `Bearer ${getToken('lecturer')}`,
                              'Content-Type': 'application/json'
                            }
                          });

                          console.log('Response status:', response.status);
                          console.log('Response headers:', Object.fromEntries(response.headers.entries()));

                          const data = await response.json();
                          console.log('Response data:', data);

                          if (response.ok && data.user) {
                            console.log('✅ Backend connection successful!');
                            console.log('User data:', data.user);

                            // Test 2: Try attendance endpoint
                            const lecturerId = data.user.id || data.user._id || data.user.staffId;
                            if (lecturerId) {
                              console.log('Test 2: Attendance endpoint...');
                              const attendanceResponse = await fetch(`https://spmproject-backend.vercel.app/api/attendance/lecturer/${lecturerId}`, {
                                method: 'GET',
                                headers: {
                                  'Authorization': `Bearer ${getToken('lecturer')}`,
                                  'Content-Type': 'application/json'
                                }
                              });

                              const attendanceData = await attendanceResponse.json();
                              console.log('Attendance response:', attendanceData);

                              alert(`✅ Backend tests successful!\n\nUser: ${data.user.name}\nLecturer ID: ${lecturerId}\nAttendance records: ${attendanceData.records?.length || 0}`);
                            } else {
                              alert('⚠️ User data received but no lecturer ID found');
                            }
                          } else {
                            throw new Error(`Backend returned error: ${data.message || 'Unknown error'}`);
                          }
                        } catch (error: any) {
                          console.error('❌ Backend test failed:', error);
                          alert(`❌ Backend test failed!\n\nError: ${error.message}\n\nCheck console for full details.`);
                        }
                      }}
                    >
                      Test Backend
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => {
                        localStorage.clear();
                        sessionStorage.clear();
                        alert('Cache cleared! Please log in again.');
                        window.location.href = '/lecturer-login';
                      }}
                    >
                      Clear Cache
                    </button>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={async () => {
                        console.log('🧪 Running comprehensive attendance system diagnosis...');
                        const report = await generateAttendanceReport();

                        const summary = `
ATTENDANCE SYSTEM DIAGNOSIS:

Frontend Status:
• Token: ${report.frontendStatus.tokenExists ? '✅' : '❌'}
• User Data: ${report.frontendStatus.userDataLoaded ? '✅' : '❌'}  
• Lecturer ID: ${report.frontendStatus.lecturerId || 'Not found'}

Backend Status:
• Auth Endpoint: ${report.backendStatus.authEndpointWorking ? '✅' : '❌'}
• Attendance Endpoint: ${report.backendStatus.attendanceEndpointWorking ? '✅' : '❌'}
• Records Found: ${report.backendStatus.recordCount}

Current State:
• Frontend Records: ${attendanceRecords.length}
• Tracked Count: ${lastRecordCount}

Check console for detailed report and recommendations.
                        `;

                        alert(summary);
                      }}
                    >
                      Full Diagnosis
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={async () => {
                        console.log('🔍 MANUAL ATTENDANCE CHECK - Forcing immediate update...');
                        
                        try {
                          const userData = await apiFetch('/api/auth/me-enhanced', { method: 'GET', role: 'lecturer' });
                          if (userData?.user?.id) {
                            const lecturerId = userData.user.id || userData.user._id || userData.user.staffId;
                            console.log('Lecturer ID for manual check:', lecturerId);
                            
                            const attendanceData = await apiFetch(`/api/attendance/lecturer/${lecturerId}`, {
                              method: 'GET',
                              role: 'lecturer'
                            });
                            
                            console.log('🔍 MANUAL CHECK RESULT:', attendanceData);
                            
                            if (attendanceData.success) {
                              const backendRecords = attendanceData.records || [];
                              console.log(`Backend has ${backendRecords.length} records`);
                              console.log(`Frontend has ${attendanceRecords.length} records`);
                              console.log(`Last tracked count: ${lastRecordCount}`);
                              
                              // Force update regardless
                              setAttendanceRecords(backendRecords);
                              setLastRecordCount(backendRecords.length);
                              
                              alert(`MANUAL CHECK COMPLETE:
                              
Backend Records: ${backendRecords.length}
Frontend Records: ${attendanceRecords.length}
Last Tracked: ${lastRecordCount}

${backendRecords.length > 0 ? 'Records found! Check console for details.' : 'No records found in backend.'}`);
                            } else {
                              alert(`Backend Error: ${attendanceData.message || 'Unknown error'}`);
                            }
                          }
                        } catch (error: any) {
                          console.error('Manual check failed:', error);
                          alert(`Manual check failed: ${error.message}`);
                        }
                      }}
                    >
                      Force Check
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      )}

      {/* Attendance Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-5">
              <Users size={48} className="text-muted mb-3" />
              <h5 className="text-muted">No attendance records yet</h5>
              <p className="text-muted">Students who mark attendance will appear here in real-time.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <Clock size={16} />
                        Time
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <User size={16} />
                        Student ID
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3">Student Name</th>
                    <th scope="col" className="px-4 py-3">
                      <div className="d-flex align-items-center gap-2">
                        <MapPin size={16} />
                        Centre
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3">Session Code</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((record, index) => (
                    <tr key={record._id} className={index === 0 ? 'table-success' : ''}>
                      <td className="px-4 py-3">
                        <div>
                          <div className="fw-semibold">{formatTime(record.timestamp)}</div>
                          <small className="text-muted">{formatDate(record.timestamp)}</small>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-primary">{record.studentId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="fw-semibold">{record.studentName}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-info">{record.centre}</span>
                      </td>
                      <td className="px-4 py-3">
                        <code>{record.sessionCode}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Auto-refresh indicator */}
      <div className="text-center mt-3">
        <small className="text-muted">
          <Clock size={12} className="me-1" />
          Auto-refreshing every 3 seconds • Real-time updates enabled
        </small>
      </div>

      {/* Real-time status indicator */}
      <div className="position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1000 }}>
        <div className={`d-flex align-items-center gap-2 text-white px-3 py-2 rounded-pill shadow ${isChecking ? 'bg-warning' : 'bg-success'}`}>
          <div
            className="bg-white rounded-circle"
            style={{
              width: '8px',
              height: '8px',
              animation: isChecking ? 'pulse 0.5s infinite' : 'pulse 2s infinite'
            }}
          ></div>
          <small>{isChecking ? 'Checking...' : 'Live Updates'}</small>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}