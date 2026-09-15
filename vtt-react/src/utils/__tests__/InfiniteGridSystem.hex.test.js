import useGameStore from '../../store/gameStore';
import { createGridSystem } from '../InfiniteGridSystem';

const gridSystem = createGridSystem(useGameStore);

describe('InfiniteGridSystem.getHexLine', () => {
  beforeEach(() => {
    useGameStore.setState({
      gridType: 'hex',
      gridSize: 50,
      gridOffsetX: 0,
      gridOffsetY: 0
    });
  });

  it('returns a single cell for identical coordinates', () => {
    expect(gridSystem.getHexLine(2, 3, 2, 3)).toEqual([{ q: 2, r: 3 }]);
  });

  it('returns both cells for adjacent neighbours', () => {
    const line = gridSystem.getHexLine(0, 0, 1, 0);
    expect(line.map((cell) => `${cell.q},${cell.r}`)).toEqual(['0,0', '1,0']);
  });

  it('walks straight diagonal lines', () => {
    const line = gridSystem.getHexLine(0, 0, 3, -3);
    expect(line.map((cell) => `${cell.q},${cell.r}`)).toEqual(['0,0', '1,-1', '2,-2', '3,-3']);
  });

  it('always returns adjacent consecutive cells and exact endpoints', () => {
    const line = gridSystem.getHexLine(-2, 1, 3, -2);
    for (let i = 0; i + 1 < line.length; i++) {
      const a = line[i];
      const b = line[i + 1];
      expect(gridSystem.hexDistance(a.q, a.r, b.q, b.r)).toBe(1);
    }
    expect(line[0]).toEqual({ q: -2, r: 1 });
    expect(line[line.length - 1]).toEqual({ q: 3, r: -2 });
  });
});

describe('InfiniteGridSystem hex wall walk', () => {
  const vertexKeys = (edgeKey) => {
    const parsed = gridSystem.parseHexEdgeKey(edgeKey);
    const edge = gridSystem.getHexEdge(parsed.x1, parsed.y1, parsed.x2, parsed.y2);
    return [gridSystem.getHexVertexKey(edge.start), gridSystem.getHexVertexKey(edge.end)];
  };

  const sharesVertex = (a, b) => {
    const va = vertexKeys(a);
    const vb = vertexKeys(b);
    return va.some((key) => vb.includes(key));
  };

  beforeEach(() => {
    useGameStore.setState({
      gridType: 'hex',
      gridSize: 50,
      gridOffsetX: 0,
      gridOffsetY: 0
    });
  });

  it('snaps to the nearest honeycomb vertex', () => {
    const southEast = gridSystem.snapToHexVertex(24, -13.4);
    expect(southEast.key).toBe(gridSystem.getHexVertexKey({ x: 25, y: -14.433756729740644 }));

    const north = gridSystem.snapToHexVertex(-2, -28);
    expect(north.key).toBe(gridSystem.getHexVertexKey({ x: 0, y: -28.867513459481287 }));
  });

  it('walks a connected edge chain with no repeated vertices', () => {
    const start = gridSystem.snapToHexVertex(24, -13.4);
    const walk = gridSystem.walkHexLatticePath(start, 220, -60);
    expect(walk.edges.length).toBeGreaterThan(2);
    for (let i = 0; i + 1 < walk.edges.length; i++) {
      expect(sharesVertex(walk.edges[i], walk.edges[i + 1])).toBe(true);
    }
    const visited = new Set([start.key]);
    let previousKey = start.key;
    for (const edgeKey of walk.edges) {
      const keys = vertexKeys(edgeKey);
      const nextKey = keys[0] === previousKey ? keys[1] : keys[0];
      expect(visited.has(nextKey)).toBe(false);
      visited.add(nextKey);
      previousKey = nextKey;
    }
    expect(previousKey).toBe(walk.endVertex.key);
  });

  it('makes progress toward the cursor and stops instead of doubling back', () => {
    const start = gridSystem.snapToHexVertex(24, -13.4);
    const short = gridSystem.walkHexLatticePath(start, 90, -30);
    const long = gridSystem.walkHexLatticePath(start, 260, -90);
    expect(long.edges.length).toBeGreaterThan(short.edges.length);
    const startDistance = Math.hypot(start.x - 260, start.y + 90);
    const endDistance = Math.hypot(long.endVertex.x - 260, long.endVertex.y + 90);
    expect(endDistance).toBeLessThan(startDistance);
    for (const edgeKey of long.edges) {
      const keys = vertexKeys(edgeKey);
      for (const key of keys) expect(key).toBeTruthy();
    }
  });

  it('exposes numeric vertex key parts for persisting straight walls', () => {
    const vertex = gridSystem.snapToHexVertex(24, -13.4);
    const parts = gridSystem.hexVertexKeyParts(vertex);
    expect(parts).toEqual({ x: 2500, y: -1443 });
    expect(gridSystem.getHexVertexKey(vertex)).toBe(`${parts.x},${parts.y}`);
  });

  it('returns the three cells sharing a honeycomb vertex', () => {
    const vertex = gridSystem.snapToHexVertex(24, -13.4);
    const cells = gridSystem.hexCellsAtVertex(vertex);
    expect(cells).toHaveLength(3);
    const unique = new Set(cells.map((cell) => `${cell.q},${cell.r}`));
    expect(unique.size).toBe(3);

    const radius = 50 / Math.sqrt(3);
    for (const cell of cells) {
      const center = gridSystem.hexToWorld(cell.q, cell.r);
      expect(Math.hypot(center.x - vertex.x, center.y - vertex.y)).toBeCloseTo(radius, 6);
    }
  });
});
