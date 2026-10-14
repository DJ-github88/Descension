/**
 * Loot drop placement
 *
 * Picks the tiles where loot orbs should land when a creature's loot is rolled.
 * - Works outward in rings from the creature's footprint (so large creatures drop
 *   around their whole body, not on top of themselves).
 * - Square and hex grids are both supported.
 * - Tiles are shuffled within a ring so drops scatter instead of always filling
 *   the top-left neighbour first.
 * - Tiles that already hold a loot orb or another creature are skipped.
 */
import { getFootprintTiles } from './GridPathfinder';

const tileKey = (x, y) => `${x},${y}`;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const hexDistance = (q1, r1, q2, r2) => {
  const dq = q1 - q2;
  const dr = r1 - r2;
  return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr));
};

/**
 * @param {Object} opts
 * @param {Object} opts.gridSystem        InfiniteGridSystem instance
 * @param {{x:number,y:number}} opts.tokenWorldPos  creature token world position
 * @param {{width?:number,height?:number}} [opts.footprint]  creature footprint in tiles (square grids)
 * @param {number} opts.count             how many tiles are needed
 * @param {Set<string>} [opts.blockedKeys] "x,y" tiles that may not be used
 * @param {number} [opts.maxRing=6]       how far from the creature we will search
 * @returns {Array<{gridX:number,gridY:number,worldPos:{x:number,y:number},ring:number}>}
 */
export function findLootDropTiles({
  gridSystem,
  tokenWorldPos,
  footprint = { width: 1, height: 1 },
  count,
  blockedKeys = new Set(),
  maxRing = 6
}) {
  if (!gridSystem || !tokenWorldPos || count <= 0) return [];

  const isHex = gridSystem.getGridState?.()?.gridType === 'hex';
  const origin = gridSystem.worldToGrid(tokenWorldPos.x, tokenWorldPos.y);

  // Tiles the creature itself covers - never drop on these.
  const ownTiles = isHex
    ? [{ x: origin.x, y: origin.y }]
    : getFootprintTiles(origin.x, origin.y, footprint);
  const ownKeys = new Set(ownTiles.map(t => tileKey(t.x, t.y)));

  const candidates = [];
  if (isHex) {
    for (let dq = -maxRing; dq <= maxRing; dq++) {
      for (let dr = -maxRing; dr <= maxRing; dr++) {
        const q = origin.x + dq;
        const r = origin.y + dr;
        const ring = hexDistance(q, r, origin.x, origin.y);
        if (ring < 1 || ring > maxRing) continue;
        candidates.push({ x: q, y: r, ring });
      }
    }
  } else {
    const minX = Math.min(...ownTiles.map(t => t.x));
    const maxX = Math.max(...ownTiles.map(t => t.x));
    const minY = Math.min(...ownTiles.map(t => t.y));
    const maxY = Math.max(...ownTiles.map(t => t.y));
    for (let x = minX - maxRing; x <= maxX + maxRing; x++) {
      for (let y = minY - maxRing; y <= maxY + maxRing; y++) {
        const dx = Math.max(minX - x, 0, x - maxX);
        const dy = Math.max(minY - y, 0, y - maxY);
        const ring = Math.max(dx, dy);
        if (ring < 1 || ring > maxRing) continue;
        candidates.push({ x, y, ring });
      }
    }
  }

  const free = candidates.filter(c => {
    const key = tileKey(c.x, c.y);
    return !ownKeys.has(key) && !blockedKeys.has(key);
  });

  // Nearest ring first, random order inside a ring.
  const picked = [];
  for (let ring = 1; ring <= maxRing && picked.length < count; ring++) {
    const inRing = shuffle(free.filter(c => c.ring === ring));
    for (const c of inRing) {
      if (picked.length >= count) break;
      picked.push(c);
    }
  }

  return picked.map(c => ({
    gridX: c.x,
    gridY: c.y,
    ring: c.ring,
    worldPos: gridSystem.gridToWorld(c.x, c.y)
  }));
}

export default findLootDropTiles;
