# Timer Sound Files

This directory will contain the audio files for timer phase transitions.

## Required Files

The following `.ogg` audio files are expected:

- **work.ogg** - Played when a work interval begins (double beep pattern)
- **rest.ogg** - Played when a rest interval begins (single lower-tone beep)
- **prepare-rest.ogg** - Played when transitioning from work to rest (single beep)
- **prepare-work.ogg** - Played when preparing for work or during prep countdown (3-2-1 countdown beeps)
- **done.ogg** - Played when the workout is complete (triple celebration beeps)

## Notes

- Files should be in `.ogg` format for broad browser compatibility
- The audio hook will gracefully handle missing files (no errors if files don't exist yet)
- Volume is set to 70% by default in the audio hook
- Audio playback respects the mute toggle

