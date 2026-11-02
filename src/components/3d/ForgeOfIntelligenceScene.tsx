import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";

export interface SkillNodeData {
  id: string;
  name: string;
  category: string;
  angle: number;
  radius: number;
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
    name: "TOOLS & CLOUD",
    category: "Tools & Cloud",
    angle: 8,
    radius: 2.5,
    icon: "cloud",
    skills: ["AWS Amplify", "Git", "GitHub", "Streamlit"],
    description:
      "Automated continuous deployment, global edge distribution, collaborative version control, and serverless hosting.",
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
    skills: ["Qiskit", "Quantum Circuits", "Algorithms"],
    description:
      "Quantum circuit exploration, unitary state simulation, and algorithmic complexity optimization.",
  },
  {
    id: "tools",
    name: "TOOLS",
    category: "Tools & Cloud",
    angle: 252,
    radius: 2.1,
    icon: "wrench",
    skills: ["Git", "GitHub", "Streamlit"],
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
    skills: ["TensorFlow", "Neural Networks", "Computer Vision"],
    description:
      "Deep feedforward and convolutional neural architectures for high-confidence visual recognition and document extraction.",
  },
];

// Helper to create sharp engraved stone plaque textures
function createPlaqueTexture(label: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep obsidian plate
  ctx.fillStyle = "#0c0c12";
  ctx.fillRect(0, 0, 512, 128);

  // Outer bright border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 116);

  // Inner subtle accent frame
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 488, 104);

  // Label text
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 40px 'IBM Plex Mono', monospace, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// -----------------------------------------------------------------------------
// GLOBE 01 — PROGRAMMING (Front-Left)
// Polished black-glass sphere, dual silver Python ribbon motif, outer meridian ring
// -----------------------------------------------------------------------------
function ProgrammingGlobe({
  isSelected,
  isHovered,
  reduced,
}: {
  isSelected: boolean;
  isHovered: boolean;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const innerGlyphRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reduced) return;
    const speed = isSelected ? 0.35 : 0.75;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45 * speed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6 * speed;
      ringRef.current.rotation.x += delta * 0.2 * speed;
    }
    if (innerGlyphRef.current) {
      innerGlyphRef.current.rotation.y -= delta * 0.5 * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Black Glass Base Sphere */}
      <mesh>
        <sphereGeometry args={[0.38, 48, 48]} />
        <meshPhysicalMaterial
          color="#060609"
          roughness={0.08}
          metalness={0.92}
          clearcoat={1.0}
          clearcoatRoughness={0.06}
          reflectivity={0.95}
        />
      </mesh>

      {/* Equatorial Engraved Data Seam */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.385, 0.006, 16, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>

      {/* Inner Floating Python / Programming Motif */}
      <group ref={innerGlyphRef}>
        {/* Upper serpent head / hook */}
        <mesh position={[0.04, 0.07, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.09, 0.024, 16, 32, Math.PI * 1.3]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.95}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.6 : 0.3}
          />
        </mesh>
        <mesh position={[0.11, 0.12, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Lower serpent head / hook */}
        <mesh position={[-0.04, -0.07, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.09, 0.024, 16, 32, Math.PI * 1.3]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.95}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.6 : 0.3}
          />
        </mesh>
        <mesh position={[-0.11, -0.12, 0]}>
          <sphereGeometry args={[0.024, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Rotating Mechanical Meridian Ring */}
      <group ref={ringRef} rotation={[0.4, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[0.52, 0.016, 16, 64]} />
          <meshStandardMaterial
            color="#d8d8e2"
            metalness={0.96}
            roughness={0.14}
          />
        </mesh>
        {/* Cardinal tick notches */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((ang, i) => (
          <mesh
            key={i}
            position={[Math.cos(ang) * 0.52, Math.sin(ang) * 0.52, 0]}
          >
            <sphereGeometry args={[0.024, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// GLOBE 02 — AI / MACHINE LEARNING (Rear-Left)
// Crystalline faceted globe, internal 3D neural network, pulsing nodes
// -----------------------------------------------------------------------------
function AiMlGlobe({
  isSelected,
  isHovered,
  reduced,
}: {
  isSelected: boolean;
  isHovered: boolean;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const networkRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  // Neural network nodes
  const nodes = useMemo(() => {
    return [
      new THREE.Vector3(-0.16, 0.12, 0.06),
      new THREE.Vector3(-0.14, -0.12, -0.04),
      new THREE.Vector3(-0.02, 0.18, -0.08),
      new THREE.Vector3(0.0, 0.0, 0.14),
      new THREE.Vector3(0.04, -0.15, 0.08),
      new THREE.Vector3(0.14, 0.13, -0.05),
      new THREE.Vector3(0.16, -0.08, -0.1),
      new THREE.Vector3(0.02, 0.02, -0.15),
    ];
  }, []);

  // Neural connections between nodes
  const connections = useMemo(() => {
    return [
      [0, 2], [0, 3], [1, 3], [1, 4], [2, 5],
      [3, 5], [3, 6], [4, 6], [2, 7], [6, 7],
    ];
  }, []);

  useFrame((_, delta) => {
    if (reduced) return;
    const speed = isSelected ? 0.35 : 0.75;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35 * speed;
    }
    if (networkRef.current) {
      networkRef.current.rotation.y -= delta * 0.45 * speed;
      networkRef.current.rotation.x += delta * 0.15 * speed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5 * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Translucent Crystalline Geodesic Outer Shell */}
      <mesh>
        <icosahedronGeometry args={[0.38, 2]} />
        <meshPhysicalMaterial
          color="#121218"
          roughness={0.12}
          metalness={0.7}
          transmission={0.65}
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Wireframe Facet Edges */}
      <mesh>
        <icosahedronGeometry args={[0.382, 2]} />
        <meshBasicMaterial
          color="#d0d0e0"
          wireframe
          transparent
          opacity={isSelected || isHovered ? 0.55 : 0.3}
        />
      </mesh>

      {/* Internal Neural Network */}
      <group ref={networkRef}>
        {/* Nodes */}
        {nodes.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.028, 14, 14]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={isSelected || isHovered ? 1.0 : 0.65}
            />
          </mesh>
        ))}

        {/* Synapse Lines */}
        {connections.map(([fromIdx, toIdx], i) => {
          const from = nodes[fromIdx];
          const to = nodes[toIdx];
          const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
          const dir = new THREE.Vector3().subVectors(to, from);
          const len = dir.length();

          return (
            <mesh key={i} position={mid}>
              <cylinderGeometry args={[0.007, 0.007, len, 8]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isSelected || isHovered ? 0.8 : 0.45}
              />
            </mesh>
          );
        })}
      </group>

      {/* Slanted Orbital Gyro Ring */}
      <group ref={ringRef} rotation={[-0.5, 0.4, 0.2]}>
        <mesh>
          <torusGeometry args={[0.5, 0.014, 16, 64]} />
          <meshStandardMaterial
            color="#c0c0cc"
            metalness={0.94}
            roughness={0.18}
          />
        </mesh>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// GLOBE 03 — DATABASES (Rear-Right)
// Smoked quartz sphere, internal stacked silver database cylinders, data bus
// -----------------------------------------------------------------------------
function DatabasesGlobe({
  isSelected,
  isHovered,
  reduced,
}: {
  isSelected: boolean;
  isHovered: boolean;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const plattersRef = useRef<THREE.Group>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (reduced) return;
    const speed = isSelected ? 0.35 : 0.75;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4 * speed;
    }
    if (plattersRef.current) {
      plattersRef.current.rotation.y -= delta * 0.5 * speed;
    }
    if (pulseRingRef.current) {
      const t = state.clock.getElapsedTime() * 2;
      pulseRingRef.current.position.y = Math.sin(t) * 0.16;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Smoked Glass Sphere */}
      <mesh>
        <sphereGeometry args={[0.38, 48, 48]} />
        <meshPhysicalMaterial
          color="#08080d"
          roughness={0.1}
          metalness={0.88}
          transmission={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Internal Stacked Database Platters */}
      <group ref={plattersRef}>
        {/* Central Vertical Data Spine */}
        <mesh>
          <cylinderGeometry args={[0.024, 0.024, 0.46, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.96}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.6 : 0.3}
          />
        </mesh>

        {/* 3 Tiered Database Discs */}
        {[-0.12, 0.0, 0.12].map((y, idx) => (
          <group key={idx} position={[0, y, 0]}>
            {/* Platter Disc */}
            <mesh>
              <cylinderGeometry args={[0.22, 0.22, 0.034, 32]} />
              <meshStandardMaterial
                color="#dadada"
                metalness={0.95}
                roughness={0.15}
              />
            </mesh>
            {/* Glowing Edge Seam */}
            <mesh>
              <torusGeometry args={[0.222, 0.006, 12, 32]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isSelected || isHovered ? 0.85 : 0.45}
              />
            </mesh>
          </group>
        ))}

        {/* Vertical Pulse Traveling Ring */}
        <mesh ref={pulseRingRef}>
          <torusGeometry args={[0.24, 0.008, 12, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
        </mesh>
      </group>

      {/* Horizontal Support Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#b0b0bc"
          metalness={0.95}
          roughness={0.15}
        />
      </mesh>
    </group>
  );
}

// -----------------------------------------------------------------------------
// GLOBE 04 — TOOLS & CLOUD (Front-Right)
// Titanium sphere, stylized silver cloud sculpture, orbiting satellite ring
// -----------------------------------------------------------------------------
function ToolsCloudGlobe({
  isSelected,
  isHovered,
  reduced,
}: {
  isSelected: boolean;
  isHovered: boolean;
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reduced) return;
    const speed = isSelected ? 0.35 : 0.8;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45 * speed;
    }
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.z += delta * 0.8 * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dark Brushed Titanium Sphere */}
      <mesh>
        <sphereGeometry args={[0.38, 48, 48]} />
        <meshStandardMaterial
          color="#15151c"
          metalness={0.92}
          roughness={0.2}
        />
      </mesh>

      {/* Latitude / Longitude Inscribed Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.383, 0.005, 12, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.383, 0.005, 12, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>

      {/* Central Sculpted Silver Cloud Emblem */}
      <group position={[0, 0, 0.22]} scale={1.2}>
        {/* Base horizontal pill */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.03, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.95}
            roughness={0.12}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.6 : 0.3}
          />
        </mesh>
        {/* Center puff */}
        <mesh position={[0, 0.03, 0]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.95}
            roughness={0.12}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.6 : 0.3}
          />
        </mesh>
        {/* Left puff */}
        <mesh position={[-0.065, -0.01, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.95}
            roughness={0.12}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.6 : 0.3}
          />
        </mesh>
        {/* Right puff */}
        <mesh position={[0.065, -0.01, 0]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.95}
            roughness={0.12}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.6 : 0.3}
          />
        </mesh>
      </group>

      {/* Inclined Orbital Satellite Ring */}
      <group rotation={[0.55, 0.35, 0]}>
        <mesh>
          <torusGeometry args={[0.54, 0.012, 16, 64]} />
          <meshStandardMaterial
            color="#d8d8e0"
            metalness={0.96}
            roughness={0.15}
          />
        </mesh>

        {/* Orbiting Satellites */}
        <group ref={orbitGroupRef}>
          {/* Satellite 1 */}
          <group position={[0.54, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.045, 0.045, 0.045]} />
              <meshStandardMaterial color="#ffffff" metalness={0.95} />
            </mesh>
            <mesh position={[0.045, 0, 0]}>
              <boxGeometry args={[0.045, 0.02, 0.005]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.045, 0, 0]}>
              <boxGeometry args={[0.045, 0.02, 0.005]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Satellite 2 (Opposite) */}
          <group position={[-0.54, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.024, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// PHYSICALLY GROUNDED GOTHIC SKILL PODIUM
// Circular granite plinth, engraved name plaque, support arms, contact shadow
// -----------------------------------------------------------------------------
interface PodiumProps {
  label: string;
  position: [number, number, number];
  scale: number;
  isSelected: boolean;
  onClick: () => void;
  reduced: boolean;
  children: React.ReactNode;
}

function GothicSkillPodium({
  label,
  position,
  scale,
  isSelected,
  onClick,
  reduced,
  children,
}: PodiumProps) {
  const [hovered, setHovered] = useState(false);
  const plaqueTexture = useMemo(() => createPlaqueTexture(label), [label]);

  return (
    <group position={position} scale={scale}>
      {/* Ground Contact Shadow (Sitting squarely on cathedral floor) */}
      <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 0.95, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.88}
        />
      </mesh>

      {/* Dais Perimeter Glow Ring */}
      <mesh position={[0, -0.71, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.92, 0.96, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.6 : 0.3}
        />
      </mesh>

      {/* Stepped Stone Base (Lowest Tier) */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.72, 0.8, 0.16, 36]} />
        <meshStandardMaterial
          color="#101014"
          roughness={0.45}
          metalness={0.5}
        />
      </mesh>

      {/* Main Fluted Obsidian Plinth (Middle Tier) */}
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[0.58, 0.64, 0.26, 36]} />
        <meshStandardMaterial
          color="#0a0a0d"
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Silver Plinth Bevel Trim */}
      <mesh position={[0, -0.27, 0]}>
        <cylinderGeometry args={[0.55, 0.59, 0.04, 36]} />
        <meshStandardMaterial
          color="#dadada"
          roughness={0.18}
          metalness={0.95}
        />
      </mesh>

      {/* Top Gimbal Platform Socket */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.46, 0.52, 0.12, 36]} />
        <meshStandardMaterial
          color="#121218"
          roughness={0.25}
          metalness={0.8}
        />
      </mesh>

      {/* Engraved Plaque on Front of Plinth facing camera */}
      <mesh position={[0, -0.42, 0.62]}>
        <boxGeometry args={[0.66, 0.16, 0.04]} />
        <meshStandardMaterial
          map={plaqueTexture}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Twin Curved Support Arms holding globe rotational axle */}
      <group position={[0, -0.1, 0]}>
        {/* Left arm */}
        <mesh position={[-0.42, 0.16, 0]} rotation={[0, 0, -0.18]}>
          <cylinderGeometry args={[0.024, 0.03, 0.36, 16]} />
          <meshStandardMaterial
            color="#dadada"
            metalness={0.96}
            roughness={0.15}
          />
        </mesh>
        {/* Right arm */}
        <mesh position={[0.42, 0.16, 0]} rotation={[0, 0, 0.18]}>
          <cylinderGeometry args={[0.024, 0.03, 0.36, 16]} />
          <meshStandardMaterial
            color="#dadada"
            metalness={0.96}
            roughness={0.15}
          />
        </mesh>
      </group>

      {/* Localized Uplight Spotlight beneath the globe */}
      <pointLight
        position={[0, -0.05, 0]}
        intensity={isSelected ? 36 : hovered ? 20 : 10}
        color="#ffffff"
        distance={3.2}
      />

      {/* 3D Rotating Globe Mounted Above Podium */}
      <group
        position={[0, 0.18, 0]}
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
        {/* Invisible hit proxy sphere for easy clicking */}
        <mesh visible={false}>
          <sphereGeometry args={[0.65, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {children}
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// MAIN FORGE OF INTELLIGENCE 3D SCENE
// -----------------------------------------------------------------------------
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
  const [cameraZ, setCameraZ] = useState(5.8);
  const [cameraY, setCameraY] = useState(0.0);

  // Check URL query parameters for isolate mode demonstration (?isolate=skills3d)
  const isIsolated = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("isolate") === "skills3d";
  }, []);

  // Responsive camera adjustments
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setCameraZ(7.4);
        setCameraY(-0.1);
      } else if (w < 768) {
        setCameraZ(6.8);
        setCameraY(-0.05);
      } else if (w < 1100) {
        setCameraZ(6.2);
        setCameraY(0.0);
      } else {
        setCameraZ(5.8);
        setCameraY(0.0);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = -(e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Determine active globe from selected category or node
  const activeGlobeCategory = useMemo(() => {
    const cat = activeCategory.toLowerCase();
    if (cat === "all skills" || cat === "programming") return "programming";
    if (cat === "ai / ml") return "ai / ml";
    if (cat === "databases") return "databases";
    if (cat === "tools & cloud" || cat === "tools") return "tools & cloud";
    if (cat === "web development") return "programming"; // mapped to front-left
    if (cat === "other") return "ai / ml"; // mapped to rear-left
    return "programming";
  }, [activeCategory]);

  // Handler when clicking any globe
  const handleGlobeClick = (categoryName: string, nodeId: string) => {
    const matchingNode = FORGE_NODES.find((n) => n.id === nodeId) || FORGE_NODES[0];
    onSelectNode(matchingNode);
  };

  return (
    <div
      className={`forge-canvas-wrapper ${isIsolated ? "isolated-skills-mode" : ""}`}
      aria-hidden="false"
    >
      <Canvas
        camera={{ position: [0, cameraY, cameraZ], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{
          alpha: !isIsolated,
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="forge-three-canvas"
      >
        {isIsolated && <color attach="background" args={["#060609"]} />}

        {/* Cinematic Atmospheric Lighting */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[0, 6, 4]} intensity={2.8} color="#ffffff" />
        <directionalLight position={[-4, 3, 2]} intensity={1.5} color="#a0a0b0" />
        <directionalLight position={[4, 3, 2]} intensity={1.5} color="#a0a0b0" />
        <pointLight position={[0, 2.5, 0]} intensity={16} color="#e0e0ff" distance={8} />

        {/* In isolated 3D mode: render grounded floor runway & grid */}
        {isIsolated && (
          <group position={[0, -1.1, 0]}>
            <gridHelper
              args={[16, 24, "#444455", "#181822"]}
              position={[0, 0, 0]}
            />
            {/* Center Runway */}
            <mesh position={[0, -0.01, -1]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.4, 12]} />
              <meshBasicMaterial color="#0c0c14" />
            </mesh>
            {/* Runway Edge Lines */}
            <mesh position={[-1.2, 0.01, -1]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.04, 12]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
            <mesh position={[1.2, 0.01, -1]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.04, 12]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          </group>
        )}

        {/* Interactive Subtle Parallax tilt */}
        <group
          rotation={[
            mousePos.y * 0.025,
            mousePos.x * 0.04,
            0,
          ]}
        >
          {/* ------------------------------------------------------------- */}
          {/* GLOBE 01 — FRONT-LEFT: PROGRAMMING                            */}
          {/* Grounded on floor dais, scale: 0.58                           */}
          {/* ------------------------------------------------------------- */}
          <GothicSkillPodium
            label="PROGRAMMING"
            position={[-1.75, -0.68, 0.5]}
            scale={0.58}
            isSelected={activeGlobeCategory === "programming"}
            onClick={() => handleGlobeClick("Programming", "python")}
            reduced={reduced}
          >
            <ProgrammingGlobe
              isSelected={activeGlobeCategory === "programming"}
              isHovered={false}
              reduced={reduced}
            />
          </GothicSkillPodium>

          {/* ------------------------------------------------------------- */}
          {/* GLOBE 02 — REAR-LEFT: AI / ML                                 */}
          {/* Grounded on midground aisle, scale: 0.44                      */}
          {/* ------------------------------------------------------------- */}
          <GothicSkillPodium
            label="AI / ML"
            position={[-1.18, -0.36, -1.4]}
            scale={0.44}
            isSelected={activeGlobeCategory === "ai / ml"}
            onClick={() => handleGlobeClick("AI / ML", "ml")}
            reduced={reduced}
          >
            <AiMlGlobe
              isSelected={activeGlobeCategory === "ai / ml"}
              isHovered={false}
              reduced={reduced}
            />
          </GothicSkillPodium>

          {/* ------------------------------------------------------------- */}
          {/* GLOBE 03 — REAR-RIGHT: DATABASES                              */}
          {/* Grounded on midground aisle, scale: 0.44                      */}
          {/* ------------------------------------------------------------- */}
          <GothicSkillPodium
            label="DATABASES"
            position={[1.18, -0.36, -1.4]}
            scale={0.44}
            isSelected={activeGlobeCategory === "databases"}
            onClick={() => handleGlobeClick("Databases", "databases")}
            reduced={reduced}
          >
            <DatabasesGlobe
              isSelected={activeGlobeCategory === "databases"}
              isHovered={false}
              reduced={reduced}
            />
          </GothicSkillPodium>

          {/* ------------------------------------------------------------- */}
          {/* GLOBE 04 — FRONT-RIGHT: TOOLS & CLOUD                         */}
          {/* Grounded on floor dais, scale: 0.58                           */}
          {/* ------------------------------------------------------------- */}
          <GothicSkillPodium
            label="TOOLS & CLOUD"
            position={[1.75, -0.68, 0.5]}
            scale={0.58}
            isSelected={activeGlobeCategory === "tools & cloud"}
            onClick={() => handleGlobeClick("Tools & Cloud", "cloud")}
            reduced={reduced}
          >
            <ToolsCloudGlobe
              isSelected={activeGlobeCategory === "tools & cloud"}
              isHovered={false}
              reduced={reduced}
            />
          </GothicSkillPodium>

          {/* Subtle Ambient Cathedral Dust Floating Particles */}
          {!reduced && (
            <Sparkles
              count={70}
              size={1.6}
              scale={[8, 4, 8]}
              speed={0.18}
              color="#ffffff"
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
