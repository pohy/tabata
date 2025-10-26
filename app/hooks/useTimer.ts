import { useState, useEffect, useRef, useCallback } from "react";
import type {
  TimerConfig,
  TimerStatus,
  TimerState,
  TimerPhase,
} from "../types/timer";

export type PhaseChangeEvent =
  | "prep-countdown"
  | "prep-to-work"
  | "work-to-rest"
  | "rest-to-work"
  | "complete";

interface UseTimerOptions {
  onPhaseChange?: (event: PhaseChangeEvent) => void;
}

export function useTimer(config: TimerConfig, options?: UseTimerOptions) {
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
  const resumeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pausedStateRef = useRef<TimerState | null>(null);
  const lastTimeRemainingRef = useRef<number>(0);

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
    if (
      status.state === "working" ||
      status.state === "resting" ||
      status.state === "preparing"
    ) {
      pausedStateRef.current = status.state;
      pausedTimeRef.current = status.timeRemaining;
      lastTimeRemainingRef.current = status.timeRemaining;
      setStatus((prev) => ({ ...prev, state: "paused" }));
    }
  }, [status.state, status.timeRemaining]);

  const resume = useCallback(() => {
    if (status.state === "paused") {
      // Start 3-second resuming countdown
      let countdown = 3;
      setStatus((prev) => ({
        ...prev,
        state: "resuming",
        resumeCountdown: countdown,
      }));

      resumeIntervalRef.current = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          setStatus((prev) => ({
            ...prev,
            resumeCountdown: countdown,
          }));
        } else {
          // Resume to previous state
          if (resumeIntervalRef.current) {
            clearInterval(resumeIntervalRef.current);
            resumeIntervalRef.current = null;
          }

          const targetState = pausedStateRef.current || "working";
          setStatus((prev) => ({
            ...prev,
            state: targetState,
            resumeCountdown: undefined,
          }));

          // Adjust timing to account for pause
          if (startTimeRef.current !== null) {
            const pauseDuration = pausedTimeRef.current * 1000;
            phaseStartTimeRef.current =
              performance.now() - (phaseDurationRef.current - pauseDuration);
          }
        }
      }, 1000);
    }
  }, [status.state]);

  const stop = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (resumeIntervalRef.current) {
      clearInterval(resumeIntervalRef.current);
      resumeIntervalRef.current = null;
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
    pausedStateRef.current = null;
  }, [config.intervalCount, config.prepTimeS]);

  useEffect(() => {
    if (
      status.state === "paused" ||
      status.state === "idle" ||
      status.state === "complete" ||
      status.state === "resuming"
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

      // Trigger prep countdown event when reaching 3 seconds
      if (
        status.state === "preparing" &&
        timeRemaining === 3 &&
        lastTimeRemainingRef.current !== 3
      ) {
        options?.onPhaseChange?.("prep-countdown");
      }
      lastTimeRemainingRef.current = timeRemaining;

      setStatus((prev) => ({
        ...prev,
        timeRemaining,
      }));

      // Check if phase is complete
      if (phaseRemaining <= 0) {
        // Transition to next phase
        if (status.state === "preparing") {
          // Move to first work interval
          options?.onPhaseChange?.("prep-to-work");
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
            options?.onPhaseChange?.("complete");
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
            options?.onPhaseChange?.("work-to-rest");
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
          options?.onPhaseChange?.("rest-to-work");
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
      if (resumeIntervalRef.current) {
        clearInterval(resumeIntervalRef.current);
        resumeIntervalRef.current = null;
      }
    };
  }, [status.state, status.currentInterval, config, options]);

  return {
    status,
    start,
    pause,
    resume,
    stop,
  };
}
