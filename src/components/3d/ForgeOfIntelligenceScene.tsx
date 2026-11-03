import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, 512, 128);

  // Outer bright border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 5;
  ctx.strokeRect(6, 6, 500, 116);

  // Inner subtle accent frame
  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, 12, 488, 104);

  // Label text
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 38px 'IBM Plex Mono', monospace, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// -----------------------------------------------------------------------------
// GLOBE 01 — PROGRAMMING (Front-Left)
// Dark polished chrome-obsidian sphere, dual interlocking silver serpentine calipers,
// engraved equatorial seam, machined silver meridian gimbal ring.
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
  const glyphRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (reduced) return;
    const speed = isSelected ? 0.35 : 0.7;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45 * speed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5 * speed;
      ringRef.current.rotation.x += delta * 0.2 * speed;
    }
    if (glyphRef.current) {
      glyphRef.current.rotation.y -= delta * 0.5 * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dark Polished Chrome-Obsidian Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.34, 48, 48]} />
        <meshPhysicalMaterial
          color="#0c0d14"
          roughness={0.12}
          metalness={0.94}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          reflectivity={0.96}
        />
      </mesh>

      {/* Equatorial Inscribed Silver Seam */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.342, 0.005, 12, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.65} />
      </mesh>

      {/* Dual Interlocking Silver Python / Algorithm Caliper Arms */}
      <group ref={glyphRef}>
        {/* Upper caliper curve */}
        <mesh position={[0.035, 0.06, 0]}>
          <torusGeometry args={[0.08, 0.02, 16, 32, Math.PI * 1.3]} />
          <meshStandardMaterial
            color="#dadde6"
            metalness={0.98}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.5 : 0.2}
          />
        </mesh>
        <mesh position={[0.095, 0.105, 0]}>
          <sphereGeometry args={[0.02, 14, 14]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Lower caliper curve */}
        <mesh position={[-0.035, -0.06, 0]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.08, 0.02, 16, 32, Math.PI * 1.3]} />
          <meshStandardMaterial
            color="#dadde6"
            metalness={0.98}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.5 : 0.2}
          />
        </mesh>
        <mesh position={[-0.095, -0.105, 0]}>
          <sphereGeometry args={[0.02, 14, 14]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Machined Silver Outer Meridian Ring */}
      <group ref={ringRef} rotation={[0.4, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[0.46, 0.014, 16, 64]} />
          <meshStandardMaterial
            color="#dadde6"
            metalness={0.96}
            roughness={0.12}
          />
        </mesh>
        {/* Cardinal tick notches */}
        {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((ang, i) => (
          <mesh
            key={i}
            position={[Math.cos(ang) * 0.46, Math.sin(ang) * 0.46, 0]}
          >
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// GLOBE 02 — AI / MACHINE LEARNING (Rear-Left)
// Faceted dark chrome icosahedral shell, internal illuminated neural network graph,
// sloped silver orbital gyro ring.
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

  // Neural network nodes in 3D volume
  const nodes = useMemo(() => {
    return [
      new THREE.Vector3(-0.14, 0.1, 0.05),
      new THREE.Vector3(-0.12, -0.1, -0.04),
      new THREE.Vector3(-0.02, 0.15, -0.07),
      new THREE.Vector3(0.0, 0.0, 0.12),
      new THREE.Vector3(0.04, -0.13, 0.07),
      new THREE.Vector3(0.12, 0.11, -0.04),
      new THREE.Vector3(0.14, -0.07, -0.08),
      new THREE.Vector3(0.02, 0.02, -0.13),
    ];
  }, []);

  const connections = useMemo(() => {
    return [
      [0, 2], [0, 3], [1, 3], [1, 4], [2, 5],
      [3, 5], [3, 6], [4, 6], [2, 7], [6, 7],
    ];
  }, []);

  useFrame((_, delta) => {
    if (reduced) return;
    const speed = isSelected ? 0.35 : 0.7;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35 * speed;
    }
    if (networkRef.current) {
      networkRef.current.rotation.y -= delta * 0.45 * speed;
      networkRef.current.rotation.x += delta * 0.15 * speed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.45 * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Translucent Dark-Chrome Crystalline Outer Facet Shell */}
      <mesh>
        <icosahedronGeometry args={[0.34, 2]} />
        <meshPhysicalMaterial
          color="#101118"
          roughness={0.14}
          metalness={0.92}
          transmission={0.55}
          transparent
          opacity={0.86}
        />
      </mesh>

      {/* Fine Silver Facet Wireframe Edges */}
      <mesh>
        <icosahedronGeometry args={[0.342, 2]} />
        <meshBasicMaterial
          color="#d8dce8"
          wireframe
          transparent
          opacity={isSelected || isHovered ? 0.55 : 0.28}
        />
      </mesh>

      {/* Internal Illuminated Neural Network */}
      <group ref={networkRef}>
        {nodes.map((pos, idx) => (
          <mesh key={idx} position={pos}>
            <sphereGeometry args={[0.022, 14, 14]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={isSelected || isHovered ? 1.0 : 0.6}
            />
          </mesh>
        ))}

        {connections.map(([fromIdx, toIdx], i) => {
          const from = nodes[fromIdx];
          const to = nodes[toIdx];
          const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
          const dir = new THREE.Vector3().subVectors(to, from);
          const len = dir.length();

          return (
            <mesh key={i} position={mid}>
              <cylinderGeometry args={[0.005, 0.005, len, 8]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isSelected || isHovered ? 0.75 : 0.4}
              />
            </mesh>
          );
        })}
      </group>

      {/* Slanted Silver Gyro Ring */}
      <group ref={ringRef} rotation={[-0.45, 0.35, 0.2]}>
        <mesh>
          <torusGeometry args={[0.46, 0.012, 16, 64]} />
          <meshStandardMaterial
            color="#c8ccd8"
            metalness={0.96}
            roughness={0.14}
          />
        </mesh>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// GLOBE 03 — DATABASES (Rear-Right)
// Smoked quartz sphere, central turned-silver data spine, 3 precision-turned
// database platter discs with glowing silver seams, horizontal gimbal ring.
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
    const speed = isSelected ? 0.35 : 0.7;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4 * speed;
    }
    if (plattersRef.current) {
      plattersRef.current.rotation.y -= delta * 0.45 * speed;
    }
    if (pulseRingRef.current) {
      const t = state.clock.getElapsedTime() * 2;
      pulseRingRef.current.position.y = Math.sin(t) * 0.14;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer Smoked Quartz Glass Sphere */}
      <mesh>
        <sphereGeometry args={[0.34, 48, 48]} />
        <meshPhysicalMaterial
          color="#0a0b12"
          roughness={0.12}
          metalness={0.9}
          transmission={0.55}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Internal Stacked Silver Database Architecture */}
      <group ref={plattersRef}>
        {/* Central Vertical Data Spine */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.02, 0.42, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.08}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.6 : 0.25}
          />
        </mesh>

        {/* 3 Tiered Database Discs */}
        {[-0.1, 0.0, 0.1].map((y, idx) => (
          <group key={idx} position={[0, y, 0]}>
            <mesh>
              <cylinderGeometry args={[0.2, 0.2, 0.028, 32]} />
              <meshStandardMaterial
                color="#dadde6"
                metalness={0.96}
                roughness={0.12}
              />
            </mesh>
            <mesh>
              <torusGeometry args={[0.202, 0.005, 12, 32]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={isSelected || isHovered ? 0.8 : 0.45}
              />
            </mesh>
          </group>
        ))}

        {/* Vertical Pulse Traveling Ring */}
        <mesh ref={pulseRingRef}>
          <torusGeometry args={[0.218, 0.006, 12, 32]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Horizontal Silver Support Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.46, 0.014, 16, 64]} />
        <meshStandardMaterial
          color="#dadde6"
          metalness={0.96}
          roughness={0.14}
        />
      </mesh>
    </group>
  );
}

// -----------------------------------------------------------------------------
// GLOBE 04 — TOOLS & CLOUD (Front-Right)
// Dark titanium sphere with engraved coordinate lines, sculpted silver cloud relief
// with physical thickness, inclined orbital ring with micro-satellites.
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
    const speed = isSelected ? 0.35 : 0.75;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.45 * speed;
    }
    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.z += delta * 0.7 * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dark Brushed Titanium Base Sphere */}
      <mesh>
        <sphereGeometry args={[0.34, 48, 48]} />
        <meshStandardMaterial
          color="#12141c"
          metalness={0.94}
          roughness={0.18}
        />
      </mesh>

      {/* Engraved Coordinate Meridian & Latitude Rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.342, 0.004, 12, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.342, 0.004, 12, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
      </mesh>

      {/* Central Sculpted Silver Cloud Relief (Beveled Solid Depth) */}
      <group position={[0, 0, 0.2]} scale={1.05}>
        {/* Base horizontal cylinder */}
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.025, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.14, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.55 : 0.25}
          />
        </mesh>
        {/* Center lobe */}
        <mesh position={[0, 0.025, 0]}>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.55 : 0.25}
          />
        </mesh>
        {/* Left lobe */}
        <mesh position={[-0.055, -0.008, 0]}>
          <sphereGeometry args={[0.048, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.55 : 0.25}
          />
        </mesh>
        {/* Right lobe */}
        <mesh position={[0.055, -0.008, 0]}>
          <sphereGeometry args={[0.048, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.98}
            roughness={0.1}
            emissive="#ffffff"
            emissiveIntensity={isSelected || isHovered ? 0.55 : 0.25}
          />
        </mesh>
      </group>

      {/* Inclined Orbital Satellite Ring */}
      <group rotation={[0.5, 0.35, 0]}>
        <mesh>
          <torusGeometry args={[0.48, 0.012, 16, 64]} />
          <meshStandardMaterial
            color="#dadde6"
            metalness={0.96}
            roughness={0.14}
          />
        </mesh>

        {/* Orbiting Micro-Satellites */}
        <group ref={orbitGroupRef}>
          <group position={[0.48, 0, 0]}>
            <mesh>
              <boxGeometry args={[0.04, 0.04, 0.04]} />
              <meshStandardMaterial color="#ffffff" metalness={0.95} />
            </mesh>
            <mesh position={[0.04, 0, 0]}>
              <boxGeometry args={[0.04, 0.018, 0.004]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <mesh position={[-0.04, 0, 0]}>
              <boxGeometry args={[0.04, 0.018, 0.004]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          <group position={[-0.48, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.02, 12, 12]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// PHYSICALLY GROUNDED ARCHITECTURAL SKILL PODIUM
// Matching dimensions, consistent floor contact height, silver plinth trim,
// twin machined caliper arms holding rotational axle.
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
      {/* 1. Ground Contact Shadow (Sitting squarely on marble floor) */}
      <mesh position={[0, -0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.54, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.88}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Perimeter Subtle Dais Accent Ring */}
      <mesh position={[0, -0.678, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.48, 0.52, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={isSelected ? 0.85 : hovered ? 0.5 : 0.22}
        />
      </mesh>

      {/* 3. Base Stepped Tier (Granite Fluted Plinth) */}
      <mesh position={[0, -0.62, 0]}>
        <cylinderGeometry args={[0.38, 0.44, 0.08, 36]} />
        <meshStandardMaterial
          color="#0e0f14"
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* 4. Middle Obsidian Column Tier */}
      <mesh position={[0, -0.52, 0]}>
        <cylinderGeometry args={[0.30, 0.35, 0.12, 36]} />
        <meshStandardMaterial
          color="#08080c"
          roughness={0.18}
          metalness={0.9}
        />
      </mesh>

      {/* 5. Machined Silver Plinth Bevel Trim */}
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.02, 36]} />
        <meshStandardMaterial
          color="#dadde6"
          roughness={0.14}
          metalness={0.96}
        />
      </mesh>

      {/* 6. Top Gimbal Socket Collar */}
      <mesh position={[0, -0.40, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.08, 36]} />
        <meshStandardMaterial
          color="#101118"
          roughness={0.22}
          metalness={0.88}
        />
      </mesh>

      {/* 7. Engraved Plaque on Front of Column Facing Camera */}
      <mesh position={[0, -0.52, 0.34]}>
        <boxGeometry args={[0.42, 0.11, 0.02]} />
        <meshStandardMaterial
          map={plaqueTexture}
          roughness={0.14}
          metalness={0.92}
        />
      </mesh>

      {/* 8. Twin Machined Silver Caliper Arms (Connected to base & holding globe axle) */}
      <group position={[0, -0.32, 0]}>
        {/* Left arm */}
        <mesh position={[-0.34, 0.18, 0]} rotation={[0, 0, -0.14]}>
          <cylinderGeometry args={[0.016, 0.022, 0.36, 16]} />
          <meshStandardMaterial
            color="#dadde6"
            metalness={0.96}
            roughness={0.12}
          />
        </mesh>
        <mesh position={[-0.34, 0.34, 0]}>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshStandardMaterial color="#ffffff" metalness={0.98} />
        </mesh>

        {/* Right arm */}
        <mesh position={[0.34, 0.18, 0]} rotation={[0, 0, 0.14]}>
          <cylinderGeometry args={[0.016, 0.022, 0.36, 16]} />
          <meshStandardMaterial
            color="#dadde6"
            metalness={0.96}
            roughness={0.12}
          />
        </mesh>
        <mesh position={[0.34, 0.34, 0]}>
          <sphereGeometry args={[0.026, 12, 12]} />
          <meshStandardMaterial color="#ffffff" metalness={0.98} />
        </mesh>
      </group>

      {/* 9. Localized Uplight Spotlight beneath the globe */}
      <pointLight
        position={[0, -0.25, 0]}
        intensity={isSelected ? 32 : hovered ? 18 : 8}
        color="#ffffff"
        distance={2.8}
      />

      {/* 10. Rotating Skill Globe Mounted Between Caliper Arms */}
      <group
        position={[0, 0.02, 0]}
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
        {/* Generous Hit Proxy for Touch and Mouse Clicking */}
        <mesh visible={false}>
          <sphereGeometry args={[0.55, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>

        {children}
      </group>
    </group>
  );
}

// -----------------------------------------------------------------------------
// RESPONSIVE CAMERA CONTROLLER FOR SKILLS SCENE
// -----------------------------------------------------------------------------
function SkillsCameraController({
  activeCategory,
  isMobile,
  isTablet,
}: {
  activeCategory: string;
  isMobile: boolean;
  isTablet: boolean;
}) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    let targetX = 0;
    let targetY = 0.42;
    let targetZ = 6.0;

    if (isMobile) {
      targetY = 0.05;
      targetZ = 4.5;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 4.0);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 4.0);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 4.0);
      camera.lookAt(targetX, -0.6, 0);
      return;
    } else if (isTablet) {
      targetZ = 6.4;
      targetY = 0.38;
      targetX = 0;
    } else {
      targetZ = 6.0;
      targetY = 0.42;
      targetX = 0;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, delta * 3.5);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, delta * 3.5);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, delta * 3.5);
    camera.lookAt(targetX * 0.2, -0.15, 0);
  });

  return null;
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
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  const { isIsolated, isDebug } = useMemo(() => {
    if (typeof window === "undefined") {
      return { isIsolated: false, isDebug: false };
    }
    const params = new URLSearchParams(window.location.search);
    return {
      isIsolated: params.get("isolate") === "skills3d",
      isDebug: params.get("debug") === "skills",
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

  // Active category mapping to one of the 4 globes
  const activeGlobeCategory = useMemo(() => {
    const cat = activeCategory.toLowerCase();
    if (cat === "all skills" || cat === "programming" || cat === "web development") {
      return "programming";
    }
    if (cat === "ai / ml" || cat === "other") {
      return "ai / ml";
    }
    if (cat === "databases") {
      return "databases";
    }
    if (cat === "tools & cloud" || cat === "tools") {
      return "tools & cloud";
    }
    return "programming";
  }, [activeCategory]);

  const handleGlobeClick = (categoryName: string, nodeId: string) => {
    const matchingNode = FORGE_NODES.find((n) => n.id === nodeId) || FORGE_NODES[0];
    onSelectNode(matchingNode);
  };

  // Measured, perspective-calibrated 3D world coordinates on the cathedral ground plane:
  // Ground plane: y = -0.92
  // Foreground globes: x = ±1.35, y = -0.92, z = 0.4 (safely within central 54% column)
  // Rear globes: x = ±0.85, y = -0.92, z = -1.8 (grounded on aisle, unobstructed center walkway)
  const fgLeftPos: [number, number, number] = [-1.35, -0.92, 0.4];
  const fgRightPos: [number, number, number] = [1.35, -0.92, 0.4];
  const bgLeftPos: [number, number, number] = [-0.85, -0.92, -1.8];
  const bgRightPos: [number, number, number] = [0.85, -0.92, -1.8];

  const globeScale = 0.48;
  const mobileNode = FORGE_NODES.find((node) => node.id === selectedNodeId) ?? FORGE_NODES[0];
  const mobileExhibit = mobileNode.category.toLowerCase() === "ai / ml" || mobileNode.category.toLowerCase() === "other"
    ? "ai / ml"
    : mobileNode.category.toLowerCase() === "databases"
      ? "databases"
      : mobileNode.category.toLowerCase() === "tools & cloud"
        ? "tools & cloud"
        : "programming";

  return (
    <div
      className={`forge-canvas-wrapper ${isIsolated ? "isolated-skills-mode" : ""}`}
      aria-hidden="false"
      role="region"
      aria-label="3D Forge of Intelligence Skill Arena"
    >
      <Canvas
        camera={{
          position: [0, 0.42, 6.0],
          fov: 36,
          near: 0.1,
          far: 50,
        }}
        dpr={[1, 1.5]}
        gl={{
          alpha: !isIsolated,
          antialias: true,
          powerPreference: "high-performance",
        }}
        className="forge-three-canvas"
      >
        {isIsolated && <color attach="background" args={["#060609"]} />}

        <SkillsCameraController
          activeCategory={activeCategory}
          isMobile={isMobile}
          isTablet={isTablet}
        />

        {/* Development Debug Helper (?debug=skills) */}
        {isDebug && (
          <group>
            <axesHelper args={[2.5]} />
            <gridHelper args={[12.0, 24, "#ffffff", "#33384a"]} position={[0, -0.92, 0]} />
          </group>
        )}

        {/* Cinematic Monochromatic Cathedral Lighting */}
        <ambientLight intensity={1.1} color="#b8c0d4" />
        <directionalLight position={[0, 7, 3]} intensity={2.6} color="#ffffff" />
        <directionalLight position={[-4, 3, 2]} intensity={1.4} color="#a0a8bc" />
        <directionalLight position={[4, 3, 2]} intensity={1.4} color="#a0a8bc" />

        {/* Isolated Floor & Runway in ?isolate=skills3d mode */}
        {isIsolated && (
          <group position={[0, -0.92, 0]}>
            <gridHelper args={[16, 24, "#ffffff", "#222534"]} position={[0, 0, 0]} />
            <mesh position={[0, -0.01, -1]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[2.0, 12]} />
              <meshBasicMaterial color="#0c0d16" />
            </mesh>
          </group>
        )}

        {/* Mobile presents one category-selected exhibit; wider scenes retain all four. */}
        <group>
          {isMobile ? (
            <GothicSkillPodium label={mobileNode.name} position={[0, -0.92, 0]} scale={0.78}
              isSelected onClick={() => handleGlobeClick(mobileNode.category, mobileNode.id)} reduced={reduced}>
              {mobileExhibit === "ai / ml" ? <AiMlGlobe isSelected isHovered={false} reduced={reduced} />
                : mobileExhibit === "databases" ? <DatabasesGlobe isSelected isHovered={false} reduced={reduced} />
                  : mobileExhibit === "tools & cloud" ? <ToolsCloudGlobe isSelected isHovered={false} reduced={reduced} />
                    : <ProgrammingGlobe isSelected isHovered={false} reduced={reduced} />}
            </GothicSkillPodium>
          ) : <>
          {/* ------------------------------------------------------------- */}
          {/* GLOBE 01 — FRONT-LEFT: PROGRAMMING                            */}
          {/* Sits on foreground dais, matching base & shadow               */}
          {/* ------------------------------------------------------------- */}
          <GothicSkillPodium
            label="PROGRAMMING"
            position={fgLeftPos}
            scale={globeScale}
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
          {/* Grounded on aisle floor, natural perspective depth            */}
          {/* ------------------------------------------------------------- */}
          <GothicSkillPodium
            label="AI / ML"
            position={bgLeftPos}
            scale={globeScale}
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
          {/* Grounded on aisle floor, natural perspective depth            */}
          {/* ------------------------------------------------------------- */}
          <GothicSkillPodium
            label="DATABASES"
            position={bgRightPos}
            scale={globeScale}
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
          {/* Sits on foreground dais, matching base & shadow               */}
          {/* ------------------------------------------------------------- */}
          <GothicSkillPodium
            label="TOOLS & CLOUD"
            position={fgRightPos}
            scale={globeScale}
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

          </>}
          {/* Subtle Cathedral Floating Dust Motes */}
          {!reduced && (
            <Sparkles
              count={isMobile ? 25 : 55}
              size={1.3}
              scale={[8, 4, 8]}
              speed={0.15}
              color="#ffffff"
            />
          )}
        </group>
      </Canvas>
    </div>
  );
}
