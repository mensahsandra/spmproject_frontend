import { useEffect, useState } from 'react';
import { Users, Clock, MapPin, User, Book, UserCheck } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { getToken, getUser } from '../../utils/auth';
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
    try {
      const token = getToken('lecturer');
      if (!token) {
        setError('Please log in as a lecturer to view attendance.');
        setLoading(false);
        return;
      }

      const decoded = jwtDecode<DecodedToken>(token);
      const lecturerId = decoded.id;

      // Get current user data from auth utils for immediate display
      const currentUser = getUser();
      const lecturerName = currentUser?.name || 
                          `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() ||
                          'Current Lecturer';

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

      // Fallback: Use current logged-in user data with sample attendance
      console.log('Using fallback data with current user:', lecturerName);
      
      setSessionInfo({
        lecturer: lecturerName,
        courseCode: currentUser?.department ? 
                   `${currentUser.department.toUpperCase()}101 - Introduction to ${currentUser.department}` :
                   'No Active Session',
        classRepresentative: 'To be assigned',
        totalAttendees: 3
      });
      
      // Sample attendance records with current user context
      setAttendanceRecords([
        {
          _id: '1',
          studentId: '1234567',
          studentName: 'Ransford Student',
          centre: 'Kumasi',
          timestamp: new Date().toISOString(),
          sessionCode: 'ABC123',
          courseCode: currentUser?.department?.toUpperCase() + '101' || 'CS101'
        },
        {
          _id: '2',
          studentId: '2345678',
          studentName: 'Jane Smith',
          centre: 'Accra',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          sessionCode: 'ABC123',
          courseCode: currentUser?.department?.toUpperCase() + '101' || 'CS101'
        },
        {
          _id: '3',
          studentId: '3456789',
          studentName: 'Michael Johnson',
          centre: 'Takoradi',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          sessionCode: 'ABC123',
          courseCode: currentUser?.department?.toUpperCase() + '101' || 'CS101'
        }
      ]);

      setError('Using sample data. Backend integration required for real attendance data.');
      
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
                className="btn btn-outline-primary btn-sm mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Refreshing...
                  </>
                ) : (
                  'Refresh Data'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-warning mb-4">
          <strong>Note:</strong> {error}
          <br />
          <small>Showing sample data for demonstration purposes.</small>
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