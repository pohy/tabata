import { useState, useCallback, useRef } from "react";

export function useAudio() {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(
    (soundFile: string, vibrationPattern?: number | number[]) => {
      if (isMuted) return;

      // Attempt to play audio file
      try {
        const audio = new Audio(`/sounds/${soundFile}`);
        audio.volume = 0.7;
        audio.play().catch((error) => {
          // Silently fail if audio file doesn't exist
          console.debug(`Audio file ${soundFile} not available:`, error);
        });
        audioRef.current = audio;
      } catch (error) {
        // Silently handle any audio errors
        console.debug(`Error loading audio file ${soundFile}:`, error);
      }

      // Trigger vibration if supported
      if (vibrationPattern && navigator.vibrate) {
        try {
          navigator.vibrate(vibrationPattern);
        } catch (error) {
          // Vibration not supported or failed
          console.debug("Vibration not supported:", error);
        }
      }
    },
    [isMuted]
  );

  const playWork = useCallback(() => {
    playSound("work.ogg", [150, 50, 150]);
  }, [playSound]);

  const playRest = useCallback(() => {
    playSound("rest.ogg", 100);
  }, [playSound]);

  const playPrepareForRest = useCallback(() => {
    playSound("prepare-rest.ogg", 100);
  }, [playSound]);

  const playPrepareForWork = useCallback(() => {
    playSound("prepare-work.ogg", [100, 50, 100, 50, 100]);
  }, [playSound]);

  const playDone = useCallback(() => {
    playSound("done.ogg", [200, 100, 200, 100, 200]);
  }, [playSound]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return {
    playWork,
    playRest,
    playPrepareForRest,
    playPrepareForWork,
    playDone,
    isMuted,
    toggleMute,
  };
}
