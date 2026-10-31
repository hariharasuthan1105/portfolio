import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// EXHIBIT 01: DOCRECON — ADVANCED DOCUMENT INTELLIGENCE
// Layered floating document sheets, OCR scan lines, field boxes, silver frames
// ============================================================================
function DocReconExhibit({
  isSelected,
  isDimmed,
  position = [-2.25, -0.48, 0],
}: {
  isSelected: boolean;
  isDimmed: boolean;
  position?: [number, number, number];
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Group>(null);
  const scanLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Subtle idle floating & gyroscopic hover
    if (groupRef.current) {
      groupRef.current.position.y = (position[1] + 0.45) + Math.sin(t * 0.9) * 0.035;
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.06 - 0.08;
    }

    // Smooth volumetric OCR scan line movement
    if (scanLineRef.current) {
      const scanY = Math.sin(t * 1.8) * 0.52;
      scanLineRef.current.position.y = scanY;
      if (scanLightRef.current) {
        scanLightRef.current.intensity = isSelected ? 4.0 : 2.2 + Math.sin(t * 4.0) * 0.6;
      }
    }
  });

  return (
    <group position={[position[0], position[1] + 0.45, position[2]]}>
      <group ref={groupRef}>
        {/* Layer 3: Back Sheet (Translucent Obsidian Glass) */}
        <group position={[0.1, 0.12, -0.22]} rotation={[0.06, -0.1, 0.04]}>
          <mesh>
            <planeGeometry args={[1.05, 1.45]} />
            <meshPhysicalMaterial
              color="#07070b"
              roughness={0.18}
              transmission={0.72}
              transparent
              opacity={0.65}
              metalness={0.6}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.05, 1.45)]} />
            <lineBasicMaterial color="#555560" transparent opacity={0.5} />
          </lineSegments>
        </group>

        {/* Layer 2: Mid Sheet (Fanned Translucent Parchment) */}
        <group position={[-0.08, 0.06, -0.1]} rotation={[0.03, 0.08, -0.02]}>
          <mesh>
            <planeGeometry args={[1.1, 1.5]} />
            <meshPhysicalMaterial
              color="#090910"
              roughness={0.14}
              transmission={0.8}
              transparent
              opacity={0.78}
              metalness={0.7}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 1.5)]} />
            <lineBasicMaterial color="#787884" transparent opacity={0.65} />
          </lineSegments>
        </group>

        {/* Layer 1: Front Primary Invoice Document */}
        <group position={[0, 0, 0]} rotation={[0.04, -0.05, 0.015]}>
          {/* Main Translucent Glass Sheet */}
          <mesh>
            <planeGeometry args={[1.16, 1.58]} />
            <meshPhysicalMaterial
              color="#0b0b14"
              roughness={0.08}
              metalness={0.4}
              transmission={0.88}
              transparent
              opacity={0.92}
              clearcoat={1.0}
              clearcoatRoughness={0.06}
              reflectivity={0.94}
            />
          </mesh>

          {/* Polished Silver Frame Border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.16, 1.58)]} />
            <lineBasicMaterial
              color={isSelected ? "#ffffff" : "#9898a4"}
              transparent
              opacity={isSelected ? 1.0 : 0.85}
            />
          </lineSegments>

          {/* Invoice Structure Geometry: Header Banner */}
          <mesh position={[0, 0.58, 0.015]}>
            <planeGeometry args={[0.94, 0.09]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.45} />
          </mesh>
          {/* Company Brand Logo Box */}
          <mesh position={[-0.36, 0.58, 0.02]}>
            <planeGeometry args={[0.15, 0.06]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
          {/* Barcode Strip */}
          <mesh position={[0.35, 0.58, 0.02]}>
            <planeGeometry args={[0.15, 0.06]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
          </mesh>

          {/* Metadata Divider Rule */}
          <mesh position={[0, 0.46, 0.015]}>
            <planeGeometry args={[0.94, 0.008]} />
            <meshBasicMaterial color="#888892" transparent opacity={0.65} />
          </mesh>

          {/* Table Header Row */}
          <mesh position={[0, 0.28, 0.015]}>
            <planeGeometry args={[0.94, 0.06]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.28} />
          </mesh>

          {/* Itemized Table Rows */}
          {[-0.2, -0.06, 0.08, 0.2].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.015]}>
              <planeGeometry args={[0.94, 0.006]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
            </mesh>
          ))}

          {/* Table Column Dividers */}
          {[-0.16, 0.16].map((x, idx) => (
            <mesh key={idx} position={[x, 0.02, 0.015]}>
              <planeGeometry args={[0.005, 0.52]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.32} />
            </mesh>
          ))}

          {/* Total & Verification Stamp Block */}
          <mesh position={[0.26, -0.44, 0.015]}>
            <planeGeometry args={[0.42, 0.1]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>

          {/* Octagonal Verification Seal */}
          <mesh position={[-0.26, -0.44, 0.02]} rotation={[0, 0, Math.PI / 8]}>
            <ringGeometry args={[0.085, 0.095, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>

          {/* OCR BOUNDING BOXES */}
          {/* Box 1: Header ID */}
          <group position={[-0.04, 0.46, 0.03]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.44, 0.07)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.95} />
            </lineSegments>
          </group>

          {/* Box 2: Line Items */}
          <group position={[-0.1, 0.08, 0.03]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.64, 0.08)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.95} />
            </lineSegments>
          </group>

          {/* Box 3: Total Balance */}
          <group position={[0.26, -0.44, 0.035]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.4, 0.09)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={1.0} />
            </lineSegments>
          </group>

          {/* VOLUMETRIC OCR LASER SCANNER ASSEMBLY */}
          <group ref={scanLineRef} position={[0, 0, 0.04]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.006, 0.006, 1.25, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[0, -0.045, 0]}>
              <planeGeometry args={[1.24, 0.09]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.38}
                side={THREE.DoubleSide}
              />
            </mesh>
            <pointLight
              ref={scanLightRef}
              color="#ffffff"
              intensity={2.8}
              distance={1.1}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// EXHIBIT 02: PATHWAY AI — MINIATURE SMART CITY & RETRIEVAL ORB
// Stepped tower clusters, rooftop spires, sensor nodes, celestial retrieval orb
// ============================================================================
function PathwayAIExhibit({
  isSelected,
  isDimmed,
  position = [0.00, -0.48, 0],
}: {
  isSelected: boolean;
  isDimmed: boolean;
  position?: [number, number, number];
}) {
  const cityRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // 13-Building Detailed Futuristic Skyscraper Cluster
  const buildings = useMemo(() => {
    return [
      // Outer perimeter towers
      { x: -0.38, z: -0.28, h: 0.75, w: 0.16, d: 0.16, tiers: 1 },
      { x: -0.18, z: -0.32, h: 1.10, w: 0.18, d: 0.18, tiers: 2 },
      { x: 0.16, z: -0.30, h: 0.95, w: 0.17, d: 0.17, tiers: 1 },
      { x: 0.38, z: -0.25, h: 0.70, w: 0.15, d: 0.15, tiers: 1 },
      // Mid ring towers
      { x: -0.42, z: 0.02, h: 0.65, w: 0.15, d: 0.15, tiers: 1 },
      { x: 0.40, z: 0.05, h: 0.80, w: 0.16, d: 0.16, tiers: 1 },
      // Front row towers
      { x: -0.30, z: 0.28, h: 0.55, w: 0.15, d: 0.15, tiers: 1 },
      { x: -0.08, z: 0.30, h: 0.90, w: 0.18, d: 0.18, tiers: 2 },
      { x: 0.22, z: 0.26, h: 0.60, w: 0.16, d: 0.16, tiers: 1 },
      // Flanking tall spires
      { x: -0.22, z: -0.05, h: 1.25, w: 0.20, d: 0.20, tiers: 2 },
      { x: 0.20, z: -0.04, h: 1.20, w: 0.19, d: 0.19, tiers: 2 },
      // Center Iconic Landmark Spire
      { x: 0.00, z: -0.02, h: 1.55, w: 0.24, d: 0.24, tiers: 3 },
    ];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Gentle city rotation
    if (cityRef.current) {
      cityRef.current.rotation.y = t * 0.06;
    }

    // Celestial retrieval orb floating & gyroscopic orbit
    if (globeRef.current) {
      globeRef.current.position.y = 1.95 + Math.sin(t * 1.1) * 0.035;
      globeRef.current.rotation.y -= delta * 0.3;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.35;
      ring2Ref.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group position={[position[0], position[1] + 0.1, position[2]]}>
      {/* 3D Smart City Cluster */}
      <group ref={cityRef} position={[0, 0, 0]}>
        {buildings.map((b, i) => (
          <group key={i} position={[b.x, 0, b.z]}>
            {/* Primary Building Body */}
            <mesh position={[0, b.h / 2, 0]}>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial
                color="#08080f"
                roughness={0.15}
                metalness={0.95}
              />
            </mesh>
            {/* Building Edge Silver Outlines */}
            <lineSegments position={[0, b.h / 2, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(b.w, b.h, b.d)]} />
              <lineBasicMaterial
                color={isSelected ? "#ffffff" : "#656570"}
                transparent
                opacity={0.7}
              />
            </lineSegments>

            {/* Stepped Setback Tier */}
            {b.tiers >= 2 && (
              <group position={[0, b.h + 0.08, 0]}>
                <mesh>
                  <boxGeometry args={[b.w * 0.72, 0.16, b.d * 0.72]} />
                  <meshStandardMaterial
                    color="#14141e"
                    roughness={0.16}
                    metalness={0.92}
                  />
                </mesh>
                <lineSegments>
                  <edgesGeometry args={[new THREE.BoxGeometry(b.w * 0.72, 0.16, b.d * 0.72)]} />
                  <lineBasicMaterial color="#90909c" transparent opacity={0.75} />
                </lineSegments>
              </group>
            )}

            {/* Rooftop Needle Spire & Beacon */}
            <mesh position={[0, b.tiers >= 2 ? b.h + 0.22 : b.h + 0.04, 0]}>
              <cylinderGeometry args={[0.003, 0.007, 0.12, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>

            {/* Sensor Node Beacon Pulse */}
            <mesh position={[0, b.tiers >= 2 ? b.h + 0.28 : b.h + 0.1, 0]}>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        ))}

        {/* Ground Optical Data Vectors */}
        {[-0.22, 0, 0.22].map((offsetZ, idx) => (
          <mesh
            key={idx}
            position={[0, 0.01, offsetZ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.9, 0.012]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
          </mesh>
        ))}
      </group>

      {/* FLOATING HOLOGRAPHIC CELESTIAL RETRIEVAL ORB */}
      <group ref={globeRef} position={[0, 1.95, -0.02]}>
        {/* Outer Geodesic Lattice */}
        <mesh>
          <icosahedronGeometry args={[0.28, 2]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Inner Glowing Crystal Core */}
        <mesh>
          <octahedronGeometry args={[0.14, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.08}
            metalness={0.95}
            transmission={0.65}
          />
        </mesh>

        {/* Equatorial Orbital Ring 1 */}
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.38, 0.007, 8, 36]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>

        {/* Equatorial Orbital Ring 2 */}
        <mesh ref={ring2Ref} rotation={[-Math.PI / 4, 0, Math.PI / 6]}>
          <torusGeometry args={[0.46, 0.005, 8, 36]} />
          <meshBasicMaterial color="#c0c0cc" transparent opacity={0.6} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================================
// EXHIBIT 03: HEFIN — DECENTRALIZED AI / DISTRIBUTED INTELLIGENCE
// Polished black-glass central intelligence core, orbiting satellite nodes, network pulses
// ============================================================================
function HefinExhibit({
  isSelected,
  isDimmed,
  position = [2.25, -0.48, 0],
}: {
  isSelected: boolean;
  isDimmed: boolean;
  position?: [number, number, number];
}) {
  const modelRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const cageRef = useRef<THREE.Mesh>(null);
  const pulseGroupRef = useRef<THREE.Group>(null);

  // 8 Satellite Peer Node Coordinates
  const satellites = useMemo(() => {
    return [
      [-0.68, 0.52, 0.32],
      [0.72, 0.46, -0.26],
      [-0.55, -0.38, -0.42],
      [0.64, -0.48, 0.35],
      [0, 0.78, -0.18],
      [-0.72, -0.05, -0.35],
      [0.58, 0.12, 0.52],
      [-0.15, -0.65, 0.28],
    ];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRefCurrent(modelRef)) {
      modelRef.current!.position.y = (position[1] + 0.45) + Math.sin(t * 0.85 + 2) * 0.035;
      modelRef.current!.rotation.y = Math.sin(t * 0.35) * 0.08 + 0.1;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.25;
      coreRef.current.rotation.y += delta * 0.35;
    }
    if (cageRef.current) {
      cageRef.current.rotation.x -= delta * 0.18;
      cageRef.current.rotation.z += delta * 0.28;
    }

    // Traveling Data Pulses traversing network struts
    if (pulseGroupRef.current) {
      pulseGroupRef.current.children.forEach((child, idx) => {
        const dest = satellites[idx];
        if (!dest) return;
        const progress = (Math.sin(t * 2.4 + idx * 0.9) + 1) / 2;
        child.position.set(
          dest[0] * progress,
          0.2 + (dest[1] - 0.2) * progress,
          dest[2] * progress
        );
      });
    }
  });

  function groupRefCurrent(ref: React.RefObject<THREE.Group | null>): boolean {
    return !!ref.current;
  }

  return (
    <group position={[position[0], position[1] + 0.45, position[2]]}>
      <group ref={modelRef}>
        {/* Faceted Black-Glass Central Core */}
        <mesh ref={coreRef} position={[0, 0.2, 0]}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshPhysicalMaterial
            color="#06060c"
            roughness={0.05}
            metalness={0.98}
            transmission={0.88}
            transparent
            opacity={0.92}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
            reflectivity={0.98}
          />
        </mesh>

        {/* Inner Reflective Silver Diamond */}
        <mesh position={[0, 0.2, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>

        {/* Outer Wireframe Lattice Cage */}
        <mesh ref={cageRef} position={[0, 0.2, 0]}>
          <icosahedronGeometry args={[0.62, 0]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.75}
          />
        </mesh>

        {/* Network Constellation Struts */}
        {satellites.map((pos, idx) => {
          const start = new THREE.Vector3(0, 0.2, 0);
          const end = new THREE.Vector3(...(pos as [number, number, number]));
          const lineGeom = new THREE.BufferGeometry().setFromPoints([start, end]);
          const lineMat = new THREE.LineBasicMaterial({
            color: isSelected ? "#ffffff" : "#72727e",
            transparent: true,
            opacity: isSelected ? 0.8 : 0.5,
          });
          const lineObj = new THREE.Line(lineGeom, lineMat);

          return <primitive key={idx} object={lineObj} />;
        })}

        {/* 8 Orbiting Satellite Node Cubes */}
        {satellites.map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            <mesh>
              <boxGeometry args={[0.13, 0.13, 0.13]} />
              <meshStandardMaterial
                color="#12121c"
                roughness={0.15}
                metalness={0.95}
              />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.13, 0.13, 0.13)]} />
              <lineBasicMaterial color="#ffffff" transparent opacity={0.8} />
            </lineSegments>
          </group>
        ))}

        {/* Luminous Silver Network Pulses */}
        <group ref={pulseGroupRef}>
          {satellites.map((_, idx) => (
            <mesh key={idx}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// SUBTLE FLOATING PARTICLES & BASE GLOW
// ============================================================================
function ArchiveParticles({ count = 55 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 8.0;
      coords[i * 3 + 1] = Math.random() * 4.2 - 1.2;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
    }
    return coords;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] += 0.003;
      if (positions[i * 3 + 1] > 3.6) {
        positions[i * 3 + 1] = -1.2;
      }
      positions[i * 3] += Math.sin(t * 0.4 + i) * 0.0008;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.032}
        color="#e0e0ea"
        transparent
        opacity={0.42}
        sizeAttenuation
      />
    </points>
  );
}

function ExhibitBaseGlow({ position }: { position: [number, number, number] }) {
  return (
    <group position={[position[0], position[1] + 0.02, position[2]]}>
      {/* Soft circular ground halo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.85, 32]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Outer faint technical ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.84, 0.88, 48]} />
        <meshBasicMaterial
          color="#90909c"
          transparent
          opacity={0.22}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// MAIN ARCHIVE GALLERY 3D SCENE
// ============================================================================
export default function ArchiveGalleryScene({
  selectedProjectIndex,
  onSelectProject,
  reduced = false,
}: {
  selectedProjectIndex: number | null;
  onSelectProject: (index: number) => void;
  reduced?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const activeMobileIndex = selectedProjectIndex ?? 0;
  const docReconPos: [number, number, number] = isMobile
    ? [(0 - activeMobileIndex) * 4.2, -0.2, 0]
    : [-2.25, -0.48, 0];
  const pathwayPos: [number, number, number] = isMobile
    ? [(1 - activeMobileIndex) * 4.2, -0.2, 0]
    : [0.0, -0.48, 0];
  const hefinPos: [number, number, number] = isMobile
    ? [(2 - activeMobileIndex) * 4.2, -0.2, 0]
    : [2.25, -0.48, 0];

  return (
    <div className="archive-canvas-wrapper" aria-hidden="false">
      <Canvas
        camera={{
          position: [0, 0.1, isMobile ? 5.2 : 6.2],
          fov: isMobile ? 44 : 40,
        }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="archive-three-canvas"
      >
        <ambientLight intensity={0.85} />

        {/* Overhead Volumetric God Rays */}
        <directionalLight position={[0, 8, 3]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[-6, 3, 2]} intensity={1.2} color="#90909c" />
        <directionalLight position={[6, 3, 2]} intensity={1.2} color="#90909c" />

        {/* Exhibit 01 Spotlight (DocRecon) */}
        <spotLight
          position={isMobile ? [docReconPos[0], 3.5, 2] : [-2.25, 3.5, 2]}
          target-position={[docReconPos[0], 0, 0]}
          intensity={selectedProjectIndex === 0 ? 12.0 : 4.5}
          color="#ffffff"
          angle={0.48}
          penumbra={0.65}
        />

        {/* Exhibit 02 Spotlight (Pathway AI) */}
        <spotLight
          position={isMobile ? [pathwayPos[0], 3.8, 2] : [0.0, 3.8, 2]}
          target-position={[pathwayPos[0], 0.2, 0]}
          intensity={selectedProjectIndex === 1 ? 12.0 : 4.5}
          color="#ffffff"
          angle={0.48}
          penumbra={0.65}
        />

        {/* Exhibit 03 Spotlight (HEFIN) */}
        <spotLight
          position={isMobile ? [hefinPos[0], 3.5, 2] : [2.25, 3.5, 2]}
          target-position={[hefinPos[0], 0, 0]}
          intensity={selectedProjectIndex === 2 ? 12.0 : 4.5}
          color="#ffffff"
          angle={0.48}
          penumbra={0.65}
        />

        {/* Floating Atmospheric Silver Embers */}
        {!reduced && <ArchiveParticles count={55} />}

        {/* Base Halos */}
        <ExhibitBaseGlow position={docReconPos} />
        <ExhibitBaseGlow position={pathwayPos} />
        <ExhibitBaseGlow position={hefinPos} />

        {/* 3 Exhibits in One Common Symmetrical Baseline */}
        <group position={[0, 0, 0]}>
          <DocReconExhibit
            isSelected={selectedProjectIndex === 0}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 0}
            position={docReconPos}
          />

          <PathwayAIExhibit
            isSelected={selectedProjectIndex === 1}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 1}
            position={pathwayPos}
          />

          <HefinExhibit
            isSelected={selectedProjectIndex === 2}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 2}
            position={hefinPos}
          />
        </group>
      </Canvas>
    </div>
  );
}
