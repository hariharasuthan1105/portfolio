import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Html } from "@react-three/drei";
import * as THREE from "three";
import { profile } from "../../data/profile";

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  organization: string;
  dateRange: string;
  description: string;
  tags: string[];
  desktopPos: [number, number, number];
  mobilePos: [number, number, number];
}

export const MILESTONES: TimelineMilestone[] = [
  {
    id: "foundations",
    year: "2023",
    title: "FOUNDATIONS",
    subtitle: "ACADEMIC ORIGIN",
    organization: profile.education.college,
    dateRange: profile.education.years,
    description:
      "Core training in machine learning algorithms, discrete mathematics, relational databases, data structures, and statistical optimization.",
    tags: ["B.Tech AI & DS", "CGPA 8.25", "Core ML", "Algorithms"],
    desktopPos: [-3.2, -0.6, 0.3],
    mobilePos: [-0.85, 1.6, 0],
  },
  {
    id: "robotics",
    year: "2024",
    title: "ROBOTICS INTERN",
    subtitle: "SYSTEMS & EMBEDDED",
    organization: "Emglitz Technologies",
    dateRange: "February–March 2024",
    description:
      "Hands-on embedded systems architecture, sensor telemetry integration, and robotic hardware-software interfacing in production environments.",
    tags: ["Robotics", "Sensors", "Telemetry", "Embedded"],
    desktopPos: [-1.05, -0.1, 0.1],
    mobilePos: [0.85, 0.55, 0],
  },
  {
    id: "datascience",
    year: "2025",
    title: "DATA SCIENCE INTERN",
    subtitle: "ANALYTICS & PREDICTION",
    organization: "Grow Your Skills",
    dateRange: "June–July 2025",
    description:
      "Engineered machine learning pipelines, structured exploratory data analysis, and predictive models across multi-dimensional tabular datasets.",
    tags: ["Data Science", "Python", "Predictive Modeling", "Analytics"],
    desktopPos: [1.05, 0.45, -0.1],
    mobilePos: [-0.85, -0.55, 0],
  },
  {
    id: "advancement",
    year: "2025+",
    title: "ADVANCEMENT",
    subtitle: "INTELLIGENT SYSTEMS",
    organization: "Autonomous AI & RAG",
    dateRange: "Ongoing Research",
    description:
      "Architecting decentralized agent workflows, dynamic streaming RAG pipelines, and high-impact automated intelligence systems.",
    tags: ["Streaming RAG", "Decentralized AI", "System Design"],
    desktopPos: [3.2, 0.9, -0.3],
    mobilePos: [0.85, -1.6, 0],
  },
];

// Winding Luminous Timeline Path
function WindingPath({
  milestones,
  activeIndex,
  isMobile,
}: {
  milestones: TimelineMilestone[];
  activeIndex: number;
  isMobile: boolean;
}) {
  const { fullLineObj, activeLineObj } = useMemo(() => {
    const points = milestones.map((m) =>
      new THREE.Vector3(...(isMobile ? m.mobilePos : m.desktopPos))
    );
    const curve = new THREE.CatmullRomCurve3(points);

    const fullPoints = curve.getPoints(60);
    const fullGeom = new THREE.BufferGeometry().setFromPoints(fullPoints);
    const fullMat = new THREE.LineBasicMaterial({
      color: "#303030",
      transparent: true,
      opacity: 0.45,
    });
    const fullLine = new THREE.Line(fullGeom, fullMat);

    // Active progression subset
    const progressLimit = (activeIndex + 0.3) / (milestones.length - 1);
    const activePoints = curve.getPoints(
      Math.max(12, Math.floor(60 * Math.min(1, progressLimit)))
    );
    const activeGeom = new THREE.BufferGeometry().setFromPoints(activePoints);
    const activeMat = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.95,
    });
    const activeLine = new THREE.Line(activeGeom, activeMat);

    return { fullLineObj: fullLine, activeLineObj: activeLine };
  }, [milestones, activeIndex, isMobile]);

  return (
    <group>
      <primitive object={fullLineObj} />
      <primitive object={activeLineObj} />
    </group>
  );
}

