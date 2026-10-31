import { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// PROCEDURAL / LOADED RING TEXTURES HELPER
// ============================================================================
function usePlatformTextures() {
  return useMemo(() => {
    const loader = new THREE.TextureLoader();
    const outer = loader.load("/assets/ring_outer_texture.png");
    const middle = loader.load("/assets/ring_middle_texture.png");
    const inner = loader.load("/assets/ring_inner_texture.png");
    const character = loader.load("/assets/chamber_character.png");
    const reflection = loader.load("/assets/character_floor_reflection.png");

    [outer, middle, inner, character, reflection].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.generateMipmaps = true;
      t.minFilter = THREE.LinearMipmapLinearFilter;
      t.magFilter = THREE.LinearFilter;
    });

    return { outer, middle, inner, character, reflection };
  }, []);
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
      { pos: [-0.68, 0.48, -0.35], rot: [0.4, 0.2, 0.1], scale: [0.045, 0.11, 0.04], speed: 0.7, amp: 0.04, phase: 0.0 },
      { pos: [0.65, 0.58, -0.3], rot: [-0.3, 0.5, 0.2], scale: [0.05, 0.12, 0.045], speed: 0.6, amp: 0.045, phase: 1.2 },
      { pos: [-0.38, 0.76, -0.45], rot: [0.2, -0.4, 0.3], scale: [0.04, 0.09, 0.035], speed: 0.8, amp: 0.035, phase: 2.4 },
      { pos: [0.42, 0.38, -0.22], rot: [-0.2, 0.3, -0.1], scale: [0.042, 0.1, 0.038], speed: 0.75, amp: 0.04, phase: 3.6 },
      { pos: [-0.58, 0.22, -0.18], rot: [0.5, 0.1, -0.4], scale: [0.035, 0.085, 0.03], speed: 0.9, amp: 0.03, phase: 4.8 },
      { pos: [0.72, 0.82, -0.4], rot: [-0.4, -0.2, 0.5], scale: [0.048, 0.115, 0.042], speed: 0.65, amp: 0.04, phase: 5.5 },
      { pos: [0.0, 0.96, -0.55], rot: [0.1, 0.6, -0.2], scale: [0.055, 0.135, 0.05], speed: 0.55, amp: 0.05, phase: 0.8 },
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
            color="#09090c"
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
// CONCENTRIC 3D ROTATING FLOOR MECHANISM (Ground-Calibrated to Dais)
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

  const outerRingRef = useRef<THREE.Group>(null);
  const middleRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const rippleMeshRef = useRef<THREE.Mesh>(null);
  const rippleScale = useRef(0.2);
  const rippleOpacity = useRef(0.0);

  useEffect(() => {
    rippleScale.current = 0.25;
    rippleOpacity.current = 0.9;
  }, [rippleTrigger, activeConceptIndex]);

  useFrame((state, delta) => {
    if (reduced) return;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.y += delta * 0.024;
    }
    if (middleRingRef.current) {
      middleRingRef.current.rotation.y -= delta * 0.038;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y += delta * 0.052;
    }

    if (rippleMeshRef.current) {
      if (rippleOpacity.current > 0.01) {
        rippleScale.current += delta * 1.8;
        rippleOpacity.current = THREE.MathUtils.lerp(rippleOpacity.current, 0, delta * 2.0);
        rippleMeshRef.current.scale.set(rippleScale.current, rippleScale.current, 1);
        const mat = rippleMeshRef.current.material as THREE.MeshBasicMaterial;
        mat.opacity = rippleOpacity.current;
      }
    }
  });

  return (
    <group position={[0, -0.70, 0]}>
      {/* 0. BASE STEPPED OBSIDIAN DAIS PLATFORM */}
      <mesh position={[0, -0.025, 0]}>
        <cylinderGeometry args={[1.02, 1.05, 0.035, 64]} />
        <meshStandardMaterial
          color="#060608"
          roughness={0.22}
          metalness={0.85}
        />
      </mesh>

      {/* Outer Metallic Bevel Rim */}
      <mesh position={[0, -0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.02, 0.012, 16, 64]} />
        <meshStandardMaterial
          color="#777780"
          metalness={0.95}
          roughness={0.12}
        />
      </mesh>

      {/* 1. OUTER MECHANISM RING (Radius ~0.96, Clockwise) */}
      <group ref={outerRingRef} position={[0, -0.003, 0]}>
        <mesh>
          <cylinderGeometry args={[0.96, 0.96, 0.02, 64]} />
          <meshStandardMaterial
            color="#141418"
            map={textures.outer}
            bumpMap={textures.outer}
            bumpScale={0.035}
            roughness={0.18}
            metalness={0.88}
          />
        </mesh>
        <mesh position={[0, 0.011, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.96, 0.008, 16, 64]} />
          <meshStandardMaterial color="#9a9aa2" metalness={0.92} roughness={0.1} />
        </mesh>
      </group>

      {/* 2. MIDDLE ARCANE GEAR RING (Radius ~0.74, Anticlockwise) */}
      <group ref={middleRingRef} position={[0, 0.008, 0]}>
        <mesh>
          <cylinderGeometry args={[0.74, 0.74, 0.022, 64]} />
          <meshStandardMaterial
            color="#181820"
            map={textures.middle}
            bumpMap={textures.middle}
            bumpScale={0.04}
            roughness={0.15}
            metalness={0.92}
          />
        </mesh>
        <mesh position={[0, 0.013, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.74, 0.009, 16, 64]} />
          <meshStandardMaterial color="#b2b4bc" metalness={0.95} roughness={0.08} />
        </mesh>
      </group>

      {/* 3. INNER AI CONDUIT RING (Radius ~0.50, Clockwise) */}
      <group ref={innerRingRef} position={[0, 0.02, 0]}>
        <mesh>
          <cylinderGeometry args={[0.50, 0.50, 0.025, 64]} />
          <meshStandardMaterial
            color="#1d1d24"
            map={textures.inner}
            bumpMap={textures.inner}
            bumpScale={0.045}
            roughness={0.12}
            metalness={0.95}
          />
        </mesh>
        <mesh position={[0, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.50, 0.01, 16, 64]} />
          <meshStandardMaterial color="#d4d6de" metalness={0.98} roughness={0.06} />
        </mesh>
      </group>

      {/* 4. CENTRAL FOCUS PEDESTAL / POLISHED MIRROR DISC (Radius ~0.28) */}
      <group position={[0, 0.034, 0]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.028, 64]} />
          <meshStandardMaterial
            color="#040406"
            roughness={0.06}
            metalness={0.98}
            envMapIntensity={2.0}
          />
        </mesh>
        {/* Central Luminous Silver Boundary */}
        <mesh position={[0, 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.28, 0.008, 16, 64]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.25}
            metalness={0.98}
            roughness={0.05}
          />
        </mesh>

        {/* Glossy Character Contact Reflection on Mirror Disc */}
        <mesh position={[0, 0.016, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.48, 0.48]} />
          <meshBasicMaterial
            map={textures.reflection}
            transparent
            opacity={0.38}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Ambient Contact Shadow directly below character feet */}
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.16, 32]} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 5. INTERACTIVE EXPANDING SILVER RIPPLE WAVE */}
      <mesh
        ref={rippleMeshRef}
        position={[0, 0.045, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.2, 0.2, 1]}
      >
        <ringGeometry args={[0.3, 0.35, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 6. SOFT VOLUMETRIC MIST RING AT PLATFORM BASE */}
      <group position={[0, 0.01, 0]}>
        {[0, 1, 2].map((idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, (idx * Math.PI) / 3]}
            position={[0, 0.005 * idx, 0]}
          >
            <ringGeometry args={[0.92 + idx * 0.04, 1.12 + idx * 0.05, 48]} />
            <meshBasicMaterial
              color="#e6e8f0"
              transparent
              opacity={0.08 - idx * 0.02}
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
// CAMERA CONTROLLER WITH SMOOTH SCROLL PUSH-IN & PARALLAX
// ============================================================================
function CameraController({ reduced = false }: { reduced?: boolean }) {
  const { camera } = useThree();
  const targetZ = useRef(5.5);

  useEffect(() => {
    if (reduced) return;
    const handleScroll = () => {
      const el = document.getElementById("about");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(Math.max((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0), 1);
      targetZ.current = 5.8 - progress * 0.5;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [reduced]);

  useFrame((_state, delta) => {
    if (reduced) return;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, delta * 3.0);
    camera.lookAt(0, 0.5, 0);
  });

  return null;
}

// ============================================================================
// MAIN CHAMBER PLATFORM SCENE COMPONENT
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
          position: [0, 1.0, isMobile ? 6.8 : 5.5],
          fov: isMobile ? 40 : 36,
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

        <ambientLight intensity={0.65} />

        {/* Core Silver Celestial Downlight focused on Dais */}
        <pointLight
          position={[0, 1.5, 0.5]}
          intensity={8.5}
          color="#f4f6fa"
          distance={5.5}
          decay={1.8}
        />

        {/* Side Architectural Rim Lights for Metallic Bevel Highlights */}
        <directionalLight position={[-3.5, 1.2, 1.5]} intensity={1.5} color="#a8acb6" />
        <directionalLight position={[3.5, 1.2, 1.5]} intensity={1.5} color="#a8acb6" />
        <directionalLight position={[0, -1.5, 1.5]} intensity={0.4} color="#333338" />

        {/* Concentric Layered 3D Rotating Floor Mechanism */}
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
