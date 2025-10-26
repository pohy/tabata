import type { TimerStatus, TimerConfig } from "../types/timer";
import { CircularProgress } from "./CircularProgress";

interface TimerDisplayProps {
  status: TimerStatus;
  config: TimerConfig;
}

export function TimerDisplay({ status, config }: TimerDisplayProps) {
  const getPhaseLabel = () => {
    if (status.state === "resuming") {
      return "RESUMING";
    }
    if (status.state === "paused") {
      return "PAUSED";
    }
    switch (status.phase) {
      case "prep":
        return "GET READY";
      case "work":
        return "WORK";
      case "rest":
        return "REST";
    }
  };

  const getPhaseDuration = () => {
    if (status.state === "resuming") {
      return 3; // Resume countdown duration
    }
    switch (status.phase) {
      case "prep":
        return config.prepTimeS;
      case "work":
        return config.workIntervalS;
      case "rest":
        return config.restIntervalS;
    }
  };

  const getPhaseColor = () => {
    switch (status.phase) {
      case "prep":
        return "hsl(var(--muted))";
      case "work":
        return "hsl(var(--chart-1))";
      case "rest":
        return "hsl(var(--chart-5))";
    }
  };

  const getDisplayTime = () => {
    if (status.state === "resuming" && status.resumeCountdown) {
      return status.resumeCountdown;
    }
    return status.timeRemaining;
  };

  const phaseDuration = getPhaseDuration();
  const displayTime = getDisplayTime();
  const progress = status.state === "resuming" && status.resumeCountdown
    ? 1 - status.resumeCountdown / 3
    : 1 - status.timeRemaining / phaseDuration;

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Phase Label */}
      <div className="text-5xl font-bold tracking-wide transition-all duration-300 animate-in fade-in">
        {getPhaseLabel()}
      </div>

      {/* Circular Progress with Timer */}
      <div className="relative">
        <CircularProgress
          progress={progress}
          size={300}
          strokeWidth={12}
          color={getPhaseColor()}
        />
        {/* Timer in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-9xl font-bold tabular-nums transition-all duration-300">
            {displayTime}
          </div>
        </div>
      </div>

      {/* Interval Counter */}
      <div className="text-3xl font-semibold transition-all duration-200">
        {status.currentInterval} of {status.totalIntervals}
      </div>
    </div>
  );
}

