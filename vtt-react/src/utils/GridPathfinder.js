import { isWallBlockingMovement } from './VisibilityCalculations';
import { canStepElevation, getTileElevation, rampAllowsStep } from './ElevationUtils';

/** Flat-top axial hex neighbors (matches InfiniteGridSystem.getHexNeighbors). */
const HEX_DIRECTIONS = [
  [1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]
];

/** Axial hex distance. */
export function hexGridDistance(q1, r1, q2, r2) {
  return (Math.abs(q1 - q2) + Math.abs(r1 - r2) + Math.abs((q1 + r1) - (q2 + r2))) / 2;
}

/**
 * Movement blocking between two adjacent hexes. Hex walls are stored as edge
 * keys "q1,r1,q2,r2" (either order). Open doors and open windows pass; all
 * other walls (incl. closed/locked doors, windows, barriers) block movement.
 */
function isHexWallBlocking(q1, r1, q2, r2, wallData) {
  if (!wallData) return false;
  const wall = wallData[`${q1},${r1},${q2},${r2}`] || wallData[`${q2},${r2},${q1},${r1}`];
  if (!wall) return false;
  if (typeof wall === 'string') return true;
  if (wall.state === 'open') return false;
  if (wall.type === 'open_window') return false;
  return true;
}

/**
 * Calculates grid cells occupied by a token footprint anchored at (ax, ay).
 * Anchoring rule (square grid):
 * - Odd-sized footprints (1x1, 3x3, 5x5) are centered on the anchor tile:
 *   offsets in [-Math.floor(W/2) .. Math.floor(W/2)].
 * - Even-sized footprints (2x2, 4x4) are biased up-left from the anchor tile:
 *   startXOffset = -Math.floor(W/2), so for 2x2 offsets are in [-1, 0].
 *
 * @param {number} ax - Anchor grid x
 * @param {number} ay - Anchor grid y
 * @param {{ width?: number, height?: number }|number} [footprint={ width: 1, height: 1 }] - Footprint dimensions or size
 * @returns {Array<{x: number, y: number}>} Array of occupied tile coordinates
 */
export function getFootprintTiles(ax, ay, footprint = { width: 1, height: 1 }) {
  const width = Math.max(1, Math.floor(typeof footprint === 'number' ? footprint : (footprint?.width || 1)));
  const height = Math.max(1, Math.floor(typeof footprint === 'number' ? footprint : (footprint?.height || 1)));

  const minDx = -Math.floor(width / 2);
  const minDy = -Math.floor(height / 2);

  const tiles = [];
  for (let dy = 0; dy < height; dy++) {
    for (let dx = 0; dx < width; dx++) {
      tiles.push({ x: ax + minDx + dx, y: ay + minDy + dy });
    }
  }
  return tiles;
}

/**
 * GridPathfinder - A* pathfinder for VTT grid navigation around walls
 * Supports D&D 5/10/5 diagonal movement rules and elevation steps
 * (|delta| <= 1 free, larger deltas only via ramp/stairs tiles).
 * Supports multi-tile footprints (square) and dynamic occupied tiles (square + hex).
 */

