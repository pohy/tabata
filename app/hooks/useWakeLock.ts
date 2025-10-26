import { useEffect, useRef } from "react";

// TypeScript definitions for Wake Lock API
interface WakeLockSentinel {
  released: boolean;
  release(): Promise<void>;
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
}

interface WakeLock {
  request(type: "screen"): Promise<WakeLockSentinel>;
}

declare global {
  interface Navigator {
    wakeLock?: WakeLock;
  }
}

export function useWakeLock(enabled: boolean) {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || !("wakeLock" in navigator)) {
      return;
    }

    const requestWakeLock = async () => {
      try {
        wakeLockRef.current = await navigator.wakeLock!.request("screen");
        
        // Re-acquire wake lock if page becomes visible again
        const handleVisibilityChange = async () => {
          if (
            wakeLockRef.current !== null &&
            wakeLockRef.current.released &&
            document.visibilityState === "visible" &&
            enabled
          ) {
            try {
              wakeLockRef.current = await navigator.wakeLock!.request("screen");
            } catch (err) {
              console.error("Failed to re-acquire wake lock:", err);
            }
          }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
          document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
      } catch (err) {
        console.error("Failed to acquire wake lock:", err);
      }
    };

    requestWakeLock();

    return () => {
      if (wakeLockRef.current !== null && !wakeLockRef.current.released) {
        wakeLockRef.current.release().catch((err) => {
          console.error("Failed to release wake lock:", err);
        });
      }
    };
  }, [enabled]);

  return wakeLockRef;
}


