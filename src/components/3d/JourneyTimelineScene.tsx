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
  isFuture?: boolean;
}

export const MILESTONES: TimelineMilestone[] = [
  {
    id: "foundations",
    year: "2023",
    title: "B.TECH AI & DATA SCIENCE",
    subtitle: "ACADEMIC ORIGIN",
    organization: profile.education.college,
    dateRange: `${profile.education.years} (CGPA: ${profile.education.cgpa})`,
    description:
      "Core training in machine learning algorithms, discrete mathematics, relational databases, data structures, and statistical optimization.",
    tags: ["B.Tech AI & DS", `CGPA ${profile.education.cgpa}`, "Core ML", "Algorithms"],
    desktopPos: [-1.85, -0.65, 0.2],
    mobilePos: [-0.75, 1.45, 0],
    isFuture: false,
  },
  {
    id: "robotics",
    year: "2024",
    title: "ROBOTICS INTERN",
    subtitle: "SYSTEMS & EMBEDDED",
    organization: "Emglitz Technologies",
    dateRange: "February–March 2024",
    description:
      "Contributed to industrial surveillance prototype development, micro-controller sensor interfacing, hardware testing, troubleshooting firmware routines, and authoring technical documentation.",
    tags: ["Robotics", "Sensors", "Telemetry", "Embedded"],
    desktopPos: [-0.6, -0.15, 0.0],
    mobilePos: [0.75, 0.5, 0],
    isFuture: false,
  },
  {
    id: "datascience",
    year: "2025",
    title: "DATA SCIENCE INTERN",
    subtitle: "ANALYTICS & PREDICTION",
    organization: "Grow Your Skills",
    dateRange: "June–July 2025",
    description:
      "Engineered loan approval prediction pipelines, conducted exploratory data analysis, performed feature engineering, trained gradient-boosted decision trees, and executed SQL query optimizations for financial datasets.",
    tags: ["Data Science", "Python", "ML Pipelines", "SQL"],
    desktopPos: [0.75, 0.35, -0.15],
    mobilePos: [-0.75, -0.5, 0],
    isFuture: false,
  },
  {
    id: "advancement",
    year: "FUTURE",
    title: "NEXT HORIZON",
    subtitle: "FUTURE GOAL & AMBITION",
    organization: "Autonomous AI & Distributed Systems",
    dateRange: "Future Goal & Active Research",
    description:
      "Forward-looking engineering ambition: architecting production decentralized agent workflows, dynamic streaming RAG pipelines, and high-impact autonomous intelligence systems.",
    tags: ["Future Goal", "Active Research", "Streaming RAG", "System Design"],
    desktopPos: [2.05, 0.8, -0.3],
    mobilePos: [0.75, -1.45, 0],
    isFuture: true,
  },
];

// Winding Luminous Timeline Path with Silver Energy Flow
function WindingPath({
  milestones,
  activeIndex,
  isMobile,
}: {
  milestones: TimelineMilestone[];
  activeIndex: number;
  isMobile: boolean;
}) {
  const energyPulseRef = useRef<THREE.Group>(null);
  const pulseLightRef = useRef<THREE.PointLight>(null);

  const { curve, fullLineObj, activeLineObj } = useMemo(() => {
    const points = milestones.map((m) =>
      new THREE.Vector3(...(isMobile ? m.mobilePos : m.desktopPos))
    );
    const catmull = new THREE.CatmullRomCurve3(points);

    const fullPoints = catmull.getPoints(80);
    const fullGeom = new THREE.BufferGeometry().setFromPoints(fullPoints);
    const fullMat = new THREE.LineBasicMaterial({
      color: "#282830",
      transparent: true,
      opacity: 0.55,
    });
    const fullLine = new THREE.Line(fullGeom, fullMat);

    // Active progression subset
    const progressLimit = (activeIndex + 0.3) / (milestones.length - 1);
    const activePoints = catmull.getPoints(
      Math.max(12, Math.floor(80 * Math.min(1, progressLimit)))
    );
    const activeGeom = new THREE.BufferGeometry().setFromPoints(activePoints);
    const activeMat = new THREE.LineBasicMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.95,
    });
    const activeLine = new THREE.Line(activeGeom, activeMat);

    return { curve: catmull, fullLineObj: fullLine, activeLineObj: activeLine };
  }, [milestones, activeIndex, isMobile]);

  useFrame((state) => {
    if (energyPulseRef.current) {
      // Flow along the path smoothly
      const t = (state.clock.getElapsedTime() * 0.14) % 1;
      const pt = curve.getPointAt(t);
      energyPulseRef.current.position.copy(pt);

      if (pulseLightRef.current) {
        pulseLightRef.current.intensity = 2.5 + Math.sin(state.clock.getElapsedTime() * 4) * 0.8;
      }
    }
  });

  return (
    <group>
      <primitive object={fullLineObj} />
      <primitive object={activeLineObj} />

      {/* Traveling Silver Energy Comet Pulse */}
      <group ref={energyPulseRef}>
        <mesh>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color="#dadada" transparent opacity={0.35} />
        </mesh>
        <pointLight ref={pulseLightRef} color="#ffffff" intensity={2.5} distance={1.2} />
      </group>
    </group>
  );
}

