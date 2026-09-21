import * as THREE from 'three';
import { ThreeDLightingManager, MAX_SHADOW_LIGHTS } from '../ThreeDLightingManager';

const baseLight = (overrides = {}) => ({
  id: 'light1',
  type: 'torch',
  x: 0,
  y: 0,
  radius: 4,
  color: '#ff6b35',
  intensity: 0.8,
  flickering: false,
  enabled: true,
  ...overrides
});

describe('ThreeDLightingManager', () => {
  let scene;
  let manager;

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new ThreeDLightingManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('attaches its group to the scene and tears down cleanly', () => {
    expect(scene.children).toContain(manager.group);
    manager.dispose();
    expect(scene.children).not.toContain(manager.group);
  });

  it('drives ambient and sun intensity from the map lighting settings', () => {
    manager.update({
      lightingEnabled: true,
      ambientLightLevel: 0.5,
      sunSettings: { azimuth: 135, elevation: 45, color: '#ff0000', intensity: 1.4 },
      gridSize: 50
    });

    expect(manager.ambientLight.intensity).toBeCloseTo(0.45 + 1.15 * 0.5);
    expect(manager.sunLight.intensity).toBeCloseTo(1.4 * 1.15);
    expect(manager.sunLight.castShadow).toBe(true);
    expect(manager.sunLight.color.getHexString()).toBe('ff0000');
  });

  it('keeps the sun direction locked to sun settings instead of the camera', () => {
    const sunSettings = { azimuth: 90, elevation: 45, intensity: 1 };
    manager.update({ sunSettings, cameraX: 0, cameraY: 0, gridSize: 50 });
    const firstOffset = manager.sunLight.position.clone().sub(manager.sunTarget.position);

    manager.update({ sunSettings, cameraX: 500, cameraY: -300, gridSize: 50 });
    const secondOffset = manager.sunLight.position.clone().sub(manager.sunTarget.position);

    expect(secondOffset.x).toBeCloseTo(firstOffset.x);
    expect(secondOffset.y).toBeCloseTo(firstOffset.y);
    expect(secondOffset.z).toBeCloseTo(firstOffset.z);
  });

  it('re-aims the sun when its azimuth or height changes without a camera move', () => {
    manager.update({
      sunSettings: { azimuth: 135, elevation: 45, intensity: 1 },
      cameraX: 0,
      cameraY: 0,
      gridSize: 50
    });
    const before = manager.sunLight.position.clone().sub(manager.sunTarget.position);

    manager.update({
      sunSettings: { azimuth: 315, elevation: 20, intensity: 1 },
      cameraX: 0,
      cameraY: 0,
      gridSize: 50
    });
    const after = manager.sunLight.position.clone().sub(manager.sunTarget.position);

    expect(after.x).toBeCloseTo(-before.x);
    expect(after.y).toBeCloseTo(-before.y);
    expect(after.z).toBeLessThan(before.z);
  });

  it('disables the sun entirely when lighting is off', () => {
    manager.update({
      lightingEnabled: false,
      ambientLightLevel: 0.2,
      sunSettings: { intensity: 1 },
      gridSize: 50
    });
    expect(manager.sunLight.intensity).toBe(0);
    expect(manager.sunLight.castShadow).toBe(false);
    expect(manager.ambientLight.intensity).toBeCloseTo(1.5);
  });

  it('creates point lights positioned at the source tile centres', () => {
    manager.update({
      lightSources: { light1: baseLight({ x: 2, y: 3 }) },
      gridSize: 50,
      gridOffsetX: 0,
      gridOffsetY: 0
    });

    const entry = manager.pointLights.get('light1');
    expect(entry).toBeDefined();
    expect(entry.isSpot).toBe(false);
    expect(entry.light.isPointLight).toBe(true);
    // Tile centre: (2.5 * 50, -(3.5 * 50)) in Three.js space
    expect(entry.light.position.x).toBeCloseTo(125);
    expect(entry.light.position.y).toBeCloseTo(-175);
    // Near the top of the fixture model so the light is not inside it.
    expect(entry.light.position.z).toBeCloseTo(45);
  });

  it('switches to a spot light for directional cone sources', () => {
    manager.update({
      lightSources: { light1: baseLight({ direction: 90, coneAngle: 60 }) },
      gridSize: 50
    });
    expect(manager.pointLights.get('light1').isSpot).toBe(true);
    expect(manager.pointLights.get('light1').light.isSpotLight).toBe(true);
  });

  it('desaturates saturated light colours so masonry keeps its material tone', () => {
    manager.update({
      lightSources: { light1: baseLight({ color: '#ff0000' }) },
      gridSize: 50
    });
    // Three colours lerp in linear space, so 25% toward white reads as
    // roughly half-way to pink once converted back to sRGB.
    expect(manager.pointLights.get('light1').light.color.getHexString()).toBe('ff8989');
  });

  it('removes disabled and deleted light sources', () => {
    manager.update({ lightSources: { light1: baseLight(), light2: baseLight({ id: 'light2' }) }, gridSize: 50 });
    expect(manager.pointLights.size).toBe(2);

    manager.update({ lightSources: { light2: baseLight({ id: 'light2', enabled: false }) }, gridSize: 50 });
    expect(manager.pointLights.size).toBe(0);
  });

  it(`caps shadow-casting lights at ${MAX_SHADOW_LIGHTS}`, () => {
    const lightSources = {};
    for (let i = 0; i < MAX_SHADOW_LIGHTS + 3; i += 1) {
      lightSources[`light${i}`] = baseLight({ id: `light${i}`, x: i, y: 0 });
    }
    manager.update({ lightSources, gridSize: 50, cameraX: 0, cameraY: 0 });

    const casters = [...manager.pointLights.values()].filter((e) => e.light.castShadow);
    expect(casters).toHaveLength(MAX_SHADOW_LIGHTS);
  });

  it('does not cast dynamic light shadows in performance mode', () => {
    manager.update({
      lightSources: { light1: baseLight() },
      gridSize: 50,
      performanceMode: true
    });
    expect(manager.pointLights.get('light1').light.castShadow).toBe(false);
  });

  it('animates flickering lights without touching steady ones', () => {
    manager.update({
      lightSources: {
        steady: baseLight({ id: 'steady' }),
        flicker: baseLight({ id: 'flicker', flickering: true })
      },
      gridSize: 50
    });
    const steadyBefore = manager.pointLights.get('steady').light.intensity;
    const flickerBefore = manager.pointLights.get('flicker').light.intensity;

    for (let i = 0; i < 10; i += 1) manager.updateAnimations(0.1);

    expect(manager.pointLights.get('steady').light.intensity).toBe(steadyBefore);
    expect(manager.pointLights.get('flicker').light.intensity).not.toBe(flickerBefore);
  });

  it('anchors the sun shadow camera to a coarse world grid instead of chasing the camera', () => {
    manager.setShadowCameraExtent(1000);
    expect(manager.syncCamera(0, 0)).toBe(true);
    const anchor = manager.sunTarget.position.clone();

    manager.consumeShadowDirty();
    expect(manager.syncCamera(10, -10)).toBe(false);
    expect(manager.sunTarget.position.x).toBeCloseTo(anchor.x);
    expect(manager.sunTarget.position.y).toBeCloseTo(anchor.y);
    expect(manager.consumeShadowDirty()).toBe(false);

    const step = manager.shadowAnchorStep;
    expect(manager.syncCamera(step * 4, 0)).toBe(true);
    expect(manager.sunTarget.position.x).not.toBeCloseTo(anchor.x);
    expect(manager.consumeShadowDirty()).toBe(true);
  });

  it('grows the requested extent by the anchor coverage factor', () => {
    manager.setShadowCameraExtent(1000);
    const camera = manager.sunLight.shadow.camera;
    const half = camera.right;

    expect(half).toBeGreaterThanOrEqual(1000 * 1.25);
    expect(half).toBeLessThanOrEqual(1000 * 1.25 * 1.25 + 1e-6);
    expect(camera.left).toBeCloseTo(-half);
    expect(camera.top).toBeCloseTo(half);
    expect(camera.bottom).toBeCloseTo(-half);
  });

  it('tracks shadow re-render requests and only flags casting lights', () => {
    const lightSources = {};
    for (let i = 0; i < 6; i += 1) {
      lightSources[`light${i}`] = baseLight({ id: `light${i}`, x: i, y: 0 });
    }
    manager.update({ lightSources, gridSize: 50, cameraX: 0, cameraY: 0 });
    manager.consumeShadowDirty();
    [...manager.pointLights.values()].forEach((entry) => {
      entry.light.shadow.needsUpdate = false;
    });

    manager.markLightShadowsDirty();
    const entries = [...manager.pointLights.values()];
    const casters = entries.filter((entry) => entry.light.castShadow);
    const idle = entries.filter((entry) => !entry.light.castShadow);

    expect(casters).toHaveLength(MAX_SHADOW_LIGHTS);
    casters.forEach((entry) => expect(entry.light.shadow.needsUpdate).toBe(true));
    idle.forEach((entry) => expect(entry.light.shadow.needsUpdate).toBe(false));
    expect(manager.consumeShadowDirty()).toBe(true);
    expect(manager.consumeShadowDirty()).toBe(false);
  });

  it('applies shadow quality presets to sun and dynamic light map sizes', () => {
    manager.update({ shadowQuality: 'low', gridSize: 50 });
    expect(manager.sunLight.shadow.mapSize.width).toBe(1024);

    manager.update({ shadowQuality: 'high', gridSize: 50 });
    expect(manager.sunLight.shadow.mapSize.width).toBe(2048);

    const lightSources = {};
    for (let i = 0; i < 3; i += 1) {
      lightSources[`light${i}`] = baseLight({ id: `light${i}`, x: i, y: 0 });
    }
    manager.update({
      lightSources,
      shadowQuality: 'high',
      gridSize: 50,
      cameraX: 0,
      cameraY: 0
    });
    const casters = [...manager.pointLights.values()]
      .filter((entry) => entry.light.castShadow)
      .sort((a, b) => b.light.position.z - a.light.position.z || a.light.position.x - b.light.position.x);
    expect(casters.length).toBeGreaterThan(0);
    expect(casters[0].light.shadow.mapSize.width).toBe(1024);

    manager.update({ shadowQuality: 'low', performanceMode: true, lightSources, gridSize: 50 });
    expect(manager.sunLight.shadow.mapSize.width).toBe(1024);
    [...manager.pointLights.values()].forEach((entry) => {
      expect(entry.light.castShadow).toBe(false);
    });
  });
});
