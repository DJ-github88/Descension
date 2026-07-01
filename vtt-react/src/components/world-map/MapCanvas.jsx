import React, { useRef, useCallback, useEffect, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import RegionOverlay from './RegionOverlay';
import LocationPins from './LocationPins';
import PlayerAnnotationsLayer from './PlayerAnnotationsLayer';
import MapControls from './MapControls';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';

const MAP_IMAGE_PATH = `${process.env.PUBLIC_URL || ''}/assets/images/backgrounds/Mythril.jpeg`;
const MAP_WIDTH = 4096;
const MAP_HEIGHT = 3072;

const MapCanvas = ({
  phase,
  initialTransform,
  devMode,
  devTool,
  currentRegion,
  drawingPoints,
  selectedPinType,
  setDrawingPoints,
  onMapClick,
  onMapMouseMove,
  selectedRegionId,
  setSelectedRegionId,
  selectedLocationId,
  setSelectedLocationId,
  setSidebarOpen,
  hoveredRegionId,
  setHoveredRegionId,
  onTransformChange,
  cursorPos,
  setCursorPos,
  onClose,
  onToggleDev,
  updateTrigger,
  onUpdate,
  currentCampaign,
  showConfirm,
  
  // New player annotations props
  activeTool,
  playerDrawingPoints,
  onResolveClick,
  canDragPlayerPins,
  onDragPlayerPin,
  onDeletePlayerPin,
  onSelectPlayerPin,
  onSelectPlayerArea,
  activeShare,

  // Dev move/select props
  selectedDevPinId,
  onSelectForMove
}) => {
  const transformRef = useRef(null);
  const [driftEnabled, setDriftEnabled] = useState(false);
  const driftRef = useRef({ x: 0, y: 0, active: false, timer: null });
  
  // States for dev editing pins
  const [draggedPinId, setDraggedPinId] = useState(null);

  // States for player dragging pins
  const [draggedPlayerPinId, setDraggedPlayerPinId] = useState(null);

  // Dynamic minScale to allow viewing the entire map
  const [minScale, setMinScale] = useState(0.15);

  // Sync zoom-pan to shared coordinates when activeShare changes
  useEffect(() => {
    if (activeShare && activeShare.viewState && transformRef.current) {
      const { centerX, centerY, zoom } = activeShare.viewState;
      const ref = transformRef.current;
      const W = window.innerWidth;
      const H = window.innerHeight;
      
      const targetScale = zoom || 0.8;
      // Calculate posX/posY so that [centerX, centerY] is in the middle of the screen
      const posX = W / 2 - centerX * targetScale;
      const posY = H / 2 - centerY * targetScale;

      ref.setTransform(posX, posY, targetScale, 1500, 'easeOut');
    }
  }, [activeShare]);

  useEffect(() => {
    const handleResize = () => {
      const W = window.innerWidth;
      const H = window.innerHeight;
      // Fit scale so the entire map is visible
      setMinScale(Math.min(W / 4096, H / 3072) * 0.95);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Translate screen coordinates into map-space pixel coordinates
  const getImageCoords = useCallback((e) => {
    try {
      const el = e.currentTarget || document.querySelector('.map-overlay-svg');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      const x = (e.clientX - rect.left) * (MAP_WIDTH / rect.width);
      const y = (e.clientY - rect.top) * (MAP_HEIGHT / rect.height);

      if (x < 0 || x > MAP_WIDTH || y < 0 || y > MAP_HEIGHT) return null;
      return [Math.round(x), Math.round(y)];
    } catch (err) {
      return null;
    }
  }, []);

  // Reset cursor pos when drawing points are cleared or mouse leaves
  useEffect(() => {
    if (drawingPoints.length === 0 && (!playerDrawingPoints || playerDrawingPoints.length === 0)) {
      setCursorPos(null);
    }
  }, [drawingPoints, playerDrawingPoints, setCursorPos]);

  // Sync auto-drift activity state (drift logic inlined to prevent initialization ReferenceErrors)
  useEffect(() => {
    let frame;
    const drift = () => {
      if (!driftRef.current.active) return;
      const ref = transformRef.current;
      if (ref) {
        driftRef.current.x += 0.3;
        driftRef.current.y -= 0.15;

        // Boundary wrapping
        if (driftRef.current.x > MAP_WIDTH * 0.3) driftRef.current.x = -MAP_WIDTH * 0.1;
        if (driftRef.current.y < -MAP_HEIGHT * 0.2) driftRef.current.y = MAP_HEIGHT * 0.1;

        try {
          const instance = ref.instance;
          if (instance && instance.setTransform) {
            const currentScale = instance.transformState.scale;
            instance.setTransform(
              driftRef.current.x,
              driftRef.current.y,
              currentScale > 0 ? currentScale : minScale,
              50
            );
          }
        } catch (e) {}
      }

      if (driftRef.current.active) {
        frame = requestAnimationFrame(drift);
      }
    };

    // Drift is only allowed if immersed, not devMode, and sidebar is closed
    const canDrift = phase === 'immersed' && !devMode && !selectedRegionId && driftEnabled;

    if (canDrift) {
      driftRef.current.active = true;
      frame = requestAnimationFrame(drift);
    } else {
      driftRef.current.active = false;
      if (frame) cancelAnimationFrame(frame);
    }

    return () => {
      driftRef.current.active = false;
      if (frame) cancelAnimationFrame(frame);
    };
  }, [driftEnabled, phase, devMode, selectedRegionId]);

  // Handle user interaction timeout to resume drift
  const handleUserInteraction = useCallback(() => {
    setDriftEnabled(false);
    if (driftRef.current.timer) clearTimeout(driftRef.current.timer);
    driftRef.current.timer = setTimeout(() => {
      setDriftEnabled(true);
    }, 5000);
  }, []);

  const handleTransformed = useCallback((ref) => {
    if (onTransformChange && ref && ref.instance) {
      onTransformChange(ref.instance.transformState);
    }
    handleUserInteraction();
  }, [onTransformChange, handleUserInteraction]);

  // Set initial transform programmatically on mount — starts at the
  // cover/fit position to match the end state of the landing page dive.
  useEffect(() => {
    const ref = transformRef.current;
    if (ref && initialTransform && phase === 'entering') {
      ref.setTransform(
        initialTransform.posX,
        initialTransform.posY,
        initialTransform.scale,
        0,
        'linear'
      );
      // Seed the drift ref so auto-drift starts from the correct position
      driftRef.current.x = initialTransform.posX;
      driftRef.current.y = initialTransform.posY;
    }
  }, [phase, initialTransform]);

  // Handle Phase Transitions
  useEffect(() => {
    const ref = transformRef.current;
    if (!ref) return;

    if (phase === 'immersed') {
      // Enable auto-drift after a brief delay to let the crossfade settle
      const t = setTimeout(() => setDriftEnabled(true), 1000);
      return () => clearTimeout(t);
    } else if (phase === 'zoomingIn') {
      // Exit — just stop drifting; WorldMapImmerse fades out as a whole
      setDriftEnabled(false);
    }
  }, [phase]);

  // Handle shift-dragging pin updates on mouse move
  const handleMouseMoveInternal = useCallback((e) => {
    if (onMapMouseMove) {
      onMapMouseMove(e, transformRef);
    }

    if (draggedPinId && devMode) {
      const coords = getImageCoords(e);
      if (coords) {
        LOCATION_COORDINATES[draggedPinId] = {
          ...LOCATION_COORDINATES[draggedPinId],
          x: coords[0],
          y: coords[1]
        };
        if (onUpdate) onUpdate();
      }
    } else if (draggedPlayerPinId && canDragPlayerPins && onDragPlayerPin) {
      const coords = getImageCoords(e);
      if (coords) {
        onDragPlayerPin(draggedPlayerPinId, coords[0], coords[1]);
      }
    }
  }, [draggedPinId, draggedPlayerPinId, devMode, canDragPlayerPins, onMapMouseMove, getImageCoords, onUpdate, onDragPlayerPin]);

  // Release dragged pin globally
  useEffect(() => {
    if (draggedPinId) {
      const handleGlobalMouseUp = () => {
        setDraggedPinId(null);
      };
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [draggedPinId]);

  // Release dragged player pin globally
  useEffect(() => {
    if (draggedPlayerPinId) {
      const handleGlobalMouseUp = () => {
        setDraggedPlayerPinId(null);
      };
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [draggedPlayerPinId]);

  // Dev Delete Pin callback
  const handleDeletePin = useCallback((zoneId, bypassConfirm = false) => {
    if (bypassConfirm) {
      delete LOCATION_COORDINATES[zoneId];
      if (onUpdate) onUpdate();
      return;
    }
    showConfirm(`Are you sure you want to delete the pin for "${zoneId}"?`, () => {
      delete LOCATION_COORDINATES[zoneId];
      if (onUpdate) onUpdate();
    });
  }, [showConfirm, onUpdate]);

  const handleDragStart = useCallback((zoneId) => {
    setDraggedPinId(zoneId);
  }, []);

  const handlePlayerPinDragStart = useCallback((pinId) => {
    setDraggedPlayerPinId(pinId);
  }, []);

  const getDrawingPreview = () => {
    if (!drawingPoints || drawingPoints.length === 0) return '';
    const pts = [...drawingPoints];
    if (cursorPos && pts.length > 0) {
      pts.push(cursorPos);
    }
    return pts.map(([x, y]) => `${x},${y}`).join(' ');
  };

  const getPlayerDrawingPreview = () => {
    if (!playerDrawingPoints || playerDrawingPoints.length === 0) return '';
    const pts = [...playerDrawingPoints];
    if (cursorPos && pts.length > 0) {
      pts.push(cursorPos);
    }
    return pts.map(([x, y]) => `${x},${y}`).join(' ');
  };

  const isDrawingOrPlacing = devMode || activeTool === 'placePin' || activeTool === 'drawArea';

  // Custom SVG cursors for drawing/placing modes
  const PEN_CURSOR = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'><path d='M4 22l3-3L20 6l-3-3L4 16v6z' fill='%23C4A44A' stroke='%231a0f08' stroke-width='1.5' stroke-linejoin='round'/><path d='M17 6l3 3M5 21l1-1' stroke='%231a0f08' stroke-width='1.5' stroke-linecap='round'/></svg>") 3 22, crosshair`;

  const FLAG_CURSOR = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'><path d='M8 2v22' stroke='%23C4A44A' stroke-width='2.5' stroke-linecap='round'/><path d='M8 3h13l-3 3.5 3 3.5H8z' fill='%23C4A44A' stroke='%231a0f08' stroke-width='1.2' stroke-linejoin='round'/></svg>") 8 2, crosshair`;

  const toolCursor = (() => {
    if (devMode && devTool === 'drawRegion') return PEN_CURSOR;
    if (devMode && devTool === 'placePin') return FLAG_CURSOR;
    if (devMode && devTool === 'erasePin') return 'pointer';
    if (activeTool === 'drawArea') return PEN_CURSOR;
    if (activeTool === 'placePin') return FLAG_CURSOR;
    return null; // fall back to grab/grabbing from CSS
  })();

  const startPoint = drawingPoints && drawingPoints[0];
  const isNearStart = startPoint && cursorPos && drawingPoints.length >= 3 &&
    Math.hypot(cursorPos[0] - startPoint[0], cursorPos[1] - startPoint[1]) < 30;

  return (
    <div className="map-canvas-wrapper">
      <TransformWrapper
        ref={transformRef}
        initialScale={initialTransform ? initialTransform.scale : 0.4}
        initialPositionX={initialTransform ? initialTransform.posX : 0}
        initialPositionY={initialTransform ? initialTransform.posY : 0}
        minScale={minScale}
        maxScale={3}
        limitToBounds={false}
        centerOnInit={false}
        smooth={false}
        wheel={{ step: 0.15, zoomAnimation: { disabled: false, animationTime: 100 } }}
        doubleClick={{ disabled: false }}
        panning={{ disabled: (devMode && devTool === 'drawRegion') || (activeTool === 'drawArea') || draggedPinId || draggedPlayerPinId ? true : false }}
        onTransformed={handleTransformed}
        onPanning={handleUserInteraction}
        onWheel={handleUserInteraction}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <React.Fragment>
            <TransformComponent
              wrapperStyle={{ width: '100vw', height: '100vh' }}
              contentStyle={{ width: MAP_WIDTH, height: MAP_HEIGHT }}
            >
                <div
                  className="map-content"
                  style={{ width: MAP_WIDTH, height: MAP_HEIGHT, position: 'relative', cursor: toolCursor || undefined }}
                >
                <img
                  src={MAP_IMAGE_PATH}
                  alt="Mythrill World Map"
                  style={{
                    width: MAP_WIDTH,
                    height: MAP_HEIGHT,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                  draggable={false}
                />

                <svg
                  className="map-overlay-svg"
                  viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: MAP_WIDTH,
                    height: MAP_HEIGHT,
                    pointerEvents: isDrawingOrPlacing ? 'all' : 'none',
                    cursor: toolCursor || 'inherit'
                  }}
                  onClick={(e) => onMapClick(e, transformRef)}
                  onMouseMove={handleMouseMoveInternal}
                  onContextMenu={(e) => {
                    if (devMode && devTool === 'drawRegion') {
                      e.preventDefault();
                      if (drawingPoints && drawingPoints.length > 0) {
                        setDrawingPoints([]);
                        setCursorPos(null);
                      }
                    }
                  }}
                >
                  <defs>
                    <filter id="pinShadow" x="-35%" y="-35%" width="170%" height="170%">
                      <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.75" />
                    </filter>
                  </defs>
                  <RegionOverlay
                    key={`regions-${updateTrigger}`}
                    selectedRegionId={selectedRegionId}
                    hoveredRegionId={hoveredRegionId}
                    setSelectedRegionId={setSelectedRegionId}
                    setSidebarOpen={setSidebarOpen}
                    setHoveredRegionId={setHoveredRegionId}
                    setSelectedLocationId={setSelectedLocationId}
                    devMode={devMode}
                    getImageCoords={getImageCoords}
                    onResolveClick={onResolveClick}
                  />
                  <LocationPins
                    key={`pins-${updateTrigger}`} // Force re-render on edit operations
                    selectedRegionId={selectedRegionId}
                    setSelectedRegionId={setSelectedRegionId}
                    setSelectedLocationId={setSelectedLocationId}
                    setSidebarOpen={setSidebarOpen}
                    devMode={devMode}
                    devTool={devTool}
                    onDeletePin={handleDeletePin}
                    onDragStart={handleDragStart}
                    onResolveClick={onResolveClick}
                    currentCampaign={currentCampaign}
                    selectedDevPinId={selectedDevPinId}
                    onSelectForMove={onSelectForMove}
                  />

                  {/* Player Annotations Layer */}
                  <PlayerAnnotationsLayer
                    onPinClick={onSelectPlayerPin}
                    onAreaClick={onSelectPlayerArea}
                    canDrag={canDragPlayerPins}
                    onDragStart={handlePlayerPinDragStart}
                    onDeletePin={onDeletePlayerPin}
                    onResolveClick={onResolveClick}
                  />

                  {/* Dev Editor drawing layer rendered inline inside map coordinates */}
                  {devMode && devTool === 'drawRegion' && (
                    <g className="dev-drawing-layer" style={{ pointerEvents: 'none' }}>
                      <defs>
                        <filter id="devGlow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <filter id="devCompleteGlow">
                          <feGaussianBlur stdDeviation="6" result="blur" />
                          <feColorMatrix type="matrix" values="
                            0 0 0 0 0.5
                            0 0 0 0 0.85
                            0 0 0 0 0.65
                            0 0 0 1 0
                          " in="blur" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <linearGradient id="quillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#C4A44A" />
                          <stop offset="50%" stopColor="#E8D5A3" />
                          <stop offset="100%" stopColor="#C4A44A" />
                        </linearGradient>
                      </defs>

                      {drawingPoints && drawingPoints.map(([x, y], i) => {
                        const isStart = i === 0;
                        const isClosingNearStart = isStart && isNearStart;
                        return (
                          <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r={isClosingNearStart ? 10 : (isStart ? 6 : 4)}
                            fill={isClosingNearStart ? '#80d8a8' : '#E8D5A3'}
                            filter={isClosingNearStart ? 'url(#devCompleteGlow)' : 'url(#devGlow)'}
                            style={{ transition: 'all 0.15s ease' }}
                          />
                        );
                      })}

                      {drawingPoints && drawingPoints.length >= 1 && (
                        <polyline
                          points={getDrawingPreview()}
                          fill="none"
                          stroke={isNearStart ? '#80d8a8' : 'url(#quillGradient)'}
                          strokeWidth={isNearStart ? '3.5' : '2.5'}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter={isNearStart ? 'url(#devCompleteGlow)' : 'url(#devGlow)'}
                          strokeDasharray={cursorPos && drawingPoints.length > 0 ? '8 4' : 'none'}
                        />
                      )}
                    </g>
                  )}

                  {/* Player drawing layer rendered inline inside map coordinates */}
                  {!devMode && activeTool === 'drawArea' && (
                    <g className="player-drawing-layer" style={{ pointerEvents: 'none' }}>
                      <defs>
                        <filter id="playerGlow">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                        <linearGradient id="playerQuillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b7a8c" />
                          <stop offset="50%" stopColor="#e0cfa5" />
                          <stop offset="100%" stopColor="#3b7a8c" />
                        </linearGradient>
                      </defs>

                      {playerDrawingPoints && playerDrawingPoints.map(([x, y], i) => (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={i === 0 ? 6 : 4}
                          fill="#e0cfa5"
                          filter="url(#playerGlow)"
                        />
                      ))}

                      {playerDrawingPoints && playerDrawingPoints.length >= 1 && (
                        <polyline
                          points={getPlayerDrawingPreview()}
                          fill="none"
                          stroke="url(#playerQuillGradient)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          filter="url(#playerGlow)"
                          strokeDasharray={cursorPos && playerDrawingPoints.length > 0 ? '8 4' : 'none'}
                        />
                      )}
                    </g>
                  )}
                </svg>
              </div>
            </TransformComponent>

            <MapControls
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetTransform={resetTransform}
              onClose={onClose}
              devMode={devMode}
              onToggleDev={onToggleDev}
            />

            <div className="map-zoom-hint" style={{ opacity: phase === 'immersed' ? 1 : 0 }}>
              <span>Scroll to zoom</span>
              <span className="hint-divider">·</span>
              <span>Drag to pan</span>
            </div>
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  );
};

export default MapCanvas;
