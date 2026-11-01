/// <reference types="vite/client" />
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, MeshReflectorMaterial, Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";

// One coordinate system: floor = 0, inset foundation bottom = -0.025,
// stationary dais / boots = 0.065, crystal center = 1.65 (float ±0.018).
const SURFACE = 0.065;
const BOUNDS = new THREE.Box3(new THREE.Vector3(-1.04, -0.04, -1.04), new THREE.Vector3(1.04, 2.55, 1.04));

function FittedCamera() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const target = new THREE.Vector3(0, 1.16, 0);
    // A low viewpoint matches the cathedral's distant floor vanishing point.
    const direction = new THREE.Vector3(0, 0.09, 1).normalize();
    const right = new THREE.Vector3(1, 0, 0);
    const up = new THREE.Vector3().crossVectors(direction, right);
    const tanV = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const tanH = tanV * size.width / size.height;
    let distance = 0;
    for (const x of [BOUNDS.min.x, BOUNDS.max.x])
      for (const y of [BOUNDS.min.y, BOUNDS.max.y])
        for (const z of [BOUNDS.min.z, BOUNDS.max.z]) {
          const p = new THREE.Vector3(x, y, z).sub(target);
          distance = Math.max(distance, p.dot(direction) + Math.max(Math.abs(p.dot(right)) / tanH, Math.abs(p.dot(up)) / tanV) * 1.08);
        }
    cam.position.copy(target).addScaledVector(direction, distance);
    cam.lookAt(target);
    cam.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function Rim({ radius, y, glow = false }: { radius: number; y: number; glow?: boolean }) {
  return <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
    <torusGeometry args={[radius, glow ? 0.0018 : 0.009, 8, 128]} />
    <meshStandardMaterial color={glow ? '#bcbcbc' : '#555555'} metalness={0.92} roughness={0.27}
      emissive="#ffffff" emissiveIntensity={glow ? 0.35 : 0} />
  </mesh>;
}
function MechanicalRing({ radius, speed, reduced }: { radius: number; speed: number; reduced: boolean }) {
  const ring = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (ring.current && !reduced) ring.current.rotation.y += Math.min(dt, 0.05) * speed; });
  return <group ref={ring} name="rotating-inner-ring">
    <Rim radius={radius} y={0.043} />
    <Rim radius={radius - 0.018} y={0.045} glow />
    {Array.from({ length: 48 }, (_, i) => {
      const a = i * Math.PI / 24;
      return <mesh key={i} position={[Math.cos(a) * (radius - 0.052), 0.046, Math.sin(a) * (radius - 0.052)]} rotation={[0, -a, 0]}>
        <boxGeometry args={[i % 4 === 0 ? 0.034 : 0.016, 0.001, 0.003]} />
        <meshStandardMaterial color="#999999" metalness={0.8} roughness={0.35} />
      </mesh>;
    })}
  </group>;
}
function Platform({ reduced }: { reduced: boolean }) {
  return <group name="stationary-foundation">
    <mesh position={[0, 0.005, 0]} receiveShadow castShadow>
      <cylinderGeometry args={[0.96, 1.01, 0.06, 128]} />
      <meshStandardMaterial color="#363636" metalness={0.65} roughness={0.3} />
    </mesh>
    <Rim radius={0.97} y={0.025} />
    <Rim radius={0.94} y={0.036} glow />
    {[0.86, 0.67, 0.48].map((r, i) => <MechanicalRing key={r} radius={r} speed={i % 2 ? -0.045 : 0.03} reduced={reduced} />)}
    <mesh position={[0, 0.049, 0]} receiveShadow>
      <cylinderGeometry args={[0.29, 0.30, 0.032, 96]} />
      <meshStandardMaterial color="#151515" metalness={0.8} roughness={0.24} />
    </mesh>
    <Rim radius={0.29} y={SURFACE} />
  </group>;
}

function Explorer() {
  const texture = useTexture('/assets/chamber_character.png');
  texture.colorSpace = THREE.SRGBColorSpace;
  // Alpha bounds are x=38..145, y=42..220 in the 230x220 asset.
  // The bottom 10 pixels (boots) span x=102..134: center the feet at x=118.
  const h = 0.78;
  const w = h * 230 / 220;
  return <group name="stationary-explorer" position={[0, SURFACE, 0.04]}>
    <mesh position={[(115 - 118) / 230 * w, h / 2, 0]} castShadow>
      <planeGeometry args={[w, h]} />
      <meshStandardMaterial map={texture} transparent alphaTest={0.15} roughness={0.95} side={THREE.DoubleSide} />
    </mesh>
    <ContactShadows position={[0, 0.001, 0]} opacity={0.65} scale={0.65} blur={2.5} far={0.65} resolution={128} frames={1} />
  </group>;
}

