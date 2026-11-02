// src/components/3d/citadel/CinematicCitadelCamera.tsx
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PortalAnimationState } from "../portalTransition/PortalTransitionManager";

export function CinematicCitadelCamera({
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
  const startPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0.65, 1.45, 5.0));
  const hasTriggeredCompleteRef = useRef(false);
  const currentFlareRef = useRef(0);

  // Portal centerpiece world coordinates
  const portalTarget = useRef(new THREE.Vector3(0.0, 3.7, -6.8));

  // Reset or initialize references on state changes
  useEffect(() => {
    if (portalState === "ACTIVATING") {
      activateTimeRef.current = 0;
      enterProgressRef.current = 0;
      hasTriggeredCompleteRef.current = false;
      startPosRef.current.copy(camera.position);
    } else if (portalState === "ENTERING") {
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

    // Optional URL demo modes for Stage 8 browser demonstration suite
    const search = typeof window !== "undefined" ? window.location.search : "";
    const isDemo1 = search.includes("demo=1") || search.includes("isolate=citadel_env");
    const isDemo2 = search.includes("demo=2") || search.includes("isolate=character");
    const isDemo3 = search.includes("demo=3") || search.includes("isolate=portal");
    const isDemo4 = search.includes("demo=4") || search.includes("isolate=vfx");

    if (isDemo1) {
      // DEMO 1: Orbital camera motion proving real 3D depth across castle, bridge & statues
      camera.position.x = Math.sin(time * 0.6) * 2.8 + 0.5;
      camera.position.y = 1.8 + Math.cos(time * 0.4) * 0.4;
      camera.position.z = Math.cos(time * 0.6) * 1.5 + 4.8;
      camera.lookAt(0, 2.2, -3.5);
      return;
    }

    if (isDemo2) {
      // DEMO 2: Focused ground-level camera on walking character & floor contact
      camera.position.set(0.0, 1.2, 1.5);
      camera.lookAt(0, 1.0, -1.2);
      return;
    }

    if (isDemo3) {
      // DEMO 3: Focused camera on portal vortex & rotating silver rings
      camera.position.set(0.0, 3.7, -1.5);
      camera.lookAt(0, 3.7, -6.8);
      return;
    }

    if (isDemo4) {
      // DEMO 4: High cinematic overview capturing clouds, banners, waterfalls & mist
      camera.position.set(0.0, 4.5, 6.0);
      camera.lookAt(0, 2.5, -4.0);
      return;
    }

    // Responsive camera baselines derived dynamically from viewport aspect
    const isMobile = aspect < 0.8;
    const isTablet = aspect >= 0.8 && aspect < 1.25;

    const basePosX = isMobile ? 0.0 : isTablet ? 0.25 : 0.45;
    const basePosY = isMobile ? 1.45 : 1.65;
    const basePosZ = isMobile ? 4.2 : isTablet ? 4.8 : 5.2;
    const baseFov = isMobile ? 56 : isTablet ? 50 : 46;

    if ((camera as THREE.PerspectiveCamera).fov !== baseFov && portalState === "IDLE") {
      (camera as THREE.PerspectiveCamera).fov = baseFov;
      camera.updateProjectionMatrix();
    }

    // Subtle pointer parallax and gentle breath sway (disabled or damped under reduced motion)
    const ptrX = reduced ? 0 : state.pointer.x;
    const ptrY = reduced ? 0 : state.pointer.y;
    const breathX = reduced ? 0 : Math.sin(time * 0.45) * 0.035;
    const breathY = reduced ? 0 : Math.cos(time * 0.35) * 0.025;

    const idleTargetX = basePosX + ptrX * 0.28 + breathX;
    const idleTargetY = basePosY + ptrY * 0.16 + breathY;
    const idleTargetZ = basePosZ;

    const lookTarget = new THREE.Vector3(
      isMobile ? 0.0 : ptrX * 0.15,
      isMobile ? 3.0 : 2.8 + ptrY * 0.1,
      -6.8
    );

    // ========================================================
    // 1. ACTIVATING STATE: portal charges, rings spin, camera prepares
    // ========================================================
    if (portalState === "ACTIVATING") {
      activateTimeRef.current += delta;
      const actProgress = Math.min(activateTimeRef.current / 0.4, 1.0);

      // Controlled flare builds smoothly up to 0.25 (no blinding white flash)
      const flare = THREE.MathUtils.lerp(0.0, 0.25, actProgress);
      currentFlareRef.current = flare;
      if (onFlareUpdate) onFlareUpdate(flare);

      // Subtle anticipatory pull toward portal
      camera.position.z = THREE.MathUtils.lerp(startPosRef.current.z, startPosRef.current.z - 0.45, actProgress);
      camera.position.x = THREE.MathUtils.lerp(startPosRef.current.x, 0.0, actProgress * 0.6);
      camera.lookAt(portalTarget.current);

      if (actProgress >= 1.0 && onStateChange) {
        onStateChange("ENTERING");
      }
      return;
    }

    // ========================================================
    // 2. ENTERING STATE: camera glides down the bridge into portal
    // ========================================================
    if (portalState === "ENTERING") {
      enterProgressRef.current += delta * 1.6;
      const t = Math.min(enterProgressRef.current, 1.0);
      const ease = t * t * (3 - 2 * t);

      // Camera glides along bridge center towards portal threshold (z = -5.5)
      camera.position.x = THREE.MathUtils.lerp(startPosRef.current.x, 0.0, ease);
      camera.position.y = THREE.MathUtils.lerp(startPosRef.current.y, 3.4, ease);
      camera.position.z = THREE.MathUtils.lerp(startPosRef.current.z - 0.45, -5.5, ease);

      camera.lookAt(portalTarget.current);

      // Moderate cinematic light flare at threshold (never permanent or fullscreen blinding)
      const flare = t < 0.8 ? t * 0.4 : (1.0 - t) * 0.4;
      if (onFlareUpdate) onFlareUpdate(flare);

      if (t >= 0.95 && !hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        if (onFlyComplete) onFlyComplete();
      }
      return;
    }

    // ========================================================
    // 3. IDLE / DEFAULT CAMERA: smooth damping
    // ========================================================
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, idleTargetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, idleTargetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, idleTargetZ, 0.05);

    camera.lookAt(lookTarget);
  });

  return null;
}
