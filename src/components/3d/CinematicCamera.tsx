import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function CinematicCamera({
  isEntering = false,
  onFlyComplete,
  onFlareUpdate,
  reduced = false,
}: {
  isEntering?: boolean;
  onFlyComplete?: () => void;
  onFlareUpdate?: (flare: number) => void;
  reduced?: boolean;
}) {
  const { camera } = useThree();
  const progressRef = useRef(0);
  const startPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 5));
  const hasTriggeredCompleteRef = useRef(false);

  // Calibrated target portal coordinates in 3D space
  const portalTarget = useRef(new THREE.Vector3(0, -0.45, -4.7));

  useEffect(() => {
    if (isEntering) {
      startPosRef.current.copy(camera.position);
      progressRef.current = 0;
      hasTriggeredCompleteRef.current = false;
    }
  }, [isEntering, camera]);

  useFrame((state, delta) => {
    if (reduced) return;

    const time = state.clock.getElapsedTime();

    if (isEntering) {
      // Cinematic Fly-Through sequence (~1.4s)
      progressRef.current = Math.min(progressRef.current + delta * 0.72, 1.0);
      const p = progressRef.current;

      // Smooth acceleration into hyper-warp
      const ease = p * p * (3.0 - 2.0 * p);
      const warp = Math.pow(p, 2.5);

      camera.position.lerpVectors(startPosRef.current, portalTarget.current, ease);

      // Camera tilts slightly upward towards the portal light
      const lookTarget = new THREE.Vector3(
        0,
        -0.45 + (1.0 - p) * 0.2,
        -10.0,
      );
      camera.lookAt(lookTarget);

      // FOV dynamically expands for cinematic rush effect
      if ("fov" in camera) {
        (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
          48,
          76,
          warp,
        );
        camera.updateProjectionMatrix();
      }

      // Bloom flare flares up as camera nears the threshold
      const flare = Math.pow(Math.max((p - 0.35) / 0.65, 0.0), 2.0);
      if (onFlareUpdate) onFlareUpdate(flare);

      if (p >= 1.0 && !hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        if (onFlyComplete) onFlyComplete();
      }
      return;
    }

    // Interactive Mouse Parallax & Handheld Drift
    const ptrX = state.pointer.x;
    const ptrY = state.pointer.y;

    // Subtle natural handheld breathing
    const breathX = Math.sin(time * 0.6) * 0.05;
    const breathY = Math.cos(time * 0.45) * 0.035;

    const targetX = ptrX * 0.85 + breathX;
    const targetY = ptrY * 0.45 + breathY + 0.08;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.045);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.045);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.0, 0.045);

    // Camera look-at target with subtle yaw & pitch
    const lookAtX = -ptrX * 0.4;
    const lookAtY = -ptrY * 0.25;
    camera.lookAt(lookAtX, lookAtY, -8.0);

    if ("fov" in camera) {
      (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
        (camera as THREE.PerspectiveCamera).fov,
        48,
        0.05,
      );
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
