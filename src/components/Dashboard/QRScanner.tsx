import React, { useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { FiImage, FiRefreshCw, FiZap } from 'react-icons/fi';

export interface QRScannerProps {
  onResult: (result: string) => void;
  onError: (error: unknown) => void;
  onCancel?: () => void;
  statusText?: string;
}
export interface QRScannerHandle {
  stop: () => Promise<void>;
}

const QRScanner = React.forwardRef<QRScannerHandle, QRScannerProps>(({ onResult, onError, onCancel, statusText }, ref) => {
  const qrRef = useRef<Html5Qrcode | null>(null);
  const startedRef = useRef<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);
  const safeStopClear = useCallback(async () => {
    try {
      if (qrRef.current) {
        await qrRef.current.stop().catch(() => {});
        // clear removes the camera stream and DOM within the container
        try {
          const clearFn = (qrRef.current as any).clear?.bind(qrRef.current);
          if (typeof clearFn === 'function') {
            await clearFn();
          }
        } catch {}
      }
      // Fallback: stop any dangling tracks on video elements under qr container
      try {
        const videos = document.querySelectorAll<HTMLVideoElement>('#qr-reader video, #qr-reader__scan_region video');
        videos.forEach(v => {
          try { v.pause(); } catch {}
          const stream = (v as any).srcObject as MediaStream | undefined;
          stream?.getTracks()?.forEach(t => t.stop());
          (v as any).srcObject = null;
          try { v.removeAttribute('src'); } catch {}
          try { v.load?.(); } catch {}
          try { v.parentElement?.removeChild(v); } catch {}
        });
        // Also clear the reader container contents to detach canvases, etc.
        const container = document.getElementById('qr-reader');
        if (container) {
          try { container.innerHTML = ''; } catch {}
        }
      } catch {}
      // Also stop the saved stream (if we captured it after start)
      try {
        const s = streamRef.current;
        s?.getTracks()?.forEach(t => t.stop());
        streamRef.current = null;
      } catch {}
      // Last resort: stop tracks on ANY video element on the page (prevents LED lingering on some devices)
      try {
        const allVideos = document.querySelectorAll<HTMLVideoElement>('video');
        allVideos.forEach(v => {
          const stream = (v as any).srcObject as MediaStream | undefined;
          if (stream) {
            try { v.pause(); } catch {}
            stream.getTracks()?.forEach(t => t.stop());
            (v as any).srcObject = null;
            try { v.removeAttribute('src'); } catch {}
            try { v.load?.(); } catch {}
          }
        });
      } catch {}
    } catch {
      // ignore
    } finally {
      startedRef.current = false;
    }
  }, []);

  useImperativeHandle(ref, () => ({
    stop: async () => {
      await safeStopClear();
    },
  }), [safeStopClear]);
  const [devices, setDevices] = useState<Array<{ id: string; label: string }>>([]);
  const [deviceIndex, setDeviceIndex] = useState<number>(0);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [startError, setStartError] = useState<string>('');
  const [initializing, setInitializing] = useState<boolean>(true);
  const [torchOn, setTorchOn] = useState<boolean>(false);
  const [torchSupported, setTorchSupported] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateTorchSupport = useCallback(() => {
    try {
      const anyQr: any = qrRef.current as any;
      if (!anyQr || typeof anyQr.getRunningTrackCapabilities !== 'function') {
        setTorchSupported(false);
        return;
      }
      const caps = anyQr.getRunningTrackCapabilities?.();
      const supported = !!caps?.torch;
      setTorchSupported(supported);
      if (!supported) setTorchOn(false);
    } catch {
      setTorchSupported(false);
      setTorchOn(false);
    }
  }, []);

  const setTorch = useCallback(async (on: boolean) => {
    try {
      const anyQr: any = qrRef.current as any;
      if (!anyQr || typeof anyQr.applyVideoConstraints !== 'function') {
        setStartError('Torch control not supported on this device/browser');
        return;
      }
      await anyQr.applyVideoConstraints({ advanced: [{ torch: on }] });
      setTorchOn(on);
    } catch (e) {
      console.warn('Failed to toggle torch', e);
      setStartError('Unable to toggle torch on this device');
      setTorchOn(false);
    }
  }, []);

  const startWithSource = useCallback(async (source: { deviceId?: string; facingMode?: 'environment' | 'user' }) => {
    setStartError('');
    if (!qrRef.current) return;
    try {
      if (startedRef.current) {
        await safeStopClear();
      }
      await qrRef.current.start(
        source.deviceId ? { deviceId: { exact: source.deviceId } } : { facingMode: source.facingMode || 'environment' },
        {
          fps: 12,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Stop once we have a result
          safeStopClear();
          onResult(decodedText);
        },
        () => {
          // Ignored frame errors
        }
      );
      startedRef.current = true;
      // After successful start, query torch capability
      updateTorchSupport();
      // Capture the MediaStream from the created video element to ensure we can stop it later
      try {
        // Delay a tick to allow video element to mount
        setTimeout(() => {
          try {
            const vid = document.querySelector<HTMLVideoElement>('#qr-reader video, #qr-reader__scan_region video');
            const stream = (vid as any)?.srcObject as MediaStream | undefined;
            if (stream) streamRef.current = stream;
          } catch {}
        }, 0);
      } catch {}
    } catch (e) {
      console.error('Failed to start scanner with source:', source, e);
      setStartError('Unable to start camera. Trying another source...');
      throw e;
    }
  }, [onResult, updateTorchSupport, safeStopClear]);

  useEffect(() => {
  const html5QrCode = new Html5Qrcode('qr-reader');
    qrRef.current = html5QrCode;

    // Discover cameras and pick best default
    Html5Qrcode.getCameras()
      .then((cams) => {
        const camList = (cams || []).map((c) => ({ id: (c as any).id || (c as any).deviceId, label: (c as any).label || 'Camera' }));
        setDevices(camList);
        // Prefer back camera if label contains back/environment
        let startIdx = 0;
        camList.forEach((c, i) => {
          const name = c.label.toLowerCase();
          if (name.includes('back') || name.includes('environment')) startIdx = i;
        });
        setDeviceIndex(startIdx);

        // Try starting with deviceId if available; fallback to facingMode
        const chosen = camList[startIdx];
        const start = async () => {
          try {
            if (chosen?.id) {
              await startWithSource({ deviceId: chosen.id });
            } else {
              await startWithSource({ facingMode });
            }
          } catch (err) {
            // Retry with alternate if initial fails
            try {
              await startWithSource({ facingMode: facingMode === 'environment' ? 'user' : 'environment' });
            } catch (err2) {
              console.error('All start attempts failed');
              onError(err2);
            }
          }
          setInitializing(false);
        };
        start();
      })
      .catch((err) => {
        console.warn('Could not enumerate cameras; falling back to facingMode.', err);
        startWithSource({ facingMode }).then(() => setInitializing(false)).catch((e) => onError(e));
      });

    return () => {
      safeStopClear();
    };
  }, [onResult, onError, facingMode, startWithSource, safeStopClear]);

  return (
  <div style={{ maxWidth: '860px', width: '100%', margin: '0 auto' }}>
        {/* Force html5-qrcode video/canvas to fill and cover the container */}
        <style>
          {`
            #qr-reader, #qr-reader__scan_region { position: relative; }
            #qr-reader__scan_region video, #qr-reader__scan_region canvas {
              width: 100% !important;
              height: 100% !important;
              object-fit: cover !important;
              display: block;
            }
          `}
        </style>
  <div style={{ position: 'relative', width: '100%' }}>
        {/* Camera surface rendered by html5-qrcode */}
    <div
          id="qr-reader"
          style={{
      width: '100%',
      minHeight: 520,
      borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 10px 24px rgba(0, 0, 0, 0.35)',
            background: '#0b1220',
          }}
        />

        {/* Top overlay action bar */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 12,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            pointerEvents: 'auto',
            zIndex: 6,
          }}
        >
          <div style={{
            background: 'rgba(31,41,55,0.6)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            padding: '10px 16px',
            borderRadius: 10,
            backdropFilter: 'blur(6px)'
          }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              aria-label="Scan from image"
              title="Scan from image"
            >
              <FiImage size={18} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file || !qrRef.current) return;
                setStartError('');
                try {
                  // Stop camera to free the container for image render
                  await safeStopClear();
                  const result = await (qrRef.current as any).scanFile(file, true);
                  if (result?.decodedText) {
                    onResult(result.decodedText);
                  } else if (typeof result === 'string') {
                    onResult(result);
                  } else {
                    setStartError('No QR code found in the selected image');
                    // Restart camera after a short delay
                    setTimeout(() => {
                      const chosen = devices[deviceIndex];
                      if (chosen?.id) startWithSource({ deviceId: chosen.id });
                      else startWithSource({ facingMode });
                    }, 200);
                  }
                } catch (err) {
                  console.warn('Image scan failed', err);
                  setStartError('Could not scan the selected image');
                  // Restart camera after failure
                  setTimeout(() => {
                    const chosen = devices[deviceIndex];
                    if (chosen?.id) startWithSource({ deviceId: chosen.id });
                    else startWithSource({ facingMode });
                  }, 200);
                } finally {
                  // Reset the input so selecting the same file again re-triggers change
                  e.target.value = '';
                }
              }}
            />
            <button
              type="button"
              disabled={!torchSupported}
              onClick={() => setTorch(!torchOn)}
              style={{ background: 'transparent', border: 'none', color: torchSupported ? '#fff' : 'rgba(255,255,255,0.5)', cursor: torchSupported ? 'pointer' : 'not-allowed' }}
              aria-label={torchOn ? 'Turn off torch' : 'Turn on torch'}
              title={torchSupported ? (torchOn ? 'Turn off torch' : 'Turn on torch') : 'Torch not supported'}
            >
              <FiZap size={18} />
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  // Cycle through available devices; if none, toggle facingMode
                  if (devices.length > 0 && qrRef.current) {
                    const nextIndex = (deviceIndex + 1) % devices.length;
                    setDeviceIndex(nextIndex);
                    await qrRef.current.stop().catch(() => {});
                    await startWithSource({ deviceId: devices[nextIndex].id });
                  } else {
                    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
                  }
                } catch (e) {
                  console.error('Failed to switch camera', e);
                }
              }}
              style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              aria-label="Switch camera"
              title="Switch camera"
            >
              <FiRefreshCw size={18} />
            </button>
          </div>
        </div>

        {/* Corner guide overlay */
        /* and bottom instructions + cancel */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <div style={{ position: 'relative', width: 320, height: 320 }}>
            {/* Four corner brackets */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: 44, height: 44, borderTop: '5px solid #22c55e', borderLeft: '5px solid #22c55e', borderTopLeftRadius: 10 }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: 44, height: 44, borderTop: '5px solid #22c55e', borderRight: '5px solid #22c55e', borderTopRightRadius: 10 }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 44, height: 44, borderBottom: '5px solid #22c55e', borderLeft: '5px solid #22c55e', borderBottomLeftRadius: 10 }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 44, height: 44, borderBottom: '5px solid #22c55e', borderRight: '5px solid #22c55e', borderBottomRightRadius: 10 }} />
          </div>

          {/* Bottom overlay texts and actions */}
          <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 10,
            pointerEvents: 'auto',
            zIndex: 6,
          }}>
            <div style={{ color: '#f3f4f6', textAlign: 'center', fontWeight: 600 }}>
              Scan QR Code to mark Attendance
            </div>
            <div style={{ color: '#e5e7eb', textAlign: 'center', fontSize: 14 }}>
              Position the Attendance QR Code within the frame
            </div>
            {statusText && (
              <div style={{ color: '#e5e7eb', textAlign: 'center', fontSize: 13, opacity: 0.95 }}>
                {statusText}
              </div>
            )}
            {onCancel && (
              <button
                type="button"
                onClick={async () => { await safeStopClear(); onCancel?.(); }}
                style={{
                  marginTop: 4,
                  background: 'rgba(107,114,128,0.9)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '10px 18px',
                  cursor: 'pointer'
                }}
              >
                Cancel Scanning
              </button>
            )}
          </div>
        </div>
  </div>
  {(initializing || startError) && (
        <div style={{ marginTop: 10, textAlign: 'center', color: '#dc2626', fontSize: 13 }}>{startError}</div>
      )}
    </div>
  );
});

export default QRScanner;
