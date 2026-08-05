import React, { useMemo } from 'react';
import { REGION_POLYGONS } from '../../data/regionPolygons';
import { SUBREGIONS } from '../../data/subregions';
import { BUILTIN_SUBREGION_MAPS } from '../../data/subregionMaps';
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
  activeMapId = 'mythril',
  selectedRegionId,
  hoveredRegionId,
  setSelectedRegionId,
  setSidebarOpen,
  setHoveredRegionId,
  setSelectedLocationId,
  devMode,
  devTool,
  getImageCoords,
  onResolveClick,
  onEnterSubregionMap
}) => {
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

  const regionsWithPolygons = useMemo(() => {
    // When viewing a regional map (e.g. 'nordhalla'), show its child subregion polygons
    if (activeMapId !== 'mythril' && !(devMode && devTool === 'drawRegion')) {
      const regionalMapEntry = BUILTIN_SUBREGION_MAPS[activeMapId];
      if (regionalMapEntry?.subregions) {
        return regionalMapEntry.subregions.map(sub => ({
          id: sub.id,
          name: sub.name,
          points: sub.points,
          color: sub.color || 'rgba(70, 150, 220, 0.18)',
          glowColor: sub.glowColor || 'rgba(120, 200, 255, 0.75)',
          labelPosition: sub.labelPosition || [],
          isSubregion: true,
          isRegionalSubregion: true,
          parentRegionId: activeMapId
        }));
      }
      return [];
    }

    const map = {};
    Object.values(REGION_POLYGONS).forEach(r => {
      if (r.points && r.points.length >= 3 && !SUBREGIONS[r.id]) {
        map[r.id] = { ...r, isSubregion: false };
      }
    });

    Object.values(SUBREGIONS).forEach(s => {
      if (s.points && s.points.length >= 3) {
        // Strict rule: subregions ONLY become visible when main region (s.regionId) or subregion (s.id) is selected, or in drawRegion devMode.
        const parentSelected = selectedRegionId === s.regionId;
        const subSelected = selectedRegionId === s.id;

        if (parentSelected || subSelected || (devMode && devTool === 'drawRegion')) {
          map[s.id] = {
            id: s.id,
            name: s.name,
            points: s.points,
            color: 'rgba(70, 150, 220, 0.18)',
            glowColor: 'rgba(120, 200, 255, 0.75)',
            labelPosition: s.labelPosition || [],
            isSubregion: true,
            parentRegionId: s.regionId
          };
        }
      }
    });

    return Object.values(map);
  }, [activeMapId, selectedRegionId, hoveredRegionId, devMode, devTool]);

  if (regionsWithPolygons.length === 0) {
    return null;
  }

  return (
    <g className="region-overlay">
      {regionsWithPolygons.map((region) => {
        const isSelected = selectedRegionId === region.id;
        const isHovered = hoveredRegionId === region.id;
        const center = (region.labelPosition && region.labelPosition.length === 2 && region.labelPosition[0] > 0)
          ? region.labelPosition
          : getCenter(region.points);
        const displayName = region.name;
        const isSubregion = region.isSubregion;

        return (
          <g key={region.id} style={{ pointerEvents: 'auto' }}>
            <polygon
              points={getPolygonPoints(region.points)}
              className={isSubregion ? `subregion-polygon ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}` : `region-polygon ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
              data-region-id={region.id}
              fill={isSubregion ? 'transparent' : (isSelected ? 'transparent' : (region.color || 'rgba(107, 26, 26, 0.15)'))}
              stroke={
                isSubregion
                  ? 'rgba(212, 175, 55, 0.75)'
                  : isSelected
                  ? 'rgba(120, 200, 255, 0.22)'
                  : isHovered
                  ? (region.glowColor || 'rgba(120, 200, 255, 0.85)')
                  : (region.glowColor || 'rgba(120, 200, 255, 0.45)')
              }
              strokeWidth={isSubregion ? (isSelected ? 3 : isHovered ? 2.5 : 2) : (isSelected ? 1.5 : isHovered ? 2.5 : 1.8)}
              onClick={(e) => {
                e.stopPropagation();
                // If this is a subregion polygon on a regional map, enter the subregion map directly
                if (region.isRegionalSubregion && onEnterSubregionMap) {
                  onEnterSubregionMap(region.id);
                  return;
                }
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
              style={{ cursor: 'pointer', pointerEvents: (devMode && devTool === 'drawRegion') ? 'none' : 'all' }}
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
