import { useState, useEffect, useRef, useCallback } from "react";
import type {
  TimerConfig,
  TimerStatus,
  TimerState,
  TimerPhase,
} from "../types/timer";

export function useTimer(config: TimerConfig) {
  const [status, setStatus] = useState<TimerStatus>({
    state: "idle",
    phase: "prep",
    currentInterval: 0,
    totalIntervals: config.intervalCount,
    timeRemaining: config.prepTimeS,
  });

  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const phaseStartTimeRef = useRef<number>(0);
  const phaseDurationRef = useRef<number>(0);

  const start = useCallback(() => {
    if (status.state === "idle") {
      setStatus((prev) => ({
        ...prev,
        state: "preparing",
        phase: "prep",
        currentInterval: 0,
        timeRemaining: config.prepTimeS,
      }));
      startTimeRef.current = performance.now();
      phaseStartTimeRef.current = 0;
      phaseDurationRef.current = config.prepTimeS * 1000;
    }
  }, [status.state, config.prepTimeS]);

  const pause = useCallback(() => {
    if (status.state === "working" || status.state === "resting") {
      setStatus((prev) => ({ ...prev, state: "paused" }));
      pausedTimeRef.current = status.timeRemaining;
    }
  }, [status.state, status.timeRemaining]);

  const resume = useCallback(() => {
    if (status.state === "paused") {
      setStatus((prev) => ({
        ...prev,
        state: prev.phase === "work" ? "working" : "resting",
      }));
      if (startTimeRef.current !== null) {
        // Adjust start time to account for pause
        const pauseDuration = pausedTimeRef.current * 1000;
        phaseStartTimeRef.current =
          performance.now() - (phaseDurationRef.current - pauseDuration);
      }
    }
  }, [status.state, status.phase]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setStatus({
      state: "idle",
      phase: "prep",
      currentInterval: 0,
      totalIntervals: config.intervalCount,
      timeRemaining: config.prepTimeS,
    });
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, [config.intervalCount, config.prepTimeS]);

  useEffect(() => {
    if (
      status.state === "paused" ||
      status.state === "idle" ||
      status.state === "complete"
    ) {
      return;
    }

    const tick = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
        phaseStartTimeRef.current = timestamp;
      }

      const phaseElapsed = timestamp - phaseStartTimeRef.current;
      const phaseRemaining = Math.max(
        0,
        phaseDurationRef.current - phaseElapsed
      );
      const timeRemaining = Math.ceil(phaseRemaining / 1000);

      setStatus((prev) => ({
        ...prev,
        timeRemaining,
      }));

      // Check if phase is complete
      if (phaseRemaining <= 0) {
        // Transition to next phase
        if (status.state === "preparing") {
          // Move to first work interval
          setStatus((prev) => ({
            ...prev,
            state: "working",
            phase: "work",
            currentInterval: 1,
            timeRemaining: config.workIntervalS,
          }));
          phaseStartTimeRef.current = timestamp;
          phaseDurationRef.current = config.workIntervalS * 1000;
        } else if (status.state === "working") {
          // Move to rest (unless it's the last interval)
          if (status.currentInterval >= config.intervalCount) {
            // Workout complete
            setStatus((prev) => ({
              ...prev,
              state: "complete",
              timeRemaining: 0,
            }));
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            return;
          } else {
            // Move to rest
            setStatus((prev) => ({
              ...prev,
              state: "resting",
              phase: "rest",
              timeRemaining: config.restIntervalS,
            }));
            phaseStartTimeRef.current = timestamp;
            phaseDurationRef.current = config.restIntervalS * 1000;
          }
        } else if (status.state === "resting") {
          // Move to next work interval
          setStatus((prev) => ({
            ...prev,
            state: "working",
            phase: "work",
            currentInterval: prev.currentInterval + 1,
            timeRemaining: config.workIntervalS,
          }));
          phaseStartTimeRef.current = timestamp;
          phaseDurationRef.current = config.workIntervalS * 1000;
        }
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [status.state, status.currentInterval, config]);

  return {
    status,
    start,
    pause,
    resume,
    stop,
  };
}
