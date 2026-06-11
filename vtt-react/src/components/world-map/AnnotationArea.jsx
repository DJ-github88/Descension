import React from 'react';

const AnnotationArea = ({
  area,
  onClick,
  onHover,
  onLeave,
  isHovered
}) => {
  if (!area.points || area.points.length < 3) return null;

  // Calculate polygon centroid for label placement
  const getCentroid = (pts) => {
    let x = 0;
    let y = 0;
    pts.forEach(([px, py]) => {
      x += px;
      y += py;
    });
    return [Math.round(x / pts.length), Math.round(y / pts.length)];
  };

  const [cx, cy] = getCentroid(area.points);
  const pointsStr = area.points.map(([x, y]) => `${x},${y}`).join(' ');

  // Dynamic borders based on status
  // dangerous -> red dashed, safe -> green solid, unexplored -> gray dotted
  const borderStyles = {
    dangerous: { stroke: 'rgba(235, 87, 87, 0.8)', strokeDasharray: '6 4' },
    safe: { stroke: 'rgba(39, 174, 96, 0.8)', strokeDasharray: 'none' },
    unexplored: { stroke: 'rgba(180, 180, 180, 0.8)', strokeDasharray: '2 3' },
    discovered: { stroke: area.color.replace(/[\d.]+\)$/, '0.9)'), strokeDasharray: 'none' }
  };

  const style = borderStyles[area.status] || borderStyles.discovered;

  return (
    <g
      className={`player-drawn-area ${isHovered ? 'hovered' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(area);
      }}
      onMouseEnter={() => onHover(area.id)}
      onMouseLeave={() => onLeave()}
      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
    >
      <polygon
        points={pointsStr}
        fill={area.color}
        stroke={style.stroke}
        strokeWidth={isHovered ? 3.5 : 2}
        strokeDasharray={style.strokeDasharray}
        style={{
          transition: 'stroke-width 0.2s ease, fill-opacity 0.2s ease',
          fillOpacity: isHovered ? 0.35 : 0.2
        }}
      />
      
      {/* Centroid text label */}
      <g transform={`translate(${cx}, ${cy})`} style={{ pointerEvents: 'none' }}>
        <rect
          x={-area.title.length * 3.8}
          y="-10"
          width={area.title.length * 7.6}
          height="16"
          rx="2"
          fill="rgba(20, 20, 20, 0.85)"
          stroke={style.stroke}
          strokeWidth="0.5"
        />
        <text
          x="0"
          y="2"
          textAnchor="middle"
          fill="#f5ebd5"
          fontFamily="'Cinzel', serif"
          fontSize="9"
          fontWeight="normal"
        >
          {area.title}
        </text>
      </g>
    </g>
  );
};

export default AnnotationArea;
