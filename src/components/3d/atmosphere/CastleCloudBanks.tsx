import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const cloudBankVertex = `
varying vec2 vUv;
varying vec3 vWorldPosition;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const cloudBankFragment = `
uniform float uTime;
uniform vec2 uDrift;
uniform float uDensity;
uniform float uOpacity;
uniform vec3 uPortalPos;
uniform float uPortalFlare;
uniform float uPortalHover;
varying vec2 vUv;
varying vec3 vWorldPosition;

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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 4; ++i) {
    v += a * snoise(p);
    p = p * 2.08 + vec2(1.2, 3.4);
    a *= 0.46;
  }
  return v;
}

void main() {
  vec2 uv = vUv;

  // Soft radial boundary masking for billowy cumulus shape
  vec2 centered = (uv - 0.5) * 2.0;
  float dist = length(centered);
  float edgeMask = smoothstep(1.0, 0.35, dist);
  if (edgeMask <= 0.001) discard;

  // Animated multi-directional advection
  vec2 st = uv * vec2(2.6, 1.8) + uDrift * uTime * 0.025;
  
  // Curl turbulence domain warping
  float q = fbm(st + vec2(0.0, uTime * 0.015));
  float r = fbm(st + q * 2.2 - vec2(uTime * 0.018, 0.0));
  float cloud = fbm(st + r * 1.6);
  cloud = smoothstep(-0.2, 0.65, cloud);

  // Portal vortex influence: light scattering & illumination
  vec3 toPortal = uPortalPos - vWorldPosition;
  float distPortal = length(toPortal);
  float portalAtten = 1.0 / (1.0 + distPortal * 0.28 + distPortal * distPortal * 0.08);
  
  // Forward light scattering along camera view
  float forwardScatter = pow(max(dot(normalize(toPortal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
  float portalGlow = portalAtten * (uPortalHover * 0.7 + uPortalFlare * 2.5 + 0.35);

  // Volumetric core coloring:
  // Deep interior shadow -> silver midtone -> luminous white rim
  vec3 coreShadow = vec3(0.07, 0.08, 0.11);
  vec3 silverMid = vec3(0.62, 0.66, 0.74);
  vec3 silverBright = vec3(0.95, 0.97, 1.0);

  vec3 cloudColor = mix(coreShadow, silverMid, cloud);
  cloudColor = mix(cloudColor, silverBright, forwardScatter * portalAtten * 1.4 + portalGlow * 0.5 + cloud * 0.25);

  float alpha = cloud * edgeMask * uOpacity * (0.5 + portalAtten * 0.5) * uDensity;
  gl_FragColor = vec4(cloudColor, alpha);
}
`;

function CloudBankMesh({
  position,
  scale,
  driftSpeed,
  density = 1.0,
  opacity = 0.55,
  reduced = false,
  portalPos,
  portalFlare = 0,
  portalHovered = false,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  driftSpeed: [number, number];
  density?: number;
  opacity?: number;
  reduced?: boolean;
  portalPos: THREE.Vector3;
  portalFlare?: number;
  portalHovered?: boolean;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 100 },
      uDrift: { value: new THREE.Vector2(driftSpeed[0], driftSpeed[1]) },
      uDensity: { value: density },
      uOpacity: { value: opacity },
      uPortalPos: { value: portalPos },
      uPortalFlare: { value: 0 },
      uPortalHover: { value: 0 },
    }),
    [driftSpeed, density, opacity, portalPos],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += reduced ? 0 : delta;
    matRef.current.uniforms.uPortalFlare.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uPortalFlare.value,
      portalFlare,
      0.15,
    );
    matRef.current.uniforms.uPortalHover.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uPortalHover.value,
      portalHovered ? 1.0 : 0.0,
      0.1,
    );
  });

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={cloudBankVertex}
        fragmentShader={cloudBankFragment}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

export default function CastleCloudBanks({
  reduced = false,
  quality = "high",
  portalFlare = 0,
  portalHovered = false,
  portalPos = new THREE.Vector3(0, -0.45, -5.05),
}: {
  reduced?: boolean;
  quality?: "high" | "medium" | "low";
  portalFlare?: number;
  portalHovered?: boolean;
  portalPos?: THREE.Vector3;
}) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Left Flank Cloud Bank (Beneath left flying buttresses & cliffs) */}
      <CloudBankMesh
        position={[-4.5, -0.8, -4.8]}
        scale={[7.5, 4.2, 1]}
        driftSpeed={[-0.022, 0.008]}
        density={1.1}
        opacity={quality === "low" ? 0.35 : 0.58}
        reduced={reduced}
        portalPos={portalPos}
        portalFlare={portalFlare}
        portalHovered={portalHovered}
      />

      {/* 2. Right Flank Cloud Bank (Beneath right towers & canyon) */}
      <CloudBankMesh
        position={[4.6, -0.7, -4.7]}
        scale={[7.8, 4.4, 1]}
        driftSpeed={[0.024, 0.006]}
        density={1.15}
        opacity={quality === "low" ? 0.35 : 0.60}
        reduced={reduced}
        portalPos={portalPos}
        portalFlare={portalFlare}
        portalHovered={portalHovered}
      />

      {/* 3. Central Deep Foundation Cloud (Passing beneath bridge abutment) */}
      <CloudBankMesh
        position={[0.0, -1.5, -5.4]}
        scale={[9.2, 3.8, 1]}
        driftSpeed={[0.018, 0.012]}
        density={1.2}
        opacity={quality === "low" ? 0.4 : 0.62}
        reduced={reduced}
        portalPos={portalPos}
        portalFlare={portalFlare}
        portalHovered={portalHovered}
      />

      {/* 4. Upper Floating Island Cloud Bank (Only on Medium & High) */}
      {quality !== "low" && (
        <>
          {/* Drifting beneath upper left floating castle */}
          <CloudBankMesh
            position={[-5.8, 2.8, -6.8]}
            scale={[6.2, 3.2, 1]}
            driftSpeed={[-0.015, 0.005]}
            density={0.95}
            opacity={0.48}
            reduced={reduced}
            portalPos={portalPos}
            portalFlare={portalFlare}
            portalHovered={portalHovered}
          />
          {/* Drifting beneath upper right floating spires */}
          <CloudBankMesh
            position={[5.5, 2.6, -6.5]}
            scale={[6.5, 3.4, 1]}
            driftSpeed={[0.016, 0.004]}
            density={1.0}
            opacity={0.50}
            reduced={reduced}
            portalPos={portalPos}
            portalFlare={portalFlare}
            portalHovered={portalHovered}
          />
        </>
      )}
    </group>
  );
}
