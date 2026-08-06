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

// ╔═════════════════════════════════════════════════════════════════════════╗
// ║  ⚑ DEMO EXAMPLES: easy to show the new grouped/filter/overview UI.      ║
// ║  Flip EXAMPLES_ENABLED to false (or delete this whole block) when        ║
// ║  you're done looking. Example entries are tagged `__example: true`.      ║
// ╚═════════════════════════════════════════════════════════════════════════╝
const EXAMPLES_ENABLED = false;
const EXAMPLE_LOCATIONS = [
  { id: '__ex_blackiron',   name: 'Example: Blackiron City',     type: 'city',       description: 'A smog-laden smelting capital built around a dying volcanic vent. Bells ring shift-changes every six hours.' },
  { id: '__ex_mossford',    name: 'Example: Mossford Village',    type: 'settlement', description: 'A moss-roofed farming village on a slow river. Famous for its honey-fermented ale.' },
  { id: '__ex_howling',     name: 'Example: The Howling Tundra',  type: 'wilderness', description: 'A wind-scoured plain where the grass itself whispers at night. Few who sleep there wake rested.' },
  { id: '__ex_grimspire',   name: 'Example: Grimspire Peaks',     type: 'mountain',   description: 'Jagged black peaks said to be the petrified teeth of a buried god. Climbers vanish above the cloud line.' },
  { id: '__ex_dustfalls',   name: 'Example: Dustfalls Ruin',      type: 'ruin',       description: 'The cracked remains of a pre-Dimming observatory. Sand pours endlessly from its shattered dome.' },
  { id: '__ex_whispertomb', name: 'Example: Whispering Tomb',     type: 'tomb',       description: 'A sealed barrow whose entrance breathes warm air in winter. The names on its door are crossed out.' },
  { id: '__ex_trappers',    name: "Example: Trapper's Camp",      type: 'camp',       description: 'A seasonal fur-trader camp on a frozen lake. Smoke, sled-dogs, and a circle of ever-burning torches.' },
  { id: '__ex_scoutnote',   name: 'Example (Scout’s Chalk Note',   type: 'custom',     description: 'A hand-scrawled marker on a boulder: "Wyrm tracks) three days fresh. Heading north.: V."' }
];

