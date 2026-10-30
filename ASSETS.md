# Asset provenance

All three environment assets were generated for this fresh build with the built-in image-generation tool. No reference screenshot is shipped as a full-page texture. Generated artwork is illustrative, not a project screenshot or evidence of a fully modeled environment. Final assets are `public/assets/citadel.webp`, `chamber.webp`, and `projects.webp`; originals were retained in the task's work directory. The following are the prompts used.

## Citadel

Use case: stylized-concept. Create a cinematic environment background asset for a premium monochrome dark fantasy developer portfolio. Wide landscape 1536x1024 composition. NO TEXT NO UI NO LETTERS NO labels. Highly detailed monumental gothic citadel centered at 58 percent horizontal, intricate flying buttresses stone carvings soaring spires cascading waterfalls, floating architectural islands and slender suspension bridges. Brilliant thin white eclipse corona behind central spire. Left foreground at 28 percent a dramatic armored archer with luminous silver bow pointing toward castle; right edge a tall armored warrior with windswept cape and sword, both cinematic finely detailed silhouettes. Keep far left third very dark and uncluttered to receive live HTML heading overlay. Reflective black stone causeway leading to luminous circular central entrance at bottom center. Organic silver smoke, storm cloud layers and waterfall mist. Strict black charcoal silver white palette no color. AAA cinematic concept art, photoreal materials and atmospheric depth, epic scale, exquisite architectural detail. This is environment art only, not a screenshot of a website.

## Chamber

Use case: stylized-concept. Text-free cinematic environment background for dark monochrome portfolio. Wide 1536x1024. Interior of immense highly detailed gothic technological cathedral archive, pointed stone arches, carved columns, filigree architecture, luminous rose window high center, strong volumetric white light shafts, reflective obsidian floor, concentric circular raised dais bottom center, a solitary small young adult traveler in dark coat seen from behind on dais at center. Far left and far right shadowy space for HTML interface overlays. Exquisite AAA realistic environment concept art. Strict black charcoal silver white. No words no text no logos no interface no cards no symbols. Deep atmospheric perspective, silver haze, mysterious tranquil monumental space.

## Project triptych

Use case: stylized-concept. Website project exhibit artwork, a triptych of THREE equally sized vertical panels across one wide 1536x1024 image, no gaps or borders. Strict black white charcoal silver monochrome. NO TEXT NO letters NO words NO UI. Left third: floating translucent document sheets at dramatic perspective, fine abstract printed lines without readable text, luminous horizontal OCR scanning light and delicate field bounding rectangles, dark gothic archive context. Center third: beautiful miniature futuristic gothic silver city with soaring central tower on circular obsidian platform, intricate glowing knowledge network arcs, cinematic white beam. Right third: exquisite connected translucent glass cubes with metallic frames floating at different depths on a dark spatial network, bright small cores, fine luminous connections. AAA cinematic technical concept art with photoreal materials, beautiful light, deep blacks. Three distinct balanced self-contained scenes occupying exactly equal thirds. These will be cropped into three project artwork backgrounds, not full web pages.

## V4 Cinematic Citadel & Depth Field

- `public/assets/citadel_v4.webp`: 2048×1152 (16:9) high-resolution clean environment texture derived from the reference artwork. Text overlays were cleanly inpainted using pavement reflection sampling, preserving the central gothic citadel, flying buttresses, waterfalls, explorer, archer, warrior, and holographic displays.
- `public/assets/citadel_v4_depth.webp`: 2048×1152 (16:9) calibrated spatial depth map computed via Dark Channel Prior atmospheric transmission, quadratic perspective ramp, and horizon blending.
- `src/components/ui/BrandEmblem.tsx`: Hand-crafted SVG crown monogram matching Reference Image A.
- `src/components/ui/ProjectHolograms.tsx`: Interactive SVG wireframe holograms for DocRecon (document terminal & scanning core), Pathway AI (smart city spires & pulse rings), and HEFIN (decentralized tesseract cubes).

## Other assets

IBM Plex Mono and Pixelify Sans are bundled through Fontsource packages (SIL Open Font License 1.1), with upstream licenses retained in `licenses/`. Icons come from Lucide React (ISC License), with license retained in `licenses/Lucide-LICENSE.txt`. Other dependencies retain their respective open-source package licenses. Downloadable resume PDF retains public professional credentials with sensitive contact details redacted.
