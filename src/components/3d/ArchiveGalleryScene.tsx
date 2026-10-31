import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Html } from "@react-three/drei";
import * as THREE from "three";
import { FileText, Globe, Network, ArrowUpRight } from "lucide-react";

// ============================================================================
// SHARED PREMIUM EXHIBITION PEDESTAL
// ============================================================================
function ExhibitionPedestal({
  isSelected,
  isDimmed,
  position = [0, -0.92, 0],
}: {
  isSelected: boolean;
  isDimmed: boolean;
  position?: [number, number, number];
}) {
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group position={position}>
      {/* Tier 1: Heavy Beveled Obsidian Base Plinth */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.88, 0.96, 0.12, 32]} />
        <meshStandardMaterial
          color="#09090e"
          roughness={0.16}
          metalness={0.94}
        />
      </mesh>

      {/* Tier 2: Refined Stepped Stage Platform */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.8, 0.86, 0.06, 32]} />
        <meshStandardMaterial
          color="#151520"
          roughness={0.14}
          metalness={0.92}
        />
      </mesh>

      {/* Radiant Perimeter Light Seam */}
      <mesh ref={haloRef} position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.81, 0.84, 32]} />
        <meshBasicMaterial
          color={isSelected ? "#ffffff" : "#60606a"}
          transparent
          opacity={isSelected ? 0.95 : isDimmed ? 0.25 : 0.55}
        />
      </mesh>

      {/* Mirrored Stage Surface */}
      <mesh position={[0, 0.116, 0]}>
        <cylinderGeometry args={[0.78, 0.78, 0.01, 32]} />
        <meshPhysicalMaterial
          color="#06060a"
          roughness={0.08}
          metalness={0.98}
          reflectivity={0.95}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// EXHIBIT 01: DOCRECON - ADVANCED DOCUMENT INTELLIGENCE
