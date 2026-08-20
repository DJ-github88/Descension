import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import useAuthStore from '../../store/authStore';
import RichLoreText from '../common/RichLoreText';
import './InteractiveMapStudio.css';

const PIN_ICONS = [
  { id: 'fa-location-dot', label: 'Landmark', icon: 'fa-location-dot' },
  { id: 'fa-city', label: 'Capital / City', icon: 'fa-city' },
  { id: 'fa-mountain-sun', label: 'Mountain / Realm', icon: 'fa-mountain-sun' },
  { id: 'fa-dungeon', label: 'Dungeon / Crypt', icon: 'fa-dungeon' },
  { id: 'fa-beer-mug-empty', label: 'Tavern / Inn', icon: 'fa-beer-mug-empty' },
  { id: 'fa-skull-crossbones', label: 'Boss / Hazard', icon: 'fa-skull-crossbones' },
  { id: 'fa-dragon', label: 'Monster Lair', icon: 'fa-dragon' },
  { id: 'fa-landmark', label: 'Ruins / Relic', icon: 'fa-landmark' },
  { id: 'fa-tree', label: 'Forest / Grove', icon: 'fa-tree' },
  { id: 'fa-water', label: 'Port / Water', icon: 'fa-water' },
  { id: 'fa-gem', label: 'Treasure / Vault', icon: 'fa-gem' },
  { id: 'fa-eye-slash', label: 'Secret Trap', icon: 'fa-eye-slash' }
];

const PIN_COLORS = [
  '#d4af37', // Gold
  '#e74c3c', // Crimson
  '#3498db', // Royal Blue
  '#2ecc71', // Emerald
  '#9b59b6', // Amethyst
  '#e67e22', // Bronze Orange
  '#1abc9c', // Teal
  '#34495e'  // Obsidian Slate
];

const BRUSH_SIZES = [
  { id: 50, label: 'Fine (50px)' },
  { id: 120, label: 'Medium (120px)' },
  { id: 250, label: 'Broad (250px)' },
  { id: 450, label: 'Massive (450px)' }
];

const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1600;

// Waypoint display helpers for stays, day ranges, stops, and custom labels
const getWaypointBadgeText = (w, idx) => {
  if (w.customLabel) return w.customLabel;
  if (w.dayType === 'stop' || (w.stopNumber && !w.day)) {
    return `S${w.stopNumber || idx + 1}`;
  }
  if (w.endDay && Number(w.endDay) > Number(w.day)) {
    return `${w.day}–${w.endDay}`;
  }
  return `${w.day || idx + 1}`;
};

const getWaypointPillText = (w, idx) => {
  if (w.customLabel) return w.customLabel;
  if (w.dayType === 'stop' || (w.stopNumber && !w.day)) {
    return `Stop ${w.stopNumber || idx + 1}`;
  }
  if (w.endDay && Number(w.endDay) > Number(w.day)) {
    return `Days ${w.day}–${w.endDay}`;
  }
  return `Day ${w.day || idx + 1}`;
};

const getWaypointPopupTag = (w, idx) => {
  if (w.customLabel) return w.customLabel;
  if (w.dayType === 'stop' || (w.stopNumber && !w.day)) {
    return `Stop ${w.stopNumber || idx + 1}`;
  }
  if (w.endDay && Number(w.endDay) > Number(w.day)) {
    const stayDays = Number(w.endDay) - Number(w.day) + 1;
    return `Days ${w.day}–${w.endDay} (${stayDays}-Day Stay)`;
  }
  return `Day ${w.day || idx + 1}`;
};

