import { findGridPath } from '../GridPathfinder';
import { isWallBlocking, isWallBlockingMovement } from '../VisibilityCalculations';

describe('GridPathfinder angled (diagonal) walls', () => {
  it('blocks a diagonal step through a 45° wall but routes around it', () => {
    const wallData = { '0,0,1,1': { type: 'stone_wall', state: 'closed' } };

    const result = findGridPath(0, 0, 1, 1, wallData, {});

    expect(result.blocked).toBeFalsy();
    const keys = result.path.map(p => `${p.x},${p.y}`);
    expect(keys).not.toEqual(['0,0', '1,1']);
    expect(keys[0]).toBe('0,0');
    expect(keys[keys.length - 1]).toBe('1,1');
  });

  it('routes through the open end of an angled wall chain instead of crossing it', () => {
    const wallData = {
      '0,0,1,1': { type: 'stone_wall', state: 'closed' },
      '1,1,2,2': { type: 'stone_wall', state: 'closed' },
      '2,2,3,3': { type: 'stone_wall', state: 'closed' }
    };

    const result = findGridPath(0, 0, 3, 3, wallData, {});

    expect(result.blocked).toBeFalsy();

    const blockedPairs = new Set(['0,0->1,1', '1,1->2,2', '2,2->3,3', '1,1->0,0', '2,2->1,1', '3,3->2,2']);
    for (let i = 0; i < result.path.length - 1; i++) {
      const step = `${result.path[i].x},${result.path[i].y}->${result.path[i + 1].x},${result.path[i + 1].y}`;
      expect(blockedPairs.has(step)).toBe(false);
    }
  });

  it('treats an open diagonal door as passable', () => {
    const wallData = { '0,0,1,1': { type: 'wooden_door', state: 'open' } };

    const result = findGridPath(0, 0, 1, 1, wallData, {});

    expect(result.blocked).toBeFalsy();
    expect(result.path.map(p => `${p.x},${p.y}`)).toEqual(['0,0', '1,1']);
  });

  it('blocks entering a cell bisected by an angled wall (orthogonal walk-through)', () => {
    // Wall bisects cell (1,1); a token must not pass (0,1) -> (1,1) -> (1,2)
    const wallData = { '1,1,2,2': { type: 'stone_wall', state: 'closed' } };

    const result = findGridPath(0, 1, 1, 2, wallData, {});

    expect(result.blocked).toBeFalsy();
    const keys = result.path.map(p => `${p.x},${p.y}`);
    expect(keys).not.toContain('1,1');
    expect(keys[keys.length - 1]).toBe('1,2');
  });

  it('blocks entering a bisected cell even when the detour is longer than the direct line', () => {
    // Straight through (1,1) would be the shortest path; the wall makes it
    // impassable so the token must route around it.
    const wallData = { '1,1,2,2': { type: 'stone_wall', state: 'closed' } };

    const result = findGridPath(0, 1, 2, 1, wallData, {});

    expect(result.blocked).toBeFalsy();
    const keys = result.path.map(p => `${p.x},${p.y}`);
    expect(keys).not.toContain('1,1');
    expect(keys[0]).toBe('0,1');
    expect(keys[keys.length - 1]).toBe('2,1');
  });

  it('keeps a diagonal wall blocking sight through the bisected cell', () => {
    const wallData = { '1,1,2,2': { type: 'stone_wall', state: 'closed' } };

    expect(isWallBlocking(0, 1, 1, 1, wallData)).toBe(true);
    expect(isWallBlockingMovement(0, 1, 1, 1, wallData)).toBe(true);
  });

  it('handles multi-tile angled walls', () => {
    const wallData = { '0,0,2,2': { type: 'stone_wall', state: 'closed' } };

    const result = findGridPath(0, 0, 2, 2, wallData, {});

    expect(result.blocked).toBeFalsy();
    const keys = result.path.map(p => `${p.x},${p.y}`);
    expect(keys).not.toEqual(['0,0', '2,2']);
  });

  it('blocks movement across non-45° angled walls (2:1 slope)', () => {
    // Wall crosses cells (0,0) and (1,0); the (0,0)->(1,0) step cuts it.
    const wallData = { '0,0,2,1': { type: 'stone_wall', state: 'closed' } };

    expect(isWallBlockingMovement(0, 0, 1, 0, wallData)).toBe(true);
    expect(isWallBlockingMovement(1, 0, 1, 1, wallData)).toBe(true);
    expect(isWallBlockingMovement(1, 0, 0, 1, wallData)).toBe(true);
    expect(isWallBlocking(0, 0, 1, 0, wallData)).toBe(true);

    const result = findGridPath(0, 0, 2, 0, wallData, {});
    expect(result.blocked).toBeFalsy();
    const steps = [];
    for (let i = 0; i < result.path.length - 1; i++) {
      steps.push(`${result.path[i].x},${result.path[i].y}->${result.path[i + 1].x},${result.path[i + 1].y}`);
    }
    expect(steps).not.toContain('0,0->1,0');
    expect(`${result.path[result.path.length - 1].x},${result.path[result.path.length - 1].y}`).toBe('2,0');
  });

  it('does not block a step that only touches a non-45° wall outside it', () => {
    // Wall spans (0,0)-(2,1); the (1,1)->(0,1) step is south of its span.
    const wallData = { '0,0,2,1': { type: 'stone_wall', state: 'closed' } };

    expect(isWallBlockingMovement(1, 1, 0, 1, wallData)).toBe(false);
  });

  it('lets a token standing on an angled wall step off it without being trapped', () => {
    const wallData = { '1,1,2,2': { type: 'stone_wall', state: 'closed' } };

    // The cell center of (1,1) lies on the wall, so every step starts on it;
    // stepping away in any direction must still be allowed.
    expect(isWallBlockingMovement(1, 1, 0, 1, wallData)).toBe(false);
    expect(isWallBlockingMovement(1, 1, 1, 0, wallData)).toBe(false);
    expect(isWallBlockingMovement(1, 1, 2, 1, wallData)).toBe(false);
    expect(isWallBlockingMovement(1, 1, 1, 2, wallData)).toBe(false);
    // Sliding along / across the wall line itself stays blocked.
    expect(isWallBlockingMovement(1, 1, 2, 2, wallData)).toBe(true);
    expect(isWallBlockingMovement(1, 1, 0, 0, wallData)).toBe(true);
  });

  it('treats an open angled door as passable for the movement probe', () => {
    const wallData = { '1,1,2,2': { type: 'wooden_door', state: 'open' } };

    expect(isWallBlockingMovement(0, 1, 1, 1, wallData)).toBe(false);
    expect(isWallBlockingMovement(0, 1, 2, 1, wallData)).toBe(false);
  });
});
