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
      {/* Outer gold glow ring for player annotations */}
      <circle cx="0" cy="0" r="14" fill="none" stroke="#ffe082" strokeWidth="1" opacity="0.6" strokeDasharray="3 2" />

      {/* Linked Quest indicator dot */}
      {pin.zoneId && (
        <circle cx="0" cy="16" r="3" fill="#ffe082" stroke="#2c1810" strokeWidth="0.5" />
      )}

      <g className="pin-icon-group">
        <svg
          viewBox={icon.viewBox}
          width="24"
          height="24"
          x="-12"
          y="-12"
        >
          {/* Custom fill color for player pins (warm teal/antique turquoise to differentiate from standard brown) */}
          <path
            d={icon.path}
            fill="#3b7a8c"
            stroke="#e0cfa5"
            strokeWidth="0.75"
          />
        </svg>
      </g>

      {isHovered && (
        <g className="pin-label-group" style={{ pointerEvents: 'none' }}>
          <rect
            x={-pin.title.length * 4.2}
            y="18"
            width={Math.max(pin.title.length * 8.4, 60)}
            height="20"
            rx="3"
            fill="rgba(20, 30, 40, 0.95)"
            stroke="#ffe082"
            strokeWidth="0.75"
          />
          <text
            x="0"
            y="32"
            textAnchor="middle"
            fill="#ffe082"
            fontFamily="'Cinzel', serif"
            fontSize="10"
            fontWeight="bold"
            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)' }}
          >
            {pin.title}
          </text>
        </g>
      )}
    </g>
  );
};

export default AnnotationPin;
