# Your local FlyBrain project

Double-click **Start FlyBrain.command** to start the local server and open http://127.0.0.1:8765/. Keep the Terminal window open; Control-C stops the server. If the same project is already running, the launcher opens it without creating another server.

## Bollywood-inspired dance

Click **Start dancing**. The original synthesized dhol-style rhythm accompanies a repeating 32-beat routine: shoulder bounce, side-step and wave, arms up, turn and pose. Adjust tempo and volume, or choose a song from your computer. Song intensity controls movement energy; set the tempo manually to match the song (there is no automatic BPM detection). Music files stay on this computer.

Dance is explicitly programmed choreography, not a brain that learned Bollywood dancing. The fly-brain simulation continues separately. **Brain response** instead injects audio intensity into the existing MECH_JO and ANTENNAL_MECH groups; the upstream brain and behavior model supplies movement. This experimental mapping is not a validated model of hearing or musical response and does not guarantee dancing.

## Extend this project

- `js/dance-routines.js`: independent movement presets, evaluated by beat position. Add routines here.
- `js/dance.js`: playback, original synthesized percussion, audio analysis, and dance controls.
- `js/main.js`: fly body rendering, including optional per-leg choreography.
- `js/brain-worker-bridge.js`: sensory-input connection to the simulated brain.
- `data/`: downloaded connectome files; no runtime download required.

This local remix is based on [snedea/flybrain](https://github.com/snedea/flybrain). The upstream MIT license is retained in `license.md`. Its model includes a behavior state machine and a synthetic motor layer. No AI caretaker, API key, cloud account, or GPU setup is needed. Python 3 and a modern browser are required; Python 3 is installed on this Mac.
