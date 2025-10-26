import type { TimerState } from "../types/timer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

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
  return (
    <div className="flex gap-4 mt-12">
      {(timerState === "working" ||
        timerState === "resting" ||
        timerState === "preparing") && (
        <Button onClick={onPause} variant="secondary" size="lg">
          Pause
        </Button>
      )}

      {timerState === "paused" && (
        <Button onClick={onResume} size="lg">
          Resume
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="lg">
            Stop
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop Workout?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop the workout? Your progress will be
              lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onStop}>Stop</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