/**
 * Calculate path between two grid coordinates avoiding walls, elevation obstacles, and occupied tiles.
 *
 * Footprint and Anchoring Semantics:
 * - Square grid:
 *   - Anchoring: Footprint is centered on the anchor tile for odd sizes (e.g. 1x1, 3x3)
 *     and biased up-left for even sizes (e.g. 2x2 spans dx in [-1, 0], dy in [-1, 0]).
 *   - Movement validity: A move is allowed only if EVERY destination footprint tile is passable
 *     and EVERY crossed wall edge between source and destination footprint cells is non-blocking.
 *   - Elevation rule: Checked per corresponding cell via canStepElevation; additionally, adjacent
 *     cells within the destination footprint must not straddle a cliff (|deltaLevel| <= 1 or ramp).
 * - Hex grid:
 *   - Occupancy = anchor hex by default; multi-hex footprints are approximated by the anchor hex
 *     for walls and elevation. Dynamic multi-hex obstacles are supported via occupiedTiles.
 * - Dynamic obstacles (occupiedTiles):
 *   - If occupiedTiles is provided and !ignoreOccupied, any step whose destination footprint
 *     intersects occupiedTiles is blocked.
 *
 * @param {number} startX - Start grid x (or axial q)
 * @param {number} startY - Start grid y (or axial r)
 * @param {number} endX - End grid x (or axial q)
 * @param {number} endY - End grid y (or axial r)
 * @param {Object} wallData - Wall data from level editor store
 * @param {Object} windowOverlays - Optional window overlays
 * @param {Object} options - Options object:
 *   - allowDiagonals: boolean (default true)
 *   - maxSearchDistance: number (default 60)
 *   - feetPerTile: number (default 5)
 *   - diagonalRule: '5105'|'straight' (default '5105')
 *   - elevationData: Object|null (elevation map)
 *   - rampData: Object|null (ramp definitions)
 *   - ignoreElevation: boolean (default false)
 *   - gridType: 'square'|'hex' (default 'square')
 *   - tokenSize: number (default 1)
 *   - footprint: { width: number, height: number }|null
 *   - occupiedTiles: Set<string>|null (set of "x,y" or "q,r" strings)
 *   - ignoreOccupied: boolean (default false)
 * @returns {{ path: Array<{x: number, y: number}>, totalFeet: number, isDirect: boolean, blocked?: boolean, blockedReason?: string|null }}
 */
