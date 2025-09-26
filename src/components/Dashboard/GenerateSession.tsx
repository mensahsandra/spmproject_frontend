import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Clock, User, Book, QrCode, Loader2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { getToken } from '../../utils/auth';
import { apiFetch } from '../../utils/api';

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
  const [lecturer, setLecturer] = useState<LecturerDetails | null>(null);
  const [courseCodes, setCourseCodes] = useState<string[]>([]);
  const [courseCode, setCourseCode] = useState("");
  const [expiryValue, setExpiryValue] = useState<number>(5);
  const [expiryUnit, setExpiryUnit] = useState<"seconds" | "minutes" | "hours">("minutes");
  const [showQR, setShowQR] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCourse, setManualCourse] = useState("");

  useEffect(() => {
  const token = getToken('lecturer');
    if (!token) return;
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const lecturerId = decoded.id;
      setLoading(true);
  apiFetch(`/api/lecturers/${lecturerId}`, { method: 'GET', role: 'lecturer' })
        .then((data: any) => {
          const lecturerData = data.data || data.lecturer || data;
          if (!lecturerData || lecturerData.error) {
    const msg = lecturerData?.message || lecturerData?.error || 'Could not load lecturer profile';
    setError(msg === 'Route not found' ? 'Lecturer profile endpoint not found on backend.' : msg);
            return;
          }
          setLecturer(lecturerData);
          if (lecturerData?.courses?.length) {
            const codes = lecturerData.courses
              .flatMap((c: string) => c.split(",").map((s: string) => s.trim()))
              .filter(Boolean);
            setCourseCodes(codes);
            setCourseCode(codes[0]);
          } else {
    setError('No courses found. You can enter one manually below.');
          }
        })
        .catch(err => { console.error("Error fetching lecturer details:", err); setError('Failed to load lecturer details.'); })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  const lecturerName = lecturer ? lecturer.user.name : "Lecturer";
  const expiryInMs = expiryUnit === "seconds"
    ? expiryValue * 1000
    : expiryUnit === "minutes"
      ? expiryValue * 60 * 1000
      : expiryValue * 60 * 60 * 1000;

  const handleGenerate = async () => {
  setError(null);
  if (!lecturer) { setError('Lecturer profile not loaded'); return; }
  const selectedCourse = courseCode || manualCourse.trim();
  if (!selectedCourse) { setError('Select or enter a course'); return; }
    const payload = {
  lecturer: lecturer._id,
  courseCode: selectedCourse,
      expiresAt: new Date(Date.now() + expiryInMs).toISOString(),
    };
    try {
      setLoading(true);
  const data: any = await apiFetch('/api/attendance-sessions', { method: 'POST', role: 'lecturer', body: JSON.stringify(payload) });
  setSessionData(data.session || data.data || data);
      setShowQR(true);
    } catch (err: any) {
      console.error("Error creating session:", err);
      setError(err?.message || 'Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  return (
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
                  <select value={courseCode} onChange={e => setCourseCode(e.target.value)} className="form-select">
                    {courseCodes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter course code"
                    value={manualCourse}
                    onChange={e => setManualCourse(e.target.value)}
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  <Clock size={16} className="me-1 text-success" /> Expiry Time
                </label>
                <div className="input-group">
                  <input type="number" min={1} value={expiryValue} onChange={e => setExpiryValue(Number(e.target.value))} className="form-control" />
                  <select value={expiryUnit} onChange={e => setExpiryUnit(e.target.value as any)} className="form-select">
                    <option value="seconds">Seconds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>
              </div>
              <button onClick={handleGenerate} className="btn btn-success w-100 fw-semibold py-2" disabled={loading}>
                {loading ? "Generating..." : "Generate QR Code"}
              </button>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100 d-flex align-items-center justify-content-center p-4">
            {!showQR ? (
              <div className="text-center text-muted">
                <QrCode size={60} className="mb-3" />
                <p>Click "Generate QR Code" to display the session QR here.</p>
              </div>
            ) : (
              <div className="text-center">
                <QRCodeSVG value={`${sessionData.sessionCode || ''}`} />
                <p className="text-muted mt-3">Session Code: {sessionData.sessionCode}</p>
                <p className="text-muted small">Valid until: {new Date(sessionData?.expiresAt).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
