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
    ? { viewBox: '0 0 24 24', path: 'M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zm2 5h2v9h-2V8zm-4 0h2v9H7V8zm8 0h2v9H7V8z' }
    : (PIN_ICONS[pinType] || PIN_ICONS.custom);

  if (!icon) return null;

  // Pin Theme Palette based on pin type
  const PIN_THEMES = {
    city:       { border: '#F5D061', bg: 'url(#pinGradCity)', path: '#FFF5DC' },
    fortress:   { border: '#FF6B6B', bg: 'url(#pinGradFort)', path: '#FFEBEB' },
    settlement: { border: '#FFA94D', bg: 'url(#pinGradVillage)', path: '#FFF4E6' },
    house:      { border: '#FFA94D', bg: 'url(#pinGradVillage)', path: '#FFF4E6' },
    tower:      { border: '#FFD43B', bg: 'url(#pinGradTower)', path: '#FFF9DB' },
    mountain:   { border: '#74C0FC', bg: 'url(#pinGradMountain)', path: '#E7F5FF' },
    forest:     { border: '#69DB7C', bg: 'url(#pinGradForest)', path: '#E6FCF5' },
    tree:       { border: '#69DB7C', bg: 'url(#pinGradForest)', path: '#E6FCF5' },
    wilderness: { border: '#69DB7C', bg: 'url(#pinGradForest)', path: '#E6FCF5' },
    cave:       { border: '#DA77F2', bg: 'url(#pinGradCave)', path: '#F8F0FC' },
    poi:        { border: '#FFD43B', bg: 'url(#pinGradPoi)', path: '#FFF9DB' },
    door:       { border: '#FFD43B', bg: 'url(#pinGradPoi)', path: '#FFF9DB' },
    harbor:     { border: '#4DABF7', bg: 'url(#pinGradHarbor)', path: '#E7F5FF' },
    port:       { border: '#4DABF7', bg: 'url(#pinGradHarbor)', path: '#E7F5FF' },
    ruin:       { border: '#B197FC', bg: 'url(#pinGradRuin)', path: '#F3F0FF' },
    tomb:       { border: '#CED4DA', bg: 'url(#pinGradTomb)', path: '#F8F9FA' },
    camp:       { border: '#FF922B', bg: 'url(#pinGradCamp)', path: '#FFF4E6' },
    shrine:     { border: '#20C997', bg: 'url(#pinGradShrine)', path: '#E6FCF5' },
    magic:      { border: '#E599F7', bg: 'url(#pinGradMagic)', path: '#F8F0FC' },
    beast:      { border: '#FF6B6B', bg: 'url(#pinGradBeast)', path: '#FFEBEB' },
    water:      { border: '#38D9A9', bg: '#0b2b42', path: '#E6FCF5' },
    industrial: { border: '#F76707', bg: 'url(#pinGradCamp)', path: '#FFF4E6' },
    submap:     { border: '#FFD43B', bg: 'url(#pinGradPoi)', path: '#FFF9DB' },
    custom:     { border: '#FFD43B', bg: 'url(#pinGradPoi)', path: '#FFF9DB' }
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
      <defs>
        {/* Radial Gradients for rich parchment/map contrast */}
        <radialGradient id="pinGradCity" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#a82323" />
          <stop offset="100%" stopColor="#4a0e0e" />
        </radialGradient>
        <radialGradient id="pinGradFort" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#b83232" />
          <stop offset="100%" stopColor="#400b0b" />
        </radialGradient>
        <radialGradient id="pinGradVillage" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#b86214" />
          <stop offset="100%" stopColor="#472305" />
        </radialGradient>
        <radialGradient id="pinGradTower" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#8a5d0a" />
          <stop offset="100%" stopColor="#3d2600" />
        </radialGradient>
        <radialGradient id="pinGradMountain" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#205082" />
          <stop offset="100%" stopColor="#0b1e33" />
        </radialGradient>
        <radialGradient id="pinGradForest" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#1e6b3e" />
          <stop offset="100%" stopColor="#092916" />
        </radialGradient>
        <radialGradient id="pinGradCave" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#552273" />
          <stop offset="100%" stopColor="#1e0a2b" />
        </radialGradient>
        <radialGradient id="pinGradPoi" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6e570a" />
          <stop offset="100%" stopColor="#2b2102" />
        </radialGradient>
        <radialGradient id="pinGradHarbor" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#12517d" />
          <stop offset="100%" stopColor="#061c2c" />
        </radialGradient>
        <radialGradient id="pinGradRuin" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4d2f69" />
          <stop offset="100%" stopColor="#1b0e29" />
        </radialGradient>
        <radialGradient id="pinGradTomb" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#435259" />
          <stop offset="100%" stopColor="#171f24" />
        </radialGradient>
        <radialGradient id="pinGradCamp" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#964b00" />
          <stop offset="100%" stopColor="#3d1d00" />
        </radialGradient>
        <radialGradient id="pinGradShrine" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#126b52" />
          <stop offset="100%" stopColor="#05291f" />
        </radialGradient>
        <radialGradient id="pinGradMagic" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#6d2b78" />
          <stop offset="100%" stopColor="#28082e" />
        </radialGradient>
        <radialGradient id="pinGradBeast" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#871c1c" />
          <stop offset="100%" stopColor="#330707" />
        </radialGradient>

        <filter id="pinShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000000" floodOpacity="0.65" />
        </filter>
      </defs>

      {/* Pulse ring for selected pin */}
      {isSelected && (
        <circle cx="0" cy="-22" r="24" fill="none" stroke="#FFE082" strokeWidth="2.5" opacity="0.9" className="pin-selected-pulse" />
      )}

      <g className="pin-icon-group" style={{ transition: 'transform 0.22s cubic-bezier(0.175, 0.885, 0.32, 1.275)', transform: isHovered ? 'scale(1.22) translateY(-4px)' : 'scale(1)' }}>
        {/* Outer Teardrop Pin Shield Path (Tip at 0, 0) */}
        <path
          d="M 0 0 C -13 -13 -15 -30 0 -38 C 15 -30 13 -13 0 0 Z"
          fill={markerFill}
          stroke={markerBorder}
          strokeWidth={isSelected ? 2.8 : 2}
          filter="url(#pinShadow)"
          style={{ transition: 'stroke 0.2s ease, fill 0.2s ease' }}
        />

        {/* Inner Gold Bezel Ring */}
        <circle
          cx="0"
          cy="-23"
          r="11"
          fill="none"
          stroke={markerBorder}
          strokeWidth="1"
          opacity="0.75"
        />

        {/* SVG Glyph Icon Centered in Upper Head */}
        <g transform="translate(-8, -31) scale(0.66)" style={{ pointerEvents: 'none' }}>
          <svg viewBox={icon.viewBox} width="24" height="24">
            <path
              d={icon.path}
              fill={glyphFill}
              stroke="rgba(0, 0, 0, 0.65)"
              strokeWidth="0.6"
              style={{ transition: 'fill 0.2s ease' }}
            />
          </svg>
        </g>

        {/* Sub-map / Deep Lore Badge Indicator */}
        {hasDeep && (
          <g transform="translate(11, -34)">
            <circle cx="0" cy="0" r="5.5" fill="#1C120A" stroke="#F5D061" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="2.5" fill="#FFE082" />
          </g>
        )}
      </g>

      {/* Hover Name Label */}
      {isHovered && name && (
        <g className="pin-label-group" style={{ pointerEvents: 'none' }}>
          <rect
            x={-name.length * 4.2 - 10}
            y="-56"
            width={name.length * 8.4 + 20}
            height="24"
            rx="5"
            fill="rgba(18, 11, 6, 0.96)"
            stroke={markerBorder}
            strokeWidth="1.2"
            filter="url(#pinShadow)"
          />
          <text
            x="0"
            y="-40"
            textAnchor="middle"
            fill="#FFF5DC"
            fontFamily="'Cinzel', serif"
            fontSize="11"
            fontWeight="700"
            style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.95)' }}
          >
            {name}
          </text>
        </g>
      )}
    </g>
  );
};

export default MapPin;
