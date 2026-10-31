import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  Code,
  Brain,
  BarChart3,
  Database,
  Cloud,
  Cpu,
  Layers,
  Wrench,
  Boxes,
} from "lucide-react";

export interface SkillNodeData {
  id: string;
  name: string;
  category: string;
  angle: number; // in degrees
  radius: number; // distance from center
  icon: string;
  skills: string[];
  description: string;
}

export const FORGE_NODES: SkillNodeData[] = [
  {
    id: "python",
    name: "PYTHON",
    category: "Programming",
    angle: 90,
    radius: 2.3,
    icon: "code",
    skills: ["Python", "AsyncIO", "OOP Architecture"],
    description:
      "Core foundation for artificial intelligence workflows, data processing pipelines, and high-performance backend microservices.",
  },
  {
    id: "ml",
    name: "MACHINE LEARNING",
    category: "AI / ML",
    angle: 138,
    radius: 2.6,
    icon: "brain",
    skills: ["Scikit-learn", "CatBoost", "Cross-Validation", "Ensemble Modeling"],
    description:
      "Supervised and unsupervised statistical learning, gradient-boosted decision trees, and predictive feature engineering.",
  },
  {
    id: "data-analysis",
    name: "DATA ANALYSIS",
    category: "AI / ML",
    angle: 42,
    radius: 2.6,
    icon: "chart",
    skills: ["Pandas", "NumPy", "Time-series Analysis", "Statistical Computing"],
    description:
      "Vectorized numerical operations, multi-dimensional array manipulation, and comprehensive tabular transformations.",
  },
  {
    id: "databases",
    name: "DATABASES",
    category: "Databases",
    angle: 172,
    radius: 2.5,
    icon: "database",
    skills: ["SQL", "MongoDB", "Schema Normalization", "Query Optimization"],
    description:
      "Relational integrity and document-oriented storage for structured schemas and rapid JSON document ingestion.",
  },
  {
    id: "cloud",
    name: "CLOUD & AWS",
    category: "Tools & Cloud",
    angle: 8,
    radius: 2.5,
    icon: "cloud",
    skills: ["AWS Amplify", "Amazon CloudFront", "GitHub Actions", "CI/CD"],
    description:
      "Automated continuous integration, global edge caching distribution, and zero-maintenance serverless hosting.",
  },
  {
    id: "web-dev",
    name: "WEB DEVELOPMENT",
    category: "Web Development",
    angle: 215,
    radius: 2.3,
    icon: "cpu",
    skills: ["FastAPI", "React", "Django", "Node.js", "Express.js"],
    description:
      "Modern typed asynchronous REST APIs, component-driven reactive interfaces, and scalable server architectures.",
  },
  {
    id: "other",
    name: "OTHER",
    category: "Other",
    angle: 325,
    radius: 2.3,
    icon: "boxes",
    skills: ["Qiskit", "Quantum Circuits", "Java", "Data Structures"],
    description:
      "Quantum circuit exploration, strongly typed enterprise Java architecture, and algorithmic optimization.",
  },
  {
    id: "tools",
    name: "TOOLS",
    category: "Tools & Cloud",
    angle: 252,
    radius: 2.1,
    icon: "wrench",
    skills: ["Git", "GitHub", "Streamlit", "Linux / CLI"],
    description:
      "Distributed version control workflows, collaborative code reviews, and rapid interactive data dashboard prototyping.",
  },
  {
    id: "deep-learning",
    name: "DEEP LEARNING",
    category: "AI / ML",
    angle: 288,
    radius: 2.15,
    icon: "layers",
    skills: ["TensorFlow", "Neural Networks", "Computer Vision", "PaddleOCR"],
    description:
      "Deep feedforward and convolutional neural architectures for high-confidence visual recognition and document extraction.",
  },
];

