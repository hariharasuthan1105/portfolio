// src/components/3d/citadel/CelestialSkyBackdrop.tsx
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const skyVertex = `
varying vec2 vUv;
varying vec3 vWorldPosition;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const skyFragment = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vWorldPosition;

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
  // Gradient from deep space void at top to misty abyss at horizon
  vec3 skyTop = vec3(0.02, 0.03, 0.05);
  vec3 skyMid = vec3(0.08, 0.11, 0.16);
  vec3 skyBottom = vec3(0.03, 0.04, 0.06);

  float y = vUv.y;
  vec3 baseSky = mix(skyBottom, skyMid, smoothstep(0.0, 0.55, y));
  baseSky = mix(baseSky, skyTop, smoothstep(0.55, 1.0, y));

  // Giant Full Moon at top center (centered at uv.x = 0.5, uv.y = 0.72)
  vec2 moonPos = vec2(0.5, 0.75);
  float distToMoon = length((vUv - moonPos) * vec2(1.6, 1.0));
  
  // Moon disc surface
  float moonDisc = smoothstep(0.13, 0.125, distToMoon);
  float moonTexture = noise(vUv * 35.0) * 0.18 + noise(vUv * 70.0) * 0.1;
  vec3 moonColor = vec3(0.92, 0.96, 1.0) * (0.88 - moonTexture);

  // Soft radiant celestial lunar halo
  float moonGlow = exp(-distToMoon * 4.2) * 0.65;
  vec3 glowColor = vec3(0.75, 0.85, 1.0) * moonGlow;

  // Volumetric Celestial Crepuscular Sunbeams / God Rays piercing downward from moon
  float angle = atan(vUv.y - moonPos.y, vUv.x - moonPos.x);
  float rays = sin(angle * 14.0 + sin(angle * 22.0)) * 0.5 + 0.5;
  rays = pow(rays, 3.5) * smoothstep(0.1, 0.8, distToMoon) * smoothstep(1.0, 0.2, distToMoon) * 0.35;
  vec3 rayColor = vec3(0.85, 0.92, 1.0) * rays;

  // Stormy cloud banks drifting in upper atmosphere
  float cloudP = noise(vec2(vUv.x * 5.0 + uTime * 0.015, vUv.y * 4.0));
  cloudP += noise(vec2(vUv.x * 12.0 - uTime * 0.02, vUv.y * 8.0)) * 0.5;
  float cloudMask = smoothstep(0.4, 0.85, cloudP) * (0.18 + moonGlow * 0.25);
  vec3 clouds = vec3(0.14, 0.18, 0.25) * cloudMask;

  vec3 finalColor = baseSky + glowColor + rayColor + clouds;
  finalColor = mix(finalColor, moonColor, moonDisc);

  gl_FragColor = vec4(finalColor, 1.0);
}
`;

export function CelestialSkyBackdrop({ reduced = false }: { reduced?: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += reduced ? 0 : delta;
  });

  return (
    <group position={[0, 16.0, -26.0]}>
      {/* Massive curved backdrop plane behind the entire citadel */}
      <mesh>
        <planeGeometry args={[84, 48, 32, 32]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={skyVertex}
          fragmentShader={skyFragment}
          uniforms={uniforms}
          depthWrite={false}
        />
      </mesh>

      {/* Silhouetted Flying Gargoyles / Winged Creatures in the Moonlit Sky */}
      {[-8, -3, 6, 12].map((x, i) => (
        <mesh
          key={i}
          position={[x, 10 + (i % 2) * 3, 2.0]}
          scale={[0.35, 0.2, 0.25]}
        >
          <coneGeometry args={[1.2, 0.4, 3]} />
          <meshBasicMaterial color="#05070a" />
        </mesh>
      ))}
    </group>
  );
}
