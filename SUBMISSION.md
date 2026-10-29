# Kingdom of Code — submission draft

**Creator:** Hariharasuthan V  
**Public AWS URL:** [ADD AFTER DEPLOYMENT AND VERIFICATION]  
**Source repository:** https://github.com/hariharasuthan1105/portfolio  
**Challenge:** AWS Student Builder Challenge 2026, as specified in the brief. Verify organizer rules and deadline before submission.

## Project Overview
A monochrome interactive portfolio for an AI & Data Science undergraduate. A real procedural 3D castle introduces a conventional, accessible scrolling portfolio. The Intelligence Vault connects visitors to the creator’s work through three short activities.

## Inspiration
The supplied dark-fantasy artwork inspired the eclipse, towers and stark lighting. Pixel headings and monospaced technical labels connect the kingdom metaphor to software development. The main palette remains grayscale.

## Creative Feature
The Three Keys of Intelligence asks visitors to scan fictional document fields, run a predefined retrieval scenario, and connect four knowledge nodes. Completing all three reveals the creator’s theme: turning complex information into intelligent decisions. The activities are clearly marked as simulations. They invoke no live model or paid API.

## Technologies Used
React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Motion, Lucide, modular CSS, Fontsource, Vitest and Testing Library. Geometry is generated in code, including instanced repeated rocks and battlements.

## AWS Architecture
Prepared architecture: GitHub source → Amplify Hosting build (`npm ci`, `npm run build`) → static `dist` artifacts → HTTPS delivery. No backend is needed. **AWS deployment has not occurred yet.** Replace this paragraph with the actual deployment evidence before submitting.

## Development Process
Separated factual portfolio data from rendering, constructed a procedural castle, built the responsive portfolio, implemented the three-key state flow, and added build and interaction checks. The interface remains usable independently of the castle.

## Challenges Faced
The initial dependency install could not resolve the package registry inside the sandbox. Installation succeeded with approved network access. The local web server responded successfully, but the in-app browser timed out, preventing visual QA and screenshots during this session. The Three.js chunk remains substantial despite lazy loading.

## Solutions
Keep content outside the canvas, use a lightweight control and an error boundary, cap rendering density, unmount the offscreen scene, and use instanced geometry. Use automated interaction tests to exercise quest behavior while explicitly retaining browser testing as an outstanding task.

## What I Learned
[CREATOR TO REVIEW: add your own genuine learning and development reflections. This draft does not claim personal experiences on your behalf.]

## Future Improvements
Visually verify on real devices, refine castle art and mobile composition, add true 3D room environments and atmospheric warrior elements, collect measured performance data, supply real project links and screenshots, and complete AWS deployment.

## Evidence to attach
- Real AWS URL and deployment status
- Real repository URL
- Desktop, mobile, project and completed-vault screenshots
- Results from the outstanding checks in QA.md