function NodeIcon({ type }: { type: string }) {
  switch (type) {
    case "code":
      return <Code size={18} strokeWidth={2} />;
    case "brain":
      return <Brain size={18} strokeWidth={2} />;
    case "chart":
      return <BarChart3 size={18} strokeWidth={2} />;
    case "database":
      return <Database size={18} strokeWidth={2} />;
    case "cloud":
      return <Cloud size={18} strokeWidth={2} />;
    case "cpu":
      return <Cpu size={18} strokeWidth={2} />;
    case "boxes":
      return <Boxes size={18} strokeWidth={2} />;
    case "wrench":
      return <Wrench size={18} strokeWidth={2} />;
    case "layers":
      return <Layers size={18} strokeWidth={2} />;
    default:
      return <Code size={18} strokeWidth={2} />;
  }
}

// 3D Central Black-Chrome Intelligence Core with concentric rings
function CentralIntelligenceCore({
  activeCategory,
  selectedNodeId,
  reduced,
}: {
  activeCategory: string;
  selectedNodeId: string;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerMatrixRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (reduced) return;
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating breathing motion
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.06;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.12;
    }

    if (innerMatrixRef.current) {
      innerMatrixRef.current.rotation.y -= delta * 0.18;
      innerMatrixRef.current.rotation.x += delta * 0.08;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.22;
      ring1Ref.current.rotation.y += delta * 0.06;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.18;
      ring2Ref.current.rotation.x += delta * 0.09;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Black-Chrome Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshPhysicalMaterial
          color="#0a0a0a"
          roughness={0.12}
          metalness={0.96}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          reflectivity={0.9}
        />
      </mesh>

      {/* Luminous Inner Geodesic Matrix */}
      <mesh ref={innerMatrixRef}>
        <icosahedronGeometry args={[0.98, 2]} />
        <meshBasicMaterial
          color="#dadada"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Radiant Vertical Energy Spine */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 4.8, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>

      {/* Outer Halo Flare */}
      <mesh>
        <ringGeometry args={[0.95, 1.05, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          side={THREE.DoubleSide}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Concentric Mechanical Orbital Rings */}
      <group ref={ring1Ref} rotation={[0.45, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[1.25, 0.012, 16, 128]} />
          <meshStandardMaterial
            color="#dadada"
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>
      </group>

      <group ref={ring2Ref} rotation={[-0.55, 0.35, 0.2]}>
        <mesh>
          <torusGeometry args={[1.52, 0.015, 16, 128]} />
          <meshStandardMaterial
            color="#969696"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      <group ref={ring3Ref} rotation={[0.8, -0.4, 0.3]}>
        <mesh>
          <torusGeometry args={[1.82, 0.01, 16, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>
      </group>
    </group>
  );
}

// 3D Connecting Lines between center and each active node
function ConnectionBeams({
  nodes,
  activeCategory,
  selectedNodeId,
}: {
  nodes: SkillNodeData[];
  activeCategory: string;
  selectedNodeId: string;
}) {
  const lines = useMemo(() => {
    return nodes.map((node) => {
      const rad = (node.angle * Math.PI) / 180;
      // Convert polar to cartesian coordinates on an elliptical orbit
      const x = Math.cos(rad) * node.radius;
      const y = Math.sin(rad) * (node.radius * 0.88);
      const z = 0.15 * Math.sin(rad * 2);

      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x * 0.45, y * 0.45, z * 0.6 + 0.15),
        new THREE.Vector3(x, y, z),
      ]);
      const points = curve.getPoints(24);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const isActive =
        activeCategory === "All skills" ||
        node.category.toLowerCase() === activeCategory.toLowerCase();
      const isSelected = node.id === selectedNodeId;

      return {
        id: node.id,
        geometry,
        isActive,
        isSelected,
      };
    });
  }, [nodes, activeCategory, selectedNodeId]);

function BeamLine({
  l,
}: {
  l: {
    id: string;
    geometry: THREE.BufferGeometry;
    isActive: boolean;
    isSelected: boolean;
  };
}) {
  const lineObj = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({
      color: l.isSelected ? "#ffffff" : l.isActive ? "#969696" : "#303030",
      transparent: true,
      opacity: l.isSelected ? 0.95 : l.isActive ? 0.5 : 0.15,
    });
    return new THREE.Line(l.geometry, mat);
  }, [l.geometry, l.isSelected, l.isActive]);

  return <primitive object={lineObj} />;
}

  return (
    <group>
      {lines.map((l) => (
        <BeamLine key={l.id} l={l} />
      ))}
    </group>
  );
}

