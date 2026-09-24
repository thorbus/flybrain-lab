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

- Bollywood-inspired 32-beat choreography with an original synthesized dhol-style rhythm.
- Disco preset, adjustable tempo/volume, and local song playback.
- A FlyWire-derived spiking brain simulation.
- Experimental audio-intensity input to sensory neuron groups in Brain response mode.

**There is no dance-learning algorithm yet.** Dance mode controls the body with programmed poses; Brain response mode adds sensory input and uses the upstream behavior/motor model. Neither demonstrates learned rhythm or dancing.

Read [How it works and how we could train it](docs/HOW-TRAINING-WORKS.md) and [Dance controls and code map](DANCE-README.md).

## Repository

This repository lives independently at `/Users/sudhanshu/Desktop/flybrain-lab`. Its original Git history and MIT license are preserved. The source project is recorded as the `upstream` remote; there is no personal GitHub origin or publication configured.

The original project documentation is saved in [docs/UPSTREAM-README.md](docs/UPSTREAM-README.md). It describes upstream behavior, not validation of this remix. Original source: https://github.com/snedea/flybrain.
