import * as THREE from 'three';
import { getTileElevation } from '../../../utils/ElevationUtils';

// Per-tier shadow budgets. Shadow maps only re-render when the world, the
// light rig, or the sun anchor actually changes, so these sizes are memory and
// quality dials rather than per-frame costs.
//   pointMapSizes: shadow map size per shadow-casting light, nearest first.
export const SHADOW_QUALITY_PRESETS = {
  low: { sunMapSize: 1024, pointMapSizes: [256] },
  medium: { sunMapSize: 2048, pointMapSizes: [512, 512] },
  high: { sunMapSize: 2048, pointMapSizes: [1024, 512, 512] }
};

export const DEFAULT_SHADOW_QUALITY = 'high';

// Highest number of dynamic lights any preset lets cast shadows. Point lights
// shadow via cube maps (6 faces each), so this stays deliberately small.
export const MAX_SHADOW_LIGHTS = SHADOW_QUALITY_PRESETS.high.pointMapSizes.length;

const SUN_DISTANCE = 2600;
const AMBIENT_BASE = 0.45;
const AMBIENT_RANGE = 1.15;

// The sun shadow camera is pinned to a coarse world-space anchor instead of
// chasing the camera every frame. An orthographic shadow map is translation
// invariant, so the tile stays world-locked (no pan shimmer) and only needs a
// re-render when the camera crosses an anchor cell. COVERAGE_FACTOR grows the
// requested visible radius into the actual half-extent so the viewport can
// never leave the rendered tile, even when the camera sits in a corner of its
// anchor cell (worst-case lag is step / sqrt(2) = ~0.18 x extent).
const COVERAGE_FACTOR = 1.25;
const ANCHOR_STEP_RATIO = 0.25;
const EXTENT_MIN = 700;
const EXTENT_MAX = 4500;
const EXTENT_QUANTIZE = 1.25;

