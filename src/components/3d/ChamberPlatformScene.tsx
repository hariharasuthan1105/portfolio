import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// PROCEDURAL TEXTURES LOADER
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
// PROCEDURAL RADIAL TICKS HELPER
// ============================================================================
function RadialTicks({
  count, radius, tickLength, tickWidth, tickHeight,
  color = "#ffffff", emissiveIntensity = 0.4,
}: {
  count: number; radius: number; tickLength: number; tickWidth: number;
  tickHeight: number; color?: string; emissiveIntensity?: number;
}) {
  const ticks = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      items.push({
        position: [Math.cos(angle) * radius, tickHeight / 2, Math.sin(angle) * radius] as [number, number, number],
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
          <meshStandardMaterial color={color} metalness={0.95} roughness={0.12}
            emissive={color} emissiveIntensity={emissiveIntensity} />
        </mesh>
      ))}
    </group>
  );
}

// ============================================================================
// CELESTIAL ARMILLARY ORBITAL SPHERE — REFERENCE ACCURATE
// Open gyroscopic gimbal rings, radiant core, and vertical light axis
// ============================================================================
function OrbitalIntelligenceSphere({ reduced = false }: { reduced?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const ring4Ref = useRef<THREE.Mesh>(null);

  // Orbital satellite nodes along ring 1
  const nodesRing1 = useMemo<[number, number, number][]>(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const a = (i / 5) * Math.PI * 2;
      return [Math.cos(a) * 0.65, Math.sin(a) * 0.1, Math.sin(a) * 0.65];
    });
  }, []);

  // Orbital satellite nodes along ring 2
  const nodesRing2 = useMemo<[number, number, number][]>(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const a = (i / 4) * Math.PI * 2 + 0.4;
      return [Math.cos(a) * 0.52, Math.sin(a) * 0.52, 0];
    });
  }, []);

  useFrame((state, delta) => {
    if (reduced || !groupRef.current) return;
    const t = state.clock.getElapsedTime();
    // Subtle rotation of entire gyroscopic system
    groupRef.current.rotation.y = t * 0.05;
    // Multi-axis counter-rotations of armillary rings
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.16;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * -0.14;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.20;
    if (ring4Ref.current) ring4Ref.current.rotation.z += delta * -0.10;
    // Floating vertical hover
    groupRef.current.position.y = 1.02 + Math.sin(t * 0.4) * 0.025;
  });

  return (
    <group ref={groupRef} position={[0, 1.02, 0]}>
      {/* 1. Vertical Shaft / Axis of Light Beam passing through core */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.0035, 0.0035, 3.4, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer ambient beam halo */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3.2, 16]} />
        <meshBasicMaterial
          color="#d8dcff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Brilliant Central Radiant Core Orb */}
      <mesh>
        <sphereGeometry args={[0.055, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={3.0}
          roughness={0.05}
          metalness={0.9}
        />
      </mesh>

      {/* Core inner glow shroud */}
      <mesh>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 3. Open Armillary Ring 1: Primary Equator Ring */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 10, 0, 0]}>
        <torusGeometry args={[0.65, 0.006, 12, 96]} />
        <meshStandardMaterial
          color="#c8cce0"
          metalness={0.98}
          roughness={0.05}
          emissive="#ffffff"
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* Satellite nodes on Ring 1 */}
      {nodesRing1.map((pos, i) => (
        <mesh key={`node1-${i}`} position={pos}>
          <sphereGeometry args={[0.02, 12, 12]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={1.2}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* 4. Open Armillary Ring 2: Tilted Orbital Ring (42 deg) */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 4.2, 0, Math.PI / 6]}>
        <torusGeometry args={[0.54, 0.005, 12, 84]} />
        <meshStandardMaterial
          color="#9094a8"
          metalness={0.96}
          roughness={0.08}
          emissive="#ffffff"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Satellite nodes on Ring 2 */}
      {nodesRing2.map((pos, i) => (
        <mesh key={`node2-${i}`} position={pos}>
          <sphereGeometry args={[0.016, 10, 10]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.9}
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* 5. Open Armillary Ring 3: Steeply Tilted Gimbal Ring (68 deg) */}
      <mesh ref={ring3Ref} rotation={[-Math.PI / 2.6, 0, -Math.PI / 8]}>
        <torusGeometry args={[0.44, 0.0045, 10, 72]} />
        <meshStandardMaterial
          color="#a0a4b8"
          metalness={0.95}
          roughness={0.1}
          emissive="#d0d4ee"
          emissiveIntensity={0.22}
        />
      </mesh>

      {/* 6. Open Armillary Ring 4: Polar Meridian Ring */}
      <mesh ref={ring4Ref} rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[0.62, 0.005, 10, 80]} />
        <meshStandardMaterial
          color="#787c90"
          metalness={0.94}
          roughness={0.12}
          emissive="#8888aa"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* 7. Inner Fine Astrolabe Coordinates Coordinate Cage */}
      {[0, 1].map((idx) => (
        <mesh key={`coord-${idx}`} rotation={[idx * (Math.PI / 2), 0, (idx * Math.PI) / 4]}>
          <torusGeometry args={[0.26, 0.0025, 8, 48]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.05}
          />
        </mesh>
      ))}

      {/* Soft celestial core point light casting illumination onto cathedral & explorer */}
      <pointLight intensity={2.4} color="#f0f4ff" distance={3.5} decay={2.0} />
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
  speed: number; amp: number; phase: number;
}

