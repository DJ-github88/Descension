import { findGridPath } from '../GridPathfinder';

describe('GridPathfinder elevation support', () => {
  it('routes around a cliff that is too high to step onto', () => {
    const elevationData = { '1,0': 3 };

    const result = findGridPath(0, 0, 2, 0, {}, {}, { elevationData });

    expect(result.blocked).toBeFalsy();
    const keys = result.path.map(p => `${p.x},${p.y}`);
    expect(keys).not.toContain('1,0');
    expect(keys[0]).toBe('0,0');
    expect(keys[keys.length - 1]).toBe('2,0');
  });

  it('finds no path out of a sealed elevated ring (elevation-only, no walls)', () => {
    // Ring of 3-level walls around the tile (1,1)
    const elevationData = {
      '0,0': 3, '1,0': 3, '2,0': 3,
      '0,1': 3, '2,1': 3,
      '0,2': 3, '1,2': 3, '2,2': 3
    };

    const result = findGridPath(1, 1, 4, 1, {}, {}, { elevationData });

    expect(result.blocked).toBe(true);
    expect(result.blockedReason).toBe('no_path');
  });

  it('allows a large step when a ramp connects the tiles', () => {
    const elevationData = { '1,0': 3 };
    const rampData = { '1,0': { dir: 'w' } };

    const withRamp = findGridPath(0, 0, 1, 0, {}, {}, { elevationData, rampData });
    expect(withRamp.blocked).toBeFalsy();
    expect(withRamp.path.map(p => `${p.x},${p.y}`)).toEqual(['0,0', '1,0']);

    const withoutRamp = findGridPath(0, 0, 1, 0, {}, {}, { elevationData });
    expect(withoutRamp.blocked).toBe(true);
  });

  it('ignores elevation when ignoreElevation is set (flight)', () => {
    const elevationData = {
      '0,0': 3, '1,0': 3, '2,0': 3,
      '0,1': 3, '2,1': 3,
      '0,2': 3, '1,2': 3, '2,2': 3
    };

    const result = findGridPath(1, 1, 4, 1, {}, {}, { elevationData, ignoreElevation: true });

    expect(result.blocked).toBeFalsy();
    expect(result.isDirect).toBe(true);
  });

  it('keeps flat paths walkable when elevation data exists elsewhere', () => {
    const elevationData = { '50,50': 4 };

    const result = findGridPath(0, 0, 3, 0, {}, {}, { elevationData });

    expect(result.blocked).toBeFalsy();
    const keys = result.path.map(p => `${p.x},${p.y}`);
    expect(keys[0]).toBe('0,0');
    expect(keys[keys.length - 1]).toBe('3,0');
    expect(result.totalFeet).toBe(15);
  });
});
