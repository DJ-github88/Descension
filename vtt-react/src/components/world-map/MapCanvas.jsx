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
  activeShare
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
      
      console.log(`[MapCanvas] Smoothly panning to shared coordinates: [${centerX}, ${centerY}] at zoom ${targetScale}`);
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
            instance.setTransform(
              driftRef.current.x,
              driftRef.current.y,
              instance.transformState.scale || 0.4,
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

  // Set initial transform programmatically on mount to align exactly with the landing page background
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
      console.log(`[MapCanvas] Instantly aligned canvas to landing page position:`, initialTransform);
    }
  }, [phase, initialTransform]);

  // Handle Phase Transitions (Zoom Out on Enter, Zoom In on Exit)
  useEffect(() => {
    const ref = transformRef.current;
    if (!ref) return;

    if (phase === 'zoomingOut') {
      const W = window.innerWidth;
      const H = window.innerHeight;
      
      // Use cover scale (Math.max) so the map fills the entire viewport, rather than Math.min (which leaves margins)
      const fitScale = Math.max(W / 4096, H / 3072);
      const fitX = (W - 4096 * fitScale) / 2;
      const fitY = (H - 3072 * fitScale) / 2;

      // Animate zoom out to fit screen over 3500ms (slower, more immersive transition)
      ref.setTransform(fitX, fitY, fitScale, 3500, 'easeOut');
      
      // Initialize drift position at the fit location so it starts drifting from a clean place
      driftRef.current.x = fitX;
      driftRef.current.y = fitY;
      
      // Set timeout to enable drift once zoom out completes
      const t = setTimeout(() => {
        setDriftEnabled(true);
      }, 3500);
      return () => clearTimeout(t);
    } else if (phase === 'zoomingIn' && initialTransform) {
      // Disable drift immediately during exit zoom
      setDriftEnabled(false);
      // Zoom back in over 2000ms
      ref.setTransform(
        initialTransform.posX,
        initialTransform.posY,
        initialTransform.scale,
        2000,
        'easeOut'
      );
    }
  }, [phase, initialTransform]);

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
        wheel={{ step: 0.01, smoothStep: 0.002, zoomAnimation: { disabled: false, animationTime: 150 } }}
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
                style={{ width: MAP_WIDTH, height: MAP_HEIGHT, position: 'relative' }}
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
                    pointerEvents: isDrawingOrPlacing ? 'all' : 'none'
                  }}
                  onClick={(e) => onMapClick(e, transformRef)}
                  onMouseMove={handleMouseMoveInternal}
                  onContextMenu={(e) => {
                    if (devMode && devTool === 'drawRegion') {
                      e.preventDefault();
                      if (drawingPoints && drawingPoints.length > 0) {
                        setDrawingPoints([]);
                        setCursorPos(null);
                        console.log('[MapCanvas] Cancelled region drawing draft via right-click.');
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
