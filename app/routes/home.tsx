import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/home";
import type { WorkoutPreset } from "../types/preset";
import { loadPresets, initializeStorage, deletePreset } from "../utils/storage";
import { PresetCard } from "../components/PresetCard";
import { Button } from "../components/ui/button";

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

  const handleEdit = (preset: WorkoutPreset) => {
    navigate(`/config/${preset.id}`);
  };

  const handleCreateNew = () => {
    navigate("/config");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold">Tabata Timer</h1>
          <p className="text-xl text-muted-foreground">
            Choose a workout preset to begin
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presets.map((preset) => (
            <PresetCard
              key={preset.id}
              preset={preset}
              onStart={handleStart}
              onEdit={handleEdit}
            />
          ))}
        </div>

        <div className="text-center">
          <Button onClick={handleCreateNew} size="lg">
            + Create New Preset
          </Button>
        </div>
      </div>
    </div>
  );
}
