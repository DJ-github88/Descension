import {
  resolveObjectWheelTransform,
  toToolSettingsPatch,
  clampObjectScale,
  wrapYawDegrees,
  wrapTiltDegrees,
  OBJECT_SCALE_MAX,
  OBJECT_SCALE_MIN,
  OBJECT_ROTATION_STEP
} from '../objectWheelTransforms';

const wheel = (overrides = {}) => ({
  deltaY: -100,
  deltaX: 0,
  altKey: false,
  shiftKey: false,
  ctrlKey: false,
  ...overrides
});

describe('objectWheelTransforms', () => {
  it('reserves Ctrl+wheel for camera zoom', () => {
    expect(resolveObjectWheelTransform(wheel({ ctrlKey: true }), { scale: 1 })).toBeNull();
  });

  it('ignores events without a delta', () => {
    expect(resolveObjectWheelTransform(wheel({ deltaY: 0, deltaX: 0 }), { scale: 1 })).toBeNull();
    expect(resolveObjectWheelTransform(null, { scale: 1 })).toBeNull();
  });

  it('scales up on wheel up and down on wheel down', () => {
    const up = resolveObjectWheelTransform(wheel({ deltaY: -100 }), { scale: 1 });
    expect(up.scale).toBeGreaterThan(1);

    const down = resolveObjectWheelTransform(wheel({ deltaY: 100 }), { scale: 1 });
    expect(down.scale).toBeLessThan(1);
  });

  it('clamps the scale to the supported range', () => {
    expect(clampObjectScale(0.0001)).toBe(OBJECT_SCALE_MIN);
    expect(clampObjectScale(999)).toBe(OBJECT_SCALE_MAX);
    expect(resolveObjectWheelTransform(wheel({ deltaY: -100 }), { scale: OBJECT_SCALE_MAX }).scale).toBe(OBJECT_SCALE_MAX);
  });

  it('rotates yaw with Alt+wheel and wraps at 360', () => {
    const patch = resolveObjectWheelTransform(wheel({ altKey: true }), { rotation: 355 });
    expect(patch).toEqual({ rotation: wrapYawDegrees(355 + OBJECT_ROTATION_STEP) });
    expect(patch.rotation).toBe(10);
  });

  it('tilts pitch with Alt+Shift+wheel within -180..180', () => {
    const patch = resolveObjectWheelTransform(wheel({ altKey: true, shiftKey: true, deltaY: 100 }), { rotationX: -175 });
    expect(patch).toEqual({ rotationX: wrapTiltDegrees(-175 - OBJECT_ROTATION_STEP) });
    expect(patch.rotationX).toBeGreaterThan(0);
  });

  it('rolls with Shift+wheel only', () => {
    const patch = resolveObjectWheelTransform(wheel({ shiftKey: true }), { rotationY: 0 });
    expect(patch).toEqual({ rotationY: OBJECT_ROTATION_STEP });
  });

  it('only ever returns keys that changed', () => {
    const patch = resolveObjectWheelTransform(wheel({ altKey: true }), { rotation: 0, scale: 2, rotationX: 15 });
    expect(Object.keys(patch)).toEqual(['rotation']);
  });

  it('uses deltaX when a trackpad reports horizontal scroll only', () => {
    const patch = resolveObjectWheelTransform(wheel({ deltaY: 0, deltaX: -50 }), { scale: 1 });
    expect(patch.scale).toBeGreaterThan(1);
  });

  it('maps canonical keys onto tool-settings keys for the ghost preview', () => {
    expect(toToolSettingsPatch({ scale: 1.1 })).toEqual({ objectScale: 1.1 });
    expect(toToolSettingsPatch({ rotation: 15 })).toEqual({ objectRotation: 15 });
    expect(toToolSettingsPatch({ rotationX: -15 })).toEqual({ objectRotationX: -15 });
    expect(toToolSettingsPatch({ rotationY: 30 })).toEqual({ objectRotationY: 30 });
    expect(toToolSettingsPatch(null)).toBeNull();
  });
});
