// scripts/build-citadel-models.mjs
// Procedural AAA GLB Asset Builder for Kingdom of Code — The Obsidian Citadel
import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Polyfill FileReader for Node.js GLTFExporter binary support
globalThis.FileReader = class FileReader {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onloadend) this.onloadend();
    });
  }
};

const OUTPUT_DIR = path.resolve("public/models");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function exportGLB(object, filename, animations = []) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    const options = {
      binary: true,
      animations: animations,
      embedImages: true,
    };
    exporter.parse(
      object,
      (glb) => {
        const filePath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(glb));
        console.log(`[GLB EXPORT] ${filename} (${(glb.byteLength / 1024).toFixed(1)} KB)`);
        resolve(filePath);
      },
      (error) => {
        console.error(`[GLB ERROR] Failed to export ${filename}:`, error);
        reject(error);
      },
      options
    );
  });
}

// -------------------------------------------------------------
// PBR MATERIAL DEFINITIONS (Monochrome Cinematic Palette)
// -------------------------------------------------------------
const matObsidianStone = new THREE.MeshStandardMaterial({
  color: 0x16181c,
  roughness: 0.82,
  metalness: 0.18,
  name: "Mat_ObsidianStone",
});

const matDarkGranite = new THREE.MeshStandardMaterial({
  color: 0x111215,
  roughness: 0.88,
  metalness: 0.12,
  name: "Mat_DarkGranite",
});

const matWetStone = new THREE.MeshStandardMaterial({
  color: 0x0c0d10,
  roughness: 0.22,
  metalness: 0.45,
  name: "Mat_WetStone",
});

const matMachinedSilver = new THREE.MeshStandardMaterial({
  color: 0xd8e2f0,
  roughness: 0.16,
  metalness: 0.94,
  name: "Mat_MachinedSilver",
});

const matGothicIron = new THREE.MeshStandardMaterial({
  color: 0x22242a,
  roughness: 0.45,
  metalness: 0.85,
  name: "Mat_GothicIron",
});

const matCathedralWindowGlow = new THREE.MeshStandardMaterial({
  color: 0xecf3ff,
  emissive: 0xbed2f5,
  emissiveIntensity: 0.85,
  roughness: 0.2,
  name: "Mat_WindowGlow",
});

const matBrazierFlame = new THREE.MeshStandardMaterial({
  color: 0xffeedd,
  emissive: 0xff8833,
  emissiveIntensity: 1.6,
  roughness: 0.3,
  name: "Mat_BrazierFlame",
});

// -------------------------------------------------------------
// 1. GOTHIC CASTLE CITADEL (public/models/gothic_citadel.glb)
// -------------------------------------------------------------
function buildGothicCitadel() {
  const root = new THREE.Group();
  root.name = "GothicCitadel_Root";

  // Massive foundation base
  const baseGeom = new THREE.BoxGeometry(32, 6, 12);
  const baseMesh = new THREE.Mesh(baseGeom, matDarkGranite);
  baseMesh.position.set(0, 3, -12);
  root.add(baseMesh);

  // Central Keep Main Body (Recessed to z = -12 so portal stands clear)
  const keepGeom = new THREE.BoxGeometry(16, 20, 8);
  const keepMesh = new THREE.Mesh(keepGeom, matObsidianStone);
  keepMesh.position.set(0, 16, -12);
  root.add(keepMesh);

  // Central Grand Spire Tower
  const grandTowerGeom = new THREE.CylinderGeometry(2.6, 3.5, 22, 12);
  const grandTower = new THREE.Mesh(grandTowerGeom, matObsidianStone);
  grandTower.position.set(0, 35, -12);
  root.add(grandTower);

  // Grand Steeple Cone
  const steepleGeom = new THREE.ConeGeometry(2.6, 18, 12);
  const steeple = new THREE.Mesh(steepleGeom, matGothicIron);
  steeple.position.set(0, 54, -12);
  root.add(steeple);

  // Needle finial atop main spire
  const needleGeom = new THREE.CylinderGeometry(0.08, 0.3, 10, 8);
  const needle = new THREE.Mesh(needleGeom, matMachinedSilver);
  needle.position.set(0, 66, -12);
  root.add(needle);

  // Symmetrical Left & Right Flanking Towers
  [-8.5, 8.5].forEach((x) => {
    // Flanking tower shaft
    const towerGeom = new THREE.CylinderGeometry(2.2, 2.8, 28, 10);
    const tower = new THREE.Mesh(towerGeom, matObsidianStone);
    tower.position.set(x, 22, -12);
    root.add(tower);

    // Tower roof cone
    const roofGeom = new THREE.ConeGeometry(2.4, 14, 10);
    const roof = new THREE.Mesh(roofGeom, matGothicIron);
    roof.position.set(x, 42, -12);
    root.add(roof);

    // Tower needle
    const needleT = new THREE.Mesh(needleGeom.clone(), matMachinedSilver);
    needleT.position.set(x, 51, -12);
    root.add(needleT);

    // Outer corner turrets
    [-2.2, 2.2].forEach((offsetZ) => {
      const turretGeom = new THREE.CylinderGeometry(0.8, 0.9, 14, 8);
      const turret = new THREE.Mesh(turretGeom, matObsidianStone);
      turret.position.set(x + (x > 0 ? 2.2 : -2.2), 22, offsetZ - 12);
      root.add(turret);

      const turretRoofGeom = new THREE.ConeGeometry(0.9, 6, 8);
      const turretRoof = new THREE.Mesh(turretRoofGeom, matGothicIron);
      turretRoof.position.set(x + (x > 0 ? 2.2 : -2.2), 32, offsetZ - 12);
      root.add(turretRoof);
    });
  });

  // Secondary Outer Wing Wings (Left and Right)
  [-16, 16].forEach((x) => {
    const wingGeom = new THREE.BoxGeometry(8, 14, 8);
    const wing = new THREE.Mesh(wingGeom, matObsidianStone);
    wing.position.set(x, 12, -12);
    root.add(wing);

    const wingTowerGeom = new THREE.CylinderGeometry(1.8, 2.2, 18, 8);
    const wingTower = new THREE.Mesh(wingTowerGeom, matObsidianStone);
    wingTower.position.set(x, 22, -12);
    root.add(wingTower);

    const wingConeGeom = new THREE.ConeGeometry(1.9, 10, 8);
    const wingCone = new THREE.Mesh(wingConeGeom, matGothicIron);
    wingCone.position.set(x, 34.5, -12);
    root.add(wingCone);
  });

  // Flying Buttresses (3 tiers on left and right)
  [-10.5, 10.5].forEach((x) => {
    [10, 16, 22].forEach((y) => {
      const buttressGeom = new THREE.BoxGeometry(0.5, 0.6, 6);
      const buttress = new THREE.Mesh(buttressGeom, matObsidianStone);
      buttress.position.set(x, y, -8.5);
      buttress.rotation.x = x > 0 ? -0.2 : 0.2;
      root.add(buttress);
    });
  });

  // Illuminated Gothic Lancet Windows
  // Central Rose / Lancet Cluster on main keep
  [0, -2.5, 2.5].forEach((offsetX) => {
    const winGeom = new THREE.CapsuleGeometry(0.4, 2.8, 4, 8);
    const win = new THREE.Mesh(winGeom, matCathedralWindowGlow);
    win.position.set(offsetX, 18, -7.95);
    root.add(win);
  });

  // High central tower illuminated windows
  [0, -1.2, 1.2].forEach((offsetX) => {
    const winGeom = new THREE.CapsuleGeometry(0.35, 2.2, 4, 8);
    const win = new THREE.Mesh(winGeom, matCathedralWindowGlow);
    win.position.set(offsetX, 34, -10.65);
    root.add(win);
  });

  // Flanking tower windows
  [-8.5, 8.5].forEach((x) => {
    const winGeom = new THREE.CapsuleGeometry(0.35, 2.0, 4, 8);
    const win = new THREE.Mesh(winGeom, matCathedralWindowGlow);
    win.position.set(x, 22, -10.55);
    root.add(win);
  });

  // Parapets and battlements along roof edge
  for (let i = -7; i <= 7; i += 1.2) {
    const battlementGeom = new THREE.BoxGeometry(0.6, 0.9, 0.4);
    const battlement = new THREE.Mesh(battlementGeom, matObsidianStone);
    battlement.position.set(i, 26.4, -7.8);
    root.add(battlement);
  }

  return root;
}

