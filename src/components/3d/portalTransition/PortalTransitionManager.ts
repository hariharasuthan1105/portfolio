/**
 * Portal Transition State System
 *
 * Manages explicit lifecycle states for the Kingdom of Code gateway:
 * IDLE -> ACTIVATING -> ENTERING -> INSIDE -> RETURNING -> IDLE
 *
 * Guarantees that every visual property (portalFlare, point light intensity,
 * shader uniform uPortalFlare, vortex intensity, godrays, camera FOV,
 * and camera position/lookAt) restores cleanly to baseline upon returning Home.
 */

export type PortalAnimationState =
  | "IDLE"
  | "ACTIVATING"
  | "ENTERING"
  | "INSIDE"
  | "RETURNING";

export interface PortalBaselines {
  portalFlare: number;
  lightIntensity: number;
  lightIntensityHovered: number;
  pointLightBase: number;
  pointLightHovered: number;
  vortexIntensity: number;
  godRayIntensity: number;
  godRayHovered: number;
  cameraFovDesktop: number;
  cameraFovMobile: number;
  cameraZDesktop: number;
  cameraZMobile: number;
}

export const PORTAL_BASELINES: PortalBaselines = {
  portalFlare: 0.0,
  lightIntensity: 1.3,
  lightIntensityHovered: 2.6,
  pointLightBase: 24.0,
  pointLightHovered: 45.0,
  vortexIntensity: 1.2,
  godRayIntensity: 0.9,
  godRayHovered: 1.8,
  cameraFovDesktop: 50.0,
  cameraFovMobile: 60.0,
  cameraZDesktop: 5.0,
  cameraZMobile: 6.2,
};
