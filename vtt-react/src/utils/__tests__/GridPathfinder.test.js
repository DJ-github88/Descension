import { findGridPath, calculatePathDistance } from '../GridPathfinder';

describe('GridPathfinder & D&D 5/10/5 Distance Rules', () => {
  describe('calculatePathDistance with 5/10/5 diagonal rules', () => {
    test('calculates straight paths at 5ft per tile', () => {
      const straightPath = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 }
      ];
      expect(calculatePathDistance(straightPath, 5, '5105')).toBe(15);
    });

    test('calculates diagonal steps alternating 5ft, 10ft, 5ft, 10ft', () => {
      const diag1 = [
        { x: 0, y: 0 },
        { x: 1, y: 1 } // 1st diag: 5ft
      ];
      expect(calculatePathDistance(diag1, 5, '5105')).toBe(5);

      const diag2 = [
        { x: 0, y: 0 },
        { x: 1, y: 1 }, // 1st diag: 5ft
        { x: 2, y: 2 }  // 2nd diag: 10ft (total 15ft)
      ];
      expect(calculatePathDistance(diag2, 5, '5105')).toBe(15);

      const diag3 = [
        { x: 0, y: 0 },
        { x: 1, y: 1 }, // 5ft
        { x: 2, y: 2 }, // 10ft -> 15
        { x: 3, y: 3 }  // 5ft -> 20
      ];
      expect(calculatePathDistance(diag3, 5, '5105')).toBe(20);

      const diag4 = [
        { x: 0, y: 0 },
        { x: 1, y: 1 }, // 5ft
        { x: 2, y: 2 }, // 10ft -> 15
        { x: 3, y: 3 }, // 5ft -> 20
        { x: 4, y: 4 }  // 10ft -> 30
      ];
      expect(calculatePathDistance(diag4, 5, '5105')).toBe(30);
    });
  });

  describe('findGridPath with walls', () => {
    test('finds direct path when no walls exist', () => {
      const result = findGridPath(0, 0, 3, 0, {});
      expect(result.isDirect).toBe(true);
      expect(result.totalFeet).toBe(15);
      expect(result.path.length).toBe(2);
      expect(result.path[0]).toEqual({ x: 0, y: 0 });
      expect(result.path[1]).toEqual({ x: 3, y: 0 });
    });

    test('routes around a closed wall', () => {
      // Direct path from (0, 0) to (2, 0) would cross between x=0 and x=1 or x=1 and x=2
      // Place a vertical wall at x=1 between y=-1 and y=1
      const wallData = {
        '1,-1,1,1': { type: 'stone_wall', state: 'closed' }
      };

      const result = findGridPath(0, 0, 2, 0, wallData);
      expect(result.blocked).toBeFalsy();
      expect(result.path.length).toBeGreaterThan(2);

      // Verify the path does not step directly across the wall at (0,0) -> (1,0) or (1,0) -> (2,0)
      for (let i = 0; i < result.path.length - 1; i++) {
        const p1 = result.path[i];
        const p2 = result.path[i + 1];
        const crossesWallDirectly = (p1.x === 0 && p1.y === 0 && p2.x === 1 && p2.y === 0) ||
                                   (p1.x === 1 && p1.y === 0 && p2.x === 2 && p2.y === 0);
        expect(crossesWallDirectly).toBe(false);
      }
    });

    test('passes through open door without detouring', () => {
      const wallData = {
        '1,-1,1,1': { type: 'wooden_door', state: 'open' }
      };

      const result = findGridPath(0, 0, 2, 0, wallData);
      expect(result.blocked).toBeFalsy();
      expect(result.path[result.path.length - 1]).toEqual({ x: 2, y: 0 });
    });

    test('windows block movement even though they allow vision', () => {
      const wallData = {
        '1,-1,1,1': { type: 'glass_window' }
      };

      const result = findGridPath(0, 0, 2, 0, wallData);
      expect(result.blocked).toBeFalsy();
      const blockedEdges = new Set(['0,-1>1,-1', '1,-1>0,-1', '0,0>1,0', '1,0>0,0']);
      const crossesWindow = result.path.some((p, i) => {
        const next = result.path[i + 1];
        return next ? blockedEdges.has(`${p.x},${p.y}>${next.x},${next.y}`) : false;
      });
      expect(crossesWindow).toBe(false);
      expect(result.path.length).toBeGreaterThan(2);
    });

    test('open windows allow movement through the frame', () => {
      const wallData = {
        '1,-1,1,1': { type: 'open_window' }
      };

      const result = findGridPath(0, 0, 2, 0, wallData);
      expect(result.blocked).toBeFalsy();
      expect(result.path[result.path.length - 1]).toEqual({ x: 2, y: 0 });
    });

    test('magical barriers block movement but not vision', () => {
      const wallData = {
        '1,-1,1,1': { type: 'magical_barrier' }
      };

      const result = findGridPath(0, 0, 2, 0, wallData);
      expect(result.blocked).toBeFalsy();
      expect(result.path.length).toBeGreaterThan(2);
    });

    test('flags path as blocked when completely enclosed', () => {
      const wallData = {
        '4,4,6,4': { type: 'stone_wall', state: 'closed' },
        '6,4,6,6': { type: 'stone_wall', state: 'closed' },
        '4,6,6,6': { type: 'stone_wall', state: 'closed' },
        '4,4,4,6': { type: 'stone_wall', state: 'closed' }
      };

      const result = findGridPath(5, 5, 10, 10, wallData, {}, { maxSearchDistance: 4 });
      expect(result.blocked).toBe(true);
    });
  });
});
