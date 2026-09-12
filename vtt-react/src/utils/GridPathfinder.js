import { isWallBlocking } from './VisibilityCalculations';
import { canStepElevation } from './ElevationUtils';

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
 * GridPathfinder - A* pathfinder for VTT grid navigation around walls
 * Supports D&D 5/10/5 diagonal movement rules and elevation steps
 * (|delta| <= 1 free, larger deltas only via ramp/stairs tiles).
 */

/**
 * Calculate path between two grid coordinates avoiding walls
 * @param {number} startX - Start grid x
 * @param {number} startY - Start grid y
 * @param {number} endX - End grid x
 * @param {number} endY - End grid y
 * @param {Object} wallData - Wall data from level editor store
 * @param {Object} windowOverlays - Optional window overlays
 * @param {Object} options - { allowDiagonals: true, maxSearchDistance: 50, feetPerTile: 5, diagonalRule: '5105',
 *                             elevationData, rampData, ignoreElevation }
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
    gridType = 'square'
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

  const hasWalls = wallData && Object.keys(wallData).length > 0;
  const elevationActive = !ignoreElevation && elevationData && Object.keys(elevationData).length > 0;

  if (!hasWalls && !elevationActive) {
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

      const blockedStep = isHex
        ? isHexWallBlocking(currentPos.x, currentPos.y, nx, ny, wallData)
        : isWallBlocking(currentPos.x, currentPos.y, nx, ny, wallData, windowOverlays);
      if (blockedStep) {
        continue;
      }

      if (isDiag) {
        const wall1 = isWallBlocking(currentPos.x, currentPos.y, currentPos.x + dx, currentPos.y, wallData, windowOverlays);
        const wall2 = isWallBlocking(currentPos.x, currentPos.y, currentPos.x, currentPos.y + dy, wallData, windowOverlays);
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
