# About scene compositing review

Changes are local; no push, merge, or AWS deployment was performed. Existing changes to the Hall of Honor assets were left untouched.

## Diagnosis and corrections

- The vertical line was a 3.6-unit luminous cylinder inside CrystalGroup. Removed it entirely.
- The old camera's fixed distance and level look direction did not account for container aspect ratio. Fit now evaluates all corners of a conservative world-space bounding box against both horizontal and vertical perspective limits, including orbit and float clearance.
- Old floor pieces spanned y=-0.38 to -0.19 with no shared environmental ground. The new foundation intersects the floor: bottom=-0.025, floor=-0.026, foundation top=0.035. Dais and boots share y=0.065. A soft contact shadow and blurred live reflection anchor the platform.
- Tall bright ticks were replaced by shallow silver engravings. Only inner ring groups rotate; the foundation and explorer stay stationary.
- Crystal facet winding was inconsistent. Normals now face outward. Removed the beam, wireframe cage, excess particles, bright emissive outlines, and blue material/light tints.
- Cathedral image inspection found no baked central explorer or platform. The character PNG has real alpha; its boot pixels span x=102..134 in a 230px-wide texture. The foot midpoint is aligned with the dais. There is one character instance.
- Replaced overflowing percentage grid tracks (which summed to 100% before gaps) with fractional tracks. The canvas is contained in its own track. Tablet uses two columns plus a values row; mobile uses a single-column grid with scrolling.
- Education, CGPA, Pixelify heading, personal copy, and resume download are preserved.
- Ring and crystal updates use elapsed delta time. Reduced motion stops both. Development audit data is removed by the production build.

## Evidence

- before-user-screenshot.png: supplied broken implementation, retained as the before image.
- 1536x1024.png: actual running desktop capture.
- 390x844.png: actual mobile viewport; mobile-full-section.png shows the entire scrolling section.
- isolated.png: live geometry against a plain dark background.
- grounded-rings.webm: live isolated scene recording.
- results.json: seven viewport audits, download checks, world measurements and framing results.
- motion-results.json: foundation and boot stability versus ring rotation over eight seconds.

## Validation

`npm run build` passed. Vite reports a large main chunk warning (about 1.29 MB before gzip).
`npm test` passed all eight existing tests.
`node scripts/verify-about-compositing.mjs` exercises the running local preview on port 4175 using installed Edge. It asserts no page errors or horizontal overflow, full scene bounds, matching feet/dais height, resume downloads, reduced-motion stability and animated ring movement without foundation movement.

## Remaining visual limitations

This is a live 3D/photograph composite, not a fully modeled cathedral. The explorer remains a 2.5D alpha cutout. The background cannot receive true dynamic lighting or occlude live objects, and the live reflection does not reconstruct the cathedral architecture. The result corrects the principal geometry/layout defects but does not match Image 2's photorealistic surface detail, overhead mechanism, volumetric illumination, or architectural integration. A depth-matched cathedral model and authored PBR assets would be needed to reach that fidelity; final photorealistic acceptance remains unmet.
