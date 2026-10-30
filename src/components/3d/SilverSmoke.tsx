import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const smokeVertex = `
varying vec2 vUv;
varying vec3 vWorldPosition;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const smokeFragment = `
uniform float uTime;
uniform vec3 uLightPos;
uniform float uOpacity;
uniform vec2 uDrift;
uniform float uDensity;
varying vec2 vUv;
varying vec3 vWorldPosition;

// High-performance 2D Simplex Noise
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Multi-octave curl-like FBM noise for volumetric smoke billows
float fbm(vec2 p) {
  float f = 0.0;
  float w = 0.5;
  for (int i = 0; i < 4; i++) {
    f += w * snoise(p);
    p = p * 2.05 + vec2(1.3, 0.8);
    w *= 0.48;
  }
  return f;
}

void main() {
  vec2 uv = vUv;
  
  // Elliptical soft boundary masking
  vec2 centered = (uv - 0.5) * 2.0;
  float dist = length(centered);
  float edgeMask = smoothstep(1.0, 0.25, dist);
  if (edgeMask <= 0.001) discard;
  
  // Turbulent curl advection
  vec2 p = uv * vec2(3.5, 2.2) + uDrift * uTime;
  
  // Domain warping for organic rolling smoke billows
  float q = fbm(p + vec2(0.0, uTime * 0.06));
  float r = fbm(p + q * 1.6 - vec2(uTime * 0.04, 0.0));
  float smoke = fbm(p + r * 1.8);
  
  smoke = smoothstep(-0.25, 0.65, smoke);
  
  // Volumetric Lighting & Forward Scattering from Portal Light
  vec3 toLight = normalize(uLightPos - vWorldPosition);
  float distLight = length(uLightPos - vWorldPosition);
  float atten = 1.0 / (1.0 + distLight * 0.25);
  
  // Forward scattering gives silver rim sheen to smoke edges
  float forwardScatter = pow(max(dot(toLight, vec3(0.0, 0.0, 1.0)), 0.0), 2.2);
  
  // Colors:
  // Highlight: Radiant silver-white (#e4ecfc)
  // Midtone: Sterling silver (#9aa3b2)
  // Shadow: Deep smoky charcoal (#121318)
  vec3 shadowCol = vec3(0.08, 0.09, 0.12);
  vec3 midCol = vec3(0.58, 0.62, 0.70);
  vec3 highlightCol = vec3(0.92, 0.95, 1.0);
  
  vec3 smokeCol = mix(shadowCol, midCol, smoke);
  smokeCol = mix(smokeCol, highlightCol, forwardScatter * atten * 1.5 + smoke * 0.35);
  
  float alpha = smoke * edgeMask * uOpacity * (0.4 + atten * 0.6) * uDensity;
  
  gl_FragColor = vec4(smokeCol, alpha);
}
`;

function SmokePlume({
  position,
  scale,
  rotation = [0, 0, 0],
  driftSpeed = [0.03, 0.015],
  opacity = 0.35,
  density = 1.0,
  reduced = false,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  driftSpeed?: [number, number];
  opacity?: number;
  density?: number;
  reduced?: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 50 },
      uLightPos: { value: new THREE.Vector3(0, -0.45, -5.0) },
      uOpacity: { value: opacity },
      uDrift: { value: new THREE.Vector2(driftSpeed[0], driftSpeed[1]) },
      uDensity: { value: density },
    }),
    [opacity, driftSpeed, density],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += reduced ? 0 : delta;
  });

  return (
    <mesh position={position} scale={scale} rotation={rotation}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={smokeVertex}
        fragmentShader={smokeFragment}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

export default function SilverSmoke({
  reduced = false,
  low = false,
}: {
  reduced?: boolean;
  low?: boolean;
}) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Low rolling ground mist on the stone bridge deck */}
      <SmokePlume
        position={[0.0, -2.5, -4.2]}
        scale={[6.8, 2.4, 1]}
        driftSpeed={[-0.03, 0.01]}
        opacity={0.36}
        density={1.1}
        reduced={reduced}
      />
      <SmokePlume
        position={[0.0, -2.9, -2.8]}
        scale={[7.5, 2.6, 1]}
        driftSpeed={[0.035, 0.012]}
        opacity={0.30}
        density={1.0}
        reduced={reduced}
      />
      <SmokePlume
        position={[0.0, -3.3, -1.2]}
        scale={[8.8, 3.0, 1]}
        driftSpeed={[-0.025, 0.01]}
        opacity={0.28}
        density={0.9}
        reduced={reduced}
      />

      {/* 2. Additional Atmospheric plumes in HQ mode */}
      {!low && (
        <>
          {/* Swirling silver clouds right around the portal gateway */}
          <SmokePlume
            position={[0.0, -0.35, -4.6]}
            scale={[4.8, 3.5, 1]}
            driftSpeed={[0.02, 0.025]}
            opacity={0.22}
            density={0.8}
            reduced={reduced}
          />
          {/* Left cliff mist & waterfall spray near archer */}
          <SmokePlume
            position={[-3.8, -2.0, -3.4]}
            scale={[5.5, 3.8, 1]}
            driftSpeed={[-0.025, 0.015]}
            opacity={0.24}
            density={0.8}
            reduced={reduced}
          />
          {/* Right cliff mist & waterfall spray past warrior */}
          <SmokePlume
            position={[3.8, -1.9, -3.2]}
            scale={[5.2, 3.5, 1]}
            driftSpeed={[0.028, 0.012]}
            opacity={0.24}
            density={0.85}
            reduced={reduced}
          />
        </>
      )}
    </group>
  );
}
