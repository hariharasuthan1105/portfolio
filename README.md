# Code Kingdom V2

A fresh monochrome portfolio for Hariharasuthan V: a cinematic gate, six professional portfolio sections, and a playable Intelligence Vault. Built from scratch with React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Motion, and Lucide.

Source: [hariharasuthan1105/portfolio](https://github.com/hariharasuthan1105/portfolio).

## Run locally

Requires Node.js 22.12+ (verified here with Node 24).

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Vite serves the local application at the URL printed in the terminal. The production output is `dist/`. Navigation uses fragment identifiers, so direct section links do not require server routing rules. Fonts and artwork are served locally. No API keys, paid APIs, analytics, or backend services are required.

## Implemented experience

- Gate: original text-free citadel art with live DOM navigation, clickable entrance, skippable cinematic overlay, project shortcuts, and an obvious Vault hint.
- Origin: introduction, verified education and interests, and a downloadable resume with the phone number removed.
- Forge: category filters, selectable skill descriptions, an accessible complete list, and a rotatable Three.js sphere on supported desktop devices.
- Archive: three distinct cinematic exhibits and native modal dialogs with project descriptions, features, technologies, and technical challenges.
- Journey: dated internship timeline.
- Honor: three achievements and five expandable certifications.
- Portal: email, LinkedIn, GitHub profile, and Copy Email with success/failure feedback.
- Vault: scanner range control, two sample retrieval workflows, a four-node graph challenge, independent completion state, final reveal, and replay.

The Vault intentionally runs entirely in the browser. Its OCR and RAG examples are explicitly labeled simulations. The network is illustrative, not a blockchain client. No uploads, OCR inference, LLM calls, or transactions occur. Progress lasts for the current page session; replay clears it.

## Honest rendering inventory

This is a **hybrid 2.5D/3D implementation**, not a fully modeled castle or a navigable AAA game world.

| Layer | Implementation |
| --- | --- |
| Citadel, archer, warrior, eclipse, waterfalls, reflective architecture | Original AI-generated raster environment art, converted to WebP |
| Interior chamber and traveler | Original AI-generated raster environment art |
| Project exhibits | Original AI-generated triptych with three CSS-selected regions |
| Orbital rings, skill sphere, dust | Actual Three.js geometry and Drei particles |
| Soft noise smoke | Animated GLSL fragment shader with layered noise |
| Foreground fog, portal pulse, scan line | CSS animation |
| Entry transition | Motion overlay and navigation; not a 3D camera flight |
| Navigation, copy, dialogs, filters, Vault | Real accessible DOM controls and React state |

The castle itself is not a mesh. Character cloth, waterfall flow, storm-cloud motion, physically simulated water, and character-specific volumetric smoke are not implemented. The original design reference is not used as a website texture. No third-party architectural models were downloaded. `public/models/README.md` records this explicitly.

## Content and privacy

`src/data/profile.ts` is the editable source for profile, skills, projects, experience, and achievements. Content was checked against the user-selected `resume h.pdf`. Certifications match that resume. Technical challenge descriptions explain the supplied project architecture; they are not invented measured results. No proficiency percentages, unsupported results, project repository URLs, or demo links are shown.

The public resume is a redacted copy; its original phone text and telephone link were removed. The original PDF is not in this repository. Only the professional contact details explicitly requested by the user appear in the app.

## Accessibility and performance

- Semantic headings, links, buttons, labels, range and select controls.
- Visible keyboard focus, skip link, native dialog Escape/focus behavior.
- Keyboard-accessible Vault; slider supports arrow keys and End.
- Mobile layout at 390 × 844 and desktop checks at 1536 × 1024.
- `prefers-reduced-motion` disables decorative animation.
- HQ/Lite control persists the selected quality locally.
- Mobile uses a static orbital fallback; desktop scenes load only near the viewport.
- Lazy-loaded section and Three.js bundles, pixel ratio capped at 1.5, no real-time shadows.
- WebGL canvas fallback and React error boundary preserve portfolio controls.
- WebP environment assets and bundled Latin fonts avoid third-party font requests.

See `QA.md` for actual verification and limits. This is not a claim of a formal accessibility audit or measured Lighthouse score.

## AWS Amplify Hosting

The repository includes `amplify.yml`, with `npm ci`, `npm run build`, and `dist` artifacts. Configuration follows the [AWS Amplify build settings documentation](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html). React 19 is paired with R3F 9 per the [official compatibility guidance](https://r3f.docs.pmnd.rs/getting-started/introduction).

1. Sign in to AWS Amplify Hosting.
2. Create a new app and choose GitHub as the source.
3. Authorize the intended repository and select its `main` branch.
4. Keep the repository-root application directory and detected `amplify.yml`.
5. Deploy, then verify the issued HTTPS URL, assets, navigation, resume, and Vault.

No AWS service has been provisioned or verified at the time this file was prepared. AWS sign-in is required to finish deployment. There are no AWS account identifiers or credentials in the source. Do not describe AWS hosting as complete until the public URL is verified. No Amplify backend, Cognito, Bedrock, Lambda, or database is used.

## Source layout

```text
src/components/ui/          UI and scene fallback boundary
src/components/3d/          Rings, sphere, particles, smoke shader
src/sections/               Hero and portfolio sections
src/features/intelligence-vault/  Gameplay and pure graph logic
src/data/                  Editable professional data
src/hooks/                 Motion preference
src/styles/                Responsive design system
public/assets/             Optimized art and public resume
public/models/             Rendering scope note
tests/                     Vault logic tests
screenshots/               Actual captured desktop/mobile views
```

See `ASSETS.md` for image provenance and generation prompts, and `SUBMISSION-DRAFT.md` for the submission narrative and unfilled deployment fields.
