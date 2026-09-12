import useLevelEditorStore, { WALL_TYPES } from '../store/levelEditorStore';
import {
  buildWallRenderItem,
  parseWallKey,
  pointInPolygon
} from './WallGeometry';

export function pickWallAtScreenPoint({ screenX, screenY, wallData, gridSystem }) {
  if (!wallData || !gridSystem) return null;
  if (!Number.isFinite(screenX) || !Number.isFinite(screenY)) return null;

  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const { gridType = 'square' } = gridSystem.getGridState();
  const transform = gridSystem.getProjectionTransform(viewportWidth, viewportHeight);

  let elevationData = null;
  try {
    elevationData = useLevelEditorStore.getState().elevationData;
  } catch (error) {
    elevationData = null;
  }

  let bestKey = null;
  let bestDepth = -Infinity;

  for (const [key, wall] of Object.entries(wallData)) {
    if (!wall) continue;
    if (!parseWallKey(key)) continue;

    const typeId = typeof wall === 'string' ? wall : wall.type;
    const typeData = WALL_TYPES[typeId] || WALL_TYPES.stone_wall || {};
    const item = buildWallRenderItem({
      key,
      wall,
      typeData,
      gridSystem,
      gridType,
      transform,
      elevationData
    });
    if (!item) continue;

    const quads = [item.faces.near, item.faces.far, item.faces.top];
    if (item.showEndStart) quads.push(item.faces.endStart);
    if (item.showEndEnd) quads.push(item.faces.endEnd);
    if (item.window) {
      quads.push(
        item.window.breastNear,
        item.window.lintelNear,
        item.window.jambStart,
        item.window.jambEnd
      );
    }
    if (item.door) {
      quads.push(item.door.jambStart, item.door.jambEnd, item.door.lintelNear);
      if (item.door.leaf) quads.push(item.door.leaf.face);
      if (item.door.swing) quads.push(item.door.swing.near);
    }

    const hit = quads.some((quad) => pointInPolygon(screenX, screenY, quad));
    if (hit && item.depth > bestDepth) {
      bestDepth = item.depth;
      bestKey = key;
    }
  }

  return bestKey;
}
