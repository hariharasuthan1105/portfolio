import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// CELESTIAL ORBITAL SPHERE (Carefully Aligned with Painted Gothic Sphere)
// ============================================================================
function CelestialOrbitalCore({
  activeCardIndex,
  reduced = false,
}: {
  activeCardIndex: number | null;
  reduced?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();
    const speedBoost = activeCardIndex !== null ? 2.4 : 1.0;

    // Gentle floating resonance centered exactly on painted gothic sphere
    if (groupRef.current) {
      groupRef.current.position.y = 0.58 + Math.sin(t * 0.8) * 0.015;
    }

    // Inner orbital silver ring
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.4 * speedBoost;
      ring1Ref.current.rotation.y += delta * 0.3 * speedBoost;
    }

    // Secondary gyroscopic ring
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.45 * speedBoost;
      ring2Ref.current.rotation.z += delta * 0.25 * speedBoost;
    }

    // Outer harmonic ring
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.3 * speedBoost;
      ring3Ref.current.rotation.x -= delta * 0.2 * speedBoost;
    }

    // Core pulsing emissive modulation
    if (coreRef.current && coreRef.current.material) {
      const mat = coreRef.current.material as THREE.MeshStandardMaterial;
      const targetEmissive = activeCardIndex !== null ? 0.95 : 0.45 + Math.sin(t * 1.6) * 0.12;
      mat.emissiveIntensity = THREE.MathUtils.lerp(mat.emissiveIntensity, targetEmissive, 0.12);
    }

    // Soft energy halo
    if (haloRef.current && haloRef.current.material) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      const targetOpacity = activeCardIndex !== null ? 0.32 : 0.14 + Math.sin(t * 1.2) * 0.04;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.12);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.58, 0]}>
      {/* Radiant Inner Celestial Core */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.095, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.98}
          roughness={0.08}
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Atmospheric Energy Halo */}
      <mesh ref={haloRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Primary Orbital Silver Ring */}
      <mesh ref={ring1Ref} position={[0, 0, 0]} rotation={[0.4, 0.2, 0]}>
        <torusGeometry args={[0.26, 0.0055, 16, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.98}
          roughness={0.1}
          emissive="#ffffff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Secondary Gyroscopic Ring */}
      <mesh ref={ring2Ref} position={[0, 0, 0]} rotation={[-0.5, 0.6, 0.3]}>
        <torusGeometry args={[0.36, 0.0045, 16, 64]} />
        <meshStandardMaterial
          color="#dddddd"
          metalness={0.96}
          roughness={0.12}
          emissive="#dddddd"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Tertiary Outer Celestial Equator Ring */}
      <mesh ref={ring3Ref} position={[0, 0, 0]} rotation={[0.2, -0.4, 0.7]}>
        <torusGeometry args={[0.46, 0.0035, 16, 64]} />
        <meshStandardMaterial
          color="#999999"
          metalness={0.94}
          roughness={0.18}
          emissive="#999999"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Subtle Fine Harmonic Vertical Axis Ray */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.003, 0.003, 2.2, 16]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// WATERFALL & ARCHWAY ATMOSPHERIC PARTICLES
// ============================================================================
function AmbientPortalAtmosphere({ reduced = false }: { reduced?: boolean }) {
  if (reduced) return null;

  return (
    <group>
      {/* Central Celestial Orb Sparkles */}
      <Sparkles
        count={28}
        scale={[1.4, 1.4, 1.2]}
        position={[0, 0.58, 0]}
        size={1.4}
        speed={0.25}
        color="#ffffff"
      />

      {/* Left Distant Waterfall Mist Particles */}
      <Sparkles
        count={22}
        scale={[1.8, 2.5, 1.2]}
        position={[-3.8, 0.5, -0.8]}
        size={1.1}
        speed={0.15}
        color="#cccccc"
      />

      {/* Right Distant Waterfall Mist Particles */}
      <Sparkles
        count={22}
        scale={[1.8, 2.5, 1.2]}
        position={[3.8, 0.5, -0.8]}
        size={1.1}
        speed={0.15}
        color="#cccccc"
      />

      {/* Lower Reflective Pathway Vapor Drift */}
      <Sparkles
        count={32}
        scale={[5.5, 0.8, 2.4]}
        position={[0, -1.3, 0.6]}
        size={1.2}
        speed={0.12}
        color="#ffffff"
      />
    </group>
  );
}

// ============================================================================
// MAIN CONTACT PORTAL SCENE
// ============================================================================
export default function ContactPortalScene({
  activeCardIndex,
  reduced = false,
}: {
  activeCardIndex: number | null;
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
    <div className="contact-portal-canvas-wrapper" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="contact-portal-three-canvas"
      >
        <ambientLight intensity={0.95} />
        {/* Core Celestial Portal Point Light */}
        <pointLight position={[0, 0.58, 0.3]} intensity={12} color="#ffffff" distance={4.5} />
        <directionalLight position={[0, 4, 2]} intensity={1.8} color="#ffffff" />
        {/* Side Architectural Rim Lights */}
        <directionalLight position={[-5, 1, 1]} intensity={0.8} color="#999999" />
        <directionalLight position={[5, 1, 1]} intensity={0.8} color="#999999" />

        {/* Desktop 3D Celestial Core & Orbital Rings (Hidden on compact/tablet column view) */}
        {!isCompact && (
          <CelestialOrbitalCore activeCardIndex={activeCardIndex} reduced={reduced} />
        )}

        {/* Ambient Silver Mist & Atmosphere */}
        <AmbientPortalAtmosphere reduced={reduced} />
      </Canvas>
    </div>
  );
}
