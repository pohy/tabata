import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "./ui/field";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";

interface PresetFormData {
  name: string;
  workIntervalS: number;
  restIntervalS: number;
  intervalCount: number;
  prepTimeS: number;
  description?: string;
}

interface PresetFormProps {
  initialData?: PresetFormData;
  onSubmit: (data: PresetFormData) => void;
}

export function PresetForm({ initialData, onSubmit }: PresetFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [workIntervalS, setWorkIntervalS] = useState(initialData?.workIntervalS || 20);
  const [restIntervalS, setRestIntervalS] = useState(initialData?.restIntervalS || 10);
  const [intervalCount, setIntervalCount] = useState(initialData?.intervalCount || 8);
  const [prepTimeS, setPrepTimeS] = useState(initialData?.prepTimeS || 10);
  const [description, setDescription] = useState(initialData?.description || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSeconds = prepTimeS + (workIntervalS + restIntervalS) * intervalCount;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.length > 50) {
      newErrors.name = "Name must be 50 characters or less";
    }

    if (workIntervalS < 10 || workIntervalS > 120) {
      newErrors.workIntervalS = "Work interval must be between 10 and 120 seconds";
    }

    if (restIntervalS < 5 || restIntervalS > 120) {
      newErrors.restIntervalS = "Rest interval must be between 5 and 120 seconds";
    }

    if (intervalCount < 1 || intervalCount > 50) {
      newErrors.intervalCount = "Interval count must be between 1 and 50";
    }

    if (prepTimeS < 0 || prepTimeS > 30) {
      newErrors.prepTimeS = "Prep time must be between 0 and 30 seconds";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        name: name.trim(),
        workIntervalS,
        restIntervalS,
        intervalCount,
        prepTimeS,
        description: description.trim() || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <FieldSet>
        <FieldGroup className="gap-6">
          {/* Name Field */}
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name">Preset Name</FieldLabel>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My Custom Workout"
              aria-invalid={!!errors.name}
            />
            <FieldDescription>Give your workout preset a memorable name</FieldDescription>
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>

          {/* Description Field */}
          <Field>
            <FieldLabel htmlFor="description">Description (Optional)</FieldLabel>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Intense cardio workout"
            />
            <FieldDescription>Add a short description of your workout</FieldDescription>
          </Field>

          {/* Work Interval */}
          <Field data-invalid={!!errors.workIntervalS}>
            <FieldLabel htmlFor="workIntervalS">
              Work Interval: {workIntervalS}s
            </FieldLabel>
            <div className="flex items-center gap-4">
              <Slider
                id="workIntervalS"
                value={[workIntervalS]}
                onValueChange={([value]) => setWorkIntervalS(value)}
                min={10}
                max={120}
                step={5}
                className="flex-1"
                aria-invalid={!!errors.workIntervalS}
              />
              <Input
                type="number"
                value={workIntervalS}
                onChange={(e) => setWorkIntervalS(Number(e.target.value))}
                min={10}
                max={120}
                className="w-20"
              />
            </div>
            <FieldDescription>Duration of each work period (10-120 seconds)</FieldDescription>
            {errors.workIntervalS && <FieldError>{errors.workIntervalS}</FieldError>}
          </Field>

          {/* Rest Interval */}
          <Field data-invalid={!!errors.restIntervalS}>
            <FieldLabel htmlFor="restIntervalS">
              Rest Interval: {restIntervalS}s
            </FieldLabel>
            <div className="flex items-center gap-4">
              <Slider
                id="restIntervalS"
                value={[restIntervalS]}
                onValueChange={([value]) => setRestIntervalS(value)}
                min={5}
                max={120}
                step={5}
                className="flex-1"
                aria-invalid={!!errors.restIntervalS}
              />
              <Input
                type="number"
                value={restIntervalS}
                onChange={(e) => setRestIntervalS(Number(e.target.value))}
                min={5}
                max={120}
                className="w-20"
              />
            </div>
            <FieldDescription>Duration of each rest period (5-120 seconds)</FieldDescription>
            {errors.restIntervalS && <FieldError>{errors.restIntervalS}</FieldError>}
          </Field>

          {/* Interval Count */}
          <Field data-invalid={!!errors.intervalCount}>
            <FieldLabel htmlFor="intervalCount">
              Number of Intervals: {intervalCount}
            </FieldLabel>
            <div className="flex items-center gap-4">
              <Slider
                id="intervalCount"
                value={[intervalCount]}
                onValueChange={([value]) => setIntervalCount(value)}
                min={1}
                max={50}
                step={1}
                className="flex-1"
                aria-invalid={!!errors.intervalCount}
              />
              <Input
                type="number"
                value={intervalCount}
                onChange={(e) => setIntervalCount(Number(e.target.value))}
                min={1}
                max={50}
                className="w-20"
              />
            </div>
            <FieldDescription>Total number of work/rest cycles (1-50)</FieldDescription>
            {errors.intervalCount && <FieldError>{errors.intervalCount}</FieldError>}
          </Field>

          {/* Prep Time */}
          <Field data-invalid={!!errors.prepTimeS}>
            <FieldLabel htmlFor="prepTimeS">
              Preparation Time: {prepTimeS}s
            </FieldLabel>
            <div className="flex items-center gap-4">
              <Slider
                id="prepTimeS"
                value={[prepTimeS]}
                onValueChange={([value]) => setPrepTimeS(value)}
                min={0}
                max={30}
                step={5}
                className="flex-1"
                aria-invalid={!!errors.prepTimeS}
              />
              <Input
                type="number"
                value={prepTimeS}
                onChange={(e) => setPrepTimeS(Number(e.target.value))}
                min={0}
                max={30}
                className="w-20"
              />
            </div>
            <FieldDescription>Countdown before workout starts (0-30 seconds)</FieldDescription>
            {errors.prepTimeS && <FieldError>{errors.prepTimeS}</FieldError>}
          </Field>

          {/* Total Duration Display */}
          <Card>
            <CardHeader className="text-center pb-3">
              <CardDescription>Total Workout Duration</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-4xl font-bold">
                {minutes}:{seconds.toString().padStart(2, "0")}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Including {prepTimeS}s preparation time
              </p>
            </CardContent>
          </Card>
        </FieldGroup>
      </FieldSet>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end">
        <Button asChild type="button" variant="outline">
          <Link to="/" viewTransition>Cancel</Link>
        </Button>
        <Button type="submit">
          Save Preset
        </Button>
      </div>
    </form>
  );
}

