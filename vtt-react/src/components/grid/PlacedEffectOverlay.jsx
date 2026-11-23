import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { useShallow } from 'zustand/react/shallow';
import useGameStore from '../../store/gameStore';
import {
  usePlacedEffectStore,
  cancelMapPlacement,
  placeEffectAt,
  removePlacedEffect
} from '../../services/placedEffectService';
import './PlacedEffectOverlay.css';

const CIRCLE_SEGMENTS = 48;

function circleScreenPoints(center, worldRadius, toScreen) {
  if (!center || !Number.isFinite(center.x) || !Number.isFinite(center.y) || !Number.isFinite(worldRadius) || worldRadius <= 0) {
    return '';
  }
  const pts = [];
  for (let i = 0; i < CIRCLE_SEGMENTS; i += 1) {
    const theta = (i / CIRCLE_SEGMENTS) * Math.PI * 2;
    const p = toScreen(center.x + Math.cos(theta) * worldRadius, center.y + Math.sin(theta) * worldRadius);
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return pts.join(' ');
}

const PlacedEffectOverlay = ({ gridSystem, feetPerTile = 5, gridSize = 50, currentMapId = 'default' }) => {
  const roomId = useGameStore(s => s.multiplayerRoom?.id);
  const isGM = useGameStore(s => s.isGMMode === true);
  useGameStore(useShallow(s => [
    s.cameraX, s.cameraY, s.zoomLevel, s.playerZoom, s.viewMode, s.viewRotation, s.viewTilt,
    s.gridOffsetX, s.gridOffsetY, s.gridSize, s.feetPerTile
  ]));

  const projection = usePlacedEffectStore(s => s.projection);
  const placementDraft = usePlacedEffectStore(s => s.placementDraft);
  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const [cursorWorld, setCursorWorld] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const pickingActive = Boolean(isGM && roomId && placementDraft && placementDraft.mapId === currentMapId);

  useEffect(() => {
    if (!pickingActive) {
      setCursorWorld(null);
      return undefined;
    }
    const onKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        cancelMapPlacement();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [pickingActive]);

  const toScreen = useCallback(
    (wx, wy) => gridSystem.worldToScreen(wx, wy, viewport.width, viewport.height),
    [gridSystem, viewport.width, viewport.height]
  );

  const visiblePlacements = useMemo(() => {
    const list = Array.isArray(projection?.placements) ? projection.placements : [];
    return list.filter(item => item && item.location?.mapId === currentMapId);
  }, [projection, currentMapId]);

  if (!gridSystem || !roomId || (!visiblePlacements.length && !pickingActive)) {
    return null;
  }

  const worldRadiusFor = radiusFeet => {
    const safeFeet = Number.isFinite(feetPerTile) && feetPerTile > 0 ? feetPerTile : 5;
    const safeGrid = Number.isFinite(gridSize) && gridSize > 0 ? gridSize : 50;
    return (radiusFeet / safeFeet) * safeGrid;
  };

  const handleMouseMove = event => {
    if (!pickingActive) return;
    setCursorWorld(gridSystem.screenToWorld(event.clientX, event.clientY, viewport.width, viewport.height));
  };

  const handleMapClick = async event => {
    if (!pickingActive) return;
    event.preventDefault();
    event.stopPropagation();
    const worldPoint = gridSystem.screenToWorld(event.clientX, event.clientY, viewport.width, viewport.height);
    if (!worldPoint || !Number.isFinite(worldPoint.x) || !Number.isFinite(worldPoint.y)) return;
    await placeEffectAt({
      owner: placementDraft.owner,
      definitionRef: placementDraft.definitionRef,
      family: placementDraft.family,
      mapId: currentMapId,
      position: worldPoint,
      radiusFeet: placementDraft.radiusFeet,
      armed: false
    });
  };

  const handleRemove = async placementId => {
    setBusyId(placementId);
    try {
      await removePlacedEffect(placementId);
    } finally {
      setBusyId(null);
    }
  };

  const handleContext = event => {
    if (!pickingActive) return;
    event.preventDefault();
    cancelMapPlacement();
  };

  const previewRadiusWorld = pickingActive ? worldRadiusFor(placementDraft.radiusFeet || 10) : 0;

  return ReactDOM.createPortal(
    <div className="peo-root" data-testid="placed-effect-overlay">
      {pickingActive && (
        <div
          className="peo-catcher"
          role="application"
          data-testid="placed-effect-map-catcher"
          aria-label={`Place ${placementDraft.abilityName} on map`}
          onMouseMove={handleMouseMove}
          onClick={handleMapClick}
          onContextMenu={handleContext}
        />
      )}

      <svg className="peo-svg" width={viewport.width} height={viewport.height} aria-hidden="true">
        {visiblePlacements.map(item => {
          const pos = item.location?.position;
          if (!pos || !Number.isFinite(pos.x) || !Number.isFinite(pos.y)) return null;
          const centerScreen = toScreen(pos.x, pos.y);
          const worldR = worldRadiusFor(item.location?.radiusFeet || 10);
          const points = circleScreenPoints(pos, worldR, toScreen);
          const ringClass = item.state === 'armed'
            ? 'peo-ring peo-ring-armed'
            : (item.state === 'stale' || item.state === 'consumed')
              ? `peo-ring peo-ring-${item.state}`
              : 'peo-ring';

          return (
            <g key={item.placementId} data-testid={`placed-marker-${item.placementId}`}>
              {points && <polygon className={ringClass} points={points} />}
              <circle className="peo-center-dot" cx={centerScreen.x} cy={centerScreen.y} r={4} />
              <text className="peo-label" x={centerScreen.x + 8} y={centerScreen.y - 8}>
                {`${item.family}: ${item.abilityName} (${item.state})`}
              </text>
            </g>
          );
        })}

        {pickingActive && cursorWorld && Number.isFinite(cursorWorld.x) && Number.isFinite(cursorWorld.y) && (() => {
          const c = toScreen(cursorWorld.x, cursorWorld.y);
          const pts = circleScreenPoints(cursorWorld, previewRadiusWorld, toScreen);
          return (
            <g data-testid="placed-effect-preview">
              {pts && <polygon className="peo-ring-preview" points={pts} />}
              <circle className="peo-center-dot" cx={c.x} cy={c.y} r={4} />
            </g>
          );
        })()}
      </svg>

      {isGM && (
        <div className="peo-actions">
          {visiblePlacements.map(item => {
            const pos = item.location?.position;
            if (!pos || !Number.isFinite(pos.x) || !Number.isFinite(pos.y)) return null;
            const worldR = worldRadiusFor(item.location?.radiusFeet || 10);
            const diagScreen = toScreen(pos.x + worldR * 0.707, pos.y - worldR * 0.707);
            return (
              <button
                key={`rm-${item.placementId}`}
                type="button"
                className="peo-remove-btn"
                style={{ left: `${Math.round(diagScreen.x)}px`, top: `${Math.round(diagScreen.y)}px` }}
                data-testid={`placed-remove-map-${item.placementId}`}
                disabled={busyId === item.placementId}
                onClick={e => {
                  e.stopPropagation();
                  handleRemove(item.placementId);
                }}
              >
                Remove
              </button>
            );
          })}
        </div>
      )}

      {pickingActive && (
        <div className="peo-bar" role="region" aria-label="Map placement mode">
          <span>
            {`Click map to place ${placementDraft.family}: ${placementDraft.abilityName} (${placementDraft.radiusFeet} ft) · Esc or right-click cancels`}
          </span>
          <button type="button" onClick={cancelMapPlacement}>Cancel</button>
        </div>
      )}
    </div>,
    document.body
  );
};

export default PlacedEffectOverlay;
