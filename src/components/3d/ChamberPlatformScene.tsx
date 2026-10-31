import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// TEXTURES & PROCEDURAL ASSETS LOADER
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
// PROCEDURAL RADIAL GROOVES / TICKS HELPER
// Generates physical 3D tick mark geometries around a ring circumference
// ============================================================================
function RadialTicks({
  count,
  radius,
  tickLength,
  tickWidth,
  tickHeight,
  color = "#ffffff",
  emissiveIntensity = 0.4,
}: {
  count: number;
  radius: number;
  tickLength: number;
  tickWidth: number;
  tickHeight: number;
  color?: string;
  emissiveIntensity?: number;
}) {
  const ticks = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      items.push({
        position: [x, tickHeight / 2, z] as [number, number, number],
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
            metalness={0.95}
            roughness={0.12}
            emissive={color}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// FLOATING BLACK-GLASS KNOWLEDGE SHARDS
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

  const shards = useMemo<ShardData[]>(() => {
    return [
      { pos: [-0.75, 0.48, -0.4], rot: [0.4, 0.2, 0.1], scale: [0.045, 0.11, 0.04], speed: 0.7, amp: 0.04, phase: 0.0 },
      { pos: [0.72, 0.58, -0.35], rot: [-0.3, 0.5, 0.2], scale: [0.05, 0.12, 0.045], speed: 0.6, amp: 0.045, phase: 1.2 },
      { pos: [-0.42, 0.76, -0.5], rot: [0.2, -0.4, 0.3], scale: [0.04, 0.09, 0.035], speed: 0.8, amp: 0.035, phase: 2.4 },
      { pos: [0.45, 0.38, -0.25], rot: [-0.2, 0.3, -0.1], scale: [0.042, 0.1, 0.038], speed: 0.75, amp: 0.04, phase: 3.6 },
      { pos: [-0.62, 0.22, -0.2], rot: [0.5, 0.1, -0.4], scale: [0.035, 0.085, 0.03], speed: 0.9, amp: 0.03, phase: 4.8 },
      { pos: [0.78, 0.82, -0.45], rot: [-0.4, -0.2, 0.5], scale: [0.048, 0.115, 0.042], speed: 0.65, amp: 0.04, phase: 5.5 },
      { pos: [0.0, 0.98, -0.6], rot: [0.1, 0.6, -0.2], scale: [0.055, 0.135, 0.05], speed: 0.55, amp: 0.05, phase: 0.8 },
    ];
  }, []);

  useFrame((state, delta) => {
    if (reduced || !groupRef.current) return;
    const t = state.clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      const data = shards[i];
      if (!data) return;
      child.position.y = data.pos[1] + Math.sin(t * data.speed + data.phase) * data.amp;
      child.rotation.x += delta * 0.18;
      child.rotation.y += delta * 0.25;

      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        const targetEmissive = activeConceptIndex !== null ? 0.45 : 0.08 + Math.sin(t * 1.5 + data.phase) * 0.04;
        mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot} scale={s.scale}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#08080c"
            metalness={0.92}
            roughness={0.08}
            emissive="#ffffff"
            emissiveIntensity={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// CONCENTRIC 4-RING 3D ROTATING FLOOR MECHANISM (AAA STEPPED ARCHITECTURAL DAIS)
// ============================================================================
function RotatingFloorMechanism({
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

  useFrame((state, delta) => {
    if (reduced) return;

    // Counter-rotating speeds for 4 concentric mechanical rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y += delta * 0.016; // Outermost: clockwise slow
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.025; // Mid-outer: anticlockwise
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.035; // Mid-inner: clockwise
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.y -= delta * 0.046; // Innermost: anticlockwise
    }

    // Interactive silver energy ripple wave
    if (rippleMeshRef.current) {
      if (rippleOpacity.current > 0.01) {
        rippleScale.current += delta * 2.2;
        rippleOpacity.current = THREE.MathUtils.lerp(rippleOpacity.current, 0, delta * 2.2);
        rippleMeshRef.current.scale.set(rippleScale.current, rippleScale.current, 1);
        const mat = rippleMeshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = rippleOpacity.current;
      }
    }
  });

  return (
    <group position={[0, -0.68, 0]}>
      {/* ================================================================== */}
      {/* 0. BASE STEPPED OBSIDIAN FOUNDATION PLINTH (Visible 3D Thickness) */}
      {/* ================================================================== */}
      {/* Sub-floor shadow disc masking painted background floor */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.55, 64]} />
        <meshBasicMaterial color="#020204" depthWrite={true} />
      </mesh>

      {/* Main Base Cylinder: Physical Elevation and Bevel Profile */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[1.38, 1.44, 0.06, 64]} />
        <meshStandardMaterial
          color="#060609"
          roughness={0.2}
          metalness={0.88}
        />
      </mesh>

      {/* Outer Polished Metallic Chamfer Rim */}
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.38, 0.014, 16, 64]} />
        <meshStandardMaterial
          color="#80808a"
          metalness={0.96}
          roughness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* ================================================================== */}
      {/* 1. RING 01: OUTERMOST MECHANICAL TRACK (R: ~1.34 - 1.12, Clockwise) */}
      {/* ================================================================== */}
      <group ref={ring1Ref} position={[0, 0.012, 0]}>
        {/* Ring Body */}
        <mesh>
          <cylinderGeometry args={[1.34, 1.34, 0.022, 64]} />
          <meshStandardMaterial
            color="#121217"
            map={textures.outer}
            bumpMap={textures.outer}
            bumpScale={0.04}
            roughness={0.16}
            metalness={0.9}
          />
        </mesh>
        {/* 48 Physical Radial Mechanical Grooves / Ticks */}
        <RadialTicks
          count={48}
          radius={1.24}
          tickLength={0.06}
          tickWidth={0.008}
          tickHeight={0.024}
          color="#e0e0ea"
          emissiveIntensity={0.3}
        />
        {/* Outer Glowing Silver Seam */}
        <mesh position={[0, 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.34, 0.008, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.4}
            metalness={0.98}
            roughness={0.05}
          />
        </mesh>
      </group>

      {/* Static Concentric Divider 1 */}
      <mesh position={[0, 0.022, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.11, 0.007, 16, 64]} />
        <meshStandardMaterial
          color="#555560"
          metalness={0.92}
          roughness={0.14}
        />
      </mesh>

      {/* ================================================================== */}
      {/* 2. RING 02: MID-OUTER ARCANE TRACK (R: ~1.08 - 0.86, Anticlockwise) */}
      {/* ================================================================== */}
      <group ref={ring2Ref} position={[0, 0.024, 0]}>
        {/* Ring Body */}
        <mesh>
          <cylinderGeometry args={[1.08, 1.08, 0.024, 64]} />
          <meshStandardMaterial
            color="#16161d"
            map={textures.middle}
            bumpMap={textures.middle}
            bumpScale={0.045}
            roughness={0.14}
            metalness={0.92}
          />
        </mesh>
        {/* 36 Physical Radial Divider Notches */}
        <RadialTicks
          count={36}
          radius={0.98}
          tickLength={0.05}
          tickWidth={0.009}
          tickHeight={0.026}
          color="#ffffff"
          emissiveIntensity={0.5}
        />
        {/* Inner Glowing Silver Channel */}
        <mesh position={[0, 0.013, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.87, 0.007, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.45}
            metalness={0.98}
            roughness={0.06}
          />
        </mesh>
      </group>

      {/* Static Concentric Divider 2 */}
      <mesh position={[0, 0.033, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.85, 0.007, 16, 64]} />
        <meshStandardMaterial
          color="#484852"
          metalness={0.94}
          roughness={0.12}
        />
      </mesh>

      {/* ================================================================== */}
      {/* 3. RING 03: MID-INNER CONDUIT TRACK (R: ~0.82 - 0.58, Clockwise) */}
      {/* ================================================================== */}
      <group ref={ring3Ref} position={[0, 0.035, 0]}>
        {/* Ring Body */}
        <mesh>
          <cylinderGeometry args={[0.82, 0.82, 0.026, 64]} />
          <meshStandardMaterial
            color="#1a1a23"
            map={textures.inner}
            bumpMap={textures.inner}
            bumpScale={0.05}
            roughness={0.12}
            metalness={0.95}
          />
        </mesh>
        {/* 48 High-Density Radial Laser Ticks */}
        <RadialTicks
          count={48}
          radius={0.70}
          tickLength={0.045}
          tickWidth={0.007}
          tickHeight={0.028}
          color="#ffffff"
          emissiveIntensity={0.6}
        />
        {/* Illuminated Neon Boundary Rim */}
        <mesh position={[0, 0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.59, 0.007, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.55}
            metalness={0.98}
            roughness={0.04}
          />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 4. RING 04: INNERMOST MECHANICAL RING (R: ~0.56 - 0.36, Anticlockwise) */}
      {/* ================================================================== */}
      <group ref={ring4Ref} position={[0, 0.045, 0]}>
        {/* Ring Body */}
        <mesh>
          <cylinderGeometry args={[0.56, 0.56, 0.028, 64]} />
          <meshStandardMaterial
            color="#1e1e28"
            roughness={0.1}
            metalness={0.96}
          />
        </mesh>
        {/* 24 Radial Micro Conduits */}
        <RadialTicks
          count={24}
          radius={0.46}
          tickLength={0.04}
          tickWidth={0.008}
          tickHeight={0.03}
          color="#ffffff"
          emissiveIntensity={0.65}
        />
      </group>

      {/* ================================================================== */}
      {/* 5. CENTER STATIC FOCUS DAIS (R: ~0.34) - DOES NOT ROTATE */}
      {/* ================================================================== */}
      <group position={[0, 0.055, 0]}>
        {/* Mirror-Polished Black Obsidian Focus Disc */}
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 0.03, 64]} />
          <meshStandardMaterial
            color="#040407"
            roughness={0.04}
            metalness={0.98}
            envMapIntensity={2.2}
          />
        </mesh>

        {/* Luminous Center Boundary Seam */}
        <mesh position={[0, 0.016, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.34, 0.008, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.7}
            metalness={0.98}
            roughness={0.04}
          />
        </mesh>

        {/* Glossy Character Contact Reflection on Mirror Disc */}
        <mesh position={[0, 0.017, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.48, 0.48]} />
          <meshBasicMaterial
            map={textures.reflection}
            transparent
            opacity={0.42}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Ambient Contact Shadow beneath character feet */}
        <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.18, 32]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.75}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ================================================================== */}
      {/* 6. INTERACTIVE EXPANDING SILVER ENERGY RIPPLE WAVE */}
      {/* ================================================================== */}
      <mesh
        ref={rippleMeshRef}
        position={[0, 0.07, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.2, 0.2, 1]}
      >
        <ringGeometry args={[0.25, 0.32, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ================================================================== */}
      {/* 7. GROUND-HUGGING MIST BILLOWING AT BASE OF PLATFORM */}
      {/* ================================================================== */}
      <group position={[0, 0.005, 0]}>
        {[0, 1, 2, 3].map((idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, (idx * Math.PI) / 4]}
            position={[0, 0.003 * idx, 0]}
          >
            <ringGeometry args={[1.25 + idx * 0.05, 1.55 + idx * 0.08, 48]} />
            <meshBasicMaterial
              color="#e2e4ee"
              transparent
              opacity={0.09 - idx * 0.018}
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
// CAMERA CONTROLLER WITH SMOOTH SCROLL PUSH-IN
// ============================================================================
function CameraController({ reduced = false }: { reduced?: boolean }) {
  const { camera } = useThree();
  const targetZ = useRef(5.4);

  useEffect(() => {
    if (reduced) return;
    const handleScroll = () => {
      const el = document.getElementById("about");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
      targetZ.current = 5.6 - progress * 0.4;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reduced]);

  useFrame((_state, delta) => {
    if (reduced) return;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, delta * 3.0);
    camera.lookAt(0, 0.25, 0);
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
  onPlatformHover,
}: {
  activeConceptIndex?: number | null;
  rippleTrigger?: number;
  reduced?: boolean;
  onPlatformHover?: () => void;
}) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className="about-platform-scene-wrapper"
      onPointerEnter={onPlatformHover}
      aria-hidden="true"
    >
      <Canvas
        camera={{
          position: [0, 1.1, isMobile ? 6.2 : 5.4],
          fov: isMobile ? 42 : 36,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="about-platform-canvas"
      >
        <CameraController reduced={reduced} />

        <ambientLight intensity={0.7} />

        {/* Core Silver Celestial Downlight focused on Dais */}
        <pointLight
          position={[0, 2.2, 0.4]}
          intensity={9.5}
          color="#f4f6fa"
          distance={6.0}
          decay={1.8}
        />

        {/* Side Architectural Rim Lights for Metallic Bevel Highlights */}
        <directionalLight position={[-4.0, 1.8, 1.8]} intensity={1.8} color="#b0b4c0" />
        <directionalLight position={[4.0, 1.8, 1.8]} intensity={1.8} color="#b0b4c0" />
        <directionalLight position={[0, -1.2, 1.5]} intensity={0.4} color="#333338" />

        {/* Concentric Layered 4-Ring 3D Rotating Floor Mechanism */}
        <RotatingFloorMechanism
          activeConceptIndex={activeConceptIndex}
          rippleTrigger={rippleTrigger}
          reduced={reduced}
        />

        {/* Floating Black-Glass Knowledge Shards */}
        <KnowledgeShards activeConceptIndex={activeConceptIndex} reduced={reduced} />
      </Canvas>
    </div>
  );
}
