import type { WorkoutPreset } from "../types/preset";

interface PresetCardProps {
  preset: WorkoutPreset;
  onStart: (preset: WorkoutPreset) => void;
  onDelete?: (preset: WorkoutPreset) => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function calculateTotalDuration(preset: WorkoutPreset): string {
  const total =
    preset.prepTimeS +
    (preset.workIntervalS + preset.restIntervalS) * preset.intervalCount;
  return formatDuration(total);
}

export function PresetCard({ preset, onStart, onDelete }: PresetCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-4 hover:bg-gray-750 transition-colors">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">{preset.name}</h3>
        {preset.description && (
          <p className="text-gray-400 text-sm">{preset.description}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-900 rounded p-3">
          <div className="text-gray-400">Work</div>
          <div className="text-xl font-semibold text-cyan-400">
            {preset.workIntervalS}s
          </div>
        </div>
        <div className="bg-gray-900 rounded p-3">
          <div className="text-gray-400">Rest</div>
          <div className="text-xl font-semibold text-orange-400">
            {preset.restIntervalS}s
          </div>
        </div>
        <div className="bg-gray-900 rounded p-3">
          <div className="text-gray-400">Intervals</div>
          <div className="text-xl font-semibold text-white">
            {preset.intervalCount}
          </div>
        </div>
        <div className="bg-gray-900 rounded p-3">
          <div className="text-gray-400">Total</div>
          <div className="text-xl font-semibold text-white">
            {calculateTotalDuration(preset)}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onStart(preset)}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
        >
          Start
        </button>
        {!preset.isDefault && onDelete && (
          <button
            onClick={() => onDelete(preset)}
            className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            title="Delete preset"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