// 3D Architectural Milestone Platform
function MilestonePlatform({
  milestone,
  index,
  isActive,
  isMobile,
  onSelect,
}: {
  milestone: TimelineMilestone;
  index: number;
  isActive: boolean;
  isMobile: boolean;
  onSelect: (index: number) => void;
}) {
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 0.4;
      crystalRef.current.rotation.z = Math.sin(t * 1.5 + index) * 0.08;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.2;
    }
  });

  const pos = isMobile ? milestone.mobilePos : milestone.desktopPos;

  // Stagger card vertical offset: on desktop, even indices are above [0, 0.58], odd are below [0, -0.58]
  const cardOffsetY = isMobile
    ? -0.48
    : index % 2 === 0
    ? 0.58
    : -0.58;

  return (
    <group
      position={pos}
      scale={isMobile ? 0.8 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
    >
      {/* Floating Stepped Dais Base */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.08, 24]} />
        <meshStandardMaterial
          color="#111116"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Radiant Perimeter Halo Ring */}
      <mesh ref={ringRef} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.58, 0.62, 32]} />
        <meshBasicMaterial
          color={isActive ? "#ffffff" : "#707078"}
          transparent
          opacity={isActive ? 0.9 : 0.4}
        />
      </mesh>

      {/* Floating Crystalline Milestone Monument */}
      <mesh ref={crystalRef} position={[0, 0.18, 0]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshPhysicalMaterial
          color="#0d0d14"
          roughness={0.1}
          metalness={0.95}
          transmission={0.8}
          transparent
          opacity={0.9}
          clearcoat={1}
        />
      </mesh>

      {/* Vertical Light Pillar */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 1.6, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isActive ? 0.65 : 0.2}
        />
      </mesh>

      {/* HTML Floating Card */}
      <Html position={[0, cardOffsetY, 0.2]} center distanceFactor={isMobile ? 8.2 : 7.5}>
        <div
          className={`journey-milestone-card ${isActive ? "active" : ""}`}
          onClick={() => onSelect(index)}
          role="button"
          tabIndex={0}
        >
          <div className="card-top-row">
            <span className="card-year mono">{milestone.year}</span>
            <span className="card-sub mono">{milestone.subtitle}</span>
          </div>
          <h4 className="card-title">{milestone.title}</h4>
          <p className="card-org mono">{milestone.organization}</p>
          <div className="card-tags mono">
            {milestone.tags.slice(0, 2).map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function JourneyTimelineScene({
  activeMilestoneIndex,
  onSelectMilestone,
  reduced = false,
}: {
  activeMilestoneIndex: number;
  onSelectMilestone: (index: number) => void;
  reduced?: boolean;
}) {
  const [windowWidth, setWindowWidth] = useState(1536);
  const [cameraZ, setCameraZ] = useState(6.6);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w < 600) {
        setCameraZ(7.8);
      } else if (w < 950) {
        setCameraZ(7.6);
      } else if (w < 1250) {
        setCameraZ(7.1);
      } else {
        setCameraZ(6.6);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 600;

  return (
    <div className="journey-canvas-wrapper" aria-hidden="false">
      <Canvas
        camera={{ position: [0, 0.1, cameraZ], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="journey-three-canvas"
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 7, 3]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-4, 2, 2]} intensity={1.4} color="#969696" />
        <directionalLight position={[4, 2, 2]} intensity={1.4} color="#969696" />
        <pointLight position={[0, -2, 1]} intensity={16} color="#dadada" />

        <group position={[0, 0, 0]}>
          <WindingPath
            milestones={MILESTONES}
            activeIndex={activeMilestoneIndex}
            isMobile={isMobile}
          />

          {MILESTONES.map((m, idx) => (
            <MilestonePlatform
              key={m.id}
              milestone={m}
              index={idx}
              isActive={activeMilestoneIndex === idx}
              isMobile={isMobile}
              onSelect={onSelectMilestone}
            />
          ))}

          {!reduced && (
            <Sparkles
              count={75}
              size={1.6}
              scale={8.5}
              speed={0.18}
              color="#ffffff"
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
