import * as THREE from 'three';
import { ThreeDWallManager, WALL_MODELS, WALL_EXPLORED_DIM } from '../ThreeDWallManager';
import useLevelEditorStore from '../../../../store/levelEditorStore';
import useGameStore from '../../../../store/gameStore';
import { createGridSystem } from '../../../../utils/InfiniteGridSystem';

jest.mock('../../../../services/ModelCacheService', () => {
  const three = require('three');
  return {
    __esModule: true,
    default: {
      createInstance: () => {
        const group = new three.Group();
        const mesh = new three.Mesh(new three.BoxGeometry(4, 4, 1), new three.MeshStandardMaterial());
        group.add(mesh);
        return group;
      },
      loadModel: () => Promise.resolve({}),
      subscribe: () => () => {}
    }
  };
});

const GRID = { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 };

const horizontalRun = (x, y, length, type = 'stone_wall') => {
  const walls = {};
  for (let i = 0; i < length; i += 1) {
    walls[`${x + i},${y},${x + i + 1},${y}`] = { type };
  }
  return walls;
};

const verticalRun = (x, y, length, type = 'stone_wall') => {
  const walls = {};
  for (let i = 0; i < length; i += 1) {
    walls[`${x},${y + i},${x},${y + i + 1}`] = { type };
  }
  return walls;
};

