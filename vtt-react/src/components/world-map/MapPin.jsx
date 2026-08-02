import React from 'react';
import PIN_ICONS from './mapPinIcons';

const MapPin = ({
  x,
  y,
  pinType,
  name,
  zoneId,
  hasDeep,
  onClick,
  onHover,
  onLeave,
  isHovered,
  devMode,
  devTool,
  onDeletePin,
  onDragStart,
  onSelectForMove,
  isSelected
}) => {
  const isErasing = devMode && devTool === 'erasePin' && isHovered;
  const isMoveMode = devMode && devTool === 'movePin';

  const icon = isErasing
    ? { viewBox: '0 0 24 24', path: 'M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zm2 5h2v9h-2V8zm-4 0h2v9H7V8zm8 0h2v9h-2V8z' }
    : (PIN_ICONS[pinType] || PIN_ICONS.custom);

  if (!icon) return null;

  // Pin Theme Palette based on pin type
  const PIN_THEMES = {
    city:       { border: '#F5D061', bg: '#6b1717', path: '#FFF5DC' },
    fortress:   { border: '#F5D061', bg: '#6b1717', path: '#FFF5DC' },
    settlement: { border: '#E6A145', bg: '#4d2d14', path: '#FFE5B4' },
    house:      { border: '#E6A145', bg: '#4d2d14', path: '#FFE5B4' },
    wilderness: { border: '#58D68D', bg: '#163d27', path: '#D4EFDF' },
    tree:       { border: '#58D68D', bg: '#163d27', path: '#D4EFDF' },
    mountain:   { border: '#5DADE2', bg: '#1b3452', path: '#E8F8F5' },
    cave:       { border: '#5DADE2', bg: '#1b3452', path: '#E8F8F5' },
    ruin:       { border: '#BB8FCE', bg: '#391b4d', path: '#F5EEF8' },
    tomb:       { border: '#BB8FCE', bg: '#391b4d', path: '#F5EEF8' },
    camp:       { border: '#F39C12', bg: '#4a2c00', path: '#FDEBD0' },
    custom:     { border: '#F4D03F', bg: '#2a1a0e', path: '#FEF9E7' }
  };

  const theme = isErasing
    ? { border: '#FF5252', bg: '#3D0A0A', path: '#FF8A80' }
    : (PIN_THEMES[pinType] || PIN_THEMES.custom);

  const markerBorder = isSelected || isHovered ? '#FFFFFF' : theme.border;
  const markerFill = theme.bg;
  const glyphFill = isSelected || isHovered ? '#FFFFFF' : theme.path;

  return (
    <g
      className={`map-pin ${isHovered ? 'hovered' : ''} ${isErasing ? 'erasing' : ''} ${isSelected ? 'selected' : ''}`}
      transform={`translate(${x}, ${y})`}
      onClick={(e) => {
        if (devMode && devTool === 'erasePin') {
          e.stopPropagation();
          onDeletePin(zoneId, true);
          return;
        }
        if (isMoveMode) {
          e.stopPropagation();
          if (onSelectForMove) onSelectForMove(zoneId);
          return;
        }
        if (devMode && e.shiftKey) return;
        e.stopPropagation();
        onClick(zoneId);
      }}
      onMouseDown={(e) => {
        if (isMoveMode) {
          e.stopPropagation();
          e.preventDefault();
          if (onSelectForMove) onSelectForMove(zoneId);
          onDragStart(zoneId);
          return;
        }
        if (devMode && e.shiftKey) {
          e.stopPropagation();
          e.preventDefault();
          onDragStart(zoneId);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (devMode) {
          onDeletePin(zoneId);
        }
      }}
      onMouseEnter={() => onHover(zoneId)}
      onMouseLeave={() => onLeave()}
      style={{ cursor: devMode ? (devTool === 'erasePin' ? 'pointer' : 'grab') : 'pointer', pointerEvents: 'auto' }}
    >
      {/* Pulse ring for selected pin */}
      {isSelected && (
        <circle cx="0" cy="-20" r="22" fill="none" stroke="#FFE082" strokeWidth="2" opacity="0.85" className="pin-selected-pulse" />
      )}

      <g className="pin-icon-group" style={{ transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transform: isHovered ? 'scale(1.2) translateY(-3px)' : 'scale(1)' }}>
        {/* Outer Teardrop Pin Shield Path (Tip at 0, 0) */}
        <path
          d="M 0 0 C -12 -12 -14 -28 0 -36 C 14 -28 12 -12 0 0 Z"
          fill={markerFill}
          stroke={markerBorder}
          strokeWidth={isSelected ? 2.5 : 1.8}
          filter="url(#pinShadow)"
          style={{ transition: 'stroke 0.2s ease, fill 0.2s ease' }}
        />

        {/* Inner Gold Bezel Ring */}
        <circle
          cx="0"
          cy="-22"
          r="10"
          fill="none"
          stroke={markerBorder}
          strokeWidth="0.8"
          opacity="0.6"
        />

        {/* SVG Glyph Icon Centered in Upper Head */}
        <g transform="translate(-7, -29) scale(0.58)" style={{ pointerEvents: 'none' }}>
          <svg viewBox={icon.viewBox} width="24" height="24">
            <path
              d={icon.path}
              fill={glyphFill}
              stroke="rgba(0, 0, 0, 0.5)"
              strokeWidth="0.5"
              style={{ transition: 'fill 0.2s ease' }}
            />
          </svg>
        </g>

        {/* Sub-map Badge Indicator */}
        {hasDeep && (
          <g transform="translate(10, -32)">
            <circle cx="0" cy="0" r="5" fill="#1C120A" stroke="#F5D061" strokeWidth="1" />
            <circle cx="0" cy="0" r="2" fill="#F5D061" />
          </g>
        )}
      </g>

      {/* Hover Name Label */}
      {isHovered && name && (
        <g className="pin-label-group" style={{ pointerEvents: 'none' }}>
          <rect
            x={-name.length * 4 - 8}
            y="-52"
            width={name.length * 8 + 16}
            height="22"
            rx="4"
            fill="rgba(18, 11, 6, 0.95)"
            stroke={markerBorder}
            strokeWidth="1"
            filter="url(#pinShadow)"
          />
          <text
            x="0"
            y="-37"
            textAnchor="middle"
            fill="#FFF5DC"
            fontFamily="'Cinzel', serif"
            fontSize="10"
            fontWeight="600"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}
          >
            {name}
          </text>
        </g>
      )}
    </g>
  );
};

export default MapPin;