// ============================================================================
function DocReconExhibit({
  isSelected,
  isDimmed,
  onClick,
  position = [-3.15, 0, 0],
  isMobile = false,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  position?: [number, number, number];
  isMobile?: boolean;
}) {
  const modelRef = useRef<THREE.Group>(null);
  const scanBeamRef = useRef<THREE.Group>(null);
  const scanLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (modelRef.current) {
      modelRef.current.position.y = 0.1 + Math.sin(t * 0.9) * 0.04;
      modelRef.current.rotation.y = Math.sin(t * 0.35) * 0.06 - 0.12;
    }
    if (scanBeamRef.current) {
      const scanY = Math.sin(t * 1.8) * 0.56;
      scanBeamRef.current.position.y = scanY;
      if (scanLightRef.current) {
        scanLightRef.current.intensity = 2.5 + Math.sin(t * 3.5) * 0.8;
      }
    }
  });

  return (
    <group
      position={position}
      scale={isMobile ? 0.76 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Dedicated Grounded Plinth */}
      <ExhibitionPedestal isSelected={isSelected} isDimmed={isDimmed} />

      {/* 3D Model: Floating Fanned Document Intelligence Assembly */}
      <group ref={modelRef} position={[0, 0.1, 0]}>
        {/* Layer 3 (Backsheet) */}
        <group position={[0.12, 0.12, -0.22]} rotation={[0.08, -0.12, 0.05]}>
          <mesh>
            <planeGeometry args={[1.05, 1.45]} />
            <meshPhysicalMaterial
              color="#08080f"
              roughness={0.2}
              transmission={0.7}
              transparent
              opacity={0.65}
              metalness={0.5}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.05, 1.45)]} />
            <lineBasicMaterial color="#505058" transparent opacity={0.5} />
          </lineSegments>
        </group>

        {/* Layer 2 (Middle Sheet) */}
        <group position={[-0.1, 0.06, -0.1]} rotation={[0.04, 0.1, -0.03]}>
          <mesh>
            <planeGeometry args={[1.1, 1.5]} />
            <meshPhysicalMaterial
              color="#0a0a14"
              roughness={0.16}
              transmission={0.78}
              transparent
              opacity={0.75}
              metalness={0.6}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 1.5)]} />
            <lineBasicMaterial color="#70707a" transparent opacity={0.65} />
          </lineSegments>
        </group>

        {/* Layer 1 (Front Primary Document with Invoice Layout) */}
        <group position={[0, 0, 0]} rotation={[0.06, -0.06, 0.02]}>
          {/* Main Translucent Glass Sheet */}
          <mesh>
            <planeGeometry args={[1.15, 1.55]} />
            <meshPhysicalMaterial
              color="#0d0d16"
              roughness={0.1}
              metalness={0.3}
              transmission={0.85}
              transparent
              opacity={0.9}
              clearcoat={1.0}
              clearcoatRoughness={0.08}
              reflectivity={0.92}
            />
          </mesh>
          {/* Document Sheet Border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.15, 1.55)]} />
            <lineBasicMaterial
              color={isSelected ? "#ffffff" : "#9696a0"}
              transparent
              opacity={0.85}
            />
          </lineSegments>

          {/* INVOICE STRUCTURE GEOMETRY */}
          {/* Header Banner */}
          <mesh position={[0, 0.58, 0.015]}>
            <planeGeometry args={[0.92, 0.08]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
          </mesh>
          {/* Logo / Company Box */}
          <mesh position={[-0.35, 0.58, 0.02]}>
            <planeGeometry args={[0.14, 0.06]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
          </mesh>
          {/* QR / Barcode Pattern */}
          <mesh position={[0.34, 0.58, 0.02]}>
            <planeGeometry args={[0.14, 0.06]} />
            <meshBasicMaterial color="#dadada" transparent opacity={0.8} />
          </mesh>

          {/* Meta divider lines */}
          <mesh position={[0, 0.46, 0.015]}>
            <planeGeometry args={[0.92, 0.01]} />
            <meshBasicMaterial color="#707078" transparent opacity={0.6} />
          </mesh>

          {/* Table Headers */}
          <mesh position={[0, 0.28, 0.015]}>
            <planeGeometry args={[0.92, 0.06]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
          </mesh>

          {/* Itemized Table Row Grid Lines */}
          {[-0.2, -0.06, 0.08, 0.2].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.015]}>
              <planeGeometry args={[0.92, 0.008]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
            </mesh>
          ))}

          {/* Table Column Dividers */}
          {[-0.15, 0.15].map((x, idx) => (
            <mesh key={idx} position={[x, 0.02, 0.015]}>
              <planeGeometry args={[0.006, 0.5]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
            </mesh>
          ))}

          {/* Total & Verification Block */}
          <mesh position={[0.26, -0.42, 0.015]}>
            <planeGeometry args={[0.4, 0.1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
          </mesh>

          {/* Verification Octagonal Seal */}
          <mesh position={[-0.26, -0.42, 0.02]} rotation={[0, 0, Math.PI / 8]}>
            <ringGeometry args={[0.08, 0.09, 8]} />
            <meshBasicMaterial color="#dadada" transparent opacity={0.75} />
          </mesh>

          {/* FINE OCR BOUNDING BOXES */}
          {/* Box 1: Invoice Header ID */}
          <group position={[-0.04, 0.46, 0.03]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.44, 0.07)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </lineSegments>
          </group>

          {/* Box 2: Vendor Row Field */}
          <group position={[-0.1, 0.08, 0.03]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.62, 0.08)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.9} />
            </lineSegments>
          </group>

          {/* Box 3: Total Amount Verification */}
          <group position={[0.26, -0.42, 0.035]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.38, 0.09)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.95} />
            </lineSegments>
          </group>

          {/* ANIMATED OCR SCANNER ASSEMBLY */}
          <group ref={scanBeamRef} position={[0, 0, 0.04]}>
            {/* Luminous Horizontal Laser Line */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.007, 0.007, 1.22, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            {/* Laser Volumetric Glow Sweep Plane */}
            <mesh position={[0, -0.04, 0]}>
              <planeGeometry args={[1.2, 0.08]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Laser Beam Spot Light */}
            <pointLight
              ref={scanLightRef}
              color="#ffffff"
              intensity={2.5}
              distance={0.9}
            />
          </group>
        </group>
      </group>

      {/* HTML Pedestal Plaque (Positioned below the pedestal stage) */}
      <Html
        position={[0, isMobile ? -1.35 : -1.48, 0.15]}
        center
        distanceFactor={isMobile ? 8.2 : 7.2}
      >
        <div
          className={`archive-plaque ${isSelected ? "selected" : ""} ${
            isDimmed ? "dimmed" : ""
          }`}
          onClick={onClick}
          role="button"
          tabIndex={0}
          aria-label="DocRecon technical details"
        >
          <div className="plaque-icon">
            <FileText size={16} />
          </div>
          <div className="plaque-content">
            <span className="plaque-num mono">01 // ARCHIVE</span>
            <h4 className="plaque-title">DocRecon</h4>
            <p className="plaque-sub mono">DOCUMENT INTELLIGENCE</p>
            <div className="plaque-tags mono">
              <span>OCR</span>
              <span>NLP</span>
              <span>CV</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="plaque-arrow" />
        </div>
      </Html>
    </group>
  );
}