// -------------------------------------------------------------
// 2. STONE BRIDGE & STAIRS (public/models/stone_bridge.glb)
// -------------------------------------------------------------
function buildStoneBridge() {
  const root = new THREE.Group();
  root.name = "StoneBridge_Root";

  // Main Bridge Roadway Deck (from z = 6.0 down to z = -3.5, length = 9.5m, width = 4.8m)
  const deckLength = 10.0;
  const deckGeom = new THREE.BoxGeometry(4.8, 0.5, deckLength);
  const deck = new THREE.Mesh(deckGeom, matWetStone);
  deck.position.set(0, -0.25, 1.0);
  root.add(deck);

  // Left & Right Walkway Curbs
  [-2.2, 2.2].forEach((x) => {
    const curbGeom = new THREE.BoxGeometry(0.4, 0.25, deckLength);
    const curb = new THREE.Mesh(curbGeom, matDarkGranite);
    curb.position.set(x, 0.05, 1.0);
    root.add(curb);
  });

  // Bridge Arches & Under-Structure Supports
  [-2.5, 2.5].forEach((z) => {
    const archGeom = new THREE.CylinderGeometry(2.2, 2.6, 4.6, 12, 1, false, 0, Math.PI);
    const arch = new THREE.Mesh(archGeom, matDarkGranite);
    arch.position.set(0, -2.5, z);
    arch.rotation.z = Math.PI / 2;
    arch.rotation.x = Math.PI / 2;
    root.add(arch);
  });

  // Gothic Balustrades (Pointed Tracery Handrails on Left and Right)
  [-2.25, 2.25].forEach((x) => {
    // Top handrail beam
    const railGeom = new THREE.BoxGeometry(0.24, 0.16, deckLength);
    const rail = new THREE.Mesh(railGeom, matObsidianStone);
    rail.position.set(x, 0.85, 1.0);
    root.add(rail);

    // Bottom base plinth
    const baseRailGeom = new THREE.BoxGeometry(0.28, 0.14, deckLength);
    const baseRail = new THREE.Mesh(baseRailGeom, matObsidianStone);
    baseRail.position.set(x, 0.15, 1.0);
    root.add(baseRail);

    // Baluster posts with gothic pointed arch cutouts
    const balusterSpacing = 0.75;
    for (let z = -3.5; z <= 5.5; z += balusterSpacing) {
      const postGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 6);
      const post = new THREE.Mesh(postGeom, matMachinedSilver);
      post.position.set(x, 0.5, z);
      root.add(post);

      // Trefoil arch top between balusters
      const archTopGeom = new THREE.TorusGeometry(0.18, 0.02, 6, 12, Math.PI);
      const archTop = new THREE.Mesh(archTopGeom, matObsidianStone);
      archTop.position.set(x, 0.72, z + balusterSpacing * 0.5);
      archTop.rotation.y = Math.PI / 2;
      root.add(archTop);
    }

    // Heavy Balustrade End Pillars
    [-3.8, 0.9, 5.8].forEach((z) => {
      const pillarGeom = new THREE.BoxGeometry(0.42, 1.15, 0.42);
      const pillar = new THREE.Mesh(pillarGeom, matObsidianStone);
      pillar.position.set(x, 0.55, z);
      root.add(pillar);

      // Silver pillar cap
      const capGeom = new THREE.ConeGeometry(0.32, 0.35, 4);
      const cap = new THREE.Mesh(capGeom, matMachinedSilver);
      cap.position.set(x, 1.25, z);
      cap.rotation.y = Math.PI / 4;
      root.add(cap);

      // Cast-Iron Fire Braziers atop key pillars
      if (z === 0.9 || z === 5.8) {
        // Brazier iron bowl
        const bowlGeom = new THREE.CylinderGeometry(0.35, 0.15, 0.25, 8);
        const bowl = new THREE.Mesh(bowlGeom, matGothicIron);
        bowl.position.set(x, 1.45, z);
        root.add(bowl);

        // Blazing Fire / Embers mesh inside bowl
        const flameGeom = new THREE.ConeGeometry(0.22, 0.45, 6);
        const flame = new THREE.Mesh(flameGeom, matBrazierFlame);
        flame.position.set(x, 1.7, z);
        root.add(flame);
      }
    });
  });

  // Broad Ceremonial Stone Stairs Ascending to the Portal Dais (z = -3.8 down to z = -5.8)
  const numSteps = 12;
  const stairStart = -3.8;
  const stairEnd = -5.6;
  const stepRun = (stairEnd - stairStart) / numSteps;
  const stepHeight = 0.15;
  for (let i = 0; i < numSteps; i++) {
    const stepGeom = new THREE.BoxGeometry(4.4 - i * 0.08, stepHeight, Math.abs(stepRun) + 0.04);
    const step = new THREE.Mesh(stepGeom, matDarkGranite);
    step.position.set(0, (i + 0.5) * stepHeight, stairStart + (i + 0.5) * stepRun);
    root.add(step);
  }

  // Upper Portal Dais Platform
  const daisGeom = new THREE.BoxGeometry(6.0, 0.4, 2.5);
  const dais = new THREE.Mesh(daisGeom, matWetStone);
  dais.position.set(0, numSteps * stepHeight - 0.2, -6.8);
  root.add(dais);

  return root;
}

