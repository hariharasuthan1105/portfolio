import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// TEXTURE LOADER FOR PEDESTAL MARBLE & ENGRAVINGS
// ============================================================================
function usePlatformTextures() {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    const outer = loader.load("/assets/ring_outer_texture.png");
    const middle = loader.load("/assets/ring_middle_texture.png");
    const inner = loader.load("/assets/ring_inner_texture.png");
    const reflection = loader.load("/assets/character_floor_reflection.png");
    [outer, middle, inner, reflection].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
    });
    return { outer, middle, inner, reflection };
  }, []);
}

// ============================================================================
// DELICATE RADIAL MECHANICAL TICKS
// ============================================================================
function RadialTicks({
  count,
  radius,
  tickLength,
  tickWidth = 0.004,
  tickHeight = 0.015,
  color = "#ffffff",
  emissiveIntensity = 0.6,
}: {
  count: number;
  radius: number;
  tickLength: number;
  tickWidth?: number;
  tickHeight?: number;
  color?: string;
  emissiveIntensity?: number;
}) {
  const ticks = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      items.push({
        position: [
          Math.cos(angle) * radius,
          tickHeight / 2,
          Math.sin(angle) * radius,
        ] as [number, number, number],
        rotation: [0, -angle, 0] as [number, number, number],
      });
    }
    return items;
  }, [count, radius, tickHeight]);

  return (
    <group>
      {ticks.map((t, idx) => (
        <mesh key={idx} position={t.position} rotation={t.rotation}>
          <boxGeometry args={[tickLength, tickHeight, tickWidth]} />
          <meshStandardMaterial
            color={color}
            metalness={0.96}
            roughness={0.06}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// CUSTOM FACETED DIAMOND CRYSTAL GEOMETRY (48 FACETS)
// ============================================================================
function createFacetedDiamondGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const segments = 8;
  const topY = 0.95;
  const upperY = 0.46;
  const upperR = 0.30;
  const midY = 0.0;
  const midR = 0.48;
  const lowerY = -0.46;
  const lowerR = 0.30;
  const botY = -0.95;

  const positions: number[] = [];

  const topPoint: [number, number, number] = [0, topY, 0];
  const botPoint: [number, number, number] = [0, botY, 0];
  const upperRing: [number, number, number][] = [];
  const midRing: [number, number, number][] = [];
  const lowerRing: [number, number, number][] = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const midAngle = ((i + 0.5) / segments) * Math.PI * 2;
    upperRing.push([Math.cos(angle) * upperR, upperY, Math.sin(angle) * upperR]);
    midRing.push([Math.cos(midAngle) * midR, midY, Math.sin(midAngle) * midR]);
    lowerRing.push([Math.cos(angle) * lowerR, lowerY, Math.sin(angle) * lowerR]);
  }

  function addTri(
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number]
  ) {
    positions.push(...p1, ...p2, ...p3);
  }

  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    // Top pyramid facets
    addTri(topPoint, upperRing[i], upperRing[next]);
    // Upper tier to equator
    addTri(upperRing[i], midRing[i], upperRing[next]);
    addTri(upperRing[next], midRing[i], midRing[next]);
    // Equator to lower tier
    addTri(midRing[i], lowerRing[i], midRing[next]);
    addTri(midRing[next], lowerRing[i], lowerRing[next]);
    // Lower pyramid facets
    addTri(lowerRing[next], lowerRing[i], botPoint);
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}

// ============================================================================
// 05 — REAL 3D CRYSTALLINE INTELLIGENCE CORE
// Translucent diamond facets, glowing refraction core, silver edges,
// and vertical light filament
// ============================================================================
function CrystallineIntelligenceCore({
  activeConceptIndex,
  activationProgress,
  onActivate,
  reduced = false,
}: {
  activeConceptIndex: number | null;
  activationProgress: number;
  onActivate: () => void;
  reduced?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const outerCrystalRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const diamondGeom = useMemo(() => createFacetedDiamondGeometry(), []);
  const edgesGeom = useMemo(() => new THREE.EdgesGeometry(diamondGeom), [diamondGeom]);

  // Astrolabe constellation coordinates
  const constellationNodes = useMemo<[number, number, number][]>(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return [Math.cos(a) * 0.76, Math.sin(a * 2) * 0.06, Math.sin(a) * 0.76];
    });
  }, []);

  useFrame((state, delta) => {
    if (reduced || !groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Gentle floating hover
    groupRef.current.position.y = 1.25 + Math.sin(t * 0.6) * 0.035;

    // Slow rotation
    if (outerCrystalRef.current) {
      outerCrystalRef.current.rotation.y = t * 0.08;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y = -t * 0.12;
      innerCoreRef.current.rotation.x = Math.sin(t * 0.4) * 0.06;
    }

    // Dynamic light pulsation
    if (pointLightRef.current) {
      const baseIntensity = 2.4 + Math.sin(t * 1.6) * 0.4;
      const boost = (activeConceptIndex !== null ? 1.8 : 0) + activationProgress * 6.0;
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        baseIntensity + boost,
        delta * 5.0
      );
    }
  });

  const isHighlighted = activeConceptIndex !== null || activationProgress > 0.05;

  return (
    <group
      ref={groupRef}
      position={[0, 1.25, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onActivate();
      }}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {/* 1. Vertical Shaft of Volumetric Light Beam passing through Crystal Axis */}
      <mesh>
        <cylinderGeometry args={[0.003, 0.003, 4.4, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer ambient beam glow */}
      <mesh>
        <cylinderGeometry args={[0.024, 0.024, 4.2, 16]} />
        <meshBasicMaterial
          color="#d0d4ee"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Outer Faceted Smoked-Diamond Crystal Mesh */}
      <mesh ref={outerCrystalRef} geometry={diamondGeom}>
        <meshStandardMaterial
          color="#06080c"
          roughness={0.05}
          metalness={0.94}
          flatShading={true}
          transparent={true}
          opacity={0.78}
          emissive="#ffffff"
          emissiveIntensity={isHighlighted ? 0.35 : 0.08}
        />
      </mesh>

      {/* 3. Luminous Silver-White Facet Edges Grid */}
      <lineSegments geometry={edgesGeom}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={isHighlighted ? 0.95 : 0.75}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 4. Inner Luminous Nested Diamond Facet Core */}
      <mesh ref={innerCoreRef} geometry={diamondGeom} scale={[0.72, 0.72, 0.72]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={isHighlighted ? 2.2 : 1.2}
          roughness={0.03}
          metalness={0.96}
          transparent={true}
          opacity={0.45}
          flatShading={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 5. Central Radiant Energy Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.065, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={3.2}
          roughness={0.02}
          metalness={0.92}
        />
      </mesh>

      {/* Core glow halo shroud */}
      <mesh>
        <sphereGeometry args={[0.11, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 6. Astrolabe Celestial Coordinates Cage */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.76, 0.0025, 8, 80]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Satellite Constellation Nodes */}
      {constellationNodes.map((pos, i) => (
        <mesh key={`node-${i}`} position={pos}>
          <sphereGeometry args={[0.014, 12, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.6}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* Dynamic Celestial Point Light */}
      <pointLight
        ref={pointLightRef}
        intensity={2.8}
        color="#f2f5ff"
        distance={4.2}
        decay={1.8}
      />
    </group>
  );
}

// ============================================================================
// 06 — REAL 3D ORBITAL RINGS
// Three thick beveled metallic mechanical rings on distinct rotational axes
// with engraved radial ticks and black-chrome reflections
// ============================================================================
function EngravedMechanicalOrbitalRings({
  activationProgress,
  reduced = false,
}: {
  activationProgress: number;
  reduced?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (reduced || !groupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Natural multi-axis rotation
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.12;
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * -0.15;
      ring2Ref.current.rotation.y += delta * 0.07;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.18;
      ring3Ref.current.rotation.z += delta * -0.10;
    }

    // Follow crystal vertical float
    groupRef.current.position.y = 1.25 + Math.sin(t * 0.6) * 0.035;

    // Resonant alignment during activation pulse
    if (activationProgress > 0.01) {
      const alignEase = Math.sin(activationProgress * Math.PI);
      if (ring1Ref.current) {
        ring1Ref.current.rotation.x = THREE.MathUtils.lerp(
          ring1Ref.current.rotation.x,
          Math.PI / 10,
          alignEase * 0.15
        );
      }
      if (ring2Ref.current) {
        ring2Ref.current.rotation.z = THREE.MathUtils.lerp(
          ring2Ref.current.rotation.z,
          Math.PI / 4,
          alignEase * 0.15
        );
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.25, 0]}>
      {/* 1. Major Equatorial Beveled Ring (Tilted ~18 deg) */}
      <group ref={ring1Ref} rotation={[Math.PI / 10, 0, 0]}>
        {/* Ring Body: Beveled Torus (6 radial segments = flat beveled hexagonal facets) */}
        <mesh>
          <torusGeometry args={[0.78, 0.022, 6, 84]} />
          <meshStandardMaterial
            color="#14151c"
            metalness={0.98}
            roughness={0.06}
            emissive="#ffffff"
            emissiveIntensity={0.12}
          />
        </mesh>
        {/* Fine silver outer rim torus */}
        <mesh>
          <torusGeometry args={[0.805, 0.0035, 12, 84]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
            metalness={0.98}
            roughness={0.02}
          />
        </mesh>
        {/* Radial mechanical tick engravings (32 markers) */}
        <RadialTicks
          count={32}
          radius={0.78}
          tickLength={0.032}
          tickWidth={0.004}
          tickHeight={0.026}
          color="#ffffff"
          emissiveIntensity={0.65}
        />
      </group>

      {/* 2. Intermediate Tilted Beveled Ring (Tilted ~44 deg) */}
      <group ref={ring2Ref} rotation={[Math.PI / 4.1, 0, Math.PI / 6]}>
        <mesh>
          <torusGeometry args={[0.66, 0.019, 6, 72]} />
          <meshStandardMaterial
            color="#101218"
            metalness={0.98}
            roughness={0.07}
            emissive="#d8e0ff"
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.682, 0.003, 12, 72]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.65}
            metalness={0.98}
            roughness={0.04}
          />
        </mesh>
        <RadialTicks
          count={24}
          radius={0.66}
          tickLength={0.028}
          tickWidth={0.004}
          tickHeight={0.022}
          color="#d0d4ee"
          emissiveIntensity={0.5}
        />
      </group>

      {/* 3. Steep Gimbal Beveled Ring (Tilted ~68 deg) */}
      <group ref={ring3Ref} rotation={[-Math.PI / 2.65, 0, -Math.PI / 8]}>
        <mesh>
          <torusGeometry args={[0.55, 0.016, 6, 64]} />
          <meshStandardMaterial
            color="#0d0e14"
            metalness={0.96}
            roughness={0.08}
            emissive="#c0c8e0"
            emissiveIntensity={0.08}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.568, 0.0028, 12, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.55}
            metalness={0.98}
            roughness={0.04}
          />
        </mesh>
        <RadialTicks
          count={18}
          radius={0.55}
          tickLength={0.024}
          tickWidth={0.004}
          tickHeight={0.02}
          color="#ffffff"
          emissiveIntensity={0.45}
        />
      </group>
    </group>
  );
}

// ============================================================================
// FLOATING KNOWLEDGE SHARDS
// ============================================================================
interface ShardData {
  pos: [number, number, number];
  rot: [number, number, number];
  scale: [number, number, number];
  speed: number;
  amp: number;
  phase: number;
}

function KnowledgeShards({
  activeConceptIndex,
  reduced = false,
}: {
  activeConceptIndex: number | null;
  reduced?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shards = useMemo<ShardData[]>(
    () => [
      {
        pos: [-0.95, 0.68, -0.4],
        rot: [0.4, 0.2, 0.1],
        scale: [0.04, 0.09, 0.035],
        speed: 0.7,
        amp: 0.035,
        phase: 0.0,
      },
      {
        pos: [0.92, 0.78, -0.35],
        rot: [-0.3, 0.5, 0.2],
        scale: [0.042, 0.1, 0.038],
        speed: 0.6,
        amp: 0.04,
        phase: 1.2,
      },
      {
        pos: [-0.62, 1.1, -0.5],
        rot: [0.2, -0.4, 0.3],
        scale: [0.035, 0.08, 0.03],
        speed: 0.8,
        amp: 0.03,
        phase: 2.4,
      },
      {
        pos: [0.65, 0.55, -0.25],
        rot: [-0.2, 0.3, -0.1],
        scale: [0.038, 0.088, 0.032],
        speed: 0.75,
        amp: 0.035,
        phase: 3.6,
      },
      {
        pos: [-0.82, 0.42, -0.2],
        rot: [0.5, 0.1, -0.4],
        scale: [0.032, 0.075, 0.028],
        speed: 0.9,
        amp: 0.028,
        phase: 4.8,
      },
      {
        pos: [0.98, 1.2, -0.45],
        rot: [-0.4, -0.2, 0.5],
        scale: [0.042, 0.095, 0.036],
        speed: 0.65,
        amp: 0.035,
        phase: 5.5,
      },
      {
        pos: [0.0, 1.45, -0.65],
        rot: [0.1, 0.6, -0.2],
        scale: [0.048, 0.11, 0.042],
        speed: 0.55,
        amp: 0.04,
        phase: 0.8,
      },
    ],
    []
  );

  useFrame((state, delta) => {
    if (reduced || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const data = shards[i];
      if (!data) return;
      child.position.y = data.pos[1] + Math.sin(t * data.speed + data.phase) * data.amp;
      child.rotation.x += delta * 0.16;
      child.rotation.y += delta * 0.22;
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const targetEmissive =
          activeConceptIndex !== null
            ? 0.4
            : 0.06 + Math.sin(t * 1.5 + data.phase) * 0.03;
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          targetEmissive,
          0.1
        );
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#06060a"
            metalness={0.96}
            roughness={0.06}
            emissive="#ffffff"
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// 07 — MONUMENTAL 3D PEDESTAL
// Stepped circular gothic machine with dark obsidian chrome body,
// counter-rotating concentric rings with delicate radial ticks, and ground mist
// ============================================================================
function MonumentalPedestalPlatform({
  activeConceptIndex,
  rippleTrigger = 0,
  reduced = false,
}: {
  activeConceptIndex: number | null;
  rippleTrigger?: number;
  reduced?: boolean;
}) {
  const textures = usePlatformTextures();
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const ring4Ref = useRef<THREE.Group>(null);
  const rippleMeshRef = useRef<THREE.Mesh>(null);
  const rippleScale = useRef(0.2);
  const rippleOpacity = useRef(0.0);

  useEffect(() => {
    rippleScale.current = 0.25;
    rippleOpacity.current = 0.95;
  }, [rippleTrigger, activeConceptIndex]);

  useFrame((_state, delta) => {
    if (reduced) return;
    if (ring1Ref.current) ring1Ref.current.rotation.y += delta * 0.014;
    if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 0.022;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.032;
    if (ring4Ref.current) ring4Ref.current.rotation.y -= delta * 0.042;

    if (rippleMeshRef.current && rippleOpacity.current > 0.01) {
      rippleScale.current += delta * 2.2;
      rippleOpacity.current = THREE.MathUtils.lerp(
        rippleOpacity.current,
        0,
        delta * 2.2
      );
      rippleMeshRef.current.scale.set(rippleScale.current, rippleScale.current, 1);
      const mat = rippleMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = rippleOpacity.current;
    }
  });

  return (
    <group position={[0, -0.88, 0]}>
      {/* 1. Sub-floor deep shadow disc */}
      <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.78, 64]} />
        <meshBasicMaterial color="#000000" depthWrite={true} />
      </mesh>

      {/* 2. Base Monumental Foundation Plinth (Heavy Stepped Base) */}
      <mesh position={[0, -0.04, 0]}>
        <cylinderGeometry args={[1.56, 1.62, 0.12, 64]} />
        <meshStandardMaterial
          color="#06060a"
          roughness={0.18}
          metalness={0.92}
        />
      </mesh>

      {/* Gothic Arcade Relief perimeter markers */}
      <RadialTicks
        count={36}
        radius={1.56}
        tickLength={0.06}
        tickWidth={0.018}
        tickHeight={0.11}
        color="#181a24"
        emissiveIntensity={0.04}
      />

      {/* Outer Polished Rim Torus */}
      <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.56, 0.014, 16, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.98}
          roughness={0.04}
          emissive="#ffffff"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 3. Ring 01: Outermost Concentric Rotating Ring (Clockwise) */}
      <group ref={ring1Ref} position={[0, 0.022, 0]}>
        <mesh>
          <cylinderGeometry args={[1.44, 1.44, 0.04, 64]} />
          <meshStandardMaterial
            color="#090a10"
            map={textures.outer}
            bumpMap={textures.outer}
            bumpScale={0.04}
            roughness={0.14}
            metalness={0.94}
          />
        </mesh>
        <RadialTicks
          count={48}
          radius={1.34}
          tickLength={0.06}
          tickWidth={0.005}
          tickHeight={0.042}
          color="#ffffff"
          emissiveIntensity={0.45}
        />
        {/* Luminous perimeter groove */}
        <mesh position={[0, 0.021, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.44, 0.008, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.7}
            metalness={0.98}
            roughness={0.02}
          />
        </mesh>
      </group>

      {/* Divider Step 1 */}
      <mesh position={[0, 0.044, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.20, 0.008, 16, 64]} />
        <meshStandardMaterial color="#404452" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* 4. Ring 02: Mid-Outer Concentric Rotating Ring (Counter-clockwise) */}
      <group ref={ring2Ref} position={[0, 0.046, 0]}>
        <mesh>
          <cylinderGeometry args={[1.16, 1.16, 0.042, 64]} />
          <meshStandardMaterial
            color="#0b0c13"
            map={textures.middle}
            bumpMap={textures.middle}
            bumpScale={0.035}
            roughness={0.15}
            metalness={0.92}
          />
        </mesh>
        <RadialTicks
          count={36}
          radius={1.04}
          tickLength={0.05}
          tickWidth={0.005}
          tickHeight={0.044}
          color="#ffffff"
          emissiveIntensity={0.4}
        />
        <mesh position={[0, 0.022, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.16, 0.0075, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            metalness={0.98}
            roughness={0.04}
          />
        </mesh>
      </group>

      {/* Divider Step 2 */}
      <mesh position={[0, 0.068, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.90, 0.0075, 16, 64]} />
        <meshStandardMaterial color="#404452" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* 5. Ring 03: Mid-Inner Concentric Rotating Ring (Clockwise) */}
      <group ref={ring3Ref} position={[0, 0.07, 0]}>
        <mesh>
          <cylinderGeometry args={[0.86, 0.86, 0.044, 64]} />
          <meshStandardMaterial
            color="#0e0f17"
            map={textures.inner}
            bumpMap={textures.inner}
            bumpScale={0.03}
            roughness={0.14}
            metalness={0.95}
          />
        </mesh>
        <RadialTicks
          count={24}
          radius={0.76}
          tickLength={0.045}
          tickWidth={0.005}
          tickHeight={0.046}
          color="#ffffff"
          emissiveIntensity={0.55}
        />
        <mesh position={[0, 0.023, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.86, 0.007, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.65}
            metalness={0.98}
            roughness={0.03}
          />
        </mesh>
        <mesh position={[0, 0.023, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.62, 0.007, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
            metalness={0.98}
            roughness={0.02}
          />
        </mesh>
      </group>

      {/* 6. Ring 04: Innermost Concentric Ring (Counter-clockwise) */}
      <group ref={ring4Ref} position={[0, 0.094, 0]}>
        <mesh>
          <cylinderGeometry args={[0.58, 0.58, 0.046, 64]} />
          <meshStandardMaterial
            color="#12141e"
            roughness={0.08}
            metalness={0.96}
          />
        </mesh>
        <RadialTicks
          count={24}
          radius={0.48}
          tickLength={0.038}
          tickWidth={0.005}
          tickHeight={0.048}
          color="#ffffff"
          emissiveIntensity={0.75}
        />
      </group>

      {/* 7. Center Stationary Focus Dais (Stage for Explorer Character) */}
      <group position={[0, 0.118, 0]}>
        <mesh>
          <cylinderGeometry args={[0.36, 0.36, 0.048, 64]} />
          <meshStandardMaterial
            color="#040407"
            roughness={0.03}
            metalness={0.98}
          />
        </mesh>
        {/* Luminous circular rim */}
        <mesh position={[0, 0.025, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.36, 0.0075, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.9}
            metalness={0.98}
            roughness={0.02}
          />
        </mesh>
        {/* Floor reflection texture plane beneath character feet */}
        <mesh position={[0, 0.026, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.48, 0.48]} />
          <meshBasicMaterial
            map={textures.reflection}
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 8. Interactive Silver Radial Shockwave */}
      <mesh
        ref={rippleMeshRef}
        position={[0, 0.145, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.2, 0.2, 1]}
      >
        <ringGeometry args={[0.25, 0.34, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 9. Ground Mist Layers around base */}
      <group position={[0, 0.01, 0]}>
        {[0, 1, 2, 3].map((idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, (idx * Math.PI) / 4]}
            position={[0, 0.003 * idx, 0]}
          >
            <ringGeometry args={[1.34 + idx * 0.06, 1.72 + idx * 0.08, 48]} />
            <meshBasicMaterial
              color="#e0e4f4"
              transparent
              opacity={0.075 - idx * 0.015}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ============================================================================
// CAMERA CONTROLLER WITH RESPONSIVE FRAMING
// ============================================================================
function CameraController({
  reduced = false,
  isMobile = false,
  isTablet = false,
}: {
  reduced?: boolean;
  isMobile?: boolean;
  isTablet?: boolean;
}) {
  const { camera } = useThree();
  const targetZ = useRef(isMobile ? 5.8 : isTablet ? 5.4 : 5.0);
  const targetY = useRef(isMobile ? 0.35 : 0.25);

  useEffect(() => {
    targetZ.current = isMobile ? 5.8 : isTablet ? 5.4 : 5.0;
    targetY.current = isMobile ? 0.35 : 0.25;
  }, [isMobile, isTablet]);

  useEffect(() => {
    if (reduced) return;
    const handleScroll = () => {
      const el = document.getElementById("about");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(
        Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0),
        1
      );
      const baseZ = isMobile ? 5.8 : isTablet ? 5.4 : 5.0;
      targetZ.current = baseZ - progress * 0.3;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reduced, isMobile, isTablet]);

  useFrame((_state, delta) => {
    if (reduced) return;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, delta * 3.0);
    camera.lookAt(0, targetY.current, 0);
  });

  return null;
}

// ============================================================================
// MAIN CHAMBER PLATFORM SCENE EXPORT
// ============================================================================
export default function ChamberPlatformScene({
  activeConceptIndex = null,
  rippleTrigger = 0,
  reduced = false,
  isolatedMode = false,
  onPlatformHover,
}: {
  activeConceptIndex?: number | null;
  rippleTrigger?: number;
  reduced?: boolean;
  isolatedMode?: boolean;
  onPlatformHover?: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [activationProgress, setActivationProgress] = useState(0);
  const activationAnimRef = useRef<number | null>(null);

  const isIsolated = useMemo(() => {
    if (isolatedMode) return true;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return params.get("isolate") === "about3d";
    }
    return false;
  }, [isolatedMode]);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsMobile(w <= 768);
      setIsTablet(w > 768 && w <= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const triggerActivation = useCallback(() => {
    if (activationAnimRef.current) cancelAnimationFrame(activationAnimRef.current);
    const startTime = performance.now();
    const duration = 1800;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const intensity = Math.sin(progress * Math.PI);
      setActivationProgress(intensity);

      if (progress < 1) {
        activationAnimRef.current = requestAnimationFrame(animate);
      } else {
        setActivationProgress(0);
      }
    };
    activationAnimRef.current = requestAnimationFrame(animate);
  }, []);

  return (
    <div
      className={`about-platform-scene-wrapper ${isIsolated ? "isolated-3d-mode" : ""}`}
      onPointerEnter={onPlatformHover}
      role="region"
      aria-label="3D Crystalline Intelligence Artifact and Monumental Pedestal"
    >
      <Canvas
        camera={{
          position: [0, 0.85, isMobile ? 5.8 : isTablet ? 5.4 : 5.0],
          fov: isMobile ? 42 : isTablet ? 38 : 36,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: !isIsolated,
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="about-platform-canvas"
      >
        {isIsolated && <color attach="background" args={["#08080c"]} />}

        <CameraController reduced={reduced} isMobile={isMobile} isTablet={isTablet} />

        {/* Ambient illumination: controlled so materials retain deep obsidian tones */}
        <ambientLight intensity={0.48} color="#b8bed2" />

        {/* Downward key light from ceiling */}
        <pointLight
          position={[0, 3.2, 0.2]}
          intensity={4.2}
          color="#ffffff"
          distance={6.0}
          decay={1.8}
        />

        {/* Rim lights catching ring bevels and facet edges */}
        <directionalLight position={[-3.5, 1.8, 2.0]} intensity={1.4} color="#a2a8bd" />
        <directionalLight position={[3.5, 1.8, 2.0]} intensity={1.4} color="#a2a8bd" />

        {/* Upward bounce from dark reflective floor */}
        <directionalLight position={[0, -1.2, 1.4]} intensity={0.3} color="#262832" />

        {/* 3D Scene Components */}
        <MonumentalPedestalPlatform
          activeConceptIndex={activeConceptIndex}
          rippleTrigger={rippleTrigger}
          reduced={reduced}
        />
        <CrystallineIntelligenceCore
          activeConceptIndex={activeConceptIndex}
          activationProgress={activationProgress}
          onActivate={triggerActivation}
          reduced={reduced}
        />
        <EngravedMechanicalOrbitalRings
          activationProgress={activationProgress}
          reduced={reduced}
        />
        <KnowledgeShards
          activeConceptIndex={activeConceptIndex}
          reduced={reduced}
        />
      </Canvas>
    </div>
  );
}
