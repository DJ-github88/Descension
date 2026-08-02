import React from 'react';
import PIN_ICONS from './mapPinIcons';
import { confirmDialog } from './MapNotify';

const AnnotationPin = ({
  pin,
  onClick,
  onHover,
  onLeave,
  isHovered,
  canDrag,
  onDragStart,
  onDelete
}) => {
  const icon = PIN_ICONS[pin.pinType] || PIN_ICONS.custom;
  if (!icon) return null;

  const isShared = pin.visibility !== 'private';

  return (
    <g
      className={`map-pin player-pin ${isHovered ? 'hovered' : ''} ${isShared ? 'shared-pin' : ''}`}
      transform={`translate(${pin.x}, ${pin.y})`}
      onClick={(e) => {
        if (canDrag && e.shiftKey) return;
        e.stopPropagation();
        onClick(pin);
      }}
      onMouseDown={(e) => {
        if (canDrag && e.shiftKey) {
          e.stopPropagation();
          e.preventDefault();
          onDragStart(pin.id);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onDelete) {
          confirmDialog(`Delete personal marker "${pin.title}"?`, () => {
            onDelete(pin.id);
          });
        }
      }}
      onMouseEnter={() => onHover(pin.id)}
      onMouseLeave={() => onLeave()}
      style={{ cursor: canDrag ? 'grab' : 'pointer', pointerEvents: 'auto' }}
    >
      <g className="pin-icon-group" style={{ transition: 'transform 0.2s ease', transform: isHovered ? 'scale(1.2) translateY(-3px)' : 'scale(1)' }}>
        {/* Teardrop Marker Outer Shield */}
        <path
          d="M 0 0 C -12 -12 -14 -28 0 -36 C 14 -28 12 -12 0 0 Z"
          fill="#1c3d47"
          stroke={isShared ? '#64B5F6' : '#FFE082'}
          strokeWidth="1.8"
          filter="url(#pinShadow)"
        />

        <circle cx="0" cy="-22" r="10" fill="none" stroke="#FFE082" strokeWidth="0.8" opacity="0.6" />

        {/* SVG Icon centered inside */}
        <g transform="translate(-7, -29) scale(0.58)" style={{ pointerEvents: 'none' }}>
          <svg viewBox={icon.viewBox} width="24" height="24">
            <path d={icon.path} fill="#FFE082" stroke="rgba(0, 0, 0, 0.5)" strokeWidth="0.5" />
          </svg>
        </g>
      </g>

      {isHovered && (
        <g className="pin-label-group" style={{ pointerEvents: 'none' }}>
          <rect
            x={-pin.title.length * 4 - 8}
            y="-52"
            width={Math.max(pin.title.length * 8 + 16, 60)}
            height="22"
            rx="4"
            fill="rgba(18, 28, 36, 0.95)"
            stroke="#FFE082"
            strokeWidth="1"
            filter="url(#pinShadow)"
          />
          <text
            x="0"
            y="-37"
            textAnchor="middle"
            fill="#FFE082"
            fontFamily="'Cinzel', serif"
            fontSize="10"
            fontWeight="bold"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.9)' }}
          >
            {pin.title}
          </text>
        </g>
      )}
    </g>
  );
};

export default AnnotationPin;
