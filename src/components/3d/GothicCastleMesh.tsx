import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
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
  
  // Real geometric depth displacement along Z
  vec3 pos = position;
  pos.z += (d - 0.5) * uDisplacement;
  
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
  
  // Micro-parallax for tactile relief without stretching
  vec2 parallax = viewDir.xy * (depth - 0.5) * 0.025;
  vec2 uv = clamp(vUv + parallax, 0.001, 0.999);
  
  vec4 baseColor = texture2D(uTexture, uv);
  
  // 3D Portal Gateway Light calculation
  vec3 lightVec = uPortalLightPos - vWorldPosition;
  float distToLight = length(lightVec);
  vec3 lightDir = normalize(lightVec);
  
  // Inverse square attenuation with soft radius
  float atten = 1.0 / (1.0 + distToLight * 0.16 + distToLight * distToLight * 0.05);
  
  // Pulsing gateway illumination
  float pulse = 0.88 + 0.12 * sin(uTime * 2.8);
  vec3 portalIllum = vec3(0.92, 0.95, 1.0) * atten * uLightIntensity * pulse * 0.7;
  
  // Finite difference bump normal from depth map (portable across all WebGL)
  vec2 texel = vec2(0.001, 0.0015);
  float dR = texture2D(uDepth, uv + vec2(texel.x, 0.0)).r;
  float dL = texture2D(uDepth, uv - vec2(texel.x, 0.0)).r;
  float dU = texture2D(uDepth, uv + vec2(0.0, texel.y)).r;
  float dD = texture2D(uDepth, uv - vec2(0.0, texel.y)).r;
  float dX = (dR - dL) * 6.0;
  float dY = (dU - dD) * 6.0;
  vec3 bumpNormal = normalize(vec3(-dX, -dY, 1.0));
  
  // Wet stone & waterfall specular highlights
  float specAngle = max(dot(reflect(-lightDir, bumpNormal), viewDir), 0.0);
  float specPower = pow(specAngle, 18.0);
  vec3 specular = vec3(0.85, 0.92, 1.0) * specPower * atten * 0.6;
  
  // Atmospheric rim light on silhouettes (archer, knight, spires)
  float rim = pow(1.0 - max(dot(viewDir, bumpNormal), 0.0), 3.0);
  vec3 rimColor = vec3(0.82, 0.88, 1.0) * rim * (0.15 + 0.35 * depth);
  
  // Moon backlighting from upper eclipse
  float moonRim = pow(max(dot(viewDir, vec3(0.0, 0.7, 0.7)), 0.0), 4.0) * (1.0 - depth) * 0.15;
  
  // Screen bloom / flare from portal activation
  vec3 flareColor = vec3(1.0, 1.0, 1.0) * uPortalFlare * atten * 2.2;
  
  // Final composite
  vec3 finalColor = baseColor.rgb + portalIllum + specular + rimColor + vec3(moonRim) + flareColor;
  
  // Deep gothic contrast enhancement
  finalColor = pow(finalColor, vec3(1.08));
  
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

  const [texture, depthMap] = useTexture([
    "/assets/citadel.webp",
    "/assets/citadel_depth.webp",
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
      uDisplacement: { value: reduced ? 0.35 : 1.95 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPortalLightPos: { value: new THREE.Vector3(2.76, -2.23, -4.8) },
      uLightIntensity: { value: 1.0 },
      uPortalFlare: { value: 0 },
    }),
    [texture, depthMap, reduced],
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    const timeDelta = reduced ? 0 : delta;
    materialRef.current.uniforms.uTime.value += timeDelta;

    const targetIntensity = portalHovered ? 2.4 : 1.2;
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

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, -5.2]}
      scale={[21.0, 14.0, 1]}
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
