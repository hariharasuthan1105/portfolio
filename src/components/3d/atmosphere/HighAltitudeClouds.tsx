import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const highCloudsVertex = `
varying vec2 vUv;
varying vec3 vWorldPosition;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const highCloudsFragment = `
uniform float uTime;
uniform vec2 uDrift;
uniform float uOpacity;
uniform vec3 uSunPos;
uniform float uPortalFlare;
varying vec2 vUv;
varying vec3 vWorldPosition;

// 2D Simplex Noise with high efficiency
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
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

// 4-Octave FBM with Domain Warping
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.52;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
  for (int i = 0; i < 4; ++i) {
    v += a * snoise(p);
    p = rot * p * 2.05 + shift;
    a *= 0.48;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  
  // Boundary soft alpha masking to prevent square edges
  float edgeDistX = smoothstep(0.0, 0.18, uv.x) * smoothstep(1.0, 0.82, uv.x);
  float edgeDistY = smoothstep(0.0, 0.15, uv.y) * smoothstep(1.0, 0.85, uv.y);
  float mask = edgeDistX * edgeDistY;
  if (mask <= 0.001) discard;

  // Domain warping for turbulent billowy storm clouds
  vec2 st = uv * vec2(3.2, 2.0) + uDrift * uTime * 0.015;
  
  vec2 q = vec2(
    fbm(st + vec2(0.0, 0.0) + uTime * 0.012),
    fbm(st + vec2(5.2, 1.3) + uTime * 0.008)
  );

  vec2 r = vec2(
    fbm(st + 4.0 * q + vec2(1.7, 9.2) + 0.015 * uTime),
    fbm(st + 4.0 * q + vec2(8.3, 2.8) + 0.012 * uTime)
  );

  float density = fbm(st + 4.0 * r);
  density = smoothstep(-0.25, 0.70, density);

  // Eclipse backlighting rim scattering
  vec3 lightDir = normalize(uSunPos - vWorldPosition);
  float rimDot = max(dot(normalize(vWorldPosition), -lightDir), 0.0);
  float rim = pow(rimDot, 3.5) * (1.0 - density * 0.5);

  // Monochrome Palette (Charcoal shadow, sterling midtone, radiant silver eclipse rim)
  vec3 shadowCol = vec3(0.05, 0.05, 0.07);
  vec3 midCol = vec3(0.38, 0.40, 0.46);
  vec3 silverRimCol = vec3(0.92, 0.95, 1.0);

  vec3 col = mix(shadowCol, midCol, density);
  col = mix(col, silverRimCol, rim * 1.6 + uPortalFlare * 0.5);

  float alpha = density * mask * uOpacity * (0.6 + rim * 0.4);
  gl_FragColor = vec4(col, alpha);
}
`;

export default function HighAltitudeClouds({
  reduced = false,
  quality = "high",
  portalFlare = 0,
}: {
  reduced?: boolean;
  quality?: "high" | "medium" | "low";
  portalFlare?: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uDrift: { value: new THREE.Vector2(-0.018, 0.004) },
      uOpacity: { value: quality === "low" ? 0.35 : 0.65 },
      uSunPos: { value: new THREE.Vector3(0, 6.5, -9.0) },
      uPortalFlare: { value: 0 },
    }),
    [quality],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += reduced ? 0 : delta;
    matRef.current.uniforms.uPortalFlare.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uPortalFlare.value,
      portalFlare,
      0.1,
    );
  });

  return (
    <group position={[0, 3.2, -9.5]}>
      {/* High-altitude panoramic cloud backdrop */}
      <mesh scale={[28.0, 10.5, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={highCloudsVertex}
          fragmentShader={highCloudsFragment}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>
    </group>
  );
}
