import React from 'react';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { ZONE_DATA } from '../../data/zoneData';
import { DEEP_LOCATIONS } from '../../data/deepLocationData';
import MapPin from './MapPin';

const LocationPins = ({
  activeMapId,
  selectedRegionId,
  setSelectedRegionId,
  setSelectedLocationId,
  setSidebarOpen,
  devMode,
  devTool,
  onDeletePin,
  onDragStart,
  onResolveClick,
  currentCampaign,
  selectedDevPinId,
  onSelectForMove
}) => {
  const [hoveredPin, setHoveredPin] = React.useState(null);

  const handlePinClick = (zoneId) => {
    const coord = LOCATION_COORDINATES[zoneId];
    if (!coord) return;

    let pinName = '';
    let pinRegionId = '';

    const zone = ZONE_DATA.find(z => z.id === zoneId);
    if (zone) {
      pinName = zone.name;
      pinRegionId = zone.regionId;
    } else {
      pinRegionId = coord.regionId;
      if (coord.source === 'campaignLocation') {
        const campLoc = currentCampaign?.campaignData?.locations?.find(l => String(l.id) === String(coord.sourceId));
        pinName = campLoc ? campLoc.name : `Campaign Loc (${coord.sourceId})`;
      } else if (coord.source === 'campaignLore') {
        const campLore = currentCampaign?.campaignData?.homebrew?.lore?.find(l => String(l.id) === String(coord.sourceId));
        pinName = campLore ? campLore.title : `Campaign Lore (${coord.sourceId})`;
      } else if (coord.source === 'custom') {
        pinName = coord.name || 'Custom POI';
      }
    }

    if (onResolveClick) {
      onResolveClick(coord.x, coord.y, {
        type: 'devPin',
        id: zoneId,
        title: pinName,
        action: () => {
          if (pinRegionId) setSelectedRegionId(pinRegionId);
          if (setSelectedLocationId) {
            setSelectedLocationId(zoneId);
          }
          setSidebarOpen(true);
        }
      });
      return;
    }

    if (pinRegionId) setSelectedRegionId(pinRegionId);
    if (setSelectedLocationId) {
      setSelectedLocationId(zoneId);
    }
    setSidebarOpen(true);
  };

  const pins = Object.entries(LOCATION_COORDINATES)
    .map(([pinId, coord]) => {
      const zone = ZONE_DATA.find(z => z.id === pinId);
      let name = '';
      let type = coord.pinType || 'custom';
      let hasDeep = !!DEEP_LOCATIONS[pinId];
      let pinMapId = coord.mapId || 'mythril';
      let pinRegionId = coord.regionId || zone?.regionId;

      if (zone) {
        name = zone.name;
        type = zone.type;
      } else {
        if (coord.source === 'campaignLocation') {
          const campLoc = currentCampaign?.campaignData?.locations?.find(l => String(l.id) === String(coord.sourceId));
          name = campLoc ? campLoc.name : `Campaign Loc (${coord.sourceId})`;
          type = 'settlement';
        } else if (coord.source === 'campaignLore') {
          const campLore = currentCampaign?.campaignData?.homebrew?.lore?.find(l => String(l.id) === String(coord.sourceId));
          name = campLore ? campLore.title : `Campaign Lore (${coord.sourceId})`;
          type = 'wilderness';
        } else if (coord.source === 'custom') {
          name = coord.name || 'Custom POI';
          type = coord.pinType || 'custom';
        } else {
          name = pinId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }
      }

      // MAP FILTERING:
      // When exploring a specific subregion map (e.g. activeMapId === 'nordhalla-glacier-heart'):
      // ONLY render pins scoped to that subregion map!
      // When on master world map (activeMapId === 'mythril' or null):
      // Hide subregion-exclusive pins (mapId !== 'mythril')!
      if (activeMapId && activeMapId !== 'mythril') {
        const matchesSubmap = pinMapId === activeMapId || pinRegionId === activeMapId;
        if (!matchesSubmap) return null;
      } else if (!activeMapId || activeMapId === 'mythril') {
        if (pinMapId && pinMapId !== 'mythril') return null;
      }

      return {
        zoneId: pinId,
        ...coord,
        name,
        type,
        hasDeep
      };
    })
    .filter(Boolean);

  if (pins.length === 0) return null;

  return (
    <g className="location-pins-layer">
      {pins.map((pin) => (
        <MapPin
          key={pin.zoneId}
          x={pin.x}
          y={pin.y}
          pinType={pin.pinType || 'custom'}
          name={pin.name}
          zoneId={pin.zoneId}
          hasDeep={pin.hasDeep}
          isHovered={hoveredPin === pin.zoneId}
          isSelected={!!selectedDevPinId && selectedDevPinId === pin.zoneId}
          onClick={handlePinClick}
          onHover={(id) => setHoveredPin(id)}
          onLeave={() => setHoveredPin(null)}
          devMode={devMode}
          devTool={devTool}
          onDeletePin={onDeletePin}
          onDragStart={onDragStart}
          onSelectForMove={onSelectForMove}
        />
      ))}
    </g>
  );
};

export default LocationPins;
