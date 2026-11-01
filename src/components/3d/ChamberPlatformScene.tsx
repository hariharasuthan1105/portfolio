/// <reference types="vite/client" />
import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, Environment, Lightformer, useTexture } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// COORDINATE SYSTEM & FRUSTUM BOUNDS
// Ground plane = 0, Inset foundation base = -0.01,
// Dais surface / character boots = 0.065, Crystal center = 1.62 (float ±0.018).
// ============================================================================
const SURFACE = 0.065;
const BOUNDS = new THREE.Box3(
  new THREE.Vector3(-1.45, -0.05, -1.45),
  new THREE.Vector3(1.45, 2.45, 1.45)
);

// ============================================================================
// CAMERA CONTROLLER WITH CALIBRATED ASPECT-RATIO FIT
// ============================================================================
function FittedCamera() {
  const { camera, size } = useThree();

  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const target = new THREE.Vector3(0, 1.14, 0);
    // Low viewpoint matches the cathedral's distant floor perspective
    const direction = new THREE.Vector3(0, 0.10, 1).normalize();
    const right = new THREE.Vector3(1, 0, 0);
    const up = new THREE.Vector3().crossVectors(direction, right);
    const tanV = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2));
    const tanH = (tanV * size.width) / size.height;

    let distance = 0;
    for (const x of [BOUNDS.min.x, BOUNDS.max.x]) {
      for (const y of [BOUNDS.min.y, BOUNDS.max.y]) {
        for (const z of [BOUNDS.min.z, BOUNDS.max.z]) {
          const p = new THREE.Vector3(x, y, z).sub(target);
          const d =
            p.dot(direction) +
            Math.max(Math.abs(p.dot(right)) / tanH, Math.abs(p.dot(up)) / tanV) * 1.05;
          distance = Math.max(distance, d);
        }
      }
    }

    cam.position.copy(target).addScaledVector(direction, distance);
    cam.lookAt(target);
    cam.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

// ============================================================================
// BEVELED METALLIC RIM WITH OPTIONAL SPECULAR / GLOW ACCENT
// ============================================================================
function Rim({
  radius,
  y,
  glow = false,
  thickness = 0.008,
}: {
  radius: number;
  y: number;
  glow?: boolean;
  thickness?: number;
}) {
  return (
    <mesh position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, thickness, 12, 128]} />
      <meshStandardMaterial
        color={glow ? "#ffffff" : "#44444a"}
        metalness={0.95}
        roughness={0.2}
        emissive={glow ? "#ffffff" : "#000000"}
        emissiveIntensity={glow ? 0.65 : 0}
      />
    </mesh>
  );
}

