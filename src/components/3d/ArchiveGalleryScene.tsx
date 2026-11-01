import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// PROCEDURAL TEXTURE GENERATORS
// ============================================================================

function createDocumentTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1440;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0a0c10";
  ctx.fillRect(0, 0, 1024, 1440);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.035)";
  ctx.lineWidth = 1;
  for (let x = 40; x < 1024; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 1440);
    ctx.stroke();
  }
  for (let y = 40; y < 1440; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Header Bar
  ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
  ctx.fillRect(60, 60, 904, 110);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, 904, 110);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px 'IBM Plex Mono', monospace";
  ctx.fillText("TAX INVOICE / INTELLIGENCE AUDIT", 90, 115);

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  ctx.font = "18px 'IBM Plex Mono', monospace";
  ctx.fillText("DOC_ID: 884-DR-2026  •  CONFIDENCE: 99.4%  •  STATUS: VERIFIED", 90, 145);

  // Top Metadata Block
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.fillRect(60, 200, 435, 160);
  ctx.fillRect(525, 200, 439, 160);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.strokeRect(60, 200, 435, 160);
  ctx.strokeRect(525, 200, 439, 160);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px 'IBM Plex Mono', monospace";
  ctx.fillText("ENTITY: RECON-AI CORP", 85, 240);
  ctx.fillText("VAT_ID: US-99482104-X", 85, 275);
  ctx.fillText("ISSUED: 2026-10-31", 85, 310);

  ctx.fillText("TARGET: ARCHIVE SYSTEMS", 550, 240);
  ctx.fillText("PO_NUM: PO-0082419-A", 550, 275);
  ctx.fillText("CURRENCY: USD ($)", 550, 310);

  // Bounding Box 1 (Entity)
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(75, 218, 280, 32);
  ctx.fillStyle = "rgba(255, 255, 255, 0.12)";
  ctx.fillRect(75, 218, 280, 32);

  // Items Table
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(60, 400, 904, 50);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px 'IBM Plex Mono', monospace";
  ctx.fillText("ITEM DESCRIPTION", 85, 432);
  ctx.fillText("QTY", 560, 432);
  ctx.fillText("RATE", 680, 432);
  ctx.fillText("TOTAL", 840, 432);

  const rows = [
    ["SPATIAL OCR PARSING PIPELINE", "1", "$ 4,800.00", "$ 4,800.00"],
    ["LAYOUT ANALYSIS & TABLE EXTRACT", "4", "$ 1,250.00", "$ 5,000.00"],
    ["MULTI-LINGUAL RECOGNITION (94)", "1", "$ 3,200.00", "$ 3,200.00"],
    ["SCHEMA VALIDATION & CONFIDENCE", "1", "$ 1,950.00", "$ 1,950.00"],
    ["AUTOMATED EXPORT INTEGRATION", "2", "$ 850.00", "$ 1,700.00"],
  ];

  ctx.font = "16px 'IBM Plex Mono', monospace";
  rows.forEach((row, i) => {
    const y = 490 + i * 65;
    ctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.02)" : "rgba(255, 255, 255, 0.04)";
    ctx.fillRect(60, y - 30, 904, 55);

    ctx.fillStyle = "#e0e0ea";
    ctx.fillText(row[0], 85, y);
    ctx.fillText(row[1], 570, y);
    ctx.fillText(row[2], 680, y);
    ctx.fillText(row[3], 840, y);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.beginPath();
    ctx.moveTo(60, y + 25);
    ctx.lineTo(964, y + 25);
    ctx.stroke();
  });

  // Highlight Box 2
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 490 + 3 * 65 - 30, 904, 55);
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.fillRect(60, 490 + 3 * 65 - 30, 904, 55);

  // Financial Summary Block
  const sumY = 880;
  ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx.fillRect(525, sumY, 439, 190);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.strokeRect(525, sumY, 439, 190);

  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.font = "17px 'IBM Plex Mono', monospace";
  ctx.fillText("SUBTOTAL:", 550, sumY + 40);
  ctx.fillText("TAX (18%):", 550, sumY + 80);
  ctx.fillText("DISCOUNT:", 550, sumY + 120);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px 'IBM Plex Mono', monospace";
  ctx.fillText("GRAND TOTAL:", 550, sumY + 165);

  ctx.font = "17px 'IBM Plex Mono', monospace";
  ctx.fillText("$ 16,650.00", 820, sumY + 40);
  ctx.fillText("$  2,997.00", 820, sumY + 80);
  ctx.fillText("-$    0.00", 820, sumY + 120);

  ctx.font = "bold 24px 'IBM Plex Mono', monospace";
  ctx.fillText("$ 19,647.00", 790, sumY + 165);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.strokeRect(775, sumY + 138, 175, 40);
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  ctx.fillRect(775, sumY + 138, 175, 40);

  // Signature Line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 1340);
  ctx.lineTo(380, 1340);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "italic 26px Georgia, serif";
  ctx.fillText("H. Suthan V", 110, 1325);

  // Official Stamp Emblem
  const stampX = 820;
  const stampY = 1270;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(stampX, stampY, 65, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(stampX, stampY, 56, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 13px 'IBM Plex Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("DOCRECON", stampX, stampY - 14);
  ctx.fillText("AUDIT SEAL", stampX, stampY + 6);
  ctx.fillText("2026-PASS", stampX, stampY + 24);
  ctx.textAlign = "left";

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function createSecondaryDocumentTexture(index: number): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#0c0e14";
  ctx.fillRect(0, 0, 512, 720);

  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(30, 30, 452, 50);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px 'IBM Plex Mono', monospace";
  ctx.fillText(`BATCH #0${index + 2} // SCHEMATIC DATA`, 50, 62);

  for (let i = 0; i < 14; i++) {
    const y = 120 + i * 36;
    ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
    const w = 420 - ((i * 37) % 180);
    ctx.fillRect(50, y, w, 14);
  }

  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(45, 340, 420, 90);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

function createCityWindowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = "#06070a";
  ctx.fillRect(0, 0, 512, 512);

  const cols = 24;
  const rows = 48;
  const cw = 512 / cols;
  const rh = 512 / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const rand = Math.sin(r * 9.2 + c * 4.7);
      if (rand > -0.2) {
        const brightness = 0.75 + Math.abs(rand) * 0.25;
        ctx.fillStyle = rand > 0.3 ? "#ffffff" : `rgba(220, 230, 255, ${brightness.toFixed(2)})`;
        ctx.fillRect(c * cw + 2, r * rh + 2, cw - 4, rh - 4);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2);
  return texture;
}

// ============================================================================
// CAMERA RIG COMPONENT
// Smoothly pans and frames the selected project exhibit
// ============================================================================
function CameraRig({
  selectedProjectIndex,
  isMobile,
  activeMobileIndex,
}: {
  selectedProjectIndex: number | null;
  isMobile: boolean;
  activeMobileIndex: number;
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    let targetX = 0;
    let targetY = -0.72;
    let targetZ = isMobile ? 5.2 : 6.4;

    if (isMobile) {
      targetX = 0;
      targetZ = 5.2;
    } else {
      if (selectedProjectIndex === 0) {
        targetX = -1.4; targetY = -0.65; targetZ = 5.6;
      } else if (selectedProjectIndex === 1) {
        targetX = 0.0; targetY = -0.62; targetZ = 5.4;
      } else if (selectedProjectIndex === 2) {
        targetX = 1.4; targetY = -0.65; targetZ = 5.6;
      }
    }

    const damp = Math.min(delta * 3.5, 0.15);
    camera.position.x += (targetX - camera.position.x) * damp;
    camera.position.y += (targetY - camera.position.y) * damp;
    camera.position.z += (targetZ - camera.position.z) * damp;

    camera.lookAt(targetX * 0.4, -0.95, 0);
  });

  return null;
}

