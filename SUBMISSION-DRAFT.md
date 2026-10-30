# Kingdom of Code — submission draft

**Builder:** Hariharasuthan V
**Challenge:** AWS Student Builder Challenge 2026 (name and deadline supplied by the user; eligibility/rules not independently audited)
**Live AWS website:** Pending sign-in, deployment, and public URL verification.
**Source repository:** https://github.com/hariharasuthan1105/portfolio

## Inspiration

The portfolio treats professional work as an explorable kingdom. Gothic architecture conveys scale and curiosity; a restrained monochrome interface keeps the work readable. The supplied design references informed the composition and eight-stage journey, while fresh artwork and working components form the implementation.

## What it does

Visitors enter a cinematic gate, explore the developer’s background, filter skills, open technical project details, read the experience timeline and achievements, and make contact. The signature feature is the Intelligence Vault: a one-minute sequence connecting perception, reasoning, and decentralized information.

## Intelligence Vault

1. **Perception:** Move a scanner over a fictional invoice to expose three predefined fields.
2. **Reasoning:** Select a city question and trace a sample question → retrieval → evidence → answer sequence.
3. **Connection:** Connect four nodes into one reachable network.

Completing all three reveals the statement “Transforming complex data into intelligent decisions” and a short narrative connecting the builder’s interests. All controls work with ordinary browser input; replay resets the experiment. The examples are labeled frontend demonstrations, not live AI inference.

## Technologies

React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Motion, Lucide React, CSS, custom GLSL noise, local web fonts, and original generated WebP artwork. The application is static and needs no secret keys or paid APIs.

## AWS implementation status

Amplify Hosting build configuration is prepared. No AWS deployment has yet been verified. After deployment, replace this paragraph with the actual service used, verified public URL, and build evidence. Do not claim Bedrock, Lambda, Cognito, or any other unused service.

## Development process

Created a fresh application, read the master brief and visual references, verified the user-selected resume, generated text-free environment art, built the interface and gameplay, and inspected real browser screenshots on desktop and mobile. The visual approach is explicitly hybrid: the architecture is raster art, while rings, the skill sphere, particles, and smoke effects use actual browser rendering.

## Challenges and lessons

- Keeping epic imagery readable required dark composition zones and independent HTML text.
- A hybrid approach gave stronger architectural detail than a crude procedural castle, while keeping interactive content accessible.
- Graph validation must reject disconnected islands, duplicates, and self-edges.
- Motion preferences and low-power fallbacks must preserve every portfolio and game action.

## Evidence

See `screenshots/` and `QA.md` for actual captures and checks. `npm run build` and the five logic tests pass. Browser testing exercised the complete Vault, replay, filtering, modal closure, mobile menu, and Copy Email. No formal Lighthouse, screen-reader, or physical-device audit is claimed.

## Before submitting

- Finish Amplify deployment and verify its public HTTPS URL.
- Add the verified live URL above; the source repository is already recorded.
- Confirm challenge eligibility, deadline, and current submission requirements with the organizer.
- Use only the included actual application screenshots, not reference mockups, as implementation evidence.
- Review the explicitly documented 2.5D/3D scope before describing the experience publicly.
