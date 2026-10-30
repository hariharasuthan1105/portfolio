import Smoke from "./Smoke";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
function Rings({
  sphere = false,
  still = false,
}: {
  sphere?: boolean;
  still?: boolean;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (ref.current && !still) {
      ref.current.rotation.y += delta * 0.07;
      ref.current.rotation.z += delta * 0.025;
    }
  });
  return (
    <group ref={ref} rotation={[0.6, 0, 0.2]}>
      {[1, 1.22, 1.45].map((r, i) => (
        <mesh key={r} rotation={[i * 0.72, i * 0.4, 0]}>
          <torusGeometry args={[r, 0.006, 8, 160]} />
          <meshBasicMaterial
            color="#c5c5c5"
            transparent
            opacity={sphere ? 0.65 : 0.25}
          />
        </mesh>
      ))}
      {sphere && (
        <>
          <mesh>
            <icosahedronGeometry args={[0.9, 3]} />
            <meshBasicMaterial
              color="#aaaaaa"
              wireframe
              transparent
              opacity={0.25}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.78, 32, 32]} />
            <meshStandardMaterial
              color="#111111"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
export default function Atmosphere({
  sphere = false,
  reduced = false,
}: {
  sphere?: boolean;
  reduced?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reduced ? "demand" : "always"}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={<div className="sphere-fallback" />}
    >
      {!sphere && !reduced && <Smoke />}
      <ambientLight intensity={2} />
      <pointLight position={[2, 3, 4]} intensity={25} />
      <Rings sphere={sphere} still={reduced} />
      {!reduced && (
        <Sparkles
          count={sphere ? 60 : 100}
          size={1.4}
          scale={8}
          speed={0.15}
          color="white"
        />
      )}
      {sphere && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={!reduced}
          autoRotateSpeed={0.3}
        />
      )}
    </Canvas>
  );
}
