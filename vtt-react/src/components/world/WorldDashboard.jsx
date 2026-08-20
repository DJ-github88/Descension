import React, { useState, useEffect } from 'react';
import useWorldStore from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import useClassLoreStore from '../../store/classLoreStore';
import useCustomLineageStore from '../../store/customLineageStore';
import { getClassFlavorProfile } from '../../data/classes/classFlavorProfiles';
import FactionWebGraph from './FactionWebGraph';
import FactionDetail from './FactionDetail';
import LocationDetail from './LocationDetail';
import ClassLoreDetail from './ClassLoreDetail';
import CustomLineageWizard from './CustomLineageWizard';
import { TimelineView, MiniCalendar } from './TimelineView';
import './WorldDashboard.css';

const VIEWS = {
  DASHBOARD: 'dashboard',
  REGION: 'region',
  LOCATION: 'location',
  FACTION: 'faction',
  FACTION_GRAPH: 'faction_graph',
  CLASS: 'class',
  LINEAGE: 'lineage',
  TIMELINE: 'timeline'
};

const CLASS_ARCHETYPES = [
  {
    id: 'all',
    label: 'All Traditions (21)',
    icon: 'fa-scroll',
    classIds: []
  },
  {
    id: 'martial',
    label: 'Martial Orders & Vanguard',
    icon: 'fa-shield-halved',
    classIds: ['berserker', 'crusader', 'martyr', 'apex', 'spellguard']
  },
  {
    id: 'arcane',
    label: 'Arcane Academies & Weavers',
    icon: 'fa-wand-magic-sparkles',
    classIds: ['arcanoneer', 'chronarch', 'shaper', 'pyrofiend']
  },
  {
    id: 'primal',
    label: 'Primal Callings & Wardens',
    icon: 'fa-tree',
    classIds: ['animist', 'warden', 'toxicologist', 'plaguebringer']
  },
  {
    id: 'shadow',
    label: 'Inquisitions & Shadow Syndicates',
    icon: 'fa-mask',
    classIds: ['inquisitor', 'gambit', 'revenant', 'minstrel']
  },
  {
    id: 'divine',
    label: 'Faiths, Oracles & Eldritch Pacts',
    icon: 'fa-sun',
    classIds: ['augur', 'lunarch', 'false_prophet', 'harbinger']
  }
];

const CLASS_ROLE_TAGS = {
  berserker: { role: 'Striker / Juggernaut', icon: 'fa-axe' },
  crusader: { role: 'Vanguard / Defender', icon: 'fa-shield' },
  martyr: { role: 'Sacrificial Tank', icon: 'fa-heart-crack' },
  apex: { role: 'Predator / Duelist', icon: 'fa-paw' },
  spellguard: { role: 'Anti-Magic Defender', icon: 'fa-shield-halved' },
  arcanoneer: { role: 'Elemental Combinator', icon: 'fa-atom' },
  chronarch: { role: 'Time Controller', icon: 'fa-hourglass' },
  shaper: { role: 'Matter Manipulator', icon: 'fa-cube' },
  pyrofiend: { role: 'Chaos / Burn Blaster', icon: 'fa-fire' },
  animist: { role: 'Spirit Summoner', icon: 'fa-feather' },
  warden: { role: 'Territory Controller', icon: 'fa-tree' },
  toxicologist: { role: 'DoT / Alchemist', icon: 'fa-flask' },
  plaguebringer: { role: 'Miasma Striker', icon: 'fa-biohazard' },
  inquisitor: { role: 'Witch Hunter / Disrupter', icon: 'fa-cross' },
  gambit: { role: 'Critical Gambler', icon: 'fa-dice' },
  revenant: { role: 'Deathbound Undead', icon: 'fa-skull' },
  minstrel: { role: 'Bardic Commander', icon: 'fa-music' },
  augur: { role: 'Cosmic Prophet', icon: 'fa-eye' },
  lunarch: { role: 'Moon Ritualist', icon: 'fa-moon' },
  false_prophet: { role: 'Deception Controller', icon: 'fa-masks-theater' },
  harbinger: { role: 'Doom Bringer', icon: 'fa-crow' }
};

