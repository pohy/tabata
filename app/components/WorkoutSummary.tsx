import { Link } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import type { WorkoutPreset } from "../types/preset";

interface WorkoutSummaryProps {
  preset: WorkoutPreset;
  onRestart: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString();
}

export function WorkoutSummary({ preset, onRestart }: WorkoutSummaryProps) {
  const totalDuration =
    preset.prepTimeS +
    (preset.workIntervalS + preset.restIntervalS) * preset.intervalCount;
  const totalWorkTime = preset.workIntervalS * preset.intervalCount;
  const totalRestTime = preset.restIntervalS * preset.intervalCount;
  const completionTime = Date.now();

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-6xl font-bold">Workout Complete!</h1>
        <p className="text-2xl text-muted-foreground">
          Great job on completing {preset.name}!
        </p>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Workout Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <p className="text-muted-foreground">Total Duration</p>
              <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground">Intervals</p>
              <p className="text-2xl font-bold">{preset.intervalCount}</p>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground">Work Time</p>
              <p className="text-2xl font-bold">{formatDuration(totalWorkTime)}</p>
            </div>
            <div className="text-left">
              <p className="text-muted-foreground">Rest Time</p>
              <p className="text-2xl font-bold">{formatDuration(totalRestTime)}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Completed at {formatTime(completionTime)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button onClick={onRestart} variant="outline" size="lg">
          Restart Workout
        </Button>
        <Button asChild size="lg">
          <Link to="/" viewTransition>Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}

