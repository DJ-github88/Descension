import React, { useState, useEffect, useRef, useCallback } from 'react';
import useLevelEditorStore, { WALL_TYPES } from '../../store/levelEditorStore';
import useGameStore from '../../store/gameStore';
import useGridItemStore from '../../store/gridItemStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useMapStore from '../../store/mapStore';
import MythrillWindow from '../windows/MythrillWindow';
import { getGridSystem } from '../../utils/InfiniteGridSystem';
import { pickWallAtScreenPoint } from '../../utils/WallPicking';
import { getWallWorldEndpoints, parseWallKey } from '../../utils/WallGeometry';
import { getObjectScreenBounds, getObjectSelectionHandles } from '../../utils/ObjectSelectionBounds';
import { getTileElevation } from '../../utils/ElevationUtils';
import { useLevelEditorPersistence } from '../../hooks/useLevelEditorPersistence';

import DrawingTools from './tools/DrawingTools';
import TerrainTools from './tools/TerrainTools';
import ElevationTools from './tools/ElevationTools';
import ObjectTools from './tools/ObjectTools';
import WallTools from './tools/WallTools';
import FogTools from './tools/FogTools';
import GridTools from './tools/GridTools';
import TerrainHoverPreview from './TerrainHoverPreview';
import PlacementGhostPreview from './PlacementGhostPreview';
import { PROFESSIONAL_OBJECTS, snapRotationForHitTest } from './objects/ObjectSystem';
import { CONNECTION_MARKER_COLOR } from './objects/objectPreviewArt';
import AreaRemoveModal from './AreaRemoveModal';
import AdvancedLightingPanel from './AdvancedLightingPanel';
import { EraserCursorPreview, TextInputOverlay, AreaRemoveSelection, WallSelectionIndicator, ObjectShortcutHUD } from './EditorOverlays';
import { EDITOR_TABS as vttTools, getToolCursor, getFirstTool } from './editorTools';
import { resolveObjectWheelTransform, toToolSettingsPatch } from './objectWheelTransforms';
import { resolveWallMountPlacement } from './objects/wallAttachment';
import { LIGHT_PRESETS } from '../../utils/LightingCalculations';
import LayersPanel from './LayersPanel';
import TabDropdownButton from '../../components/common/TabDropdownButton';

import { useEditorKeyboard } from './useEditorKeyboard';

import './styles/ProfessionalVTTEditor.css';

const isFeatureWallType = (typeId) => {
    const def = WALL_TYPES[typeId];
    return !!(def && (def.interactive || def.isWindow));
};

const pointSegmentDistance2D = (px, py, ax, ay, bx, by) => {
    const dx = bx - ax;
    const dy = by - ay;
    const lengthSq = dx * dx + dy * dy;
    if (lengthSq < 1e-9) return Math.hypot(px - ax, py - ay);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSq));
    return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
};

// 3D door/gate objects that weave into an existing wall as a door feature when
// placed next to one (object type -> WALL_TYPES feature id).
const DOOR_OBJECT_FEATURE_TYPES = {
    wall_doorway: 'stone_door',
    wooden_door: 'wooden_door',
    town_door: 'town_door',
    iron_gate: 'iron_gate',
    wooden_gate: 'wooden_gate',
    hedge_gate: 'hedge_gate'
};

// Straight hex walls connect two honeycomb corners; the ghost preview carries
// the world endpoints so both canvas layers can draw the exact segment.
const hexSegmentPreviewPath = (startVertex, endVertex) => [{
    isHexSegment: true,
    start: { x: startVertex.x, y: startVertex.y, key: startVertex.key },
    end: { x: endVertex.x, y: endVertex.y, key: endVertex.key }
}];

const ProfessionalVTTEditor = () => {
    // Render-loop debugging is opt-in: this logs (and JSON.stringifies) on EVERY
    // render, which is a real dev-mode frame cost while token-view fog updates
    // at ~20 Hz. Enable with window.__ED_RENDER_DEBUG = true.
    if (typeof window !== 'undefined' && window.__ED_RENDER_DEBUG) {
        // eslint-disable-next-line no-console
        console.log('[ed-render] ' + JSON.stringify({ n: (window.__edRenderN = (window.__edRenderN || 0) + 1), sel: window.useLevelEditorStore?.getState?.().selectedWallKey }));
    }
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('terrain');
    const [selectedTool, setSelectedTool] = useState('terrain_brush');
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentPath, setCurrentPath] = useState([]);
    const [textInput, setTextInput] = useState({ show: false, x: 0, y: 0, text: '', gridX: 0, gridY: 0 });
    const [hoverPreview, setHoverPreview] = useState({ show: false, gridX: 0, gridY: 0, brushSize: 1 });
    const [isLayersPanelCollapsed, setIsLayersPanelCollapsed] = useState(true);
    const [selectionRect, setSelectionRect] = useState(null); // { startX, startY, endX, endY }
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [selectedAreaObjects, setSelectedAreaObjects] = useState(null); // Objects found in selected area
    const [selectedWall, setSelectedWall] = useState(null); // { key, data, x1, y1, x2, y2 }
    const [wallDragStart, setWallDragStart] = useState(null); // For moving walls
    const [selectedWindow, setSelectedWindow] = useState(null); // { key, gridX, gridY, data }
    const [isDraggingWall, setIsDraggingWall] = useState(false);
    const [isObjectLocked, setIsObjectLocked] = useState(false); // When true, we're locked to selected object
    const [handleHover, setHandleHover] = useState(false); // Cursor is over a selected wall's endpoint handle

    // Refs to track current dragging positions (avoids stale closure issues with state)
    const dragWindowRef = useRef(null); // { gridX, gridY, data } - current window position during drag
    const dragWallRef = useRef(null); // { x1, y1, x2, y2, key } - current wall position during drag
    const dragEndpointRef = useRef(null); // { anchorX, anchorY } - fixed endpoint while reshaping a wall
    const wallChainRef = useRef(null); // { lastX, lastY, wallType } - last committed point for continuous wall drawing
    const lastDragPosRef = useRef(null); // { gridX, gridY } - last mouse position during drag
    const windowDragRafRef = useRef(null); // RAF ref for throttling window drag updates
    const pendingWindowUpdateRef = useRef(null); // Pending window position update
    const doorDragRafRef = useRef(null); // RAF ref for throttling door drag updates
    const pendingDoorUpdateRef = useRef(null); // Pending door position update

    const windowRef = useRef(null);
    const overlayRef = useRef(null);
    const textInputRef = useRef(null);

    // Throttled hover preview updates - store latest position in ref and update state via RAF
    const hoverPreviewRef = useRef({ show: false, gridX: 0, gridY: 0, brushSize: 1 });
    const hoverPreviewRafId = useRef(null);
    const lastLoadedMapIdRef = useRef(null);

    // Throttle fog painting calls using RAF for smooth painting
    const fogPaintThrottleRef = useRef(null);
    const pendingFogPaintRef = useRef(null); // Store pending paint call

    // Track last terrain brush position for line interpolation
    const lastTerrainBrushPosRef = useRef(null);
