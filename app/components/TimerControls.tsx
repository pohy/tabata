import { useRef } from "react";
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
  onSkip: () => void;
}

export function TimerControls({
  timerState,
  onPause,
  onResume,
  onStop,
  onSkip,
}: TimerControlsProps) {
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      return;
    }

    // Dialog opening - pause if timer is active
    if (
      timerState === "working" ||
      timerState === "resting" ||
      timerState === "preparing"
    ) {
      onPause();
    } else if (timerState === "paused") {
      onResume();
    }
  };

  return (
    <div className="flex gap-4 mt-12">
      {(timerState === "working" ||
        timerState === "resting" ||
        timerState === "preparing") && (
        <>
          <Button onClick={onPause} variant="secondary" size="lg">
            Pause
          </Button>
          {(timerState === "working" || timerState === "resting") && (
            <Button onClick={onSkip} variant="outline" size="lg">
              Skip
            </Button>
          )}
        </>
      )}

      {timerState === "paused" && (
        <Button onClick={onResume} size="lg">
          Resume
        </Button>
      )}

      <AlertDialog onOpenChange={handleDialogOpenChange}>
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
