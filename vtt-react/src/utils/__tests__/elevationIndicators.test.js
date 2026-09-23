import {
  RIM_EDGE_SEGMENTS,
  formatElevationBadge,
  getRimEdges,
  shouldBadgeTile
} from '../elevationIndicators';
import { getTileElevation } from '../ElevationUtils';

const levelGetter = (data) => (x, y) => getTileElevation(data, x, y);

describe('elevationIndicators helpers', () => {
  describe('getRimEdges', () => {
    it('returns nothing for flat or isolated tiles', () => {
      expect(getRimEdges(levelGetter({ '0,0': 0 }), 0, 0)).toEqual([]);
      expect(getRimEdges(levelGetter({}), 0, 0)).toEqual([]);
    });

    it('marks drops (lower neighbours) and rises separately', () => {
      const data = {
        '0,0': 2,
        '1,0': 0,   // east: drop
        '0,-1': 3,  // north: rise
        '0,1': 2,   // south: same level
        '-1,0': 2   // west: same level
      };
      const edges = getRimEdges(levelGetter(data), 0, 0);

      const east = edges.find(edge => edge.dir === 'e');
      expect(east).toMatchObject({ level: 2, neighborLevel: 0, lower: true });
      const north = edges.find(edge => edge.dir === 'n');
      expect(north).toMatchObject({ level: 2, neighborLevel: 3, lower: false });
      expect(edges.find(edge => edge.dir === 's')).toBeUndefined();
      expect(edges.find(edge => edge.dir === 'w')).toBeUndefined();
    });

    it('marks every side of an isolated pillar', () => {
      const edges = getRimEdges(levelGetter({ '0,0': -1 }), 0, 0);
      expect(edges).toHaveLength(4);
      expect(edges.every(edge => edge.lower === false)).toBe(true);
    });
  });

  describe('formatElevationBadge', () => {
    it('shows plain signed levels', () => {
      expect(formatElevationBadge(2)).toBe('+2');
      expect(formatElevationBadge(-3)).toBe('-3');
      expect(formatElevationBadge(0)).toBeNull();
      expect(formatElevationBadge(undefined)).toBeNull();
    });
  });

  describe('shouldBadgeTile', () => {
    it('thins a long rim run to one badge every spacing tiles', () => {
      const data = {};
      for (let x = 0; x < 6; x += 1) data[`${x},0`] = 1;
      const flags = [0, 1, 2, 3, 4, 5].map(x => shouldBadgeTile(levelGetter(data), x, 0));
      expect(flags).toEqual([true, false, false, true, false, false]);
    });

    it('badges pit rims but not interiors or ground tiles', () => {
      const pit = {};
      for (let x = 0; x < 3; x += 1) {
        for (let y = 0; y < 3; y += 1) pit[`${x},${y}`] = -1;
      }
      expect(shouldBadgeTile(levelGetter(pit), 0, 0)).toBe(true);   // rim
      expect(shouldBadgeTile(levelGetter(pit), 1, 1)).toBe(false);  // interior
      expect(shouldBadgeTile(levelGetter({}), 0, 0)).toBe(false);
      expect(shouldBadgeTile(levelGetter({ '0,0': 1, '0,-1': 1, '0,1': 1, '1,0': 1, '-1,0': 1 }), 0, 0)).toBe(false);
    });

    it('badges the diagonal corners of a 2x2 plateau', () => {
      // The run-thinning skips the tiles directly east/south of a badged tile,
      // so both diagonal corners keep a marker on a compact plateau.
      const data = { '0,0': 1, '1,0': 1, '0,1': 1, '1,1': 1 };
      const badged = ['0,0', '1,0', '0,1', '1,1'].filter((key) => {
        const [x, y] = key.split(',').map(Number);
        return shouldBadgeTile(levelGetter(data), x, y);
      });
      expect(badged).toEqual(['0,0', '1,1']);
    });
  });

  describe('RIM_EDGE_SEGMENTS', () => {
    it('covers every tile side with unit segments', () => {
      expect(Object.keys(RIM_EDGE_SEGMENTS).sort()).toEqual(['e', 'n', 's', 'w']);
      Object.values(RIM_EDGE_SEGMENTS).forEach(segment => {
        expect(segment).toHaveLength(2);
        segment.flat().forEach(value => {
          expect(value === 0 || value === 1).toBe(true);
        });
      });
    });
  });
});
