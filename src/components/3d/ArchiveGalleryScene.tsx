import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Html } from "@react-three/drei";
import * as THREE from "three";
import { FileText, Globe, Network, ArrowUpRight } from "lucide-react";

// Exhibit A: DocRecon - Floating Document Intelligence Installation
function DocReconExhibit({
  isSelected,
  isDimmed,
  onClick,
  position = [-3.1, -0.15, 0],
  isMobile = false,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  position?: [number, number, number];
  isMobile?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scanBeamRef = useRef<THREE.Mesh>(null);
  const box1Ref = useRef<THREE.LineSegments>(null);
  const box2Ref = useRef<THREE.LineSegments>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.9) * 0.05;
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.08 - 0.15;
    }
    if (scanBeamRef.current) {
      scanBeamRef.current.position.y = Math.sin(t * 2.2) * 0.45;
    }
    if (box1Ref.current) {
      box1Ref.current.rotation.z = Math.sin(t * 1.5) * 0.02;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={isMobile ? 0.78 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Three Floating Translucent Document Planes */}
      {[-0.18, 0, 0.18].map((offsetZ, i) => (
        <group
          key={i}
          position={[(i - 1) * 0.12, (i - 1) * 0.08, offsetZ]}
          rotation={[0.1, (i - 1) * 0.12, (i - 1) * 0.05]}
        >
          {/* Document Sheet */}
          <mesh>
            <planeGeometry args={[1.2, 1.6]} />
            <meshPhysicalMaterial
              color="#0d0d12"
              roughness={0.15}
              transmission={0.8}
              transparent
              opacity={0.88}
              reflectivity={0.9}
              clearcoat={1}
            />
          </mesh>
          {/* Border Outline */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.2, 1.6)]} />
            <lineBasicMaterial
              color={isSelected ? "#ffffff" : "#969696"}
              transparent
              opacity={0.7}
            />
          </lineSegments>
        </group>
      ))}

      {/* Silver Scanning Beam */}
      <mesh ref={scanBeamRef} position={[0, 0, 0.22]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 1.3, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      {/* Floating OCR Bounding Boxes */}
      <group position={[0, 0.2, 0.25]} ref={box1Ref}>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.7, 0.18)]} />
          <lineBasicMaterial color="#dadada" transparent opacity={0.8} />
        </lineSegments>
      </group>

      <group position={[0, -0.2, 0.25]} ref={box2Ref}>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.85, 0.2)]} />
          <lineBasicMaterial color="#dadada" transparent opacity={0.8} />
        </lineSegments>
      </group>

      {/* HTML Pedestal Plaque */}
      <Html position={[0, isMobile ? -0.92 : -1.16, 0.2]} center distanceFactor={isMobile ? 8.2 : 7.5}>
        <div
          className={`archive-plaque ${isSelected ? "selected" : ""} ${
            isDimmed ? "dimmed" : ""
          }`}
          onClick={onClick}
          role="button"
          tabIndex={0}
        >
          <div className="plaque-icon">
            <FileText size={16} />
          </div>
          <div className="plaque-content">
            <span className="plaque-num mono">01</span>
            <h4 className="plaque-title">DocRecon</h4>
            <p className="plaque-sub mono">DOCUMENT INTELLIGENCE</p>
            <div className="plaque-tags mono">
              <span>OCR</span>
              <span>NLP</span>
              <span>CV</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="plaque-arrow" />
        </div>
      </Html>
    </group>
  );
}

