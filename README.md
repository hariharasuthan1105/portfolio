# Kingdom of Code

Hariharasuthan V’s monochrome React + TypeScript portfolio. Built from the factual content in the supplied brief. The supplied warrior-and-castle artwork is the default hero backdrop, displayed in grayscale to preserve the requested monochrome style. Explore in 3D switches to the separate procedural castle. The image is clearly an artwork view, not a 3D model.

## Run locally

Use Node.js 22.12+ (tested with Node 24) and npm. From this directory:

```sh
npm ci
npm run dev
npm run typecheck
npm run build
npx vitest run
npm run preview
```

Open the local URL printed by Vite. `dist/` is the production output. No environment variables, API keys, or paid APIs are required.

## Structure

```text
src/
  App.tsx                 Navigation and semantic portfolio sections
  main.tsx                React entry and locally bundled fonts
  data/profile.ts         Editable profile, project links, skills, experience
  experience/Castle.tsx   Lazy-loaded React Three Fiber procedural castle
  features/Vault.tsx      Three local interactive demonstrations
  features/Vault.test.tsx Interaction regression tests
  styles/global.css      Responsive layout and reduced-motion styling
public/
  favicon.svg
  assets/social-preview.svg
amplify.yml               AWS Amplify build configuration
index.html                SEO metadata
vite.config.ts
tsconfig.json
package.json
package-lock.json
```

## Editing content

Edit `src/data/profile.ts`. Each project has `repo`, `demo`, and `screenshot` fields; empty links are deliberately not shown. Add real URLs only. No resume PDF was supplied; the pasted resume facts are the factual source. Phone number is not published.

## Implemented experience

- Real procedural castle meshes, eclipse, stone platform, towers, windows, instanced rocks and battlements, particles, depth fog, pointer parallax, clickable gate, and entry camera transition.
- Persistent section navigation, mobile menu, skip link, skip intro, lightweight control, visible focus states and reduced-motion styles.
- Offscreen scene unmounting, capped device pixel ratio, lazy-loaded 3D, no real-time shadow maps.
- Perception: three fictional fields with simulated confidence values. Reasoning: two predefined scenarios with staged evidence retrieval. Connection: four ordered nodes. Collecting all keys reveals a personal narrative; restart clears the state and timer.
- Local fonts, semantic sections, GitHub/LinkedIn/email links, configurable projects, social preview artwork and favicon.

The non-hero sections use readable panels and CSS depth rather than separate WebGL rooms. There are no rigged warriors, live AI services, or custom GLB assets. A transparent GLSL overlay approximates moving smoke, ground fog, and clouds; it is not a fluid simulation or a depth-aware volumetric renderer. The 3D scene is stylized geometry, not a photorealistic reproduction of the reference. WebGL failure leaves portfolio content accessible; lightweight mode avoids the canvas. Quest progress is session-local and resets on reload.

## GitHub setup

Create an empty repository in your GitHub account. In this project directory:

```sh
git init
git add .
git commit -m "Build Kingdom of Code portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the account and repository placeholders with your real repository. `node_modules`, `dist`, logs, and local environment files are ignored. Source repository: https://github.com/hariharasuthan1105/portfolio.

## Deploy to AWS Amplify Hosting

1. Sign into your AWS account and open **AWS Amplify**. Choose **Create new app** / **Host web app**, select GitHub, and authorize access to the repository you created.
2. Select the repository and `main` branch. Use this directory as the repository root. If using a monorepo, select the application subdirectory explicitly.
3. Keep the checked-in `amplify.yml`: `npm ci`, then `npm run build`, with artifact directory `dist`. Select a supported Node 22 or 24 build runtime if the console offers a runtime selector.
4. This application uses section hashes (`/#projects`), so the server always receives `/`; no client route rewrite is necessary. If you later add path routing, configure Amplify’s documented SPA rewrite to `/index.html`, excluding asset file extensions.
5. Save and deploy. Wait for a successful build, then open the actual Amplify HTTPS URL on desktop and mobile. Verify the gate, all vault keys, links and refresh behavior.
6. Set `og:url` and an absolute `og:image` URL in `index.html` after the real domain is known. Convert the supplied SVG social artwork to a 1200×630 PNG for broad social-crawler support, then update `og:image`. Confirm the preview with the target platform before sharing.
7. Record the real URL and repository in `SUBMISSION.md` only after verification.

AWS service intended: **Amplify Hosting** for build, static hosting, CDN delivery and HTTPS. No Lambda, Bedrock, database, or Amplify backend is required or provisioned. Nothing has been deployed to AWS in this session; AWS account authorization and repository connection remain user steps.

Official references: [Deploy Vite with Amplify](https://docs.amplify.aws/gen1/javascript/deploy-and-host/frameworks/deploy-vite-site/) and [Amplify Hosting](https://docs.amplify.aws/react/deploy-and-host/amplify-hosting/).

## Costs and budget alerts

Review the current [Amplify pricing](https://aws.amazon.com/amplify/pricing/) before deployment. Build minutes, stored assets, traffic and optional domain registration can incur charges. This project needs only static hosting; do not enable unrelated backend resources. No claim of zero cost is made.

In **Billing and Cost Management → Budgets → Create budget**, create a monthly cost budget with an amount you are comfortable spending. Add your email for actual-spend alerts (for example 80% and 100%) and a forecasted-spend alert at 100%. Review the budget scope and notification delivery. Alerts are not a spending cap and can arrive after costs accrue. See [AWS Budgets guidance](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-best-practices.html).

## Verification and release checklist

See `QA.md` for executed checks and pending browser checks. Do not present this as an AWS-hosted submission until the deployed URL is verified. Confirm the current challenge rules and deadline directly with the organizer; those supplied in the brief were not independently verified.

## Assets and licenses

The castle and SVG artwork are original procedural/vector source in this project. Fonts are bundled through Fontsource; retain their upstream license files when redistributing. Dependency packages retain their respective licenses. The user-supplied reference image is included as public/assets/eclipse-citadel.png, as requested, with its original pixels intact. CSS applies grayscale at display time.

## Animated atmosphere update

`src/experience/VolumetricSmoke.tsx` supplies time-driven fractal noise and domain-warped curls with four independently paced plumes around the character positions, lateral ground mist, and slower upper cloud drift. Pointer position gently bends the smoke. A transparent canvas leaves links and buttons clickable. The effect is unmounted offscreen, paused on hidden tabs, and omitted for reduced-motion users. Pixel ratio is capped at 1. The original image remains static; the live smoke is a separate shader overlay. Characters are artwork representations, while the optional castle view retains real geometry.

The new image is `public/assets/eclipse-citadel.png`. Full rigged characters, flowing waterfalls, depth-aware smoke occlusion, an integrated photorealistic 3D environment, measured 60 FPS, and staged eclipse/arrow animation remain unimplemented or unverified.
