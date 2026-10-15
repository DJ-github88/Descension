import React, { useState, useMemo } from 'react';
import { EXPLORATION_RULES } from '../../data/explorationRules';
import './LocationExpeditionLedger.css';

/**
 * Calm TTRPG Expedition Route Ledger & Navigation HUD
 * Displays live travel distance, pace, estimated duration, and regional survival rules.
 */
const LocationExpeditionLedger = ({
  waypoints = [],
  currentMap,
  isGM,
  onClearRoute,
  onToggleRouteMode,
  isDrawingRoute,
  mapScaleMiles = 2.5 // Estimated miles per % of map distance
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [travelPace, setTravelPace] = useState('normal'); // 'cautious' | 'normal' | 'forced'

  // Calculate total route distance in miles and leagues
  const routeStats = useMemo(() => {
    if (waypoints.length < 2) {
      return { totalMiles: 0, totalLeagues: 0, days: 0, hours: 0 };
    }

    let miles = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      const w1 = waypoints[i];
      const w2 = waypoints[i + 1];
      const dx = w2.x - w1.x;
      const dy = w2.y - w1.y;
      const pctDist = Math.hypot(dx, dy);
      miles += pctDist * mapScaleMiles;
    }

    const totalMiles = Math.round(miles * 10) / 10;
    const totalLeagues = Math.round((totalMiles / 3) * 10) / 10; // 1 league = 3 miles

    // Speed in miles per day
    const speedMilesPerDay = travelPace === 'cautious' ? 15 : travelPace === 'forced' ? 32 : 24;
    const totalDays = totalMiles / speedMilesPerDay;
    const fullDays = Math.floor(totalDays);
    const remainingHours = Math.round((totalDays - fullDays) * 8); // 8 travel hours per day

    return {
      totalMiles,
      totalLeagues,
      days: fullDays,
      hours: remainingHours
    };
  }, [waypoints, mapScaleMiles, travelPace]);

  // Find relevant regional exploration rules from explorationRules.js
  const regionalRule = useMemo(() => {
    if (!currentMap) return null;
    const mapId = currentMap.id || '';
    const mapName = (currentMap.name || '').toLowerCase();

    if (mapId.includes('sundrift') || mapName.includes('sundrift') || mapId === 'map-mythril-world') {
      return EXPLORATION_RULES.sundrift_vale;
    }
    if (mapId.includes('frostwood') || mapName.includes('frostwood')) {
      return EXPLORATION_RULES.frostwood_reach;
    }
    return EXPLORATION_RULES.sundrift_vale;
  }, [currentMap]);

  if (waypoints.length === 0 && !isDrawingRoute) return null;

  return (
    <aside
      className={`calm-expedition-ledger ${isCollapsed ? 'is-collapsed' : ''}`}
      onClick={(e) => e.stopPropagation()}
      aria-label="Expedition Route Ledger"
    >
      <div className="ledger-leather-spine" />

      {/* Header */}
      <div className="ledger-header">
        <div className="ledger-title-group">
          <i className="fas fa-compass ledger-compass-icon"></i>
          <div className="ledger-titles">
            <span className="ledger-sub-title">EXPEDITION TRAIL &amp; MARCH</span>
            <h4 className="ledger-main-title">{currentMap?.name || 'Atlas Journey'}</h4>
          </div>
        </div>

        <button
          type="button"
          className="ledger-toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Expand Expedition Ledger" : "Collapse Expedition Ledger"}
        >
          <i className={`fas ${isCollapsed ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </button>
      </div>

      {!isCollapsed && (
        <div className="ledger-content">
          {/* Waypoints count & drawing status */}
          <div className="ledger-status-row">
            <span className="ledger-status-pill">
              <i className="fas fa-map-pin"></i> {waypoints.length} {waypoints.length === 1 ? 'Encampment' : 'Encampments'}
            </span>
            {isDrawingRoute && (
              <span className="ledger-status-pill drawing">
                <i className="fas fa-pen-nib"></i> Plotting Route Active
              </span>
            )}
          </div>

          {/* Distance and Estimated Time */}
          {waypoints.length > 1 ? (
            <div className="ledger-metrics-grid">
              <div className="ledger-metric-box">
                <span className="metric-label">Route Distance</span>
                <span className="metric-value">{routeStats.totalLeagues} <small>Leagues</small></span>
                <span className="metric-sub">~{routeStats.totalMiles} Miles</span>
              </div>
              <div className="ledger-metric-box">
                <span className="metric-label">Estimated March</span>
                <span className="metric-value">
                  {routeStats.days}d {routeStats.hours > 0 ? `${routeStats.hours}h` : ''}
                </span>
                <span className="metric-sub">8 hrs / day</span>
              </div>
            </div>
          ) : (
            <div className="ledger-notice-box">
              <p>Add at least two waypoints or landmarks to plot an expedition march and calculate travel time.</p>
            </div>
          )}

          {/* Travel Pace Selector */}
          <div className="ledger-pace-section">
            <span className="ledger-section-label">Travel Pace:</span>
            <div className="ledger-pace-buttons">
              <button
                type="button"
                className={`pace-btn ${travelPace === 'cautious' ? 'active' : ''}`}
                onClick={() => setTravelPace('cautious')}
                title="15 mi/day. Advantage on navigation and stealth checks; characters can forage."
              >
                Cautious
              </button>
              <button
                type="button"
                className={`pace-btn ${travelPace === 'normal' ? 'active' : ''}`}
                onClick={() => setTravelPace('normal')}
                title="24 mi/day. Standard marching pace under normal weather."
              >
                Normal
              </button>
              <button
                type="button"
                className={`pace-btn ${travelPace === 'forced' ? 'active' : ''}`}
                onClick={() => setTravelPace('forced')}
                title="32 mi/day. Forced march; requires hourly Constitution saves against exhaustion."
              >
                Forced
              </button>
            </div>
          </div>

          {/* Regional Travel Mechanics Advisory */}
          {regionalRule && (
            <div className="ledger-regional-advisory">
              <div className="advisory-header">
                <i className="fas fa-scroll"></i>
                <span>{regionalRule.name}</span>
              </div>
              <p className="advisory-text">
                {regionalRule.rules?.[0]?.description || regionalRule.description}
              </p>
            </div>
          )}

          {/* Ledger Controls */}
          {isGM && waypoints.length > 0 && (
            <div className="ledger-actions-row">
              <button
                type="button"
                className="ledger-action-btn clear"
                onClick={onClearRoute}
                title="Clear all waypoints on this map"
              >
                <i className="fas fa-eraser"></i> Clear Trail
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default LocationExpeditionLedger;
