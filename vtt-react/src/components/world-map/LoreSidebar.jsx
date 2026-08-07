import React, { useEffect, useMemo, useRef, useState } from 'react';
import useWorldStore from '../../store/worldStore';
import { getEnrichedZone } from '../../data/deepLocationData';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { REGION_POLYGONS } from '../../data/regionPolygons';
import { SUBREGIONS, getSubregionsByRegion } from '../../data/subregions';
import { ZONE_DATA } from '../../data/zoneData';
import './LoreSidebar.css';

const ZONE_TYPE_ICONS = {
  city: 'fa-city',
  settlement: 'fa-house',
  wilderness: 'fa-tree',
  ruin: 'fa-archway',
  tomb: 'fa-skull'
};

// Expanded Location subcategories for rich grouping/filtering
const CATEGORIES = [
  { id: 'capitals',   label: 'Capitals & Seats of Power',         icon: 'fa-crown',             match: ['capital', 'seat'] },
  { id: 'military',   label: 'Fortresses & Military Holds',       icon: 'fa-shield-halved',     match: ['fortress', 'stronghold', 'watchtower', 'keep'] },
  { id: 'maritime',   label: 'Ports, Coastal & Geothermal Havens', icon: 'fa-anchor',            match: ['port', 'harbor', 'coastal', 'vent'] },
  { id: 'industrial', label: 'Forge Villages & Outposts',         icon: 'fa-hammer',            match: ['forge', 'mining', 'woodcutting', 'sump'] },
  { id: 'sacred',     label: 'Sacred Archives, Shrines & Temples',  icon: 'fa-book-archive',      match: ['archive', 'temple', 'shrine', 'sacred'] },
  { id: 'subraces',   label: 'Subrace & Clan Enclaves',           icon: 'fa-users-between-lines', match: ['corvani', 'fexric', 'animist', 'osling'] },
  { id: 'occult',     label: 'Hungríd Cult & Occupation',         icon: 'fa-skull',             match: ['cult', 'hungrid', 'watchtown'] },
  { id: 'wilderness', label: 'Peaks, Glaciers & Wilds',           icon: 'fa-mountain-sun',      match: ['wilderness', 'mountain', 'glacier', 'forest'] },
  { id: 'civic',      label: 'Cities, Towns & Settlements',       icon: 'fa-city',              match: ['city', 'town', 'settlement', 'village'] },
  { id: 'camps',      label: 'Camps & Marks',                     icon: 'fa-fire',              match: ['camp', 'custom'] }
];

const categorize = (loc) => {
  const type = (typeof loc === 'string' ? loc : loc?.type || '').toLowerCase();
  const id = (loc?.id || '').toLowerCase();
  const desc = (loc?.description || '').toLowerCase();

  if (['frostholm', 'snowcall-city', 'greymark-keep', 'snowcall'].includes(id) || type.includes('capital')) return 'capitals';
  if (['stonegrip', 'ymirs-hold', 'vargtor', 'sunder-wall-gates', 'kildvagt', 'bridhe-keep'].includes(id) || type.includes('fortress') || type.includes('stronghold') || type.includes('watchtower')) return 'military';
  if (['fjord-gate', 'xardins-hearth', 'midhofn', 'saltgrinn', 'kildhavn', 'ash-tide-village', 'havhavn', 'black-firth', 'smugglers-cove', 'icefang-haven'].includes(id) || type.includes('port') || type.includes('harbor') || type.includes('coastal')) return 'maritime';
  if (['frozen-archive', 'thogn', 'gjaldhringr', 'run', 'chant-mounds', 'glacier-song-hermitage'].includes(id) || type.includes('archive') || type.includes('temple') || type.includes('shrine') || type.includes('sacred')) return 'sacred';
  if (['svalghjartas-keep', 'hvalhavn', 'grimuvard', 'ulvard', 'kolvard', 'bjargsten-camp', 'varmagrim', 'blizzards-end', 'whispering-pine-logging-camps'].includes(id) || desc.includes('hungríd') || desc.includes('cult') || desc.includes('sylvén')) return 'occult';
  if (['stahlberg', 'hrafnest', 'rooks-promontory', 'hrafnskogur', 'kolhyrna', 'grimefrost', 'kapp', 'blodholl'].includes(id) || desc.includes('corvani') || desc.includes('fexric') || desc.includes('berserker trial')) return 'subraces';
  if (['frostmead', 'frostdell', 'bloodhammer-sump', 'whale-oil-row', 'iron-ore-quay', 'logging-camps'].includes(id) || type.includes('forge') || type.includes('mine') || desc.includes('sump') || desc.includes('warehouse') || type.includes('industrial')) return 'industrial';
  if (['whispering-pine', 'hunger-glaciers', 'eldoyane', 'icetalon-peaks', 'bearsbeards-beak', 'skadis-col', 'cracked-cyst', 'endless-steppe', 'rimors-hearth'].includes(id) || type.includes('wilderness') || type.includes('mountain') || type.includes('glacier') || type.includes('forest')) return 'wilderness';

  for (const cat of CATEGORIES) {
    if (cat.match.some((m) => type.includes(m))) return cat.id;
  }
  return 'civic';
};

