import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { clone as cloneSkeleton } from 'three/examples/jsm/utils/SkeletonUtils';

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
   */
  createInstance(url) {
    const gltf = this.getModel(url);
    if (!gltf) return null;
    const cloned = cloneSkeleton(gltf.scene);
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = Array.isArray(child.material)
          ? child.material.map((m) => m.clone())
          : child.material.clone();
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
}

export const modelCache = new ModelCacheService();
export default modelCache;
