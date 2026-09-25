# How the fly works, and what training would mean

## What you have now

This project has two separate movement paths:

1. **Dance:** music + a programmed routine → body, wing, and leg poses. The brain continues running, but it does not choose the dance moves.
2. **Brain response:** music intensity → selected sensory neurons → spiking simulation → upstream behavior and synthetic motor layers → movement.

The second path responds to sound through an engineered input mapping. Responding is not the same as learning. The current simulation does not update its connection weights from dance success, train a movement decoder, or save learned dance skills.

The brain starts from a connectome: a measured map of neuron connections. Our browser model uses 139,255 neurons and approximately 2.7 million graph connections from its FlyWire-derived dataset. A graph connection can represent multiple biological synapses; this is not a count of every synaptic contact. Each simplified neuron accumulates input, loses some activation over time, and fires when it crosses a threshold. The model is not a complete reconstruction of living physiology.

## The screenshot: Stonkfly

The screenshot is labeled STONKFLY. Its 3D scene is a presentation layer; a screenshot alone cannot verify whether its animation is live, replayed, or generated directly by neural activity.

The [Stonkfly source](https://github.com/nftechie/stonkfly) describes a different MaleCNS-based model with 166,700 neurons and about 25.6 million connections. It translates chart images into visual input, reads neural activity through a fixed buy/sell/hold mapping, and uses portfolio changes to stimulate selected dopamine cells. A candidate memory rule modifies selected existing connections.

Its [model documentation](https://github.com/nftechie/stonkfly/blob/main/docs/model.md) explicitly says profitable learning has not been demonstrated. Connection changes are evidence of an implemented mechanism, not sufficient evidence that the task was learned. It is a separate project, not installed here. This repository retains our dancing fly.

## A practical first training experiment

My proposed next step is to train a small movement controller that reads brain activity while keeping the connectome fixed. This makes the trainable component explicit and lets us measure its contribution. The [fly.ai project](https://github.com/alextitonis/fly.ai) provides a related example of fitting readouts on fixed fly-brain activity; it is a possible future backend, not a dependency of this repository.

The initial task should be narrow: move left or right and lift the front legs at specified beats. Start with a metronome, not arbitrary songs or a full Bollywood routine.

A training pipeline would be:

**beat/audio input → sensory encoding → simulated brain → trainable movement controller → animated fly → score → controller update**

1. Define the observations: audio features, beat timing if explicitly provided, a short history of neural activity, and current pose. Providing beat timing means we are teaching movement timing, not claiming the fly discovered the beat by listening.
2. Define bounded actions: turn, step, front-leg lift, and wing spread. Initially use the current animated body. It has no physically validated balance model, so we cannot claim learned balance or realistic locomotion.
3. Record examples: the existing Bollywood routine can provide target actions. Fit the controller to imitate those actions. This is supervised imitation, and the choreography remains the source of its targets.
4. Optionally add reinforcement learning: reward on-time movement and smooth pose changes; penalize missed beats, jitter, and joint-limit violations. Try actions, calculate scores, and update the controller. This is controller training, not biological dopamine learning.
5. Save learned weights and experiment settings so they persist across sessions.
6. Evaluate on rhythms and tempos excluded from training, with repeated independent runs. Compare against an untrained controller, a beat-only controller, and a controller using randomized brain connections. If the beat-only controller does equally well, the connectome has not demonstrated added value.

Success should mean measured improvement on those unseen inputs, not merely an attractive animation or more neural spikes. Any reliable generalization to arbitrary songs, realistic physics, or a long dance sequence would be a later experiment.

## Training inside the simulated brain

Changing the connectome itself requires a plasticity rule: which connections may change, which recent activity is eligible for reward, how reward influences those connections, and limits that prevent instability. Such changes are biological modeling assumptions and need controls of their own. Adding a reward pulse alone does not make an arbitrary task learnable.

This is a more complex research direction than training an output controller. We should first establish a measurable rhythm task and an honest baseline before adding internal plasticity.

## Getting a 3D fly like the screenshot

A 3D body, rigged legs and wings, lights, and a scene can be connected to either scripted poses or controller outputs. Improving the graphics does not improve the learning algorithm. Human dance videos would also need their movements translated into a six-legged body; the model cannot simply watch a clip and understand Bollywood dancing.

## Relevant files

- `js/dance-routines.js`: programmed poses by beat; potential imitation targets.
- `js/dance.js`: audio playback, analysis, and selection of movement path.
- `js/sim-worker.js`: spiking simulation; no dance training loop currently.
- `js/brain-worker-bridge.js`: sensory injection and aggregation of neuron activity.
- `js/main.js`: body rendering and upstream behavioral movement.

A stylized 3D body with articulated legs, wings, and a neon studio is now implemented. It renders choreography or the existing behavior model; it does not include a physics-trained controller. Training, saved learned controllers, and automatic beat detection remain future work.