// Exhibit B: Pathway AI - Miniature 3D Smart-City Intelligence Environment
function PathwayAIExhibit({
  isSelected,
  isDimmed,
  onClick,
  position = [0, -0.05, 0.3],
  isMobile = false,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  position?: [number, number, number];
  isMobile?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Mesh>(null);

  // Procedural skyline heights
  const buildings = useMemo(() => {
    return [
      { x: -0.35, z: -0.3, h: 0.9, w: 0.22, d: 0.22 },
      { x: 0, z: -0.35, h: 1.4, w: 0.26, d: 0.26 },
      { x: 0.35, z: -0.3, h: 1.1, w: 0.24, d: 0.24 },
      { x: -0.45, z: 0.05, h: 0.8, w: 0.2, d: 0.2 },
      { x: 0, z: 0.02, h: 1.65, w: 0.3, d: 0.3 }, // Center skyscraper
      { x: 0.45, z: 0.05, h: 0.85, w: 0.22, d: 0.22 },
      { x: -0.3, z: 0.35, h: 0.65, w: 0.2, d: 0.2 },
      { x: 0.3, z: 0.35, h: 0.7, w: 0.22, d: 0.22 },
    ];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.8 + 1) * 0.05;
      groupRef.current.rotation.y = t * 0.12;
    }
    if (globeRef.current) {
      globeRef.current.rotation.y -= delta * 0.3;
      globeRef.current.rotation.x += delta * 0.1;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={isMobile ? 0.78 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Circular Architectural Pedestal Base */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.9, 0.95, 0.1, 32]} />
        <meshStandardMaterial color="#1a1a22" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* Pedestal Rim Glow */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.88, 0.92, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
      </mesh>

      {/* Miniature Skyscraper Blocks */}
      {buildings.map((b, i) => (
        <group key={i} position={[b.x, b.h / 2, b.z]}>
          <mesh>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color="#08080d"
              roughness={0.15}
              metalness={0.95}
            />
          </mesh>
          {/* Wireframe Edge Highlights */}
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(b.w, b.h, b.d)]} />
            <lineBasicMaterial
              color={isSelected ? "#ffffff" : "#707078"}
              transparent
              opacity={0.65}
            />
          </lineSegments>
          {/* Top Sensor Beacon */}
          <mesh position={[0, b.h / 2 + 0.02, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      {/* Floating Holographic Telemetry Globe Above City */}
      <mesh ref={globeRef} position={[0, 1.95, 0]}>
        <icosahedronGeometry args={[0.25, 2]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Vertical Data Beams */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 2.0, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>

      {/* HTML Pedestal Plaque */}
      <Html position={[0, isMobile ? -0.92 : -1.16, 0.2]} center distanceFactor={isMobile ? 8.2 : 7.5}>
        <div
          className={`archive-plaque center-plaque ${
            isSelected ? "selected" : ""
          } ${isDimmed ? "dimmed" : ""}`}
          onClick={onClick}
          role="button"
          tabIndex={0}
        >
          <div className="plaque-icon">
            <Globe size={16} />
          </div>
          <div className="plaque-content">
            <span className="plaque-num mono">02</span>
            <h4 className="plaque-title">Pathway AI</h4>
            <p className="plaque-sub mono">SMART URBAN RAG</p>
            <div className="plaque-tags mono">
              <span>RAG</span>
              <span>LLM</span>
              <span>URBAN</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="plaque-arrow" />
        </div>
      </Html>
    </group>
  );
}

// Exhibit C: HEFIN - Suspended Decentralized Data Network
function HefinExhibit({
  isSelected,
  isDimmed,
  onClick,
  position = [3.1, -0.15, 0],
  isMobile = false,
}: {
  isSelected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  position?: [number, number, number];
  isMobile?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const cageRef = useRef<THREE.Mesh>(null);

  // Satellites positions
  const satellites = useMemo(() => {
    return [
      [-0.75, 0.6, 0.4],
      [0.8, 0.5, -0.3],
      [-0.6, -0.5, -0.5],
      [0.7, -0.6, 0.4],
      [0, 0.9, -0.2],
      [-0.8, 0, -0.4],
    ];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.85 + 2) * 0.05;
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1 + 0.15;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.2;
      coreRef.current.rotation.y += delta * 0.3;
    }
    if (cageRef.current) {
      cageRef.current.rotation.x -= delta * 0.15;
      cageRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={isMobile ? 0.78 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Central Black-Glass Hypercube */}
      <mesh ref={coreRef} position={[0, 0.2, 0]}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshPhysicalMaterial
          color="#08080c"
          roughness={0.1}
          metalness={0.95}
          transmission={0.85}
          transparent
          opacity={0.9}
          clearcoat={1}
        />
      </mesh>

      {/* Outer Wireframe Cage */}
      <mesh ref={cageRef} position={[0, 0.2, 0]}>
        <boxGeometry args={[0.75, 0.75, 0.75]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Satellites & Network Struts */}
      {satellites.map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh>
            <boxGeometry args={[0.18, 0.18, 0.18]} />
            <meshStandardMaterial
              color="#1a1a24"
              roughness={0.2}
              metalness={0.9}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(0.18, 0.18, 0.18)]} />
            <lineBasicMaterial color="#ffffff" transparent opacity={0.6} />
          </lineSegments>
        </group>
      ))}

      {/* HTML Pedestal Plaque */}
      <Html position={[0, isMobile ? -0.92 : -1.16, 0.2]} center distanceFactor={isMobile ? 8.2 : 7.5}>
        <div
          className={`archive-plaque ${isSelected ? "selected" : ""} ${
            isDimmed ? "dimmed" : ""
          }`}
          onClick={onClick}
          role="button"
          tabIndex={0}
        >
          <div className="plaque-icon">
            <Network size={16} />
          </div>
          <div className="plaque-content">
            <span className="plaque-num mono">03</span>
            <h4 className="plaque-title">HEFIN</h4>
            <p className="plaque-sub mono">DECENTRALIZED CHATBOT</p>
            <div className="plaque-tags mono">
              <span>AI</span>
              <span>NETWORK</span>
              <span>P2P</span>
            </div>
          </div>
          <ArrowUpRight size={14} className="plaque-arrow" />
        </div>
      </Html>
    </group>
  );
}

export default function ArchiveGalleryScene({
  selectedProjectIndex,
  onSelectProject,
  reduced = false,
}: {
  selectedProjectIndex: number | null;
  onSelectProject: (index: number) => void;
  reduced?: boolean;
}) {
  const [windowWidth, setWindowWidth] = useState(1536);
  const [cameraZ, setCameraZ] = useState(6.7);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w < 600) {
        setCameraZ(8.2);
      } else if (w < 950) {
        setCameraZ(7.8);
      } else if (w < 1250) {
        setCameraZ(7.2);
      } else {
        setCameraZ(6.7);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 600;
  const isTablet = windowWidth >= 600 && windowWidth < 950;

  const docReconPos: [number, number, number] = isMobile
    ? [-1.0, 1.45, 0]
    : isTablet
    ? [-2.4, -0.15, 0]
    : [-3.1, -0.15, 0];

  const pathwayPos: [number, number, number] = isMobile
    ? [0, 0, 0.2]
    : [0, -0.05, 0.3];

  const hefinPos: [number, number, number] = isMobile
    ? [1.0, -1.45, 0]
    : isTablet
    ? [2.4, -0.15, 0]
    : [3.1, -0.15, 0];

  return (
    <div className="archive-canvas-wrapper" aria-hidden="false">
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="archive-three-canvas"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 8, 4]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[-5, 2, 2]} intensity={1.5} color="#969696" />
        <directionalLight position={[5, 2, 2]} intensity={1.5} color="#969696" />
        <pointLight position={[0, -2, 2]} intensity={20} color="#dadada" />

        <group position={[0, 0.1, 0]}>
          <DocReconExhibit
            isSelected={selectedProjectIndex === 0}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 0}
            onClick={() => onSelectProject(0)}
            position={docReconPos}
            isMobile={isMobile}
          />

          <PathwayAIExhibit
            isSelected={selectedProjectIndex === 1}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 1}
            onClick={() => onSelectProject(1)}
            position={pathwayPos}
            isMobile={isMobile}
          />

          <HefinExhibit
            isSelected={selectedProjectIndex === 2}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 2}
            onClick={() => onSelectProject(2)}
            position={hefinPos}
            isMobile={isMobile}
          />

          {!reduced && (
            <Sparkles
              count={75}
              size={1.6}
              scale={9}
              speed={0.18}
              color="#ffffff"
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
