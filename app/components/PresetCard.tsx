import { Link } from "react-router";
import type { WorkoutPreset } from "../types/preset";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface PresetCardProps {
  preset: WorkoutPreset;
  onStart: (preset: WorkoutPreset) => void;
  onEdit?: (preset: WorkoutPreset) => void; // kept for compatibility, but using Link now
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

export function PresetCard({ preset, onStart, onEdit }: PresetCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">{preset.name}</CardTitle>
        {preset.description && (
          <CardDescription>{preset.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="space-y-1">
            <Badge variant="secondary" className="text-xs">
              Work
            </Badge>
            <div className="text-lg font-semibold">{preset.workIntervalS}s</div>
          </div>
          <div className="space-y-1">
            <Badge variant="secondary" className="text-xs">
              Rest
            </Badge>
            <div className="text-lg font-semibold">{preset.restIntervalS}s</div>
          </div>
          <div className="space-y-1">
            <Badge variant="secondary" className="text-xs">
              Intervals
            </Badge>
            <div className="text-lg font-semibold">{preset.intervalCount}</div>
          </div>
          <div className="space-y-1">
            <Badge variant="secondary" className="text-xs">
              Total
            </Badge>
            <div className="text-lg font-semibold">
              {calculateTotalDuration(preset)}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="gap-2 pt-3">
        <Button asChild variant="outline" size="sm" title="Edit preset">
          <Link to={`/config/${preset.id}`} viewTransition>
            Edit
          </Link>
        </Button>
        <Button onClick={() => onStart(preset)} className="flex-1" size="sm">
          Start
        </Button>
      </CardFooter>
    </Card>
  );
}
