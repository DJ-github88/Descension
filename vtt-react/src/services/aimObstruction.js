import { getWallWorldEndpoints, parseWallKey } from '../utils/WallGeometry';

export const AIM_MANUAL = 'Attack passage, cover and elevation: unknown — GM decides. Advisory only; not enforced.';
const point = p => !!p && Number.isFinite(p.x) && Number.isFinite(p.y);
const exactRef = ref => !!ref && ['creature', 'character'].includes(ref.kind) &&
  ['roomId', 'mapId', 'tokenId', 'instanceId'].every(key => typeof ref[key] === 'string' && ref[key].length > 0);
const result = (status, reason) => ({ status, diagnostic: 'planar-centre-sight', reason, trajectory: 'unknown', advisory: true });
const unknown = reason => result('unknown', reason);
const cross = (a, b, c) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const onSegment = (a, b, p, epsilon) => Math.abs(cross(a, b, p)) <= epsilon * Math.max(1, Math.hypot(b.x - a.x, b.y - a.y)) &&
  p.x >= Math.min(a.x, b.x) - epsilon && p.x <= Math.max(a.x, b.x) + epsilon &&
  p.y >= Math.min(a.y, b.y) - epsilon && p.y <= Math.max(a.y, b.y) + epsilon;

/** Analytic narrow phase: bounding-box overlap alone is never an obstruction. */
export function sightSegmentContact(a, b, c, d, epsilon = 1e-7) {
  if (![a, b, c, d].every(point)) return 'unknown';
  if (onSegment(a, b, c, epsilon) || onSegment(a, b, d, epsilon) || onSegment(c, d, a, epsilon) || onSegment(c, d, b, epsilon)) return 'contact';
  return cross(a, b, c) * cross(a, b, d) < 0 && cross(c, d, a) * cross(c, d, b) < 0 ? 'crossing' : 'clear';
}

/**
 * Read-only advisory query, using established SIGHT properties only. No physical attack hull,
 * projectile rule, cover sampler, range calculation or persistent/cross-viewer result cache.
 * Privacy gate MUST precede reading geometry: replicated map state is not viewer entitlement.
 * Only unrestricted GM view currently has a complete authorized projection in the production picker.
 */
