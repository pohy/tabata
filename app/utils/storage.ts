import type { WorkoutPreset } from "../types/preset";

const STORAGE_KEY = "tabata-presets";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getDefaultPresets(): WorkoutPreset[] {
  const now = Date.now();
  return [
    {
      id: "default-classic",
      name: "Classic Tabata",
      description: "Traditional high-intensity interval training",
      workIntervalS: 20,
      restIntervalS: 10,
      intervalCount: 8,
      prepTimeS: 10,
      createdAt: now,
      isDefault: true,
    },
    {
      id: "default-hiit",
      name: "HIIT Standard",
      description: "Balanced high-intensity workout",
      workIntervalS: 30,
      restIntervalS: 15,
      intervalCount: 10,
      prepTimeS: 10,
      createdAt: now,
      isDefault: true,
    },
    {
      id: "default-beginner",
      name: "Beginner",
      description: "Gentle introduction to interval training",
      workIntervalS: 15,
      restIntervalS: 20,
      intervalCount: 6,
      prepTimeS: 15,
      createdAt: now,
      isDefault: true,
    },
    {
      id: "default-advanced",
      name: "Advanced",
      description: "Intense workout for experienced athletes",
      workIntervalS: 40,
      restIntervalS: 10,
      intervalCount: 12,
      prepTimeS: 5,
      createdAt: now,
      isDefault: true,
    },
  ];
}

export function initializeStorage(): void {
  if (typeof window === "undefined") return;

  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const defaults = getDefaultPresets();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  }
}

export function loadPresets(): WorkoutPreset[] {
  if (typeof window === "undefined") return getDefaultPresets();

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaults = getDefaultPresets();
      savePresets(defaults);
      return defaults;
    }
    const loadedPresets = JSON.parse(stored) as WorkoutPreset[];
    return loadedPresets.sort((a, b) => {
      return (
        a.name.localeCompare(b.name) +
        ((a.isDefault ? 1 : -1) - (b.isDefault ? 1 : -1))
      );
    });
  } catch {
    return getDefaultPresets();
  }
}

export function savePresets(presets: WorkoutPreset[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error("Failed to save presets:", error);
  }
}

export function getPresetById(id: string): WorkoutPreset | undefined {
  const presets = loadPresets();
  return presets.find((preset) => preset.id === id);
}

export function createPreset(
  preset: Omit<WorkoutPreset, "id" | "createdAt" | "isDefault">
): WorkoutPreset {
  const newPreset: WorkoutPreset = {
    ...preset,
    id: generateId(),
    createdAt: Date.now(),
    isDefault: false,
  };

  const presets = loadPresets();
  presets.push(newPreset);
  savePresets(presets);

  return newPreset;
}

export function updatePreset(
  id: string,
  changes: Partial<Omit<WorkoutPreset, "id" | "createdAt" | "isDefault">>
): WorkoutPreset | null {
  const presets = loadPresets();
  const index = presets.findIndex((p) => p.id === id);

  if (index === -1) return null;

  presets[index] = {
    ...presets[index],
    ...changes,
  };

  savePresets(presets);
  return presets[index];
}

export function deletePreset(id: string): boolean {
  const presets = loadPresets();
  const preset = presets.find((p) => p.id === id);

  // Prevent deleting default presets
  if (!preset || preset.isDefault) return false;

  const filtered = presets.filter((p) => p.id !== id);
  savePresets(filtered);

  return true;
}
