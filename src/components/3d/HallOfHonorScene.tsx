import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// GROUND CONTACT & DAIS SHADOW
// Soft radial contact shadow and subtle glowing perimeter ring
// ============================================================================
function DaisContactDisc({
  isSelected,
  isDimmed,
  scale = 1.0,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  scale?: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      const targetOpacity = isSelected ? 0.85 : isDimmed ? 0.2 : 0.5;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 4);
      if (isSelected) {
        const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 3.0) * 0.025;
        ringRef.current.scale.set(pulse, pulse, 1);
      } else {
        ringRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={[0, -0.005, 0]}>
      {/* Soft Ground Contact Shadow on photographed stone dais */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.52 * scale, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle Luminous Dais Perimeter Trim */}
      <mesh ref={ringRef} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.44 * scale, 0.47 * scale, 48]} />
        <meshBasicMaterial
          color={isSelected ? "#FFD447" : "#A7ADB4"}
          transparent
          opacity={isSelected ? 0.9 : 0.45}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// TROPHY 01: CONVOLVE 4.0 — SEMI-FINALIST (Left Foreground Podium)
// Compact AI-inspired award sculpture with detailed black-chrome base,
// beveled solid AI kernel, and 3 polished silver orbital gimbal rings.
// Podiums remain stationary, only trophy sculpture rotates around vertical axis.
// ============================================================================
interface TrophyProps {
  isSelected: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
  scale?: number;
}

