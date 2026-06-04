import React, { useState, useEffect } from 'react';
import useWorldStore from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import useClassLoreStore from '../../store/classLoreStore';
import FactionWebGraph from './FactionWebGraph';
import FactionDetail from './FactionDetail';
import LocationDetail from './LocationDetail';
import ClassLoreDetail from './ClassLoreDetail';
import { TimelineView, MiniCalendar } from './TimelineView';

const VIEWS = {
  DASHBOARD: 'dashboard',
  REGION: 'region',
  LOCATION: 'location',
  FACTION: 'faction',
  FACTION_GRAPH: 'faction_graph',
  CLASS: 'class',
  TIMELINE: 'timeline'
};

const WorldDashboard = () => {
  const { regions, getWorldOverview } = useWorldStore();
  const { factions } = useFactionStore();
  const { getAllClasses, loadClasses, loaded } = useClassLoreStore();

  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedFactionId, setSelectedFactionId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [activeTab, setActiveTab] = useState('regions');

  useEffect(() => {
    if (!loaded) loadClasses();
  }, [loaded, loadClasses]);

  const overview = getWorldOverview();
  const classes = getAllClasses();

  const navigateToLocation = (locId) => {
    setSelectedLocationId(locId);
    setView(VIEWS.LOCATION);
  };

  const navigateToFaction = (facId) => {
    setSelectedFactionId(facId);
    setView(VIEWS.FACTION);
  };

  const navigateToClass = (clsId) => {
    setSelectedClassId(clsId);
    setView(VIEWS.CLASS);
  };

  const navigateToRegion = (regionId) => {
    setSelectedRegionId(regionId);
    setView(VIEWS.REGION);
  };

  const navigateToGraph = () => setView(VIEWS.FACTION_GRAPH);
  const navigateToTimeline = () => setView(VIEWS.TIMELINE);
  const navigateToDashboard = () => {
    setView(VIEWS.DASHBOARD);
    setSelectedRegionId(null);
    setSelectedLocationId(null);
    setSelectedFactionId(null);
    setSelectedClassId(null);
  };

  // --- Detail Views ---
  if (view === VIEWS.LOCATION && selectedLocationId) {
    return (
      <LocationDetail
        locationId={selectedLocationId}
        onBack={navigateToDashboard}
        onClassClick={navigateToClass}
        onFactionClick={navigateToFaction}
      />
    );
  }

  if (view === VIEWS.FACTION && selectedFactionId) {
    return <FactionDetail factionId={selectedFactionId} onBack={navigateToDashboard} />;
  }

  if (view === VIEWS.CLASS && selectedClassId) {
    return <ClassLoreDetail classId={selectedClassId} onClose={navigateToDashboard} />;
  }

  if (view === VIEWS.TIMELINE) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={navigateToDashboard}>← Dashboard</button>
          <h2>World Timeline</h2>
        </div>
        <TimelineView />
      </div>
    );
  }

  if (view === VIEWS.FACTION_GRAPH) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={navigateToDashboard}>← Dashboard</button>
          <h2>Faction Relationship Web</h2>
        </div>
        <FactionWebGraph
          onFactionClick={navigateToFaction}
          selectedFactionId={selectedFactionId}
        />
      </div>
    );
  }

  // --- Dashboard View ---
  return (
    <div className="world-panel world-dashboard">
      <div className="world-panel-header">
        <h1>Mythrill</h1>
        <span className="world-subtitle">World-Building Dashboard</span>
      </div>

      <div className="world-tabs">
        {[
          { key: 'regions', label: `Regions (${regions.length})` },
          { key: 'factions', label: `Factions (${factions.length})` },
          { key: 'classes', label: `Classes (${classes.length})` },
          { key: 'quicklinks', label: 'Quick Links' }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`world-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="world-tab-content">
        {activeTab === 'regions' && (
          <div className="world-region-grid">
            {overview.map((region) => (
              <div
                key={region.id}
                className="world-region-card"
                onClick={() => navigateToRegion(region.id)}
              >
                <div className="world-region-card-header">
                  <h3>{region.name}</h3>
                  <span className={`world-badge world-badge-${region.dangerLevel}`}>
                    {region.dangerLevel}
                  </span>
                </div>
                <p className="world-region-desc">{region.description}</p>
                <div className="world-region-stats">
                  <span>{region.locationCount} locations</span>
                  <span>{region.factionCount} factions</span>
                </div>
                {region.locations.length > 0 && (
                  <div className="world-region-locations">
                    {region.locations.map((loc) => (
                      <button
                        key={loc.id}
                        className="world-location-chip"
                        onClick={(e) => { e.stopPropagation(); navigateToLocation(loc.id); }}
                      >
                        <span className={`world-loc-type-dot world-loc-${loc.type}`} />
                        {loc.name}
                      </button>
                    ))}
                    {region.locationCount > 3 && (
                      <span className="world-muted">+{region.locationCount - 3} more...</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'factions' && (
          <div>
            <div className="world-section-actions">
              <button className="world-action-btn" onClick={navigateToGraph}>
                <i className="fas fa-project-diagram" /> View Relationship Web
              </button>
            </div>
            <div className="world-card-grid">
              {factions.map((faction) => (
                <div
                  key={faction.id}
                  className="world-info-card world-clickable"
                  onClick={() => navigateToFaction(faction.id)}
                >
                  <div className="world-faction-colors" style={{
                    background: `linear-gradient(135deg, ${faction.colors?.primary || '#555'}, ${faction.colors?.secondary || '#888'})`,
                    width: '100%', height: '6px', borderRadius: '3px 3px 0 0'
                  }} />
                  <h4>{faction.name}</h4>
                  <span className="world-badge">{faction.type?.replace(/_/g, ' ')}</span>
                  <p className="world-card-meta">{faction.publicGoal?.slice(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="world-card-grid">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="world-info-card world-clickable"
                onClick={() => navigateToClass(cls.id)}
              >
                <h4>{cls.name}</h4>
                <p className="world-card-meta">
                  {cls.originStory?.slice(0, 120)}...
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'quicklinks' && (
          <div className="world-quick-links">
            <button className="world-quick-link" onClick={navigateToGraph}>
              <i className="fas fa-project-diagram" />
              <span>Faction Relationship Web</span>
              <small>Interactive graph of all faction alliances, rivalries, and secret pacts</small>
            </button>
            <button className="world-quick-link" onClick={navigateToTimeline}>
              <i className="fas fa-history" />
              <span>World Timeline</span>
              <small>Chronological history from the Deepening to the present age</small>
            </button>
            <MiniCalendar />
          </div>
        )}
      </div>
    </div>
  );
};

export default WorldDashboard;
