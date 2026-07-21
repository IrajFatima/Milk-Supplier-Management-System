import { useEffect, useRef } from "react";

const INACTIVITY_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days

const EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
];

export const useInactivityLogout = (
  isAuthenticated: boolean,
  onLogout: () => void
): void => {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const resetTimer = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        onLogout();
      }, INACTIVITY_TIMEOUT);
    };

    resetTimer();

    EVENTS.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      EVENTS.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated, onLogout]);
};