const WorldDashboard = () => {
  const { regions, getWorldOverview, getAllLineages, getLineage } = useWorldStore();
  const { factions } = useFactionStore();
  const { getAllClasses, loadClasses, loaded } = useClassLoreStore();
  const { openWizard: openLineageWizard, lineages: customLineages } = useCustomLineageStore();

  const [view, setView] = useState(VIEWS.DASHBOARD);
  const [selectedRegionId, setSelectedRegionId] = useState(null);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [selectedFactionId, setSelectedFactionId] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedLineageId, setSelectedLineageId] = useState(null);
  const [activeTab, setActiveTab] = useState('regions');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedClassArchetype, setSelectedClassArchetype] = useState('all');
  const [classSearchFilter, setClassSearchFilter] = useState('');

  useEffect(() => {
    if (!loaded) loadClasses();
  }, [loaded, loadClasses]);

  const overview = getWorldOverview();
  const classes = getAllClasses();
  const allLineages = getAllLineages();

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

  const navigateToLineage = (lineageId) => {
    setSelectedLineageId(lineageId);
    setView(VIEWS.LINEAGE);
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
    setSelectedLineageId(null);
  };

  const handleFlyToMap = (e, entityData) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('mythrill_navigate_map', { detail: entityData }));
  };

  const handleAddFaction = () => {
    const name = prompt('Enter name of new Faction / House:');
    if (!name || !name.trim()) return;
    const facId = `fac_custom_${Date.now()}`;
    useFactionStore.getState().factions.push({
      id: facId,
      name: name.trim(),
      type: 'noble_house',
      publicGoal: 'A powerful order navigating the dark bargains of Mythrill.',
      colors: { primary: '#d4af37', secondary: '#444' }
    });
    navigateToFaction(facId);
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

  if (view === VIEWS.LINEAGE && selectedLineageId) {
    const lineage = getLineage(selectedLineageId);
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={navigateToDashboard}>← Dashboard</button>
          <div>
            <h2>{lineage?.name} {lineage?.isCustom && <span className="world-badge world-badge-custom">Custom Lineage</span>}</h2>
            <span className="world-subtitle">{lineage?.essence || 'Lineage Profile'}</span>
          </div>
          {lineage?.isCustom && (
            <button 
              className="world-action-btn"
              style={{ marginLeft: 'auto' }}
              onClick={() => openLineageWizard(lineage)}
            >
              <i className="fas fa-edit"></i> Edit Lineage
            </button>
          )}
        </div>
        <div className="world-tab-content">
          <div className="world-section-stack">
            <div className="world-section">
              <h3>Essence & Overview</h3>
              <p className="world-prose">{lineage?.description || lineage?.overview || lineage?.cardFlavor}</p>
            </div>
            {lineage?.culturalBackground && (
              <div className="world-section">
                <h3>Cultural Background & Traditions</h3>
                <p className="world-prose">{lineage?.culturalBackground}</p>
              </div>
            )}
            {lineage?.meaningfulTradeoffs && (
              <div className="world-section world-section-highlight">
                <h3>Meaningful Tradeoff / Mortal Flaw</h3>
                <p className="world-prose">{lineage?.meaningfulTradeoffs}</p>
              </div>
            )}
            {lineage?.subraces && (
              <div className="world-section">
                <h3>Regional Bloodlines & Subraces</h3>
                <div className="world-card-grid">
                  {(Array.isArray(lineage.subraces) ? lineage.subraces : Object.values(lineage.subraces)).map((sub, i) => (
                    <div key={i} className="world-info-card">
                      <h4>{sub.name}</h4>
                      <p className="world-card-meta">{sub.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <CustomLineageWizard />
      </div>
    );
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

  // Filtered Lineages
  const filteredLineages = allLineages.filter(l => 
    !searchFilter || 
    l.name.toLowerCase().includes(searchFilter.toLowerCase()) || 
    (l.essence && l.essence.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  // --- Dashboard View ---
  return (
    <div className="world-panel world-dashboard">
      <div className="world-panel-header">
        <div>
          <h1>Mythrill</h1>
          <span className="world-subtitle">Living World-Building & Lore Engine</span>
        </div>
      </div>

      <div className="world-tabs">
        {[
          { key: 'regions', label: `Regions (${regions.length})` },
          { key: 'factions', label: `Factions (${factions.length})` },
          { key: 'lineages', label: `Lineages & Peoples (${allLineages.length})` },
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
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <button
                      className="world-mini-map-btn"
                      onClick={(e) => handleFlyToMap(e, { regionId: region.id, name: region.name })}
                      title="Fly to on World Map"
                    >
                      <i className="fas fa-map-location-dot"></i>
                    </button>
                    <span className={`world-badge world-badge-${region.dangerLevel}`}>
                      {region.dangerLevel}
                    </span>
                  </div>
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
            <div className="world-section-actions" style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <button className="world-action-btn" onClick={navigateToGraph}>
                <i className="fas fa-project-diagram" /> View Relationship Web
              </button>
              <button className="world-action-btn primary" onClick={handleAddFaction}>
                <i className="fas fa-plus" /> Forge New Faction
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

        {activeTab === 'lineages' && (
          <div>
            <div className="world-section-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <input
                type="text"
                className="world-search-input"
                placeholder="Search lineages and peoples..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                style={{
                  background: '#141428',
                  border: '1px solid #2a2a4a',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#fff',
                  width: '260px'
                }}
              />
              <button className="world-action-btn primary" onClick={() => openLineageWizard()}>
                <i className="fas fa-dna" /> + Forge Custom Lineage
              </button>
            </div>

            <div className="world-card-grid">
              {filteredLineages.map((lineage) => (
                <div
                  key={lineage.id}
                  className="world-info-card world-clickable lineage-card"
                  onClick={() => navigateToLineage(lineage.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h4>{lineage.name}</h4>
                    {lineage.isCustom ? (
                      <span className="world-badge world-badge-custom">Custom</span>
                    ) : (
                      <span className="world-badge">Canon</span>
                    )}
                  </div>
                  <span className="lineage-card-essence">{lineage.essence || 'The Unbound'}</span>
                  <p className="world-card-meta">
                    {lineage.cardFlavor || lineage.description?.slice(0, 110) + '...'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'classes' && (
          <div className="world-classes-tab">
            {/* Archetype & Search Toolbar */}
            <div className="world-classes-toolbar">
              <div className="world-archetype-pills">
                {CLASS_ARCHETYPES.map((arch) => (
                  <button
                    key={arch.id}
                    type="button"
                    className={`world-archetype-pill ${selectedClassArchetype === arch.id ? 'active' : ''}`}
                    onClick={() => setSelectedClassArchetype(arch.id)}
                  >
                    <i className={`fas ${arch.icon}`} />
                    <span>{arch.label}</span>
                  </button>
                ))}
              </div>

              <div className="classes-search-box">
                <i className="fas fa-search" />
                <input
                  type="text"
                  placeholder="Search 21 classes, origins, roles..."
                  value={classSearchFilter}
                  onChange={(e) => setClassSearchFilter(e.target.value)}
                />
                {classSearchFilter && (
                  <button className="btn-clear-search" onClick={() => setClassSearchFilter('')}>
                    <i className="fas fa-times" />
                  </button>
                )}
              </div>
            </div>

            {/* Classes Grid */}
            <div className="world-card-grid world-classes-grid">
              {classes
                .filter((cls) => {
                  const normalizedId = cls.id?.toLowerCase()?.replace(/\s+/g, '_');
                  const profile = getClassFlavorProfile(cls.id);
                  if (selectedClassArchetype !== 'all') {
                    const arch = CLASS_ARCHETYPES.find((a) => a.id === selectedClassArchetype);
                    if (arch && !arch.classIds.includes(normalizedId) && !arch.classIds.includes(cls.id?.toLowerCase())) {
                      return false;
                    }
                  }
                  if (classSearchFilter.trim()) {
                    const term = classSearchFilter.toLowerCase();
                    const matchName = cls.name?.toLowerCase().includes(term);
                    const matchOrigin = cls.originStory?.toLowerCase().includes(term);
                    const matchDesc = cls.description?.toLowerCase().includes(term);
                    const roleData = CLASS_ROLE_TAGS[normalizedId] || {};
                    const matchRole = roleData.role?.toLowerCase().includes(term);
                    const matchTagline = profile?.tagline?.toLowerCase().includes(term);
                    const matchResource = profile?.resourceName?.toLowerCase().includes(term);
                    const matchTradition = profile?.tradition?.toLowerCase().includes(term);
                    const matchFeature = profile?.keyFeatures?.some((f) => f.toLowerCase().includes(term));
                    return matchName || matchOrigin || matchDesc || matchRole || matchTagline || matchResource || matchTradition || matchFeature;
                  }
                  return true;
                })
                .map((cls) => {
                  const normalizedId = cls.id?.toLowerCase()?.replace(/\s+/g, '_');
                  const profile = getClassFlavorProfile(cls.id);
                  const roleData = CLASS_ROLE_TAGS[normalizedId] || { role: profile?.role || 'Heroic Calling', icon: profile?.roleIcon || 'fa-star' };
                  const arch = CLASS_ARCHETYPES.find((a) => a.id !== 'all' && (a.classIds.includes(normalizedId) || a.classIds.includes(cls.id?.toLowerCase())));

                  return (
                    <div
                      key={cls.id}
                      className="world-info-card world-clickable world-class-card"
                      onClick={() => navigateToClass(cls.id)}
                    >
                      <div className="class-card-header">
                        <div className="class-title-block">
                          <h4>
                            <i className={`fas ${profile?.roleIcon || roleData.icon || 'fa-scroll'} class-header-icon`} />
                            {cls.name}
                          </h4>
                          <span className="class-archetype-tag">{profile?.tradition || arch?.label?.split('&')[0] || 'Calling'}</span>
                        </div>
                        <span className="class-role-pill">
                          {profile?.role || roleData.role}
                        </span>
                      </div>

                      {profile?.tagline && (
                        <div className="class-tagline-box">
                          <p className="class-tagline-text">"{profile.tagline}"</p>
                        </div>
                      )}

                      <div className="class-mechanics-pills">
                        <span className="class-pill class-resource-pill" title="Unique Resource">
                          <i className={`fas ${profile?.resourceIcon || 'fa-bolt'}`} /> {profile?.resourceName || 'Unique Resource'}
                        </span>
                        {(profile?.keyFeatures || []).slice(0, 2).map((feat, idx) => (
                          <span key={idx} className="class-pill class-feature-pill">
                            <i className="fas fa-sparkles" /> {feat}
                          </span>
                        ))}
                      </div>

                      <p className="class-origin-snippet">
                        {profile?.loreSnippet || cls.description?.slice(0, 140) + '...'}
                      </p>

                      <div className="class-card-footer">
                        <span className="class-sites-badge">
                          <i className="fas fa-landmark" /> {cls.classSpecificLocations?.length || 1} Sacred Sites
                        </span>
                        <span className="class-view-link">
                          Dossier & History →
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
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
              <small>Chronological history from the Star-Fall to the present age</small>
            </button>
            <button className="world-quick-link" onClick={() => openLineageWizard()}>
              <i className="fas fa-dna" />
              <span>Forge Custom Lineage</span>
              <small>Create a new playable species integrated into Character Creation</small>
            </button>
            <MiniCalendar />
          </div>
        )}
      </div>

      <CustomLineageWizard />
    </div>
  );
};

export default WorldDashboard;
