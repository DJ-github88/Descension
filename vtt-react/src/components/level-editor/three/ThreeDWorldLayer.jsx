import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import useGameStore from '../../../store/gameStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import modelCache from '../../../services/ModelCacheService';
import { ThreeDPropManager } from './ThreeDPropManager';
import { ThreeDTerrainManager } from './ThreeDTerrainManager';
import { ThreeDInteractionHandler } from './ThreeDInteractionHandler';
import { ThreeDWallOccluderManager } from './ThreeDWallOccluderManager';
import { ThreeDWallManager } from './ThreeDWallManager';
import { ThreeDLightingManager } from './ThreeDLightingManager';
import { ThreeDGhostPreviewManager } from './ThreeDGhostPreviewManager';
import { applySunOnlyShadowMask } from './sunOnlyShadowMask';
import { PROFESSIONAL_OBJECTS } from '../objects/ObjectSystem';
import { resolveWallMountPlacement } from '../objects/wallAttachment';
import { getGridSystem } from '../../../utils/InfiniteGridSystem';

export const ThreeDWorldLayer = ({ width, height }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rigRef = useRef(null);
  const pitchGroupRef = useRef(null);
  const propManagerRef = useRef(null);
  const terrainManagerRef = useRef(null);
  const wallOccluderManagerRef = useRef(null);
  const wallManagerRef = useRef(null);
  const lightingManagerRef = useRef(null);
  const ghostPreviewManagerRef = useRef(null);
  const mousePosRef = useRef({ screenX: 0, screenY: 0, active: false });
  const interactionHandlerRef = useRef(null);
  const shadowMaterialRef = useRef(null);
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(performance.now());
  // Structural (non-fog) inputs of the prop/wall passes. Shadow maps must be
  // re-rendered when geometry moves, but not when only fog visibility flips.
  const propsStructuralRef = useRef(null);
  const wallsStructuralRef = useRef(null);

  // Camera & View Store
  const cameraX = useGameStore(state => state.cameraX);
  const cameraY = useGameStore(state => state.cameraY);
  const zoomLevel = useGameStore(state => state.zoomLevel);
  const playerZoom = useGameStore(state => state.playerZoom);
  const viewMode = useGameStore(state => state.viewMode);
  const viewRotation = useGameStore(state => state.viewRotation || 0);
  const viewTilt = useGameStore(state => state.viewTilt || (viewMode === '2d' ? 90 : 30));
  const gridSize = useGameStore(state => state.gridSize || 50);
  const gridOffsetX = useGameStore(state => state.gridOffsetX || 0);
  const gridOffsetY = useGameStore(state => state.gridOffsetY || 0);

  // Editor / Map Data Store
  const environmentalObjects = useLevelEditorStore(state => state.environmentalObjects || []);
  const wallData = useLevelEditorStore(state => state.wallData || {});
  const terrainData = useLevelEditorStore(state => state.terrainData || {});
  const elevationData = useLevelEditorStore(state => state.elevationData || {});
  const rampData = useLevelEditorStore(state => state.rampData || {});
  const terrain3DEnabled = useLevelEditorStore(state => state.terrain3DEnabled);
  const walls3DEnabled = useLevelEditorStore(state => state.walls3DEnabled ?? true);
  const selectedTool = useLevelEditorStore(state => state.selectedTool);
  const toolSettings = useLevelEditorStore(state => state.toolSettings || {});
  const isGMMode = useGameStore(state => state.isGMMode);
  const isEditorMode = useLevelEditorStore(state => state.isEditorMode);
  const fogOfWarEnabled = useLevelEditorStore(state => state.fogOfWarEnabled);
  const viewingFromToken = useLevelEditorStore(state => state.viewingFromToken);
  const visibleArea = useLevelEditorStore(state => state.visibleArea);
  const controlledVisibleTiles = useLevelEditorStore(state => state.controlledVisibleTiles);
  // NOTE: visibilityPolygon is deliberately NOT subscribed here. It gets a new
  // identity on every visibility recalculation (up to 20x/s while walking), and
  // nothing in the 3D managers reads it — the fog passes key off visibleAreaSet
  // and the explored-memory identities below instead.
  // Explored-memory identities: the 3D fog pass must re-run when a tile becomes
  // explored, but only on real memory writes — not on every visibility recalc.
  const exploredAreas = useLevelEditorStore(state => state.exploredAreas);
  const playerMemories = useLevelEditorStore(state => state.playerMemories);
  const isPlayerPositionExplored = useLevelEditorStore(state => state.isPlayerPositionExplored);
  const lightSources = useLevelEditorStore(state => state.lightSources || {});
  const lightingEnabled = useLevelEditorStore(state => state.lightingEnabled);
  const ambientLightLevel = useLevelEditorStore(state => state.ambientLightLevel);
  const sunSettings = useLevelEditorStore(state => state.sunSettings);
  const wallShadowsEnabled = useLevelEditorStore(state => state.wallShadowsEnabled);
  const lightAnimations = useLevelEditorStore(state => state.lightAnimations);
  const performanceMode = useLevelEditorStore(state => state.performanceMode);
  const shadowQuality = useLevelEditorStore(state => state.shadowQuality || 'high');

  const visibleAreaSet = useMemo(() => {
    if (!visibleArea) return null;
    const set = new Set(visibleArea instanceof Set ? visibleArea : visibleArea);
    if (controlledVisibleTiles) controlledVisibleTiles.forEach(t => set.add(t));
    return set;
  }, [visibleArea, controlledVisibleTiles]);

  const effectiveZoom = zoomLevel * playerZoom;

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // The canvas is created here (not via JSX) so every effect run gets a
    // FRESH canvas. Reusing a canvas whose WebGL context was lost throws
    // inside the WebGLRenderer constructor ("reading 'precision'"), which is
    // how a dead context used to take the whole app down on remount/HMR.
    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const w = width || window.innerWidth;
    const h = height || window.innerHeight;

    // Renderer
    let renderer;
    try {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl || !gl.getShaderPrecisionFormat || !gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT)) {
        console.warn('[ThreeDWorldLayer] WebGL is not supported or context unavailable');
        canvas.remove();
        return undefined;
      }
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      console.error('[ThreeDWorldLayer] Failed to create WebGL renderer:', err);
      canvas.remove();
      return undefined;
    }
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera Rig for 1:1 match with ProjectionSystem
    const camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 8000);
    cameraRef.current = camera;

    const rig = new THREE.Group();
    rig.name = 'CameraRig';
    scene.add(rig);
    rigRef.current = rig;

    const pitchGroup = new THREE.Group();
    pitchGroup.name = 'CameraPitchGroup';
    rig.add(pitchGroup);
    pitchGroupRef.current = pitchGroup;

    camera.position.set(0, 0, 2500);
    camera.lookAt(0, 0, 0);
    pitchGroup.add(camera);

    // Ground Shadow Receiver Plane (captures PCF soft shadows onto the transparent canvas)
    const shadowGeo = new THREE.PlaneGeometry(100000, 100000);
    const shadowMat = applySunOnlyShadowMask(new THREE.ShadowMaterial({
      opacity: 0.42,
      depthWrite: false
    }));
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.name = 'GroundShadowReceiver';
    shadowPlane.position.set(0, 0, -0.05);
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);
    shadowMaterialRef.current = shadowMat;

    // Shadow maps only re-render when something actually changed (the sun
    // anchor crossed a cell, geometry/lights updated, doors animating). The
    // lighting manager owns the per-light dirty flags; this renderer-level
    // flag is flipped from its consumeShadowDirty() in the render loop.
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.needsUpdate = true;

    // Lighting is driven by the map's own lighting model (sun settings,
    // ambient level and placed light sources) via ThreeDLightingManager.
    const lightingManager = new ThreeDLightingManager(scene);
    lightingManagerRef.current = lightingManager;

    // Subsystem Managers
    const propManager = new ThreeDPropManager(scene);
    propManagerRef.current = propManager;

    const terrainManager = new ThreeDTerrainManager(scene);
    terrainManagerRef.current = terrainManager;

    const wallOccluderManager = new ThreeDWallOccluderManager(scene);
    wallOccluderManagerRef.current = wallOccluderManager;

    const wallManager = new ThreeDWallManager(scene);
    wallManagerRef.current = wallManager;

    const ghostPreviewManager = new ThreeDGhostPreviewManager(scene);
    ghostPreviewManagerRef.current = ghostPreviewManager;

    const interactionHandler = new ThreeDInteractionHandler(camera, propManager);
    interactionHandlerRef.current = interactionHandler;

    // Dynamic camera and light synchronization helper
    const syncCamera = (gs) => {
      const camX = gs.cameraX || 0;
      const camY = gs.cameraY || 0;
      const effZoom = (gs.zoomLevel || 1) * (gs.playerZoom || 1);
      const vRot = gs.viewRotation || 0;
      const vTilt = gs.viewTilt;
      const vMode = gs.viewMode || '2d';

      if (rig.position.x !== camX || rig.position.y !== -camY) {
        rig.position.set(camX, -camY, 0);
      }

      const validZoom = Number.isFinite(effZoom) && effZoom > 0 ? effZoom : 1;
      if (Math.abs(camera.zoom - validZoom) > 1e-4) {
        camera.zoom = validZoom;
        camera.updateProjectionMatrix();
      }

      const yawDeg = ((vRot % 360) + 360) % 360;
      const targetRotZ = -(yawDeg * Math.PI) / 180;
      if (Math.abs(rig.rotation.z - targetRotZ) > 1e-4) {
        rig.rotation.z = targetRotZ;
      }

      const activeTilt = vMode === '2d' ? 90 : Math.max(15, Math.min(90, vTilt !== undefined ? vTilt : 30));
      const targetPitchX = ((90 - activeTilt) * Math.PI) / 180;
      if (Math.abs(pitchGroup.rotation.x - targetPitchX) > 1e-4) {
        pitchGroup.rotation.x = targetPitchX;
      }

      // Keep the map sun anchored to its world-space shadow tile (not to the
      // camera): the manager re-anchors and flags the sun map only when the
      // camera crosses an anchor cell, so panning does not re-render shadows.
      if (lightingManagerRef.current) {
        lightingManagerRef.current.syncCamera(camX, camY);
      }
    };

    // Render loop
    let isRunning = true;
    const animate = () => {
      if (!isRunning) return;
      animFrameRef.current = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Update interactive animations (chests/doors)
      if (propManager.updateAnimations(delta)) {
        lightingManagerRef.current.markAllShadowsDirty();
      }

      // Animate flickering light sources
      if (lightingManagerRef.current) {
        lightingManagerRef.current.updateAnimations(delta);
      }

      // Scroll the liquid terrain sheets (water/ice/lava/acid ripples)
      if (terrainManagerRef.current) {
        terrainManagerRef.current.updateAnimations(delta);
      }

      // Update 3D ghost placement preview
      if (ghostPreviewManagerRef.current) {
        const mPos = mousePosRef.current;
        const curEditorState = useLevelEditorStore.getState();
        if (mPos.active && curEditorState.isEditorMode && curEditorState.selectedTool === 'object_place') {
          try {
            const gs = getGridSystem();
            const vp = gs.getViewportDimensions();
            const worldPos = gs.screenToWorld(mPos.screenX, mPos.screenY, vp.width, vp.height);
            const curGame = useGameStore.getState();
            const objectType = curEditorState.toolSettings?.selectedObjectType;
            const objectDef = objectType ? PROFESSIONAL_OBJECTS[objectType] : null;
            const gridSize = curGame.gridSize || 50;
            const gridOffsetX = curGame.gridOffsetX || 0;
            const gridOffsetY = curGame.gridOffsetY || 0;
            const elevationData = curEditorState.elevationData || {};

            let wallMount = null;
            if (curEditorState.toolSettings?.snapToWall && (objectDef?.wallMountable || objectDef?.wallSideSnap)) {
              wallMount = resolveWallMountPlacement({
                objectDef,
                worldX: worldPos.x,
                worldY: worldPos.y,
                screenX: mPos.screenX,
                screenY: mPos.screenY,
                wallData: curEditorState.wallData || {},
                elevationData,
                gridSize,
                gridOffsetX,
                gridOffsetY,
                gridSystem: gs,
                snapToWall: true
              });
            }

            ghostPreviewManagerRef.current.updatePreview({
              active: true,
              objectType,
              worldX: worldPos.x,
              worldY: worldPos.y,
              rotation: curEditorState.toolSettings?.objectRotation || 0,
              rotationX: curEditorState.toolSettings?.objectRotationX || 0,
              rotationY: curEditorState.toolSettings?.objectRotationY || 0,
              scale: curEditorState.toolSettings?.objectScale || 1,
              elevationOffset: curEditorState.toolSettings?.objectElevation || 0,
              gridSize,
              elevationData,
              environmentalObjects: curEditorState.environmentalObjects || [],
              propManager: propManagerRef.current,
              wallMount
            });
          } catch (e) {
            ghostPreviewManagerRef.current.updatePreview({ active: false });
          }
        } else {
          ghostPreviewManagerRef.current.updatePreview({ active: false });
        }
      }

      // Frame-accurate camera synchronization with gameStore (eliminates drag latency/drifting)
      syncCamera(useGameStore.getState());

      // One renderer-level flag gates every shadow pass; the manager keeps the
      // per-light flags and only reports dirty when a map truly needs work.
      if (lightingManagerRef.current.consumeShadowDirty()) {
        renderer.shadowMap.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Subscribe to model preloading notifications
    const unsubscribe = modelCache.subscribe(() => {
      if (propManagerRef.current) {
        const objs = useLevelEditorStore.getState().environmentalObjects || [];
        const wData = useLevelEditorStore.getState().wallData || {};
        const gs = useGameStore.getState();
        const les = useLevelEditorStore.getState();
        const gridState = {
          gridSize: gs.gridSize || 50,
          gridOffsetX: gs.gridOffsetX || 0,
          gridOffsetY: gs.gridOffsetY || 0
        };
        const fogState = {
          fogOfWarEnabled: les.fogOfWarEnabled,
          isEditorMode: les.isEditorMode,
          isGMMode: gs.isGMMode,
          viewingFromToken: les.viewingFromToken,
          isPlayerPositionExplored: les.isPlayerPositionExplored,
          visibleAreaSet: les.visibleArea ? new Set(les.visibleArea) : null
        };

        propManagerRef.current.updateObjects(objs, gridState, fogState, wData, les.elevationData || {});
        propManagerRef.current.updateWallDoors(wData, gridState, fogState, les.elevationData || {});
        propManagerRef.current.updateLightProps(les.lightSources || {}, gridState, fogState, les.elevationData || {});

        if (wallManagerRef.current && les.walls3DEnabled !== false) {
          wallManagerRef.current.updateWalls(wData, les.elevationData || {}, gridState, fogState);
        }

        // A prop that was still loading when it got selected was drawn with the
        // tile footprint chrome; now that its model exists, ask the 2D overlay
        // to repaint so the frame snaps to the rendered figure.
        if (typeof window !== 'undefined' && window.__vttObjectSystemRefresh) {
          window.__vttObjectSystemRefresh();
        }
      }
      if (terrainManagerRef.current) {
        const gs = useGameStore.getState();
        terrainManagerRef.current.updateTerrain({
          terrainData: useLevelEditorStore.getState().terrainData || {},
          elevationData: useLevelEditorStore.getState().elevationData || {},
          rampData: useLevelEditorStore.getState().rampData || {},
          gridSize: gs.gridSize || 50,
          gridOffsetX: gs.gridOffsetX || 0,
          gridOffsetY: gs.gridOffsetY || 0,
          enabled: useLevelEditorStore.getState().terrain3DEnabled ?? false
        });
      }
      lightingManager.markAllShadowsDirty();
    });

    // Capture pointer clicks on interactive 3D objects without blocking canvas pass-through
    const handleGlobalPointerDown = (e) => {
      if (!interactionHandlerRef.current) return;
      // Only process if clicking inside the canvas viewport
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const handled = interactionHandlerRef.current.handlePointerDown(e, rect);
        if (handled) {
          e.stopPropagation();
        }
      }
    };

    const handlePointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        mousePosRef.current = {
          screenX: e.clientX - rect.left,
          screenY: e.clientY - rect.top,
          active: true
        };
      } else {
        mousePosRef.current.active = false;
      }
    };

    const handlePointerLeave = () => {
      mousePosRef.current.active = false;
      if (ghostPreviewManagerRef.current) {
        ghostPreviewManagerRef.current.updatePreview({ active: false });
      }
    };

    window.addEventListener('pointerdown', handleGlobalPointerDown, { capture: true });
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    // Browsers cap live WebGL contexts (~16) and silently kill the oldest one
    // when the limit is hit — which looks like the app "crashing" (black map,
    // no JS error). Log context loss so it reaches the error tracker, and
    // release the context explicitly on unmount so remounts never stack up.
    const handleContextLost = (event) => {
      event.preventDefault();
      console.error('[ThreeDWorldLayer] WebGL context lost — 3D layer will attempt to restore');
    };
    const handleContextRestored = () => {
      console.warn('[ThreeDWorldLayer] WebGL context restored');
      renderer.shadowMap.needsUpdate = true;
    };
    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      isRunning = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('pointerdown', handleGlobalPointerDown, { capture: true });
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('webglcontextlost', handleContextLost, false);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored, false);
      unsubscribe();
      propManager.dispose();
      terrainManager.dispose();
      wallOccluderManager.dispose();
      wallManager.dispose();
      lightingManager.dispose();
      ghostPreviewManager.dispose();
      renderer.dispose();
      if (canvas.parentNode) {
        canvas.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Viewport Size
  useEffect(() => {
    const w = width || window.innerWidth;
    const h = height || window.innerHeight;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (renderer && camera) {
      renderer.setSize(w, h);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();
    }
  }, [width, height]);

  // Synchronize Camera & Shadows with ProjectionSystem
  useEffect(() => {
    const camera = cameraRef.current;
    const rig = rigRef.current;
    const pitchGroup = pitchGroupRef.current;
    if (!camera || !rig || !pitchGroup) return;

    // Camera Rig position corresponds directly to VTT Camera Center
    // Three.js: X = cameraX, Y = -cameraY
    rig.position.set(cameraX, -cameraY, 0);

    // Zoom level
    camera.zoom = Number.isFinite(effectiveZoom) && effectiveZoom > 0 ? effectiveZoom : 1;
    camera.updateProjectionMatrix();

    // Yaw rotation: EXACT match with ProjectionSystem is -yawDeg
    const yawDeg = ((viewRotation % 360) + 360) % 360;
    rig.rotation.z = - (yawDeg * Math.PI) / 180;

    // Tilt: 90 is top-down (pitch = 0), 30 is isometric (pitch = 60 deg)
    const activeTilt = viewMode === '2d' ? 90 : Math.max(15, Math.min(90, viewTilt));
    const pitchAngleRad = ((90 - activeTilt) * Math.PI) / 180;
    pitchGroup.rotation.x = pitchAngleRad;

    // Dynamic sun-shadow camera extent sized to the visible ground area. The
    // manager grows this by its coverage factor and pins it to a coarse world
    // anchor, so panning does not re-render the sun map every frame.
    if (lightingManagerRef.current) {
      const w = width || window.innerWidth;
      const h = height || window.innerHeight;
      const zoom = Math.max(Number.isFinite(effectiveZoom) ? effectiveZoom : 1, 0.2);
      // Lower tilt stretches the ground footprint along the view direction.
      const pitchRad = ((90 - activeTilt) * Math.PI) / 180;
      const groundHalfDepth = (h / 2) / Math.max(Math.cos(pitchRad), 0.2) / zoom;
      const groundHalfWidth = (w / 2) / zoom;
      lightingManagerRef.current.setShadowCameraExtent(
        Math.hypot(groundHalfWidth, groundHalfDepth)
      );
      lightingManagerRef.current.syncCamera(cameraX, cameraY);
    }
  }, [cameraX, cameraY, effectiveZoom, viewRotation, viewTilt, viewMode, width, height]);

  // Update Props with full grid and fog state
  useEffect(() => {
    const structural = {
      walls: wallData,
      elevation: elevationData,
      gridSize,
      gridOffsetX,
      gridOffsetY,
      objects: environmentalObjects
    };
    const previous = propsStructuralRef.current;
    const structuralChanged = !previous
      || previous.walls !== structural.walls
      || previous.elevation !== structural.elevation
      || previous.gridSize !== structural.gridSize
      || previous.gridOffsetX !== structural.gridOffsetX
      || previous.gridOffsetY !== structural.gridOffsetY
      || previous.objects !== structural.objects;
    propsStructuralRef.current = structural;

    const fogChanged = propManagerRef.current
      ? !!propManagerRef.current.updateObjects(environmentalObjects, {
          gridSize,
          gridOffsetX,
          gridOffsetY
        }, {
          fogOfWarEnabled,
          isEditorMode,
          isGMMode,
          viewingFromToken,
          isPlayerPositionExplored,
          visibleAreaSet
        }, wallData, elevationData)
      : false;

    // Visibility recalculations alone must NOT re-render the sun + point-light
    // shadow maps; only geometry movement or an actual fog-state flip does.
    if (structuralChanged || fogChanged) {
      lightingManagerRef.current?.markAllShadowsDirty();
    }
  }, [
    environmentalObjects,
    wallData,
    elevationData,
    gridSize,
    gridOffsetX,
    gridOffsetY,
    fogOfWarEnabled,
    isEditorMode,
    isGMMode,
    viewingFromToken,
    isPlayerPositionExplored,
    visibleAreaSet,
    exploredAreas,
    playerMemories
  ]);

  // Update 3D Wall Doors & Wall Depth Occluders
  useEffect(() => {
    const structural = {
      walls: wallData,
      elevation: elevationData,
      walls3DEnabled,
      gridSize,
      gridOffsetX,
      gridOffsetY
    };
    const previous = wallsStructuralRef.current;
    const structuralChanged = !previous
      || previous.walls !== structural.walls
      || previous.elevation !== structural.elevation
      || previous.walls3DEnabled !== structural.walls3DEnabled
      || previous.gridSize !== structural.gridSize
      || previous.gridOffsetX !== structural.gridOffsetX
      || previous.gridOffsetY !== structural.gridOffsetY;
    wallsStructuralRef.current = structural;

    const fogState = {
      fogOfWarEnabled,
      isEditorMode,
      isGMMode,
      viewingFromToken,
      isPlayerPositionExplored,
      visibleAreaSet
    };
    const gridState = {
      gridSize,
      gridOffsetX,
      gridOffsetY
    };

    let fogChanged = false;
    let doorsChanged = false;
    let wallPropsChanged = false;

    if (propManagerRef.current) {
      doorsChanged = !!propManagerRef.current.updateWallDoors(wallData, gridState, fogState, elevationData);
      // Wall-attached fixtures (torches, banners) derive their height from the
      // wall run they are mounted on, so wall edits must refresh them too.
      wallPropsChanged = !!propManagerRef.current.updateObjects(environmentalObjects, gridState, fogState, wallData, elevationData);
    }
    if (walls3DEnabled && wallManagerRef.current) {
      fogChanged = !!wallManagerRef.current.updateWalls(wallData, elevationData, gridState, fogState);
    } else if (wallManagerRef.current) {
      wallManagerRef.current.updateWalls({}, {}, {}, {});
    }

    if (!walls3DEnabled && wallOccluderManagerRef.current) {
      wallOccluderManagerRef.current.updateWalls(wallData, elevationData, gridState);
    } else if (wallOccluderManagerRef.current) {
      wallOccluderManagerRef.current.updateWalls({}, {}, {});
    }

    if (structuralChanged || fogChanged || doorsChanged || wallPropsChanged) {
      lightingManagerRef.current?.markAllShadowsDirty();
    }
  }, [
    wallData,
    elevationData,
    walls3DEnabled,
    environmentalObjects,
    gridSize,
    gridOffsetX,
    gridOffsetY,
    fogOfWarEnabled,
    isEditorMode,
    isGMMode,
    viewingFromToken,
    isPlayerPositionExplored,
    visibleAreaSet,
    exploredAreas,
    playerMemories
  ]);

  // Drive 3D lighting from the map's own lighting model (sun, ambient, lights)
  useEffect(() => {
    if (propManagerRef.current) {
      const lightPropsChanged = propManagerRef.current.updateLightProps(lightSources, {
        gridSize,
        gridOffsetX,
        gridOffsetY
      }, {
        fogOfWarEnabled,
        isEditorMode,
        isGMMode,
        viewingFromToken,
        isPlayerPositionExplored,
        visibleAreaSet
      }, elevationData);
      // Placed lights cast real sun shadows, and the sun map is re-rendered on
      // demand only. A fixture that appeared, moved, resized or was deleted
      // must request that pass or its old shadow lingers on the floor until the
      // camera happens to cross a shadow-anchor cell.
      if (lightPropsChanged) {
        lightingManagerRef.current?.markAllShadowsDirty();
      }
    }
    if (!lightingManagerRef.current) return;
    lightingManagerRef.current.update({
      lightSources,
      lightingEnabled,
      ambientLightLevel,
      sunSettings,
      wallShadowsEnabled,
      performanceMode,
      lightAnimations,
      shadowQuality,
      maxTextureSize: rendererRef.current?.capabilities?.maxTextureSize,
      gridSize,
      gridOffsetX,
      gridOffsetY,
      elevationData
    });

    // Shadow darkness follows the sun: strong sun = deep shadows, dusk/low
    // intensity = faint ones, and heavy ambient fill lightens them further.
    const shadowMaterial = shadowMaterialRef.current;
    if (shadowMaterial) {
      const sunStrength = Math.min(Math.max(Number(sunSettings?.intensity ?? 1) / 1.5, 0), 1.4);
      const fill = Math.min(Math.max(Number(ambientLightLevel ?? 0.2), 0), 1);
      const opacity = lightingEnabled
        ? Math.min(Math.max(0.18 + 0.4 * sunStrength * (1 - 0.25 * fill), 0.12), 0.5)
        : 0.12;
      if (Math.abs(shadowMaterial.opacity - opacity) > 0.005) {
        shadowMaterial.opacity = opacity;
      }
    }
  }, [
    lightSources,
    lightingEnabled,
    ambientLightLevel,
    sunSettings,
    wallShadowsEnabled,
    performanceMode,
    lightAnimations,
    shadowQuality,
    gridSize,
    gridOffsetX,
    gridOffsetY,
    elevationData,
    fogOfWarEnabled,
    isEditorMode,
    isGMMode,
    viewingFromToken,
    isPlayerPositionExplored,
    visibleAreaSet,
    exploredAreas,
    playerMemories
  ]);

  // Update Terrain
  useEffect(() => {
    if (terrainManagerRef.current) {
      terrainManagerRef.current.updateTerrain({
        terrainData,
        elevationData,
        rampData,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        enabled: terrain3DEnabled
      });
    }
    lightingManagerRef.current?.markAllShadowsDirty();
  }, [terrainData, elevationData, rampData, gridSize, gridOffsetX, gridOffsetY, terrain3DEnabled]);

  return (
    <div
      ref={containerRef}
      className="three-d-world-layer"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allows all regular 2D drag/pan/token events to pass through
        zIndex: 10
      }}
    />
  );
};

export default ThreeDWorldLayer;