// 3D Architectural Milestone Platform with Subtle Spatial Pin
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
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 0.45;
      crystalRef.current.rotation.z = Math.sin(t * 1.5 + index) * 0.08;
      if (isActive) {
        const pulse = 1 + Math.sin(t * 3.5) * 0.06;
        crystalRef.current.scale.set(pulse, pulse, pulse);
      } else {
        crystalRef.current.scale.set(1, 1, 1);
      }
    }
    if (ringRef.current) {
      ringRef.current.rotation.z -= delta * 0.25;
    }
    if (lightRef.current && isActive) {
      lightRef.current.intensity = 5 + Math.sin(t * 4) * 1.5;
    }
  });

  const pos = isMobile ? milestone.mobilePos : milestone.desktopPos;

  return (
    <group
      position={pos}
      scale={isMobile ? 0.82 : 1}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(index);
      }}
    >
      {/* Controlled Silver Light Pulse for Active Milestone */}
      {isActive && (
        <pointLight
          ref={lightRef}
          position={[0, 0.4, 0.2]}
          color="#ffffff"
          intensity={5}
          distance={2.8}
        />
      )}

      {/* Floating Stepped Dais Base (Tier 1) */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.08, 32]} />
        <meshStandardMaterial
          color="#0d0d12"
          roughness={0.2}
          metalness={0.92}
        />
      </mesh>

      {/* Stepped Dais Chamfer (Tier 2) */}
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.42, 0.48, 0.04, 32]} />
        <meshStandardMaterial
          color="#16161f"
          roughness={0.18}
          metalness={0.9}
        />
      </mesh>

      {/* Radiant Perimeter Halo Ring */}
      <mesh ref={ringRef} position={[0, -0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.44, 0.47, 32]} />
        <meshBasicMaterial
          color={isActive ? "#ffffff" : "#606068"}
          transparent
          opacity={isActive ? 0.95 : 0.35}
        />
      </mesh>

      {/* Floating Crystalline Milestone Monument */}
      <mesh ref={crystalRef} position={[0, 0.16, 0]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshPhysicalMaterial
          color="#0a0a10"
          roughness={0.08}
          metalness={0.98}
          transmission={0.85}
          transparent
          opacity={0.92}
          clearcoat={1}
        />
      </mesh>

      {/* Subtle White Outline for Selected Milestone */}
      {isActive && (
        <mesh position={[0, 0.16, 0]}>
          <octahedronGeometry args={[0.186, 0]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* Vertical Light Pillar */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 1.5, 8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isActive ? 0.7 : 0.2}
        />
      </mesh>

      {/* Subtle Spatial Milestone Pin (Minimal, Non-Overlapping) */}
      <Html
        position={[0, 0.44, 0.15]}
        center
        distanceFactor={isMobile ? 8.2 : 7.2}
      >
        <button
          type="button"
          className={`milestone-spatial-pin ${isActive ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(index);
          }}
          aria-label={`Select ${milestone.year}: ${milestone.title}`}
        >
          <span className="pin-year mono">{milestone.year}</span>
          <span className="pin-sep mono">//</span>
          <span className="pin-label mono">
            {index === 0
              ? "B.TECH AI"
              : index === 1
              ? "ROBOTICS"
              : index === 2
              ? "DATA SCIENCE"
              : "FUTURE GOAL"}
          </span>
          {isActive && <span className="pin-dot" />}
        </button>
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
  const [cameraZ, setCameraZ] = useState(6.4);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWindowWidth(w);
      if (w < 600) {
        setCameraZ(7.6);
      } else if (w < 950) {
        setCameraZ(7.2);
      } else if (w < 1250) {
        setCameraZ(6.8);
      } else {
        setCameraZ(6.4);
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
        camera={{ position: [0, 0.05, cameraZ], fov: 44 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="journey-three-canvas"
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[0, 7, 3]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-4, 2, 2]} intensity={1.4} color="#969696" />
        <directionalLight position={[4, 2, 2]} intensity={1.4} color="#969696" />
        <pointLight position={[0, -2, 1]} intensity={14} color="#dadada" />

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
              count={65}
              size={1.5}
              scale={8.0}
              speed={0.16}
              color="#ffffff"
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
