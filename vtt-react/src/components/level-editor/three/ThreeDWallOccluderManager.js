import * as THREE from 'three';
import { WALL_TYPES } from '../../../store/levelEditorStore';
import {
  parseWallKey,
  getWallWorldEndpoints,
  getWallHeightWorld,
  getWallThickness,
  WALL_HEIGHT_MULTIPLIERS
} from '../../../utils/WallGeometry';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';
import { getTileElevation } from '../../../utils/ElevationUtils';

/**
 * ThreeDWallOccluderManager
 *
 * Manages invisible WebGL depth occluders for all 2.5D / 2D walls.
 * Each wall writes its 3D prism into the WebGL Z-buffer (depthWrite: true, colorWrite: false).
 * This allows 3D objects (trees, chests, tokens, etc.) behind walls to be accurately occluded
 * by the walls in the 2.5D perspective, while objects in front of walls remain fully visible.
 */
export class ThreeDWallOccluderManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'ThreeDWallOccluders';
    this.scene.add(this.group);

    // Reusable dummy object for instance matrix calculations
    this.dummy = new THREE.Object3D();

    // 1x1x1 Unit box
    this.unitGeometry = new THREE.BoxGeometry(1, 1, 1);

    // Occluder material: writes depth to Z-buffer, but does NOT write color (stays transparent)
    this.occluderMaterial = new THREE.MeshBasicMaterial({
      colorWrite: false,
      depthWrite: true
    });

    this.capacity = 512;
    this.instancedMesh = new THREE.InstancedMesh(
      this.unitGeometry,
      this.occluderMaterial,
      this.capacity
    );
    this.instancedMesh.name = 'WallOccluderInstances';
    this.instancedMesh.renderOrder = -1; // Render BEFORE props so depth is primed
    this.instancedMesh.frustumCulled = false;
    this.instancedMesh.count = 0;
    this.group.add(this.instancedMesh);
  }

  updateWalls(wallData = {}, elevationData = {}, gridState = {}) {
    const wallEntries = Object.entries(wallData || {});
    if (!wallEntries.length) {
      this.instancedMesh.count = 0;
      this.instancedMesh.instanceMatrix.needsUpdate = true;
      return;
    }

    const { gridSize = 50, gridOffsetX = 0, gridOffsetY = 0 } = gridState;
    let gridSystem = null;
    try {
      gridSystem = getGridSystem();
    } catch (e) {
      gridSystem = null;
    }
    const { gridType = 'square' } = gridSystem ? gridSystem.getGridState() : {};

    // Reallocate if wall count exceeds capacity
    if (wallEntries.length > this.capacity) {
      this.group.remove(this.instancedMesh);
      this.instancedMesh.dispose();
      this.capacity = Math.max(wallEntries.length * 2, 512);
      this.instancedMesh = new THREE.InstancedMesh(
        this.unitGeometry,
        this.occluderMaterial,
        this.capacity
      );
      this.instancedMesh.renderOrder = -1;
      this.instancedMesh.frustumCulled = false;
      this.group.add(this.instancedMesh);
    }

    let instanceIdx = 0;

    for (const [key, wall] of wallEntries) {
      if (!wall) continue;
      // Open doors do NOT occlude via box occluder (players can see through doorways,
      // and ThreeDPropManager renders the 3D archway model wall_doorway.glb with an actual opening)
      if (wall.state === 'open') continue;

      const typeId = typeof wall === 'string' ? wall : wall.type;
      const typeData = WALL_TYPES[typeId] || {};

      // Open interactive doors do not occlude
      if (typeData.interactive && wall.state === 'open') continue;

      const parsed = parseWallKey(key);
      if (!parsed) continue;

      const ends = gridSystem
        ? getWallWorldEndpoints(parsed, gridSystem, gridType, wall)
        : {
            start: { x: parsed.x1 * gridSize + gridOffsetX, y: parsed.y1 * gridSize + gridOffsetY },
            end: { x: parsed.x2 * gridSize + gridOffsetX, y: parsed.y2 * gridSize + gridOffsetY }
          };
      if (!ends || !ends.start || !ends.end) continue;

      const dx = ends.end.x - ends.start.x;
      const dy = ends.end.y - ends.start.y;
      const length = Math.hypot(dx, dy);
      if (length < 1e-4) continue;

      // In SvgWallLayer, doors and windows have masonry (lintel, frame) wrapping up to full wall height.
      // We ensure the occluder box covers the full wall volume so objects behind do not peek over the lintel.
      let height = getWallHeightWorld(wall, typeData, gridSize);
      if (typeData.isWindow || typeData.interactive) {
        const fullWallHeight = (WALL_HEIGHT_MULTIPLIERS?.wall || 1.8) * gridSize;
        height = Math.max(height, fullWallHeight);
      }

      const thickness = getWallThickness(gridSize);
      // Extend box length slightly by thickness * 0.5 on each end (thickness * 1.0 total)
      // to ensure meeting walls at corners have completely seamless depth coverage without subpixel gaps.
      const occluderLength = length + thickness;

      // Center point
      const midX = (ends.start.x + ends.end.x) / 2;
      const midY = (ends.start.y + ends.end.y) / 2;

      // Base elevation: sample both adjacent sides of the wall to correctly elevate retaining walls
      let elevation = 0;
      if (wall.elevation !== undefined) {
        elevation = wall.elevation;
      } else if (elevationData && Object.keys(elevationData).length > 0) {
        const nx = length > 1e-4 ? -dy / length : 0;
        const ny = length > 1e-4 ? dx / length : 0;
        const sampleDist = Math.max(5, gridSize * 0.2);
        const gx1 = Math.floor((midX + nx * sampleDist - gridOffsetX) / gridSize);
        const gy1 = Math.floor((midY + ny * sampleDist - gridOffsetY) / gridSize);
        const gx2 = Math.floor((midX - nx * sampleDist - gridOffsetX) / gridSize);
        const gy2 = Math.floor((midY - ny * sampleDist - gridOffsetY) / gridSize);
        const e1 = getTileElevation(elevationData, gx1, gy1) || 0;
        const e2 = getTileElevation(elevationData, gx2, gy2) || 0;
        elevation = Math.max(e1, e2);
      }
      const baseZ = elevation * (gridSize * 0.5);

      // In Three.js: +Y is North (-dy in screen space)
      const angleRad = Math.atan2(-dy, dx);

      // Position: bottom of box is at baseZ, so center is at baseZ + height / 2
      this.dummy.position.set(midX, -midY, baseZ + height / 2);
      this.dummy.rotation.set(0, 0, angleRad);
      this.dummy.scale.set(occluderLength, thickness, height);
      this.dummy.updateMatrix();

      this.instancedMesh.setMatrixAt(instanceIdx, this.dummy.matrix);
      instanceIdx++;
    }

    this.instancedMesh.count = instanceIdx;
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  dispose() {
    this.scene.remove(this.group);
    this.unitGeometry.dispose();
    this.occluderMaterial.dispose();
    this.instancedMesh.dispose();
  }
}

export default ThreeDWallOccluderManager;
