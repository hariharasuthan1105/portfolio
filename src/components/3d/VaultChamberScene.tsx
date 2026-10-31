import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// 3D VAULT ASTRAL CORE & ORBITAL MECHANISMS
// Aligned with the monumental gothic intelligence sphere in the background
// ============================================================================
function IntelligenceAstralCore({
  keys,
  unlocked,
  reduced = false,
}: {
  keys: boolean[];
  unlocked: boolean;
  reduced?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);

  // Three Key Nodes orbiting the sphere
  const key1Ref = useRef<THREE.Mesh>(null);
  const key2Ref = useRef<THREE.Mesh>(null);
  const key3Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();
    const unlockedBoost = unlocked ? 2.5 : 1.0;

    // Gentle vertical breathing aligned with background center dais
    if (groupRef.current) {
      groupRef.current.position.y = 0.44 + Math.sin(t * 0.7) * 0.015;
    }

    // Concentric orbital rings rotation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.35 * unlockedBoost;
      ring1Ref.current.rotation.y += delta * 0.25 * unlockedBoost;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.4 * unlockedBoost;
      ring2Ref.current.rotation.z += delta * 0.2 * unlockedBoost;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.3 * unlockedBoost;
      ring3Ref.current.rotation.x -= delta * 0.15 * unlockedBoost;
    }

    // Core pulsing emissive modulation
    if (coreRef.current && coreRef.current.material) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      const targetEmissive = unlocked ? 1.6 : 0.45 + (keys.filter(Boolean).length * 0.2) + Math.sin(t * 1.5) * 0.1;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.1);

      // Controlled expansion on final unlock
      const targetScale = unlocked ? 1.25 : 1.0;
      coreRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
    }

    // Energy halo opacity
    if (haloRef.current && haloRef.current.material) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      const targetHaloOpacity = unlocked ? 0.45 : 0.15 + (keys.filter(Boolean).length * 0.08);
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetHaloOpacity, 0.1);
    }

    // Key 1 (Perception): Orbit radius & illumination
    if (key1Ref.current) {
      const angle1 = t * 0.8;
      const radius1 = unlocked ? 0.32 : 0.65;
      key1Ref.current.position.x = Math.cos(angle1) * radius1;
      key1Ref.current.position.z = Math.sin(angle1) * radius1;
      key1Ref.current.position.y = Math.sin(angle1 * 2) * 0.12;

      const mat1 = key1Ref.current.material as THREE.MeshStandardMaterial;
      const targetK1 = keys[0] ? 1.2 : 0.2;
      mat1.emissiveIntensity = THREE.MathUtils.lerp(mat1.emissiveIntensity, targetK1, 0.12);
    }

    // Key 2 (Reasoning): Orbit radius & illumination
    if (key2Ref.current) {
      const angle2 = t * 0.8 + (Math.PI * 2) / 3;
      const radius2 = unlocked ? 0.32 : 0.75;
      key2Ref.current.position.x = Math.cos(angle2) * radius2;
      key2Ref.current.position.z = Math.sin(angle2) * radius2;
      key2Ref.current.position.y = Math.cos(angle2 * 2) * 0.14;

      const mat2 = key2Ref.current.material as THREE.MeshStandardMaterial;
      const targetK2 = keys[1] ? 1.2 : 0.2;
      mat2.emissiveIntensity = THREE.MathUtils.lerp(mat2.emissiveIntensity, targetK2, 0.12);
    }

    // Key 3 (Connection): Orbit radius & illumination
    if (key3Ref.current) {
      const angle3 = t * 0.8 + (Math.PI * 4) / 3;
      const radius3 = unlocked ? 0.32 : 0.85;
      key3Ref.current.position.x = Math.cos(angle3) * radius3;
      key3Ref.current.position.z = Math.sin(angle3) * radius3;
      key3Ref.current.position.y = Math.sin(angle3 * 1.5) * 0.16;

      const mat3 = key3Ref.current.material as THREE.MeshStandardMaterial;
      const targetK3 = keys[2] ? 1.2 : 0.2;
      mat3.emissiveIntensity = THREE.MathUtils.lerp(mat3.emissiveIntensity, targetK3, 0.12);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.44, 0]}>
      {/* Central Radiating Intelligence Sphere */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.13, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.98}
          roughness={0.08}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Atmospheric Energy Glow Halo */}
      <mesh ref={haloRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Inner Metallic Orbital Ring */}
      <mesh ref={ring1Ref} position={[0, 0, 0]} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[0.38, 0.007, 16, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.98}
          roughness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Mid Gyroscopic Orbital Ring */}
      <mesh ref={ring2Ref} position={[0, 0, 0]} rotation={[-0.5, 0.6, 0.3]}>
        <torusGeometry args={[0.52, 0.006, 16, 64]} />
        <meshStandardMaterial
          color="#e0e0e0"
          metalness={0.96}
          roughness={0.12}
          emissive="#e0e0e0"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer Harmonic Ring */}
      <mesh ref={ring3Ref} position={[0, 0, 0]} rotation={[0.2, -0.4, 0.7]}>
        <torusGeometry args={[0.68, 0.005, 16, 64]} />
        <meshStandardMaterial
          color="#aaaaaa"
          metalness={0.94}
          roughness={0.16}
          emissive="#aaaaaa"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Vertical Light Axis Beam */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 3.4, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Orbiting Key 1: Perception */}
      <mesh ref={key1Ref} position={[0.65, 0, 0]}>
        <octahedronGeometry args={[0.038, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.95}
          roughness={0.1}
          emissive="#ffffff"
          emissiveIntensity={keys[0] ? 1.2 : 0.2}
        />
      </mesh>

      {/* Orbiting Key 2: Reasoning */}
      <mesh ref={key2Ref} position={[-0.35, 0, 0.6]}>
        <octahedronGeometry args={[0.038, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.95}
          roughness={0.1}
          emissive="#ffffff"
          emissiveIntensity={keys[1] ? 1.2 : 0.2}
        />
      </mesh>

      {/* Orbiting Key 3: Connection */}
      <mesh ref={key3Ref} position={[-0.35, 0, -0.6]}>
        <octahedronGeometry args={[0.038, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.95}
          roughness={0.1}
          emissive="#ffffff"
          emissiveIntensity={keys[2] ? 1.2 : 0.2}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// CATHEDRAL PARTICLES & ATMOSPHERIC VAPOR
// ============================================================================
function CathedralAtmosphere({ reduced = false }: { reduced?: boolean }) {
  if (reduced) return null;

  return (
    <group>
      {/* Central Celestial Orb Sparkles */}
      <Sparkles
        count={35}
        scale={[2.0, 2.0, 1.8]}
        position={[0, 0.44, 0]}
        size={1.5}
        speed={0.3}
        color="#ffffff"
      />

      {/* Guardian Statue Ambient Motes (Left & Right) */}
      <Sparkles
        count={25}
        scale={[2.2, 3.0, 1.5]}
        position={[-3.5, 0.8, -0.5]}
        size={1.2}
        speed={0.18}
        color="#cccccc"
      />
      <Sparkles
        count={25}
        scale={[2.2, 3.0, 1.5]}
        position={[3.5, 0.8, -0.5]}
        size={1.2}
        speed={0.18}
        color="#cccccc"
      />

      {/* Black Marble Floor Vapor Drift */}
      <Sparkles
        count={40}
        scale={[7.0, 0.8, 3.0]}
        position={[0, -1.2, 0.8]}
        size={1.2}
        speed={0.14}
        color="#ffffff"
      />
    </group>
  );
}

// ============================================================================
// MAIN VAULT CHAMBER SCENE
// ============================================================================
export default function VaultChamberScene({
  keys,
  unlocked,
  reduced = false,
}: {
  keys: boolean[];
  unlocked: boolean;
  reduced?: boolean;
}) {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCompact = viewportWidth <= 960;

  return (
    <div className="vault-chamber-canvas-wrapper" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="vault-chamber-three-canvas"
      >
        <ambientLight intensity={0.9} />
        {/* Core Intelligence Sphere Point Light */}
        <pointLight position={[0, 0.44, 0.3]} intensity={unlocked ? 22 : 12} color="#ffffff" distance={5} />
        <directionalLight position={[0, 4, 2]} intensity={1.8} color="#ffffff" />
        {/* Guardian Statues Side Rims */}
        <directionalLight position={[-5, 1, 1]} intensity={0.9} color="#aaaaaa" />
        <directionalLight position={[5, 1, 1]} intensity={0.9} color="#aaaaaa" />

        {/* Real-Time Interactive Astral Core & Orbital Keys */}
        {!isCompact && (
          <IntelligenceAstralCore keys={keys} unlocked={unlocked} reduced={reduced} />
        )}

        {/* Floating Silver Cathedral Atmosphere */}
        <CathedralAtmosphere reduced={reduced} />
      </Canvas>
    </div>
  );
}
