import React, { useState, useMemo } from 'react';
import useWorldStore from '../../store/worldStore';
import useFactionStore from '../../store/factionStore';
import { SUBREGIONS } from '../../data/subregions';
import LoreLink from '../common/LoreLink';
import { TimelineView } from './TimelineView';
import { sanitizeLoreText, formatDisplayName, getFactionIcon, getFactionTypeIcon } from './WorldDashboard';
import './RegionDetail.css';

export const getLocationTypeIcon = (type = '') => {
  const t = type.toLowerCase();
  if (['settlement', 'town', 'village', 'encampment', 'camp'].includes(t)) return 'fa-house-chimney';
  if (['city'].includes(t)) return 'fa-city';
  if (['port', 'harbor', 'docks'].includes(t)) return 'fa-anchor';
  if (['stronghold', 'fortress', 'keep', 'hold', 'citadel', 'barracks'].includes(t)) return 'fa-chess-rook';
  if (['outpost', 'tower', 'watchtower'].includes(t)) return 'fa-tower-observation';
  if (['ruin'].includes(t)) return 'fa-monument';
  if (['tomb', 'crypt', 'catacomb', 'sepulcher'].includes(t)) return 'fa-skull';
  if (['wilderness', 'forest', 'steppe', 'marsh', 'swamp', 'bog'].includes(t)) return 'fa-tree';
  if (['peaks', 'glacier', 'mountain', 'pass', 'col', 'crag'].includes(t)) return 'fa-mountain';
  return 'fa-location-dot';
};

const LOCATION_CATEGORIES = [
  { id: 'all', label: 'All Holds', icon: 'fa-layer-group' },
  { id: 'settlements', label: 'Settlements', icon: 'fa-house-chimney', types: ['settlement', 'town', 'city', 'village', 'encampment', 'camp'] },
  { id: 'ports', label: 'Ports & Harbors', icon: 'fa-anchor', types: ['port', 'harbor', 'docks'] },
  { id: 'holds', label: 'Forts & Strongholds', icon: 'fa-chess-rook', types: ['stronghold', 'fortress', 'keep', 'outpost', 'hold', 'citadel', 'tower', 'watchtower', 'barracks'] },
  { id: 'wilderness', label: 'Wilderness & Peaks', icon: 'fa-mountain-sun', types: ['wilderness', 'forest', 'peaks', 'glacier', 'mountain', 'lake', 'swamp', 'steppe', 'pass', 'col', 'marsh', 'bog', 'crag'] },
  { id: 'ruins_tombs', label: 'Ruins & Tombs', icon: 'fa-dungeon', types: ['ruin', 'tomb', 'dungeon', 'crypt', 'catacomb', 'shrine', 'temple', 'vault', 'sepulcher'] }
];

const getLocationCategoryKey = (loc) => {
  const t = (loc.type || '').toLowerCase();
  for (const cat of LOCATION_CATEGORIES) {
    if (cat.types && cat.types.includes(t)) return cat.id;
  }
  if (t.includes('port') || t.includes('harbor')) return 'ports';
  if (t.includes('fort') || t.includes('keep') || t.includes('hold') || t.includes('stronghold')) return 'holds';
  if (t.includes('tomb') || t.includes('ruin') || t.includes('crypt') || t.includes('dungeon')) return 'ruins_tombs';
  if (t.includes('settle') || t.includes('town') || t.includes('village') || t.includes('city')) return 'settlements';
  return 'wilderness';
};