// ============================================================================
// ROTATING CONCENTRIC MECHANICAL TRACKS (INNER DISCS ONLY)
// ============================================================================
function MechanicalRing({
  radius,
  speed,
  reduced,
  slotCount = 48,
}: {
  radius: number;
  speed: number;
  reduced: boolean;
  slotCount?: number;
}) {
  const ring = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    if (ring.current && !reduced) {
      ring.current.rotation.y += Math.min(dt, 0.05) * speed;
    }
  });

  return (
    <group ref={ring} name="rotating-inner-ring">
      <Rim radius={radius} y={0.042} thickness={0.007} />
      <Rim radius={radius - 0.022} y={0.044} glow thickness={0.002} />
      {/* Fine silver engraved ticks & radial markings */}
      {Array.from({ length: slotCount }, (_, i) => {
        const a = (i * Math.PI * 2) / slotCount;
        const isMajor = i % 4 === 0;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(a) * (radius - 0.046),
              0.045,
              Math.sin(a) * (radius - 0.046),
            ]}
            rotation={[0, -a, 0]}
          >
            <boxGeometry args={[isMajor ? 0.038 : 0.018, 0.001, 0.0035]} />
            <meshStandardMaterial
              color={isMajor ? "#e8e8ea" : "#888892"}
              metalness={0.88}
              roughness={0.25}
              emissive={isMajor ? "#ffffff" : "#000000"}
              emissiveIntensity={isMajor ? 0.45 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// ============================================================================
// MONUMENTAL EMBEDDED PLATFORM (MATCHING TARGET IMAGE 2)
// Outer foundation sits flush in the polished floor with segmented glowing slots.
// ============================================================================
function Platform({ reduced }: { reduced: boolean }) {
  // Outer perimeter segmented glow blocks matching Image 2
  const outerSlits = useMemo(() => {
    const items = [];
    const count = 36;
    const r = 1.35;
    for (let i = 0; i < count; i++) {
      const a = (i * Math.PI * 2) / count;
      items.push({
        position: [Math.cos(a) * r, 0.018, Math.sin(a) * r] as [number, number, number],
        rotation: [0, -a, 0] as [number, number, number],
      });
    }
    return items;
  }, []);

  return (
    <group name="stationary-foundation">
      {/* 1. Deep embedded outer foundation cylinder */}
      <mesh position={[0, 0.010, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.40, 1.46, 0.045, 128]} />
        <meshStandardMaterial
          color="#181820"
          metalness={0.94}
          roughness={0.18}
        />
      </mesh>

      {/* 2. Outer beveled perimeter rim */}
      <Rim radius={1.405} y={0.026} thickness={0.01} />
      <Rim radius={1.435} y={0.010} thickness={0.006} />

      {/* 3. Recessed segmented perimeter glow slots (Reference-Exact) */}
      <group>
        {outerSlits.map((item, i) => (
          <mesh key={i} position={item.position} rotation={item.rotation}>
            <boxGeometry args={[0.046, 0.009, 0.018]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={1.3}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* 4. Intermediate stepped tier */}
      <mesh position={[0, 0.028, 0]} receiveShadow>
        <cylinderGeometry args={[1.20, 1.25, 0.03, 128]} />
        <meshStandardMaterial color="#22222a" metalness={0.90} roughness={0.22} />
      </mesh>
      <Rim radius={1.21} y={0.040} glow thickness={0.003} />
      <Rim radius={1.29} y={0.028} glow thickness={0.002} />

      {/* 5. Three rotating concentric mechanical tracks */}
      <MechanicalRing radius={1.10} speed={-0.035} slotCount={56} reduced={reduced} />
      <MechanicalRing radius={0.86} speed={0.04} slotCount={44} reduced={reduced} />
      <MechanicalRing radius={0.64} speed={-0.048} slotCount={32} reduced={reduced} />

      {/* 6. Stationary central dais (Where character stands firmly) */}
      <mesh position={[0, 0.048, 0]} receiveShadow>
        <cylinderGeometry args={[0.40, 0.42, 0.038, 96]} />
        <meshStandardMaterial color="#141418" metalness={0.94} roughness={0.15} />
      </mesh>
      {/* Dais surface luminous contact ring */}
      <Rim radius={0.405} y={SURFACE} glow thickness={0.0035} />

      {/* 7. Subtle floor mist rings drifting around the base */}
      <group position={[0, 0.004, 0]}>
        {[0, 1, 2].map((idx) => (
          <mesh
            key={idx}
            rotation={[-Math.PI / 2, 0, (idx * Math.PI) / 3]}
            position={[0, 0.002 * idx, 0]}
          >
            <ringGeometry args={[1.42 + idx * 0.12, 1.85 + idx * 0.16, 64]} />
            <meshBasicMaterial
              color="#e0e4f4"
              transparent
              opacity={0.055 - idx * 0.012}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ============================================================================
// THE CLOAKED EXPLORER CHARACTER (STATIONARY & PROPERLY GROUNDED)
// ============================================================================
function Explorer() {
  const texture = useTexture("/assets/chamber_character.png");
  texture.colorSpace = THREE.SRGBColorSpace;
  // Boots calibrated at x=118, standing firmly on dais at y = SURFACE
  const h = 0.90;
  const w = (h * 230) / 220;

  return (
    <group name="stationary-explorer" position={[0, SURFACE, 0.04]}>
      <mesh position={[((115 - 118) / 230) * w, h / 2, 0]} castShadow>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.15}
          roughness={0.88}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Soft circular contact shadow anchoring feet firmly on the dais */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[0.26, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.75}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// SUSPENDED CRYSTALLINE INTELLIGENCE ARTIFACT & 3D ORBITAL RINGS
// ============================================================================
function Artifact({
  reduced,
  highlighted,
}: {
  reduced: boolean;
  highlighted: boolean;
}) {
  const crystal = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const orbitA = useRef<THREE.Group>(null);
  const orbitB = useRef<THREE.Group>(null);
  const orbitC = useRef<THREE.Group>(null);
  const time = useRef(0);
  const geometry = useMemo(createFacetedDiamondGeometry, []);

  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

  useLayoutEffect(() => {
    return () => {
      geometry.dispose();
      edgesGeometry.dispose();
    };
  }, [geometry, edgesGeometry]);

  useFrame((_, dt) => {
    if (reduced) return;
    const delta = Math.min(dt, 0.05);
    time.current += delta;
    if (crystal.current) {
      crystal.current.position.y = 1.62 + Math.sin(time.current * 0.65) * 0.018;
    }
    if (body.current) body.current.rotation.y += delta * 0.12;
    if (orbitA.current) orbitA.current.rotation.y += delta * 0.08;
    if (orbitB.current) orbitB.current.rotation.y -= delta * 0.095;
    if (orbitC.current) orbitC.current.rotation.z += delta * 0.065;
  });

  // Constellation particles around the crystal
  const starNodes = useMemo(() => {
    const nodes = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 0.65 + Math.random() * 0.45;
      nodes.push([
        r * Math.sin(phi) * Math.cos(theta),
        (r * Math.sin(phi) * Math.sin(theta)) * 0.75,
        r * Math.cos(phi),
      ] as [number, number, number]);
    }
    return nodes;
  }, []);

  return (
    <group name="suspended-artifact" ref={crystal} position={[0, 1.62, 0]} scale={1.55}>
      {/* 1. Outer Faceted Diamond Crystal Shell with Razor-Sharp Silver Edges */}
      <group>
        <mesh ref={body} geometry={geometry}>
          <meshPhysicalMaterial
            color="#f4f6fa"
            transparent
            opacity={0.65}
            depthWrite={false}
            metalness={0.22}
            roughness={0.06}
            transmission={0.65}
            thickness={0.65}
            ior={2.42}
            clearcoat={1}
            clearcoatRoughness={0.06}
            flatShading
            side={THREE.DoubleSide}
          />
        </mesh>
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial color="#ffffff" transparent opacity={0.45} />
        </lineSegments>
      </group>

      {/* 2. High-Intensity Glowing Inner Core */}
      <mesh scale={[0.22, 0.48, 0.22]}>
        <octahedronGeometry args={[0.28]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={highlighted ? 1.9 : 1.35}
          metalness={0.1}
          roughness={0.05}
        />
      </mesh>

      {/* 3. Central Sparkling Star Spark */}
      <mesh>
        <sphereGeometry args={[0.075, 24, 24]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 4. Three Dimensional Beveled Chrome Orbital Rings (Reference-Exact) */}
      {/* Ring A — Primary Tilted Ring */}
      <group ref={orbitA} rotation={[0.88, 0, 0.38]}>
        <mesh>
          <torusGeometry args={[0.58, 0.022, 20, 128]} />
          <meshStandardMaterial color="#9ea3af" metalness={0.98} roughness={0.14} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.603, 0.0035, 8, 128]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Ring B — Counter-Tilted Outer Ring */}
      <group ref={orbitB} rotation={[0.40, 0, -0.68]}>
        <mesh>
          <torusGeometry args={[0.72, 0.024, 20, 128]} />
          <meshStandardMaterial color="#9499a6" metalness={0.98} roughness={0.15} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.745, 0.0038, 8, 128]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.45}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Ring C — Additional Angled Orbital Ring */}
      <group ref={orbitC} rotation={[-0.68, 0, 0.48]}>
        <mesh>
          <torusGeometry args={[0.46, 0.018, 20, 128]} />
          <meshStandardMaterial color="#aab0be" metalness={0.97} roughness={0.16} />
        </mesh>
        <mesh>
          <torusGeometry args={[0.478, 0.003, 8, 128]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.35}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* 5. Constellation of Orbiting Silver Data Points */}
      <group>
        {starNodes.map((pos, i) => (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[0.012, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>

      {/* 6. Central Point Light Casting Glow on Rings and Character */}
      <pointLight
        color="#ffffff"
        intensity={highlighted ? 1.2 : 0.8}
        distance={3.2}
        decay={2}
      />
    </group>
  );
}

// ============================================================================
// POLISHED OBSIDIAN WET REFLECTIVE GROUND
// ============================================================================
function Ground({ isolated }: { isolated: boolean }) {
  const alpha = useMemo(() => {
    const size = 256;
    const data = new Uint8Array(size * size * 4);
    const center = size / 2 - 0.5;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const r = Math.hypot(x - center, y - center) / center;
        const falloff = 1 - THREE.MathUtils.smoothstep(r, 0.15, 0.82);
        const v = Math.round(falloff * 255);
        data.set([v, v, v, 255], (y * size + x) * 4);
      }
    }
    const t = new THREE.DataTexture(data, size, size);
    t.needsUpdate = true;
    return t;
  }, []);

  useLayoutEffect(() => () => alpha.dispose(), [alpha]);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[4.8, 64]} />
        <MeshReflectorMaterial
          color="#0c0d12"
          metalness={0.92}
          roughness={0.18}
          transparent
          alphaMap={alpha}
          depthWrite={false}
          opacity={isolated ? 1 : 0.85}
          mirror={0.72}
          resolution={256}
          mixStrength={1.4}
          blur={[80, 25]}
          mixBlur={0.65}
        />
      </mesh>
      {/* Soft circular ground contact shadow disc smoothly fading to rim */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.006, 0]}>
        <circleGeometry args={[1.75, 64]} />
        <meshBasicMaterial
          map={alpha}
          color="#000000"
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

// ============================================================================
// SCENE AUDIT HELPER (DEV-ONLY: REMOVED IN PRODUCTION BUILDS)
// ============================================================================
function SceneAudit() {
  const { scene, camera, gl } = useThree();

  useFrame(() => {
    const base = scene.getObjectByName("stationary-foundation");
    const explorer = scene.getObjectByName("stationary-explorer");
    const artifact = scene.getObjectByName("suspended-artifact");
    if (!base || !explorer || !artifact) return;

    scene.updateMatrixWorld(true);
    const bounds = new THREE.Box3()
      .setFromObject(base)
      .union(new THREE.Box3().setFromObject(artifact));
    const corners = [];
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) {
          const p = new THREE.Vector3(x, y, z).project(camera);
          corners.push([p.x, p.y, p.z]);
        }
      }
    }

    gl.domElement.dataset.aboutAudit = JSON.stringify({
      foundation: base.position.toArray(),
      foundationRotation: base.rotation.toArray(),
      feetY: explorer.position.y,
      daisY: SURFACE,
      crystalY: artifact.position.y,
      camera: camera.position.toArray(),
      ring: base.getObjectByName("rotating-inner-ring")?.rotation.y,
      inFrame: corners.every(
        ([x, y, z]) => Math.abs(x) < 1 && Math.abs(y) < 1 && Math.abs(z) < 1
      ),
    });
  });

  return null;
}

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================
export default function ChamberPlatformScene({
  activeConceptIndex = null,
  reduced = false,
  isolatedMode = false,
  onPlatformHover,
}: {
  activeConceptIndex?: number | null;
  rippleTrigger?: number;
  reduced?: boolean;
  isolatedMode?: boolean;
  onPlatformHover?: () => void;
}) {
  const isolated =
    isolatedMode ||
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("isolate") === "about3d");

  return (
    <div
      className={`about-platform-scene-wrapper ${isolated ? "isolated-3d-mode" : ""}`}
      onPointerEnter={onPlatformHover}
      role="img"
      aria-label="Suspended silver crystal and metallic orbital rings above one cloaked explorer on an embedded mechanical floor."
    >
      <Canvas
        camera={{ position: [0, 1.4, 4], fov: 34, near: 0.05, far: 35 }}
        shadows
        dpr={[1, 1.5]}
        gl={{ alpha: !isolated, antialias: true }}
      >
        {isolated && <color attach="background" args={["#08080c"]} />}
        <FittedCamera />
        {import.meta.env.DEV &&
          typeof window !== "undefined" &&
          new URLSearchParams(window.location.search).has("audit") && (
            <SceneAudit />
          )}

        {/* Ambient & Directional Lighting matching cathedral overhead beams */}
        <ambientLight intensity={0.4} color="#b0b5c5" />
        {/* Overhead key light from the circular chandelier oculus */}
        <directionalLight
          position={[0, 4.5, 0.5]}
          intensity={3.8}
          color="#ffffff"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0002}
        />
        {/* Fill spotlights creating dramatic specular highlights on chrome rings */}
        <spotLight
          position={[-2.5, 3.5, 2.5]}
          intensity={6.0}
          angle={0.5}
          penumbra={0.8}
          color="#ffffff"
        />
        <spotLight
          position={[2.5, 3.5, 2.5]}
          intensity={6.0}
          angle={0.5}
          penumbra={0.8}
          color="#d0d5e5"
        />

        <Suspense fallback={null}>
          <Environment resolution={128}>
            <Lightformer
              position={[0, 4, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[4, 2, 1]}
              intensity={3.5}
            />
            <Lightformer
              position={[2, 2, 2]}
              rotation={[0, -Math.PI / 3, 0]}
              scale={[1.5, 4, 1]}
              intensity={2}
            />
            <Lightformer
              position={[-2, 2, 1]}
              rotation={[0, Math.PI / 3, 0]}
              scale={[0.8, 3, 1]}
              intensity={1.8}
            />
          </Environment>

          <Ground isolated={isolated} />
          <Platform reduced={reduced} />
          <Explorer />
          <Artifact
            reduced={reduced}
            highlighted={activeConceptIndex !== null}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// ============================================================================
// FACETED BIPYRAMIDAL DIAMOND GEOMETRY
// ============================================================================
function createFacetedDiamondGeometry(): THREE.BufferGeometry {
  const geom = new THREE.BufferGeometry();
  const segments = 8;
  const topY = 0.44;
  const upperY = 0.22;
  const upperR = 0.20;
  const midY = 0.0;
  const midR = 0.26;
  const lowerY = -0.22;
  const lowerR = 0.20;
  const botY = -0.44;

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
    const a = new THREE.Vector3(...p1);
    const b = new THREE.Vector3(...p2);
    const c = new THREE.Vector3(...p3);
    const normal = b.clone().sub(a).cross(c.clone().sub(a));
    const center = a.clone().add(b).add(c);
    positions.push(
      ...p1,
      ...(normal.dot(center) < 0 ? p3 : p2),
      ...(normal.dot(center) < 0 ? p2 : p3)
    );
  };

  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    addTri(topPoint, upperRing[i], upperRing[next]);
    addTri(upperRing[i], midRing[i], upperRing[next]);
    addTri(upperRing[next], midRing[i], midRing[next]);
    addTri(midRing[i], lowerRing[i], midRing[next]);
    addTri(midRing[next], lowerRing[i], lowerRing[next]);
    addTri(botPoint, lowerRing[next], lowerRing[i]);
  }

  geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geom.computeVertexNormals();
  return geom;
}