// -------------------------------------------------------------
// 3. MASSIVE CIRCULAR PORTAL GATE (public/models/portal_gate.glb)
// -------------------------------------------------------------
function buildPortalGate() {
  const root = new THREE.Group();
  root.name = "PortalGate_Root";

  const portalCenterY = 1.9;
  const portalRadius = 1.65;

  // Heavy Outer Gothic Stone Concentric Ring Arch
  const stoneArchGeom = new THREE.TorusGeometry(portalRadius, 0.38, 16, 48);
  const stoneArch = new THREE.Mesh(stoneArchGeom, matObsidianStone);
  stoneArch.position.set(0, portalCenterY, 0);
  root.add(stoneArch);

  // Secondary Concentric Stone Ring
  const stoneInnerRingGeom = new THREE.TorusGeometry(portalRadius - 0.24, 0.15, 12, 48);
  const stoneInnerRing = new THREE.Mesh(stoneInnerRingGeom, matDarkGranite);
  stoneInnerRing.position.set(0, portalCenterY, 0.05);
  root.add(stoneInnerRing);

  // Runic Radial Teeth / Keystones around the arch
  const numRunicTeeth = 16;
  for (let i = 0; i < numRunicTeeth; i++) {
    const angle = (i * Math.PI * 2) / numRunicTeeth;
    const toothGeom = new THREE.BoxGeometry(0.18, 0.5, 0.45);
    const tooth = new THREE.Mesh(toothGeom, matObsidianStone);
    tooth.position.set(
      Math.cos(angle) * (portalRadius + 0.28),
      portalCenterY + Math.sin(angle) * (portalRadius + 0.28),
      0
    );
    tooth.rotation.z = angle + Math.PI / 2;
    root.add(tooth);

    // Silver runic marker pin on each keystone
    const pinGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.1, 6);
    const pin = new THREE.Mesh(pinGeom, matMachinedSilver);
    pin.position.set(
      Math.cos(angle) * (portalRadius + 0.38),
      portalCenterY + Math.sin(angle) * (portalRadius + 0.38),
      0.22
    );
    pin.rotation.x = Math.PI / 2;
    root.add(pin);
  }

  // Crown Keystones at Top (Apex Crest)
  const crestGeom = new THREE.ConeGeometry(0.45, 0.9, 4);
  const crest = new THREE.Mesh(crestGeom, matMachinedSilver);
  crest.position.set(0, portalCenterY + portalRadius + 0.65, 0.05);
  crest.rotation.y = Math.PI / 4;
  root.add(crest);

  // Heavy Gate Base Pedestals / Wing Buttresses
  [-portalRadius - 0.3, portalRadius + 0.3].forEach((x) => {
    const buttressGeom = new THREE.BoxGeometry(0.85, 3.8, 0.9);
    const buttress = new THREE.Mesh(buttressGeom, matDarkGranite);
    buttress.position.set(x, 1.9, 0);
    root.add(buttress);

    const capGeom = new THREE.ConeGeometry(0.65, 0.7, 4);
    const cap = new THREE.Mesh(capGeom, matObsidianStone);
    cap.position.set(x, 4.05, 0);
    cap.rotation.y = Math.PI / 4;
    root.add(cap);
  });

  // Outer Silver Concentric Runic Torus (Rotates in scene)
  const silverRunicRingGeom = new THREE.TorusGeometry(portalRadius - 0.12, 0.025, 12, 64);
  const silverRunicRing = new THREE.Mesh(silverRunicRingGeom, matMachinedSilver);
  silverRunicRing.name = "Portal_SilverOuterRing";
  silverRunicRing.position.set(0, portalCenterY, 0.12);
  root.add(silverRunicRing);

  // Inner Silver Gimbal Ring (Rotates counter in scene)
  const silverInnerRingGeom = new THREE.TorusGeometry(portalRadius - 0.28, 0.02, 12, 64);
  const silverInnerRing = new THREE.Mesh(silverInnerRingGeom, matMachinedSilver);
  silverInnerRing.name = "Portal_SilverInnerRing";
  silverInnerRing.position.set(0, portalCenterY, 0.15);
  root.add(silverInnerRing);

  return root;
}