const RegionDetail = ({ regionId, onBack, onLocationClick, onFactionClick }) => {
  const { getRegion, getLocationsByRegion, getFactionsByRegion } = useWorldStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Location Tab Filter & View States
  const [locSearch, setLocSearch] = useState('');
  const [locCategory, setLocCategory] = useState('all');
  const [locSubregion, setLocSubregion] = useState('all');
  const [locSort, setLocSort] = useState('name-asc');
  const [locViewMode, setLocViewMode] = useState('subregions'); // 'subregions' | 'categorized' | 'explorer' | 'grid'
  const [selectedExplorerLocId, setSelectedExplorerLocId] = useState(null);
  const [collapsedSections, setCollapsedSections] = useState({});

  const region = getRegion(regionId);
  const locations = useMemo(() => getLocationsByRegion(regionId) || [], [getLocationsByRegion, regionId]);
  const factions = useMemo(() => getFactionsByRegion(regionId) || [], [getFactionsByRegion, regionId]);

  // Subregions for this realm
  const realmSubregions = useMemo(() => {
    return Object.values(SUBREGIONS).filter((s) => s.regionId === regionId);
  }, [regionId]);

  // Helper to map a location to its subregion
  const getLocationSubregion = (loc) => {
    if (loc.subregionId && SUBREGIONS[loc.subregionId]) {
      return SUBREGIONS[loc.subregionId];
    }
    const found = realmSubregions.find((sub) => sub.zoneIds?.includes(loc.id));
    if (found) return found;
    return realmSubregions[0] || null;
  };

  // Category counts for quick filter chips
  const categoryCounts = useMemo(() => {
    const counts = { all: locations.length, settlements: 0, ports: 0, holds: 0, wilderness: 0, ruins_tombs: 0 };
    locations.forEach((loc) => {
      const cat = getLocationCategoryKey(loc);
      if (counts[cat] !== undefined) counts[cat]++;
    });
    return counts;
  }, [locations]);

  // Subregion counts
  const subregionCounts = useMemo(() => {
    const counts = { all: locations.length };
    realmSubregions.forEach((sub) => {
      counts[sub.id] = 0;
    });
    locations.forEach((loc) => {
      const sub = getLocationSubregion(loc);
      if (sub && counts[sub.id] !== undefined) {
        counts[sub.id]++;
      }
    });
    return counts;
  }, [locations, realmSubregions]);

  // Filtered & Sorted Locations
  const filteredLocations = useMemo(() => {
    let result = locations;

    // 1. Search Query
    if (locSearch.trim()) {
      const q = locSearch.toLowerCase();
      result = result.filter(
        (loc) =>
          loc.name?.toLowerCase().includes(q) ||
          loc.type?.toLowerCase().includes(q) ||
          loc.description?.toLowerCase().includes(q) ||
          loc.leadership?.title?.toLowerCase().includes(q) ||
          loc.factions?.some((f) => f.toLowerCase().includes(q))
      );
    }

    // 2. Category Filter
    if (locCategory !== 'all') {
      result = result.filter((loc) => getLocationCategoryKey(loc) === locCategory);
    }

    // 3. Subregion Filter
    if (locSubregion !== 'all') {
      result = result.filter((loc) => {
        const sub = getLocationSubregion(loc);
        return sub?.id === locSubregion;
      });
    }

    // 4. Sort
    result = [...result].sort((a, b) => {
      if (locSort === 'name-asc') {
        return (a.name || '').localeCompare(b.name || '');
      }
      if (locSort === 'name-desc') {
        return (b.name || '').localeCompare(a.name || '');
      }
      if (locSort === 'subregion-asc') {
        const subA = getLocationSubregion(a)?.name || '';
        const subB = getLocationSubregion(b)?.name || '';
        return subA.localeCompare(subB) || (a.name || '').localeCompare(b.name || '');
      }
      if (locSort === 'pop-desc') {
        return (b.population || 0) - (a.population || 0);
      }
      return 0;
    });

    return result;
  }, [locations, locSearch, locCategory, locSubregion, locSort, realmSubregions]);

  // Active location in Explorer mode
  const activeExplorerLoc = useMemo(() => {
    if (selectedExplorerLocId) {
      const found = filteredLocations.find((l) => l.id === selectedExplorerLocId);
      if (found) return found;
    }
    return filteredLocations[0] || null;
  }, [selectedExplorerLocId, filteredLocations]);

  // Toggle section collapse
  const toggleSectionCollapse = (secKey) => {
    setCollapsedSections((prev) => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  if (!region) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={onBack}>← Back to World</button>
          <h3>Realm Not Found</h3>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Realm Overview', icon: 'fa-compass' },
    { key: 'locations', label: `Locations & Holds (${locations.length})`, icon: 'fa-map-pin' },
    { key: 'factions', label: `Ruling Orders (${factions.length})`, icon: 'fa-shield-halved' },
    { key: 'timeline', label: 'Chronicle & Epochs', icon: 'fa-hourglass-half' }
  ];

  // Grouped by Subregion
  const subregionGroups = realmSubregions.map((sub) => {
    return {
      id: sub.id,
      name: sub.name,
      climate: sub.climate,
      dominantTerrain: sub.dominantTerrain,
      description: sub.description,
      items: filteredLocations.filter((loc) => getLocationSubregion(loc)?.id === sub.id)
    };
  }).filter((group) => group.items.length > 0);

  // Grouped location clusters for 'categorized' view
  const categorizedGroups = [
    {
      key: 'settlements_ports',
      title: 'Settlements, Cities & Ports',
      icon: 'fa-house-chimney',
      description: 'Inhabited strongholds, bustling harbor docks, and frost-hewn clan villages.',
      items: filteredLocations.filter((l) => ['settlements', 'ports'].includes(getLocationCategoryKey(l)))
    },
    {
      key: 'holds_fortresses',
      title: 'Fortresses, Keeps & Deep Holds',
      icon: 'fa-chess-rook',
      description: 'Militarized ramparts, ancient citadel keeps, and sovereign mountain bastions.',
      items: filteredLocations.filter((l) => getLocationCategoryKey(l) === 'holds')
    },
    {
      key: 'wilderness_landmarks',
      title: 'Wilderness, Sacred Peaks & Passes',
      icon: 'fa-mountain-sun',
      description: 'Expanses of shifting whiteout glaciers, treacherous mountain cols, and frozen lakes.',
      items: filteredLocations.filter((l) => getLocationCategoryKey(l) === 'wilderness')
    },
    {
      key: 'ruins_tombs',
      title: 'Ancient Ruins, Tombs & Perils',
      icon: 'fa-dungeon',
      description: 'Buried archivist catacombs, shattered monoliths, and forgotten subterranean vaults.',
      items: filteredLocations.filter((l) => getLocationCategoryKey(l) === 'ruins_tombs')
    }
  ].filter((group) => group.items.length > 0);

  const renderLocationCard = (loc, idx) => {
    const locType = (loc.type || 'settlement').toLowerCase();
    const typeIcon = getLocationTypeIcon(locType);
    const sub = getLocationSubregion(loc);

    return (
      <div
        key={`${loc.id || 'loc'}-${idx}`}
        className={`region-location-card loc-card-theme-${locType}`}
        onClick={() => onLocationClick && onLocationClick(loc.id)}
      >
        <div className="location-card-top">
          <span className={`loc-type-tag loc-type-${locType}`}>
            <i className={`fas ${typeIcon}`}></i> {formatDisplayName(loc.type || 'Settlement')}
          </span>
          {sub && (
            <span className="location-subregion-chip" title={`Subregion: ${sub.name}`}>
              <i className="fas fa-map-location-dot"></i> {sub.name}
            </span>
          )}
        </div>

        <h3 className="location-card-title">{loc.name}</h3>

        {loc.description && (
          <p className="location-card-desc">
            {sanitizeLoreText(loc.description).slice(0, 140)}
            {loc.description.length > 140 ? '…' : ''}
          </p>
        )}

        {(loc.population || loc.leadership?.title || loc.factions?.length > 0) && (
          <div className="location-card-meta-row">
            {loc.population ? (
              <span title="Population">
                <i className="fas fa-users"></i> {loc.population.toLocaleString()}
              </span>
            ) : null}
            {loc.leadership?.title && (
              <span title="Authority">
                <i className="fas fa-crown"></i> {loc.leadership.title}
              </span>
            )}
            {loc.factions?.length > 0 && (
              <span title="Dominant Orders">
                <i className="fas fa-flag"></i> {loc.factions.length} Orders
              </span>
            )}
          </div>
        )}

        <div className="location-card-footer">
          <button className="btn-inspect-loc">
            Inspect Location Codex <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="world-panel region-detail-panel">
      {/* Region Banner Header */}
      <div className="region-hero-header">
        <div className="region-hero-top-nav">
          <button className="world-back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i> Back to World
          </button>
          <div className="region-breadcrumbs">
            <span>World</span> <i className="fas fa-chevron-right"></i>
            <span>Realms</span> <i className="fas fa-chevron-right"></i>
            <span className="current">{region.name}</span>
          </div>
          <div className="region-hero-actions">
            <button
              className="btn-region-hero-action"
              onClick={() => window.dispatchEvent(new CustomEvent('mythrill_navigate_map', { detail: { regionId: region.id, name: region.name } }))}
              title="Fly to on World Map"
            >
              <i className="fas fa-map-location-dot"></i> View on World Map
            </button>
          </div>
        </div>

        <div className="region-hero-main-card">
          <div className="region-hero-icon-box">
            <i className="fas fa-mountain-sun"></i>
          </div>

          <div className="region-hero-text-block">
            <div className="region-hero-badges-row">
              {realmSubregions.length > 0 && (
                <span className="region-ruler-badge">
                  <i className="fas fa-map"></i> {realmSubregions.length} Subregions
                </span>
              )}
              {region.ruler && (
                <span className="region-ruler-badge">
                  <i className="fas fa-crown"></i> {region.ruler}
                </span>
              )}
            </div>

            <h1 className="region-hero-title">{region.name}</h1>
            <p className="region-hero-desc">{sanitizeLoreText(region.description)}</p>
          </div>

          <div className="region-hero-stats-col">
            <div className="region-hero-stat-card">
              <span className="stat-value">{locations.length}</span>
              <span className="stat-label">Explorable Holds</span>
            </div>
            <div className="region-hero-stat-card">
              <span className="stat-value">{factions.length}</span>
              <span className="stat-label">Active Orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="world-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`world-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <i className={`fas ${tab.icon}`} style={{ marginRight: '7px' }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="world-tab-content">
        {/* --- 1. OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="world-section-stack">
            {region.loreOverview && (
              <section className="world-section">
                <h3>Living Realm Lore</h3>
                <p className="world-prose">{sanitizeLoreText(region.loreOverview)}</p>
              </section>
            )}

            {region.historyLore && (
              <section className="world-section">
                <h3>Historical Origins &amp; The Freeze</h3>
                <p className="world-prose">{sanitizeLoreText(region.historyLore)}</p>
              </section>
            )}

            {/* Subregions Geographic Breakdown in Overview */}
            {realmSubregions.length > 0 && (
              <section className="world-section">
                <h3>Subregions of {region.name}</h3>
                <div className="region-subregions-showcase-grid">
                  {realmSubregions.map((sub) => (
                    <div key={sub.id} className="region-subregion-showcase-card">
                      <div className="subregion-showcase-top">
                        <h4><i className="fas fa-map-location-dot"></i> {sub.name}</h4>
                        <span className="subregion-hold-count">
                          {subregionCounts[sub.id] || sub.zoneIds?.length || 0} Holds
                        </span>
                      </div>
                      <p className="subregion-showcase-desc">{sanitizeLoreText(sub.description)}</p>
                      <div className="subregion-showcase-meta">
                        {sub.dominantTerrain && (
                          <span><i className="fas fa-mountain"></i> {sub.dominantTerrain}</span>
                        )}
                        {sub.climate && (
                          <span><i className="fas fa-snowflake"></i> {sub.climate}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="region-environmental-grid">
              {region.climate && (
                <div className="region-env-card">
                  <div className="env-card-header">
                    <i className="fas fa-snowflake"></i>
                    <h4>Climate &amp; Atmosphere</h4>
                  </div>
                  <p>{sanitizeLoreText(region.climate)}</p>
                </div>
              )}

              {region.dominantTerrain && (
                <div className="region-env-card">
                  <div className="env-card-header">
                    <i className="fas fa-mountain"></i>
                    <h4>Dominant Geography</h4>
                  </div>
                  <p>{sanitizeLoreText(region.dominantTerrain)}</p>
                </div>
              )}
            </div>

            {region.primaryRaces && region.primaryRaces.length > 0 && (
              <section className="world-section">
                <h3>Prevalent Lineages &amp; Folk</h3>
                <div className="region-tag-chips">
                  {region.primaryRaces.map((race, idx) => (
                    <span key={idx} className="region-folk-chip">
                      <i className="fas fa-users"></i> {race}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {region.threats && region.threats.length > 0 && (
              <section className="world-section world-section-dark">
                <h3>Regional Perils &amp; Wilderness Threats</h3>
                <div className="region-threats-grid">
                  {region.threats.map((threat, idx) => (
                    <div key={idx} className="region-threat-item">
                      <i className="fas fa-triangle-exclamation"></i>
                      <span>{threat}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* --- 2. LOCATIONS & HOLDS --- */}
        {activeTab === 'locations' && (
          <div className="world-section-stack">
            {/* Toolbar: Search, Subregions, Filters & View Modes */}
            <div className="region-loc-control-hub">
              <div className="region-loc-search-row">
                <div className="region-loc-search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder={`Search ${locations.length} holds by name, jarl, or type in ${region.name}...`}
                    value={locSearch}
                    onChange={(e) => setLocSearch(e.target.value)}
                  />
                  {locSearch && (
                    <button className="btn-loc-clear-search" onClick={() => setLocSearch('')}>
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>

                <div className="region-loc-sort-and-views">
                  {/* Subregion Dropdown */}
                  {realmSubregions.length > 0 && (
                    <div className="region-loc-filter-group">
                      <label><i className="fas fa-map"></i> Subregion:</label>
                      <select
                        className="region-loc-select"
                        value={locSubregion}
                        onChange={(e) => setLocSubregion(e.target.value)}
                      >
                        <option value="all">All Subregions ({locations.length})</option>
                        {realmSubregions.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name} ({subregionCounts[sub.id] || 0})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sort Dropdown */}
                  <div className="region-loc-filter-group">
                    <label><i className="fas fa-arrow-down-a-z"></i> Sort:</label>
                    <select
                      className="region-loc-select"
                      value={locSort}
                      onChange={(e) => setLocSort(e.target.value)}
                    >
                      <option value="name-asc">Name (A–Z)</option>
                      <option value="name-desc">Name (Z–A)</option>
                      <option value="subregion-asc">Subregion (A–Z)</option>
                      <option value="pop-desc">Population</option>
                    </select>
                  </div>

                  {/* View Mode Toggle Buttons */}
                  <div className="region-loc-view-switcher">
                    <button
                      className={`btn-view-mode ${locViewMode === 'subregions' ? 'active' : ''}`}
                      onClick={() => setLocViewMode('subregions')}
                      title="Grouped by Subregion"
                    >
                      <i className="fas fa-map-location-dot"></i> Subregions
                    </button>
                    <button
                      className={`btn-view-mode ${locViewMode === 'categorized' ? 'active' : ''}`}
                      onClick={() => setLocViewMode('categorized')}
                      title="Grouped by Holding Category"
                    >
                      <i className="fas fa-folder-tree"></i> Categories
                    </button>
                    <button
                      className={`btn-view-mode ${locViewMode === 'explorer' ? 'active' : ''}`}
                      onClick={() => setLocViewMode('explorer')}
                      title="Interactive Split Codex Explorer"
                    >
                      <i className="fas fa-table-columns"></i> Explorer
                    </button>
                    <button
                      className={`btn-view-mode ${locViewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setLocViewMode('grid')}
                      title="Standard Grid"
                    >
                      <i className="fas fa-border-all"></i> Grid
                    </button>
                  </div>
                </div>
              </div>

              {/* Category Pills Bar */}
              <div className="region-loc-category-pills">
                {LOCATION_CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat.id] || 0;
                  if (cat.id !== 'all' && count === 0) return null;

                  return (
                    <button
                      key={cat.id}
                      className={`loc-category-pill ${locCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setLocCategory(cat.id)}
                    >
                      <i className={`fas ${cat.icon}`}></i>
                      <span>{cat.label}</span>
                      <span className="loc-cat-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Status Ribbon */}
              <div className="region-loc-summary-ribbon">
                <span>
                  Showing <strong>{filteredLocations.length}</strong> of <strong>{locations.length}</strong> cataloged holds in <strong>{region.name}</strong>
                  {locSubregion !== 'all' && (
                    <span className="active-subregion-tag"> · {realmSubregions.find(s => s.id === locSubregion)?.name}</span>
                  )}
                </span>
                {(locSearch || locCategory !== 'all' || locSubregion !== 'all') && (
                  <button
                    className="btn-loc-reset-filters"
                    onClick={() => { setLocSearch(''); setLocCategory('all'); setLocSubregion('all'); }}
                  >
                    <i className="fas fa-rotate-left"></i> Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Empty State */}
            {filteredLocations.length === 0 ? (
              <div className="factions-empty-state">
                <i className="fas fa-map-location-dot empty-icon"></i>
                <h4>No Locations Match Filters</h4>
                <p>Try clearing your search terms or selecting a different subregion/category.</p>
                <button
                  className="btn-loc-reset-filters"
                  style={{ marginTop: '12px' }}
                  onClick={() => { setLocSearch(''); setLocCategory('all'); setLocSubregion('all'); }}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* 1. SUBREGIONS VIEW (DEFAULT) */}
                {locViewMode === 'subregions' && (
                  <div className="region-categorized-groups-stack">
                    {subregionGroups.map((group) => {
                      const isCollapsed = collapsedSections[group.id];

                      return (
                        <div key={group.id} className="region-holding-group-card region-subregion-group-card">
                          <div
                            className="holding-group-header subregion-group-header"
                            onClick={() => toggleSectionCollapse(group.id)}
                          >
                            <div className="group-header-left">
                              <div className="group-icon-crest subregion-crest">
                                <i className="fas fa-map-location-dot"></i>
                              </div>
                              <div>
                                <h3 className="group-title">
                                  {group.name}
                                  <span className="group-count-pill">{group.items.length} Holds</span>
                                </h3>
                                <p className="group-desc">
                                  {group.dominantTerrain ? `${group.dominantTerrain} · ` : ''}
                                  {group.climate || group.description}
                                </p>
                              </div>
                            </div>
                            <button className="btn-toggle-group">
                              <i className={`fas ${isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
                            </button>
                          </div>

                          {!isCollapsed && (
                            <div className="region-locations-grid">
                              {group.items.map((loc, idx) => renderLocationCard(loc, idx))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. CATEGORIZED GROUPS VIEW */}
                {locViewMode === 'categorized' && (
                  <div className="region-categorized-groups-stack">
                    {categorizedGroups.map((group) => {
                      const isCollapsed = collapsedSections[group.key];

                      return (
                        <div key={group.key} className="region-holding-group-card">
                          <div
                            className="holding-group-header"
                            onClick={() => toggleSectionCollapse(group.key)}
                          >
                            <div className="group-header-left">
                              <div className="group-icon-crest">
                                <i className={`fas ${group.icon}`}></i>
                              </div>
                              <div>
                                <h3 className="group-title">
                                  {group.title}
                                  <span className="group-count-pill">{group.items.length} Holds</span>
                                </h3>
                                <p className="group-desc">{group.description}</p>
                              </div>
                            </div>
                            <button className="btn-toggle-group">
                              <i className={`fas ${isCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`}></i>
                            </button>
                          </div>

                          {!isCollapsed && (
                            <div className="region-locations-grid">
                              {group.items.map((loc, idx) => renderLocationCard(loc, idx))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 3. EXPLORER / SPLIT MASTER-DETAIL VIEW */}
                {locViewMode === 'explorer' && (
                  <div className="region-explorer-layout">
                    {/* Left Master List */}
                    <div className="region-explorer-sidebar">
                      <div className="explorer-sidebar-header">
                        <h4>Holds Roster ({filteredLocations.length})</h4>
                      </div>
                      <div className="explorer-loc-list">
                        {filteredLocations.map((loc) => {
                          const isSelected = activeExplorerLoc?.id === loc.id;
                          const locType = (loc.type || 'settlement').toLowerCase();
                          const sub = getLocationSubregion(loc);

                          return (
                            <div
                              key={loc.id}
                              className={`explorer-loc-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => setSelectedExplorerLocId(loc.id)}
                            >
                              <div className="explorer-loc-item-icon">
                                <i className={`fas ${getLocationTypeIcon(locType)}`}></i>
                              </div>
                              <div className="explorer-loc-item-info">
                                <span className="explorer-loc-item-name">{loc.name}</span>
                                <div className="explorer-loc-item-meta">
                                  <span className={`explorer-mini-badge ${locType}`}>{formatDisplayName(locType)}</span>
                                  {sub && (
                                    <span className="explorer-subregion-tag">{sub.name}</span>
                                  )}
                                  {loc.population && (
                                    <span className="explorer-pop"><i className="fas fa-users"></i> {loc.population.toLocaleString()}</span>
                                  )}
                                </div>
                              </div>
                              <i className="fas fa-chevron-right explorer-arrow"></i>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Detail Dossier */}
                    <div className="region-explorer-dossier">
                      {activeExplorerLoc ? (
                        <div className="explorer-dossier-card">
                          <div className="dossier-hero-header">
                            <div className="dossier-hero-icon">
                              <i className={`fas ${getLocationTypeIcon(activeExplorerLoc.type)}`}></i>
                            </div>
                            <div className="dossier-hero-title-box">
                              <div className="dossier-hero-badges">
                                <span className={`world-badge world-badge-${activeExplorerLoc.type || 'settlement'}`}>
                                  {formatDisplayName(activeExplorerLoc.type || 'Settlement')}
                                </span>
                                {getLocationSubregion(activeExplorerLoc) && (
                                  <span className="location-subregion-chip">
                                    <i className="fas fa-map-location-dot"></i> {getLocationSubregion(activeExplorerLoc).name}
                                  </span>
                                )}
                              </div>
                              <h2>{activeExplorerLoc.name}</h2>
                              <span className="dossier-region-label"><i className="fas fa-compass"></i> {region.name}</span>
                            </div>
                            <button
                              className="btn-dossier-open-full"
                              onClick={() => onLocationClick && onLocationClick(activeExplorerLoc.id)}
                            >
                              <i className="fas fa-book-open"></i> Full Codex
                            </button>
                          </div>

                          <div className="dossier-body">
                            <div className="dossier-section">
                              <h4><i className="fas fa-scroll"></i> Codex Summary</h4>
                              <p className="dossier-prose">{sanitizeLoreText(activeExplorerLoc.description)}</p>
                            </div>

                            {/* Dossier Stats Grid */}
                            <div className="dossier-stats-grid">
                              {activeExplorerLoc.population && (
                                <div className="dossier-stat-box">
                                  <span className="dossier-stat-num">{activeExplorerLoc.population.toLocaleString()}</span>
                                  <span className="dossier-stat-lbl"><i className="fas fa-users"></i> Population</span>
                                </div>
                              )}
                              {activeExplorerLoc.leadership?.title && (
                                <div className="dossier-stat-box">
                                  <span className="dossier-stat-val">{activeExplorerLoc.leadership.title}</span>
                                  <span className="dossier-stat-lbl"><i className="fas fa-crown"></i> Leadership</span>
                                </div>
                              )}
                              {activeExplorerLoc.defenses?.militiaSize && (
                                <div className="dossier-stat-box">
                                  <span className="dossier-stat-num">{activeExplorerLoc.defenses.militiaSize}</span>
                                  <span className="dossier-stat-lbl"><i className="fas fa-shield"></i> Garrison</span>
                                </div>
                              )}
                              {activeExplorerLoc.economy?.status && (
                                <div className="dossier-stat-box">
                                  <span className="dossier-stat-val">{formatDisplayName(activeExplorerLoc.economy.status)}</span>
                                  <span className="dossier-stat-lbl"><i className="fas fa-coins"></i> Economy</span>
                                </div>
                              )}
                            </div>

                            {activeExplorerLoc.leadership?.description && (
                              <div className="dossier-section">
                                <h4><i className="fas fa-chess-king"></i> Sovereign Rule &amp; Governance</h4>
                                <p className="dossier-prose">{sanitizeLoreText(activeExplorerLoc.leadership.description)}</p>
                              </div>
                            )}

                            {activeExplorerLoc.factions && activeExplorerLoc.factions.length > 0 && (
                              <div className="dossier-section">
                                <h4><i className="fas fa-flag"></i> Active Factions in Holding</h4>
                                <div className="dossier-chips-row">
                                  {activeExplorerLoc.factions.map((f, i) => (
                                    <span key={i} className="dossier-faction-chip">
                                      <i className="fas fa-shield-halved"></i> {formatDisplayName(f)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {activeExplorerLoc.history && (
                              <div className="dossier-section dossier-history-section">
                                <h4><i className="fas fa-hourglass-start"></i> Origins &amp; Historical Milestones</h4>
                                <div className="dossier-history-meta">
                                  {activeExplorerLoc.history.founded && (
                                    <span><i className="fas fa-calendar-alt"></i> <strong>Founded:</strong> {activeExplorerLoc.history.founded}</span>
                                  )}
                                  {activeExplorerLoc.history.foundedBy && (
                                    <span><i className="fas fa-crown"></i> <strong>By:</strong> {activeExplorerLoc.history.foundedBy}</span>
                                  )}
                                </div>
                                {activeExplorerLoc.history.foundingStory && (
                                  <p className="dossier-prose" style={{ marginTop: '6px' }}>{sanitizeLoreText(activeExplorerLoc.history.foundingStory)}</p>
                                )}
                                {activeExplorerLoc.history.significantEvents && activeExplorerLoc.history.significantEvents.length > 0 && (
                                  <div className="dossier-milestones-list">
                                    {activeExplorerLoc.history.significantEvents.map((evt, i) => (
                                      <div key={i} className="dossier-milestone-item">
                                        <span className="milestone-date">{evt.date}</span>
                                        <span className="milestone-text">{evt.event}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {activeExplorerLoc.connections && activeExplorerLoc.connections.length > 0 && (
                              <div className="dossier-section">
                                <h4><i className="fas fa-route"></i> Overland Connections</h4>
                                <div className="dossier-chips-row">
                                  {activeExplorerLoc.connections.map((conn, i) => (
                                    <span key={i} className="dossier-route-chip">
                                      <i className="fas fa-signs-post"></i> {formatDisplayName(conn)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="dossier-footer-action">
                              <button
                                className="btn-dossier-cta"
                                onClick={() => onLocationClick && onLocationClick(activeExplorerLoc.id)}
                              >
                                <i className="fas fa-compass"></i> Enter Deep Lore &amp; Sub-Locations ({activeExplorerLoc.name}) →
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="explorer-empty-dossier">
                          <i className="fas fa-arrow-left"></i>
                          <p>Select a location from the list to preview its codex dossier.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. STANDARD GRID VIEW */}
                {locViewMode === 'grid' && (
                  <div className="region-locations-grid">
                    {filteredLocations.map((loc, idx) => renderLocationCard(loc, idx))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* --- 3. RULING FACTIONS --- */}
        {activeTab === 'factions' && (
          <div className="world-section-stack">
            {factions.length === 0 ? (
              <div className="factions-empty-state">
                <i className="fas fa-shield-slash empty-icon"></i>
                <h4>No Major Orders Seated Here</h4>
                <p>This realm is currently disputed wilderness or governed by unaligned clans.</p>
              </div>
            ) : (
              <div className="region-factions-grid">
                {factions.map((fac, idx) => (
                  <div
                    key={`${fac.id || 'fac'}-${idx}`}
                    className="region-faction-card"
                    onClick={() => onFactionClick && onFactionClick(fac.id)}
                  >
                    <div
                      className="faction-card-crest"
                      style={{ background: fac.colors?.primary || '#8b5a1a', borderColor: fac.colors?.secondary || '#d4af37' }}
                    >
                      <i className={`fas ${getFactionIcon(fac)}`}></i>
                    </div>

                    <div className="faction-card-content">
                      <div className="faction-card-top-row">
                        <span className="faction-type-pill">{formatDisplayName(fac.type)}</span>
                        {fac.territory?.length > 0 && (
                          <span className="faction-holdings-tag">
                            <i className="fas fa-chess-rook"></i> {fac.territory.length} Holdings
                          </span>
                        )}
                      </div>

                      <h4 className="faction-card-name">{sanitizeLoreText(fac.name)}</h4>

                      {fac.leader?.title && (
                        <p className="faction-leader-preview">
                          <i className="fas fa-user-shield"></i> {sanitizeLoreText(fac.leader.title)}
                        </p>
                      )}

                      {fac.publicGoal && (
                        <p className="faction-goal-preview">
                          &ldquo;{sanitizeLoreText(fac.publicGoal)}&rdquo;
                        </p>
                      )}

                      <div className="faction-card-footer-row">
                        <button className="btn-inspect-fac-chronicle">
                          Read Order Chronicle →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- 4. TIMELINE & EPOCHS --- */}
        {activeTab === 'timeline' && (
          <div className="world-section-stack">
            <TimelineView filterLocationId={regionId} compact={false} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionDetail;