// ============================================================================
// EXHIBIT 02: PATHWAY AI - MINIATURE SMART CITY & RETRIEVAL GLOBE
// ============================================================================
function PathwayAIExhibit({
  isSelected,
  isDimmed,
  onClick,
  position = [0, 0, 0.2],
  isMobile = false,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  position?: [number, number, number];
  isMobile?: boolean;
}) {
  const cityRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Group>(null);
  const gimbalRef = useRef<THREE.Mesh>(null);

  // Procedural 11-Building Smart City Grid with Setbacks
  const buildings = useMemo(() => {
    return [
      // Outer ring towers
      { x: -0.4, z: -0.32, h: 0.95, w: 0.2, d: 0.2, tiers: 1 },
      { x: -0.15, z: -0.36, h: 1.35, w: 0.22, d: 0.22, tiers: 2 },
      { x: 0.18, z: -0.35, h: 1.15, w: 0.21, d: 0.21, tiers: 1 },
      { x: 0.42, z: -0.3, h: 0.85, w: 0.19, d: 0.19, tiers: 1 },
      // Mid ring towers
      { x: -0.46, z: 0.04, h: 0.8, w: 0.18, d: 0.18, tiers: 1 },
      { x: 0.44, z: 0.06, h: 0.9, w: 0.19, d: 0.19, tiers: 1 },
      // Front row towers
      { x: -0.35, z: 0.34, h: 0.7, w: 0.19, d: 0.19, tiers: 1 },
      { x: -0.08, z: 0.36, h: 1.05, w: 0.21, d: 0.21, tiers: 2 },
      { x: 0.26, z: 0.33, h: 0.75, w: 0.2, d: 0.2, tiers: 1 },
      // Core Super-Tall Stepped Skyscraper
      { x: 0, z: -0.02, h: 1.65, w: 0.28, d: 0.28, tiers: 3 },
    ];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (cityRef.current) {
      cityRef.current.rotation.y = t * 0.08;
    }
    if (globeRef.current) {
      globeRef.current.rotation.y -= delta * 0.35;
      globeRef.current.rotation.x = Math.sin(t * 0.8) * 0.15;
    }
    if (gimbalRef.current) {
      gimbalRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group
      position={position}
      scale={isMobile ? 0.76 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Dedicated Grounded Plinth */}
      <ExhibitionPedestal isSelected={isSelected} isDimmed={isDimmed} />

      {/* 3D Smart City Cluster */}
      <group ref={cityRef} position={[0, -0.8, 0]}>
        {/* Buildings with Architectural Details & Window Dot Matrices */}
        {buildings.map((b, i) => (
          <group key={i} position={[b.x, 0, b.z]}>
            {/* Base Tier */}
            <mesh position={[0, b.h / 2, 0]}>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial
                color="#08080f"
                roughness={0.14}
                metalness={0.96}
              />
            </mesh>
            {/* Architectural Edge Outlines */}
            <lineSegments position={[0, b.h / 2, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(b.w, b.h, b.d)]} />
              <lineBasicMaterial
                color={isSelected ? "#ffffff" : "#60606a"}
                transparent
                opacity={0.7}
              />
            </lineSegments>

            {/* Stepped Setback Tier (for taller buildings) */}
            {b.tiers >= 2 && (
              <group position={[0, b.h + 0.1, 0]}>
                <mesh>
                  <boxGeometry args={[b.w * 0.75, 0.2, b.d * 0.75]} />
                  <meshStandardMaterial
                    color="#14141e"
                    roughness={0.16}
                    metalness={0.92}
                  />
                </mesh>
                <lineSegments>
                  <edgesGeometry
                    args={[new THREE.BoxGeometry(b.w * 0.75, 0.2, b.d * 0.75)]}
                  />
                  <lineBasicMaterial color="#909098" transparent opacity={0.7} />
                </lineSegments>
              </group>
            )}

            {/* Roof Spire & Beacon */}
            <mesh
              position={[
                0,
                b.tiers >= 2 ? b.h + 0.24 : b.h + 0.04,
                0,
              ]}
            >
              <cylinderGeometry args={[0.004, 0.008, 0.1, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Rooftop Sensor Node Pulse */}
            <mesh
              position={[
                0,
                b.tiers >= 2 ? b.h + 0.29 : b.h + 0.09,
                0,
              ]}
            >
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Ground Luminous Transit & Data Vectors */}
        {[-0.25, 0, 0.25].map((offsetZ, idx) => (
          <mesh
            key={idx}
            position={[0, 0.01, offsetZ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[1.0, 0.015]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
          </mesh>
        ))}

        {/* Center Vertical Data Conduit */}
        <mesh position={[0, 1.35, -0.02]}>
          <cylinderGeometry args={[0.008, 0.008, 1.1, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>

        {/* FLOATING HOLOGRAPHIC KNOWLEDGE-RETRIEVAL GLOBE */}
        <group ref={globeRef} position={[0, 2.05, -0.02]}>
          {/* Geodesic Outer Lattice */}
          <mesh>
            <icosahedronGeometry args={[0.26, 2]} />
            <meshBasicMaterial
              color="#ffffff"
              wireframe
              transparent
              opacity={0.8}
            />
          </mesh>

          {/* Inner Glowing Crystal Core */}
          <mesh>
            <octahedronGeometry args={[0.13, 0]} />
            <meshPhysicalMaterial
              color="#ffffff"
              roughness={0.1}
              metalness={0.9}
              transmission={0.6}
            />
          </mesh>

          {/* Orbiting Gimbal Ring */}
          <mesh ref={gimbalRef} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.34, 0.006, 8, 32]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
          </mesh>
        </group>
      </group>

      {/* HTML Pedestal Plaque (Positioned below the pedestal stage) */}
      <Html
        position={[0, isMobile ? -1.35 : -1.48, 0.15]}
        center
        distanceFactor={isMobile ? 8.2 : 7.2}
      >
        <div
          className={`archive-plaque center-plaque ${
            isSelected ? "selected" : ""
          } ${isDimmed ? "dimmed" : ""}`}
          onClick={onClick}
          role="button"
          tabIndex={0}
          aria-label="Pathway AI technical details"
        >
          <div className="plaque-icon">
            <Globe size={16} />
          </div>
          <div className="plaque-content">
            <span className="plaque-num mono">02 // ARCHIVE</span>
            <h4 className="plaque-title">Pathway AI</h4>
            <p className="plaque-sub mono">SMART URBAN RAG</p>
            <div className="plaque-tags mono">
              <span>RAG</span>
              <span>LLM</span>
              <span>URBAN</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="plaque-arrow" />
        </div>
      </Html>
    </group>
  );
}

// ============================================================================
// EXHIBIT 03: HEFIN - HIGH-DEPTH DECENTRALIZED HYPERCUBE & DATA PULSES
// ============================================================================
function HefinExhibit({
  isSelected,
  isDimmed,
  onClick,
  position = [3.15, 0, 0],
  isMobile = false,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  position?: [number, number, number];
  isMobile?: boolean;
}) {
  const modelRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const cageRef = useRef<THREE.Mesh>(null);
  const pulseGroupRef = useRef<THREE.Group>(null);

  // 6 Satellite Node Coordinates
  const satellites = useMemo(() => {
    return [
      [-0.72, 0.55, 0.35],
      [0.76, 0.48, -0.28],
      [-0.58, -0.42, -0.45],
      [0.68, -0.52, 0.38],
      [0, 0.82, -0.2],
      [-0.75, -0.05, -0.38],
    ];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (modelRef.current) {
      modelRef.current.position.y = 0.05 + Math.sin(t * 0.85 + 2) * 0.04;
      modelRef.current.rotation.y = Math.sin(t * 0.3) * 0.08 + 0.12;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.25;
      coreRef.current.rotation.y += delta * 0.35;
    }
    if (cageRef.current) {
      cageRef.current.rotation.x -= delta * 0.18;
      cageRef.current.rotation.z += delta * 0.28;
    }

    // Animate traveling data pulses along connecting struts
    if (pulseGroupRef.current) {
      pulseGroupRef.current.children.forEach((child, idx) => {
        const dest = satellites[idx];
        const progress = (Math.sin(t * 2.4 + idx * 1.1) + 1) / 2;
        child.position.set(
          dest[0] * progress,
          0.2 + (dest[1] - 0.2) * progress,
          dest[2] * progress
        );
      });
    }
  });

  return (
    <group
      position={position}
      scale={isMobile ? 0.76 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Dedicated Grounded Plinth */}
      <ExhibitionPedestal isSelected={isSelected} isDimmed={isDimmed} />

      {/* Central Black-Glass Hypercube System */}
      <group ref={modelRef} position={[0, 0.05, 0]}>
        {/* Polished Black-Glass Primary Hypercube */}
        <mesh ref={coreRef} position={[0, 0.2, 0]}>
          <boxGeometry args={[0.56, 0.56, 0.56]} />
          <meshPhysicalMaterial
            color="#06060c"
            roughness={0.06}
            metalness={0.98}
            transmission={0.88}
            transparent
            opacity={0.92}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
            reflectivity={0.96}
          />
        </mesh>

        {/* Inner Reflective Silver Core */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.15}
            metalness={0.95}
          />
        </mesh>

        {/* Outer Wireframe Structural Cage */}
        <mesh ref={cageRef} position={[0, 0.2, 0]}>
          <boxGeometry args={[0.78, 0.78, 0.78]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Metallic Structural Struts Connecting Core to Satellites */}
        {satellites.map((pos, idx) => {
          const start = new THREE.Vector3(0, 0.2, 0);
          const end = new THREE.Vector3(...(pos as [number, number, number]));
          const lineGeom = new THREE.BufferGeometry().setFromPoints([start, end]);
          const lineMat = new THREE.LineBasicMaterial({
            color: "#80808a",
            transparent: true,
            opacity: 0.55,
          });
          const lineObj = new THREE.Line(lineGeom, lineMat);

          return (
            <primitive key={idx} object={lineObj} />
          );
        })}

        {/* 6 Orbiting Satellite Cubes */}
        {satellites.map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            <mesh>
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshStandardMaterial
                color="#151522"
                roughness={0.16}
                metalness={0.94}
              />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.16, 0.16, 0.16)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.75} />
            </lineSegments>
          </group>
        ))}

        {/* Animated Traveling Silver Data Pulses */}
        <group ref={pulseGroupRef}>
          {satellites.map((_, idx) => (
            <mesh key={idx}>
              <sphereGeometry args={[0.024, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      </group>

      {/* HTML Pedestal Plaque (Positioned below the pedestal stage) */}
      <Html
        position={[0, isMobile ? -1.35 : -1.48, 0.15]}
        center
        distanceFactor={isMobile ? 8.2 : 7.2}
      >
        <div
          className={`archive-plaque ${isSelected ? "selected" : ""} ${
            isDimmed ? "dimmed" : ""
          }`}
          onClick={onClick}
          role="button"
          tabIndex={0}
          aria-label="HEFIN technical details"
        >
          <div className="plaque-icon">
            <Network size={16} />
          </div>
          <div className="plaque-content">
            <span className="plaque-num mono">03 // ARCHIVE</span>
            <h4 className="plaque-title">HEFIN</h4>
            <p className="plaque-sub mono">DECENTRALIZED CHATBOT</p>
            <div className="plaque-tags mono">
              <span>AI</span>
              <span>NETWORK</span>
              <span>P2P</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="plaque-arrow" />
        </div>
      </Html>
    </group>
  );
}

// ============================================================================
// MAIN ARCHIVE GALLERY 3D SCENE
// ============================================================================
export default function ArchiveGalleryScene({
  selectedProjectIndex,
  onSelectProject,
  reduced = false,
}: {
  selectedProjectIndex: number | null;
  onSelectProject: (index: number) => void;
  reduced?: boolean;
}) {
  const [windowWidth, setWindowWidth] = useState(1536);
  const [cameraZ, setCameraZ] = useState(6.4);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w < 600) {
        setCameraZ(7.8);
      } else if (w < 950) {
        setCameraZ(7.4);
      } else if (w < 1250) {
        setCameraZ(6.9);
      } else {
        setCameraZ(6.4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 600;
  const isTablet = windowWidth >= 600 && windowWidth < 950;

  const activeMobileIndex = selectedProjectIndex !== null ? selectedProjectIndex : 0;

  const docReconPos: [number, number, number] = isMobile
    ? [(0 - activeMobileIndex) * 3.2, 0, 0]
    : isTablet
    ? [-2.2, 0, 0]
    : [-2.85, 0, 0];

  const pathwayPos: [number, number, number] = isMobile
    ? [(1 - activeMobileIndex) * 3.2, 0, 0.2]
    : [0, 0, 0.2];

  const hefinPos: [number, number, number] = isMobile
    ? [(2 - activeMobileIndex) * 3.2, 0, 0]
    : isTablet
    ? [2.2, 0, 0]
    : [2.85, 0, 0];

  return (
    <div className="archive-canvas-wrapper" aria-hidden="false">
      <Canvas
        camera={{ position: [0, 0.05, cameraZ], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="archive-three-canvas"
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[0, 8, 4]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[-5, 2, 2]} intensity={1.5} color="#969696" />
        <directionalLight position={[5, 2, 2]} intensity={1.5} color="#969696" />
        <pointLight position={[0, -2, 2]} intensity={16} color="#dadada" />

        <group position={[0, 0.05, 0]}>
          <DocReconExhibit
            isSelected={selectedProjectIndex === 0}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 0}
            onClick={() => onSelectProject(0)}
            position={docReconPos}
            isMobile={isMobile}
          />

          <PathwayAIExhibit
            isSelected={selectedProjectIndex === 1}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 1}
            onClick={() => onSelectProject(1)}
            position={pathwayPos}
            isMobile={isMobile}
          />

          <HefinExhibit
            isSelected={selectedProjectIndex === 2}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 2}
            onClick={() => onSelectProject(2)}
            position={hefinPos}
            isMobile={isMobile}
          />

          {!reduced && (
            <Sparkles
              count={70}
              size={1.5}
              scale={8.5}
              speed={0.16}
              color="#ffffff"
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
