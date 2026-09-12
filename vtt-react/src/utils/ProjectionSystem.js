/**
 * ProjectionSystem - Single source of truth for world <-> screen projection.
 *
 * View model:
 *  - viewMode '2d'   : topdown (tilt locked to 90deg). Yaw rotation still allowed.
 *  - viewMode '2.5d' : isometric-ish tilt (15..90deg, default 30).
 *
 * Conventions (match the existing VTT screen space):
 *  - World +x east, +y "grid down" (screen down in topdown), +z up (elevation).
 *  - Screen +x right, +y down.
 *  - Yaw rotates the world around z before tilt: 0 = north-up (grid axes align
 *    with the screen axes exactly like the legacy renderer).
 *  - Tilt compresses the ground plane vertical axis by sin(tilt) and projects
 *    vertical world height by cos(tilt).
 *
 * The ground-plane transform is affine, so canvases can render world-space
 * content with ctx.setTransform via getCanvasTransform()/applyCanvasTransform().
 */

export const DEFAULT_TILT_2D = 90;
export const DEFAULT_TILT_2_5D = 30;
export const MIN_TILT = 15;
export const MAX_TILT = 90;

export function normalizeDegrees(degrees) {
  if (!Number.isFinite(degrees)) return 0;
  return ((degrees % 360) + 360) % 360;
}

export function clampTilt(degrees) {
  if (!Number.isFinite(degrees)) return DEFAULT_TILT_2_5D;
  return Math.max(MIN_TILT, Math.min(MAX_TILT, degrees));
}

export function resolveTilt(viewMode, viewTilt) {
  if (viewMode === '2d') return DEFAULT_TILT_2D;
  return clampTilt(Number.isFinite(viewTilt) ? viewTilt : DEFAULT_TILT_2_5D);
}

/**
 * Build an immutable transform descriptor. Cheap enough to compute per frame,
 * but callers should prefer caching it for a render pass.
 */
export function getProjectionTransform(viewState = {}) {
  const {
    viewMode = '2d',
    viewRotation = 0,
    viewTilt,
    effectiveZoom = 1,
    cameraX = 0,
    cameraY = 0,
    viewportWidth = 0,
    viewportHeight = 0
  } = viewState;

  const yaw = normalizeDegrees(viewRotation);
  const tilt = resolveTilt(viewMode, viewTilt);
  const yawRad = (yaw * Math.PI) / 180;
  const tiltRad = (tilt * Math.PI) / 180;

  return {
    viewMode,
    yaw,
    tilt,
    cosYaw: Math.cos(yawRad),
    sinYaw: Math.sin(yawRad),
    sinTilt: Math.sin(tiltRad),
    cosTilt: Math.cos(tiltRad),
    effectiveZoom: Number.isFinite(effectiveZoom) && effectiveZoom !== 0 ? effectiveZoom : 1,
    cameraX,
    cameraY,
    viewportWidth,
    viewportHeight,
    centerX: viewportWidth / 2,
    centerY: viewportHeight / 2
  };
}

/**
 * Project a world point (x, y, z) to screen coordinates.
 * Returns { x, y, depth } where depth is the camera-forward ground coordinate
 * (larger = nearer to the bottom of the screen) for painter ordering.
 */
export function worldToScreen(worldX, worldY, transform, worldZ = 0) {
  const dx = worldX - transform.cameraX;
  const dy = worldY - transform.cameraY;

  const xr = dx * transform.cosYaw + dy * transform.sinYaw;
  const yr = -dx * transform.sinYaw + dy * transform.cosYaw;

  const eff = transform.effectiveZoom;

  return {
    x: transform.centerX + xr * eff,
    y: transform.centerY + yr * transform.sinTilt * eff - worldZ * transform.cosTilt * eff,
    depth: yr
  };
}

/**
 * Inverse of worldToScreen for points on a plane of constant world height
 * (default z=0, the ground plane).
 */
export function screenToWorld(screenX, screenY, transform, worldZ = 0) {
  const eff = transform.effectiveZoom;
  const sinTilt = transform.sinTilt || 1;

  const xr = (screenX - transform.centerX) / eff;
  const yr = (screenY - transform.centerY + worldZ * transform.cosTilt * eff) / (sinTilt * eff);

  return {
    x: transform.cameraX + (xr * transform.cosYaw - yr * transform.sinYaw),
    y: transform.cameraY + (xr * transform.sinYaw + yr * transform.cosYaw),
    depth: yr
  };
}

/**
 * Convert a screen-space delta vector into a world-space delta (translation
 * free). Used for pans and drag math.
 */
export function screenDeltaToWorld(deltaScreenX, deltaScreenY, transform) {
  const eff = transform.effectiveZoom;
  const sinTilt = transform.sinTilt || 1;

  const xr = deltaScreenX / eff;
  const yr = deltaScreenY / (sinTilt * eff);

  return {
    x: xr * transform.cosYaw - yr * transform.sinYaw,
    y: xr * transform.sinYaw + yr * transform.cosYaw
  };
}

/**
 * Ground-plane affine coefficients for ctx.setTransform(a, b, c, d, e, f):
 *   screenX = a * worldX + c * worldY + e
 *   screenY = b * worldX + d * worldY + f
 */
export function getCanvasTransform(transform) {
  const { effectiveZoom: eff, cosYaw, sinYaw, sinTilt } = transform;

  const a = eff * cosYaw;
  const c = eff * sinYaw;
  const b = -eff * sinTilt * sinYaw;
  const d = eff * sinTilt * cosYaw;
  const e = transform.centerX - a * transform.cameraX - c * transform.cameraY;
  const f = transform.centerY - b * transform.cameraX - d * transform.cameraY;

  return { a, b, c, d, e, f };
}

/**
 * Apply the ground-plane transform to a canvas context. Returns the applied
 * coefficients so callers can reset or reuse them.
 */
export function applyCanvasTransform(ctx, transform) {
  const matrix = getCanvasTransform(transform);
  ctx.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
  return matrix;
}

/**
 * Painter-order depth for a ground point (camera-forward coordinate).
 */
export function depthKey(worldX, worldY, transform) {
  const dx = worldX - transform.cameraX;
  const dy = worldY - transform.cameraY;
  return -dx * transform.sinYaw + dy * transform.cosYaw;
}

/**
 * True when the transform is an exact legacy topdown identity (no yaw, tilt 90).
 */
export function isIdentityProjection(transform) {
  return (
    Math.abs(transform.yaw % 360) < 1e-9 &&
    Math.abs(transform.sinTilt - 1) < 1e-9 &&
    Math.abs(transform.cosTilt) < 1e-9
  );
}
