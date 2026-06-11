import React from 'react';
import { REGION_POLYGONS } from '../../data/regionPolygons';
import useWorldStore from '../../store/worldStore';
import './RegionOverlay.css';

const pointInPolygon = (x, y, polygon) => {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

const RegionOverlay = ({
  selectedRegionId,
  hoveredRegionId,
  setSelectedRegionId,
  setSidebarOpen,
  setHoveredRegionId,
  setSelectedLocationId,
  devMode,
  getImageCoords,
  onResolveClick
}) => {
  const { lockedRegions } = useWorldStore();

  const handleRegionClick = (regionId) => {
    setSelectedRegionId(regionId);
    if (setSelectedLocationId) {
      setSelectedLocationId(null);
    }
    setSidebarOpen(true);
  };

  const getPolygonPoints = (points) => {
    if (!points || points.length === 0) return '';
    return points.map(([x, y]) => `${x},${y}`).join(' ');
  };

  const getCenter = (points) => {
    if (!points || points.length === 0) return [2048, 1536];
    const sum = points.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0]);
    return [sum[0] / points.length, sum[1] / points.length];
  };

  const regionsWithPolygons = Object.values(REGION_POLYGONS).filter(
    r => r.points && r.points.length >= 3
  );

  if (regionsWithPolygons.length === 0) {
    return null;
  }

  return (
    <g className="region-overlay">
      {regionsWithPolygons.map((region) => {
        const isSelected = selectedRegionId === region.id;
        const isHovered = hoveredRegionId === region.id;
        const isLocked = lockedRegions?.includes(region.id);
        const center = getCenter(region.points);
        const displayName = isLocked ? `🔒 ${region.name}` : region.name;

        return (
          <g key={region.id}>
            <polygon
              points={getPolygonPoints(region.points)}
              className={`region-polygon ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''} ${isLocked ? 'locked' : ''}`}
              data-region-id={region.id}
              fill={region.color}
              stroke={region.glowColor || region.color}
              onClick={(e) => {
                e.stopPropagation();
                if (getImageCoords && onResolveClick) {
                  const coords = getImageCoords(e);
                  if (coords) {
                    onResolveClick(coords[0], coords[1], {
                      type: 'region',
                      id: region.id,
                      title: region.name,
                      action: () => handleRegionClick(region.id)
                    });
                    return;
                  }
                }
                handleRegionClick(region.id);
              }}
              onMouseEnter={() => setHoveredRegionId(region.id)}
              onMouseLeave={() => setHoveredRegionId(null)}
              style={{ cursor: devMode ? 'default' : 'pointer', pointerEvents: devMode ? 'none' : 'auto' }}
            />

            {isHovered && !isSelected && (
              <g className="region-label-group" style={{ pointerEvents: 'none' }}>
                <rect
                  x={center[0] - 80}
                  y={center[1] - 18}
                  width={160}
                  height={36}
                  rx={4}
                  fill="rgba(44, 24, 16, 0.9)"
                  stroke="rgba(212, 175, 55, 0.4)"
                  strokeWidth={1}
                />
                <text
                  x={center[0]}
                  y={center[1] + 5}
                  textAnchor="middle"
                  fill="#f0e6d2"
                  fontFamily="'Cinzel', serif"
                  fontSize="14"
                  style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                  {displayName}
                </text>
              </g>
            )}

            {isSelected && (
              <g className="region-label-group permanent" style={{ pointerEvents: 'none' }}>
                <rect
                  x={center[0] - 80}
                  y={center[1] - 18}
                  width={160}
                  height={36}
                  rx={4}
                  fill="rgba(44, 24, 16, 0.95)"
                  stroke="rgba(196, 164, 74, 0.6)"
                  strokeWidth={2}
                />
                <text
                  x={center[0]}
                  y={center[1] + 5}
                  textAnchor="middle"
                  fill="#C4A44A"
                  fontFamily="'Cinzel', serif"
                  fontSize="14"
                  fontWeight="600"
                  style={{
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
                  }}
                >
                  {displayName}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </g>
  );
};

export { pointInPolygon };
export default RegionOverlay;
