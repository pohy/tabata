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
2. "Create New Preset" CTA
3. Quick stats (last workout, total sessions)



2. **Preset Configuration Screen**

1. Form for creating/editing presets
2. Real-time preview of total workout duration
3. Save/Cancel actions



3. **Active Timer Screen**

1. Full-screen countdown display
2. Visual progress indicators
3. Control buttons (pause/resume/stop)
4. Current interval indicator



4. **Workout Complete Screen**

1. Summary statistics
2. Motivational message
3. Quick restart or return home options





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
2. Input: Slider + number input
3. Default: 20 seconds



2. **Rest Interval Duration**

1. Range: 5-120 seconds
2. Input: Slider + number input
3. Default: 10 seconds



3. **Number of Intervals**

1. Range: 1-50 intervals
2. Input: Stepper buttons + number input
3. Default: 8 intervals



4. **Preparation Time**

1. Range: 0-30 seconds
2. Input: Stepper buttons
3. Default: 10 seconds





**Real-time Calculations:**

- Total workout duration display
- Total work time vs. rest time breakdown
- Estimated calories (optional, based on intensity)


---

### **C. Active Timer Display**

**Visual Hierarchy (Top to Bottom):**

1. **Header Bar** (Compact)

1. Preset name
2. Exit button (with confirmation)



2. **Primary Timer Display** (Hero Section)

1. Massive countdown numbers (80-120px font size)
2. Current phase label ("WORK" / "REST" / "GET READY")
3. Dynamic background color based on phase:

1. Prep: Neutral gray
2. Work: Vibrant cyan/blue
3. Rest: Warm orange/amber






3. **Progress Indicators**

**Circular Progress Ring:**

1. Surrounds the timer
2. Depletes as interval progresses
3. Color-coded by phase


**Interval Counter:**

1. "Interval 3 of 8" display
2. Progress bar showing overall completion
3. Remaining intervals count



4. **Control Panel** (Bottom)

1. Large pause/resume button (primary action)
2. Stop button (secondary, requires confirmation)
3. Volume/sound toggle





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
2. Format: MM:SS or SS based on duration
3. Pulsing animation at 3-2-1 countdown



2. **Circular Progress Ring**

1. SVG-based circular progress indicator
2. Smooth CSS transitions
3. Fills/depletes based on remaining time



3. **Linear Progress Bar**

1. Shows overall workout completion
2. Segments for each interval (work + rest)
3. Highlights current interval



4. **Interval Badges**

1. Visual grid of completed/remaining intervals
2. Checkmarks for completed intervals
3. Highlighted current interval





---

### **F. Control Features**

**During Active Timer:**

1. **Pause Button**

1. Freezes timer at current time
2. Dims display slightly
3. Shows "PAUSED" overlay
4. Prevents screen sleep



2. **Resume Button**

1. 3-second countdown before resuming
2. Returns to exact paused state



3. **Stop Button**

1. Confirmation modal: "End workout early?"
2. Options: "Keep Going" / "End Workout"
3. Returns to preset selection if confirmed



4. **Settings Quick Access** (optional)

1. Volume control
2. Screen brightness lock
3. Vibration toggle





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


