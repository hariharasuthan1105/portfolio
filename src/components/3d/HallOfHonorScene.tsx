import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// CATHEDRAL ATMOSPHERE & LIGHT SHAFTS
// Symmetrical silver beams streaming down from central stained-glass window
// ============================================================================
function CathedralAtmosphere({ reduced = false }: { reduced?: boolean }) {
  const centralBeamRef = useRef<THREE.Mesh>(null);
  const leftBeamRef = useRef<THREE.Mesh>(null);
  const rightBeamRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();
    if (centralBeamRef.current) {
      (centralBeamRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.065 + Math.sin(t * 0.7) * 0.015;
    }
    if (leftBeamRef.current) {
      (leftBeamRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.045 + Math.sin(t * 0.6 + 1.2) * 0.012;
    }
    if (rightBeamRef.current) {
      (rightBeamRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.045 + Math.sin(t * 0.6 + 2.4) * 0.012;
    }
  });

  return (
    <group position={[0, 3.2, -1.5]}>
      {/* Central Majestic Light Shaft */}
      <mesh ref={centralBeamRef} position={[0, 0, 0]} rotation={[0.16, 0, 0]}>
        <cylinderGeometry args={[0.3, 2.6, 8.0, 32, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Symmetrical Left Slanted Shaft */}
      <mesh
        ref={leftBeamRef}
        position={[-2.6, 0, 0.4]}
        rotation={[0.15, 0, 0.12]}
      >
        <cylinderGeometry args={[0.18, 1.9, 7.5, 24, 1, true]} />
        <meshBasicMaterial
          color="#d0d0d8"
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Symmetrical Right Slanted Shaft */}
      <mesh
        ref={rightBeamRef}
        position={[2.6, 0, 0.4]}
        rotation={[0.15, 0, -0.12]}
      >
        <cylinderGeometry args={[0.18, 1.9, 7.5, 24, 1, true]} />
        <meshBasicMaterial
          color="#d0d0d8"
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// REALISTIC GOTHIC ARCHITECTURAL PODIUM
// Solid obsidian construction, pointed-arch arcades, illuminated vertical slits,
// chrome upper rim bevel, ground-contact shadow, and glowing floor contact ring
// ============================================================================
interface PodiumProps {
  position: [number, number, number];
  isSelected: boolean;
  isDimmed: boolean;
  scale?: number;
  arcadeCount?: number;
}

function GothicArchitecturalPodium({
  position,
  isSelected,
  isDimmed,
  scale = 1.0,
  arcadeCount = 20,
}: PodiumProps) {
  const floorRingRef = useRef<THREE.Mesh>(null);
  const baseRadius = 0.88 * scale;
  const drumHeight = 0.38 * scale;

  useFrame((state, delta) => {
    if (floorRingRef.current) {
      const targetOpacity = isSelected ? 0.95 : isDimmed ? 0.25 : 0.7;
      const mat = floorRingRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 4);
      if (isSelected) {
        const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 3.0) * 0.035;
        floorRingRef.current.scale.set(pulse, pulse, 1);
      } else {
        floorRingRef.current.scale.set(1, 1, 1);
      }
    }
  });

  // Procedural gothic pointed-arch arcades around circumference
  const arcades = useMemo(() => {
    const list: { pos: [number, number, number]; rotY: number }[] = [];
    for (let i = 0; i < arcadeCount; i++) {
      const angle = (i / arcadeCount) * Math.PI * 2;
      const r = baseRadius * 0.96;
      list.push({
        pos: [Math.sin(angle) * r, 0, Math.cos(angle) * r],
        rotY: angle,
      });
    }
    return list;
  }, [arcadeCount, baseRadius]);

  return (
    <group position={position}>
      {/* 1. Luminous Floor Contact Ring (Glowing silver halo on cathedral marble) */}
      <mesh
        ref={floorRingRef}
        position={[0, -0.28 * scale, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[baseRadius * 1.05, baseRadius * 1.22, 64]} />
        <meshBasicMaterial
          color={isSelected ? "#ffffff" : "#cccccc"}
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Soft Contact Ground Shadow Disc */}
      <mesh
        position={[0, -0.285 * scale, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[baseRadius * 1.35, 48]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Base Plinth: Tier 1 Flanged Rim */}
      <mesh position={[0, -0.24 * scale, 0]}>
        <cylinderGeometry
          args={[baseRadius * 1.02, baseRadius * 1.06, 0.06 * scale, 48]}
        />
        <meshStandardMaterial
          color="#0b0b10"
          roughness={0.16}
          metalness={0.92}
        />
      </mesh>

      {/* 4. Tier 2: Stepped Ring with Chrome Rim */}
      <mesh position={[0, -0.18 * scale, 0]}>
        <cylinderGeometry
          args={[baseRadius * 0.96, baseRadius * 1.01, 0.06 * scale, 48]}
        />
        <meshStandardMaterial
          color="#14141c"
          roughness={0.14}
          metalness={0.95}
        />
      </mesh>

      {/* 5. Main Cylindrical Obsidian Drum Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry
          args={[baseRadius * 0.92, baseRadius * 0.95, drumHeight, 48]}
        />
        <meshStandardMaterial
          color="#07070c"
          roughness={0.18}
          metalness={0.94}
        />
      </mesh>

      {/* 6. Gothic Pointed-Arch Arcades with Illuminated Slits */}
      <group position={[0, 0, 0]}>
        {arcades.map((arc, i) => (
          <group key={i} position={arc.pos} rotation={[0, arc.rotY, 0]}>
            {/* Recessed Arch Niche */}
            <mesh position={[0, 0, 0.012 * scale]}>
              <boxGeometry
                args={[0.065 * scale, 0.22 * scale, 0.02 * scale]}
              />
              <meshStandardMaterial
                color="#020204"
                roughness={0.3}
                metalness={0.85}
              />
            </mesh>

            {/* Pointed Arch Crest */}
            <mesh
              position={[0, 0.12 * scale, 0.012 * scale]}
              rotation={[0, 0, Math.PI / 4]}
            >
              <boxGeometry
                args={[0.045 * scale, 0.045 * scale, 0.02 * scale]}
              />
              <meshStandardMaterial
                color="#020204"
                roughness={0.3}
                metalness={0.85}
              />
            </mesh>

            {/* Glowing Vertical Light Slot */}
            <mesh position={[0, 0, 0.018 * scale]}>
              <cylinderGeometry
                args={[
                  0.01 * scale,
                  0.01 * scale,
                  0.17 * scale,
                  8,
                  1,
                ]}
              />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isSelected ? 0.95 : isDimmed ? 0.35 : 0.75}
              />
            </mesh>

            {/* Top Light Bead */}
            <mesh position={[0, 0.11 * scale, 0.018 * scale]}>
              <sphereGeometry args={[0.014 * scale, 8, 8]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isSelected ? 1.0 : isDimmed ? 0.4 : 0.85}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 7. Stepped Upper Tier & Polished Cornice */}
      <mesh position={[0, 0.21 * scale, 0]}>
        <cylinderGeometry
          args={[baseRadius * 0.95, baseRadius * 0.91, 0.05 * scale, 48]}
        />
        <meshStandardMaterial
          color="#161622"
          roughness={0.12}
          metalness={0.96}
        />
      </mesh>

      {/* 8. Top Beveled Chrome Trim Torus */}
      <mesh
        position={[0, 0.235 * scale, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry
          args={[baseRadius * 0.92, 0.018 * scale, 16, 48]}
        />
        <meshStandardMaterial
          color="#ececf0"
          roughness={0.06}
          metalness={0.98}
        />
      </mesh>

      {/* 9. Top Obsidian Dais Surface where the trophy stands */}
      <mesh position={[0, 0.245 * scale, 0]}>
        <cylinderGeometry
          args={[baseRadius * 0.9, baseRadius * 0.9, 0.02 * scale, 48]}
        />
        <meshStandardMaterial
          color="#040407"
          roughness={0.1}
          metalness={0.98}
        />
      </mesh>

      {/* Fine Silver Inlay Line on Dais */}
      <mesh
        position={[0, 0.256 * scale, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry
          args={[baseRadius * 0.74, baseRadius * 0.76, 48]}
        />
        <meshBasicMaterial
          color={isSelected ? "#ffffff" : "#88889a"}
          transparent
          opacity={isSelected ? 0.85 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// METALLIC LAUREL WREATH BRANCHES
// Refined silver laurel branches with flattened faceted leaves cradling trophy base
// ============================================================================
function MetallicLaurelBranches({
  scale = 1.0,
  isSelected = false,
  spanRadius = 0.48,
}: {
  scale?: number;
  isSelected?: boolean;
  spanRadius?: number;
}) {
  const leaves = useMemo(() => {
    const list: {
      pos: [number, number, number];
      rot: [number, number, number];
      s: number;
    }[] = [];
    const count = 7;
    const r = spanRadius * scale;
    for (let i = 0; i < count; i++) {
      const angle = (i / (count - 1)) * (Math.PI * 0.52) - Math.PI * 0.08;
      const s = (0.75 - Math.abs(i - count * 0.45) * 0.07) * scale;
      // Left branch leaf
      list.push({
        pos: [
          -Math.cos(angle) * r - 0.05 * scale,
          Math.sin(angle) * r + 0.05 * scale,
          0.02 * scale,
        ],
        rot: [0, 0.2, angle + 0.35],
        s,
      });
      // Right branch leaf
      list.push({
        pos: [
          Math.cos(angle) * r + 0.05 * scale,
          Math.sin(angle) * r + 0.05 * scale,
          0.02 * scale,
        ],
        rot: [0, -0.2, -angle - 0.35],
        s,
      });
    }
    return list;
  }, [scale, spanRadius]);

  return (
    <group position={[0, 0.04 * scale, 0]}>
      {/* Left Stem Wire */}
      <mesh
        position={[-0.18 * scale, 0.22 * scale, 0]}
        rotation={[0, 0, -0.38]}
      >
        <torusGeometry
          args={[spanRadius * 0.82 * scale, 0.014 * scale, 16, 32, Math.PI * 0.62]}
        />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : "#c4c8d0"}
          metalness={0.97}
          roughness={0.12}
        />
      </mesh>

      {/* Right Stem Wire */}
      <mesh
        position={[0.18 * scale, 0.22 * scale, 0]}
        rotation={[0, Math.PI, 0.38]}
      >
        <torusGeometry
          args={[spanRadius * 0.82 * scale, 0.014 * scale, 16, 32, Math.PI * 0.62]}
        />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : "#c4c8d0"}
          metalness={0.97}
          roughness={0.12}
        />
      </mesh>

      {/* Refined Flattened Silver Laurel Leaves */}
      {leaves.map((item, idx) => (
        <group
          key={idx}
          position={item.pos}
          rotation={item.rot}
          scale={[item.s, item.s, item.s]}
        >
          <mesh scale={[0.07, 0.18, 0.02]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial
              color={isSelected ? "#ffffff" : "#d8dce4"}
              metalness={0.97}
              roughness={0.1}
              emissive={isSelected ? "#ffffff" : "#22222e"}
              emissiveIntensity={isSelected ? 0.35 : 0.04}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ============================================================================
// TROPHY 01: CONVOLVE 4.0 — SEMI-FINALIST
// Transparent black-glass shield, silver AI-brain emblem, hexagonal bevel frame,
// thin silver tilted orbital ring, metallic laurel branches, sculpted chrome base
// ============================================================================
interface TrophyProps {
  isSelected: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
  scale?: number;
}

function ConvolveTrophy({
  isSelected,
  isDimmed,
  position,
  onClick,
  scale = 1.0,
}: TrophyProps) {
  const trophyGroupRef = useRef<THREE.Group>(null);
  const orbitRingRef = useRef<THREE.Mesh>(null);
  const brainRef = useRef<THREE.Group>(null);
  const daisHeight = 0.25 * scale;

  useFrame((state, delta) => {
    if (trophyGroupRef.current) {
      const rotSpeed = isSelected ? 0.05 : 0.24;
      trophyGroupRef.current.rotation.y += delta * rotSpeed;

      const t = state.clock.getElapsedTime();
      const hover = Math.sin(t * 1.6) * 0.025;
      trophyGroupRef.current.position.y = daisHeight + hover + (isSelected ? 0.05 : 0);
    }

    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.z += delta * (isSelected ? 0.2 : 0.45);
    }

    if (brainRef.current) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 2.8) * 0.035;
      brainRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Custom shield outline geometry
  const shieldGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.58 * scale);
    shape.lineTo(0.34 * scale, 0.42 * scale);
    shape.lineTo(0.3 * scale, -0.04 * scale);
    shape.lineTo(0, -0.4 * scale);
    shape.lineTo(-0.3 * scale, -0.04 * scale);
    shape.lineTo(-0.34 * scale, 0.42 * scale);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.035 * scale,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.022 * scale,
      bevelThickness: 0.022 * scale,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [scale]);

  return (
    <group position={position}>
      {/* Gothic Architectural Podium */}
      <GothicArchitecturalPodium
        position={[0, 0, 0]}
        isSelected={isSelected}
        isDimmed={isDimmed}
        scale={scale}
        arcadeCount={18}
      />

      {/* Rotating 3D Trophy Group */}
      <group
        ref={trophyGroupRef}
        position={[0, daisHeight, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {/* Tiered Base Stand resting on podium */}
        <mesh position={[0, 0.03 * scale, 0]}>
          <cylinderGeometry
            args={[0.22 * scale, 0.28 * scale, 0.06 * scale, 32]}
          />
          <meshStandardMaterial
            color="#14141c"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>

        <mesh position={[0, 0.08 * scale, 0]}>
          <cylinderGeometry
            args={[0.15 * scale, 0.21 * scale, 0.05 * scale, 32]}
          />
          <meshStandardMaterial
            color="#2a2a36"
            roughness={0.1}
            metalness={0.98}
          />
        </mesh>

        {/* Flanking Metallic Laurel Branches at Base */}
        <group position={[0, 0.08 * scale, 0]}>
          <MetallicLaurelBranches
            scale={scale * 0.9}
            isSelected={isSelected}
            spanRadius={0.44}
          />
        </group>

        {/* Transparent Black-Glass Shield */}
        <mesh
          geometry={shieldGeometry}
          position={[0, 0.46 * scale, -0.018 * scale]}
        >
          <meshStandardMaterial
            color={isSelected ? "#1a1e28" : "#080a10"}
            roughness={0.08}
            metalness={0.88}
            transparent
            opacity={0.8}
            envMapIntensity={2.0}
          />
        </mesh>

        {/* Outer Silver Beveled Wireframe/Border on Shield */}
        <lineSegments position={[0, 0.46 * scale, -0.018 * scale]}>
          <edgesGeometry args={[shieldGeometry]} />
          <lineBasicMaterial
            color={isSelected ? "#ffffff" : "#c4c8d4"}
            linewidth={2}
          />
        </lineSegments>

        {/* Detailed Silver AI-Brain Emblem at Center */}
        <group ref={brainRef} position={[0, 0.46 * scale, 0.035 * scale]}>
          {/* Left Brain Hemisphere Lobe */}
          <mesh position={[-0.09 * scale, 0.02 * scale, 0]}>
            <sphereGeometry args={[0.09 * scale, 24, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.98}
              roughness={0.08}
              emissive={isSelected ? "#ffffff" : "#777788"}
              emissiveIntensity={isSelected ? 0.75 : 0.3}
            />
          </mesh>

          {/* Right Brain Hemisphere Lobe */}
          <mesh position={[0.09 * scale, 0.02 * scale, 0]}>
            <sphereGeometry args={[0.09 * scale, 24, 24]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.98}
              roughness={0.08}
              emissive={isSelected ? "#ffffff" : "#777788"}
              emissiveIntensity={isSelected ? 0.75 : 0.3}
            />
          </mesh>

          {/* Central Cerebral Fissure Slot */}
          <mesh position={[0, 0.02 * scale, 0.01 * scale]}>
            <boxGeometry
              args={[0.025 * scale, 0.16 * scale, 0.04 * scale]}
            />
            <meshBasicMaterial color="#020204" />
          </mesh>

          {/* Neural Circuit Folds / Convolutions */}
          {[-0.08, 0.08].map((sideX, sIdx) => (
            <group key={sIdx} position={[sideX * scale, 0.02 * scale, 0.08 * scale]}>
              <mesh position={[0, 0.04 * scale, 0]} rotation={[0, 0, Math.PI / 4]}>
                <torusGeometry args={[0.035 * scale, 0.008 * scale, 8, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
              <mesh position={[0, -0.04 * scale, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <torusGeometry args={[0.035 * scale, 0.008 * scale, 8, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}

          {/* Synaptic Nodes */}
          {[-0.12, -0.06, 0.06, 0.12].map((x, i) => (
            <mesh
              key={i}
              position={[x * scale, (i % 2 === 0 ? 0.08 : -0.05) * scale, 0.085 * scale]}
            >
              <sphereGeometry args={[0.016 * scale, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>

        {/* Tilted Thin Metallic Silver Orbital Ring */}
        <mesh
          ref={orbitRingRef}
          position={[0, 0.46 * scale, 0]}
          rotation={[0.55, 0.22, 0]}
        >
          <torusGeometry
            args={[0.58 * scale, 0.012 * scale, 16, 64]}
          />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#d8d8de"}
            metalness={0.98}
            roughness={0.08}
            emissive={isSelected ? "#ffffff" : "#000000"}
            emissiveIntensity={isSelected ? 0.4 : 0}
          />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================================
// TROPHY 02: PATHWAY AI HACKATHON — FINALIST
// Large transparent crystalline globe, miniature futuristic city skyline inside,
// dual silver orbital rings, metallic laurel wreath, polished black-chrome base
// ============================================================================
function PathwayGlobeTrophy({
  isSelected,
  isDimmed,
  position,
  onClick,
  scale = 1.1,
}: TrophyProps) {
  const trophyGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const cityGroupRef = useRef<THREE.Group>(null);
  const daisHeight = 0.25 * scale * 1.05;

  useFrame((state, delta) => {
    if (trophyGroupRef.current) {
      const rotSpeed = isSelected ? 0.04 : 0.2;
      trophyGroupRef.current.rotation.y += delta * rotSpeed;

      const t = state.clock.getElapsedTime();
      const hover = Math.sin(t * 1.5 + 1.0) * 0.028;
      trophyGroupRef.current.position.y = daisHeight + hover + (isSelected ? 0.05 : 0);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * (isSelected ? 0.22 : 0.45);
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * (isSelected ? 0.18 : 0.38);
    }
    if (cityGroupRef.current) {
      cityGroupRef.current.rotation.y += delta * 0.035;
    }
  });

  // Miniature skyline buildings inside the crystal globe
  const buildings = useMemo(() => {
    const list: {
      pos: [number, number, number];
      size: [number, number, number];
      hasAntenna: boolean;
      hasPin: boolean;
    }[] = [];

    // Central Landmark Pinnacle Tower
    list.push({
      pos: [0, 0.14 * scale, 0],
      size: [0.1 * scale, 0.42 * scale, 0.1 * scale],
      hasAntenna: true,
      hasPin: false,
    });

    // Radial cluster of 10 futuristic skyscrapers
    const count = 10;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = (0.16 + (i % 3) * 0.06) * scale;
      const height = (0.18 + (i % 4) * 0.07) * scale;
      const w = 0.055 * scale;
      const d = 0.055 * scale;
      list.push({
        pos: [
          Math.sin(angle) * radius,
          height / 2 - 0.06 * scale,
          Math.cos(angle) * radius,
        ],
        size: [w, height, d],
        hasAntenna: i % 3 === 0,
        hasPin: i === 2 || i === 7,
      });
    }
    return list;
  }, [scale]);

  return (
    <group position={position}>
      {/* Center Gothic Architectural Podium (Prominent, slightly elevated) */}
      <GothicArchitecturalPodium
        position={[0, 0, 0]}
        isSelected={isSelected}
        isDimmed={isDimmed}
        scale={scale * 1.05}
        arcadeCount={22}
      />

      {/* Rotating 3D Trophy Group */}
      <group
        ref={trophyGroupRef}
        position={[0, daisHeight, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {/* Tiered Base Stand */}
        <mesh position={[0, 0.04 * scale, 0]}>
          <cylinderGeometry
            args={[0.26 * scale, 0.32 * scale, 0.07 * scale, 32]}
          />
          <meshStandardMaterial
            color="#14141c"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>

        <mesh position={[0, 0.1 * scale, 0]}>
          <cylinderGeometry
            args={[0.18 * scale, 0.25 * scale, 0.06 * scale, 32]}
          />
          <meshStandardMaterial
            color="#2a2a36"
            roughness={0.1}
            metalness={0.98}
          />
        </mesh>

        {/* Flared Calyx / Pedestal Goblet supporting the globe */}
        <mesh position={[0, 0.18 * scale, 0]}>
          <cylinderGeometry
            args={[0.24 * scale, 0.12 * scale, 0.11 * scale, 32]}
          />
          <meshStandardMaterial
            color="#e8e8ee"
            roughness={0.08}
            metalness={0.98}
          />
        </mesh>

        {/* Metallic Laurel Wreath Cradling the Globe Base */}
        <group position={[0, 0.14 * scale, 0]}>
          <MetallicLaurelBranches
            scale={scale * 1.05}
            isSelected={isSelected}
            spanRadius={0.52}
          />
        </group>

        {/* Miniature Smart City Inside */}
        <group ref={cityGroupRef} position={[0, 0.48 * scale, 0]}>
          {/* Foundation Plate */}
          <mesh position={[0, -0.07 * scale, 0]}>
            <cylinderGeometry
              args={[0.38 * scale, 0.38 * scale, 0.02 * scale, 32]}
            />
            <meshStandardMaterial
              color="#09090e"
              roughness={0.2}
              metalness={0.92}
            />
          </mesh>

          {/* Concentric Grid Ring */}
          <mesh
            position={[0, -0.058 * scale, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry
              args={[0.26 * scale, 0.275 * scale, 32]}
            />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* City Buildings */}
          {buildings.map((b, i) => (
            <group key={i} position={b.pos}>
              <mesh>
                <boxGeometry args={b.size} />
                <meshStandardMaterial
                  color="#181a22"
                  roughness={0.15}
                  metalness={0.95}
                />
              </mesh>
              <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(...b.size)]} />
                <lineBasicMaterial
                  color={isSelected ? "#ffffff" : "#a0a4b4"}
                  linewidth={1}
                />
              </lineSegments>

              {/* Antenna */}
              {b.hasAntenna && (
                <mesh position={[0, b.size[1] / 2 + 0.035 * scale, 0]}>
                  <cylinderGeometry
                    args={[
                      0.003 * scale,
                      0.003 * scale,
                      0.07 * scale,
                      8,
                    ]}
                  />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              )}

              {/* 3D Location Marker Pin */}
              {b.hasPin && (
                <group
                  position={[0, b.size[1] / 2 + 0.065 * scale, 0]}
                  scale={0.7}
                >
                  <mesh position={[0, 0.025 * scale, 0]}>
                    <sphereGeometry args={[0.024 * scale, 12, 12]} />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                  <mesh
                    position={[0, 0, 0]}
                    rotation={[Math.PI, 0, 0]}
                  >
                    <coneGeometry
                      args={[0.018 * scale, 0.045 * scale, 12]}
                    />
                    <meshBasicMaterial color="#ffffff" />
                  </mesh>
                </group>
              )}
            </group>
          ))}
        </group>

        {/* Large Transparent Crystalline Glass Globe */}
        <mesh position={[0, 0.52 * scale, 0]}>
          <sphereGeometry args={[0.52 * scale, 48, 48]} />
          <meshStandardMaterial
            color="#d8e0f0"
            roughness={0.04}
            metalness={0.28}
            transparent
            opacity={0.34}
            side={THREE.DoubleSide}
            envMapIntensity={2.5}
          />
        </mesh>

        {/* Equatorial Latitude Ring */}
        <mesh
          position={[0, 0.52 * scale, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry
            args={[0.525 * scale, 0.007 * scale, 16, 64]}
          />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.6}
          />
        </mesh>

        {/* Dual Silver Orbital Rings */}
        <mesh
          ref={ring1Ref}
          position={[0, 0.52 * scale, 0]}
          rotation={[0.42, 0.18, 0]}
        >
          <torusGeometry
            args={[0.64 * scale, 0.014 * scale, 16, 64]}
          />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#d8d8de"}
            metalness={0.98}
            roughness={0.08}
            emissive={isSelected ? "#ffffff" : "#22222a"}
            emissiveIntensity={isSelected ? 0.45 : 0.05}
          />
        </mesh>

        <mesh
          ref={ring2Ref}
          position={[0, 0.52 * scale, 0]}
          rotation={[-0.44, 0.32, 0]}
        >
          <torusGeometry
            args={[0.68 * scale, 0.012 * scale, 16, 64]}
          />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#b4b8c4"}
            metalness={0.96}
            roughness={0.12}
            emissive={isSelected ? "#ffffff" : "#1a1a22"}
            emissiveIntensity={isSelected ? 0.4 : 0.05}
          />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================================
// TROPHY 03: WORLD COMPUTER HACKER LEAGUE — REGIONAL ROUND QUALIFIER
// Faceted black-metal / crystal shield, silver padlock emblem, decentralized
// network constellation, 4 orbiting glass cubes, metallic laurel branches
// ============================================================================
function WCHLTrophy({
  isSelected,
  isDimmed,
  position,
  onClick,
  scale = 1.0,
}: TrophyProps) {
  const trophyGroupRef = useRef<THREE.Group>(null);
  const networkGroupRef = useRef<THREE.Group>(null);
  const lockRef = useRef<THREE.Group>(null);
  const daisHeight = 0.25 * scale;

  useFrame((state, delta) => {
    if (trophyGroupRef.current) {
      const rotSpeed = isSelected ? 0.05 : 0.24;
      trophyGroupRef.current.rotation.y += delta * rotSpeed;

      const t = state.clock.getElapsedTime();
      const hover = Math.sin(t * 1.7 + 2.0) * 0.025;
      trophyGroupRef.current.position.y = daisHeight + hover + (isSelected ? 0.05 : 0);
    }

    if (networkGroupRef.current) {
      networkGroupRef.current.rotation.y += delta * (isSelected ? 0.25 : 0.55);
      networkGroupRef.current.rotation.x =
        Math.sin(state.clock.getElapsedTime() * 0.8) * 0.1;
    }

    if (lockRef.current && isSelected) {
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 3.2) * 0.03;
      lockRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Faceted shield shape
  const shieldGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.56 * scale);
    shape.lineTo(0.32 * scale, 0.4 * scale);
    shape.lineTo(0.28 * scale, -0.06 * scale);
    shape.lineTo(0, -0.4 * scale);
    shape.lineTo(-0.28 * scale, -0.06 * scale);
    shape.lineTo(-0.32 * scale, 0.4 * scale);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.035 * scale,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.022 * scale,
      bevelThickness: 0.022 * scale,
    };
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [scale]);

  // Orbiting decentralized cubes
  const orbitCubes = useMemo(() => {
    const list: {
      angle: number;
      dist: number;
      y: number;
      cubeScale: number;
    }[] = [
      { angle: 0, dist: 0.58 * scale, y: 0.15 * scale, cubeScale: 0.09 * scale },
      {
        angle: Math.PI * 0.55,
        dist: 0.54 * scale,
        y: -0.1 * scale,
        cubeScale: 0.08 * scale,
      },
      {
        angle: Math.PI * 1.1,
        dist: 0.62 * scale,
        y: 0.06 * scale,
        cubeScale: 0.1 * scale,
      },
      {
        angle: Math.PI * 1.65,
        dist: 0.56 * scale,
        y: -0.04 * scale,
        cubeScale: 0.085 * scale,
      },
    ];
    return list;
  }, [scale]);

  return (
    <group position={position}>
      {/* Gothic Architectural Podium */}
      <GothicArchitecturalPodium
        position={[0, 0, 0]}
        isSelected={isSelected}
        isDimmed={isDimmed}
        scale={scale}
        arcadeCount={18}
      />

      {/* Rotating 3D Trophy Group */}
      <group
        ref={trophyGroupRef}
        position={[0, daisHeight, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {/* Tiered Base Stand */}
        <mesh position={[0, 0.03 * scale, 0]}>
          <cylinderGeometry
            args={[0.22 * scale, 0.28 * scale, 0.06 * scale, 32]}
          />
          <meshStandardMaterial
            color="#14141c"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>

        <mesh position={[0, 0.08 * scale, 0]}>
          <cylinderGeometry
            args={[0.15 * scale, 0.21 * scale, 0.05 * scale, 32]}
          />
          <meshStandardMaterial
            color="#2a2a36"
            roughness={0.1}
            metalness={0.98}
          />
        </mesh>

        {/* Flanking Metallic Laurel Branches at Base */}
        <group position={[0, 0.08 * scale, 0]}>
          <MetallicLaurelBranches
            scale={scale * 0.9}
            isSelected={isSelected}
            spanRadius={0.44}
          />
        </group>

        {/* Faceted Dark-Glass Shield */}
        <mesh
          geometry={shieldGeometry}
          position={[0, 0.46 * scale, -0.018 * scale]}
        >
          <meshStandardMaterial
            color={isSelected ? "#1c1e28" : "#080a10"}
            roughness={0.08}
            metalness={0.9}
            transparent
            opacity={0.8}
            envMapIntensity={2.0}
          />
        </mesh>

        {/* Shield Silver Bevel Edges */}
        <lineSegments position={[0, 0.46 * scale, -0.018 * scale]}>
          <edgesGeometry args={[shieldGeometry]} />
          <lineBasicMaterial
            color={isSelected ? "#ffffff" : "#c4c8d4"}
            linewidth={2}
          />
        </lineSegments>

        {/* Prominent Illuminated Silver Padlock Emblem at Center */}
        <group ref={lockRef} position={[0, 0.45 * scale, 0.04 * scale]}>
          {/* Padlock Shackle Loop */}
          <mesh position={[0, 0.09 * scale, 0]}>
            <torusGeometry
              args={[
                0.065 * scale,
                0.016 * scale,
                16,
                32,
                Math.PI,
              ]}
            />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.98}
              roughness={0.08}
              emissive={isSelected ? "#ffffff" : "#888899"}
              emissiveIntensity={isSelected ? 0.8 : 0.3}
            />
          </mesh>

          {/* Solid Silver Padlock Body */}
          <mesh position={[0, 0.015 * scale, 0]}>
            <boxGeometry
              args={[0.16 * scale, 0.14 * scale, 0.04 * scale]}
            />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.98}
              roughness={0.1}
              emissive={isSelected ? "#ffffff" : "#777788"}
              emissiveIntensity={isSelected ? 0.7 : 0.25}
            />
          </mesh>

          {/* Keyhole Slot & Notch */}
          <mesh position={[0, 0.025 * scale, 0.022 * scale]}>
            <circleGeometry args={[0.018 * scale, 16]} />
            <meshBasicMaterial color="#020204" />
          </mesh>
          <mesh position={[0, -0.005 * scale, 0.022 * scale]}>
            <planeGeometry
              args={[0.012 * scale, 0.03 * scale]}
            />
            <meshBasicMaterial color="#020204" />
          </mesh>
        </group>

        {/* Orbiting Decentralized Constellation of Cubes */}
        <group ref={networkGroupRef} position={[0, 0.46 * scale, 0]}>
          {orbitCubes.map((item, idx) => {
            const x = Math.sin(item.angle) * item.dist;
            const z = Math.cos(item.angle) * item.dist;
            const y = item.y;
            return (
              <group key={idx} position={[x, y, z]}>
                <mesh>
                  <boxGeometry
                    args={[
                      item.cubeScale,
                      item.cubeScale,
                      item.cubeScale,
                    ]}
                  />
                  <meshStandardMaterial
                    color="#ffffff"
                    wireframe
                    metalness={0.95}
                    roughness={0.15}
                    emissive="#ffffff"
                    emissiveIntensity={isSelected ? 0.85 : 0.4}
                  />
                </mesh>
                <mesh>
                  <boxGeometry
                    args={[
                      item.cubeScale * 0.7,
                      item.cubeScale * 0.7,
                      item.cubeScale * 0.7,
                    ]}
                  />
                  <meshStandardMaterial
                    color="#080810"
                    roughness={0.2}
                    metalness={0.9}
                  />
                </mesh>
              </group>
            );
          })}
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// CAMERA CONTROLLER: RESPONSIVE VIEWPORT FRAMING
// Calibrates camera distance & FOV so all 3 podiums and trophies are 100% visible
// without horizontal overflow, vertical clipping, or navbar collision.
// ============================================================================
function ResponsiveCameraController({
  isMobile,
  isTablet,
  selectedAwardIndex,
}: {
  isMobile: boolean;
  isTablet: boolean;
  selectedAwardIndex: number | null;
}) {
  const { camera } = useThree();

  useFrame((_state, delta) => {
    let targetX = 0;
    let targetY = -0.05;
    let targetZ = 6.4;

    if (isMobile) {
      targetZ = 5.6;
      targetY = -0.15;
      if (selectedAwardIndex === 0) targetX = -2.5;
      else if (selectedAwardIndex === 1) targetX = 0;
      else if (selectedAwardIndex === 2) targetX = 2.5;
    } else if (isTablet) {
      targetZ = 6.8;
      targetY = -0.08;
    } else {
      targetZ = 6.4;
      targetY = -0.05;
    }

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      targetX,
      delta * 4.0
    );
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      targetY,
      delta * 4.0
    );
    camera.position.z = THREE.MathUtils.lerp(
      camera.position.z,
      targetZ,
      delta * 4.0
    );
    camera.lookAt(targetX, targetY, 0);
  });

  return null;
}

// ============================================================================
// VISUAL DEBUG HELPER (?debug=hall)
// ============================================================================
function HallDebugHelper({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <group>
      <axesHelper args={[2.0]} />
      <gridHelper
        args={[8.0, 16, "#ffffff", "#333333"]}
        position={[0, -0.75, 0]}
      />
    </group>
  );
}

// ============================================================================
// MAIN 3D HALL OF HONOR SCENE
// ============================================================================
export default function HallOfHonorScene({
  selectedAwardIndex,
  onSelectAward,
  reduced = false,
}: {
  selectedAwardIndex: number | null;
  onSelectAward: (index: number) => void;
  reduced?: boolean;
}) {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const { isIsolated, isDebug } = useMemo(() => {
    if (typeof window === "undefined") {
      return { isIsolated: false, isDebug: false };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      isIsolated: params.get("isolate") === "hall3d",
      isDebug: params.get("debug") === "hall",
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1200;

  // Calibrated ground-plane coordinates
  const podiumY = -0.58;

  const leftPos: [number, number, number] = isMobile
    ? [-2.5, podiumY, 0]
    : isTablet
    ? [-2.4, podiumY, 0.2]
    : [-2.65, podiumY, 0.3];

  const centerPos: [number, number, number] = isMobile
    ? [0, podiumY, 0]
    : [0, podiumY + 0.04, 0.4];

  const rightPos: [number, number, number] = isMobile
    ? [2.5, podiumY, 0]
    : isTablet
    ? [2.4, podiumY, 0.2]
    : [2.65, podiumY, 0.3];

  return (
    <div
      className={`hall-canvas-wrapper ${isIsolated ? "isolated-hall-mode" : ""}`}
      aria-hidden="false"
      role="region"
      aria-label="3D Ceremonial Hall of Honor Trophy Exhibition"
    >
      <Canvas
        camera={{
          position: [0, -0.05, isMobile ? 5.6 : isTablet ? 6.8 : 6.4],
          fov: isMobile ? 40 : isTablet ? 38 : 36,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: !isIsolated,
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="hall-three-canvas"
      >
        {isIsolated && <color attach="background" args={["#060608"]} />}

        <ResponsiveCameraController
          isMobile={isMobile}
          isTablet={isTablet}
          selectedAwardIndex={selectedAwardIndex}
        />

        {/* Debugging Helpers (?debug=hall) */}
        <HallDebugHelper enabled={isDebug} />

        {/* Ambient & Cathedral Symmetrical Directional Lights */}
        <ambientLight intensity={0.65} color="#b0b8cc" />

        {/* Central Cathedral Window Light streaming down */}
        <directionalLight
          position={[0, 6.0, 1.5]}
          intensity={3.4}
          color="#ffffff"
        />

        {/* Side Rim & Fill Lights */}
        <directionalLight
          position={[-6.0, 2.5, 3.0]}
          intensity={1.6}
          color="#c8d0e0"
        />
        <directionalLight
          position={[6.0, 2.5, 3.0]}
          intensity={1.6}
          color="#c8d0e0"
        />

        {/* Cathedral Uplight from Obsidian Marble Floor */}
        <pointLight
          position={[0, -2.2, 1.8]}
          intensity={12}
          color="#dadada"
          distance={8}
          decay={1.8}
        />

        {/* Focused Spotlights for each Trophy */}
        <spotLight
          position={[-2.65, 3.0, 2.2]}
          target-position={leftPos}
          intensity={selectedAwardIndex === 0 ? 5.0 : 2.2}
          color="#ffffff"
          angle={0.45}
          penumbra={0.6}
        />
        <spotLight
          position={[0, 3.2, 2.4]}
          target-position={centerPos}
          intensity={selectedAwardIndex === 1 ? 5.5 : 2.6}
          color="#ffffff"
          angle={0.48}
          penumbra={0.6}
        />
        <spotLight
          position={[2.65, 3.0, 2.2]}
          target-position={rightPos}
          intensity={selectedAwardIndex === 2 ? 5.0 : 2.2}
          color="#ffffff"
          angle={0.45}
          penumbra={0.6}
        />

        {/* Atmospheric God Rays */}
        <CathedralAtmosphere reduced={reduced} />

        {/* Three Symmetrical 3D Trophies on Gothic Podiums */}
        <group>
          {/* Trophy 01: Convolve 4.0 */}
          <ConvolveTrophy
            isSelected={selectedAwardIndex === 0}
            isDimmed={selectedAwardIndex !== null && selectedAwardIndex !== 0}
            position={leftPos}
            onClick={() => onSelectAward(0)}
            scale={isMobile ? 0.95 : 1.0}
          />

          {/* Trophy 02: Pathway AI Hackathon */}
          <PathwayGlobeTrophy
            isSelected={selectedAwardIndex === 1}
            isDimmed={selectedAwardIndex !== null && selectedAwardIndex !== 1}
            position={centerPos}
            onClick={() => onSelectAward(1)}
            scale={isMobile ? 1.05 : 1.15}
          />

          {/* Trophy 03: World Computer Hacker League */}
          <WCHLTrophy
            isSelected={selectedAwardIndex === 2}
            isDimmed={selectedAwardIndex !== null && selectedAwardIndex !== 2}
            position={rightPos}
            onClick={() => onSelectAward(2)}
            scale={isMobile ? 0.95 : 1.0}
          />

          {/* Subtle Cathedral Dust Particles */}
          {!reduced && (
            <Sparkles
              count={isMobile ? 24 : 50}
              size={1.4}
              scale={[10, 4.2, 5]}
              speed={0.15}
              color="#ffffff"
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