const elevationStrokePaintedRef = useRef(null);
    const activeMapIdRef = useRef(null); // CRITICAL: Capture mapId on pointer down to prevent bleeding during transitions

    // Throttled function to update hover preview state
    const updateHoverPreviewState = useCallback(() => {
        setHoverPreview({ ...hoverPreviewRef.current });
        hoverPreviewRafId.current = null;
    }, []);

    // Throttled hover preview updater
    const throttledUpdateHoverPreview = useCallback(() => {
        if (hoverPreviewRafId.current === null) {
            hoverPreviewRafId.current = requestAnimationFrame(updateHoverPreviewState);
        }
    }, [updateHoverPreviewState]);

    // Store connections
    const {
        isEditorMode,
        setEditorMode,
        activeTool,
        setActiveTool,
        toolSettings,
        setToolSettings,
        drawingLayers,
        drawingPaths,
        activeLayer,
        setActiveLayer,
        toggleLayerVisibility,
        toggleLayerLock,
        toggleLayer,
        addDrawingPath,
        removeDrawingPath,
        selectedDrawings,
        clearDrawingSelection,
        saveMapState,
        loadMapState,
        clearAllProfessionalData,
        setTerrainAtPosition,
        paintTerrainBrush,
        paintTerrainLine,
        floodFillTerrain,
        removeTerrainAtPosition,
        removeTerrainLine,
        getTerrainAtPosition,
        setElevationAt,
        adjustElevationAt,
        setRampAt,
        addLightSource,
        removeLightSource,
        removeFogAtPosition,
        addFogAtPosition,
        finishFogErasePath,
        finishFogDrawPath,
        clearAllFog,
        coverEntireMapWithFog,
        addEnvironmentalObject,
        removeEnvironmentalObject,
        updateEnvironmentalObject,
        selectEnvironmentalObject,
        setAllEnvironmentalObjectsLocked,
        setEditorOpen,
        getObjectAtPosition,
        environmentalObjects,
        terrainData,
        wallData,
        addDndElement,
        showWallLayer,
        setWall,
        getWall,
        updateWall,
        removeWall,
        moveWall,
        selectedWallKey,
        setSelectedWallKey,
        windowOverlays,
        setWindowOverlay,
        removeWindowOverlay,
        moveWindowOverlay,
        selectedWindowKey,
        setSelectedWindowKey,
        clearTerrain,
        setCurrentDrawingPath,
        isCurrentlyDrawing,
        setIsCurrentlyDrawing,
        setCurrentDrawingTool,
        clearCurrentDrawing,
        pushHistorySnapshot,
        undo,
        redo
    } = useLevelEditorStore();

    // Derived lock state for the panel-bar "Lock All" toggle. There is no stored
    // flag: the toggle snapshots the lock onto the objects placed so far, so a
    // newly placed object stays movable until locked again.
    const lockedObjectsCount = (environmentalObjects || []).filter(o => o.locked).length;
    const objectsTotalCount = (environmentalObjects || []).length;
    const allObjectsLocked = objectsTotalCount > 0 && lockedObjectsCount === objectsTotalCount;
    const someObjectsLocked = lockedObjectsCount > 0 && !allObjectsLocked;

    const {
        isGMMode,
        gridSize,
        gridOffsetX,
        gridOffsetY,
        cameraX,
        cameraY,
        zoomLevel,
        playerZoom,
        showGrid
    } = useGameStore();

    const {
        currentMapId,
        loadMapState: getMapStateFromStore,
        getCurrentMapId
    } = useMapStore();

    // Helper to get current map ID explicitly (prevents stale reads during rapid updates)
    const getExplicitCurrentMapId = () => {
        const mapStoreState = useMapStore.getState();
        return mapStoreState.currentMapId || 'default';
    };

    const { gridItems, removeItemFromGrid } = useGridItemStore();
    const { tokens, removeToken } = useCreatureStore();
    const { characterTokens, removeCharacterToken } = useCharacterTokenStore();

    // Level editor persistence hook
    const {
        saveLevelEditorState,
        loadLevelEditorState,
        copyFromRoom,
        clearRoomState,
        currentRoomId,
        isInRoom,
        hasUnsavedChanges
    } = useLevelEditorPersistence();

    // Professional VTT tool categories - imported from editorTools.js (single source of truth)

    // Toggle editor window
    const toggleEditor = () => {
        if (isGMMode) {
            setIsOpen(!isOpen);
            setEditorMode(!isEditorMode);
        }
    };

    // Handle tab change
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        const firstTool = getFirstTool(tabId);
        if (firstTool) {
            setSelectedTool(firstTool.id);
            setActiveTool(firstTool.id);

            // Don't auto-select any object when switching to objects tab
            // User must explicitly choose which object to place
            if (tabId === 'objects' && firstTool.id === 'object_place') {
                // CRITICAL FIX: Defer setToolSettings to avoid React 'update during render' warning
                // which causes stale state snapshots (including drawingPaths) in the batcher
                setTimeout(() => {
                    // Functional patch: a spread of the render-time toolSettings
                    // snapshot here re-added values that other deferred writes
                    // (terrain cleanup below) had just cleared.
                    setToolSettings(prev => ({
                        ...prev,
                        selectedObjectType: undefined,
                        selectedPlacementType: undefined
                    }));
                }, 0);
            }
        }

        // Clear terrain-specific settings when switching away from terrain tab
        // CRITICAL FIX: Defer to avoid React 'update during render' warning
        if (tabId !== 'terrain') {
            setTimeout(() => {
                setToolSettings(prev => {
                    const newSettings = { ...prev };
                    delete newSettings.selectedTerrainType;
                    return newSettings;
                });
            }, 0);
        }

        // Reset wall type to valid solid wall if switching to walls tab with a door/window type
        if (tabId === 'walls') {
            setTimeout(() => {
                const cur = toolSettings.selectedWallType;
                const curData = WALL_TYPES[cur];
                if (!cur || curData?.interactive || curData?.category === 'window') {
                    setToolSettings(prev => ({
                        ...prev,
                        selectedWallType: 'stone_wall'
                    }));
                }
            }, 0);
        }
    };

    // Handle tool selection
    const handleToolSelect = (toolId) => {
        setSelectedTool(toolId);
        setActiveTool(toolId);
        clearDrawingSelection();

        // Clear selection when switching away from select tool
        if (toolId !== 'wall_select') {
            setSelectedWallKey(null);
            setSelectedWindowKey(null);
            setSelectedWindow(null);
            setIsObjectLocked(false);
            // Clear drag refs
            dragWindowRef.current = null;
            dragWallRef.current = null;
            lastDragPosRef.current = null;
        }
    };

    // Handle tool settings change. Merge over the live store snapshot instead
    // of the component's render-time copy so rapid wheel-driven updates (which
    // do not re-render) are never clobbered by the next UI click.
    const handleToolSettingsChange = (newSettings) => {
        const patch = typeof newSettings === 'function' ? newSettings(toolSettings) : newSettings;
        useLevelEditorStore.getState().setToolSettings(patch);
    };

    // Publish the active tool to the shared store. Other systems read it to
    // decide who owns canvas input: the 3D layer only shows the placement ghost
    // for 'object_place', and ObjectSystem must not hijack clicks for
    // selection/dragging while a placement/erase tool is active.
    useEffect(() => {
        useLevelEditorStore.getState().setSelectedTool(isEditorMode ? selectedTool : 'select');
    }, [selectedTool, isEditorMode]);

    // Leaving the editor must drop any live placement tool, otherwise the 3D
    // layer would keep ghost-previewing placements in play mode.
    useEffect(() => {
        return () => {
            useLevelEditorStore.getState().setSelectedTool('select');
        };
    }, []);

    // Wheel transforms: scale the armed placement ghost or the selected placed
    // object; Alt/Shift variants rotate it. Ctrl+wheel is deliberately left to
    // the camera zoom handler in Grid.jsx.
    const wheelTransformHistoryRef = useRef(0);
    const isOverEditorUiRef = useRef(() => false);
    isOverEditorUiRef.current = (target) => {
        if (!target || typeof target.closest !== 'function') return false;
        if (target.closest('.wow-window, .vtt-tool-palette, .vtt-tool-settings')) return true;
        // Keep native wheel scrolling wherever the cursor sits on a scrollable
        // element (object catalog, notes, etc.) between the cursor and the
        // canvas. The walk must stop at the editor overlay: the app shell
        // around it is scrollable and would otherwise swallow every wheel.
        let element = target;
        while (element && element !== document.body) {
            if (element.classList && element.classList.contains('vtt-drawing-overlay')) return false;
            const style = window.getComputedStyle(element);
            const overflow = `${style.overflow}${style.overflowY}${style.overflowX}`;
            if (/auto|scroll/.test(overflow)) return true;
            element = element.parentElement;
        }
        return false;
    };
    const editorWheelTransformRef = useRef(null);
    const isEKeyPressedRef = useRef(false);
    const [heldModifiers, setHeldModifiers] = useState({ e: false, alt: false, shift: false });

    useEffect(() => {
        const handleKeyDown = (e) => {
            const isInput = ['INPUT', 'TEXTAREA'].includes(e.target?.tagName) || e.target?.isContentEditable;
            if (isInput) return;

            if (e.code === 'KeyE' || e.key?.toLowerCase() === 'e') {
                isEKeyPressedRef.current = true;
                setHeldModifiers(prev => prev.e ? prev : ({ ...prev, e: true }));
            }
            if (e.altKey) {
                setHeldModifiers(prev => prev.alt ? prev : ({ ...prev, alt: true }));
            }
            if (e.shiftKey) {
                setHeldModifiers(prev => prev.shift ? prev : ({ ...prev, shift: true }));
            }
        };
        const handleKeyUp = (e) => {
            if (e.code === 'KeyE' || e.key?.toLowerCase() === 'e') {
                isEKeyPressedRef.current = false;
                setHeldModifiers(prev => !prev.e ? prev : ({ ...prev, e: false }));
            }
            setHeldModifiers(prev => {
                const alt = !!e.altKey;
                const shift = !!e.shiftKey;
                if (prev.alt === alt && prev.shift === shift) return prev;
                return { ...prev, alt, shift };
            });
        };
        const handleWindowBlur = () => {
            isEKeyPressedRef.current = false;
            setHeldModifiers({ e: false, alt: false, shift: false });
        };

        window.addEventListener('keydown', handleKeyDown, { capture: true });
        window.addEventListener('keyup', handleKeyUp, { capture: true });
        window.addEventListener('blur', handleWindowBlur);

        return () => {
            window.removeEventListener('keydown', handleKeyDown, { capture: true });
            window.removeEventListener('keyup', handleKeyUp, { capture: true });
            window.removeEventListener('blur', handleWindowBlur);
        };
    }, []);

    editorWheelTransformRef.current = (e) => {
        if (!isEditorMode) return;

        const wheelEvent = {
            deltaX: e.deltaX,
            deltaY: e.deltaY,
            altKey: e.altKey,
            shiftKey: e.shiftKey,
            ctrlKey: e.ctrlKey,
            eKey: isEKeyPressedRef.current
        };

        const placementArmed = selectedTool === 'object_place' && !!toolSettings?.selectedObjectType;
        if (placementArmed) {
            const patch = resolveObjectWheelTransform(wheelEvent, {
                scale: toolSettings.objectScale || 1,
                rotation: toolSettings.objectRotation || 0,
                rotationX: toolSettings.objectRotationX || 0,
                rotationY: toolSettings.objectRotationY || 0,
                elevation: toolSettings.objectElevation !== undefined ? toolSettings.objectElevation : 0
            });
            if (!patch) return;
            e.preventDefault();
            e.stopPropagation();
            useLevelEditorStore.getState().setToolSettings(toToolSettingsPatch(patch));
            return;
        }

        const selectedObject = (environmentalObjects || []).find(obj => obj.selected);
        if (!selectedObject) return;
        // Locked objects are frozen: wheel resize/rotate/tilt is ignored.
        if (selectedObject.locked) return;
        const patch = resolveObjectWheelTransform(wheelEvent, selectedObject);
        if (!patch) return;
        e.preventDefault();
        e.stopPropagation();

        // One undo entry per gesture instead of one per wheel notch.
        const now = Date.now();
        if (now - wheelTransformHistoryRef.current > 800) {
            wheelTransformHistoryRef.current = now;
            pushHistorySnapshot();
        }
        updateEnvironmentalObject(selectedObject.id, patch);
    };

    useEffect(() => {
        if (!isEditorMode) return undefined;
        // Capture phase: Grid.jsx also listens for wheel on window (bubble) to
        // handle Ctrl+zoom, and its handler must never see Alt/Shift/wheel
        // transforms. Non-Ctrl events are claimed here first.
        const handler = (e) => {
            if (e.ctrlKey) return;
            if (isOverEditorUiRef.current(e.target)) return;
            editorWheelTransformRef.current?.(e);
        };
        window.addEventListener('wheel', handler, { passive: false, capture: true });
        return () => window.removeEventListener('wheel', handler, { capture: true });
    }, [isEditorMode]);

    // Apply an elevation brush stamp. Stroke-local dedupe prevents repeated
    // raise/lower while the pointer stays on the same tile during a drag.
    const applyElevationStamp = useCallback((gridX, gridY, mode, target, brushSize) => {
        const size = Math.max(1, Math.round(brushSize || 1));
        const painted = elevationStrokePaintedRef.current || (elevationStrokePaintedRef.current = new Set());
        const tiles = getGridSystem().getBrushTiles(gridX, gridY, size);

        for (const tile of tiles) {
            const key = `${tile.x},${tile.y}`;
            if (painted.has(key)) continue;
            painted.add(key);

            if (mode === 'raise') {
                adjustElevationAt(tile.x, tile.y, 1);
            } else if (mode === 'lower') {
                adjustElevationAt(tile.x, tile.y, -1);
            } else if (mode === 'flatten') {
                setElevationAt(tile.x, tile.y, target);
            }
        }
    }, [adjustElevationAt, setElevationAt]);

    // Convert screen coordinates to grid coordinates using the same system as tokens and grid lines
    const screenToGrid = useCallback((clientX, clientY) => {
        if (!overlayRef.current) return null;

        const rect = overlayRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const effectiveZoom = (zoomLevel || 1) * (playerZoom || 1);
        const gs = gridSize || 50;
        const gOX = gridOffsetX || 0;
        const gOY = gridOffsetY || 0;
        const camX = cameraX || 0;
        const camY = cameraY || 0;

        if (!Number.isFinite(effectiveZoom) || effectiveZoom <= 0) return null;

        try {
            // Use the InfiniteGridSystem for consistent coordinate conversion
            const gridSystem = getGridSystem();
            const viewport = gridSystem.getViewportDimensions();
            const worldPos = gridSystem.screenToWorld(x, y, viewport.width, viewport.height);
            const gridCoords = gridSystem.worldToGrid(worldPos.x, worldPos.y);

            return {
                gridX: gridCoords.x,
                gridY: gridCoords.y,
                worldX: worldPos.x,
                worldY: worldPos.y,
                screenX: x,
                screenY: y
            };
        } catch (error) {
            // Fallback calculation
            const worldX = (x / effectiveZoom) + camX;
            const worldY = (y / effectiveZoom) + camY;
            const gridX = Math.floor((worldX - gOX) / gs);
            const gridY = Math.floor((worldY - gOY) / gs);
            return { gridX, gridY, worldX, worldY, screenX: x, screenY: y };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, zoomLevel, playerZoom]);

    // Convert grid coordinates to screen coordinates using the same system as tokens and grid lines
    const gridToScreen = useCallback((gridX, gridY) => {
        const effectiveZoom = (zoomLevel || 1) * (playerZoom || 1);
        const gs = gridSize || 50;
        const gOX = gridOffsetX || 0;
        const gOY = gridOffsetY || 0;
        const camX = cameraX || 0;
        const camY = cameraY || 0;

        try {
            // Use the InfiniteGridSystem for consistent coordinate conversion
            const gridSystem = getGridSystem();
            const worldPos = gridSystem.gridToWorldCorner(gridX, gridY);
            // Use consistent viewport dimensions that account for editor panel
            const viewport = gridSystem.getViewportDimensions();
            return gridSystem.worldToScreen(worldPos.x, worldPos.y, viewport.width, viewport.height);
        } catch (error) {
            // Fallback to original calculation if grid system fails
            if (!Number.isFinite(effectiveZoom) || effectiveZoom <= 0) return { x: 0, y: 0 };
            const worldX = (gridX * gs) + gOX;
            const worldY = (gridY * gs) + gOY;

            const screenX = (worldX - camX) * effectiveZoom + window.innerWidth / 2;
            const screenY = (worldY - camY) * effectiveZoom + window.innerHeight / 2;

            return { x: screenX, y: screenY };
        }
    }, [gridSize, gridOffsetX, gridOffsetY, cameraX, cameraY, zoomLevel, playerZoom]);

    // Place a door/window feature on the nearest wall: the host wall is split
    // around the feature so the feature occupies a real gap in the wall run
    // (visible and passable from both sides).
    const placeWallFeature = useCallback((featureType, clientX, clientY) => {
        const featureDef = WALL_TYPES[featureType];
        if (!featureDef) return;
        const coords = screenToGrid(clientX, clientY);
        if (!coords || coords.worldX === undefined || coords.worldY === undefined) return;

        const gridSystem = getGridSystem();
        const { gridType } = gridSystem.getGridState();
        const currentWalls = useLevelEditorStore.getState().wallData || {};
        const mapId = activeMapIdRef.current;

        if (gridType === 'hex') {
            let best = null;
            for (const [key, wall] of Object.entries(currentWalls)) {
                const typeId = typeof wall === 'string' ? wall : wall?.type;
                if (isFeatureWallType(typeId)) continue;
                const parsed = parseWallKey(key);
                if (!parsed) continue;
                const ends = getWallWorldEndpoints(parsed, gridSystem, 'hex', wall);
                if (!ends) continue;
                const distance = pointSegmentDistance2D(
                    coords.worldX, coords.worldY,
                    ends.start.x, ends.start.y, ends.end.x, ends.end.y
                );
                if (!best || distance < best.distance) best = { parsed, wall, ends, distance };
            }
            if (!best || best.distance > gridSize * 0.6) return;

            const { start: hostStart, end: hostEnd } = best.ends;
            const hostDx = hostEnd.x - hostStart.x;
            const hostDy = hostEnd.y - hostStart.y;
            const hostLength = Math.hypot(hostDx, hostDy);
            if (hostLength < 1e-6) return;

            // Free-form chords can be much longer than a cell, so the feature
            // occupies roughly one tile centered on the click and the host wall
            // is split into solid stubs around it. Legacy single-edge hex walls
            // are exactly one tile wide, so they still become fully feature.
            const clickT = Math.max(0, Math.min(1,
                ((coords.worldX - hostStart.x) * hostDx + (coords.worldY - hostStart.y) * hostDy) /
                (hostLength * hostLength)
            ));
            const featureFraction = Math.min(1, gridSize / hostLength);
            let t0 = Math.max(0, clickT - featureFraction / 2);
            let t1 = Math.min(1, t0 + featureFraction);
            t0 = Math.max(0, t1 - featureFraction);
            const pointAt = (t) => ({
                x: hostStart.x + hostDx * t,
                y: hostStart.y + hostDy * t
            });
            const stubStart = pointAt(t0);
            const stubEnd = pointAt(t1);

            const hostExtra = best.wall && typeof best.wall === 'object'
                ? Object.fromEntries(Object.entries(best.wall)
                    .filter(([field]) => field !== 'id' && field !== 'hexEndpoints' && field !== 'type'))
                : null;
            const hostType = (typeof best.wall === 'string' ? best.wall : best.wall?.type) || 'stone_wall';
            const setHexWallSegment = (a, b, type, extra = null) => {
                const keyA = gridSystem.hexVertexKeyParts(a);
                const keyB = gridSystem.hexVertexKeyParts(b);
                setWall(keyA.x, keyA.y, keyB.x, keyB.y, type, mapId, {
                    hexEndpoints: [{ x: a.x, y: a.y }, { x: b.x, y: b.y }],
                    ...(extra || {})
                });
            };

            removeWall(best.parsed.x1, best.parsed.y1, best.parsed.x2, best.parsed.y2, mapId);
            if (Math.hypot(stubStart.x - hostStart.x, stubStart.y - hostStart.y) > 1e-6) {
                setHexWallSegment(hostStart, stubStart, hostType, hostExtra);
            }
            if (Math.hypot(hostEnd.x - stubEnd.x, hostEnd.y - stubEnd.y) > 1e-6) {
                setHexWallSegment(stubEnd, hostEnd, hostType, hostExtra);
            }
            setHexWallSegment(stubStart, stubEnd, featureType);
            return;
        }

        const clickX = (coords.worldX - gridOffsetX) / gridSize;
        const clickY = (coords.worldY - gridOffsetY) / gridSize;
        let host = null;
        let nearestDistance = Infinity;
        for (const [key, wall] of Object.entries(currentWalls)) {
            const typeId = typeof wall === 'string' ? wall : wall?.type;
            if (isFeatureWallType(typeId)) continue;
            const [x1, y1, x2, y2] = key.split(',').map(Number);
            if (![x1, y1, x2, y2].every((n) => Number.isFinite(n))) continue;
            const distance = pointSegmentDistance2D(clickX, clickY, x1, y1, x2, y2);
            if (distance < nearestDistance && distance < 1.5) {
                nearestDistance = distance;
                host = { key, typeId, x1, y1, x2, y2, wall };
            }
        }
        if (!host) return;

        const dx = host.x2 - host.x1;
        const dy = host.y2 - host.y1;
        const hostLength = Math.hypot(dx, dy);
        if (hostLength < 1e-6) return;
        const dirX = dx / hostLength;
        const dirY = dy / hostLength;
        const signX = Math.round(dirX);
        const signY = Math.round(dirY);
        const stepLengthSq = signX * signX + signY * signY;
        if (stepLengthSq === 0) return;
        const stepCount = Math.max(Math.abs(host.x2 - host.x1), Math.abs(host.y2 - host.y1));
        if (stepCount < 1) return;
        const projected = Math.max(0, Math.min(hostLength,
            (clickX - host.x1) * dirX + (clickY - host.y1) * dirY
        ));
        const projectedPoint = {
            x: host.x1 + dirX * projected,
            y: host.y1 + dirY * projected
        };
        // Snap the feature to whole lattice tiles so wall keys stay integer
        // (pathfinding/LOS index integer edges only).
        const stepIndex = Math.max(0, Math.min(stepCount - 1, Math.round(
            ((projectedPoint.x - host.x1) * signX + (projectedPoint.y - host.y1) * signY) / stepLengthSq
        )));
        const startLattice = {
            x: host.x1 + signX * stepIndex,
            y: host.y1 + signY * stepIndex
        };
        const endLattice = {
            x: startLattice.x + signX,
            y: startLattice.y + signY
        };

        const hostExtra = host.wall && typeof host.wall === 'object'
            ? Object.fromEntries(Object.entries(host.wall).filter(([field]) => field !== 'id'))
            : null;
        const hostType = host.typeId || 'stone_wall';

        removeWall(host.x1, host.y1, host.x2, host.y2, mapId);
        if (stepIndex > 0) {
            setWall(host.x1, host.y1, startLattice.x, startLattice.y, hostType, mapId);
            if (hostExtra) updateWall(host.x1, host.y1, startLattice.x, startLattice.y, hostExtra);
        }
        if (stepIndex + 1 < stepCount) {
            setWall(endLattice.x, endLattice.y, host.x2, host.y2, hostType, mapId);
            if (hostExtra) updateWall(endLattice.x, endLattice.y, host.x2, host.y2, hostExtra);
        }
        setWall(startLattice.x, startLattice.y, endLattice.x, endLattice.y, featureType, mapId);
    }, [screenToGrid, setWall, removeWall, updateWall, gridSize, gridOffsetX, gridOffsetY]);

    // Find wall at grid position - checks if a wall passes through or near a grid point
    const findWallAtPosition = useCallback((gridX, gridY) => {
        if (!wallData) return null;

        // Check all walls to find one that passes through this grid position
        for (const [wallKey, wall] of Object.entries(wallData)) {
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            // Check if this grid position is on the wall line
            // For horizontal walls (y1 === y2)
            if (y1 === y2 && gridY === y1) {
                const minX = Math.min(x1, x2);
                const maxX = Math.max(x1, x2);
                if (gridX >= minX && gridX <= maxX) {
                    return { key: wallKey, data: wall, x1, y1, x2, y2 };
                }
            }
            // For vertical walls (x1 === x2)
            if (x1 === x2 && gridX === x1) {
                const minY = Math.min(y1, y2);
                const maxY = Math.max(y1, y2);
                if (gridY >= minY && gridY <= maxY) {
                    return { key: wallKey, data: wall, x1, y1, x2, y2 };
                }
            }
            // Check endpoints
            if ((gridX === x1 && gridY === y1) || (gridX === x2 && gridY === y2)) {
                return { key: wallKey, data: wall, x1, y1, x2, y2 };
            }
        }
        return null;
    }, [wallData]);

    // Find all walls near a grid position (within 2.0 tile distance, doors get larger threshold)
    // Reads fresh store state so it stays correct inside RAF drag loops.
    // On hex grids, free-form walls are keyed by corner coordinates, so callers
    // may pass the world-space point to measure with real distances instead.
    const findWallsNearPosition = useCallback((clickX, clickY, worldPoint = null) => {
        const currentWallData = useLevelEditorStore.getState().wallData;
        if (!currentWallData) return [];

        const gridSystem = getGridSystem();
        const gridState = gridSystem.getGridState();
        const tileSize = gridState.gridSize || 50;
        const worldX = worldPoint && Number.isFinite(worldPoint.x) ? worldPoint.x : null;
        const worldY = worldPoint && Number.isFinite(worldPoint.y) ? worldPoint.y : null;

        if (gridState.gridType === 'hex' && worldX !== null && worldY !== null) {
            const hexWalls = [];
            for (const [wallKey, wall] of Object.entries(currentWallData)) {
                const parsed = parseWallKey(wallKey);
                if (!parsed) continue;
                const typeId = typeof wall === 'string' ? wall : wall?.type;
                const isDoor = typeId && typeId.includes('door');
                const threshold = tileSize * (isDoor ? 2.5 : 2.0);
                const ends = getWallWorldEndpoints(parsed, gridSystem, 'hex', wall);
                if (!ends) continue;
                const distance = pointSegmentDistance2D(
                    worldX, worldY,
                    ends.start.x, ends.start.y, ends.end.x, ends.end.y
                );
                if (distance <= threshold) {
                    hexWalls.push({
                        key: wallKey,
                        data: wall,
                        x1: parsed.x1,
                        y1: parsed.y1,
                        x2: parsed.x2,
                        y2: parsed.y2,
                        distance: distance / tileSize
                    });
                }
            }
            hexWalls.sort((a, b) => a.distance - b.distance);
            return hexWalls;
        }

        const walls = [];
        for (const [wallKey, wall] of Object.entries(currentWallData)) {
            const [x1, y1, x2, y2] = wallKey.split(',').map(Number);

            // Get wall type to determine selection threshold
            const wallType = typeof wall === 'string' ? wall : wall?.type;
            const isDoor = wallType && wallType.includes('door');
            // Doors get a larger selection threshold (2.5 tiles) since they're shorter
            const selectionThreshold = isDoor ? 2.5 : 2.0;

            // Calculate closest point on wall segment to click position
            const dx = x2 - x1;
            const dy = y2 - y1;
            const wallLength = Math.sqrt(dx * dx + dy * dy);

            if (wallLength === 0) {
                // Zero-length wall, check distance to endpoint
                const dist = Math.sqrt(Math.pow(clickX - x1, 2) + Math.pow(clickY - y1, 2));
                if (dist <= selectionThreshold) {
                    walls.push({ key: wallKey, data: wall, x1, y1, x2, y2, distance: dist });
                }
                continue;
            }

            // Project click point onto wall line, clamp to segment
            const t = Math.max(0, Math.min(1,
                ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
            ));

            // Closest point on wall
            const projX = x1 + t * dx;
            const projY = y1 + t * dy;

            // Distance from click to closest point on wall
            const dist = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));

            if (dist <= selectionThreshold) {
                walls.push({ key: wallKey, data: wall, x1, y1, x2, y2, distance: dist });
            }
        }

        // Sort by distance to prefer closest wall, but prioritize doors if they're close
        walls.sort((a, b) => {
            const aIsDoor = (typeof a.data === 'string' ? a.data : a.data?.type)?.includes('door');
            const bIsDoor = (typeof b.data === 'string' ? b.data : b.data?.type)?.includes('door');

            // If one is a door and distances are similar (within 0.5 tiles), prefer door
            if (aIsDoor && !bIsDoor && Math.abs(a.distance - b.distance) < 0.5) {
                return -1;
            }
            if (bIsDoor && !aIsDoor && Math.abs(a.distance - b.distance) < 0.5) {
                return 1;
            }

            // Otherwise sort by distance
            return a.distance - b.distance;
        });
        return walls;
    }, []);

    // Find object at screen position (for lantern selection)
    const getObjectAtScreenPosition = useCallback((screenX, screenY) => {
        const effectiveZoom = zoomLevel * playerZoom;

        for (const obj of environmentalObjects) {
            if (!obj.freePosition || obj.worldX === undefined || obj.worldY === undefined) continue;

            // Convert object world position to screen position
            const screenObjX = (obj.worldX - cameraX) * effectiveZoom;
            const screenObjY = (obj.worldY - cameraY) * effectiveZoom;

            // Calculate object bounds (assuming 0.8 tile size for lanterns)
            const tileSize = gridSize * effectiveZoom;
            const scale = obj.scale || 1;
            const objWidth = 0.8 * tileSize * scale;
            const objHeight = 0.8 * tileSize * scale;

            // Check if click is within object bounds
            const left = screenObjX - objWidth / 2;
            const right = screenObjX + objWidth / 2;
            const top = screenObjY - objHeight / 2;
            const bottom = screenObjY + objHeight / 2;

            if (screenX >= left && screenX <= right && screenY >= top && screenY <= bottom) {
                return obj;
            }
        }
        return null;
    }, [environmentalObjects, cameraX, cameraY, zoomLevel, playerZoom, gridSize]);

    // Handle text placement
    const handleTextPlacement = useCallback((coords) => {
        const rect = overlayRef.current?.getBoundingClientRect();
        if (rect) {
            setTextInput({
                show: true,
                x: coords.screenX,
                y: coords.screenY,
                text: '',
                gridX: coords.gridX,
                gridY: coords.gridY
            });
        }
    }, []);

    // Handle text input submission
    const handleTextSubmit = useCallback(() => {
        if (textInput.text.trim()) {
            const pathData = {
                tool: 'text',
                points: [{ gridX: textInput.gridX, gridY: textInput.gridY }],
                text: textInput.text.trim(),
                style: {
                    fontSize: toolSettings.fontSize || 16,
                    fontFamily: toolSettings.fontFamily || 'Arial',
                    textColor: toolSettings.textColor || '#000000',
                    backgroundColor: toolSettings.backgroundColor || '#ffffff',
                    backgroundStyle: toolSettings.backgroundStyle || 'solid',
                    bold: toolSettings.bold || false,
                    italic: toolSettings.italic || false,
                    underline: toolSettings.underline || false,
                    opacity: toolSettings.opacity || 1
                },
                layer: 'overlay', // Text should be on overlay layer for visibility
                timestamp: Date.now()
            };

            const pathId = addDrawingPath(pathData, getExplicitCurrentMapId());
        }
        setTextInput({ show: false, x: 0, y: 0, text: '', gridX: 0, gridY: 0 });
    }, [textInput, toolSettings, activeLayer, addDrawingPath]);

    // Handle text input cancel
    const handleTextCancel = useCallback(() => {
        setTextInput({ show: false, x: 0, y: 0, text: '', gridX: 0, gridY: 0 });
    }, []);

    // Generate preview style for text input
    const getTextPreviewStyle = useCallback(() => {
        const fontSize = toolSettings.fontSize || 16;
        const fontFamily = toolSettings.fontFamily || 'Arial';
        const textColor = toolSettings.textColor || '#000000';
        const backgroundColor = toolSettings.backgroundColor || '#ffffff';
        const backgroundStyle = toolSettings.backgroundStyle || 'solid';
        const bold = toolSettings.bold || false;
        const italic = toolSettings.italic || false;
        const underline = toolSettings.underline || false;

        // Build font string
        let fontWeight = bold ? 'bold' : 'normal';
        let fontStyle = italic ? 'italic' : 'normal';
        let textDecoration = underline ? 'underline' : 'none';

        // Base style
        let style = {
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            color: textColor,
            fontWeight: fontWeight,
            fontStyle: fontStyle,
            textDecoration: textDecoration,
            lineHeight: '1.2'
        };

        // Apply background style
        if (backgroundStyle !== 'none') {
            switch (backgroundStyle) {
                case 'solid':
                    style.backgroundColor = backgroundColor;
                    style.border = '1px solid #333';
                    break;
                case 'parchment':
                    style.backgroundColor = backgroundColor;
                    style.border = '2px solid #d4af37';
                    style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1)';
                    break;
                case 'scroll':
                    style.backgroundColor = backgroundColor;
                    style.border = '2px solid #8b7355';
                    style.borderRadius = '8px';
                    break;
                case 'stone':
                    style.backgroundColor = backgroundColor;
                    style.border = '3px solid #696969';
                    style.boxShadow = 'inset 1px 1px 2px rgba(169,169,169,0.5)';
                    break;
                case 'wood':
                    style.backgroundColor = backgroundColor;
                    style.border = '4px solid #8b4513';
                    style.backgroundImage = 'linear-gradient(90deg, transparent 0%, rgba(160,82,45,0.2) 25%, transparent 50%, rgba(160,82,45,0.2) 75%, transparent 100%)';
                    break;
                default:
                    style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    style.border = '1px solid #333';
                    break;
            }
        }

        return style;
    }, [toolSettings]);

    // Handle drawing eraser
    const handleDrawingErase = useCallback((clientX, clientY) => {
        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        const eraseRadius = 15; // Increased pixel radius for easier erasing

        // Find drawings that intersect with the eraser position
        const pathsToRemove = drawingPaths.filter(path => {
            if (!path.points || path.points.length === 0) return false;

            // Check if any point in the path is within eraser radius
            return path.points.some(point => {
                let pointX, pointY;

                if (point.isWorldCoords) {
                    // New freehand drawings use world coordinates - convert to screen
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    const screenPos = gridSystem.worldToScreen(point.worldX, point.worldY, viewport.width, viewport.height);
                    pointX = screenPos.x;
                    pointY = screenPos.y;
                } else if (point.isFreehand) {
                    // Legacy freehand coordinates are already screen coordinates
                    pointX = point.x;
                    pointY = point.y;
                } else if (point.gridX !== undefined) {
                    // Grid coordinates need to be converted to screen coordinates
                    const screenPos = gridToScreen(point.gridX, point.gridY);
                    pointX = screenPos.x;
                    pointY = screenPos.y;
                } else {
                    return false;
                }

                const distance = Math.sqrt(
                    Math.pow(mouseX - pointX, 2) + Math.pow(mouseY - pointY, 2)
                );
                return distance <= eraseRadius;
            });
        });

        // Remove the found paths
        pathsToRemove.forEach(path => {
            removeDrawingPath(path.id, activeMapIdRef.current);
        });
    }, [drawingPaths, removeDrawingPath, gridToScreen]);

    // Find all objects in the selected screen area
    const findObjectsInArea = useCallback((minScreenX, minScreenY, maxScreenX, maxScreenY) => {
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        const effectiveZoom = zoomLevel * playerZoom;

        // Convert screen area to world coordinates
        const startWorld = gridSystem.screenToWorld(minScreenX, minScreenY, viewport.width, viewport.height);
        const endWorld = gridSystem.screenToWorld(maxScreenX, maxScreenY, viewport.width, viewport.height);

        const minWorldX = Math.min(startWorld.x, endWorld.x);
        const maxWorldX = Math.max(startWorld.x, endWorld.x);
        const minWorldY = Math.min(startWorld.y, endWorld.y);
        const maxWorldY = Math.max(startWorld.y, endWorld.y);

        const foundObjects = {
            tokens: [],
            characterTokens: [],
            items: [],
            environmentalObjects: [],
            walls: [],
            drawings: [],
            terrainTiles: []
        };

        // Check creature tokens
        tokens.forEach(token => {
            if (token.position) {
                const worldX = token.position.x || 0;
                const worldY = token.position.y || 0;
                if (worldX >= minWorldX && worldX <= maxWorldX && worldY >= minWorldY && worldY <= maxWorldY) {
                    foundObjects.tokens.push(token);
                }
            }
        });

        // Check character tokens
        (characterTokens || []).forEach(token => {
            if (token.position) {
                const worldX = token.position.x || 0;
                const worldY = token.position.y || 0;
                if (worldX >= minWorldX && worldX <= maxWorldX && worldY >= minWorldY && worldY <= maxWorldY) {
                    foundObjects.characterTokens.push(token);
                }
            }
        });

        // Check grid items
        gridItems.forEach(item => {
            if (item.position) {
                const worldX = item.position.x || 0;
                const worldY = item.position.y || 0;
                if (worldX >= minWorldX && worldX <= maxWorldX && worldY >= minWorldY && worldY <= maxWorldY) {
                    foundObjects.items.push(item);
                }
            }
        });

        // Check environmental objects (including GM notes)
        environmentalObjects.forEach(obj => {
            let worldX, worldY;
            if (obj.freePosition && obj.worldX !== undefined && obj.worldY !== undefined) {
                worldX = obj.worldX;
                worldY = obj.worldY;
            } else if (obj.gridX !== undefined && obj.gridY !== undefined) {
                const worldPos = gridSystem.gridToWorld(obj.gridX, obj.gridY);
                worldX = worldPos.x;
                worldY = worldPos.y;
            }
            if (worldX !== undefined && worldY !== undefined) {
                if (worldX >= minWorldX && worldX <= maxWorldX && worldY >= minWorldY && worldY <= maxWorldY) {
                    foundObjects.environmentalObjects.push(obj);
                }
            }
        });

        // Check walls (approximate check based on wall endpoints)
        Object.keys(wallData).forEach(wallKey => {
            const wall = wallData[wallKey];
            // Wall keys are in format "x1,y1,x2,y2"
            const coords = wallKey.split(',').map(Number);
            if (coords.length === 4) {
                const [x1, y1, x2, y2] = coords;
                const world1 = gridSystem.gridToWorld(x1, y1);
                const world2 = gridSystem.gridToWorld(x2, y2);
                // Check if either endpoint is in the area
                if ((world1.x >= minWorldX && world1.x <= maxWorldX && world1.y >= minWorldY && world1.y <= maxWorldY) ||
                    (world2.x >= minWorldX && world2.x <= maxWorldX && world2.y >= minWorldY && world2.y <= maxWorldY)) {
                    foundObjects.walls.push({ key: wallKey, wall });
                }
            }
        });

        // Check drawings (check if any point in the drawing is in the area)
        drawingPaths.forEach(path => {
            if (path.points && path.points.length > 0) {
                const hasPointInArea = path.points.some(point => {
                    let pointWorldX, pointWorldY;
                    if (point.isWorldCoords && point.worldX !== undefined && point.worldY !== undefined) {
                        pointWorldX = point.worldX;
                        pointWorldY = point.worldY;
                    } else if (point.gridX !== undefined && point.gridY !== undefined) {
                        const worldPos = gridSystem.gridToWorld(point.gridX, point.gridY);
                        pointWorldX = worldPos.x;
                        pointWorldY = worldPos.y;
                    }
                    if (pointWorldX !== undefined && pointWorldY !== undefined) {
                        return pointWorldX >= minWorldX && pointWorldX <= maxWorldX &&
                            pointWorldY >= minWorldY && pointWorldY <= maxWorldY;
                    }
                    return false;
                });
                if (hasPointInArea) {
                    foundObjects.drawings.push(path);
                }
            }
        });

        // Check terrain tiles - convert world bounds to grid coordinates and find all tiles in range
        const startGrid = gridSystem.worldToGrid(minWorldX, minWorldY);
        const endGrid = gridSystem.worldToGrid(maxWorldX, maxWorldY);
        const minGridX = Math.min(startGrid.x, endGrid.x);
        const maxGridX = Math.max(startGrid.x, endGrid.x);
        const minGridY = Math.min(startGrid.y, endGrid.y);
        const maxGridY = Math.max(startGrid.y, endGrid.y);

        // Check all grid positions in the selected area for terrain tiles
        for (let gridX = minGridX; gridX <= maxGridX; gridX++) {
            for (let gridY = minGridY; gridY <= maxGridY; gridY++) {
                const tileKey = `${gridX},${gridY}`;
                if (terrainData[tileKey]) {
                    foundObjects.terrainTiles.push({ gridX, gridY, tileKey });
                }
            }
        }

        return foundObjects;
    }, [tokens, characterTokens, gridItems, environmentalObjects, wallData, drawingPaths, terrainData, zoomLevel, playerZoom]);

    // Handle area removal by object type
    const handleAreaRemove = useCallback((removeType) => {
        if (!selectedAreaObjects) return;

        // Check if in multiplayer and sync removals
        import('../../store/gameStore').then(({ default: useGameStore }) => {
            const gameStore = useGameStore.getState();
            const isInMultiplayer = gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected;

            if (removeType === 'all') {
                // Remove all objects entirely
                selectedAreaObjects.tokens.forEach(token => removeToken(token.id));
                selectedAreaObjects.characterTokens.forEach(token => removeCharacterToken(token.id));
                selectedAreaObjects.items.forEach(item => removeItemFromGrid(item.id));
                selectedAreaObjects.environmentalObjects.forEach(obj => removeEnvironmentalObject(obj.id));
                selectedAreaObjects.walls.forEach(({ key }) => {
                    // Remove wall by key
                    const [x1, y1, x2, y2] = key.split(',').map(Number);
                    setWall(x1, y1, x2, y2, null); // Setting to null should remove it
                });
                selectedAreaObjects.drawings.forEach(path => removeDrawingPath(path.id));
                selectedAreaObjects.terrainTiles.forEach(({ gridX, gridY }) => {
                    clearTerrain(gridX, gridY);
                });
            } else if (removeType === 'tokens') {
                // Remove only creature tokens
                selectedAreaObjects.tokens.forEach(token => removeToken(token.id));
            } else if (removeType === 'characterTokens') {
                // Remove only character tokens
                selectedAreaObjects.characterTokens.forEach(token => removeCharacterToken(token.id));
            } else if (removeType === 'items') {
                // Remove only items
                selectedAreaObjects.items.forEach(item => removeItemFromGrid(item.id));
            } else if (removeType === 'environmentalObjects') {
                // Remove only environmental objects (GM Notes, etc.)
                selectedAreaObjects.environmentalObjects.forEach(obj => removeEnvironmentalObject(obj.id));
            } else if (removeType === 'walls') {
                // Remove only walls
                selectedAreaObjects.walls.forEach(({ key }) => {
                    const [x1, y1, x2, y2] = key.split(',').map(Number);
                    setWall(x1, y1, x2, y2, null);
                });
            } else if (removeType === 'drawings') {
                // Remove only drawings
                selectedAreaObjects.drawings.forEach(path => removeDrawingPath(path.id));
            } else if (removeType === 'terrainTiles') {
                // Remove only terrain tiles
                selectedAreaObjects.terrainTiles.forEach(({ gridX, gridY }) => {
                    clearTerrain(gridX, gridY);
                });
            }

            // Sync area remove to other players in multiplayer
            if (isInMultiplayer) {
                gameStore.multiplayerSocket.emit('area_remove', {
                    removeType,
                    selectedObjects: selectedAreaObjects
                });
            }

            // Reset state
            setSelectedAreaObjects(null);
        }).catch(() => {
            // If not in multiplayer, just remove locally
            if (removeType === 'all') {
                selectedAreaObjects.tokens.forEach(token => removeToken(token.id));
                selectedAreaObjects.characterTokens.forEach(token => removeCharacterToken(token.id));
                selectedAreaObjects.items.forEach(item => removeItemFromGrid(item.id));
                selectedAreaObjects.environmentalObjects.forEach(obj => removeEnvironmentalObject(obj.id));
                selectedAreaObjects.walls.forEach(({ key }) => {
                    const [x1, y1, x2, y2] = key.split(',').map(Number);
                    setWall(x1, y1, x2, y2, null);
                });
                selectedAreaObjects.drawings.forEach(path => removeDrawingPath(path.id));
                selectedAreaObjects.terrainTiles.forEach(({ gridX, gridY }) => {
                    clearTerrain(gridX, gridY);
                });
            } else if (removeType === 'tokens') {
                selectedAreaObjects.tokens.forEach(token => removeToken(token.id));
            } else if (removeType === 'characterTokens') {
                selectedAreaObjects.characterTokens.forEach(token => removeCharacterToken(token.id));
            } else if (removeType === 'items') {
                selectedAreaObjects.items.forEach(item => removeItemFromGrid(item.id));
            } else if (removeType === 'environmentalObjects') {
                selectedAreaObjects.environmentalObjects.forEach(obj => removeEnvironmentalObject(obj.id));
            } else if (removeType === 'walls') {
                selectedAreaObjects.walls.forEach(({ key }) => {
                    const [x1, y1, x2, y2] = key.split(',').map(Number);
                    setWall(x1, y1, x2, y2, null);
                });
            } else if (removeType === 'drawings') {
                selectedAreaObjects.drawings.forEach(path => removeDrawingPath(path.id));
            } else if (removeType === 'terrainTiles') {
                selectedAreaObjects.terrainTiles.forEach(({ gridX, gridY }) => {
                    clearTerrain(gridX, gridY);
                });
            }
            setSelectedAreaObjects(null);
        });
    }, [selectedAreaObjects, removeToken, removeCharacterToken, removeItemFromGrid, removeEnvironmentalObject, removeDrawingPath, setWall, clearTerrain]);

    // Handle mouse events for drawing
    const handleMouseDown = useCallback((e) => {
        console.log('[RAW_MOUSEDOWN]', e.clientX, e.clientY, 'tool:', selectedTool);
        if (!isEditorMode) return;

        // CRITICAL: Capture the current map ID at the EXACT moment of mouse down
        // This ID will be used for all subsequent move/up events for this interaction
        // to prevent data bleeding if the map switches before the mouse is released.
        activeMapIdRef.current = getExplicitCurrentMapId();

        // Ignore right-clicks (button 2, context menu) and middle-clicks
        // (button 1, camera panning) - only the left button draws/places.
        if (e.button !== 0) {
            return;
        }

        // Push undo snapshot before any editing operation (non-select tools only)
        const nonEditingTools = ['select', 'wall_select', 'grid_settings', 'grid_toggle', 'lighting_settings'];
        if (!nonEditingTools.includes(selectedTool)) {
            pushHistorySnapshot();
        }

        // Check if the click is on a background image - ignore it here UNLESS we're in background manipulation mode
        // In background manipulation mode, we want to allow clicks on backgrounds for resizing/moving
        const gameStore = useGameStore.getState();
        const isBackgroundManipulationMode = gameStore.isBackgroundManipulationMode;

        if (!isBackgroundManipulationMode) {
            // Only ignore clicks on actual background layer elements, not the grid overlay
            // Background layers are rendered as divs with specific data attributes or classes
            const allElementsAtPoint = document.elementsFromPoint(e.clientX, e.clientY);
            const isBackgroundImage = allElementsAtPoint.some(el => {
                if (!el) return false;

                // Check if element is within MapLibraryWindow components (map-thumbnail, map-placeholder)
                const isInMapThumbnail = el.closest('.map-thumbnail') || el.closest('.map-placeholder');
                if (isInMapThumbnail) {
                    return true;
                }

                // Check if it's a manipulation handle (resize/rotate handles for backgrounds)
                if (el.hasAttribute('data-manipulation-handle')) {
                    return true;
                }

                // Check if element is within a Resizable component (background layers use this)
                const isInResizable = el.closest('.react-resizable') || el.closest('[data-resizable="true"]');
                if (isInResizable) {
                    // Only ignore if it's actually a background layer, not the grid overlay
                    // Background layers have a data attribute or are children of background containers
                    const backgroundLayer = el.closest('[data-background-id]') || el.closest('[data-background-layer]');
                    if (backgroundLayer) {
                        return true;
                    }
                }

                // Check if it's an img element that's part of a background layer
                if (el.tagName === 'IMG') {
                    const backgroundLayer = el.closest('[data-background-id]') || el.closest('[data-background-layer]');
                    if (backgroundLayer) {
                        return true;
                    }
                }

                // Don't block clicks on the grid overlay or editor overlay
                if (el.id === 'grid-overlay' || el.closest('#grid-overlay') ||
                    el.closest('.vtt-drawing-overlay') || el.closest('.terrain-system-canvas') ||
                    el.closest('.canvas-wall-system')) {
                    return false;
                }

                return false;
            });

            if (isBackgroundImage) {
                return; // Let the background image's own event handler deal with it
            }
        }

        // For select tool, let ObjectSystem handle the events
        if (selectedTool === 'select') {
            // Don't prevent default or stop propagation - let ObjectSystem handle it
            return;
        }

        // If an environmental object is currently selected, check if click hits delete or rotate handles
        const currentEnvObjs = useLevelEditorStore.getState().environmentalObjects || [];
        const currentlySelectedObj = currentEnvObjs.find(o => o.selected);
        console.log('[ED_MOUSEDOWN]', { isEditorMode, selectedTool, selObj: currentlySelectedObj?.id, curEnvCount: currentEnvObjs.length });
        // Locked objects have no manipulation handles, so skip handle hit-testing.
        if (currentlySelectedObj && !currentlySelectedObj.locked) {
            const objectDef = PROFESSIONAL_OBJECTS[currentlySelectedObj.type];
            if (objectDef && objectDef.draggable) {
                const gridSystem = getGridSystem();
                const viewport = gridSystem.getViewportDimensions();
                let objScreenPos;
                if (currentlySelectedObj.freePosition && Number.isFinite(currentlySelectedObj.worldX) && Number.isFinite(currentlySelectedObj.worldY)) {
                    try {
                        objScreenPos = gridSystem.worldToScreen(currentlySelectedObj.worldX, currentlySelectedObj.worldY, viewport.width, viewport.height);
                    } catch (err) {
                        objScreenPos = null;
                    }
                } else if (Number.isFinite(currentlySelectedObj.gridX) && Number.isFinite(currentlySelectedObj.gridY)) {
                    const worldCorner = gridSystem.gridToWorldCorner(currentlySelectedObj.gridX, currentlySelectedObj.gridY);
                    objScreenPos = gridSystem.worldToScreen(worldCorner.x + gridSize / 2, worldCorner.y + gridSize / 2, viewport.width, viewport.height);
                }

                if (objScreenPos) {
                    const overlayRect = overlayRef.current?.getBoundingClientRect();
                    const screenX = e.clientX - (overlayRect ? overlayRect.left : 0);
                    const screenY = e.clientY - (overlayRect ? overlayRect.top : 0);

                    const effectiveZoom = (zoomLevel || 1) * (playerZoom || 1);
                    const snappedDeg = snapRotationForHitTest(currentlySelectedObj.type, currentlySelectedObj.rotation || 0);
                    const rotRad = (snappedDeg || 0) * Math.PI / 180;

                    // Same bounds the chrome is drawn with, so the 3D props'
                    // delete/rotate buttons line up with their rendered figure.
                    const bounds = getObjectScreenBounds(currentlySelectedObj, objectDef, objScreenPos, {
                        gridSize,
                        effectiveZoom,
                        rotationRad: rotRad
                    });
                    const { deletePosition, rotatePosition } = getObjectSelectionHandles(bounds);

                    console.log('[HANDLE_CHECK]', { screenX, screenY, rotHx: rotatePosition.x, rotHy: rotatePosition.y, delHx: deletePosition.x, delHy: deletePosition.y, distRot: Math.hypot(screenX - rotatePosition.x, screenY - rotatePosition.y) });

                    if (Math.hypot(screenX - deletePosition.x, screenY - deletePosition.y) <= 22) {
                        e.stopPropagation();
                        e.preventDefault();
                        removeEnvironmentalObject(currentlySelectedObj.id, activeMapIdRef.current);
                        selectEnvironmentalObject(null);
                        return;
                    }

                    // Rotate handle check (right side)
                    if (Math.hypot(screenX - rotatePosition.x, screenY - rotatePosition.y) <= 22) {
                        e.stopPropagation();
                        e.preventDefault();
                        let hasDragged = false;
                        const startX = screenX;
                        const startY = screenY;
                        const startAngle = Math.atan2(screenY - bounds.centerY, screenX - bounds.centerX);
                        const initialRotation = currentlySelectedObj.rotation || 0;
                        const mapId = activeMapIdRef.current;

                        const handleDocRotateMove = (moveEvt) => {
                            const cRect = overlayRef.current?.getBoundingClientRect();
                            if (!cRect) return;
                            const mx = moveEvt.clientX - cRect.left;
                            const my = moveEvt.clientY - cRect.top;
                            if (Math.hypot(mx - startX, my - startY) > 3) {
                                hasDragged = true;
                            }
                            if (hasDragged) {
                                const curAngle = Math.atan2(my - bounds.centerY, mx - bounds.centerX);
                                const deltaDeg = ((curAngle - startAngle) * 180) / Math.PI;
                                let newRot = Math.round((initialRotation + deltaDeg) % 360 + 360) % 360;
                                if (moveEvt.shiftKey) {
                                    newRot = Math.round(newRot / 15) * 15;
                                }
                                updateEnvironmentalObject(currentlySelectedObj.id, {
                                    ...currentlySelectedObj,
                                    rotation: newRot
                                }, mapId);
                            }
                        };

                        const handleDocRotateUp = () => {
                            document.removeEventListener('mousemove', handleDocRotateMove);
                            document.removeEventListener('mouseup', handleDocRotateUp);
                            if (!hasDragged) {
                                // Immediate click without drag: rotate by +45 degrees clockwise
                                const newRot = Math.round((initialRotation + 45) % 360);
                                updateEnvironmentalObject(currentlySelectedObj.id, {
                                    ...currentlySelectedObj,
                                    rotation: newRot
                                }, mapId);
                            }
                        };

                        document.addEventListener('mousemove', handleDocRotateMove);
                        document.addEventListener('mouseup', handleDocRotateUp);
                        return;
                    }
                }
            }
        }

        // In object_place tool, if no catalog object is selected, clicks select existing objects or deselect.
        // Connection placement has no catalog object and is handled by the switch below, so it must not
        // fall into this selection-only path.
        if (selectedTool === 'object_place' && !toolSettings?.selectedObjectType
            && toolSettings?.selectedPlacementType !== 'connection') {
            const clickCoords = screenToGrid(e.clientX, e.clientY);
            if (clickCoords) {
                const objectAtPos = getObjectAtPosition(clickCoords.gridX, clickCoords.gridY);
                if (objectAtPos) {
                    selectEnvironmentalObject(objectAtPos.id);
                } else {
                    selectEnvironmentalObject(null);
                }
            }
            return;
        }

        // Handle tools that don't need drawing state
        switch (selectedTool) {
            case 'text':
                // Handle text placement
                const textCoords = screenToGrid(e.clientX, e.clientY);
                if (textCoords) {
                    handleTextPlacement(textCoords);
                }
                return;
            case 'eraser':
                // Handle drawing eraser
                handleDrawingErase(e.clientX, e.clientY);
                setIsDrawing(true); // Enable for continuous erasing
                return;
            case 'area_remove':
                // Start area selection for removal
                const areaRemoveRect = overlayRef.current?.getBoundingClientRect();
                if (areaRemoveRect) {
                    const screenX = e.clientX - areaRemoveRect.left;
                    const screenY = e.clientY - areaRemoveRect.top;
                    setSelectionRect({ startX: screenX, startY: screenY, endX: screenX, endY: screenY });
                    setIsDrawing(true);
                }
                return;
            case 'object_place':
                    if (toolSettings?.selectedPlacementType === 'connection') {
                    const portalCoords = screenToGrid(e.clientX, e.clientY);
                    if (portalCoords) {
                        // Create connection as dndElement
                        const connectionData = {
                            type: 'connection',
                            gridX: portalCoords.gridX,
                            gridY: portalCoords.gridY,
                            position: { x: portalCoords.worldX, y: portalCoords.worldY },
                            properties: {
                                portalName: 'New Connection',
                                destinationMapId: null,
                                destinationConnectionId: null,
                                destinationPosition: null, // Keep for backward compatibility
                                isActive: true,
                                isHidden: false,
                                color: CONNECTION_MARKER_COLOR,
                                description: ''
                            }
                        };

                        addDndElement(connectionData, activeMapIdRef.current);
                    }
                    return;
                }

                // Place object - NO DRAWING STATE
                const objCoords = screenToGrid(e.clientX, e.clientY);

                // Auto-select GM Notes if no object type is selected (fallback)
                let selectedObjectType = toolSettings.selectedObjectType;
                if (!selectedObjectType) {
                    const availableObjects = Object.keys(PROFESSIONAL_OBJECTS);
                    if (availableObjects.length === 1) {
                        selectedObjectType = availableObjects[0];
                        setToolSettings({
                            ...toolSettings,
                            selectedObjectType: selectedObjectType
                        });
                    }
                }

                if (objCoords && selectedObjectType) {
                    const objectType = selectedObjectType;
                    const objectDef = PROFESSIONAL_OBJECTS[objectType];

                    // Interweave 3D doors into walls if placed near an existing wall
                    const doorFeatureType = DOOR_OBJECT_FEATURE_TYPES[objectType];
                    if (doorFeatureType) {
                        const currentWalls = useLevelEditorStore.getState().wallData || {};
                        const gOX = gridOffsetX || 0;
                        const gOY = gridOffsetY || 0;
                        const clickX = (objCoords.worldX - gOX) / gridSize;
                        const clickY = (objCoords.worldY - gOY) / gridSize;
                        let hasNearbyWall = false;
                        for (const [key, wall] of Object.entries(currentWalls)) {
                            const [x1, y1, x2, y2] = key.split(',').map(Number);
                            if (Number.isFinite(x1) && Number.isFinite(y1) && Number.isFinite(x2) && Number.isFinite(y2)) {
                                const dist = pointSegmentDistance2D(clickX, clickY, x1, y1, x2, y2);
                                if (dist < 1.4) {
                                    hasNearbyWall = true;
                                    break;
                                }
                            }
                        }
                        if (hasNearbyWall) {
                            placeWallFeature(doorFeatureType, e.clientX, e.clientY);
                            return;
                        }
                    }

                    const objectData = {
                        gridX: objCoords.gridX,
                        gridY: objCoords.gridY,
                        type: objectType,
                        rotation: toolSettings.objectRotation || 0,
                        rotationX: toolSettings.objectRotationX || 0,
                        rotationY: toolSettings.objectRotationY || 0,
                        scale: toolSettings.objectScale || 1,
                        layer: 'objects'
                    };

                    // Add special properties for objects that need them
                    if (objectDef?.freePosition) {
                        // For free-positioned objects like GM Notes, use exact click coordinates
                        objectData.worldX = objCoords.worldX;
                        objectData.worldY = objCoords.worldY;
                        objectData.freePosition = true;
                    }

                    if (objectType === 'gmNotes') {
                        const sectionId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                        objectData.gmNotesData = {
                            title: '',
                            description: '',
                            notes: '',
                            noteIcon: 'scroll',
                            structuredNotes: {
                                sensoryDetails: { smell: '', sound: '', touch: '', additional: '' },
                                sections: [{ id: sectionId, title: 'Scene Overview', blocks: [] }],
                                tags: []
                            },
                            handouts: [],
                            items: [],
                            creatures: [],
                            npcs: []
                        };
                    }

                    // Smart surface stacking and attachment:
                    // Check if clicked over an existing environmental object (e.g. chest on stone, torch on wall/pillar, potion on table)
                    const existingObjects = useLevelEditorStore.getState().environmentalObjects || [];
                    let parentCandidate = null;

                    for (const other of existingObjects) {
                        const otherDef = PROFESSIONAL_OBJECTS[other.type];
                        if (!otherDef) continue;
                        const oScale = other.scale || 1;
                        const oWidth = (otherDef.size?.width || 1) * gridSize * oScale;
                        const oHeight = (otherDef.size?.height || 1) * gridSize * oScale;
                        const ox = other.worldX !== undefined ? other.worldX : (other.gridX * gridSize + gridSize / 2);
                        const oy = other.worldY !== undefined ? other.worldY : (other.gridY * gridSize + gridSize / 2);

                        if (
                            objCoords.worldX >= ox - oWidth / 2 &&
                            objCoords.worldX <= ox + oWidth / 2 &&
                            objCoords.worldY >= oy - oHeight / 2 &&
                            objCoords.worldY <= oy + oHeight / 2
                        ) {
                            parentCandidate = other;
                            break;
                        }
                    }

                    const elevOffset = Number.isFinite(toolSettings?.objectElevation) ? toolSettings.objectElevation : 0;

                    if (parentCandidate) {
                        const pWorldX = parentCandidate.worldX !== undefined ? parentCandidate.worldX : (parentCandidate.gridX * gridSize + gridSize / 2);
                        const pWorldY = parentCandidate.worldY !== undefined ? parentCandidate.worldY : (parentCandidate.gridY * gridSize + gridSize / 2);
                        objectData.parentObjectId = parentCandidate.id;
                        objectData.attachOffsetX = objCoords.worldX - pWorldX;
                        objectData.attachOffsetY = objCoords.worldY - pWorldY;
                        objectData.elevation = (parentCandidate.elevation || 0) + 1 + elevOffset;
                    } else if (toolSettings?.snapToWall && (objectDef?.wallMountable || objectDef?.wallSideSnap)) {
                        // Wall-mountable fixtures (torches, banners, shelves) or wall-side furniture
                        // snap to the nearest wall face and aim outward from it ONLY if snapToWall is ON.
                        let gridSystem = null;
                        try {
                            gridSystem = getGridSystem();
                        } catch (error) {
                            gridSystem = null;
                        }
                        const mount = resolveWallMountPlacement({
                            objectDef,
                            worldX: objCoords.worldX,
                            worldY: objCoords.worldY,
                            screenX: objCoords.screenX,
                            screenY: objCoords.screenY,
                            wallData: useLevelEditorStore.getState().wallData || {},
                            elevationData: useLevelEditorStore.getState().elevationData || {},
                            gridSize,
                            gridOffsetX: gridOffsetX || 0,
                            gridOffsetY: gridOffsetY || 0,
                            gridSystem,
                            snapToWall: true
                        });
                        if (mount) {
                            objectData.worldX = mount.mountX;
                            objectData.worldY = mount.mountY;
                            objectData.freePosition = true;
                            objectData.wallAttached = true;
                            objectData.wallKey = mount.wallKey;
                            objectData.wallSide = mount.wallSide;
                            objectData.wallElevation = mount.wallElevation;
                            objectData.rotation = mount.rotation;
                            objectData.elevation = mount.elevation + elevOffset;
                            objectData.gridX = Math.floor((mount.mountX - (gridOffsetX || 0)) / gridSize);
                            objectData.gridY = Math.floor((mount.mountY - (gridOffsetY || 0)) / gridSize);
                        } else {
                            const tileElev = getTileElevation(useLevelEditorStore.getState().elevationData || {}, objCoords.gridX, objCoords.gridY) || 0;
                            objectData.elevation = tileElev + elevOffset;
                        }
                    } else {
                        const tileElev = getTileElevation(useLevelEditorStore.getState().elevationData || {}, objCoords.gridX, objCoords.gridY) || 0;
                        objectData.elevation = tileElev + elevOffset;
                    }

                    const placedObjId = addEnvironmentalObject(objectData, activeMapIdRef.current);
                    if (placedObjId) {
                        selectEnvironmentalObject(placedObjId);
                    }
                }
                return;
            case 'object_select':
                // Select object - NO DRAWING STATE
                const selectCoords = screenToGrid(e.clientX, e.clientY);
                if (selectCoords) {
                    const objectAtPosition = getObjectAtPosition(selectCoords.gridX, selectCoords.gridY);
                    if (objectAtPosition) {
                        selectEnvironmentalObject(objectAtPosition.id);
                    }
                }
                return;
            case 'object_delete':
                // Delete object - NO DRAWING STATE
                const deleteCoords = screenToGrid(e.clientX, e.clientY);
                if (deleteCoords) {
                    const objectToDelete = getObjectAtPosition(deleteCoords.gridX, deleteCoords.gridY);
                    if (objectToDelete) {
                        removeEnvironmentalObject(objectToDelete.id, activeMapIdRef.current);
                    }
                }
                return;
            case 'door_place':
                // Don't place doors if we're currently dragging or have a selection active
                if (isDraggingWall || isObjectLocked || selectedWindow || selectedWallKey) {
                    return;
                }
                placeWallFeature(toolSettings.selectedWallType, e.clientX, e.clientY);
                return;

            case 'window_place':
                // Don't place windows if we're currently dragging or have a selection active
                if (isDraggingWall || isObjectLocked || selectedWindow || selectedWallKey) {
                    return;
                }
                placeWallFeature(toolSettings.selectedWallType, e.clientX, e.clientY);
                return;

            case 'wall_erase':
                // Erase wall or window at clicked position - NO DRAWING STATE
                const eraseWallCoords = screenToGrid(e.clientX, e.clientY);
                if (eraseWallCoords) {
                    const gx = eraseWallCoords.gridX;
                    const gy = eraseWallCoords.gridY;
                    const clickX = gx + 0.5;
                    const clickY = gy + 0.5;

                    // First check for windows near this position
                    let windowRemoved = false;
                    if (windowOverlays) {
                        // Find nearest window within range
                        let nearestWindowKey = null;
                        let nearestDist = 1.5; // Max distance to detect

                        for (const [windowKey, windowData] of Object.entries(windowOverlays)) {
                            const wx = windowData.gridX;
                            const wy = windowData.gridY;
                            const dist = Math.sqrt(Math.pow(clickX - wx, 2) + Math.pow(clickY - wy, 2));
                            if (dist < nearestDist) {
                                nearestDist = dist;
                                nearestWindowKey = windowKey;
                            }
                        }

                        if (nearestWindowKey) {
                            const windowData = windowOverlays[nearestWindowKey];
                            removeWindowOverlay(windowData.gridX, windowData.gridY);
                            windowRemoved = true;
                        }
                    }

                    // If no window removed, try removing walls
                    if (!windowRemoved) {
                        const wallsNear = findWallsNearPosition(
                            clickX,
                            clickY,
                            { x: eraseWallCoords.worldX, y: eraseWallCoords.worldY }
                        );
                        if (wallsNear.length > 0) {
                            wallsNear.forEach(wall => {
                                removeWall(wall.x1, wall.y1, wall.x2, wall.y2, activeMapIdRef.current);
                            });
                        }
                    }
                }
                return;

            case 'wall_select': {
                const wallSelectCoords = screenToGrid(e.clientX, e.clientY);
                if (!wallSelectCoords) return;

                const selGx = wallSelectCoords.gridX;
                const selGy = wallSelectCoords.gridY;
                // Use precise coordinates for window selection (not snapped to tile centers)
                const selClickX = wallSelectCoords.worldX !== undefined && wallSelectCoords.worldY !== undefined
                    ? (wallSelectCoords.worldX - gridOffsetX) / gridSize
                    : selGx + 0.5;
                const selClickY = wallSelectCoords.worldX !== undefined && wallSelectCoords.worldY !== undefined
                    ? (wallSelectCoords.worldY - gridOffsetY) / gridSize
                    : selGy + 0.5;

                // Endpoint handle grab: if a wall is selected and the click lands on one of its
                // gold endpoint circles, start reshaping the wall instead of moving it
                if (selectedWallKey && wallData[selectedWallKey]) {
                    const [ex1, ey1, ex2, ey2] = selectedWallKey.split(',').map(Number);
                    const selWallType = typeof wallData[selectedWallKey] === 'string'
                        ? wallData[selectedWallKey]
                        : wallData[selectedWallKey]?.type;
                    const selIsDoor = selWallType && selWallType.includes('door');
                    if (!selIsDoor) {
                        const pxPerGridUnit = (gridSize || 50) * (zoomLevel || 1) * (playerZoom || 1);
                        // Grab radius enlarged to 28 screen pixels so the gold endpoint
                        // handles are easy to click; matches the enlarged visual handles
                        const endpointTol = 28 / (pxPerGridUnit || 50);
                        const d1 = Math.hypot(selClickX - ex1, selClickY - ey1);
                        const d2 = Math.hypot(selClickX - ex2, selClickY - ey2);
                        // eslint-disable-next-line no-console
                        console.log('[epcheck] ' + JSON.stringify({ selClickX: Math.round(selClickX * 100) / 100, selClickY: Math.round(selClickY * 100) / 100, ex1, ey1, ex2, ey2, tol: Math.round(endpointTol * 100) / 100, d1: Math.round(d1 * 100) / 100, d2: Math.round(d2 * 100) / 100 }));
                        if (d1 <= endpointTol || d2 <= endpointTol) {
                            dragWallRef.current = { x1: ex1, y1: ey1, x2: ex2, y2: ey2, key: selectedWallKey };
                            // Anchor = the endpoint that stays fixed; the grabbed one follows the mouse
                            dragEndpointRef.current = d1 <= d2
                                ? { anchorX: ex2, anchorY: ey2 }
                                : { anchorX: ex1, anchorY: ey1 };
                            dragWindowRef.current = null;
                            lastDragPosRef.current = { gridX: selGx, gridY: selGy };
                            setIsObjectLocked(true);
                            setWallDragStart({ gridX: selGx, gridY: selGy });
                            setIsDraggingWall(true);
                            setIsDrawing(true);
                            return;
                        }
                    }
                }

                // First, try to find objects at click position (check for new selection)
                let foundWindow = null;
                let foundWall = null;

                // Check windows first (smaller targets)
                if (windowOverlays) {
                    let nearestDist = 1.5;
                    for (const [windowKey, windowData] of Object.entries(windowOverlays)) {
                        const wx = windowData.gridX;
                        const wy = windowData.gridY;
                        const dist = Math.sqrt(Math.pow(selClickX - wx, 2) + Math.pow(selClickY - wy, 2));
                        if (dist < nearestDist) {
                            nearestDist = dist;
                            foundWindow = {
                                key: windowKey,
                                gridX: wx,
                                gridY: wy,
                                data: windowData
                            };
                        }
                    }
                }

                // Check walls/doors if no window found
                if (!foundWindow) {
                    const wallsNear = findWallsNearPosition(selClickX, selClickY);
                    if (wallsNear.length > 0) {
                        foundWall = wallsNear[0];
                    }
                }

                // If clicking on a different object, change selection
                const clickedDifferentObject =
                    (foundWindow && (!selectedWindow || foundWindow.key !== selectedWindow.key)) ||
                    (foundWall && (!selectedWallKey || foundWall.key !== selectedWallKey));

                if (clickedDifferentObject) {
                    // Cancel any pending window/door drag RAF updates
                    if (windowDragRafRef.current !== null) {
                        cancelAnimationFrame(windowDragRafRef.current);
                        windowDragRafRef.current = null;
                    }
                    if (doorDragRafRef.current !== null) {
                        cancelAnimationFrame(doorDragRafRef.current);
                        doorDragRafRef.current = null;
                    }
                    pendingWindowUpdateRef.current = null;
                    pendingDoorUpdateRef.current = null;
                    setIsDraggingWall(false);
                    setIsDrawing(false);

                    if (foundWindow) {
                        // Select new window
                        dragWindowRef.current = {
                            gridX: foundWindow.gridX,
                            gridY: foundWindow.gridY,
                            data: foundWindow.data
                        };
                        dragWallRef.current = null;
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };

                        setSelectedWindow(foundWindow);
                        setSelectedWindowKey(foundWindow.key);
                        setSelectedWallKey(null);
                        setIsObjectLocked(true);
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    } else if (foundWall) {
                        // Select new wall
                        const [x1, y1, x2, y2] = foundWall.key.split(',').map(Number);
                        dragWallRef.current = { x1, y1, x2, y2, key: foundWall.key };
                        dragEndpointRef.current = null;
                        dragWindowRef.current = null;
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };

                        setSelectedWallKey(foundWall.key);
                        setSelectedWindowKey(null);
                        setSelectedWindow(null);
                        setIsObjectLocked(true);
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    }
                }

                // If clicking on the same object or empty space while locked, start dragging
                if (isObjectLocked && (selectedWallKey || selectedWindow)) {
                    // Check if clicking on the same object
                    const clickedSameObject =
                        (foundWindow && selectedWindow && foundWindow.key === selectedWindow.key) ||
                        (foundWall && selectedWallKey && foundWall.key === selectedWallKey) ||
                        (!foundWindow && !foundWall); // Empty space

                    if (clickedSameObject) {
                        // Initialize drag refs from current state
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };
                        if (selectedWindow) {
                            dragWindowRef.current = {
                                gridX: selectedWindow.gridX,
                                gridY: selectedWindow.gridY,
                                data: selectedWindow.data
                            };
                            dragWallRef.current = null;
                        } else if (selectedWallKey) {
                            const [x1, y1, x2, y2] = selectedWallKey.split(',').map(Number);
                            dragWallRef.current = { x1, y1, x2, y2, key: selectedWallKey };
                            dragEndpointRef.current = null;
                            dragWindowRef.current = null;
                        }
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    }
                }

                // If not locked, allow selection
                if (!isObjectLocked) {
                    if (foundWindow) {
                        // Cancel any pending window/door drag RAF updates
                        if (windowDragRafRef.current !== null) {
                            cancelAnimationFrame(windowDragRafRef.current);
                            windowDragRafRef.current = null;
                        }
                        if (doorDragRafRef.current !== null) {
                            cancelAnimationFrame(doorDragRafRef.current);
                            doorDragRafRef.current = null;
                        }
                        pendingWindowUpdateRef.current = null;
                        pendingDoorUpdateRef.current = null;

                        dragWindowRef.current = {
                            gridX: foundWindow.gridX,
                            gridY: foundWindow.gridY,
                            data: foundWindow.data
                        };
                        dragWallRef.current = null;
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };

                        setSelectedWindow(foundWindow);
                        setSelectedWindowKey(foundWindow.key);
                        setSelectedWallKey(null);
                        setIsObjectLocked(true);
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    } else if (foundWall) {
                        const [x1, y1, x2, y2] = foundWall.key.split(',').map(Number);
                        dragWallRef.current = { x1, y1, x2, y2, key: foundWall.key };
                        dragEndpointRef.current = null;
                        dragWindowRef.current = null;
                        lastDragPosRef.current = { gridX: selGx, gridY: selGy };

                        setSelectedWallKey(foundWall.key);
                        setSelectedWindowKey(null);
                        setSelectedWindow(null);
                        setIsObjectLocked(true);
                        setWallDragStart({ gridX: selGx, gridY: selGy });
                        setIsDraggingWall(true);
                        setIsDrawing(true);
                        return;
                    } else {
                        // Clicked on empty space - deselect
                        setSelectedWallKey(null);
                        setSelectedWindowKey(null);
                        setSelectedWindow(null);
                        dragWindowRef.current = null;
                        dragWallRef.current = null;
                        lastDragPosRef.current = null;
                    }
                }
                return;
            }
            case 'fog_clear_all':
                // Clear all fog - NO DRAWING STATE
                clearAllFog(activeMapIdRef.current);
                return;
            case 'fog_cover_map':
                // Cover entire map with fog - NO DRAWING STATE
                coverEntireMapWithFog(gridSize, activeMapIdRef.current);
                return;
        }

        // Handle fog drawing - paint immediately on click
        if (selectedTool === 'fog_draw') {
            const fogCoords = screenToGrid(e.clientX, e.clientY);
            if (fogCoords) {
                addFogAtPosition(fogCoords.worldX, fogCoords.worldY, toolSettings.brushSize || 1, gridSize);
            }
            setIsDrawing(true);
            setIsCurrentlyDrawing(true);
            setCurrentDrawingTool(selectedTool);
            if (typeof window !== 'undefined') {
                window._isDrawingFog = true;
            }
            return;
        }

        // Handle fog erasing - paint immediately on click (not waiting for mouse release)
        if (selectedTool === 'fog_erase') {
            const fogCoords = screenToGrid(e.clientX, e.clientY);
            if (fogCoords) {
                removeFogAtPosition(fogCoords.worldX, fogCoords.worldY, toolSettings.brushSize || 1, gridSize, activeMapIdRef.current);
            }
            // Set drawing state for continuous painting while dragging
            setIsDrawing(true);
            setIsCurrentlyDrawing(true);
            setCurrentDrawingTool(selectedTool);
            if (typeof window !== 'undefined') {
                window._isDrawingFog = true;
            }
            return;
        }

        // Set drawing state for tools that need it
        setIsDrawing(true);
        setIsCurrentlyDrawing(true);
        setCurrentDrawingTool(selectedTool);

        // Handle different drawing tool types
        switch (selectedTool) {
            case 'freehand':
                // Start freehand drawing with world coordinates so it sticks to the grid
                const rect = overlayRef.current?.getBoundingClientRect();
                if (rect) {
                    const screenX = e.clientX - rect.left;
                    const screenY = e.clientY - rect.top;

                    // Convert screen coordinates to world coordinates
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    const worldCoords = gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height);

                    const worldPoint = {
                        worldX: worldCoords.x,
                        worldY: worldCoords.y,
                        isWorldCoords: true // Flag to distinguish from grid coords
                    };
                    setCurrentPath([worldPoint]);
                    setCurrentDrawingPath([worldPoint]);
                }
                return; // Don't process grid-based actions for freehand
            case 'line':
            case 'rectangle':
            case 'circle':
                // Start shape drawing with grid coordinates
                const shapeCoords = screenToGrid(e.clientX, e.clientY);
                if (shapeCoords) {
                    setCurrentPath([shapeCoords]);
                    setCurrentDrawingPath([shapeCoords]);
                    setIsDrawing(true);
                    setIsCurrentlyDrawing(true);
                    setCurrentDrawingTool(selectedTool);
                }
                return;
            case 'polygon':
                // Handle polygon point addition
                const polyCoords = screenToGrid(e.clientX, e.clientY);
                if (polyCoords) {
                    if (isDrawing && currentPath.length > 0) {
                        // Check if clicking near the first point to complete polygon
                        const firstPoint = currentPath[0];
                        const distance = Math.sqrt(
                            Math.pow(polyCoords.gridX - firstPoint.gridX, 2) +
                            Math.pow(polyCoords.gridY - firstPoint.gridY, 2)
                        );

                        if (distance < 1.0 && currentPath.length >= 3) {
                            // Complete the polygon by finalizing it
                            const pathData = {
                                tool: 'polygon',
                                points: currentPath,
                                style: {
                                    strokeWidth: toolSettings.strokeWidth || 2,
                                    strokeColor: toolSettings.strokeColor || '#000000',
                                    fillColor: toolSettings.fillColor || 'transparent',
                                    opacity: toolSettings.opacity || 1
                                },
                                layer: 'drawings',
                                timestamp: Date.now()
                            };

                            addDrawingPath(pathData, activeMapIdRef.current);

                            // Reset drawing state
                            setIsDrawing(false);
                            setCurrentPath([]);
                            clearCurrentDrawing();
                            setIsCurrentlyDrawing(false);
                            setCurrentDrawingTool('');
                        } else {
                            // Add point to existing polygon
                            setCurrentPath(prev => [...prev, polyCoords]);
                            setCurrentDrawingPath(prev => [...prev, polyCoords]);
                        }
                    } else {
                        // Start new polygon
                        setCurrentPath([polyCoords]);
                        setCurrentDrawingPath([polyCoords]);
                        setIsDrawing(true);
                        setIsCurrentlyDrawing(true);
                        setCurrentDrawingTool('polygon');
                    }
                }
                return;
        }

        // For grid-based tools, use grid coordinates
        const coords = screenToGrid(e.clientX, e.clientY);
        if (!coords) return;
        setCurrentPath([coords]);

        // Projected views: pick walls against their SVG prisms (the canvas wall
        // renderer and its DOM overlay are disabled/misaligned in 2.5D/rotated views).
        try {
            const gridState = getGridSystem().getGridState();
            const isProjectedView = gridState.viewMode === '2.5d' ||
                Math.abs(((gridState.viewRotation % 360) + 360) % 360) > 0.001;
            if (isProjectedView && (selectedTool === 'wall_select' || selectedTool === 'wall_erase')) {
                const pickedWallKey = pickWallAtScreenPoint({
                    screenX: e.clientX,
                    screenY: e.clientY,
                    wallData: useLevelEditorStore.getState().wallData,
                    gridSystem: getGridSystem()
                });
                if (pickedWallKey) {
                    if (selectedTool === 'wall_erase') {
                        removeWall(pickedWallKey);
                    } else {
                        setSelectedWallKey(pickedWallKey);
                    }
                    return;
                }
            }
        } catch (pickError) {
            console.warn('Projected wall picking failed:', pickError);
        }

        // Handle grid-based tool actions
        switch (selectedTool) {
            case 'terrain_brush':
                // Apply terrain with brush
                // Use selectedTerrainType or default to 'grass' if not set
                const terrainType = toolSettings.selectedTerrainType || 'grass';
                // Convert brushSize to number if it's a string (legacy support)
                const brushSize = typeof toolSettings.brushSize === 'number'
                    ? toolSettings.brushSize
                    : (typeof toolSettings.brushSize === 'string' && toolSettings.brushSize !== 'medium'
                        ? parseInt(toolSettings.brushSize) || 1
                        : 1);

                // Track last position for line interpolation
                lastTerrainBrushPosRef.current = coords;

                paintTerrainBrush(
                    coords.gridX,
                    coords.gridY,
                    terrainType,
                    brushSize,
                    activeMapIdRef.current // Use captured map ID
                );
                break;
            case 'terrain_erase':
                // Erase terrain with brush size
                // Track last position for line interpolation
                lastTerrainBrushPosRef.current = coords;
                removeTerrainAtPosition(coords.gridX, coords.gridY, toolSettings.brushSize || 1, activeMapIdRef.current);
                break;
            case 'elevation':
            case 'elevation_raise':
            case 'elevation_lower':
            case 'elevation_flatten': {
                elevationStrokePaintedRef.current = new Set();
                const elevationMode = selectedTool === 'elevation' ? 'raise' : selectedTool.replace('elevation_', '');
                applyElevationStamp(
                    coords.gridX,
                    coords.gridY,
                    elevationMode,
                    toolSettings.elevationTargetLevel ?? 1,
                    toolSettings.elevationBrushSize || 1
                );
                break;
            }
            case 'elevation_ramp': {
                setRampAt(coords.gridX, coords.gridY, {
                    dir: toolSettings.rampDirection || 'e',
                    type: toolSettings.rampType || 'ramp'
                });
                break;
            }
            case 'light_place': {
                const lightTypeKey = useLevelEditorStore.getState().selectedLightType || 'torch';
                const lightPreset = LIGHT_PRESETS[lightTypeKey] || LIGHT_PRESETS.torch;
                addLightSource({
                    x: coords.gridX,
                    y: coords.gridY,
                    type: lightTypeKey,
                    radius: lightPreset.radius,
                    intensity: lightPreset.intensity,
                    color: lightPreset.color,
                    flickering: lightPreset.flickering
                });
                break;
            }
            case 'light_erase': {
                const lightState = useLevelEditorStore.getState();
                const lights = lightState.lightSources || {};
                let nearestId = null;
                let nearestDistance = Infinity;
                Object.values(lights).forEach(light => {
                    const dx = (light.x ?? light.gridX) - coords.gridX;
                    const dy = (light.y ?? light.gridY) - coords.gridY;
                    const distance = Math.hypot(dx, dy);
                    if (distance < nearestDistance) {
                        nearestDistance = distance;
                        nearestId = light.id;
                    }
                });
                if (nearestId && nearestDistance <= 1.5) {
                    removeLightSource(nearestId);
                }
                break;
            }
            case 'wall_draw':
                // Handle different wall drawing modes
                {
                    const activeWallType = toolSettings.selectedWallType || 'stone_wall';
                    const wallTypeData = WALL_TYPES[activeWallType];
                    const validWallType = (!wallTypeData || wallTypeData.interactive || wallTypeData.category === 'window')
                        ? 'stone_wall'
                        : activeWallType;
                    if (validWallType !== toolSettings.selectedWallType) {
                        setToolSettings(prev => ({ ...prev, selectedWallType: validWallType }));
                    }
                    // Snap to nearest grid intersection (corner) for wall placement
                    // Using Math.round instead of Math.floor so both X and Y advance
                    // at tile centers, enabling clean diagonal walls across tiles.
                    // Hex grids paint vertex-connected hex edges under the cursor.
                    const wdGs = gridSize || 50;
                    const wdGox = gridOffsetX || 0;
                    const wdGoy = gridOffsetY || 0;
                    const wallStartGridSystem = getGridSystem();
                    const wallStartGridType = wallStartGridSystem.getGridState().gridType;
                    if (wallStartGridType === 'hex') {
                        const vertex = wallStartGridSystem.snapToHexVertex(coords.worldX, coords.worldY);
                        wallChainRef.current = {
                            wallType: validWallType,
                            committed: false,
                            moved: false,
                            startVertex: vertex,
                            endVertex: vertex
                        };
                        const wallStartCoord = vertex
                            ? { ...coords, gridX: vertex.cell.q, gridY: vertex.cell.r }
                            : coords;
                        setIsCurrentlyDrawing(true);
                        setCurrentDrawingTool('wall_draw');
                        setCurrentPath([wallStartCoord]);
                        setCurrentDrawingPath(vertex ? hexSegmentPreviewPath(vertex, vertex) : []);
                        break;
                    }
                    const wallStartGx = coords.worldX !== undefined
                        ? Math.round((coords.worldX - wdGox) / wdGs)
                        : coords.gridX;
                    const wallStartGy = coords.worldY !== undefined
                        ? Math.round((coords.worldY - wdGoy) / wdGs)
                        : coords.gridY;
                    // Track start and current endpoint for direct-line wall drawing
                    wallChainRef.current = {
                        segStartX: wallStartGx,
                        segStartY: wallStartGy,
                        lastX: wallStartGx,
                        lastY: wallStartGy,
                        dirX: null,
                        dirY: null,
                        wallType: validWallType,
                        committed: false
                    };
                    // Start drawing for both continuous and rectangle modes (+ live ghost preview)
                    const wallStartCoord = { ...coords, gridX: wallStartGx, gridY: wallStartGy };
                    setIsCurrentlyDrawing(true);
                    setCurrentDrawingTool('wall_draw');
                    setCurrentPath([wallStartCoord]);
                    setCurrentDrawingPath([wallStartCoord]);
                }
                break;
            // Fog painting is handled above before this switch statement
            default:
                break;
        }
    }, [isEditorMode, selectedTool, screenToGrid, toolSettings, paintTerrainBrush, removeTerrainAtPosition, paintTerrainLine, removeTerrainLine, removeFogAtPosition, gridSize, zoomLevel, playerZoom, getObjectAtPosition, selectEnvironmentalObject, removeEnvironmentalObject, updateEnvironmentalObject, addEnvironmentalObject, clearAllFog, coverEntireMapWithFog, setIsDrawing, setIsCurrentlyDrawing, setCurrentDrawingTool, setCurrentPath, setCurrentDrawingPath, pushHistorySnapshot, applyElevationStamp, setRampAt, placeWallFeature]);

    const handleMouseMove = useCallback((e) => {
        // For select tools, let ObjectSystem handle the events
        if (selectedTool === 'select') {
            return;
        }

        // Update selection rectangle for area_remove tool
        if (selectedTool === 'area_remove' && selectionRect && isDrawing) {
            const rect = overlayRef.current?.getBoundingClientRect();
            if (rect) {
                const screenX = e.clientX - rect.left;
                const screenY = e.clientY - rect.top;
                setSelectionRect(prev => ({
                    ...prev,
                    endX: screenX,
                    endY: screenY
                }));
            }
            return;
        }

        // Update hover preview for brush tools and eraser (throttled via RAF)
        const isElevationTool = String(selectedTool).startsWith('elevation');
        if (isEditorMode && (selectedTool === 'terrain_brush' || selectedTool === 'terrain_erase' || selectedTool === 'fog_erase' || selectedTool === 'fog_draw' || isElevationTool)) {
            const coords = screenToGrid(e.clientX, e.clientY);
            const rect = overlayRef.current?.getBoundingClientRect();
            if (coords && rect) {
                const screenX = e.clientX - rect.left;
                const screenY = e.clientY - rect.top;

                const brushSize = isElevationTool
                    ? (toolSettings.elevationBrushSize || 1)
                    : (Number.isFinite(toolSettings.brushSize) ? toolSettings.brushSize : 1);

                // Update ref immediately for instant calculation, but throttle React state updates
                hoverPreviewRef.current = {
                    show: true,
                    gridX: coords.gridX,
                    gridY: coords.gridY,
                    brushSize: brushSize,
                    screenX: (selectedTool === 'fog_erase' || selectedTool === 'fog_draw') ? screenX : undefined,
                    screenY: (selectedTool === 'fog_erase' || selectedTool === 'fog_draw') ? screenY : undefined
                };

                // Throttle React state update via RAF to avoid lag
                throttledUpdateHoverPreview();
            }
        } else if (isEditorMode && selectedTool === 'object_place' &&
            (toolSettings?.selectedObjectType === 'gmNotes' || toolSettings?.selectedPlacementType === 'connection')) {
            // Canvas-rendered placements (GM notes) and connections have no 3D
            // model ghost; track the cursor so PlacementGhostPreview can draw
            // the exact art that gets placed.
            const coords = screenToGrid(e.clientX, e.clientY);
            if (coords) {
                hoverPreviewRef.current = {
                    show: true,
                    ghost: toolSettings?.selectedPlacementType === 'connection' ? 'connection' : 'gmNotes',
                    gridX: coords.gridX,
                    gridY: coords.gridY,
                    screenX: coords.screenX,
                    screenY: coords.screenY,
                    scale: toolSettings?.objectScale || 1,
                    elevation: toolSettings?.objectElevation || 0
                };

                // Throttle React state update via RAF to avoid lag
                throttledUpdateHoverPreview();
            }
        } else if (isEditorMode && selectedTool === 'eraser') {
            // Show eraser cursor
            const rect = overlayRef.current?.getBoundingClientRect();
            if (rect) {
                hoverPreviewRef.current = {
                    show: true,
                    screenX: e.clientX - rect.left,
                    screenY: e.clientY - rect.top,
                    isEraser: true,
                    eraserRadius: 15
                };

                // Throttle React state update via RAF
                throttledUpdateHoverPreview();
            }
        } else {
            // Hide hover preview - update immediately (no need to throttle hiding)
            hoverPreviewRef.current = { show: false, gridX: 0, gridY: 0, brushSize: 1 };
            if (hoverPreviewRafId.current !== null) {
                cancelAnimationFrame(hoverPreviewRafId.current);
                hoverPreviewRafId.current = null;
            }
            setHoverPreview({ show: false, gridX: 0, gridY: 0, brushSize: 1 });
        }

        if (!isDrawing) return;

        // Handle continuous painting for terrain tools
        switch (selectedTool) {
            case 'freehand':
                // Continue freehand drawing with world coordinates
                const rect = overlayRef.current?.getBoundingClientRect();
                if (rect) {
                    const screenX = e.clientX - rect.left;
                    const screenY = e.clientY - rect.top;

                    // Convert screen coordinates to world coordinates
                    const gridSystem = getGridSystem();
                    const viewport = gridSystem.getViewportDimensions();
                    const worldCoords = gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height);

                    const worldPoint = {
                        worldX: worldCoords.x,
                        worldY: worldCoords.y,
                        isWorldCoords: true
                    };

                    // Add point and immediately update drawing path for real-time feedback
                    setCurrentPath(prev => {
                        const newPath = [...prev, worldPoint];
                        // Also update the drawing path immediately
                        setCurrentDrawingPath(newPath);
                        return newPath;
                    });
                }
                break;
            case 'terrain_brush':
                const terrainCoords = screenToGrid(e.clientX, e.clientY);
                if (terrainCoords) {
                    const terrainType = toolSettings.selectedTerrainType || 'grass';
                    const brushSize = typeof toolSettings.brushSize === 'number'
                        ? toolSettings.brushSize
                        : (typeof toolSettings.brushSize === 'string' && toolSettings.brushSize !== 'medium'
                            ? parseInt(toolSettings.brushSize) || 1
                            : 1);

                    // Use optimized line interpolation from store
                    if (lastTerrainBrushPosRef.current) {
                        paintTerrainLine(
                            lastTerrainBrushPosRef.current.gridX,
                            lastTerrainBrushPosRef.current.gridY,
                            terrainCoords.gridX,
                            terrainCoords.gridY,
                            terrainType,
                            brushSize,
                            activeMapIdRef.current // Use captured map ID
                        );
                    } else {
                        paintTerrainBrush(
                            terrainCoords.gridX,
                            terrainCoords.gridY,
                            terrainType,
                            brushSize,
                            activeMapIdRef.current // Use captured map ID
                        );
                    }
                    lastTerrainBrushPosRef.current = terrainCoords;
                }
                break;
            case 'terrain_erase':
                const eraseCoords = screenToGrid(e.clientX, e.clientY);
                if (eraseCoords) {
                    const brushSize = toolSettings.brushSize || 1;

                    // Use optimized line interpolation from store
                    if (lastTerrainBrushPosRef.current) {
                        removeTerrainLine(
                            lastTerrainBrushPosRef.current.gridX,
                            lastTerrainBrushPosRef.current.gridY,
                            eraseCoords.gridX,
                            eraseCoords.gridY,
                            brushSize,
                            activeMapIdRef.current
                        );
                    } else {
                        removeTerrainAtPosition(eraseCoords.gridX, eraseCoords.gridY, brushSize, activeMapIdRef.current);
                    }
                    lastTerrainBrushPosRef.current = eraseCoords;
                }
                break;
            case 'elevation':
            case 'elevation_raise':
            case 'elevation_lower':
            case 'elevation_flatten': {
                const elevationCoords = screenToGrid(e.clientX, e.clientY);
                if (elevationCoords) {
                    const elevationMode = selectedTool === 'elevation' ? 'raise' : selectedTool.replace('elevation_', '');
                    applyElevationStamp(
                        elevationCoords.gridX,
                        elevationCoords.gridY,
                        elevationMode,
                        toolSettings.elevationTargetLevel ?? 1,
                        toolSettings.elevationBrushSize || 1
                    );
                }
                break;
            }
            case 'eraser':
                // Handle drawing eraser - continuously erase while dragging
                handleDrawingErase(e.clientX, e.clientY);
                break;

            case 'fog_erase':
            case 'fog_draw':
                {
                    const isFogErase = selectedTool === 'fog_erase';
                    const fogPaintCoords = screenToGrid(e.clientX, e.clientY);
                    if (fogPaintCoords) {
                        if (!isCurrentlyDrawing) {
                            setIsCurrentlyDrawing(true);
                            setCurrentDrawingTool(selectedTool);
                        }

                        pendingFogPaintRef.current = {
                            worldX: fogPaintCoords.worldX,
                            worldY: fogPaintCoords.worldY,
                            brushSize: toolSettings.brushSize || 1,
                            isErase: isFogErase
                        };

                        if (fogPaintThrottleRef.current === null) {
                            fogPaintThrottleRef.current = requestAnimationFrame(() => {
                                if (pendingFogPaintRef.current) {
                                    if (pendingFogPaintRef.current.isErase) {
                                        removeFogAtPosition(
                                            pendingFogPaintRef.current.worldX,
                                            pendingFogPaintRef.current.worldY,
                                            pendingFogPaintRef.current.brushSize,
                                            gridSize,
                                            activeMapIdRef.current
                                        );
                                    } else {
                                        addFogAtPosition(
                                            pendingFogPaintRef.current.worldX,
                                            pendingFogPaintRef.current.worldY,
                                            pendingFogPaintRef.current.brushSize,
                                            gridSize
                                        );
                                    }
                                    pendingFogPaintRef.current = null;
                                }
                                fogPaintThrottleRef.current = null;
                            });
                        }
                    }
                }
                break;
            case 'wall_draw': {
                // Continue wall drawing - update current path for real-time preview
                const wallCoords = screenToGrid(e.clientX, e.clientY);
                if (wallCoords && currentPath.length > 0) {
                    const wallMoveGridSystem = getGridSystem();
                    const wallMoveGridType = wallMoveGridSystem.getGridState().gridType;
                    const wallMode = toolSettings.wallMode || 'continuous';

                    if (wallMoveGridType === 'hex' && wallMode !== 'rectangle') {
                        // Hex: snap the cursor to the nearest honeycomb corner and
                        // preview one straight wall corner-to-corner.
                        const chain = wallChainRef.current;
                        if (chain && chain.startVertex) {
                            const vertex = wallMoveGridSystem.snapToHexVertex(
                                wallCoords.worldX,
                                wallCoords.worldY
                            );
                            if (vertex && vertex.key !== (chain.endVertex && chain.endVertex.key)) {
                                chain.moved = vertex.key !== chain.startVertex.key;
                                chain.endVertex = vertex;
                                setCurrentDrawingPath(hexSegmentPreviewPath(chain.startVertex, vertex));
                            }
                        }
                        break;
                    }

                    // Snap to nearest grid intersection for wall placement.
                    const wmGs = gridSize || 50;
                    const wmGox = gridOffsetX || 0;
                    const wmGoy = gridOffsetY || 0;
                    const snapGx = wallCoords.worldX !== undefined
                        ? Math.round((wallCoords.worldX - wmGox) / wmGs)
                        : wallCoords.gridX;
                    const snapGy = wallCoords.worldY !== undefined
                        ? Math.round((wallCoords.worldY - wmGoy) / wmGs)
                        : wallCoords.gridY;
                    const snappedCoords = { ...wallCoords, gridX: snapGx, gridY: snapGy };

                    if (wallMode === 'rectangle') {
                        // For rectangle mode, show rectangle preview using snapped coords
                        const newPath = [currentPath[0], snappedCoords];
                        setCurrentPath(newPath);
                        setCurrentDrawingPath(newPath);
                    } else if (wallChainRef.current) {
                        // Direct-line mode: draw a straight wall from start to current cursor
                        // Supports horizontal, vertical, AND diagonal walls
                        const chain = wallChainRef.current;
                        chain.lastX = snapGx;
                        chain.lastY = snapGy;
                        // Ghost preview shows direct line from start to current position
                        setCurrentDrawingPath([
                            { gridX: chain.segStartX, gridY: chain.segStartY },
                            { gridX: chain.lastX, gridY: chain.lastY }
                        ]);
                    } else {
                        // Fallback: show line from start to current position
                        const newPath = [currentPath[0], snappedCoords];
                        setCurrentPath(newPath);
                        setCurrentDrawingPath(newPath);
                    }
                }
                break;
            }
            case 'wall_select':
                // Handle wall or window dragging using refs to avoid stale state
                if (isDraggingWall && lastDragPosRef.current && isDrawing) {
                    const moveCoords = screenToGrid(e.clientX, e.clientY);
                    if (moveCoords) {
                        const deltaX = moveCoords.gridX - lastDragPosRef.current.gridX;
                        const deltaY = moveCoords.gridY - lastDragPosRef.current.gridY;

                        if (dragWindowRef.current) {
                                // Store latest mouse position for smooth dragging
                                pendingWindowUpdateRef.current = {
                                    moveCoords,
                                    gridOffsetX,
                                    gridOffsetY,
                                    gridSize,
                                    findWallsNearPosition,
                                    moveWindowOverlay,
                                    setSelectedWindow
                                };

                                // Chain RAF updates for smooth dragging - always use latest mouse position
                                if (windowDragRafRef.current === null) {
                                    const updateWindowPosition = () => {
                                        const update = pendingWindowUpdateRef.current;
                                        if (!update || !dragWindowRef.current) {
                                            windowDragRafRef.current = null;
                                            return;
                                        }

                                        const { moveCoords, gridOffsetX, gridOffsetY, gridSize, findWallsNearPosition, moveWindowOverlay, setSelectedWindow } = update;

                                        // Always read fresh store state (prevents stale data inside RAF chain)
                                        const { wallData: freshWallData, windowOverlays: freshWindowOverlays } = useLevelEditorStore.getState();

                                        // Move window along walls - can snap to different walls when dragged near them
                                        const oldX = dragWindowRef.current.gridX;
                                        const oldY = dragWindowRef.current.gridY;
                                        let currentWallKey = dragWindowRef.current.data.wallKey;

                                        // Convert mouse position to precise grid coordinates (not snapped)
                                        const clickX = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                            ? (moveCoords.worldX - gridOffsetX) / gridSize
                                            : moveCoords.gridX + 0.5;
                                        const clickY = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                            ? (moveCoords.worldY - gridOffsetY) / gridSize
                                            : moveCoords.gridY + 0.5;

                                        // Skip if position hasn't changed (very small threshold for smoothness)
                                        const distFromLast = Math.sqrt(Math.pow(clickX - oldX, 2) + Math.pow(clickY - oldY, 2));
                                        if (distFromLast < 0.001) {
                                            // Position hasn't changed, just update drag position and continue
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            // Continue RAF chain to check for next update
                                            windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                            return;
                                        }

                                        // Optimize: Only search for new walls if we're far from current wall or it doesn't exist
                                        let validWalls = [];
                                        let shouldSearchForWalls = true;

                                        if (currentWallKey && freshWallData[currentWallKey]) {
                                            const currentWall = freshWallData[currentWallKey];
                                            const wallType = typeof currentWall === 'string' ? currentWall : currentWall?.type;
                                            if (!(wallType && wallType.includes('door'))) {
                                                const [x1, y1, x2, y2] = currentWallKey.split(',').map(Number);
                                                const dx = x2 - x1;
                                                const dy = y2 - y1;
                                                const wallLength = Math.sqrt(dx * dx + dy * dy);

                                                if (wallLength > 0) {
                                                    const t = Math.max(0, Math.min(1,
                                                        ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                                                    ));
                                                    const projX = x1 + t * dx;
                                                    const projY = y1 + t * dy;
                                                    const currentWallDistance = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));

                                                    // If we're close to current wall, use it directly without searching
                                                    // Use a larger threshold (1.5 tiles) to avoid unnecessary searches during smooth dragging
                                                    if (currentWallDistance <= 1.5) {
                                                        shouldSearchForWalls = false;
                                                        validWalls.push({
                                                            key: currentWallKey,
                                                            data: currentWall,
                                                            x1, y1, x2, y2,
                                                            distance: currentWallDistance
                                                        });
                                                    }
                                                }
                                            }
                                        }

                                        // Only search for walls if needed
                                        if (shouldSearchForWalls) {
                                            const nearbyWalls = findWallsNearPosition(clickX, clickY);
                                            validWalls = nearbyWalls.filter(wall => {
                                                const wallType = typeof wall.data === 'string' ? wall.data : wall.data?.type;
                                                return !(wallType && wallType.includes('door'));
                                            });

                                            // Add current wall if it's within reasonable distance
                                            if (currentWallKey && freshWallData[currentWallKey] && !validWalls.find(w => w.key === currentWallKey)) {
                                                const currentWall = freshWallData[currentWallKey];
                                                const wallType = typeof currentWall === 'string' ? currentWall : currentWall?.type;
                                                if (!(wallType && wallType.includes('door'))) {
                                                    const [x1, y1, x2, y2] = currentWallKey.split(',').map(Number);
                                                    const dx = x2 - x1;
                                                    const dy = y2 - y1;
                                                    const wallLength = Math.sqrt(dx * dx + dy * dy);

                                                    if (wallLength > 0) {
                                                        const t = Math.max(0, Math.min(1,
                                                            ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                                                        ));
                                                        const projX = x1 + t * dx;
                                                        const projY = y1 + t * dy;
                                                        const currentWallDistance = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));

                                                        if (currentWallDistance <= 2.0) {
                                                            validWalls.push({
                                                                key: currentWallKey,
                                                                data: currentWall,
                                                                x1, y1, x2, y2,
                                                                distance: currentWallDistance
                                                            });
                                                            validWalls.sort((a, b) => a.distance - b.distance);
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        if (validWalls.length === 0) {
                                            // No valid walls nearby, keep window on current wall if it exists
                                            const currentWall = freshWallData[currentWallKey];
                                            if (!currentWall) {
                                                // Current wall no longer exists, stop dragging
                                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                                windowDragRafRef.current = null;
                                                return;
                                            }
                                            // Continue with current wall - add it to validWalls for projection
                                            const [x1, y1, x2, y2] = currentWallKey.split(',').map(Number);
                                            const dx = x2 - x1;
                                            const dy = y2 - y1;
                                            const wallLength = Math.sqrt(dx * dx + dy * dy);
                                            if (wallLength > 0) {
                                                const t = Math.max(0, Math.min(1,
                                                    ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                                                ));
                                                const projX = x1 + t * dx;
                                                const projY = y1 + t * dy;
                                                const currentWallDistance = Math.sqrt(Math.pow(clickX - projX, 2) + Math.pow(clickY - projY, 2));
                                                validWalls.push({
                                                    key: currentWallKey,
                                                    data: currentWall,
                                                    x1, y1, x2, y2,
                                                    distance: currentWallDistance
                                                });
                                            }
                                        } else {
                                            // Check if we should switch to a different wall
                                            const currentWallIndex = validWalls.findIndex(w => w.key === currentWallKey);
                                            const closestWall = validWalls[0];

                                            // Switch to a different wall if:
                                            // 1. Current wall is not in the nearby list, OR
                                            // 2. A different wall is significantly closer (more than 0.2 tiles closer)
                                            if (currentWallIndex === -1 ||
                                                (closestWall.key !== currentWallKey &&
                                                    closestWall.distance < (validWalls[currentWallIndex]?.distance || Infinity) - 0.2)) {
                                                currentWallKey = closestWall.key;
                                                dragWindowRef.current.data = {
                                                    ...dragWindowRef.current.data,
                                                    wallKey: currentWallKey
                                                };
                                            }
                                        }

                                        // Get the wall we're using (either current or newly selected)
                                        const wall = freshWallData[currentWallKey];
                                        if (!wall) {
                                            // Wall no longer exists, stop dragging
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            windowDragRafRef.current = null;
                                            return;
                                        }

                                        // Parse wall coordinates
                                        const [x1, y1, x2, y2] = currentWallKey.split(',').map(Number);

                                        // Calculate closest point on wall segment to mouse position
                                        const dx = x2 - x1;
                                        const dy = y2 - y1;
                                        const wallLength = Math.sqrt(dx * dx + dy * dy);

                                        if (wallLength === 0) {
                                            // Zero-length wall, can't move - but continue checking
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            // Continue RAF chain to check for next update
                                            windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                            return;
                                        }

                                        // Project mouse point onto wall line, clamp to segment
                                        const t = Math.max(0, Math.min(1,
                                            ((clickX - x1) * dx + (clickY - y1) * dy) / (wallLength * wallLength)
                                        ));

                                        // Closest point on wall - use exact position
                                        const newX = x1 + t * dx;
                                        const newY = y1 + t * dy;
                                        const newKey = `${newX.toFixed(3)},${newY.toFixed(3)}`;
                                        const oldKey = `${oldX.toFixed(3)},${oldY.toFixed(3)}`;

                                        // Skip update if position hasn't changed (prevents unnecessary updates)
                                        if (newKey === oldKey) {
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            // Continue RAF chain to check for next update
                                            windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                            return;
                                        }

                                        // Check if there's already a different window at the target position
                                        const existingWindow = freshWindowOverlays[newKey];
                                        if (existingWindow && newKey !== oldKey) {
                                            // Don't move - there's already a window here, but continue checking
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                            // Continue RAF chain to check for next update
                                            windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                            return;
                                        }

                                        // Atomic move: single store update removes the old key (any format),
                                        // adds the new one and keeps the selection key in sync
                                        moveWindowOverlay(oldX, oldY, newX, newY, currentWallKey, activeMapIdRef.current);

                                        // Update the ref immediately (sync) for next drag event
                                        dragWindowRef.current.gridX = newX;
                                        dragWindowRef.current.gridY = newY;
                                        dragWindowRef.current.data.wallKey = currentWallKey;
                                        lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };

                                        // Also update state for rendering
                                        const newWindowData = {
                                            key: newKey,
                                            gridX: newX,
                                            gridY: newY,
                                            data: {
                                                ...dragWindowRef.current.data,
                                                wallKey: currentWallKey
                                            }
                                        };
                                        setSelectedWindow(newWindowData);

                                        // Continue RAF chain for smooth dragging - check for next update
                                        windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                    };

                                    // Start the RAF chain
                                    windowDragRafRef.current = requestAnimationFrame(updateWindowPosition);
                                }

                                // Always update lastDragPos to track mouse movement
                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                            } else if (dragWallRef.current) {
                                // Check if this is a door - doors should move along walls like windows
                                const { x1, y1, x2, y2, key: oldWallKey } = dragWallRef.current;
                                // Fresh store read - the render-closure wallData can be one move behind
                                const currentWall = useLevelEditorStore.getState().wallData[oldWallKey];
                                const wallType = typeof currentWall === 'string' ? currentWall : currentWall?.type;
                                const isDoor = wallType && wallType.includes('door');

                                // Endpoint handle drag - reshape the wall by moving the grabbed
                                // endpoint (snapped to the grid), keeping the anchor endpoint fixed
                                if (dragEndpointRef.current && !isDoor) {
                                    const { anchorX, anchorY } = dragEndpointRef.current;
                                    const epClickX = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                        ? (moveCoords.worldX - gridOffsetX) / gridSize
                                        : moveCoords.gridX + 0.5;
                                    const epClickY = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                        ? (moveCoords.worldY - gridOffsetY) / gridSize
                                        : moveCoords.gridY + 0.5;

                                    // Snap the grabbed endpoint to the nearest grid node
                                    const nx = Math.round(epClickX);
                                    const ny = Math.round(epClickY);

                                    // Guard: never collapse the wall to zero length
                                    if (nx === anchorX && ny === anchorY) {
                                        lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                        break;
                                    }

                                    const epNewKey = nx < anchorX || (nx === anchorX && ny < anchorY)
                                        ? `${nx},${ny},${anchorX},${anchorY}`
                                        : `${anchorX},${anchorY},${nx},${ny}`;

                                    if (epNewKey !== oldWallKey) {
                                        // Fresh occupancy check against the live store
                                        const existingWall = useLevelEditorStore.getState().wallData[epNewKey];
                                        if (!existingWall) {
                                            moveWall(x1, y1, x2, y2, nx, ny, anchorX, anchorY, activeMapIdRef.current);
                                            dragWallRef.current = { x1: nx, y1: ny, x2: anchorX, y2: anchorY, key: epNewKey };
                                        }
                                    }

                                    lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                } else if (isDoor) {
                                    // Store pending door update for RAF throttling (similar to windows)
                                    pendingDoorUpdateRef.current = {
                                        moveCoords,
                                        gridOffsetX,
                                        gridOffsetY,
                                        gridSize,
                                        findWallsNearPosition,
                                        moveWall,
                                        x1, y1, x2, y2, oldWallKey
                                    };

                                    // Chain RAF updates for smooth door dragging
                                    if (doorDragRafRef.current === null) {
                                        const updateDoorPosition = () => {
                                            const update = pendingDoorUpdateRef.current;
                                            if (!update || !dragWallRef.current) {
                                                doorDragRafRef.current = null;
                                                return;
                                            }

                                            const { moveCoords, gridOffsetX, gridOffsetY, gridSize, findWallsNearPosition, moveWall, x1, y1, x2, y2, oldWallKey } = update;

                                            // Door dragging - constrain to walls like windows
                                            // Convert mouse position to precise grid coordinates
                                            const clickX = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                                ? (moveCoords.worldX - gridOffsetX) / gridSize
                                                : moveCoords.gridX + 0.5;
                                            const clickY = moveCoords.worldX !== undefined && moveCoords.worldY !== undefined
                                                ? (moveCoords.worldY - gridOffsetY) / gridSize
                                                : moveCoords.gridY + 0.5;

                                            // Find all walls near the mouse position (excluding doors)
                                            const nearbyWalls = findWallsNearPosition(clickX, clickY);
                                            const validWalls = nearbyWalls.filter(wall => {
                                                const wt = typeof wall.data === 'string' ? wall.data : wall.data?.type;
                                                return !(wt && wt.includes('door')); // Exclude other doors
                                            });

                                            if (validWalls.length === 0) {
                                                // No valid walls nearby, keep door on current position
                                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                                doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                                return;
                                            }

                                            // Use the closest wall (can snap to different walls when dragged near them)
                                            const targetWall = validWalls[0];
                                            const [twx1, twy1, twx2, twy2] = targetWall.key.split(',').map(Number);

                                            // Calculate wall direction
                                            const twdx = twx2 - twx1;
                                            const twdy = twy2 - twy1;
                                            const twLength = Math.sqrt(twdx * twdx + twdy * twdy);

                                            if (twLength === 0) {
                                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                                doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                                return;
                                            }

                                            // Project mouse point onto target wall
                                            const t = Math.max(0, Math.min(1,
                                                ((clickX - twx1) * twdx + (clickY - twy1) * twdy) / (twLength * twLength)
                                            ));

                                            // Closest point on wall
                                            const projX = twx1 + t * twdx;
                                            const projY = twy1 + t * twdy;

                                            // Calculate door center and endpoints along the wall
                                            const doorLength = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
                                            const halfLength = doorLength / 2;

                                            // Normalize wall direction
                                            const dirX = twdx / twLength;
                                            const dirY = twdy / twLength;

                                            // Place door along the wall at projected point
                                            // (rounded to 3 decimals to keep wall keys stable)
                                            const newX1 = parseFloat((projX - dirX * halfLength).toFixed(3));
                                            const newY1 = parseFloat((projY - dirY * halfLength).toFixed(3));
                                            const newX2 = parseFloat((projX + dirX * halfLength).toFixed(3));
                                            const newY2 = parseFloat((projY + dirY * halfLength).toFixed(3));

                                            // Calculate new key
                                            const newKey = newX1 < newX2 || (newX1 === newX2 && newY1 < newY2)
                                                ? `${newX1},${newY1},${newX2},${newY2}`
                                                : `${newX2},${newY2},${newX1},${newY1}`;

                                            // Skip if the door hasn't actually moved (prevents per-frame store churn)
                                            if (newKey === oldWallKey) {
                                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                                doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                                return;
                                            }

                                            // Check if there's already a different wall at the target position (fresh state)
                                            const existingWall = useLevelEditorStore.getState().wallData[newKey];
                                            if (existingWall && newKey !== oldWallKey) {
                                                // Don't move - there's already a wall here
                                                lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                                doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                                return;
                                            }

                                            moveWall(x1, y1, x2, y2, newX1, newY1, newX2, newY2, activeMapIdRef.current);

                                            // Update ref for next drag event
                                            dragWallRef.current = { x1: newX1, y1: newY1, x2: newX2, y2: newY2, key: newKey };
                                            lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };

                                            // Continue RAF chain
                                            doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                        };

                                        // Start the RAF chain
                                        doorDragRafRef.current = requestAnimationFrame(updateDoorPosition);
                                    }

                                    // Always update lastDragPos to track mouse movement
                                    lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                } else if (deltaX !== 0 || deltaY !== 0) {
                                    // Regular wall - move freely by whole-tile delta (grid-snapped)
                                    const newX1 = x1 + deltaX;
                                    const newY1 = y1 + deltaY;
                                    const newX2 = x2 + deltaX;
                                    const newY2 = y2 + deltaY;

                                    // Calculate new key
                                    const newKey = newX1 < newX2 || (newX1 === newX2 && newY1 < newY2)
                                        ? `${newX1},${newY1},${newX2},${newY2}`
                                        : `${newX2},${newY2},${newX1},${newY1}`;

                                    // Check if there's already a different wall at the target position (fresh state)
                                    const existingWall = useLevelEditorStore.getState().wallData[newKey];
                                    if (existingWall && newKey !== oldWallKey) {
                                        // Don't move - there's already a wall here
                                        lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                    } else {
                                        moveWall(x1, y1, x2, y2, newX1, newY1, newX2, newY2, activeMapIdRef.current);

                                        // Update ref for next drag event
                                        dragWallRef.current = { x1: newX1, y1: newY1, x2: newX2, y2: newY2, key: newKey };
                                        lastDragPosRef.current = { gridX: moveCoords.gridX, gridY: moveCoords.gridY };
                                    }
                                }
                            }
                        }
                } else if (selectedWallKey) {
                    // Not dragging: show grab cursor when hovering the selected wall's endpoint handles
                    const hoverCoords = screenToGrid(e.clientX, e.clientY);
                    if (hoverCoords && hoverCoords.worldX !== undefined) {
                        const hx = (hoverCoords.worldX - gridOffsetX) / gridSize;
                        const hy = (hoverCoords.worldY - gridOffsetY) / gridSize;
                        const [hx1, hy1, hx2, hy2] = selectedWallKey.split(',').map(Number);
                        const hPxPerUnit = (gridSize || 50) * (zoomLevel || 1) * (playerZoom || 1);
                        const hTol = 28 / (hPxPerUnit || 50);
                        const hovering = Math.hypot(hx - hx1, hy - hy1) <= hTol || Math.hypot(hx - hx2, hy - hy2) <= hTol;
                        setHandleHover(prev => (prev === hovering ? prev : hovering));
                    } else if (handleHover) {
                        setHandleHover(false);
                    }
                } else if (handleHover) {
                    setHandleHover(false);
                }
                break;
            case 'line':
            case 'rectangle':
            case 'circle':
                // For shape tools, update the end point for real-time preview
                const shapeCoords = screenToGrid(e.clientX, e.clientY);
                if (shapeCoords && currentPath.length > 0) {
                    const newPath = [currentPath[0], shapeCoords];
                    setCurrentPath(newPath);
                    setCurrentDrawingPath(newPath);
                }
                break;
            case 'polygon':
                // For polygon, create a triangle from start and end points
                const polyCoords = screenToGrid(e.clientX, e.clientY);
                if (polyCoords && currentPath.length > 0) {
                    const startPoint = currentPath[0];
                    // Calculate third point to form a triangle
                    const dx = polyCoords.gridX - startPoint.gridX;
                    const dy = polyCoords.gridY - startPoint.gridY;
                    const thirdPoint = {
                        gridX: startPoint.gridX + dx * 0.5 - dy * 0.3,
                        gridY: startPoint.gridY + dy * 0.5 + dx * 0.3
                    };
                    const newPath = [startPoint, polyCoords, thirdPoint];
                    setCurrentPath(newPath);
                    setCurrentDrawingPath(newPath);
                }
                break;
            default:
                const defaultCoords = screenToGrid(e.clientX, e.clientY);
                if (defaultCoords) {
                    const newPath = [...currentPath, defaultCoords];
                    setCurrentPath(newPath);
                    setCurrentDrawingPath(newPath);
                }
                break;
        }
    }, [isDrawing, isEditorMode, screenToGrid, selectedTool, toolSettings, paintTerrainBrush, removeTerrainAtPosition, currentPath, setCurrentPath, setCurrentDrawingPath, handleDrawingErase, removeFogAtPosition, gridSize, windowOverlays, wallData]);

    const handleMouseUp = useCallback((e) => {
        // Only the left button finishes a drawing interaction; middle/right
        // button releases must not commit or clear anything.
        if (e && typeof e.button === 'number' && e.button !== 0) {
            return;
        }

        // For select tools, let ObjectSystem handle the events
        if (selectedTool === 'select') {
            return;
        }

        // Handle area selection completion
        if (selectedTool === 'area_remove' && selectionRect && isDrawing) {
            const rect = overlayRef.current?.getBoundingClientRect();
            if (rect) {
                const minX = Math.min(selectionRect.startX, selectionRect.endX);
                const maxX = Math.max(selectionRect.startX, selectionRect.endX);
                const minY = Math.min(selectionRect.startY, selectionRect.endY);
                const maxY = Math.max(selectionRect.startY, selectionRect.endY);

                // Only show modal if selection has meaningful size
                if (Math.abs(maxX - minX) > 10 && Math.abs(maxY - minY) > 10) {
                    const foundObjects = findObjectsInArea(minX, minY, maxX, maxY);
                    setSelectedAreaObjects(foundObjects);
                    setShowRemoveModal(true);
                }
            }
            setIsDrawing(false);
            setSelectionRect(null);
            return;
        }

        if (!isDrawing) return;

        // Handle wall select drag end
        if (selectedTool === 'wall_select') {
            // Cancel any pending window/door drag RAF updates
            if (windowDragRafRef.current !== null) {
                cancelAnimationFrame(windowDragRafRef.current);
                windowDragRafRef.current = null;
            }
            if (doorDragRafRef.current !== null) {
                cancelAnimationFrame(doorDragRafRef.current);
                doorDragRafRef.current = null;
            }
            pendingWindowUpdateRef.current = null;
            pendingDoorUpdateRef.current = null;
            dragEndpointRef.current = null;

            setIsDrawing(false);
            setWallDragStart(null);
            setIsDraggingWall(false);
            // Keep selection active after drag
            return;
        }

        // Finish fog paths if we were drawing fog
        if (selectedTool === 'fog_erase') {
            finishFogErasePath(activeMapIdRef.current);
        } else if (selectedTool === 'fog_draw') {
            finishFogDrawPath(activeMapIdRef.current);
        }

        if (typeof window !== 'undefined') {
            window._isDrawingFog = false;
        }

        // Handle wall placement separately from drawing paths
        if (selectedTool === 'wall_draw') {
            let wallType = toolSettings.selectedWallType || 'stone_wall';
            const wallTypeData = WALL_TYPES[wallType];
            // Ensure wall drawing never creates door/window objects
            if (!wallTypeData || wallTypeData.interactive || wallTypeData.category === 'window') {
                wallType = 'stone_wall';
            }
            const wallMode = toolSettings.wallMode || 'continuous';
            // Curved corners are a build style recorded on the wall itself so a
            // saved map keeps rendering the corner pieces it was drawn with.
            const cornerStylePref = (useLevelEditorStore.getState().wallCornerStyles || {})[wallType];
            const wallExtraFields = cornerStylePref === 'curved' ? { cornerStyle: 'curved' } : null;

            if (wallMode === 'continuous') {
                // Direct-line mode: commit the wall from start to end point.
                // Supports horizontal, vertical, and diagonal walls.
                const chain = wallChainRef.current;
                const commitGridSystem = getGridSystem();
                const { gridType: commitGridType } = commitGridSystem.getGridState();
                if (commitGridType === 'hex') {
                    // Hex: commit one straight corner-to-corner wall carrying its
                    // world-space endpoints (chords are not cell pairs).
                    if (chain && chain.moved && chain.startVertex && chain.endVertex) {
                        const startParts = commitGridSystem.hexVertexKeyParts(chain.startVertex);
                        const endParts = commitGridSystem.hexVertexKeyParts(chain.endVertex);
                        setWall(
                            startParts.x,
                            startParts.y,
                            endParts.x,
                            endParts.y,
                            wallType,
                            activeMapIdRef.current,
                            {
                                hexEndpoints: [
                                    { x: chain.startVertex.x, y: chain.startVertex.y },
                                    { x: chain.endVertex.x, y: chain.endVertex.y }
                                ],
                                ...(wallExtraFields || {})
                            }
                        );
                    }
                } else if (chain && (chain.segStartX !== chain.lastX || chain.segStartY !== chain.lastY)) {
                    setWall(
                        chain.segStartX,
                        chain.segStartY,
                        chain.lastX,
                        chain.lastY,
                        wallType,
                        activeMapIdRef.current,
                        wallExtraFields
                    );
                }
            } else if (wallMode === 'rectangle' && currentPath.length === 2) {
                // Rectangle mode: place four walls
                const startPoint = currentPath[0];
                const endPoint = currentPath[1];
                const gridSystem = getGridSystem();
                const { gridType } = gridSystem.getGridState();

                const minX = Math.min(startPoint.gridX, endPoint.gridX);
                const maxX = Math.max(startPoint.gridX, endPoint.gridX);
                const minY = Math.min(startPoint.gridY, endPoint.gridY);
                const maxY = Math.max(startPoint.gridY, endPoint.gridY);

                if (gridType === 'hex') {
                    // For hex grids, create walls along the hex boundary
                    // Get all hexes in the rectangle
                    const hexes = [];
                    for (let q = minX; q <= maxX; q++) {
                        for (let r = minY; r <= maxY; r++) {
                            hexes.push({ q, r });
                        }
                    }

                    // Find boundary hexes and create walls along their edges
                    hexes.forEach(hex => {
                        const neighbors = gridSystem.getHexNeighbors(hex.q, hex.r);
                        neighbors.forEach(neighbor => {
                            // If neighbor is outside the rectangle, create a wall
                            if (neighbor.q < minX || neighbor.q > maxX || neighbor.r < minY || neighbor.r > maxY) {
                                // Create wall between this hex and its neighbor
                                setWall(hex.q, hex.r, neighbor.q, neighbor.r, wallType, activeMapIdRef.current, wallExtraFields);
                            }
                        });
                    });
                } else {
                    // Square grid: create 4 walls
                    // Top wall
                    setWall(minX, minY, maxX, minY, wallType, activeMapIdRef.current, wallExtraFields);
                    // Bottom wall
                    setWall(minX, maxY, maxX, maxY, wallType, activeMapIdRef.current, wallExtraFields);
                    // Left wall
                    setWall(minX, minY, minX, maxY, wallType, activeMapIdRef.current, wallExtraFields);
                    // Right wall
                    setWall(maxX, minY, maxX, maxY, wallType, activeMapIdRef.current, wallExtraFields);
                }
            }
        } else if (currentPath.length > 0 &&
            selectedTool !== 'wall_draw' &&
            selectedTool !== 'object_place' &&
            selectedTool !== 'object_select' &&
            selectedTool !== 'object_delete' &&
            selectedTool !== 'door_place' &&
            selectedTool !== 'fog_clear_all') {
            // Finalize the drawing path for drawing tools only
            // Single-point freehand strokes are kept: they render as a dot
            // (renderSmoothStroke has a single-point fallback), so discarding
            // them made clicks vanish the instant the mouse was released.
            const pathData = {
                tool: selectedTool,
                points: currentPath,
                style: {
                    strokeWidth: toolSettings.strokeWidth || 2,
                    strokeColor: toolSettings.strokeColor || '#000000',
                    fillColor: toolSettings.fillColor || 'transparent',
                    opacity: toolSettings.opacity || 1
                },
                layer: selectedTool === 'freehand' || selectedTool === 'line' || selectedTool === 'rectangle' || selectedTool === 'circle' || selectedTool === 'polygon' || selectedTool === 'text' ? 'drawings' : activeLayer,
                timestamp: Date.now()
            };

            addDrawingPath(pathData, activeMapIdRef.current);
        }

        // Reset drawing state
        setIsDrawing(false);
        setCurrentPath([]);
        clearCurrentDrawing();
        wallChainRef.current = null;

        // Ensure drawing state is fully reset
        setIsCurrentlyDrawing(false);
        setCurrentDrawingTool('');
        lastTerrainBrushPosRef.current = null;
        elevationStrokePaintedRef.current = null;
        activeMapIdRef.current = null; // CRITICAL: Clear mapId on pointer up
    }, [isDrawing, currentPath, selectedTool, toolSettings, activeLayer, addDrawingPath, setWall, clearCurrentDrawing, selectionRect, findObjectsInArea, finishFogErasePath, setIsCurrentlyDrawing, setCurrentDrawingTool]);

    // Handle right-click context menu (used for completing polygons)
    const handleContextMenu = useCallback((e) => {
        e.preventDefault(); // Prevent default context menu

        // Complete polygon on right-click if currently drawing a polygon
        if (selectedTool === 'polygon' && isDrawing && currentPath.length >= 3) {
            const pathData = {
                tool: 'polygon',
                points: currentPath,
                style: {
                    strokeWidth: toolSettings.strokeWidth || 2,
                    strokeColor: toolSettings.strokeColor || '#000000',
                    fillColor: toolSettings.fillColor || 'transparent',
                    opacity: toolSettings.opacity || 1
                },
                layer: 'drawings',
                timestamp: Date.now()
            };

            addDrawingPath(pathData, activeMapIdRef.current);

            // Reset drawing state
            setIsDrawing(false);
            setCurrentPath([]);
            clearCurrentDrawing();
            setIsCurrentlyDrawing(false);
            setCurrentDrawingTool('');
            activeMapIdRef.current = null;
        }
    }, [selectedTool, isDrawing, currentPath, toolSettings, addDrawingPath, clearCurrentDrawing, setIsCurrentlyDrawing, setCurrentDrawingTool]);

    // Keyboard shortcuts (extracted to useEditorKeyboard hook)
    useEditorKeyboard({
        isOpen,
        handleTabChange,
        handleToolSelect,
        selectedDrawings,
        clearDrawingSelection,
        isObjectLocked,
        selectedWallKey,
        selectedWindow,
        setSelectedWallKey,
        setSelectedWindowKey,
        setSelectedWindow,
        setIsObjectLocked,
        onClearDragRefs: () => {
            dragWindowRef.current = null;
            dragWallRef.current = null;
            lastDragPosRef.current = null;
        },
        selectedTool,
        removeWindowOverlay,
        removeWall,
        removeDrawingPath,
        getExplicitCurrentMapId,
        setIsOpen,
        setEditorMode,
        undo,
        redo
    });

    // Cleanup RAF on unmount or when editor closes
    useEffect(() => {
        return () => {
            if (hoverPreviewRafId.current !== null) {
                cancelAnimationFrame(hoverPreviewRafId.current);
                hoverPreviewRafId.current = null;
            }
        };
    }, []);

    // Auto-open editor when editor mode is enabled
    useEffect(() => {
        if (isGMMode && isEditorMode && !isOpen) {
            setIsOpen(true);
            // Ensure the active tool is set to terrain_brush (matching the default tab)
            setActiveTool('terrain_brush');
        } else if (!isEditorMode && isOpen) {
            setIsOpen(false);
        }
    }, [isGMMode, isEditorMode, isOpen, setActiveTool]);

    // Publish the real window visibility so canvas chrome (object padlock badge
    // and locked-object hit-testing) knows when the editor is actually on
    // screen. Locked objects go click-through and drop their selection while
    // the window is closed.
    useEffect(() => {
        setEditorOpen(isOpen);
        if (!isOpen) {
            useLevelEditorStore.getState().clearObjectSelection();
        }
        return () => setEditorOpen(false);
    }, [isOpen, setEditorOpen]);

    // Load current map state when editor opens (only once, and only if map has data)
    useEffect(() => {
        if (!isEditorMode || !isGMMode) {
            lastLoadedMapIdRef.current = null;
            return;
        }
        const mapId = getCurrentMapId();
        if (mapId && lastLoadedMapIdRef.current !== mapId) {
            lastLoadedMapIdRef.current = mapId;
            const mapState = getMapStateFromStore();
            if (mapState) {
                    // Load terrain and other level editor data from the current map
                    // Only load if the map actually has data (not empty arrays/objects)
                    const levelEditorState = useLevelEditorStore.getState();

                    // Only load terrain if map has terrain data
                    if (mapState.terrainData && Object.keys(mapState.terrainData).length > 0 && levelEditorState.setTerrainData) {
                        levelEditorState.setTerrainData(mapState.terrainData);
                    }
                    // Only load environmental objects if map has objects
                    if (mapState.environmentalObjects && Array.isArray(mapState.environmentalObjects) && mapState.environmentalObjects.length > 0 && levelEditorState.setEnvironmentalObjects) {
                        levelEditorState.setEnvironmentalObjects(mapState.environmentalObjects);
                    }
                    // Only load walls if map has wall data
                    if (mapState.wallData && Object.keys(mapState.wallData).length > 0 && levelEditorState.setWallData) {
                        levelEditorState.setWallData(mapState.wallData);
                    }
                    // Only load dnd elements if map has elements
                    if (mapState.dndElements && Array.isArray(mapState.dndElements) && mapState.dndElements.length > 0 && levelEditorState.setDndElements) {
                        levelEditorState.setDndElements(mapState.dndElements);
                    }
                    // CRITICAL FIX: Only load fog data if map state has it, otherwise preserve current fog
                    // This prevents clearing fog when opening editor on the same map
                    if (mapState.fogOfWarData && Object.keys(mapState.fogOfWarData).length > 0 && levelEditorState.setFogOfWarData) {
                        levelEditorState.setFogOfWarData(mapState.fogOfWarData);
                    }
                    // CRITICAL FIX: Only load fog paths if map state has them, otherwise preserve current fog paths
                    // This prevents clearing "cover entire map" fog when opening editor
                    if (mapState.fogOfWarPaths && Array.isArray(mapState.fogOfWarPaths) && mapState.fogOfWarPaths.length > 0 && levelEditorState.setFogOfWarPaths) {
                        // Only load if map has fog paths - otherwise preserve current fog (like "cover entire map")
                        levelEditorState.setFogOfWarPaths(mapState.fogOfWarPaths);
                    }
                    // CRITICAL FIX: Only load erase paths if map state has them, otherwise preserve current erase paths
                    if (mapState.fogErasePaths && Array.isArray(mapState.fogErasePaths) && mapState.fogErasePaths.length > 0 && levelEditorState.setFogErasePaths) {
                        levelEditorState.setFogErasePaths(mapState.fogErasePaths);
                    }
                    // CRITICAL FIX: Preserve explored areas when editor opens - don't clear player's exploration progress
                    // Only load explored areas from map if they exist, otherwise preserve current state
                    if (mapState.exploredAreas && Object.keys(mapState.exploredAreas).length > 0 && levelEditorState.setExploredAreas) {
                        // Merge with existing explored areas to preserve player progress
                        const currentExplored = levelEditorState.exploredAreas || {};
                        const mergedExplored = { ...currentExplored, ...mapState.exploredAreas };
                        levelEditorState.setExploredAreas(mergedExplored);
                    }
                    // If map has no explored areas, preserve current explored areas (don't clear them)
                    // Always load drawings for the new map (clear if empty)
                    if (levelEditorState.setDrawingPaths) {
                        // Always load drawings - clear existing and load new map's drawings
                        levelEditorState.setDrawingPaths(mapState.drawingPaths || []);
                    }
                    // Always set drawing layers (they should always exist)
                    if (mapState.drawingLayers && levelEditorState.setDrawingLayers) {
                        const defaultLayers = [
                            { id: 'background', name: 'Background', visible: true, locked: false },
                            { id: 'terrain', name: 'Terrain', visible: true, locked: false },
                            { id: 'drawings', name: 'Drawings', visible: true, locked: false },
                            { id: 'walls', name: 'Walls', visible: true, locked: false },
                            { id: 'objects', name: 'Objects', visible: true, locked: false },
                            { id: 'lighting', name: 'Lighting', visible: true, locked: false },
                            { id: 'fog', name: 'Fog of War', visible: true, locked: false },
                            { id: 'grid', name: 'Grid', visible: true, locked: false },
                            { id: 'overlay', name: 'Overlay', visible: true, locked: false }
                        ];
                        levelEditorState.setDrawingLayers(
                            mapState.drawingLayers.length > 0
                                ? mapState.drawingLayers
                                : defaultLayers
                        );
                }
            }
        }
    }, [isEditorMode, isGMMode, currentMapId, getMapStateFromStore, getCurrentMapId]);

    // Auto-focus text input when it appears
    useEffect(() => {
        if (textInput.show && textInputRef.current) {
            // Small delay to ensure the input is rendered
            setTimeout(() => {
                textInputRef.current?.focus();
                textInputRef.current?.select(); // Select any existing text
            }, 50);
        }
    }, [textInput.show]);

    // Force re-render of text input when tool settings change (for live preview)
    useEffect(() => {
        if (textInput.show) {
            // Trigger a re-render by updating the textInput state slightly
            setTextInput(prev => ({ ...prev }));
        }
    }, [toolSettings.fontSize, toolSettings.fontFamily, toolSettings.textColor, toolSettings.backgroundColor, toolSettings.backgroundStyle, toolSettings.bold, toolSettings.italic, toolSettings.underline]);

    // Only render if GM mode is enabled
    if (!isGMMode) {
        return null;
    }

    return (
        <>

            {/* Editor Window */}
            <MythrillWindow
                title="Editor"
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    setEditorMode(false);
                }}
                defaultSize={{ width: 560, height: 780 }}
                defaultPosition={{ x: 50, y: 50 }}
                minConstraints={[400, 480]}
                customHeader={
                    <TabDropdownButton
                        tabs={Object.entries(vttTools).map(([id, category]) => ({
                            id,
                            label: category.name,
                            icon: category.icon
                        }))}
                        activeTab={activeTab}
                        onTabClick={handleTabChange}
                    />
                }
                className="professional-vtt-editor"
            >
                <div className="vtt-editor-content">
                    <div className="vtt-editor-main">
                        {/* Panel bar: identifies the active tab/tool and hosts the layers toggle */}
                        <div className="vtt-panel-bar">
                            <div className="vtt-panel-bar-title">
                                <i className={`${vttTools[activeTab]?.icon || 'fas fa-sliders-h'} vtt-panel-bar-icon`}></i>
                                <span className="vtt-panel-bar-name">{vttTools[activeTab]?.name || 'Tools'}</span>
                                <span className="vtt-panel-bar-sep" aria-hidden="true"></span>
                                <span className="vtt-panel-bar-tool">
                                    {vttTools[activeTab]?.tools.find(t => t.id === selectedTool)?.name
                                        || String(selectedTool || '').replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="vtt-panel-bar-actions">
                                <button
                                    type="button"
                                    className={`vtt-lock-all-toggle${allObjectsLocked ? ' active' : ''}${someObjectsLocked ? ' partial' : ''}`}
                                    onClick={() => setAllEnvironmentalObjectsLocked(!allObjectsLocked, getExplicitCurrentMapId())}
                                    disabled={objectsTotalCount === 0}
                                    title={objectsTotalCount === 0
                                        ? 'No objects placed yet'
                                        : allObjectsLocked
                                            ? `Unlock all ${objectsTotalCount} objects`
                                            : someObjectsLocked
                                                ? `${lockedObjectsCount} of ${objectsTotalCount} objects locked - lock the rest`
                                                : `Lock all ${objectsTotalCount} placed objects (L / Shift+L)`}
                                    aria-pressed={allObjectsLocked}
                                >
                                    <i className={`fas ${allObjectsLocked ? 'fa-lock-open' : 'fa-lock'}`}></i>
                                    <span>{allObjectsLocked ? 'Unlock All' : 'Lock All'}</span>
                                    {objectsTotalCount > 0 && (
                                        <span className="vtt-lock-all-toggle-count">{lockedObjectsCount}/{objectsTotalCount}</span>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className={`vtt-layers-toggle${isLayersPanelCollapsed ? '' : ' active'}`}
                                    onClick={() => setIsLayersPanelCollapsed(!isLayersPanelCollapsed)}
                                    title={isLayersPanelCollapsed ? 'Show Layers Panel' : 'Hide Layers Panel'}
                                    aria-pressed={!isLayersPanelCollapsed}
                                >
                                    <i className="fas fa-layer-group"></i>
                                    <span>Layers</span>
                                    {drawingLayers?.length > 0 && (
                                        <span className="vtt-layers-toggle-count">{drawingLayers.length}</span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Tool Settings - Full Width */}
                        <div className="vtt-tool-settings">
                        {/* Render tool-specific components */}
                        {activeTab === 'drawing' && (
                            <DrawingTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'terrain' && !String(selectedTool).startsWith('elevation') && (
                            <TerrainTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'terrain' && String(selectedTool).startsWith('elevation') && (
                            <ElevationTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'walls' && (
                            <WallTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'fog' && (
                            <FogTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'objects' && (
                            <ObjectTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'grid' && (
                            <GridTools
                                selectedTool={selectedTool}
                                onToolSelect={handleToolSelect}
                                settings={toolSettings}
                                onSettingsChange={handleToolSettingsChange}
                            />
                        )}
                        {activeTab === 'lighting' && (
                            <AdvancedLightingPanel />
                        )}
                        </div>
                    </div>

                    {/* Layer Management drawer (overlays the tool panel so narrow windows stay usable) */}
                    {!isLayersPanelCollapsed && (
                        <>
                            <div
                                className="vtt-layers-scrim"
                                onClick={() => setIsLayersPanelCollapsed(true)}
                                aria-hidden="true"
                            />
                            <LayersPanel
                                isCollapsed={isLayersPanelCollapsed}
                                onToggleCollapse={() => setIsLayersPanelCollapsed(true)}
                                drawingLayers={drawingLayers}
                                activeLayer={activeLayer}
                                onSetActiveLayer={setActiveLayer}
                                showGrid={showGrid}
                                onToggleLayerVisibility={toggleLayerVisibility}
                                onToggleLayerLock={toggleLayerLock}
                                onLegacyToggleLayer={toggleLayer}
                                onToggleGrid={() => {
                                    const { setShowGrid, showGrid } = useGameStore.getState();
                                    setShowGrid(!showGrid);
                                }}
                                onClearAll={clearAllProfessionalData}
                            />
                        </>
                    )}
                </div>

            </MythrillWindow>

            {/* Grid Overlay for Drawing */}
            {isEditorMode && (
                <div
                    ref={overlayRef}
                    className="vtt-drawing-overlay"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={() => {
                        if (isDrawing) handleMouseUp();
                        setHoverPreview({ show: false, gridX: 0, gridY: 0, brushSize: 1 });
                    }}
                    onContextMenu={handleContextMenu}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 100,
                        cursor: (selectedTool === 'wall_select' && isDraggingWall && dragEndpointRef.current)
                            ? 'grabbing'
                            : (selectedTool === 'wall_select' && handleHover)
                                ? 'grab'
                                : getToolCursor(activeTab, selectedTool),
                        pointerEvents: (selectedTool === 'select') ? 'none' : 'auto'
                    }}
                />
            )}

            {/* Hover Preview for Brush Tools */}
            {isEditorMode && hoverPreview.show && (selectedTool === 'terrain_brush' || selectedTool === 'terrain_erase' || selectedTool === 'fog_erase' || selectedTool === 'fog_draw' || String(selectedTool).startsWith('elevation')) && (
                <TerrainHoverPreview
                    gridX={hoverPreview.gridX}
                    gridY={hoverPreview.gridY}
                    brushSize={hoverPreview.brushSize}
                    isEraser={selectedTool === 'terrain_erase' || selectedTool === 'fog_erase'}
                    isFog={selectedTool === 'fog_erase' || selectedTool === 'fog_draw'}
                    elevationMode={String(selectedTool).startsWith('elevation')
                        ? (selectedTool === 'elevation' ? 'raise' : selectedTool.replace('elevation_', ''))
                        : undefined}
                    screenX={hoverPreview.screenX}
                    screenY={hoverPreview.screenY}
                />
            )}

            {/* Placement Ghost Preview for GM Notes / Connections */}
            {isEditorMode && hoverPreview.show && hoverPreview.ghost && (
                <PlacementGhostPreview
                    ghost={hoverPreview.ghost}
                    screenX={hoverPreview.screenX}
                    screenY={hoverPreview.screenY}
                    gridX={hoverPreview.gridX}
                    gridY={hoverPreview.gridY}
                    scale={hoverPreview.scale}
                    elevation={hoverPreview.elevation}
                />
            )}

            {/* Eraser Cursor Preview */}
            {isEditorMode && (
                <EraserCursorPreview hoverPreview={hoverPreview} />
            )}



            {/* Text Input Overlay with Live Preview */}
            <TextInputOverlay
                ref={textInputRef}
                textInput={textInput}
                onChangeText={(text) => setTextInput(prev => ({ ...prev, text }))}
                onSubmit={handleTextSubmit}
                onCancel={handleTextCancel}
                getPreviewStyle={getTextPreviewStyle}
            />

            {/* Selection Rectangle for Area Remove Tool */}
            {isEditorMode && selectedTool === 'area_remove' && (
                <AreaRemoveSelection selectionRect={selectionRect} overlayRef={overlayRef} />
            )}

            {/* Area Remove Modal */}
            <AreaRemoveModal
                isOpen={showRemoveModal}
                onClose={() => {
                    setShowRemoveModal(false);
                    setSelectedAreaObjects(null);
                }}
                onRemove={handleAreaRemove}
                selectedObjects={selectedAreaObjects}
            />

            {/* Selection Indicator - shows when an object is selected and locked */}
            {selectedTool === 'wall_select' && isObjectLocked && (
                <WallSelectionIndicator
                    selectedWindow={selectedWindow}
                    selectedWallKey={selectedWallKey}
                    wallData={wallData}
                    onUnlock={() => {
                        setSelectedWallKey(null);
                        setSelectedWindowKey(null);
                        setSelectedWindow(null);
                        setIsObjectLocked(false);
                    }}
                />
            )}

            {/* Contextual Object Shortcut HUD (visible during object placement or when an object is selected) */}
            {(() => {
                const isPlacing = isEditorMode && selectedTool === 'object_place' && !!toolSettings?.selectedObjectType;
                const selectedEnvObj = isEditorMode ? (environmentalObjects || []).find(o => o.selected) : null;
                if (!isPlacing && !selectedEnvObj) return null;

                const objectDef = isPlacing
                    ? PROFESSIONAL_OBJECTS[toolSettings.selectedObjectType]
                    : PROFESSIONAL_OBJECTS[selectedEnvObj.type];
                const objectName = objectDef?.name || (isPlacing ? toolSettings.selectedObjectType : selectedEnvObj.type) || 'Object';
                const scale = isPlacing ? (toolSettings.objectScale || 1) : (selectedEnvObj.scale || 1);
                const rotation = isPlacing ? (toolSettings.objectRotation || 0) : (selectedEnvObj.rotation || 0);
                const rotationX = isPlacing ? (toolSettings.objectRotationX || 0) : (selectedEnvObj.rotationX || 0);
                const rotationY = isPlacing ? (toolSettings.objectRotationY || 0) : (selectedEnvObj.rotationY || 0);
                const elevation = isPlacing ? (toolSettings.objectElevation || 0) : (selectedEnvObj.elevation || 0);

                return (
                    <ObjectShortcutHUD
                        mode={isPlacing ? 'place' : 'selected'}
                        objectName={objectName}
                        scale={scale}
                        rotation={rotation}
                        rotationX={rotationX}
                        rotationY={rotationY}
                        elevation={elevation}
                        isEHeld={heldModifiers.e}
                        isAltHeld={heldModifiers.alt}
                        isShiftHeld={heldModifiers.shift}
                    />
                );
            })()}

        </>
    );
};

export default ProfessionalVTTEditor;
