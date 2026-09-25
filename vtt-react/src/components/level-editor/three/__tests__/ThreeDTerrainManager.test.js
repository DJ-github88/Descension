import * as THREE from 'three';
import {
  ThreeDTerrainManager,
  TERRAIN_MODEL_REGISTRY,
  LIQUID_SURFACE_CONFIGS,
  resolveWaterShorePiece,
  WATER_SHORE_PIECES
} from '../ThreeDTerrainManager';

jest.mock('../../../../services/ModelCacheService', () => {
  const three = require('three');
  const sharedGeometry = new three.BoxGeometry(4, 4, 1);
  const sharedMaterial = new three.MeshStandardMaterial();
  // The real foundation GLB is authored grounded (y 0..2) on a 2.2 footprint, so
  // the mock models that too — the adaptive fit has to make it exactly one
  // level tall despite the authored 45.45-unit height.
  const foundationGeometry = new three.BoxGeometry(2.2, 2, 2.2);
  foundationGeometry.translate(0, 1, 0);
  // Kit shoreline tiles are multi-primitive: ground, banks and water arrive as
  // separate materials, which is what the manager has to keep apart.
  const partMaterial = (name, r, g, b) => {
    const material = new three.MeshStandardMaterial();
    material.name = name;
    material.color.setRGB(r, g, b);
    return material;
  };
  return {
    __esModule: true,
    default: {
      createInstance: () => new three.Group(),
      loadModel: () => Promise.resolve({}),
      subscribe: () => () => {},
      getGeometryAndMaterial: () => ({ geometry: sharedGeometry, material: sharedMaterial }),
      getMeshParts: (url) => {
        const target = String(url);
        if (target.includes('floor_foundation')) {
          return [{ geometry: foundationGeometry, material: sharedMaterial, name: 'texture' }];
        }
        if (target.includes('lily_large') || target.includes('lily_small')) {
          return [
            { geometry: sharedGeometry, material: partMaterial('leafsGreen', 0.03, 0.62, 0.45), name: 'leafsGreen' },
            { geometry: sharedGeometry, material: partMaterial('leafsDark', 0.03, 0.42, 0.45), name: 'leafsDark' },
            { geometry: sharedGeometry, material: partMaterial('colorRed', 0.77, 0.08, 0.09), name: 'colorRed' }
          ];
        }
        if (target.includes('models/water/')) {
          return [
            { geometry: sharedGeometry, material: partMaterial('water', 0.43, 0.91, 1), name: 'water' },
            { geometry: sharedGeometry, material: partMaterial('grass', 0.02, 0.69, 0.48), name: 'grass' },
            { geometry: sharedGeometry, material: partMaterial('dirt', 0.77, 0.22, 0.09), name: 'dirt' }
          ];
        }
        return [{ geometry: sharedGeometry, material: sharedMaterial, name: 'texture' }];
      }
    }
  };
});

const GRID = { gridSize: 50, gridOffsetX: 0, gridOffsetY: 0 };

