/**
 * Mouse-wheel transform rules for the level editor's object placement ghost and
 * for selected placed objects.
 *
 * Modifier map (Ctrl+wheel is reserved for camera zoom and is never claimed):
 *   Wheel                     -> uniform scale
 *   Alt + Wheel               -> yaw rotation (Z, ground plane)
 *   Alt + Shift + Wheel       -> pitch / tilt (X)
 *   Shift + Wheel             -> roll (Y)
 *   E + Wheel (or Shift+E)    -> elevation / height (Z)
 *   Alt + E + Wheel           -> fine elevation (0.1 step)
 *
 * The returned patch always contains only the keys that changed so callers can
 * merge it into tool settings or into an object's stored transform.
 */

export const OBJECT_SCALE_MIN = 0.1;
export const OBJECT_SCALE_MAX = 10;
export const OBJECT_SCALE_STEP = 1.1;
export const OBJECT_ROTATION_STEP = 15;
export const OBJECT_ELEVATION_STEP = 0.5;
export const OBJECT_ELEVATION_MIN = -10;
export const OBJECT_ELEVATION_MAX = 20;

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

export function clampObjectElevation(elevation) {
  const numeric = Number(elevation);
  const val = Number.isFinite(numeric) ? numeric : 0;
  const clamped = Math.min(OBJECT_ELEVATION_MAX, Math.max(OBJECT_ELEVATION_MIN, val));
  return Math.round(clamped * 100) / 100;
}

/**
 * Resolve the transform patch for one wheel event. Keys are canonical object
 * transform names (`scale`, `rotation`, `rotationX`, `rotationY`, `elevation`) so the patch
 * can be written straight onto placed object data.
 *
 * @param {object} event Wheel-like event (deltaX, deltaY, altKey, shiftKey, ctrlKey, eKey).
 * @param {object} current Current transform { scale, rotation, rotationX, rotationY, elevation }.
 * @returns {object|null} Partial patch, or null when the event is not ours.
 */
export function resolveObjectWheelTransform(event, current = {}) {
  if (!event || event.ctrlKey) return null;

  const deltaY = Number.isFinite(event.deltaY) ? event.deltaY : 0;
  const deltaX = Number.isFinite(event.deltaX) ? event.deltaX : 0;
  const delta = deltaY !== 0 ? deltaY : deltaX;
  if (delta === 0) return null;

  // Wheel up (negative delta) increases scale / rotates forward / raises elevation.
  const direction = delta < 0 ? 1 : -1;
  const scale = current.scale || 1;
  const rotation = current.rotation || 0;
  const rotationX = current.rotationX || 0;
  const rotationY = current.rotationY || 0;
  const elevation = Number.isFinite(current.elevation) ? current.elevation : 0;

  if (event.eKey) {
    const step = event.altKey ? 0.1 : OBJECT_ELEVATION_STEP;
    return { elevation: clampObjectElevation(elevation + direction * step) };
  }
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

const TOOL_SETTINGS_KEY_BY_TRANSFORM_KEY = {
  scale: 'objectScale',
  rotation: 'objectRotation',
  rotationX: 'objectRotationX',
  rotationY: 'objectRotationY',
  elevation: 'objectElevation'
};

/**
 * Map a canonical wheel-transform patch onto level-editor tool settings keys
 * (`objectScale`, `objectRotation`, `objectRotationX`, `objectRotationY`, `objectElevation`).
 */
export function toToolSettingsPatch(patch) {
  if (!patch) return null;
  const mapped = {};
  for (const [key, value] of Object.entries(patch)) {
    const settingsKey = TOOL_SETTINGS_KEY_BY_TRANSFORM_KEY[key];
    if (settingsKey) mapped[settingsKey] = value;
  }
  return mapped;
}
