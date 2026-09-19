/**
 * Bridge between the imperative Three.js prop layer and the 2D overlay
 * systems (selection chrome, hit-testing).
 *
 * ThreeDPropManager registers a resolver on construction; ObjectSystem asks
 * for an object's rendered model bounds so selection chrome can hug the actual
 * 3D figure instead of the (much larger) grid footprint box.
 *
 * The resolver returns 8 corners in VTT world space (x east, y down, z up),
 * or null when the model has not been instantiated yet.
 */

let activeResolver = null;

export function setPropWorldBoundsResolver(owner, resolver) {
  activeResolver = typeof resolver === 'function' ? { owner, resolver } : null;
}

export function clearPropWorldBoundsResolver(owner) {
  if (activeResolver && activeResolver.owner === owner) {
    activeResolver = null;
  }
}

export function getPropWorldBoundsCorners(objectId) {
  if (!activeResolver || !objectId) return null;
  try {
    return activeResolver.resolver(objectId);
  } catch (error) {
    return null;
  }
}
