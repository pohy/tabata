!-- 97df9cc3-b4a9-4321-acf5-c03b1c86aca5 282fc180-22a2-4847-a734-49a089a26be6 -->

# Feature-by-Feature Implementation Plan

**Strategy**: Build timer core first, then add preset management

## Phase 1: Core Timer Logic

**Goal**: Implement timer state machine and countdown logic with hardcoded values

**Deliverables**:

- Basic TypeScript interface for timer config (work/rest/intervals/prep)
- Timer hook with state machine: `idle → preparing → working → resting → complete`
- Accurate countdown using `requestAnimationFrame` with drift correction
- Auto-advance through intervals
- State transitions with proper timing
- Current interval tracking
- Test with hardcoded Classic Tabata (20s work / 10s rest / 8 intervals)

**Key Files**: `app/hooks/useTimer.ts`, `app/types/timer.ts`

---

## Phase 2: Timer Display & Progress Visualization

**Goal**: Create the active timer screen with visual indicators

**Deliverables**:

- Full-screen countdown display with large typography
- Dynamic background colors (cyan for work, orange for rest, gray for prep)
- Circular progress ring (SVG-based, depletes with time)
- Linear progress bar showing overall workout completion
- Interval counter ("3 of 8")
- Phase label ("WORK" / "REST" / "GET READY")
- Route setup for timer screen

**Key Files**: `app/routes/timer.tsx`, `app/components/CircularProgress.tsx`, `app/components/TimerDisplay.tsx`

---

## Phase 3: Controls & Audio Feedback

**Goal**: Add pause/resume/stop controls and audio cues

**Deliverables**:

- Pause button (freezes timer, shows "PAUSED" overlay)
- Resume button (3-second countdown before resuming)
- Stop button with confirmation modal
- Audio cues using Web Audio API:
- 3-2-1 beeps before work intervals
- Single beep for work → rest
- Double beep for rest → work
- Triple beep at completion
- Vibration API integration for haptic feedback

**Key Files**: `app/hooks/useAudio.ts`, `app/components/TimerControls.tsx`

---

## Phase 4: Preset Data Structure & Storage

**Goal**: Set up preset management foundation

**Deliverables**:

- TypeScript interfaces for `WorkoutPreset` (work/rest intervals, prep time, etc.)
- localStorage utilities for preset persistence
- Default presets loaded (Classic Tabata, HIIT Standard, Beginner, Advanced)
- Preset CRUD operations
- Connect timer to accept preset configurations

**Key Files**: `app/types/preset.ts`, `app/utils/storage.ts`

---

## Phase 5: Preset List & Home Screen

**Goal**: Display saved presets with quick-start functionality

**Deliverables**:

- Home screen UI showing preset cards
- Preset metadata display (name, intervals, durations)
- "Create New Preset" button
- Basic navigation to config and timer screens
- Delete preset functionality with confirmation
- Pass selected preset to timer

**Key Files**: `app/routes/home.tsx`, `app/components/PresetCard.tsx`

---

## Phase 6: Preset Configuration Interface

**Goal**: Build form to create and edit presets

**Deliverables**:

- Configuration form with sliders/inputs for:
- Work interval (10-120s)
- Rest interval (5-120s)
- Number of intervals (1-50)
- Preparation time (0-30s)
- Real-time total duration calculation
- Save/Cancel actions with localStorage persistence
- Preset name input with validation

**Key Files**: `app/routes/config.tsx`, `app/components/PresetForm.tsx`

---

## Phase 7: Polish & Mobile Optimization

**Goal**: Finalize UX with animations and responsive design

**Deliverables**:

- Zero pad workout duration in the workout preset card
- Use links that look like buttons instead of buttons for navigation around the app
- Revise the app and use shadcn components
- Make the workout preset cards more compact
- Smooth transitions between timer states
- Prevent screen sleep during active timer
- Touch target optimization (44x44px minimum)
- Workout complete screen with summary stats
- PWA configuration for offline-first functionality
- Performance optimizations (reduce animations on low battery)

**Key Files**: `app/routes/complete.tsx`, `public/manifest.json`, `app/utils/wake-lock.ts`

---

## Implementation Strategy

Each phase builds on the previous one. After completing each phase:

1. Test the feature thoroughly
2. Review UI/UX with user
3. Make adjustments before proceeding
4. Commit working code before starting next phase

### To-dos

- [x] Phase 1: Core Timer Logic ✓
- [x] Phase 2: Timer Display & Progress Visualization ✓
- [x] Phase 3: Controls & Audio Feedback ✓
- [x] Phase 4: Preset Data Structure & Storage ✓
- [x] Phase 5: Preset List & Home Screen ✓
- [x] Phase 6: Preset Configuration Interface ✓
- [ ] Phase 7: Polish & Mobile Optimization
