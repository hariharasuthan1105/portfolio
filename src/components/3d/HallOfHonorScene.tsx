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
      const targetOpacity = isSelected ? 0.9 : isDimmed ? 0.2 : 0.6;
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 4);
      if (isSelected) {
        const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 3.0) * 0.03;
        ringRef.current.scale.set(pulse, pulse, 1);
      } else {
        ringRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group position={[0, -0.01, 0]}>
      {/* Soft Contact Shadow on marble dais */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.55 * scale, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>

      {/* Subtle Luminous Ring on Dais Perimeter */}
      <mesh ref={ringRef} position={[0, 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42 * scale, 0.46 * scale, 48]} />
        <meshBasicMaterial
          color={isSelected ? "#ffffff" : "#c0c4d0"}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================================================
// TROPHY 01: CONVOLVE 4.0 — SEMI-FINALIST
// Left Podium: Small, polished silver gyroscopic atomic trophy matching reference.
// Central silver cube with beveled edges and luminous core surrounded by 3
// intersecting polished silver orbital rings on a slender caliper tripod base.
// ============================================================================
interface TrophyComponentProps {
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
}: TrophyComponentProps) {
  const trophyGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (trophyGroupRef.current) {
      // Gentle slow rotation around vertical axis (slows down when selected)
      const rotSpeed = isSelected ? 0.06 : hovered ? 0.14 : 0.22;
      trophyGroupRef.current.rotation.y += delta * rotSpeed;

      // Subtle breathing hover
      const hover = Math.sin(t * 1.6) * 0.01;
      trophyGroupRef.current.position.y = hover + (isSelected ? 0.02 : 0);
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.35;
    if (ring2Ref.current) ring2Ref.current.rotation.x += delta * 0.28;
    if (ring3Ref.current) ring3Ref.current.rotation.y += delta * 0.3;

    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 2.5) * 0.03;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={position}>
      {/* Dais Contact Shadow & Subtle Glowing Ring */}
      <DaisContactDisc isSelected={isSelected} isDimmed={isDimmed} scale={scale} />

      {/* Rotating 3D Trophy */}
      <group
        ref={trophyGroupRef}
        position={[0, 0, 0]}
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
        {/* Generous Click Hitbox */}
        <mesh position={[0, 0.35 * scale, 0]}>
          <cylinderGeometry args={[0.55 * scale, 0.55 * scale, 0.85 * scale, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Tiered Base Stand */}
        <mesh position={[0, 0.02 * scale, 0]}>
          <cylinderGeometry args={[0.16 * scale, 0.22 * scale, 0.04 * scale, 32]} />
          <meshStandardMaterial
            color="#14141c"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>

        {/* Curved Caliper Tripod holding gyroscopic core */}
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, idx) => (
          <group key={idx} rotation={[0, angle, 0]}>
            <mesh position={[0.09 * scale, 0.11 * scale, 0]} rotation={[0, 0, -0.32]}>
              <cylinderGeometry args={[0.012 * scale, 0.016 * scale, 0.2 * scale, 12]} />
              <meshStandardMaterial
                color={isSelected ? "#ffffff" : "#d0d4e0"}
                metalness={0.98}
                roughness={0.08}
              />
            </mesh>
          </group>
        ))}

        {/* Lower Laurel Wreath Cup */}
        <group position={[0, 0.07 * scale, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.16 * scale, 0.012 * scale, 12, 32]} />
            <meshStandardMaterial
              color={isSelected ? "#ffffff" : "#c4c8d4"}
              metalness={0.96}
              roughness={0.1}
            />
          </mesh>
        </group>

        {/* Main Gyroscopic Assembly Center */}
        <group position={[0, 0.36 * scale, 0]}>
          {/* Central Polished Cube (AI Kernel) */}
          <mesh ref={coreRef}>
            <boxGeometry args={[0.15 * scale, 0.15 * scale, 0.15 * scale]} />
            <meshStandardMaterial
              color={isSelected ? "#ffffff" : "#0e1017"}
              metalness={0.98}
              roughness={0.06}
              emissive={isSelected ? "#ffffff" : "#556688"}
              emissiveIntensity={isSelected ? 0.8 : hovered ? 0.45 : 0.15}
            />
          </mesh>

          {/* Cube Silver Wireframe Edges */}
          <lineSegments>
            <edgesGeometry
              args={[new THREE.BoxGeometry(0.152 * scale, 0.152 * scale, 0.152 * scale)]}
            />
            <lineBasicMaterial
              color={isSelected ? "#ffffff" : "#e0e4f0"}
              linewidth={2}
            />
          </lineSegments>

          {/* Inner Glowing Star Spark */}
          <mesh>
            <octahedronGeometry args={[0.06 * scale, 0]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={isSelected ? 0.95 : 0.75}
            />
          </mesh>

          {/* Orbital Ring 1: Tilted 45° */}
          <group ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.32 * scale, 0.014 * scale, 16, 48]} />
              <meshStandardMaterial
                color={isSelected ? "#ffffff" : "#d8dce8"}
                metalness={0.98}
                roughness={0.08}
              />
            </mesh>
          </group>

          {/* Orbital Ring 2: Tilted -45° with node bead */}
          <group ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
            <mesh>
              <torusGeometry args={[0.36 * scale, 0.014 * scale, 16, 48]} />
              <meshStandardMaterial
                color={isSelected ? "#ffffff" : "#c8ccd8"}
                metalness={0.98}
                roughness={0.08}
              />
            </mesh>
            <mesh position={[0.36 * scale, 0, 0]}>
              <sphereGeometry args={[0.018 * scale, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Orbital Ring 3: Equatorial */}
          <group ref={ring3Ref} rotation={[0, 0, Math.PI / 8]}>
            <mesh>
              <torusGeometry args={[0.4 * scale, 0.014 * scale, 16, 48]} />
              <meshStandardMaterial
                color={isSelected ? "#ffffff" : "#b0b8cc"}
                metalness={0.98}
                roughness={0.08}
              />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// TROPHY 03: WORLD COMPUTER HACKER LEAGUE — REGIONAL ROUND QUALIFIER
// Right Podium: Premium black-chrome shield/obelisk trophy matching reference.
// Faceted vertical prism with fine silver network lines, floating horizontal ring,
// and cryptographic emblem on grounded stationary pedestal.
// ============================================================================
function WCHLTrophy({
  isSelected,
  isDimmed,
  position,
  onClick,
  scale = 1.0,
}: TrophyComponentProps) {
  const trophyGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (trophyGroupRef.current) {
      const rotSpeed = isSelected ? 0.06 : hovered ? 0.14 : 0.22;
      trophyGroupRef.current.rotation.y += delta * rotSpeed;

      const hover = Math.sin(t * 1.6 + 1.2) * 0.01;
      trophyGroupRef.current.position.y = hover + (isSelected ? 0.02 : 0);
    }

    if (ringRef.current) {
      ringRef.current.rotation.y -= delta * 0.45;
      ringRef.current.position.y = 0.38 * scale + Math.sin(t * 2.2) * 0.012;
    }
  });

  const prismGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      0.075 * scale,
      0.13 * scale,
      0.65 * scale,
      6
    );
  }, [scale]);

  return (
    <group position={position}>
      {/* Dais Contact Shadow & Subtle Glowing Ring */}
      <DaisContactDisc isSelected={isSelected} isDimmed={isDimmed} scale={scale} />

      {/* Rotating 3D Trophy */}
      <group
        ref={trophyGroupRef}
        position={[0, 0, 0]}
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
        {/* Generous Click Hitbox */}
        <mesh position={[0, 0.38 * scale, 0]}>
          <cylinderGeometry args={[0.55 * scale, 0.55 * scale, 0.85 * scale, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Tiered Base Stand */}
        <mesh position={[0, 0.02 * scale, 0]}>
          <cylinderGeometry args={[0.16 * scale, 0.22 * scale, 0.04 * scale, 32]} />
          <meshStandardMaterial
            color="#14141c"
            roughness={0.12}
            metalness={0.96}
          />
        </mesh>

        {/* Polished Chrome Neck Ring */}
        <mesh position={[0, 0.055 * scale, 0]}>
          <cylinderGeometry args={[0.11 * scale, 0.15 * scale, 0.035 * scale, 16]} />
          <meshStandardMaterial
            color="#d8dce8"
            roughness={0.08}
            metalness={0.98}
          />
        </mesh>

        {/* Faceted Vertical Obelisk Prism */}
        <mesh geometry={prismGeometry} position={[0, 0.38 * scale, 0]}>
          <meshStandardMaterial
            color={isSelected ? "#1a202c" : "#090b0f"}
            metalness={0.96}
            roughness={0.08}
            emissive={isSelected ? "#ffffff" : "#334466"}
            emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.1}
          />
        </mesh>

        {/* Silver Facet Edges */}
        <lineSegments position={[0, 0.38 * scale, 0]}>
          <edgesGeometry args={[prismGeometry]} />
          <lineBasicMaterial
            color={isSelected ? "#ffffff" : "#d0d8e8"}
            linewidth={2}
          />
        </lineSegments>

        {/* Top Pyramidal Cap */}
        <mesh position={[0, 0.74 * scale, 0]}>
          <coneGeometry args={[0.075 * scale, 0.11 * scale, 6]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.05}
          />
        </mesh>

        {/* Floating Horizontal Chrome Ring encircling midsection */}
        <group ref={ringRef} position={[0, 0.38 * scale, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.24 * scale, 0.012 * scale, 16, 48]} />
            <meshStandardMaterial
              color={isSelected ? "#ffffff" : "#eceef6"}
              metalness={0.98}
              roughness={0.06}
            />
          </mesh>
          {[-0.24, 0.24].map((x, i) => (
            <mesh key={i} position={[x * scale, 0, 0]}>
              <sphereGeometry args={[0.015 * scale, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          ))}
        </group>

        {/* Cryptographic Lock/Shield Emblem on front facet */}
        <group position={[0, 0.38 * scale, 0.11 * scale]}>
          <mesh>
            <boxGeometry args={[0.055 * scale, 0.065 * scale, 0.01 * scale]} />
            <meshStandardMaterial
              color="#ffffff"
              metalness={0.98}
              roughness={0.06}
              emissive="#ffffff"
              emissiveIntensity={isSelected ? 0.8 : 0.3}
            />
          </mesh>
          <mesh position={[0, 0.04 * scale, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.02 * scale, 0.005 * scale, 12, 16, Math.PI]} />
            <meshStandardMaterial color="#ffffff" metalness={0.98} roughness={0.06} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// TROPHY 02: PATHWAY AI HACKATHON — FINALIST
// Center Distant Altar: Small faceted crystalline trophy hovering inside the
// distant ceremonial halo arch. Perfectly framed above the approaching explorer.
// ============================================================================
function PathwayAltarTrophy({
  isSelected,
  isDimmed,
  position,
  onClick,
  scale = 1.0,
}: TrophyComponentProps) {
  const trophyRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (trophyRef.current) {
      const rotSpeed = isSelected ? 0.05 : hovered ? 0.1 : 0.16;
      trophyRef.current.rotation.y += delta * rotSpeed;
    }

    if (coreRef.current) {
      const p = 1 + Math.sin(t * 2.8) * 0.035;
      coreRef.current.scale.set(p, p, p);
    }
  });

  return (
    <group position={position}>
      {/* Focused Altar Point Light */}
      <pointLight
        position={[0, 0.2 * scale, 0.5 * scale]}
        intensity={isSelected ? 5.5 : 2.8}
        color="#ffffff"
        distance={4.0}
        decay={2}
      />

      {/* Rotating Crystalline Trophy inside the Altar Arch */}
      <group
        ref={trophyRef}
        position={[0, 0, 0]}
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
        {/* Generous Click Hitbox */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.75 * scale, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Silver Laurel Base Wreath */}
        <mesh position={[0, -0.22 * scale, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.22 * scale, 0.016 * scale, 16, 48]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#d0d4e0"}
            metalness={0.98}
            roughness={0.08}
          />
        </mesh>

        {/* Faceted Crystalline Diamond Body */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.26 * scale, 1]} />
          <meshStandardMaterial
            color={isSelected ? "#ffffff" : "#1a2232"}
            metalness={0.94}
            roughness={0.06}
            transparent
            opacity={0.88}
            emissive={isSelected ? "#ffffff" : "#3b5b88"}
            emissiveIntensity={isSelected ? 0.95 : hovered ? 0.55 : 0.28}
          />
        </mesh>

        {/* Silver Facet Edges */}
        <lineSegments>
          <edgesGeometry args={[new THREE.OctahedronGeometry(0.263 * scale, 1)]} />
          <lineBasicMaterial
            color={isSelected ? "#ffffff" : "#d8e0f4"}
            linewidth={2}
          />
        </lineSegments>

        {/* Inner Luminous Star Core */}
        <mesh>
          <sphereGeometry args={[0.06 * scale, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
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
    let targetY = 0.0;
    let targetZ = 6.2;

    if (isMobile) {
      targetZ = 6.6;
      targetY = 0.1;
      if (selectedAwardIndex === 0) targetX = -1.5;
      else if (selectedAwardIndex === 1) targetX = 0;
      else if (selectedAwardIndex === 2) targetX = 1.5;
    } else if (isTablet) {
      targetZ = 6.4;
      targetY = 0.05;
    } else {
      targetZ = 6.2;
      targetY = 0.0;
      targetX = 0;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 3.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3.5);
    camera.lookAt(targetX * 0.3, targetY * 0.5, 0);
  });

  return null;
}

// ============================================================================
// VISUAL DEBUG HELPER (?debug=hall)
// ============================================================================
function HallDebugHelper({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <group>
      <axesHelper args={[2.5]} />
      <gridHelper args={[10.0, 20, "#ffffff", "#444444"]} position={[0, -0.22, 0]} />
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

  // Exact 3D world coordinates projected to match the background plate:
  // Left podium surface: x = -1.65, y = -0.22, z = 0.3
  // Right podium surface: x = +1.65, y = -0.22, z = 0.3
  // Distant Altar inside halo arch: x = 0, y = 0.88, z = -4.8
  const leftPos: [number, number, number] = [-1.65, -0.22, 0.3];
  const altarPos: [number, number, number] = [0, 0.88, -4.8];
  const rightPos: [number, number, number] = [1.65, -0.22, 0.3];

  return (
    <div
      className={`hall-canvas-wrapper ${isIsolated ? "isolated-hall-mode" : ""}`}
      aria-hidden="false"
      role="region"
      aria-label="3D Ceremonial Hall of Honor Trophy Exhibition"
    >
      <Canvas
        camera={{
          position: [0, 0.0, isMobile ? 6.6 : isTablet ? 6.4 : 6.2],
          fov: isMobile ? 42 : isTablet ? 36 : 34,
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

        {/* Debugging Helpers (?debug=hall) */}
        <HallDebugHelper enabled={isDebug} />

        {/* Monochromatic Cathedral Ambient Light */}
        <ambientLight intensity={0.65} color="#b8c0d4" />

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
          position={[-1.65, 3.2, 2.0]}
          target-position={leftPos}
          intensity={selectedAwardIndex === 0 ? 5.5 : 2.6}
          color="#ffffff"
          angle={0.4}
          penumbra={0.65}
        />
        <spotLight
          position={[0, 4.0, -2.5]}
          target-position={altarPos}
          intensity={selectedAwardIndex === 1 ? 6.0 : 3.2}
          color="#ffffff"
          angle={0.4}
          penumbra={0.6}
        />
        <spotLight
          position={[1.65, 3.2, 2.0]}
          target-position={rightPos}
          intensity={selectedAwardIndex === 2 ? 5.5 : 2.6}
          color="#ffffff"
          angle={0.4}
          penumbra={0.65}
        />

        {/* In isolated mode: render grounded reflective marble floor & podiums */}
        {isIsolated && (
          <group position={[0, -0.22, 0]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[24, 24]} />
              <meshStandardMaterial
                color="#141620"
                roughness={0.25}
                metalness={0.8}
              />
            </mesh>
            {/* Ground Grid for visible floor contact verification */}
            <gridHelper args={[16, 32, "#ffffff", "#33384a"]} position={[0, 0.005, 0]} />
            {/* Center Walkway Line */}
            <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.8, 16]} />
              <meshBasicMaterial color="#222634" />
            </mesh>
            {/* Left Isolated Podium */}
            <group position={[-1.65, 0, 0.3]}>
              <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.48, 0.54, 0.3, 32]} />
                <meshStandardMaterial color="#1a1c26" roughness={0.2} metalness={0.92} />
              </mesh>
              <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.45, 0.49, 32]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
            {/* Right Isolated Podium */}
            <group position={[1.65, 0, 0.3]}>
              <mesh position={[0, -0.15, 0]}>
                <cylinderGeometry args={[0.48, 0.54, 0.3, 32]} />
                <meshStandardMaterial color="#1a1c26" roughness={0.2} metalness={0.92} />
              </mesh>
              <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.45, 0.49, 32]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
            {/* Altar Stage */}
            <mesh position={[0, 0.4, -4.8]}>
              <boxGeometry args={[3.2, 0.8, 1.8]} />
              <meshStandardMaterial color="#202432" roughness={0.3} metalness={0.85} />
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
            scale={0.48}
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
