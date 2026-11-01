import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

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
  emissiveIntensity = 0.65,
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
// CUSTOM FACETED DIAMOND CRYSTAL GEOMETRY (Double-Cone Bipyramid with Girdle)
// ============================================================================
function createFacetedDiamondGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const segments = 8;
  const topY = 0.42;
  const upperY = 0.20;
  const upperR = 0.18;
  const midY = 0.0;
  const midR = 0.24;
  const lowerY = -0.20;
  const lowerR = 0.18;
  const botY = -0.42;

  const positions: number[] = [];

  const topPoint: [number, number, number] = [0, topY, 0];
  const botPoint: [number, number, number] = [0, botY, 0];
  const upperRing: [number, number, number][] = [];
  const midRing: [number, number, number][] = [];
  const lowerRing: [number, number, number][] = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const midAngle = angle + Math.PI / segments;
    upperRing.push([Math.cos(angle) * upperR, upperY, Math.sin(angle) * upperR]);
    midRing.push([Math.cos(midAngle) * midR, midY, Math.sin(midAngle) * midR]);
    lowerRing.push([Math.cos(angle) * lowerR, lowerY, Math.sin(angle) * lowerR]);
  }

  const addTri = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number]
  ) => {
    positions.push(...p1, ...p2, ...p3);
  };

  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    // Top pyramid facets
    addTri(topPoint, upperRing[i], upperRing[next]);
    // Upper transition facets
    addTri(upperRing[i], midRing[i], upperRing[next]);
    addTri(upperRing[next], midRing[i], midRing[next]);
    // Lower transition facets
    addTri(midRing[i], lowerRing[i], midRing[next]);
    addTri(midRing[next], lowerRing[i], lowerRing[next]);
    // Bottom pyramid facets
    addTri(botPoint, lowerRing[next], lowerRing[i]);
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}

