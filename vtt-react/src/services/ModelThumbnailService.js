import * as THREE from 'three';
import modelCache from './ModelCacheService';

/**
 * ModelThumbnailService
 *
 * Generates and caches offscreen WebGL isometric snapshots of 3D GLTF models
 * with transparent backgrounds, soft studio lighting, and contact shadows.
 * This completely replaces 2D pixel-art placeholder sprites in the UI.
 */
class ModelThumbnailService {
  constructor() {
    this.cache = new Map();
    this.listeners = new Set();
    this.pending = new Set();

    this.width = 128;
    this.height = 128;
    this.canvas = null;
    this.renderer = null;
    this.scene = null;
    this.camera = null;
  }

  initOffscreenRenderer() {
    if (this.renderer) return;
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.scene = new THREE.Scene();

    // Studio lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    this.scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff3e0, 1.8);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 512;
    keyLight.shadow.mapSize.height = 512;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    const d = 3.5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.001;
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8bc34a, 0.4);
    fillLight.position.set(-4, 2, -3);
    this.scene.add(fillLight);

    // Ground plane to capture soft contact shadow
    const shadowGeo = new THREE.PlaneGeometry(10, 10);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.35 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -0.01;
    shadowPlane.receiveShadow = true;
    this.scene.add(shadowPlane);

    // Isometric Orthographic Camera
    const aspect = 1;
    const camSize = 1.35;
    this.camera = new THREE.OrthographicCamera(
      -camSize * aspect,
      camSize * aspect,
      camSize,
      -camSize,
      0.1,
      50
    );
    // 35.264 deg pitch isometric view
    this.camera.position.set(3, 2.5, 3);
    this.camera.lookAt(0, 0.35, 0);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.listeners.forEach(fn => {
      try { fn(); } catch (e) { console.error('Thumbnail listener error:', e); }
    });
  }

  getThumbnail(url, scaleMultiplier = 1.0) {
    if (!url) return null;
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // Trigger asynchronous render
    this.requestRender(url, scaleMultiplier);
    return null;
  }

  async requestRender(url, scaleMultiplier = 1.0) {
    if (this.pending.has(url)) return;
    this.pending.add(url);

    try {
      if (!modelCache.isLoaded(url)) {
        await modelCache.loadModel(url);
      }

      this.initOffscreenRenderer();
      if (!this.renderer) return;

      const instance = modelCache.createInstance(url);
      if (!instance) return;

      // Compute bounding box to center and scale uniformly
      const bbox = new THREE.Box3().setFromObject(instance);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      bbox.getCenter(center);
      bbox.getSize(size);

      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      const fitScale = (1.5 / maxDim) * scaleMultiplier;

      instance.scale.set(fitScale, fitScale, fitScale);
      // Center horizontally, sit bottom on ground (y = 0)
      instance.position.set(
        -center.x * fitScale,
        -bbox.min.y * fitScale,
        -center.z * fitScale
      );

      // Enable shadows for all meshes
      instance.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(instance);
      this.renderer.render(this.scene, this.camera);

      const dataUrl = this.canvas.toDataURL('image/png');
      this.scene.remove(instance);

      this.cache.set(url, dataUrl);
      this.notify();
    } catch (err) {
      console.warn('Failed to render 3D thumbnail for', url, err);
    } finally {
      this.pending.delete(url);
    }
  }
}

export const modelThumbnailService = new ModelThumbnailService();
export default modelThumbnailService;
