import type { TimerStatus, TimerConfig } from "../types/timer";
import { CircularProgress } from "./CircularProgress";

interface TimerDisplayProps {
  status: TimerStatus;
  config: TimerConfig;
}

export function TimerDisplay({ status, config }: TimerDisplayProps) {
  const getPhaseLabel = () => {
    if (status.state === "resuming" && status.resumeCountdown) {
      return `Resuming in ${status.resumeCountdown}`;
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
        return "#9ca3af"; // gray
      case "work":
        return "#06b6d4"; // cyan
      case "rest":
        return "#f97316"; // orange
    }
  };

  const phaseDuration = getPhaseDuration();
  const progress = 1 - status.timeRemaining / phaseDuration;

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {/* Phase Label */}
      <div className="text-5xl font-bold tracking-wide">
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
          <div className="text-9xl font-bold tabular-nums">
            {status.timeRemaining}
          </div>
        </div>
      </div>

      {/* Interval Counter */}
      <div className="text-3xl font-semibold">
        {status.currentInterval} of {status.totalIntervals}
      </div>
    </div>
  );
}

