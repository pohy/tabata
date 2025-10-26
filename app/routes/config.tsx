import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { Route } from "./+types/config";
import type { WorkoutPreset } from "../types/preset";
import {
  getPresetById,
  createPreset,
  updatePreset,
  deletePreset,
} from "../utils/storage";
import { PresetForm } from "../components/PresetForm";
import { Button } from "../components/ui/button";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: params.id ? "Edit Preset" : "Create Preset" },
    { name: "description", content: "Configure workout preset" },
  ];
}

export default function Config() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preset, setPreset] = useState<WorkoutPreset | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const loadedPreset = getPresetById(id);
      if (loadedPreset) {
        setPreset(loadedPreset);
      } else {
        // Preset not found, redirect to home
        navigate("/", { replace: true });
      }
      setLoading(false);
    }
  }, [id, navigate]);

  const handleSubmit = (data: {
    name: string;
    workIntervalS: number;
    restIntervalS: number;
    intervalCount: number;
    prepTimeS: number;
    description?: string;
  }) => {
    if (id && preset) {
      // Update existing preset
      updatePreset(id, data);
    } else {
      // Create new preset
      createPreset(data);
    }
    navigate("/");
  };

  const handleDelete = () => {
    if (!id || !preset) return;

    if (confirm(`Delete "${preset.name}"? This action cannot be undone.`)) {
      if (deletePreset(id)) {
        navigate("/");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">
            {id ? "Edit Preset" : "Create New Preset"}
          </h1>
          <p className="text-muted-foreground">
            {id
              ? "Modify your workout configuration"
              : "Configure your custom interval training workout"}
          </p>
        </header>

        <PresetForm initialData={preset || undefined} onSubmit={handleSubmit} />

        {id && preset && (
          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-destructive">
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Once you delete a preset, there is no going back.
                </p>
              </div>
              <Button variant="destructive" onClick={handleDelete}>
                Delete Preset
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
