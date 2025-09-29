import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

type SessionData = {
  sessionCode: string;
  courseCode: string;
  lecturerName: string;
  expiresAt: string;
  createdAt: string;
} | null;

type SessionContextType = {
  sessionData: SessionData;
  isSessionActive: boolean;
  timeRemaining: number;
  setSession: (data: SessionData) => void;
  clearSession: () => void;
  formatTimeRemaining: (ms: number) => string;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionData, setSessionData] = useState<SessionData>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('activeSession');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        const now = new Date().getTime();
        const expiry = new Date(parsed.expiresAt).getTime();
        
        if (expiry > now) {
          setSessionData(parsed);
          setTimeRemaining(expiry - now);
        } else {
          // Session expired, clear it
          localStorage.removeItem('activeSession');
        }
      } catch (err) {
        console.error('Error loading saved session:', err);
        localStorage.removeItem('activeSession');
      }
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!sessionData?.expiresAt) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(sessionData.expiresAt).getTime();
      const remaining = Math.max(0, expiry - now);
      
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        // Session expired - clear it
        clearSession();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionData?.expiresAt]);

  const setSession = (data: SessionData) => {
    setSessionData(data);
    if (data) {
      // Save to localStorage for persistence
      localStorage.setItem('activeSession', JSON.stringify(data));
      
      // Initialize timer
      const now = new Date().getTime();
      const expiry = new Date(data.expiresAt).getTime();
      setTimeRemaining(Math.max(0, expiry - now));
    }
  };

  const clearSession = () => {
    setSessionData(null);
    setTimeRemaining(0);
    localStorage.removeItem('activeSession');
  };

  const formatTimeRemaining = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const isSessionActive = sessionData !== null && timeRemaining > 0;

  return (
    <SessionContext.Provider value={{
      sessionData,
      isSessionActive,
      timeRemaining,
      setSession,
      clearSession,
      formatTimeRemaining
    }}>
      {children}
    </SessionContext.Provider>
  );
};