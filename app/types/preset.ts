import type { TimerConfig } from "./timer";

export interface WorkoutPreset extends TimerConfig {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  isDefault: boolean;
}

