import * as THREE from "three";

export interface PortalFogState {
  hovered: boolean;
  flare: number;
  isEntering: boolean;
  position: THREE.Vector3;
}

export function calculatePortalFogDisplacement(
  worldPos: THREE.Vector3,
  portalState: PortalFogState,
): { pullVector: THREE.Vector3; densityFactor: number; illumination: number } {
  const toPortal = new THREE.Vector3().subVectors(portalState.position, worldPos);
  const distance = toPortal.length();
  
  // Radius of portal gravitational and thermal pull
  const influenceRadius = portalState.flare > 0 ? 9.0 : portalState.hovered ? 6.5 : 4.0;
  
  if (distance > influenceRadius || distance < 0.1) {
    return {
      pullVector: new THREE.Vector3(0, 0, 0),
      densityFactor: 1.0,
      illumination: 0.0,
    };
  }

  const factor = 1.0 - distance / influenceRadius;
  const strength = (portalState.hovered ? 0.35 : 0.1) + portalState.flare * 1.2;
  
  // Tangential vortex rotation + inward radial pull
  const inward = toPortal.clone().normalize().multiplyScalar(factor * strength);
  const tangent = new THREE.Vector3(-toPortal.y, toPortal.x, 0)
    .normalize()
    .multiplyScalar(factor * strength * 0.45);
    
  const pull = inward.add(tangent);

  // During fly-through entrance, clouds part in the center path
  let density = 1.0;
  if (portalState.isEntering) {
    const centerDist = Math.sqrt(worldPos.x * worldPos.x + (worldPos.y - portalState.position.y) ** 2);
    if (centerDist < 2.5) {
      density = Math.max(0.1, centerDist / 2.5);
    }
  }

  // Localized silver core illumination
  const illumination = (1.0 / (1.0 + distance * 0.5)) * (portalState.hovered ? 1.8 : 1.0 + portalState.flare * 3.5);

  return {
    pullVector: pull,
    densityFactor: density,
    illumination,
  };
}
