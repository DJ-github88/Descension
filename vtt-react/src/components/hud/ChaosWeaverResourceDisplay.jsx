import React from 'react';
import {
  BRICK,
  ETCH,
  INK,
  MUTED,
  PAGE,
  PAPER,
  RULE,
  inked,
  pageFrame,
  washed
} from './calmBarPalette';
import {
  CHAOS_WEAVER_TILE_IDS,
  CHAOS_WEAVER_TILE_SYMBOLS
} from '../../data/classes/chaosWeaverData';
import {
  countZones,
  resourceSummaryText,
  validateTileState,
  zoneOfTile
} from '../../data/classes/chaosWeaverRules';

const WYRD = '#5f4b8b';

const SYMBOL_NAMES = { S: 'Surge', F: 'Fracture', M: 'Shift' };

const ZONE_LANES = [
  { zone: 'available', label: 'Available', accent: RULE },
  { zone: 'committed', label: 'Committed', accent: inked(WYRD, 0.25) },
  { zone: 'bound', label: 'Bound', accent: inked(WYRD) },
  { zone: 'spent', label: 'Spent', accent: ETCH }
];

const ZONE_VISUALS = {
  available: {
    socketFill: PAPER,
    socketStroke: RULE,
    glyphStroke: INK,
    locked: false,
    hatch: false,
    slash: false,
    labelFill: MUTED
  },
  committed: {
    socketFill: washed(WYRD, 0.34),
    socketStroke: inked(WYRD, 0.25),
    glyphStroke: inked(WYRD, 0.45),
    locked: true,
    hatch: false,
    slash: false,
    labelFill: inked(WYRD, 0.2)
  },
  bound: {
    socketFill: washed(WYRD, 0.58),
    socketStroke: inked(WYRD),
    glyphStroke: INK,
    locked: false,
    hatch: true,
    slash: false,
    labelFill: inked(WYRD, 0.2)
  },
  spent: {
    socketFill: PAGE,
    socketStroke: ETCH,
    glyphStroke: ETCH,
    locked: false,
    hatch: false,
    slash: true,
    labelFill: ETCH
  }
};

const TOKEN_SLOT_X = CHAOS_WEAVER_TILE_IDS.map((_, index) => 27 + index * 37.2);
const TOKEN_CY = 25;

const surgePath = (cx, cy) => `M ${cx},${cy - 7.2} L ${cx + 6.6},${cy + 4.8} L ${cx - 6.6},${cy + 4.8} Z`;
const shiftPath = (cx, cy) =>
  `M ${cx - 6.4},${cy + 4.6} L ${cx - 1.6},${cy - 3.2} L ${cx + 1.8},${cy + 2.4} L ${cx + 6.2},${cy - 5}`;
const fracturePath = (cx, cy) =>
  `M ${cx},${cy - 7.4} L ${cx + 6.2},${cy} L ${cx},${cy + 7.4} L ${cx - 6.2},${cy} Z`;
const fractureSplit = (cx, cy) => `M ${cx},${cy - 7.4} L ${cx},${cy + 7.4}`;

const pendingText = (pending) => {
  if (pending === null || pending === undefined) return 'No unresolved draw.';
  const mapped = Array.isArray(pending.primaryTileIds) ? pending.primaryTileIds.join('+') : '';
  const faces = Array.isArray(pending.recordedFaces) ? pending.recordedFaces : [];
  if (pending.phase === 'continuation-pending') {
    if (faces.length === 0) {
      return `Recorded result \u2192 ${pending.selectedTileId || mapped}; ${pending.continuationTileId} reserved \u2014 accept or decline.`;
    }
    return `Face ${faces[0]} \u2192 ${pending.selectedTileId} recorded; ${pending.continuationTileId} reserved \u2014 accept or decline.`;
  }
  if (pending.phase === 'face-recorded') {
    if (faces.length > 0) {
      return `Face ${faces[0]} \u2192 ${pending.selectedTileId} recorded \u2014 settle to finish.`;
    }
    // Deterministic authored outcomes settle without a physical face; do not
    // invent a face value or read from a missing recordedFaces record.
    if (pending.mapping?.dice === null || pending.mapping?.dice === undefined) {
      return `Deterministic result ${mapped} recorded \u2014 no physical face; settle to finish.`;
    }
    return `Recorded result \u2192 ${pending.selectedTileId || mapped} \u2014 settle to finish.`;
  }
  return `Draw locked: ${mapped} \u00b7 ${pending.mapping?.dice} mapping fixed \u2014 enter the physical face.`;
};

