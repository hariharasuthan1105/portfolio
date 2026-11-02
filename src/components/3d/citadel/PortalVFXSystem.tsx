// src/components/3d/citadel/PortalVFXSystem.tsx
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PortalAnimationState } from "../portalTransition/PortalTransitionManager";

const vortexVertex = `
varying vec2 vUv;
varying vec3 vWorldPosition;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const vortexFragment = `
uniform float uTime;
uniform float uIntensity;
uniform float uHover;
uniform float uFlare;
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  vec2 c = vUv - 0.5;
  float r = length(c) * 2.0;
  if (r > 1.0) discard;
  
  float theta = atan(c.y, c.x);
  
  // Swirling spiral vortex arms
  float speed = uTime * (1.4 + uHover * 2.4 + uFlare * 5.0);
  float spiral = theta * 3.0 + r * 14.0 - speed;
  
  float n1 = noise(vec2(spiral, r * 8.0 - uTime * 1.0));
  float n2 = noise(vec2(spiral * 2.0, r * 14.0 + uTime * 1.5));
  float combined = n1 * 0.65 + n2 * 0.35;
  
  // Soft edge falloff into circular stone arch
  float edge = smoothstep(1.0, 0.45, r);
  
  // Brilliant glowing silver-white central star
  float core = smoothstep(0.35, 0.0, r) * (3.2 + uFlare * 4.5);
  
  // Outer shimmering silver corona rings
  float ring1 = smoothstep(0.96, 0.85, r) * smoothstep(0.74, 0.88, r) * 3.2;
  float ring2 = smoothstep(0.68, 0.56, r) * smoothstep(0.44, 0.58, r) * 2.4;
  
  // Energy pulses orbiting along arch rim
  float pulseAngle = mod(theta + uTime * 3.0, 6.28318);
  float pulseBeam = smoothstep(0.6, 0.0, abs(pulseAngle - 3.14159)) * smoothstep(0.75, 0.98, r) * 2.5;
  
  float totalLum = (combined * 1.1 + core + ring1 + ring2 + pulseBeam) * edge * (uIntensity + uHover * 1.2 + uFlare * 3.5);
  
  // Monochrome silver celestial gradient (intense white core to ether silver rim)
  vec3 coreColor = vec3(1.0, 1.0, 1.0);
  vec3 silverColor = vec3(0.90, 0.95, 1.0);
  vec3 etherColor = vec3(0.72, 0.82, 0.96);
  
  vec3 col = mix(etherColor, silverColor, smoothstep(0.2, 0.8, totalLum));
  col = mix(col, coreColor, core * 0.6);
  
  float alpha = edge * (0.65 + uHover * 0.35 + uFlare * 0.35);
  
  gl_FragColor = vec4(col * totalLum * 1.4, alpha);
}
`;

export function PortalVFXSystem({
  reduced = false,
  portalState = "IDLE",
  portalFlare = 0,
  hovered,
  setHovered,
  onEnter,
}: {
  reduced?: boolean;
  portalState?: PortalAnimationState;
  portalFlare?: number;
  hovered: boolean;
  setHovered: (h: boolean) => void;
  onEnter?: () => void;
}) {
  const vortexMatRef = useRef<THREE.ShaderMaterial>(null);
  const portalLightRef = useRef<THREE.PointLight>(null);
  const sparksRef = useRef<THREE.Points>(null);

  // Exact center coordinate of the circular portal gate
  const portalCenter: [number, number, number] = [0.0, 3.7, -6.78];

  const vortexUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1.6 },
      uHover: { value: 0 },
      uFlare: { value: 0 },
    }),
    []
  );

  // Emissive drifting energy sparks around the portal
  const sparkGeo = useMemo(() => {
    const count = 96;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2;
      const radius = 1.3 + Math.random() * 0.8;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geom;
  }, []);

  useFrame((_, delta) => {
    const d = reduced ? 0 : delta;

    if (vortexMatRef.current) {
      vortexMatRef.current.uniforms.uTime.value += d;
      const targetHover = hovered ? 1.0 : 0.0;
      vortexMatRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        vortexMatRef.current.uniforms.uHover.value,
        targetHover,
        0.1
      );
      vortexMatRef.current.uniforms.uFlare.value = THREE.MathUtils.lerp(
        vortexMatRef.current.uniforms.uFlare.value,
        portalFlare,
        0.15
      );
    }

    if (portalLightRef.current) {
      const pulse = 0.92 + 0.08 * Math.sin(Date.now() * 0.0035);
      const isActivating = portalState === "ACTIVATING" || portalState === "ENTERING";
      const targetIntensity = (hovered ? 55 : 34) * pulse + portalFlare * 90 + (isActivating ? 60 : 0);
      portalLightRef.current.intensity = THREE.MathUtils.lerp(
        portalLightRef.current.intensity,
        targetIntensity,
        0.15
      );
    }

    if (sparksRef.current && !reduced) {
      sparksRef.current.rotation.z += d * (0.45 + portalFlare * 1.8);
    }
  });

  return (
    <group position={portalCenter}>
      {/* 3D Dynamic Point Light illuminating the stairs, statues, and wet stone bridge deck */}
      <pointLight
        ref={portalLightRef}
        color="#e4f0ff"
        intensity={36}
        distance={24}
        decay={1.8}
        castShadow={true}
      />

      {/* Swirling Luminous Cosmic Vortex Disc */}
      <mesh position={[0, 0, 0.04]}>
        <circleGeometry args={[1.56, 64]} />
        <shaderMaterial
          ref={vortexMatRef}
          vertexShader={vortexVertex}
          fragmentShader={vortexFragment}
          uniforms={vortexUniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Emissive Orbiting Spark Particles */}
      <points ref={sparksRef} position={[0, 0, 0.15]} geometry={sparkGeo}>
        <pointsMaterial
          color="#dbe6f8"
          size={0.075}
          transparent={true}
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Volumetric Forward Energy Cone illuminating the bridge walkway */}
      <mesh position={[0, 0, 2.0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 3.4, 4.4, 32, 1, true]} />
        <meshBasicMaterial
          color="#c4d8f5"
          transparent={true}
          opacity={hovered ? 0.14 : 0.07 + portalFlare * 0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Interactive Raycast Hit Target for Hover and Enter */}
      <mesh
        position={[0, 0, 0.25]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onEnter) onEnter();
        }}
      >
        <circleGeometry args={[1.68, 32]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
