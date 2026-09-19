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

// Authentic 1024x1024 PBR terrain textures from public/assets/tiles/
export const TERRAIN_TEXTURE_MAP = {
  grass: '/assets/tiles/Grass1.png',
  dirt: '/assets/tiles/Dirt1.png',
  stone: '/assets/tiles/Stone1.png',
  sand: '/assets/tiles/Sand1.png',
  water: '/assets/tiles/Water1.png',
  cobblestone: '/assets/tiles/Cobble1.png',
  dungeon_floor: '/assets/tiles/Dungeon1.png',
  marble_floor: '/assets/tiles/Marble1.png',
  wooden_floor: '/assets/tiles/Wood1.png',
  wood_floor: '/assets/tiles/Wood1.png',
  snow: '/assets/tiles/Snow1.png',
  mud: '/assets/tiles/Mud1.png',
  swamp: '/assets/tiles/Swamp1.png',
  ice: '/assets/tiles/Ice1.png',
  fungal_growth: '/assets/tiles/Fungal1.png',
  lava: '/assets/tiles/Lava1.png',
  acid: '/assets/tiles/Acid1.png',
  pit: '/assets/tiles/Pit1.png',
  abyss: '/assets/tiles/Abyss1.png',
  crystal_floor: '/assets/tiles/Crystal1.png',
  gold_floor: '/assets/tiles/Gold1.png'
};

export const TERRAIN_MATERIAL_CONFIGS = {
  grass: { roughness: 0.85, metalness: 0.05 },
  sand: { roughness: 0.95, metalness: 0.0 },
  snow: { roughness: 0.7, metalness: 0.1 },
  ice: { roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.92 },
  water: { roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.85 },
  lava: { emissive: 0xff5500, emissiveIntensity: 0.85, roughness: 0.65 },
  acid: { emissive: 0x33ff00, emissiveIntensity: 0.6, roughness: 0.35 },
  crystal_floor: { emissive: 0x00e5ff, emissiveIntensity: 0.45, roughness: 0.3 },
  gold_floor: { roughness: 0.3, metalness: 0.85 },
  fungal_growth: { emissive: 0x9900ff, emissiveIntensity: 0.4, roughness: 0.7 },
  cobblestone: { roughness: 0.7, metalness: 0.05 },
  marble_floor: { roughness: 0.25, metalness: 0.05 },
  wooden_floor: { roughness: 0.65, metalness: 0.05 },
  wood_floor: { roughness: 0.65, metalness: 0.05 },
  dirt: { roughness: 0.9, metalness: 0.0 },
  stone: { roughness: 0.75, metalness: 0.05 },
  mud: { roughness: 0.9, metalness: 0.0 },
  swamp: { roughness: 0.8, metalness: 0.05 },
  dungeon_floor: { roughness: 0.7, metalness: 0.05 },
  abyss: { roughness: 0.95, color: 0x111115 },
  pit: { roughness: 0.95, color: 0x222225 }
};

const textureCache = new Map();
export function getTerrainTexture(url) {
  if (!url || typeof document === 'undefined') return null;
  if (!textureCache.has(url)) {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(url, () => {
      tex.needsUpdate = true;
    });
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    if (THREE.SRGBColorSpace) {
      tex.colorSpace = THREE.SRGBColorSpace;
    }
    textureCache.set(url, tex);
  }
  return textureCache.get(url);
}

let cachedFloorGeom = null;
function getTexturedFloorGeometry() {
  if (!cachedFloorGeom) {
    cachedFloorGeom = new THREE.BoxGeometry(1, 0.2, 1);
    cachedFloorGeom.translate(0, -0.1, 0);
  }
  return cachedFloorGeom;
}

export function resolveTerrainModelKey(typeId, typeDef) {
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

  // If this terrain type has an authentic high-resolution texture:
  if (TERRAIN_TEXTURE_MAP[type] || typeDef?.tileVariations?.[0]) {
    return type;
  }

  return 'stone_floor';
}

export const EMISSIVE_TERRAIN = {
  lava: 0.85,
  acid: 0.6,
  fungal_growth: 0.4,
  crystal_floor: 0.45,
  gold_floor: 0.3
};

