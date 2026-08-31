import React, { useState, useEffect } from 'react';
import useWorldStore from '../../store/worldStore';
import useMapStore from '../../store/mapStore';
import useNpcStore from '../../store/npcStore';
import useFactionStore from '../../store/factionStore';
import { showConfirm } from '../../utils/dialogService';
import { SUBREGIONS } from '../../data/subregions';
import LoreLink from '../common/LoreLink';
import { TimelineView } from './TimelineView';
import { sanitizeLoreText, formatDisplayName } from './WorldDashboard';
import './LocationDetail.css';

const getLocationIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'city': return 'fa-city';
    case 'town': case 'settlement': return 'fa-house-chimney-window';
    case 'port': return 'fa-anchor';
    case 'fortress': case 'keep': case 'watchtower': return 'fa-chess-rook';
    case 'wilderness': return 'fa-tree';
    case 'sacred': return 'fa-place-of-worship';
    case 'ruin': return 'fa-dungeon';
    case 'tomb': return 'fa-monument';
    case 'industrial': return 'fa-fire-burner';
    case 'camps': return 'fa-campground';
    default: return 'fa-map-pin';
  }
};

const getSubregionForLocation = (loc, regionId) => {
  if (loc.subregionId && SUBREGIONS[loc.subregionId]) {
    return SUBREGIONS[loc.subregionId];
  }
  const sub = Object.values(SUBREGIONS).find(
    (s) => s.regionId === regionId && s.zoneIds?.includes(loc.id)
  );
  return sub || null;
};