export function queryAimObstruction({ source, target, mapId, unrestrictedGM = false, gridSystem,
  wallData = {}, wallTypes = {}, objectTypes = {}, environmentalObjects = [], windowOverlays = {}, ready = true } = {}) {
  if (!unrestrictedGM) return unknown('Sight unknown — GM decides; viewer-safe geometry is unavailable.');
  if (!ready) return unknown('Sight unknown — map state is not ready.');
  if (!exactRef(source?.ref) || !exactRef(target?.ref) || source.ref.roomId !== target.ref.roomId || source.ref.mapId !== mapId || target.ref.mapId !== mapId ||
      !point(source.position) || !point(target.position)) return unknown('Sight unknown — exact same-map positions are required.');
  if (Math.hypot(source.position.x - target.position.x, source.position.y - target.position.y) < 1e-7) return unknown('Sight unknown — source and target overlap.');
  const state = gridSystem?.getGridState?.();
  if (!state || !['square', 'hex'].includes(state.gridType) || !Number.isFinite(state.gridSize) || state.gridSize <= 0 ||
      !Number.isFinite(state.gridOffsetX) || !Number.isFinite(state.gridOffsetY) ||
      !wallData || typeof wallData !== 'object' || Array.isArray(wallData) || !Array.isArray(environmentalObjects) ||
      !windowOverlays || typeof windowOverlays !== 'object') return unknown('Sight unknown — geometry or grid data is unavailable.');
  const a = source.position, b = target.position;
  let uncertain = false, blocked = false;
  for (const [key, wall] of Object.entries(wallData)) {
    const parsed = parseWallKey(key), type = wallTypes[typeof wall === 'string' ? wall : wall?.type];
    if (!parsed || !type) { uncertain = true; continue; }
    let ends;
    try { ends = getWallWorldEndpoints(parsed, gridSystem, state.gridType, wall); } catch { uncertain = true; continue; }
    if (!point(ends?.start) || !point(ends?.end)) { uncertain = true; continue; }
    const contact = sightSegmentContact(a, b, ends.start, ends.end);
    if (contact === 'clear') continue;
    // Overlay windows and legacy isOpen have no certified shared door/leaf identity mapping.
    const hasOverlay = Object.keys(windowOverlays).some(k => {
      const xy = k.split(',').map(Number);
      return xy.length !== 2 || !xy.every(Number.isFinite) || (xy[0] >= Math.min(parsed.x1, parsed.x2) && xy[0] <= Math.max(parsed.x1, parsed.x2) &&
        xy[1] >= Math.min(parsed.y1, parsed.y2) && xy[1] <= Math.max(parsed.y1, parsed.y2));
    });
    if (hasOverlay || (wall && typeof wall === 'object' && 'isOpen' in wall)) { uncertain = true; continue; }
    let blocks = type.blocksLineOfSight;
    if (type.interactive) {
      if (!['open', 'closed', 'locked'].includes(wall?.state)) { uncertain = true; continue; }
      if (wall.state === 'open') blocks = false;
    }
    if (typeof blocks !== 'boolean') { uncertain = true; continue; }
    if (!blocks) continue;
    if (contact !== 'crossing') uncertain = true;
    else blocked = true;
  }
  for (const object of environmentalObjects) {
    // Asset type/name/image is deliberately never a blocking rule.
    if (object?.blocksLineOfSight === false) continue;
    if (object?.blocksLineOfSight !== true) { uncertain = true; continue; }
    // Object doors have separate state/attachment encodings; no leaf inference here.
    if (objectTypes[object.type]?.interactive || object.interactive || object.state !== undefined || object.isOpen !== undefined || object.doorState !== undefined || object.parentWallKey) { uncertain = true; continue; }
    const x = object.worldX ?? (object.gridX * state.gridSize + state.gridSize / 2 + state.gridOffsetX);
    const y = object.worldY ?? (object.gridY * state.gridSize + state.gridSize / 2 + state.gridOffsetY);
    const width = object.width ?? 1, height = object.height ?? 1, scale = object.scale ?? 1, rotation = object.rotation ?? 0;
    if (![x, y, width, height, scale, rotation].every(Number.isFinite) || width <= 0 || height <= 0 || scale <= 0) { uncertain = true; continue; }
    // Same inset rotated rectangle as VisibilityCalculations.calculateVisibilityPolygon (sight only).
    const halfW = width * state.gridSize * scale * 0.85 / 2, halfH = height * state.gridSize * scale * 0.85 / 2;
    const angle = rotation * Math.PI / 180, cos = Math.cos(angle), sin = Math.sin(angle);
    const local = p => ({ x: (p.x - x) * cos + (p.y - y) * sin, y: -(p.x - x) * sin + (p.y - y) * cos });
    const start = local(a), end = local(b);
    let low = 0, high = 1;
    for (const [axis, half] of [['x', halfW], ['y', halfH]]) {
      const delta = end[axis] - start[axis];
      if (Math.abs(delta) < 1e-7) { if (Math.abs(start[axis]) > half + 1e-7) high = -1; }
      else {
        const t1 = (-half - start[axis]) / delta, t2 = (half - start[axis]) / delta;
        low = Math.max(low, Math.min(t1, t2)); high = Math.min(high, Math.max(t1, t2));
      }
    }
    if (low > high + 1e-7) continue;
    const t = (low + high) / 2;
    const interior = Math.abs(start.x + (end.x - start.x) * t) < halfW - 1e-7 && Math.abs(start.y + (end.y - start.y) * t) < halfH - 1e-7;
    if (high - low > 1e-7 && interior) blocked = true;
    else uncertain = true;
  }
  if (blocked) return result('blocked', 'Sight blocked in modeled 2D geometry — GM decides attack passage.');
  if (uncertain) return unknown('Sight unknown — unresolved geometry, boundary contact or door/object configuration; GM decides.');
  return result('clear', 'Sight clear in modeled 2D geometry only — not attack clearance.');
}
