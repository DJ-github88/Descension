import { findGridPath, hexGridDistance } from '../GridPathfinder';

describe('GridPathfinder hex grids', () => {
  it('computes axial hex distance', () => {
    expect(hexGridDistance(0, 0, 3, 0)).toBe(3);
    expect(hexGridDistance(0, 0, 0, 2)).toBe(2);
    expect(hexGridDistance(0, 0, 2, -2)).toBe(2);
    expect(hexGridDistance(1, 1, 3, 0)).toBe(2);
  });

  it('finds a direct path across open hexes', () => {
    const result = findGridPath(0, 0, 3, 0, {}, {}, { gridType: 'hex' });

    expect(result.blocked).toBeFalsy();
    expect(result.totalFeet).toBe(15);
    expect(result.path[0]).toEqual({ x: 0, y: 0 });
    expect(result.path[result.path.length - 1]).toEqual({ x: 3, y: 0 });
  });

  it('routes around a blocked hex edge', () => {
    const wallData = { '0,0,1,0': { type: 'stone_wall', state: 'closed' } };

    const result = findGridPath(0, 0, 1, 0, wallData, {}, { gridType: 'hex' });

    expect(result.blocked).toBeFalsy();
    const keys = result.path.map(p => `${p.x},${p.y}`);
    expect(keys).not.toEqual(['0,0', '1,0']);
    expect(keys[0]).toBe('0,0');
    expect(keys[keys.length - 1]).toBe('1,0');
    expect(result.totalFeet).toBe(10);
  });

  it('accepts hex wall keys in either endpoint order', () => {
    const wallData = { '1,0,0,0': { type: 'stone_wall', state: 'closed' } };

    const result = findGridPath(0, 0, 1, 0, wallData, {}, { gridType: 'hex' });

    expect(result.blocked).toBeFalsy();
    expect(result.path.map(p => `${p.x},${p.y}`)).not.toEqual(['0,0', '1,0']);
  });

  it('passes through an open door edge without detouring', () => {
    const wallData = { '0,0,1,0': { type: 'wooden_door', state: 'open' } };

    const result = findGridPath(0, 0, 1, 0, wallData, {}, { gridType: 'hex' });

    expect(result.blocked).toBeFalsy();
    expect(result.path.map(p => `${p.x},${p.y}`)).toEqual(['0,0', '1,0']);
  });

  it('blocks a sealed hex enclave', () => {
    const wallData = {};
    for (const [dq, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]]) {
      wallData[`0,0,${dq},${dr}`] = { type: 'stone_wall', state: 'closed' };
    }

    const result = findGridPath(0, 0, 2, 0, wallData, {}, { gridType: 'hex' });

    expect(result.blocked).toBe(true);
    expect(result.blockedReason).toBe('no_path');
  });

  it('applies elevation step rules on hexes', () => {
    const elevationData = { '1,0': 3 };

    // A 3-level pillar is unreachable from every neighbor without a ramp
    const blockedStep = findGridPath(0, 0, 1, 0, {}, {}, { gridType: 'hex', elevationData });
    expect(blockedStep.blocked).toBe(true);
    expect(blockedStep.blockedReason).toBe('no_path');

    const rampData = { '1,0': { dir: 'w' } };
    const rampStep = findGridPath(0, 0, 1, 0, {}, {}, { gridType: 'hex', elevationData, rampData });
    expect(rampStep.path.map(p => `${p.x},${p.y}`)).toEqual(['0,0', '1,0']);
  });
});