const LoreSidebar = ({ regionId, selectedLocationId, setSelectedLocationId, open, onClose, currentCampaign, onEnterSubregionMap }) => {
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
    // Ensure the owning group is expanded so the scroll target is visible.
    setCollapsedGroups((prev) => {
      if (!prev.size) return prev;
      const next = new Set(prev);
      // We don't know the category here without the data, so just clear all
      // collapses to guarantee reveal of the selected location.
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

    // ⚑ DEMO EXAMPLES: inject example entries into whatever region is open,
    // tagged onto the current regionId so they always render. Delete with the
    // EXAMPLE block at the top of this file.
    if (EXAMPLES_ENABLED && regionId && out.length === 0) {
      EXAMPLE_LOCATIONS.forEach((ex) => {
        out.push({ ...ex, regionId, isDeep: false, __example: true });
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
    enrichedLocations.forEach((l) => { byCat[categorize(l.type)] += 1; });
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

  // Now that all hooks have run, bail out if there's nothing to render.
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
                (REGION_POLYGONS[regionId]?.hasSubregionMap || onEnterSubregionMap) && (
                  <button
                    className="lore-enter-subregion-btn animate-fade-in"
                    onClick={() => onEnterSubregionMap && onEnterSubregionMap(regionId)}
                  >
                    <i className="fas fa-compass"></i> Focus {region.name} Map
                  </button>
                )
              ) : (
                <>
                  {REGION_POLYGONS[regionId]?.hasSubregionMap && onEnterSubregionMap && (
                    <button
                      className="lore-enter-subregion-btn animate-fade-in"
                      onClick={() => onEnterSubregionMap(regionId)}
                    >
                      <i className="fas fa-compass" /> Open Regional Cartography
                    </button>
                  )}
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
                <div className="lore-locations-grouped">
                  {filteredLocations.length === 0 ? (
                    <div className="lore-empty-state-card animate-fade-in">
                      <div className="empty-card-icon"><i className="fas fa-drafting-compass" /></div>
                      <h4>Uncharted Realm Territory</h4>
                      <p>No location pins have been recorded here yet. As GM or Adventurer, you can explore the regional map or draw custom subregions!</p>
                      {(REGION_POLYGONS[regionId]?.hasSubregionMap || onEnterSubregionMap) && (
                        <button
                          className="btn-explore-sub-realm"
                          onClick={() => onEnterSubregionMap && onEnterSubregionMap(regionId)}
                        >
                          <i className="fas fa-compass" /> Open Regional Cartography
                        </button>
                      )}
                    </div>
                  ) : (
                    CATEGORIES.map((cat) => {
                      const catLocs = filteredLocations.filter((l) => categorize(l.type) === cat.id);
                      if (catLocs.length === 0) return null;
                      const collapsed = collapsedGroups.has(cat.id);
                      return (
                        <div key={cat.id} className="lore-sidebar-group">
                          <button
                            className={`lore-sidebar-group-header ${collapsed ? 'collapsed' : ''} group-header-${cat.id}`}
                            onClick={() => toggleGroup(cat.id)}
                          >
                            <i className={`fas fa-chevron-right lore-sidebar-group-caret`} />
                            <i className={`fas ${cat.icon} lore-sidebar-group-icon`} />
                            <span className="lore-sidebar-group-title">{cat.label}</span>
                            <span className="lore-sidebar-group-count">{catLocs.length}</span>
                          </button>
                          {!collapsed && (
                            <div className="lore-locations-list">
                              {catLocs.map(renderLocationCard)}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : activeTab === 'subregions' ? (
              <div className="lore-subregions-tab-content animate-fade-in">
                <p className="subregion-section-intro">
                  Geographical provinces and micro-climates within <strong>{region.name}</strong>:
                </p>
                <div className="subregion-cards-list">
                  {subregionsList.map((sub) => (
                    <div key={sub.id} className="subregion-lore-card">
                      <div className="subregion-card-header">
                        <h4><i className="fas fa-mountain-sun" /> {sub.name}</h4>
                      </div>
                      <p className="subregion-card-desc">{sub.description}</p>
                      
                      <div className="subregion-meta-grid">
                        {sub.climate && (
                          <div className="subregion-meta-item">
                            <span className="meta-label">Climate:</span>
                            <span className="meta-val">{sub.climate}</span>
                          </div>
                        )}
                        {sub.dominantTerrain && (
                          <div className="subregion-meta-item">
                            <span className="meta-label">Terrain:</span>
                            <span className="meta-val">{sub.dominantTerrain}</span>
                          </div>
                        )}
                        {sub.primaryFactions && sub.primaryFactions.length > 0 && (
                          <div className="subregion-meta-item">
                            <span className="meta-label">Factions:</span>
                            <span className="meta-val">{sub.primaryFactions.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      <div className="subregion-card-actions">
                        <button
                          className="btn-open-subregion"
                          onClick={() => onEnterSubregionMap && onEnterSubregionMap(sub.id || regionId)}
                        >
                          <i className="fas fa-compass" /> Enter {sub.name} Map
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="lore-overview-tab-content animate-fade-in">
                <div className="lore-sidebar-section">
                  <h3 className="lore-section-title">
                    <i className="fas fa-scroll" /> Lore &amp; Overview
                  </h3>
                  <p className="lore-tab-description">{region?.loreOverview || region?.description}</p>
                </div>

                {region?.ruler && (
                  <div className="lore-sidebar-section">
                    <h3 className="lore-section-title">
                      <i className="fas fa-crown" /> Sovereign &amp; Governance
                    </h3>
                    <p className="lore-tab-description"><strong>Ruler:</strong> {region.ruler}</p>
                  </div>
                )}

                {(region?.climate || region?.dominantTerrain) && (
                  <div className="lore-sidebar-section">
                    <h3 className="lore-section-title">
                      <i className="fas fa-snowflake" /> Environment &amp; Climate
                    </h3>
                    {region.climate && <p className="lore-tab-description"><strong>Climate:</strong> {region.climate}</p>}
                    {region.dominantTerrain && <p className="lore-tab-description" style={{ marginTop: 4 }}><strong>Terrain:</strong> {region.dominantTerrain}</p>}
                  </div>
                )}

                {region?.historyLore && (
                  <div className="lore-sidebar-section">
                    <h3 className="lore-section-title">
                      <i className="fas fa-book" /> History &amp; The Glacier Bargain
                    </h3>
                    <p className="lore-tab-description">{region.historyLore}</p>
                  </div>
                )}

                {region?.primaryRaces && region.primaryRaces.length > 0 && (
                  <div className="lore-sidebar-section">
                    <h3 className="lore-section-title">
                      <i className="fas fa-users" /> Peoples &amp; Demographics
                    </h3>
                    <div className="lore-tags-container">
                      {region.primaryRaces.map((r, i) => (
                        <span key={i} className="lore-tag-chip">{r}</span>
                      ))}
                    </div>
                  </div>
                )}

                {region?.primaryFactions && region.primaryFactions.length > 0 && (
                  <div className="lore-sidebar-section">
                    <h3 className="lore-section-title">
                      <i className="fas fa-shield-halved" /> Ruling Factions &amp; Powers
                    </h3>
                    <div className="lore-tags-container">
                      {region.primaryFactions.map((f, i) => (
                        <span key={i} className="lore-tag-chip faction">{f}</span>
                      ))}
                    </div>
                  </div>
                )}

                {region?.threats && region.threats.length > 0 && (
                  <div className="lore-sidebar-section">
                    <h3 className="lore-section-title">
                      <i className="fas fa-skull" /> Regional Perils &amp; Threats
                    </h3>
                    <ul className="lore-threats-list">
                      {region.threats.map((t, i) => (
                        <li key={i}><i className="fas fa-skull-crossbones" /> {t}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Region details grid */}
                <div className="lore-sidebar-section">
                  <h3 className="lore-section-title">
                    <i className="fas fa-compass" /> Region Metrics
                  </h3>
                  <div className="lore-detail-grid">
                    <div className="lore-detail-item">
                      <span className="lore-detail-label">Subrealms</span>
                      <span className="lore-detail-value">{subregionsList.length}</span>
                    </div>
                    <div className="lore-detail-item">
                      <span className="lore-detail-label">Settlements</span>
                      <span className="lore-detail-value">{stats.byCat.civic}</span>
                    </div>
                    <div className="lore-detail-item">
                      <span className="lore-detail-label">Wilds</span>
                      <span className="lore-detail-value">{stats.byCat.wilderness}</span>
                    </div>
                    <div className="lore-detail-item">
                      <span className="lore-detail-label">Ruins &amp; Mysteries</span>
                      <span className="lore-detail-value">{stats.byCat.ruins}</span>
                    </div>
                  </div>
                </div>

                <div className="lore-sidebar-section region-immerse-section">
                  <button className="region-immerse-btn" disabled title="Coming in a future update">
                    <i className="fas fa-compass" />
                    Immerse: Explore {region?.name || 'Region'}
                    <span className="region-immerse-badge">Soon</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default LoreSidebar;
