import * as THREE from 'three';
import modelCache from '../../../services/ModelCacheService';
import { PROFESSIONAL_OBJECTS } from '../objects/ObjectSystem';
import { MODEL_REGISTRY } from './ThreeDPropManager';
import { getTileElevation } from '../../../utils/ElevationUtils';

export class ThreeDGhostPreviewManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'ThreeDGhostPreview';
    this.scene.add(this.group);

    this.currentModelType = null;
    this.currentModelScene = null;
    this.currentBaseBox = null;
    this.currentNormalize = null;
    this.isWallMountGhost = false;
  }

  updatePreview({
    active = false,
    objectType = null,
    worldX = 0,
    worldY = 0,
    rotation = 0,
    rotationX = 0,
    rotationY = 0,
    scale = 1,
    elevationOffset = 0,
    gridSize = 50,
    elevationData = {},
    environmentalObjects = [],
    propManager = null,
    wallMount = null
  }) {
    if (!active || !objectType) {
      this.group.visible = false;
      return;
    }

    const objectDef = PROFESSIONAL_OBJECTS[objectType];
    const modelConfig = MODEL_REGISTRY[objectType];

    if (!objectDef || !modelConfig) {
      this.group.visible = false;
      return;
    }

    // Auto-detect underlying object for smart surface stacking
    let baseElevation = 0;
    let parentCandidate = null;

    this.isWallMountGhost = !!wallMount;
    if (wallMount) {
      // Wall-mounted placement: the mount resolver already snapped the position
      // to the wall face, aimed the prop outward and picked the mount height.
      worldX = wallMount.worldX !== undefined ? wallMount.worldX : wallMount.mountX;
      worldY = wallMount.worldY !== undefined ? wallMount.worldY : wallMount.mountY;
      rotation = wallMount.rotation;
      baseElevation = wallMount.elevation || 0;
    } else {
      for (const other of environmentalObjects) {
        const otherDef = PROFESSIONAL_OBJECTS[other.type];
        if (!otherDef) continue;
        const oScale = other.scale || 1;
        const oW = (otherDef.size?.width || 1) * gridSize * oScale;
        const oH = (otherDef.size?.height || 1) * gridSize * oScale;
        const ox = other.worldX !== undefined ? other.worldX : (other.gridX * gridSize + gridSize / 2);
        const oy = other.worldY !== undefined ? other.worldY : (other.gridY * gridSize + gridSize / 2);

        if (
          worldX >= ox - oW / 2 &&
          worldX <= ox + oW / 2 &&
          worldY >= oy - oH / 2 &&
          worldY <= oy + oH / 2
        ) {
          parentCandidate = other;
          baseElevation = (other.elevation || 0) + 1;
          break;
        }
      }

      if (!parentCandidate) {
        const gridX = Math.floor(worldX / gridSize);
        const gridY = Math.floor(worldY / gridSize);
        baseElevation = getTileElevation(elevationData, gridX, gridY) || 0;
      }
    }

    // Match the placement result exactly: a stacked object rests on the
    // parent's rendered top surface, which is usually well below one level.
    let parentTopZ = null;
    if (parentCandidate && propManager) {
      const parentCorners = propManager.getWorldBoundsCorners(parentCandidate.id);
      if (parentCorners && parentCorners.length === 8) {
        parentTopZ = parentCorners.reduce((max, c) => Math.max(max, c.z), -Infinity);
        if (!Number.isFinite(parentTopZ)) parentTopZ = null;
      }
    }

    const elevOffset = Number.isFinite(elevationOffset) ? elevationOffset : 0;
    const worldZ = (parentTopZ !== null ? parentTopZ : baseElevation * gridSize) + (elevOffset * gridSize) + (modelConfig.offsetZ || 0);

    // If model type changed, rebuild ghost mesh
    if (this.currentModelType !== objectType || !this.currentModelScene) {
      // Clear old model
      while (this.group.children.length > 0) {
        this.group.remove(this.group.children[0]);
      }

      const instance = modelCache.createInstance(modelConfig.url);
      if (!instance) {
        this.group.visible = false;
        return; // Model loading
      }

      this.currentModelType = objectType;
      this.currentModelScene = instance;

      // GLTF upright rotation
      instance.rotation.x = Math.PI / 2;

      // Unit-scale bounds captured once: measuring the live scene after the
      // ghost has been scaled feeds the scale back into itself and makes the
      // preview flicker between full size and a dot every frame.
      const bbox = new THREE.Box3().setFromObject(instance);
      const size = new THREE.Vector3();
      bbox.getSize(size);
      this.currentBaseBox = size.clone();

      // Mirror ThreeDPropManager's origin normalisation so the ghost sits on
      // the cursor exactly like the placed prop will. Kit models are not all
      // authored base-centred (statue_horse is authored several units off its
      // origin), and without this the ghost renders offset from the mouse
      // while placement itself is correct.
      this.currentNormalize = {
        x: -(bbox.min.x + bbox.max.x) / 2,
        y: -(bbox.min.y + bbox.max.y) / 2,
        z: modelConfig.groundZ !== undefined ? modelConfig.groundZ : -bbox.min.z
      };

      // Traverse and make all meshes translucent cyan-tinted ghost
      instance.traverse(child => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          if (child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            const clonedMats = mats.map(m => {
              const clone = m.clone();
              clone.transparent = true;
              clone.opacity = 0.52;
              clone.depthWrite = false;
              // Subtle cyan emissive tint to indicate placement ghost
              if (clone.emissive) {
                clone.emissive.setHex(0x0284c7);
                clone.emissiveIntensity = 0.35;
              }
              return clone;
            });
            child.material = Array.isArray(child.material) ? clonedMats : clonedMats[0];
          }
        }
      });

      this.group.add(instance);
    }

    this.group.visible = true;
    this.group.position.set(worldX, -worldY, worldZ);

    const baseRot = modelConfig.baseRotation || 0;
    const finalAngleRad = -((rotation + baseRot) * Math.PI) / 180;
    this.group.rotation.set(
      (rotationX * Math.PI) / 180,
      (rotationY * Math.PI) / 180,
      finalAngleRad
    );

    // Scale the ghost with the same fit-to-one-tile rule the placed prop uses.
    const size = this.currentBaseBox || new THREE.Vector3(1, 1, 1);
    const maxFootprint = Math.max(size.x, size.y) || 1;
    const baseScale = gridSize / maxFootprint;
    const configScale = modelConfig.scale || 1.0;
    const finalScale = baseScale * configScale * scale;

    this.currentModelScene.scale.set(finalScale, finalScale, finalScale);

    // Free-placed props are recentred on their tile and rested on the ground by
    // ThreeDPropManager; the ghost mirrors that (scaled) offset. Wall-mounted
    // fixtures keep their authored mount origin, so they stay at (0, 0, 0).
    if (this.isWallMountGhost || !this.currentNormalize) {
      this.currentModelScene.position.set(0, 0, 0);
    } else {
      const { x, y, z } = this.currentNormalize;
      this.currentModelScene.position.set(x * finalScale, y * finalScale, z * finalScale);
    }
  }

  dispose() {
    while (this.group.children.length > 0) {
      this.group.remove(this.group.children[0]);
    }
    if (this.group.parent) {
      this.group.parent.remove(this.group);
    }
  }
}
