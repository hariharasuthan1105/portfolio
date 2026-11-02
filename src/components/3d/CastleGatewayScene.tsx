// src/components/3d/CastleGatewayScene.tsx
// Kingdom of Code — The Obsidian Citadel (Real glTF 2.0 3D World Construction)
import { Suspense, useState, Component, ErrorInfo, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { QualityPreset } from "./atmosphere/AtmosphericQualityController";
import { PortalAnimationState } from "./portalTransition/PortalTransitionManager";
import { CitadelArchitecture } from "./citadel/CitadelArchitecture";
import { HoodedExplorerCharacter } from "./citadel/HoodedExplorerCharacter";
import { GothicBanners } from "./citadel/GothicBanners";
import { PortalVFXSystem } from "./citadel/PortalVFXSystem";
import { AtmosphericEnvironment } from "./citadel/AtmosphericEnvironment";
import { CinematicCitadelCamera } from "./citadel/CinematicCitadelCamera";
import { CelestialSkyBackdrop } from "./citadel/CelestialSkyBackdrop";

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("[WebGL Fallback] WebGL rendering error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function CastleGatewayScene({
  reduced = false,
  low = false,
  quality,
  portalState = "IDLE",
  onPortalStateChange,
  onEnterRealm,
  onFlyComplete,
}: {
  reduced?: boolean;
  low?: boolean;
  quality?: QualityPreset;
  portalState?: PortalAnimationState;
  onPortalStateChange?: (state: PortalAnimationState) => void;
  onEnterRealm?: () => void;
  onFlyComplete?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [portalFlare, setPortalFlare] = useState(0);

  const resolvedQuality: QualityPreset = quality ?? (low ? "low" : "high");

  // Fallback plate when WebGL is unavailable or failed
  const fallbackPlate = (
    <div className="citadel-fallback-plate" aria-label="The Obsidian Citadel - Gothic Gateway">
      <img
        src="/assets/obsidian-citadel-reference.jpg"
        alt="The Obsidian Citadel - Gothic Gateway"
        className="citadel-fallback-img"
      />
      <div className="citadel-fallback-overlay" />
    </div>
  );

  return (
    <div className="castle-gateway-canvas-wrap" aria-hidden="true">
      <WebGLErrorBoundary fallback={fallbackPlate}>
        <Canvas
          dpr={resolvedQuality === "low" ? [1, 1] : resolvedQuality === "medium" ? [1, 1.25] : [1, 1.5]}
          frameloop={reduced ? "demand" : "always"}
          camera={{ position: [0.65, 1.45, 5.0], fov: 46, near: 0.1, far: 80 }}
          gl={{
            alpha: true,
            antialias: resolvedQuality !== "low",
            powerPreference: "high-performance",
          }}
          shadows={resolvedQuality !== "low"}
        >
          {/* Cinematic Camera Controller */}
          <CinematicCitadelCamera
            portalState={portalState}
            onStateChange={onPortalStateChange}
            onFlyComplete={onFlyComplete}
            onFlareUpdate={setPortalFlare}
            reduced={reduced}
          />

          <Suspense fallback={null}>
            {/* 1. Real glTF 2.0 Architecture & Stone Bridge Geometry */}
            <CitadelArchitecture
              reduced={reduced || resolvedQuality === "low"}
              portalFlare={portalFlare}
            />

            {/* 2. Hooded Explorer with Rigged Skeleton and Walk/Idle Animations */}
            <HoodedExplorerCharacter
              reduced={reduced}
              portalState={portalState}
              isWalking={typeof window !== "undefined" && (window.location.search.includes("demo=2") || window.location.search.includes("isolate=character"))}
            />

            {/* 3. Gothic Fabric Banners with Wind Cloth Simulation */}
            <GothicBanners
              reduced={reduced}
            />

            {/* 4. Centerpiece 3D Cosmic Swirling Portal & Dynamic Lighting */}
            <PortalVFXSystem
              reduced={reduced}
              portalState={portalState}
              portalFlare={portalFlare}
              hovered={hovered}
              setHovered={setHovered}
              onEnter={onEnterRealm}
            />

            {/* 5. Atmospheric Environment: Clouds, Mist, Braziers, Embers & Moonlight */}
            <AtmosphericEnvironment
              reduced={reduced}
            />

            {/* 6. Celestial Sky Backdrop: Giant Moon, Volumetric God Rays & Storm Clouds */}
            <CelestialSkyBackdrop
              reduced={reduced}
            />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>

      {/* Interactive Portal Hover Indicator */}
      {hovered && portalState === "IDLE" && (
        <div className="portal-hover-indicator mono">
          <span>[ CLICK GATEWAY TO ENTER ]</span>
        </div>
      )}
    </div>
  );
}
