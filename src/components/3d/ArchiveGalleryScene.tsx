import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================================
// CIRCULAR STEPPED PEDESTAL COMPONENT
// Premium obsidian-chrome dais with concentric luminous seams, radial notches,
// and inscribed technical exhibit number (01, 02, 03)
// ============================================================================
function ExhibitPedestal({
  number,
  label,
  isSelected,
  isHovered,
  isDimmed,
  position,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  number: string;
  label: string;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const ringRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ringRef.current && (isSelected || isHovered)) {
      ringRef.current.rotation.y += delta * 0.2;
    }
  });

  const opacityFactor = isDimmed ? 0.35 : 1.0;
  const highlightColor = isSelected ? "#ffffff" : isHovered ? "#d0d0dc" : "#808090";

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
    >
      {/* Invisible hit cylinder */}
      <mesh position={[0, 0.4, 0]} visible={false}>
        <cylinderGeometry args={[1.15, 1.15, 1.2, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* TIER 1: Lower Wide Plinth */}
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[1.05, 1.1, 0.16, 48]} />
        <meshStandardMaterial
          color="#06060a"
          roughness={0.22}
          metalness={0.92}
          transparent
          opacity={0.95 * opacityFactor}
        />
      </mesh>
      {/* Lower plinth bottom edge ring */}
      <mesh position={[0, -0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.09, 1.11, 48]} />
        <meshBasicMaterial
          color="#353540"
          transparent
          opacity={0.5 * opacityFactor}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* TIER 2: Upper Stepped Plinth */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.92, 0.95, 0.14, 48]} />
        <meshStandardMaterial
          color="#090910"
          roughness={0.16}
          metalness={0.96}
          transparent
          opacity={0.98 * opacityFactor}
        />
      </mesh>

      {/* Polished Chrome Bevel Edge Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.91, 0.93, 48]} />
        <meshBasicMaterial
          color={highlightColor}
          transparent
          opacity={(isSelected ? 0.95 : isHovered ? 0.75 : 0.45) * opacityFactor}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Concentric Luminous Top Surface Seams */}
      <group position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[0.78, 0.795, 48]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={(isSelected ? 0.8 : isHovered ? 0.55 : 0.28) * opacityFactor}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.55, 0.565, 40]} />
          <meshBasicMaterial
            color="#c0c0d0"
            transparent
            opacity={(isSelected ? 0.7 : isHovered ? 0.45 : 0.2) * opacityFactor}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh>
          <ringGeometry args={[0.26, 0.32, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={(isSelected ? 0.45 : isHovered ? 0.3 : 0.12) * opacityFactor}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Radial Ticks / Markings */}
      <group ref={ringRef} position={[0, 0.053, 0]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 0.85;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * r, 0, Math.sin(angle) * r]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[0.04, 0.005, 0.008]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={(isSelected ? 0.9 : 0.4) * opacityFactor}
              />
            </mesh>
          );
        })}
      </group>

      {/* Front Inscribed Pedestal Numeral Plaque */}
      <group position={[0, -0.02, 0.96]} rotation={[-0.05, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.32, 0.12]} />
          <meshBasicMaterial
            color="#040407"
            transparent
            opacity={0.88 * opacityFactor}
          />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(0.32, 0.12)]} />
          <lineBasicMaterial
            color={highlightColor}
            transparent
            opacity={(isSelected ? 0.95 : 0.45) * opacityFactor}
          />
        </lineSegments>
      </group>
    </group>
  );
}

