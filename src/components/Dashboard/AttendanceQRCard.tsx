import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode } from 'lucide-react';
import { apiFetch } from '../../utils/api';

const AttendanceQRCard: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const readerRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const startScanner = useCallback(() => {
    if (!readerRef.current) return;
    if (scannerRef.current) return; // already running
  const sc = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);
    scannerRef.current = sc;
  sc.render(async (decodedText) => {
      try {
        const body = { studentId: '12345', qrCode: decodedText, timestamp: new Date().toISOString() };
        const data: any = await apiFetch('/api/attendance/check-in', { method: 'POST', role: 'student', body: JSON.stringify(body) });
        alert(data?.message || data?.status || 'Attendance marked!');
      } catch (e) {
        console.error(e);
        alert('Failed to mark attendance');
      } finally {
        setScanning(false);
        // Html5QrcodeScanner cleans itself when container removed
        scannerRef.current?.clear().catch(() => {});
        scannerRef.current = null;
      }
  }, () => { /* ignore scan errors for smoother UX */ });
  }, []);

  useEffect(() => {
    if (scanning) {
      startScanner();
    } else {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    }
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [scanning, startScanner]);

  return (
    <div className="panel-card" onClick={() => setScanning(true)}>
      <div className="panel-accent attendance-accent" />
      <div className="panel-content panel-center">
        <div className="panel-title-stack">
          <QrCode className="panel-qr-icon" size={32} />
          <h2 className="panel-title">Attendance</h2>
        </div>
        <div className="panel-underline light-solid" />
        <p className="panel-description" style={{ textAlign: 'center' }}>Here for today’s class? Click to check in and mark your attendance.</p>
      </div>
      {scanning && (
        <div className="qr-modal">
          <div className="qr-modal-content">
            <div id="qr-reader" ref={readerRef} />
            <button className="qr-close" onClick={() => setScanning(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceQRCard;