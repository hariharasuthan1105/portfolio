import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = `
uniform sampler2D uDepth;
uniform float uDisplacement;
varying vec2 vUv;
varying vec3 vViewPosition;
varying float vDepth;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  float d = texture2D(uDepth, uv).r;
  vDepth = d;
  
  // Real geometric depth displacement along Z and subtle panoramic curve
  vec3 pos = position;
  pos.z += (d - 0.5) * uDisplacement;
  pos.z += (position.x * position.x) * -0.005;
  
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  
  vec4 mvPosition = viewMatrix * worldPos;
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform sampler2D uTexture;
uniform sampler2D uDepth;
uniform vec2 uMouse;
uniform float uTime;
uniform vec3 uPortalLightPos;
uniform float uLightIntensity;
uniform float uPortalFlare;

varying vec2 vUv;
varying vec3 vViewPosition;
varying float vDepth;
varying vec3 vWorldPosition;

void main() {
  vec3 viewDir = normalize(vViewPosition);
  float depth = texture2D(uDepth, vUv).r;
  
  // Smooth parallax relief
  vec2 parallax = viewDir.xy * (depth - 0.5) * 0.015;
  vec2 uv = clamp(vUv + parallax, 0.001, 0.999);
  
  vec4 baseColor = texture2D(uTexture, uv);
  
  // Symmetrical Central 3D Portal Gateway Light calculation
  vec3 lightVec = uPortalLightPos - vWorldPosition;
  float distToLight = length(lightVec);
  vec3 lightDir = normalize(lightVec);
  
  // Soft inverse-square attenuation
  float atten = 1.0 / (1.0 + distToLight * 0.2 + distToLight * distToLight * 0.06);
  
  // Pulsing gateway illumination
  float pulse = 0.92 + 0.08 * sin(uTime * 2.6);
  vec3 portalIllum = vec3(0.92, 0.96, 1.0) * atten * uLightIntensity * pulse * 0.4;
  
  // Finite difference bump normal from depth map (portable across all WebGL)
  vec2 texel = vec2(0.001, 0.0015);
  float dR = texture2D(uDepth, uv + vec2(texel.x, 0.0)).r;
  float dL = texture2D(uDepth, uv - vec2(texel.x, 0.0)).r;
  float dU = texture2D(uDepth, uv + vec2(0.0, texel.y)).r;
  float dD = texture2D(uDepth, uv - vec2(0.0, texel.y)).r;
  float dX = (dR - dL) * 5.0;
  float dY = (dU - dD) * 5.0;
  vec3 bumpNormal = normalize(vec3(-dX, -dY, 1.0));
  
  // Wet stone & waterfall specular highlights
  float specAngle = max(dot(reflect(-lightDir, bumpNormal), viewDir), 0.0);
  float specPower = pow(specAngle, 16.0);
  vec3 specular = vec3(0.88, 0.94, 1.0) * specPower * atten * 0.45;
  
  // Atmospheric rim light on silhouettes (both archers, citadel spires)
  float rim = pow(1.0 - max(dot(viewDir, bumpNormal), 0.0), 3.0);
  vec3 rimColor = vec3(0.85, 0.90, 1.0) * rim * (0.12 + 0.25 * depth);
  
  // Moon backlighting from central eclipse
  float moonRim = pow(max(dot(viewDir, vec3(0.0, 0.7, 0.7)), 0.0), 4.0) * (1.0 - depth) * 0.15;
  
  // Subtle celestial energy glints on left archer bow and right archer bow
  float leftBowGlint = smoothstep(0.16, 0.36, uv.x) * smoothstep(0.35, 0.70, uv.y) * depth;
  vec3 leftBowAura = vec3(0.85, 0.92, 1.0) * leftBowGlint * (0.5 + 0.5 * cos(uTime * 3.5)) * 0.25;
  
  float rightBowGlint = smoothstep(0.78, 0.94, uv.x) * smoothstep(0.60, 0.85, uv.y) * depth;
  vec3 rightBowAura = vec3(0.85, 0.92, 1.0) * rightBowGlint * (0.5 + 0.5 * sin(uTime * 4.0)) * 0.25;

  // Screen bloom / flare from portal activation
  vec3 flareColor = vec3(1.0, 1.0, 1.0) * uPortalFlare * atten * 2.2;
  
  // Final composite
  vec3 finalColor = baseColor.rgb + portalIllum + specular + rimColor + vec3(moonRim) + leftBowAura + rightBowAura + flareColor;
  
  // AAA cinematic contrast
  finalColor = pow(finalColor, vec3(1.04));
  
  gl_FragColor = vec4(finalColor, baseColor.a);
}
`;

export default function GothicCastleMesh({
  reduced = false,
  portalFlare = 0,
  portalHovered = false,
}: {
  reduced?: boolean;
  portalFlare?: number;
  portalHovered?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, camera } = useThree();

  const [texture, depthMap] = useTexture([
    "/assets/hero-citadel-archers.webp",
    "/assets/hero-citadel-archers_depth.webp",
  ]);

  useMemo(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    depthMap.minFilter = THREE.LinearFilter;
    depthMap.magFilter = THREE.LinearFilter;
    depthMap.generateMipmaps = false;
  }, [texture, depthMap]);

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uDepth: { value: depthMap },
      uDisplacement: { value: reduced ? 0.08 : 0.32 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPortalLightPos: { value: new THREE.Vector3(1.85, -1.08, -5.0) },
      uLightIntensity: { value: 1.0 },
      uPortalFlare: { value: 0 },
    }),
    [texture, depthMap, reduced],
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const timeDelta = reduced ? 0 : delta;
    materialRef.current.uniforms.uTime.value += timeDelta;

    const targetIntensity = portalHovered ? 2.6 : 1.3;
    materialRef.current.uniforms.uLightIntensity.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uLightIntensity.value,
      targetIntensity,
      0.08,
    );

    materialRef.current.uniforms.uPortalFlare.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uPortalFlare.value,
      portalFlare,
      0.15,
    );

    materialRef.current.uniforms.uMouse.value.set(
      state.pointer.x,
      state.pointer.y,
    );
  });

  // Aspect-ratio cover positioning without stretching or distortion (exact 16:9)
  const imageAspect = 16 / 9;
  const vAtDepth = viewport.getCurrentViewport(camera, [0, 0, -5.2]);
  const viewAspect = vAtDepth.width / vAtDepth.height;

  let meshW = 21.33;
  let meshH = 12.0;
  if (viewAspect > imageAspect) {
    meshW = vAtDepth.width * 1.01;
    meshH = meshW / imageAspect;
  } else {
    meshH = vAtDepth.height * 1.01;
    meshW = meshH * imageAspect;
  }

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, -5.2]}
      scale={[meshW, meshH, 1]}
    >
      <planeGeometry args={[1, 1, reduced ? 48 : 160, reduced ? 32 : 110]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={true}
      />
    </mesh>
  );
}
