# **Comprehensive Plan: Tabata Interval Training Mobile Web App**

## **Design Vision**

Based on the generated design inspiration, the app will feature:

- **Bold, energetic aesthetic** with a dark theme and vibrant accent colors (electric blue/cyan for active intervals, warm orange/red for rest periods)
- **Large, ultra-readable typography** for the countdown timer (hero display)
- **High contrast UI** optimized for quick glances during intense workouts
- **Minimal distractions** during active training sessions
- **Smooth animations** for state transitions and progress indicators

---

## **1. Core Architecture & Technology Stack**

Use context7 to retrieve the latest documentation

### **Frontend Framework**

- **React Router v7** in Framework mode (https://reactrouter.com/home)
- **React 19.2** for component architecture
- **TypeScript** for type safety
- **Tailwind CSS v4** for responsive styling
- **shadcn/ui** components for consistent UI elements

### **State Management**

- **React hooks** (useState, useEffect, useRef) for timer logic
- **localStorage** for persisting presets (no backend required initially)

### **Audio/Notifications**

- **Web Audio API** for interval beeps and alerts
- **Vibration API** for haptic feedback on mobile devices

---

## **2. Information Architecture**

### **Main Screens/Views**

1. **Home/Preset Selection Screen**

1. List of saved presets with quick-start buttons
1. "Create New Preset" CTA
1. Quick stats (last workout, total sessions)

1. **Preset Configuration Screen**

1. Form for creating/editing presets
1. Real-time preview of total workout duration
1. Save/Cancel actions

1. **Active Timer Screen**

1. Full-screen countdown display
1. Visual progress indicators
1. Control buttons (pause/resume/stop)
1. Current interval indicator

1. **Workout Complete Screen**

1. Summary statistics
1. Motivational message
1. Quick restart or return home options

---

## **3. Feature Specifications**

### **A. Preset Management System**

**Preset Data Structure:**

```typescript
interface WorkoutPreset {
  id: string;
  name: string;
  workInterval: number; // seconds
  restInterval: number; // seconds
  intervals: number; // total count
  prepTime: number; // countdown before starting
  createdAt: Date;
  lastUsed?: Date;
}
```

**Default Presets (Pre-loaded):**

- **Classic Tabata**: 20s work / 10s rest / 8 intervals
- **HIIT Standard**: 30s work / 15s rest / 10 intervals
- **Beginner Friendly**: 20s work / 20s rest / 6 intervals
- **Advanced Burn**: 40s work / 20s rest / 12 intervals

**Preset Features:**

- Create unlimited custom presets
- Edit existing presets (creates new version, preserves history)
- Delete presets (with confirmation)
- Duplicate presets for quick variations
- Search/filter presets by name

---

### **B. Timer Configuration Interface**

**Adjustable Parameters:**

1. **Work Interval Duration**

1. Range: 10-120 seconds
1. Input: Slider + number input
1. Default: 20 seconds

1. **Rest Interval Duration**

1. Range: 5-120 seconds
1. Input: Slider + number input
1. Default: 10 seconds

1. **Number of Intervals**

1. Range: 1-50 intervals
1. Input: Stepper buttons + number input
1. Default: 8 intervals

1. **Preparation Time**

1. Range: 0-30 seconds
1. Input: Stepper buttons
1. Default: 10 seconds

**Real-time Calculations:**

- Total workout duration display
- Total work time vs. rest time breakdown
- Estimated calories (optional, based on intensity)

---

### **C. Active Timer Display**

**Visual Hierarchy (Top to Bottom):**

1. **Header Bar** (Compact)

1. Preset name
1. Exit button (with confirmation)

1. **Primary Timer Display** (Hero Section)

1. Massive countdown numbers (80-120px font size)
1. Current phase label ("WORK" / "REST" / "GET READY")
1. Dynamic background color based on phase:

1. Prep: Neutral gray
1. Work: Vibrant cyan/blue
1. Rest: Warm orange/amber

1. **Progress Indicators**

**Circular Progress Ring:**

1. Surrounds the timer
2. Depletes as interval progresses
3. Color-coded by phase

**Interval Counter:**

1. "Interval 3 of 8" display
2. Progress bar showing overall completion
3. Remaining intervals count

4. **Control Panel** (Bottom)

5. Large pause/resume button (primary action)
6. Stop button (secondary, requires confirmation)
7. Volume/sound toggle

---

### **D. Timer Logic & Behavior**

**State Machine:**

```plaintext
IDLE → PREPARING → WORK → REST → WORK → REST → ... → COMPLETE
```

**Timer States:**

- `idle`: Preset selected, ready to start
- `preparing`: Countdown before first interval
- `working`: Active work interval
- `resting`: Rest interval between work periods
- `paused`: Timer paused (can resume)
- `complete`: All intervals finished

**Transition Rules:**

- Auto-advance from PREPARING → WORK
- Auto-advance from WORK → REST
- Auto-advance from REST → WORK (next interval)
- Manual pause available during WORK/REST only
- Stop requires confirmation, returns to preset selection

**Audio Cues:**

- 3-2-1 countdown beeps before work intervals
- Single beep at work → rest transition
- Double beep at rest → work transition
- Triple beep + vibration at workout completion

---

### **E. Progress Visualization**

**Real-time Updates (60fps):**

1. **Countdown Timer**

1. Updates every 100ms for smooth animation
1. Format: MM:SS or SS based on duration
1. Pulsing animation at 3-2-1 countdown

1. **Circular Progress Ring**

1. SVG-based circular progress indicator
1. Smooth CSS transitions
1. Fills/depletes based on remaining time

1. **Linear Progress Bar**

1. Shows overall workout completion
1. Segments for each interval (work + rest)
1. Highlights current interval

1. **Interval Badges**

1. Visual grid of completed/remaining intervals
1. Checkmarks for completed intervals
1. Highlighted current interval

---

### **F. Control Features**

**During Active Timer:**

1. **Pause Button**

1. Freezes timer at current time
1. Dims display slightly
1. Shows "PAUSED" overlay
1. Prevents screen sleep

1. **Resume Button**

1. 3-second countdown before resuming
1. Returns to exact paused state

1. **Stop Button**

1. Confirmation modal: "End workout early?"
1. Options: "Keep Going" / "End Workout"
1. Returns to preset selection if confirmed

1. **Settings Quick Access** (optional)

1. Volume control
1. Screen brightness lock
1. Vibration toggle

---

## **4. User Experience Flows**

### **Flow 1: Quick Start with Preset**

```plaintext
Home Screen → Tap Preset → Confirm Start → Preparing → Timer Runs → Complete
```

### **Flow 2: Create Custom Preset**

```plaintext
Home Screen → "New Preset" → Configure Settings → Name Preset → Save → Start Timer
```

### **Flow 3: Edit Existing Preset**

```plaintext
Home Screen → Long Press Preset → Edit → Modify Settings → Save → Updated Preset
```

### **Flow 4: Mid-Workout Pause**

```plaintext
Active Timer → Tap Pause → Timer Paused → Tap Resume → 3-2-1 Countdown → Timer Resumes
```

---

## **5. Mobile Responsiveness**

### **Viewport Optimization**

**Portrait Mode (Primary):**

- Full-screen timer display
- Vertical layout for all elements
- Bottom-anchored controls (thumb-friendly)

**Landscape Mode:**

- Horizontal split: Timer left, progress right
- Compact header
- Side-anchored controls

### **Touch Targets**

- Minimum 44x44px for all interactive elements
- Generous padding around buttons

### **Performance Optimization**

- Prevent screen sleep during active timer
- Reduce animations when battery is low
- Offline-first architecture (PWA)

---

## **6. Technical Implementation Details**

### **Timer Precision**

- Use `requestAnimationFrame` for smooth updates
- Web Workers for background timer (prevents drift)
- Fallback to `setInterval` with drift correction

### **Data Persistence**

- localStorage for preset storage
- Automatic backup/restore on app load
