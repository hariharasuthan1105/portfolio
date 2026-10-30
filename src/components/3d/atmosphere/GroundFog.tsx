import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const groundFogVertex = `
varying vec2 vUv;
varying vec3 vWorldPosition;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const groundFogFragment = `
uniform float uTime;
uniform vec2 uDrift;
uniform float uOpacity;
uniform vec3 uPortalPos;
uniform float uPortalInfluence;
uniform float uPortalFlare;
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
  float a = 0.5;
  for (int i = 0; i < 4; ++i) {
    v += a * snoise(p);
    p = p * 2.06 + vec2(1.5, 0.9);
    a *= 0.48;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  
  // Elliptical soft horizontal boundary
  vec2 centered = (uv - 0.5) * 2.0;
  float dist = length(centered);
  float edgeMask = smoothstep(1.0, 0.28, dist);
  if (edgeMask <= 0.001) discard;

  // Portal attraction vector calculation
  vec3 toPortal = uPortalPos - vWorldPosition;
  vec2 portalPull = normalize(toPortal.xy) * (uPortalInfluence * 0.04);

  // Slow undulating surface waves
  vec2 st = uv * vec2(3.5, 1.8) + (uDrift + portalPull) * uTime * 0.03;
  
  // Rolling waves advection
  float wave = sin(st.x * 2.5 + uTime * 0.3) * 0.15;
  float n1 = fbm(st + vec2(0.0, wave));
  float n2 = fbm(st * 1.8 - vec2(uTime * 0.02, 0.0) + n1 * 1.4);
  float fog = fbm(st + n2 * 1.5);
  fog = smoothstep(-0.25, 0.65, fog);

  // Portal and torch illumination falloff
  float distLight = length(toPortal);
  float atten = 1.0 / (1.0 + distLight * 0.22);
  float forwardScatter = pow(max(dot(normalize(toPortal), vec3(0.0, 0.0, 1.0)), 0.0), 2.0);

  // Sterling charcoal to luminous silver tone
  vec3 darkCharcoal = vec3(0.06, 0.07, 0.10);
  vec3 silverFog = vec3(0.58, 0.62, 0.70);
  vec3 radiantSilver = vec3(0.92, 0.95, 1.0);

  vec3 col = mix(darkCharcoal, silverFog, fog);
  col = mix(col, radiantSilver, forwardScatter * atten * 1.3 + uPortalFlare * 0.6 + fog * 0.25);

  float alpha = fog * edgeMask * uOpacity * (0.45 + atten * 0.55);
  gl_FragColor = vec4(col, alpha);
}
`;

function FogSlab({
  position,
  scale,
  driftSpeed,
  opacity = 0.38,
  reduced = false,
  portalPos,
  portalInfluence = 0,
  portalFlare = 0,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  driftSpeed: [number, number];
  opacity?: number;
  reduced?: boolean;
  portalPos: THREE.Vector3;
  portalInfluence?: number;
  portalFlare?: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 50 },
      uDrift: { value: new THREE.Vector2(driftSpeed[0], driftSpeed[1]) },
      uOpacity: { value: opacity },
      uPortalPos: { value: portalPos },
      uPortalInfluence: { value: 0 },
      uPortalFlare: { value: 0 },
    }),
    [driftSpeed, opacity, portalPos],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += reduced ? 0 : delta;
    matRef.current.uniforms.uPortalInfluence.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uPortalInfluence.value,
      portalInfluence,
      0.1,
    );
    matRef.current.uniforms.uPortalFlare.value = THREE.MathUtils.lerp(
      matRef.current.uniforms.uPortalFlare.value,
      portalFlare,
      0.15,
    );
  });

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={groundFogVertex}
        fragmentShader={groundFogFragment}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

export default function GroundFog({
  reduced = false,
  quality = "high",
  portalPos = new THREE.Vector3(0, -0.45, -5.05),
  portalHovered = false,
  portalFlare = 0,
}: {
  reduced?: boolean;
  quality?: "high" | "medium" | "low";
  portalPos?: THREE.Vector3;
  portalHovered?: boolean;
  portalFlare?: number;
}) {
  const portalInfluence = (portalHovered ? 1.0 : 0.0) + portalFlare * 2.5;

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Deep Bridge Deck Rolling Fog (Close to gateway threshold) */}
      <FogSlab
        position={[0.0, -2.4, -4.2]}
        scale={[7.2, 2.4, 1]}
        driftSpeed={[-0.025, 0.008]}
        opacity={quality === "low" ? 0.28 : 0.42}
        reduced={reduced}
        portalPos={portalPos}
        portalInfluence={portalInfluence}
        portalFlare={portalFlare}
      />

      {/* 2. Mid Bridge Deck Fog (Around pillars and flags) */}
      <FogSlab
        position={[0.0, -2.8, -2.8]}
        scale={[8.0, 2.6, 1]}
        driftSpeed={[0.028, 0.010]}
        opacity={quality === "low" ? 0.26 : 0.38}
        reduced={reduced}
        portalPos={portalPos}
        portalInfluence={portalInfluence}
        portalFlare={portalFlare}
      />

      {/* 3. Foreground Bridge Deck Fog (Swirling around archers) */}
      <FogSlab
        position={[0.0, -3.2, -1.2]}
        scale={[9.2, 3.0, 1]}
        driftSpeed={[-0.022, 0.008]}
        opacity={quality === "low" ? 0.24 : 0.35}
        reduced={reduced}
        portalPos={portalPos}
        portalInfluence={portalInfluence}
        portalFlare={portalFlare}
      />

      {/* 4. Flanking Archer Mist Swirls (Medium & High) */}
      {quality !== "low" && (
        <>
          {/* Swirling around left archer's cloak & quiver */}
          <FogSlab
            position={[-4.5, -2.2, -2.5]}
            scale={[4.8, 2.8, 1]}
            driftSpeed={[-0.018, 0.012]}
            opacity={0.32}
            reduced={reduced}
            portalPos={portalPos}
            portalInfluence={portalInfluence}
            portalFlare={portalFlare}
          />
          {/* Swirling around right archer's bow & deck corner */}
          <FogSlab
            position={[4.6, -2.3, -2.5]}
            scale={[4.8, 2.8, 1]}
            driftSpeed={[0.020, 0.010]}
            opacity={0.32}
            reduced={reduced}
            portalPos={portalPos}
            portalInfluence={portalInfluence}
            portalFlare={portalFlare}
          />
        </>
      )}
    </group>
  );
}
