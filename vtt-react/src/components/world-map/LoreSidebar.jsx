import React, { useEffect, useRef } from 'react';
import useWorldStore from '../../store/worldStore';
import { getEnrichedZonesByRegion, getEnrichedZone } from '../../data/deepLocationData';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { ZONE_DATA } from '../../data/zoneData';
import './LoreSidebar.css';

const DANGER_LABELS = {
  low: { label: 'Low', color: '#4a6741' },
  medium: { label: 'Moderate', color: '#8B6914' },
  high: { label: 'High', color: '#8B2020' },
  extreme: { label: 'Extreme', color: '#6B1A1A' }
};

const ZONE_TYPE_ICONS = {
  city: 'fa-city',
  settlement: 'fa-house',
  wilderness: 'fa-tree',
  ruin: 'fa-archway',
  tomb: 'fa-skull'
};

const LoreSidebar = ({ regionId, selectedLocationId, setSelectedLocationId, open, onClose, currentCampaign }) => {
  const { getRegion, lockedRegions, unlockRegion } = useWorldStore();
  const [expandedLocation, setExpandedLocation] = React.useState(null);
  const containerRef = useRef(null);

  // Automatically expand and scroll to the selected pin location when selectedLocationId changes
  useEffect(() => {
    if (selectedLocationId) {
      setExpandedLocation(selectedLocationId);
      const timer = setTimeout(() => {
        const el = document.getElementById(`lore-loc-${selectedLocationId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedLocationId]);

  if (!open || !regionId) return null;

  const region = getRegion(regionId);
  const danger = DANGER_LABELS[region?.dangerLevel] || DANGER_LABELS.medium;

  // Dynamically resolve placed pins for this region
  const regionPins = Object.entries(LOCATION_COORDINATES)
    .filter(([pinId, coord]) => {
      const zone = ZONE_DATA.find(z => z.id === pinId);
      if (zone) return zone.regionId === regionId;
      return coord.regionId === regionId;
    });

  const enrichedLocations = regionPins.map(([pinId, coord]) => {
    const zone = ZONE_DATA.find(z => z.id === pinId);
    if (zone) {
      return getEnrichedZone(pinId);
    }

    let name = '';
    let description = '';
    let type = coord.pinType || 'custom';

    if (coord.source === 'campaignLocation') {
      const campLoc = currentCampaign?.campaignData?.locations?.find(l => String(l.id) === String(coord.sourceId));
      name = campLoc ? campLoc.name : `Campaign Loc (${coord.sourceId})`;
      description = campLoc ? (campLoc.description || campLoc.notes || 'No description provided.') : '';
      type = 'settlement';
    } else if (coord.source === 'campaignLore') {
      const campLore = currentCampaign?.campaignData?.homebrew?.lore?.find(l => String(l.id) === String(coord.sourceId));
      name = campLore ? campLore.title : `Campaign Lore (${coord.sourceId})`;
      description = campLore ? (campLore.content || campLore.notes || 'No description provided.') : '';
      type = 'wilderness';
    } else if (coord.source === 'custom') {
      name = coord.name || 'Custom POI';
      description = coord.description || 'No description provided.';
      type = coord.pinType || 'custom';
    }

    return {
      id: pinId,
      regionId,
      name,
      description,
      type,
      isDeep: false
    };
  });

  const isLocked = lockedRegions?.includes(regionId);

  return (
    <div className={`lore-sidebar ${open ? 'open' : ''}`} ref={containerRef}>
      <button className="lore-sidebar-close" onClick={onClose} title="Close lore panel">
        <i className="fas fa-times"></i>
      </button>
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
                <i className="fas fa-lock"></i>
              </div>
              <h4 className="lore-locked-title" style={{ fontFamily: "'Cinzel', serif", color: '#ebd5a3', margin: '0 0 8px 0', fontSize: '15px' }}>Unexplored Territory</h4>
              <p className="lore-lock-text">
                This region is currently locked under the campaign's exploration guide. 
                Exploration is recommended for characters of higher levels.
              </p>
              <button 
                className="lore-unlock-btn"
                onClick={() => unlockRegion(regionId)}
              >
                <i className="fas fa-key"></i> Unlock Region & Reveal Lore
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

            <div className="lore-sidebar-section">
              <h3 className="lore-section-title">
                <i className="fas fa-scroll"></i> Key Locations
              </h3>
              <div className="lore-locations-list">
                {enrichedLocations.map((loc) => {
                  const typeIcon = ZONE_TYPE_ICONS[loc.type] || 'fa-map-pin';
                  const isExpanded = expandedLocation === loc.id;
                  
                  return (
                    <div
                      key={loc.id}
                      id={`lore-loc-${loc.id}`}
                      className={`lore-location-item ${isExpanded ? 'expanded' : ''} ${loc.isDeep ? 'has-deep-profile' : ''}`}
                    >
                      <div
                        className="lore-location-main"
                        onClick={() => {
                          const nextState = isExpanded ? null : loc.id;
                          setExpandedLocation(nextState);
                          if (setSelectedLocationId) {
                            setSelectedLocationId(nextState);
                          }
                        }}
                      >
                        <i className={`fas ${typeIcon} loc-icon`}></i>
                        <div className="lore-location-info">
                          <div className="lore-location-title-row">
                            <span className="lore-location-name">{loc.name}</span>
                            {loc.isDeep && (
                              <span className="lore-deep-badge" title="Deep profile available">
                                <i className="fas fa-gem"></i> Deep
                              </span>
                            )}
                          </div>
                          <span className="lore-location-type">{loc.type}</span>
                        </div>
                        <div className="lore-location-right">
                          <span className="lore-location-danger" style={{ color: DANGER_LABELS[loc.dangerLevel]?.color || '#888' }}>
                            {loc.dangerLevel}
                          </span>
                          <i className={`fas fa-chevron-right expand-arrow ${isExpanded ? 'rotated' : ''}`}></i>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="lore-location-detail">
                          <p className="loc-description">{loc.description}</p>
                          
                          {/* Deep Lore Profile Details */}
                          {loc.isDeep && (
                            <div className="lore-deep-profile-details">
                              {loc.heraldry && (
                                <div className="lore-heraldry-card">
                                  <span className="lore-detail-label">Heraldry</span>
                                  <p className="lore-heraldry-desc">
                                    <i className="fas fa-shield-halved"></i> {loc.heraldry.description}
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
                                    <i className="fas fa-wind"></i> Atmosphere & Architecture
                                  </span>
                                  <div className="atmosphere-content">
                                    {loc.atmosphere.mood && (
                                      <p className="atmosphere-part"><em>Mood:</em> {loc.atmosphere.mood}</p>
                                    )}
                                    {loc.atmosphere.architecture && (
                                      <p className="atmosphere-part"><em>Structures:</em> {loc.atmosphere.architecture}</p>
                                    )}
                                    {loc.atmosphere.sounds && (
                                      <p className="atmosphere-part"><em>Sounds:</em> {loc.atmosphere.sounds}</p>
                                    )}
                                    {loc.atmosphere.smells && (
                                      <p className="atmosphere-part"><em>Aroma:</em> {loc.atmosphere.smells}</p>
                                    )}
                                    {loc.atmosphere.lighting && (
                                      <p className="atmosphere-part"><em>Lighting:</em> {loc.atmosphere.lighting}</p>
                                    )}
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
                                                <i className="fas fa-chevron-right"></i> {feat}
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
                })}
              </div>
            </div>

            <div className="lore-sidebar-section">
              <h3 className="lore-section-title">
                <i className="fas fa-compass"></i> Region Details
              </h3>
              <div className="lore-detail-grid">
                <div className="lore-detail-item">
                  <span className="lore-detail-label">Danger Level</span>
                  <span className="lore-detail-value" style={{ color: danger.color }}>
                    {danger.label}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : null}

        <div className="lore-sidebar-section region-immerse-section">
          <button className="region-immerse-btn" disabled title="Coming in a future update">
            <i className="fas fa-compass"></i>
            Immerse: Explore {region?.name || 'Region'}
            <span className="region-immerse-badge">Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoreSidebar;
