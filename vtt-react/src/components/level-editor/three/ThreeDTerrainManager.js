import * as THREE from 'three';
import modelCache from '../../../services/ModelCacheService';
import { PROFESSIONAL_TERRAIN_TYPES } from '../../../store/levelEditorStore';

export const TERRAIN_MODEL_REGISTRY = {
  stone_floor: {
    url: '/assets/models/dungeon/floor_stone.glb',
    scale: 1.0,
    baseZ: 0
  },
  stone_rocks: {
    url: '/assets/models/dungeon/floor_stone_rocks.glb',
    scale: 1.0,
    baseZ: 0
  },
  dirt: {
    url: '/assets/models/dungeon/floor_dirt.glb',
    scale: 1.0,
    baseZ: 0
  },
  dirt_rocky: {
    url: '/assets/models/dungeon/floor_dirt_rocky.glb',
    scale: 1.0,
    baseZ: 0
  },
  wood_floor: {
    url: '/assets/models/dungeon/floor_wood.glb',
    scale: 1.0,
    baseZ: 0
  },
  wood_floor_dark: {
    url: '/assets/models/dungeon/floor_wood_dark.glb',
    scale: 1.0,
    baseZ: 0
  },
  grate: {
    url: '/assets/models/dungeon/floor_grate.glb',
    scale: 1.0,
    baseZ: 0
  },
  grate_open: {
    url: '/assets/models/dungeon/floor_grate_open.glb',
    scale: 1.0,
    baseZ: 0
  },
  spikes: {
    url: '/assets/models/dungeon/floor_spikes.glb',
    scale: 1.0,
    baseZ: 0
  },
  foundation: {
    url: '/assets/models/dungeon/floor_foundation.glb',
    scale: 1.0,
    baseZ: 0
  },
  stairs: {
    url: '/assets/models/dungeon/stairs_stone.glb',
    scale: 1.0,
    baseZ: 0
  },
  stairs_narrow: {
    url: '/assets/models/dungeon/stairs_narrow.glb',
    scale: 1.0,
    baseZ: 0
  },
  stairs_wide: {
    url: '/assets/models/dungeon/stairs_wide.glb',
    scale: 1.0,
    baseZ: 0
  },
  stairs_wood: {
    url: '/assets/models/dungeon/stairs_wood.glb',
    scale: 1.0,
    baseZ: 0
  },
  stone_wall: {
    url: '/assets/models/dungeon/wall_stone_straight.glb',
    scale: 1.0,
    baseZ: 0
  }
};

const WHITE = new THREE.Color(0xffffff);

// Terrain types whose material should stay closest to the raw kit texture.
const NATURAL_TINT_TYPES = new Set(['stone', 'dungeon_floor', 'cobblestone', 'wooden_floor']);

// Types that ought to glow rather than just reflect.
const EMISSIVE_TERRAIN = {
  lava: 0.55,
  acid: 0.4,
  fungal_growth: 0.35,
  crystal_floor: 0.4,
  gold_floor: 0.3
};

const DIRT_MODEL_TYPES = new Set([
  'dirt', 'mud', 'swamp', 'sand', 'grass', 'fungal_growth', 'water'
]);

function resolveTerrainModelKey(typeId, typeDef) {
  const type = String(typeId || '').toLowerCase();
  const name = String(typeDef?.name || '').toLowerCase();
  const haystack = `${type} ${name}`;

  if (type.includes('wall') || haystack.includes('wall')) return 'stone_wall';
  if (haystack.includes('wood') || haystack.includes('plank')) {
    return haystack.includes('dark') ? 'wood_floor_dark' : 'wood_floor';
  }
  if (haystack.includes('grate')) return 'grate';
  if (haystack.includes('spike')) return 'spikes';
  if (haystack.includes('cave') || haystack.includes('rocky_stone') || haystack.includes('rough_stone')) {
    return 'stone_rocks';
  }
  if (haystack.includes('gravel') || haystack.includes('rocky_dirt')) {
    return 'dirt_rocky';
  }
  if (DIRT_MODEL_TYPES.has(type)) return 'dirt';
  if (haystack.includes('dirt') || haystack.includes('mud') || haystack.includes('earth') || haystack.includes('ground')) return 'dirt';
  if (haystack.includes('stone') || haystack.includes('cobble') || haystack.includes('floor') || haystack.includes('marble') || haystack.includes('tile')) return 'stone_floor';
  if (haystack.includes('grass') || haystack.includes('sand') || haystack.includes('snow') || haystack.includes('water') || haystack.includes('ice')) return 'dirt';
  // Unknown / custom terrain still gets a 3D tile so the 2D canvas never shows
  // through under it.
  return 'stone_floor';
}