// -------------------------------------------------------------
// 4. TWO GUARDIAN KNIGHT STATUES (public/models/guardian_statues.glb)
// -------------------------------------------------------------
function buildGuardianStatues() {
  const root = new THREE.Group();
  root.name = "GuardianStatues_Root";

  function createKnight(name) {
    const knight = new THREE.Group();
    knight.name = name;

    // Pedestal Dais Base
    const pedGeom = new THREE.BoxGeometry(1.4, 2.2, 1.4);
    const ped = new THREE.Mesh(pedGeom, matDarkGranite);
    ped.position.set(0, 1.1, 0);
    knight.add(ped);

    // Pedestal Cap with molded cornice
    const capGeom = new THREE.BoxGeometry(1.55, 0.25, 1.55);
    const cap = new THREE.Mesh(capGeom, matObsidianStone);
    cap.position.set(0, 2.3, 0);
    knight.add(cap);

    // Knight Boots & Greaves
    [-0.22, 0.22].forEach((x) => {
      const bootGeom = new THREE.BoxGeometry(0.24, 0.65, 0.38);
      const boot = new THREE.Mesh(bootGeom, matObsidianStone);
      boot.position.set(x, 2.75, 0.05);
      knight.add(boot);

      const legGeom = new THREE.CylinderGeometry(0.14, 0.12, 1.1, 8);
      const leg = new THREE.Mesh(legGeom, matObsidianStone);
      leg.position.set(x, 3.4, 0);
      knight.add(leg);
    });

    // Lower Armor Skirt / Faulds
    const skirtGeom = new THREE.CylinderGeometry(0.38, 0.52, 0.7, 8);
    const skirt = new THREE.Mesh(skirtGeom, matObsidianStone);
    skirt.position.set(0, 4.1, 0);
    knight.add(skirt);

    // Cuirass / Torso Chestplate
    const chestGeom = new THREE.BoxGeometry(0.72, 1.1, 0.45);
    const chest = new THREE.Mesh(chestGeom, matObsidianStone);
    chest.position.set(0, 4.8, 0);
    knight.add(chest);

    // Pauldrons (Shoulder Guards)
    [-0.45, 0.45].forEach((x) => {
      const pauldronGeom = new THREE.SphereGeometry(0.26, 8, 8);
      const pauldron = new THREE.Mesh(pauldronGeom, matMachinedSilver);
      pauldron.position.set(x, 5.25, 0);
      pauldron.scale.set(1.2, 0.8, 1.1);
      knight.add(pauldron);
    });

    // Hooded Cowl / Head
    const hoodGeom = new THREE.ConeGeometry(0.32, 0.75, 8);
    const hood = new THREE.Mesh(hoodGeom, matDarkGranite);
    hood.position.set(0, 5.75, -0.05);
    hood.rotation.x = 0.15;
    knight.add(hood);

    // Deep Shadow Face Void inside cowl
    const faceGeom = new THREE.SphereGeometry(0.2, 8, 8);
    const face = new THREE.Mesh(faceGeom, matDarkGranite);
    face.position.set(0, 5.55, 0.08);
    knight.add(face);

    // Flowing Cape falling down the back
    const capeGeom = new THREE.BoxGeometry(0.78, 2.6, 0.1);
    const cape = new THREE.Mesh(capeGeom, matDarkGranite);
    cape.position.set(0, 3.9, -0.22);
    cape.rotation.x = -0.05;
    knight.add(cape);

    // Arms holding Greatsword pointing vertically downward
    [-0.32, 0.32].forEach((x) => {
      const armGeom = new THREE.CylinderGeometry(0.12, 0.1, 0.9, 8);
      const arm = new THREE.Mesh(armGeom, matObsidianStone);
      arm.position.set(x * 0.7, 4.7, 0.22);
      arm.rotation.x = 0.55;
      arm.rotation.z = x > 0 ? -0.35 : 0.35;
      knight.add(arm);
    });

    // Gauntlets gripping hilt
    const gauntletsGeom = new THREE.BoxGeometry(0.28, 0.18, 0.2);
    const gauntlets = new THREE.Mesh(gauntletsGeom, matMachinedSilver);
    gauntlets.position.set(0, 4.4, 0.38);
    knight.add(gauntlets);

    // Two-Handed Longsword
    // Pommel & Grip
    const gripGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.55, 6);
    const grip = new THREE.Mesh(gripGeom, matGothicIron);
    grip.position.set(0, 4.5, 0.38);
    knight.add(grip);

    // Crossguard
    const guardGeom = new THREE.BoxGeometry(0.65, 0.06, 0.08);
    const guard = new THREE.Mesh(guardGeom, matMachinedSilver);
    guard.position.set(0, 4.25, 0.38);
    knight.add(guard);

    // Blade resting tip-down onto pedestal
    const bladeGeom = new THREE.BoxGeometry(0.12, 1.8, 0.04);
    const blade = new THREE.Mesh(bladeGeom, matMachinedSilver);
    blade.position.set(0, 3.3, 0.38);
    knight.add(blade);

    return knight;
  }

  // Left Guardian Statue at x = -2.1, z = -4.5
  const leftKnight = createKnight("Guardian_Left");
  leftKnight.position.set(-2.2, 0, -4.6);
  leftKnight.rotation.y = 0.15;
  root.add(leftKnight);

  // Right Guardian Statue at x = +2.1, z = -4.5
  const rightKnight = createKnight("Guardian_Right");
  rightKnight.position.set(2.2, 0, -4.6);
  rightKnight.rotation.y = -0.15;
  root.add(rightKnight);

  return root;
}

