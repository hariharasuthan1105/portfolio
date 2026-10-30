import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const waterfallMistVertex = `
varying vec2 vUv;
varying vec3 vWorldPosition;
void main() {
  vUv = uv;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const waterfallMistFragment = `
uniform float uTime;
uniform float uRisingSpeed;
uniform float uOpacity;
uniform vec3 uLightPos;
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
  float a = 0.52;
  for (int i = 0; i < 4; ++i) {
    v += a * snoise(p);
    p = p * 2.15 + vec2(0.8, 1.4);
    a *= 0.47;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  
  // Vertical column mask: denser at base (plunge pool), expanding and fading at top
  float horizontalMask = smoothstep(0.0, 0.25, uv.x) * smoothstep(1.0, 0.75, uv.x);
  float verticalFade = pow(1.0 - uv.y, 0.85) * smoothstep(0.0, 0.12, uv.y);
  float mask = horizontalMask * verticalFade;
  if (mask <= 0.001) discard;

  // Upward rising spray advection
  vec2 st = vec2(uv.x * 2.2, uv.y * 3.5 - uTime * uRisingSpeed);
  
  // Turbulent curl near base dispersing upward
  float curl = fbm(st + vec2(0.0, uTime * 0.04));
  float spray = fbm(st + curl * 1.8 + vec2(uTime * 0.02, 0.0));
  spray = smoothstep(-0.2, 0.6, spray);

  // Radiant water spray illumination
  vec3 toLight = normalize(uLightPos - vWorldPosition);
  float distLight = length(uLightPos - vWorldPosition);
  float atten = 1.0 / (1.0 + distLight * 0.25);
  float rim = pow(max(dot(toLight, vec3(0.0, 0.0, 1.0)), 0.0), 1.8);

  // Sparkling silver mist colors
  vec3 mistBase = vec3(0.12, 0.14, 0.18);
  vec3 mistHighlight = vec3(0.88, 0.94, 1.0);
  vec3 col = mix(mistBase, mistHighlight, spray * 0.6 + rim * atten * 1.2);

  float alpha = spray * mask * uOpacity * (0.5 + atten * 0.5);
  gl_FragColor = vec4(col, alpha);
}
`;

function MistColumn({
  position,
  scale,
  risingSpeed = 0.07,
  opacity = 0.45,
  reduced = false,
  lightPos,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  risingSpeed?: number;
  opacity?: number;
  reduced?: boolean;
  lightPos: THREE.Vector3;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: Math.random() * 50 },
      uRisingSpeed: { value: risingSpeed },
      uOpacity: { value: opacity },
      uLightPos: { value: lightPos },
    }),
    [risingSpeed, opacity, lightPos],
  );

  useFrame((_, delta) => {
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += reduced ? 0 : delta;
  });

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={waterfallMistVertex}
        fragmentShader={waterfallMistFragment}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.NormalBlending}
      />
    </mesh>
  );
}

export default function WaterfallMist({
  reduced = false,
  quality = "high",
  portalPos = new THREE.Vector3(0, -0.45, -5.05),
}: {
  reduced?: boolean;
  quality?: "high" | "medium" | "low";
  portalPos?: THREE.Vector3;
}) {
  return (
    <group position={[0, 0, 0]}>
      {/* 1. Left Major Waterfall Gorge (Rising spray at plunge base) */}
      <MistColumn
        position={[-3.8, -2.1, -4.6]}
        scale={[3.6, 4.2, 1]}
        risingSpeed={0.065}
        opacity={quality === "low" ? 0.3 : 0.52}
        reduced={reduced}
        lightPos={portalPos}
      />

      {/* 2. Right Major Waterfall Gorge (Rising spray at plunge base) */}
      <MistColumn
        position={[3.8, -2.0, -4.6]}
        scale={[3.6, 4.2, 1]}
        risingSpeed={0.068}
        opacity={quality === "low" ? 0.3 : 0.52}
        reduced={reduced}
        lightPos={portalPos}
      />

      {/* 3. Outer Left Cliff Cascades (Medium & High) */}
      {quality !== "low" && (
        <>
          <MistColumn
            position={[-6.2, -1.2, -5.5]}
            scale={[3.2, 3.8, 1]}
            risingSpeed={0.055}
            opacity={0.38}
            reduced={reduced}
            lightPos={portalPos}
          />
          {/* Outer Right Cliff Cascades */}
          <MistColumn
            position={[6.2, -1.1, -5.5]}
            scale={[3.2, 3.8, 1]}
            risingSpeed={0.058}
            opacity={0.38}
            reduced={reduced}
            lightPos={portalPos}
          />
        </>
      )}
    </group>
  );
}
