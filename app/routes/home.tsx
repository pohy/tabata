import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import type { WorkoutPreset } from "../types/preset";
import { loadPresets, initializeStorage, deletePreset } from "../utils/storage";
import { PresetCard } from "../components/PresetCard";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tabata Timer" },
    { name: "description", content: "Interval training timer" },
  ];
}

export default function Home() {
  const [presets, setPresets] = useState<WorkoutPreset[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    initializeStorage();
    setPresets(loadPresets());
  }, []);

  const handleStart = (preset: WorkoutPreset) => {
    navigate("/timer", { state: { preset } });
  };

  const handleDelete = (preset: WorkoutPreset) => {
    if (confirm(`Delete "${preset.name}"?`)) {
      if (deletePreset(preset.id)) {
        setPresets(loadPresets());
      }
    }
  };

  const handleCreateNew = () => {
    // TODO: Phase 6 - Navigate to config screen
    alert("Preset configuration coming in Phase 6");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Tabata Timer</h1>
          <p className="text-xl text-gray-400">
            Choose a workout preset to begin
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onStart={handleStart}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleCreateNew}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg transition-colors"
          >
            + Create New Preset
          </button>
        </div>
      </div>
    </div>
  );
}