// -------------------------------------------------------------
// 5. HOODED EXPLORER WITH RIGGED SKELETON & ANIMATIONS (public/models/hooded_explorer.glb)
// -------------------------------------------------------------
function buildHoodedExplorer() {
  const root = new THREE.Group();
  root.name = "HoodedExplorer_Root";

  // Create Bone Hierarchy
  const rootBone = new THREE.Bone();
  rootBone.name = "Root";
  rootBone.position.set(0, 0, 0);

  const hips = new THREE.Bone();
  hips.name = "Hips";
  hips.position.set(0, 0.95, 0);
  rootBone.add(hips);

  const spine = new THREE.Bone();
  spine.name = "Spine";
  spine.position.set(0, 0.35, 0);
  hips.add(spine);

  const chest = new THREE.Bone();
  chest.name = "Chest";
  chest.position.set(0, 0.35, 0);
  spine.add(chest);

  const neck = new THREE.Bone();
  neck.name = "Neck";
  neck.position.set(0, 0.22, 0);
  chest.add(neck);

  const head = new THREE.Bone();
  head.name = "Head";
  head.position.set(0, 0.18, 0);
  neck.add(head);

  // Left Leg Chain
  const leftUpLeg = new THREE.Bone();
  leftUpLeg.name = "LeftUpLeg";
  leftUpLeg.position.set(-0.16, -0.05, 0);
  hips.add(leftUpLeg);

  const leftLeg = new THREE.Bone();
  leftLeg.name = "LeftLeg";
  leftLeg.position.set(0, -0.42, 0);
  leftUpLeg.add(leftLeg);

  const leftFoot = new THREE.Bone();
  leftFoot.name = "LeftFoot";
  leftFoot.position.set(0, -0.42, 0.08);
  leftLeg.add(leftFoot);

  // Right Leg Chain
  const rightUpLeg = new THREE.Bone();
  rightUpLeg.name = "RightUpLeg";
  rightUpLeg.position.set(0.16, -0.05, 0);
  hips.add(rightUpLeg);

  const rightLeg = new THREE.Bone();
  rightLeg.name = "RightLeg";
  rightLeg.position.set(0, -0.42, 0);
  rightUpLeg.add(rightLeg);

  const rightFoot = new THREE.Bone();
  rightFoot.name = "RightFoot";
  rightFoot.position.set(0, -0.42, 0.08);
  rightLeg.add(rightFoot);

  // Cape Tail Bone Chain (for wind/walking trailing physics)
  const capeRoot = new THREE.Bone();
  capeRoot.name = "CapeRoot";
  capeRoot.position.set(0, 0.28, -0.15);
  chest.add(capeRoot);

  const capeMid = new THREE.Bone();
  capeMid.name = "CapeMid";
  capeMid.position.set(0, -0.45, -0.05);
  capeRoot.add(capeMid);

  const capeTail = new THREE.Bone();
  capeTail.name = "CapeTail";
  capeTail.position.set(0, -0.45, -0.08);
  capeMid.add(capeTail);

  // Arms
  const leftArm = new THREE.Bone();
  leftArm.name = "LeftArm";
  leftArm.position.set(-0.28, 0.22, 0);
  chest.add(leftArm);

  const rightArm = new THREE.Bone();
  rightArm.name = "RightArm";
  rightArm.position.set(0.28, 0.22, 0);
  chest.add(rightArm);

  // Character Geometry Group attached to skeleton bones
  // 1. Torso & Armor (attached to Chest & Spine)
  const torsoGeom = new THREE.BoxGeometry(0.42, 0.6, 0.26);
  const torsoMesh = new THREE.Mesh(torsoGeom, matDarkGranite);
  torsoMesh.position.set(0, 0.15, 0);
  spine.add(torsoMesh);

  // Silver Trident Crest on back plate
  const crestGeom = new THREE.ConeGeometry(0.12, 0.28, 4);
  const crestMesh = new THREE.Mesh(crestGeom, matMachinedSilver);
  crestMesh.position.set(0, 0.18, -0.14);
  crestMesh.rotation.y = Math.PI / 4;
  chest.add(crestMesh);

  // 2. Hood & Cowl (attached to Head)
  const cowlGeom = new THREE.ConeGeometry(0.24, 0.48, 8);
  const cowlMesh = new THREE.Mesh(cowlGeom, matDarkGranite);
  cowlMesh.position.set(0, 0.08, -0.02);
  cowlMesh.rotation.x = 0.2;
  head.add(cowlMesh);

  const headVoid = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), matDarkGranite);
  headVoid.position.set(0, 0, 0.05);
  head.add(headVoid);

  // 3. Flowing Cape Meshes (attached to Cape Bone Chain)
  const capeTopMesh = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.45, 0.04), matObsidianStone);
  capeTopMesh.position.set(0, -0.22, 0);
  capeRoot.add(capeTopMesh);

  const capeMidMesh = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.45, 0.04), matObsidianStone);
  capeMidMesh.position.set(0, -0.22, 0);
  capeMid.add(capeMidMesh);

  const capeTailMesh = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.45, 0.04), matObsidianStone);
  capeTailMesh.position.set(0, -0.22, 0);
  capeTail.add(capeTailMesh);

  // Silver embroidered hem along the bottom of the cape
  const hemMesh = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.06, 0.05), matMachinedSilver);
  hemMesh.position.set(0, -0.42, 0);
  capeTail.add(hemMesh);

  // 4. Sheathed Broadsword diagonally on Back
  const swordGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.35, 6), matGothicIron);
  swordGrip.position.set(0.14, 0.4, -0.2);
  swordGrip.rotation.z = -0.55;
  chest.add(swordGrip);

  const swordGuard = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.05), matMachinedSilver);
  swordGuard.position.set(0.1, 0.26, -0.2);
  swordGuard.rotation.z = -0.55;
  chest.add(swordGuard);

  const scabbard = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.1, 0.04), matDarkGranite);
  scabbard.position.set(-0.15, -0.24, -0.2);
  scabbard.rotation.z = -0.55;
  chest.add(scabbard);

  // 5. Boots & Legs (attached to Leg bones)
  [
    { bone: leftUpLeg, side: -1 },
    { bone: rightUpLeg, side: 1 },
  ].forEach(({ bone }) => {
    const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.42, 8), matDarkGranite);
    thigh.position.set(0, -0.21, 0);
    bone.add(thigh);
  });

  [
    { bone: leftLeg, side: -1 },
    { bone: rightLeg, side: 1 },
  ].forEach(({ bone }) => {
    const shin = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.42, 8), matObsidianStone);
    shin.position.set(0, -0.21, 0);
    bone.add(shin);
  });

  [
    { bone: leftFoot, side: -1 },
    { bone: rightFoot, side: 1 },
  ].forEach(({ bone }) => {
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.28), matDarkGranite);
    boot.position.set(0, -0.06, 0.04);
    bone.add(boot);
  });

  // 6. Arms & Forearms
  [
    { bone: leftArm, side: -1 },
    { bone: rightArm, side: 1 },
  ].forEach(({ bone, side }) => {
    const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.35, 8), matDarkGranite);
    bicep.position.set(side * 0.05, -0.18, 0);
    bone.add(bicep);

    const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 8), matMachinedSilver);
    pauldron.position.set(side * 0.08, 0, 0);
    pauldron.scale.set(1.2, 0.9, 1.1);
    bone.add(pauldron);
  });

  root.add(rootBone);

  // -----------------------------------------------------------
  // ANIMATION CLIPS (Embedded glTF KeyframeTracks)
  // -----------------------------------------------------------
  // 1. "Idle" Animation Clip (3.0s duration): subtle breathing, weight shift, gentle cape drift
  const idleTracks = [
    // Hips gentle vertical bob
    new THREE.VectorKeyframeTrack(
      "Hips.position",
      [0, 1.5, 3.0],
      [0, 0.95, 0, 0, 0.965, 0, 0, 0.95, 0]
    ),
    // Spine subtle breathing
    new THREE.QuaternionKeyframeTrack(
      "Spine.quaternion",
      [0, 1.5, 3.0],
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.03, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)).toArray(),
      ]
    ),
    // Cape gentle breath wind sway
    new THREE.QuaternionKeyframeTrack(
      "CapeMid.quaternion",
      [0, 1.5, 3.0],
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.14, 0, 0.03)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0, 0)).toArray(),
      ]
    ),
    new THREE.QuaternionKeyframeTrack(
      "CapeTail.quaternion",
      [0, 1.5, 3.0],
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.22, 0, 0.06)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.08, 0, 0)).toArray(),
      ]
    ),
  ];
  const idleClip = new THREE.AnimationClip("Idle", 3.0, idleTracks);

  // 2. "Walk" Animation Clip (1.6s loop): grounded walking gait, alternating legs, hip sway, cape trailing
  const tWalk = [0, 0.4, 0.8, 1.2, 1.6];
  const walkTracks = [
    // Hips vertical bob + lateral sway
    new THREE.VectorKeyframeTrack(
      "Hips.position",
      tWalk,
      [
        0, 0.95, 0,
        0.03, 0.97, 0,
        0, 0.95, 0,
        -0.03, 0.97, 0,
        0, 0.95, 0,
      ]
    ),
    // Left Leg Thigh swing
    new THREE.QuaternionKeyframeTrack(
      "LeftUpLeg.quaternion",
      tWalk,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.45, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.0, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.45, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.45, 0, 0)).toArray(),
      ]
    ),
    // Left Knee flex
    new THREE.QuaternionKeyframeTrack(
      "LeftLeg.quaternion",
      tWalk,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.55, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)).toArray(),
      ]
    ),
    // Right Leg Thigh swing (anti-phase)
    new THREE.QuaternionKeyframeTrack(
      "RightUpLeg.quaternion",
      tWalk,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.45, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.15, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.45, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.0, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.45, 0, 0)).toArray(),
      ]
    ),
    // Right Knee flex
    new THREE.QuaternionKeyframeTrack(
      "RightLeg.quaternion",
      tWalk,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.1, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.55, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.05, 0, 0)).toArray(),
      ]
    ),
    // Arms swinging naturally with gait
    new THREE.QuaternionKeyframeTrack(
      "LeftArm.quaternion",
      tWalk,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.35, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.0, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.0, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.35, 0, 0)).toArray(),
      ]
    ),
    new THREE.QuaternionKeyframeTrack(
      "RightArm.quaternion",
      tWalk,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.0, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.35, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.0, 0, 0)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, 0)).toArray(),
      ]
    ),
    // Cape trailing behind walking character
    new THREE.QuaternionKeyframeTrack(
      "CapeMid.quaternion",
      tWalk,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.22, 0, -0.05)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.32, 0, 0.05)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.22, 0, -0.05)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.32, 0, 0.05)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.22, 0, -0.05)).toArray(),
      ]
    ),
    new THREE.QuaternionKeyframeTrack(
      "CapeTail.quaternion",
      tWalk,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, -0.08)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.48, 0, 0.08)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, -0.08)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.48, 0, 0.08)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.35, 0, -0.08)).toArray(),
      ]
    ),
  ];
  const walkClip = new THREE.AnimationClip("Walk", 1.6, walkTracks);

  return { root, animations: [idleClip, walkClip] };
}

