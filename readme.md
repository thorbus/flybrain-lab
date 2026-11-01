# FlyBrain Lab

Your standalone local fruit-fly simulation and behavior experiment repository.

## Run

Double-click **Start FlyBrain.command**. It opens http://127.0.0.1:8765/ and serves this folder only on your computer. Keep its Terminal window open; Control-C stops it. An already-running copy is reused.

Alternatively:

```sh
python3 serve-local.py
```

Python 3 and a modern browser are sufficient for this local demo. No npm installation, API key, or cloud account is required.

## What works now

- A 3D neon studio: faceted fly, six articulated legs, transparent wings, orbit/zoom camera, and optional retro pixels.
- Bollywood-inspired 32-beat choreography with an original synthesized dhol-style rhythm.
- Disco preset, adjustable tempo/volume, and local song playback.
- A FlyWire-derived spiking brain simulation.
- Experimental audio-intensity input to sensory neuron groups in Brain response mode.

**There is no dance-learning algorithm yet.** Dance mode controls the body with programmed poses; Brain response mode adds sensory input and uses the upstream behavior/motor model. Neither demonstrates learned rhythm or dancing.

Read [How it works and how we could train it](docs/HOW-TRAINING-WORKS.md) and [Dance controls and code map](DANCE-README.md).

## 3D view

The 3D studio opens by default. Drag the scene to orbit, scroll to zoom, and use **Reset camera** to return to the initial view. **Dance controls** opens the settings on smaller screens. **2D arena** returns to the original interaction view; **3D studio** switches back.

The monitor and overlay use live simulation telemetry. The firing count is the number of neurons firing in the most recent simulation tick, not spikes per second. The raster samples 96 cells periodically and is not a complete spike log. Graphics do not change the brain simulation or introduce learning.

Implementation: `js/fly-scene.js` renders the Three.js scene; `js/fly-rig.js` calculates the body and leg poses; `css/fly-scene.css` adapts the controls for desktop and narrow windows. All assets and Three.js are local.

Validate the rig with `node --test tests/fly-rig.test.cjs`.
