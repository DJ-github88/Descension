import React, { useState } from 'react';
import useMapAnnotationStore from '../../store/mapAnnotationStore';
import AnnotationPin from './AnnotationPin';
import AnnotationArea from './AnnotationArea';

const PlayerAnnotationsLayer = ({
  onPinClick,
  onAreaClick,
  canDrag,
  onDragStart,
  onDeletePin,
  onResolveClick
}) => {
  const { pins, areas } = useMapAnnotationStore();
  const [hoveredPinId, setHoveredPinId] = useState(null);
  const [hoveredAreaId, setHoveredAreaId] = useState(null);

  const handlePinClick = (pin) => {
    if (onResolveClick) {
      onResolveClick(pin.x, pin.y, {
        type: 'playerPin',
        id: pin.id,
        title: pin.title,
        pin: pin,
        action: () => onPinClick(pin)
      });
      return;
    }
    onPinClick(pin);
  };

  const handleAreaClick = (area) => {
    if (!area.points || area.points.length === 0) return;
    let x = 0;
    let y = 0;
    area.points.forEach(([px, py]) => {
      x += px;
      y += py;
    });
    const cx = Math.round(x / area.points.length);
    const cy = Math.round(y / area.points.length);

    if (onResolveClick) {
      onResolveClick(cx, cy, {
        type: 'playerArea',
        id: area.id,
        title: area.title,
        area: area,
        action: () => onAreaClick(area)
      });
      return;
    }
    onAreaClick(area);
  };

  return (
    <g className="player-annotations-layer">
      {/* 1. Draw Player Areas (bottom layer) */}
      <g className="player-areas-sublayer">
        {areas.map((area) => (
          <AnnotationArea
            key={area.id}
            area={area}
            onClick={handleAreaClick}
            onHover={setHoveredAreaId}
            onLeave={() => setHoveredAreaId(null)}
            isHovered={hoveredAreaId === area.id}
          />
        ))}
      </g>

      {/* 2. Draw Player Pins (top layer) */}
      <g className="player-pins-sublayer">
        {pins.map((pin) => (
          <AnnotationPin
            key={pin.id}
            pin={pin}
            onClick={handlePinClick}
            onHover={setHoveredPinId}
            onLeave={() => setHoveredPinId(null)}
            isHovered={hoveredPinId === pin.id}
            canDrag={canDrag}
            onDragStart={onDragStart}
            onDelete={onDeletePin}
          />
        ))}
      </g>
    </g>
  );
};

export default PlayerAnnotationsLayer;