// -------------------------------------------------------------
// 6. GOTHIC FABRIC BANNERS (public/models/gothic_banners.glb)
// -------------------------------------------------------------
function buildGothicBanners() {
  const root = new THREE.Group();
  root.name = "GothicBanners_Root";

  function createBannerInstallation(name, side) {
    const group = new THREE.Group();
    group.name = name;

    // Tall Iron Banner Pole
    const poleGeom = new THREE.CylinderGeometry(0.06, 0.08, 5.2, 8);
    const pole = new THREE.Mesh(poleGeom, matGothicIron);
    pole.position.set(0, 2.6, 0);
    group.add(pole);

    // Gothic spearhead finial on top of pole
    const finialGeom = new THREE.ConeGeometry(0.18, 0.65, 4);
    const finial = new THREE.Mesh(finialGeom, matMachinedSilver);
    finial.position.set(0, 5.4, 0);
    finial.rotation.y = Math.PI / 4;
    group.add(finial);

    // Horizontal Iron Crossbar holding the fabric
    const barGeom = new THREE.CylinderGeometry(0.035, 0.035, 1.4, 6);
    const bar = new THREE.Mesh(barGeom, matGothicIron);
    bar.position.set(side * 0.45, 4.6, 0);
    bar.rotation.z = Math.PI / 2;
    group.add(bar);

    // Banner Bone Chain for Wind Animation
    const bannerRootBone = new THREE.Bone();
    bannerRootBone.name = `${name}_Bone0`;
    bannerRootBone.position.set(side * 0.45, 4.6, 0);
    group.add(bannerRootBone);

    const bannerMidBone = new THREE.Bone();
    bannerMidBone.name = `${name}_Bone1`;
    bannerMidBone.position.set(0, -1.1, 0);
    bannerRootBone.add(bannerMidBone);

    const bannerTailBone = new THREE.Bone();
    bannerTailBone.name = `${name}_Bone2`;
    bannerTailBone.position.set(0, -1.1, 0);
    bannerMidBone.add(bannerTailBone);

    // Upper Fabric Panel
    const topFabric = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 0.02), matDarkGranite);
    topFabric.position.set(0, -0.55, 0);
    bannerRootBone.add(topFabric);

    // Silver Crown / Trident Emblem
    const emblem = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.45, 3), matMachinedSilver);
    emblem.position.set(0, -0.55, 0.02);
    bannerRootBone.add(emblem);

    // Mid Fabric Panel
    const midFabric = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.1, 0.02), matDarkGranite);
    midFabric.position.set(0, -0.55, 0);
    bannerMidBone.add(midFabric);

    // Tail Fabric with swallowtail cut
    const tailFabric = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.1, 3), matDarkGranite);
    tailFabric.position.set(0, -0.55, 0);
    tailFabric.rotation.z = Math.PI;
    bannerTailBone.add(tailFabric);

    // Silver Fringed Edge
    const trim = new THREE.Mesh(new THREE.BoxGeometry(1.24, 0.05, 0.03), matMachinedSilver);
    trim.position.set(0, 0, 0);
    bannerRootBone.add(trim);

    return group;
  }

  // Left Foreground Banner at x = -2.4, z = 1.8
  const leftBanner = createBannerInstallation("Banner_ForegroundLeft", 1);
  leftBanner.position.set(-2.3, 0, 1.8);
  root.add(leftBanner);

  // Right Foreground Banner at x = +2.4, z = -0.6
  const rightBanner = createBannerInstallation("Banner_ForegroundRight", -1);
  rightBanner.position.set(2.3, 0, -0.6);
  root.add(rightBanner);

  // Secondary Portal Terrace Banners (at stairs)
  const leftMidBanner = createBannerInstallation("Banner_MidLeft", 1);
  leftMidBanner.position.set(-2.3, 1.2, -3.2);
  leftMidBanner.scale.set(0.85, 0.85, 0.85);
  root.add(leftMidBanner);

  const rightMidBanner = createBannerInstallation("Banner_MidRight", -1);
  rightMidBanner.position.set(2.3, 1.2, -3.2);
  rightMidBanner.scale.set(0.85, 0.85, 0.85);
  root.add(rightMidBanner);

  // Wind Wave Animation Clip (2.4s loop)
  const tWind = [0, 0.6, 1.2, 1.8, 2.4];
  const windTracks = [
    new THREE.QuaternionKeyframeTrack(
      "Banner_ForegroundLeft_Bone1.quaternion",
      tWind,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.12, 0.05, 0.02)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.28, 0.12, 0.05)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.14, 0.04, -0.02)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.24, 0.09, 0.04)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.12, 0.05, 0.02)).toArray(),
      ]
    ),
    new THREE.QuaternionKeyframeTrack(
      "Banner_ForegroundLeft_Bone2.quaternion",
      tWind,
      [
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.25, 0.1, 0.05)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.48, 0.22, 0.12)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.28, 0.08, -0.04)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.42, 0.18, 0.08)).toArray(),
        ...new THREE.Quaternion().setFromEuler(new THREE.Euler(0.25, 0.1, 0.05)).toArray(),
      ]
    ),
  ];
  const windClip = new THREE.AnimationClip("Wind", 2.4, windTracks);

  return { root, animations: [windClip] };
}