function ConvolveTrophy({
  isSelected,
  isDimmed,
  position,
  onClick,
  scale = 1.0,
}: TrophyProps) {
  const sculptureRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (sculptureRef.current) {
      // Rotation around its own vertical center
      const rotSpeed = isSelected ? 0.08 : hovered ? 0.16 : 0.22;
      sculptureRef.current.rotation.y += delta * rotSpeed;
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.35;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.28;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.3;

    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 2.5) * 0.025;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={position}>
      {/* Dais Contact Shadow on the photographed podium */}
      <DaisContactDisc isSelected={isSelected} isDimmed={isDimmed} scale={scale} />

      {/* 1. STATIONARY PEDESTAL BASE (Does NOT rotate — sits firmly on marble dais) */}
      <group>
        {/* Tier 1: Lower Fluted Plinth */}
        <mesh position={[0, 0.02 * scale, 0]}>
          <cylinderGeometry args={[0.22 * scale, 0.26 * scale, 0.04 * scale, 32]} />
          <meshStandardMaterial
            color="#101118"
            roughness={0.2}
            metalness={0.92}
          />
        </mesh>

        {/* Tier 2: Silver Plinth Bevel Collar */}
        <mesh position={[0, 0.048 * scale, 0]}>
          <cylinderGeometry args={[0.18 * scale, 0.21 * scale, 0.016 * scale, 32]} />
          <meshStandardMaterial
            color="#dadde6"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>

        {/* Tier 3: Fluted Neck & Laurel Cup */}
        <mesh position={[0, 0.075 * scale, 0]}>
          <cylinderGeometry args={[0.14 * scale, 0.17 * scale, 0.04 * scale, 32]} />
          <meshStandardMaterial
            color="#14151e"
            roughness={0.22}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0, 0.095 * scale, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17 * scale, 0.012 * scale, 12, 32]} />
          <meshStandardMaterial
            color="#dadde6"
            metalness={0.96}
            roughness={0.12}
          />
        </mesh>
      </group>

      {/* 2. ROTATING AWARD SCULPTURE (Centered above base) */}
      <group
        ref={sculptureRef}
        position={[0, 0.36 * scale, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Invisible Generous Hitbox */}
        <mesh>
          <sphereGeometry args={[0.45 * scale, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Central Polished AI Kernel Cube */}
        <mesh ref={coreRef}>
          <boxGeometry args={[0.16 * scale, 0.16 * scale, 0.16 * scale]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#101218"}
            metalness={0.96}
            roughness={0.08}
            emissive={isSelected ? "#ffffff" : "#444855"}
            emissiveIntensity={isSelected ? 0.75 : hovered ? 0.4 : 0.15}
          />
        </mesh>

        {/* Cube Silver Wireframe Chamfer Edges */}
        <lineSegments>
          <edgesGeometry
            args={[new THREE.BoxGeometry(0.162 * scale, 0.162 * scale, 0.162 * scale)]}
          />
          <lineBasicMaterial
            color="#ffffff"
            linewidth={2}
          />
        </lineSegments>

        {/* Inner Glowing White Star Spark */}
        <mesh>
          <octahedronGeometry args={[0.065 * scale, 0]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={isSelected ? 0.95 : 0.75}
          />
        </mesh>

        {/* Orbital Ring 1: Slanted 45° */}
        <group ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.32 * scale, 0.014 * scale, 16, 48]} />
            <meshStandardMaterial
              color="#dadde6"
              metalness={0.96}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0.32 * scale, 0, 0]}>
            <sphereGeometry args={[0.02 * scale, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Orbital Ring 2: Slanted -45° */}
        <group ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <mesh>
            <torusGeometry args={[0.36 * scale, 0.014 * scale, 16, 48]} />
            <meshStandardMaterial
              color="#c8ccd8"
              metalness={0.96}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0.36 * scale, 0, 0]}>
            <sphereGeometry args={[0.02 * scale, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>

        {/* Orbital Ring 3: Equatorial */}
        <group ref={ring3Ref} rotation={[0, 0, Math.PI / 8]}>
          <mesh>
            <torusGeometry args={[0.4 * scale, 0.014 * scale, 16, 48]} />
            <meshStandardMaterial
              color="#dadde6"
              metalness={0.96}
              roughness={0.1}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// TROPHY 02: PATHWAY AI HACKATHON — FINALIST (Center Distant Altar)
// Sits firmly on the distant elevated altar inside the background arch.
// Refined, faceted crystal diamond sculpture with silver frame & laurel victory ring.
// Strictly monochrome / grayscale (NO blue wireframes).
// ============================================================================
function PathwayAltarTrophy({
  isSelected,
  isDimmed,
  position,
  onClick,
  scale = 1.0,
}: TrophyProps) {
  const sculptureRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (sculptureRef.current) {
      const rotSpeed = isSelected ? 0.06 : hovered ? 0.12 : 0.18;
      sculptureRef.current.rotation.y += delta * rotSpeed;
    }

    if (coreRef.current) {
      const p = 1 + Math.sin(t * 2.8) * 0.03;
      coreRef.current.scale.set(p, p, p);
    }
  });

  return (
    <group position={position}>
      {/* Altar Contact Shadow on the elevated dais */}
      <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38 * scale, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>

      {/* Focused Altar Key Spotlight */}
      <pointLight
        position={[0, 0.3 * scale, 0.4 * scale]}
        intensity={isSelected ? 6.5 : 3.5}
        color="#ffffff"
        distance={4.5}
        decay={2}
      />

      {/* 1. STATIONARY ALTAR PLINTH */}
      <group>
        <mesh position={[0, 0.03 * scale, 0]}>
          <cylinderGeometry args={[0.2 * scale, 0.25 * scale, 0.05 * scale, 32]} />
          <meshStandardMaterial
            color="#141620"
            roughness={0.25}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0, 0.065 * scale, 0]}>
          <cylinderGeometry args={[0.16 * scale, 0.19 * scale, 0.02 * scale, 32]} />
          <meshStandardMaterial
            color="#dadde6"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>
        {/* Laurel Wreath Base Collar */}
        <mesh position={[0, 0.09 * scale, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18 * scale, 0.014 * scale, 16, 48]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.96}
            roughness={0.1}
          />
        </mesh>
      </group>

      {/* 2. ROTATING FACETED CRYSTAL TROPHY SCULPTURE */}
      <group
        ref={sculptureRef}
        position={[0, 0.35 * scale, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Generous Hitbox */}
        <mesh>
          <sphereGeometry args={[0.42 * scale, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Faceted Crystalline Diamond Body (Grayscale / Dark Obsidian Crystal) */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.26 * scale, 1]} />
          <meshPhysicalMaterial
            color={isSelected ? "#ffffff" : "#141620"}
            metalness={0.92}
            roughness={0.08}
            transmission={0.55}
            transparent
            opacity={0.9}
            emissive={isSelected ? "#ffffff" : "#505466"}
            emissiveIntensity={isSelected ? 0.9 : hovered ? 0.5 : 0.22}
          />
        </mesh>

        {/* Refined Machined Silver Facet Ribs */}
        <lineSegments>
          <edgesGeometry args={[new THREE.OctahedronGeometry(0.262 * scale, 1)]} />
          <lineBasicMaterial
            color="#ffffff"
            linewidth={2}
          />
        </lineSegments>

        {/* Inner Luminous Star Core */}
        <mesh>
          <sphereGeometry args={[0.06 * scale, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Slanted Silver Halo Victory Ring */}
        <group rotation={[Math.PI / 6, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.34 * scale, 0.012 * scale, 16, 48]} />
            <meshStandardMaterial
              color="#dadde6"
              metalness={0.96}
              roughness={0.12}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// TROPHY 03: WORLD COMPUTER HACKER LEAGUE — QUALIFIER (Right Foreground Podium)
// Replaces the thin wireframe with a complete compact award sculpture.
// Black-chrome shield geometry, silver security emblem, beveled edges,
// physical front and back surfaces, subtle decorative network details.
// Matches left trophy's approximate screen-space size and pedestal alignment.
// ============================================================================
function WCHLTrophy({
  isSelected,
  isDimmed,
  position,
  onClick,
  scale = 1.0,
}: TrophyProps) {
  const sculptureRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (sculptureRef.current) {
      const rotSpeed = isSelected ? 0.08 : hovered ? 0.16 : 0.22;
      sculptureRef.current.rotation.y += delta * rotSpeed;
    }

    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 0.4;
      ringRef.current.position.y = Math.sin(t * 2.0) * 0.012 * scale;
    }
  });

  // Solid Faceted Shield / Hexagonal Prism Body
  const prismGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      0.09 * scale,
      0.15 * scale,
      0.54 * scale,
      6
    );
  }, [scale]);

  return (
    <group position={position}>
      {/* Dais Contact Shadow matching Left Podium */}
      <DaisContactDisc isSelected={isSelected} isDimmed={isDimmed} scale={scale} />

      {/* 1. STATIONARY PEDESTAL BASE (Identical base geometry to left podium) */}
      <group>
        {/* Tier 1: Lower Fluted Plinth */}
        <mesh position={[0, 0.02 * scale, 0]}>
          <cylinderGeometry args={[0.22 * scale, 0.26 * scale, 0.04 * scale, 32]} />
          <meshStandardMaterial
            color="#101118"
            roughness={0.2}
            metalness={0.92}
          />
        </mesh>

        {/* Tier 2: Silver Plinth Bevel Collar */}
        <mesh position={[0, 0.048 * scale, 0]}>
          <cylinderGeometry args={[0.18 * scale, 0.21 * scale, 0.016 * scale, 32]} />
          <meshStandardMaterial
            color="#dadde6"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>

        {/* Tier 3: Fluted Neck & Laurel Cup */}
        <mesh position={[0, 0.075 * scale, 0]}>
          <cylinderGeometry args={[0.14 * scale, 0.17 * scale, 0.04 * scale, 32]} />
          <meshStandardMaterial
            color="#14151e"
            roughness={0.22}
            metalness={0.9}
          />
        </mesh>
        <mesh position={[0, 0.095 * scale, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17 * scale, 0.012 * scale, 12, 32]} />
          <meshStandardMaterial
            color="#dadde6"
            metalness={0.96}
            roughness={0.12}
          />
        </mesh>
      </group>

      {/* 2. ROTATING AWARD SCULPTURE */}
      <group
        ref={sculptureRef}
        position={[0, 0.38 * scale, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {/* Invisible Hitbox */}
        <mesh>
          <cylinderGeometry args={[0.35 * scale, 0.35 * scale, 0.7 * scale, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Solid Black-Chrome Shield / Prism Body */}
        <mesh geometry={prismGeometry}>
          <meshStandardMaterial
            color={isSelected ? "#1a1e28" : "#0c0e14"}
            metalness={0.96}
            roughness={0.1}
            emissive={isSelected ? "#ffffff" : "#444855"}
            emissiveIntensity={isSelected ? 0.6 : hovered ? 0.35 : 0.12}
          />
        </mesh>

        {/* Machined Silver Beveled Facet Edges */}
        <lineSegments>
          <edgesGeometry args={[prismGeometry]} />
          <lineBasicMaterial
            color="#ffffff"
            linewidth={2}
          />
        </lineSegments>

        {/* Top Pyramidal Silver Cap */}
        <mesh position={[0, 0.31 * scale, 0]}>
          <coneGeometry args={[0.09 * scale, 0.1 * scale, 6]} />
          <meshStandardMaterial
            color="#dadde6"
            metalness={0.98}
            roughness={0.08}
          />
        </mesh>

        {/* Floating Horizontal Silver Security Ring & Dual Orbital Ring */}
        <group ref={ringRef}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.26 * scale, 0.012 * scale, 16, 48]} />
            <meshStandardMaterial
              color="#dadde6"
              metalness={0.96}
              roughness={0.1}
            />
          </mesh>
          <mesh rotation={[Math.PI / 4, 0, Math.PI / 6]}>
            <torusGeometry args={[0.31 * scale, 0.011 * scale, 16, 48]} />
            <meshStandardMaterial
              color="#c8ccd8"
              metalness={0.96}
              roughness={0.1}
            />
          </mesh>
          {[-0.26, 0.26].map((x, i) => (
            <mesh key={i} position={[x * scale, 0, 0]}>
              <sphereGeometry args={[0.016 * scale, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>

        {/* High-Relief Silver Cryptographic Shield / Lock Emblem on Front Facet */}
        <group position={[0, 0.02 * scale, 0.13 * scale]}>
          <mesh>
            <boxGeometry args={[0.065 * scale, 0.075 * scale, 0.015 * scale]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.98}
              roughness={0.08}
              emissive="#ffffff"
              emissiveIntensity={isSelected ? 0.8 : 0.3}
            />
          </mesh>
          <mesh position={[0, 0.045 * scale, 0]}>
            <torusGeometry args={[0.024 * scale, 0.006 * scale, 12, 16, Math.PI]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.08} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// CAMERA CONTROLLER: RESPONSIVE FRAMING & PERSPECTIVE
// Centered camera aligned behind explorer down the central aisle
// ============================================================================
function ResponsiveCameraController({
  isMobile,
  isTablet,
  selectedAwardIndex,
}: {
  isMobile: boolean;
  isTablet: boolean;
  selectedAwardIndex: number | null;
}) {
  const { camera } = useThree();

  useFrame((_state, delta) => {
    let targetX = 0;
    let targetY = 0.05;
    let targetZ = 6.2;

    if (isMobile) {
      if (selectedAwardIndex === 0) {
        targetX = -1.62;
        targetY = 0.08;
        targetZ = 4.2;
      } else if (selectedAwardIndex === 1) {
        targetX = 0;
        targetY = 0.72;
        targetZ = 2.4;
      } else if (selectedAwardIndex === 2) {
        targetX = 1.62;
        targetY = 0.08;
        targetZ = 4.2;
      } else {
        targetX = 0;
        targetY = 0.12;
        targetZ = 6.4;
      }
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3.8);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 3.8);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3.8);
      camera.lookAt(targetX, targetY - 0.2, 0);
      return;
    } else if (isTablet) {
      targetZ = 6.4;
      targetY = 0.08;
      targetX = 0;
    } else {
      targetZ = 6.2;
      targetY = 0.05;
      targetX = 0;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 3.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3.5);
    camera.lookAt(targetX * 0.25, 0, 0);
  });

  return null;
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

  const { isIsolated, isDebug } = useMemo(() => {
    if (typeof window === "undefined") {
      return { isIsolated: false, isDebug: false };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      isIsolated: params.get("isolate") === "hall3d",
      isDebug: params.get("debug") === "hall",
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1200;

  // Exact 3D world coordinates measured & calibrated to match the photographed podiums:
  // Left podium surface: x = -1.62, y = -0.25, z = 0.3
  // Right podium surface: x = +1.62, y = -0.25, z = 0.3
  // Distant central altar: x = 0, y = 0.58, z = -3.8
  const leftPos: [number, number, number] = [-1.62, -0.25, 0.3];
  const altarPos: [number, number, number] = [0, 0.58, -3.8];
  const rightPos: [number, number, number] = [1.62, -0.25, 0.3];

  return (
    <div
      className={`hall-canvas-wrapper ${isIsolated ? "isolated-hall-mode" : ""}`}
      aria-hidden="false"
      role="region"
      aria-label="3D Ceremonial Hall of Honor Trophy Exhibition"
    >
      <Canvas
        camera={{
          position: [0, 0.05, 6.2],
          fov: 34,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: !isIsolated,
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="hall-three-canvas"
      >
        {isIsolated && <color attach="background" args={["#050608"]} />}

        <ResponsiveCameraController
          isMobile={isMobile}
          isTablet={isTablet}
          selectedAwardIndex={selectedAwardIndex}
        />

        {/* Visual Debug Helper (?debug=hall) */}
        {isDebug && (
          <group>
            <axesHelper args={[2.5]} />
            <gridHelper args={[12.0, 24, "#ffffff", "#33384a"]} position={[0, -0.25, 0]} />
          </group>
        )}

        {/* Monochromatic Cathedral Ambient Light */}
        <ambientLight intensity={0.8} color="#b8c0d4" />

        {/* Cathedral Window Light streaming down */}
        <directionalLight
          position={[0, 7.0, 1.5]}
          intensity={2.8}
          color="#ffffff"
        />

        {/* Symmetrical Side Fill Lights */}
        <directionalLight
          position={[-5.0, 2.5, 3.0]}
          intensity={1.4}
          color="#c0c8dc"
        />
        <directionalLight
          position={[5.0, 2.5, 3.0]}
          intensity={1.4}
          color="#c0c8dc"
        />

        {/* Focused Spotlights for each Trophy */}
        <spotLight
          position={[-1.62, 3.2, 2.0]}
          target-position={leftPos}
          intensity={selectedAwardIndex === 0 ? 5.5 : 2.6}
          color={selectedAwardIndex === 0 ? "#FFD447" : "#ffffff"}
          angle={0.4}
          penumbra={0.65}
        />
        <spotLight
          position={[0, 4.0, -2.5]}
          target-position={altarPos}
          intensity={selectedAwardIndex === 1 ? 6.0 : 3.2}
          color={selectedAwardIndex === 1 ? "#FFD447" : "#ffffff"}
          angle={0.4}
          penumbra={0.6}
        />
        <spotLight
          position={[1.62, 3.2, 2.0]}
          target-position={rightPos}
          intensity={selectedAwardIndex === 2 ? 5.5 : 2.6}
          color={selectedAwardIndex === 2 ? "#FFD447" : "#ffffff"}
          angle={0.4}
          penumbra={0.65}
        />

        {/* In isolated mode: render grounded reflective marble floor & podiums */}
        {isIsolated && (
          <group position={[0, -0.25, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[24, 24]} />
              <meshStandardMaterial
                color="#141620"
                roughness={0.25}
                metalness={0.8}
              />
            </mesh>
            <gridHelper args={[16, 32, "#ffffff", "#33384a"]} position={[0, 0.005, 0]} />
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.8, 16]} />
              <meshBasicMaterial color="#222634" />
            </mesh>
          </group>
        )}

        {/* Three Symmetrical 3D Trophies Perfectly Grounded on Cathedral Podiums */}
        <group>
          {/* Trophy 01: Convolve 4.0 (Left Front Podium) */}
          <ConvolveTrophy
            isSelected={selectedAwardIndex === 0}
            isDimmed={selectedAwardIndex !== null && selectedAwardIndex !== 0}
            position={leftPos}
            onClick={() => onSelectAward(0)}
            scale={0.52}
          />

          {/* Trophy 02: Pathway AI Hackathon (Center Distant Altar) */}
          <PathwayAltarTrophy
            isSelected={selectedAwardIndex === 1}
            isDimmed={selectedAwardIndex !== null && selectedAwardIndex !== 1}
            position={altarPos}
            onClick={() => onSelectAward(1)}
            scale={1.22}
          />

          {/* Trophy 03: World Computer Hacker League (Right Front Podium) */}
          <WCHLTrophy
            isSelected={selectedAwardIndex === 2}
            isDimmed={selectedAwardIndex !== null && selectedAwardIndex !== 2}
            position={rightPos}
            onClick={() => onSelectAward(2)}
            scale={0.52}
          />

          {/* Subtle Cathedral Dust Particles in the streaming window light */}
          {!reduced && (
            <Sparkles
              count={isMobile ? 20 : 42}
              size={1.1}
              scale={[10, 4.5, 6]}
              speed={0.1}
              color="#ffffff"
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
