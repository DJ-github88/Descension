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
    expect(manager.sunTarget.position.x).toBe(500);
    expect(manager.sunTarget.position.y).toBe(300);
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
});