// ============================================================================
// EXHIBIT 01: DOCRECON - DOCUMENT INTELLIGENCE
// ============================================================================
function DocReconExhibit({
  isSelected,
  isHovered,
  isDimmed,
  position,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scanLineRef = useRef<THREE.Group>(null);
  const scanLightRef = useRef<THREE.PointLight>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      const lift = isSelected ? 0.06 : isHovered ? 0.04 : 0;
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        0.88 + lift + Math.sin(t * 0.9) * 0.025,
        4,
        delta
      );
      groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.05 - 0.06;
    }

    if (scanLineRef.current) {
      const scanY = Math.sin(t * 1.8) * 0.52;
      scanLineRef.current.position.y = scanY;
      if (scanLightRef.current) {
        scanLightRef.current.intensity = isSelected
          ? 4.5
          : isHovered
          ? 3.2
          : 1.8 + Math.sin(t * 4.0) * 0.4;
      }
    }
  });

  const opacityFactor = isDimmed ? 0.35 : 1.0;

  return (
    <group
      position={[position[0], position[1], position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
    >
      <ExhibitPedestal
        number="01"
        label="DOCRECON"
        isSelected={isSelected}
        isHovered={isHovered}
        isDimmed={isDimmed}
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <group ref={groupRef} position={[0, 0.88, 0]}>
        {/* Layer 3: Back Sheet */}
        <group position={[0.1, 0.12, -0.22]} rotation={[0.06, -0.1, 0.04]}>
          <mesh>
            <planeGeometry args={[1.05, 1.45]} />
            <meshPhysicalMaterial
              color="#07070b"
              roughness={0.18}
              transmission={0.72}
              transparent
              opacity={0.65 * opacityFactor}
              metalness={0.6}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.05, 1.45)]} />
            <lineBasicMaterial
              color="#555560"
              transparent
              opacity={0.5 * opacityFactor}
            />
          </lineSegments>
        </group>

        {/* Layer 2: Mid Sheet */}
        <group position={[-0.08, 0.06, -0.1]} rotation={[0.03, 0.08, -0.02]}>
          <mesh>
            <planeGeometry args={[1.1, 1.5]} />
            <meshPhysicalMaterial
              color="#090910"
              roughness={0.14}
              transmission={0.8}
              transparent
              opacity={0.78 * opacityFactor}
              metalness={0.7}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.1, 1.5)]} />
            <lineBasicMaterial
              color="#787884"
              transparent
              opacity={0.65 * opacityFactor}
            />
          </lineSegments>
        </group>

        {/* Layer 1: Front Primary Sheet */}
        <group position={[0, 0, 0]} rotation={[0.04, -0.05, 0.015]}>
          <mesh>
            <planeGeometry args={[1.16, 1.58]} />
            <meshPhysicalMaterial
              color="#0b0b14"
              roughness={0.08}
              metalness={0.4}
              transmission={0.88}
              transparent
              opacity={0.92 * opacityFactor}
              clearcoat={1.0}
              clearcoatRoughness={0.06}
              reflectivity={0.94}
            />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(1.16, 1.58)]} />
            <lineBasicMaterial
              color={isSelected ? "#ffffff" : isHovered ? "#d0d0dc" : "#9898a4"}
              transparent
              opacity={(isSelected ? 1.0 : isHovered ? 0.9 : 0.85) * opacityFactor}
            />
          </lineSegments>

          {/* Form Structure Elements */}
          <mesh position={[0, 0.58, 0.015]}>
            <planeGeometry args={[0.94, 0.09]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.45 * opacityFactor}
            />
          </mesh>
          <mesh position={[-0.36, 0.58, 0.02]}>
            <planeGeometry args={[0.15, 0.06]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.8 * opacityFactor}
            />
          </mesh>
          <mesh position={[0.35, 0.58, 0.02]}>
            <planeGeometry args={[0.15, 0.06]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.7 * opacityFactor}
            />
          </mesh>
          <mesh position={[0, 0.46, 0.015]}>
            <planeGeometry args={[0.94, 0.008]} />
            <meshBasicMaterial
              color="#888892"
              transparent
              opacity={0.65 * opacityFactor}
            />
          </mesh>
          <mesh position={[0, 0.28, 0.015]}>
            <planeGeometry args={[0.94, 0.06]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.28 * opacityFactor}
            />
          </mesh>
          {[-0.2, -0.06, 0.08, 0.2].map((y, idx) => (
            <mesh key={idx} position={[0, y, 0.015]}>
              <planeGeometry args={[0.94, 0.006]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.35 * opacityFactor}
              />
            </mesh>
          ))}
          {[-0.16, 0.16].map((x, idx) => (
            <mesh key={idx} position={[x, 0.02, 0.015]}>
              <planeGeometry args={[0.005, 0.52]} />
              <meshBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.32 * opacityFactor}
              />
            </mesh>
          ))}
          <mesh position={[0.26, -0.44, 0.015]}>
            <planeGeometry args={[0.42, 0.1]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.3 * opacityFactor}
            />
          </mesh>
          <mesh position={[-0.26, -0.44, 0.02]} rotation={[0, 0, Math.PI / 8]}>
            <ringGeometry args={[0.085, 0.095, 8]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.8 * opacityFactor}
            />
          </mesh>

          {/* OCR Bounding Boxes */}
          <group position={[-0.04, 0.46, 0.03]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.44, 0.07)]} />
              <lineBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.95 * opacityFactor}
              />
            </lineSegments>
          </group>
          <group position={[-0.1, 0.08, 0.03]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.64, 0.08)]} />
              <lineBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.95 * opacityFactor}
              />
            </lineSegments>
          </group>
          <group position={[0.26, -0.44, 0.035]}>
            <lineSegments>
              <edgesGeometry args={[new THREE.PlaneGeometry(0.4, 0.09)]} />
              <lineBasicMaterial
                color="#ffffff"
                transparent
                opacity={1.0 * opacityFactor}
              />
            </lineSegments>
          </group>

          {/* Laser Scanner Assembly */}
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
                opacity={0.38 * opacityFactor}
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
// EXHIBIT 02: PATHWAY AI - SMART URBAN RAG
// ============================================================================
function PathwayAIExhibit({
  isSelected,
  isHovered,
  isDimmed,
  position,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const cityRef = useRef<THREE.Group>(null);
  const globeRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const buildings = useMemo(() => {
    return [
      { x: -0.38, z: -0.28, h: 0.75, w: 0.16, d: 0.16, tiers: 1 },
      { x: -0.18, z: -0.32, h: 1.10, w: 0.18, d: 0.18, tiers: 2 },
      { x: 0.16, z: -0.30, h: 0.95, w: 0.17, d: 0.17, tiers: 1 },
      { x: 0.38, z: -0.25, h: 0.70, w: 0.15, d: 0.15, tiers: 1 },
      { x: -0.42, z: 0.02, h: 0.65, w: 0.15, d: 0.15, tiers: 1 },
      { x: 0.40, z: 0.05, h: 0.80, w: 0.16, d: 0.16, tiers: 1 },
      { x: -0.30, z: 0.28, h: 0.55, w: 0.15, d: 0.15, tiers: 1 },
      { x: -0.08, z: 0.30, h: 0.90, w: 0.18, d: 0.18, tiers: 2 },
      { x: 0.22, z: 0.26, h: 0.60, w: 0.16, d: 0.16, tiers: 1 },
      { x: -0.22, z: -0.05, h: 1.25, w: 0.20, d: 0.20, tiers: 2 },
      { x: 0.20, z: -0.04, h: 1.20, w: 0.19, d: 0.19, tiers: 2 },
      { x: 0.00, z: -0.02, h: 1.55, w: 0.24, d: 0.24, tiers: 3 },
    ];
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (cityRef.current) cityRef.current.rotation.y = t * 0.06;

    if (globeRef.current) {
      const lift = isSelected ? 0.06 : isHovered ? 0.04 : 0;
      globeRef.current.position.y = 1.95 + lift + Math.sin(t * 1.1) * 0.035;
      globeRef.current.rotation.y -= delta * 0.3;
    }

    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.4;
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x -= delta * 0.35;
      ring2Ref.current.rotation.y += delta * 0.25;
    }
  });

  const opacityFactor = isDimmed ? 0.35 : 1.0;

  return (
    <group
      position={[position[0], position[1], position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
    >
      <ExhibitPedestal
        number="02"
        label="PATHWAY AI"
        isSelected={isSelected}
        isHovered={isHovered}
        isDimmed={isDimmed}
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <group ref={cityRef} position={[0, 0.06, 0]}>
        {buildings.map((b, i) => (
          <group key={i} position={[b.x, 0, b.z]}>
            <mesh position={[0, b.h / 2, 0]}>
              <boxGeometry args={[b.w, b.h, b.d]} />
              <meshStandardMaterial
                color="#08080f"
                roughness={0.15}
                metalness={0.95}
                transparent
                opacity={0.98 * opacityFactor}
              />
            </mesh>
            <lineSegments position={[0, b.h / 2, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(b.w, b.h, b.d)]} />
              <lineBasicMaterial
                color={isSelected ? "#ffffff" : isHovered ? "#c0c0d0" : "#727282"}
                transparent
                opacity={(isSelected ? 0.95 : 0.7) * opacityFactor}
              />
            </lineSegments>

            {b.tiers >= 2 && (
              <group position={[0, b.h + 0.08, 0]}>
                <mesh>
                  <boxGeometry args={[b.w * 0.72, 0.16, b.d * 0.72]} />
                  <meshStandardMaterial
                    color="#14141e"
                    roughness={0.16}
                    metalness={0.92}
                    transparent
                    opacity={0.95 * opacityFactor}
                  />
                </mesh>
                <lineSegments>
                  <edgesGeometry args={[new THREE.BoxGeometry(b.w * 0.72, 0.16, b.d * 0.72)]} />
                  <lineBasicMaterial
                    color="#90909c"
                    transparent
                    opacity={0.75 * opacityFactor}
                  />
                </lineSegments>
              </group>
            )}

            <mesh position={[0, b.tiers >= 2 ? b.h + 0.22 : b.h + 0.04, 0]}>
              <cylinderGeometry args={[0.003, 0.007, 0.12, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={opacityFactor} />
            </mesh>
            <mesh position={[0, b.tiers >= 2 ? b.h + 0.28 : b.h + 0.1, 0]}>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={opacityFactor} />
            </mesh>
          </group>
        ))}

        {[-0.22, 0, 0.22].map((offsetZ, idx) => (
          <mesh
            key={idx}
            position={[0, 0.01, offsetZ]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[0.9, 0.012]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.7 * opacityFactor}
            />
          </mesh>
        ))}
      </group>

      <group ref={globeRef} position={[0, 1.95, -0.02]}>
        <mesh>
          <icosahedronGeometry args={[0.28, 2]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.85 * opacityFactor}
          />
        </mesh>
        <mesh>
          <octahedronGeometry args={[0.14, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0.08}
            metalness={0.95}
            transmission={0.65}
            transparent
            opacity={opacityFactor}
          />
        </mesh>
        <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[0.38, 0.007, 8, 36]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.8 * opacityFactor}
          />
        </mesh>
        <mesh ref={ring2Ref} rotation={[-Math.PI / 4, 0, Math.PI / 6]}>
          <torusGeometry args={[0.46, 0.005, 8, 36]} />
          <meshBasicMaterial
            color="#c0c0cc"
            transparent
            opacity={0.6 * opacityFactor}
          />
        </mesh>
      </group>
    </group>
  );
}

// ============================================================================
// EXHIBIT 03: HEFIN - DECENTRALIZED AI
// ============================================================================
function HefinExhibit({
  isSelected,
  isHovered,
  isDimmed,
  position,
  onClick,
  onPointerOver,
  onPointerOut,
}: {
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  position: [number, number, number];
  onClick: () => void;
  onPointerOver: () => void;
  onPointerOut: () => void;
}) {
  const modelRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const cageRef = useRef<THREE.Mesh>(null);
  const pulseGroupRef = useRef<THREE.Group>(null);

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

    if (modelRef.current) {
      const lift = isSelected ? 0.06 : isHovered ? 0.04 : 0;
      modelRef.current.position.y = 0.88 + lift + Math.sin(t * 0.85 + 2) * 0.025;
      modelRef.current.rotation.y = Math.sin(t * 0.35) * 0.07 + 0.08;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.25;
      coreRef.current.rotation.y += delta * 0.35;
    }
    if (cageRef.current) {
      cageRef.current.rotation.x -= delta * 0.18;
      cageRef.current.rotation.z += delta * 0.28;
    }

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

  const opacityFactor = isDimmed ? 0.35 : 1.0;

  return (
    <group
      position={[position[0], position[1], position[2]]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        onPointerOver();
      }}
      onPointerOut={onPointerOut}
    >
      <ExhibitPedestal
        number="03"
        label="HEFIN"
        isSelected={isSelected}
        isHovered={isHovered}
        isDimmed={isDimmed}
        position={[0, 0, 0]}
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      />

      <group ref={modelRef} position={[0, 0.88, 0]}>
        <mesh ref={coreRef} position={[0, 0.2, 0]}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshPhysicalMaterial
            color="#06060c"
            roughness={0.05}
            metalness={0.98}
            transmission={0.88}
            transparent
            opacity={0.92 * opacityFactor}
            clearcoat={1.0}
            clearcoatRoughness={0.06}
            reflectivity={0.98}
          />
        </mesh>

        <mesh position={[0, 0.2, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.12}
            metalness={0.96}
            transparent
            opacity={opacityFactor}
          />
        </mesh>

        <mesh ref={cageRef} position={[0, 0.2, 0]}>
          <icosahedronGeometry args={[0.62, 0]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.75 * opacityFactor}
          />
        </mesh>

        {satellites.map((pos, idx) => {
          const start = new THREE.Vector3(0, 0.2, 0);
          const end = new THREE.Vector3(...(pos as [number, number, number]));
          const lineGeom = new THREE.BufferGeometry().setFromPoints([start, end]);
          const lineMat = new THREE.LineBasicMaterial({
            color: isSelected ? "#ffffff" : isHovered ? "#b0b0bc" : "#72727e",
            transparent: true,
            opacity: (isSelected ? 0.85 : 0.5) * opacityFactor,
          });
          const lineObj = new THREE.Line(lineGeom, lineMat);
          return <primitive key={idx} object={lineObj} />;
        })}

        {satellites.map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            <mesh>
              <boxGeometry args={[0.13, 0.13, 0.13]} />
              <meshStandardMaterial
                color="#12121c"
                roughness={0.15}
                metalness={0.95}
                transparent
                opacity={0.95 * opacityFactor}
              />
            </mesh>
            <lineSegments>
              <edgesGeometry args={[new THREE.BoxGeometry(0.13, 0.13, 0.13)]} />
              <lineBasicMaterial
                color="#ffffff"
                transparent
                opacity={0.8 * opacityFactor}
              />
            </lineSegments>
          </group>
        ))}

        <group ref={pulseGroupRef}>
          {satellites.map((_, idx) => (
            <mesh key={idx}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={opacityFactor} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

// ============================================================================
// SUBTLE FLOATING PARTICLES
// ============================================================================
function ArchiveParticles({ count = 55 }: { count?: number }) {
  const points = useMemo(() => {
    const coords = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 8.5;
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
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
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

// ============================================================================
// MAIN ARCHIVE GALLERY 3D SCENE
// ============================================================================
export default function ArchiveGalleryScene({
  selectedProjectIndex,
  onSelectProject,
  activeMobileIndex = 0,
  reduced = false,
}: {
  selectedProjectIndex: number | null;
  onSelectProject: (index: number) => void;
  activeMobileIndex?: number;
  reduced?: boolean;
}) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 900 : false
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const docReconPos: [number, number, number] = isMobile
    ? [(0 - activeMobileIndex) * 3.8, -0.45, 0]
    : [-1.25, -0.52, 0];
  const pathwayPos: [number, number, number] = isMobile
    ? [(1 - activeMobileIndex) * 3.8, -0.45, 0]
    : [0.95, -0.52, 0];
  const hefinPos: [number, number, number] = isMobile
    ? [(2 - activeMobileIndex) * 3.8, -0.45, 0]
    : [3.15, -0.52, 0];

  return (
    <div
      className="archive-canvas-wrapper"
      style={{ cursor: hoveredIndex !== null ? "pointer" : "default" }}
      aria-hidden="false"
    >
      <Canvas
        camera={{
          position: [0, 0.05, isMobile ? 5.2 : 6.2],
          fov: isMobile ? 44 : 40,
        }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        className="archive-three-canvas"
      >
        <ambientLight intensity={0.85} />

        <directionalLight position={[0, 8, 3]} intensity={2.2} color="#ffffff" />
        <directionalLight position={[-6, 3, 2]} intensity={1.1} color="#90909c" />
        <directionalLight position={[6, 3, 2]} intensity={1.1} color="#90909c" />

        {/* Spotlights with smooth intensity transition */}
        <spotLight
          position={isMobile ? [docReconPos[0], 3.6, 2] : [-1.25, 3.6, 2]}
          target-position={[docReconPos[0], 0, 0]}
          intensity={
            selectedProjectIndex === 0
              ? 14.0
              : hoveredIndex === 0
              ? 8.5
              : selectedProjectIndex !== null
              ? 1.8
              : 4.8
          }
          color="#ffffff"
          angle={0.48}
          penumbra={0.65}
        />

        <spotLight
          position={isMobile ? [pathwayPos[0], 3.8, 2] : [0.95, 3.8, 2]}
          target-position={[pathwayPos[0], 0.2, 0]}
          intensity={
            selectedProjectIndex === 1
              ? 14.0
              : hoveredIndex === 1
              ? 8.5
              : selectedProjectIndex !== null
              ? 1.8
              : 4.8
          }
          color="#ffffff"
          angle={0.48}
          penumbra={0.65}
        />

        <spotLight
          position={isMobile ? [hefinPos[0], 3.6, 2] : [3.15, 3.6, 2]}
          target-position={[hefinPos[0], 0, 0]}
          intensity={
            selectedProjectIndex === 2
              ? 14.0
              : hoveredIndex === 2
              ? 8.5
              : selectedProjectIndex !== null
              ? 1.8
              : 4.8
          }
          color="#ffffff"
          angle={0.48}
          penumbra={0.65}
        />

        {!reduced && <ArchiveParticles count={55} />}

        <group position={[0, 0, 0]}>
          <DocReconExhibit
            isSelected={selectedProjectIndex === 0}
            isHovered={hoveredIndex === 0}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 0}
            position={docReconPos}
            onClick={() => onSelectProject(0)}
            onPointerOver={() => setHoveredIndex(0)}
            onPointerOut={() => setHoveredIndex(null)}
          />

          <PathwayAIExhibit
            isSelected={selectedProjectIndex === 1}
            isHovered={hoveredIndex === 1}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 1}
            position={pathwayPos}
            onClick={() => onSelectProject(1)}
            onPointerOver={() => setHoveredIndex(1)}
            onPointerOut={() => setHoveredIndex(null)}
          />

          <HefinExhibit
            isSelected={selectedProjectIndex === 2}
            isHovered={hoveredIndex === 2}
            isDimmed={selectedProjectIndex !== null && selectedProjectIndex !== 2}
            position={hefinPos}
            onClick={() => onSelectProject(2)}
            onPointerOver={() => setHoveredIndex(2)}
            onPointerOut={() => setHoveredIndex(null)}
          />
        </group>
      </Canvas>
    </div>
  );
}
