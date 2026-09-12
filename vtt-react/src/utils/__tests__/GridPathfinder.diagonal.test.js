import { findGridPath } from '../GridPathfinder';

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

  it('handles multi-tile angled walls', () => {
    const wallData = { '0,0,2,2': { type: 'stone_wall', state: 'closed' } };

    const result = findGridPath(0, 0, 2, 2, wallData, {});

    expect(result.blocked).toBeFalsy();
    const keys = result.path.map(p => `${p.x},${p.y}`);
    expect(keys).not.toEqual(['0,0', '2,2']);
  });
});
