import {
  isWorldPointBehindWalls,
  isWorldPointBehindElevatedTerrain,
  isWorldPointOccluded,
  isWorldAreaPartiallyOccluded
} from '../WallOcclusion';
import { getProjectionTransform } from '../ProjectionSystem';

const makeGridSystem = (overrides = {}) => {
  const state = {
    gridSize: 50,
    gridType: 'square',
    gridOffsetX: 0,
    gridOffsetY: 0,
    viewMode: '2.5d',
    viewRotation: 0,
    viewTilt: 30,
    effectiveZoom: 1,
    cameraX: 0,
    cameraY: 0,
    ...overrides
  };

  return {
    getGridState: () => state,
    worldToGrid: (x, y) => ({
      x: Math.floor((x - state.gridOffsetX) / state.gridSize),
      y: Math.floor((y - state.gridOffsetY) / state.gridSize)
    }),
    gridToWorldCorner: (x, y) => ({
      x: x * state.gridSize + state.gridOffsetX,
      y: y * state.gridSize + state.gridOffsetY
    }),
    getProjectionTransform: (width = 0, height = 0) =>
      getProjectionTransform({ ...state, viewportWidth: width, viewportHeight: height }),
    depthKey: (x, y) => {
      const t = getProjectionTransform(state);
      return -((x - t.cameraX) * t.sinYaw) + (y - t.cameraY) * t.cosYaw;
    }
  };
};

describe('WallOcclusion (ray model)', () => {
  it('reports a token behind a wall and not one in front of it', () => {
    const gridSystem = makeGridSystem({ viewRotation: 0, viewTilt: 30 });
    const wallData = { '0,1,1,1': { type: 'stone_wall' } };

    const behind = isWorldPointBehindWalls({
      worldX: 25,
      worldY: 25,
      worldZ: 0,
      wallData,
      elevationData: {},
      gridSystem
    });
    expect(behind).toBe(true);

    const front = isWorldPointBehindWalls({
      worldX: 25,
      worldY: 75,
      worldZ: 0,
      wallData,
      elevationData: {},
      gridSystem
    });
    expect(front).toBe(false);
  });

  it('sees over a wall from a nearly topdown camera', () => {
    const gridSystem = makeGridSystem({ viewRotation: 0, viewTilt: 88.8 });
    const wallData = { '0,1,1,1': { type: 'stone_wall' } };
    const behind = isWorldPointBehindWalls({
      worldX: 25,
      worldY: 25,
      worldZ: 0,
      wallData,
      elevationData: {},
      gridSystem
    });
    expect(behind).toBe(false);
  });

  it('never reports occlusion in 2D topdown mode', () => {
    const gridSystem = makeGridSystem({ viewMode: '2d', viewTilt: 90 });
    const wallData = { '0,1,1,1': { type: 'stone_wall' } };
    expect(isWorldPointBehindWalls({
      worldX: 25,
      worldY: 25,
      worldZ: 0,
      wallData,
      elevationData: {},
      gridSystem
    })).toBe(false);
  });

  it('treats closed doors as occluders, open doors and windows as transparent', () => {
    const gridSystem = makeGridSystem();
    const base = { worldX: 25, worldY: 25, worldZ: 0, elevationData: {}, gridSystem };

    expect(isWorldPointBehindWalls({
      ...base,
      wallData: { '0,1,1,1': { type: 'wooden_door', state: 'closed' } }
    })).toBe(true);

    expect(isWorldPointBehindWalls({
      ...base,
      wallData: { '0,1,1,1': { type: 'wooden_door', state: 'open' } }
    })).toBe(false);

    expect(isWorldPointBehindWalls({
      ...base,
      wallData: { '0,1,1,1': { type: 'glass_window' } }
    })).toBe(false);
  });

  it('detects occlusion at wall corners and not beyond them', () => {
    const gridSystem = makeGridSystem();
    const wallData = {
      '0,0,1,0': { type: 'stone_wall' },
      '1,0,1,1': { type: 'stone_wall' }
    };
    expect(isWorldPointBehindWalls({
      worldX: 50,
      worldY: -20,
      worldZ: 0,
      wallData,
      elevationData: {},
      gridSystem
    })).toBe(true);

    expect(isWorldPointBehindWalls({
      worldX: 100,
      worldY: -20,
      worldZ: 0,
      wallData,
      elevationData: {},
      gridSystem
    })).toBe(false);
  });

  it('detects a token in a pit as occluded by the rim', () => {
    const gridSystem = makeGridSystem();
    const elevationData = { '0,0': -1 };
    expect(isWorldPointBehindElevatedTerrain({
      worldX: 25,
      worldY: 25,
      worldZ: -50,
      elevationData,
      gridSystem
    })).toBe(true);
  });

  it('detects a token behind a raised plateau but not one standing on it', () => {
    const gridSystem = makeGridSystem();
    const elevationData = { '0,1': 2 };

    expect(isWorldPointBehindElevatedTerrain({
      worldX: 25,
      worldY: 25,
      worldZ: 0,
      elevationData,
      gridSystem
    })).toBe(true);

    expect(isWorldPointBehindElevatedTerrain({
      worldX: 25,
      worldY: 75,
      worldZ: 100,
      elevationData,
      gridSystem
    })).toBe(false);
  });

  it('does not flag terrain that is behind the token relative to the camera', () => {
    const gridSystem = makeGridSystem();
    const elevationData = { '0,-1': 2 };
    expect(isWorldPointBehindElevatedTerrain({
      worldX: 25,
      worldY: 25,
      worldZ: 0,
      elevationData,
      gridSystem
    })).toBe(false);
  });

  it('combines walls and terrain in isWorldPointOccluded', () => {
    const gridSystem = makeGridSystem();
    expect(isWorldPointOccluded({
      worldX: 25,
      worldY: 25,
      worldZ: 0,
      wallData: { '0,1,1,1': { type: 'stone_wall' } },
      elevationData: {},
      gridSystem
    })).toBe(true);
  });

  it('flags partial occlusion when only the token edge is hidden', () => {
    const gridSystem = makeGridSystem();
    const wallData = { '0,1,1,1': { type: 'stone_wall' } };
    expect(isWorldAreaPartiallyOccluded({
      worldX: 25,
      worldY: 62,
      worldZ: 0,
      radiusWorld: 20,
      wallData,
      elevationData: {},
      gridSystem,
      samples: 12
    })).toBe(true);

    expect(isWorldAreaPartiallyOccluded({
      worldX: 25,
      worldY: 90,
      worldZ: 0,
      radiusWorld: 20,
      wallData,
      elevationData: {},
      gridSystem,
      samples: 12
    })).toBe(false);
  });
});
