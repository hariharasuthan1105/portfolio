import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  PortalAnimationState,
  PORTAL_BASELINES,
} from "./portalTransition/PortalTransitionManager";

export default function CinematicCamera({
  portalState = "IDLE",
  onStateChange,
  onFlareUpdate,
  onFlyComplete,
  reduced = false,
}: {
  portalState?: PortalAnimationState;
  onStateChange?: (state: PortalAnimationState) => void;
  onFlareUpdate?: (flare: number) => void;
  onFlyComplete?: () => void;
  reduced?: boolean;
}) {
  const { camera } = useThree();
  const enterProgressRef = useRef(0);
  const activateTimeRef = useRef(0);
  const startPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 5));
  const hasTriggeredCompleteRef = useRef(false);
  const currentFlareRef = useRef(0);

  // Calibrated target portal coordinates in 3D space
  const portalTarget = useRef(new THREE.Vector3(1.85, -1.08, -4.7));

  // Reset or record reference states upon transition changes
  useEffect(() => {
    if (portalState === "ACTIVATING") {
      activateTimeRef.current = 0;
      enterProgressRef.current = 0;
      hasTriggeredCompleteRef.current = false;
      startPosRef.current.copy(camera.position);
    } else if (portalState === "ENTERING") {
      hasTriggeredCompleteRef.current = false;
    } else if (portalState === "RETURNING") {
      hasTriggeredCompleteRef.current = false;
    } else if (portalState === "IDLE") {
      enterProgressRef.current = 0;
      activateTimeRef.current = 0;
      hasTriggeredCompleteRef.current = false;
      currentFlareRef.current = 0;
      if (onFlareUpdate) onFlareUpdate(0);
    }
  }, [portalState, camera, onFlareUpdate]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const aspect = state.viewport.aspect;

    // Baseline values derived dynamically from viewport aspect
    const baselineZ =
      aspect < 0.8
        ? PORTAL_BASELINES.cameraZMobile
        : aspect < 1.3
          ? 5.4
          : PORTAL_BASELINES.cameraZDesktop;
    const baselineFov =
      aspect < 0.8
        ? PORTAL_BASELINES.cameraFovMobile
        : aspect < 1.3
          ? 54
          : PORTAL_BASELINES.cameraFovDesktop;
    const centerOffsetX = aspect < 0.8 ? 0.95 : 0.0;

    // Handheld idle camera drift
    const ptrX = reduced ? 0 : state.pointer.x;
    const ptrY = reduced ? 0 : state.pointer.y;
    const breathX = reduced ? 0 : Math.sin(time * 0.6) * 0.05;
    const breathY = reduced ? 0 : Math.cos(time * 0.45) * 0.035;

    const idleTargetX = centerOffsetX + ptrX * 0.7 + breathX;
    const idleTargetY = ptrY * 0.35 + breathY + 0.04;
    const idleTargetZ = baselineZ;
    const idleLookAt = new THREE.Vector3(
      centerOffsetX - ptrX * 0.35,
      -ptrY * 0.2 - 0.15,
      -8.0,
    );

    // ==========================================
    // 1. ACTIVATING STATE: rings accelerate, portal energy pulses
    // ==========================================
    if (portalState === "ACTIVATING") {
      activateTimeRef.current += delta;
      const actP = Math.min(activateTimeRef.current / 0.35, 1.0);

      // Flare builds smoothly from baseline 0 up to 0.28
      const flare = THREE.MathUtils.lerp(0.0, 0.28, actP);
      currentFlareRef.current = flare;
      if (onFlareUpdate) onFlareUpdate(flare);

      // Subtle anticipatory pull towards portal
      camera.position.z = THREE.MathUtils.lerp(
        startPosRef.current.z,
        startPosRef.current.z - 0.15,
        actP,
      );
      camera.lookAt(portalTarget.current.x, portalTarget.current.y, -9.0);

      if (actP >= 1.0) {
        if (onStateChange) onStateChange("ENTERING");
      }
      return;
    }

    // ==========================================
    // 2. ENTERING STATE: camera warp rush & flare peak
    // ==========================================
    if (portalState === "ENTERING") {
      enterProgressRef.current = Math.min(
        enterProgressRef.current + delta * 0.72,
        1.0,
      );
      const p = enterProgressRef.current;

      // Smooth acceleration into hyper-warp
      const ease = p * p * (3.0 - 2.0 * p);
      const warp = Math.pow(p, 2.5);

      camera.position.lerpVectors(
        startPosRef.current,
        portalTarget.current,
        ease,
      );

      // Camera tilts upward towards portal aperture
      const lookTarget = new THREE.Vector3(
        1.85,
        -1.08 + (1.0 - p) * 0.2,
        -10.0,
      );
      camera.lookAt(lookTarget);

      // Dynamic FOV expansion for cinematic rush
      if ("fov" in camera) {
        (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
          baselineFov,
          78,
          warp,
        );
        camera.updateProjectionMatrix();
      }

      // Flare peaks as camera reaches threshold
      const flare = Math.min(0.28 + Math.pow(p, 2.2) * 0.72, 1.0);
      currentFlareRef.current = flare;
      if (onFlareUpdate) onFlareUpdate(flare);

      if (p >= 1.0 && !hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        if (onStateChange) onStateChange("INSIDE");
        if (onFlyComplete) onFlyComplete();
      }
      return;
    }

    // ==========================================
    // 3. INSIDE OR RETURNING STATE: smooth decay and restoration
    // ==========================================
    if (portalState === "INSIDE" || portalState === "RETURNING") {
      // Smoothly decay flare down to 0.0 with exponential damping
      const decaySpeed = delta * 4.5;
      currentFlareRef.current = THREE.MathUtils.lerp(
        currentFlareRef.current,
        0.0,
        decaySpeed,
      );
      if (onFlareUpdate) onFlareUpdate(currentFlareRef.current);

      // Smoothly glide camera back to baseline idle position
      const glideSpeed = delta * 3.2;
      camera.position.x = THREE.MathUtils.lerp(
        camera.position.x,
        idleTargetX,
        glideSpeed,
      );
      camera.position.y = THREE.MathUtils.lerp(
        camera.position.y,
        idleTargetY,
        glideSpeed,
      );
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        idleTargetZ,
        glideSpeed,
      );
      camera.lookAt(idleLookAt);

      if ("fov" in camera) {
        (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
          (camera as THREE.PerspectiveCamera).fov,
          baselineFov,
          glideSpeed,
        );
        camera.updateProjectionMatrix();
      }

      // Check if baseline is fully restored
      const distToIdle = camera.position.distanceTo(
        new THREE.Vector3(idleTargetX, idleTargetY, idleTargetZ),
      );
      const fovDiff = Math.abs(
        (camera as THREE.PerspectiveCamera).fov - baselineFov,
      );

      if (currentFlareRef.current < 0.005 && distToIdle < 0.08 && fovDiff < 0.2) {
        currentFlareRef.current = 0.0;
        if (onFlareUpdate) onFlareUpdate(0.0);
        if (onStateChange) onStateChange("IDLE");
      }
      return;
    }

    // ==========================================
    // 4. IDLE STATE: baseline dark monochrome atmosphere
    // ==========================================
    // Guarantee flare is strictly locked at 0.0 baseline
    if (currentFlareRef.current !== 0.0) {
      currentFlareRef.current = 0.0;
      if (onFlareUpdate) onFlareUpdate(0.0);
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, idleTargetX, 0.045);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, idleTargetY, 0.045);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, idleTargetZ, 0.045);
    camera.lookAt(idleLookAt);

    if ("fov" in camera) {
      (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
        (camera as THREE.PerspectiveCamera).fov,
        baselineFov,
        0.05,
      );
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
