// src/components/3d/citadel/AtmosphericEnvironment.tsx
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function AtmosphericEnvironment({
  reduced = false,
}: {
  reduced?: boolean;
}) {
  const highCloudsRef = useRef<THREE.Group>(null);
  const midCloudsRef = useRef<THREE.Group>(null);
  const mistRef = useRef<THREE.Group>(null);
  const embersRef = useRef<THREE.Points>(null);

  // Four brazier light refs for subtle realistic fire flicker
  const b1 = useRef<THREE.PointLight>(null);
  const b2 = useRef<THREE.PointLight>(null);
  const b3 = useRef<THREE.PointLight>(null);
  const b4 = useRef<THREE.PointLight>(null);

  // Sparse drifting celestial embers
  const emberGeo = useMemo(() => {
    const count = 48;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8.0;
      pos[i * 3 + 1] = 0.5 + Math.random() * 4.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10.0;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geom;
  }, []);

  useFrame((state, delta) => {
    if (reduced) return;
    const time = state.clock.getElapsedTime();

    // 1. High storm clouds differential drift
    if (highCloudsRef.current) {
      highCloudsRef.current.position.x = ((time * 0.12) % 30) - 15;
    }

    // 2. Mid-level castle cloud banks differential drift
    if (midCloudsRef.current) {
      midCloudsRef.current.position.x = -(((time * 0.18) % 24) - 12);
    }

    // 3. Ground mist subtle breathing
    if (mistRef.current) {
      mistRef.current.position.y = Math.sin(time * 0.5) * 0.08;
    }

    // 4. Fire braziers subtle organic flicker
    const flicker1 = 2.4 + Math.sin(time * 12.0) * 0.35 + Math.cos(time * 18.0) * 0.25;
    const flicker2 = 2.4 + Math.sin(time * 14.0 + 1.2) * 0.35 + Math.cos(time * 16.0) * 0.25;
    if (b1.current) b1.current.intensity = flicker1;
    if (b2.current) b2.current.intensity = flicker2;
    if (b3.current) b3.current.intensity = flicker1;
    if (b4.current) b4.current.intensity = flicker2;

    // 5. Embers rising and drifting
    if (embersRef.current) {
      const positions = embersRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 48; i++) {
        positions[i * 3 + 1] += delta * 0.45;
        if (positions[i * 3 + 1] > 5.5) {
          positions[i * 3 + 1] = 0.5;
          positions[i * 3] = (Math.random() - 0.5) * 8.0;
        }
      }
      embersRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group name="Citadel_AtmosphericEnvironment">
      {/* ======================================================== */}
      {/* 1. CINEMATIC LIGHTING SUITE (Monochrome Silver & Moon)   */}
      {/* ======================================================== */}
      {/* Ambient Fill: Deep obsidian twilight tone */}
      <ambientLight intensity={0.95} color="#354052" />

      {/* Primary Directional Keylight: Giant Full Moon Shining Down and Forward onto Bridge */}
      <directionalLight
        position={[0.0, 16.0, 4.0]}
        intensity={2.6}
        color="#dbe6f8"
        castShadow={true}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={16}
        shadow-camera-bottom={-4}
      />

      {/* Frontal Camera Fill Light: Highlights Explorer armor, cloak, and wet paving */}
      <directionalLight
        position={[0.0, 3.5, 7.0]}
        intensity={1.4}
        color="#45546d"
      />

      {/* Back celestial rim light on spires and parapets */}
      <directionalLight
        position={[0.0, 22.0, -18.0]}
        intensity={2.8}
        color="#eef4ff"
      />

      {/* Four Localized Fire Brazier Point Lights on Bridge Balustrades */}
      <pointLight ref={b1} position={[-2.25, 1.7, 0.9]} color="#ff9944" intensity={7.5} distance={7.5} decay={2} />
      <pointLight ref={b2} position={[2.25, 1.7, 0.9]} color="#ff9944" intensity={7.5} distance={7.5} decay={2} />
      <pointLight ref={b3} position={[-2.25, 1.7, 5.8]} color="#ff9944" intensity={7.5} distance={7.5} decay={2} />
      <pointLight ref={b4} position={[2.25, 1.7, 5.8]} color="#ff9944" intensity={7.5} distance={7.5} decay={2} />

      {/* ======================================================== */}
      {/* 2. ATMOSPHERIC CLOUD LAYERS (Differential Speeds)        */}
      {/* ======================================================== */}
      {/* High-Altitude Storm Clouds */}
      <group ref={highCloudsRef} position={[0, 26, -18]}>
        {[-14, 0, 14].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]}>
            <planeGeometry args={[26, 12]} />
            <meshBasicMaterial
              color="#1a1e28"
              transparent={true}
              opacity={0.35}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Mid-Level Castle Cloud Banks (Weaving behind spires) */}
      <group ref={midCloudsRef} position={[0, 15, -12]}>
        {[-12, 4, 16].map((x, i) => (
          <mesh key={i} position={[x, (i % 2) * 2.5, 0]}>
            <planeGeometry args={[18, 8]} />
            <meshBasicMaterial
              color="#222834"
              transparent={true}
              opacity={0.25}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 3. LOW-DENSITY BRIDGE DECK & CLIFF MIST                  */}
      {/* ======================================================== */}
      <group ref={mistRef} position={[0, 0.15, 0]}>
        {/* Soft mist sheet rolling along the bridge deck */}
        <mesh position={[0, 0, 1.0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.2, 11.0]} />
          <meshBasicMaterial
            color="#2a3040"
            transparent={true}
            opacity={0.16}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Abyss Mist rising on Left and Right of Bridge */}
        {[-4.5, 4.5].map((x, i) => (
          <mesh key={i} position={[x, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[4.5, 12.0]} />
            <meshBasicMaterial
              color="#1e2430"
              transparent={true}
              opacity={0.28}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* ======================================================== */}
      {/* 4. SPARSE DRIFTING EMBER PARTICLES                       */}
      {/* ======================================================== */}
      {!reduced && (
        <points ref={embersRef} geometry={emberGeo}>
          <pointsMaterial
            color="#f2ebd9"
            size={0.045}
            transparent={true}
            opacity={0.75}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}
