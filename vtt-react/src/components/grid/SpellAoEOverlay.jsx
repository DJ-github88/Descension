import React, { useMemo, useEffect, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import useGameStore from '../../store/gameStore';
import useSpellAoEStore, { AOE_SHAPE_CONFIG } from '../../store/spellAoEStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useChatStore from '../../store/chatStore';
import useCharacterStore from '../../store/characterStore';
import { useShallow } from 'zustand/react/shallow';
import {
  buildAoEPolygon,
  clipAoEAgainstWalls,
  getTokensInAoE
} from '../../utils/AoETemplates';
import { calculateVisibilityPolygon } from '../../utils/VisibilityCalculations';
import './SpellAoE.css';

/**
 * SpellAoEOverlay - Live spell AoE template layer for the game grid.
 *
 * Two-click placement (via spellAoEStore):
 *   1. Click sets the caster origin (anchor) - a reticle follows the cursor.
 *   2. Move to aim - the template previews live, clipped against dungeon
 *      walls via the caster's visibility polygon. Tokens caught in the
 *      blast highlight in real time.
 *   Click again to confirm. Right-click or Esc cancels.
 *
 * The committed template persists on the map until cleared (panel button,
 * or Esc while idle), and posts a combat chat notification with the
 * affected token names.
 */
const SpellAoEOverlay = ({
  gridSystem,
  wallData,
  feetPerTile = 5,
  gridSize = 50,
  gridOffsetX = 0,
  gridOffsetY = 0,
  currentMapId = 'default'
}) => {
  const tool = useSpellAoEStore((state) => state.tool);
  const anchor = useSpellAoEStore((state) => state.anchor);
  const cursor = useSpellAoEStore((state) => state.cursor);
  const placement = useSpellAoEStore((state) => state.placement);
  const setCursor = useSpellAoEStore((state) => state.setCursor);
  const setAnchor = useSpellAoEStore((state) => state.setAnchor);
  const resetAnchor = useSpellAoEStore((state) => state.resetAnchor);
  const commitPlacement = useSpellAoEStore((state) => state.commitPlacement);
  const cancelPlacement = useSpellAoEStore((state) => state.cancelPlacement);
  const clearPlacement = useSpellAoEStore((state) => state.clearPlacement);

  const tokens = useCreatureStore((state) => state.tokens);
  const creatures = useCreatureStore((state) => state.creatures);
  const characterTokens = useCharacterTokenStore((state) => state?.characterTokens);
  const characterName = useCharacterStore((state) => state.name);
  const addNotification = useChatStore((state) => state.addNotification);

  // Camera/zoom subscriptions keep the persistent template locked to the map
  // while the camera pans or zooms (values feed the conversions below)
  const { cameraX, cameraY, zoomLevel, playerZoom, viewMode, viewRotation, viewTilt } = useGameStore(
    useShallow((state) => ({
      cameraX: state.cameraX,
      cameraY: state.cameraY,
      zoomLevel: state.zoomLevel,
      playerZoom: state.playerZoom,
      viewMode: state.viewMode,
      viewRotation: state.viewRotation,
      viewTilt: state.viewTilt
    }))
  );

  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Esc cancels an in-progress placement, or clears a committed template while idle
  useEffect(() => {
    if (!tool && !placement) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (tool) {
          cancelPlacement();
        } else {
          clearPlacement();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [tool, placement, cancelPlacement, clearPlacement]);

  const toScreen = useCallback(
    (worldX, worldY) => gridSystem.worldToScreen(worldX, worldY, viewport.width, viewport.height),
    // camera/zoom are intentional deps: subscribing forces re-render so
    // polygons re-project when the camera moves (gridSystem reads them internally)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridSystem, viewport.width, viewport.height, cameraX, cameraY, zoomLevel, playerZoom, viewMode, viewRotation, viewTilt]
  );

  const toWorld = useCallback(
    (screenX, screenY) => gridSystem.screenToWorld(screenX, screenY, viewport.width, viewport.height),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gridSystem, viewport.width, viewport.height, cameraX, cameraY, zoomLevel, playerZoom, viewMode, viewRotation, viewTilt]
  );

  // All tokens on the current map, resolved with display names (world px positions)
  const mapTokens = useMemo(() => {
    const creatureList = (tokens || [])
      .filter((t) => (t.mapId || 'default') === currentMapId)
      .map((t) => ({
        id: t.id,
        kind: 'creature',
        name: creatures.find((c) => c.id === t.creatureId)?.name || 'Creature',
        position: t.position
      }));
    const characterList = (characterTokens || [])
      .filter((t) => (t.mapId || 'default') === currentMapId)
      .map((t) => ({
        id: t.id,
        kind: 'character',
        name: t.name || t.character?.name || 'Character',
        position: t.position
      }));
    return [...creatureList, ...characterList];
  }, [tokens, creatures, characterTokens, currentMapId]);

  // Build the wall-clipped template for a (tool, anchor, target) state
  const buildTemplate = useCallback(
    (activeTool, origin, target) => {
      const polygon = buildAoEPolygon(activeTool.shape, {
        anchor: origin,
        target,
        sizeFeet: activeTool.sizeFeet,
        feetPerTile,
        gridSize
      });
      if (!polygon) return { rings: [], affected: [] };

      // Clip against the caster's visibility polygon so the blast
      // cannot pierce solid walls
      let reachPx = 0;
      for (const pt of polygon) {
        reachPx = Math.max(reachPx, Math.hypot(pt.x - origin.x, pt.y - origin.y));
      }
      const reachTiles = Math.ceil(reachPx / gridSize) + 1;
      let rings = [polygon];
      try {
        const visibility = calculateVisibilityPolygon(
          origin.x,
          origin.y,
          reachTiles,
          wallData || {},
          gridSize,
          gridOffsetX,
          gridOffsetY,
          360,
          null,
          {},
          gridSystem.getGridState().gridType || 'square',
          gridSystem
        );
        const clipped = clipAoEAgainstWalls(polygon, visibility);
        if (clipped && clipped.length > 0) {
          rings = clipped;
        }
      } catch (err) {
        console.warn('[SpellAoEOverlay] Wall clipping failed, using unclipped template:', err);
      }

      return { rings, affected: getTokensInAoE(mapTokens, rings) };
    },
    [feetPerTile, gridSize, gridOffsetX, gridOffsetY, wallData, mapTokens, gridSystem]
  );

  // Live preview template (only once the caster origin is set)
  const preview = useMemo(() => {
    if (!tool || !anchor || !cursor) return null;
    return buildTemplate(tool, anchor, cursor);
  }, [tool, anchor, cursor, buildTemplate]);

  const handleMouseMove = (e) => {
    setCursor(toWorld(e.clientX, e.clientY));
  };

  const handleClick = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const world = toWorld(e.clientX, e.clientY);
    if (!anchor) {
      setAnchor(world);
      return;
    }
    // Confirm placement
    const result = buildTemplate(tool, anchor, world);
    commitPlacement({
      rings: result.rings,
      affected: result.affected,
      origin: anchor,
      target: world
    });
    addNotification('combat', {
      type: 'spell_aoe',
      sender: characterName || 'GM',
      label: tool.label || `${tool.sizeFeet}-ft ${AOE_SHAPE_CONFIG[tool.shape]?.label || tool.shape}`,
      affectedCount: result.affected.length,
      affectedNames: result.affected.map((t) => t.name).join(', ') || 'none',
      timestamp: new Date().toISOString()
    });
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (anchor) {
      resetAnchor();
    } else {
      cancelPlacement();
    }
  };

  if (!gridSystem) return null;
  if (!tool && !placement) return null;

  const activeColor = tool?.color || placement?.color;
  const step = tool ? (anchor ? 2 : 1) : 0;

  // Which rings + affected set to render: live preview during placement,
  // committed template otherwise
  const renderRings = tool && preview ? preview.rings : placement?.rings || [];
  const renderAffected = tool && preview ? preview.affected : placement?.affected || [];

  const ringPath = (ring) =>
    ring
      .map((pt) => {
        const s = toScreen(pt.x, pt.y);
        return `${s.x},${s.y}`;
      })
      .join(' ');

  return ReactDOM.createPortal(
    <div className="spell-aoe-overlay-root">
      {/* Placement interaction layer - full screen while the tool is armed */}
      {tool && (
        <div
          className="spell-aoe-catcher"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          role="presentation"
        />
      )}

      <svg
        className={`spell-aoe-svg ${tool ? 'placing' : 'placed'}`}
        width={viewport.width}
        height={viewport.height}
        style={{ width: viewport.width, height: viewport.height }}
        pointerEvents="none"
      >
        {/* Committed or preview template rings */}
        {renderRings.map((ring, i) => (
          <polygon
            key={`aoe-ring-${i}`}
            points={ringPath(ring)}
            fill={activeColor?.fill || 'rgba(139, 92, 246, 0.25)'}
            stroke={activeColor?.stroke || '#8b5cf6'}
            strokeWidth={2}
            strokeDasharray={tool ? '8 4' : undefined}
            className={tool ? 'spell-aoe-pulse' : undefined}
          />
        ))}

        {/* Caster origin marker */}
        {(tool && anchor) || (!tool && placement?.origin) ? (
          (() => {
            const o = (tool && anchor) || placement.origin;
            const s = toScreen(o.x, o.y);
            return (
              <g className="spell-aoe-origin">
                <circle cx={s.x} cy={s.y} r={6} fill="none" stroke={activeColor?.stroke || '#8b5cf6'} strokeWidth={2} />
                <circle cx={s.x} cy={s.y} r={2} fill={activeColor?.stroke || '#8b5cf6'} />
              </g>
            );
          })()
        ) : null}

        {/* Affected token highlights */}
        {renderAffected.map((t) => {
          const s = toScreen(t.position.x, t.position.y);
          return (
            <g key={`aoe-hit-${t.id}`}>
              <circle
                cx={s.x}
                cy={s.y}
                r={22}
                fill="none"
                stroke="#dc2626"
                strokeWidth={2.5}
                className="spell-aoe-hit-ring"
              />
              <text x={s.x} y={s.y - 28} textAnchor="middle" className="spell-aoe-hit-label">
                {t.name}
              </text>
            </g>
          );
        })}

        {/* Step 1 reticle following the cursor before the origin is set */}
        {tool && !anchor && cursor ? (
          (() => {
            const s = toScreen(cursor.x, cursor.y);
            return (
              <g className="spell-aoe-reticle">
                <circle cx={s.x} cy={s.y} r={14} fill="none" stroke={activeColor?.stroke || '#8b5cf6'} strokeWidth={2} />
                <line x1={s.x - 20} y1={s.y} x2={s.x - 8} y2={s.y} stroke={activeColor?.stroke || '#8b5cf6'} strokeWidth={2} />
                <line x1={s.x + 8} y1={s.y} x2={s.x + 20} y2={s.y} stroke={activeColor?.stroke || '#8b5cf6'} strokeWidth={2} />
                <line x1={s.x} y1={s.y - 20} x2={s.x} y2={s.y - 8} stroke={activeColor?.stroke || '#8b5cf6'} strokeWidth={2} />
                <line x1={s.x} y1={s.y + 8} x2={s.x} y2={s.y + 20} stroke={activeColor?.stroke || '#8b5cf6'} strokeWidth={2} />
              </g>
            );
          })()
        ) : null}
      </svg>

      {/* Instruction banner while placing */}
      {tool && (
        <div className="spell-aoe-instructions">
          <span className="spell-aoe-instruction-title">
            {tool.label || `${tool.sizeFeet}-ft ${AOE_SHAPE_CONFIG[tool.shape]?.label || tool.shape}`}
          </span>
          <span className="spell-aoe-instruction-step">
            {step === 1
              ? 'Click the caster origin'
              : 'Aim and click to place — right-click to re-pick origin, Esc to cancel'}
          </span>
          {step === 2 && (
            <span className="spell-aoe-instruction-hits">
              {preview ? `${preview.affected.length} token${preview.affected.length === 1 ? '' : 's'} in blast` : ''}
            </span>
          )}
        </div>
      )}

      {/* Persistent template status chip */}
      {!tool && placement && (
        <div className="spell-aoe-placed-chip">
          <span>
            {placement.label || `${placement.sizeFeet}-ft template`} · {placement.affected.length} affected
          </span>
          <button type="button" onClick={clearPlacement} title="Clear template (Esc)">
            Clear
          </button>
        </div>
      )}
    </div>,
    document.body
  );
};

export default SpellAoEOverlay;