function Artifact({ reduced, highlighted }: { reduced: boolean; highlighted: boolean }) {
  const crystal = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const orbitA = useRef<THREE.Group>(null);
  const orbitB = useRef<THREE.Group>(null);
  const time = useRef(0);
  const geometry = useMemo(createFacetedDiamondGeometry, []);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => {
    if (reduced) return;
    const delta = Math.min(dt, 0.05);
    time.current += delta;
    if (crystal.current) crystal.current.position.y = 1.65 + Math.sin(time.current * 0.6) * 0.018;
    if (body.current) body.current.rotation.y += delta * 0.1;
    if (orbitA.current) orbitA.current.rotation.y += delta * 0.07;
    if (orbitB.current) orbitB.current.rotation.y -= delta * 0.09;
  });
  return <group name="suspended-artifact" ref={crystal} position={[0, 1.65, 0]} scale={1.5}>
    <mesh ref={body} geometry={geometry}>
      <meshPhysicalMaterial color="#b6b6b6" transparent opacity={0.48} depthWrite={false} metalness={0.4} roughness={0.15} transmission={0} thickness={0.3} ior={1.8} clearcoat={1} flatShading side={THREE.FrontSide} />
    </mesh>
    <mesh scale={[0.28, 0.52, 0.28]}>
      <octahedronGeometry args={[0.24]} />
      <meshStandardMaterial color="#eeeeee" emissive="#ffffff" emissiveIntensity={highlighted ? 1.1 : 0.55} />
    </mesh>
    {[orbitA, orbitB].map((ref, i) => <group ref={ref} key={i} rotation={[i ? 0.45 : 1.15, 0, i ? -0.6 : 0.35]}>
      <mesh><torusGeometry args={[i ? 0.43 : 0.51, 0.012, 12, 128]} />
        <meshStandardMaterial color="#737373" metalness={1} roughness={0.23} /></mesh>
      <mesh><torusGeometry args={[i ? 0.446 : 0.526, 0.002, 8, 128]} />
        <meshStandardMaterial color="#dddddd" emissive="#ffffff" emissiveIntensity={0.25} metalness={0.8} roughness={0.3} /></mesh>
    </group>)}
    <mesh><sphereGeometry args={[0.035, 20, 20]} /><meshBasicMaterial color="#ffffff" /></mesh>
    <pointLight color="#ffffff" intensity={highlighted ? 0.55 : 0.3} distance={2} decay={2} />
  </group>;
}

function Ground({ isolated }: { isolated: boolean }) {
  const alpha = useMemo(() => {
    const data = new Uint8Array(128 * 128 * 4);
    for (let y = 0; y < 128; y++) for (let x = 0; x < 128; x++) {
      const r = Math.hypot(x - 63.5, y - 63.5) / 63.5;
      const v = Math.round((1 - THREE.MathUtils.smoothstep(r, 0.35, 1)) * 255);
      data.set([v, v, v, 255], (y * 128 + x) * 4);
    }
    const t = new THREE.DataTexture(data, 128, 128); t.needsUpdate = true; return t;
  }, []);
  useLayoutEffect(() => () => alpha.dispose(), [alpha]);
  return <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.026, 0]} receiveShadow>
      <planeGeometry args={[5, 5]} />
      <MeshReflectorMaterial color="#303030" metalness={0.5} roughness={0.35} transparent alphaMap={alpha} depthWrite={false} opacity={isolated ? 1 : 0.7} mirror={0.5} resolution={256} mixStrength={0.6} blur={[120, 40]} mixBlur={0.7} />
    </mesh>
    <ContactShadows position={[0, -0.024, 0]} opacity={0.8} scale={3.4} blur={2.8} far={1.9} resolution={256} frames={1} />
  </>;
}

// Development-only measurements; no helpers or audit state enter the production build.
function SceneAudit() {
  const { scene, camera, gl } = useThree();
  useFrame(() => {
    const base = scene.getObjectByName('stationary-foundation');
    const explorer = scene.getObjectByName('stationary-explorer');
    const artifact = scene.getObjectByName('suspended-artifact');
    if (!base || !explorer || !artifact) return;
    scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(base).union(new THREE.Box3().setFromObject(artifact));
    const corners = [];
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
      const p = new THREE.Vector3(x, y, z).project(camera); corners.push([p.x, p.y, p.z]);
    }
    gl.domElement.dataset.aboutAudit = JSON.stringify({
      foundation: base.position.toArray(), foundationRotation: base.rotation.toArray(),
      feetY: explorer.position.y, daisY: SURFACE, crystalY: artifact.position.y,
      camera: camera.position.toArray(), ring: base.getObjectByName('rotating-inner-ring')?.rotation.y,
      inFrame: corners.every(([x,y,z]) => Math.abs(x) < 1 && Math.abs(y) < 1 && Math.abs(z) < 1),
    });
  });
  return null;
}

