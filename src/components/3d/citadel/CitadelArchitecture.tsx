// src/components/3d/citadel/CitadelArchitecture.tsx
import { useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function CitadelArchitecture({
  reduced = false,
  portalFlare = 0,
}: {
  reduced?: boolean;
  portalFlare?: number;
}) {
  // Load real glTF 2.0 binary GLB assets
  const citadelGltf = useGLTF("/models/gothic_citadel.glb");
  const bridgeGltf = useGLTF("/models/stone_bridge.glb");
  const portalGltf = useGLTF("/models/portal_gate.glb");
  const statuesGltf = useGLTF("/models/guardian_statues.glb");
  const cliffsGltf = useGLTF("/models/cliff_waterfalls.glb");
  const islandsGltf = useGLTF("/models/floating_islands.glb");

  // Clone scenes for independent transform instances
  const citadelScene = useMemo(() => citadelGltf.scene.clone(), [citadelGltf.scene]);
  const bridgeScene = useMemo(() => bridgeGltf.scene.clone(), [bridgeGltf.scene]);
  const portalScene = useMemo(() => portalGltf.scene.clone(), [portalGltf.scene]);
  const statuesScene = useMemo(() => statuesGltf.scene.clone(), [statuesGltf.scene]);
  const cliffsScene = useMemo(() => cliffsGltf.scene.clone(), [cliffsGltf.scene]);
  const islandsScene = useMemo(() => islandsGltf.scene.clone(), [islandsGltf.scene]);

  // Reference for rotating portal silver runic rings
  const outerRingRef = useRef<THREE.Object3D | null>(null);
  const innerRingRef = useRef<THREE.Object3D | null>(null);
  const islandsRef = useRef<THREE.Group>(null);

  useMemo(() => {
    // Configure shadows and PBR properties
    const enableShadows = (obj: THREE.Object3D) => {
      obj.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          if (mesh.material) {
            (mesh.material as THREE.Material).needsUpdate = true;
          }
        }
      });
    };

    enableShadows(citadelScene);
    enableShadows(bridgeScene);
    enableShadows(portalScene);
    enableShadows(statuesScene);
    enableShadows(cliffsScene);
    enableShadows(islandsScene);

    // Locate silver runic rings in portal gate
    portalScene.traverse((child) => {
      if (child.name === "Portal_SilverOuterRing") {
        outerRingRef.current = child;
      }
      if (child.name === "Portal_SilverInnerRing") {
        innerRingRef.current = child;
      }
    });
  }, [citadelScene, bridgeScene, portalScene, statuesScene, cliffsScene, islandsScene]);

  useFrame((state, delta) => {
    if (reduced) return;
    const d = delta;
    const time = state.clock.getElapsedTime();

    // Rotate portal silver runic rings
    const ringSpeedMultiplier = 1.0 + portalFlare * 3.5;
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += d * 0.25 * ringSpeedMultiplier;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= d * 0.42 * ringSpeedMultiplier;
    }

    // Floating islands gentle levitation
    if (islandsRef.current) {
      islandsRef.current.position.y = Math.sin(time * 0.4) * 0.18;
      islandsRef.current.rotation.y = Math.sin(time * 0.2) * 0.02;
    }
  });

  return (
    <group name="CitadelWorld_Architecture">
      {/* 1. Stone Bridge & Ceremonial Stairs (Foreground to Midground) */}
      <primitive object={bridgeScene} position={[0, 0, 0]} />

      {/* 2. Guardian Knight Statues (Flanking the Stairs) */}
      <primitive object={statuesScene} position={[0, 0, 0]} />

      {/* 3. Massive Circular Portal Gate (Centerpiece at upper dais z = -6.8, y = 1.8) */}
      <primitive object={portalScene} position={[0, 1.8, -6.8]} />

      {/* 4. Cliffs & Cascading Waterfalls (Flanking bridge) */}
      <primitive object={cliffsScene} position={[0, 0, 0]} />

      {/* 5. Gothic Castle Citadel Keep & Spires (Monumental Background at z = -11.0) */}
      <primitive object={citadelScene} position={[0, 0, -11.0]} />

      {/* 6. Distant Floating Obsidian Islands (Sky Parallax) */}
      <group ref={islandsRef}>
        <primitive object={islandsScene} position={[0, 0, 0]} />
      </group>
    </group>
  );
}

// Preload all assets for zero-lag mounting
useGLTF.preload("/models/gothic_citadel.glb");
useGLTF.preload("/models/stone_bridge.glb");
useGLTF.preload("/models/portal_gate.glb");
useGLTF.preload("/models/guardian_statues.glb");
useGLTF.preload("/models/cliff_waterfalls.glb");
useGLTF.preload("/models/floating_islands.glb");
