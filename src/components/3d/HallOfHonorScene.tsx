import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// CATHEDRAL LIGHT SHAFTS (Subtle Atmospheric God Rays)
// ============================================================================
function CathedralLightShafts({ reduced = false }: { reduced?: boolean }) {
  const raysRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reduced || !raysRef.current) return;
    const t = state.clock.getElapsedTime();
    raysRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material && "opacity" in mesh.material) {
        (mesh.material as THREE.MeshBasicMaterial).opacity =
          0.06 + Math.sin(t * 0.8 + i * 1.5) * 0.025;
      }
    });
  });

  return (
    <group ref={raysRef} position={[0, 2.2, -1.2]} rotation={[0.22, 0, 0]}>
      {/* Central Majestic Ray */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.3, 1.8, 6.0, 24, 1, true]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Left Slanted Beam */}
      <mesh position={[-1.2, 0, 0.2]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.2, 1.4, 5.5, 20, 1, true]} />
        <meshBasicMaterial
          color="#dadada"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Right Slanted Beam */}
      <mesh position={[1.2, 0, 0.2]} rotation={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.2, 1.4, 5.5, 20, 1, true]} />
        <meshBasicMaterial
          color="#dadada"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// FLOOR FOG (Subtle Ground-Level Drifting Mist)
// ============================================================================
function GroundFogLayer({ reduced = false }: { reduced?: boolean }) {
  const fogRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (reduced || !fogRef.current) return;
    const t = state.clock.getElapsedTime() * 0.12;
    fogRef.current.position.x = Math.sin(t) * 0.15;
  });

  return (
    <group ref={fogRef} position={[0, -1.95, 0.5]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[14, 4.5, 16, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// CEREMONIAL EXHIBIT PEDESTAL (Stationary Black Marble & Chrome Ring)
// ============================================================================
function CeremonialPedestal({
  isSelected,
  position,
}: {
  isSelected: boolean;
  position: [number, number, number];
}) {
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (pulseRef.current && isSelected) {
      pulseRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group position={position}>
      {/* Tier 1: Ground Plinth Base */}
      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.72, 0.82, 0.1, 32]} />
        <meshStandardMaterial
          color="#060608"
          roughness={0.12}
          metalness={0.96}
        />
      </mesh>

      {/* Tier 2: Stepped Polished Rim */}
      <mesh position={[0, -0.63, 0]}>
        <cylinderGeometry args={[0.62, 0.7, 0.05, 32]} />
        <meshStandardMaterial
          color="#141418"
          roughness={0.15}
          metalness={0.92}
        />
      </mesh>

      {/* Subtle Halo / Pulse Ring */}
      <mesh
        ref={pulseRef}
        position={[0, -0.6, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[0.58, 0.64, 32]} />
        <meshBasicMaterial
          color={isSelected ? "#ffffff" : "#444444"}
          transparent
          opacity={isSelected ? 0.75 : 0.25}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// EXHIBIT 01: 3D SILVER LAUREL WREATH (Convolve 4.0 — Semi-Finalist)
// ============================================================================
function LaurelWreathExhibit({
  isSelected,
  isDimmed,
  position,
  onClick,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
}) {
  const modelGroup = useRef<THREE.Group>(null);
  const starRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (modelGroup.current) {
      modelGroup.current.rotation.y += delta * 0.35;
      const hoverY = position[1] + (isSelected ? 0.12 : 0) + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.04;
      modelGroup.current.position.y = hoverY;
    }
    if (starRef.current) {
      starRef.current.rotation.z -= delta * 0.6;
    }
  });

  // Construct stylized laurel leaf nodes
  const leaves = useMemo(() => {
    const items: { pos: [number, number, number]; rot: [number, number, number]; scale: number }[] = [];
    const count = 9;
    const radius = 0.46;
    for (let i = 0; i < count; i++) {
      const angle = (i / (count - 1)) * (Math.PI * 0.85) - Math.PI * 0.42;
      // Left arc
      items.push({
        pos: [-Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
        rot: [0, 0, angle + Math.PI / 4],
        scale: 0.8 - Math.abs(i - count / 2) * 0.05,
      });
      // Right arc
      items.push({
        pos: [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
        rot: [0, 0, -angle - Math.PI / 4],
        scale: 0.8 - Math.abs(i - count / 2) * 0.05,
      });
    }
    return items;
  }, []);

  return (
    <group position={[position[0], 0, position[2]]}>
      <CeremonialPedestal isSelected={isSelected} position={[0, 0, 0]} />

      <group
        ref={modelGroup}
        position={[0, position[1], 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {/* Left Laurel Arc Wire */}
        <mesh position={[-0.22, 0, 0]} rotation={[0, 0, -0.2]}>
          <torusGeometry args={[0.38, 0.018, 16, 32, Math.PI * 0.9]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#c4c4c4"}
            metalness={0.96}
            roughness={0.16}
            emissive={isSelected ? "#ffffff" : "#000000"}
            emissiveIntensity={isSelected ? 0.4 : 0}
          />
        </mesh>

        {/* Right Laurel Arc Wire */}
        <mesh position={[0.22, 0, 0]} rotation={[0, Math.PI, 0.2]}>
          <torusGeometry args={[0.38, 0.018, 16, 32, Math.PI * 0.9]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#c4c4c4"}
            metalness={0.96}
            roughness={0.16}
            emissive={isSelected ? "#ffffff" : "#000000"}
            emissiveIntensity={isSelected ? 0.4 : 0}
          />
        </mesh>

        {/* Stylized Laurel Leaf Nodes */}
        {leaves.map((leaf, idx) => (
          <mesh
            key={idx}
            position={leaf.pos}
            rotation={leaf.rot}
            scale={[0.07 * leaf.scale, 0.16 * leaf.scale, 0.02 * leaf.scale]}
          >
            <coneGeometry args={[1, 2, 4]} />
            <meshStandardMaterial
              color={isSelected ? "#ffffff" : "#b0b0b0"}
              metalness={0.95}
              roughness={0.15}
              opacity={isDimmed ? 0.5 : 1}
              transparent={isDimmed}
            />
          </mesh>
        ))}

        {/* Central Faceted Award Star / Diamond */}
        <mesh ref={starRef} position={[0, 0, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.12}
            emissive="#ffffff"
            emissiveIntensity={isSelected ? 0.7 : 0.25}
          />
        </mesh>

        {/* Base Ring Connector */}
        <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.02, 16, 32]} />
          <meshStandardMaterial color="#888888" metalness={0.92} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================================
// EXHIBIT 02: 3D GEOMETRIC SILVER AWARD (Pathway AI — Finalist)
// ============================================================================
function GeometricAwardExhibit({
  isSelected,
  isDimmed,
  position,
  onClick,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
}) {
  const modelGroup = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (modelGroup.current) {
      modelGroup.current.rotation.y += delta * 0.4;
      const hoverY = position[1] + (isSelected ? 0.12 : 0) + Math.sin(state.clock.getElapsedTime() * 1.5 + 1) * 0.04;
      modelGroup.current.position.y = hoverY;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.x += delta * 0.8;
    if (ring2Ref.current) ring2Ref.current.rotation.y += delta * 0.6;
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <CeremonialPedestal isSelected={isSelected} position={[0, 0, 0]} />

      <group
        ref={modelGroup}
        position={[0, position[1], 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {/* Core Stellated / Dual Octahedron */}
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#e0e0e0"}
            metalness={0.97}
            roughness={0.12}
            emissive={isSelected ? "#ffffff" : "#444444"}
            emissiveIntensity={isSelected ? 0.65 : 0.15}
            opacity={isDimmed ? 0.5 : 1}
            transparent={isDimmed}
          />
        </mesh>

        {/* Outer Inverted Wireframe Cage */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 4, Math.PI / 4, 0]}>
          <octahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            wireframe
            metalness={0.9}
            roughness={0.2}
            emissive="#ffffff"
            emissiveIntensity={isSelected ? 0.5 : 0.1}
          />
        </mesh>

        {/* Intersecting Orbital Ring 1 */}
        <mesh ref={ring1Ref} position={[0, 0, 0]} rotation={[0.4, 0, 0]}>
          <torusGeometry args={[0.52, 0.015, 16, 48]} />
          <meshStandardMaterial color="#dadada" metalness={0.95} roughness={0.15} />
        </mesh>

        {/* Intersecting Orbital Ring 2 */}
        <mesh ref={ring2Ref} position={[0, 0, 0]} rotation={[-0.4, 0.4, 0]}>
          <torusGeometry args={[0.58, 0.014, 16, 48]} />
          <meshStandardMaterial color="#999999" metalness={0.92} roughness={0.2} />
        </mesh>

        {/* Vertical Light Conduit */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.95, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={isSelected ? 0.8 : 0.3} />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================================
// EXHIBIT 03: 3D TECHNICAL WIREFRAME GLOBE (WCHL — Regional Round Qualifier)
// ============================================================================
function NetworkGlobeExhibit({
  isSelected,
  isDimmed,
  position,
  onClick,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
}) {
  const modelGroup = useRef<THREE.Group>(null);
  const equatorRef = useRef<THREE.Mesh>(null);
  const satellitesGroup = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (modelGroup.current) {
      modelGroup.current.rotation.y += delta * 0.3;
      const hoverY = position[1] + (isSelected ? 0.12 : 0) + Math.sin(state.clock.getElapsedTime() * 1.5 + 2) * 0.04;
      modelGroup.current.position.y = hoverY;
    }
    if (equatorRef.current) equatorRef.current.rotation.z += delta * 0.5;
    if (satellitesGroup.current) satellitesGroup.current.rotation.y += delta * 0.7;
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      <CeremonialPedestal isSelected={isSelected} position={[0, 0, 0]} />

      <group
        ref={modelGroup}
        position={[0, position[1], 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        {/* Solid Inner Obsidian Core */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.26, 24, 24]} />
          <meshStandardMaterial
            color="#08080a"
            metalness={0.98}
            roughness={0.1}
            emissive={isSelected ? "#303030" : "#000000"}
          />
        </mesh>

        {/* Outer Geodesic Wireframe Sphere */}
        <mesh position={[0, 0, 0]}>
          <icosahedronGeometry args={[0.42, 1]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#c4c4c4"}
            wireframe
            metalness={0.95}
            roughness={0.15}
            emissive={isSelected ? "#ffffff" : "#444444"}
            emissiveIntensity={isSelected ? 0.6 : 0.15}
            opacity={isDimmed ? 0.5 : 1}
            transparent={isDimmed}
          />
        </mesh>

        {/* Equatorial Coordinate Ring */}
        <mesh ref={equatorRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.54, 0.016, 16, 48]} />
          <meshStandardMaterial color="#dadada" metalness={0.96} roughness={0.14} />
        </mesh>

        {/* Orbiting Satellite Data Nodes */}
        <group ref={satellitesGroup}>
          {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((rad, i) => (
            <mesh
              key={i}
              position={[Math.cos(rad) * 0.54, 0, Math.sin(rad) * 0.54]}
            >
              <octahedronGeometry args={[0.045, 0]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// MAIN 3D HALL OF HONOR SCENE
// ============================================================================
export default function HallOfHonorScene({
  selectedAwardIndex,
  onSelectAward,
  reduced = false,
}: {
  selectedAwardIndex: number | null;
  onSelectAward: (index: number) => void;
  reduced?: boolean;
}) {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1200;

  // Responsive spatial exhibit positioning
  const leftPos: [number, number, number] = isMobile
    ? [-2.4, -0.4, 0]
    : isTablet
    ? [-2.2, -0.4, 0.4]
    : [-3.2, -0.4, 0.5];

  const centerPos: [number, number, number] = isMobile
    ? [0, -0.4, 0]
    : [0, -0.4, 0.5];

  const rightPos: [number, number, number] = isMobile
    ? [2.4, -0.4, 0]
    : isTablet
    ? [2.2, -0.4, 0.4]
    : [3.2, -0.4, 0.5];

  const cameraZ = isMobile ? 6.2 : isTablet ? 5.8 : 5.2;

  return (
    <div className="hall-canvas-wrapper" aria-hidden="false">
      <Canvas
        camera={{ position: [0, -0.1, cameraZ], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="hall-three-canvas"
      >
        <ambientLight intensity={1.2} />
        {/* Top Cathedral Lighting */}
        <directionalLight position={[0, 6, 2]} intensity={3.0} color="#ffffff" />
        {/* Symmetrical Side Rim Lights */}
        <directionalLight position={[-6, 1, 3]} intensity={1.8} color="#cccccc" />
        <directionalLight position={[6, 1, 3]} intensity={1.8} color="#cccccc" />
        {/* Floor Marble Uplight */}
        <pointLight position={[0, -2.2, 1.5]} intensity={14} color="#dadada" />

        {/* Cathedral Atmospheric God Rays */}
        <CathedralLightShafts reduced={reduced} />

        {/* Floor Ground Mist */}
        <GroundFogLayer reduced={reduced} />

        {/* Three Authentic Dimensional Exhibits */}
        <group position={[0, -0.3, 0]}>
          <LaurelWreathExhibit
            isSelected={selectedAwardIndex === 0}
            isDimmed={selectedAwardIndex !== null && selectedAwardIndex !== 0}
            position={leftPos}
            onClick={() => onSelectAward(0)}
          />

          <GeometricAwardExhibit
            isSelected={selectedAwardIndex === 1}
            isDimmed={selectedAwardIndex !== null && selectedAwardIndex !== 1}
            position={centerPos}
            onClick={() => onSelectAward(1)}
          />

          <NetworkGlobeExhibit
            isSelected={selectedAwardIndex === 2}
            isDimmed={selectedAwardIndex !== null && selectedAwardIndex !== 2}
            position={rightPos}
            onClick={() => onSelectAward(2)}
          />

          {!reduced && (
            <Sparkles
              count={isMobile ? 25 : 55}
              size={1.3}
              scale={[10, 4.5, 5]}
              speed={0.14}
              color="#ffffff"
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