function KnowledgeShards({ activeConceptIndex, reduced = false }: {
  activeConceptIndex: number | null; reduced?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shards = useMemo<ShardData[]>(() => [
    { pos: [-0.75, 0.48, -0.4], rot: [0.4, 0.2, 0.1], scale: [0.045, 0.11, 0.04], speed: 0.7, amp: 0.04, phase: 0.0 },
    { pos: [0.72, 0.58, -0.35], rot: [-0.3, 0.5, 0.2], scale: [0.05, 0.12, 0.045], speed: 0.6, amp: 0.045, phase: 1.2 },
    { pos: [-0.42, 0.76, -0.5], rot: [0.2, -0.4, 0.3], scale: [0.04, 0.09, 0.035], speed: 0.8, amp: 0.035, phase: 2.4 },
    { pos: [0.45, 0.38, -0.25], rot: [-0.2, 0.3, -0.1], scale: [0.042, 0.1, 0.038], speed: 0.75, amp: 0.04, phase: 3.6 },
    { pos: [-0.62, 0.22, -0.2], rot: [0.5, 0.1, -0.4], scale: [0.035, 0.085, 0.03], speed: 0.9, amp: 0.03, phase: 4.8 },
    { pos: [0.78, 0.82, -0.45], rot: [-0.4, -0.2, 0.5], scale: [0.048, 0.115, 0.042], speed: 0.65, amp: 0.04, phase: 5.5 },
    { pos: [0.0, 0.98, -0.6], rot: [0.1, 0.6, -0.2], scale: [0.055, 0.135, 0.05], speed: 0.55, amp: 0.05, phase: 0.8 },
  ], []);

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
// ROTATING FLOOR MECHANISM (4 CONCENTRIC RINGS)
// ============================================================================
function RotatingFloorMechanism({
  activeConceptIndex, rippleTrigger = 0, reduced = false,
}: {
  activeConceptIndex: number | null; rippleTrigger?: number; reduced?: boolean;
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
    if (ring1Ref.current) ring1Ref.current.rotation.y += delta * 0.016;
    if (ring2Ref.current) ring2Ref.current.rotation.y -= delta * 0.025;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.035;
    if (ring4Ref.current) ring4Ref.current.rotation.y -= delta * 0.046;

    if (rippleMeshRef.current && rippleOpacity.current > 0.01) {
      rippleScale.current += delta * 2.2;
      rippleOpacity.current = THREE.MathUtils.lerp(rippleOpacity.current, 0, delta * 2.2);
      rippleMeshRef.current.scale.set(rippleScale.current, rippleScale.current, 1);
      const mat = rippleMeshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = rippleOpacity.current;
    }
  });

  return (
    <group position={[0, -0.68, 0]}>
      {/* Sub-floor shadow disc */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.55, 64]} />
        <meshBasicMaterial color="#020204" depthWrite={true} />
      </mesh>

      {/* Base Foundation Plinth */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[1.38, 1.44, 0.06, 64]} />
        <meshStandardMaterial color="#060609" roughness={0.2} metalness={0.88} />
      </mesh>

      {/* Outer Polished Rim */}
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.38, 0.014, 16, 64]} />
        <meshStandardMaterial color="#80808a" metalness={0.96} roughness={0.1}
          emissive="#ffffff" emissiveIntensity={0.15} />
      </mesh>

      {/* Ring 01: Outermost (Clockwise) */}
      <group ref={ring1Ref} position={[0, 0.012, 0]}>
        <mesh>
          <cylinderGeometry args={[1.34, 1.34, 0.022, 64]} />
          <meshStandardMaterial color="#121217" map={textures.outer} bumpMap={textures.outer}
            bumpScale={0.04} roughness={0.16} metalness={0.9} />
        </mesh>
        <RadialTicks count={48} radius={1.24} tickLength={0.06} tickWidth={0.008}
          tickHeight={0.024} color="#e0e0ea" emissiveIntensity={0.3} />
        <mesh position={[0, 0.012, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.34, 0.008, 16, 64]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4}
            metalness={0.98} roughness={0.05} />
        </mesh>
      </group>

      {/* Divider 1 */}
      <mesh position={[0, 0.022, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.11, 0.007, 16, 64]} />
        <meshStandardMaterial color="#555560" metalness={0.92} roughness={0.14} />
      </mesh>

      {/* Ring 02: Mid-Outer (Anticlockwise) */}
      <group ref={ring2Ref} position={[0, 0.024, 0]}>
        <mesh>
          <cylinderGeometry args={[1.08, 1.08, 0.024, 64]} />
          <meshStandardMaterial color="#16161d" map={textures.middle} bumpMap={textures.middle}
            bumpScale={0.035} roughness={0.2} metalness={0.88} />
        </mesh>
        <RadialTicks count={36} radius={0.97} tickLength={0.05} tickWidth={0.008}
          tickHeight={0.026} color="#d0d0de" emissiveIntensity={0.25} />
        <mesh position={[0, 0.013, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.08, 0.007, 16, 64]} />
          <meshStandardMaterial color="#aaaacc" emissive="#ffffff" emissiveIntensity={0.22}
            metalness={0.96} roughness={0.08} />
        </mesh>
      </group>

      {/* Divider 2 */}
      <mesh position={[0, 0.034, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.84, 0.007, 16, 64]} />
        <meshStandardMaterial color="#555560" metalness={0.92} roughness={0.14} />
      </mesh>

      {/* Ring 03: Mid-Inner (Clockwise) */}
      <group ref={ring3Ref} position={[0, 0.036, 0]}>
        <mesh>
          <cylinderGeometry args={[0.82, 0.82, 0.026, 64]} />
          <meshStandardMaterial color="#1a1a22" map={textures.inner} bumpMap={textures.inner}
            bumpScale={0.03} roughness={0.18} metalness={0.92} />
        </mesh>
        <RadialTicks count={24} radius={0.72} tickLength={0.045} tickWidth={0.009}
          tickHeight={0.028} color="#ccccda" emissiveIntensity={0.28} />
        <mesh position={[0, 0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.82, 0.007, 16, 64]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.35}
            metalness={0.98} roughness={0.06} />
        </mesh>
        <mesh position={[0, 0.014, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.59, 0.007, 16, 64]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.55}
            metalness={0.98} roughness={0.04} />
        </mesh>
      </group>

      {/* Ring 04: Innermost (Anticlockwise) */}
      <group ref={ring4Ref} position={[0, 0.045, 0]}>
        <mesh>
          <cylinderGeometry args={[0.56, 0.56, 0.028, 64]} />
          <meshStandardMaterial color="#1e1e28" roughness={0.1} metalness={0.96} />
        </mesh>
        <RadialTicks count={24} radius={0.46} tickLength={0.04} tickWidth={0.008}
          tickHeight={0.03} color="#ffffff" emissiveIntensity={0.65} />
      </group>

      {/* Center Static Focus Dais */}
      <group position={[0, 0.055, 0]}>
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 0.03, 64]} />
          <meshStandardMaterial color="#040407" roughness={0.04} metalness={0.98} envMapIntensity={2.2} />
        </mesh>
        <mesh position={[0, 0.016, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.34, 0.008, 16, 64]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.7}
            metalness={0.98} roughness={0.04} />
        </mesh>
        <mesh position={[0, 0.017, 0.04]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.48, 0.48]} />
          <meshBasicMaterial map={textures.reflection} transparent opacity={0.42}
            blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.016, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.18, 32]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.75} depthWrite={false} />
        </mesh>
      </group>

      {/* Interactive Silver Energy Ripple */}
      <mesh ref={rippleMeshRef} position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.2, 0.2, 1]}>
        <ringGeometry args={[0.25, 0.32, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} side={THREE.DoubleSide}
          depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Ground Mist */}
      <group position={[0, 0.005, 0]}>
        {[0, 1, 2, 3].map((idx) => (
          <mesh key={idx} rotation={[-Math.PI / 2, 0, (idx * Math.PI) / 4]} position={[0, 0.003 * idx, 0]}>
            <ringGeometry args={[1.25 + idx * 0.05, 1.55 + idx * 0.08, 48]} />
            <meshBasicMaterial color="#e2e4ee" transparent opacity={0.09 - idx * 0.018}
              side={THREE.DoubleSide} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ============================================================================
// CAMERA CONTROLLER
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
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="about-platform-canvas"
      >
        <CameraController reduced={reduced} />

        <ambientLight intensity={0.7} />
        <pointLight position={[0, 2.2, 0.4]} intensity={9.5} color="#f4f6fa" distance={6.0} decay={1.8} />
        <directionalLight position={[-4.0, 1.8, 1.8]} intensity={1.8} color="#b0b4c0" />
        <directionalLight position={[4.0, 1.8, 1.8]} intensity={1.8} color="#b0b4c0" />
        <directionalLight position={[0, -1.2, 1.5]} intensity={0.4} color="#333338" />
        {/* Upward sphere key light */}
        <pointLight position={[0, 2.5, -0.5]} intensity={4.0} color="#c8ccde" distance={5.0} decay={2.0} />

        <RotatingFloorMechanism
          activeConceptIndex={activeConceptIndex}
          rippleTrigger={rippleTrigger}
          reduced={reduced}
        />
        <OrbitalIntelligenceSphere reduced={reduced} />
        <KnowledgeShards activeConceptIndex={activeConceptIndex} reduced={reduced} />
      </Canvas>
    </div>
  );
}
