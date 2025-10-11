import { useEffect, useState, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Clock, User, Book, QrCode, Loader2, Copy, CheckCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { getToken } from '../../utils/auth';
import { apiFetch } from '../../utils/api';
import { useSession } from '../../context/SessionContext';

type DecodedToken = {
  id: string;
  exp: number;
  iat: number;
};

type LecturerDetails = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  lecturerId?: string;
  courses?: string[];
  [k: string]: any;
};

export default function GenerateSessionCode() {
  const { sessionData, isSessionActive, timeRemaining, setSession, clearSession, formatTimeRemaining } = useSession();
  
  const [lecturer, setLecturer] = useState<LecturerDetails | null>(null);
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [courseCode, setCourseCode] = useState("");
  const [expiryValue, setExpiryValue] = useState<number>(5);
  const [expiryUnit, setExpiryUnit] = useState<"seconds" | "minutes" | "hours">("minutes");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCourse, setManualCourse] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const token = getToken('lecturer');
    
    if (!token) {
      setError('Please log in as a lecturer to generate sessions.');
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const lecturerId = decoded.id;
      setLoading(true);
      
      // Use the new lecturer profile endpoint
      apiFetch('/api/auth/lecturer/profile', { method: 'GET', role: 'lecturer' })
        .then((data: any) => {
          console.log('Lecturer profile response:', data);
          
          if (!data.success || !data.lecturer) {
            setError('Could not load lecturer profile');
            return;
          }
          
          const lecturerInfo = data.lecturer;
          
          // Build full name with honorific
          const honorific = lecturerInfo.honorific || '';
          const firstName = lecturerInfo.firstName || '';
          const lastName = lecturerInfo.lastName || '';
          const fullName = lecturerInfo.name || '';
          
          // Construct display name
          let displayName = fullName;
          if (!displayName && (firstName || lastName)) {
            displayName = [firstName, lastName].filter(Boolean).join(' ');
          }
          if (honorific && displayName) {
            displayName = `${honorific} ${displayName}`.trim();
          }
          if (!displayName) {
            displayName = 'Lecturer';
          }
          
          const lecturerData = {
            _id: lecturerInfo.id || lecturerId,
            user: {
              _id: lecturerInfo.id || lecturerId,
              name: displayName,
              email: lecturerInfo.email || '',
              role: lecturerInfo.role || 'lecturer'
            },
            lecturerId: lecturerInfo.staffId || lecturerInfo.id,
            courses: lecturerInfo.courses || []
          };

          setLecturer(lecturerData);
          
          // Handle courses if available
          if (lecturerData.courses && lecturerData.courses.length > 0) {
            const codes = lecturerData.courses
              .flatMap((c: string) => c.split(",").map((s: string) => s.trim()))
              .filter(Boolean);
            setCourseCodes(codes);
            if (codes.length > 0) {
              setCourseCode(codes[0]);
            }
          }
          
          console.log('Lecturer data loaded successfully:', lecturerData);
        })
        .catch(err => { 
          console.error("Error fetching lecturer profile:", err); 
          setError('Failed to load lecturer profile. You can still enter course code manually.'); 
        })
        .finally(() => setLoading(false));
        
    } catch (err) {
      console.error("Invalid token:", err);
      setError('Invalid authentication token. Please log in again.');
      setLoading(false);
    }
  }, []);

  const lecturerName = lecturer ? lecturer.user.name : "Lecturer";
  const expiryInMs = expiryUnit === "seconds"
    ? expiryValue * 1000
    : expiryUnit === "minutes"
      ? expiryValue * 60 * 1000
      : expiryValue * 60 * 60 * 1000;

  // Copy session code to clipboard
  const copySessionCode = useCallback(async () => {
    if (!sessionData?.sessionCode) return;
    
    try {
      await navigator.clipboard.writeText(sessionData.sessionCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy session code:', err);
    }
  }, [sessionData?.sessionCode]);

  // Close session manually
  const closeSession = () => {
    clearSession();
  };

  const handleGenerate = async () => {
    setError(null);
    
    // Verify token exists before proceeding
    const token = getToken('lecturer');
    if (!token) {
      setError('Authentication token missing. Please log in again.');
      console.error('❌ [SESSION-GEN] No token found for lecturer');
      return;
    }
    
    if (!lecturer) { 
      setError('Lecturer profile not loaded. Please refresh the page.'); 
      return; 
    }
    
    const selectedCourse = courseCode || manualCourse.trim();
    if (!selectedCourse) { 
      setError('Please enter a course code'); 
      return; 
    }
    
    const payload = {
      lecturer: lecturer._id,
      courseCode: selectedCourse,
      expiresAt: new Date(Date.now() + expiryInMs).toISOString(),
    };
    
    console.log('🔍 [SESSION-GEN] Creating session with payload:', payload);
    console.log('🔍 [SESSION-GEN] Lecturer ID:', lecturer._id);
    console.log('🔍 [SESSION-GEN] Lecturer details:', lecturer);
    console.log('🔍 [SESSION-GEN] Token present:', !!token);
    console.log('🔍 [SESSION-GEN] Token preview:', token.substring(0, 20) + '...');
    
    try {
      setLoading(true);
      const data: any = await apiFetch('/api/attendance-sessions', { 
        method: 'POST', 
        role: 'lecturer', 
        body: JSON.stringify(payload)
      });
      
      console.log('✅ [SESSION-GEN] Session created successfully:', data);
      console.log('✅ [SESSION-GEN] Session code:', data.session?.sessionCode || data.sessionCode);
      const session = data.session || data.data || data;
      
      // Create session data for global state
      const sessionInfo = {
        sessionCode: session.sessionCode || session.code || 'DEMO123',
        courseCode: selectedCourse,
        lecturerName: lecturerName,
        expiresAt: session.expiresAt || new Date(Date.now() + expiryInMs).toISOString(),
        createdAt: new Date().toISOString()
      };
      
      setSession(sessionInfo);
    } catch (err: any) {
      console.error("❌ [SESSION-GEN] Error creating session:", err);
      
      // Provide more specific error messages
      if (err?.message?.includes('Unauthorized') || err?.message?.includes('401')) {
        setError('Session expired. Please log in again.');
      } else if (err?.message?.includes('token')) {
        setError('Authentication error. Please log in again.');
      } else {
        setError(err?.message || 'Failed to create session. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container py-4" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h3 className="mb-4 fw-bold text-primary d-flex align-items-center gap-2">
                <QrCode size={24} /> Generate Session Code
              </h3>
              {error && (
                <div className="alert alert-danger" style={{padding:'8px 12px',fontSize:13}}>{error}</div>
              )}
              {loading && (
                <div className="d-flex justify-content-center align-items-center my-3">
                  <Loader2 className="spin me-2" size={20} />
                  <span>Loading...</span>
                </div>
              )}
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <User size={16} className="me-1 text-success" /> Lecturer
                </label>
                <input type="text" value={lecturerName} readOnly className="form-control" />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  <Book size={16} className="me-1 text-success" /> Course Code
                </label>
                {courseCodes.length > 0 ? (
                  <select 
                    value={courseCode} 
                    onChange={e => setCourseCode(e.target.value)} 
                    className="form-select"
                    disabled={isSessionActive}
                  >
                    {courseCodes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter course code"
                    value={manualCourse}
                    onChange={e => setManualCourse(e.target.value)}
                    disabled={isSessionActive}
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <Clock size={16} className="me-1 text-success" /> Expiry Time
                </label>
                <div className="input-group">
                  <input 
                    type="number" 
                    min={1} 
                    value={expiryValue} 
                    onChange={e => setExpiryValue(Number(e.target.value))} 
                    className="form-control"
                    disabled={isSessionActive}
                  />
                  <select 
                    value={expiryUnit} 
                    onChange={e => setExpiryUnit(e.target.value as any)} 
                    className="form-select"
                    disabled={isSessionActive}
                  >
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              </div>
              
              {!isSessionActive ? (
                <button 
                  onClick={handleGenerate} 
                  className="btn btn-success w-100 fw-semibold py-2" 
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate QR Code"}
                </button>
              ) : (
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-danger flex-fill fw-semibold py-2" 
                    onClick={closeSession}
                  >
                    End Session
                  </button>
                  <div className="btn btn-outline-secondary flex-fill fw-semibold py-2 d-flex align-items-center justify-content-center">
                    <Clock size={16} className="me-2" />
                    {formatTimeRemaining(timeRemaining)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4 d-flex flex-column">
              {!isSessionActive ? (
                <div className="d-flex align-items-center justify-content-center h-100 text-center text-muted">
                  <div>
                    <QrCode size={60} className="mb-3" />
                    <p>Click "Generate QR Code" to display the session QR code and countdown timer here.</p>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-column h-100">
                  {/* Timer Display */}
                  <div 
                    className="text-center mb-3 p-3 rounded"
                    style={{
                      backgroundColor: timeRemaining < 60000 ? '#fee2e2' : '#f0f9ff',
                      border: `2px solid ${timeRemaining < 60000 ? '#ef4444' : '#3b82f6'}`
                    }}
                  >
                    <div style={{ 
                      fontSize: '28px', 
                      fontWeight: 'bold', 
                      color: timeRemaining < 60000 ? '#dc2626' : '#1d4ed8',
                      fontFamily: 'monospace'
                    }}>
                      {formatTimeRemaining(timeRemaining)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {timeRemaining < 60000 ? 'Session expires soon!' : 'Time remaining'}
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center mb-3 flex-grow-1 d-flex align-items-center justify-content-center">
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <QRCodeSVG 
                        value={sessionData?.sessionCode || ''} 
                        size={180}
                        level="M"
                      />
                    </div>
                  </div>

                  {/* Session Details */}
                  <div>
                    <h5 className="text-center mb-3 fw-bold">Session Details</h5>
                    
                    <div className="mb-2 p-2 bg-light rounded d-flex justify-content-between">
                      <span className="fw-semibold">Course:</span>
                      <span>{sessionData?.courseCode}</span>
                    </div>
                    
                    <div className="mb-2 p-2 bg-light rounded d-flex justify-content-between">
                      <span className="fw-semibold">Lecturer:</span>
                      <span>{sessionData?.lecturerName}</span>
                    </div>
                    
                    <div className="mb-3 p-2 bg-light rounded d-flex justify-content-between align-items-center">
                      <span className="fw-semibold">Session Code:</span>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>
                          {sessionData?.sessionCode}
                        </span>
                        <button
                          onClick={copySessionCode}
                          className="btn btn-sm btn-outline-secondary p-1"
                          title="Copy session code"
                        >
                          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>

                    <div className="alert alert-info p-2 mb-0" style={{ fontSize: '12px' }}>
                      Students can scan the QR code or manually enter the session code to mark attendance.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