// -------------------------------------------------------------
// 7. CLIFF ROCKS & WATERFALLS (public/models/cliff_waterfalls.glb)
// -------------------------------------------------------------
function buildCliffWaterfalls() {
  const root = new THREE.Group();
  root.name = "CliffWaterfalls_Root";

  const matWaterfall = new THREE.MeshStandardMaterial({
    color: 0x90b5e0,
    emissive: 0x4a6a95,
    emissiveIntensity: 0.65,
    roughness: 0.15,
    metalness: 0.7,
    transparent: true,
    opacity: 0.85,
    name: "Mat_Waterfall",
  });

  // Left & Right Great Abyssal Cliffs flanking the bridge
  [-1, 1].forEach((dir) => {
    const xBase = dir * 10.5;

    // Massive tiered rock cliff blocks
    for (let i = 0; i < 4; i++) {
      const rockGeom = new THREE.DodecahedronGeometry(3.5 + i * 0.8, 1);
      const rock = new THREE.Mesh(rockGeom, matDarkGranite);
      rock.position.set(xBase + dir * (i * 1.2), -4 + i * 2.2, -4.5 + i * 1.5);
      rock.scale.set(1.4, 1.8, 1.2);
      root.add(rock);
    }

    // Cascading Waterfall Ribbon Sheers
    const fallGeom = new THREE.PlaneGeometry(3.2, 14, 8, 16);
    const fall = new THREE.Mesh(fallGeom, matWaterfall);
    fall.position.set(dir * 7.5, -2.5, -4.0);
    fall.rotation.y = dir > 0 ? -0.3 : 0.3;
    root.add(fall);

    // Waterfall Mist / Foam Basin at bottom
    const foamGeom = new THREE.SphereGeometry(2.4, 8, 8);
    const foam = new THREE.Mesh(foamGeom, matWaterfall);
    foam.position.set(dir * 7.5, -9.0, -4.0);
    foam.scale.set(1.8, 0.5, 1.2);
    root.add(foam);
  });

  return root;
}