describe('ThreeDWallManager', () => {
  let scene;
  let manager;

  beforeAll(() => {
    createGridSystem(useGameStore);
  });

  beforeEach(() => {
    useGameStore.setState({
      gridSize: 50,
      gridType: 'square',
      gridOffsetX: 0,
      gridOffsetY: 0
    });
    scene = new THREE.Scene();
    manager = new ThreeDWallManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('initializes cleanly and attaches group to scene', () => {
    expect(manager.group).toBeDefined();
    expect(manager.group.name).toBe('ThreeDModularWalls');
    expect(scene.children).toContain(manager.group);
  });

  it('resolves correct model urls for straight, window, cracked, and gated walls', () => {
    expect(manager.resolveWallModelUrl('stone_wall')).toContain('wall_stone_straight.glb');
    expect(manager.resolveWallModelUrl({ type: 'glass_window' })).toContain('wall_window_closed.glb');
    expect(manager.resolveWallModelUrl({ type: 'barred_window' })).toContain('wall_window_gated.glb');
    // Arrow slits must render an opening, not a plain wall segment.
    expect(manager.resolveWallModelUrl({ type: 'arrow_slit' })).toContain('wall_window_gated.glb');
    // The town window uses the host-agnostic kit window so it fits any wall run.
    expect(manager.resolveWallModelUrl({ type: 'town_window' })).toContain('wall_window_closed.glb');
    expect(manager.resolveWallModelUrl({ type: 'cracked_stone' })).toContain('wall_cracked.glb');
    expect(manager.resolveWallModelUrl({ type: 'gated_portcullis' })).toContain('wall_gated.glb');
    expect(manager.resolveWallModelUrl({ type: 'half_wall' })).toContain('wall_stone_straight.glb');
    expect(manager.resolveWallModelUrl({ type: 'wall_arched' })).toContain('wall_arched.glb');
    expect(manager.resolveWallModelUrl({ type: 'wall_broken' })).toContain('wall_broken.glb');
    expect(manager.resolveWallModelUrl({ type: 'wall_shelves' })).toContain('wall_shelves.glb');
    expect(manager.resolveWallModelUrl({ type: 'barrier_wood' })).toContain('barrier_wood.glb');
    // Energy barriers are not palisades: the word "barrier" must not hijack them.
    expect(manager.resolveWallModelUrl({ type: 'magical_barrier' })).toContain('wall_stone_straight.glb');
    expect(manager.resolveWallModelUrl({ type: 'force_wall' })).toContain('wall_stone_straight.glb');
  });

  it('renders one model per grid tile so multi-tile runs are not stretched', () => {
    const walls = { '0,0,3,0': { type: 'stone_wall' } };
    manager.updateWalls(walls, {}, GRID);

    const entry = manager.wallInstances.get('0,0,3,0');
    expect(entry).toBeDefined();
    expect(entry.pieces).toHaveLength(3);
    // Tile centers at 25 / 75 / 125 world units
    expect(entry.pieces.map((p) => p.mesh.position.x)).toEqual([25, 75, 125]);
  });

  it('scales wall height with the 2.5D wall body multiplier (1.8 x grid)', () => {
    const walls = { '0,0,1,0': { type: 'stone_wall' } };
    manager.updateWalls(walls, {}, GRID);

    const entry = manager.wallInstances.get('0,0,1,0');
    const scale = entry.pieces[0].innerModel.scale;
    expect(scale.x).toBeCloseTo(50 / 4);
    expect(scale.y).toBeCloseTo((1.8 * 50) / 4);
    expect(scale.z).toBeCloseTo(50 / 4);
  });

  it('honours per-wall height overrides', () => {
    manager.updateWalls({ '0,0,1,0': { type: 'stone_wall', height: 200 } }, {}, GRID);
    const entry = manager.wallInstances.get('0,0,1,0');
    expect(entry.pieces[0].innerModel.scale.y).toBeCloseTo(200 / 4);
  });

  describe('junction resolution', () => {
    it('does nothing for collinear straight-through joints', () => {
      expect(manager.resolveJunction([{ x: 1, y: 0 }, { x: -1, y: 0 }], false)).toBeNull();
    });

    it('picks the corner piece for perpendicular joints', () => {
      const junction = manager.resolveJunction([{ x: -1, y: 0 }, { x: 0, y: 1 }], false);
      expect(junction.kind).toBe('corner');
      expect(junction.rotation).toBeCloseTo(0);
    });

    it('picks the T-split piece with the stem opposite the through axis', () => {
      const junction = manager.resolveJunction(
        [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 }],
        false
      );
      expect(junction.kind).toBe('tsplit');
      // Stem points north (0,-1) -> rotation atan2(0, -1) = PI
      expect(Math.abs(junction.rotation)).toBeCloseTo(Math.PI);
    });

    it('picks the crossing piece for four-way joints', () => {
      const junction = manager.resolveJunction(
        [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: -1, y: 0 }],
        false
      );
      expect(junction.kind).toBe('crossing');
    });

    it('caps free ends but leaves door-adjacent ends open', () => {
      expect(manager.resolveJunction([{ x: 1, y: 0 }], false).kind).toBe('endcap');
      expect(manager.resolveJunction([{ x: 1, y: 0 }], true)).toBeNull();
    });

    it('skips junctions for diagonal wall ends', () => {
      expect(manager.resolveJunction([{ x: 0, y: 0, diagonal: true }], false)).toBeNull();
    });
  });

  it('places a corner piece where two walls meet at 90 degrees', () => {
    const walls = { ...horizontalRun(-2, 0, 2), ...verticalRun(0, 0, 2) };
    manager.updateWalls(walls, {}, GRID);

    const junction = manager.junctionInstances.get('0,0');
    expect(junction).toBeDefined();
    expect(junction.kind).toBe('corner');
  });

  it('does not place junction pieces along straight collinear runs', () => {
    const walls = horizontalRun(-3, 0, 6);
    manager.updateWalls(walls, {}, GRID);

    // Vertices exist at every tile joint, but collinear joints must stay bare.
    expect(manager.junctionInstances.get('0,0')).toBeUndefined();
    expect(manager.junctionInstances.get('-100,0')).toBeUndefined();
    // Only the two free ends get end caps.
    const kinds = [...manager.junctionInstances.values()].map((e) => e.kind);
    expect(kinds.filter((k) => k === 'endcap')).toHaveLength(2);
  });

  it('keeps wall pieces in place when a run is re-partitioned for a window', () => {
    const worldYPositions = (entry) => entry.pieces.map((p) => -p.mesh.position.y);

    manager.updateWalls({ '0,0,0,4': { type: 'stone_wall' } }, {}, GRID);
    const before = worldYPositions(manager.wallInstances.get('0,0,0,4')).sort((a, b) => a - b);

    manager.updateWalls(
      {
        '0,0,0,2': { type: 'stone_wall' },
        '0,2,0,3': { type: 'glass_window' },
        '0,3,0,4': { type: 'stone_wall' }
      },
      {},
      GRID
    );
    const stubA = worldYPositions(manager.wallInstances.get('0,0,0,2'));
    const stubB = worldYPositions(manager.wallInstances.get('0,3,0,4'));
    const feature = worldYPositions(manager.wallInstances.get('0,2,0,3'));

    // The same four tile-centered positions must be occupied before/after; only
    // the feature tile swaps its model.
    expect([...stubA, ...stubB, ...feature].sort((a, b) => a - b)).toEqual(before);
  });

  it('skips door walls (handled by the prop manager) but keeps their junctions open', () => {
    const walls = { ...horizontalRun(-1, 0, 3) };
    delete walls['0,0,1,0'];
    walls['0,0,1,0'] = { type: 'wooden_door', state: 'closed' };
    manager.updateWalls(walls, {}, GRID);

    expect(manager.wallInstances.has('0,0,1,0')).toBe(false);
    // No end caps poke into the doorway from its neighbours.
    expect(manager.junctionInstances.has('0,0')).toBe(false);
    expect(manager.junctionInstances.has('50,0')).toBe(false);
    // Free ends away from the door still get capped.
    const endcaps = [...manager.junctionInstances.entries()]
      .filter(([, e]) => e.kind === 'endcap')
      .map(([k]) => k);
    expect(endcaps.sort()).toEqual(['-50,0', '100,0']);
  });

  it('removes deleted walls and junctions when wallData empties', () => {
    const walls = { ...horizontalRun(0, 0, 2), ...verticalRun(2, 0, 2) };
    manager.updateWalls(walls, {}, GRID);
    expect(manager.wallInstances.size).toBe(4);
    expect(manager.junctionInstances.size).toBeGreaterThan(0);

    manager.updateWalls({}, {}, GRID);
    expect(manager.wallInstances.size).toBe(0);
    expect(manager.junctionInstances.size).toBe(0);
  });

  it('dims explored walls by tint but keeps solid masonry opaque', () => {
    const wallData = { '0,0,1,0': { type: 'stone_wall' } };
    const fogState = {
      fogOfWarEnabled: true,
      isEditorMode: false,
      isGMMode: false,
      viewingFromToken: true,
      isPlayerPositionExplored: () => true,
      visibleAreaSet: new Set() // Explored but not in active vision
    };

    manager.updateWalls(wallData, {}, GRID, fogState);
    const wall = manager.wallInstances.get('0,0,1,0');
    expect(wall).toBeDefined();
    expect(wall.pieces[0].mesh.visible).toBe(true);

    let matOpacity = 0;
    let castsShadow = true;
    let dimColor = null;
    let baseColor = null;
    wall.pieces[0].innerModel.traverse(child => {
      if (child.isMesh) {
        castsShadow = child.castShadow;
        matOpacity = child.material.opacity;
        baseColor = child.material.userData.baseColor;
        dimColor = child.material.color.clone();
      }
    });

    expect(castsShadow).toBe(false);
    // Solid walls stay opaque (no x-ray) and are dimmed via their colour.
    expect(matOpacity).toBe(1);
    expect(dimColor.r).toBeCloseTo(baseColor.r * WALL_EXPLORED_DIM, 5);

    // Stepping into active vision restores the original colour and shadows.
    manager.updateWalls(wallData, {}, GRID, {
      ...fogState,
      visibleAreaSet: new Set(['0,0'])
    });
    let litColor = null;
    wall.pieces[0].innerModel.traverse(child => {
      if (child.isMesh) litColor = child.material.color.clone();
    });
    expect(litColor.r).toBeCloseTo(baseColor.r, 5);
  });

  it('keeps a frontier wall visible when only the viewer side is explored', () => {
    // Wall sits exactly on the x=500 tile boundary. Tile probing must not
    // resolve to the unexplored far-side tile and hide the whole run.
    manager.updateWalls(
      { '10,3,10,7': { type: 'stone_wall' } },
      {},
      GRID,
      {
        fogOfWarEnabled: true,
        isEditorMode: false,
        isGMMode: false,
        viewingFromToken: true,
        isPlayerPositionExplored: (x) => x < 500,
        visibleAreaSet: new Set(['9,3', '9,4', '9,5', '9,6'])
      }
    );

    const wall = manager.wallInstances.get('10,3,10,7');
    expect(wall).toBeDefined();
    wall.pieces.forEach(piece => {
      expect(piece.mesh.visible).toBe(true);
      let opacity = 1;
      let castsShadow = false;
      piece.innerModel.traverse(child => {
        if (child.isMesh) {
          opacity = child.material.opacity;
          castsShadow = child.castShadow;
        }
      });
      expect(opacity).toBeCloseTo(1);
      expect(castsShadow).toBe(true);
    });
  });

  it('dims a frontier wall instead of hiding it when the near side is only explored', () => {
    manager.updateWalls(
      { '10,3,10,7': { type: 'stone_wall' } },
      {},
      GRID,
      {
        fogOfWarEnabled: true,
        isEditorMode: false,
        isGMMode: false,
        viewingFromToken: true,
        isPlayerPositionExplored: (x) => x < 500,
        visibleAreaSet: new Set()
      }
    );

    const wall = manager.wallInstances.get('10,3,10,7');
    wall.pieces.forEach(piece => {
      expect(piece.mesh.visible).toBe(true);
      let opacity = 0;
      let dimColor = null;
      let baseColor = null;
      piece.innerModel.traverse(child => {
        if (child.isMesh) {
          opacity = child.material.opacity;
          baseColor = child.material.userData.baseColor;
          dimColor = child.material.color.clone();
        }
      });
      expect(opacity).toBe(1);
      expect(dimColor.r).toBeCloseTo(baseColor.r * WALL_EXPLORED_DIM, 5);
    });
  });

  it('hides a wall only when neither side is explored', () => {
    manager.updateWalls(
      { '10,3,10,7': { type: 'stone_wall' } },
      {},
      GRID,
      {
        fogOfWarEnabled: true,
        isEditorMode: false,
        isGMMode: false,
        viewingFromToken: true,
        isPlayerPositionExplored: () => false,
        visibleAreaSet: new Set()
      }
    );

    const wall = manager.wallInstances.get('10,3,10,7');
    wall.pieces.forEach(piece => {
      expect(piece.mesh.visible).toBe(false);
    });
  });

  it('maps wall types to their dedicated model textures or energy panes', () => {
    expect(manager.resolveWallAppearance({ type: 'stone_wall' })).toBeNull();
    expect(manager.resolveWallAppearance({ type: 'glass_window' })).toBeNull();
    expect(manager.resolveWallAppearance({ type: 'wooden_door' })).toBeNull();

    const wood = manager.resolveWallAppearance({ type: 'wooden_wall' });
    expect(wood).not.toBeNull();
    expect(wood.texture).toBe('wooden_wall');
    expect(wood.tint).toBeNull();
    expect(wood.junctionModels).toEqual({});

    const brick = manager.resolveWallAppearance({ type: 'brick_wall' });
    expect(brick.texture).toBe('brick_wall');
    expect(brick.baseOpacity).toBe(1);

    const metal = manager.resolveWallAppearance({ type: 'metal_wall' });
    expect(metal.texture).toBe('metal_wall');

    const hedge = manager.resolveWallAppearance({ type: 'hedge' });
    expect(hedge.texture).toBe('hedge');

    // `blocksLineOfSight: false` is a gameplay trait; parapets, ruins and
    // palisades are solid matter and must not render as ghosts. Structural
    // variations keep their own kit material instead of a muddy tint.
    ['half_wall', 'wall_arched', 'wall_broken', 'wall_shelves'].forEach((type) => {
      expect(manager.resolveWallAppearance({ type })).toBeNull();
    });

    const palisade = manager.resolveWallAppearance({ type: 'barrier_wood' });
    expect(palisade.junctionModels).toEqual({ corner: WALL_MODELS.barrier_corner });

    const barrier = manager.resolveWallAppearance({ type: 'magical_barrier' });
    expect(barrier.baseOpacity).toBeCloseTo(0.72);
    expect(barrier.energy).toBe(true);
    expect(barrier.junctionModels).toEqual({});
    expect(barrier.emissive).not.toBeNull();
    const force = manager.resolveWallAppearance({ type: 'force_wall' });
    expect(force.baseOpacity).toBeCloseTo(0.72);
    expect(force.energy).toBe(true);
  });

  it('renders dedicated wall types with their own model and seamless texture', () => {
    const appearance = manager.resolveWallAppearance({ type: 'wooden_wall' });
    expect(appearance.texture).toBe('wooden_wall');
    expect(manager.resolveWallModelUrl({ type: 'wooden_wall' })).toContain('wooden_wall.glb');
    expect(manager.resolveWallModelUrl({ type: 'brick_wall' })).toContain('brick_wall.glb');
  });

  it('centres dedicated models on the wall line instead of their authored edge origin', () => {
    // Wooden fence: thickness centre -0.4625 model units, rotateY 90 deg.
    manager.updateWalls({ '0,0,1,0': { type: 'wooden_fence' } }, {}, GRID);
    let piece = manager.wallInstances.get('0,0,1,0').pieces[0];
    expect(piece.innerModel.position.y).toBeCloseTo(0.4625 * 50);

    // Brick wall: thickness centre +0.41 model units, no rotation.
    manager.updateWalls({ '0,0,1,0': { type: 'brick_wall' } }, {}, GRID);
    piece = manager.wallInstances.get('0,0,1,0').pieces[0];
    expect(piece.innerModel.position.y).toBeCloseTo(0.41 * 50);

    // Kit walls are already centred.
    manager.updateWalls({ '0,0,1,0': { type: 'stone_wall' } }, {}, GRID);
    piece = manager.wallInstances.get('0,0,1,0').pieces[0];
    expect(piece.innerModel.position.y).toBeCloseTo(0);
  });

  it('does not cap or corner dedicated-model walls with stone junction pieces', () => {
    manager.updateWalls({ ...horizontalRun(0, 0, 2, 'wooden_fence') }, {}, GRID);
    expect(manager.junctionInstances.size).toBe(0);

    manager.updateWalls(
      { ...horizontalRun(-1, 0, 1, 'hedge'), ...verticalRun(0, 0, 1, 'hedge') },
      {},
      GRID
    );
    expect(manager.junctionInstances.size).toBe(0);

    // Free-standing columns are single pillars; no stone caps beside them.
    manager.updateWalls({ '0,0,1,0': { type: 'stone_column' } }, {}, GRID);
    expect(manager.junctionInstances.size).toBe(0);
  });

  it('replaces the two end tiles with one curved corner piece when the style is on', () => {
    const walls = { ...horizontalRun(-3, 0, 3, 'wooden_wall'), ...verticalRun(0, 0, 2, 'wooden_wall') };
    useLevelEditorStore.setState({ wallCornerStyles: { wooden_wall: 'curved' } });
    try {
      manager.updateWalls(walls, {}, GRID);

      const junction = manager.junctionInstances.get('0,0');
      expect(junction).toBeDefined();
      expect(junction.kind).toBe('corner');
      expect(junction.modelUrl).toBe(WALL_MODELS.wood_corner);
      // The tile each run ends on at the vertex is dropped entirely.
      expect(manager.wallInstances.has('-1,0,0,0')).toBe(false);
      expect(manager.wallInstances.has('0,0,0,1')).toBe(false);
      // Tiles further along the runs are untouched.
      expect(manager.wallInstances.get('-2,0,-1,0').pieces).toHaveLength(1);
      expect(manager.wallInstances.get('0,1,0,2').pieces).toHaveLength(1);
    } finally {
      useLevelEditorStore.setState({ wallCornerStyles: {} });
    }
  });

  it('honours a curved corner recorded on the wall records themselves', () => {
    const walls = { ...horizontalRun(-3, 0, 3, 'wooden_wall'), ...verticalRun(0, 0, 2, 'wooden_wall') };
    Object.values(walls).forEach((wall) => { wall.cornerStyle = 'curved'; });
    manager.updateWalls(walls, {}, GRID);
    const junction = manager.junctionInstances.get('0,0');
    expect(junction).toBeDefined();
    expect(junction.modelUrl).toBe(WALL_MODELS.wood_corner);
  });

  it('leaves corners as plain run joins when the style is square', () => {
    const walls = { ...horizontalRun(-2, 0, 2, 'wooden_wall'), ...verticalRun(0, 0, 2, 'wooden_wall') };
    manager.updateWalls(walls, {}, GRID);
    expect(manager.junctionInstances.size).toBe(0);
    expect(manager.wallInstances.get('-1,0,0,0').pieces).toHaveLength(1);
    expect(manager.wallInstances.get('0,0,0,1').pieces).toHaveLength(1);
  });

  it('renders magical barriers as translucent energy panes, not tinted masonry', () => {
    manager.updateWalls({ '0,0,1,0': { type: 'magical_barrier' } }, {}, GRID);
    const entry = manager.wallInstances.get('0,0,1,0');
    const piece = entry.pieces[0];
    // The energy pane is authored as a single upright box mesh.
    const pane = piece.innerModel.isMesh ? piece.innerModel : piece.innerModel.children[0];
    expect(pane.geometry.type).toBe('BoxGeometry');
    let material = null;
    piece.innerModel.traverse(child => {
      if (child.isMesh) material = child.material;
    });
    expect(material.transparent).toBe(true);
    expect(material.opacity).toBeCloseTo(0.72);
    expect(material.emissiveMap).not.toBeNull();
    expect(manager.junctionInstances.size).toBe(0);
  });

  it('keeps the palisade barrier low via the type heightScale', () => {
    manager.updateWalls({ '0,0,1,0': { type: 'barrier_wood' } }, {}, GRID);
    const entry = manager.wallInstances.get('0,0,1,0');
    expect(entry.pieces[0].innerModel.scale.y).toBeCloseTo((1.8 * 50 * 0.3) / 1.1);
  });

  it('renders the half wall as a low parapet scaled by the type heightScale', () => {
    manager.updateWalls({ '0,0,1,0': { type: 'half_wall' } }, {}, GRID);
    const entry = manager.wallInstances.get('0,0,1,0');
    expect(entry).toBeDefined();
    expect(entry.modelUrl).toContain('wall_stone_straight.glb');
    // Half the default 1.8 x grid body height.
    expect(entry.pieces[0].innerModel.scale.y).toBeCloseTo((1.8 * 50 * 0.5) / 4);
  });

  it('gives the wooden palisade its own corner piece instead of stone caps', () => {
    manager.updateWalls(
      { ...horizontalRun(-1, 0, 1, 'barrier_wood'), ...verticalRun(0, 0, 1, 'barrier_wood') },
      {},
      GRID
    );

    const corner = manager.junctionInstances.get('0,0');
    expect(corner).toBeDefined();
    expect(corner.kind).toBe('corner');
    expect(corner.modelUrl).toBe(WALL_MODELS.barrier_corner);
    // No stone end caps on the palisade's free ends.
    const kinds = [...manager.junctionInstances.values()].map((e) => e.kind);
    expect(kinds.filter((k) => k === 'endcap')).toHaveLength(0);
  });

  it('falls back to stone junctions when different wall types meet', () => {
    manager.updateWalls(
      { ...horizontalRun(-1, 0, 1, 'wooden_wall'), ...verticalRun(0, 0, 1, 'stone_wall') },
      {},
      GRID
    );

    const corner = manager.junctionInstances.get('0,0');
    expect(corner).toBeDefined();
    expect(corner.kind).toBe('corner');
    expect(corner.appearanceKey).toBeNull();
  });

  it('keeps a translucent energy pane dimmed by fog instead of overwriting opacity', () => {
    manager.updateWalls(
      { '0,0,1,0': { type: 'magical_barrier' } },
      {},
      GRID,
      {
        fogOfWarEnabled: true,
        isEditorMode: false,
        isGMMode: false,
        viewingFromToken: true,
        isPlayerPositionExplored: () => true,
        visibleAreaSet: new Set()
      }
    );

    const piece = manager.wallInstances.get('0,0,1,0').pieces[0];
    let opacity = 1;
    piece.innerModel.traverse(child => {
      if (child.isMesh) opacity = child.material.opacity;
    });
    expect(opacity).toBeCloseTo(0.72 * 0.7, 2);
  });

  it('subdivides diagonal runs so the masonry texture repeats instead of stretching', () => {
    // 5-tile diagonal: length 353.55, about 7 x gridSize.
    manager.updateWalls({ '0,0,5,5': { type: 'stone_wall' } }, {}, GRID);

    const entry = manager.wallInstances.get('0,0,5,5');
    expect(entry.pieces).toHaveLength(7);
    const scales = entry.pieces.map((p) => p.innerModel.scale.x);
    const expected = (Math.hypot(250, 250) / 7) / 4;
    scales.forEach((scale) => expect(scale).toBeCloseTo(expected, 3));
    // All pieces aligned with the run.
    entry.pieces.forEach((p) => expect(p.mesh.rotation.z).toBeCloseTo(-Math.PI / 4, 3));
  });

  it('uses stored hex chord endpoints instead of raw key math', () => {
    useGameStore.setState({ gridType: 'hex' });
    try {
      const walls = {
        '0,0,0,0': {
          type: 'stone_wall',
          hexEndpoints: [{ x: 0, y: 0 }, { x: 100, y: 0 }]
        }
      };
      manager.updateWalls(walls, {}, GRID);

      const entry = manager.wallInstances.get('0,0,0,0');
      expect(entry).toBeDefined();
      // Chords repeat the ~one-tile model instead of a single stretched piece.
      expect(entry.pieces).toHaveLength(2);
      expect(entry.pieces[0].mesh.position.x).toBeCloseTo(25);
      expect(entry.pieces[1].mesh.position.x).toBeCloseTo(75);
    } finally {
      useGameStore.setState({ gridType: 'square' });
    }
  });

  it('skips malformed wall keys safely', () => {
    manager.updateWalls({ 'not-a-wall': { type: 'stone_wall' }, '1,2': null }, {}, GRID);
    expect(manager.wallInstances.size).toBe(0);
    expect(manager.junctionInstances.size).toBe(0);
  });
});