const LocationDetail = ({ locationId, onBack, onClassClick, onFactionClick }) => {
  const { getFullContextForLocation, updateCustomLocation, deleteCustomLocation, activeWorldId } = useWorldStore();
  const { getMapsByLocation } = useMapStore();
  const { getNpcsByLocation } = useNpcStore();
  const [context, setContext] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditLocModal, setShowEditLocModal] = useState(false);
  const [editLocName, setEditLocName] = useState('');
  const [editLocType, setEditLocType] = useState('city');
  const [editLocDesc, setEditLocDesc] = useState('');
  const [editLocSight, setEditLocSight] = useState('');
  const [editLocSound, setEditLocSound] = useState('');
  const [editLocSmell, setEditLocSmell] = useState('');
  const [editLocHook, setEditLocHook] = useState('');

  useEffect(() => {
    const ctx = getFullContextForLocation(locationId);
    setContext(ctx);
  }, [locationId, getFullContextForLocation]);

  const openEditLocModal = () => {
    if (!context?.location) return;
    const loc = context.location;
    setEditLocName(loc.name || '');
    setEditLocType(loc.type || 'city');
    setEditLocDesc(loc.description || loc.overview || '');
    setEditLocSight(loc.sensoryProfile?.sight || '');
    setEditLocSound(loc.sensoryProfile?.sound || '');
    setEditLocSmell(loc.sensoryProfile?.smell || '');
    setEditLocHook(loc.dmHook || '');
    setShowEditLocModal(true);
  };

  const handleEditLocSubmit = (e) => {
    e.preventDefault();
    if (!editLocName.trim()) return;
    updateCustomLocation(activeWorldId, locationId, {
      name: editLocName.trim(),
      type: editLocType,
      description: editLocDesc.trim(),
      overview: editLocDesc.trim(),
      sensoryProfile: { sight: editLocSight.trim(), sound: editLocSound.trim(), smell: editLocSmell.trim(), atmosphere: '' },
      dmHook: editLocHook.trim()
    });
    setShowEditLocModal(false);
    const ctx = getFullContextForLocation(locationId);
    setContext(ctx);
  };

  const handleDeleteLoc = async () => {
    const confirmed = await showConfirm({
      title: 'Delete Hold',
      message: `Delete "${context.location.name}"?`,
      confirmText: 'Delete',
      isDestructive: true
    });
    if (!confirmed) return;
    deleteCustomLocation(activeWorldId, locationId);
    if (onBack) onBack();
  };

  if (!context) {
    return (
      <div className="world-panel location-detail-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={onBack}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <h3>Loading Location Codex...</h3>
        </div>
      </div>
    );
  }

  const { location, region } = context;
  const connectedMaps = getMapsByLocation(locationId);
  const isDeep = location.isDeep;
  const subregion = getSubregionForLocation(location, region?.id);
  const locationNpcs = getNpcsByLocation(locationId);

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'fa-book-open' },
    ...(isDeep ? [{ key: 'atmosphere', label: 'Atmosphere', icon: 'fa-wind' }] : []),
    ...(isDeep && location.subLocations?.length > 0 ? [{ key: 'places', label: `Places (${location.subLocations.length})`, icon: 'fa-landmark' }] : []),
    { key: 'people', label: `People & Factions (${(location.factions || []).length + locationNpcs.length})`, icon: 'fa-users' },
    ...(connectedMaps.length > 0 ? [{ key: 'maps', label: `Maps (${connectedMaps.length})`, icon: 'fa-map' }] : []),
    { key: 'history', label: 'Chronicle & History', icon: 'fa-hourglass-half' }
  ];

  return (
    <div className="world-panel location-detail-panel">
      {/* Refined Location Hero Header */}
      <div className="location-hero-header">
        {/* Row 1: Top Navigation Bar */}
        <div className="location-hero-top-nav">
          <div className="location-nav-left">
            <button className="world-back-btn" onClick={onBack}>
              <i className="fas fa-arrow-left"></i> Back to Holds
            </button>
            <div className="location-breadcrumbs">
              <span className="crumb-link" onClick={onBack}>World</span>
              <i className="fas fa-chevron-right"></i>
              {region && (
                <>
                  <span className="crumb-link" onClick={onBack}>{region.name}</span>
                  <i className="fas fa-chevron-right"></i>
                </>
              )}
              {subregion && (
                <>
                  <span className="crumb-link">{subregion.name}</span>
                  <i className="fas fa-chevron-right"></i>
                </>
              )}
              <span className="current">{sanitizeLoreText(location.name)}</span>
            </div>
          </div>

          <div className="location-nav-right">
            <span className="loc-hero-type-pill">
              <i className={`fas ${getLocationIcon(location.type)}`}></i>
              {formatDisplayName(location.type || 'Holding')}
            </span>
            {subregion && (
              <span className="loc-hero-subregion-pill">
                <i className="fas fa-map-pin"></i> {subregion.name}
              </span>
            )}
            {connectedMaps.length > 0 && (
              <button
                className="btn-loc-hero-action"
                onClick={() => setActiveTab('maps')}
                title="View Connected Maps"
              >
                <i className="fas fa-map-location-dot"></i> Maps ({connectedMaps.length})
              </button>
            )}
            {location.isCustom && (
              <>
                <button className="btn-loc-hero-action" onClick={openEditLocModal} title="Edit Hold" style={{ background: 'rgba(212,175,55,0.18)', borderColor: '#d4af37' }}>
                  <i className="fas fa-pen"></i> Edit
                </button>
                <button className="btn-loc-hero-action" onClick={handleDeleteLoc} title="Delete Hold" style={{ background: 'rgba(180,40,40,0.18)', borderColor: '#a33', color: '#c0392b' }}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Row 2: Hero Main Card */}
        <div className="location-hero-main-card">
          <div className="location-hero-identity">
            <div
              className="location-hero-crest-shield"
              style={{
                background: location.heraldry?.colors
                  ? `linear-gradient(135deg, ${location.heraldry.colors.primary || '#8b5a1a'} 0%, ${location.heraldry.colors.secondary || '#2b1408'} 100%)`
                  : 'radial-gradient(circle at 35% 35%, #8b5a1a 0%, #1a0f05 100%)'
              }}
              title={location.heraldry?.description || location.name}
            >
              <i className={`fas ${getLocationIcon(location.type)}`}></i>
            </div>

            <div className="location-hero-titles-col">
              <h1 className="location-hero-title">{sanitizeLoreText(location.name)}</h1>
              <div className="location-hero-tagline-row">
                {location.history?.founded && (
                  <span className="tagline-item">
                    <i className="fas fa-hourglass-start"></i>
                    <span><strong>Founded:</strong> {location.history.founded}</span>
                  </span>
                )}
                {location.leadership?.title && (
                  <>
                    <span className="tagline-divider">·</span>
                    <span className="tagline-item">
                      <i className="fas fa-crown"></i>
                      <span><strong>Seat of:</strong> {location.leadership.title}</span>
                    </span>
                  </>
                )}
                {location.population && (
                  <>
                    <span className="tagline-divider">·</span>
                    <span className="tagline-item">
                      <i className="fas fa-users"></i>
                      <span><strong>{location.population.toLocaleString()}</strong> Inhabitants</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="location-hero-capsules-group">
            {location.leadership?.title && (
              <div className="loc-hero-capsule" title={`Ruler: ${location.leadership.title}`}>
                <span className="capsule-val">{location.leadership.title}</span>
                <span className="capsule-lbl">Authority</span>
              </div>
            )}
            {location.defenses?.militiaSize ? (
              <div className="loc-hero-capsule" title="Garrison Militia Size">
                <span className="capsule-val">{location.defenses.militiaSize} Troops</span>
                <span className="capsule-lbl">Garrison</span>
              </div>
            ) : null}
            {location.economy?.status && (
              <div className="loc-hero-capsule" title="Economic Standing">
                <span className="capsule-val">{formatDisplayName(location.economy.status)}</span>
                <span className="capsule-lbl">Economy</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="world-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`world-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon && <i className={`fas ${tab.icon}`} style={{ marginRight: '6px' }} />}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="world-tab-content">
        {activeTab === 'overview' && <OverviewTab context={context} />}
        {activeTab === 'atmosphere' && isDeep && <AtmosphereTab location={location} />}
        {activeTab === 'places' && isDeep && <PlacesTab location={location} />}
        {activeTab === 'people' && (
          <PeopleTab
            context={context}
            locationNpcs={locationNpcs}
            onClassClick={onClassClick}
            onFactionClick={onFactionClick}
          />
        )}
        {activeTab === 'maps' && <MapsTab connectedMaps={connectedMaps} />}
        {activeTab === 'history' && <LocationHistoryTab location={location} locationId={locationId} />}
      </div>

      {/* Edit Hold Modal (custom only) */}
      {showEditLocModal && (
        <div className="world-modal-overlay" onClick={() => setShowEditLocModal(false)}>
          <div className="world-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="world-modal-header">
              <div className="world-modal-title"><i className="fas fa-pen"></i><h3>Edit Hold: {location?.name}</h3></div>
              <button className="world-modal-close" onClick={() => setShowEditLocModal(false)}><i className="fas fa-times"></i></button>
            </div>
            <form onSubmit={handleEditLocSubmit}>
              <div className="world-modal-body">
                <div className="world-form-group"><label>Hold Name *</label><input type="text" required value={editLocName} onChange={(e) => setEditLocName(e.target.value)} autoFocus /></div>
                <div className="world-form-group"><label>Category</label>
                  <select value={editLocType} onChange={(e) => setEditLocType(e.target.value)}>
                    <option value="city">Major City / Metropolis</option>
                    <option value="settlement">Town / Village</option>
                    <option value="fortress">Fortress / Keep / Bastion</option>
                    <option value="port">Port / Coastal Harbor</option>
                    <option value="ruin">Ancient Ruin / Monolith</option>
                    <option value="tomb">Crypt / Vault / Tomb</option>
                    <option value="wilderness">Wilderness / Sacred Site</option>
                  </select>
                </div>
                <div className="world-form-group"><label>Description &amp; Codex Overview</label><textarea rows={3} value={editLocDesc} onChange={(e) => setEditLocDesc(e.target.value)} /></div>
                <div className="world-form-group"><label><i className="fas fa-eye"></i> Sight / Sound / Smell</label>
                  <div className="world-form-row">
                    <input type="text" placeholder="Sight" value={editLocSight} onChange={(e) => setEditLocSight(e.target.value)} />
                    <input type="text" placeholder="Sound" value={editLocSound} onChange={(e) => setEditLocSound(e.target.value)} />
                  </div>
                  <input type="text" style={{ marginTop: '8px' }} placeholder="Smell" value={editLocSmell} onChange={(e) => setEditLocSmell(e.target.value)} />
                </div>
                <div className="world-form-group"><label><i className="fas fa-mask"></i> GM Secret / Plot Hook</label><input type="text" value={editLocHook} onChange={(e) => setEditLocHook(e.target.value)} /></div>
              </div>
              <div className="world-modal-actions">
                <button type="button" className="world-action-btn" onClick={() => setShowEditLocModal(false)}>Cancel</button>
                <button type="submit" className="world-action-btn primary"><i className="fas fa-save"></i> Save Hold</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OverviewTab = ({ context }) => {
  const { location } = context;

  return (
    <div className="world-section-stack">
      <section className="world-section">
        <h3><i className="fas fa-scroll" /> Holding Codex</h3>
        <p className="world-prose">{sanitizeLoreText(location.description)}</p>
      </section>

      {location.isDeep && (
        <>
          <div className="world-stat-grid">
            {location.population && (
              <div className="world-stat">
                <span className="world-stat-value">{location.population.toLocaleString()}</span>
                <span className="world-stat-label">Population</span>
              </div>
            )}
            {location.defenses?.militiaSize && (
              <div className="world-stat">
                <span className="world-stat-value">{location.defenses.militiaSize}</span>
                <span className="world-stat-label">Militia</span>
              </div>
            )}
            {location.economy && (
              <div className="world-stat">
                <span className="world-stat-value">{formatDisplayName(location.economy.status)}</span>
                <span className="world-stat-label">Economy</span>
              </div>
            )}
          </div>

          {location.leadership && (
            <section className="world-section">
              <h3><i className="fas fa-crown" /> Leadership &amp; Governance</h3>
              <div className="world-info-card">
                <span className="world-badge">{formatDisplayName(location.leadership.type || 'ruling_seat')}</span>
                <h4>{location.leadership.title}</h4>
                <p>{sanitizeLoreText(location.leadership.description)}</p>
              </div>
            </section>
          )}

          {location.economy && (
            <section className="world-section">
              <h3><i className="fas fa-coins" /> Economy &amp; Trade</h3>
              <p><strong>Primary:</strong> {location.economy.primary}</p>
              {location.economy.secondary?.length > 0 && (
                <p><strong>Secondary:</strong> {location.economy.secondary.join(', ')}</p>
              )}
            </section>
          )}

          {location.defenses && (
            <section className="world-section">
              <h3><i className="fas fa-shield-halved" /> Fortifications &amp; Defenses</h3>
              <p>{location.defenses.fortifications}</p>
              <p className="world-card-meta">{location.defenses.watchPresence}</p>
            </section>
          )}
        </>
      )}

      {location.history && (
        <section className="world-section">
          <h3><i className="fas fa-hourglass-start" /> Founding Origins</h3>
          <div className="world-info-card">
            <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '12.5px', color: '#8b5a1a', flexWrap: 'wrap' }}>
              {location.history.founded && (
                <span><strong><i className="fas fa-calendar-alt" /> Founded:</strong> {location.history.founded}</span>
              )}
              {location.history.foundedBy && (
                <span><strong><i className="fas fa-crown" /> By:</strong> {location.history.foundedBy}</span>
              )}
            </div>
            {location.history.foundingStory && (
              <p>{sanitizeLoreText(location.history.foundingStory)}</p>
            )}
          </div>
        </section>
      )}

      {location.travelConnections && location.travelConnections.length > 0 && (
        <section className="world-section">
          <h3><i className="fas fa-signs-post" /> Travel Connections</h3>
          <div className="world-card-grid">
            {location.travelConnections.map((conn, i) => (
              <div key={i} className="world-info-card">
                <h4><LoreLink termId={conn.destinationId}>{formatDisplayName(conn.destinationId)}</LoreLink></h4>
                <span className="world-card-meta">{conn.route}</span>
                <p>{conn.distance} · {conn.travelTime}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const AtmosphereTab = ({ location }) => (
  <div className="world-section-stack">
    {location.atmosphere && (
      <>
        <section className="world-section">
          <h3>Mood</h3>
          <p className="world-prose">{location.atmosphere.mood}</p>
        </section>
        <section className="world-section">
          <h3>Architecture</h3>
          <p className="world-prose">{location.atmosphere.architecture}</p>
        </section>
        <div className="world-sense-grid">
          <div className="world-sense-card">
            <h4><i className="fas fa-volume-up" /> Sounds</h4>
            <p>{location.atmosphere.sounds}</p>
          </div>
          <div className="world-sense-card">
            <h4><i className="fas fa-wind" /> Smells</h4>
            <p>{location.atmosphere.smells}</p>
          </div>
          <div className="world-sense-card">
            <h4><i className="fas fa-lightbulb" /> Lighting</h4>
            <p>{location.atmosphere.lighting}</p>
          </div>
        </div>
      </>
    )}
  </div>
);

const PlacesTab = ({ location }) => (
  <div className="world-section-stack">
    <section className="world-section">
      <h3>Notable Places</h3>
      <div className="world-card-grid">
        {(location.subLocations || []).map((sl) => (
          <div key={sl.id} className="world-info-card">
            <span className="world-badge">{sl.type?.replace(/_/g, ' ')}</span>
            <h4>{sl.name}</h4>
            <p>{sl.description}</p>
            {sl.proprietor && (
              <p className="world-card-meta"><strong>{sl.proprietor}</strong></p>
            )}
            {sl.notableFeatures && sl.notableFeatures.length > 0 && (
              <ul className="world-feature-list">
                {sl.notableFeatures.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  </div>
);

const PeopleTab = ({ context, locationNpcs, onClassClick, onFactionClick }) => {
  const { location, classesPracticed } = context;
  const factionPresence = location.isDeep ? (location.factionPresence || []) : [];
  const rawFactions = location.factions || [];

  return (
    <div className="world-section-stack">
      {/* Notable Characters / NPCs Roster */}
      {locationNpcs && locationNpcs.length > 0 && (
        <section className="world-section">
          <h3><i className="fas fa-users-viewfinder" /> Notable Inhabitants &amp; Personages</h3>
          <div className="npc-roster-grid">
            {locationNpcs.map((npc) => (
              <div key={npc.id} className="npc-codex-card">
                <div className="npc-card-header">
                  <div className="npc-avatar-shield">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="npc-card-title-box">
                    <h4>{npc.name}</h4>
                    <span className="npc-role-tag">{npc.title}</span>
                  </div>
                </div>

                <div className="npc-meta-pills">
                  {npc.race && <span className="npc-meta-pill"><i className="fas fa-dna"></i> {npc.race}</span>}
                  {npc.status && <span className="npc-meta-pill"><i className="fas fa-heart-pulse"></i> {npc.status}</span>}
                </div>

                {npc.appearance && (
                  <p className="npc-backstory-prose">
                    <strong>Appearance:</strong> {npc.appearance}
                  </p>
                )}

                {npc.backstory && (
                  <p className="npc-backstory-prose">
                    {sanitizeLoreText(npc.backstory)}
                  </p>
                )}

                {npc.hooks && npc.hooks.length > 0 && (
                  <div className="npc-hooks-box">
                    <div className="npc-hooks-title">
                      <i className="fas fa-dice-d20"></i> DM Adventure Hooks
                    </div>
                    <ul className="npc-hooks-list">
                      {npc.hooks.map((hook, i) => (
                        <li key={i}>{sanitizeLoreText(hook)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {classesPracticed && classesPracticed.length > 0 && (
        <section className="world-section">
          <h3><i className="fas fa-hat-wizard" /> Class Affinities</h3>
          <div className="world-tag-list">
            {classesPracticed.map((c) => (
              <button
                key={c.id}
                className="world-tag world-tag-clickable"
                onClick={() => onClassClick && onClassClick(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="world-section">
        <h3><i className="fas fa-shield-halved" /> Faction Presence</h3>
        {factionPresence.length > 0 ? (
          <div className="world-card-grid">
            {factionPresence.map((fp, i) => (
              <div
                key={i}
                className="world-info-card world-clickable"
                onClick={() => onFactionClick && onFactionClick(fp.factionId)}
              >
                <span className={`world-badge world-badge-${fp.influence}`}>{fp.influence}</span>
                <h4>{formatDisplayName(fp.factionId)}</h4>
                <p>{fp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="world-tag-list">
            {rawFactions.map((f, i) => (
              <span key={i} className="world-tag">{formatDisplayName(f)}</span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const MapsTab = ({ connectedMaps }) => (
  <div className="world-section-stack">
    <section className="world-section">
      <h3><i className="fas fa-map" /> Connected Maps</h3>
      {connectedMaps.length === 0 ? (
        <p className="world-muted">No maps linked to this location yet. Use the Map Editor to link battlemaps here.</p>
      ) : (
        <div className="world-card-grid">
          {connectedMaps.map((map) => (
            <div key={map.id} className="world-info-card world-map-card">
              <h4>{map.name}</h4>
              <span className="world-card-meta">
                {map.worldContext?.isOverworld ? 'Region Map' : 'Battlemap'}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  </div>
);

const LocationHistoryTab = ({ location, locationId }) => (
  <div className="world-section-stack">
    {location.history && (
      <section className="world-section">
        <h3><i className="fas fa-hourglass-start" /> Founding &amp; Historical Origins</h3>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', fontSize: '13px', color: '#8b5a1a', flexWrap: 'wrap' }}>
          {location.history.founded && (
            <span><strong><i className="fas fa-calendar-alt" /> Founded:</strong> {location.history.founded}</span>
          )}
          {location.history.foundedBy && (
            <span><strong><i className="fas fa-crown" /> By:</strong> {location.history.foundedBy}</span>
          )}
        </div>
        {location.history.foundingStory && (
          <p className="world-prose">{sanitizeLoreText(location.history.foundingStory)}</p>
        )}
        {location.history.significantEvents && location.history.significantEvents.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ color: '#5a2e12', fontFamily: 'Cinzel, serif', fontSize: '14px', marginBottom: '10px' }}>
              <i className="fas fa-flag" /> Key Historical Milestones
            </h4>
            <div className="world-timeline-mini">
              {location.history.significantEvents.map((evt, i) => (
                <div key={i} className="world-timeline-item">
                  <span className="world-timeline-date">{evt.date}</span>
                  <p>{evt.event}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    )}

    <section className="world-section">
      <h3><i className="fas fa-scroll" /> Canonical Chronicle Records</h3>
      <TimelineView filterLocationId={locationId} compact />
    </section>
  </div>
);

export default LocationDetail;