// Interactive 3D HTML Node Placed in 3D Space
function SpatialNode({
  node,
  isActive,
  isSelected,
  onSelect,
}: {
  node: SkillNodeData;
  isActive: boolean;
  isSelected: boolean;
  onSelect: (node: SkillNodeData) => void;
}) {
  const rad = (node.angle * Math.PI) / 180;
  const x = Math.cos(rad) * node.radius;
  const y = Math.sin(rad) * (node.radius * 0.88);
  const z = 0.15 * Math.sin(rad * 2);

  return (
    <group position={[x, y, z]}>
      {/* 3D anchor mesh */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial
          color={isSelected ? "#ffffff" : isActive ? "#dadada" : "#303030"}
          transparent
          opacity={isSelected ? 1 : 0.7}
        />
      </mesh>

      {/* Projected 2D/3D DOM element */}
      <Html center distanceFactor={7.8} zIndexRange={[100, 0]}>
        <div
          className={`forge-3d-node ${isSelected ? "selected" : ""} ${
            isActive ? "active" : "dimmed"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(node);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(node);
            }
          }}
          aria-label={`Inspect ${node.name} skills`}
        >
          <div className="node-icon-circle">
            <div className="node-halo" />
            <NodeIcon type={node.icon} />
          </div>
          <div className="node-title-pill mono">{node.name}</div>
        </div>
      </Html>
    </group>
  );
}

export default function ForgeOfIntelligenceScene({
  activeCategory,
  selectedNodeId,
  onSelectNode,
  reduced = false,
}: {
  activeCategory: string;
  selectedNodeId: string;
  onSelectNode: (node: SkillNodeData) => void;
  reduced?: boolean;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cameraZ, setCameraZ] = useState(6.2);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 480) {
        setCameraZ(9.2);
      } else if (window.innerWidth < 768) {
        setCameraZ(8.2);
      } else if (window.innerWidth < 1100) {
        setCameraZ(7.2);
      } else {
        setCameraZ(6.2);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = -(e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div className="forge-canvas-wrapper" aria-hidden="false">
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="forge-three-canvas"
      >
        <ambientLight intensity={1.2} />
        <pointLight position={[0, 0, 1.5]} intensity={35} color="#ffffff" />
        <directionalLight position={[0, 6, 4]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[-4, 2, 2]} intensity={1.5} color="#969696" />
        <directionalLight position={[4, 2, 2]} intensity={1.5} color="#969696" />
        {/* Dais uplight */}
        <pointLight position={[0, -2.2, 0]} intensity={18} color="#dadada" />

        <group
          rotation={[
            mousePos.y * 0.05,
            mousePos.x * 0.08,
            0,
          ]}
        >
          {/* Ground contact shadow disc */}
          <mesh position={[0, -2.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0, 1.6, 32]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.7} />
          </mesh>

          <CentralIntelligenceCore
            activeCategory={activeCategory}
            selectedNodeId={selectedNodeId}
            reduced={reduced}
          />

          <ConnectionBeams
            nodes={FORGE_NODES}
            activeCategory={activeCategory}
            selectedNodeId={selectedNodeId}
          />

          {FORGE_NODES.map((node) => (
            <SpatialNode
              key={node.id}
              node={node}
              isActive={
                activeCategory === "All skills" ||
                node.category.toLowerCase() === activeCategory.toLowerCase()
              }
              isSelected={node.id === selectedNodeId}
              onSelect={onSelectNode}
            />
          ))}

          {!reduced && (
            <Sparkles
              count={85}
              size={1.8}
              scale={7.5}
              speed={0.2}
              color="#ffffff"
            />
          )}
        </group>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          dampingFactor={0.08}
          enableDamping
          autoRotate={!reduced}
          autoRotateSpeed={0.25}
          maxPolarAngle={Math.PI / 2 + 0.25}
          minPolarAngle={Math.PI / 2 - 0.25}
        />
      </Canvas>
    </div>
  );
}