export function findGridPath(startX, startY, endX, endY, wallData = {}, windowOverlays = {}, options = {}) {
  const {
    allowDiagonals = true,
    maxSearchDistance = 60,
    feetPerTile = 5,
    diagonalRule = '5105',
    elevationData = null,
    rampData = null,
    ignoreElevation = false,
    gridType = 'square',
    tokenSize = 1,
    footprint = null,
    occupiedTiles = null,
    ignoreOccupied = false
  } = options;
  const isHex = gridType === 'hex';

  startX = Math.floor(startX);
  startY = Math.floor(startY);
  endX = Math.floor(endX);
  endY = Math.floor(endY);

  if (startX === endX && startY === endY) {
    return {
      path: [{ x: startX, y: startY }],
      totalFeet: 0,
      isDirect: true,
      blockedReason: null
    };
  }

  const fpWidth = typeof footprint === 'object' && footprint !== null
    ? (footprint.width || tokenSize || 1)
    : (tokenSize || 1);
  const fpHeight = typeof footprint === 'object' && footprint !== null
    ? (footprint.height || tokenSize || 1)
    : (tokenSize || 1);

  const normFootprint = {
    width: Math.max(1, Math.floor(fpWidth)),
    height: Math.max(1, Math.floor(fpHeight))
  };
  const isMultiTile = !isHex && (normFootprint.width > 1 || normFootprint.height > 1);
  const hasOccupied = !ignoreOccupied && occupiedTiles && occupiedTiles.size > 0;

  const hasWalls = wallData && Object.keys(wallData).length > 0;
  const elevationActive = !ignoreElevation && elevationData && Object.keys(elevationData).length > 0;

  if (!hasWalls && !elevationActive && !isMultiTile && !hasOccupied) {
    const dist = isHex
      ? hexGridDistance(startX, startY, endX, endY) * feetPerTile
      : calculateStepDistance(startX, startY, endX, endY, feetPerTile, diagonalRule);
    return {
      path: [{ x: startX, y: startY }, { x: endX, y: endY }],
      totalFeet: dist,
      isDirect: true,
      blockedReason: null
    };
  }

  const startKey = `${startX},${startY}`;
  const endKey = `${endX},${endY}`;

  const openSet = new Set([startKey]);
  const cameFrom = new Map();
  const gScore = new Map([[startKey, 0]]);
  const fScore = new Map([[startKey, 0]]);
  const keyToPos = new Map([[startKey, { x: startX, y: startY }]]);

  const OFFSET_ORTHOGONAL = [
    [1, 0], [-1, 0], [0, 1], [0, -1]
  ];
  const OFFSET_DIAGONAL = [
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  const DIRS = isHex
    ? HEX_DIRECTIONS
    : (allowDiagonals ? [...OFFSET_ORTHOGONAL, ...OFFSET_DIAGONAL] : OFFSET_ORTHOGONAL);
  const heuristic = (fromX, fromY) => (isHex
    ? hexGridDistance(fromX, fromY, endX, endY)
    : Math.hypot(endX - fromX, endY - fromY));
  fScore.set(startKey, heuristic(startX, startY));

  let iterations = 0;
  const maxIterations = isHex ? 3000 : 2000;

  while (openSet.size > 0 && iterations++ < maxIterations) {
    let currentKey = null;
    let lowestF = Infinity;

    for (const k of openSet) {
      const f = fScore.get(k) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        currentKey = k;
      }
    }

    if (currentKey === endKey) {
      const path = [];
      let curr = currentKey;
      while (curr) {
        path.unshift(keyToPos.get(curr));
        curr = cameFrom.get(curr);
      }

      const totalFeet = isHex
        ? (path.length - 1) * feetPerTile
        : calculatePathDistance(path, feetPerTile, diagonalRule);
      return {
        path,
        totalFeet,
        isDirect: path.length === 2,
        blockedReason: null
      };
    }

    openSet.delete(currentKey);
    const currentPos = keyToPos.get(currentKey);

    const withinRange = isHex
      ? hexGridDistance(currentPos.x, currentPos.y, startX, startY) <= maxSearchDistance
      : Math.abs(currentPos.x - startX) <= maxSearchDistance &&
        Math.abs(currentPos.y - startY) <= maxSearchDistance;
    if (!withinRange) {
      continue;
    }

    for (const [dx, dy] of DIRS) {
      const nx = currentPos.x + dx;
      const ny = currentPos.y + dy;
      const isDiag = !isHex && dx !== 0 && dy !== 0;

      if (isHex) {
        if (hasOccupied && occupiedTiles.has(`${nx},${ny}`)) {
          continue;
        }

        const blockedStep = isHexWallBlocking(currentPos.x, currentPos.y, nx, ny, wallData);
        if (blockedStep) {
          continue;
        }

        if (elevationActive) {
          const elevationStep = canStepElevation({
            elevationData,
            rampData,
            from: currentPos,
            to: { x: nx, y: ny }
          });
          if (!elevationStep.allowed) continue;
        }
      } else if (!isMultiTile) {
        if (hasOccupied && occupiedTiles.has(`${nx},${ny}`)) {
          continue;
        }

        const blockedStep = isWallBlockingMovement(currentPos.x, currentPos.y, nx, ny, wallData);
        if (blockedStep) {
          continue;
        }

        if (isDiag) {
          const wall1 = isWallBlockingMovement(currentPos.x, currentPos.y, currentPos.x + dx, currentPos.y, wallData);
          const wall2 = isWallBlockingMovement(currentPos.x, currentPos.y, currentPos.x, currentPos.y + dy, wallData);
          if (wall1 && wall2) continue;
        }

        if (elevationActive) {
          const elevationStep = canStepElevation({
            elevationData,
            rampData,
            from: currentPos,
            to: { x: nx, y: ny }
          });
          if (!elevationStep.allowed) continue;
        }
      } else {
        // Multi-tile square footprint
        const srcTiles = getFootprintTiles(currentPos.x, currentPos.y, normFootprint);
        const dstTiles = getFootprintTiles(nx, ny, normFootprint);

        // 1. Dynamic obstacles check (occupiedTiles)
        if (hasOccupied) {
          let occupied = false;
          for (let i = 0; i < dstTiles.length; i++) {
            if (occupiedTiles.has(`${dstTiles[i].x},${dstTiles[i].y}`)) {
              occupied = true;
              break;
            }
          }
          if (occupied) continue;
        }

        // 2. Wall checks: every footprint cell step must be non-blocking
        let wallBlocked = false;
        for (let i = 0; i < srcTiles.length; i++) {
          const s = srcTiles[i];
          const d = dstTiles[i];
          if (isWallBlockingMovement(s.x, s.y, d.x, d.y, wallData)) {
            wallBlocked = true;
            break;
          }
          if (isDiag) {
            const wall1 = isWallBlockingMovement(s.x, s.y, s.x + dx, s.y, wallData);
            const wall2 = isWallBlockingMovement(s.x, s.y, s.x, s.y + dy, wallData);
            if (wall1 && wall2) {
              wallBlocked = true;
              break;
            }
          }
        }
        if (wallBlocked) continue;

        // 3. Elevation checks:
        // (a) Per-corresponding-cell step check
        // (b) Destination footprint internal elevation check (straddling cliff without ramp)
        if (elevationActive) {
          let elevationBlocked = false;
          for (let i = 0; i < srcTiles.length; i++) {
            const elevationStep = canStepElevation({
              elevationData,
              rampData,
              from: srcTiles[i],
              to: dstTiles[i]
            });
            if (!elevationStep.allowed) {
              elevationBlocked = true;
              break;
            }
          }
          if (elevationBlocked) continue;

          // Check adjacent tiles within dstTiles
          for (let fpy = 0; fpy < normFootprint.height; fpy++) {
            for (let fpx = 0; fpx < normFootprint.width; fpx++) {
              const idx = fpy * normFootprint.width + fpx;
              const c1 = dstTiles[idx];
              if (fpx + 1 < normFootprint.width) {
                const c2 = dstTiles[idx + 1];
                const elev1 = getTileElevation(elevationData, c1.x, c1.y);
                const elev2 = getTileElevation(elevationData, c2.x, c2.y);
                if (Math.abs(elev2 - elev1) > 1 && !rampAllowsStep(rampData, c1, c2)) {
                  elevationBlocked = true;
                  break;
                }
              }
              if (fpy + 1 < normFootprint.height) {
                const c2 = dstTiles[(fpy + 1) * normFootprint.width + fpx];
                const elev1 = getTileElevation(elevationData, c1.x, c1.y);
                const elev2 = getTileElevation(elevationData, c2.x, c2.y);
                if (Math.abs(elev2 - elev1) > 1 && !rampAllowsStep(rampData, c1, c2)) {
                  elevationBlocked = true;
                  break;
                }
              }
            }
            if (elevationBlocked) break;
          }
          if (elevationBlocked) continue;
        }
      }


      const nKey = `${nx},${ny}`;
      keyToPos.set(nKey, { x: nx, y: ny });

      const stepCost = isDiag ? 1.414 : 1;
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + stepCost;

      if (tentativeG < (gScore.get(nKey) ?? Infinity)) {
        cameFrom.set(nKey, currentKey);
        gScore.set(nKey, tentativeG);
        fScore.set(nKey, tentativeG + heuristic(nx, ny));
        openSet.add(nKey);
      }
    }
  }

  const fallbackDist = isHex
    ? hexGridDistance(startX, startY, endX, endY) * feetPerTile
    : calculateStepDistance(startX, startY, endX, endY, feetPerTile, diagonalRule);
  return {
    path: [{ x: startX, y: startY }, { x: endX, y: endY }],
    totalFeet: fallbackDist,
    isDirect: false,
    blocked: true,
    blockedReason: 'no_path'
  };
}