const WHITE = new THREE.Color(0xffffff);

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Snap the half-extent to a 1.25x ladder (rounded up so coverage is never
// lost). Keeps pinch/wheel zoom from re-anchoring the shadow map every tick.
function quantizeExtent(extent) {
  const clamped = clamp(extent, EXTENT_MIN, EXTENT_MAX);
  const steps = Math.ceil(Math.log(clamped / EXTENT_MIN) / Math.log(EXTENT_QUANTIZE) - 1e-9);
  return clamp(EXTENT_MIN * Math.pow(EXTENT_QUANTIZE, steps), EXTENT_MIN, EXTENT_MAX);
}

/**
 * ThreeDLightingManager
 *
 * Drives the WebGL lighting for 3D assets from the map's own lighting model:
 * the map sun (`sunSettings`), the ambient level and every placed light source.
 * This replaces the old artificial camera-following rig so 3D shadows always
 * agree with the 2D shadow/lighting overlays instead of drifting with the view.
 *
 * Performance model:
 * - Every shadow-casting light has `shadow.autoUpdate = false`; the layer asks
 *   for a re-render through `markSunShadowDirty` / `markLightShadowsDirty` /
 *   `markAllShadowsDirty`, and `consumeShadowDirty()` tells the render loop
 *   when to flip `renderer.shadowMap.needsUpdate`.
 * - The point-light cube maps are camera independent, so panning never
 *   re-renders them.
 * - The sun map only re-renders when the world/light changes or when the
 *   camera crosses a coarse anchor cell (roughly once per third of a viewport
 *   of panning instead of every frame).
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
    this.sunLight.shadow.mapSize.width = SHADOW_QUALITY_PRESETS[DEFAULT_SHADOW_QUALITY].sunMapSize;
    this.sunLight.shadow.mapSize.height = SHADOW_QUALITY_PRESETS[DEFAULT_SHADOW_QUALITY].sunMapSize;
    this.sunLight.shadow.camera.near = 100;
    this.sunLight.shadow.camera.far = SUN_DISTANCE * 2.2;
    this.sunLight.shadow.bias = -0.0003;
    this.sunLight.shadow.normalBias = 0.04;
    // Re-rendered explicitly through markSunShadowDirty().
    this.sunLight.shadow.autoUpdate = false;
    this.sunLight.shadow.needsUpdate = true;
    this.group.add(this.sunLight);
    this.sunLight.target = this.sunTarget;

    this.pointLights = new Map(); // lightId -> entry
    this.pointMapSizes = SHADOW_QUALITY_PRESETS[DEFAULT_SHADOW_QUALITY].pointMapSizes;
    this.shadowQuality = DEFAULT_SHADOW_QUALITY;

    this.shadowExtent = 1600; // sun shadow camera half-extent, world units
    this.shadowAnchorStep = this.shadowExtent * ANCHOR_STEP_RATIO;
    this.shadowAnchor = new THREE.Vector2(Infinity, Infinity);
    this.cameraWorld = new THREE.Vector2(0, 0);

    this.shadowsDirty = false;
    this.sunShadowKey = '';
    this.lightShadowKey = '';

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
    shadowQuality = DEFAULT_SHADOW_QUALITY,
    maxTextureSize = 8192,
    gridSize = 50,
    gridOffsetX = 0,
    gridOffsetY = 0,
    elevationData = {},
    cameraX = null,
    cameraY = null
  } = {}) {
    this.lightAnimationsEnabled = lightAnimations !== false;
    const ambientLevel = clamp(Number(ambientLightLevel ?? sunSettings.ambient ?? 0.2), 0, 1);

    // Ambient: game ambient level when lighting is on, a flat readable fill when
    // the map disables lighting entirely (no shadows are drawn then either).
    this.ambientLight.intensity = lightingEnabled
      ? AMBIENT_BASE + AMBIENT_RANGE * ambientLevel
      : 1.5;

    // Shadow quality: performance mode always drops to the cheapest tier.
    const qualityName = performanceMode
      ? 'low'
      : (SHADOW_QUALITY_PRESETS[shadowQuality] ? shadowQuality : DEFAULT_SHADOW_QUALITY);
    this.shadowQuality = qualityName;
    this.applyQuality(SHADOW_QUALITY_PRESETS[qualityName], maxTextureSize);

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

    // Only re-render the sun map when its contents or the way they are framed
    // changed; intensity/colour changes are just lighting.
    const sunShadowKey = `${lightingEnabled}|${sunActive}|${wallShadowsEnabled !== false}|${azimuth}|${elevation}`;
    if (sunShadowKey !== this.sunShadowKey) {
      this.sunShadowKey = sunShadowKey;
      this.markSunShadowDirty();
    }

    this.syncCamera(cameraX, cameraY);
    // The anchor only moves when the camera crosses a cell, but azimuth and
    // height changes must re-aim the sun immediately or the sliders would
    // re-render the shadow map from the old light position until the user pans.
    this.applySunOffset();

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
      // The light sits near the top of its fixture model (~0.9 cell tall) so it
      // is not embedded inside the torch/candelabra geometry it represents.
      const position = new THREE.Vector3(
        gx * gridSize + gridOffsetX + gridSize / 2,
        -(gy * gridSize + gridOffsetY + gridSize / 2),
        level * (gridSize * 0.5) + gridSize * 0.9
      );
      const direction = Number(source.direction ?? 0);
      const coneAngle = Number(source.coneAngle ?? 360);
      const isSpot = direction !== 0 && coneAngle < 360;
      const color = source.color || '#ffaa00';

      let entry = this.pointLights.get(id);
      if (entry && entry.isSpot !== isSpot) {
        this.group.remove(entry.light);
        if (entry.target) this.group.remove(entry.target);
        this.releaseShadowMap(entry.light);
        entry = null;
      }

      if (!entry) {
        const light = isSpot
          ? new THREE.SpotLight(color, 1, range, (coneAngle / 2) * (Math.PI / 180), 0.35, 1)
          : new THREE.PointLight(color, 1, range, 1);
        light.shadow.mapSize.width = this.pointMapSizes[0];
        light.shadow.mapSize.height = this.pointMapSizes[0];
        light.shadow.camera.near = Math.max(1, gridSize * 0.05);
        light.shadow.camera.far = range * 1.2;
        light.shadow.bias = -0.002;
        light.shadow.normalBias = 2;
        // Dynamic light shadows are camera independent; only explicit marks
        // (light moved, geometry changed) re-render them.
        light.shadow.autoUpdate = false;
        light.shadow.needsUpdate = true;
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
      entry.flickering = !!source.flickering;
      // Saturated light colours tinted the grey masonry far too hard; nudge
      // every light toward white so colour reads as ambience, not paint.
      entry.light.color.set(color).lerp(WHITE, 0.25);
      if (entry.range !== range) {
        entry.range = range;
        entry.light.distance = range;
        entry.light.shadow.camera.far = range * 1.2;
        entry.light.shadow.camera.updateProjectionMatrix();
      }
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
        this.releaseShadowMap(entry.light);
        this.pointLights.delete(id);
      }
    }

    this.updateShadowCasters({ performanceMode, lightingEnabled });

    // Fingerprint the shadow-relevant light state (position/orientation/range,
    // never intensity/colour/flicker) so only real geometry changes re-render
    // the cube maps.
    const parts = [];
    this.pointLights.forEach((entry, id) => {
      if (!entry.light.castShadow) return;
      const p = entry.light.position;
      const t = entry.target ? entry.target.position : null;
      const targetKey = t ? `${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z.toFixed(2)}` : '';
      parts.push(
        `${id}:${p.x.toFixed(2)},${p.y.toFixed(2)},${p.z.toFixed(2)}:${entry.range}:${entry.isSpot ? 1 : 0}:${targetKey}`
      );
    });
    const lightShadowKey = parts.join('|');
    if (lightShadowKey !== this.lightShadowKey) {
      this.lightShadowKey = lightShadowKey;
      this.markLightShadowsDirty();
    }
  }

  applyQuality(preset, maxTextureSize) {
    const maxSize = Number.isFinite(maxTextureSize) && maxTextureSize > 0 ? maxTextureSize : 8192;
    const sunSize = Math.min(preset.sunMapSize, maxSize);
    if (this.sunLight.shadow.mapSize.width !== sunSize) {
      this.sunLight.shadow.mapSize.set(sunSize, sunSize);
      this.releaseShadowMap(this.sunLight);
      this.markSunShadowDirty();
    }
    this.pointMapSizes = preset.pointMapSizes;
  }

  releaseShadowMap(light) {
    if (light.shadow && light.shadow.map) {
      light.shadow.map.dispose();
      light.shadow.map = null;
    }
  }

  applyPointShadowMapSize(entry, size) {
    const shadow = entry.light.shadow;
    if (!shadow || shadow.mapSize.width === size) return;
    shadow.mapSize.set(size, size);
    this.releaseShadowMap(entry.light);
    shadow.needsUpdate = true;
    this.shadowsDirty = true;
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
    const maxLights = performanceMode || !lightingEnabled ? 0 : this.pointMapSizes.length;
    const camX = this.cameraWorld.x;
    const camY = this.cameraWorld.y;
    const sorted = entries
      .map(entry => ({
        entry,
        distance: Math.hypot(entry.light.position.x - camX, entry.light.position.y - camY)
      }))
      .sort((a, b) => a.distance - b.distance);
    sorted.forEach(({ entry }, index) => {
      const castShadow = index < maxLights;
      if (castShadow) {
        const size = this.pointMapSizes[Math.min(index, this.pointMapSizes.length - 1)];
        this.applyPointShadowMapSize(entry, size);
      }
      if (entry.light.castShadow !== castShadow) {
        entry.light.castShadow = castShadow;
        if (castShadow) {
          entry.light.shadow.needsUpdate = true;
          this.shadowsDirty = true;
        }
      }
    });
  }

  /**
   * Pin the sun shadow camera to the coarse world anchor nearest the camera.
   * Returns true when the anchor moved (i.e. the sun map needs a re-render).
   */
  syncCamera(cameraX = null, cameraY = null) {
    const gx = Number.isFinite(cameraX) ? cameraX : this.cameraWorld.x;
    const gy = Number.isFinite(cameraY) ? cameraY : this.cameraWorld.y;
    this.cameraWorld.set(gx, gy);

    const step = this.shadowAnchorStep;
    const ax = Math.round(gx / step) * step;
    const ay = Math.round(-gy / step) * step;
    if (ax === this.shadowAnchor.x && ay === this.shadowAnchor.y) return false;

    this.shadowAnchor.set(ax, ay);
    this.sunTarget.position.set(ax, ay, 0);
    this.sunTarget.updateMatrixWorld();
    this.applySunOffset();
    this.markSunShadowDirty();
    return true;
  }

  /**
   * Place the directional light relative to its (anchored) target. Safe to call
   * whenever the offset changes: an orthographic sun shadow tile is translation
   * invariant, so re-applying it never costs an extra shadow pass by itself.
   */
  applySunOffset() {
    if (!this.sunOffset) return;
    this.sunLight.position.copy(this.sunTarget.position).add(this.sunOffset);
    this.sunLight.updateMatrixWorld();
  }

  /**
   * @param {number} visibleRadius half-diagonal of the visible ground area,
   * in world units. The manager grows it by COVERAGE_FACTOR (anchor lag) and
   * quantizes it so zoom does not re-render the sun map on every tick.
   */
  setShadowCameraExtent(visibleRadius) {
    const requested = Number(visibleRadius);
    if (!Number.isFinite(requested) || requested <= 0) return;
    const d = quantizeExtent(requested * COVERAGE_FACTOR);
    if (Math.abs(d - this.shadowExtent) < 1e-3) return;

    this.shadowExtent = d;
    this.shadowAnchorStep = d * ANCHOR_STEP_RATIO;
    const camera = this.sunLight.shadow.camera;
    camera.left = -d;
    camera.right = d;
    camera.top = d;
    camera.bottom = -d;
    camera.near = 100;
    camera.far = SUN_DISTANCE * 2.2;
    camera.updateProjectionMatrix();

    // Force a re-anchor on the next sync so the tile re-centres on the new
    // extent.
    this.shadowAnchor.set(Infinity, Infinity);
    this.markSunShadowDirty();
  }

  markSunShadowDirty() {
    this.sunLight.shadow.needsUpdate = true;
    this.shadowsDirty = true;
  }

  markLightShadowsDirty() {
    this.pointLights.forEach(entry => {
      if (entry.light.castShadow) {
        entry.light.shadow.needsUpdate = true;
      }
    });
    this.shadowsDirty = true;
  }

  markAllShadowsDirty() {
    this.markSunShadowDirty();
    this.markLightShadowsDirty();
  }

  consumeShadowDirty() {
    const dirty = this.shadowsDirty;
    this.shadowsDirty = false;
    return dirty;
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
      this.releaseShadowMap(entry.light);
    });
    this.pointLights.clear();
    this.releaseShadowMap(this.sunLight);
    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
  }
}

export default ThreeDLightingManager;
