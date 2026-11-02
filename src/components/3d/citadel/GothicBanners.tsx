// src/components/3d/citadel/GothicBanners.tsx
import { useEffect, useMemo, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

export function GothicBanners({ reduced = false }: { reduced?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF("/models/gothic_banners.glb");
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, groupRef);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    if (!reduced && names.includes("Wind")) {
      actions["Wind"]?.reset().play();
    }
  }, [scene, actions, names, reduced]);

  return (
    <group ref={groupRef} name="Citadel_GothicBanners">
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/gothic_banners.glb");
