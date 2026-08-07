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

// Expanded Location subcategories for rich grouping/filtering using guaranteed FA 6 Free Solid icons
const CATEGORIES = [
  { id: 'capitals',   label: 'Capitals & Seats of Power',         shortLabel: 'Capitals',   icon: 'fa-crown',             match: ['capital', 'seat'] },
  { id: 'military',   label: 'Fortresses & Military Holds',       shortLabel: 'Fortresses', icon: 'fa-shield-halved',     match: ['fortress', 'stronghold', 'watchtower', 'keep'] },
  { id: 'maritime',   label: 'Ports, Coastal & Geothermal Havens', shortLabel: 'Maritime',   icon: 'fa-anchor',            match: ['port', 'harbor', 'coastal', 'vent'] },
  { id: 'industrial', label: 'Forge Villages & Outposts',         shortLabel: 'Forges',     icon: 'fa-hammer',            match: ['forge', 'mining', 'woodcutting', 'sump'] },
  { id: 'sacred',     label: 'Sacred Archives, Shrines & Temples',  shortLabel: 'Sacred',     icon: 'fa-book-bookmark',     match: ['archive', 'temple', 'shrine', 'sacred'] },
  { id: 'subraces',   label: 'Subrace & Clan Enclaves',           shortLabel: 'Enclaves',   icon: 'fa-people-group',      match: ['corvani', 'fexric', 'animist', 'osling'] },
  { id: 'occult',     label: 'Hungríd Cult & Occupation',         shortLabel: 'Occult',     icon: 'fa-skull',             match: ['cult', 'hungrid', 'watchtown'] },
  { id: 'wilderness', label: 'Peaks, Glaciers & Wilds',           shortLabel: 'Wilds',      icon: 'fa-mountain-sun',      match: ['wilderness', 'mountain', 'glacier', 'forest'] },
  { id: 'civic',      label: 'Cities, Towns & Settlements',       shortLabel: 'Civic',      icon: 'fa-city',              match: ['city', 'town', 'settlement', 'village'] },
  { id: 'camps',      label: 'Camps & Marks',                     shortLabel: 'Camps',      icon: 'fa-campground',        match: ['camp', 'custom'] }
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

const FILTER_CHIPS = [{ id: 'all', label: 'All Categories', shortLabel: 'All', icon: 'fa-layer-group' }, ...CATEGORIES];

const LoreSidebar = ({
  regionId,
  selectedLocationId,
  setSelectedLocationId,
  open,
  onClose,
  currentCampaign,
  onEnterSubregionMap
}) => {
  const { getRegion } = useWorldStore();
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('locations'); // 'locations' | 'subregions' | 'overview'
  const [mobileMinimized, setMobileMinimized] = useState(false);
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
    setHoveredCategory(null);
    setSearchTerm('');
    setCollapsedGroups(new Set());
    setMobileMinimized(false);
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
        dangerLevel: parentRegion?.dangerLevel || 'High',
        isSubregion: true,
        regionId: subregionObj.regionId,
        parentRegionName: parentRegion?.name || 'Nordhalla'
      };
    }
    return getRegion(regionId);
  }, [regionId, subregionObj, parentRegion, getRegion]);

  const regionAccent = REGION_POLYGONS[regionId]?.glowColor || (subregionObj ? 'rgba(212, 175, 55, 0.9)' : 'rgba(139, 38, 38, 0.85)');

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

  // Aggregate category counts.
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((c) => { counts[c.id] = 0; });
    enrichedLocations.forEach((loc) => {
      const cat = categorize(loc.type);
      if (counts[cat] !== undefined) counts[cat] += 1;
      else counts.civic = (counts.civic || 0) + 1;
    });
    return counts;
  }, [enrichedLocations]);

  // Apply search + category filter.
  const filteredLocations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return enrichedLocations.filter((loc) => {
      if (activeFilter !== 'all' && categorize(loc.type) !== activeFilter) return false;
      if (term) {
        const hay = `${loc.name} ${loc.type} ${loc.description || ''}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [enrichedLocations, activeFilter, searchTerm]);

  // Aggregate region overview stats.
  const stats = useMemo(() => {
    const major = enrichedLocations.find((l) => l.type === 'city') || enrichedLocations.find((l) => l.type === 'settlement');
    return {
      total: enrichedLocations.length,
      deepCount: enrichedLocations.filter((l) => l.isDeep).length,
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

  const toggleAllGroups = () => {
    const allCatIds = CATEGORIES.map((c) => c.id);
    const areAllCollapsed = allCatIds.every((id) => collapsedGroups.has(id));
    if (areAllCollapsed) {
      setCollapsedGroups(new Set());
    } else {
      setCollapsedGroups(new Set(allCatIds));
    }
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === activeFilter);
  const hoveredCategoryObj = CATEGORIES.find((c) => c.id === hoveredCategory) || (hoveredCategory === 'all' ? FILTER_CHIPS[0] : null);

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
          <div className="loc-icon-bubble">
            <i className={`fas ${typeIcon} loc-icon`} />
          </div>
          <div className="lore-location-info">
            <div className="lore-location-title-row">
              <span className="lore-location-name">{loc.name}</span>
              {loc.isDeep && (
                <span className="lore-deep-badge" title="Illuminated historical profile">
                  <i className="fas fa-gem" /> Deep
                </span>
              )}
            </div>
            <span className="lore-location-type">{loc.type}</span>
          </div>
          <div className="lore-location-right">
            <button
              type="button"
              className="lore-quick-pin-btn"
              title={`Focus ${loc.name} on map`}
              onClick={(e) => {
                e.stopPropagation();
                if (setSelectedLocationId) setSelectedLocationId(loc.id);
              }}
            >
              <i className="fas fa-crosshairs" />
            </button>
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
                    <span className="lore-detail-label">
                      <i className="fas fa-shield-halved" /> Heraldry &amp; Crest
                    </span>
                    <p className="lore-heraldry-desc">
                      {loc.heraldry.description}
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
    <div className={`lore-sidebar ${open ? 'open' : ''} ${mobileMinimized ? 'minimized' : ''}`} ref={containerRef}>
      {/* Mobile Drawer Header & Controls */}
      <div className="lore-mobile-handle-bar">
        <button
          type="button"
          className="lore-mobile-toggle-btn"
          onClick={() => setMobileMinimized(!mobileMinimized)}
          title={mobileMinimized ? 'Expand Lore Navigator' : 'Minimize to bottom'}
        >
          <i className={`fas ${mobileMinimized ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
          <span>{region.name} Lore {mobileMinimized ? '(Tap to Expand)' : ''}</span>
        </button>
      </div>

      <button className="lore-sidebar-close" onClick={onClose} title="Close lore panel">
        <i className="fas fa-times" />
      </button>

      {/* Dynamic regional accent ribbon */}
      <div className="lore-sidebar-accent" style={{ background: regionAccent }} />

      <div className="lore-sidebar-inner">
        {region ? (
          <>
            {/* Header with Breadcrumbs and Realm Info */}
            <div className="lore-sidebar-header">
              {region.isSubregion ? (
                <div className="lore-breadcrumb-bar">
                  <span className="breadcrumb-parent">{region.parentRegionName || 'Nordhalla'}</span>
                  <i className="fas fa-chevron-right breadcrumb-separator" />
                  <span className="breadcrumb-current">{region.name}</span>
                  {subregionObj && onEnterSubregionMap && (
                    <button
                      type="button"
                      className="breadcrumb-back-btn"
                      onClick={() => onEnterSubregionMap(subregionObj.regionId)}
                      title={`Return to ${region.parentRegionName || 'Continent'}`}
                    >
                      <i className="fas fa-arrow-left" /> Back to Realm
                    </button>
                  )}
                </div>
              ) : (
                <div className="lore-realm-badge">
                  <i className="fas fa-globe" />
                  <span>Continent Realm</span>
                </div>
              )}

              <h2 className="lore-region-name">{region.name}</h2>
              <p className="lore-region-desc">{region.description}</p>

              {/* Regional Cartography Action Row */}
              {(REGION_POLYGONS[regionId]?.hasSubregionMap || onEnterSubregionMap) && (
                <div className="lore-header-actions">
                  <button
                    type="button"
                    className="lore-enter-subregion-btn animate-fade-in"
                    onClick={() => onEnterSubregionMap && onEnterSubregionMap(regionId)}
                  >
                    <i className="fas fa-compass" />
                    <span>{region.isSubregion ? `Focus ${region.name} Map` : 'Open Regional Cartography'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Atlas Quick-Metric Bar with Built-In Parchment Cards */}
            <div className="lore-atlas-strip">
              <div className="lore-atlas-tile" title={`${stats.total} total locations and strongholds`}>
                <div className="atlas-tile-icon-box">
                  <i className="fas fa-location-dot" />
                </div>
                <div className="atlas-tile-data">
                  <span className="atlas-tile-val">{stats.total}</span>
                  <span className="atlas-tile-label">Locations</span>
                </div>
              </div>

              <div className="lore-atlas-divider" />

              <div className="lore-atlas-tile" title={`${subregionsList.length} explorable subrealms`}>
                <div className="atlas-tile-icon-box">
                  <i className="fas fa-compass" />
                </div>
                <div className="atlas-tile-data">
                  <span className="atlas-tile-val">{subregionsList.length}</span>
                  <span className="atlas-tile-label">Subrealms</span>
                </div>
              </div>

              <div className="lore-atlas-divider" />

              <div className="lore-atlas-tile" title={`Dominant power: ${region.ruler ? 'House Skalvyr' : 'Established Sovereign'}`}>
                <div className="atlas-tile-icon-box">
                  <i className="fas fa-crown" />
                </div>
                <div className="atlas-tile-data">
                  <span className="atlas-tile-val small">{region.ruler ? 'Skalvyr' : 'Established'}</span>
                  <span className="atlas-tile-label">Dominance</span>
                </div>
              </div>

              <div className="lore-atlas-divider" />

              <div className="lore-atlas-tile" title={`Threat assessment: ${region.dangerLevel || 'High'}`}>
                <div className="atlas-tile-icon-box danger">
                  <i className="fas fa-skull-crossbones" />
                </div>
                <div className="atlas-tile-data">
                  <span className="atlas-tile-val capitalize small">{region.dangerLevel || 'High'}</span>
                  <span className="atlas-tile-label">Danger</span>
                </div>
              </div>
            </div>

            {/* Navigation Tab Bar */}
            <div className="lore-tab-bar">
              <button
                type="button"
                className={`lore-tab-btn ${activeTab === 'locations' ? 'active' : ''}`}
                onClick={() => setActiveTab('locations')}
              >
                <i className="fas fa-location-dot" /> Locations ({stats.total})
              </button>
              {subregionsList.length > 0 && (
                <button
                  type="button"
                  className={`lore-tab-btn ${activeTab === 'subregions' ? 'active' : ''}`}
                  onClick={() => setActiveTab('subregions')}
                >
                  <i className="fas fa-layer-group" /> Subrealms ({subregionsList.length})
                </button>
              )}
              <button
                type="button"
                className={`lore-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="fas fa-book-open" /> Region Lore
              </button>
            </div>

            {activeTab === 'locations' ? (
              <>
                {/* Search Bar with Guaranteed Non-Overlapping Spacing */}
                <div className="lore-controls">
                  <div className="lore-search-wrap">
                    <i className="fas fa-search lore-search-icon" />
                    <input
                      className="lore-search-input"
                      type="text"
                      placeholder={`Search ${stats.total} locations, types, factions…`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        className="lore-search-clear"
                        onClick={() => setSearchTerm('')}
                        title="Clear search"
                      >
                        <i className="fas fa-times" />
                      </button>
                    )}
                  </div>

                  {/* Sleek Horizontal Icon Dock with Live Name Callout */}
                  <div className="lore-category-dock-container">
                    <div className="lore-category-dock" role="toolbar" aria-label="Filter locations by category">
                      {FILTER_CHIPS.map((chip) => {
                        const count = chip.id === 'all'
                          ? enrichedLocations.length
                          : categoryCounts[chip.id] || 0;
                        if (chip.id !== 'all' && count === 0) return null;
                        const isActive = activeFilter === chip.id;
                        return (
                          <div key={chip.id} className="lore-dock-item-wrap">
                            <button
                              type="button"
                              className={`lore-dock-btn ${isActive ? 'active' : ''}`}
                              onClick={() => {
                                setActiveFilter(isActive && chip.id !== 'all' ? 'all' : chip.id);
                              }}
                              onMouseEnter={() => setHoveredCategory(chip.id)}
                              onMouseLeave={() => setHoveredCategory(null)}
                              onTouchStart={() => setHoveredCategory(chip.id)}
                              title={`${chip.label} (${count})`}
                              aria-label={`${chip.label} (${count})`}
                            >
                              <i className={`fas ${chip.icon}`} />
                              {count > 0 && <span className="lore-dock-micro-dot" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Live Category Ribbon (Visible on Hover / Focus / Selection) */}
                    <div className="lore-dock-hover-caption">
                      {hoveredCategoryObj ? (
                        <div className="hover-caption-content animate-fade-in">
                          <i className={`fas ${hoveredCategoryObj.icon}`} />
                          <span className="caption-title">{hoveredCategoryObj.label}</span>
                          <span className="caption-count">
                            {hoveredCategoryObj.id === 'all' ? enrichedLocations.length : categoryCounts[hoveredCategoryObj.id] || 0}
                          </span>
                        </div>
                      ) : activeFilter !== 'all' && activeCategoryObj ? (
                        <div className="hover-caption-content active-ribbon animate-fade-in">
                          <i className={`fas ${activeCategoryObj.icon}`} />
                          <span className="caption-title">Filtered: <strong>{activeCategoryObj.label}</strong></span>
                          <span className="caption-count">{filteredLocations.length}</span>
                          <button
                            type="button"
                            className="caption-clear-btn"
                            onClick={() => setActiveFilter('all')}
                            title="Show all categories"
                          >
                            <i className="fas fa-times" />
                          </button>
                        </div>
                      ) : (
                        <div className="hover-caption-hint">
                          <i className="fas fa-hand-pointer" />
                          <span>Select an icon above to filter by stronghold category</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* List Summary & Collapse/Expand Toggle */}
                <div className="lore-list-header-row">
                  <span className="lore-list-count-text">
                    Showing <strong>{filteredLocations.length}</strong> of {stats.total} locations
                  </span>
                  <button
                    type="button"
                    className="lore-toggle-all-btn"
                    onClick={toggleAllGroups}
                    title="Toggle expand / collapse all groups"
                  >
                    <i className="fas fa-arrows-up-down" /> Toggle All
                  </button>
                </div>

                {/* Grouped Location Accordions in D&D Parchment Style */}
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
                          <div className="lore-group-title">
                            <i className={`fas ${cat.icon} group-icon`} />
                            <span className="group-label">{cat.label}</span>
                            <span className="lore-group-count-pill">{groupLocs.length}</span>
                          </div>
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
                      <i className="fas fa-compass lore-empty-icon" />
                      <h4>No Locations Found</h4>
                      <p>No locations match &ldquo;{searchTerm}&rdquo; in this category.</p>
                      <button
                        type="button"
                        className="lore-empty-reset-btn"
                        onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
                      >
                        Reset Search &amp; Filters
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === 'subregions' ? (
              <div className="lore-subregions-panel">
                <div className="subregion-section-intro">
                  <p>Explore the subrealms and distinct geographic territories within {region.name}.</p>
                </div>
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
                          <span className="lore-detail-label">Key Landmarks ({sub.zoneIds.length}):</span>
                          <div className="lore-subregion-zones-tags">
                            {sub.zoneIds.slice(0, 6).map((zId) => {
                              const z = ZONE_DATA.find((item) => item.id === zId);
                              return (
                                <button
                                  key={zId}
                                  type="button"
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
                        type="button"
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
