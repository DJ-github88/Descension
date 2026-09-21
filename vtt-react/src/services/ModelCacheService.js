import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils';

// Several CC0 model packs (notably the dedicated `walls/*.glb` set) are
// authored with KHR_materials_unlit, which three.js loads as MeshBasicMaterial.
// Unlit meshes ignore the map's sun, ambient level and shadows entirely, so the
// editor's lighting settings had no effect on those walls, doors and gates.
// Swap them for lit standard materials that keep the authored colour/texture.
function upgradeUnlitMaterial(material) {
  if (!material || !material.isMeshBasicMaterial) return material;

  const lit = new THREE.MeshStandardMaterial({
    name: material.name,
    color: material.color ? material.color.clone() : new THREE.Color(0xffffff),
    map: material.map || null,
    alphaMap: material.alphaMap || null,
    aoMap: material.aoMap || null,
    vertexColors: material.vertexColors,
    transparent: material.transparent,
    opacity: material.opacity,
    alphaTest: material.alphaTest,
    side: material.side,
    depthTest: material.depthTest,
    depthWrite: material.depthWrite,
    toneMapped: material.toneMapped,
    roughness: 0.8,
    metalness: 0.1
  });
  lit.userData = { ...(material.userData || {}) };
  return lit;
}

export function ensureLitMaterials(material) {
  if (Array.isArray(material)) return material.map(upgradeUnlitMaterial);
  return upgradeUnlitMaterial(material);
}

class ModelCacheService {
  constructor() {
    this.loader = new GLTFLoader();
    this.cache = new Map(); // url -> Promise<GLTF>
    this.loadedModels = new Map(); // url -> GLTF
    this.subscribers = new Set();
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('[ModelCacheService] Subscriber notification error:', e);
      }
    });
  }

  loadModel(url) {
    if (!url) return Promise.reject(new Error('Model URL is required'));

    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    const promise = new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          // Configure shadows and texture filters for pixel-art / stylized aesthetic
          gltf.scene.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                // Keep vibrant stylized colors
                child.material.roughness = 0.8;
                child.material.metalness = 0.1;
                if (child.material.map) {
                  // Crisp texture sampling for low-poly/pixel models
                  child.material.map.magFilter = THREE.NearestFilter;
                  child.material.map.minFilter = THREE.NearestMipmapLinearFilter;
                  child.material.map.needsUpdate = true;
                }
              }
            }
          });

          this.loadedModels.set(url, gltf);
          resolve(gltf);
          this.notify();
        },
        undefined,
        (err) => {
          console.error(`[ModelCacheService] Failed to load model at ${url}:`, err);
          this.cache.delete(url);
          reject(err);
        }
      );
    });

    this.cache.set(url, promise);
    return promise;
  }

  getModel(url) {
    return this.loadedModels.get(url) || null;
  }

  isLoaded(url) {
    return this.loadedModels.has(url);
  }

  /**
   * Clone a loaded model scene safely with all hierarchies preserved.
   * Materials are cloned per instance so per-object effects (fog opacity,
   * highlight states) never leak onto every other instance of the same model.
   *
   * Unlit (KHR_materials_unlit) materials become lit standard materials here so
   * placed walls, doors, gates and other props respond to the map's sun,
   * ambient level and shadows instead of rendering flat. Terrain reads the
   * master materials through getMeshParts and keeps its own look, so this only
   * affects rendered instances.
   */
  createInstance(url) {
    const gltf = this.getModel(url);
    if (!gltf) return null;
    const cloned = cloneSkeleton(gltf.scene);
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = Array.isArray(child.material)
          ? child.material.map((m) => ensureLitMaterials(m.clone()))
          : ensureLitMaterials(child.material.clone());
      }
    });
    cloned.animations = gltf.animations || [];
    return cloned;
  }

  /**
   * Extract master geometry & material for InstancedMesh rendering
   */
  getGeometryAndMaterial(url) {
    const gltf = this.getModel(url);
    if (!gltf) return null;

    let geometry = null;
    let material = null;

    gltf.scene.traverse((child) => {
      if (child.isMesh && !geometry) {
        geometry = child.geometry;
        material = child.material;
      }
    });

    return geometry && material ? { geometry, material } : null;
  }

  /**
   * Every primitive of a model, in order: one entry per material. Kit tiles
   * like Kenney's river pieces draw ground + banks + water as separate
   * primitives, so instanced renderers need one InstancedMesh per entry to
   * keep every material.
   */
  getMeshParts(url) {
    const gltf = this.getModel(url);
    if (!gltf) return null;

    const parts = [];
    gltf.scene.traverse((child) => {
      if (!child.isMesh) return;
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material, index) => {
        if (!material) return;
        parts.push({
          geometry: child.geometry,
          material,
          name: material.name || `part_${index}`
        });
      });
    });

    return parts.length ? parts : null;
  }
}

export const modelCache = new ModelCacheService();
export default modelCache;
