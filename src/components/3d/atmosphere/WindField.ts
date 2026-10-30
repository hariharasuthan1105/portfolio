import * as THREE from "three";

export interface WindParameters {
  baseSpeed: number;
  direction: THREE.Vector2; // X and Z drift
  gustFrequency: number;
  gustStrength: number;
  portalAttraction: number; // 0 (idle) to 1 (active warp)
  portalPos: THREE.Vector3;
}

export class WindField {
  public highAltitudeWind = new THREE.Vector2(-0.015, 0.004);
  public midLevelWind = new THREE.Vector2(0.022, 0.008);
  public waterfallUpdraft = 0.045;
  public groundWind = new THREE.Vector2(0.018, 0.012);
  public portalPos = new THREE.Vector3(0.0, -0.45, -5.05);

  public getWindForLayer(
    layer: "high" | "mid" | "waterfall" | "ground",
    time: number,
    portalFlare: number = 0,
    portalHovered: boolean = false,
  ): { drift: THREE.Vector2; speed: number; portalInfluence: number } {
    const gust = Math.sin(time * 0.4) * 0.005 + Math.cos(time * 0.25) * 0.003;
    const portalBoost = portalHovered ? 1.5 : portalFlare > 0 ? 3.0 : 1.0;

    switch (layer) {
      case "high":
        return {
          drift: new THREE.Vector2(
            (this.highAltitudeWind.x + gust * 0.5) * portalBoost,
            this.highAltitudeWind.y,
          ),
          speed: 0.012 * portalBoost,
          portalInfluence: portalFlare * 0.2,
        };
      case "mid":
        return {
          drift: new THREE.Vector2(
            (this.midLevelWind.x + gust) * portalBoost,
            this.midLevelWind.y,
          ),
          speed: 0.025 * portalBoost,
          portalInfluence: (portalHovered ? 0.35 : 0.1) + portalFlare * 0.6,
        };
      case "waterfall":
        return {
          drift: new THREE.Vector2(
            gust * 1.5,
            this.waterfallUpdraft * (1.0 + portalFlare * 0.5),
          ),
          speed: 0.035 * portalBoost,
          portalInfluence: portalFlare * 0.4,
        };
      case "ground":
      default:
        return {
          drift: new THREE.Vector2(
            (this.groundWind.x + gust * 0.8) * (portalHovered ? 1.8 : 1.0),
            this.groundWind.y + (portalHovered ? 0.015 : 0.0),
          ),
          speed: 0.028 * portalBoost,
          portalInfluence: (portalHovered ? 0.6 : 0.15) + portalFlare * 0.85,
        };
    }
  }
}

export const globalWindField = new WindField();
