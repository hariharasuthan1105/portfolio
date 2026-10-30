import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import GothicCastleMesh from "./GothicCastleMesh";
import PortalGateway from "./PortalGateway";
import AtmosphericCloudSystem from "./atmosphere/AtmosphericCloudSystem";
import CinematicCamera from "./CinematicCamera";
import { QualityPreset } from "./atmosphere/AtmosphericQualityController";

export default function CastleGatewayScene({
  reduced = false,
  low = false,
  quality,
  isEntering = false,
  onEnterRealm,
  onFlyComplete,
}: {
  reduced?: boolean;
  low?: boolean;
  quality?: QualityPreset;
  isEntering?: boolean;
  onEnterRealm?: () => void;
  onFlyComplete?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [portalFlare, setPortalFlare] = useState(0);

  const resolvedQuality: QualityPreset = quality ?? (low ? "low" : "high");
  const portalPos = new THREE.Vector3(0, -0.45, -5.05);

  return (
    <div className="castle-gateway-canvas-wrap" aria-hidden="true">
      <Canvas
        dpr={resolvedQuality === "low" ? [1, 1] : resolvedQuality === "medium" ? [1, 1.25] : [1, 1.5]}
        frameloop={reduced ? "demand" : "always"}
        camera={{ position: [0, 0, 5], fov: 48, near: 0.1, far: 50 }}
        gl={{
          alpha: true,
          antialias: resolvedQuality !== "low",
          powerPreference: "high-performance",
        }}
      >
        <CinematicCamera
          isEntering={isEntering}
          onFlyComplete={onFlyComplete}
          onFlareUpdate={setPortalFlare}
          reduced={reduced}
        />

        {/* Ambient atmospheric moonfill */}
        <ambientLight intensity={0.4} color="#161922" />

        {/* Top celestial backlight from eclipse */}
        <directionalLight
          position={[0, 7, -4]}
          intensity={1.6}
          color="#d2def2"
        />

        <Suspense fallback={null}>
          <GothicCastleMesh
            reduced={reduced || resolvedQuality === "low"}
            portalFlare={portalFlare}
            portalHovered={hovered}
          />
          <PortalGateway
            reduced={reduced}
            onEnter={onEnterRealm}
            hovered={hovered}
            setHovered={setHovered}
            portalFlare={portalFlare}
          />
        </Suspense>

        {/* 4-Layer Cinematic Atmospheric Cloud & VFX System */}
        <AtmosphericCloudSystem
          reduced={reduced}
          quality={resolvedQuality}
          portalFlare={portalFlare}
          portalHovered={hovered}
          portalPos={portalPos}
        />
      </Canvas>
      {/* Interactive Portal Hint */}
      {hovered && !isEntering && (
        <div className="portal-hover-indicator mono">
          <span>[ CLICK GATEWAY TO ENTER ]</span>
        </div>
      )}
    </div>
  );
}
