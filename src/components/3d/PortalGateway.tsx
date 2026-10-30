import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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
  
  // Swirling logarithmic spiral
  float speed = uTime * (1.2 + uHover * 2.2);
  float spiral = theta * 3.0 + r * 14.0 - speed;
  
  float n1 = noise(vec2(spiral, r * 8.0 - uTime * 0.8));
  float n2 = noise(vec2(spiral * 2.0, r * 14.0 + uTime * 1.2));
  float combined = n1 * 0.6 + n2 * 0.4;
  
  // Edge soft falloff
  float edge = smoothstep(1.0, 0.35, r);
  
  // Bright radiant core
  float core = smoothstep(0.4, 0.0, r) * 1.8;
  
  // Outer shimmering corona
  float ring = smoothstep(0.95, 0.82, r) * smoothstep(0.70, 0.85, r) * 2.0;
  
  float brightness = (combined * 0.8 + core + ring) * edge * (uIntensity + uHover * 0.8);
  
  // Silver celestial gradient (pure silver white core to subtle ether blue rim)
  vec3 col = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 1.0, 1.0), core * 0.8 + ring * 0.5);
  
  gl_FragColor = vec4(col * brightness, edge * (0.85 + uHover * 0.15));
}
`;

const godRayVertex = `
varying vec2 vUv;
varying vec3 vNormal;
void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const godRayFragment = `
uniform float uTime;
uniform float uIntensity;
varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Beams along the cone length
  float beam = sin(vUv.x * 24.0 + uTime * 1.2) * 0.5 + 0.5;
  beam += sin(vUv.x * 40.0 - uTime * 2.0) * 0.3;
  
  // Length fade: bright near portal (vUv.y = 0), fades as it extends forward (vUv.y = 1)
  float lengthFade = pow(1.0 - vUv.y, 2.2);
  
  // Radial edge softness
  float rim = pow(max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 1.5);
  
  float alpha = beam * lengthFade * rim * uIntensity * 0.28;
  vec3 col = vec3(0.85, 0.92, 1.0);
  
  gl_FragColor = vec4(col, alpha);
}
`;

export default function PortalGateway({
  reduced = false,
  onEnter,
  hovered,
  setHovered,
  portalFlare = 0,
}: {
  reduced?: boolean;
  onEnter?: () => void;
  hovered: boolean;
  setHovered: (h: boolean) => void;
  portalFlare?: number;
}) {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const vortexMatRef = useRef<THREE.ShaderMaterial>(null);
  const godRayMatRef = useRef<THREE.ShaderMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const vortexUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1.2 },
      uHover: { value: 0 },
    }),
    [],
  );

  const godRayUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 1.0 },
    }),
    [],
  );

  useFrame((_, delta) => {
    const d = reduced ? 0 : delta;
    const speedMultiplier = hovered ? 3.0 : 1.0;

    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += d * 0.3 * speedMultiplier;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= d * 0.5 * speedMultiplier;
    }

    if (vortexMatRef.current) {
      vortexMatRef.current.uniforms.uTime.value += d;
      const targetHover = hovered ? 1.0 : 0.0;
      vortexMatRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
        vortexMatRef.current.uniforms.uHover.value,
        targetHover,
        0.1,
      );
      vortexMatRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
        vortexMatRef.current.uniforms.uIntensity.value,
        1.2 + portalFlare * 4.0,
        0.15,
      );
    }

    if (godRayMatRef.current) {
      godRayMatRef.current.uniforms.uTime.value += d;
      godRayMatRef.current.uniforms.uIntensity.value = THREE.MathUtils.lerp(
        godRayMatRef.current.uniforms.uIntensity.value,
        hovered ? 1.8 : 0.9 + portalFlare * 3.0,
        0.1,
      );
    }

    if (lightRef.current) {
      const pulse = 0.9 + 0.1 * Math.sin(Date.now() * 0.004);
      const targetInt = (hovered ? 45 : 24) * pulse + portalFlare * 120;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetInt,
        0.15,
      );
    }
  });

  return (
    <group position={[2.76, -2.23, -4.85]}>
      {/* 3D Dynamic Point Light */}
      <pointLight
        ref={lightRef}
        color="#f0f5ff"
        intensity={26}
        distance={14}
        decay={2}
      />

      {/* Outer Gothic Rune Torus Ring */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[0.85, 0.018, 16, 72]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#c8d6ff"
            emissiveIntensity={hovered ? 1.5 : 0.8}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>
        {/* Subtle gothic runic teeth/notches */}
        {[...Array(12)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 6) * 0.85,
              Math.sin((i * Math.PI) / 6) * 0.85,
              0,
            ]}
            rotation={[0, 0, (i * Math.PI) / 6]}
          >
            <boxGeometry args={[0.024, 0.08, 0.02]} />
            <meshStandardMaterial
              color="#e8f0ff"
              emissive="#b8d0ff"
              emissiveIntensity={1.2}
            />
          </mesh>
        ))}
      </group>

      {/* Inner Counter-Rotating Ring */}
      <group ref={innerRingRef}>
        <mesh>
          <torusGeometry args={[0.74, 0.014, 16, 64]} />
          <meshStandardMaterial
            color="#e2e8f5"
            emissive="#ffffff"
            emissiveIntensity={hovered ? 1.8 : 1.0}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {[...Array(8)].map((_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i * Math.PI) / 4) * 0.74,
              Math.sin((i * Math.PI) / 4) * 0.74,
              0,
            ]}
            rotation={[0, 0, (i * Math.PI) / 4]}
          >
            <boxGeometry args={[0.018, 0.05, 0.015]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={1.6}
            />
          </mesh>
        ))}
      </group>

      {/* Swirling Luminous Vortex Disc */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.70, 54]} />
        <shaderMaterial
          ref={vortexMatRef}
          vertexShader={vortexVertex}
          fragmentShader={vortexFragment}
          uniforms={vortexUniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Volumetric God Rays Cone piercing forward along the bridge */}
      <mesh
        position={[0, 0, 1.8]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <cylinderGeometry args={[0.65, 2.5, 3.8, 32, 1, true]} />
        <shaderMaterial
          ref={godRayMatRef}
          vertexShader={godRayVertex}
          fragmentShader={godRayFragment}
          uniforms={godRayUniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Interactive Raycast Hit Target */}
      <mesh
        position={[0, 0, 0.1]}
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
        <circleGeometry args={[0.95, 24]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}
