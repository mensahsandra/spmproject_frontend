import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; message?: string }> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error: any) {
        return { hasError: true, message: String(error?.message || error) };
    }
    componentDidCatch(error: any) {
        console.error('Scanner crashed:', error);
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ background: '#111827', color: '#fff', padding: 16, borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontWeight: 700, marginBottom: 8 }}>Unable to start camera</div>
                    <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 12 }}>Please allow camera permissions or try switching cameras.</div>
                </div>
            );
        }
        return this.props.children as any;
    }
}
import { FaQrcode } from "react-icons/fa";
import QRScanner, { type QRScannerHandle } from "./QRScanner";
// endpoint no longer needed directly; using apiFetch wrapper
import { apiFetch } from '../../utils/api';
import { getUser } from '../../utils/auth';
import { notifyAttendanceCheckIn } from '../../utils/notificationService';
import "../../css/recordattendance.css";

// Prefer role-aware user getter
const getUserFromLocalStorage = () => getUser('student');

const RecordAttendance: React.FC = () => {
    const navigate = useNavigate();
    const [sessionCode, setSessionCode] = useState("");
    const [studentId, setStudentId] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timestamp, setTimestamp] = useState<string>("");
    const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
    const [showScanner, setShowScanner] = useState(false);
    const [centre, setCentre] = useState<string>('Kumasi');
    const [scanError, setScanError] = useState<string>("");
    const [scanStatus, setScanStatus] = useState<string>("");
    const [hasMounted, setHasMounted] = useState(false);
    const scannerRef = React.useRef<QRScannerHandle | null>(null);
    const [lastScanMeta, setLastScanMeta] = useState<{ course?: string; courseCode?: string; lecturer?: string; name?: string } | null>(null);
    const [toast, setToast] = useState<{ visible: boolean; message: string; details?: string }>({ visible: false, message: "" });
    const toastTimerRef = React.useRef<number | null>(null);

    const stopModalVideos = () => {
        try {
            const root = document.getElementById('qr-scanner-modal');
            if (!root) return;
            const vids = root.querySelectorAll('video');
            vids.forEach((v) => {
                const stream = (v as any).srcObject as MediaStream | undefined;
                stream?.getTracks()?.forEach((t) => t.stop());
                (v as any).srcObject = null;
            });
        } catch { }
    };

    useEffect(() => {
    setHasMounted(true);
        // Set current timestamp
        const now = new Date();
        setTimestamp(now.toLocaleString());

        // Get user data and set student ID automatically
        const userData = getUserFromLocalStorage();
        if (userData && userData.studentId) {
            setStudentId(userData.studentId);
            console.log("Using student ID from logged-in user:", userData.studentId);
        } else {
            console.log("No student ID found in user data");
        }

        // Get geolocation if available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setCoords({ latitude, longitude });
                    // location text display removed; keep coords only
                },
                () => {
                    // ignore missing location
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
            );
        } else {
            // geolocation not supported; ignore
        }
        return () => {
            // Cleanup toast timer on unmount
            if (toastTimerRef.current) {
                window.clearTimeout(toastTimerRef.current);
                toastTimerRef.current = null;
            }
        };
    }, []);

    const handleQRResult = async (result: string) => {
        // Try parse JSON, otherwise treat as raw code
        try {
            const qrData = JSON.parse(result);
            if (qrData.sessionCode || qrData.qrCode) {
                setSessionCode(qrData.sessionCode || qrData.qrCode);
            } else {
                // No known key, fallback to stringified value
                setSessionCode(result);
            }
            // Extract meta if available
            setLastScanMeta({
                course: qrData.course || qrData.courseName,
                courseCode: qrData.courseCode,
                lecturer: qrData.lecturer || qrData.lecturerName,
                name: qrData.name || qrData.studentName,
            });
        } catch (_) {
            setSessionCode(result);
            setLastScanMeta(null);
        }
        setScanError("");
        setScanStatus("Marking attendance...");
        await handleSubmit(null, result);
        setScanStatus("");
        setShowScanner(false);
    };

    const handleQRError = (error: unknown) => {
        console.error("QR scanner error:", error);
        // Keep modal open; show message under the camera instead of closing
        setScanError("Unable to access camera or scan failed. Please allow camera permissions and try again.");
    };

    const handleSubmit = async (e: React.FormEvent | null, scannedCode?: string) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const checkInData = {
                qrCode: scannedCode || sessionCode,
                sessionCode: scannedCode || sessionCode,
                studentId,
                centre,
                timestamp,
                location: coords ? { latitude: coords.latitude, longitude: coords.longitude } : null
            };
            
            console.log('🔍 [CHECK-IN] Sending attendance data:', checkInData);
            console.log('🔍 [CHECK-IN] API endpoint:', '/api/attendance/check-in');
            
            const result: any = await apiFetch('/api/attendance/check-in', {
                method: 'POST',
                role: 'student',
                body: JSON.stringify(checkInData)
            });
            
            console.log('✅ [CHECK-IN] Backend response:', result);
            
            if (!result || result.error) throw new Error(result.message || 'Failed to record attendance');

            setSuccess("✅ Attendance recorded successfully!");

            // Inject a completed notification and navigate to Notifications → Completed
            const courseTitle = lastScanMeta?.course || 'Attendance';
            const courseCode = lastScanMeta?.courseCode ? String(lastScanMeta.courseCode).toUpperCase() : '';
            const courseLine = courseCode ? `${courseCode} - ${courseTitle}` : courseTitle;
            const lecturerName = lastScanMeta?.lecturer || 'Lecturer';
            const studentName = lastScanMeta?.name || 'You';

            // Send role-based notifications to both student and lecturer
            notifyAttendanceCheckIn(
                studentName,
                studentId || 'Unknown ID',
                courseCode || courseTitle,
                sessionCode || scannedCode || 'N/A'
            );

            const completed = {
                id: Date.now(),
                type: 'REMINDER',
                message: `Attendance recorded for ${courseLine}.`,
                timeAgo: 'Just now',
                category: 'completed',
                details: `Course: ${courseLine}\nLecturer: ${lecturerName}\nName: ${studentName}\nStudent ID: ${studentId || '-'}\nCentre: ${centre}\nDate & Time: ${timestamp}`,
                actionButton: {
                    text: 'View Details',
                    action: 'page',
                    route: '/notifications'
                }
            };
            // Persist to localStorage for later viewing
            try {
                const raw = localStorage.getItem('notifications');
                const list = raw ? JSON.parse(raw) : [];
                const next = Array.isArray(list) ? [completed, ...list] : [completed];
                localStorage.setItem('notifications', JSON.stringify(next.slice(0, 200)));
            } catch {}
            // Show toast
            try {
                setToast({ visible: true, message: `Attendance recorded for ${courseLine}.`, details: `Tap to view` });
                if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
                // @ts-ignore - setTimeout returns number in browsers
                toastTimerRef.current = window.setTimeout(() => {
                    setToast((t) => ({ ...t, visible: false }));
                    toastTimerRef.current = null;
                }, 4500);
            } catch {}
            // Update unread count for the sidebar badge (simple demo logic)
            try {
                const current = Number(localStorage.getItem('unreadNotifications') || '0');
                const next = current + 1;
                localStorage.setItem('unreadNotifications', String(next));
                // @ts-ignore
                const prev = (window.history.state || {});
                // @ts-ignore
                window.history.replaceState({ ...prev, unreadCount: next }, '');
            } catch {}

            // Push injected notification and preferred tab state
            // @ts-ignore
            window.history.pushState({ injectedNotification: completed, fromTab: 'completed' }, '');
        } catch (err) {
            if (err instanceof Error) {
                setError(`❌ ${err.message}`);
            } else {
                setError("❌ An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleScanQRCode = () => {
    setScanError("");
        setShowScanner(true);
    };

    return (
        <>
            {/* Style tag to force max-width with !important */}
            <style>
                {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(16, 167, 91, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(16, 167, 91, 0); }
            100% { box-shadow: 0 0 0 0 rgba(16, 167, 91, 0); }
          }
          
          .success-animation {
            animation: pulse 1.5s infinite;
          }
          
          .record-attendance-card {
            width: 100% !important;
            background: #fff !important;
            padding: 2rem !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
            box-sizing: border-box !important;
            max-height: calc(100vh - 2rem) !important;
            overflow-y: auto !important;
            margin: 0 auto !important;
            transition: max-width 0.3s ease !important;
          }

          @media (min-width: 1401px) {
            .record-attendance-card {
              max-width: 700px !important;
            }
          }
          @media (min-width: 1025px) and (max-width: 1400px) {
            .record-attendance-card {
              max-width: 600px !important;
            }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .record-attendance-card {
              max-width: 480px !important;
            }
          }
          @media (max-width: 768px) {
            .record-attendance-card {
              max-width: 100% !important;
              padding: 1rem !important;
            }
          }
        `}
            </style>

            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#f5f7fa",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "1rem",
                    boxSizing: "border-box",
                }}
            >
                <div className="record-attendance-card">
                    <h3
                        style={{
                            textAlign: "center",
                            marginBottom: "1.5rem",
                            color: "#333",
                            fontWeight: "700",
                            fontSize: "1.5rem",
                        }}
                    >
                        📋 Record Attendance
                    </h3>

                    {/* Student ID - Read Only */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label htmlFor="studentId" style={{ fontWeight: "600", display: "block" }}>
                            Student ID (From Login)
                        </label>
                        <input
                            type="text"
                            id="studentId"
                            value={studentId}
                            readOnly
                            style={{
                                width: "100%",
                                padding: "0.9rem 0.9rem",
                                marginTop: "0.4rem",
                                border: "1px solid #e5e7eb",
                                borderRadius: "12px",
                                fontSize: "1rem",
                                boxSizing: "border-box",
                                backgroundColor: "#f3f4f6", // Light gray background to indicate read-only
                                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)'
                            }}
                        />
                        <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.5rem" }}>
                            This ID is automatically retrieved from your login credentials
                        </div>
                    </div>

                    {/* Centre selector */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="centre" style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Centre</label>
                        <select
                            id="centre"
                            value={centre}
                            onChange={(e) => setCentre(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.9rem 0.9rem',
                                borderRadius: 12,
                                border: '1px solid #e5e7eb',
                                fontSize: '1.05rem',
                                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.06)'
                            }}
                        >
                            <option value="Kumasi">Kumasi</option>
                            <option value="Accra">Accra</option>
                            <option value="Tamale">Tamale</option>
                        </select>
                        <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.5rem" }}>
                            This ID is automatically retrieved from your login credentials
                        </div>
                    </div>

                    <button
                        onClick={handleScanQRCode}
                        style={{
                            width: "100%",
                            padding: "0.9rem",
                            backgroundColor: "#10A75B",
                            color: "#fff",
                            border: "none",
                            borderRadius: "12px",
                            fontWeight: 700,
                            margin: "12px 0 18px 0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            cursor: "pointer",
                            transition: "transform 0.15s ease",
                            boxShadow: '0 2px 0 #0c5a2e',
                        }}
                        onMouseDown={(e) => (e.currentTarget.style.transform = 'translateY(1px)')}
                        onMouseUp={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                        type="button"
                    >
                        <FaQrcode size={18} /> Scan QR
                    </button>

                    {/* Divider with helper text */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '12px 0 14px', color: '#6b7280' }}>
                        <div style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
                        <span style={{ fontSize: 13 }}>OR enter the code manually</span>
                        <div style={{ flex: 1, height: 1, backgroundColor: '#e5e7eb' }} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "1.2rem" }}>
                            <label htmlFor="sessionCode" style={{ fontWeight: "600", display: "block" }}>
                                Session Code
                            </label>
                            <input
                                type="text"
                                id="sessionCode"
                                value={sessionCode}
                                onChange={(e) => {
                                    const newCode = e.target.value;
                                    setSessionCode(newCode);
                                    // Auto-submit when code reaches typical length
                                    if (newCode.length >= 6) {
                                        // Use a short delay to ensure the state is updated
                                        setTimeout(() => {
                                            handleSubmit(null);
                                        }, 300);
                                    }
                                }}
                                required
                                placeholder={"Enter session code..."}
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                style={{
                                    width: "100%",
                                    padding: "0.9rem 0.9rem",
                                    marginTop: "0.4rem",
                                    border: success ? "2px solid #10A75B" : "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    fontSize: "1rem",
                                    boxSizing: "border-box",
                                    transition: "border-color 0.3s ease",
                                    boxShadow: success 
                                        ? '0 0 0 0 rgba(16, 167, 91, 0.4)' 
                                        : 'inset 0 2px 8px rgba(0,0,0,0.06)',
                                    fontFamily: 'SFMono-Regular, Menlo, Consolas, monospace'
                                }}
                                className={success ? "success-animation" : ""}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "#10A75B")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
                            />
                            <div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "0.5rem" }}>
                                Attendance will be recorded automatically when you enter the code
                            </div>
                        </div>

                        {/* Timestamp preview */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "8px", marginBottom: "1rem", color: "#374151" }}>
                            <div style={{ fontSize: "0.95rem" }}><strong>Time:</strong> {timestamp || "--"}</div>
                        </div>
                        
                        {/* Status indicator instead of a button */}
                        <div style={{
                            width: "100%",
                            padding: "0.9rem",
                            backgroundColor: "#f3f4f6",
                            color: loading ? "#10A75B" : "#4b5563",
                            border: "1px solid #e5e7eb",
                            borderRadius: "12px",
                            fontWeight: "600",
                            fontSize: "1rem",
                            textAlign: "center",
                            marginBottom: "1rem"
                        }}>
                            {loading ? (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                                    <div className="spinner" style={{ 
                                        width: "20px", 
                                        height: "20px", 
                                        border: "3px solid rgba(16, 167, 91, 0.3)",
                                        borderRadius: "50%",
                                        borderTop: "3px solid #10A75B",
                                        animation: "spin 1s linear infinite"
                                    }}></div>
                                    Recording attendance...
                                </div>
                            ) : "Enter the session code to record attendance automatically"}
                        </div>
                        
                        {/* Hidden submit button for form validation - not visible to users */}
                        <button type="submit" style={{ display: "none" }}></button>
                    </form>

                    {success && (
                        <div
                            style={{
                                marginTop: "1.5rem",
                                color: "#10A75B",
                                textAlign: "center",
                                fontWeight: "700",
                                fontSize: "1rem",
                                padding: "12px",
                                backgroundColor: "rgba(16, 167, 91, 0.1)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px"
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="#10A75B"/>
                            </svg>
                            {success}
                        </div>
                    )}
                    {error && (
                        <div
                            style={{
                                marginTop: "1.5rem",
                                color: "#E53E3E",
                                textAlign: "center",
                                fontWeight: "700",
                                fontSize: "1rem",
                                padding: "12px",
                                backgroundColor: "rgba(229, 62, 62, 0.1)",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "10px"
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="#E53E3E"/>
                            </svg>
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {/* Success toast */}
            {toast.visible && (
                <div
                    onClick={() => {
                        setToast((t) => ({ ...t, visible: false }));
                        navigate('/notifications?tab=completed');
                    }}
                    style={{
                        position: 'fixed',
                        right: 16,
                        bottom: 16,
                        background: '#111827',
                        color: '#fff',
                        padding: '12px 14px',
                        borderRadius: 12,
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        zIndex: 100001,
                        maxWidth: 360,
                        cursor: 'pointer',
                    }}
                    role="status"
                    aria-live="polite"
                >
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Success</div>
                    <div style={{ fontSize: 14, opacity: 0.95 }}>{toast.message}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6, textDecoration: 'underline' }}>{toast.details || 'View'}</div>
                </div>
            )}

                        {hasMounted && showScanner && createPortal((
                            <div
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.65)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 100000,
                                    backdropFilter: 'blur(2px)'
                                }}
                                role="dialog"
                                aria-modal="true"
                                id="qr-scanner-modal"
                            >
                                <div style={{ position: 'relative', width: 'min(860px, 96vw)' }}>
                                    <button
                                        onClick={async () => { await scannerRef.current?.stop(); stopModalVideos(); setShowScanner(false); }}
                                        style={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            background: 'rgba(17,24,39,0.7)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: 9999,
                                            width: 32,
                                            height: 32,
                                            cursor: 'pointer',
                                            zIndex: 50
                                        }}
                                        aria-label="Close scanner"
                                        title="Close"
                                    >
                                        ✕
                                    </button>
                                    <ErrorBoundary>
                                        <QRScanner ref={scannerRef} onResult={handleQRResult} onError={handleQRError} onCancel={async () => { await scannerRef.current?.stop(); stopModalVideos(); setShowScanner(false); }} statusText={scanStatus} />
                                    </ErrorBoundary>
                                    {scanError && (
                                      <div style={{ marginTop: 10, color: '#dc2626', fontSize: 13, textAlign: 'center' }}>
                                        {scanError}
                                      </div>
                                    )}
                                </div>
                            </div>
                        ), document.body)}
        </>
    );
};

export default RecordAttendance;
