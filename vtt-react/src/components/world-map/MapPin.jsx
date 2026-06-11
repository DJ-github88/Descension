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
  onDragStart
}) => {
  const isErasing = devMode && devTool === 'erasePin' && isHovered;

  const icon = isErasing
    ? { viewBox: '0 0 24 24', path: 'M9 3v1H4v2h1v13a2 2 0 002 2h10a2 2 0 002-2V6h1V4h-5V3H9zm2 5h2v9h-2V8zm-4 0h2v9H7V8zm8 0h2v9h-2V8z' }
    : (PIN_ICONS[pinType] || PIN_ICONS.custom);

  if (!icon) return null;

  const outerFill = isErasing ? '#2c0c0c' : '#1c120a';
  const outerStroke = isErasing ? '#ff5252' : (isHovered ? '#ffe082' : '#C4A44A');
  const innerStroke = isErasing ? 'rgba(255, 82, 82, 0.4)' : (isHovered ? 'rgba(255, 224, 130, 0.6)' : 'rgba(255, 224, 130, 0.25)');
  const pathFill = isErasing ? '#ff8a80' : (isHovered ? '#ffffff' : '#ebd5a3');

  return (
    <g
      className={`map-pin ${isHovered ? 'hovered' : ''} ${isErasing ? 'erasing' : ''}`}
      transform={`translate(${x}, ${y})`}
      onClick={(e) => {
        if (devMode && devTool === 'erasePin') {
          e.stopPropagation();
          onDeletePin(zoneId, true); // Bypass confirmation!
          return;
        }
        if (devMode && e.shiftKey) return; // Ignore regular clicks during shift-drag
        e.stopPropagation();
        onClick(zoneId);
      }}
      onMouseDown={(e) => {
        if (devMode && e.shiftKey) {
          e.stopPropagation();
          e.preventDefault();
          onDragStart(zoneId);
        }
      }}
      onContextMenu={(e) => {
        if (devMode) {
          e.preventDefault();
          e.stopPropagation();
          onDeletePin(zoneId);
        }
      }}
      onMouseEnter={() => onHover(zoneId)}
      onMouseLeave={() => onLeave()}
      style={{ cursor: devMode ? (devTool === 'erasePin' ? 'pointer' : 'grab') : 'pointer', pointerEvents: 'auto' }}
    >
      {hasDeep && (
        <circle cx="0" cy="16" r="2.5" fill="#C4A44A" opacity="0.8" />
      )}

      <g className="pin-icon-group">
        {/* Outer gold ring */}
        <circle 
          cx="0" 
          cy="0" 
          r="14" 
          fill={outerFill} 
          stroke={outerStroke} 
          strokeWidth="1.5" 
          filter="url(#pinShadow)"
          style={{ transition: 'stroke 0.2s ease, fill 0.2s ease' }}
        />
        {/* Inner fine gold ring */}
        <circle 
          cx="0" 
          cy="0" 
          r="11" 
          fill="none" 
          stroke={innerStroke} 
          strokeWidth="0.75"
          style={{ transition: 'stroke 0.2s ease' }}
        />

        {/* SVG Icon centered & scaled inside */}
        <g transform="translate(-8, -8) scale(0.66)" style={{ pointerEvents: 'none' }}>
          <svg viewBox={icon.viewBox} width="24" height="24">
            <path
              d={icon.path}
              fill={pathFill}
              stroke="rgba(0, 0, 0, 0.6)"
              strokeWidth="0.5"
              style={{ transition: 'fill 0.2s ease' }}
            />
          </svg>
        </g>
      </g>

      {isHovered && (
        <g className="pin-label-group" style={{ pointerEvents: 'none' }}>
          <rect
            x={-name.length * 3.5}
            y="16"
            width={name.length * 7}
            height="20"
            rx="3"
            fill="rgba(44, 24, 16, 0.9)"
            stroke={isErasing ? 'rgba(255, 82, 82, 0.4)' : 'rgba(212, 175, 55, 0.3)'}
            strokeWidth="0.5"
          />
          <text
            x="0"
            y="30"
            textAnchor="middle"
            fill={isErasing ? '#ff8a80' : '#f0e6d2'}
            fontFamily="'Cinzel', serif"
            fontSize="9"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
          >
            {name}
          </text>
        </g>
      )}
    </g>
  );
};

export default MapPin;
