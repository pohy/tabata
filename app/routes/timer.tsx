import type { Route } from "./+types/timer";
import { useTimer } from "../hooks/useTimer";
import { TimerDisplay } from "../components/TimerDisplay";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Timer - Tabata" },
    { name: "description", content: "Active workout timer" },
  ];
}

export default function Timer() {
  // Hardcoded Classic Tabata: 20s work / 10s rest / 8 intervals / 10s prep
  const config = {
    workIntervalS: 20,
    restIntervalS: 10,
    intervalCount: 8,
    prepTimeS: 10,
  };

  const { status, start, pause, resume, stop } = useTimer(config);

  const getBackgroundColor = () => {
    if (status.state === "idle" || status.state === "complete") {
      return "bg-gray-800";
    }
    switch (status.phase) {
      case "prep":
        return "bg-gray-700";
      case "work":
        return "bg-cyan-600";
      case "rest":
        return "bg-orange-500";
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

  const calculateOverallProgress = () => {
    if (status.state === "idle") return 0;
    if (status.state === "complete") return 100;

    // Calculate phase progress within current interval
    const phaseDuration = getPhaseDuration();
    const phaseProgress = 1 - status.timeRemaining / phaseDuration;

    // Each interval has 2 phases: work + rest
    // Prep doesn't count toward overall progress
    if (status.state === "preparing") return 0;

    let completedPhases = (status.currentInterval - 1) * 2;
    if (status.phase === "rest") {
      completedPhases += 1; // work is complete
    }

    const totalPhases = status.totalIntervals * 2;
    const currentPhaseContribution = phaseProgress / totalPhases;
    const overallProgress = (completedPhases / totalPhases + currentPhaseContribution) * 100;

    return Math.min(100, Math.max(0, overallProgress));
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div
      className={`min-h-screen flex flex-col ${getBackgroundColor()} text-white transition-colors duration-500`}
    >
      {/* Overall Progress Bar */}
      <div className="w-full h-2 bg-black bg-opacity-20">
        <div
          className="h-full bg-white bg-opacity-60 transition-all duration-300"
          style={{ width: `${overallProgress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {status.state === "idle" && (
          <div className="text-center space-y-8">
            <h1 className="text-4xl font-bold">Classic Tabata</h1>
            <p className="text-xl text-gray-300">
              20s work / 10s rest / 8 intervals
            </p>
            <button
              onClick={start}
              className="px-12 py-4 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-2xl transition-colors"
            >
              Start Workout
            </button>
          </div>
        )}

        {status.state === "complete" && (
          <div className="text-center space-y-8">
            <h1 className="text-6xl font-bold">Workout Complete!</h1>
            <p className="text-2xl text-gray-300">Great job!</p>
            <button
              onClick={stop}
              className="px-12 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-2xl transition-colors"
            >
              Finish
            </button>
          </div>
        )}

        {status.state !== "idle" && status.state !== "complete" && (
          <>
            <TimerDisplay status={status} config={config} />

            {/* Controls */}
            <div className="flex gap-4 mt-12">
              {(status.state === "working" ||
                status.state === "resting" ||
                status.state === "preparing") && (
                <button
                  onClick={pause}
                  className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold text-lg transition-colors"
                >
                  Pause
                </button>
              )}

              {status.state === "paused" && (
                <button
                  onClick={resume}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg transition-colors"
                >
                  Resume
                </button>
              )}

              <button
                onClick={stop}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-lg transition-colors"
              >
                Stop
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