export default function ChamberPlatformScene({ activeConceptIndex = null, reduced = false, isolatedMode = false, onPlatformHover }: {
  activeConceptIndex?: number | null; rippleTrigger?: number; reduced?: boolean; isolatedMode?: boolean; onPlatformHover?: () => void;
}) {
  const isolated = isolatedMode || new URLSearchParams(window.location.search).get('isolate') === 'about3d';
  return <div className={`about-platform-scene-wrapper ${isolated ? 'isolated-3d-mode' : ''}`} onPointerEnter={onPlatformHover}
    role="img" aria-label="Suspended silver crystal above one cloaked explorer on an inset mechanical floor; the inner rings turn slowly.">
    <Canvas camera={{ position: [0, 1.4, 4], fov: 34, near: 0.05, far: 30 }} shadows dpr={[1, 1.5]}
      gl={{ alpha: !isolated, antialias: true }}>
      {isolated && <color attach="background" args={['#080808']} />}
      <FittedCamera />
      {import.meta.env.DEV && new URLSearchParams(window.location.search).has("audit") && <SceneAudit />}
      <ambientLight intensity={0.32} />
      <directionalLight position={[2, 4, 1]} intensity={2.5} castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0002} />
      <spotLight position={[-1, 3, 2]} intensity={8} angle={0.45} penumbra={1} color="#ffffff" />
      <Suspense fallback={null}>
        <Environment resolution={128}>
          <Lightformer position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[3, 1, 1]} intensity={3} />
          <Lightformer position={[2, 1, 2]} rotation={[0, -Math.PI / 3, 0]} scale={[1, 4, 1]} intensity={2} />
          <Lightformer position={[-2, 1, 1]} rotation={[0, Math.PI / 3, 0]} scale={[0.4, 3, 1]} intensity={1.5} />
        </Environment>
        <Ground isolated={isolated} />
        <Platform reduced={reduced} />
        <Explorer />
        <Artifact reduced={reduced} highlighted={activeConceptIndex !== null} />
      </Suspense>
    </Canvas>
  </div>;
}
function createFacetedDiamondGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const segments = 8;
  const topY = 0.42;
  const upperY = 0.20;
  const upperR = 0.18;
  const midY = 0.0;
  const midR = 0.24;
  const lowerY = -0.20;
  const lowerR = 0.18;
  const botY = -0.42;

  const positions: number[] = [];

  const topPoint: [number, number, number] = [0, topY, 0];
  const botPoint: [number, number, number] = [0, botY, 0];
  const upperRing: [number, number, number][] = [];
  const midRing: [number, number, number][] = [];
  const lowerRing: [number, number, number][] = [];

  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const midAngle = angle + Math.PI / segments;
    upperRing.push([Math.cos(angle) * upperR, upperY, Math.sin(angle) * upperR]);
    midRing.push([Math.cos(midAngle) * midR, midY, Math.sin(midAngle) * midR]);
    lowerRing.push([Math.cos(angle) * lowerR, lowerY, Math.sin(angle) * lowerR]);
  }

  const addTri = (
    p1: [number, number, number],
    p2: [number, number, number],
    p3: [number, number, number]
  ) => {
    // Orient every facet outward. The original top/bottom fans faced inward,
    // which made metallic highlights and glass shading disagree across seams.
    const a = new THREE.Vector3(...p1), b = new THREE.Vector3(...p2), c = new THREE.Vector3(...p3);
    const normal = b.clone().sub(a).cross(c.clone().sub(a));
    const center = a.clone().add(b).add(c);
    positions.push(...p1, ...(normal.dot(center) < 0 ? p3 : p2), ...(normal.dot(center) < 0 ? p2 : p3));
  };

  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    // Top pyramid facets
    addTri(topPoint, upperRing[i], upperRing[next]);
    // Upper transition facets
    addTri(upperRing[i], midRing[i], upperRing[next]);
    addTri(upperRing[next], midRing[i], midRing[next]);
    // Lower transition facets
    addTri(midRing[i], lowerRing[i], midRing[next]);
    addTri(midRing[next], lowerRing[i], lowerRing[next]);
    // Bottom pyramid facets
    addTri(botPoint, lowerRing[next], lowerRing[i]);
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}