const FILTER_CHIPS = [{ id: 'all', label: 'All', icon: 'fa-layer-group' }, ...CATEGORIES];

const LoreSidebar = ({
  regionId,
  selectedLocationId,
  setSelectedLocationId,
  open,
  onClose,
  currentCampaign,
  onEnterSubregionMap,
  onAddLocation
}) => {
  const { getRegion } = useWorldStore();
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('locations'); // 'locations' | 'overview'
  const containerRef = useRef(null);

  // Expand + scroll to a selected pin location when it changes.
  useEffect(() => {
    if (!selectedLocationId) return;
    setExpandedLocation(selectedLocationId);
    setCollapsedGroups((prev) => {
      if (!prev.size) return prev;
      const next = new Set(prev);
      next.clear();
      return next;
    });
    const timer = setTimeout(() => {
      const el = document.getElementById(`lore-loc-${selectedLocationId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 320);
    return () => clearTimeout(timer);
  }, [selectedLocationId]);

  // Reset transient views when switching regions.
  useEffect(() => {
    setActiveFilter('all');
    setSearchTerm('');
    setCollapsedGroups(new Set());
  }, [regionId]);

  const subregionObj = SUBREGIONS[regionId];
  const parentRegion = useMemo(() => subregionObj ? getRegion(subregionObj.regionId) : null, [subregionObj, getRegion]);
  const region = useMemo(() => {
    if (subregionObj) {
      return {
        id: subregionObj.id,
        name: subregionObj.name,
        description: subregionObj.description,
        climate: subregionObj.climate,
        dominantTerrain: subregionObj.dominantTerrain,
        primaryRaces: subregionObj.primaryRaces,
        primaryFactions: subregionObj.primaryFactions,
        dangerLevel: parentRegion?.dangerLevel || 'high',
        isSubregion: true,
        regionId: subregionObj.regionId,
        parentRegionName: parentRegion?.name || 'Nordhalla'
      };
    }
    return getRegion(regionId);
  }, [regionId, subregionObj, parentRegion, getRegion]);

  const regionAccent = REGION_POLYGONS[regionId]?.glowColor || (subregionObj ? 'rgba(212, 175, 55, 0.8)' : 'rgba(196, 164, 74, 0.6)');

  // Resolve placed pins for this region or subregion into enriched location objects.
  const enrichedLocations = useMemo(() => {
    const out = [];
    const addedIds = new Set();

    Object.entries(LOCATION_COORDINATES).forEach(([pinId, coord]) => {
      const zone = ZONE_DATA.find((z) => z.id === pinId);
      const belongs = subregionObj
        ? (subregionObj.zoneIds?.includes(pinId) || coord.subregionId === regionId || zone?.subregionId === regionId)
        : ((zone && zone.regionId === regionId) || coord.regionId === regionId);

      if (!belongs) return;

      if (zone) {
        const e = getEnrichedZone(pinId);
        if (e) {
          out.push(e);
          addedIds.add(pinId);
        }
        return;
      }

      let name = '';
      let description = '';
      let type = coord.pinType || 'custom';

      if (coord.source === 'campaignLocation') {
        const campLoc = currentCampaign?.campaignData?.locations?.find((l) => String(l.id) === String(coord.sourceId));
        name = campLoc ? campLoc.name : `Campaign Loc (${coord.sourceId})`;
        description = campLoc ? campLoc.description || campLoc.notes || 'No description provided.' : '';
        type = 'settlement';
      } else if (coord.source === 'campaignLore') {
        const campLore = currentCampaign?.campaignData?.homebrew?.lore?.find((l) => String(l.id) === String(coord.sourceId));
        name = campLore ? campLore.title : `Campaign Lore (${coord.sourceId})`;
        description = campLore ? campLore.content || campLore.notes || 'No description provided.' : '';
        type = 'wilderness';
      } else if (coord.source === 'custom') {
        name = coord.name || 'Custom POI';
        description = coord.description || 'No description provided.';
        type = coord.pinType || 'custom';
      }

      out.push({ id: pinId, regionId, name, description, type, isDeep: false });
      addedIds.add(pinId);
    });

    // For subregions, load all defined zones in subregionObj.zoneIds or matching zone.subregionId
    if (subregionObj) {
      ZONE_DATA.filter((z) => subregionObj.zoneIds?.includes(z.id) || z.subregionId === regionId).forEach((z) => {
        if (!addedIds.has(z.id)) {
          const e = getEnrichedZone(z.id);
          if (e) {
            out.push(e);
            addedIds.add(z.id);
          }
        }
      });
    }

    // For top-level continent regions, load all canonical zones belonging to this region
    if (!subregionObj && regionId) {
      ZONE_DATA.filter((z) => z.regionId === regionId).forEach((z) => {
        if (!addedIds.has(z.id)) {
          const e = getEnrichedZone(z.id);
          if (e) {
            out.push(e);
            addedIds.add(z.id);
          }
        }
      });
    }

    return out;
  }, [regionId, subregionObj, currentCampaign]);

  // Apply search + category filter.
  const filteredLocations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return enrichedLocations.filter((loc) => {
      if (activeFilter !== 'all' && categorize(loc.type) !== activeFilter) return false;
      if (term && !`${loc.name} ${loc.type}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [enrichedLocations, activeFilter, searchTerm]);

  // Aggregate region overview stats.
  const stats = useMemo(() => {
    const byCat = { civic: 0, wilderness: 0, ruins: 0, camps: 0 };
    enrichedLocations.forEach((l) => {
      const cat = categorize(l.type);
      if (byCat[cat] !== undefined) byCat[cat] += 1;
      else byCat.civic += 1;
    });
    const major = enrichedLocations.find((l) => l.type === 'city') || enrichedLocations.find((l) => l.type === 'settlement');
    return {
      total: enrichedLocations.length,
      byCat,
      major: major ? major.name : null
    };
  }, [enrichedLocations]);

  const subregionsList = useMemo(() => {
    if (subregionObj) {
      return getSubregionsByRegion(subregionObj.regionId);
    }
    return getSubregionsByRegion(regionId);
  }, [regionId, subregionObj]);

  // If closed or no region, do not render.
  if (!open || !regionId) return null;

  const toggleGroup = (catId) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const renderLocationCard = (loc) => {
    const typeIcon = ZONE_TYPE_ICONS[loc.type] || 'fa-map-pin';
    const isExpanded = expandedLocation === loc.id;
    const catId = categorize(loc.type);
    return (
      <div
        key={loc.id}
        id={`lore-loc-${loc.id}`}
        className={`lore-location-item ${isExpanded ? 'expanded' : ''} ${loc.isDeep ? 'has-deep-profile' : ''} loc-cat-${catId}`}
      >
        <div
          className="lore-location-main"
          onClick={() => {
            const nextState = isExpanded ? null : loc.id;
            setExpandedLocation(nextState);
            if (setSelectedLocationId) setSelectedLocationId(nextState);
          }}
        >
          <i className={`fas ${typeIcon} loc-icon`} />
          <div className="lore-location-info">
            <div className="lore-location-title-row">
              <span className="lore-location-name">{loc.name}</span>
              {loc.isDeep && (
                <span className="lore-deep-badge" title="Deep profile available">
                  <i className="fas fa-gem" /> Deep
                </span>
              )}
            </div>
            <span className="lore-location-type">{loc.type}</span>
          </div>
          <div className="lore-location-right">
            <i className={`fas fa-chevron-right expand-arrow ${isExpanded ? 'rotated' : ''}`} />
          </div>
        </div>

        {isExpanded && (
          <div className="lore-location-detail">
            <p className="loc-description">{loc.description}</p>

            {loc.isDeep && (
              <div className="lore-deep-profile-details">
                {loc.heraldry && (
                  <div className="lore-heraldry-card">
                    <span className="lore-detail-label">Heraldry</span>
                    <p className="lore-heraldry-desc">
                      <i className="fas fa-shield-halved" /> {loc.heraldry.description}
                    </p>
                  </div>
                )}

                <div className="lore-stats-grid">
                  {loc.population && (
                    <div className="lore-stat-item">
                      <span className="lore-detail-label">Population</span>
                      <span className="lore-stat-value">{loc.population.toLocaleString()}</span>
                    </div>
                  )}
                  {loc.leadership && (
                    <div className="lore-stat-item">
                      <span className="lore-detail-label">Governance</span>
                      <span className="lore-stat-value capitalize">{loc.leadership.type.replace('_', ' ')}</span>
                    </div>
                  )}
                  {loc.economy && (
                    <div className="lore-stat-item">
                      <span className="lore-detail-label">Economy</span>
                      <span className="lore-stat-value capitalize">{loc.economy.status}</span>
                    </div>
                  )}
                </div>

                {loc.leadership && (
                  <div className="lore-profile-section">
                    <span className="lore-detail-label">Leadership</span>
                    <p className="lore-leadership-detail">
                      <strong>{loc.leadership.title}:</strong> {loc.leadership.description}
                    </p>
                  </div>
                )}

                {loc.economy && (
                  <div className="lore-profile-section">
                    <span className="lore-detail-label">Commerce</span>
                    <p className="lore-commerce-detail">
                      <strong>Primary:</strong> {loc.economy.primary}
                      {loc.economy.secondary && loc.economy.secondary.length > 0 && (
                        <span><br /><strong>Secondary:</strong> {loc.economy.secondary.join(', ')}</span>
                      )}
                    </p>
                  </div>
                )}

                {loc.atmosphere && (
                  <div className="lore-profile-section lore-atmosphere-box">
                    <span className="lore-detail-label atmosphere-title">
                      <i className="fas fa-wind" /> Atmosphere &amp; Architecture
                    </span>
                    <div className="atmosphere-content">
                      {loc.atmosphere.mood && <p className="atmosphere-part"><em>Mood:</em> {loc.atmosphere.mood}</p>}
                      {loc.atmosphere.architecture && <p className="atmosphere-part"><em>Structures:</em> {loc.atmosphere.architecture}</p>}
                      {loc.atmosphere.sounds && <p className="atmosphere-part"><em>Sounds:</em> {loc.atmosphere.sounds}</p>}
                      {loc.atmosphere.smells && <p className="atmosphere-part"><em>Aroma:</em> {loc.atmosphere.smells}</p>}
                      {loc.atmosphere.lighting && <p className="atmosphere-part"><em>Lighting:</em> {loc.atmosphere.lighting}</p>}
                    </div>
                  </div>
                )}

                {loc.subLocations && loc.subLocations.length > 0 && (
                  <div className="lore-profile-section">
                    <span className="lore-detail-label">Points of Interest</span>
                    <div className="lore-sublocations-list">
                      {loc.subLocations.map((sub, idx) => (
                        <div key={idx} className="lore-sublocation-card">
                          <div className="sub-loc-header">
                            <span className="sub-loc-name">{sub.name}</span>
                            <span className="sub-loc-type">{sub.type}</span>
                          </div>
                          <p className="sub-loc-desc">{sub.description}</p>
                          {sub.notableFeatures && sub.notableFeatures.length > 0 && (
                            <ul className="sub-loc-features">
                              {sub.notableFeatures.map((feat, fIdx) => (
                                <li key={fIdx} className="sub-loc-feature-item">
                                  <i className="fas fa-chevron-right" /> {feat}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {loc.factions && loc.factions.length > 0 && (
              <div className="lore-location-factions">
                <span className="lore-detail-label">Factions:</span>
                <div className="faction-tags-container">
                  {loc.factions.map((f, i) => (
                    <span key={i} className="faction-tag">{f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`lore-sidebar ${open ? 'open' : ''}`} ref={containerRef}>
      <button className="lore-sidebar-close" onClick={onClose} title="Close lore panel">
        <i className="fas fa-times" />
      </button>

      {/* Accent ribbon colored by region */}
      <div className="lore-sidebar-accent" style={{ background: regionAccent }} />

      <div className="lore-sidebar-inner">
        {region ? (
          <>
            <div className="lore-sidebar-header">
              <div className="lore-realm-badge">
                <span>{region.isSubregion ? `${region.parentRegionName || 'Nordhalla'} Subrealm` : 'Continent Realm'}</span>
              </div>
              <h2 className="lore-region-name">{region.name}</h2>
              <p className="lore-region-desc">{region.description}</p>
              {region.isSubregion ? (
                <div className="lore-header-btn-row">
                  {(REGION_POLYGONS[regionId]?.hasSubregionMap || onEnterSubregionMap) && (
                    <button
                      className="lore-enter-subregion-btn animate-fade-in"
                      onClick={() => onEnterSubregionMap && onEnterSubregionMap(regionId)}
                    >
                      <i className="fas fa-compass"></i> Focus {region.name} Map
                    </button>
                  )}
                  {onAddLocation && (
                    <button
                      type="button"
                      className="lore-add-loc-btn animate-fade-in"
                      onClick={() => onAddLocation(regionId)}
                      title={`Add custom location or landmark in ${region.name}`}
                    >
                      <i className="fas fa-location-dot"></i> + Add Location
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="lore-header-btn-row">
                    {REGION_POLYGONS[regionId]?.hasSubregionMap && onEnterSubregionMap && (
                      <button
                        className="lore-enter-subregion-btn animate-fade-in"
                        onClick={() => onEnterSubregionMap(regionId)}
                      >
                        <i className="fas fa-compass" /> Open Regional Cartography
                      </button>
                    )}
                    {onAddLocation && (
                      <button
                        type="button"
                        className="lore-add-loc-btn animate-fade-in"
                        onClick={() => onAddLocation(regionId)}
                        title={`Add custom location or landmark in ${region.name}`}
                      >
                        <i className="fas fa-location-dot"></i> + Add Location
                      </button>
                    )}
                  </div>
                  {subregionsList.length > 0 && (
                    <div className="lore-subregion-action-bar animate-fade-in">
                      <span className="subregion-action-label">Explore Subrealms:</span>
                      <div className="subregion-action-btns">
                        {subregionsList.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            className="lore-subrealm-pill-btn"
                            onClick={() => {
                              if (setSelectedLocationId) setSelectedLocationId(null);
                              if (onEnterSubregionMap) onEnterSubregionMap(sub.id);
                            }}
                          >
                            <i className="fas fa-compass" /> {sub.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Region overview stat strip */}
            <div className="lore-overview-strip">
              <div className="lore-overview-stat">
                <span className="lore-overview-stat-value">{stats.total}</span>
                <span className="lore-overview-stat-label">Locations</span>
              </div>
              <div className="lore-overview-divider" />
              <div className="lore-overview-stat">
                <span className="lore-overview-stat-value">{subregionsList.length}</span>
                <span className="lore-overview-stat-label">Subrealms</span>
              </div>
              <div className="lore-overview-divider" />
              <div className="lore-overview-stat wide">
                <span className="lore-overview-stat-value small">
                  {region.ruler ? 'House Skalvyr' : 'Established'}
                </span>
                <span className="lore-overview-stat-label">Dominance</span>
              </div>
            </div>

            {/* Navigation tab bar */}
            <div className="lore-tab-bar">
              <button
                className={`lore-tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
                onClick={() => setActiveTab('locations')}
              >
                <i className="fas fa-location-dot" /> Locations ({stats.total})
              </button>
              {subregionsList.length > 0 && (
                <button
                  className={`lore-tab-btn ${activeTab === 'subregions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('subregions')}
                >
                  <i className="fas fa-layer-group" /> Subregions ({subregionsList.length})
                </button>
              )}
              <button
                className={`lore-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-book-open" /> Region Lore
              </button>
            </div>

            {activeTab === 'locations' ? (
              <>
                {/* Search + filter controls */}
                <div className="lore-controls">
                  <div className="lore-search-wrap">
                    <i className="fas fa-search lore-search-icon" />
                    <input
                      className="lore-search-input"
                      type="text"
                      placeholder="Search locations…"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button className="lore-search-clear" onClick={() => setSearchTerm('')} title="Clear">
                        <i className="fas fa-times" />
                      </button>
                    )}
                  </div>
                  <div className="lore-filter-chips">
                    {FILTER_CHIPS.map((chip) => {
                      const count = chip.id === 'all'
                        ? enrichedLocations.length
                        : stats.byCat[chip.id] || 0;
                      if (chip.id !== 'all' && count === 0) return null;
                      return (
                        <button
                          key={chip.id}
                          className={`lore-chip ${activeFilter === chip.id ? 'active' : ''}`}
                          onClick={() => setActiveFilter(chip.id)}
                        >
                          <i className={`fas ${chip.icon}`} />
                          <span>{chip.label}</span>
                          <span className="lore-chip-count">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grouped locations */}
                <div className="lore-locations-list">
                  {CATEGORIES.map((cat) => {
                    const groupLocs = filteredLocations.filter((l) => categorize(l.type) === cat.id);
                    if (groupLocs.length === 0) return null;
                    const isCollapsed = collapsedGroups.has(cat.id);
                    return (
                      <div key={cat.id} className="lore-category-group">
                        <button
                          className="lore-group-header"
                          onClick={() => toggleGroup(cat.id)}
                          type="button"
                        >
                          <span className="lore-group-title">
                            <i className={`fas ${cat.icon}`} />
                            <span>{cat.label}</span>
                            <span className="lore-group-count">{groupLocs.length}</span>
                          </span>
                          <i className={`fas fa-chevron-down lore-group-chevron ${isCollapsed ? 'collapsed' : ''}`} />
                        </button>
                        {!isCollapsed && (
                          <div className="lore-group-items">
                            {groupLocs.map(renderLocationCard)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {filteredLocations.length === 0 && (
                    <div className="lore-empty-search">
                      <i className="fas fa-compass" />
                      <p>No locations match &ldquo;{searchTerm}&rdquo;</p>
                      <button onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}>
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'subregions' ? (
              <div className="lore-subregions-panel">
                <div className="lore-subregions-grid">
                  {subregionsList.map((sub) => (
                    <div key={sub.id} className="lore-subregion-card">
                      <div className="lore-subregion-card-header">
                        <span className="lore-subregion-name">{sub.name}</span>
                        <span className="lore-subregion-climate-pill">{sub.climate || 'Tundra'}</span>
                      </div>
                      <p className="lore-subregion-desc">{sub.description}</p>
                      {sub.zoneIds && sub.zoneIds.length > 0 && (
                        <div className="lore-subregion-zones-preview">
                          <span className="lore-detail-label">Points of Interest:</span>
                          <div className="lore-subregion-zones-tags">
                            {sub.zoneIds.map((zId) => {
                              const z = ZONE_DATA.find((item) => item.id === zId);
                              return (
                                <button
                                  key={zId}
                                  className="lore-zone-tag-btn"
                                  onClick={() => {
                                    setActiveTab('locations');
                                    setSearchTerm(z ? z.name : zId);
                                  }}
                                >
                                  {z ? z.name : zId}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      <button
                        className="lore-focus-subregion-btn"
                        onClick={() => {
                          if (setSelectedLocationId) setSelectedLocationId(null);
                          if (onEnterSubregionMap) onEnterSubregionMap(sub.id);
                        }}
                      >
                        <i className="fas fa-crosshairs" /> Focus on Map
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="lore-overview-panel">
                <div className="lore-profile-section">
                  <span className="lore-detail-label">Geography &amp; Climate</span>
                  <div className="lore-geo-tags">
                    {region.climate && <span className="lore-geo-pill"><i className="fas fa-snowflake" /> {region.climate}</span>}
                    {region.dominantTerrain && <span className="lore-geo-pill"><i className="fas fa-mountain" /> {region.dominantTerrain}</span>}
                    {region.dangerLevel && (
                      <span className={`lore-geo-pill danger-${region.dangerLevel}`}>
                        <i className="fas fa-skull-crossbones" /> Danger: {region.dangerLevel}
                      </span>
                    )}
                  </div>
                </div>

                {region.primaryRaces && region.primaryRaces.length > 0 && (
                  <div className="lore-profile-section">
                    <span className="lore-detail-label">Primary Peoples &amp; Subraces</span>
                    <div className="lore-peoples-list">
                      {region.primaryRaces.map((race, i) => (
                        <span key={i} className="lore-people-chip">{race}</span>
                      ))}
                    </div>
                  </div>
                )}

                {region.primaryFactions && region.primaryFactions.length > 0 && (
                  <div className="lore-profile-section">
                    <span className="lore-detail-label">Dominant Factions</span>
                    <div className="lore-factions-list">
                      {region.primaryFactions.map((fac, i) => (
                        <div key={i} className="lore-faction-card">
                          <i className="fas fa-flag lore-faction-icon" />
                          <span>{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="lore-sidebar-empty">
            <i className="fas fa-map-marked-alt lore-empty-icon" />
            <h3>No Region Selected</h3>
            <p>Click any region or boundary on the world map to inspect its lore, inhabitants, and strongholds.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoreSidebar;
