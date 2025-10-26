import { useState } from "react";
import type { TimerState } from "../types/timer";

interface TimerControlsProps {
  timerState: TimerState;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function TimerControls({
  timerState,
  onPause,
  onResume,
  onStop,
}: TimerControlsProps) {
  const [showStopConfirm, setShowStopConfirm] = useState(false);

  const handleStopClick = () => {
    setShowStopConfirm(true);
  };

  const handleConfirmStop = () => {
    setShowStopConfirm(false);
    onStop();
  };

  const handleCancelStop = () => {
    setShowStopConfirm(false);
  };

  return (
    <>
      <div className="flex gap-4 mt-12">
        {(timerState === "working" ||
          timerState === "resting" ||
          timerState === "preparing") && (
          <button
            onClick={onPause}
            className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold text-lg transition-colors"
          >
            Pause
          </button>
        )}

        {timerState === "paused" && (
          <button
            onClick={onResume}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold text-lg transition-colors"
          >
            Resume
          </button>
        )}

        <button
          onClick={handleStopClick}
          className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-lg transition-colors"
        >
          Stop
        </button>
      </div>

      {/* Stop Confirmation Modal */}
      {showStopConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-4">Stop Workout?</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to stop the workout? Your progress will be
              lost.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleCancelStop}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStop}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
