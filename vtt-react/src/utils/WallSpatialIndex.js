import RBush from 'rbush';

/**
 * WallSpatialIndex - High-performance 2D R-Tree spatial index for VTT walls
 * Powered by rbush for O(log N) viewport culling and line-of-sight wall lookups.
 */
export class WallSpatialIndex {
  constructor(maxEntries = 9) {
    this.tree = new RBush(maxEntries);
    this.count = 0;
    this.gridSize = 50;
    this.gridOffsetX = 0;
    this.gridOffsetY = 0;
  }

  /**
   * Bulk-loads walls from wallData dictionary into the R-Tree
   * @param {Object} wallData - Map of "x1,y1,x2,y2" -> wall object or type string
   * @param {number} gridSize - Size of a grid tile in pixels
   * @param {number} gridOffsetX - Grid origin X offset
   * @param {number} gridOffsetY - Grid origin Y offset
   */
  load(wallData, gridSize = 50, gridOffsetX = 0, gridOffsetY = 0) {
    this.clear();
    this.gridSize = gridSize;
    this.gridOffsetX = gridOffsetX;
    this.gridOffsetY = gridOffsetY;

    if (!wallData || typeof wallData !== 'object') {
      return this;
    }

    const items = [];
    const entries = Object.entries(wallData);

    for (let i = 0; i < entries.length; i++) {
      const [wallKey, wall] = entries[i];
      if (!wallKey) continue;

      const coords = wallKey.split(',').map(Number);
      if (coords.length < 4 || coords.some(isNaN)) continue;

      const [wx1, wy1, wx2, wy2] = coords;
      const worldX1 = (wx1 * gridSize) + gridOffsetX;
      const worldY1 = (wy1 * gridSize) + gridOffsetY;
      const worldX2 = (wx2 * gridSize) + gridOffsetX;
      const worldY2 = (wy2 * gridSize) + gridOffsetY;

      const minX = Math.min(worldX1, worldX2);
      const maxX = Math.max(worldX1, worldX2);
      const minY = Math.min(worldY1, worldY2);
      const maxY = Math.max(worldY1, worldY2);

      items.push({
        minX,
        minY,
        maxX,
        maxY,
        wallKey,
        wall,
        gridCoords: [wx1, wy1, wx2, wy2],
        worldCoords: [worldX1, worldY1, worldX2, worldY2]
      });
    }

    if (items.length > 0) {
      this.tree.load(items);
      this.count = items.length;
    }

    return this;
  }

  /**
   * Search walls within a world coordinate bounding box
   * @param {number} minX
   * @param {number} minY
   * @param {number} maxX
   * @param {number} maxY
   * @returns {Array<Object>} List of intersecting wall items
   */
  searchBoundingBox(minX, minY, maxX, maxY) {
    if (this.count === 0) return [];
    return this.tree.search({
      minX: Math.min(minX, maxX),
      minY: Math.min(minY, maxY),
      maxX: Math.max(minX, maxX),
      maxY: Math.max(minY, maxY)
    });
  }

  /**
   * Search walls within a given radius around a world point
   * @param {number} originX
   * @param {number} originY
   * @param {number} radius
   * @returns {Array<Object>}
   */
  searchRadius(originX, originY, radius) {
    if (this.count === 0) return [];
    return this.searchBoundingBox(
      originX - radius,
      originY - radius,
      originX + radius,
      originY + radius
    );
  }

  /**
   * Clear all items from the spatial index
   */
  clear() {
    this.tree.clear();
    this.count = 0;
  }
}

// Memory-efficient cache to avoid rebuilding index on every frame/render
let cachedWallDataRef = null;
let cachedGridSize = null;
let cachedOffsetX = null;
let cachedOffsetY = null;
let cachedIndex = null;

/**
 * Get or build a cached WallSpatialIndex for the given wallData
 * If wallData reference and grid settings have not changed, returns the cached instance in O(1)
 */
export function getOrBuildWallSpatialIndex(wallData, gridSize = 50, gridOffsetX = 0, gridOffsetY = 0) {
  if (
    cachedIndex &&
    cachedWallDataRef === wallData &&
    cachedGridSize === gridSize &&
    cachedOffsetX === gridOffsetX &&
    cachedOffsetY === gridOffsetY
  ) {
    return cachedIndex;
  }

  const index = new WallSpatialIndex();
  index.load(wallData, gridSize, gridOffsetX, gridOffsetY);

  cachedWallDataRef = wallData;
  cachedGridSize = gridSize;
  cachedOffsetX = gridOffsetX;
  cachedOffsetY = gridOffsetY;
  cachedIndex = index;

  return index;
}

export default WallSpatialIndex;
