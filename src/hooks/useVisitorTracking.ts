import { useState, useEffect } from 'react';

interface VisitorSession {
  sessionId: string;
  timestamp: number;
  isNewVisitor: boolean;
  fingerprint: string;
}

interface VisitorFingerprint {
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  colorDepth: number;
}

export function useVisitorTracking() {
  const [hasTrackedVisit, setHasTrackedVisit] = useState(false);

  const generateFingerprint = (): string => {
    const fp: VisitorFingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth
    };
    
    // Create a simple hash of the fingerprint
    const fpString = JSON.stringify(fp);
    let hash = 0;
    for (let i = 0; i < fpString.length; i++) {
      const char = fpString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `fp_${Math.abs(hash).toString(36)}`;
  };

  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const isNewUniqueVisitor = (fingerprint: string): boolean => {
    const currentTime = Date.now();
    const visitWindow = 4 * 60 * 60 * 1000; // 4 hours window for same visitor
    
    // Check if this fingerprint has visited recently
    const recentVisits = localStorage.getItem('recent_visitor_fingerprints');
    
    if (recentVisits) {
      try {
        const visits: { [key: string]: number } = JSON.parse(recentVisits);
        
        // Clean up old entries (older than 24 hours)
        const dayAgo = currentTime - (24 * 60 * 60 * 1000);
        Object.keys(visits).forEach(fp => {
          if (visits[fp] < dayAgo) {
            delete visits[fp];
          }
        });
        
        // Check if this fingerprint visited recently
        if (visits[fingerprint] && (currentTime - visits[fingerprint]) < visitWindow) {
          return false; // Not a new visit
        }
        
        // Update the fingerprint timestamp
        visits[fingerprint] = currentTime;
        localStorage.setItem('recent_visitor_fingerprints', JSON.stringify(visits));
        
      } catch (error) {
        console.error('Error parsing visitor fingerprints:', error);
        // Fallback: treat as new visitor
        const visits = { [fingerprint]: currentTime };
        localStorage.setItem('recent_visitor_fingerprints', JSON.stringify(visits));
      }
    } else {
      // First time visitor
      const visits = { [fingerprint]: currentTime };
      localStorage.setItem('recent_visitor_fingerprints', JSON.stringify(visits));
    }
    
    return true;
  };

  const isNewSession = (fingerprint: string): boolean => {
    const currentTime = Date.now();
    const sessionTimeout = 30 * 60 * 1000; // 30 minutes session timeout
    
    // Check for existing session with same fingerprint
    const existingSession = sessionStorage.getItem('visitor_session');
    
    if (existingSession) {
      try {
        const session: VisitorSession = JSON.parse(existingSession);
        const timeDiff = currentTime - session.timestamp;
        
        // If session is still valid and same fingerprint, it's not a new session
        if (timeDiff < sessionTimeout && session.fingerprint === fingerprint) {
          return false;
        }
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
    
    return true;
  };

  const trackUniqueVisit = (): boolean => {
    if (hasTrackedVisit) return false;
    
    const fingerprint = generateFingerprint();
    const isNewSession = isNewUniqueVisitor(fingerprint);
    
    if (isNewSession) {
      // Create new session
      const newSession: VisitorSession = {
        sessionId: generateSessionId(),
        timestamp: Date.now(),
        isNewVisitor: true,
        fingerprint: fingerprint
      };
      
      // Store session data
      sessionStorage.setItem('visitor_session', JSON.stringify(newSession));
      
      setHasTrackedVisit(true);
      return true;
    }
    
    setHasTrackedVisit(true);
    return false;
  };

  const updateSessionActivity = () => {
    const existingSession = sessionStorage.getItem('visitor_session');
    if (existingSession) {
      try {
        const session: VisitorSession = JSON.parse(existingSession);
        session.timestamp = Date.now();
        sessionStorage.setItem('visitor_session', JSON.stringify(session));
      } catch (error) {
        console.error('Error updating session activity:', error);
      }
    }
  };

  // Clean up old fingerprints periodically
  const cleanupOldFingerprints = () => {
    try {
      const recentVisits = localStorage.getItem('recent_visitor_fingerprints');
      if (recentVisits) {
        const visits: { [key: string]: number } = JSON.parse(recentVisits);
        const currentTime = Date.now();
        const weekAgo = currentTime - (7 * 24 * 60 * 60 * 1000); // Keep data for 1 week
        
        let hasChanges = false;
        Object.keys(visits).forEach(fp => {
          if (visits[fp] < weekAgo) {
            delete visits[fp];
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          localStorage.setItem('recent_visitor_fingerprints', JSON.stringify(visits));
        }
      }
    } catch (error) {
      console.error('Error cleaning up fingerprints:', error);
    }
  };

  useEffect(() => {
    // Update session activity every 5 minutes to keep session alive
    const activityInterval = setInterval(updateSessionActivity, 5 * 60 * 1000);
    
    // Clean up old fingerprints every hour
    const cleanupInterval = setInterval(cleanupOldFingerprints, 60 * 60 * 1000);
    
    // Initial cleanup
    cleanupOldFingerprints();
    
    return () => {
      clearInterval(activityInterval);
      clearInterval(cleanupInterval);
    };
  }, []);

  return {
    trackUniqueVisit,
    hasTrackedVisit
  };
}