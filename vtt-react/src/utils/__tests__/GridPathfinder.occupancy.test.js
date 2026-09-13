import { findGridPath, getFootprintTiles } from '../GridPathfinder';

describe('GridPathfinder multi-tile occupancy and dynamic obstacles', () => {
  describe('getFootprintTiles', () => {
    it('anchors 1x1 footprint centered on anchor tile', () => {
      const tiles = getFootprintTiles(5, 5, { width: 1, height: 1 });
      expect(tiles).toEqual([{ x: 5, y: 5 }]);
    });

    it('anchors 2x2 footprint biased up-left from anchor tile', () => {
      const tiles = getFootprintTiles(5, 5, { width: 2, height: 2 });
      expect(tiles).toEqual([
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 4, y: 5 },
        { x: 5, y: 5 }
      ]);
    });

    it('anchors 3x3 footprint centered on anchor tile', () => {
      const tiles = getFootprintTiles(5, 5, 3);
      expect(tiles).toHaveLength(9);
      expect(tiles[0]).toEqual({ x: 4, y: 4 });
      expect(tiles[4]).toEqual({ x: 5, y: 5 }); // center is anchor
      expect(tiles[8]).toEqual({ x: 6, y: 6 });
    });
  });

  describe('doorway traversal (1-wide vs 2-wide)', () => {
    // Build an enclosed corridor from x=0 to x=6, y=0 to y=4 with a dividing wall at x=3
    const buildCorridor = (openYList) => {
      const walls = {};
      // Top boundary wall at y=0
      for (let x = 0; x < 6; x++) {
        walls[`${x},0,${x + 1},0`] = 'solid';
      }
      // Bottom boundary wall at y=4
      for (let x = 0; x < 6; x++) {
        walls[`${x},4,${x + 1},4`] = 'solid';
      }
      // Left boundary wall at x=0
      for (let y = 0; y < 4; y++) {
        walls[`0,${y},0,${y + 1}`] = 'solid';
      }
      // Right boundary wall at x=6
      for (let y = 0; y < 4; y++) {
        walls[`6,${y},6,${y + 1}`] = 'solid';
      }
      // Dividing vertical wall at x=3 between y=0 and y=4
      for (let y = 0; y < 4; y++) {
        if (!openYList.includes(y)) {
          walls[`3,${y},3,${y + 1}`] = 'solid';
        }
      }
      return walls;
    };

    it('allows 1x1 to pass a 1-wide doorway but blocks 2x2', () => {
      // 1-wide doorway at y=2 in enclosed corridor
      const wallData = buildCorridor([2]);

      // 1x1 can pass through doorway at y=2 from (2, 2) to (4, 2)
      const res1x1 = findGridPath(2, 2, 4, 2, wallData, {}, { tokenSize: 1 });
      expect(res1x1.blocked).toBeFalsy();
      expect(res1x1.path.map(p => `${p.x},${p.y}`)).toContain('3,2');

      // 2x2 with anchor at (2, 2) has footprint cells at y=1 and y=2.
      // Since y=1 has a solid wall at x=3, the 2x2 cannot fit through the 1-wide opening.
      const res2x2 = findGridPath(2, 2, 4, 2, wallData, {}, { tokenSize: 2 });
      expect(res2x2.blocked).toBe(true);
      expect(res2x2.blockedReason).toBe('no_path');
    });

    it('allows 2x2 to pass a 2-wide opening', () => {
      // 2-wide opening at y=1 and y=2
      const wallData = buildCorridor([1, 2]);

      // 2x2 with anchor at (2, 2) has footprint at y in {1, 2}.
      // When stepping to x=3, both cells cross the open doorway!
      const res2x2 = findGridPath(2, 2, 4, 2, wallData, {}, { tokenSize: 2 });
      expect(res2x2.blocked).toBeFalsy();
      expect(res2x2.path[0]).toEqual({ x: 2, y: 2 });
      expect(res2x2.path[res2x2.path.length - 1]).toEqual({ x: 4, y: 2 });
    });
  });

  describe('wall blocking any footprint tile', () => {
    it('blocks 2x2 move when only one of its footprint tiles hits a wall', () => {
      // Fully enclosed 2-cell corridor: x in [1, 2], y in [0, 2]
      // Left boundary at x=0, right boundary at x=3
      const wallData = {
        // Enclosing walls
        '0,0,0,3': 'solid',
        '3,0,3,3': 'solid',
        '0,0,3,0': 'solid',
        '0,3,3,3': 'solid',
        // Divider at y=1 that only covers x=1 to x=2 (one tile of footprint)
        '1,1,2,1': 'solid'
      };

      // 2x2 anchor at (2, 2) moving to (2, 1) must cross y=1.
      // Cell (1, 1) -> (1, 0) is blocked by the wall at '1,1,2,1'!
      const blockedRes = findGridPath(2, 2, 2, 1, wallData, {}, { tokenSize: 2 });
      expect(blockedRes.blocked).toBe(true);
      expect(blockedRes.blockedReason).toBe('no_path');
    });
  });

  describe('elevation cliff straddling', () => {
    it('blocks 2x2 move into a position that straddles a cliff without a ramp', () => {
      // Tile (2, 2) is a 3-level cliff, surrounding tiles are 0
      const elevationData = {
        '2,2': 3
      };

      // Moving from (0, 0) to (2, 2) with 2x2:
      // Anchor at (2, 2) has tiles (1, 1)[0], (2, 1)[0], (1, 2)[0], and (2, 2)[3].
      // The internal elevation delta between (2, 1) and (2, 2) is 3 > 1 (straddling cliff).
      const result = findGridPath(0, 0, 2, 2, {}, {}, {
        elevationData,
        tokenSize: 2
      });

      expect(result.blocked).toBe(true);
      expect(result.blockedReason).toBe('no_path');
    });

    it('allows 2x2 to move when a ramp connects the cliff', () => {
      // If all destination tiles are level 2 (flat elevated plateau) reachable via a ramp
      const elevationData = {
        '2,1': 2, '3,1': 2,
        '2,2': 2, '3,2': 2
      };
      // Ramps connecting west neighbors
      const rampData = {
        '2,1': { dir: 'w' },
        '2,2': { dir: 'w' }
      };

      const result = findGridPath(1, 2, 3, 2, {}, {}, {
        elevationData,
        rampData,
        tokenSize: 2
      });

      expect(result.blocked).toBeFalsy();
    });
  });

  describe('occupiedTiles dynamic obstacles', () => {
    it('blocks step when destination footprint intersects occupiedTiles', () => {
      const occupiedTiles = new Set(['3,2']);

      const resWithOccupied = findGridPath(2, 2, 4, 2, {}, {}, {
        occupiedTiles,
        maxSearchDistance: 2
      });
      expect(resWithOccupied.path.map(p => `${p.x},${p.y}`)).not.toContain('3,2');

      const wallEnclosed = {
        '0,0,4,0': 'solid',
        '0,3,4,3': 'solid'
      };
      const res2x2 = findGridPath(2, 2, 3, 2, wallEnclosed, {}, {
        tokenSize: 2,
        occupiedTiles,
        maxSearchDistance: 2
      });
      expect(res2x2.blocked).toBe(true);
    });

    it('bypasses occupiedTiles when ignoreOccupied is true', () => {
      const occupiedTiles = new Set(['3,2']);

      const resIgnored = findGridPath(2, 2, 3, 2, {}, {}, {
        tokenSize: 2,
        occupiedTiles,
        ignoreOccupied: true
      });

      expect(resIgnored.blocked).toBeFalsy();
      expect(resIgnored.path[resIgnored.path.length - 1]).toEqual({ x: 3, y: 2 });
    });
  });

  describe('hex grid semantics', () => {
    it('maintains anchor pathfinding behavior on hex grids', () => {
      const result = findGridPath(0, 0, 2, 0, {}, {}, { gridType: 'hex' });
      expect(result.blocked).toBeFalsy();
      expect(result.path).toEqual([
        { x: 0, y: 0 },
        { x: 2, y: 0 }
      ]);
      expect(result.totalFeet).toBe(10);
      expect(result.isDirect).toBe(true);
    });

    it('blocks hex steps that intersect occupiedTiles', () => {
      const occupiedTiles = new Set(['1,0']);

      const resOccupied = findGridPath(0, 0, 2, 0, {}, {}, {
        gridType: 'hex',
        occupiedTiles
      });

      expect(resOccupied.blocked).toBeFalsy();
      // Hex A* routes around (1,0) via (0, 1) or (1, -1)
      const pathKeys = resOccupied.path.map(p => `${p.x},${p.y}`);
      expect(pathKeys).not.toContain('1,0');
    });
  });
});
