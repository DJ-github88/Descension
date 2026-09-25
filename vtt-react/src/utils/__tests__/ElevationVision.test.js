import {
  filterVisibleTilesByElevation,
  collectPolygonTiles,
  collectVisibleTerrainPrisms,
  getEyeHeightFeet
} from '../ElevationUtils';
import { isPointInPolygon } from '../VisibilityCalculations';

const fakeGridSystem = {
  worldToGrid: (x, y) => ({ x: Math.floor(x / 50), y: Math.floor(y / 50) }),
  gridToWorld: (x, y) => ({ x: x * 50 + 25, y: y * 50 + 25 })
};

const squarePolygon = (size = 150) => [
  { x: 0, y: 0 },
  { x: size, y: 0 },
  { x: size, y: size },
  { x: 0, y: size }
];

describe('collectPolygonTiles', () => {
  it('returns every tile whose centre falls inside the polygon', () => {
    const keys = collectPolygonTiles({
      visibilityPolygon: squarePolygon(150),
      gridSystem: fakeGridSystem,
      isPointInPolygon
    });
    // 3x3 tiles whose centres (25..125) are inside the 150x150 square.
    expect(keys.sort()).toEqual(['0,0', '0,1', '0,2', '1,0', '1,1', '1,2', '2,0', '2,1', '2,2']);
  });

  it('returns nothing without a valid polygon', () => {
    expect(collectPolygonTiles({
      visibilityPolygon: [],
      gridSystem: fakeGridSystem,
      isPointInPolygon
    })).toEqual([]);
  });
});

describe('collectVisibleTerrainPrisms', () => {
  it('collects only elevated tiles inside the polygon', () => {
    const prisms = collectVisibleTerrainPrisms({
      elevationData: { '1,1': 2, '4,4': 1, '2,2': -1 },
      visibilityPolygon: squarePolygon(150),
      gridSystem: fakeGridSystem,
      isPointInPolygon
    });
    expect(prisms).toEqual([{ gx: 1, gy: 1, level: 2 }]);
  });

  it('ignores pits and flat tiles', () => {
    const prisms = collectVisibleTerrainPrisms({
      elevationData: { '1,1': -1, '2,2': 1 },
      visibilityPolygon: squarePolygon(150),
      gridSystem: fakeGridSystem,
      isPointInPolygon
    });
    expect(prisms).toEqual([{ gx: 2, gy: 2, level: 1 }]);
  });
});

describe('filterVisibleTilesByElevation', () => {
  it('keeps everything on flat terrain', () => {
    const kept = filterVisibleTilesByElevation({
      tileKeys: ['1,0', '2,0', '3,0'],
      fromWorld: { x: 25, y: 25 },
      fromGroundLevel: 0,
      elevationData: {},
      gridSystem: fakeGridSystem
    });
    expect(kept).toEqual(['1,0', '2,0', '3,0']);
  });

  it('hides tiles behind a raised pillar', () => {
    const kept = filterVisibleTilesByElevation({
      tileKeys: ['0,0', '1,0', '2,0'],
      fromWorld: { x: 25, y: 25 },
      fromGroundLevel: 0,
      elevationData: { '1,0': 3 },
      gridSystem: fakeGridSystem
    });
    expect(kept).toContain('0,0');
    expect(kept).not.toContain('2,0');
  });

  it('lets a high vantage see over a low ridge', () => {
    const kept = filterVisibleTilesByElevation({
      tileKeys: ['2,0'],
      fromWorld: { x: 25, y: 25 },
      fromGroundLevel: 2,
      elevationData: { '1,0': 1 },
      gridSystem: fakeGridSystem
    });
    expect(kept).toEqual(['2,0']);
  });

  it('lets a pit viewer be occluded by the pit rim', () => {
    const viewerGround = -2;
    const kept = filterVisibleTilesByElevation({
      tileKeys: ['2,0'],
      fromWorld: { x: 25, y: 25 },
      fromGroundLevel: viewerGround,
      elevationData: { '0,0': -2, '1,0': 0 },
      gridSystem: fakeGridSystem
    });
    // Sanity: eye height of a pit viewer is below ground level
    expect(getEyeHeightFeet(viewerGround, 5)).toBe(-5);
    expect(kept).not.toContain('2,0');
  });
});
