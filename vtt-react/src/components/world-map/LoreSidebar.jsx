import React, { useEffect, useMemo, useRef, useState } from 'react';
import useWorldStore from '../../store/worldStore';
import { getEnrichedZone } from '../../data/deepLocationData';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { REGION_POLYGONS } from '../../data/regionPolygons';
import { ZONE_DATA } from '../../data/zoneData';
import './LoreSidebar.css';

const DANGER_LABELS = {
  low: { label: 'Low', color: '#8fa882' },
  medium: { label: 'Moderate', color: '#ffb74d' },
  high: { label: 'High', color: '#ff8a65' },
  extreme: { label: 'Extreme', color: '#ff5252' }
};

const ZONE_TYPE_ICONS = {
  city: 'fa-city',
  settlement: 'fa-house',
  wilderness: 'fa-tree',
  ruin: 'fa-archway',
  tomb: 'fa-skull'
};

// Location categories for grouping/filtering
const CATEGORIES = [
  { id: 'civic',      label: 'Cities & Settlements', icon: 'fa-city',      match: ['city', 'settlement', 'fortress', 'house', 'port', 'tower'] },
  { id: 'wilderness', label: 'Wilds & Wilderness',   icon: 'fa-tree',      match: ['wilderness', 'mountain', 'tree', 'water', 'beast'] },
  { id: 'ruins',      label: 'Ruins & Mysteries',    icon: 'fa-archway',   match: ['ruin', 'tomb', 'cave', 'shrine', 'magic', 'door'] },
  { id: 'camps',      label: 'Camps & Custom Marks', icon: 'fa-fire',      match: ['camp', 'custom'] }
];

const categorize = (type) => {
  for (const cat of CATEGORIES) {
    if (cat.match.includes(type)) return cat.id;
  }
  return 'camps';
};

const FILTER_CHIPS = [{ id: 'all', label: 'All', icon: 'fa-layer-group' }, ...CATEGORIES];

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  ⚑ DEMO EXAMPLES — easy to show the new grouped/filter/overview UI.  ║
// ║  Flip EXAMPLES_ENABLED to false (or delete this whole block) when     ║
// ║  you're done looking. Example entries are tagged `__example: true`.   ║
// ╚══════════════════════════════════════════════════════════════════════╝
const EXAMPLES_ENABLED = true;
const EXAMPLE_LOCATIONS = [
  { id: '__ex_blackiron',   name: 'Example — Blackiron City',     type: 'city',       description: 'A smog-laden smelting capital built around a dying volcanic vent. Bells ring shift-changes every six hours.' },
  { id: '__ex_mossford',    name: 'Example — Mossford Village',    type: 'settlement', description: 'A moss-roofed farming village on a slow river. Famous for its honey-fermented ale.' },
  { id: '__ex_howling',     name: 'Example — The Howling Tundra',  type: 'wilderness', description: 'A wind-scoured plain where the grass itself whispers at night. Few who sleep there wake rested.' },
  { id: '__ex_grimspire',   name: 'Example — Grimspire Peaks',     type: 'mountain',   description: 'Jagged black peaks said to be the petrified teeth of a buried god. Climbers vanish above the cloud line.' },
  { id: '__ex_dustfalls',   name: 'Example — Dustfalls Ruin',      type: 'ruin',       description: 'The cracked remains of a pre-Dimming observatory. Sand pours endlessly from its shattered dome.' },
  { id: '__ex_whispertomb', name: 'Example — Whispering Tomb',     type: 'tomb',       description: 'A sealed barrow whose entrance breathes warm air in winter. The names on its door are crossed out.' },
  { id: '__ex_trappers',    name: "Example — Trapper's Camp",      type: 'camp',       description: 'A seasonal fur-trader camp on a frozen lake. Smoke, sled-dogs, and a circle of ever-burning torches.' },
  { id: '__ex_scoutnote',   name: 'Example — Scout’s Chalk Note',   type: 'custom',     description: 'A hand-scrawled marker on a boulder: "Wyrm tracks — three days fresh. Heading north. — V."' }
];

