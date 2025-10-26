export type TimerState =
  | "idle"
  | "preparing"
  | "working"
  | "resting"
  | "paused"
  | "complete";

export type TimerPhase = "prep" | "work" | "rest";

export interface TimerConfig {
  workIntervalS: number; // seconds
  restIntervalS: number; // seconds
  intervalCount: number; // total count
  prepTimeS: number; // countdown before starting
}

export interface TimerStatus {
  state: TimerState;
  phase: TimerPhase;
  currentInterval: number;
  totalIntervals: number;
  timeRemaining: number;
}