function resolveTerrainLook(typeId, typeDef) {
  const color = new THREE.Color(typeDef?.color || '#8a8a8a');
  const isNeutral = NATURAL_TINT_TYPES.has(typeId);
  const luma = color.r * 0.3 + color.g * 0.6 + color.b * 0.1;
  const lift = isNeutral ? 0.15 : (luma < 0.15 ? 0.2 : 0.4);
  const tint = color.clone().lerp(WHITE, lift);
  const emissiveStrength = EMISSIVE_TERRAIN[typeId] || 0;
  return {
    tint,
    emissive: emissiveStrength > 0 ? color.clone() : null,
    emissiveStrength,
    key: `${typeId}:${Math.round(tint.r * 255)},${Math.round(tint.g * 255)},${Math.round(tint.b * 255)}`
  };
}

export class ThreeDTerrainManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'ThreeDTerrainGroup';
    this.scene.add(this.group);

    // Map: "modelKey|lookKey" -> THREE.InstancedMesh
    this.instancedMeshes = new Map();
    this.dummy = new THREE.Object3D();
    this.lastParams = null;

    // Preload terrain models
    Object.values(TERRAIN_MODEL_REGISTRY).forEach(reg => {
      modelCache.loadModel(reg.url).catch(() => {});
    });

    // Re-render when cached models finish loading asynchronously
    this.unsubscribeCache = modelCache.subscribe(() => {
      if (this.lastParams) {
        this.updateTerrain(this.lastParams);
      }
    });
  }

  updateTerrain({
    terrainData = {},
    elevationData = {},
    rampData = {},
    gridSize = 50,
    gridOffsetX = 0,
    gridOffsetY = 0,
    enabled = true
  }) {
    this.lastParams = {
      terrainData,
      elevationData,
      rampData,
      gridSize,
      gridOffsetX,
      gridOffsetY,
      enabled
    };

    if (!enabled) {
      this.group.visible = false;
      return;
    }
    this.group.visible = true;

    // Collect instances per (model, material look)
    const instancesByVariant = new Map();

    const pushInstance = (variantKey, inst) => {
      if (!instancesByVariant.has(variantKey)) instancesByVariant.set(variantKey, []);
      instancesByVariant.get(variantKey).push(inst);
    };

    // Foundation deduplication helper so cliffs and elevated stairs don't spawn duplicate blocks
    const placedFoundations = new Set();
    const pushFoundation = (gx, gy, worldX, worldY, lvl) => {
      const fKey = `${gx},${gy},${lvl}`;
      if (placedFoundations.has(fKey)) return;
      placedFoundations.add(fKey);
      pushInstance('foundation|default', {
        x: worldX,
        y: -worldY,
        z: lvl * (gridSize * 0.5),
        rotationZ: 0,
        look: null
      });
    };

    Object.keys(terrainData).forEach(key => {
      const parts = key.split(',').map(Number);
      if (parts.length !== 2 || isNaN(parts[0]) || isNaN(parts[1])) return;
      const [gx, gy] = parts;

      const rawType = terrainData[key];
      const typeId = typeof rawType === 'string' ? rawType : rawType?.type;
      if (!typeId) return;

      const elevation = (elevationData[key] || 0);
      const worldX = gx * gridSize + gridSize / 2 + gridOffsetX;
      const worldY = gy * gridSize + gridSize / 2 + gridOffsetY;
      const worldZ = elevation * (gridSize * 0.5);

      // If tile is elevated (cliff), place supporting 3D foundation blocks underneath
      if (elevation > 0) {
        for (let lvl = 0; lvl < elevation; lvl++) {
          pushFoundation(gx, gy, worldX, worldY, lvl);
        }
      }

      // If this cell has a ramp/stair, omit the flat floor tile so it does not
      // slice through the stair treads causing z-fighting
      if (rampData && rampData[key]) {
        return;
      }

      const typeDef = PROFESSIONAL_TERRAIN_TYPES[typeId] || null;
      const modelKey = resolveTerrainModelKey(typeId, typeDef);
      const look = resolveTerrainLook(typeId, typeDef);
      const variantKey = `${modelKey}|${look.key}`;

      pushInstance(variantKey, {
        x: worldX,
        y: -worldY, // Three.js Y inverted
        z: worldZ,
        rotationZ: 0,
        look
      });
    });

    // Scan ramp / stairs
    const RAMP_DIR_ROTATIONS = {
      n: 0,
      e: -Math.PI / 2,
      s: Math.PI,
      w: Math.PI / 2
    };

    Object.keys(rampData).forEach(key => {
      const parts = key.split(',').map(Number);
      if (parts.length !== 2) return;
      const [gx, gy] = parts;
      const ramp = rampData[key];
      if (!ramp) return;

      const worldX = gx * gridSize + gridSize / 2 + gridOffsetX;
      const worldY = gy * gridSize + gridSize / 2 + gridOffsetY;
      const elevation = (elevationData[key] || 0);
      const worldZ = elevation * (gridSize * 0.5);

      // Support foundation blocks under elevated stairs
      if (elevation > 0) {
        for (let lvl = 0; lvl < elevation; lvl++) {
          pushFoundation(gx, gy, worldX, worldY, lvl);
        }
      }

      // Map ramp direction to rotation (case-insensitive)
      const rawDir = String(ramp.dir || ramp || 'n').toLowerCase();
      const rot = RAMP_DIR_ROTATIONS[rawDir] !== undefined ? RAMP_DIR_ROTATIONS[rawDir] : 0;

      // Select stair model: wood if specified or placed on wooden floor, wide, narrow, or stone
      const rawType = terrainData[key];
      const terrainTypeId = typeof rawType === 'string' ? rawType : rawType?.type;
      const isWood = ramp.type === 'wood' ||
        terrainTypeId === 'wooden_floor' ||
        terrainTypeId === 'wood_floor' ||
        terrainTypeId === 'wood_floor_dark';

      let stairModel = 'stairs';
      if (isWood) {
        stairModel = 'stairs_wood';
      } else if (ramp.type === 'narrow') {
        stairModel = 'stairs_narrow';
      } else if (ramp.type === 'wide') {
        stairModel = 'stairs_wide';
      }

      pushInstance(`${stairModel}|default`, {
        x: worldX,
        y: -worldY,
        z: worldZ,
        rotationZ: rot,
        look: null
      });
    });

    // Rebuild InstancedMeshes
    instancesByVariant.forEach((instances, variantKey) => {
      const [modelKey] = variantKey.split('|');
      const def = TERRAIN_MODEL_REGISTRY[modelKey];
      if (!def) return;

      const geomMat = modelCache.getGeometryAndMaterial(def.url);
      if (!geomMat) return; // Model still loading

      let instMesh = this.instancedMeshes.get(variantKey);
      const neededCapacity = instances.length;
      const currentCapacity = instMesh?.userData?.capacity || 0;

      if (!instMesh || currentCapacity < neededCapacity) {
        if (instMesh) {
          this.group.remove(instMesh);
          instMesh.material?.dispose();
          instMesh.dispose?.();
        }

        // Compute geometry scale to match 1 grid cell
        geomMat.geometry.computeBoundingBox();
        const bbox = geomMat.geometry.boundingBox;
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxFootprint = Math.max(size.x, size.z) || 1;
        const scaleFactor = (gridSize / maxFootprint) * (def.scale || 1.0);

        // Clone per variant so tinting one terrain type never repaints other
        // users of the same shared floor model (walls, other variants).
        const material = geomMat.material.clone();
        const look = instances[0]?.look || null;
        if (look) {
          material.color.multiply(look.tint);
          if (look.emissive) {
            material.emissive.copy(look.emissive);
            material.emissiveIntensity = look.emissiveStrength;
          }
        }

        const capacity = Math.max(instances.length * 2, 256);
        instMesh = new THREE.InstancedMesh(geomMat.geometry, material, capacity);
        instMesh.castShadow = true;
        instMesh.receiveShadow = true;
        instMesh.userData = { scaleFactor, capacity };
        this.instancedMeshes.set(variantKey, instMesh);
        this.group.add(instMesh);
      }

      const scaleFactor = instMesh.userData.scaleFactor || 1;

      // Populate instance matrices (rotate by +90 deg around X so floor is flat in X-Y plane)
      instances.forEach((inst, idx) => {
        this.dummy.position.set(inst.x, inst.y, inst.z + (def.baseZ || 0));
        this.dummy.rotation.set(Math.PI / 2, 0, inst.rotationZ, 'ZYX');
        this.dummy.scale.set(scaleFactor * 1, scaleFactor * 1, scaleFactor * 1);
        this.dummy.updateMatrix();
        instMesh.setMatrixAt(idx, this.dummy.matrix);
      });

      instMesh.count = instances.length;
      instMesh.instanceMatrix.needsUpdate = true;
    });

    // Hide any unused terrain variants
    this.instancedMeshes.forEach((mesh, key) => {
      if (!instancesByVariant.has(key)) {
        mesh.count = 0;
        mesh.instanceMatrix.needsUpdate = true;
      }
    });
  }

  dispose() {
    if (this.unsubscribeCache) {
      this.unsubscribeCache();
      this.unsubscribeCache = null;
    }
    this.scene.remove(this.group);
    this.instancedMeshes.forEach(mesh => {
      // Geometry is shared via ModelCacheService — only the cloned material
      // belongs to this manager.
      mesh.material?.dispose();
      mesh.dispose?.();
    });
    this.instancedMeshes.clear();
  }
}