/**
 * Calculates distance of a path adhering to D&D 5/10/5 diagonal movement rules
 */
export function calculatePathDistance(path, feetPerTile = 5, diagonalRule = '5105') {
  if (!path || path.length < 2) return 0;

  if (diagonalRule === '5105') {
    let diagonalCount = 0;
    let feet = 0;

    for (let i = 0; i < path.length - 1; i++) {
      const p1 = path[i];
      const p2 = path[i + 1];
      const dx = Math.abs(p2.x - p1.x);
      const dy = Math.abs(p2.y - p1.y);

      if (dx === 1 && dy === 1) {
        diagonalCount++;
        feet += (diagonalCount % 2 === 0) ? (feetPerTile * 2) : feetPerTile;
      } else {
        feet += Math.max(dx, dy) * feetPerTile;
      }
    }
    return feet;
  }

  let totalDist = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const p1 = path[i];
    const p2 = path[i + 1];
    totalDist += Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }
  return Math.round(totalDist * feetPerTile);
}

function calculateStepDistance(x1, y1, x2, y2, feetPerTile = 5, diagonalRule = '5105') {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  if (diagonalRule === '5105') {
    const diags = Math.min(dx, dy);
    const straights = Math.max(dx, dy) - diags;
    const diagFeet = Math.floor(diags / 2) * (feetPerTile * 3) + (diags % 2) * feetPerTile;
    return (straights * feetPerTile) + diagFeet;
  }
  return Math.hypot(dx, dy) * feetPerTile;
}