const InteractiveMapStudio = () => {
  const { user } = useAuthStore();
  const {
    maps,
    pins,
    layers,
    activeMapId,
    selectedPinId,
    selectedWaypointId,
    isStudioOpen,
    isGMMode,
    zoomLevel,
    panOffset,
    isDrawingRoute,
    routeMode,
    setRouteMode,
    isFogToolActive,
    fogBrushMode,
    fogBrushSize,
    mapFogData,
    journeyWaypoints,
    partyMarker,
    isMapLocked,
    toggleMapLock,
    closeStudio,
    setActiveMap,
    setSelectedPin,
    setSelectedWaypoint,
    setZoomLevel,
    setPanOffset,
    resetView,
    toggleGMMode,
    setIsDrawingRoute,
    setIsFogToolActive,
    setFogBrushMode,
    setFogBrushSize,
    addFogStroke,
    setMapFogData,
    clearMapFog,
    shroudAllMap,
    createMap,
    updateMap,
    deleteMap,
    addPin,
    updatePin,
    updatePinPosition,
    removePin,
    togglePinPlayerVisibility,
    toggleLayerVisibility,
    addJourneyWaypoint,
    updateJourneyWaypoint,
    updateWaypointPosition,
    removeJourneyWaypoint,
    clearJourneyTrail,
    setPartyMarkerPosition,
    updatePartyMarker,
    getMapBreadcrumbs,
    syncToCloud,
    hydrateFromCloud
  } = useInteractiveMapStore();

  const canvasRef = useRef(null);
  const fogCanvasRef = useRef(null);
  const fogBufferRef = useRef(null);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedPinId, setDraggedPinId] = useState(null);
  const [draggedWaypointId, setDraggedWaypointId] = useState(null);
  const [isDraggingParty, setIsDraggingParty] = useState(false);
  const [isPlacingPin, setIsPlacingPin] = useState(false);

  // Real-time Fog Painting state
  const [isPaintingFog, setIsPaintingFog] = useState(false);
  const [mouseCanvasPos, setMouseCanvasPos] = useState({ x: 0, y: 0, rawX: 0, rawY: 0, inside: false });
  const activeStrokePointsRef = useRef([]);

  // Drawers & Modals
  const [showPinDrawer, setShowPinDrawer] = useState(false);
  const [editingPin, setEditingPin] = useState(null);
  const [editingWaypoint, setEditingWaypoint] = useState(null);
  const [showNewMapModal, setShowNewMapModal] = useState(false);
  const [newMapName, setNewMapName] = useState('');
  const [newMapType, setNewMapType] = useState('region');
  const [newMapImage, setNewMapImage] = useState('');
  const [newMapParentId, setNewMapParentId] = useState('');
  const [newMapDesc, setNewMapDesc] = useState('');
  const [previewPlayerFog, setPreviewPlayerFog] = useState(false);

  // Party Notes & Reminders State
  const [showPartyNotes, setShowPartyNotes] = useState(false);
  const [newReminderText, setNewReminderText] = useState('');

  // In-App Custom Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState(null);

  // Attach Sub-Map Modal
  const [attachingSubMapPin, setAttachingSubMapPin] = useState(null);
  const [attachTab, setAttachTab] = useState('existing'); // 'existing' | 'new'
  const [selectedExistingMapId, setSelectedExistingMapId] = useState('');
  const [subMapName, setSubMapName] = useState('');
  const [subMapType, setSubMapType] = useState('region');
  const [subMapImage, setSubMapImage] = useState('');
  const [subMapDesc, setSubMapDesc] = useState('');

  // Active Map
  const activeMap = useMemo(() => {
    return maps.find(m => m.id === activeMapId) || maps[0] || null;
  }, [maps, activeMapId]);

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    return getMapBreadcrumbs(activeMap?.id);
  }, [activeMap, getMapBreadcrumbs]);

  // Check if a percentage coordinate is shrouded by Fog of War
  const isPointCoveredByFog = useCallback((pctX, pctY) => {
    if (!activeMap) return false;
    const strokes = mapFogData[activeMap.id] || [];
    if (strokes.length === 0) return false;
    const isFogLayerVisible = layers.find(l => l.id === 'fog')?.isVisible !== false;
    if (!isFogLayerVisible) return false;

    const buffer = fogBufferRef.current;
    if (!buffer) return false;
    const bCtx = buffer.getContext('2d', { willReadFrequently: true });
    if (!bCtx) return false;

    const px = Math.min(MAP_WIDTH - 1, Math.max(0, Math.floor((pctX / 100) * MAP_WIDTH)));
    const py = Math.min(MAP_HEIGHT - 1, Math.max(0, Math.floor((pctY / 100) * MAP_HEIGHT)));

    try {
      const pixel = bCtx.getImageData(px, py, 1, 1).data;
      // pixel[3] is alpha channel (0 = fully revealed, > 40 = shrouded by fog)
      return pixel[3] > 40;
    } catch {
      return false;
    }
  }, [activeMap, layers, mapFogData]);

  // Visible Pins for Active Map & Active Layers (Culled in Fog for Player View)
  const visiblePins = useMemo(() => {
    if (!activeMap) return [];
    const activeLayerIds = new Set(layers.filter(l => l.isVisible).map(l => l.id));
    const isPlayerView = !isGMMode || previewPlayerFog;
    const isFogActive = layers.find(l => l.id === 'fog')?.isVisible !== false && (mapFogData[activeMap.id]?.length > 0);

    return pins.filter(p => {
      if ((p.mapId || 'map-mythril-world') !== activeMap.id) return false;
      if (p.layerId && !activeLayerIds.has(p.layerId)) return false;
      if (isPlayerView && p.isSecretGM) return false;
      if (isPlayerView && isFogActive && isPointCoveredByFog(p.x, p.y)) {
        return false;
      }
      return true;
    });
  }, [pins, activeMap, layers, isGMMode, previewPlayerFog, mapFogData, isPointCoveredByFog]);

  // Visible Waypoints for Active Map (Culled in Fog for Player View)
  const currentMapWaypoints = useMemo(() => {
    if (!activeMap) return [];
    const isPlayerView = !isGMMode || previewPlayerFog;
    const isFogActive = layers.find(l => l.id === 'fog')?.isVisible !== false && (mapFogData[activeMap.id]?.length > 0);

    return journeyWaypoints.filter(w => {
      if ((w.mapId || 'map-mythril-world') !== activeMap.id) return false;
      if (isPlayerView && w.isSecretGM) return false;
      if (isPlayerView && isFogActive && isPointCoveredByFog(w.x, w.y)) {
        return false;
      }
      return true;
    });
  }, [journeyWaypoints, activeMap, isGMMode, previewPlayerFog, layers, mapFogData, isPointCoveredByFog]);

  // Selected Pin Object
  const selectedPin = useMemo(() => {
    if (!selectedPinId) return null;
    return pins.find(p => p.id === selectedPinId) || null;
  }, [pins, selectedPinId]);

  // Selected Waypoint Object
  const selectedWaypoint = useMemo(() => {
    if (!selectedWaypointId) return null;
    return journeyWaypoints.find(w => w.id === selectedWaypointId) || null;
  }, [journeyWaypoints, selectedWaypointId]);

  // Hydrate on mount
  useEffect(() => {
    if (user?.uid) {
      hydrateFromCloud(user.uid);
    }
  }, [user?.uid, hydrateFromCloud]);

  // Redraw Complete Fog of War Canvas from strokes
  const renderFogCanvas = useCallback(() => {
    const canvas = fogCanvasRef.current;
    if (!canvas || !activeMap) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    const isFogLayerVisible = layers.find(l => l.id === 'fog')?.isVisible !== false;
    if (!isFogLayerVisible) return;

    const strokes = mapFogData[activeMap.id] || [];
    if (strokes.length === 0) return;

    // Initialize or reuse offscreen buffer
    if (!fogBufferRef.current) {
      fogBufferRef.current = document.createElement('canvas');
      fogBufferRef.current.width = MAP_WIDTH;
      fogBufferRef.current.height = MAP_HEIGHT;
    }
    const buffer = fogBufferRef.current;
    const bCtx = buffer.getContext('2d');
    if (!bCtx) return;

    bCtx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);

    strokes.forEach(stroke => {
      const isReveal = stroke.isReveal;
      bCtx.globalCompositeOperation = isReveal ? 'destination-out' : 'source-over';
      bCtx.fillStyle = 'rgba(15, 10, 6, 0.98)';
      bCtx.strokeStyle = 'rgba(15, 10, 6, 0.98)';

      if (stroke.isFullCover) {
        bCtx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
      } else if (stroke.points && stroke.points.length > 0) {
        const radius = stroke.radius || 120;
        bCtx.lineWidth = radius * 2;
        bCtx.lineCap = 'round';
        bCtx.lineJoin = 'round';

        // Draw connected polyline
        bCtx.beginPath();
        stroke.points.forEach((pt, idx) => {
          const px = (pt.x / 100) * MAP_WIDTH;
          const py = (pt.y / 100) * MAP_HEIGHT;
          if (idx === 0) bCtx.moveTo(px, py);
          else bCtx.lineTo(px, py);
        });
        bCtx.stroke();

        // Draw circle stamps at points for smooth endings
        stroke.points.forEach(pt => {
          const px = (pt.x / 100) * MAP_WIDTH;
          const py = (pt.y / 100) * MAP_HEIGHT;
          bCtx.beginPath();
          bCtx.arc(px, py, radius, 0, Math.PI * 2);
          bCtx.fill();
        });
      } else if (stroke.x !== undefined && stroke.y !== undefined) {
        const cx = (stroke.x / 100) * MAP_WIDTH;
        const cy = (stroke.y / 100) * MAP_HEIGHT;
        const radius = stroke.radius || 120;
        bCtx.beginPath();
        bCtx.arc(cx, cy, radius, 0, Math.PI * 2);
        bCtx.fill();
      }
    });

    // Draw buffer to main canvas with opacity based on GM mode vs Player Preview
    ctx.save();
    const effectiveGM = isGMMode && !previewPlayerFog;
    ctx.globalAlpha = effectiveGM ? 0.48 : 0.98;
    ctx.drawImage(buffer, 0, 0);
    ctx.restore();
  }, [activeMap, layers, mapFogData, isGMMode, previewPlayerFog]);

  useEffect(() => {
    renderFogCanvas();
  }, [renderFogCanvas, mapFogData, activeMap?.id, isGMMode, previewPlayerFog]);

  // Convert client click to Map percentage coordinates & map pixels
  const getMapCoordinates = useCallback((e) => {
    if (!canvasRef.current) return { pctX: 50, pctY: 50, mapX: 1200, mapY: 800 };
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
    const clickY = (e.clientY - rect.top - panOffset.y) / zoomLevel;
    const mapX = Math.max(0, Math.min(MAP_WIDTH, clickX));
    const mapY = Math.max(0, Math.min(MAP_HEIGHT, clickY));
    const pctX = Math.max(0.1, Math.min(99.9, +((mapX / MAP_WIDTH) * 100).toFixed(2)));
    const pctY = Math.max(0.1, Math.min(99.9, +((mapY / MAP_HEIGHT) * 100).toFixed(2)));
    return { pctX, pctY, mapX, mapY };
  }, [panOffset, zoomLevel]);

  // Realtime Live Fog Brush drawing onto buffer and canvas
  const drawLiveFogStroke = useCallback((currPct, prevPct) => {
    if (!fogCanvasRef.current) return;
    if (!fogBufferRef.current) {
      fogBufferRef.current = document.createElement('canvas');
      fogBufferRef.current.width = MAP_WIDTH;
      fogBufferRef.current.height = MAP_HEIGHT;
    }
    const buffer = fogBufferRef.current;
    const bCtx = buffer.getContext('2d');
    const canvas = fogCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!bCtx || !ctx) return;

    const isReveal = fogBrushMode === 'reveal';
    bCtx.save();
    bCtx.globalCompositeOperation = isReveal ? 'destination-out' : 'source-over';
    bCtx.fillStyle = 'rgba(15, 10, 6, 0.98)';
    bCtx.strokeStyle = 'rgba(15, 10, 6, 0.98)';
    bCtx.lineWidth = fogBrushSize * 2;
    bCtx.lineCap = 'round';
    bCtx.lineJoin = 'round';

    const currX = (currPct.x / 100) * MAP_WIDTH;
    const currY = (currPct.y / 100) * MAP_HEIGHT;

    if (prevPct) {
      const prevX = (prevPct.x / 100) * MAP_WIDTH;
      const prevY = (prevPct.y / 100) * MAP_HEIGHT;
      bCtx.beginPath();
      bCtx.moveTo(prevX, prevY);
      bCtx.lineTo(currX, currY);
      bCtx.stroke();
    }

    bCtx.beginPath();
    bCtx.arc(currX, currY, fogBrushSize, 0, Math.PI * 2);
    bCtx.fill();
    bCtx.restore();

    // Re-draw buffer to main canvas with opacity
    ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    ctx.save();
    const effectiveGM = isGMMode && !previewPlayerFog;
    ctx.globalAlpha = effectiveGM ? 0.48 : 0.98;
    ctx.drawImage(buffer, 0, 0);
    ctx.restore();
  }, [fogBrushMode, fogBrushSize, isGMMode, previewPlayerFog]);

  // Tool Toggle Handlers with automatic layer enablement
  const handleToggleDropPin = () => {
    const nextState = !isPlacingPin;
    setIsPlacingPin(nextState);
    if (nextState) {
      setIsDrawingRoute(false);
      setIsFogToolActive(false);
      const poiLayer = layers.find(l => l.id === 'poi');
      if (poiLayer && !poiLayer.isVisible) {
        toggleLayerVisibility('poi');
      }
    }
  };

  const handleToggleRoute = () => {
    const nextState = !isDrawingRoute;
    setIsDrawingRoute(nextState);
    setIsPlacingPin(false);
    if (nextState) {
      const journeyLayer = layers.find(l => l.id === 'journey');
      if (journeyLayer && !journeyLayer.isVisible) {
        toggleLayerVisibility('journey');
      }
    }
  };

  const handleToggleFog = () => {
    const nextState = !isFogToolActive;
    setIsFogToolActive(nextState);
    setIsPlacingPin(false);
    if (nextState) {
      const fogLayer = layers.find(l => l.id === 'fog');
      if (fogLayer && !fogLayer.isVisible) {
        toggleLayerVisibility('fog');
      }
    }
  };

  // Canvas Mouse Down (Panning, Pin Placement, Route Plotting, or Fog Painting)
  const handleCanvasMouseDown = (e) => {
    if (e.button !== 0) return; // Only process main left click

    // If not in fog drawing mode, ignore clicks on interactive overlays
    if (!isFogToolActive && (
      e.target.closest('.map-pin-marker') ||
      e.target.closest('.waypoint-node-interactive') ||
      e.target.closest('.map-studio-hud') ||
      e.target.closest('.studio-drawer') ||
      e.target.closest('.map-floating-tool-hud') ||
      e.target.closest('.map-layers-hud') ||
      e.target.closest('.map-viewport-controls-hud')
    )) {
      return;
    }

    // Ignore clicks on HUDs even in fog mode
    if (e.target.closest('.map-studio-hud') || e.target.closest('.studio-drawer') || e.target.closest('.map-floating-tool-hud') || e.target.closest('.map-layers-hud') || e.target.closest('.map-viewport-controls-hud')) {
      return;
    }

    const { pctX, pctY, mapX, mapY } = getMapCoordinates(e);

    // 1. Fog Brush Painting
    if (isFogToolActive && activeMap) {
      setIsPaintingFog(true);
      activeStrokePointsRef.current = [{ x: pctX, y: pctY }];
      drawLiveFogStroke({ x: pctX, y: pctY }, null);
      return;
    }

    // 2. Journey Route Waypoint Placement
    if (isDrawingRoute && activeMap) {
      addJourneyWaypoint({
        mapId: activeMap.id,
        x: pctX,
        y: pctY,
        selectImmediately: false
      });
      const journeyLayer = layers.find(l => l.id === 'journey');
      if (journeyLayer && !journeyLayer.isVisible) {
        toggleLayerVisibility('journey');
      }
      syncToCloud(user?.uid);
      return;
    }

    // 3. Drop Pin Mode
    if (isPlacingPin && activeMap) {
      openPinEditor(null, pctX, pctY);
      setIsPlacingPin(false);
      return;
    }

    // 4. Default: Pan Canvas
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    setSelectedPin(null);
    setSelectedWaypoint(null);
  };

  // Global Mouse Move
  const handleMouseMove = useCallback((e) => {
    const { pctX, pctY, mapX, mapY } = getMapCoordinates(e);

    // Update live brush cursor
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMouseCanvasPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        rawX: mapX,
        rawY: mapY,
        inside: e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
      });
    }

    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (isPaintingFog && isFogToolActive && activeMap) {
      const points = activeStrokePointsRef.current;
      const lastPt = points[points.length - 1];

      // Only add point if moved at least 0.2%
      if (!lastPt || Math.hypot(pctX - lastPt.x, pctY - lastPt.y) > 0.2) {
        const newPt = { x: pctX, y: pctY };
        points.push(newPt);
        drawLiveFogStroke(newPt, lastPt);
      }
    } else if (isDraggingParty && canvasRef.current && !isMapLocked) {
      setPartyMarkerPosition(pctX, pctY, activeMap?.id);
    } else if (draggedPinId && canvasRef.current && !isMapLocked) {
      updatePinPosition(draggedPinId, pctX, pctY);
    } else if (draggedWaypointId && canvasRef.current && !isMapLocked) {
      updateWaypointPosition(draggedWaypointId, pctX, pctY);
    }
  }, [isPanning, panStart, isPaintingFog, isFogToolActive, activeMap, drawLiveFogStroke, isDraggingParty, draggedPinId, draggedWaypointId, isMapLocked, getMapCoordinates, setPanOffset, setPartyMarkerPosition, updatePinPosition, updateWaypointPosition]);

  // Mouse Up
  const handleMouseUp = useCallback(() => {
    if (isPanning) setIsPanning(false);

    if (isPaintingFog && activeMap) {
      setIsPaintingFog(false);
      const points = activeStrokePointsRef.current;
      if (points.length > 0) {
        addFogStroke(activeMap.id, {
          isReveal: fogBrushMode === 'reveal',
          radius: fogBrushSize,
          points: [...points]
        });
        activeStrokePointsRef.current = [];
        syncToCloud(user?.uid);
      }
    }

    if (isDraggingParty) {
      setIsDraggingParty(false);
      syncToCloud(user?.uid);
    }
    if (draggedPinId) {
      setDraggedPinId(null);
      syncToCloud(user?.uid);
    }
    if (draggedWaypointId) {
      setDraggedWaypointId(null);
      syncToCloud(user?.uid);
    }
  }, [isPanning, isPaintingFog, activeMap, fogBrushMode, fogBrushSize, isDraggingParty, draggedPinId, draggedWaypointId, addFogStroke, syncToCloud, user?.uid]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Zoom towards mouse cursor position
  const handleWheel = (e) => {
    e.preventDefault();
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.893;
    const newZoom = Math.min(3.5, Math.max(0.2, +(zoomLevel * zoomFactor).toFixed(3)));

    if (newZoom === zoomLevel) return;

    // Keep world coordinates directly under cursor stationary during zoom
    const worldX = (mouseX - panOffset.x) / zoomLevel;
    const worldY = (mouseY - panOffset.y) / zoomLevel;

    const newPanX = mouseX - worldX * newZoom;
    const newPanY = mouseY - worldY * newZoom;

    setZoomLevel(newZoom);
    setPanOffset({ x: newPanX, y: newPanY });
  };

  // Zoom in/out via Button Controls
  const handleZoomByButton = (delta) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const zoomFactor = delta > 0 ? 1.22 : 0.82;
    const newZoom = Math.min(3.5, Math.max(0.2, +(zoomLevel * zoomFactor).toFixed(3)));
    if (newZoom === zoomLevel) return;

    const worldX = (centerX - panOffset.x) / zoomLevel;
    const worldY = (centerY - panOffset.y) / zoomLevel;

    const newPanX = centerX - worldX * newZoom;
    const newPanY = centerY - worldY * newZoom;

    setZoomLevel(newZoom);
    setPanOffset({ x: newPanX, y: newPanY });
  };

  // Open Pin Editor Drawer
  const openPinEditor = (pin = null, defaultX = 50, defaultY = 50) => {
    if (pin) {
      setEditingPin({ ...pin, isNew: false });
    } else {
      setEditingPin({
        isNew: true,
        mapId: activeMap?.id || 'map-mythril-world',
        x: defaultX,
        y: defaultY,
        title: '',
        description: '',
        icon: 'fa-location-dot',
        color: '#d4af37',
        type: 'poi',
        layerId: 'poi',
        isSecretGM: false,
        targetMapId: null,
        linkedLoreId: null,
        isDiscovered: true,
        isLocked: false
      });
    }
    setShowPinDrawer(true);
  };

  // Save Pin Changes
  const handleSavePin = (e) => {
    e.preventDefault();
    if (!editingPin) return;

    if (editingPin.isNew) {
      addPin(editingPin);
    } else {
      updatePin(editingPin.id, editingPin);
    }
    setShowPinDrawer(false);
    setEditingPin(null);
    syncToCloud(user?.uid);
  };

  // Delete Pin with Custom Modal
  const handleDeletePin = (pinId) => {
    setConfirmModal({
      title: 'Delete Landmark',
      message: 'Are you sure you wish to delete this landmark pin from the map? This action cannot be undone.',
      icon: 'fa-trash',
      confirmLabel: 'Delete Landmark',
      isDanger: true,
      onConfirm: () => {
        removePin(pinId);
        setShowPinDrawer(false);
        setEditingPin(null);
        syncToCloud(user?.uid);
      }
    });
  };

  // Save Waypoint Changes
  const handleSaveWaypoint = (e) => {
    e.preventDefault();
    if (!editingWaypoint) return;

    let payload = { ...editingWaypoint };
    const dType = payload.dayType || 'day';

    if (dType === 'day') {
      payload.day = Number(payload.day) || 1;
      payload.endDay = null;
      payload.stayDuration = 1;
      payload.stopNumber = null;
    } else if (dType === 'range') {
      payload.day = Number(payload.day) || 1;
      const end = Number(payload.endDay) || (payload.day + 1);
      payload.endDay = end > payload.day ? end : payload.day + 1;
      payload.stayDuration = payload.endDay - payload.day + 1;
      payload.stopNumber = null;
    } else if (dType === 'stop') {
      payload.stopNumber = Number(payload.stopNumber) || 1;
      payload.endDay = null;
      payload.stayDuration = null;
    } else if (dType === 'custom') {
      payload.customLabel = payload.customLabel?.trim() || 'Stop';
    }

    updateJourneyWaypoint(payload.id, payload);
    setEditingWaypoint(null);
    setSelectedWaypoint(null);
    syncToCloud(user?.uid);
  };

  // Delete Waypoint with Custom Modal
  const handleDeleteWaypoint = (waypointId) => {
    setConfirmModal({
      title: 'Remove Waypoint',
      message: 'Remove this expedition waypoint from the trail?',
      icon: 'fa-trash',
      confirmLabel: 'Remove Waypoint',
      isDanger: true,
      onConfirm: () => {
        removeJourneyWaypoint(waypointId);
        setEditingWaypoint(null);
        setSelectedWaypoint(null);
        syncToCloud(user?.uid);
      }
    });
  };

  // Create New Map Modal
  const handleCreateNewMap = (e) => {
    e.preventDefault();
    if (!newMapName.trim() || !newMapImage.trim()) {
      alert('Please provide a map name and a valid image URL.');
      return;
    }

    const created = createMap({
      name: newMapName.trim(),
      type: newMapType,
      imageUrl: newMapImage.trim(),
      parentMapId: newMapParentId || null,
      description: newMapDesc.trim()
    });

    setActiveMap(created.id);
    setShowNewMapModal(false);
    setNewMapName('');
    setNewMapImage('');
    setNewMapDesc('');
    syncToCloud(user?.uid);
  };

  // Handle Attach Sub-Map to Pin
  const handleAttachSubMap = (e) => {
    e.preventDefault();
    if (!attachingSubMapPin) return;

    if (attachTab === 'existing') {
      if (!selectedExistingMapId) {
        alert('Please select an existing map to attach.');
        return;
      }
      updatePin(attachingSubMapPin.id, { targetMapId: selectedExistingMapId });
    } else {
      if (!subMapName.trim() || !subMapImage.trim()) {
        alert('Please enter a sub-map name and image URL.');
        return;
      }
      const newSubMap = createMap({
        name: subMapName.trim(),
        type: subMapType,
        imageUrl: subMapImage.trim(),
        parentMapId: activeMap?.id || null,
        description: subMapDesc.trim()
      });
      updatePin(attachingSubMapPin.id, { targetMapId: newSubMap.id });
    }

    setAttachingSubMapPin(null);
    setSubMapName('');
    setSubMapImage('');
    setSubMapDesc('');
    setSelectedExistingMapId('');
    syncToCloud(user?.uid);
  };

  if (!isStudioOpen) return null;

  return ReactDOM.createPortal(
    <div className="interactive-map-studio-overlay">
      {/* Studio Header Toolbar */}
      <header className="map-studio-header">
        <div className="header-left">
          <div className="map-hierarchy-selector">
            <div className="map-brand-badge" title="Atlas & Map Studio">
              <i className="fas fa-compass"></i>
            </div>
            <div className="map-select-wrapper">
              <select
                value={activeMap?.id || ''}
                onChange={(e) => setActiveMap(e.target.value)}
                className="map-dropdown"
              >
                {maps.map((m, mIdx) => (
                  <option key={m.id || `map-opt-${mIdx}`} value={m.id}>
                    {m.name} [{m.type.toUpperCase()}]
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Breadcrumb drill-down trail */}
          <nav className="map-breadcrumbs">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.id || `crumb-${idx}`} className="crumb-item-wrapper" style={{ display: 'inline-flex', alignItems: 'center' }}>
                {idx > 0 && <span className="crumb-sep">/</span>}
                <button
                  type="button"
                  className={`crumb-btn ${crumb.id === activeMap?.id ? 'active' : ''}`}
                  onClick={() => setActiveMap(crumb.id)}
                >
                  <i
                    className={`fas ${crumb.type === 'world' ? 'fa-globe' : crumb.type === 'continent' ? 'fa-mountain' : 'fa-chess-rook'}`}
                    style={{ marginRight: '6px' }}
                  />
                  {crumb.name}
                </button>
              </span>
            ))}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="header-right">
          {/* Drop Pin Tool */}
          <button
            type="button"
            className={`btn-map-action btn-drop-pin ${isPlacingPin ? 'active' : ''}`}
            onClick={handleToggleDropPin}
            title="Click to drop a landmark pin anywhere on the map"
          >
            <i className="fas fa-location-crosshairs"></i>
            <span>{isPlacingPin ? 'Click Map to Place' : 'Drop Pin'}</span>
          </button>

          {/* Route Planner Tool */}
          <button
            type="button"
            className={`btn-map-action btn-route-tool ${isDrawingRoute ? 'active' : ''}`}
            onClick={handleToggleRoute}
            title="Plan expedition path and waypoints"
          >
            <i className="fas fa-route"></i>
            <span>{isDrawingRoute ? 'Plotting Route (Active)' : 'Plot Route'}</span>
          </button>

          {/* Dynamic Fog of War Tool */}
          <button
            type="button"
            className={`btn-map-action btn-fog-tool ${isFogToolActive ? 'active' : ''}`}
            onClick={handleToggleFog}
            title="Fog of War: Shroud unexplored areas or reveal secrets"
          >
            <i className="fas fa-smog"></i>
            <span>{isFogToolActive ? 'Fog of War (Active)' : 'Fog of War'}</span>
          </button>

          {/* Lock / Unlock Map Markers Toggle */}
          <button
            type="button"
            className={`btn-map-action btn-lock-toggle ${isMapLocked ? 'is-locked' : ''}`}
            onClick={toggleMapLock}
            title={isMapLocked ? 'Map Markers are LOCKED (Drag disabled) - Click to Unlock' : 'Lock Map Markers (Prevent accidental dragging)'}
          >
            <i className={`fas ${isMapLocked ? 'fa-lock' : 'fa-lock-open'}`}></i>
            <span>{isMapLocked ? 'Locked' : 'Unlocked'}</span>
          </button>

          {/* GM vs Player Mode Toggle */}
          <button
            type="button"
            className={`btn-map-action btn-gm-toggle ${isGMMode ? 'active' : ''}`}
            onClick={toggleGMMode}
            title="Toggle GM Secret Layer & Fog Transparency"
          >
            <i className={`fas ${isGMMode ? 'fa-eye' : 'fa-eye-slash'}`}></i>
            <span>{isGMMode ? 'GM Mode (Visible)' : 'Player Mode (Filtered)'}</span>
          </button>

          <button
            type="button"
            className="btn-map-action btn-close-studio"
            onClick={closeStudio}
            title="Close Map Studio"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </header>

      {/* Main Map Canvas Area */}
      <main
        className={`map-studio-canvas ${isPanning ? 'is-panning' : ''} ${isPlacingPin ? 'is-placing' : ''} ${isDrawingRoute ? 'is-routing' : ''} ${isFogToolActive ? 'is-fogging' : ''}`}
        ref={canvasRef}
        onMouseDown={handleCanvasMouseDown}
        onWheel={handleWheel}
      >
        {/* Layer Visibility Floating HUD */}
        <div className="map-layers-hud" onClick={e => e.stopPropagation()}>
          <div className="layers-hud-header">
            <i className="fas fa-layer-group"></i>
            <span>Map Layers</span>
          </div>
          <div className="layers-list">
            {layers.map(layer => {
              if (layer.isGMOnly && !isGMMode) return null;
              return (
                <button
                  key={layer.id}
                  type="button"
                  className={`layer-toggle-btn ${layer.isVisible ? 'is-visible' : 'is-hidden'}`}
                  onClick={() => toggleLayerVisibility(layer.id)}
                  title={`Toggle ${layer.name}`}
                >
                  <i className={`fas ${layer.icon}`}></i>
                  <span>{layer.name}</span>
                  <i className={`fas ${layer.isVisible ? 'fa-check' : 'fa-eye-slash'} check-icon`}></i>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Fog of War Tool HUD */}
        {isFogToolActive && (
          <div className="map-floating-tool-hud fog-tool-hud" onClick={e => e.stopPropagation()}>
            <div className="tool-hud-header">
              <i className="fas fa-smog"></i>
              <span>Fog of War Studio</span>
            </div>

            <div className="tool-hud-row">
              <button
                type="button"
                className={`btn-tool-mode ${fogBrushMode === 'shroud' ? 'active' : ''}`}
                onClick={() => setFogBrushMode('shroud')}
                title="Paint dense dark mist over unexplored areas"
              >
                <i className="fas fa-cloud"></i> Shroud (Hide)
              </button>
              <button
                type="button"
                className={`btn-tool-mode ${fogBrushMode === 'reveal' ? 'active' : ''}`}
                onClick={() => setFogBrushMode('reveal')}
                title="Erase mist and reveal map to players"
              >
                <i className="fas fa-sun"></i> Reveal (Clear)
              </button>
            </div>

            <div className="tool-hud-sizes">
              <span className="size-label">Brush Radius:</span>
              <div className="size-buttons">
                {BRUSH_SIZES.map(size => (
                  <button
                    key={size.id}
                    type="button"
                    className={`btn-brush-size ${fogBrushSize === size.id ? 'active' : ''}`}
                    onClick={() => setFogBrushSize(size.id)}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Map Shroud Presets */}
            <div className="tool-hud-actions">
              <button
                type="button"
                className="btn-tool-act"
                onClick={() => {
                  setConfirmModal({
                    title: 'Shroud All Map',
                    message: 'Shroud the entire map in dense fog of war for players?',
                    icon: 'fa-cloud',
                    confirmLabel: 'Shroud All',
                    isDanger: false,
                    onConfirm: () => {
                      shroudAllMap(activeMap?.id);
                      syncToCloud(user?.uid);
                    }
                  });
                }}
                title="Cover entire map in fog"
              >
                <i className="fas fa-cloud"></i> Shroud All
              </button>
              <button
                type="button"
                className="btn-tool-act clear"
                onClick={() => {
                  setConfirmModal({
                    title: 'Reveal All Fog',
                    message: 'Clear all fog of war and reveal this entire map to players?',
                    icon: 'fa-eraser',
                    confirmLabel: 'Reveal All',
                    isDanger: true,
                    onConfirm: () => {
                      clearMapFog(activeMap?.id);
                      syncToCloud(user?.uid);
                    }
                  });
                }}
                title="Clear all fog from map"
              >
                <i className="fas fa-eraser"></i> Reveal All
              </button>
            </div>

            <div className="tool-hud-footer-row" style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="toggle-gm-preview" style={{ fontSize: '11px', color: '#5a2e12', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={previewPlayerFog}
                  onChange={(e) => setPreviewPlayerFog(e.target.checked)}
                />
                Preview 100% Opaque Player Fog
              </label>
              <button
                type="button"
                className="btn-tool-act done"
                onClick={() => setIsFogToolActive(false)}
                style={{ padding: '4px 10px', fontSize: '10.5px' }}
              >
                <i className="fas fa-check"></i> Done
              </button>
            </div>
          </div>
        )}

        {/* Route Planner Tool HUD */}
        {isDrawingRoute && (
          <div className="map-floating-tool-hud route-tool-hud" onClick={e => e.stopPropagation()}>
            <div className="tool-hud-header">
              <i className="fas fa-route"></i>
              <span>Expedition Route Planner</span>
            </div>

            {/* Sequence Mode Toggle: Days vs Stops */}
            <div className="route-mode-switcher-row" style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
              <button
                type="button"
                className={`btn-route-mode ${routeMode !== 'stops' ? 'active' : ''}`}
                onClick={() => setRouteMode('days')}
                title="Plot by Day sequences and Multi-Day Stays (Day 1, Day 2, Day 3-5...)"
              >
                <i className="fas fa-calendar-day"></i> By Days
              </button>
              <button
                type="button"
                className={`btn-route-mode ${routeMode === 'stops' ? 'active' : ''}`}
                onClick={() => setRouteMode('stops')}
                title="Plot by Numbered Stops / Checkpoints (Stop 1, Stop 2...)"
              >
                <i className="fas fa-location-dot"></i> By Stops
              </button>
            </div>

            <p className="tool-hud-hint">
              <i className="fas fa-compass"></i> {routeMode === 'stops' ? 'Click map to place consecutive stops (Stop 1, Stop 2...)' : 'Click map to place journey days (Day 1, 2, 3...). Multi-day stays advance automatically!'}
            </p>
            <div className="tool-hud-stats">
              <span><strong>Waypoints:</strong> {currentMapWaypoints.length} {routeMode === 'stops' ? 'stops' : 'encampments'} plotted</span>
            </div>
            <div className="tool-hud-actions" style={{ marginTop: '8px' }}>
              <button
                type="button"
                className="btn-tool-act clear"
                onClick={() => {
                  setConfirmModal({
                    title: 'Clear Journey Trail',
                    message: 'Clear all journey trail waypoints on this map?',
                    icon: 'fa-trash',
                    confirmLabel: 'Clear Trail',
                    isDanger: true,
                    onConfirm: () => {
                      clearJourneyTrail(activeMap?.id);
                      syncToCloud(user?.uid);
                    }
                  });
                }}
              >
                <i className="fas fa-trash"></i> Clear Trail
              </button>
              <button
                type="button"
                className="btn-tool-act done"
                onClick={() => setIsDrawingRoute(false)}
              >
                <i className="fas fa-check"></i> Done Plotting
              </button>
            </div>
          </div>
        )}

        {/* Transformed Map Plane */}
        <div
          className="map-world-plane"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            '--map-zoom': zoomLevel,
            transformOrigin: '0 0'
          }}
        >
          {/* Map Backdrop Artwork */}
          {activeMap?.imageUrl && (
            <img
              src={activeMap.imageUrl}
              alt={activeMap.name}
              className="map-backdrop-img"
              draggable={false}
            />
          )}

          {/* Dynamic Fog of War Canvas Overlay */}
          <canvas
            ref={fogCanvasRef}
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            className={`map-fog-canvas ${isGMMode && !previewPlayerFog ? 'is-gm-fog' : 'is-player-fog'}`}
          />

          {/* SVG Journey Trails */}
          {layers.find(l => l.id === 'journey')?.isVisible !== false && (
            <svg className="map-journey-svg" width={MAP_WIDTH} height={MAP_HEIGHT} style={{ overflow: 'visible' }}>
              {currentMapWaypoints.length > 1 && (
                <polyline
                  points={currentMapWaypoints.map(w => `${(w.x / 100) * MAP_WIDTH},${(w.y / 100) * MAP_HEIGHT}`).join(' ')}
                  className="journey-trail-line"
                />
              )}
            </svg>
          )}

          {/* Interactive Journey Waypoints */}
          {layers.find(l => l.id === 'journey')?.isVisible !== false && currentMapWaypoints.map((w, idx) => {
            const isWpSelected = Boolean(selectedWaypointId) && Boolean(w.id) && selectedWaypointId === w.id;
            const badgeText = getWaypointBadgeText(w, idx);
            const pillText = getWaypointPillText(w, idx);
            const popupTag = getWaypointPopupTag(w, idx);
            const isLongBadge = String(badgeText).length > 2;

            return (
              <div
                key={w.id || `wp-node-${idx}`}
                className={`waypoint-node-interactive ${isWpSelected ? 'is-selected' : ''} ${w.isSecretGM ? 'is-secret' : ''} ${isMapLocked || w.isLocked ? 'is-locked-pos' : ''} ${isLongBadge ? 'has-wide-badge' : ''}`}
                style={{
                  left: `${(w.x / 100) * MAP_WIDTH}px`,
                  top: `${(w.y / 100) * MAP_HEIGHT}px`
                }}
                onMouseDown={(e) => {
                  if (e.target.closest('.waypoint-action-popup')) return;
                  e.stopPropagation();
                  if (!isMapLocked && !w.isLocked) {
                    setDraggedWaypointId(w.id);
                  }
                  if (!isDrawingRoute) {
                    setSelectedWaypoint(w.id);
                  }
                }}
                onClick={(e) => {
                  if (e.target.closest('.waypoint-action-popup')) return;
                  e.stopPropagation();
                  setSelectedWaypoint(selectedWaypointId === w.id ? null : w.id);
                }}
                title={`${pillText}: ${w.title} ${isMapLocked || w.isLocked ? '(Position Locked)' : '(Drag to move)'}`}
              >
                <div className={`waypoint-badge ${isLongBadge ? 'is-wide' : ''}`}>
                  <span className="waypoint-day-num">{badgeText}</span>
                  {w.isSecretGM && isGMMode && <span className="wp-secret-dot" title="Secret GM Waypoint"><i className="fas fa-eye-slash"></i></span>}
                  {isGMMode && (isMapLocked || w.isLocked) && <span className="wp-lock-dot" title="Position Locked"><i className="fas fa-lock"></i></span>}
                </div>
                <div className="waypoint-title-pill">
                  <span className="waypoint-title-tag">{w.title}</span>
                </div>

                {/* Waypoint Action Popup */}
                {isWpSelected && !isDrawingRoute && (
                  <div
                    className="waypoint-action-popup"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => e.stopPropagation()}
                  >
                    <div className="wp-popup-header">
                      <div className="wp-title-row">
                        <span className="wp-day-pill">{popupTag}</span>
                        <h5>{w.title}</h5>
                      </div>
                      <button
                        type="button"
                        className="btn-close-popup"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setSelectedWaypoint(null);
                        }}
                        title="Close waypoint popup"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    {w.notes && <p className="wp-popup-notes">{w.notes}</p>}

                    {/* Quick Stay Stepper / Duration Controls */}
                    <div className="wp-quick-stay-bar">
                      <span className="stay-bar-label">
                        <i className="fas fa-clock"></i> {w.dayType === 'stop' ? 'Stop Sequence' : 'Stay Duration'}:
                      </span>
                      {w.dayType === 'stop' ? (
                        <div className="stay-stepper">
                          <button
                            type="button"
                            className="btn-stay-step"
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentStop = w.stopNumber || idx + 1;
                              if (currentStop > 1) {
                                updateJourneyWaypoint(w.id, { stopNumber: currentStop - 1 });
                                syncToCloud(user?.uid);
                              }
                            }}
                            disabled={(w.stopNumber || idx + 1) <= 1}
                            title="Decrease stop number"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="stay-count-badge">Stop {w.stopNumber || idx + 1}</span>
                          <button
                            type="button"
                            className="btn-stay-step"
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentStop = w.stopNumber || idx + 1;
                              updateJourneyWaypoint(w.id, { stopNumber: currentStop + 1 });
                              syncToCloud(user?.uid);
                            }}
                            title="Increase stop number"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="stay-stepper">
                          <button
                            type="button"
                            className="btn-stay-step"
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentEnd = Number(w.endDay) || Number(w.day) || 1;
                              const currentStart = Number(w.day) || 1;
                              if (currentEnd > currentStart) {
                                const newEnd = currentEnd - 1;
                                updateJourneyWaypoint(w.id, {
                                  endDay: newEnd > currentStart ? newEnd : null,
                                  stayDuration: newEnd > currentStart ? (newEnd - currentStart + 1) : 1,
                                  dayType: newEnd > currentStart ? 'range' : 'day'
                                });
                                syncToCloud(user?.uid);
                              }
                            }}
                            disabled={!(w.endDay && Number(w.endDay) > Number(w.day))}
                            title="Decrease stay duration (-1 day)"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="stay-count-badge">
                            {w.endDay && Number(w.endDay) > Number(w.day) ? `${Number(w.endDay) - Number(w.day) + 1} Days` : '1 Day'}
                          </span>
                          <button
                            type="button"
                            className="btn-stay-step"
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentStart = Number(w.day) || 1;
                              const currentEnd = Number(w.endDay) || currentStart;
                              const newEnd = currentEnd + 1;
                              updateJourneyWaypoint(w.id, {
                                endDay: newEnd,
                                stayDuration: newEnd - currentStart + 1,
                                dayType: 'range'
                              });
                              syncToCloud(user?.uid);
                            }}
                            title="Increase stay duration (+1 day stay)"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="wp-popup-actions">
                      <button
                        type="button"
                        className="btn-wp-act btn-teleport-party"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPartyMarkerPosition(w.x, w.y, activeMap?.id || w.mapId);
                          setSelectedWaypoint(null);
                          syncToCloud(user?.uid);
                        }}
                      >
                        <i className="fas fa-campground"></i> Move Party Here
                      </button>
                      <button
                        type="button"
                        className="btn-wp-act"
                        onClick={() => {
                          const startDay = Number(w.day) || 1;
                          const endDay = w.endDay ? Number(w.endDay) : (w.dayType === 'range' ? startDay + 2 : null);
                          const dType = w.dayType || (w.stopNumber ? 'stop' : (w.endDay ? 'range' : 'day'));
                          setEditingWaypoint({
                            ...w,
                            day: startDay,
                            endDay: endDay,
                            dayType: dType,
                            stopNumber: w.stopNumber || idx + 1,
                            customLabel: w.customLabel || '',
                            stayDuration: endDay ? (endDay - startDay + 1) : 1
                          });
                        }}
                      >
                        <i className="fas fa-edit"></i> Edit Details
                      </button>
                      <button
                        type="button"
                        className="btn-wp-act delete"
                        onClick={() => handleDeleteWaypoint(w.id)}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Party Camp / Expedition Token Marker with Manual Drag & Reminders */}
          {partyMarker && (partyMarker.mapId || activeMap?.id) === activeMap?.id && (
            <div
              className={`party-token-marker ${isDraggingParty ? 'is-dragging' : ''} ${isMapLocked ? 'is-locked-pos' : ''}`}
              style={{
                left: `${(partyMarker.x / 100) * MAP_WIDTH}px`,
                top: `${(partyMarker.y / 100) * MAP_HEIGHT}px`
              }}
              onMouseDown={(e) => {
                if (e.target.closest('.party-notes-popup')) return;
                e.stopPropagation();
                if (!isMapLocked) {
                  setIsDraggingParty(true);
                }
              }}
              onClick={(e) => {
                if (e.target.closest('.party-notes-popup')) return;
                e.stopPropagation();
                setShowPartyNotes(prev => !prev);
              }}
              title={`The Party: Click for Camp Notes & Reminders ${isMapLocked ? '(Position Locked)' : '(Drag to move)'}`}
            >
              <div className="party-token-ring-pulse" />
              <div className="party-token-core">
                <i className="fas fa-campground"></i>
              </div>
              <span className="party-token-label">{partyMarker.name || 'The Party'}</span>

              {/* Party Camp Notes & Reminders Detail Card Popup */}
              {showPartyNotes && (
                <div
                  className="party-notes-popup"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                  onDoubleClick={(e) => e.stopPropagation()}
                >
                  <div className="party-popup-header">
                    <div className="party-popup-title">
                      <i className="fas fa-campground"></i>
                      <h4>Party Camp Log & Reminders</h4>
                    </div>
                    <button
                      type="button"
                      className="btn-close-popup"
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowPartyNotes(false);
                      }}
                      title="Close"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  <div className="party-popup-content">
                    <div className="party-notes-section">
                      <label><i className="fas fa-feather-pointed"></i> Expedition Notes / Marching Order</label>
                      <textarea
                        rows={3}
                        value={partyMarker.notes || ''}
                        onChange={(e) => {
                          updatePartyMarker({ notes: e.target.value });
                        }}
                        onBlur={() => syncToCloud(user?.uid)}
                        placeholder="Log active marching order, rations, active blessings, or current status..."
                      />
                    </div>

                    <div className="party-reminders-section">
                      <label><i className="fas fa-list-check"></i> Things to Remember</label>
                      <div className="party-reminders-list">
                        {(partyMarker.reminders || []).map((rem, remIdx) => (
                          <div key={rem.id || `rem-${remIdx}`} className={`party-reminder-item ${rem.done ? 'is-done' : ''}`}>
                            <label className="reminder-check-label">
                              <input
                                type="checkbox"
                                checked={Boolean(rem.done)}
                                onChange={(e) => {
                                  const updated = (partyMarker.reminders || []).map((r, i) =>
                                    i === remIdx ? { ...r, done: e.target.checked } : r
                                  );
                                  updatePartyMarker({ reminders: updated });
                                  syncToCloud(user?.uid);
                                }}
                              />
                              <span className="reminder-text">{rem.text}</span>
                            </label>
                            <button
                              type="button"
                              className="btn-delete-reminder"
                              onClick={() => {
                                const updated = (partyMarker.reminders || []).filter((_, i) => i !== remIdx);
                                updatePartyMarker({ reminders: updated });
                                syncToCloud(user?.uid);
                              }}
                              title="Delete Reminder"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>

                      <form
                        className="add-reminder-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newReminderText.trim()) return;
                          const newRem = {
                            id: `rem-${Date.now()}`,
                            text: newReminderText.trim(),
                            done: false
                          };
                          updatePartyMarker({
                            reminders: [...(partyMarker.reminders || []), newRem]
                          });
                          setNewReminderText('');
                          syncToCloud(user?.uid);
                        }}
                      >
                        <input
                          type="text"
                          value={newReminderText}
                          onChange={(e) => setNewReminderText(e.target.value)}
                          placeholder="+ Add new reminder / checklist..."
                        />
                        <button type="submit" className="btn-add-reminder">
                          <i className="fas fa-plus"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Landmark Pins */}
          {visiblePins.map(pin => {
            const isPinSelected = selectedPinId === pin.id;
            const targetSubMap = pin.targetMapId ? maps.find(m => m.id === pin.targetMapId) : null;
            const isLocked = isMapLocked || pin.isLocked;

            return (
              <div
                key={pin.id}
                className={`map-pin-marker ${isPinSelected ? 'is-selected' : ''} ${pin.isSecretGM ? 'is-secret' : ''} ${isLocked ? 'is-locked-pos' : ''}`}
                style={{
                  left: `${(pin.x / 100) * MAP_WIDTH}px`,
                  top: `${(pin.y / 100) * MAP_HEIGHT}px`,
                  '--pin-color': pin.color || '#d4af37'
                }}
                onMouseDown={(e) => {
                  if (e.target.closest('.pin-action-popup')) return;
                  e.stopPropagation();
                  if (!isMapLocked && !pin.isLocked) {
                    setDraggedPinId(pin.id);
                  }
                  setSelectedPin(pin.id);
                }}
                onClick={(e) => {
                  if (e.target.closest('.pin-action-popup')) return;
                  e.stopPropagation();
                  setSelectedPin(selectedPinId === pin.id ? null : pin.id);
                }}
                onDoubleClick={(e) => {
                  if (e.target.closest('.pin-action-popup')) return;
                  e.stopPropagation();
                  if (pin.targetMapId) {
                    setActiveMap(pin.targetMapId);
                  } else {
                    openPinEditor(pin);
                  }
                }}
                title={`${pin.title} ${isLocked ? '(Position Locked)' : '(Drag to move)'}`}
              >
                {/* Heraldic Crest Badge Bubble */}
                <div
                  className="pin-head-crest"
                  style={{
                    background: `radial-gradient(circle at 35% 35%, ${pin.color || '#d4af37'} 0%, #3a220a 100%)`
                  }}
                >
                  <i className={`fas ${pin.icon || 'fa-location-dot'}`}></i>
                  {pin.targetMapId && (
                    <span className="pin-submap-indicator" title="Contains Sub-Map (Double-click to enter)">
                      <i className="fas fa-magnifying-glass-plus"></i>
                    </span>
                  )}
                  {pin.isSecretGM && isGMMode && (
                    <span className="pin-secret-indicator" title="Hidden from Players">
                      <i className="fas fa-eye-slash"></i>
                    </span>
                  )}
                  {isGMMode && isLocked && (
                    <span className="pin-lock-indicator" title="Position Locked">
                      <i className="fas fa-lock"></i>
                    </span>
                  )}
                </div>

                {/* High-Contrast Parchment Label Banner */}
                <div className="pin-label-pill">
                  <span className="pin-title-text">{pin.title}</span>
                </div>

                {/* Compact, Non-Obstructing Pin Action / Detail Card Popup */}
                {isPinSelected && !isDrawingRoute && !isFogToolActive && (
                  <div
                    className="pin-action-popup"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => e.stopPropagation()}
                  >
                    <div className="pin-popup-header">
                      <div className="pin-popup-title-row">
                        <span className="pin-popup-type-tag">{(pin.type || 'poi').toUpperCase()}</span>
                        <h4 className="pin-popup-heading">{pin.title}</h4>
                      </div>
                      <button
                        type="button"
                        className="btn-close-popup"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setSelectedPin(null);
                        }}
                        title="Close popup"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>

                    {pin.description && (
                      <div className="pin-popup-body">
                        <RichLoreText text={pin.description} className="parchment-theme" />
                      </div>
                    )}

                    <div className="pin-popup-footer">
                      {/* Sub-Map Drilldown OR Attach Sub-Map Callout */}
                      {pin.targetMapId && targetSubMap ? (
                        <button
                          type="button"
                          className="btn-pin-drilldown"
                          onClick={() => setActiveMap(pin.targetMapId)}
                          title={`Enter ${targetSubMap.name}`}
                        >
                          <i className="fas fa-magnifying-glass-plus"></i> Enter Sub-Map: {targetSubMap.name} ↗
                        </button>
                      ) : (
                        <div className="pin-no-submap-box">
                          <span className="no-submap-text">
                            <i className="fas fa-map"></i> (No sub-map attached)
                          </span>
                          <button
                            type="button"
                            className="btn-pin-attach-link"
                            onClick={() => {
                              setAttachingSubMapPin(pin);
                              setSelectedExistingMapId('');
                              setSubMapName(`${pin.title} Realm`);
                            }}
                            title="Attach an existing regional map or upload a new sub-map image"
                          >
                            <i className="fas fa-plus"></i> Attach Sub-Map
                          </button>
                        </div>
                      )}

                      <div className="pin-footer-actions-row">
                        <button
                          type="button"
                          className={`btn-pin-act ${pin.isSecretGM ? 'btn-reveal' : 'btn-hide'}`}
                          onClick={() => {
                            togglePinPlayerVisibility(pin.id);
                            syncToCloud(user?.uid);
                          }}
                          title={pin.isSecretGM ? 'Reveal landmark to players' : 'Hide landmark from players'}
                        >
                          <i className={`fas ${pin.isSecretGM ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                          <span>{pin.isSecretGM ? 'Reveal' : 'Hide'}</span>
                        </button>

                        <button
                          type="button"
                          className="btn-pin-act"
                          onClick={() => openPinEditor(pin)}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>

                        <button
                          type="button"
                          className="btn-pin-act btn-danger"
                          onClick={() => handleDeletePin(pin.id)}
                          title="Delete Landmark Pin"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Brush Cursor Overlay when Fog Tool Active */}
        {isFogToolActive && mouseCanvasPos.inside && (
          <div
            className={`fog-live-brush-cursor ${fogBrushMode === 'reveal' ? 'is-reveal' : 'is-shroud'}`}
            style={{
              left: `${mouseCanvasPos.x}px`,
              top: `${mouseCanvasPos.y}px`,
              width: `${fogBrushSize * 2 * zoomLevel}px`,
              height: `${fogBrushSize * 2 * zoomLevel}px`
            }}
          />
        )}

        {/* Floating Zoom & Studio Navigation HUD */}
        <div className="map-studio-hud" onClick={e => e.stopPropagation()}>
          <button
            type="button"
            className="btn-hud-tool"
            onClick={() => handleZoomByButton(1)}
            title="Zoom In (+)"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            type="button"
            className="btn-hud-tool btn-zoom-pct"
            onClick={resetView}
            title="Reset Zoom & Pan (100%)"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            type="button"
            className="btn-hud-tool"
            onClick={() => handleZoomByButton(-1)}
            title="Zoom Out (-)"
          >
            <i className="fas fa-minus"></i>
          </button>
          <button
            type="button"
            className={`btn-hud-tool btn-lock-hud ${isMapLocked ? 'is-locked' : ''}`}
            onClick={toggleMapLock}
            title={isMapLocked ? 'Map Markers are Locked (Click to Unlock)' : 'Lock Map Markers (Prevent dragging)'}
          >
            <i className={`fas ${isMapLocked ? 'fa-lock' : 'fa-lock-open'}`}></i>
          </button>
          <button
            type="button"
            className="btn-hud-tool btn-new-map"
            onClick={() => setShowNewMapModal(true)}
            title="Upload / Register New Custom Map"
          >
            <i className="fas fa-folder-plus"></i>
          </button>
        </div>
      </main>

      {/* Pin Editor Drawer */}
      {showPinDrawer && editingPin && (
        <aside className="studio-drawer pin-editor-drawer" onClick={e => e.stopPropagation()}>
          <div className="drawer-header">
            <h3>{editingPin.isNew ? 'Create Landmark Pin' : 'Edit Landmark Pin'}</h3>
            <button className="btn-close-drawer" onClick={() => setShowPinDrawer(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>

          <form onSubmit={handleSavePin} className="drawer-form">
            <div className="form-group">
              <label>Landmark Title</label>
              <input
                type="text"
                required
                value={editingPin.title}
                onChange={(e) => setEditingPin({ ...editingPin, title: e.target.value })}
                placeholder="e.g. Frostwood Bastion"
              />
            </div>

            <div className="form-group">
              <div className="icon-picker-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ margin: 0 }}>Icon Symbol</label>
                <span className="selected-icon-badge-text" style={{ fontSize: '11.5px', color: '#8b5a1a', fontWeight: '800', fontFamily: 'Cinzel, serif' }}>
                  {PIN_ICONS.find(ic => ic.icon === editingPin.icon)?.label || 'Landmark'}
                </span>
              </div>
              <div className="icon-picker-grid">
                {PIN_ICONS.map(ic => (
                  <button
                    key={ic.id}
                    type="button"
                    className={`icon-choice-btn ${editingPin.icon === ic.icon ? 'active' : ''}`}
                    onClick={() => setEditingPin({ ...editingPin, icon: ic.icon })}
                    title={ic.label}
                    aria-label={ic.label}
                  >
                    <i className={`fas ${ic.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Heraldic Color</label>
              <div className="color-picker-row">
                {PIN_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`color-choice-btn ${editingPin.color === c ? 'active' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setEditingPin({ ...editingPin, color: c })}
                  />
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Category</label>
                <select
                  value={editingPin.type || 'poi'}
                  onChange={(e) => setEditingPin({ ...editingPin, type: e.target.value })}
                >
                  <option value="city">Capital / City</option>
                  <option value="dungeon">Dungeon / Ruin</option>
                  <option value="poi">Point of Interest</option>
                  <option value="hazard">Hazard / Boss</option>
                  <option value="sanctuary">Sanctuary / Temple</option>
                </select>
              </div>

              <div className="form-group flex-1">
                <label>Map Layer</label>
                <select
                  value={editingPin.layerId || 'poi'}
                  onChange={(e) => setEditingPin({ ...editingPin, layerId: e.target.value })}
                >
                  <option value="cities">Cities & Castles</option>
                  <option value="dungeons">Dungeons & Crypts</option>
                  <option value="poi">Points of Interest</option>
                  <option value="secrets">GM Secrets</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Sub-Map Drilldown (Optional)</label>
              <select
                value={editingPin.targetMapId || ''}
                onChange={(e) => setEditingPin({ ...editingPin, targetMapId: e.target.value || null })}
              >
                <option value="">None (Standard Landmark)</option>
                {maps.filter(m => m.id !== activeMap?.id).map((m, mIdx) => (
                  <option key={m.id || `submap-${mIdx}`} value={m.id}>
                    Dive into: {m.name} ({m.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Lore & Encounter Notes (Markdown)</label>
              <textarea
                rows={4}
                value={editingPin.description}
                onChange={(e) => setEditingPin({ ...editingPin, description: e.target.value })}
                placeholder="Ancient stronghold held by the Sovereign Scribes..."
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={editingPin.isSecretGM || false}
                  onChange={(e) => setEditingPin({ ...editingPin, isSecretGM: e.target.checked })}
                />
                <span>Secret GM Landmark (Hidden from Players until Revealed)</span>
              </label>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={editingPin.isLocked || false}
                  onChange={(e) => setEditingPin({ ...editingPin, isLocked: e.target.checked })}
                />
                <span>
                  <i className="fas fa-lock" style={{ marginRight: '6px' }} />
                  Lock Location (Prevent Accidental Dragging)
                </span>
              </label>
            </div>

            <div className="drawer-actions">
              <button type="submit" className="btn-drawer-primary">
                <i className="fas fa-save"></i> Save Landmark
              </button>
              {!editingPin.isNew && (
                <button
                  type="button"
                  className="btn-drawer-danger"
                  onClick={() => handleDeletePin(editingPin.id)}
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
          </form>
        </aside>
      )}

      {/* Attach Sub-Map Modal */}
      {attachingSubMapPin && (
        <div className="studio-modal-backdrop" onClick={() => setAttachingSubMapPin(null)}>
          <div className="studio-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Attach Sub-Map to &quot;{attachingSubMapPin.title}&quot;</h3>
              <button className="btn-close-modal" onClick={() => setAttachingSubMapPin(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleAttachSubMap} className="modal-form">
              <div className="modal-tab-nav">
                <button
                  type="button"
                  className={`modal-tab-btn ${attachTab === 'existing' ? 'active' : ''}`}
                  onClick={() => setAttachTab('existing')}
                >
                  <i className="fas fa-list"></i> Select Existing Map
                </button>
                <button
                  type="button"
                  className={`modal-tab-btn ${attachTab === 'new' ? 'active' : ''}`}
                  onClick={() => setAttachTab('new')}
                >
                  <i className="fas fa-plus"></i> Upload New Map Image
                </button>
              </div>

              {attachTab === 'existing' ? (
                <div className="form-group" style={{ marginTop: '10px' }}>
                  <label>Select Target Sub-Map</label>
                  <select
                    value={selectedExistingMapId}
                    onChange={(e) => setSelectedExistingMapId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a Sub-Map to Link --</option>
                    {maps.filter(m => m.id !== activeMap?.id).map((m, mIdx) => (
                      <option key={m.id || `sub-${mIdx}`} value={m.id}>
                        {m.name} ({m.type.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="new-submap-fields" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div className="form-group">
                    <label>Sub-Map Name</label>
                    <input
                      type="text"
                      required
                      value={subMapName}
                      onChange={(e) => setSubMapName(e.target.value)}
                      placeholder="e.g. Nordhalla Capital Interior"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Hierarchy Level</label>
                      <select
                        value={subMapType}
                        onChange={(e) => setSubMapType(e.target.value)}
                      >
                        <option value="continent">Continent</option>
                        <option value="region">Region</option>
                        <option value="city">City / Fortress</option>
                        <option value="dungeon">Dungeon / Interior</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Map Image Asset URL</label>
                    <input
                      type="text"
                      required
                      value={subMapImage}
                      onChange={(e) => setSubMapImage(e.target.value)}
                      placeholder="/assets/images/backgrounds/nordhalla.jpeg or https://..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      rows={2}
                      value={subMapDesc}
                      onChange={(e) => setSubMapDesc(e.target.value)}
                      placeholder="Regional overview or interior dungeon layout..."
                    />
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="submit" className="btn-modal-primary">
                  <i className="fas fa-link"></i> Link &amp; Save Sub-Map
                </button>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setAttachingSubMapPin(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Waypoint Modal */}
      {editingWaypoint && (
        <div className="studio-modal-backdrop" onClick={() => setEditingWaypoint(null)}>
          <div className="studio-modal-box waypoint-editor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Expedition Waypoint</h3>
              <button className="btn-close-modal" onClick={() => setEditingWaypoint(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleSaveWaypoint} className="modal-form">
              {/* Waypoint Type Switcher */}
              <div className="form-group">
                <label>Waypoint Type & Tracking Mode</label>
                <div className="waypoint-type-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                  <button
                    type="button"
                    className={`btn-wp-type-choice ${(editingWaypoint.dayType || 'day') === 'day' ? 'active' : ''}`}
                    onClick={() => {
                      const start = Number(editingWaypoint.day) || 1;
                      setEditingWaypoint({
                        ...editingWaypoint,
                        dayType: 'day',
                        day: start,
                        endDay: null,
                        stayDuration: 1
                      });
                    }}
                  >
                    <i className="fas fa-calendar-day"></i>
                    <span>Single Day</span>
                  </button>
                  <button
                    type="button"
                    className={`btn-wp-type-choice ${editingWaypoint.dayType === 'range' ? 'active' : ''}`}
                    onClick={() => {
                      const start = Number(editingWaypoint.day) || 1;
                      const end = editingWaypoint.endDay ? Number(editingWaypoint.endDay) : start + 2;
                      setEditingWaypoint({
                        ...editingWaypoint,
                        dayType: 'range',
                        day: start,
                        endDay: end > start ? end : start + 2,
                        stayDuration: (end > start ? end : start + 2) - start + 1
                      });
                    }}
                  >
                    <i className="fas fa-campground"></i>
                    <span>Stay (Range)</span>
                  </button>
                  <button
                    type="button"
                    className={`btn-wp-type-choice ${editingWaypoint.dayType === 'stop' ? 'active' : ''}`}
                    onClick={() => {
                      setEditingWaypoint({
                        ...editingWaypoint,
                        dayType: 'stop',
                        stopNumber: editingWaypoint.stopNumber || 1
                      });
                    }}
                  >
                    <i className="fas fa-location-dot"></i>
                    <span>Stop #</span>
                  </button>
                  <button
                    type="button"
                    className={`btn-wp-type-choice ${editingWaypoint.dayType === 'custom' ? 'active' : ''}`}
                    onClick={() => {
                      setEditingWaypoint({
                        ...editingWaypoint,
                        dayType: 'custom',
                        customLabel: editingWaypoint.customLabel || 'Base'
                      });
                    }}
                  >
                    <i className="fas fa-tag"></i>
                    <span>Custom</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Inputs based on type */}
              {(editingWaypoint.dayType || 'day') === 'day' && (
                <div className="form-group">
                  <label>Day Number</label>
                  <input
                    type="number"
                    min="1"
                    value={editingWaypoint.day || 1}
                    onChange={(e) => setEditingWaypoint({ ...editingWaypoint, day: parseInt(e.target.value) || 1 })}
                  />
                  <small style={{ color: '#6b4d32', fontStyle: 'italic' }}>Displays as <strong>Day {editingWaypoint.day || 1}</strong> on the trail.</small>
                </div>
              )}

              {editingWaypoint.dayType === 'range' && (
                <div className="stay-range-fields-container" style={{ background: '#f5eee3', padding: '10px', borderRadius: '6px', border: '1px solid rgba(139, 69, 19, 0.25)' }}>
                  <div className="form-row">
                    <div className="form-group flex-1">
                      <label>Start Day</label>
                      <input
                        type="number"
                        min="1"
                        value={editingWaypoint.day || 1}
                        onChange={(e) => {
                          const start = parseInt(e.target.value) || 1;
                          const dur = editingWaypoint.stayDuration || 3;
                          setEditingWaypoint({
                            ...editingWaypoint,
                            day: start,
                            endDay: start + dur - 1,
                            stayDuration: dur
                          });
                        }}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label>End Day</label>
                      <input
                        type="number"
                        min={(Number(editingWaypoint.day) || 1) + 1}
                        value={editingWaypoint.endDay || ((Number(editingWaypoint.day) || 1) + 2)}
                        onChange={(e) => {
                          const start = Number(editingWaypoint.day) || 1;
                          const end = parseInt(e.target.value) || (start + 1);
                          const safeEnd = end > start ? end : start + 1;
                          setEditingWaypoint({
                            ...editingWaypoint,
                            endDay: safeEnd,
                            stayDuration: safeEnd - start + 1
                          });
                        }}
                      />
                    </div>
                    <div className="form-group flex-1">
                      <label>Stay Duration</label>
                      <input
                        type="number"
                        min="2"
                        value={editingWaypoint.stayDuration || (editingWaypoint.endDay ? (editingWaypoint.endDay - editingWaypoint.day + 1) : 3)}
                        onChange={(e) => {
                          const dur = Math.max(2, parseInt(e.target.value) || 2);
                          const start = Number(editingWaypoint.day) || 1;
                          setEditingWaypoint({
                            ...editingWaypoint,
                            stayDuration: dur,
                            endDay: start + dur - 1
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '4px', fontSize: '11.5px', color: '#8b5a1a', fontWeight: 'bold' }}>
                    <i className="fas fa-bed"></i> Stay Duration: {editingWaypoint.endDay ? (editingWaypoint.endDay - editingWaypoint.day + 1) : 3} days (Day {editingWaypoint.day || 1} through Day {editingWaypoint.endDay || ((editingWaypoint.day || 1) + 2)})
                  </div>
                </div>
              )}

              {editingWaypoint.dayType === 'stop' && (
                <div className="form-group">
                  <label>Stop Number (Sequence)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingWaypoint.stopNumber || 1}
                    onChange={(e) => setEditingWaypoint({ ...editingWaypoint, stopNumber: parseInt(e.target.value) || 1 })}
                  />
                  <small style={{ color: '#6b4d32', fontStyle: 'italic' }}>Displays as <strong>Stop {editingWaypoint.stopNumber || 1}</strong>.</small>
                </div>
              )}

              {editingWaypoint.dayType === 'custom' && (
                <div className="form-group">
                  <label>Custom Badge / Milestone Label</label>
                  <input
                    type="text"
                    value={editingWaypoint.customLabel || ''}
                    onChange={(e) => setEditingWaypoint({ ...editingWaypoint, customLabel: e.target.value })}
                    placeholder="e.g. Camp Alpha, Base 1, S1"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Encampment / Waypoint Title</label>
                <input
                  type="text"
                  required
                  value={editingWaypoint.title}
                  onChange={(e) => setEditingWaypoint({ ...editingWaypoint, title: e.target.value })}
                  placeholder="e.g. Midhöfn Outpost Encampment"
                />
              </div>

              <div className="form-group">
                <label>Travel Log & Camp Encounter Notes</label>
                <textarea
                  rows={3}
                  value={editingWaypoint.notes}
                  onChange={(e) => setEditingWaypoint({ ...editingWaypoint, notes: e.target.value })}
                  placeholder="Ration depletion, weather hazards, frostbite checks, or random encounters..."
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editingWaypoint.isSecretGM || false}
                    onChange={(e) => setEditingWaypoint({ ...editingWaypoint, isSecretGM: e.target.checked })}
                  />
                  <span>Hidden Waypoint (Secret GM Plan)</span>
                </label>
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-modal-primary">
                  <i className="fas fa-save"></i> Save Waypoint
                </button>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setEditingWaypoint(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Map Registration Modal */}
      {showNewMapModal && (
        <div className="studio-modal-backdrop" onClick={() => setShowNewMapModal(false)}>
          <div className="studio-modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Register Custom Regional Map</h3>
              <button className="btn-close-modal" onClick={() => setShowNewMapModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleCreateNewMap} className="modal-form">
              <div className="form-group">
                <label>Map Name</label>
                <input
                  type="text"
                  required
                  value={newMapName}
                  onChange={(e) => setNewMapName(e.target.value)}
                  placeholder="e.g. Frostwood Timber Reach"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Map Hierarchy Tier</label>
                  <select
                    value={newMapType}
                    onChange={(e) => setNewMapType(e.target.value)}
                  >
                    <option value="continent">Continent</option>
                    <option value="region">Region / Province</option>
                    <option value="city">City / Fortress</option>
                    <option value="dungeon">Dungeon / Interior</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Parent Map</label>
                  <select
                    value={newMapParentId}
                    onChange={(e) => setNewMapParentId(e.target.value)}
                  >
                    <option value="">None (Top Level)</option>
                    {maps.map((m, mIdx) => (
                      <option key={m.id || `parent-${mIdx}`} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Map Image Asset URL</label>
                <input
                  type="text"
                  required
                  value={newMapImage}
                  onChange={(e) => setNewMapImage(e.target.value)}
                  placeholder="/assets/images/backgrounds/my-map.jpg or https://..."
                />
              </div>

              <div className="form-group">
                <label>Brief Lore Description</label>
                <textarea
                  rows={2}
                  value={newMapDesc}
                  onChange={(e) => setNewMapDesc(e.target.value)}
                  placeholder="The mist-shrouded valley bordering the northern glaciers..."
                />
              </div>

              <div className="modal-actions">
                <button type="submit" className="btn-modal-primary">
                  <i className="fas fa-plus"></i> Create Map
                </button>
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowNewMapModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Parchment Confirmation Modal Dialog */}
      {confirmModal && (
        <div className="studio-confirm-dialog-backdrop" onClick={() => setConfirmModal(null)}>
          <div className="studio-confirm-dialog" onClick={e => e.stopPropagation()}>
            <div className="confirm-dialog-header">
              <i className={`fas ${confirmModal.icon || 'fa-triangle-exclamation'}`}></i>
              <h4>{confirmModal.title}</h4>
            </div>
            <p className="confirm-dialog-body">{confirmModal.message}</p>
            <div className="confirm-dialog-actions">
              <button
                type="button"
                className="btn-dialog-cancel"
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn-dialog-confirm ${confirmModal.isDanger ? 'is-danger' : 'is-primary'}`}
                onClick={() => {
                  confirmModal.onConfirm?.();
                  setConfirmModal(null);
                }}
              >
                <i className={`fas ${confirmModal.icon || 'fa-check'}`}></i>
                <span>{confirmModal.confirmLabel || 'Confirm'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};

export default InteractiveMapStudio;
