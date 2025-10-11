import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext';
import { SessionProvider } from './context/SessionContext';

// Debug instrumentation: wrap fetch to log method & URL (dev only)
if ((import.meta as any).env?.DEV && typeof window !== 'undefined') {
  const originalFetch = window.fetch;
  if (!(window as any)._fetchDebugWrapped) {
    (window as any)._fetchDebugWrapped = true;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      try {
        const method = init?.method || 'GET';
        const url = typeof input === 'string' ? input : (input as Request).url;
        // Only log auth/login or when explicitly POST to reduce noise
        if (/auth\/login/.test(url) || method !== 'GET') {
          console.log('[FETCH]', method, url, init?.headers);
        }
      } catch (e) {
        console.warn('Fetch debug wrapper error:', e);
      }
      return originalFetch(input as any, init);
    };
  }
}

// Load token test utilities in development
if ((import.meta as any).env?.DEV) {
  import('./utils/tokenTest').then(() => {
    console.log('✅ Token test utilities loaded');
  }).catch(err => {
    console.warn('Could not load token test utilities:', err);
  });
}

// For debugging purposes - to ensure React is working
console.log("React app is initializing...");

const rootElement = document.getElementById('root');
console.log("Root element found:", rootElement);

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </AuthProvider>
    </StrictMode>,
  );
  console.log("React app rendered successfully");
} else {
  console.error("Root element not found! Check your index.html");
}
