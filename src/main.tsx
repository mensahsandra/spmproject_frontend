import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/reset.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext';

// For debugging purposes - to ensure React is working
console.log("React app is initializing...");

const rootElement = document.getElementById('root');
console.log("Root element found:", rootElement);

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>,
  );
  console.log("React app rendered successfully");
} else {
  console.error("Root element not found! Check your index.html");
}
