import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function SilverEmbers({
  reduced = false,
  low = false,
}: {
  reduced?: boolean;
  low?: boolean;
}) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = low ? 60 : 180;

  // Particle glow texture
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
    gradient.addColorStop(0.25, "rgba(230, 240, 255, 0.8)");
    gradient.addColorStop(0.6, "rgba(180, 205, 240, 0.2)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Initial particle data
  const [positions, speeds, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const phs = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 18.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 11.0;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8.0 - 1.5;

      spd[i] = 0.15 + Math.random() * 0.35;
      phs[i] = Math.random() * Math.PI * 2;
    }
    return [pos, spd, phs];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current || reduced) return;
    const d = delta;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    const time = state.clock.getElapsedTime();
    const ptrX = state.pointer.x * 7.0;
    const ptrY = state.pointer.y * 4.5;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      // Gentle upward drift
      posArray[idx + 1] += speeds[i] * d;

      // Sinusoidal wind sway
      posArray[idx + 0] += Math.sin(time * 0.8 + phases[i]) * 0.008;

      // Pointer repulsion
      const dx = posArray[idx + 0] - ptrX;
      const dy = posArray[idx + 1] - ptrY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 2.5) {
        const force = (2.5 - dist) * 0.015;
        posArray[idx + 0] += (dx / dist) * force;
        posArray[idx + 1] += (dy / dist) * force;
      }

      // Wrap around top/bottom
      if (posArray[idx + 1] > 6.0) {
        posArray[idx + 1] = -5.5;
        posArray[idx + 0] = (Math.random() - 0.5) * 18.0;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        map={texture}
        transparent={true}
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        color="#e4ecfc"
      />
    </points>
  );
}
