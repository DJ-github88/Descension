import * as THREE from 'three';
import { getTileElevation } from '../../../utils/ElevationUtils';

// Cap how many dynamic lights render shadow maps at once. Point lights shadow
// via cube maps (6 faces each), so this is the main performance dial.
export const MAX_SHADOW_LIGHTS = 3;

const SUN_DISTANCE = 2600;
const AMBIENT_BASE = 0.45;
const AMBIENT_RANGE = 1.15;

const WHITE = new THREE.Color(0xffffff);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function shadowMapSize() {
  return 1024;
}

// Cube-map point-light shadows render six faces per light, so dynamic lights
// use a smaller map than the sun.
function pointShadowMapSize() {
  return 512;
}

/**
 * ThreeDLightingManager
 *
 * Drives the WebGL lighting for 3D assets from the map's own lighting model:
 * the map sun (`sunSettings`), the ambient level and every placed light source.
 * This replaces the old artificial camera-following rig so 3D shadows always
 * agree with the 2D shadow/lighting overlays instead of drifting with the view.
 */
export class ThreeDLightingManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'ThreeDLighting';
    this.scene.add(this.group);

    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.15);
    this.group.add(this.ambientLight);

    this.sunTarget = new THREE.Object3D();
    this.group.add(this.sunTarget);

    this.sunLight = new THREE.DirectionalLight(0xfff4e0, 1.15);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = shadowMapSize();
    this.sunLight.shadow.mapSize.height = shadowMapSize();
    this.sunLight.shadow.camera.near = 100;
    this.sunLight.shadow.camera.far = SUN_DISTANCE * 2.2;
    this.sunLight.shadow.bias = -0.0003;
    this.sunLight.shadow.normalBias = 0.04;
    this.group.add(this.sunLight);
    this.sunLight.target = this.sunTarget;

    this.pointLights = new Map(); // lightId -> entry
    this.time = 0;
    this.lightAnimationsEnabled = true;
  }

  update({
    lightSources = {},
    lightingEnabled = true,
    ambientLightLevel = 0.2,
    sunSettings = {},
    wallShadowsEnabled = true,
    performanceMode = false,
    lightAnimations = true,
    gridSize = 50,
    gridOffsetX = 0,
    gridOffsetY = 0,
    elevationData = {},
    cameraX = 0,
    cameraY = 0
  } = {}) {
    this.lightAnimationsEnabled = lightAnimations !== false;
    const ambientLevel = clamp(Number(ambientLightLevel ?? sunSettings.ambient ?? 0.2), 0, 1);

    // Ambient: game ambient level when lighting is on, a flat readable fill when
    // the map disables lighting entirely (no shadows are drawn then either).
    this.ambientLight.intensity = lightingEnabled
      ? AMBIENT_BASE + AMBIENT_RANGE * ambientLevel
      : 1.5;

    // Sun: direction/colour/intensity straight from the map's sun settings.
    const sunIntensity = Number(sunSettings.intensity ?? 1.0);
    const sunActive = sunIntensity > 0.05;
    this.sunLight.color.set(sunSettings.color || '#fff4e0');
    this.sunLight.intensity = lightingEnabled ? Math.max(0, sunIntensity) * 1.15 : 0;
    this.sunLight.castShadow = Boolean(
      lightingEnabled && sunActive && wallShadowsEnabled !== false
    );

    const azimuth = ((Number(sunSettings.azimuth ?? 135) % 360) + 360) % 360;
    const elevation = clamp(Number(sunSettings.elevation ?? 45), 5, 90);
    const azimuthRad = (azimuth * Math.PI) / 180;
    const elevationRad = (elevation * Math.PI) / 180;
    // ShadowOverlay projects wall shadows along (sin azimuth, cos azimuth); the
    // sun therefore sits on the opposite side so both layers agree.
    const horizontal = SUN_DISTANCE;
    this.sunOffset = new THREE.Vector3(
      -Math.sin(azimuthRad) * horizontal,
      Math.cos(azimuthRad) * horizontal,
      Math.tan(elevationRad) * horizontal
    );

    this.syncCamera(cameraX, cameraY);

    // Placed light sources.
    const activeIds = new Set();
    for (const [id, source] of Object.entries(lightSources || {})) {
      if (!source || source.enabled === false) continue;
      const gx = Number.isFinite(source.x) ? source.x : source.gridX;
      const gy = Number.isFinite(source.y) ? source.y : source.gridY;
      if (!Number.isFinite(gx) || !Number.isFinite(gy)) continue;

      activeIds.add(id);
      const radius = Math.max(1, Number(source.radius) || 1);
      const range = radius * gridSize;
      const intensity = Math.max(0, Number(source.intensity ?? 1));
      const level = getTileElevation(elevationData, gx, gy) || 0;
      const position = new THREE.Vector3(
        gx * gridSize + gridOffsetX + gridSize / 2,
        -(gy * gridSize + gridOffsetY + gridSize / 2),
        level * (gridSize * 0.5) + gridSize * 0.5
      );
      const direction = Number(source.direction ?? 0);
      const coneAngle = Number(source.coneAngle ?? 360);
      const isSpot = direction !== 0 && coneAngle < 360;
      const color = source.color || '#ffaa00';

      let entry = this.pointLights.get(id);
      if (entry && entry.isSpot !== isSpot) {
        this.group.remove(entry.light);
        if (entry.target) this.group.remove(entry.target);
        entry = null;
      }

      if (!entry) {
        const light = isSpot
          ? new THREE.SpotLight(color, 1, range, (coneAngle / 2) * (Math.PI / 180), 0.35, 1)
          : new THREE.PointLight(color, 1, range, 1);
        light.shadow.mapSize.width = pointShadowMapSize();
        light.shadow.mapSize.height = pointShadowMapSize();
        light.shadow.camera.near = Math.max(1, gridSize * 0.05);
        light.shadow.camera.far = range * 1.2;
        light.shadow.bias = -0.002;
        light.shadow.normalBias = 2;
        const target = isSpot ? new THREE.Object3D() : null;
        if (target) {
          this.group.add(target);
          light.target = target;
        }
        this.group.add(light);
        entry = {
          light,
          target,
          isSpot,
          baseIntensity: intensity,
          range,
          flickering: !!source.flickering,
          phase: (gx * 0.1 + gy * 0.1) || 0
        };
        this.pointLights.set(id, entry);
      }

      entry.baseIntensity = intensity;
      entry.range = range;
      entry.flickering = !!source.flickering;
      // Saturated light colours tinted the grey masonry far too hard; nudge
      // every light toward white so colour reads as ambience, not paint.
      entry.light.color.set(color).lerp(WHITE, 0.25);
      entry.light.distance = range;
      entry.light.intensity = this.resolveIntensity(entry);
      entry.light.position.copy(position);

      if (isSpot) {
        const directionRad = (direction * Math.PI) / 180;
        const dirX = Math.sin(directionRad);
        const dirY = -Math.cos(directionRad);
        entry.target.position.set(
          position.x + dirX * range * 0.6,
          position.y + dirY * range * 0.6,
          position.z - gridSize * 0.6
        );
        entry.target.updateMatrixWorld();
      }
    }

    // Drop lights that were removed or disabled.
    for (const [id, entry] of this.pointLights.entries()) {
      if (!activeIds.has(id)) {
        this.group.remove(entry.light);
        if (entry.target) this.group.remove(entry.target);
        this.pointLights.delete(id);
      }
    }

    this.updateShadowCasters({ performanceMode, lightingEnabled });
  }

  resolveIntensity(entry, flicker = 1) {
    // Linear (decay 1) falloff instead of physical decay 2: the squared falloff
    // blew out walls next to a light and dropped to black a tile later, which
    // read as harsh hotspots. Linear reach also matches the 2D lighting model
    // more closely, so both layers agree about how far a torch carries.
    return entry.baseIntensity * 0.45 * entry.range * flicker;
  }

  updateShadowCasters({ performanceMode = false, lightingEnabled = true } = {}) {
    const entries = [...this.pointLights.values()];
    if (performanceMode || !lightingEnabled) {
      entries.forEach(entry => {
        entry.light.castShadow = false;
      });
      return;
    }
    const camX = this.sunTarget.position.x;
    const camY = this.sunTarget.position.y;
    const sorted = entries
      .map(entry => ({
        entry,
        distance: Math.hypot(entry.light.position.x - camX, entry.light.position.y - camY)
      }))
      .sort((a, b) => a.distance - b.distance);
    sorted.forEach(({ entry }, index) => {
      const castShadow = index < MAX_SHADOW_LIGHTS;
      if (entry.light.castShadow !== castShadow) {
        entry.light.castShadow = castShadow;
        if (castShadow && entry.light.shadow) {
          entry.light.shadow.needsUpdate = true;
        }
      }
    });
  }

  syncCamera(cameraX = 0, cameraY = 0) {
    this.sunTarget.position.set(cameraX, -cameraY, 0);
    this.sunTarget.updateMatrixWorld();
    if (this.sunOffset) {
      this.sunLight.position.copy(this.sunTarget.position).add(this.sunOffset);
    }
  }

  setShadowCameraExtent(extent) {
    const d = clamp(extent, 1200, 4500);
    const camera = this.sunLight.shadow.camera;
    camera.left = -d;
    camera.right = d;
    camera.top = d;
    camera.bottom = -d;
    camera.near = 100;
    camera.far = SUN_DISTANCE * 2.2;
    camera.updateProjectionMatrix();
  }

  updateAnimations(delta = 0.016) {
    this.time += delta;
    if (!this.lightAnimationsEnabled) return;
    this.pointLights.forEach(entry => {
      if (!entry.flickering || !entry.light.visible) return;
      const base = (0.9 + 0.1 * Math.sin(this.time * 8 + entry.phase)) *
        (0.98 + 0.02 * Math.sin(this.time * 15 + entry.phase));
      entry.light.intensity = this.resolveIntensity(entry, base);
    });
  }

  dispose() {
    this.pointLights.forEach(entry => {
      this.group.remove(entry.light);
      if (entry.target) this.group.remove(entry.target);
    });
    this.pointLights.clear();
    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
  }
}

export default ThreeDLightingManager;
