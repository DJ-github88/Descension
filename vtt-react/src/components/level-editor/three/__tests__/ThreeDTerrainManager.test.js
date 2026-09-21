import * as THREE from 'three';
import {
  ThreeDTerrainManager,
  TERRAIN_MODEL_REGISTRY,
  LIQUID_SURFACE_CONFIGS,
  resolveWaterShorePiece,
  WATER_SHORE_PIECES
} from '../ThreeDTerrainManager';
import { TERRAIN_UV_PER_CELL } from '../terrainMaterialTextures';

jest.mock('../../../../services/ModelCacheService', () => {
  const three = require('three');
  const sharedGeometry = new three.BoxGeometry(4, 4, 1);
  const sharedMaterial = new three.MeshStandardMaterial();
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

    expect(manager.instancedMeshes.size).toBe(4);
    manager.instancedMeshes.forEach(mesh => {
      expect(mesh.count).toBe(1);
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
      // Only the lake centre is open water (the river run has banks on two sides).
      expect(sheet.geometry.getAttribute('position').count).toBe(4);

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
      const step = GRID.gridSize * 0.5;
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
      expect(manager.liquidSurfaces.get('water').geometry.getAttribute('position').count).toBe(36);
    });

    it('keeps hazard liquids on the stone bed with their own glow', () => {
      const pool = {};
      for (let gx = 0; gx < 3; gx += 1) {
        for (let gy = 0; gy < 3; gy += 1) pool[`${gx},${gy}`] = 'lava';
      }
      manager.updateTerrain({ terrainData: pool, ...GRID, enabled: true });

      const modelKeys = [...manager.instancedMeshes.keys()].map(key => key.split('#')[0].split('|')[0]);
      // The animated DOM TileOverlay covers lava/acid/ice, so those types keep
      // the stone bed + emissive sheet instead of shoreline tiles.
      expect(modelKeys).toContain('tile_small');
      expect(modelKeys.some(key => key.startsWith('ground_river'))).toBe(false);

      const lavaSheet = manager.liquidSurfaces.get('lava');
      expect(lavaSheet.material.emissive.getHex()).not.toBe(0);
      expect(lavaSheet.geometry.getAttribute('position').count).toBe(36);
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

    const keys = [...manager.instancedMeshes.keys()].filter(k => k.startsWith('tile_small|'));
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

    const materials = [...manager.instancedMeshes.values()].map(m => m.material);
    expect(materials).toHaveLength(2);
    expect(materials[0]).not.toBe(materials[1]);
    // Every variant gets its own cloned material.
    materials.forEach(m => expect(m).toBeInstanceOf(THREE.MeshStandardMaterial));

    const grass = materials.find(m => m.emissive && m.emissive.getHex() === 0 && m.color.g > m.color.b);
    expect(grass).toBeDefined();
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

  it('maps the authored 2D tile art onto the flat prototype plates', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'cobblestone_road', '1,0': 'wooden_planks' },
      ...GRID,
      enabled: true
    });

    const roadKey = [...manager.instancedMeshes.keys()].find(key => key.startsWith('road_stone|'));
    expect(roadKey).toBeDefined();
    const road = manager.instancedMeshes.get(roadKey);
    expect(road.material.map).toBeTruthy();
    expect(road.material.map.repeat.x).toBeCloseTo(1 / TERRAIN_UV_PER_CELL);

    const plankKey = [...manager.instancedMeshes.keys()].find(key => key.startsWith('wooden_planks|'));
    expect(manager.instancedMeshes.get(plankKey).material.map).toBeTruthy();
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
    expect(water.material.transparent).toBe(false);
    expect(water.material.opacity).toBe(1);
    // Only the lake centre is open water; banked shore tiles carry their own.
    expect(water.geometry.getAttribute('position').count).toBe(4);

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
    expect(variantKey).toContain('wood_floor');
  });

  it('generates 3D foundation blocks underneath elevated cliff tiles', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone' },
      elevationData: { '0,0': 2 },
      ...GRID,
      enabled: true
    });
    // Should have stone_floor variant and foundation variant
    const foundationMesh = manager.instancedMeshes.get('foundation|default');
    expect(foundationMesh).toBeDefined();
    expect(foundationMesh.count).toBe(2); // 2 elevation levels under the tile
  });

  it('omits flat floor tiles on cells containing ramps to avoid z-fighting', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'stone' },
      rampData: { '0,0': { dir: 's', type: 'ramp' } },
      ...GRID,
      enabled: true
    });
    // Flat stone_floor should not be pushed; only stairs
    const stoneFloorMesh = manager.instancedMeshes.get('stone_floor|default');
    expect(stoneFloorMesh ? stoneFloorMesh.count : 0).toBe(0);
    const stairsMesh = manager.instancedMeshes.get('stairs|default');
    expect(stairsMesh).toBeDefined();
    expect(stairsMesh.count).toBe(1);
  });

  it('supports lowercase directions for stairs and applies correct rotation', () => {
    manager.updateTerrain({
      rampData: {
        '0,0': { dir: 'n' },
        '1,0': { dir: 'e' },
        '2,0': { dir: 's' },
        '3,0': { dir: 'w' }
      },
      ...GRID,
      enabled: true
    });
    const stairsMesh = manager.instancedMeshes.get('stairs|default');
    expect(stairsMesh).toBeDefined();
    expect(stairsMesh.count).toBe(4);
  });

  it('generates foundation blocks underneath elevated stairs and uses wood stairs on wood terrain', () => {
    manager.updateTerrain({
      terrainData: { '0,0': 'wooden_floor' },
      elevationData: { '0,0': 2 },
      rampData: { '0,0': { dir: 'e', type: 'stairs' } },
      ...GRID,
      enabled: true
    });
    const woodStairsMesh = manager.instancedMeshes.get('stairs_wood|default');
    expect(woodStairsMesh).toBeDefined();
    expect(woodStairsMesh.count).toBe(1);

    const foundationMesh = manager.instancedMeshes.get('foundation|default');
    expect(foundationMesh).toBeDefined();
    expect(foundationMesh.count).toBe(2);
  });

  it('hides the group when disabled', () => {
    manager.updateTerrain({ terrainData: { '0,0': 'grass' }, ...GRID, enabled: false });
    expect(manager.group.visible).toBe(false);
  });
});