describe('ThreeDTerrainManager', () => {
  let scene;
  let manager;

  beforeEach(() => {
    scene = new THREE.Scene();
    manager = new ThreeDTerrainManager(scene);
  });

  afterEach(() => {
    manager.dispose();
  });

  it('creates one instanced mesh per terrain variant so types do not default to one look', () => {
    manager.updateTerrain({
      terrainData: {
        '0,0': 'grass',
        '1,0': 'dungeon_floor',
        '2,0': 'marble_floor',
        '3,0': 'sand'
      },
      ...GRID,
      enabled: true
    });

    expect(manager.instancedMeshes.size).toBeGreaterThanOrEqual(4);
    const mainKeys = [...manager.instancedMeshes.keys()].filter(k => !k.startsWith('blend_'));
    expect(mainKeys).toHaveLength(4);
    mainKeys.forEach(key => {
      expect(manager.instancedMeshes.get(key).count).toBe(1);
    });
  });

  describe('water shorelines', () => {
    it('picks the shore piece whose banks face the land neighbours', () => {
      expect(resolveWaterShorePiece([], 0)).toMatchObject({
        modelKey: WATER_SHORE_PIECES.open.modelKey,
        rotationDeg: 0,
        isOpen: true
      });
      expect(resolveWaterShorePiece(['north'], 0)).toEqual({
        modelKey: WATER_SHORE_PIECES.side.modelKey,
        rotationDeg: 0,
        isOpen: false
      });
      // The same piece is rotated for every direction so a shoreline run keeps
      // one bank contour (and one water level).
      expect(resolveWaterShorePiece(['south'], 1)).toEqual({
        modelKey: WATER_SHORE_PIECES.side.modelKey,
        rotationDeg: 180,
        isOpen: false
      });
      expect(resolveWaterShorePiece(['east'], 0)).toEqual({
        modelKey: WATER_SHORE_PIECES.side.modelKey,
        rotationDeg: 270,
        isOpen: false
      });
      // Opposite land pairs need the straight tile across the water axis;
      // every third run swaps in the rocky-rapids variant.
      expect(resolveWaterShorePiece(['north', 'south'], 1)).toEqual({
        modelKey: WATER_SHORE_PIECES.straight.modelKey,
        rotationDeg: 90,
        isOpen: false
      });
      expect(resolveWaterShorePiece(['north', 'south'], 0)).toEqual({
        modelKey: WATER_SHORE_PIECES.rocks.modelKey,
        rotationDeg: 90,
        isOpen: false
      });
      expect(resolveWaterShorePiece(['east', 'west'], 1)).toEqual({
        modelKey: WATER_SHORE_PIECES.straight.modelKey,
        rotationDeg: 0,
        isOpen: false
      });
      // Adjacent land pairs need the corner tile.
      expect(resolveWaterShorePiece(['north', 'east'], 0)).toEqual({
        modelKey: WATER_SHORE_PIECES.corner.modelKey,
        rotationDeg: 270,
        isOpen: false
      });
      expect(resolveWaterShorePiece(['north', 'east', 'south'], 0)).toEqual({
        modelKey: WATER_SHORE_PIECES.end.modelKey,
        rotationDeg: 270,
        isOpen: false
      });
      expect(resolveWaterShorePiece(['north', 'east', 'south', 'west'], 0)).toEqual({
        modelKey: WATER_SHORE_PIECES.pond.modelKey,
        rotationDeg: 0,
        isOpen: false
      });
    });

    it('banks a lake edge and leaves the open centre to the liquid sheet', () => {
      const lake = {};
      for (let gx = 0; gx < 3; gx += 1) {
        for (let gy = 0; gy < 3; gy += 1) lake[`${gx},${gy}`] = 'water';
      }
      // A one-cell-wide river run to cover the opposite-land case.
      ['6,5', '7,5', '8,5'].forEach((key) => { lake[key] = 'water'; });
      manager.updateTerrain({ terrainData: lake, ...GRID, enabled: true });

      const keys = [...manager.instancedMeshes.keys()];
      // Cells per model: parts of one variant all carry the same instance count.
      const cellsUsing = (modelName) => [...manager.instancedMeshes.entries()]
        .reduce((best, [key, mesh]) => (
          key.split('#')[0].split('|')[0] === modelName ? Math.max(best, mesh.count) : best
        ), 0);
      // Lake corners, four single-bank edges, one open centre.
      expect(cellsUsing('ground_riverCorner')).toBe(4);
      // One banked piece for all four single-bank edges of the lake.
      expect(cellsUsing('ground_riverSide')).toBe(4);
      expect(cellsUsing('ground_riverOpen')).toBe(1);
      // The river's middle cell has land north and south (straight or rocks).
      expect(cellsUsing('ground_riverStraight') + cellsUsing('ground_riverRocks')).toBe(1);

      const sheet = manager.liquidSurfaces.get('water');
      expect(sheet).toBeDefined();
      // The animated sheet covers only the open centre; banked edges carry
      // their own baked water so the sheet never overlaps the shoreline.
      // Each sheet cell is a 3x3 patch (16 verts) so it can feather at banks.
      expect(sheet.geometry.getAttribute('position').count).toBe(16);

      // Every shoreline piece keeps its three parts apart.
      const straightKeys = keys.filter(key => key.startsWith('ground_riverStraight|') || key.startsWith('ground_riverRocks|'));
      expect(straightKeys).toHaveLength(3);
    });

    it('skins the drop where elevated water meets lower water', () => {
      const lake = {};
      for (let gx = 0; gx < 3; gx += 1) {
        for (let gy = 0; gy < 3; gy += 1) lake[`${gx},${gy}`] = 'water';
      }
      manager.updateTerrain({
        terrainData: lake,
        elevationData: { '1,1': 1 },
        ...GRID,
        enabled: true
      });

      const sheet = manager.liquidSurfaces.get('water');
      expect(sheet).toBeDefined();
      // Elevated water must not drop a hard "floating slab" shadow.
      expect(sheet.castShadow).toBe(false);

      const curtain = manager.liquidCurtains.get('water');
      expect(curtain).toBeDefined();
      expect(curtain.castShadow).toBe(false);
      // The raised middle cell drops toward all four lower water neighbours.
      const positions = curtain.geometry.getAttribute('position');
      expect(positions.count).toBe(16);
      const normals = curtain.geometry.getAttribute('normal');
      // One vertex per quad carries that quad's outward normal.
      const faces = new Set([0, 4, 8, 12].map(i => `${normals.getX(i)},${normals.getY(i)},${normals.getZ(i)}`));
      expect(faces).toEqual(new Set(['1,0,0', '-1,0,0', '0,1,0', '0,-1,0']));

      const lift = GRID.gridSize * LIQUID_SURFACE_CONFIGS.water.lift;
      const step = GRID.gridSize;
      const zs = Array.from({ length: 16 }, (_, i) => positions.getZ(i));
      expect(Math.min(...zs)).toBeCloseTo(lift);
      expect(Math.max(...zs)).toBeCloseTo(step + lift);
    });

    it('scatters lily decor over open water', () => {
      const lake = {};
      for (let gx = 0; gx < 5; gx += 1) {
        for (let gy = 0; gy < 5; gy += 1) lake[`${gx},${gy}`] = 'water';
      }
      manager.updateTerrain({ terrainData: lake, ...GRID, enabled: true });

      const cellsUsing = (modelName) => [...manager.instancedMeshes.entries()]
        .reduce((best, [key, mesh]) => (
          key.split('#')[0].split('|')[0] === modelName ? Math.max(best, mesh.count) : best
        ), 0);
      // 3x3 open centre: at least one lily lands there.
      expect(cellsUsing('water_lily_large') + cellsUsing('water_lily_small')).toBeGreaterThan(0);
      const lilyLeaf = [...manager.instancedMeshes.values()]
        .map(mesh => mesh.material)
        .find(material => material.name === 'leafsGreen');
      expect(lilyLeaf).toBeDefined();
      expect(lilyLeaf.color.getHex()).toBe(new THREE.Color('#4a7c59').getHex());
      // 3x3 open centre = 9 open cells x 16-vert patches.
      expect(manager.liquidSurfaces.get('water').geometry.getAttribute('position').count).toBe(144);
    });

    it('keeps ocean tiles plain: no rapids, no lilies', () => {
      // Oceans never swap in the rocky-rapids variant.
      expect(resolveWaterShorePiece(['north', 'south'], 0, { rocky: false })).toEqual({
        modelKey: WATER_SHORE_PIECES.straight.modelKey,
        rotationDeg: 90,
        isOpen: false
      });

      const sea = {};
      for (let gx = 0; gx < 5; gx += 1) {
        for (let gy = 0; gy < 5; gy += 1) sea[`${gx},${gy}`] = 'ocean';
      }
      manager.updateTerrain({ terrainData: sea, ...GRID, enabled: true });

      const keys = [...manager.instancedMeshes.keys()];
      // Oceans bank like water...
      expect(keys.some(key => key.startsWith('ground_river'))).toBe(true);
      // ...but never use rapids or spawn pond plants.
      expect(keys.some(key => key.startsWith('ground_riverRocks'))).toBe(false);
      expect(keys.some(key => key.startsWith('water_lily'))).toBe(false);
      expect(manager.liquidSurfaces.get('ocean')).toBeDefined();
      expect(manager.liquidSurfaces.get('water')).toBeUndefined();
    });

    it('clips the open-water sheet at diagonal shores', () => {
      // A 3x3 pond: the single open centre is diagonal to four corner banks.
      const lake = {};
      for (let gx = 0; gx < 3; gx += 1) {
        for (let gy = 0; gy < 3; gy += 1) lake[`${gx},${gy}`] = 'water';
      }
      manager.updateTerrain({ terrainData: lake, ...GRID, enabled: true });

      const sheet = manager.liquidSurfaces.get('water');
      const colors = sheet.geometry.getAttribute('color');
      const alphas = Array.from({ length: colors.count }, (_, i) => colors.getW(i));
      // Corner verts are fully transparent so the square sheet corner cannot
      // poke across the diagonal bank; the interior stays opaque.
      expect(Math.min(...alphas)).toBe(0);
      expect(Math.max(...alphas)).toBe(1);
    });

    it('keeps hazard liquids on the stone bed with their own glow', () => {
      const pool = {};
      for (let gx = 0; gx < 3; gx += 1) {
        for (let gy = 0; gy < 3; gy += 1) pool[`${gx},${gy}`] = 'lava';
      }
      manager.updateTerrain({ terrainData: pool, ...GRID, enabled: true });

      const modelKeys = [...manager.instancedMeshes.keys()].map(key => key.split('#')[0].split('|')[0]);
      // The animated DOM TileOverlay covers lava/acid/ice, so those types keep
      // their own bed model + emissive sheet instead of shoreline tiles.
      expect(modelKeys).toContain('lava_v2_lowpoly');
      expect(modelKeys.some(key => key.startsWith('ground_river'))).toBe(false);

      const lavaSheet = manager.liquidSurfaces.get('lava');
      expect(lavaSheet.material.emissive.getHex()).not.toBe(0);
      expect(lavaSheet.geometry.getAttribute('position').count).toBe(144);
    });

    it('recolours liquid and bank parts onto the terrain palette', () => {
      manager.updateTerrain({
        terrainData: { '0,0': 'water' },
        ...GRID,
        enabled: true
      });

      const keys = [...manager.instancedMeshes.keys()];
      const partMaterials = keys.map(key => manager.instancedMeshes.get(key).material);
      const names = partMaterials.map(material => material.name);
      expect(names).toContain('water');
      expect(names).toContain('grass');

      const waterPart = partMaterials.find(material => material.name === 'water');
      // Liquid surfaces use the palette colour lifted for the 3D lighting.
      expect(waterPart.color.getHex()).toBe(new THREE.Color('#4682b4').multiplyScalar(1.3).getHex());
      const grassPart = partMaterials.find(material => material.name === 'grass');
      // Banks use the palette colour, lifted slightly for the shoreline.
      expect(grassPart.color.getHex()).toBe(new THREE.Color('#4a7c59').multiplyScalar(1.12).getHex());
    });
  });

  it('renders every terrain type as a low-poly mesh, including PNG-backed types', () => {
    manager.updateTerrain({
      terrainData: {
        '0,0': 'water',
        '1,0': 'marble_floor',
        '2,0': 'dungeon_floor',
        '3,0': 'grass'
      },
      ...GRID,
      enabled: true
    });

    const keys = [...manager.instancedMeshes.keys()];
    // Every type resolves to a kit model — no PNG-textured floor fallback.
    // Water contributes three part meshes (its kit tile is multi-material).
    expect(keys).toHaveLength(6);
    keys.forEach(key => {
      const [modelKey] = key.split('#')[0].split('|');
      expect(TERRAIN_MODEL_REGISTRY[modelKey]).toBeDefined();
    });
    expect(manager.blendMesh).toBeDefined();
    expect(manager.blendMesh.geometry.getAttribute('position').count).toBeGreaterThan(0);
  });

  it('maps multi-variation 2D types onto their 3D model without variation keys', () => {
    manager.updateTerrain({
      terrainData: {
        '0,0': { type: 'marble_floor', variation: 0 },
        '1,0': { type: 'marble_floor', variation: 2 }
      },
      ...GRID,
      enabled: true
    });

    const keys = [...manager.instancedMeshes.keys()].filter(k => k.startsWith('marble_lowpoly|'));
    expect(keys).toHaveLength(1);
    expect(keys[0]).not.toContain('|v');
    expect(manager.instancedMeshes.get(keys[0]).count).toBe(2);
  });

  it('calibrates the tint against the model swatch so tiles land on the palette colour', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'dungeon_floor' },
      ...GRID,
      enabled: true
    });
    const mesh = [...manager.instancedMeshes.values()][0];
    // The old code multiplied by the raw palette colour (linear ~0.10 for
    // #5a5a5a), rendering near-black. The calibrated tint must be far brighter
    // so swatch * tint lands on the palette colour.
    expect(mesh.material.color.r).toBeGreaterThan(0.35);
  });

  it('tints per terrain type without repainting the shared source material', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'grass', '1,0': 'dungeon_floor' },
      ...GRID,
      enabled: true
    });

    const entries = [...manager.instancedMeshes.entries()].filter(([key]) => !key.startsWith('blend_'));
    expect(entries).toHaveLength(2);
    const materials = entries.map(([, mesh]) => mesh.material);
    expect(materials[0]).not.toBe(materials[1]);
    // Every variant gets its own cloned material.
    materials.forEach(m => expect(m).toBeInstanceOf(THREE.MeshStandardMaterial));

    const grassEntry = [...manager.instancedMeshes.entries()].find(([key]) => key.startsWith('grass_lowpoly_'));
    expect(grassEntry).toBeDefined();

    expect(manager.blendMesh).toBeDefined();
    expect(manager.blendMesh.geometry.getAttribute('position').count).toBeGreaterThan(0);
  });

  it('gives hazard terrain an emissive glow on its liquid sheet', () => {
    const pool = {};
    for (let gx = 0; gx < 3; gx += 1) {
      for (let gy = 0; gy < 3; gy += 1) pool[`${gx},${gy}`] = 'lava';
    }
    manager.updateTerrain({ terrainData: pool, ...GRID, enabled: true });
    const sheet = manager.liquidSurfaces.get('lava');
    expect(sheet).toBeDefined();
    expect(sheet.material.emissive.getHex()).not.toBe(0);
  });

  it('picks deterministic seamless variants and rotations for base terrain', () => {
    const field = {};
    for (let gx = 0; gx < 4; gx += 1) field[`${gx},0`] = 'grass';
    manager.updateTerrain({ terrainData: field, ...GRID, enabled: true });

    const grassKeys = [...manager.instancedMeshes.keys()]
      .map(key => key.split('|')[0])
      .filter(key => key.startsWith('grass_lowpoly_'));
    expect(grassKeys.length).toBeGreaterThan(0);
    grassKeys.forEach(key => expect(TERRAIN_MODEL_REGISTRY[key]).toBeDefined());

    manager.updateTerrain({ terrainData: field, ...GRID, enabled: true });
    const grassKeysAgain = [...manager.instancedMeshes.keys()]
      .map(key => key.split('|')[0])
      .filter(key => key.startsWith('grass_lowpoly_'));
    expect(grassKeysAgain).toEqual(grassKeys);
  });

  it('draws blend strips between neighbouring terrain of different types', () => {
    manager.updateTerrain({
      terrainData: {
        '0,0': 'grass',
        '1,0': 'dirt',
        '0,1': 'grass',
        '1,1': 'dirt'
      },
      ...GRID,
      enabled: true
    });

    expect(manager.blendMesh).toBeDefined();
    const count = manager.blendMesh.geometry.getAttribute('position').count;
    expect(count).toBeGreaterThan(0);
  });

  it('skips blend strips inside uniform terrain', () => {
    manager.updateTerrain({
      terrainData: {
        '0,0': 'grass',
        '1,0': 'grass',
        '0,1': 'grass',
        '1,1': 'grass'
      },
      ...GRID,
      enabled: true
    });

    expect(manager.blendMesh).toBeNull();
  });

  it('draws wet fade strips where water borders land', () => {
    manager.updateTerrain({
      terrainData: {
        '0,0': 'water',
        '1,0': 'grass',
        '0,1': 'water',
        '1,1': 'grass'
      },
      ...GRID,
      enabled: true
    });

    expect(manager.blendMesh).toBeDefined();
    expect(manager.blendMesh.geometry.getAttribute('position').count).toBeGreaterThan(0);
  });

  it('merges adjacent pits into one continuous pit region', () => {
    manager.updateTerrain({
      terrainData: {
        '0,0': 'pit', '1,0': 'pit',
        '0,1': 'pit', '1,1': 'pit'
      },
      ...GRID,
      enabled: true
    });

    expect(manager.pitMesh).toBeDefined();
    expect(manager.pitMesh.geometry.getAttribute('position').count).toBeGreaterThan(0);
    const pitKeys = [...manager.instancedMeshes.keys()].filter(k => k.startsWith('pit_lowpoly'));
    expect(pitKeys).toHaveLength(0);
  });

  it('builds a single pit with four rim walls', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'pit' },
      ...GRID,
      enabled: true
    });

    expect(manager.pitMesh).toBeDefined();
    // 1 floor quad (6 verts) + 4 wall quads (24 verts) = 30 positions.
    expect(manager.pitMesh.geometry.getAttribute('position').count).toBe(30);
    // The pit must land on the painted cell: cell 0,0 is centred at
    // worldX = gx*gridSize + gridSize/2 + offset = 25, so the floor spans 0..50.
    const xs = manager.pitMesh.geometry.getAttribute('position').array.filter((_, i) => i % 3 === 0);
    expect(Math.min(...xs)).toBeCloseTo(0, 1);
    expect(Math.max(...xs)).toBeCloseTo(50, 1);
  });

  it('leaves no pit mesh when no pits are painted', () => {
    manager.updateTerrain({ terrainData: { '0,0': 'grass' }, ...GRID, enabled: true });
    expect(manager.pitMesh).toBeNull();
  });

  it('tints water banks toward the actual neighbouring terrain', () => {
    manager.updateTerrain({
      terrainData: {
        '5,5': 'water',
        '4,5': 'dirt',
        '6,5': 'dirt',
        '5,4': 'dirt',
        '5,6': 'dirt'
      },
      ...GRID,
      enabled: true
    });

    const keys = [...manager.instancedMeshes.keys()];
    expect(keys.some(k => k.includes('bank:dirt'))).toBe(true);
    const banked = keys.find(k => k.includes('bank:dirt'));
    expect(banked.split('|')[0]).not.toBe('ground_riverOpen');
  });

  it('keeps the static bank palette when water has no painted neighbours', () => {
    manager.updateTerrain({
      terrainData: { '5,5': 'water' },
      ...GRID,
      enabled: true
    });

    const keys = [...manager.instancedMeshes.keys()];
    expect(keys.some(k => k.includes('bank:'))).toBe(false);
  });

  it('renders dedicated road and boardwalk models without texture plates', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'cobblestone_road', '1,0': 'wooden_planks' },
      ...GRID,
      enabled: true
    });

    const roadKey = [...manager.instancedMeshes.keys()].find(key => key.startsWith('cobble_road_lowpoly|'));
    expect(roadKey).toBeDefined();
    expect(manager.instancedMeshes.get(roadKey).material.map).toBeFalsy();

    const plankKey = [...manager.instancedMeshes.keys()].find(key => key.startsWith('boardwalk_lowpoly|'));
    expect(manager.instancedMeshes.get(plankKey).material.map).toBeFalsy();
  });

  it('lays a ground bed under gap models such as the flagstone path', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone_path' },
      ...GRID,
      enabled: true
    });

    const bed = manager.instancedMeshes.get('path_bed|default');
    expect(bed).toBeDefined();
    expect(bed.count).toBe(1);
    expect(bed.material.map).toBeTruthy();
    expect(TERRAIN_MODEL_REGISTRY.path_bed.plate).toBe(true);
  });

  it('adds a black inverted-hull outline for models that opt in', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone_path' },
      ...GRID,
      enabled: true
    });

    const outline = manager.outlineMeshes.get('road_graveyard');
    expect(outline).toBeDefined();
    expect(outline.count).toBe(1);
    expect(outline.material.side).toBe(THREE.BackSide);
    expect(outline.material.color.getHex()).toBe(0x0b0b0d);
  });

  it('floats a translucent world-UV liquid sheet over open water and hazard pools', () => {
    const lake = {};
    for (let gx = 5; gx < 8; gx += 1) {
      for (let gy = 0; gy < 3; gy += 1) lake[`${gx},${gy}`] = 'lava';
    }
    for (let gx = 0; gx < 3; gx += 1) {
      for (let gy = 0; gy < 3; gy += 1) lake[`${gx},${gy}`] = 'water';
    }
    manager.updateTerrain({ terrainData: lake, ...GRID, enabled: true });

    const water = manager.liquidSurfaces.get('water');
    expect(water).toBeDefined();
    expect(water.material.transparent).toBe(true);
    expect(water.material.opacity).toBeCloseTo(0.86);
    // Only the lake centre is open water; banked shore tiles carry their own.
    expect(water.geometry.getAttribute('position').count).toBe(16);

    const uvs = water.geometry.getAttribute('uv');
    const rippleWorld = GRID.gridSize * LIQUID_SURFACE_CONFIGS.water.rippleSize;
    expect(uvs.getY(3) - uvs.getY(0)).toBeCloseTo(GRID.gridSize / rippleWorld);

    expect(manager.liquidSurfaces.get('lava')).toBeDefined();
    expect(manager.liquidSurfaces.get('ice')).toBeUndefined();
  });

  it('scrolls liquid ripple textures over time', () => {
    const lake = {};
    for (let gx = 0; gx < 3; gx += 1) {
      for (let gy = 0; gy < 3; gy += 1) lake[`${gx},${gy}`] = 'water';
    }
    manager.updateTerrain({ terrainData: lake, ...GRID, enabled: true });
    const water = manager.liquidSurfaces.get('water');
    water.material.map = new THREE.Texture();
    water.material.normalMap = new THREE.Texture();

    expect(manager.updateAnimations(1)).toBe(true);
    expect(water.material.map.offset.x).toBeCloseTo(LIQUID_SURFACE_CONFIGS.water.scroll.x);
    expect(water.material.normalMap.offset.y).toBeGreaterThan(0);

    // A second tick keeps advancing from the accumulated time.
    manager.updateAnimations(1);
    expect(water.material.map.offset.x).toBeCloseTo(LIQUID_SURFACE_CONFIGS.water.scroll.x * 2);
  });

  it('covers unknown/custom terrain types with a 3D tile', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'my_custom_terrain' },
      ...GRID,
      enabled: true
    });
    expect(manager.instancedMeshes.size).toBe(1);
  });

  it('maps wooden_floor to dedicated 3D wood floor model', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'wooden_floor' },
      ...GRID,
      enabled: true
    });
    const [variantKey] = [...manager.instancedMeshes.keys()];
    expect(variantKey).toContain('wooden_floor_lowpoly');
  });

  it('builds a foundation column whose topmost block meets the tile top', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone' },
      elevationData: { '0,0': 2 },
      ...GRID,
      enabled: true
    });
    const foundationMesh = manager.instancedMeshes.get('foundation|default');
    expect(foundationMesh).toBeDefined();
    expect(foundationMesh.count).toBe(2);

    // Non-top blocks overlap 15% into the block above so the kit's decorative
    // top rim cannot show as a groove per level ("crate stack"); the top block
    // ends exactly at the tile floor (100).
    const bottomMatrix = new THREE.Matrix4();
    const topMatrix = new THREE.Matrix4();
    foundationMesh.getMatrixAt(0, bottomMatrix);
    foundationMesh.getMatrixAt(1, topMatrix);
    const modelBottomZ = (m) => new THREE.Vector3(0, 0, 0).applyMatrix4(m).z;
    const modelTopZ = (m) => new THREE.Vector3(0, 2, 0).applyMatrix4(m).z;
    expect(modelBottomZ(bottomMatrix)).toBeCloseTo(0, 3);
    expect(modelTopZ(bottomMatrix)).toBeCloseTo(57.5, 3); // 50 * 1.15 overlap
    expect(modelBottomZ(topMatrix)).toBeCloseTo(50, 3);
    expect(modelTopZ(topMatrix)).toBeCloseTo(100, 3);
  });

  it('creates an unpainted plateau in 3D from elevation data alone', () => {
    manager.updateTerrain({
      terrainData: {},
      elevationData: { '0,0': 1 },
      ...GRID,
      enabled: true
    });
    // One foundation block (lvl 0) plus a ground plate capping it at +1.
    expect(manager.instancedMeshes.get('foundation|default').count).toBe(1);
    const plate = manager.instancedMeshes.get('procedural_plate|default');
    expect(plate).toBeDefined();
    expect(plate.count).toBe(1);
    const matrix = new THREE.Matrix4();
    plate.getMatrixAt(0, matrix);
    // Lifted a hair above the top block so coplanar faces cannot z-fight.
    expect(matrix.elements[14]).toBeCloseTo(50.5, 3);
  });

  it('carves an unpainted pit as an open shell that meets the ground plane', () => {
    manager.updateTerrain({
      terrainData: {},
      elevationData: { '0,0': -2 },
      ...GRID,
      enabled: true
    });
    const pit = manager.instancedMeshes.get('procedural_pit|default');
    expect(pit).toBeDefined();
    expect(pit.count).toBe(1);
    expect(pit.material.side).toBe(THREE.BackSide);
    const matrix = new THREE.Matrix4();
    pit.getMatrixAt(0, matrix);
    // Floor sits two levels down; the shell (height 2 levels) reaches z=0.
    expect(new THREE.Vector3(0, 0, 0).applyMatrix4(matrix).z).toBeCloseTo(-100, 3);
    expect(new THREE.Vector3(0, 1, 0).applyMatrix4(matrix).z).toBeCloseTo(0, 3);
  });

  it('lets the stair asset carry the column under unpainted elevated ramps', () => {
    manager.updateTerrain({
      terrainData: {},
      elevationData: { '0,0': 2 },
      rampData: { '0,0': { dir: 'e', type: 'ramp' } },
      ...GRID,
      enabled: true
    });
    // The stair model supplies the tile volume: no foundation blocks (they
    // would poke through the thin end of the slope) and no plate either.
    expect(manager.instancedMeshes.get('foundation|default')).toBeUndefined();
    expect(manager.instancedMeshes.get('procedural_plate|default')).toBeUndefined();
    const ramp = manager.instancedMeshes.get('stairs_wide|default');
    expect(ramp).toBeDefined();
    expect(ramp.count).toBe(1);
  });

  it('keeps flat ramps on the ordinary floor tile and slopes only real level changes', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone', '1,0': 'stone' },
      rampData: {
        '0,0': { dir: 'e', type: 'ramp' },
        '1,0': { dir: 'e', type: 'ramp' }
      },
      ...GRID,
      enabled: true
    });
    // Neither ramp changes level, so both tiles keep their flat floor and no
    // slope geometry is generated.
    const stoneTiles = [...manager.instancedMeshes.entries()]
      .filter(([key]) => key.startsWith('stone_lowpoly_'));
    expect(stoneTiles.length).toBeGreaterThan(0);
    expect(stoneTiles.reduce((sum, [, mesh]) => sum + mesh.count, 0)).toBe(2);
    expect(manager.instancedMeshes.get('stairs_wide|default')).toBeUndefined();
  });

  it('uses the wide stair asset for ramp tiles and climbs to the connected neighbour', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone' },
      elevationData: { '1,0': 1 },
      rampData: { '0,0': { dir: 'e', type: 'ramp' } },
      ...GRID,
      enabled: true
    });
    // Floor omitted under a sloped ramp; the wide stair asset is used instead
    // of the old procedural wedge.
    const stoneFloorMesh = manager.instancedMeshes.get('stone_floor|default');
    expect(stoneFloorMesh ? stoneFloorMesh.count : 0).toBe(0);
    const rampMesh = manager.instancedMeshes.get('stairs_wide|default');
    expect(rampMesh).toBeDefined();
    expect(rampMesh.count).toBe(1);

    // The normalised model grounds its base and centres the run on the tile,
    // reaching one level up at the top.
    const matrix = new THREE.Matrix4();
    rampMesh.getMatrixAt(0, matrix);
    const base = new THREE.Vector3(0, -2, 0).applyMatrix4(matrix);
    expect(base.x).toBeCloseTo(25, 3);
    expect(base.y).toBeCloseTo(-25, 3);
    expect(base.z).toBeCloseTo(0, 3);
    const top = new THREE.Vector3(0, 2, 0).applyMatrix4(matrix);
    expect(top.z).toBeCloseTo(50, 3);
  });

  it('stretches stairs to the neighbour level and centres their run on the tile', () => {
    manager.updateTerrain({
      elevationData: { '1,0': 2 },
      rampData: { '0,0': { dir: 'e', type: 'stairs' } },
      ...GRID,
      enabled: true
    });
    const stairsMesh = manager.instancedMeshes.get('stairs|default');
    expect(stairsMesh).toBeDefined();
    expect(stairsMesh.count).toBe(1);

    const matrix = new THREE.Matrix4();
    stairsMesh.getMatrixAt(0, matrix);
    // Mock stair box spans y ±2, z ±0.5; normalisation grounds the base and
    // centres the run so it spans the whole tile.
    const bottomCenter = new THREE.Vector3(0, -2, 0).applyMatrix4(matrix);
    expect(bottomCenter.x).toBeCloseTo(25, 3);
    expect(bottomCenter.y).toBeCloseTo(-25, 3);
    expect(bottomCenter.z).toBeCloseTo(0, 3);
    const topCenter = new THREE.Vector3(0, 2, 0).applyMatrix4(matrix);
    expect(topCenter.z).toBeCloseTo(100, 3); // two levels of height

    const runNorth = new THREE.Vector3(0, -2, -0.5).applyMatrix4(matrix);
    const runSouth = new THREE.Vector3(0, -2, 0.5).applyMatrix4(matrix);
    // East-facing ramp: the run maps onto the world X axis and spans the tile.
    expect(Math.abs(runSouth.x - runNorth.x)).toBeCloseTo(50, 3);
  });

  it('flips descending stairs so they drop toward the connected neighbour', () => {
    manager.updateTerrain({
      // Steepest adjacent difference is east (2 -> 0): auto-aligns east and
      // descends, so the high end sits on the west edge at the tile's level.
      elevationData: { '0,0': 2, '1,0': 0, '-1,0': 2, '0,-1': 2, '0,1': 2 },
      rampData: { '0,0': { type: 'stairs' } },
      ...GRID,
      enabled: true
    });
    const stairsMesh = manager.instancedMeshes.get('stairs|default');
    const matrix = new THREE.Matrix4();
    stairsMesh.getMatrixAt(0, matrix);
    // High run edge sits on the tile's west edge at the tile's own level...
    const highEdge = new THREE.Vector3(0, 2, -0.5).applyMatrix4(matrix);
    expect(highEdge.x).toBeCloseTo(0, 3);
    expect(highEdge.z).toBeCloseTo(100, 3);
    // ...and the grounded base lands on the east edge at the lower neighbour.
    const lowEdge = new THREE.Vector3(0, -2, 0.5).applyMatrix4(matrix);
    expect(lowEdge.x).toBeCloseTo(50, 3);
    expect(lowEdge.z).toBeCloseTo(0, 3);
  });

  it('supports lowercase directions and rotates the ramp toward each neighbour', () => {
    manager.updateTerrain({
      elevationData: {
        '0,-1': 1, // north of (0,0)
        '2,0': 1,  // east of (1,0)
        '3,1': 1,  // south of (3,0)
        '-1,1': 1  // west of (0,1)
      },
      rampData: {
        '0,0': { dir: 'n', type: 'stairs' },
        '1,0': { dir: 'e', type: 'stairs' },
        '3,0': { dir: 's', type: 'stairs' },
        '0,1': { dir: 'w', type: 'stairs' }
      },
      ...GRID,
      enabled: true
    });
    const stairsMesh = manager.instancedMeshes.get('stairs|default');
    expect(stairsMesh).toBeDefined();
    expect(stairsMesh.count).toBe(4);

    // The high run edge (model +Y top, -Z up-slope corner) must land on the
    // edge shared with the connected neighbour, one level up.
    const highEdgeOf = (idx) => {
      const matrix = new THREE.Matrix4();
      stairsMesh.getMatrixAt(idx, matrix);
      return new THREE.Vector3(0, 2, -0.5).applyMatrix4(matrix);
    };
    // Instance order follows Object.keys(rampData): n, e, s, w.
    const north = highEdgeOf(0); // tile (0,0), north edge is y=0
    expect(north.x).toBeCloseTo(25, 3);
    expect(north.y).toBeCloseTo(0, 3);
    expect(north.z).toBeCloseTo(50, 3);
    const east = highEdgeOf(1); // tile (1,0), east edge is x=100
    expect(east.x).toBeCloseTo(100, 3);
    expect(east.y).toBeCloseTo(-25, 3);
    const south = highEdgeOf(2); // tile (3,0), south edge is y=-50
    expect(south.x).toBeCloseTo(175, 3);
    expect(south.y).toBeCloseTo(-50, 3);
    const west = highEdgeOf(3); // tile (0,1), west edge is x=0
    expect(west.x).toBeCloseTo(0, 3);
    expect(west.y).toBeCloseTo(-75, 3);
  });

  it('generates foundation blocks underneath elevated stairs and uses wood stairs on wood terrain', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'wooden_floor' },
      // The +3 neighbour is the only level difference, so the ramp auto-aligns
      // east; the surrounding ground matches the tile so it is not the target.
      elevationData: { '0,0': 2, '1,0': 3, '-1,0': 2, '0,-1': 2, '0,1': 2 },
      rampData: { '0,0': { type: 'stairs' } },
      ...GRID,
      enabled: true
    });
    const woodStairsMesh = manager.instancedMeshes.get('stairs_wood|default');
    expect(woodStairsMesh).toBeDefined();
    expect(woodStairsMesh.count).toBe(1);

    const foundationMesh = manager.instancedMeshes.get('foundation|default');
    expect(foundationMesh).toBeDefined();
    // Two supporting blocks specifically under the elevated ramp tile (tile
    // (0,0) is centred at world x 25, y -25).
    const matrix = new THREE.Matrix4();
    let blocksAtRampTile = 0;
    for (let i = 0; i < foundationMesh.count; i += 1) {
      foundationMesh.getMatrixAt(i, matrix);
      if (Math.abs(matrix.elements[12] - 25) < 0.01 && Math.abs(matrix.elements[13] + 25) < 0.01) {
        blocksAtRampTile += 1;
      }
    }
    expect(blocksAtRampTile).toBe(2);
  });

  it('disables frustum culling on terrain instanced meshes (instance matrices change)', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone', '1,0': 'stone_path' },
      ...GRID,
      enabled: true
    });
    // three computes an InstancedMesh bounding sphere only once; with matrices
    // rewritten on every terrain update a stale sphere culls whole variants
    // ("tiles vanish at some zooms"), so the meshes must opt out of culling.
    expect(manager.instancedMeshes.size).toBeGreaterThan(0);
    manager.instancedMeshes.forEach(mesh => {
      expect(mesh.frustumCulled).toBe(false);
    });
    expect(manager.outlineMeshes.size).toBeGreaterThan(0);
    manager.outlineMeshes.forEach(mesh => {
      expect(mesh.frustumCulled).toBe(false);
    });
  });

  it('hides the group when disabled', () => {
    manager.updateTerrain({ terrainData: { '0,0': 'grass' }, ...GRID, enabled: false });
    expect(manager.group.visible).toBe(false);
  });

  it('intelligently auto-tiles connected cobblestone roads into straights, corners, and junctions', () => {
    // Layout:
    // (0,0) - (1,0) [Corner: S+E at 0,0, W+S at 1,0]
    //   |       |
    // (0,1) - (1,1)
    const roadMap = {
      '0,0': 'cobblestone_road',
      '1,0': 'cobblestone_road',
      '0,1': 'cobblestone_road',
      '1,1': 'cobblestone_road'
    };
    manager.updateTerrain({ terrainData: roadMap, ...GRID, enabled: true });
    const keys = [...manager.instancedMeshes.keys()];
    const cornerMeshKey = keys.find(k => k.startsWith('cobble_road_corner_lowpoly|'));
    expect(cornerMeshKey).toBeDefined();
    expect(manager.instancedMeshes.get(cornerMeshKey).count).toBe(4);
  });

  it('intelligently auto-tiles connected dirt paths into straights and crossings', () => {
    // 3x3 plus shape with center at (1,1) having 4 neighbours -> crossroad
    const pathMap = {
      '1,0': 'dirt_path',
      '0,1': 'dirt_path',
      '1,1': 'dirt_path',
      '2,1': 'dirt_path',
      '1,2': 'dirt_path'
    };
    manager.updateTerrain({ terrainData: pathMap, ...GRID, enabled: true });
    const keys = [...manager.instancedMeshes.keys()];
    const crossKey = keys.find(k => k.startsWith('dirt_path_cross_lowpoly|'));
    expect(crossKey).toBeDefined();
    expect(manager.instancedMeshes.get(crossKey).count).toBe(1);
  });
});