const anomalyText = (anomaly) => {
  if (anomaly === null || anomaly === undefined) return 'No anomaly.';
  return `Anomaly: ${anomaly.tileIds.join('+')} bound \u00b7 ${anomaly.radiusFeet}ft \u00b7 expires own turn ${anomaly.expiresEndOwnTurn}.`;
};

const buttonStyle = {
  minWidth: 44,
  minHeight: 44,
  padding: '6px 12px',
  font: 'inherit',
  fontSize: '0.78rem',
  letterSpacing: '0.02em',
  color: INK,
  background: PAPER,
  border: `1px solid ${RULE}`,
  borderRadius: 4,
  cursor: 'pointer'
};

const disabledButtonStyle = {
  ...buttonStyle,
  color: MUTED,
  border: `1px solid ${ETCH}`,
  cursor: 'not-allowed',
  opacity: 0.7
};

const ChaosWeaverResourceDisplay = ({
  tiles,
  pending = null,
  anomaly = null,
  disabledReason = null,
  onInspect = null
}) => {
  const tileCheck = validateTileState(tiles);

  if (!tileCheck.ok) {
    return (
      <div
        className="chaos-weaver-resource-display chaos-weaver-resource-invalid"
        data-cw-invalid="true"
        role="note"
        style={{
          border: `1px solid ${BRICK}`,
          borderRadius: 4,
          padding: '8px 10px',
          background: PAPER,
          color: BRICK,
          fontSize: '0.78rem',
          maxWidth: '360px'
        }}
      >
        <strong>Tile state invalid.</strong> {tileCheck.errors[0]}
      </div>
    );
  }

  const counts = countZones(tiles);
  const summary = resourceSummaryText(tiles, pending, anomaly);
  const frame = pageFrame(240, 52);
  const pendingLine = pendingText(pending);
  const anomalyLine = anomalyText(anomaly);
  const zoneLine = [
    `${counts.available} available`,
    `${counts.committed} committed`,
    `${counts.bound} bound`,
    `${counts.spent} spent`
  ].join(' \u00b7 ');

  const inspect = (target) => {
    if (onInspect) onInspect(target);
  };

  const handleRootKeyDown = (event) => {
    if (event.key === 'Escape' && onInspect) {
      onInspect(null);
    }
  };

  return (
    <div
      className="chaos-weaver-resource-display"
      data-cw-resource-display="true"
      role="group"
      aria-label={`Chaos Weaver tiles. ${summary}`}
      onKeyDown={handleRootKeyDown}
      style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: '360px' }}
    >
      <svg
        className="cw-resource-svg"
        viewBox="0 0 240 52"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', width: '100%', height: 'auto' }}
      >
        <style>{`
          .cw-resource-svg .cw-token:focus { outline: none; }
          .cw-resource-svg .cw-token:focus-visible .cw-focus-ring { opacity: 0.85; }
          .cw-resource-svg .cw-token:hover .cw-focus-ring { opacity: 0.5; }
        `}</style>
        <title>{summary}</title>
        <rect
          x={frame.outer.x}
          y={frame.outer.y}
          width={frame.outer.width}
          height={frame.outer.height}
          rx={frame.outer.rx}
          fill={PAGE}
          stroke={RULE}
          strokeWidth="1"
        />
        <rect
          x={frame.inner.x}
          y={frame.inner.y}
          width={frame.inner.width}
          height={frame.inner.height}
          rx={frame.inner.rx}
          fill="none"
          stroke={RULE}
          strokeWidth="0.6"
          opacity="0.5"
        />

        {ZONE_LANES.map((lane, index) => {
          const lx = 8 + index * 56;
          return (
            <g className={`cw-lane cw-lane-${lane.zone}`} key={lane.zone}>
              <text x={lx} y="11" fontSize="8" fill={lane.zone === 'spent' ? MUTED : INK} letterSpacing="0.2">
                {lane.label}
              </text>
              <line x1={lx} y1="13.5" x2={lx + 50} y2="13.5" stroke={lane.accent} strokeWidth="0.8" />
              <text
                x={lx + 50}
                y="11"
                fontSize="9"
                fontWeight="700"
                textAnchor="end"
                fill={counts[lane.zone] > 0 ? INK : MUTED}
              >
                {counts[lane.zone]}
              </text>
            </g>
          );
        })}

        {CHAOS_WEAVER_TILE_IDS.map((tileId, index) => {
          const cx = TOKEN_SLOT_X[index];
          const zone = zoneOfTile(tiles, tileId);
          const visuals = ZONE_VISUALS[zone] || ZONE_VISUALS.available;
          const symbol = CHAOS_WEAVER_TILE_SYMBOLS[tileId];
          const symbolName = SYMBOL_NAMES[symbol];
          const tokenLabel = `${tileId} \u2014 ${symbolName} \u00b7 ${zone}`;
          const interactive = Boolean(onInspect);
          return (
            <g
              key={tileId}
              className={`cw-token cw-token-${zone}`}
              data-tile-id={tileId}
              data-zone={zone}
              data-symbol={symbol}
              role={interactive ? 'button' : 'img'}
              tabIndex={interactive ? 0 : undefined}
              aria-label={tokenLabel}
              onClick={interactive ? () => inspect(tileId) : undefined}
              onKeyDown={
                interactive
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        inspect(tileId);
                      }
                    }
                  : undefined
              }
              style={{ cursor: interactive ? 'pointer' : 'default' }}
            >
              <title>{tokenLabel}</title>
              <circle className="cw-focus-ring" cx={cx} cy={TOKEN_CY} r="12" fill="none" stroke={INK} strokeWidth="1" opacity="0" />
              <circle cx={cx} cy={TOKEN_CY} r="9.2" fill={visuals.socketFill} stroke={visuals.socketStroke} strokeWidth="1" />
              {visuals.locked && (
                <circle
                  cx={cx}
                  cy={TOKEN_CY}
                  r="11.2"
                  fill="none"
                  stroke={inked(WYRD, 0.2)}
                  strokeWidth="0.9"
                  strokeDasharray="2.4 2"
                />
              )}
              {visuals.hatch && (
                <g stroke={inked(WYRD)} strokeWidth="0.8" strokeLinecap="round" opacity="0.85">
                  <line x1={cx - 6} y1={TOKEN_CY + 4} x2={cx + 4} y2={TOKEN_CY - 6} />
                  <line x1={cx - 2} y1={TOKEN_CY + 7} x2={cx + 7} y2={TOKEN_CY - 2} />
                </g>
              )}
              {symbol === 'S' && (
                <path d={surgePath(cx, TOKEN_CY)} fill="none" stroke={visuals.glyphStroke} strokeWidth="1.4" strokeLinejoin="round" />
              )}
              {symbol === 'M' && (
                <path
                  d={shiftPath(cx, TOKEN_CY)}
                  fill="none"
                  stroke={visuals.glyphStroke}
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {symbol === 'F' && (
                <g fill="none" stroke={visuals.glyphStroke} strokeWidth="1.3" strokeLinejoin="round">
                  <path d={fracturePath(cx, TOKEN_CY)} />
                  <path d={fractureSplit(cx, TOKEN_CY)} strokeWidth="0.9" />
                </g>
              )}
              {visuals.slash && (
                <line
                  x1={cx - 6}
                  y1={TOKEN_CY + 6}
                  x2={cx + 6}
                  y2={TOKEN_CY - 6}
                  stroke={ETCH}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              )}
              <text x={cx} y="43" fontSize="8" textAnchor="middle" fill={visuals.labelFill}>
                {tileId}
              </text>
            </g>
          );
        })}
      </svg>

      <p
        className="cw-zone-line"
        aria-hidden="true"
        style={{ margin: 0, fontSize: '0.85rem', color: INK }}
      >
        {zoneLine}
      </p>
      <p
        className="cw-pending-line"
        aria-hidden="true"
        style={{ margin: 0, fontSize: '0.85rem', color: pending ? INK : MUTED }}
      >
        {pendingLine}
      </p>
      <p
        className="cw-anomaly-line"
        aria-hidden="true"
        style={{ margin: 0, fontSize: '0.85rem', color: anomaly ? BRICK : MUTED }}
      >
        {anomalyLine}
      </p>

      {disabledReason && (
        <p className="cw-disabled-reason" role="status" style={{ margin: 0, color: BRICK, fontSize: '0.8rem' }}>
          {disabledReason}
        </p>
      )}

      <div
        className="cw-inspect-actions"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
      >
        <button
          type="button"
          style={onInspect ? buttonStyle : disabledButtonStyle}
          disabled={!onInspect}
          onClick={() => inspect('tiles')}
        >
          Inspect tiles
        </button>
        <button
          type="button"
          style={onInspect && pending ? buttonStyle : disabledButtonStyle}
          disabled={!onInspect || !pending}
          onClick={() => inspect('pending')}
        >
          Inspect draw
        </button>
        <button
          type="button"
          style={onInspect && anomaly ? buttonStyle : disabledButtonStyle}
          disabled={!onInspect || !anomaly}
          onClick={() => inspect('anomaly')}
        >
          Inspect anomaly
        </button>
      </div>
    </div>
  );
};

export default ChaosWeaverResourceDisplay;
