# KINGDOM OF CODE — Final Championship Edition

**An Award-Winning Interactive Experience & AI Engineering Portfolio**  
**Builder:** Hariharasuthan V | [GitHub](https://github.com/hariharasuthan1105/portfolio) | [LinkedIn](https://www.linkedin.com/in/hariharasuthan-v/)  
**Live AWS Amplify Deployment:** [https://main.d3r0wa5wh6oirj.amplifyapp.com/](https://main.d3r0wa5wh6oirj.amplifyapp.com/)  
**Submission Target:** AWS Student Builder Challenge (Submission Deadline: November 6, 2026)  

---

## 🏛️ Project Overview

**KINGDOM OF CODE** reimagines the developer portfolio as an explorable, atmospheric realm. Stepping beyond standard static resumes, it transports technical evaluators and hackathon judges through a gothic monochrome citadel into an interactive **Intelligence Vault** that gamifies and proves the builder's core engineering superpowers in **Perception**, **Reasoning**, and **Decentralized Connection**.

Built with **React 19**, **TypeScript**, **Three.js**, **React Three Fiber**, **Motion**, and **AWS Amplify Hosting**, the project achieves high aesthetic standards while rigorously adhering to accessibility, performance, and honest engineering disclosures.

---

## 🚀 Key Highlights & Championship Features

### 1. The Interactive Intelligence Vault: "Three Keys, One Intelligence"
The centerpiece of the submission connects three authentic engineering projects to a single superpower:
- **Challenge 1 — PERCEPTION (DocRecon Simulation):** Visitors operate an interactive document scanner over an invoice, identifying structured fields (`INV-2048-DX`, date, total amount) with real-time bounding boxes and confidence telemetry (99.8%, 99.1%, 99.4%) to forge **Key 01**.
- **Challenge 2 — REASONING (Pathway AI Simulation):** Visitors investigate an urban anomaly via an interactive RAG pipeline: `QUERY → RETRIEVAL → EVIDENCE → SYNTHESIS`. Real-time cosine similarity scores (0.94) and grounded citations forge **Key 02**.
- **Challenge 3 — CONNECTION (HEFIN Simulation):** Visitors link four decentralized nodes (`Core Ledger`, `Inference`, `Storage`, `Edge Client`) into a reachable network with animated SVG pulse lines and consensus detection to forge **Key 03**.
- **Grand Finale Reveal:** All three keys orbit the central lock, concentric alignment rings engage, and the chamber unlocks to reveal Hariharasuthan's authentic superpower:  
  > *"TRANSFORMING COMPLEX DATA INTO INTELLIGENT DECISIONS."*  
  Accompanied by a technical synthesis connecting DocRecon, Pathway AI, and HEFIN, plus a full replay reset control.

### 2. Cinematic Gateway & Reversible State Machine
- **Reversible Lighting & Camera State Machine:** Completely eliminates portal overexposure bugs by executing a strict transition lifecycle: `IDLE → ACTIVATING → ENTERING → INSIDE → RETURNING → IDLE`. Returning to Home seamlessly restores baseline exposure, bloom, emissive values, and camera position.
- **Genuine 3D WebGL Interactions:** Three.js orbital rings with smooth pointer response, procedural star particles, interactive 3D skill sphere in Forge, and custom GLSL atmospheric smoke shaders.
- **Atmospheric HUD:** Suspended black glassmorphism panels, silver borders, Pixelify Sans headings, and IBM Plex Mono telemetry labels.

### 3. Authentic Project Exhibits & Architecture Modals
Presents three real-world projects with interactive wireframe diagrams and deep-dive technical modals:
- **DocRecon:** Document intelligence and field extraction pipeline.
- **Pathway AI:** Dynamic Retrieval-Augmented Generation for smart urban infrastructure.
- **HEFIN:** Decentralized multi-node AI assistant with cryptographic trust verification.
*(All project cards link to verified GitHub repositories and provide detailed challenge/solution breakdowns without requiring 3D navigation).*

### 4. Accessibility & Audio Etiquette
- **Default-Muted Audio:** Ambient instrumental music begins *only* upon explicit user interaction (no unexpected playback on passive scroll); user mute choices are strictly preserved across sessions.
- **Keyboard Navigation:** Full support for `Tab`, `Enter`, `Escape`, arrow keys, and `End` (used for sliding the OCR perception scanner).
- **Reduced Motion:** Fully honors `prefers-reduced-motion: reduce`, switching to static fallbacks.
- **Responsive Layouts:** Zero horizontal scroll verified across Desktop (1536×1024), Laptop (1366×768), Tablet (768×1024), and Mobile (390×844).

---

## ☁️ AWS Architecture & Hosting Implementation

The production web application is hosted on **AWS Amplify Hosting**:

```
[ Developer / Git Commit ]
           │
           ▼
[ GitHub Repository: main branch ]
           │  (Webhook Trigger)
           ▼
[ AWS Amplify Continuous Deployment Pipeline ]
   ├── Provision: Node.js 22+ build container
   ├── Build: npm ci && npm run build
   └── Verify: Dist artifact generation (HTML, CSS, JS, WebP assets)
           │
           ▼
[ AWS Global Content Delivery Network (Amazon CloudFront) ]
   ├── Edge Locations (Global Low-Latency Caching)
   ├── Managed SSL / HTTPS Certification
   └── Zero Backend Cost / High Reliability
           │
           ▼
[ End-User Browser / Judge Experience ]
```

### Build Configuration (`amplify.yml`)
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework & Core** | React 19, TypeScript, Vite 7 |
| **3D Graphics & Shaders** | Three.js, React Three Fiber (R3F 9), Drei, Custom GLSL shaders |
| **Animation & UI** | Motion (formerly Framer Motion), Lucide React, Vanilla CSS |
| **Typography** | Pixelify Sans (headings), IBM Plex Mono (telemetry), Inter/System Sans |
| **Testing** | Node.js Test Runner, Playwright E2E Suite |
| **Cloud Hosting** | AWS Amplify Hosting, Amazon CloudFront CDN |

---

## 🧪 Quality Assurance & Test Verification

The application features an automated, reproducible test suite:

### 1. Unit Tests (`tests/vault.test.mjs`)
- **8 / 8 Passing**
  - Graph reachability & bidirectional edge traversal
  - Disconnected island and self-connection rejection
  - Strict 3-key unlock enforcement
  - Authenticity of superpower statement and project pillars

### 2. End-to-End Test Suite (`tests/e2e-championship.mjs`)
- **18 / 18 Passing across all 4 viewports (Desktop, Laptop, Tablet, Mobile)**
  - `Test A`: Homepage loads with valid semantic structure and title
  - `Test B`: All topbar navigation anchors navigate cleanly
  - `Test C`: Castle entrance warp animation completes smoothly
  - `Test D`: Portal lighting and camera reset upon returning home
  - `Test E`: Portal entrance animation is repeatable without freeze
  - `Test F`: Skip Intro button immediately navigates to portfolio
  - `Test G`: DocRecon perception scanner extracts 3/3 fields and unlocks Key 01
  - `Test H`: Pathway AI reasoning pipeline retrieves evidence and unlocks Key 02
  - `Test I`: HEFIN challenge connects decentralized nodes and unlocks Key 03
  - `Test J`: Vault Grand Finale unlocks with superpower and 3 project pillars
  - `Test K`: Replay resets all challenge states cleanly
  - `Test L`: Verified contact links exist (Email, LinkedIn, GitHub)
  - `Test M`: Architecture breakdown modals open and close via Escape
  - `Test N`: Keyboard navigation operates the OCR scanner
  - `Test O`: Audio toggle controls mute/unmute cleanly
  - `Test P`: Respects `prefers-reduced-motion` settings
  - `Test Q`: Production build succeeds without errors
  - `Test R`: Zero console errors throughout the entire journey

---

## 🔍 Honest Rendering Inventory

To ensure complete transparency and integrity for competition judging:

- **What is Genuine 3D:** The central orbital rings, the interactive 3D skill sphere in Forge, the ambient particle field, and the procedural noise smoke shaders are real-time WebGL objects rendered via Three.js.
- **What is High-Res Raster Art:** The majestic gothic citadel, flanking archers, solar eclipse, waterfalls, and interior chamber backdrop are custom high-resolution WebP environment artworks created specifically for this project. The castle is not an imported 3D polygonal mesh.
- **What is Simulated:** The Intelligence Vault OCR scanner, smart city RAG pipeline, and decentralized node consensus are interactive, transparently labeled browser simulations operating on predefined sample data.

---

## 💻 Local Development & Verification

### Prerequisites
- Node.js 20+ (Node.js 22.12+ recommended)

```bash
# Clone the repository
git clone https://github.com/hariharasuthan1105/portfolio.git
cd portfolio

# Install dependencies
npm ci

# Run unit tests
npm test

# Run development server
npm run dev

# Run production build
npm run build

# Run preview server
npm run preview

# Run automated E2E Championship QA test suite
node tests/e2e-championship.mjs
```

---

## 👤 Author & Contact

**Hariharasuthan V**  
- **GitHub:** [@hariharasuthan1105](https://github.com/hariharasuthan1105)  
- **LinkedIn:** [linkedin.com/in/hariharasuthan-v](https://www.linkedin.com/in/hariharasuthan-v/)  
- **Email:** [hariharasuthan1105@gmail.com](mailto:hariharasuthan1105@gmail.com)  
- **Live Submission:** [https://main.d3r0wa5wh6oirj.amplifyapp.com/](https://main.d3r0wa5wh6oirj.amplifyapp.com/)