// ============================================================================
// EXHIBIT 01: DOCRECON — SPATIAL DOCUMENT INTELLIGENCE
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
  const frontDocRef = useRef<THREE.Group>(null);
  const scanBeamRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const ringRef = useRef<THREE.Group>(null);

  const docTexture = useMemo(() => createDocumentTexture(), []);
  const bgDocTexture1 = useMemo(() => createSecondaryDocumentTexture(0), []);
  const bgDocTexture2 = useMemo(() => createSecondaryDocumentTexture(1), []);
  const bgDocTexture3 = useMemo(() => createSecondaryDocumentTexture(2), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.04;
    }

    if (scanBeamRef.current) {
      const scanY = Math.sin(t * 1.8) * 0.75;
      scanBeamRef.current.position.y = scanY;
      if (lightRef.current) {
        lightRef.current.position.y = scanY;
        lightRef.current.intensity = isSelected ? 4.5 : isHovered ? 3.5 : 2.2;
      }
    }

    if (frontDocRef.current) {
      const targetZ = isHovered || isSelected ? 0.22 : 0.0;
      frontDocRef.current.position.z += (targetZ - frontDocRef.current.position.z) * 0.1;
    }

    if (ringRef.current) {
      ringRef.current.rotation.y += 0.008;
    }
  });

  const opacityFactor = isDimmed ? 0.35 : 1.0;
  const highlightColor = isSelected ? "#ffffff" : isHovered ? "#d0d0e0" : "#808090";

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
      <mesh position={[0, 0.9, 0]} visible={false}>
        <cylinderGeometry args={[1.3, 1.3, 2.4, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* PEDESTAL LIGHT RING */}
      <group ref={ringRef} position={[0, -0.05, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.92, 0.96, 48]} />
          <meshBasicMaterial
            color={highlightColor}
            transparent
            opacity={0.85 * opacityFactor}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.78, 0.81, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.4 * opacityFactor}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* BACKGROUND DOCUMENT 3 (Furthest Left Back) */}
      <group position={[-0.42, 0.95, -0.55]} rotation={[0.04, 0.22, -0.08]}>
        <mesh>
          <planeGeometry args={[1.1, 1.5]} />
          <meshStandardMaterial
            map={bgDocTexture3}
            transparent
            opacity={0.45 * opacityFactor}
            roughness={0.3}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 1.5)]} />
          <lineBasicMaterial color="#ffffff" transparent opacity={0.25 * opacityFactor} />
        </lineSegments>
      </group>

      {/* BACKGROUND DOCUMENT 2 (Right Back) */}
      <group position={[0.45, 1.05, -0.42]} rotation={[-0.03, -0.18, 0.06]}>
        <mesh>
          <planeGeometry args={[1.15, 1.58]} />
          <meshStandardMaterial
            map={bgDocTexture2}
            transparent
            opacity={0.6 * opacityFactor}
            roughness={0.25}
            metalness={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.15, 1.58)]} />
          <lineBasicMaterial color="#ffffff" transparent opacity={0.35 * opacityFactor} />
        </lineSegments>
      </group>

      {/* BACKGROUND DOCUMENT 1 (Left Mid) */}
      <group position={[-0.24, 0.92, -0.22]} rotation={[0.02, 0.12, -0.04]}>
        <mesh>
          <planeGeometry args={[1.22, 1.68]} />
          <meshStandardMaterial
            map={bgDocTexture1}
            transparent
            opacity={0.75 * opacityFactor}
            roughness={0.2}
            metalness={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.22, 1.68)]} />
          <lineBasicMaterial color="#ffffff" transparent opacity={0.45 * opacityFactor} />
        </lineSegments>
      </group>

      {/* FOREGROUND DOCUMENT */}
      <group ref={frontDocRef} position={[0, 0.9, 0]}>
        <mesh>
          <planeGeometry args={[1.34, 1.88]} />
          <meshStandardMaterial
            map={docTexture}
            transparent
            opacity={0.96 * opacityFactor}
            roughness={0.15}
            metalness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>

        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(1.34, 1.88)]} />
          <lineBasicMaterial color={highlightColor} transparent opacity={0.9 * opacityFactor} />
        </lineSegments>

        {/* SCANNING LASER BEAM */}
        <group ref={scanBeamRef} position={[0, 0, 0.03]}>
          <mesh>
            <planeGeometry args={[1.36, 0.032]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.95 * opacityFactor} />
          </mesh>
          <mesh>
            <planeGeometry args={[1.4, 0.14]} />
            <meshBasicMaterial
              color="#e0e8ff"
              transparent
              opacity={0.38 * opacityFactor}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh position={[-0.68, 0, 0]}>
            <boxGeometry args={[0.04, 0.05, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.68, 0, 0]}>
            <boxGeometry args={[0.04, 0.05, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight
            ref={lightRef}
            position={[0, 0, 0.16]}
            distance={2.4}
            decay={2}
            color="#ffffff"
            intensity={2.8}
          />
        </group>

        {/* FLOATING BADGE: OCR SCANNING... (Top) */}
        <group position={[-0.2, 1.08, 0.06]}>
          <mesh>
            <planeGeometry args={[0.7, 0.16]} />
            <meshBasicMaterial color="#080a10" transparent opacity={0.9 * opacityFactor} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.7, 0.16)]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.7 * opacityFactor} />
          </lineSegments>
          <mesh position={[-0.1, -0.04, 0.01]}>
            <planeGeometry args={[0.42, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* FLOATING TELEMETRY LIST */}
        <group position={[-0.88, 0.15, 0.1]}>
          {["SCAN ✓", "OCR ✓", "EXTRACT ✓", "STRUCTURE ✓", "INDEX ↻"].map((label, i) => (
            <group key={label} position={[0, (2 - i) * 0.16, 0]}>
              <mesh position={[0, 0, 0]}>
                <planeGeometry args={[0.45, 0.1]} />
                <meshBasicMaterial color="#06080e" transparent opacity={0.8 * opacityFactor} />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.PlaneGeometry(0.45, 0.1)]} />
                <lineBasicMaterial color="#ffffff" transparent opacity={0.4 * opacityFactor} />
              </lineSegments>
            </group>
          ))}
        </group>

        {/* FLOATING [ T ] EXTRACTION ICON BADGE */}
        <group position={[0.82, 0.65, 0.1]}>
          <mesh>
            <planeGeometry args={[0.22, 0.22]} />
            <meshBasicMaterial color="#0a0c12" transparent opacity={0.85 * opacityFactor} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.22, 0.22)]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.6 * opacityFactor} />
          </lineSegments>
          <mesh position={[0, 0.04, 0.01]}>
            <planeGeometry args={[0.1, 0.025]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, -0.02, 0.01]}>
            <planeGeometry args={[0.025, 0.1]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// EXHIBIT 02: PATHWAY AI — MINIATURE SMART METROPOLIS
// ============================================================================
function PathwayAIExhibit({
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
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const trafficPulseRef = useRef<THREE.Mesh>(null);

  const windowTexture = useMemo(() => createCityWindowTexture(), []);

  const buildings = useMemo(() => {
    return [
      { x: 0.0, z: 0.0, w: 0.32, d: 0.32, h: 2.1, spire: true },
      { x: 0.26, z: -0.15, w: 0.28, d: 0.26, h: 1.85, spire: true },
      { x: -0.25, z: 0.18, w: 0.3, d: 0.28, h: 1.65, spire: false },
      { x: -0.32, z: -0.22, w: 0.24, d: 0.24, h: 1.5, spire: false },
      { x: 0.36, z: 0.22, w: 0.26, d: 0.26, h: 1.4, spire: false },

      { x: -0.52, z: 0.0, w: 0.22, d: 0.22, h: 1.25, spire: false },
      { x: 0.54, z: -0.08, w: 0.22, d: 0.24, h: 1.3, spire: false },
      { x: 0.12, z: 0.42, w: 0.25, d: 0.22, h: 1.15, spire: false },
      { x: -0.15, z: -0.45, w: 0.24, d: 0.25, h: 1.1, spire: false },
      { x: 0.42, z: -0.38, w: 0.2, d: 0.22, h: 0.95, spire: false },
      { x: -0.44, z: 0.38, w: 0.22, d: 0.2, h: 0.9, spire: false },

      { x: -0.68, z: -0.25, w: 0.18, d: 0.18, h: 0.75, spire: false },
      { x: 0.65, z: 0.25, w: 0.2, d: 0.18, h: 0.7, spire: false },
      { x: 0.32, z: 0.52, w: 0.18, d: 0.18, h: 0.65, spire: false },
      { x: -0.35, z: -0.6, w: 0.18, d: 0.18, h: 0.6, spire: false },
      { x: 0.62, z: -0.35, w: 0.16, d: 0.16, h: 0.55, spire: false },
      { x: -0.62, z: 0.45, w: 0.16, d: 0.16, h: 0.5, spire: false },
      { x: 0.0, z: -0.62, w: 0.18, d: 0.16, h: 0.45, spire: false },
    ];
  }, []);

  const highwayCurve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.95, 0.22, 0.4),
      new THREE.Vector3(-0.55, 0.35, 0.75),
      new THREE.Vector3(0.15, 0.42, 0.85),
      new THREE.Vector3(0.75, 0.32, 0.6),
      new THREE.Vector3(0.95, 0.24, -0.1),
      new THREE.Vector3(0.65, 0.36, -0.75),
      new THREE.Vector3(-0.1, 0.45, -0.85),
      new THREE.Vector3(-0.75, 0.3, -0.5),
      new THREE.Vector3(-0.95, 0.22, 0.4),
    ]);
  }, []);

  const highwayGeometry = useMemo(() => {
    return new THREE.TubeGeometry(highwayCurve, 64, 0.035, 8, true);
  }, [highwayCurve]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.9 + 1.2) * 0.03;
    }

    if (orbitalSphereRef.current) {
      orbitalSphereRef.current.rotation.y = t * 0.5;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.8;
      ring1Ref.current.rotation.y = t * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = t * 0.7;
      ring2Ref.current.rotation.y = -t * 0.5;
    }

    if (trafficPulseRef.current) {
      const u = (t * 0.35) % 1.0;
      const pt = highwayCurve.getPoint(u);
      trafficPulseRef.current.position.copy(pt);
    }
  });

  const opacityFactor = isDimmed ? 0.35 : 1.0;
  const highlightColor = isSelected ? "#ffffff" : isHovered ? "#d0d0e0" : "#808090";

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
      <mesh position={[0, 1.1, 0]} visible={false}>
        <cylinderGeometry args={[1.3, 1.3, 2.6, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* PEDESTAL ROAD NETWORK DISC */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9, 0.95, 48]} />
        <meshBasicMaterial
          color={highlightColor}
          transparent
          opacity={0.85 * opacityFactor}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.73, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.35 * opacityFactor}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* SKYSCRAPER BUILDINGS */}
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          <mesh>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              map={windowTexture}
              color="#161820" roughness={0.15} metalness={0.92} emissive="#303848" emissiveIntensity={0.35}
              transparent
              opacity={0.96 * opacityFactor}
            />
          </mesh>

          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(b.w, b.h, b.d)]} />
            <lineBasicMaterial
              color={highlightColor}
              transparent
              opacity={(b.spire ? 0.8 : 0.4) * opacityFactor}
            />
          </lineSegments>

          {b.spire && (
            <group position={[0, b.h / 2, 0]}>
              <mesh position={[0, 0.22, 0]}>
                <cylinderGeometry args={[0.012, 0.024, 0.44, 8]} />
                <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, 0.44, 0]}>
                <sphereGeometry args={[0.032, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          )}
        </group>
      ))}

      {/* ELEVATED HIGHWAY TUBE */}
      <mesh geometry={highwayGeometry}>
        <meshStandardMaterial
          color="#20222a"
          roughness={0.3}
          metalness={0.8}
          transparent
          opacity={0.92 * opacityFactor}
        />
      </mesh>
      <mesh geometry={highwayGeometry}>
        <meshBasicMaterial
          wireframe
          color={highlightColor}
          transparent
          opacity={0.6 * opacityFactor}
        />
      </mesh>

      {/* TRAFFIC DATA PULSE */}
      <mesh ref={trafficPulseRef}>
        <sphereGeometry args={[0.065, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight distance={1.2} decay={2} color="#ffffff" intensity={2.0} />
      </mesh>

      {/* ELEVATED ORBITAL INTELLIGENCE SPHERE */}
      <group position={[0, 2.45, 0]}>
        <group ref={orbitalSphereRef}>
          <mesh>
            <icosahedronGeometry args={[0.26, 2]} />
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
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
          </mesh>
          <pointLight distance={3.0} decay={2} color="#ffffff" intensity={2.5} />
        </group>

        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.38, 0.014, 8, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8 * opacityFactor} />
        </mesh>

        <mesh ref={ring2Ref}>
          <torusGeometry args={[0.48, 0.012, 8, 32]} />
          <meshBasicMaterial color="#d0d0e0" transparent opacity={0.6 * opacityFactor} />
        </mesh>
      </group>

      {/* FLOATING TELEMETRY BADGES */}
      {/* 📍 Location Pin Badge */}
      <group position={[-0.7, 1.8, 0.4]}>
        <mesh>
          <planeGeometry args={[0.22, 0.22]} />
          <meshBasicMaterial color="#080a10" transparent opacity={0.85 * opacityFactor} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.22, 0.22)]} />
          <lineBasicMaterial color="#ffffff" transparent opacity={0.6 * opacityFactor} />
        </lineSegments>
        <mesh position={[0, 0.02, 0.01]}>
          <circleGeometry args={[0.045, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, -0.05, 0.01]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.04, 0.07, 4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* 📊 Mini Bar Chart Telemetry Badge */}
      <group position={[0.75, 1.6, -0.2]}>
        <mesh>
          <planeGeometry args={[0.32, 0.24]} />
          <meshBasicMaterial color="#080a10" transparent opacity={0.85 * opacityFactor} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.32, 0.24)]} />
          <lineBasicMaterial color="#ffffff" transparent opacity={0.6 * opacityFactor} />
        </lineSegments>
        {[-0.09, -0.03, 0.03, 0.09].map((bx, idx) => (
          <mesh key={idx} position={[bx, -0.06 + (idx + 1) * 0.025, 0.01]}>
            <planeGeometry args={[0.035, (idx + 1) * 0.05]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ============================================================================
// EXHIBIT 03: HEFIN — DECENTRALIZED NETWORK SCULPTURE
// ============================================================================
function HefinExhibit({
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
  const innerCubeRef = useRef<THREE.Mesh>(null);
  const pulsesGroupRef = useRef<THREE.Group>(null);

  const satelliteNodes = useMemo(() => {
    const r = 1.05;
    return [
      new THREE.Vector3(-r * 0.8, r * 0.6, r * 0.3),
      new THREE.Vector3(r * 0.8, r * 0.7, -r * 0.2),
      new THREE.Vector3(-r * 0.7, -r * 0.5, r * 0.5),
      new THREE.Vector3(r * 0.75, -r * 0.6, -r * 0.4),
      new THREE.Vector3(0, r * 0.95, -r * 0.6),
      new THREE.Vector3(-r * 0.9, 0.1, -r * 0.6),
      new THREE.Vector3(r * 0.92, 0.05, r * 0.55),
      new THREE.Vector3(0, -r * 0.85, r * 0.7),
    ];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.1 + 2.4) * 0.04;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.35;
      coreRef.current.rotation.x = Math.sin(t * 0.25) * 0.2;
    }

    if (innerCubeRef.current) {
      innerCubeRef.current.rotation.y = -t * 0.7;
      innerCubeRef.current.rotation.z = t * 0.5;
    }

    if (pulsesGroupRef.current) {
      pulsesGroupRef.current.children.forEach((mesh, idx) => {
        const u = (t * 0.8 + idx * 0.125) % 1.0;
        const targetNode = satelliteNodes[idx % satelliteNodes.length];
        mesh.position.lerpVectors(new THREE.Vector3(0, 0, 0), targetNode, u);
      });
    }
  });

  const opacityFactor = isDimmed ? 0.35 : 1.0;
  const highlightColor = isSelected ? "#ffffff" : isHovered ? "#d0d0e0" : "#808090";

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
      <mesh position={[0, 1.1, 0]} visible={false}>
        <cylinderGeometry args={[1.3, 1.3, 2.6, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* PEDESTAL NETWORK DISC */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.92, 0.96, 48]} />
        <meshBasicMaterial
          color={highlightColor}
          transparent
          opacity={0.85 * opacityFactor}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.72, 0.75, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.35 * opacityFactor}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* CENTRAL SCULPTURE CORE (Y = 1.1) */}
      <group position={[0, 1.1, 0]}>
        <group ref={coreRef}>
          <mesh>
            <icosahedronGeometry args={[0.62, 0]} />
            <meshStandardMaterial
              color="#08080f"
              roughness={0.12}
              metalness={0.92}
              transparent
              opacity={0.92 * opacityFactor}
            />
          </mesh>

          <lineSegments>
            <edgesGeometry args={[new THREE.IcosahedronGeometry(0.625, 0)]} />
            <lineBasicMaterial
              color={highlightColor}
              transparent
              opacity={0.88 * opacityFactor}
            />
          </lineSegments>

          <mesh ref={innerCubeRef}>
            <boxGeometry args={[0.34, 0.34, 0.34]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.1}
              metalness={0.9}
              wireframe
              transparent
              opacity={0.95 * opacityFactor}
            />
          </mesh>

          <pointLight
            distance={2.8}
            decay={2}
            color="#ffffff"
            intensity={isSelected ? 4.5 : 2.5}
          />
        </group>

        {/* 8 SATELLITE NODES & CONNECTOR BEAMS */}
        {satelliteNodes.map((pos, idx) => (
          <group key={idx}>
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
                opacity={0.45 * opacityFactor}
              />
            </line>

            <group position={[pos.x, pos.y, pos.z]}>
              <mesh>
                <boxGeometry args={[0.18, 0.18, 0.18]} />
                <meshStandardMaterial
                  color="#101218"
                  roughness={0.2}
                  metalness={0.88}
                  transparent
                  opacity={0.95 * opacityFactor}
                />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(0.18, 0.18, 0.18)]} />
                <lineBasicMaterial
                  color={highlightColor}
                  transparent
                  opacity={0.85 * opacityFactor}
                />
              </lineSegments>
              <mesh>
                <sphereGeometry args={[0.045, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          </group>
        ))}

        {/* TRAVELING DATA PACKET PULSES */}
        <group ref={pulsesGroupRef}>
          {satelliteNodes.map((_, idx) => (
            <mesh key={idx}>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>

        {/* FLOATING BADGES: DECENTRALIZED / OPEN INTELLIGENCE / TRUSTED NETWORK */}
        <group position={[1.15, 0.35, 0.1]}>
          {["DECENTRALIZED", "OPEN INTELLIGENCE", "TRUSTED NETWORK"].map((txt, i) => (
            <group key={txt} position={[0, (1 - i) * 0.22, 0]}>
              <mesh>
                <planeGeometry args={[0.82, 0.14]} />
                <meshBasicMaterial color="#06080e" transparent opacity={0.88 * opacityFactor} />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.PlaneGeometry(0.82, 0.14)]} />
                <lineBasicMaterial color="#ffffff" transparent opacity={0.5 * opacityFactor} />
              </lineSegments>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// SUBTLE FLOATING PARTICLES
// ============================================================================
function ArchiveParticles({ count = 55 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 8.5;
      coords[i * 3 + 1] = Math.random() * 4.2 - 1.2;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.003;
      if (positions[i * 3 + 1] > 3.6) {
        positions[i * 3 + 1] = -1.2;
      }
      positions[i * 3] += Math.sin(t * 0.4 + i) * 0.0008;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        color="#e0e0ea"
        transparent
        opacity={0.42}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================================================
// MAIN ARCHIVE GALLERY 3D SCENE
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const docReconPos: [number, number, number] = isMobile
    ? [(0 - activeMobileIndex) * 3.8, -0.55, 0]
    : [-2.62, -1.98, 0];
  const pathwayPos: [number, number, number] = isMobile
    ? [(1 - activeMobileIndex) * 3.8, -0.55, 0]
    : [0.0, -1.98, 0];
  const hefinPos: [number, number, number] = isMobile
    ? [(2 - activeMobileIndex) * 3.8, -0.55, 0]
    : [2.72, -1.98, 0];

  return (
    <div
      className="archive-canvas-wrapper"
      style={{ cursor: hoveredIndex !== null ? "pointer" : "default" }}
      aria-hidden="false"
    >
      <Canvas
        camera={{
          position: [0, -0.72, isMobile ? 5.2 : 6.4],
          fov: isMobile ? 44 : 40,
        }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="archive-three-canvas"
      >
        <CameraRig
          selectedProjectIndex={selectedProjectIndex}
          isMobile={isMobile}
          activeMobileIndex={activeMobileIndex}
        />

        <ambientLight intensity={0.9} />
        <directionalLight position={[0, 8, 3]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-6, 3, 2]} intensity={1.2} color="#90909c" />
        <directionalLight position={[6, 3, 2]} intensity={1.2} color="#90909c" />

        <spotLight
          position={isMobile ? [docReconPos[0], 3.4, 2.2] : [-2.62, 3.4, 2.2]}
          target-position={[docReconPos[0], 0.2, 0]}
          intensity={
            selectedProjectIndex === 0
              ? 14.0
              : hoveredIndex === 0
              ? 8.5
              : selectedProjectIndex !== null
              ? 1.8
              : 5.5
          }
          color="#ffffff"
          angle={0.5}
          penumbra={0.65}
        />

        <spotLight
          position={isMobile ? [pathwayPos[0], 3.6, 2.2] : [0.0, 3.6, 2.2]}
          target-position={[pathwayPos[0], 0.4, 0]}
          intensity={
            selectedProjectIndex === 1
              ? 14.0
              : hoveredIndex === 1
              ? 8.5
              : selectedProjectIndex !== null
              ? 1.8
              : 5.5
          }
          color="#ffffff"
          angle={0.5}
          penumbra={0.65}
        />

        <spotLight
          position={isMobile ? [hefinPos[0], 3.4, 2.2] : [2.72, 3.4, 2.2]}
          target-position={[hefinPos[0], 0.2, 0]}
          intensity={
            selectedProjectIndex === 2
              ? 14.0
              : hoveredIndex === 2
              ? 8.5
              : selectedProjectIndex !== null
              ? 1.8
              : 5.5
          }
          color="#ffffff"
          angle={0.5}
          penumbra={0.65}
        />

        {!reduced && <ArchiveParticles count={55} />}

        <group position={[0, 0, 0]}>
          <DocReconExhibit
            isSelected={selectedProjectIndex === 0}
            isHovered={hoveredIndex === 0}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 0}
            position={docReconPos}
            onClick={() => onSelectProject(0)}
            onPointerOver={() => setHoveredIndex(0)}
            onPointerOut={() => setHoveredIndex(null)}
          />

          <PathwayAIExhibit
            isSelected={selectedProjectIndex === 1}
            isHovered={hoveredIndex === 1}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 1}
            position={pathwayPos}
            onClick={() => onSelectProject(1)}
            onPointerOver={() => setHoveredIndex(1)}
            onPointerOut={() => setHoveredIndex(null)}
          />

          <HefinExhibit
            isSelected={selectedProjectIndex === 2}
            isHovered={hoveredIndex === 2}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 2}
            position={hefinPos}
            onClick={() => onSelectProject(2)}
            onPointerOver={() => setHoveredIndex(2)}
            onPointerOut={() => setHoveredIndex(null)}
          />
        </group>
      </Canvas>
    </div>
  );
}
