/**
 * Mouse-wheel transform rules for the level editor's object placement ghost and
 * for selected placed objects.
 *
 * Modifier map (Ctrl+wheel is reserved for camera zoom and is never claimed):
 *   Wheel                  -> uniform scale
 *   Alt + Wheel            -> yaw rotation (Z, ground plane)
 *   Alt + Shift + Wheel    -> pitch / tilt (X)
 *   Shift + Wheel          -> roll (Y)
 *
 * The returned patch always contains only the keys that changed so callers can
 * merge it into tool settings or into an object's stored transform.
 */

export const OBJECT_SCALE_MIN = 0.1;
export const OBJECT_SCALE_MAX = 10;
export const OBJECT_SCALE_STEP = 1.1;
export const OBJECT_ROTATION_STEP = 15;

const SCALE_PRECISION = 1000;

export function wrapYawDegrees(degrees) {
  const wrapped = ((degrees % 360) + 360) % 360;
  return wrapped;
}

export function wrapTiltDegrees(degrees) {
  const wrapped = wrapYawDegrees(degrees);
  return wrapped > 180 ? wrapped - 360 : wrapped;
}

export function clampObjectScale(scale) {
  const clamped = Math.min(OBJECT_SCALE_MAX, Math.max(OBJECT_SCALE_MIN, scale));
  return Math.round(clamped * SCALE_PRECISION) / SCALE_PRECISION;
}

/**
 * Resolve the transform patch for one wheel event.
 *
 * @param {object} event Wheel-like event (deltaX, deltaY, altKey, shiftKey, ctrlKey).
 * @param {object} current Current transform { scale, rotation, rotationX, rotationY }.
 * @returns {object|null} Partial patch keyed for tool settings / object data
 *   (`objectScale`, `objectRotation`, `objectRotationX`, `objectRotationY`), or
 *   null when the event is not ours.
 */
export function resolveObjectWheelTransform(event, current = {}) {
  if (!event || event.ctrlKey) return null;

  const deltaY = Number.isFinite(event.deltaY) ? event.deltaY : 0;
  const deltaX = Number.isFinite(event.deltaX) ? event.deltaX : 0;
  const delta = deltaY !== 0 ? deltaY : deltaX;
  if (delta === 0) return null;

  // Wheel up (negative delta) increases scale / rotates forward.
  const direction = delta < 0 ? 1 : -1;
  const scale = current.scale || 1;
  const rotation = current.rotation || 0;
  const rotationX = current.rotationX || 0;
  const rotationY = current.rotationY || 0;

  if (event.altKey && event.shiftKey) {
    return { rotationX: wrapTiltDegrees(rotationX + direction * OBJECT_ROTATION_STEP) };
  }
  if (event.altKey) {
    return { rotation: wrapYawDegrees(rotation + direction * OBJECT_ROTATION_STEP) };
  }
  if (event.shiftKey) {
    return { rotationY: wrapTiltDegrees(rotationY + direction * OBJECT_ROTATION_STEP) };
  }
  return { scale: clampObjectScale(scale * (direction > 0 ? OBJECT_SCALE_STEP : 1 / OBJECT_SCALE_STEP)) };
}
