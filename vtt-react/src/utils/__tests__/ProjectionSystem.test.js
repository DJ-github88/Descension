import {
  getProjectionTransform,
  worldToScreen,
  screenToWorld,
  screenDeltaToWorld,
  getCanvasTransform,
  depthKey,
  isIdentityProjection,
  resolveTilt,
  normalizeDegrees,
  DEFAULT_TILT_2D,
  DEFAULT_TILT_2_5D,
  MIN_TILT,
  MAX_TILT
} from '../ProjectionSystem';

describe('ProjectionSystem', () => {
  it('normalizes yaw and resolves tilt per view mode', () => {
    expect(normalizeDegrees(450)).toBe(90);
    expect(normalizeDegrees(-90)).toBe(270);
    expect(resolveTilt('2d', 30)).toBe(DEFAULT_TILT_2D);
    expect(resolveTilt('2.5d', 30)).toBe(30);
    expect(resolveTilt('2.5d', 5)).toBe(MIN_TILT);
    expect(resolveTilt('2.5d', 200)).toBe(MAX_TILT);
    expect(resolveTilt('2.5d', undefined)).toBe(DEFAULT_TILT_2_5D);
  });

  it('is an exact legacy topdown identity in 2D with no yaw', () => {
    const t = getProjectionTransform({
      viewMode: '2d',
      viewRotation: 0,
      effectiveZoom: 2,
      cameraX: 100,
      cameraY: 50,
      viewportWidth: 800,
      viewportHeight: 600
    });

    const p = worldToScreen(150, 100, t);
    expect(p.x).toBeCloseTo(400 + (150 - 100) * 2, 10);
    expect(p.y).toBeCloseTo(300 + (100 - 50) * 2, 10);
    expect(isIdentityProjection(t)).toBe(true);
  });

  it('rotates the world around z when yaw is set', () => {
    const t = getProjectionTransform({
      viewMode: '2d',
      viewRotation: 90,
      effectiveZoom: 1,
      cameraX: 0,
      cameraY: 0,
      viewportWidth: 800,
      viewportHeight: 600
    });

    // East of the camera should appear above the center after a 90deg yaw.
    const east = worldToScreen(100, 0, t);
    expect(east.x).toBeCloseTo(400, 10);
    expect(east.y).toBeCloseTo(200, 10);

    // North (+y) should appear to the right.
    const north = worldToScreen(0, 100, t);
    expect(north.x).toBeCloseTo(500, 10);
    expect(north.y).toBeCloseTo(300, 10);
  });

  it('projects vertical height upward scaled by cos(tilt)', () => {
    const t = getProjectionTransform({
      viewMode: '2.5d',
      viewTilt: 30,
      effectiveZoom: 1,
      viewportWidth: 0,
      viewportHeight: 0
    });

    const ground = worldToScreen(0, 0, t, 0);
    const raised = worldToScreen(0, 0, t, 50);
    expect(ground.y).toBeCloseTo(0, 10);
    expect(raised.y).toBeCloseTo(-50 * Math.cos(Math.PI / 6), 10);
  });

  it('round-trips world -> screen -> world in 2.5D', () => {
    const t = getProjectionTransform({
      viewMode: '2.5d',
      viewRotation: 37,
      viewTilt: 30,
      effectiveZoom: 1.75,
      cameraX: 123.5,
      cameraY: -47.25,
      viewportWidth: 1280,
      viewportHeight: 720
    });

    const samples = [
      { x: 0, y: 0 },
      { x: 500, y: -300 },
      { x: -120, y: 640 }
    ];

    for (const point of samples) {
      const screen = worldToScreen(point.x, point.y, t);
      const back = screenToWorld(screen.x, screen.y, t);
      expect(back.x).toBeCloseTo(point.x, 8);
      expect(back.y).toBeCloseTo(point.y, 8);
    }
  });

  it('canvas transform matches worldToScreen on the ground plane', () => {
    const t = getProjectionTransform({
      viewMode: '2.5d',
      viewRotation: 210,
      viewTilt: 45,
      effectiveZoom: 1.3,
      cameraX: -80,
      cameraY: 220,
      viewportWidth: 1024,
      viewportHeight: 768
    });

    const m = getCanvasTransform(t);
    const samples = [
      { x: -200, y: 90 },
      { x: 640, y: -410 }
    ];

    for (const point of samples) {
      const screen = worldToScreen(point.x, point.y, t);
      expect(m.a * point.x + m.c * point.y + m.e).toBeCloseTo(screen.x, 8);
      expect(m.b * point.x + m.d * point.y + m.f).toBeCloseTo(screen.y, 8);
    }
  });

  it('screenDeltaToWorld is the exact inverse of the linear map', () => {
    const t = getProjectionTransform({
      viewMode: '2.5d',
      viewRotation: 150,
      viewTilt: 60,
      effectiveZoom: 0.8,
      viewportWidth: 100,
      viewportHeight: 100
    });

    const m = getCanvasTransform(t);
    const worldDelta = { x: 33, y: -17 };
    const screenDeltaX = m.a * worldDelta.x + m.c * worldDelta.y;
    const screenDeltaY = m.b * worldDelta.x + m.d * worldDelta.y;

    const back = screenDeltaToWorld(screenDeltaX, screenDeltaY, t);
    expect(back.x).toBeCloseTo(worldDelta.x, 8);
    expect(back.y).toBeCloseTo(worldDelta.y, 8);
  });

  it('depth ordering increases toward the bottom of the screen', () => {
    const t = getProjectionTransform({
      viewMode: '2.5d',
      viewRotation: 0,
      viewTilt: 30,
      viewportWidth: 800,
      viewportHeight: 600
    });

    expect(depthKey(0, -50, t)).toBeLessThan(depthKey(0, 50, t));

    const near = worldToScreen(0, 50, t);
    const far = worldToScreen(0, -50, t);
    expect(near.y).toBeGreaterThan(far.y);
  });
});
