import type { Route } from "./+types/home";
import { useTimer } from "../hooks/useTimer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tabata Timer" },
    { name: "description", content: "Interval training timer" },
  ];
}

export default function Home() {
  // Hardcoded Classic Tabata: 20s work / 10s rest / 8 intervals / 10s prep
  const { status, start, pause, resume, stop } = useTimer({
    workIntervalS: 20,
    restIntervalS: 10,
    intervalCount: 8,
    prepTimeS: 10,
  });

  const getPhaseLabel = () => {
    switch (status.phase) {
      case "prep":
        return "GET READY";
      case "work":
        return "WORK";
      case "rest":
        return "REST";
      default:
        return "";
    }
  };

  const getStateLabel = () => {
    switch (status.state) {
      case "idle":
        return "Ready to start";
      case "complete":
        return "Workout Complete!";
      case "paused":
        return "PAUSED";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-900 text-white">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            Tabata Timer - Phase 1 Test
          </h1>
          <p className="text-gray-400 mb-8">
            Classic Tabata: 20s work / 10s rest / 8 intervals
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-8 space-y-6">
          {/* State/Phase Label */}
          <div className="text-center">
            {status.state !== "idle" && status.state !== "complete" && (
              <div className="text-4xl font-bold mb-2">{getPhaseLabel()}</div>
            )}
            {(status.state === "idle" ||
              status.state === "complete" ||
              status.state === "paused") && (
              <div className="text-2xl font-bold mb-2 text-yellow-400">
                {getStateLabel()}
              </div>
            )}
          </div>

          {/* Timer Display */}
          <div className="text-center">
            <div className="text-8xl font-bold tabular-nums">
              {status.timeRemaining}
            </div>
            <div className="text-sm text-gray-400 mt-2">seconds</div>
          </div>

          {/* Interval Counter */}
          {status.state !== "idle" && (
            <div className="text-center text-xl">
              Interval: {status.currentInterval} / {status.totalIntervals}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4 justify-center pt-4">
            {status.state === "idle" && (
              <button
                onClick={start}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg"
              >
                Start
              </button>
            )}

            {(status.state === "working" ||
              status.state === "resting" ||
              status.state === "preparing") && (
              <button
                onClick={pause}
                className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold text-lg"
              >
                Pause
              </button>
            )}

            {status.state === "paused" && (
              <button
                onClick={resume}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg"
              >
                Resume
              </button>
            )}

            {(status.state === "paused" ||
              status.state === "working" ||
              status.state === "resting" ||
              status.state === "preparing") && (
              <button
                onClick={stop}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-lg"
              >
                Stop
              </button>
            )}

            {status.state === "complete" && (
              <button
                onClick={stop}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg"
              >
                Restart
              </button>
            )}
          </div>

          {/* Debug Info */}
          <div className="text-xs text-gray-500 pt-4 border-t border-gray-700">
            <div>State: {status.state}</div>
            <div>Phase: {status.phase}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
