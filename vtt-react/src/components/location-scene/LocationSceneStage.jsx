import React, { useState, useRef, useEffect, useMemo, useCallback, Fragment } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import useGameStore from '../../store/gameStore';
import LocationSceneToolbar from './LocationSceneToolbar';
import LocationPinDetailModal from './LocationPinDetailModal';
import LocationPinEditorModal from './LocationPinEditorModal';
import LocationPartyModal from './LocationPartyModal';
import LocationWaypointModal from './LocationWaypointModal';
import LocationMapManagerModal from './LocationMapManagerModal';
import CampaignCodexSidebar from './CampaignCodexSidebar';
import './LocationSceneStage.css';

const MAP_BASE_WIDTH = 2400;
const MAP_BASE_HEIGHT = 1600;

const LocationSceneStage = ({
  currentRoom,
  isGM: propIsGM,
  socket,
  activeLocationMapId: propLocationMapId
}) => {
  const isGMStore = useGameStore(state => state.isGMMode);
  const isGM = propIsGM !== undefined ? propIsGM : isGMStore;

  const isFreeRoamAllowed = useGameStore(state => state.isFreeRoamAllowed);
  const setIsFreeRoamAllowed = useGameStore(state => state.setIsFreeRoamAllowed);
  const setActiveSceneMode = useGameStore(state => state.setActiveSceneMode);

  const {
    maps,
    pins,
    activeMapId,
    partyMarker,
    mapFogData = {},
    journeyWaypoints = [],
    layers = [],
    isMapLocked,
    toggleMapLock,
    toggleLayerVisibility,
    setActiveMap,
    createMap,
    updateMap,
    deleteMap,
    addPin,
    updatePin,
    removePin,
    togglePinPlayerVisibility,
    setPartyMarkerPosition,
    updatePartyMarker,
    addFogStroke,
    clearMapFog,
    shroudAllMap,
    addJourneyWaypoint,
    updateJourneyWaypoint,
    removeJourneyWaypoint,
    deleteJourneyWaypoint,
    clearJourneyTrail,
    clearJourneyWaypoints,
    getMapBreadcrumbs,
    ensureStarterMaps
  } = useInteractiveMapStore();

  // Initialize maps if empty
  useEffect(() => {
    ensureStarterMaps();
  }, [ensureStarterMaps]);

  // Sync prop activeLocationMapId if passed and different
  useEffect(() => {
    if (propLocationMapId && propLocationMapId !== activeMapId) {
      setActiveMap(propLocationMapId);
    }
  }, [propLocationMapId, activeMapId, setActiveMap]);

  // Active map object
  const currentMap = useMemo(() => {
    const found = maps.find(m => m.id === (activeMapId || 'map-mythril-world'));
    if (found) return found;
    return maps[0] || {
      id: 'map-mythril-world',
      name: 'Mythrill',
      imageUrl: `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`
    };
  }, [maps, activeMapId]);

  // Breadcrumbs ancestry
  const breadcrumbs = useMemo(() => {
    return getMapBreadcrumbs(currentMap.id);
  }, [currentMap.id, getMapBreadcrumbs, maps]);

  // Current map waypoints
  const currentMapWaypoints = useMemo(() => {
    const wps = journeyWaypoints.filter(w => (w.mapId || 'map-mythril-world') === currentMap.id);
    if (isGM) return wps;
    return wps.filter(w => !w.isSecretGM && w.isDiscovered !== false);
  }, [journeyWaypoints, currentMap.id, isGM]);

  // Filter visible pins (excluding text labels)
  const visiblePins = useMemo(() => {
    const isPinsVisible = layers.find(l => l.id === 'pins')?.isVisible !== false;
    if (!isPinsVisible) return [];
    const mapPins = pins.filter(p => p.mapId === currentMap.id && p.type !== 'label');
    if (isGM) return mapPins;
    return mapPins.filter(p => !p.isSecretGM && p.isDiscovered !== false);
  }, [pins, currentMap.id, isGM, layers]);

  const isLabelsLayerVisible = useMemo(() => {
    return layers.find(l => l.id === 'labels')?.isVisible !== false;
  }, [layers]);

  // Filter visible text labels & regions
  const visibleLabels = useMemo(() => {
    if (!isLabelsLayerVisible) return [];
    const mapLabels = pins.filter(p => p.mapId === currentMap.id && p.type === 'label');
    if (isGM) return mapLabels;
    return mapLabels.filter(p => !p.isSecretGM && p.isDiscovered !== false);
  }, [pins, currentMap.id, isGM, isLabelsLayerVisible]);

  const areLabelsVisible = useMemo(() => {
    return layers.find(l => l.id === 'labels')?.isVisible !== false;
  }, [layers]);

  const isFogLayerVisible = useMemo(() => {
    return layers.find(l => l.id === 'fog')?.isVisible !== false;
  }, [layers]);

  const isJourneyLayerVisible = useMemo(() => {
    return layers.find(l => l.id === 'journey')?.isVisible !== false;
  }, [layers]);

  const secretCount = useMemo(() => {
    return pins.filter(p => p.mapId === currentMap.id && p.isSecretGM).length;
  }, [pins, currentMap.id]);

  // Modals & Interaction state
  const [selectedPinForDetail, setSelectedPinForDetail] = useState(null);
  const [editingPin, setEditingPin] = useState(null);
  const [showPartyModal, setShowPartyModal] = useState(false);
  const [selectedWaypointForModal, setSelectedWaypointForModal] = useState(null);
  const [mapManagerModalState, setMapManagerModalState] = useState(null); // { isOpen: boolean, isCreatingNew: boolean, map: MapObject }
  const [isDroppingPin, setIsDroppingPin] = useState(false);
  const [isDroppingLabel, setIsDroppingLabel] = useState(false);
  const [isMovingPartyMarker, setIsMovingPartyMarker] = useState(false);
  const [isDraggingPartyMarker, setIsDraggingPartyMarker] = useState(false);
  const [draggingPinId, setDraggingPinId] = useState(null);
  const [draggingWaypointId, setDraggingWaypointId] = useState(null);
  const [isDrawingRoute, setIsDrawingRoute] = useState(false);
  const [isCanvasDragOver, setIsCanvasDragOver] = useState(false);
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [placingCodexEntity, setPlacingCodexEntity] = useState(null);
  const [subMapTransition, setSubMapTransition] = useState({ isActive: false, name: '' });

  // Escape key cancels active placement tools
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsDroppingPin(false);
        setIsDroppingLabel(false);
        setIsDrawingRoute(false);
        setIsFogActive(false);
        setPlacingCodexEntity(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveMapManager = (mapData) => {
    if (mapData.id) {
      updateMap(mapData.id, mapData);
    } else {
      const newMap = createMap(mapData);
      setActiveMap(newMap.id);
    }
    setMapManagerModalState(null);

    if (socket && socket.connected && currentRoom?.id) {
      socket.emit('sync_location_scene_state', {
        roomId: currentRoom.id,
        mapId: mapData.id || currentMap.id,
        pins: pins.filter(p => p.mapId === (mapData.id || currentMap.id)),
        partyMarker,
        mapFogData: mapFogData[mapData.id || currentMap.id] || [],
        journeyWaypoints: journeyWaypoints.filter(w => (w.mapId || 'map-mythril-world') === (mapData.id || currentMap.id)),
        isFreeRoamAllowed
      });
    }
  };

  const handleDeleteMapManager = (mapId) => {
    deleteMap(mapId);
    setMapManagerModalState(null);
  };

  // Fog of War Brush State
  const [isFogActive, setIsFogActive] = useState(false);
  const [fogMode, setFogMode] = useState('shroud'); // 'shroud' | 'reveal'
  const [fogSize, setFogSize] = useState(120); // 60, 120, 240, 400
  const [previewPlayerFog, setPreviewPlayerFog] = useState(false);
  const [isDrawingFog, setIsDrawingFog] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });

  const transformComponentRef = useRef(null);
  const canvasRef = useRef(null);
  const fogCanvasRef = useRef(null);
  const currentFogStrokeRef = useRef(null);

  // Switch to tactical battle grid
  const handleSwitchToTactical = useCallback(() => {
    setActiveSceneMode('tactical');
    if (socket && socket.connected && currentRoom?.id) {
      socket.emit('set_scene_mode', {
        roomId: currentRoom.id,
        mode: 'tactical',
        activeLocationMapId: currentMap.id
      });
    }
  }, [setActiveSceneMode, socket, currentRoom, currentMap.id]);

  // Broadcast location scene state to room
  const handleSyncPartyToView = useCallback(() => {
    if (socket && socket.connected && currentRoom?.id) {
      socket.emit('set_scene_mode', {
        roomId: currentRoom.id,
        mode: 'location',
        activeLocationMapId: currentMap.id,
        isFreeRoamAllowed
      });
      socket.emit('sync_location_scene_state', {
        roomId: currentRoom.id,
        mapId: currentMap.id,
        pins: pins.filter(p => p.mapId === currentMap.id),
        partyMarker: partyMarker,
        mapFogData: mapFogData[currentMap.id] || [],
        journeyWaypoints: journeyWaypoints.filter(w => (w.mapId || 'map-mythril-world') === currentMap.id),
        isFreeRoamAllowed
      });
    }
  }, [socket, currentRoom, currentMap.id, isFreeRoamAllowed, pins, partyMarker, mapFogData, journeyWaypoints]);

  // Toggle Free Roam
  const handleToggleFreeRoam = useCallback(() => {
    const nextVal = !isFreeRoamAllowed;
    setIsFreeRoamAllowed(nextVal);
    if (socket && socket.connected && currentRoom?.id) {
      socket.emit('set_scene_mode', {
        roomId: currentRoom.id,
        mode: 'location',
        activeLocationMapId: currentMap.id,
        isFreeRoamAllowed: nextVal
      });
    }
  }, [isFreeRoamAllowed, setIsFreeRoamAllowed, socket, currentRoom, currentMap.id]);

  // Render Fog of War Canvas
  const renderFogCanvas = useCallback(() => {
    const canvas = fogCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);

    if (!isFogLayerVisible) return;

    const strokes = mapFogData[currentMap.id] || [];
    if (strokes.length === 0) return;

    const buffer = document.createElement('canvas');
    buffer.width = MAP_BASE_WIDTH;
    buffer.height = MAP_BASE_HEIGHT;
    const bCtx = buffer.getContext('2d');
    if (!bCtx) return;

    strokes.forEach(stroke => {
      const isReveal = stroke.isReveal;
      bCtx.globalCompositeOperation = isReveal ? 'destination-out' : 'source-over';
      bCtx.fillStyle = 'rgba(22, 16, 10, 0.98)';
      bCtx.strokeStyle = 'rgba(22, 16, 10, 0.98)';

      if (stroke.isFullCover) {
        bCtx.fillRect(0, 0, MAP_BASE_WIDTH, MAP_BASE_HEIGHT);
      } else if (stroke.points && stroke.points.length > 0) {
        const radius = stroke.radius || 120;
        bCtx.lineWidth = radius * 2;
        bCtx.lineCap = 'round';
        bCtx.lineJoin = 'round';

        bCtx.beginPath();
        stroke.points.forEach((pt, idx) => {
          const px = (pt.x / 100) * MAP_BASE_WIDTH;
          const py = (pt.y / 100) * MAP_BASE_HEIGHT;
          if (idx === 0) bCtx.moveTo(px, py);
          else bCtx.lineTo(px, py);
        });
        bCtx.stroke();

        stroke.points.forEach(pt => {
          const px = (pt.x / 100) * MAP_BASE_WIDTH;
          const py = (pt.y / 100) * MAP_BASE_HEIGHT;
          bCtx.beginPath();
          bCtx.arc(px, py, radius, 0, Math.PI * 2);
          bCtx.fill();
        });
      } else if (stroke.x !== undefined && stroke.y !== undefined) {
        const cx = (stroke.x / 100) * MAP_BASE_WIDTH;
        const cy = (stroke.y / 100) * MAP_BASE_HEIGHT;
        const radius = stroke.radius || 120;
        bCtx.beginPath();
        bCtx.arc(cx, cy, radius, 0, Math.PI * 2);
        bCtx.fill();
      }
    });

    ctx.save();
    const effectiveGM = isGM && !previewPlayerFog;
    ctx.globalAlpha = effectiveGM ? 0.45 : 0.98;
    ctx.drawImage(buffer, 0, 0);
    ctx.restore();
  }, [currentMap.id, mapFogData, isGM, previewPlayerFog, isFogLayerVisible]);

  useEffect(() => {
    renderFogCanvas();
  }, [renderFogCanvas, mapFogData, currentMap.id, isGM, previewPlayerFog, isFogLayerVisible]);

  // Handle Fog Drawing
  const handleCanvasMouseDown = (e) => {
    if (!isGM || !isFogActive || !canvasRef.current) return;
    e.stopPropagation();

    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const pctX = Math.round(Math.max(0, Math.min(100, (clickX / rect.width) * 100)) * 10) / 10;
    const pctY = Math.round(Math.max(0, Math.min(100, (clickY / rect.height) * 100)) * 10) / 10;

    setIsDrawingFog(true);
    currentFogStrokeRef.current = {
      isReveal: fogMode === 'reveal',
      radius: fogSize,
      points: [{ x: pctX, y: pctY }]
    };
  };

  const handleCanvasMouseMove = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    if (isFogActive && isGM) {
      setCursorPos({
        x: (clickX / rect.width) * MAP_BASE_WIDTH,
        y: (clickY / rect.height) * MAP_BASE_HEIGHT
      });
    }

    if (isDrawingFog && currentFogStrokeRef.current) {
      const pctX = Math.round(Math.max(0, Math.min(100, (clickX / rect.width) * 100)) * 10) / 10;
      const pctY = Math.round(Math.max(0, Math.min(100, (clickY / rect.height) * 100)) * 10) / 10;

      const pts = currentFogStrokeRef.current.points;
      const lastPt = pts[pts.length - 1];
      const dist = Math.hypot(pctX - lastPt.x, pctY - lastPt.y);

      if (dist > 0.5) {
        pts.push({ x: pctX, y: pctY });
        renderFogCanvas();
      }
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDrawingFog && currentFogStrokeRef.current) {
      setIsDrawingFog(false);
      const stroke = currentFogStrokeRef.current;
      currentFogStrokeRef.current = null;
      addFogStroke(currentMap.id, stroke);

      if (socket && socket.connected && currentRoom?.id) {
        const updatedStrokes = [...(mapFogData[currentMap.id] || []), stroke];
        socket.emit('sync_location_scene_state', {
          roomId: currentRoom.id,
          mapId: currentMap.id,
          pins: pins.filter(p => p.mapId === currentMap.id),
          partyMarker,
          mapFogData: updatedStrokes,
          isFreeRoamAllowed
        });
      }
    }
  };

  // Fog Helper Controls
  const handleShroudAll = () => {
    shroudAllMap(currentMap.id);
    if (socket && socket.connected && currentRoom?.id) {
      socket.emit('sync_location_scene_state', {
        roomId: currentRoom.id,
        mapId: currentMap.id,
        pins: pins.filter(p => p.mapId === currentMap.id),
        partyMarker,
        mapFogData: [{ id: `fog-full-${Date.now()}`, x: 50, y: 50, radius: 2400, isReveal: false, isFullCover: true }],
        isFreeRoamAllowed
      });
    }
  };

  const handleClearFog = () => {
    clearMapFog(currentMap.id);
    if (socket && socket.connected && currentRoom?.id) {
      socket.emit('sync_location_scene_state', {
        roomId: currentRoom.id,
        mapId: currentMap.id,
        pins: pins.filter(p => p.mapId === currentMap.id),
        partyMarker,
        mapFogData: [],
        isFreeRoamAllowed
      });
    }
  };

  // Handle clicking on map image for pin drop, party marker move, or waypoint add
  const handleCanvasClick = (e) => {
    if (!canvasRef.current || isFogActive) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pctX = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const pctY = Math.max(0, Math.min(100, (clickY / rect.height) * 100));

    if (placingCodexEntity && isGM) {
      const newPin = addPin({
        mapId: currentMap.id,
        x: Math.round(pctX * 10) / 10,
        y: Math.round(pctY * 10) / 10,
        title: placingCodexEntity.title || 'New Landmark',
        description: placingCodexEntity.description || '',
        icon: placingCodexEntity.icon || 'fa-location-dot',
        color: placingCodexEntity.color || '#d4af37',
        type: placingCodexEntity.type || 'poi',
        size: 'medium',
        scale: 1.0,
        isSecretGM: false,
        linkedEntities: placingCodexEntity.linkedEntities || {
          npcIds: [],
          creatureIds: [],
          factionIds: [],
          questIds: [],
          itemIds: [],
          locationId: null,
          journalNotes: ''
        }
      });
      setPlacingCodexEntity(null);
      if (socket && socket.connected && currentRoom?.id) {
        socket.emit('sync_location_scene_state', {
          roomId: currentRoom.id,
          mapId: currentMap.id,
          pins: [...pins.filter(p => p.mapId === currentMap.id), newPin],
          partyMarker,
          mapFogData: mapFogData[currentMap.id] || [],
          journeyWaypoints: journeyWaypoints.filter(w => (w.mapId || 'map-mythril-world') === currentMap.id),
          isFreeRoamAllowed
        });
      }
    } else if (isDroppingPin) {
      setIsDroppingPin(false);
      setEditingPin({
        x: Math.round(pctX * 10) / 10,
        y: Math.round(pctY * 10) / 10,
        mapId: currentMap.id,
        title: 'New Landmark',
        type: 'poi',
        icon: 'fa-location-dot',
        color: '#8c6738',
        size: 'medium'
      });
    } else if (isDroppingLabel) {
      setIsDroppingLabel(false);
      setEditingPin({
        x: Math.round(pctX * 10) / 10,
        y: Math.round(pctY * 10) / 10,
        mapId: currentMap.id,
        title: 'Region Name',
        type: 'label',
        icon: 'fa-font',
        color: '#2b1810',
        size: 'large'
      });
    } else if (isDrawingRoute && isGM) {
      // Add journey waypoint
      const nextDay = currentMapWaypoints.length + 1;
      addJourneyWaypoint({
        mapId: currentMap.id,
        x: Math.round(pctX * 10) / 10,
        y: Math.round(pctY * 10) / 10,
        title: `Day ${nextDay} Encampment`,
        day: nextDay
      });
    }
  };

  // Drag and drop staging on canvas
  const handleCanvasDragOver = (e) => {
    if (!isGM) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isCanvasDragOver) setIsCanvasDragOver(true);
  };

  const handleCanvasDragLeave = () => {
    setIsCanvasDragOver(false);
  };

  const handleCanvasDrop = (e) => {
    if (!isGM || !canvasRef.current) return;
    e.preventDefault();
    setIsCanvasDragOver(false);

    const rect = canvasRef.current.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;

    const pctX = Math.round(Math.max(0, Math.min(100, (dropX / rect.width) * 100)) * 10) / 10;
    const pctY = Math.round(Math.max(0, Math.min(100, (dropY / rect.height) * 100)) * 10) / 10;

    let rawData = null;
    try {
      const jsonStr = e.dataTransfer.getData('application/json');
      if (jsonStr) rawData = JSON.parse(jsonStr);
    } catch (err) {}

    if (!rawData) {
      try {
        const textStr = e.dataTransfer.getData('text/plain');
        if (textStr && textStr.startsWith('{')) rawData = JSON.parse(textStr);
        else if (textStr) rawData = { title: textStr };
      } catch (err) {}
    }

    if (rawData) {
      const entityType = rawData.type || rawData.entityType || 'poi';
      const entityTitle = rawData.name || rawData.title || 'New Landmark';
      const entityId = rawData.id || null;

      let pinType = 'poi';
      let pinIcon = 'fa-location-dot';
      let pinColor = '#8c6738';

      if (entityType === 'npc') {
        pinType = 'npc';
        pinIcon = 'fa-user-ninja';
        pinColor = '#a83232';
      } else if (entityType === 'quest') {
        pinType = 'quest';
        pinIcon = 'fa-scroll';
        pinColor = '#d35400';
      } else if (entityType === 'faction') {
        pinType = 'lore';
        pinIcon = 'fa-shield-halved';
        pinColor = '#8c6738';
      } else if (entityType === 'dungeon' || entityType === 'creature') {
        pinType = 'dungeon';
        pinIcon = 'fa-skull-crossbones';
        pinColor = '#8e44ad';
      }

      setEditingPin({
        x: pctX,
        y: pctY,
        mapId: currentMap.id,
        title: entityTitle,
        type: pinType,
        icon: pinIcon,
        color: pinColor,
        size: 'medium',
        description: rawData.description || rawData.summary || '',
        linkedEntities: {
          npcIds: entityType === 'npc' && entityId ? [entityId] : (rawData.linkedEntities?.npcIds || []),
          questIds: entityType === 'quest' && entityId ? [entityId] : (rawData.linkedEntities?.questIds || []),
          factionIds: entityType === 'faction' && entityId ? [entityId] : (rawData.linkedEntities?.factionIds || []),
          locationId: entityType === 'location' && entityId ? entityId : null,
          journalNotes: ''
        }
      });
    } else {
      setEditingPin({
        x: pctX,
        y: pctY,
        mapId: currentMap.id,
        title: 'New Landmark',
        type: 'poi',
        icon: 'fa-location-dot',
        color: '#8c6738',
        size: 'medium'
      });
    }
  };

  // Sub-Map entry with smooth fade transition
  const handleEnterSubMap = (targetMapId) => {
    if (!targetMapId) return;
    const targetMap = maps.find(m => m.id === targetMapId);
    const targetName = targetMap?.name || 'Sub-Map';

    setSubMapTransition({ isActive: true, name: targetName });

    setTimeout(() => {
      setActiveMap(targetMapId);
      setSelectedPinForDetail(null);

      // If GM and not free-roam, pull players along automatically
      if (isGM && !isFreeRoamAllowed && socket && socket.connected && currentRoom?.id) {
        socket.emit('set_scene_mode', {
          roomId: currentRoom.id,
          mode: 'location',
          activeLocationMapId: targetMapId,
          isFreeRoamAllowed: false
        });
      }

      setTimeout(() => {
        setSubMapTransition({ isActive: false, name: '' });
      }, 350);
    }, 250);
  };

  // Save new or edited pin
  const handleSavePin = (pinData) => {
    if (pinData.id) {
      updatePin(pinData.id, pinData);
    } else {
      addPin({
        ...pinData,
        mapId: currentMap.id
      });
    }
    setEditingPin(null);

    // Broadcast updated pins
    if (socket && socket.connected && currentRoom?.id) {
      socket.emit('sync_location_scene_state', {
        roomId: currentRoom.id,
        mapId: currentMap.id,
        pins: pins.filter(p => p.mapId === currentMap.id),
        partyMarker,
        mapFogData: mapFogData[currentMap.id] || [],
        isFreeRoamAllowed
      });
    }
  };

  // Delete pin
  const handleDeletePin = (pinId) => {
    removePin(pinId);
    setSelectedPinForDetail(null);
    if (socket && socket.connected && currentRoom?.id) {
      socket.emit('sync_location_scene_state', {
        roomId: currentRoom.id,
        mapId: currentMap.id,
        pins: pins.filter(p => p.id !== pinId && p.mapId === currentMap.id),
        partyMarker,
        mapFogData: mapFogData[currentMap.id] || [],
        isFreeRoamAllowed
      });
    }
  };

  // Toggle pin secret
  const handleTogglePinSecret = (pinId) => {
    togglePinPlayerVisibility(pinId);
    if (selectedPinForDetail && selectedPinForDetail.id === pinId) {
      setSelectedPinForDetail(prev => prev ? { ...prev, isSecretGM: !prev.isSecretGM } : null);
    }
    if (socket && socket.connected && currentRoom?.id) {
      socket.emit('sync_location_scene_state', {
        roomId: currentRoom.id,
        mapId: currentMap.id,
        pins: pins.filter(p => p.mapId === currentMap.id),
        partyMarker,
        mapFogData: mapFogData[currentMap.id] || [],
        isFreeRoamAllowed
      });
    }
  };

  // Direct mouse drag for party beacon (GM only) & Click to inspect
  const handlePartyMarkerMouseDown = (e) => {
    if (isMapLocked) return;
    e.stopPropagation();
    e.preventDefault();

    if (!isGM) {
      setShowPartyModal(true);
      return;
    }

    let didDrag = false;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent) => {
      if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 5) {
        didDrag = true;
        setIsDraggingPartyMarker(true);
      }
      if (!canvasRef.current || !didDrag) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const curX = moveEvent.clientX - rect.left;
      const curY = moveEvent.clientY - rect.top;
      const pctX = Math.round(Math.max(0, Math.min(100, (curX / rect.width) * 100)) * 10) / 10;
      const pctY = Math.round(Math.max(0, Math.min(100, (curY / rect.height) * 100)) * 10) / 10;
      setPartyMarkerPosition(pctX, pctY, currentMap.id);
    };

    const onMouseUp = (upEvent) => {
      setIsDraggingPartyMarker(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (!didDrag) {
        setShowPartyModal(true);
        return;
      }

      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const finalX = upEvent.clientX - rect.left;
      const finalY = upEvent.clientY - rect.top;
      const pctX = Math.round(Math.max(0, Math.min(100, (finalX / rect.width) * 100)) * 10) / 10;
      const pctY = Math.round(Math.max(0, Math.min(100, (finalY / rect.height) * 100)) * 10) / 10;

      setPartyMarkerPosition(pctX, pctY, currentMap.id);

      if (socket && socket.connected && currentRoom?.id) {
        socket.emit('sync_party_marker', {
          roomId: currentRoom.id,
          mapId: currentMap.id,
          x: pctX,
          y: pctY,
          name: partyMarker?.name || 'The Party'
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Direct mouse drag for Landmark Pins (GM only) & Click to inspect
  const handlePinMouseDown = (e, pin) => {
    if (isMapLocked) return;
    e.stopPropagation();
    e.preventDefault();

    if (!isGM) {
      setSelectedPinForDetail(pin);
      return;
    }

    let didDrag = false;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent) => {
      if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 4) {
        didDrag = true;
        setDraggingPinId(pin.id);
      }
      if (!canvasRef.current || !didDrag) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const curX = moveEvent.clientX - rect.left;
      const curY = moveEvent.clientY - rect.top;
      const pctX = Math.round(Math.max(0, Math.min(100, (curX / rect.width) * 100)) * 10) / 10;
      const pctY = Math.round(Math.max(0, Math.min(100, (curY / rect.height) * 100)) * 10) / 10;
      updatePin(pin.id, { x: pctX, y: pctY });
    };

    const onMouseUp = (upEvent) => {
      setDraggingPinId(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (!didDrag) {
        if (isFogActive && isGM) return;
        setSelectedPinForDetail(pin);
        return;
      }

      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const finalX = upEvent.clientX - rect.left;
      const finalY = upEvent.clientY - rect.top;
      const pctX = Math.round(Math.max(0, Math.min(100, (finalX / rect.width) * 100)) * 10) / 10;
      const pctY = Math.round(Math.max(0, Math.min(100, (finalY / rect.height) * 100)) * 10) / 10;

      updatePin(pin.id, { x: pctX, y: pctY });

      if (socket && socket.connected && currentRoom?.id) {
        socket.emit('sync_location_scene_state', {
          roomId: currentRoom.id,
          mapId: currentMap.id,
          pins: pins.map(p => p.id === pin.id ? { ...p, x: pctX, y: pctY } : p).filter(p => p.mapId === currentMap.id),
          partyMarker,
          mapFogData: mapFogData[currentMap.id] || [],
          journeyWaypoints: journeyWaypoints.filter(w => (w.mapId || 'map-mythril-world') === currentMap.id),
          isFreeRoamAllowed
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Direct mouse drag for Route Waypoints (GM only) & Click to edit/view
  const handleWaypointMouseDown = (e, waypoint, index) => {
    if (isMapLocked) return;
    e.stopPropagation();
    e.preventDefault();

    if (!isGM) {
      setSelectedWaypointForModal({ waypoint, index });
      return;
    }

    let didDrag = false;
    const startX = e.clientX;
    const startY = e.clientY;

    const onMouseMove = (moveEvent) => {
      if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 4) {
        didDrag = true;
        setDraggingWaypointId(waypoint.id);
      }
      if (!canvasRef.current || !didDrag) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const curX = moveEvent.clientX - rect.left;
      const curY = moveEvent.clientY - rect.top;
      const pctX = Math.round(Math.max(0, Math.min(100, (curX / rect.width) * 100)) * 10) / 10;
      const pctY = Math.round(Math.max(0, Math.min(100, (curY / rect.height) * 100)) * 10) / 10;
      updateJourneyWaypoint(waypoint.id, { x: pctX, y: pctY });
    };

    const onMouseUp = (upEvent) => {
      setDraggingWaypointId(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      if (!didDrag) {
        setSelectedWaypointForModal({ waypoint, index });
        return;
      }

      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const finalX = upEvent.clientX - rect.left;
      const finalY = upEvent.clientY - rect.top;
      const pctX = Math.round(Math.max(0, Math.min(100, (finalX / rect.width) * 100)) * 10) / 10;
      const pctY = Math.round(Math.max(0, Math.min(100, (finalY / rect.height) * 100)) * 10) / 10;

      updateJourneyWaypoint(waypoint.id, { x: pctX, y: pctY });

      if (socket && socket.connected && currentRoom?.id) {
        socket.emit('sync_location_scene_state', {
          roomId: currentRoom.id,
          mapId: currentMap.id,
          pins: pins.filter(p => p.mapId === currentMap.id),
          partyMarker,
          mapFogData: mapFogData[currentMap.id] || [],
          journeyWaypoints: journeyWaypoints.map(w => w.id === waypoint.id ? { ...w, x: pctX, y: pctY } : w).filter(w => (w.mapId || 'map-mythril-world') === currentMap.id),
          isFreeRoamAllowed
        });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Active party marker position
  const currentPartyPosition = useMemo(() => {
    if (!partyMarker) return { x: 50, y: 50, mapId: currentMap.id };
    return {
      x: partyMarker.x ?? 50,
      y: partyMarker.y ?? 50,
      mapId: partyMarker.mapId || currentMap.id
    };
  }, [partyMarker, currentMap.id]);

  const showPartyOnThisMap = currentPartyPosition.mapId === currentMap.id;

  return (
    <div className="location-scene-stage">
      {/* Sub-Map Fade Transition Overlay */}
      {subMapTransition.isActive && (
        <div className="location-submap-transition-overlay">
          <i className="fas fa-compass fa-spin fa-2x" style={{ color: '#ffd700' }}></i>
          <div className="submap-transition-title">Entering {subMapTransition.name}</div>
          <div className="submap-transition-subtitle">Traversing realm cartography...</div>
        </div>
      )}

      {/* Pathfinder Top GM Header & Navigation Deck */}
      <LocationSceneToolbar
        isGM={isGM}
        maps={maps}
        currentMap={currentMap}
        onSelectMap={setActiveMap}
        breadcrumbs={breadcrumbs}
        onEnterSubMap={handleEnterSubMap}
        onOpenNewMapModal={() => setMapManagerModalState({ isOpen: true, isCreatingNew: true, map: currentMap })}
        onOpenEditMapModal={(m) => setMapManagerModalState({ isOpen: true, isCreatingNew: false, map: m || currentMap })}
        // Pins & Labels
        isDroppingPin={isDroppingPin}
        onToggleDroppingPin={() => {
          setIsDroppingPin(prev => !prev);
          setIsDroppingLabel(false);
          setIsFogActive(false);
          setIsDrawingRoute(false);
        }}
        isDroppingLabel={isDroppingLabel}
        onToggleDroppingLabel={() => {
          setIsDroppingLabel(prev => !prev);
          setIsDroppingPin(false);
          setIsFogActive(false);
          setIsDrawingRoute(false);
          setPlacingCodexEntity(null);
        }}
        isCodexOpen={isCodexOpen}
        onToggleCodex={() => {
          setIsCodexOpen(prev => !prev);
          setIsDroppingPin(false);
          setIsDroppingLabel(false);
          setIsFogActive(false);
          setIsDrawingRoute(false);
          setPlacingCodexEntity(null);
        }}
        onSwitchToTactical={handleSwitchToTactical}
        secretCount={secretCount}
        // Fog of War
        isFogActive={isFogActive}
        onToggleFogTool={() => {
          setIsFogActive(prev => !prev);
          setIsDroppingPin(false);
          setIsDroppingLabel(false);
          setIsDrawingRoute(false);
        }}
        fogMode={fogMode}
        onSetFogMode={setFogMode}
        fogSize={fogSize}
        onSetFogSize={setFogSize}
        onShroudAll={handleShroudAll}
        onClearFog={handleClearFog}
        previewAsPlayer={previewPlayerFog}
        onTogglePreviewAsPlayer={() => setPreviewPlayerFog(prev => !prev)}
        // Route Planner
        isDrawingRoute={isDrawingRoute}
        onToggleRouteTool={() => {
          setIsDrawingRoute(prev => !prev);
          setIsDroppingPin(false);
          setIsDroppingLabel(false);
          setIsFogActive(false);
        }}
        onClearRoutes={() => {
          if (clearJourneyTrail) {
            clearJourneyTrail(currentMap.id);
          } else {
            currentMapWaypoints.forEach(w => removeJourneyWaypoint?.(w.id));
          }
          if (socket && socket.connected && currentRoom?.id) {
            socket.emit('sync_location_scene_state', {
              roomId: currentRoom.id,
              mapId: currentMap.id,
              pins: pins.filter(p => p.mapId === currentMap.id),
              partyMarker,
              mapFogData: mapFogData[currentMap.id] || [],
              journeyWaypoints: [],
              isFreeRoamAllowed
            });
          }
        }}
        // Layers & Lock
        layers={layers}
        onToggleLayer={toggleLayerVisibility}
        isMapLocked={isMapLocked}
        onToggleMapLock={toggleMapLock}
        // Zoom
        onZoomIn={() => transformComponentRef.current?.zoomIn()}
        onZoomOut={() => transformComponentRef.current?.zoomOut()}
        onResetZoom={() => transformComponentRef.current?.resetTransform()}
      />

      {/* Floating Exploration Breadcrumbs & Realm Navigation (Player & GM) */}
      <div className="location-exploration-breadcrumb-bar">
        <div className="exploration-breadcrumb-icon">
          <i className="fas fa-compass" />
        </div>
        <div className="exploration-breadcrumb-trail">
          {breadcrumbs.map((crumb, idx) => (
            <Fragment key={crumb.id || idx}>
              {idx > 0 && <span className="exploration-breadcrumb-sep"><i className="fas fa-chevron-right" /></span>}
              <button
                type="button"
                className={`exploration-breadcrumb-node ${crumb.id === currentMap?.id ? 'active' : ''}`}
                onClick={() => handleEnterSubMap(crumb.id)}
                title={`Navigate to ${crumb.name}`}
              >
                {crumb.name}
              </button>
            </Fragment>
          ))}
        </div>
      </div>

      {/* Floating Placing Entity Instruction Banner */}
      {placingCodexEntity && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 60,
            background: 'linear-gradient(180deg, #2b1810 0%, #1a0f05 100%)',
            border: '2px solid #ffd700',
            borderRadius: '30px',
            padding: '8px 20px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.7), 0 0 14px rgba(212, 175, 55, 0.4)',
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '13px',
            fontWeight: 700
          }}
        >
          <span style={{ color: '#ffd700' }}>
            <i className={`fas ${placingCodexEntity.icon || 'fa-map-pin'}`} /> Click anywhere on map to place:
          </span>
          <strong style={{ color: '#ffffff', textDecoration: 'underline' }}>{placingCodexEntity.title}</strong>
          <span style={{ fontSize: '11px', color: '#e2d3b5', background: 'rgba(212, 175, 55, 0.2)', padding: '2px 8px', borderRadius: '12px' }}>
            {placingCodexEntity.category}
          </span>
          <button
            type="button"
            onClick={() => setPlacingCodexEntity(null)}
            style={{
              background: '#8a1f11',
              border: '1px solid #ff6b6b',
              color: '#fff',
              borderRadius: '14px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              marginLeft: '4px'
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Main Pan / Zoom Viewport Wrapper */}
      <TransformWrapper
        ref={transformComponentRef}
        initialScale={1.0}
        minScale={0.3}
        maxScale={18.0}
        centerOnInit={true}
        wheel={{ step: 0.0035, smoothStep: 0.0008 }}
        pinch={{ step: 1 }}
        doubleClick={{ disabled: true }}
        panning={{ disabled: isDroppingPin || isDroppingLabel || isDrawingRoute || Boolean(placingCodexEntity) || isDraggingPartyMarker || Boolean(draggingPinId) || Boolean(draggingWaypointId) || (isFogActive && isGM) }}
      >
        {() => (
          <TransformComponent wrapperClass="location-scene-transform-container">
            <div
              ref={canvasRef}
              className={`location-scene-canvas-wrapper ${isCanvasDragOver ? 'is-drag-over' : ''}`}
              style={{
                width: `${MAP_BASE_WIDTH}px`,
                height: `${MAP_BASE_HEIGHT}px`,
                cursor: (isFogActive || isDrawingRoute) && isGM ? 'crosshair' : (isDroppingPin || isDroppingLabel || Boolean(placingCodexEntity) ? 'crosshair' : 'default')
              }}
              onClick={handleCanvasClick}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onDragOver={handleCanvasDragOver}
              onDragLeave={handleCanvasDragLeave}
              onDrop={handleCanvasDrop}
            >
              {/* Scene Map Artwork */}
              <img
                src={currentMap.imageUrl || `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`}
                alt={currentMap.name}
                className="location-scene-map-image"
                draggable={false}
              />

              {/* Fog of War Canvas Overlay */}
              <canvas
                ref={fogCanvasRef}
                className="location-scene-fog-canvas"
                width={MAP_BASE_WIDTH}
                height={MAP_BASE_HEIGHT}
              />

              {/* SVG Journey Trails */}
              {isJourneyLayerVisible && currentMapWaypoints.length > 1 && (
                <svg className="location-journey-svg" width={MAP_BASE_WIDTH} height={MAP_BASE_HEIGHT}>
                  <polyline
                    points={currentMapWaypoints.map(w => `${(w.x / 100) * MAP_BASE_WIDTH},${(w.y / 100) * MAP_BASE_HEIGHT}`).join(' ')}
                    className="journey-trail-line"
                  />
                </svg>
              )}

              {/* Interactive Journey Waypoint Nodes */}
              {isJourneyLayerVisible && currentMapWaypoints.map((w, idx) => (
                <div
                  key={w.id || `wp-${idx}`}
                  className={`waypoint-node-interactive ${draggingWaypointId === w.id ? 'is-dragging' : ''}`}
                  style={{
                    left: `${(w.x / 100) * MAP_BASE_WIDTH}px`,
                    top: `${(w.y / 100) * MAP_BASE_HEIGHT}px`,
                    cursor: isGM && !isMapLocked ? 'grab' : 'pointer'
                  }}
                  onMouseDown={(e) => handleWaypointMouseDown(e, w, idx)}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  title={isGM ? `Day ${idx + 1} (${w.title}) — Click & Drag to reposition on map` : `Day ${idx + 1}: ${w.title}`}
                >
                  <div className="waypoint-badge">
                    <span>{idx + 1}</span>
                  </div>
                  {areLabelsVisible && (
                    <div className="waypoint-title-pill">
                      <span>{w.title}</span>
                    </div>
                  )}
                </div>
              ))}

              {/* Fog Brush Cursor Indicator */}
              {isFogActive && isGM && cursorPos.x >= 0 && (
                <div
                  className={`location-fog-brush-cursor ${fogMode}`}
                  style={{
                    left: `${cursorPos.x}px`,
                    top: `${cursorPos.y}px`,
                    width: `${fogSize * 2}px`,
                    height: `${fogSize * 2}px`
                  }}
                />
              )}

              {/* Map Text Labels & Region Calligraphy */}
              {visibleLabels.map((lbl) => {
                const lblFontSize = lbl.size === 'small' ? '12px' : lbl.size === 'large' ? '20px' : lbl.size === 'epic' ? '28px' : '15px';
                const lblScale = lbl.scale !== undefined ? lbl.scale : (lbl.size === 'small' ? 0.75 : lbl.size === 'large' ? 1.35 : lbl.size === 'epic' ? 1.8 : 1.0);
                const isDraggingThis = draggingPinId === lbl.id;
                const hasSubMap = Boolean(lbl.targetMapId);

                return (
                  <div
                    key={lbl.id}
                    className={`location-map-text-label ${lbl.isSecretGM ? 'is-secret' : ''} ${isDraggingThis ? 'is-dragging' : ''} ${hasSubMap ? 'has-submap' : ''}`}
                    style={{
                      left: `${(lbl.x / 100) * MAP_BASE_WIDTH}px`,
                      top: `${(lbl.y / 100) * MAP_BASE_HEIGHT}px`,
                      transform: `translate(-50%, -50%) scale(${lblScale})`,
                      transformOrigin: 'center center',
                      cursor: isGM && !isMapLocked ? 'grab' : 'pointer'
                    }}
                    onMouseDown={(e) => handlePinMouseDown(e, lbl)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (lbl.targetMapId) handleEnterSubMap(lbl.targetMapId);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    title={isGM ? `Label: "${lbl.title}" — Click to inspect/edit, Drag to reposition${hasSubMap ? ' (Double-click to Enter)' : ''}` : `${lbl.title}${hasSubMap ? ' (Click/Double-click to Enter Scene)' : ''}`}
                  >
                    <span
                      className="map-label-text"
                      style={{
                        fontSize: lblFontSize,
                        color: lbl.color || '#2b1810'
                      }}
                    >
                      {lbl.title}
                    </span>
                    {lbl.description && (
                      <span className="map-label-subtext">
                        {lbl.description}
                      </span>
                    )}
                    {hasSubMap && (
                      <span className="map-label-secret-badge" style={{ color: '#1e824c', background: '#eafaf1', borderColor: '#27ae60' }} title="Connected Scene (Double-click to Enter)">
                        <i className="fas fa-door-open"></i> Enter ↗
                      </span>
                    )}
                    {lbl.isSecretGM && isGM && (
                      <span className="map-label-secret-badge" title="Hidden from Players">
                        <i className="fas fa-eye-slash"></i> Secret
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Interactive Landmark Pins */}
              {visiblePins.map((pin) => {
                const pinScale = pin.scale !== undefined ? pin.scale : (pin.size === 'small' ? 0.75 : pin.size === 'large' ? 1.35 : pin.size === 'epic' ? 1.75 : 1.0);
                const hasSubMap = Boolean(pin.targetMapId);

                return (
                  <div
                    key={pin.id}
                    className={`location-pin-marker ${pin.isSecretGM ? 'is-secret' : ''} ${draggingPinId === pin.id ? 'is-dragging' : ''} ${hasSubMap ? 'has-submap' : ''}`}
                    style={{
                      left: `${(pin.x / 100) * MAP_BASE_WIDTH}px`,
                      top: `${(pin.y / 100) * MAP_BASE_HEIGHT}px`,
                      transform: `translate(-50%, -50%) scale(${pinScale})`,
                      transformOrigin: 'center center',
                      '--pin-color': pin.color || '#8c6738',
                      cursor: isGM && !isMapLocked ? 'grab' : 'pointer'
                    }}
                    onMouseDown={(e) => handlePinMouseDown(e, pin)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (pin.targetMapId) handleEnterSubMap(pin.targetMapId);
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    title={`${pin.title}${hasSubMap ? ' (Contains Sub-Map — Double-click to Enter)' : ''}${pin.isSecretGM ? ' [Hidden from Players]' : ''}${isGM ? ' — Click & Drag to reposition' : ''}`}
                  >
                    {/* Crest Badge */}
                    <div
                      className="location-pin-crest"
                      style={{
                        background: `radial-gradient(circle at 35% 35%, ${pin.color || '#d4af37'} 0%, #201306 100%)`
                      }}
                    >
                      <i className={`fas ${pin.icon || 'fa-location-dot'}`}></i>

                      {hasSubMap && (
                        <div className="pin-submap-badge" title="Connected Scene Available (Double-click to Enter)">
                          <i className="fas fa-door-open"></i>
                        </div>
                      )}

                      {pin.isSecretGM && isGM && (
                        <div className="pin-secret-badge" title="Hidden from Players">
                          <i className="fas fa-eye-slash"></i>
                        </div>
                      )}
                    </div>

                    {/* Title Banner */}
                    {areLabelsVisible && (
                      <div className="location-pin-pill">
                        <span>{pin.title}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Party Marker Beacon (Draggable on GM, Smooth Gliding on Player) */}
              {showPartyOnThisMap && (
                <div
                  className={`party-marker-beacon ${isDraggingPartyMarker ? 'is-dragging' : ''}`}
                  style={{
                    left: `${(currentPartyPosition.x / 100) * MAP_BASE_WIDTH}px`,
                    top: `${(currentPartyPosition.y / 100) * MAP_BASE_HEIGHT}px`,
                    transform: `translate(-50%, -50%) scale(${partyMarker?.scale || 1.0})`,
                    transformOrigin: 'center center',
                    cursor: isGM && !isMapLocked ? 'grab' : 'pointer'
                  }}
                  onMouseDown={handlePartyMarkerMouseDown}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPartyModal(true);
                  }}
                  title={isGM ? `${partyMarker?.name || 'The Party'} (Click to view notes, drag to relocate)` : `${partyMarker?.name || 'The Party'} (Click to view expedition log)`}
                >
                  <div className="party-beacon-pulse" />
                  <div className="party-beacon-shield">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <div className="party-beacon-label">
                    <span>{partyMarker?.name || 'The Party'}</span>
                  </div>
                </div>
              )}
            </div>
          </TransformComponent>
        )}
      </TransformWrapper>

      {/* Landmark Pin Detail Modal (Player & GM) */}
      {selectedPinForDetail && (
        <LocationPinDetailModal
          pin={selectedPinForDetail}
          isGM={isGM}
          maps={maps}
          onClose={() => setSelectedPinForDetail(null)}
          onEnterSubMap={handleEnterSubMap}
          onEditPin={(pin) => {
            setSelectedPinForDetail(null);
            setEditingPin(pin);
          }}
          onToggleSecret={handleTogglePinSecret}
          onDeletePin={handleDeletePin}
        />
      )}

      {/* Landmark Pin Editor Modal (GM Only) */}
      {editingPin && isGM && (
        <LocationPinEditorModal
          initialPin={editingPin}
          mapId={currentMap.id}
          maps={maps}
          onSave={handleSavePin}
          onClose={() => setEditingPin(null)}
        />
      )}

      {/* Party Expedition Beacon Modal (Player & GM) */}
      {showPartyModal && (
        <LocationPartyModal
          partyMarker={partyMarker || { name: 'The Party', x: 50, y: 50, mapId: currentMap.id }}
          isGM={isGM}
          onSave={(updatedParty) => {
            updatePartyMarker(updatedParty);
            if (socket && socket.connected && currentRoom?.id) {
              socket.emit('sync_party_marker', {
                roomId: currentRoom.id,
                mapId: currentMap.id,
                ...updatedParty
              });
            }
          }}
          onClose={() => setShowPartyModal(false)}
        />
      )}

      {/* Expedition Route Waypoint Modal (Player & GM) */}
      {selectedWaypointForModal && (
        <LocationWaypointModal
          waypoint={selectedWaypointForModal.waypoint}
          waypointIndex={selectedWaypointForModal.index}
          isGM={isGM}
          onSave={(updatedWp) => {
            updateJourneyWaypoint(updatedWp.id, updatedWp);
          }}
          onDelete={(wpId) => {
            deleteJourneyWaypoint(wpId);
          }}
          onClose={() => setSelectedWaypointForModal(null)}
        />
      )}

      {/* Map / Location Scene Manager & Background Artwork Modal (GM Only) */}
      {mapManagerModalState?.isOpen && isGM && (
        <LocationMapManagerModal
          map={mapManagerModalState.map || currentMap}
          maps={maps}
          isCreatingNew={mapManagerModalState.isCreatingNew}
          onSave={handleSaveMapManager}
          onDelete={handleDeleteMapManager}
          onClose={() => setMapManagerModalState(null)}
        />
      )}

      {/* Campaign & Journal Codex Hub Sidebar (GM Only) */}
      {isCodexOpen && isGM && (
        <CampaignCodexSidebar
          currentMapId={currentMap.id}
          pins={pins}
          onClose={() => setIsCodexOpen(false)}
          onStartPlacing={(entityData) => {
            setPlacingCodexEntity(entityData);
            setIsDroppingPin(false);
            setIsDroppingLabel(false);
            setIsDrawingRoute(false);
            setIsFogActive(false);
            setIsCodexOpen(false);
          }}
          onFocusPin={(pinId) => {
            const pin = pins.find(p => p.id === pinId);
            if (pin) setSelectedPinForDetail(pin);
          }}
        />
      )}
    </div>
  );
};

export default LocationSceneStage;
