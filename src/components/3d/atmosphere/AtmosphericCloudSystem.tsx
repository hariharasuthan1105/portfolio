import * as THREE from "three";
import HighAltitudeClouds from "./HighAltitudeClouds";
import CastleCloudBanks from "./CastleCloudBanks";
import WaterfallMist from "./WaterfallMist";
import GroundFog from "./GroundFog";
import SilverEmbers from "../SilverEmbers";

export interface AtmosphericCloudSystemProps {
  reduced?: boolean;
  quality?: "high" | "medium" | "low";
  portalFlare?: number;
  portalHovered?: boolean;
  portalPos?: THREE.Vector3;
}

export default function AtmosphericCloudSystem({
  reduced = false,
  quality = "high",
  portalFlare = 0,
  portalHovered = false,
  portalPos = new THREE.Vector3(0, -0.45, -5.05),
}: AtmosphericCloudSystemProps) {
  return (
    <group name="AtmosphericCloudSystem">
      {/* LAYER A — HIGH-ALTITUDE STORM CLOUDS (Deep background behind spires & eclipse) */}
      <HighAltitudeClouds
        reduced={reduced}
        quality={quality}
        portalFlare={portalFlare}
      />

      {/* LAYER B — MID-LEVEL CASTLE CLOUD BANKS (Weaving through architecture & beneath floating islands) */}
      <CastleCloudBanks
        reduced={reduced}
        quality={quality}
        portalFlare={portalFlare}
        portalHovered={portalHovered}
        portalPos={portalPos}
      />

      {/* LAYER C — CLIFF AND WATERFALL MIST (Rising turbulent spray from cascades) */}
      <WaterfallMist
        reduced={reduced}
        quality={quality}
        portalPos={portalPos}
      />

      {/* LAYER D — FOREGROUND GROUND FOG (Rolling along bridge deck & around archers) */}
      <GroundFog
        reduced={reduced}
        quality={quality}
        portalPos={portalPos}
        portalHovered={portalHovered}
        portalFlare={portalFlare}
      />

      {/* Atmospheric Celestial Embers */}
      {!reduced && (
        <SilverEmbers
          reduced={reduced}
          low={quality === "low"}
        />
      )}
    </group>
  );
}
