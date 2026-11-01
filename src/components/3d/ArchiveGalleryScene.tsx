import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// PROCEDURAL TEXTURE GENERATORS (Strict Monochrome Palette)
// ============================================================================

/**
 * High-fidelity scanned document texture:
 * Scanned parchment document with authentic typography, alignment crop brackets [   ],
 * telemetry header, and table blocks.
 */
function createScannedDocumentTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep dark obsidian background
  ctx.fillStyle = "#090a0f";
  ctx.fillRect(0, 0, 1024, 1440);

  // Micro technical grid
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let x = 32; x < 1024; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1440);
    ctx.stroke();
  }
  for (let y = 32; y < 1440; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Authentic parchment center panel
  const docX = 90;
  const docY = 120;
  const docW = 844;
  const docH = 1200;

  ctx.fillStyle = "#12141c";
  ctx.fillRect(docX, docY, docW, docH);

  // Document outer border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(docX, docY, docW, docH);

  // Prominent Corner Crop / Alignment Brackets [   ]
  const brkLen = 48;
  const brkThick = 4.5;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = brkThick;

  // Top-Left [
  ctx.beginPath();
  ctx.moveTo(docX - 22, docY + brkLen);
  ctx.lineTo(docX - 22, docY - 22);
  ctx.lineTo(docX + brkLen, docY - 22);
  ctx.stroke();

  // Top-Right ]
  ctx.beginPath();
  ctx.moveTo(docX + docW - brkLen, docY - 22);
  ctx.lineTo(docX + docW + 22, docY - 22);
  ctx.lineTo(docX + docW + 22, docY + brkLen);
  ctx.stroke();

  // Bottom-Left [
  ctx.beginPath();
  ctx.moveTo(docX - 22, docY + docH - brkLen);
  ctx.lineTo(docX - 22, docY + docH + 22);
  ctx.lineTo(docX + brkLen, docY + docH + 22);
  ctx.stroke();

  // Bottom-Right ]
  ctx.beginPath();
  ctx.moveTo(docX + docW - brkLen, docY + docH + 22);
  ctx.lineTo(docX + docW + 22, docY + docH + 22);
  ctx.lineTo(docX + docW + 22, docY + docH - brkLen);
  ctx.stroke();

  // Document Title Header
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px 'Courier New', monospace";
  ctx.fillText("DOCRECON // SPATIAL OCR AUDIT", docX + 45, docY + 70);

  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  ctx.font = "17px 'Courier New', monospace";
  ctx.fillText("SPECIMEN_ID: 884-DR-2026 • ENGINE: PADDLE-OCR • ACCURACY: 99.8%", docX + 45, docY + 105);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(docX + 45, docY + 125);
  ctx.lineTo(docX + docW - 45, docY + 125);
  ctx.stroke();

  // Scanned text simulated lines & blocks
  ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
  for (let i = 0; i < 18; i++) {
    const ly = docY + 170 + i * 32;
    const lw = i % 4 === 3 ? docW * 0.45 : docW * 0.82;
    ctx.fillRect(docX + 45, ly, lw, 9);
  }

  // Active OCR bounding box detection rect
  const bbxX = docX + 40;
  const bbxY = docY + 340;
  const bbxW = docW - 80;
  const bbxH = 95;

  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(bbxX, bbxY, bbxW, bbxH);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(bbxX, bbxY, bbxW, bbxH);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 15px 'Courier New', monospace";
  ctx.fillText("[ EXTRACTED ENTITY: RECON_TAX_INVOICE_LEDGER ]", bbxX + 15, bbxY - 8);

  // Financial summary block
  const sumY = docY + 780;
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(docX + 45, sumY, docW - 90, 180);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.strokeRect(docX + 45, sumY, docW - 90, 180);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px 'Courier New', monospace";
  ctx.fillText("GRAND TOTAL CONFIRMED: $ 19,647.00", docX + 75, sumY + 60);

  ctx.font = "18px 'Courier New', monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  ctx.fillText("CRYPTOGRAPHIC HASH: 0x9f4a81...b204e [VERIFIED]", docX + 75, sumY + 110);
  ctx.fillText("TIMESTAMP: 2026-11-01T10:35:15Z", docX + 75, sumY + 145);

  // Stamp Seal Emblem
  const stX = docX + docW - 130;
  const stY = docY + docH - 120;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(stX, stY, 54, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(stX, stY, 46, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("AUDIT SEAL", stX, stY - 6);
  ctx.fillText("VERIFIED", stX, stY + 12);
  ctx.textAlign = "left";

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Isometric circuit / data grid texture for the horizontal stacked planes
 */
function createCircuitGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#090b12";
  ctx.fillRect(0, 0, 512, 512);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1.2;
  const step = 32;
  for (let x = 0; x <= 512; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Microchips and data pads
  for (let i = 0; i < 16; i++) {
    const rx = ((i * 97) % 14) * 32 + 8;
    const ry = ((i * 131) % 14) * 32 + 8;
    ctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.75)" : "rgba(255, 255, 255, 0.35)";
    ctx.fillRect(rx, ry, 16, 16);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rx + 8, ry + 16);
    ctx.lineTo(rx + 8, ry + 28);
    ctx.lineTo(rx + 24, ry + 28);
    ctx.stroke();
  }

  // Outer border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 504, 504);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Secondary technical code/schematic document texture
 */
function createSecondaryDocumentTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#080a12";
  ctx.fillRect(0, 0, 512, 720);

  ctx.fillStyle = "rgba(255, 255, 255, 0.14)";
  ctx.fillRect(24, 24, 464, 48);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 16px 'Courier New', monospace";
  ctx.fillText(`LAYER #0${index + 1} // SCHEMATIC INFERENCE`, 40, 54);

  for (let i = 0; i < 16; i++) {
    const y = 100 + i * 34;
    ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
    const w = 440 - ((i * 47) % 200);
    ctx.fillRect(36, y, w, 12);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(36, 360, 440, 110);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Skyscraper illuminated window texture
 */
function createCityWindowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#08090f";
  ctx.fillRect(0, 0, 512, 512);

  const cols = 24;
  const rows = 48;
  const cw = 512 / cols;
  const rh = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rand = Math.sin(r * 9.2 + c * 4.7);
      if (rand > -0.25) {
        const bright = rand > 0.35 ? 1.0 : 0.7;
        ctx.fillStyle = `rgba(255, 255, 255, ${bright})`;
        ctx.fillRect(c * cw + 2, r * rh + 1, cw - 4, rh - 3);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  return texture;
}

/**
 * City ground road network texture
 */
function createCityGroundRoadTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#090a10";
  ctx.fillRect(0, 0, 1024, 1024);

  const cx = 512;
  const cy = 512;

  // Concentric orbital roads
  [120, 220, 320, 420, 470].forEach((r) => {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Radial arterial avenues
  for (let a = 0; a < 16; a++) {
    const angle = (a * Math.PI) / 8;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 80, cy + Math.sin(angle) * 80);
    ctx.lineTo(cx + Math.cos(angle) * 480, cy + Math.sin(angle) * 480);
    ctx.stroke();
  }

  // Interconnected circular node rings
  for (let a = 0; a < 12; a++) {
    const angle = (a * Math.PI) / 6;
    const nx = cx + Math.cos(angle) * 320;
    const ny = cy + Math.sin(angle) * 320;

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(nx, ny, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(nx, ny, 18, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Gothic pointed-arch arcade frieze texture with high-contrast lancet arches & trefoils
 */
function createGothicArcadeTexture(isCenter = false): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#12141c";
  ctx.fillRect(0, 0, 1024, 256);

  const arches = isCenter ? 24 : 18;
  const archW = 1024 / arches;

  for (let i = 0; i < arches; i++) {
    const x0 = i * archW;
    const xMid = x0 + archW / 2;
    const x1 = x0 + archW;

    // Recessed dark arch interior
    ctx.fillStyle = "#020305";
    ctx.beginPath();
    ctx.moveTo(x0 + 4, 252);
    ctx.lineTo(x0 + 4, 110);
    ctx.quadraticCurveTo(x0 + 4, 20, xMid, 12);
    ctx.quadraticCurveTo(x1 - 4, 20, x1 - 4, 110);
    ctx.lineTo(x1 - 4, 252);
    ctx.closePath();
    ctx.fill();

    // High-contrast outer pointed arch molding
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Inner arch accent
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0 + 10, 240);
    ctx.lineTo(x0 + 10, 115);
    ctx.quadraticCurveTo(x0 + 10, 36, xMid, 28);
    ctx.quadraticCurveTo(x1 - 10, 36, x1 - 10, 115);
    ctx.lineTo(x1 - 10, 240);
    ctx.stroke();

    // Trefoil cusp head
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(xMid, 55, archW * 0.16, 0, Math.PI * 2);
    ctx.stroke();

    // Center vertical glowing light column if center pedestal
    if (isCenter) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(xMid - 2.5, 42, 5, 200);
      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fillRect(xMid - 8, 38, 16, 208);
    }
  }

  // Upper & lower horizontal frieze bands
  ctx.fillStyle = "#252834";
  ctx.fillRect(0, 0, 1024, 16);
  ctx.fillRect(0, 240, 1024, 16);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 16);
  ctx.lineTo(1024, 16);
  ctx.moveTo(0, 240);
  ctx.lineTo(1024, 240);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// ============================================================================
// 06: GOTHIC ARCHITECTURAL PEDESTAL COMPONENT
// Circular black stone base, metallic beveled rings, gothic pointed-arch arcade,
// illuminated upper rim with toneMapped=false for brilliant white radiance.
// ============================================================================
function GothicPedestal({
  radius = 1.28,
  height = 0.82,
  isCenter = false,
  highlightColor = "#ffffff",
  opacityFactor = 1.0,
}: {
  radius?: number;
  height?: number;
  isCenter?: boolean;
  highlightColor?: string;
  opacityFactor?: number;
}) {
  const arcadeTexture = useMemo(() => createGothicArcadeTexture(isCenter), [isCenter]);

  // Generate 3D gothic vertical arcade mullions around the perimeter
  const mullions = useMemo(() => {
    const count = isCenter ? 24 : 18;
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      items.push({
        x: Math.cos(angle) * (radius + 0.015),
        z: Math.sin(angle) * (radius + 0.015),
        rotY: -angle,
      });
    }
    return items;
  }, [radius, isCenter]);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Floor shadow and floor reflection ring */}
      <mesh position={[0, -height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.98, radius * 1.38, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.9 * opacityFactor} />
      </mesh>
      <mesh position={[0, -height / 2 + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.04, radius * 1.09, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          transparent
          opacity={0.65 * opacityFactor}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. Stepped Lower Base Plinth (Dark obsidian stone) */}
      <mesh position={[0, -height / 2 + 0.05, 0]}>
        <cylinderGeometry args={[radius * 1.1, radius * 1.15, 0.1, 64]} />
        <meshStandardMaterial color="#0d0e14" roughness={0.15} metalness={0.92} />
      </mesh>
      {/* Beveled base torus ring */}
      <mesh position={[0, -height / 2 + 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.04, 0.035, 16, 64]} />
        <meshStandardMaterial color="#505260" roughness={0.15} metalness={0.92} />
      </mesh>

      {/* 3. Main Cylindrical Drum with Gothic Pointed-Arch Arcade Texture */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius, radius, height * 0.76, 64]} />
        <meshStandardMaterial
          map={arcadeTexture}
          color="#161822"
          roughness={0.2}
          metalness={0.88}
          emissive="#252834"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* 4. Physical Gothic Mullion Ribs around Drum Perimeter */}
      {mullions.map((m, idx) => (
        <group key={idx} position={[m.x, 0, m.z]} rotation={[0, m.rotY, 0]}>
          <mesh>
            <boxGeometry args={[0.04, height * 0.74, 0.06]} />
            <meshStandardMaterial color="#262834" roughness={0.2} metalness={0.88} />
          </mesh>
          {isCenter && (
            <mesh position={[0, 0, 0.032]}>
              <boxGeometry args={[0.016, height * 0.72, 0.016]} />
              <meshBasicMaterial
                color="#ffffff"
                toneMapped={false}
                transparent
                opacity={0.95 * opacityFactor}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* 5. Flared Upper Collar & Beveled Rings */}
      <mesh position={[0, height / 2 - 0.05, 0]}>
        <cylinderGeometry args={[radius * 1.05, radius * 0.98, 0.08, 64]} />
        <meshStandardMaterial color="#1c1e28" roughness={0.18} metalness={0.92} />
      </mesh>
      <mesh position={[0, height / 2 - 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * 1.02, 0.035, 16, 64]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.95} />
      </mesh>

      {/* 6. Glowing Upper Rim Ring (Exact target white illumination with toneMapped=false) */}
      <mesh position={[0, height / 2 + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.88, radius * 1.01, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          transparent
          opacity={0.98 * opacityFactor}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, height / 2 + 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.72, radius * 0.76, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          toneMapped={false}
          transparent
          opacity={0.6 * opacityFactor}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pedestal Top Stone Surface */}
      <mesh position={[0, height / 2 - 0.002, 0]}>
        <cylinderGeometry args={[radius * 0.88, radius * 0.88, 0.02, 48]} />
        <meshStandardMaterial color="#08090f" roughness={0.25} metalness={0.85} />
      </mesh>
    </group>
  );
}

// ============================================================================
// 03: EXHIBIT 01: DOCRECON — MULTI-LAYER FLOATING DOCUMENT INTELLIGENCE
// Layered glass panels, scanned manuscript page, OCR detection brackets [ ],
// 3D wireframe terrain/mesh map, 2 isometric circuit grid sheets, scanning beam.
// ============================================================================
function DocReconExhibit({
  isSelected,
  isHovered,
  isDimmed,
  position,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scanBeamRef = useRef<THREE.Group>(null);
  const frontDocRef = useRef<THREE.Group>(null);
  const terrainMeshRef = useRef<THREE.Mesh>(null);

  const scannedTexture = useMemo(() => createScannedDocumentTexture(), []);
  const circuitTexture = useMemo(() => createCircuitGridTexture(), []);
  const bgTexture1 = useMemo(() => createSecondaryDocumentTexture(0), []);
  const bgTexture2 = useMemo(() => createSecondaryDocumentTexture(1), []);

  // 3D Topological Terrain/Mesh Map geometry (as seen in reference top-right of documents)
  const terrainGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.85, 0.65, 24, 20);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 5.2) * Math.cos(v * 4.8) * 0.12 + Math.sin(u * 2.8) * 0.08;
      pos.setZ(i, z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.1) * 0.035;
    }

    if (scanBeamRef.current) {
      const scanY = Math.sin(t * 1.7) * 0.72;
      scanBeamRef.current.position.y = scanY;
    }

    if (frontDocRef.current) {
      const targetZ = isHovered || isSelected ? 0.22 : 0.0;
      frontDocRef.current.position.z += (targetZ - frontDocRef.current.position.z) * 0.1;
    }

    if (terrainMeshRef.current) {
      terrainMeshRef.current.rotation.z = Math.sin(t * 0.6) * 0.05;
    }
  });

  const opacityFactor = isDimmed ? 0.35 : 1.0;
  const highlightColor = isSelected ? "#ffffff" : isHovered ? "#e0e2ec" : "#9496a4";

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
    >
      {/* Click / Hover Target Cylinder */}
      <mesh position={[0, 1.1, 0]} visible={false}>
        <cylinderGeometry args={[1.4, 1.4, 2.6, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 3D GOTHIC CIRCULAR PEDESTAL */}
      <GothicPedestal
        radius={1.28}
        height={0.82}
        isCenter={false}
        highlightColor={highlightColor}
        opacityFactor={opacityFactor}
      />

      {/* =================================================================== */}
      {/* FLOATING DOCUMENT INSTALLATION STACK (Elevated above pedestal) */}
      {/* =================================================================== */}
      <group position={[0, 1.35, 0]}>
        {/* BACKGROUND DOCUMENT SHEET 3 (Deepest, Left Tilt) */}
        <group position={[-0.48, 0.3, -0.45]} rotation={[0.06, 0.24, -0.08]}>
          <mesh>
            <planeGeometry args={[1.15, 1.55]} />
            <meshStandardMaterial
              map={bgTexture2}
              transparent
              opacity={0.45 * opacityFactor}
              roughness={0.2}
              metalness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.15, 1.55)]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.3 * opacityFactor} />
          </lineSegments>
        </group>

        {/* BACKGROUND DOCUMENT SHEET 2 (Right Tilt) */}
        <group position={[0.42, 0.22, -0.32]} rotation={[-0.04, -0.18, 0.05]}>
          <mesh>
            <planeGeometry args={[1.2, 1.62]} />
            <meshStandardMaterial
              map={bgTexture1}
              transparent
              opacity={0.65 * opacityFactor}
              roughness={0.2}
              metalness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 1.62)]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.45 * opacityFactor} />
          </lineSegments>
        </group>

        {/* 3D TOPOLOGICAL TERRAIN / MESH MAP (Floating Top-Right of Documents) */}
        <group position={[0.74, 0.62, 0.12]} rotation={[-0.35, 0.28, -0.12]}>
          <mesh ref={terrainMeshRef} geometry={terrainGeometry}>
            <meshStandardMaterial
              wireframe
              color={highlightColor}
              roughness={0.1}
              metalness={0.9}
              transparent
              opacity={0.88 * opacityFactor}
            />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[0.85, 0.65]} />
            <meshBasicMaterial color="#07080e" transparent opacity={0.8 * opacityFactor} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.85, 0.65)]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.7 * opacityFactor} />
          </lineSegments>
        </group>

        {/* TWO HORIZONTALLY TILTED ISOMETRIC CIRCUIT / DATA GRID SHEETS (Underneath Document) */}
        <group position={[-0.05, -0.42, 0.18]} rotation={[1.08, 0.04, -0.18]}>
          <mesh>
            <planeGeometry args={[1.18, 0.88]} />
            <meshStandardMaterial
              map={circuitTexture}
              transparent
              opacity={0.85 * opacityFactor}
              roughness={0.2}
              metalness={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.18, 0.88)]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.75 * opacityFactor} />
          </lineSegments>
        </group>

        <group position={[-0.08, -0.56, 0.14]} rotation={[1.08, 0.04, -0.18]}>
          <mesh>
            <planeGeometry args={[1.12, 0.84]} />
            <meshStandardMaterial
              map={circuitTexture}
              transparent
              opacity={0.6 * opacityFactor}
              roughness={0.2}
              metalness={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.12, 0.84)]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.45 * opacityFactor} />
          </lineSegments>
        </group>

        {/* PRIMARY FOREGROUND SCANNED DOCUMENT SURFACE */}
        <group ref={frontDocRef} position={[-0.08, 0.08, 0.06]} rotation={[0.02, -0.06, 0.02]}>
          <mesh>
            <planeGeometry args={[1.32, 1.86]} />
            <meshStandardMaterial
              map={scannedTexture}
              transparent
              opacity={0.96 * opacityFactor}
              roughness={0.15}
              metalness={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Crisp Silver Border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.32, 1.86)]} />
            <lineBasicMaterial color={highlightColor} transparent opacity={0.92 * opacityFactor} />
          </lineSegments>

          {/* SWEEPING SCANNING LASER BEAM */}
          <group ref={scanBeamRef} position={[0, 0, 0.035]}>
            {/* Core Intense Laser Line */}
            <mesh>
              <planeGeometry args={[1.35, 0.025]} />
              <meshBasicMaterial
                color="#ffffff"
                toneMapped={false}
                transparent
                opacity={0.98 * opacityFactor}
              />
            </mesh>
            {/* Laser Soft Glow Quad */}
            <mesh>
              <planeGeometry args={[1.38, 0.15]} />
              <meshBasicMaterial
                color="#e0e8ff"
                toneMapped={false}
                transparent
                opacity={0.45 * opacityFactor}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
            <pointLight position={[0, 0, 0.18]} distance={2.4} decay={2} color="#ffffff" intensity={2.8} />
          </group>

          {/* Top Floating Badge: [ OCR SCANNING... ] */}
          <group position={[-0.15, 1.05, 0.06]}>
            <mesh>
              <planeGeometry args={[0.72, 0.15]} />
              <meshBasicMaterial color="#080a10" transparent opacity={0.88 * opacityFactor} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.72, 0.15)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.7 * opacityFactor} />
            </lineSegments>
            <mesh position={[-0.08, 0, 0.01]}>
              <planeGeometry args={[0.42, 0.02]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          </group>

          {/* Floating [ T ] Text Extraction Badge */}
          <group position={[0.76, 0.42, 0.08]}>
            <mesh>
              <planeGeometry args={[0.2, 0.2]} />
              <meshBasicMaterial color="#090b12" transparent opacity={0.85 * opacityFactor} />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.2, 0.2)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.6 * opacityFactor} />
            </lineSegments>
            <mesh position={[0, 0.035, 0.01]}>
              <planeGeometry args={[0.09, 0.02]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh position={[0, -0.015, 0.01]}>
              <planeGeometry args={[0.02, 0.09]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// 04: EXHIBIT 02: PATHWAY AI — MINIATURE SMART METROPOLIS
// Stepped skyscrapers, vertical illuminated windows, street road network plate,
// 3 floating map pins [ 📍 ], telemetry bar chart [ 📊 ], suspended wireframe
// intelligence sphere with dual atomic gimbal rings, orbital data ribbon.
// ============================================================================
function PathwayCityExhibit({
  isSelected,
  isHovered,
  isDimmed,
  position,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const orbitalSphereRef = useRef<THREE.Group>(null);
  const gimbalRing1Ref = useRef<THREE.Mesh>(null);
  const gimbalRing2Ref = useRef<THREE.Mesh>(null);
  const dataRibbonPulseRef = useRef<THREE.Mesh>(null);

  const windowTexture = useMemo(() => createCityWindowTexture(), []);
  const groundRoadTexture = useMemo(() => createCityGroundRoadTexture(), []);

  // Dense miniature metropolis: 30+ stepped skyscrapers with architectural variation
  const buildings = useMemo(() => {
    return [
      // Central Spire Skyscrapers (Tallest, stepped architecture)
      { x: 0.0, z: -0.05, w: 0.34, d: 0.34, h: 2.2, spire: true },
      { x: 0.26, z: -0.16, w: 0.3, d: 0.28, h: 1.95, spire: true },
      { x: -0.28, z: 0.12, w: 0.32, d: 0.3, h: 1.75, spire: false },
      { x: -0.32, z: -0.25, w: 0.26, d: 0.26, h: 1.55, spire: false },
      { x: 0.35, z: 0.18, w: 0.28, d: 0.26, h: 1.48, spire: false },

      // Mid-Rise Stepped Blocks
      { x: -0.56, z: -0.02, w: 0.24, d: 0.24, h: 1.32, spire: false },
      { x: 0.58, z: -0.08, w: 0.25, d: 0.26, h: 1.36, spire: false },
      { x: 0.14, z: 0.38, w: 0.26, d: 0.24, h: 1.22, spire: false },
      { x: -0.16, z: -0.48, w: 0.26, d: 0.26, h: 1.18, spire: false },
      { x: 0.44, z: -0.42, w: 0.22, d: 0.24, h: 1.05, spire: false },
      { x: -0.48, z: 0.36, w: 0.24, d: 0.22, h: 0.98, spire: false },

      // Low-Rise Outer Blocks & Infrastructure
      { x: -0.72, z: -0.28, w: 0.2, d: 0.2, h: 0.82, spire: false },
      { x: 0.72, z: 0.24, w: 0.22, d: 0.2, h: 0.76, spire: false },
      { x: 0.34, z: 0.54, w: 0.2, d: 0.2, h: 0.72, spire: false },
      { x: -0.38, z: -0.65, w: 0.2, d: 0.2, h: 0.68, spire: false },
      { x: 0.68, z: -0.38, w: 0.18, d: 0.18, h: 0.62, spire: false },
      { x: -0.68, z: 0.48, w: 0.18, d: 0.18, h: 0.56, spire: false },
      { x: 0.0, z: -0.68, w: 0.2, d: 0.18, h: 0.52, spire: false },
      { x: -0.12, z: 0.62, w: 0.22, d: 0.18, h: 0.48, spire: false },
      { x: 0.52, z: 0.46, w: 0.18, d: 0.18, h: 0.45, spire: false },
      { x: -0.52, z: -0.52, w: 0.18, d: 0.18, h: 0.42, spire: false },
    ];
  }, []);

  // 3 Floating Location Map Pins [ 📍 ] positions
  const mapPins = useMemo(() => {
    return [
      { x: -0.56, y: 1.72, z: 0.05 }, // Over left tower
      { x: -0.22, y: 2.12, z: -0.18 }, // Over center-left skyscraper
      { x: 0.52, y: 0.98, z: 0.38 }, // Lower right foreground
    ];
  }, []);

  // Encircling inclined orbital data ribbon curve
  const ribbonCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.42, 0.35, 0.35),
      new THREE.Vector3(-0.75, 0.58, 1.05),
      new THREE.Vector3(0.25, 0.68, 1.18),
      new THREE.Vector3(1.15, 0.52, 0.75),
      new THREE.Vector3(1.42, 0.36, -0.15),
      new THREE.Vector3(0.85, 0.52, -1.05),
      new THREE.Vector3(-0.15, 0.64, -1.18),
      new THREE.Vector3(-1.05, 0.46, -0.72),
      new THREE.Vector3(-1.42, 0.35, 0.35),
    ]);
  }, []);

  const ribbonGeometry = useMemo(() => {
    return new THREE.TubeGeometry(ribbonCurve, 64, 0.024, 8, true);
  }, [ribbonCurve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.95 + 1.2) * 0.03;
    }

    if (orbitalSphereRef.current) {
      orbitalSphereRef.current.rotation.y = t * 0.45;
    }
    if (gimbalRing1Ref.current) {
      gimbalRing1Ref.current.rotation.x = t * 0.75;
      gimbalRing1Ref.current.rotation.y = t * 0.35;
    }
    if (gimbalRing2Ref.current) {
      gimbalRing2Ref.current.rotation.z = t * 0.65;
      gimbalRing2Ref.current.rotation.y = -t * 0.45;
    }

    if (dataRibbonPulseRef.current) {
      const u = (t * 0.28) % 1.0;
      const pt = ribbonCurve.getPoint(u);
      dataRibbonPulseRef.current.position.copy(pt);
    }
  });

  const opacityFactor = isDimmed ? 0.35 : 1.0;
  const highlightColor = isSelected ? "#ffffff" : isHovered ? "#e0e2ec" : "#9496a4";

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
    >
      {/* Click / Hover Target Cylinder */}
      <mesh position={[0, 1.3, 0]} visible={false}>
        <cylinderGeometry args={[1.75, 1.75, 2.9, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 3D GOTHIC CIRCULAR PEDESTAL (Wider, prominent vertical light columns) */}
      <GothicPedestal
        radius={1.65}
        height={0.82}
        isCenter={true}
        highlightColor={highlightColor}
        opacityFactor={opacityFactor}
      />

      {/* =================================================================== */}
      {/* MINIATURE SMART METROPOLIS */}
      {/* =================================================================== */}
      <group position={[0, 0.42, 0]}>
        {/* CIRCULAR GLOWING ROAD NETWORK GROUND BASE PLATE */}
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.52, 64]} />
          <meshStandardMaterial
            map={groundRoadTexture}
            color="#141620"
            roughness={0.2}
            metalness={0.88}
          />
        </mesh>
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.48, 1.54, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            toneMapped={false}
            transparent
            opacity={0.88 * opacityFactor}
          />
        </mesh>

        {/* 30+ STEPPED SKYSCRAPERS */}
        {buildings.map((b, idx) => (
          <group key={idx} position={[b.x, b.h / 2, b.z]}>
            <mesh>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial
                map={windowTexture}
                color="#141620"
                roughness={0.15}
                metalness={0.92}
                emissive="#303848"
                emissiveIntensity={0.35}
                transparent
                opacity={0.96 * opacityFactor}
              />
            </mesh>

            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(b.w, b.h, b.d)]} />
              <lineBasicMaterial
                color={highlightColor}
                transparent
                opacity={(b.spire ? 0.85 : 0.45) * opacityFactor}
              />
            </lineSegments>

            {/* Stepped crown / Spire for landmark towers */}
            {b.spire && (
              <group position={[0, b.h / 2, 0]}>
                <mesh position={[0, 0.12, 0]}>
                  <boxGeometry args={[b.w * 0.65, 0.24, b.d * 0.65]} />
                  <meshStandardMaterial color="#222530" roughness={0.2} metalness={0.9} />
                </mesh>
                <mesh position={[0, 0.38, 0]}>
                  <cylinderGeometry args={[0.012, 0.024, 0.38, 8]} />
                  <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.1} />
                </mesh>
                <mesh position={[0, 0.57, 0]}>
                  <sphereGeometry args={[0.03, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" toneMapped={false} />
                </mesh>
              </group>
            )}
          </group>
        ))}

        {/* 3 FLOATING LOCATION MAP PINS [ 📍 ] */}
        {mapPins.map((pin, pIdx) => (
          <group key={pIdx} position={[pin.x, pin.y, pin.z]}>
            {/* Outer Teardrop Ring Head */}
            <mesh position={[0, 0.08, 0]}>
              <torusGeometry args={[0.075, 0.018, 12, 24]} />
              <meshBasicMaterial
                color="#ffffff"
                toneMapped={false}
                transparent
                opacity={0.95 * opacityFactor}
              />
            </mesh>
            {/* Inner Glowing Bead */}
            <mesh position={[0, 0.08, 0]}>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            {/* Tapered Pointer Tip */}
            <mesh position={[0, -0.015, 0]} rotation={[Math.PI, 0, 0]}>
              <coneGeometry args={[0.045, 0.11, 8]} />
              <meshBasicMaterial
                color="#ffffff"
                toneMapped={false}
                transparent
                opacity={0.95 * opacityFactor}
              />
            </mesh>
            <pointLight distance={1.2} decay={2} color="#ffffff" intensity={2.0} />
          </group>
        ))}

        {/* FLOATING ASCENDING TELEMETRY BAR CHART [ 📊 ] (Upper-Right of City) */}
        <group position={[0.82, 1.72, -0.15]}>
          <mesh>
            <planeGeometry args={[0.38, 0.28]} />
            <meshBasicMaterial color="#080a10" transparent opacity={0.88 * opacityFactor} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.38, 0.28)]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.7 * opacityFactor} />
          </lineSegments>
          {/* 6 Ascending Glowing Bars */}
          {[-0.12, -0.07, -0.02, 0.03, 0.08, 0.13].map((bx, bIdx) => (
            <mesh key={bIdx} position={[bx, -0.08 + (bIdx + 1) * 0.024, 0.01]}>
              <planeGeometry args={[0.032, (bIdx + 1) * 0.045]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          ))}
        </group>

        {/* ENCIRCLING INCLINED ORBITAL DATA RIBBON */}
        <mesh geometry={ribbonGeometry}>
          <meshStandardMaterial
            color="#2a2c38"
            roughness={0.2}
            metalness={0.85}
            transparent
            opacity={0.88 * opacityFactor}
          />
        </mesh>
        <mesh geometry={ribbonGeometry}>
          <meshBasicMaterial wireframe color={highlightColor} transparent opacity={0.65 * opacityFactor} />
        </mesh>

        {/* Traveling Data Ribbon Pulse Bead */}
        <mesh ref={dataRibbonPulseRef}>
          <sphereGeometry args={[0.065, 12, 12]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
          <pointLight distance={1.5} decay={2} color="#ffffff" intensity={2.5} />
        </mesh>

        {/* SUSPENDED GEODESIC INTELLIGENCE SPHERE (Hovering Directly Above Tallest Tower) */}
        <group position={[0, 2.62, -0.05]}>
          <group ref={orbitalSphereRef}>
            <mesh>
              <icosahedronGeometry args={[0.32, 2]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.1}
                metalness={0.9}
                wireframe
                transparent
                opacity={0.95 * opacityFactor}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.88 * opacityFactor} />
            </mesh>
            <pointLight distance={3.4} decay={2} color="#ffffff" intensity={isSelected ? 5.2 : 3.2} />
          </group>

          {/* Dual Atomic / Gimbal Rings with Satellite Beads */}
          <mesh ref={gimbalRing1Ref}>
            <torusGeometry args={[0.48, 0.014, 8, 48]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.88 * opacityFactor} />
          </mesh>
          <mesh ref={gimbalRing2Ref}>
            <torusGeometry args={[0.58, 0.012, 8, 48]} />
            <meshBasicMaterial color="#d0d2e2" toneMapped={false} transparent opacity={0.68 * opacityFactor} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// 05: EXHIBIT 03: HEFIN — DECENTRALIZED NETWORK SCULPTURE
// Large faceted crystalline polyhedron core, radiant inner silver node,
// 8 floating transparent glass cubes with internal glowing nodes,
// thin metallic network links with traveling data pulses, concentric rings.
// ============================================================================
function HefinNetworkExhibit({
  isSelected,
  isHovered,
  isDimmed,
  position,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const innerNodeRef = useRef<THREE.Group>(null);
  const pulsesGroupRef = useRef<THREE.Group>(null);

  // 8 Orbital transparent glass cubes positions
  const satelliteCubes = useMemo(() => {
    const r = 1.15;
    return [
      new THREE.Vector3(-r * 0.85, r * 0.55, r * 0.28),
      new THREE.Vector3(r * 0.82, r * 0.65, -r * 0.22),
      new THREE.Vector3(-r * 0.72, -r * 0.48, r * 0.45),
      new THREE.Vector3(r * 0.76, -r * 0.55, -r * 0.38),
      new THREE.Vector3(0, r * 0.92, -r * 0.55),
      new THREE.Vector3(-r * 0.92, 0.12, -r * 0.52),
      new THREE.Vector3(r * 0.94, 0.08, r * 0.52),
      new THREE.Vector3(0, -r * 0.82, r * 0.68),
    ];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.05 + 2.4) * 0.035;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.32;
      coreRef.current.rotation.x = Math.sin(t * 0.22) * 0.18;
    }

    if (innerNodeRef.current) {
      innerNodeRef.current.rotation.y = -t * 0.6;
      innerNodeRef.current.rotation.z = t * 0.4;
    }

    if (pulsesGroupRef.current) {
      pulsesGroupRef.current.children.forEach((mesh, idx) => {
        const u = (t * 0.75 + idx * 0.125) % 1.0;
        const targetCube = satelliteCubes[idx % satelliteCubes.length];
        mesh.position.lerpVectors(new THREE.Vector3(0, 0, 0), targetCube, u);
      });
    }
  });

  const opacityFactor = isDimmed ? 0.35 : 1.0;
  const highlightColor = isSelected ? "#ffffff" : isHovered ? "#e0e2ec" : "#9496a4";

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
    >
      {/* Click / Hover Target Cylinder */}
      <mesh position={[0, 1.1, 0]} visible={false}>
        <cylinderGeometry args={[1.4, 1.4, 2.6, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* 3D GOTHIC CIRCULAR PEDESTAL */}
      <GothicPedestal
        radius={1.28}
        height={0.82}
        isCenter={false}
        highlightColor={highlightColor}
        opacityFactor={opacityFactor}
      />

      {/* =================================================================== */}
      {/* FACETED CRYSTALLINE NETWORK SCULPTURE */}
      {/* =================================================================== */}
      <group position={[0, 1.35, 0]}>
        {/* CENTRAL FACETED BLACK-GLASS POLYHEDRON */}
        <group ref={coreRef}>
          {/* Main Faceted Obsidian Glass Body */}
          <mesh>
            <icosahedronGeometry args={[0.72, 0]} />
            <meshStandardMaterial
              color="#08090f"
              roughness={0.08}
              metalness={0.94}
              transparent
              opacity={0.88 * opacityFactor}
            />
          </mesh>

          {/* Crisp Glowing Edge Segments */}
          <lineSegments>
            <edgesGeometry args={[new THREE.IcosahedronGeometry(0.725, 0)]} />
            <lineBasicMaterial
              color={highlightColor}
              transparent
              opacity={0.92 * opacityFactor}
            />
          </lineSegments>

          {/* LUMINOUS SILVER INNER CORE NODE */}
          <group ref={innerNodeRef}>
            <mesh>
              <icosahedronGeometry args={[0.34, 1]} />
              <meshStandardMaterial
                color="#ffffff"
                roughness={0.1}
                metalness={0.95}
                wireframe
                transparent
                opacity={0.95 * opacityFactor}
              />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} transparent opacity={0.92 * opacityFactor} />
            </mesh>
          </group>

          <pointLight
            distance={3.2}
            decay={2}
            color="#ffffff"
            intensity={isSelected ? 5.5 : 3.2}
          />
        </group>

        {/* 8 SATELLITE TRANSPARENT GLASS CUBES & CONNECTING METALLIC DATA RODS */}
        {satelliteCubes.map((pos, cIdx) => (
          <group key={cIdx}>
            {/* Thin Metallic Network Connector Rod */}
            <line>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[new Float32Array([0, 0, 0, pos.x, pos.y, pos.z]), 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.55 * opacityFactor}
              />
            </line>

            {/* Floating Transparent Glass Cube */}
            <group position={[pos.x, pos.y, pos.z]}>
              <mesh>
                <boxGeometry args={[0.19, 0.19, 0.19]} />
                <meshStandardMaterial
                  color="#10121a"
                  roughness={0.12}
                  metalness={0.9}
                  transparent
                  opacity={0.92 * opacityFactor}
                />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(0.19, 0.19, 0.19)]} />
                <lineBasicMaterial
                  color={highlightColor}
                  transparent
                  opacity={0.88 * opacityFactor}
                />
              </lineSegments>
              {/* Internal Luminous Node */}
              <mesh>
                <sphereGeometry args={[0.048, 8, 8]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
            </group>
          </group>
        ))}

        {/* TRAVELING DATA PACKET PULSES */}
        <group ref={pulsesGroupRef}>
          {satelliteCubes.map((_, pIdx) => (
            <mesh key={pIdx}>
              <sphereGeometry args={[0.045, 8, 8]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// CAMERA RIG COMPONENT (Cinematic 16:9 Desktop Framing & Mobile Responsiveness)
// ============================================================================
function CameraRig({
  selectedProjectIndex,
  isMobile,
  activeMobileIndex,
  isIsolated,
  isolateMode,
}: {
  selectedProjectIndex: number | null;
  isMobile: boolean;
  activeMobileIndex: number;
  isIsolated: boolean;
  isolateMode: string | null;
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (isIsolated) {
      if (isolateMode === "pathway") {
        camera.position.set(0, 0.95, 5.2);
        camera.lookAt(0, 0.65, 0);
      } else {
        camera.position.set(0, 0.55, 4.5);
        camera.lookAt(0, 0.35, 0);
      }
      return;
    }

    let targetX = 0;
    let targetY = isMobile ? -0.45 : -0.15;
    let targetZ = isMobile ? 5.3 : 7.6;

    if (isMobile) {
      targetX = 0;
      targetZ = 5.3;
    } else {
      if (selectedProjectIndex === 0) {
        targetX = -1.4;
        targetY = -0.15;
        targetZ = 6.4;
      } else if (selectedProjectIndex === 1) {
        targetX = 0.05;
        targetY = -0.15;
        targetZ = 6.2;
      } else if (selectedProjectIndex === 2) {
        targetX = 1.4;
        targetY = -0.15;
        targetZ = 6.4;
      }
    }

    const damp = Math.min(delta * 3.2, 0.15);
    camera.position.x += (targetX - camera.position.x) * damp;
    camera.position.y += (targetY - camera.position.y) * damp;
    camera.position.z += (targetZ - camera.position.z) * damp;

    camera.lookAt(targetX * 0.35, isMobile ? -0.9 : -0.65, 0);
  });

  return null;
}

// ============================================================================
// SUBTLE ATMOSPHERIC MIST & DUST PARTICLES
// ============================================================================
function ArchiveAtmosphere({ count = 65 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 9.5;
      coords[i * 3 + 1] = Math.random() * 4.5 - 1.5;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 3.8;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.0028;
      if (positions[i * 3 + 1] > 3.6) {
        positions[i * 3 + 1] = -1.5;
      }
      positions[i * 3] += Math.sin(t * 0.35 + i) * 0.0006;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ffffff"
        transparent
        opacity={0.38}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================================================
// MAIN ARCHIVE GALLERY 3D SCENE
// Supports Default Gallery, Click-to-Inspect, and Isolated Rendering (?isolate=)
// ============================================================================
export default function ArchiveGalleryScene({
  selectedProjectIndex,
  onSelectProject,
  activeMobileIndex = 0,
  reduced = false,
}: {
  selectedProjectIndex: number | null;
  onSelectProject: (index: number) => void;
  activeMobileIndex?: number;
  reduced?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 900 : false
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Check URL query parameters for isolate mode demonstration (?isolate=docrecon | pathway | hefin)
  const isolateMode = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const iso = params.get("isolate");
    if (iso === "docrecon" || iso === "pathway" || iso === "hefin") return iso;
    return null;
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Exact 16:9 Desktop horizontal positions matching reference composition:
  // DocRecon: ~18% (X = -3.15)
  // Pathway AI: ~51% (X = 0.05)
  // HEFIN: ~84% (X = 3.15)
  // Ground plane: Y = -1.82
  const docReconPos: [number, number, number] = isMobile
    ? [(0 - activeMobileIndex) * 3.8, -0.65, 0]
    : isolateMode === "docrecon"
    ? [0, -0.6, 0]
    : [-3.15, -1.82, 0];

  const pathwayPos: [number, number, number] = isMobile
    ? [(1 - activeMobileIndex) * 3.8, -0.65, 0]
    : isolateMode === "pathway"
    ? [0, -0.6, 0]
    : [0.05, -1.82, 0];

  const hefinPos: [number, number, number] = isMobile
    ? [(2 - activeMobileIndex) * 3.8, -0.65, 0]
    : isolateMode === "hefin"
    ? [0, -0.6, 0]
    : [3.15, -1.82, 0];

  return (
    <div
      className="archive-canvas-wrapper"
      style={{ cursor: hoveredIndex !== null ? "pointer" : "default" }}
      aria-hidden="false"
    >
      <Canvas
        camera={{
          position:
            isolateMode === "pathway"
              ? [0, 0.95, 5.2]
              : isolateMode !== null
              ? [0, 0.55, 4.5]
              : [0, -0.15, isMobile ? 5.3 : 7.6],
          fov: isMobile ? 44 : isolateMode !== null ? 38 : 34,
        }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="archive-three-canvas"
      >
        <CameraRig
          selectedProjectIndex={selectedProjectIndex}
          isMobile={isMobile}
          activeMobileIndex={activeMobileIndex}
          isIsolated={isolateMode !== null}
          isolateMode={isolateMode}
        />

        {/* Controlled Monochromatic Illumination */}
        <ambientLight intensity={0.9} color="#d8dce8" />
        <directionalLight position={[0, 9, 3]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-6, 4, 2]} intensity={1.2} color="#9498a4" />
        <directionalLight position={[6, 4, 2]} intensity={1.2} color="#9498a4" />

        {/* Cathedral Central Light Shaft (Down onto Pathway City) */}
        <spotLight
          position={[0.05, 6.2, 1.8]}
          target-position={[0.05, 0.2, 0]}
          intensity={selectedProjectIndex === 1 ? 16.0 : 9.0}
          color="#ffffff"
          angle={0.45}
          penumbra={0.7}
        />

        {/* Localized Exhibit Spotlights */}
        <spotLight
          position={isMobile ? [docReconPos[0], 4.2, 2.2] : [-3.15, 4.6, 2.2]}
          target-position={[docReconPos[0], 0.2, 0]}
          intensity={
            selectedProjectIndex === 0
              ? 15.0
              : hoveredIndex === 0
              ? 9.5
              : selectedProjectIndex !== null
              ? 2.2
              : 6.5
          }
          color="#ffffff"
          angle={0.48}
          penumbra={0.65}
        />

        <spotLight
          position={isMobile ? [hefinPos[0], 4.2, 2.2] : [3.15, 4.6, 2.2]}
          target-position={[hefinPos[0], 0.2, 0]}
          intensity={
            selectedProjectIndex === 2
              ? 15.0
              : hoveredIndex === 2
              ? 9.5
              : selectedProjectIndex !== null
              ? 2.2
              : 6.5
          }
          color="#ffffff"
          angle={0.48}
          penumbra={0.65}
        />

        {!reduced && <ArchiveAtmosphere count={65} />}

        {/* 3D Glossy Marble Floor Plane with Pedestal Grounding */}
        <mesh position={[0, -2.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[26, 16]} />
          <meshStandardMaterial
            color="#040508"
            roughness={0.08}
            metalness={0.92}
          />
        </mesh>

        {/* 3D EXHIBITIONS */}
        <group position={[0, 0, 0]}>
          {(isolateMode === null || isolateMode === "docrecon") && (
            <DocReconExhibit
              isSelected={selectedProjectIndex === 0}
              isHovered={hoveredIndex === 0}
              isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 0}
              position={docReconPos}
              onClick={() => onSelectProject(0)}
              onPointerOver={() => setHoveredIndex(0)}
              onPointerOut={() => setHoveredIndex(null)}
            />
          )}

          {(isolateMode === null || isolateMode === "pathway") && (
            <PathwayCityExhibit
              isSelected={selectedProjectIndex === 1}
              isHovered={hoveredIndex === 1}
              isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 1}
              position={pathwayPos}
              onClick={() => onSelectProject(1)}
              onPointerOver={() => setHoveredIndex(1)}
              onPointerOut={() => setHoveredIndex(null)}
            />
          )}

          {(isolateMode === null || isolateMode === "hefin") && (
            <HefinNetworkExhibit
              isSelected={selectedProjectIndex === 2}
              isHovered={hoveredIndex === 2}
              isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 2}
              position={hefinPos}
              onClick={() => onSelectProject(2)}
              onPointerOver={() => setHoveredIndex(2)}
              onPointerOut={() => setHoveredIndex(null)}
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
