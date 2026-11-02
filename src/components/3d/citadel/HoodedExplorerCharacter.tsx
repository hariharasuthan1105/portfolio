// src/components/3d/citadel/HoodedExplorerCharacter.tsx
import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PortalAnimationState } from "../portalTransition/PortalTransitionManager";

export function HoodedExplorerCharacter({
  reduced = false,
  portalState = "IDLE",
  isWalking = false,
}: {
  reduced?: boolean;
  portalState?: PortalAnimationState;
  isWalking?: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF("/models/hooded_explorer.glb");
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, groupRef);

  // Character world position along the bridge:
  // Starts grounded at z = -1.2, facing down the bridge toward the portal (z = -6.8).
  const currentPos = useRef(new THREE.Vector3(0, 0, -1.2));
  const activeActionName = useRef<string>("Idle");

  useEffect(() => {
    // Configure shadows
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (reduced || names.length === 0) return;

    const shouldWalk = isWalking || portalState === "ACTIVATING" || portalState === "ENTERING";
    const targetAction = shouldWalk ? "Walk" : "Idle";

    if (activeActionName.current !== targetAction) {
      const prev = actions[activeActionName.current];
      const next = actions[targetAction];

      if (prev && next) {
        prev.fadeOut(0.3);
        next.reset().fadeIn(0.3).play();
      } else if (next) {
        next.reset().play();
      }
      activeActionName.current = targetAction;
    } else {
      actions[targetAction]?.play();
    }
  }, [isWalking, portalState, actions, names, reduced]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // When activating or entering, character strides smoothly down the bridge toward the stairs
    const isAdvancing = portalState === "ACTIVATING" || portalState === "ENTERING";
    if (isAdvancing && !reduced) {
      currentPos.current.z -= delta * 1.6;
      // Clamp at the foot of the stairs (z = -3.8)
      if (currentPos.current.z < -3.8) {
        currentPos.current.z = -3.8;
      }
      groupRef.current.position.copy(currentPos.current);
    } else if (portalState === "IDLE") {
      // Return smoothly to default stance at z = -1.2
      currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, -1.2, delta * 3.0);
      groupRef.current.position.copy(currentPos.current);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -1.2]} rotation={[0, Math.PI, 0]}>
      {/* 3D Rigged Hooded Explorer Mesh */}
      <primitive object={scene} />

      {/* Realistic Soft Contact Shadow Disk on Bridge Deck (y = 0.005) */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.42, 32]} />
        <meshBasicMaterial
          color="#000000"
          transparent={true}
          opacity={0.78}
          depthWrite={false}
        />
      </mesh>

      {/* Wet Stone Floor Specular Reflection beneath boots */}
      <mesh position={[0, 0.006, 0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshBasicMaterial
          color="#0a0c10"
          transparent={true}
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/hooded_explorer.glb");
