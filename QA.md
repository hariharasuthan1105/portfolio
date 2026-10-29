# Verification record — 29 October 2026

## Executed

- Dependency installation succeeded; npm reported zero vulnerabilities at installation time.
- TypeScript check passed.
- Production build passed. Vite reported a large lazy-loaded Three.js chunk (~894 KB uncompressed, ~242 KB gzip). This is a performance consideration, not a build error.
- Local server HTTP request returned 200.
- Three Vitest / Testing Library tests passed in jsdom: complete quest and restart; ordered node access and alternate evidence scenario; keyboard scanning and cancellation of an in-flight query.
- The first test run found missing whitespace in node accessible names. Explicit accessible labels fixed the issue; all tests passed on rerun.

## Not verified in a browser

The in-app browser timed out on both local preview attempts, including the host-accessible server. No browser screenshots were captured. HTTP success and DOM tests do not verify WebGL rendering, visual layout, touch interaction, frame rate or real-browser accessibility.

Before release, verify:

- Desktop and mobile layouts at 1440, 1024, 768, 390 and 320 pixels, including horizontal overflow.
- All navigation targets, mobile drawer and Escape behavior.
- Gate pointer hit area, hover, opening animation, entry camera and skip intro.
- All quest actions with mouse, keyboard and touch; final reveal and restart.
- Reduced-motion preference, focus contrast and screen-reader announcements.
- Lightweight fallback and WebGL-disabled rendering.
- Network waterfall, console errors, offscreen scene pause/unmount, and real-device frame rate.
- GitHub and LinkedIn destination reachability; supplied URLs are included but were not remotely validated.
- Actual Amplify production URL and asset delivery, which are not yet available.

## Scope limits

The central castle is real 3D. Other sections use CSS depth rather than individually modeled 3D rooms. Warriors, volumetric moving clouds, lightning, and photorealistic assets are not implemented. Scene depth fog and particles supply basic atmosphere. The static social SVG should be converted to PNG and assigned an absolute deployment URL before social sharing. No AWS deployment or GitHub repository creation has occurred.

## Artwork update
The supplied image now appears as the default grayscale hero backdrop. A separate Explore in 3D control retains the procedural scene. Mobile sizing preserves the complete artwork composition. Browser visual verification remains pending because the supplied browser tab could not be bound by the browser tool.

## Smoke update verification

TypeScript and production build passed after adding the smoke shader and new image. Browser inspection initially showed the previous cached artwork page. Reload failed because the preview server was stopped; after restarting the server, the browser automation still could not navigate away from its connection-error page. Runtime shader compilation, visible motion, mobile performance and screenshots of the new effect remain unverified. Prior screenshots must not be treated as evidence of this update.