// ============================================================================
// 1. FLOOR GROUP: REALISTIC 3D CONCENTRIC MECHANICAL PLATFORM
// Solid obsidian circular base with physical thickness, beveled outer edges,
// four concentric mechanical rings with engraved radial ticks, and stationary dais.
// ============================================================================
function FloorGroup({
  activeConceptIndex,
  rippleTrigger = 0,
  reduced = false,
}: {
  activeConceptIndex: number | null;
  rippleTrigger?: number;
  reduced?: boolean;
}) {
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const rippleMeshRef = useRef<THREE.Mesh>(null);
  const rippleScale = useRef(0.2);
  const rippleOpacity = useRef(0.0);

  useEffect(() => {
    rippleScale.current = 0.25;
    rippleOpacity.current = 0.95;
  }, [rippleTrigger, activeConceptIndex]);

  useFrame((_state, delta) => {
    if (reduced) return;
    // Concentric mechanical rings rotate in alternating directions
    if (ring1Ref.current) ring1Ref.current.rotation.y += delta * 0.016;
    if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 0.024;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.034;

    // Interactive silver radial ripple expansion on hover/activation
    if (rippleMeshRef.current && rippleOpacity.current > 0.01) {
      rippleScale.current += delta * 2.2;
      rippleOpacity.current = THREE.MathUtils.lerp(
        rippleOpacity.current,
        0,
        delta * 2.5
      );
      rippleMeshRef.current.scale.set(rippleScale.current, rippleScale.current, 1);
      const mat = rippleMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = rippleOpacity.current;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Soft Contact Shadow disc beneath platform foundation */}
      <mesh position={[0, -0.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 64]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>

      {/* 1. Base Foundation Plinth (Solid Obsidian Cylinder with Physical Depth) */}
      <mesh position={[0, -0.34, 0]}>
        <cylinderGeometry args={[0.90, 0.93, 0.07, 64]} />
        <meshStandardMaterial
          color="#06060a"
          roughness={0.16}
          metalness={0.92}
        />
      </mesh>

      {/* Beveled Black-Chrome Outer Perimeter Torus */}
      <mesh position={[0, -0.305, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.90, 0.012, 16, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.98}
          roughness={0.04}
          emissive="#ffffff"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 2. Ring 01: Outermost Mechanical Rotating Ring (Clockwise) */}
      <group ref={ring1Ref} position={[0, -0.30, 0]}>
        <mesh>
          <cylinderGeometry args={[0.84, 0.84, 0.035, 64]} />
          <meshStandardMaterial
            color="#08090f"
            roughness={0.12}
            metalness={0.94}
          />
        </mesh>
        <RadialTicks
          count={48}
          radius={0.78}
          tickLength={0.045}
          tickWidth={0.005}
          tickHeight={0.036}
          color="#ffffff"
          emissiveIntensity={0.5}
        />
        {/* Luminous silver perimeter groove */}
        <mesh position={[0, 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.84, 0.006, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.65}
            metalness={0.98}
            roughness={0.02}
          />
        </mesh>
      </group>

      {/* Stepped Divider Ring 1 */}
      <mesh position={[0, -0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.007, 16, 64]} />
        <meshStandardMaterial color="#353846" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* 3. Ring 02: Middle Mechanical Rotating Ring (Counter-Clockwise) */}
      <group ref={ring2Ref} position={[0, -0.27, 0]}>
        <mesh>
          <cylinderGeometry args={[0.68, 0.68, 0.035, 64]} />
          <meshStandardMaterial
            color="#0c0d15"
            roughness={0.10}
            metalness={0.95}
          />
        </mesh>
        <RadialTicks
          count={36}
          radius={0.62}
          tickLength={0.038}
          tickWidth={0.004}
          tickHeight={0.036}
          color="#ffffff"
          emissiveIntensity={0.6}
        />
        <mesh position={[0, 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.68, 0.0055, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.7}
            metalness={0.98}
            roughness={0.02}
          />
        </mesh>
      </group>

      {/* Stepped Divider Ring 2 */}
      <mesh position={[0, -0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.54, 0.006, 16, 64]} />
        <meshStandardMaterial color="#303340" metalness={0.96} roughness={0.08} />
      </mesh>

      {/* 4. Ring 03: Inner Mechanical Rotating Ring (Clockwise) */}
      <group ref={ring3Ref} position={[0, -0.24, 0]}>
        <mesh>
          <cylinderGeometry args={[0.50, 0.50, 0.035, 64]} />
          <meshStandardMaterial
            color="#10111a"
            roughness={0.08}
            metalness={0.96}
          />
        </mesh>
        <RadialTicks
          count={24}
          radius={0.44}
          tickLength={0.032}
          tickWidth={0.004}
          tickHeight={0.036}
          color="#ffffff"
          emissiveIntensity={0.75}
        />
        <mesh position={[0, 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.50, 0.005, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
            metalness={0.98}
            roughness={0.02}
          />
        </mesh>
      </group>

      {/* 5. Center Stationary Focus Dais (Stage where Character stands) */}
      {/* Character's feet rest on top surface at y = -0.19 */}
      <group position={[0, -0.21, 0]}>
        <mesh>
          <cylinderGeometry args={[0.32, 0.32, 0.035, 64]} />
          <meshStandardMaterial
            color="#040407"
            roughness={0.04}
            metalness={0.98}
          />
        </mesh>
        {/* Luminous circular boundary rim */}
        <mesh position={[0, 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.32, 0.006, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.9}
            metalness={0.98}
            roughness={0.02}
          />
        </mesh>
      </group>

      {/* 6. Interactive Silver Radial Shockwave */}
      <mesh
        ref={rippleMeshRef}
        position={[0, -0.19, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.2, 0.2, 1]}
      >
        <ringGeometry args={[0.15, 0.22, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 2. EXPLORER CHARACTER COMPONENT
// Grounded stationary explorer figure facing the crystal.
// Feet rest exactly on top of the dais at y = -0.19 with realistic contact shadow.
// ============================================================================
function ExplorerCharacter({ daisTopY = -0.19 }: { daisTopY?: number }) {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/assets/chamber_character.png");
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  // Character dimensions calibrated to crystal scale
  const height = 0.54;
  const width = height * (230 / 220); // 0.564

  return (
    <group position={[0, daisTopY, 0]}>
      {/* Soft Contact Shadow beneath boots */}
      <mesh position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle Ground Mist at base of coat */}
      <mesh position={[0, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.24, 32]} />
        <meshBasicMaterial
          color="#e0e4f4"
          transparent
          opacity={0.10}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* High-quality 2.5D Character Plane: feet touch daisTopY (y = 0 local) */}
      <mesh position={[0, height / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.7}
          metalness={0.15}
          alphaTest={0.02}
          depthWrite={true}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// 3. CRYSTAL GROUP: SUSPENDED FACETED ARTIFACT & INDEPENDENT ORBITAL RINGS
// Centered in upper cathedral space (y = 1.15).
// Occupies 30–40% of scene height with clear negative space below navbar
// and clear separation from explorer head.
// ============================================================================
function CrystalGroup({
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
  const crystalGroupRef = useRef<THREE.Group>(null);
  const outerCrystalRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);

  const diamondGeom = useMemo(() => createFacetedDiamondGeometry(), []);
  const edgesGeom = useMemo(() => new THREE.EdgesGeometry(diamondGeom, 12), [diamondGeom]);

  // Constellation satellite bead coordinates
  const satelliteBeads = useMemo(() => {
    return [
      [0.48, 0.06, 0.0],
      [-0.48, -0.06, 0.0],
      [0.0, 0.38, 0.12],
      [0.0, -0.38, -0.12],
      [0.26, 0.26, 0.24],
      [-0.26, -0.26, -0.24],
    ] as [number, number, number][];
  }, []);

  useFrame((state, delta) => {
    if (reduced || !crystalGroupRef.current) return;
    const t = state.clock.getElapsedTime();

    // Gentle vertical floating breathing motion
    crystalGroupRef.current.position.y = 1.15 + Math.sin(t * 0.7) * 0.025;

    // Slow independent rotation of crystal facets
    if (outerCrystalRef.current) {
      outerCrystalRef.current.rotation.y += delta * 0.12;
      outerCrystalRef.current.rotation.z = Math.sin(t * 0.35) * 0.04;
    }
    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.15;
    }

    // Independent multi-axis mechanical rotation of orbital rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.14;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.18;
      ring2Ref.current.rotation.x += delta * -0.08;
    }

    // Dynamic light pulsation
    if (pointLightRef.current) {
      const baseIntensity = 2.2 + Math.sin(t * 1.5) * 0.3;
      const boost = (activeConceptIndex !== null ? 1.5 : 0) + activationProgress * 4.5;
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
      ref={crystalGroupRef}
      position={[0, 1.15, 0]}
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
      {/* Vertical light beam axis passing through crystal */}
      <mesh>
        <cylinderGeometry args={[0.0025, 0.0025, 3.6, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 1. Outer Faceted Smoked-Glass Diamond Mesh */}
      <mesh ref={outerCrystalRef} geometry={diamondGeom}>
        <meshStandardMaterial
          color="#080a12"
          roughness={0.04}
          metalness={0.92}
          flatShading={true}
          transparent={true}
          opacity={0.75}
          emissive="#ffffff"
          emissiveIntensity={isHighlighted ? 0.32 : 0.08}
        />
      </mesh>

      {/* 2. Luminous Fine Silver Facet Edges Grid */}
      <lineSegments geometry={edgesGeom}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={isHighlighted ? 0.95 : 0.75}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* 3. Inner Radiant Core Diamond */}
      <mesh ref={innerCoreRef} geometry={diamondGeom} scale={[0.68, 0.68, 0.68]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={isHighlighted ? 2.0 : 1.1}
          roughness={0.03}
          metalness={0.95}
          transparent={true}
          opacity={0.4}
          flatShading={true}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 4. Central Radiant White Energy Node */}
      <mesh>
        <sphereGeometry args={[0.045, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2.8}
          roughness={0.02}
          metalness={0.92}
        />
      </mesh>

      {/* 5. Major Equatorial Beveled Orbital Ring */}
      <group ref={ring1Ref} rotation={[Math.PI / 8, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.48, 0.012, 6, 72]} />
          <meshStandardMaterial
            color="#12141c"
            metalness={0.98}
            roughness={0.06}
            emissive="#ffffff"
            emissiveIntensity={0.12}
          />
        </mesh>
        {/* Fine silver rim line */}
        <mesh>
          <torusGeometry args={[0.495, 0.002, 12, 72]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.8}
            metalness={0.98}
            roughness={0.02}
          />
        </mesh>
        <RadialTicks
          count={24}
          radius={0.48}
          tickLength={0.022}
          tickWidth={0.003}
          tickHeight={0.016}
          color="#ffffff"
          emissiveIntensity={0.65}
        />
      </group>

      {/* 6. Intermediate Tilted Beveled Orbital Ring */}
      <group ref={ring2Ref} rotation={[Math.PI / 3.5, 0, Math.PI / 5]}>
        <mesh>
          <torusGeometry args={[0.38, 0.010, 6, 64]} />
          <meshStandardMaterial
            color="#0e1018"
            metalness={0.98}
            roughness={0.07}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
        <mesh>
          <torusGeometry args={[0.392, 0.0018, 12, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.7}
            metalness={0.98}
            roughness={0.03}
          />
        </mesh>
      </group>

      {/* 7. Satellite Constellation Beads */}
      {satelliteBeads.map((pos, i) => (
        <mesh key={`bead-${i}`} position={pos}>
          <sphereGeometry args={[0.011, 12, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.8}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* Localized Point Light */}
      <pointLight
        ref={pointLightRef}
        intensity={2.2}
        color="#ffffff"
        distance={3.6}
        decay={1.8}
      />
    </group>
  );
}

// ============================================================================
// 4. ATMOSPHERIC PARTICLES
// ============================================================================
function AtmosphericEffects({ count = 40 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 3.2;
      coords[i * 3 + 1] = Math.random() * 2.8 - 0.4;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 2.0;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.0018;
      if (positions[i * 3 + 1] > 2.4) {
        positions[i * 3 + 1] = -0.4;
      }
      positions[i * 3] += Math.sin(t * 0.3 + i) * 0.0004;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.024}
        color="#ffffff"
        transparent
        opacity={0.32}
        sizeAttenuation
      />
    </points>
  );
}

// ============================================================================
// 5. CAMERA CONTROLLER: FRUSTUM CALCULATION & RESPONSIVE FRAMING
// Calibrates camera distance based on center scene container dimensions and FOV.
// Keeps crystal, rings, character, and platform completely within view.
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
  const targetZ = useRef(isMobile ? 5.5 : isTablet ? 5.2 : 4.8);
  const targetY = useRef(isMobile ? 0.40 : 0.45);

  useEffect(() => {
    targetZ.current = isMobile ? 5.5 : isTablet ? 5.2 : 4.8;
    targetY.current = isMobile ? 0.40 : 0.45;
  }, [isMobile, isTablet]);

  useFrame((_state, delta) => {
    if (reduced) return;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, delta * 3.0);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY.current, delta * 3.0);
    camera.lookAt(0, targetY.current, 0);
  });

  return null;
}

// ============================================================================
// 6. VISUAL DEBUG HELPERS (?debug=about)
// Renders bounding boxes, camera frustum, ground plane, and world axes.
// ============================================================================
function VisualDebugHelper({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <group>
      <axesHelper args={[1.5]} />
      <gridHelper args={[3.0, 12, "#ffffff", "#333333"]} position={[0, -0.38, 0]} />
    </group>
  );
}

// ============================================================================
// MAIN CHAMBER PLATFORM SCENE (SECTION 02)
// Clean scene hierarchy:
// SceneRoot
//  - CathedralLighting
//  - FloorGroup
//  - ExplorerCharacter
//  - CrystalGroup
//  - AtmosphericEffects
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

  const { isIsolated, isDebug } = useMemo(() => {
    if (typeof window === "undefined") {
      return { isIsolated: isolatedMode, isDebug: false };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      isIsolated: isolatedMode || params.get("isolate") === "about3d",
      isDebug: params.get("debug") === "about",
    };
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
    const duration = 1600;

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
          position: [0, isMobile ? 0.40 : 0.45, isMobile ? 5.5 : isTablet ? 5.2 : 4.8],
          fov: isMobile ? 38 : isTablet ? 36 : 34,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: !isIsolated,
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="about-platform-canvas"
      >
        {isIsolated && <color attach="background" args={["#06070a"]} />}

        <CameraController reduced={reduced} isMobile={isMobile} isTablet={isTablet} />

        {/* Scene Lighting: Directional cathedral sunlight and ambient rim illumination */}
        <ambientLight intensity={0.52} color="#b4bad0" />
        <pointLight
          position={[0, 3.0, 0.4]}
          intensity={3.8}
          color="#ffffff"
          distance={5.5}
          decay={1.8}
        />
        <directionalLight position={[-3.0, 2.0, 2.0]} intensity={1.2} color="#9aa0b6" />
        <directionalLight position={[3.0, 2.0, 2.0]} intensity={1.2} color="#9aa0b6" />
        <directionalLight position={[0, -1.0, 1.2]} intensity={0.25} color="#22242e" />

        {/* Visual Debugging Helpers */}
        <VisualDebugHelper enabled={isDebug} />

        {/* 1. Floor Group: 3D Concentric Mechanical Platform */}
        <FloorGroup
          activeConceptIndex={activeConceptIndex}
          rippleTrigger={rippleTrigger}
          reduced={reduced}
        />

        {/* 2. Explorer Character: Grounded on Center Dais with soft shadow */}
        <ExplorerCharacter daisTopY={-0.19} />

        {/* 3. Crystal Group: Suspended Faceted Diamond & Orbital Rings */}
        <CrystalGroup
          activeConceptIndex={activeConceptIndex}
          activationProgress={activationProgress}
          onActivate={triggerActivation}
          reduced={reduced}
        />

        {/* 4. Atmospheric Effects: Floating Cathedral Dust Particles */}
        {!reduced && <AtmosphericEffects count={40} />}
      </Canvas>
    </div>
  );
}