export function resolveTerrainLook(typeId, typeDef) {
  const baseColor = new THREE.Color(typeDef?.color || '#8a8a8a');
  const config = TERRAIN_MATERIAL_CONFIGS[typeId] || {};
  const emissiveStrength = config.emissiveIntensity || EMISSIVE_TERRAIN[typeId] || 0;
  const emissive = config.emissive ? new THREE.Color(config.emissive) : (emissiveStrength > 0 ? baseColor.clone() : null);

  return {
    typeId,
    tint: baseColor,
    emissive,
    emissiveStrength,
    key: `${typeId}:${baseColor.getHexString()}:${emissive ? emissive.getHexString() : 'none'}`
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
      const isKitModel = Boolean(def);

      let geometry = null;
      let material = null;
      let baseZ = 0;
      let scaleFactor = 1;

      if (isKitModel) {
        const geomMat = modelCache.getGeometryAndMaterial(def.url);
        if (!geomMat) return; // Model still loading

        geometry = geomMat.geometry;
        material = geomMat.material.clone();
        baseZ = def.baseZ || 0;

        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox;
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const maxFootprint = Math.max(size.x, size.z) || 1;
        scaleFactor = (gridSize / maxFootprint) * (def.scale || 1.0);

        const look = instances[0]?.look || null;
        if (look) {
          material.color.multiply(look.tint);
          if (look.emissive) {
            material.emissive.copy(look.emissive);
            material.emissiveIntensity = look.emissiveStrength;
          }
        }
      } else {
        // Authentic PBR Textured Floor Tile
        geometry = getTexturedFloorGeometry();
        baseZ = 0;
        scaleFactor = gridSize;

        const look = instances[0]?.look || null;
        const typeId = look?.typeId || modelKey;
        const typeDef = PROFESSIONAL_TERRAIN_TYPES[typeId] || null;
        const textureUrl = TERRAIN_TEXTURE_MAP[typeId] || typeDef?.tileVariations?.[0] || null;
        const config = TERRAIN_MATERIAL_CONFIGS[typeId] || {};
        const baseColor = new THREE.Color(typeDef?.color || '#8a8a8a');

        const matParams = {
          roughness: config.roughness ?? 0.8,
          metalness: config.metalness ?? 0.05,
          transparent: config.transparent ?? false,
          opacity: config.opacity ?? 1.0,
          color: config.color ? new THREE.Color(config.color) : baseColor.clone()
        };

        if (textureUrl) {
          const tex = getTerrainTexture(textureUrl);
          if (tex) {
            matParams.map = tex;
            // Lerp baseColor slightly toward white so the authentic texture colors show vividly
            matParams.color.lerp(WHITE, 0.65);
          }
          if (config.emissive) {
            matParams.emissive = new THREE.Color(config.emissive);
            matParams.emissiveIntensity = config.emissiveIntensity ?? 0.6;
            if (tex) matParams.emissiveMap = tex;
          }
        } else if (config.emissive) {
          matParams.emissive = new THREE.Color(config.emissive);
          matParams.emissiveIntensity = config.emissiveIntensity ?? 0.6;
        }

        material = new THREE.MeshStandardMaterial(matParams);
      }

      let instMesh = this.instancedMeshes.get(variantKey);
      const neededCapacity = instances.length;
      const currentCapacity = instMesh?.userData?.capacity || 0;

      if (!instMesh || currentCapacity < neededCapacity) {
        if (instMesh) {
          this.group.remove(instMesh);
          instMesh.material?.dispose();
          instMesh.dispose?.();
        }

        const capacity = Math.max(instances.length * 2, 256);
        instMesh = new THREE.InstancedMesh(geometry, material, capacity);
        instMesh.castShadow = true;
        instMesh.receiveShadow = true;
        instMesh.userData = { scaleFactor, baseZ, capacity };
        this.instancedMeshes.set(variantKey, instMesh);
        this.group.add(instMesh);
      } else {
        // Keep updated scale factor and baseZ
        instMesh.userData.scaleFactor = scaleFactor;
        instMesh.userData.baseZ = baseZ;
      }

      const activeScale = instMesh.userData.scaleFactor || 1;
      const activeBaseZ = instMesh.userData.baseZ || 0;

      // Populate instance matrices (rotate by +90 deg around X so floor is flat in X-Y plane)
      instances.forEach((inst, idx) => {
        this.dummy.position.set(inst.x, inst.y, inst.z + activeBaseZ);
        this.dummy.rotation.set(Math.PI / 2, 0, inst.rotationZ, 'ZYX');
        this.dummy.scale.set(activeScale, activeScale, activeScale);
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