const LoreSidebar = ({ regionId, selectedLocationId, setSelectedLocationId, open, onClose, currentCampaign }) => {
  const { getRegion, lockedRegions, unlockRegion } = useWorldStore();
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [collapsedGroups, setCollapsedGroups] = useState(() => new Set());
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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

  const region = getRegion(regionId);
  const danger = DANGER_LABELS[region?.dangerLevel] || DANGER_LABELS.medium;
  const regionAccent = REGION_POLYGONS[regionId]?.glowColor || 'rgba(196, 164, 74, 0.6)';

  // Resolve placed pins for this region into enriched location objects.
  const enrichedLocations = useMemo(() => {
    const out = [];
    Object.entries(LOCATION_COORDINATES).forEach(([pinId, coord]) => {
      const zone = ZONE_DATA.find((z) => z.id === pinId);
      const belongs =
        (zone && zone.regionId === regionId) || coord.regionId === regionId;
      if (!belongs) return;

      if (zone) {
        const e = getEnrichedZone(pinId);
        if (e) out.push(e);
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
    });

    // ⚑ DEMO EXAMPLES — inject example entries into whatever region is open,
    // tagged onto the current regionId so they always render. Delete with the
    // EXAMPLE block at the top of this file.
    if (EXAMPLES_ENABLED && regionId) {
      EXAMPLE_LOCATIONS.forEach((ex) => {
        out.push({ ...ex, regionId, isDeep: false, __example: true });
      });
    }

    return out;
  }, [regionId, currentCampaign]);

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

  const isLocked = lockedRegions?.includes(regionId);

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
            <span className="lore-location-danger" style={{ color: DANGER_LABELS[loc.dangerLevel]?.color || '#888' }}>
              {loc.dangerLevel}
            </span>
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
        {region && isLocked ? (
          <div className="lore-locked-container">
            <div className="lore-sidebar-header">
              <div className="lore-danger-badge" style={{ borderColor: danger.color }}>
                <span style={{ color: danger.color }}>{danger.label}</span>
              </div>
              <h2 className="lore-region-name">{region.name}</h2>
              <p className="lore-region-desc">{region.description}</p>
            </div>
            <div className="lore-locked-content animate-fade-in">
              <div className="lore-lock-shield">
                <i className="fas fa-lock" />
              </div>
              <h4 className="lore-locked-title" style={{ fontFamily: "'Cinzel', serif", color: '#ebd5a3', margin: '0 0 8px 0', fontSize: '15px' }}>Unexplored Territory</h4>
              <p className="lore-lock-text">
                This region is currently locked under the campaign's exploration guide.
                Exploration is recommended for characters of higher levels.
              </p>
              <button className="lore-unlock-btn" onClick={() => unlockRegion(regionId)}>
                <i className="fas fa-key" /> Unlock Region &amp; Reveal Lore
              </button>
            </div>
          </div>
        ) : region ? (
          <>
            <div className="lore-sidebar-header">
              <div className="lore-danger-badge" style={{ borderColor: danger.color }}>
                <span style={{ color: danger.color }}>{danger.label}</span>
              </div>
              <h2 className="lore-region-name">{region.name}</h2>
              <p className="lore-region-desc">{region.description}</p>
            </div>

            {/* Region overview stat strip */}
            <div className="lore-overview-strip">
              <div className="lore-overview-stat">
                <span className="lore-overview-stat-value">{stats.total}</span>
                <span className="lore-overview-stat-label">Locations</span>
              </div>
              <div className="lore-overview-divider" />
              <div className="lore-overview-stat">
                <span className="lore-overview-stat-value" style={{ color: danger.color }}>{danger.label}</span>
                <span className="lore-overview-stat-label">Danger</span>
              </div>
              <div className="lore-overview-divider" />
              <div className="lore-overview-stat wide">
                <span className="lore-overview-stat-value small">
                  {stats.major || '—'}
                </span>
                <span className="lore-overview-stat-label">Seat</span>
              </div>
            </div>

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

            {/* ⚑ DEMO EXAMPLES banner — remove with the EXAMPLE block at top of file */}
            {EXAMPLES_ENABLED && (
              <div className="lore-examples-banner">
                <i className="fas fa-flask" />
                <span>Showing <strong>{EXAMPLE_LOCATIONS.length}</strong> demo locations across all categories.</span>
                <span className="lore-examples-hint">Set <code>EXAMPLES_ENABLED = false</code> in LoreSidebar.jsx to hide.</span>
              </div>
            )}

            {/* Grouped locations */}
            <div className="lore-locations-grouped">
              {filteredLocations.length === 0 ? (
                <div className="lore-empty-state">
                  <i className="fas fa-search-minus" />
                  <p>No locations match your search.</p>
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

            {/* Region details */}
            <div className="lore-sidebar-section">
              <h3 className="lore-section-title">
                <i className="fas fa-compass" /> Region Details
              </h3>
              <div className="lore-detail-grid">
                <div className="lore-detail-item">
                  <span className="lore-detail-label">Danger Level</span>
                  <span className="lore-detail-value" style={{ color: danger.color }}>{danger.label}</span>
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
          </>
        ) : null}
      </div>
    </div>
  );
};

export default LoreSidebar;