// -------------------------------------------------------------
// 8. DISTANT FLOATING OBSIDIAN ISLANDS (public/models/floating_islands.glb)
// -------------------------------------------------------------
function buildFloatingIslands() {
  const root = new THREE.Group();
  root.name = "FloatingIslands_Root";

  // Island 1 (High Left Island at x = -8, y = 14, z = -14)
  const is1 = new THREE.Group();
  is1.position.set(-8.5, 14, -14);

  const rock1 = new THREE.Mesh(new THREE.ConeGeometry(2.8, 4.5, 7), matDarkGranite);
  rock1.rotation.x = Math.PI; // upside down hanging stalactite rock
  is1.add(rock1);

  const plateau1 = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 2.5, 0.6, 7), matObsidianStone);
  plateau1.position.set(0, 2.3, 0);
  is1.add(plateau1);

  // Mini spire tower on island 1
  const spire1 = new THREE.Mesh(new THREE.ConeGeometry(0.8, 4.0, 6), matGothicIron);
  spire1.position.set(0, 4.4, 0);
  is1.add(spire1);
  root.add(is1);

  // Island 2 (Distant Right Island at x = 11, y = 16, z = -18)
  const is2 = new THREE.Group();
  is2.position.set(11.5, 16.5, -18);

  const rock2 = new THREE.Mesh(new THREE.ConeGeometry(3.5, 5.5, 8), matDarkGranite);
  rock2.rotation.x = Math.PI;
  is2.add(rock2);

  const plateau2 = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.2, 0.8, 8), matObsidianStone);
  plateau2.position.set(0, 2.8, 0);
  is2.add(plateau2);

  const spire2 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 5.5, 6), matGothicIron);
  spire2.position.set(0, 5.8, 0);
  is2.add(spire2);
  root.add(is2);

  return root;
}

// -------------------------------------------------------------
// MAIN BUILD EXECUTION
// -------------------------------------------------------------
async function run() {
  console.log("=================================================");
  console.log("BUILDING REAL AAA GLB ASSETS FOR OBSIDIAN CITADEL");
  console.log("=================================================");

  // 1. Gothic Citadel
  const citadel = buildGothicCitadel();
  await exportGLB(citadel, "gothic_citadel.glb");

  // 2. Stone Bridge & Stairs
  const bridge = buildStoneBridge();
  await exportGLB(bridge, "stone_bridge.glb");

  // 3. Portal Gate
  const portal = buildPortalGate();
  await exportGLB(portal, "portal_gate.glb");

  // 4. Guardian Statues
  const statues = buildGuardianStatues();
  await exportGLB(statues, "guardian_statues.glb");

  // 5. Hooded Explorer (with Skinned Bones & Animations)
  const explorerObj = buildHoodedExplorer();
  await exportGLB(explorerObj.root, "hooded_explorer.glb", explorerObj.animations);

  // 6. Fabric Banners (with Wind Animation)
  const bannersObj = buildGothicBanners();
  await exportGLB(bannersObj.root, "gothic_banners.glb", bannersObj.animations);

  // 7. Cliffs & Waterfalls
  const cliffs = buildCliffWaterfalls();
  await exportGLB(cliffs, "cliff_waterfalls.glb");

  // 8. Floating Islands
  const islands = buildFloatingIslands();
  await exportGLB(islands, "floating_islands.glb");

  console.log("=================================================");
  console.log("ALL GLB ASSETS SUCCESSFULLY GENERATED IN public/models/");
  console.log("=================================================");
}

run().catch((err) => {
  console.error("FATAL BUILD ERROR:", err);
  process.exit(1);
});
