import { useEffect, useState } from 'react';
import { Users, Clock, MapPin, User, Book, UserCheck } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { getToken, getUser, getActiveRole } from '../../utils/auth';
import { jwtDecode } from 'jwt-decode';

type DecodedToken = {
  id: string;
  exp: number;
  iat: number;
};

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
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceData();
    
    // Set up polling to refresh data every 10 seconds
    const interval = setInterval(fetchAttendanceData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAttendanceData = async () => {
    setLoading(true); // Set loading to true at the start
    
    try {
      const token = getToken('lecturer');
      console.log('🔍 Debug - Token retrieved:', token ? 'Token exists' : 'No token found');
      console.log('🔍 Debug - Active role:', getActiveRole());
      console.log('🔍 Debug - All localStorage keys:', Object.keys(localStorage));
      
      if (!token) {
        setError('Please log in as a lecturer to view attendance.');
        setLoading(false);
        return;
      }

      const decoded = jwtDecode<any>(token); // Use 'any' to access all fields
      console.log('🔍 Debug - Decoded token:', decoded);
      
      // Try multiple possible field names for lecturer ID
      const lecturerId = decoded.id || decoded.sub || decoded.lecturerId || decoded.userId || decoded.user_id;
      console.log('🔍 Debug - Lecturer ID extracted:', lecturerId);
      
      if (!lecturerId) {
        setError('Invalid token: No lecturer ID found. Please log in again.');
        setLoading(false);
        return;
      }

      // Get current user data from auth utils for immediate display
      const currentUser = getUser();
      console.log('🔍 Debug - Current user data:', currentUser);
      const lecturerName = currentUser?.name || 
                          `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() ||
                          'Current Lecturer';
      console.log('🔍 Debug - Lecturer name resolved:', lecturerName);

      // Try to fetch real data from backend
      try {
        // Fetch lecturer profile for session info
        const profileData = await apiFetch('/api/auth/lecturer/profile', { 
          method: 'GET', 
          role: 'lecturer' 
        });

        if (profileData.success && profileData.lecturer) {
          const lecturer = profileData.lecturer;
          
          // Fetch attendance records
          const attendanceData = await apiFetch(`/api/attendance/lecturer/${lecturerId}`, {
            method: 'GET',
            role: 'lecturer'
          });

          if (attendanceData.success && attendanceData.records) {
            const records = attendanceData.records || [];
            setAttendanceRecords(records);
            
            // Use real backend data
            setSessionInfo({
              lecturer: lecturer.name || lecturerName,
              courseCode: attendanceData.currentSession?.courseCode || 
                         (records.length > 0 ? `${records[0].courseCode} - ${records[0].courseName || 'Course'}` : 'No Active Session'),
              classRepresentative: attendanceData.currentSession?.classRepresentative || 'To be assigned',
              totalAttendees: records.length
            });
            
            setError(null); // Clear any previous errors
            return; // Successfully loaded real data
          }
        }
      } catch (apiError) {
        console.warn('Backend API not available, using current user data:', apiError);
      }

      // No active session - show empty state
      console.log('No backend data available, showing empty state for:', lecturerName);
      
      setSessionInfo({
        lecturer: lecturerName,
        courseCode: 'No Active Session',
        classRepresentative: 'To be assigned',
        totalAttendees: 0
      });
      
      // Empty attendance records - will show real data when students scan
      setAttendanceRecords([]);

      setError('No active session. Generate a session code for students to scan and check in.');
      
    } catch (err: any) {
      console.error('Error in fetchAttendanceData:', err);
      setError('Failed to load attendance data. Please check your connection and try again.');
      
      // Emergency fallback with minimal data
      const currentUser = getUser();
      const lecturerName = currentUser?.name || 'Current Lecturer';
      
      setSessionInfo({
        lecturer: lecturerName,
        courseCode: 'No Active Session',
        classRepresentative: 'N/A',
        totalAttendees: 0
      });
      
      setAttendanceRecords([]);
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
                      <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
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
          Auto-refreshing every 10 seconds
        </small>
      </div>
    </div>
  );
}