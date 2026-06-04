import React, { useState, useEffect } from 'react';
import useWorldStore from '../../store/worldStore';
import useMapStore from '../../store/mapStore';
import LoreLink from '../common/LoreLink';
import { TimelineView } from './TimelineView';

const LocationDetail = ({ locationId, onBack, onClassClick, onFactionClick }) => {
  const { getFullContextForLocation } = useWorldStore();
  const { getMapsByLocation } = useMapStore();
  const [context, setContext] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const ctx = getFullContextForLocation(locationId);
    setContext(ctx);
  }, [locationId, getFullContextForLocation]);

  if (!context) {
    return (
      <div className="world-panel">
        <div className="world-panel-header">
          <button className="world-back-btn" onClick={onBack}>← Back</button>
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  const { location, region } = context;
  const connectedMaps = getMapsByLocation(locationId);
  const isDeep = location.isDeep;

  const tabs = [
    { key: 'overview', label: 'Overview' },
    ...(isDeep ? [{ key: 'atmosphere', label: 'Atmosphere' }] : []),
    ...(isDeep && location.subLocations?.length > 0 ? [{ key: 'places', label: 'Places' }] : []),
    { key: 'people', label: 'People & Factions' },
    ...(connectedMaps.length > 0 ? [{ key: 'maps', label: 'Maps' }] : []),
    { key: 'history', label: 'History' }
  ];

  return (
    <div className="world-panel">
      <div className="world-panel-header">
        <button className="world-back-btn" onClick={onBack}>← Back</button>
        <div className="world-header-identity">
          {isDeep && location.heraldry && (
            <div
              className="world-heraldry"
              style={{
                background: `linear-gradient(135deg, ${location.heraldry.colors?.primary || '#333'}, ${location.heraldry.colors?.secondary || '#666'})`
              }}
              title={location.heraldry.description}
            >
              <i className="fas fa-shield-haltered" />
            </div>
          )}
          <div>
            <h2>{location.name}</h2>
            <div className="world-header-meta">
              <span className={`world-badge world-badge-${location.type}`}>{location.type}</span>
              <span className={`world-badge world-badge-${location.dangerLevel}`}>{location.dangerLevel}</span>
              {region && <span className="world-muted"> · {region.name}</span>}
            </div>
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
            onClassClick={onClassClick}
            onFactionClick={onFactionClick}
          />
        )}
        {activeTab === 'maps' && <MapsTab connectedMaps={connectedMaps} />}
        {activeTab === 'history' && <TimelineView filterLocationId={locationId} compact />}
      </div>
    </div>
  );
};

const OverviewTab = ({ context }) => {
  const { location } = context;

  return (
    <div className="world-section-stack">
      <section className="world-section">
        <p className="world-prose">{location.description}</p>
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
                <span className="world-stat-value">{location.economy.status}</span>
                <span className="world-stat-label">Economy</span>
              </div>
            )}
          </div>

          {location.leadership && (
            <section className="world-section">
              <h3>Leadership</h3>
              <div className="world-info-card">
                <span className="world-badge">{location.leadership.type?.replace(/_/g, ' ')}</span>
                <h4>{location.leadership.title}</h4>
                <p>{location.leadership.description}</p>
              </div>
            </section>
          )}

          {location.economy && (
            <section className="world-section">
              <h3>Economy</h3>
              <p><strong>Primary:</strong> {location.economy.primary}</p>
              {location.economy.secondary?.length > 0 && (
                <p><strong>Secondary:</strong> {location.economy.secondary.join(', ')}</p>
              )}
            </section>
          )}

          {location.defenses && (
            <section className="world-section">
              <h3>Defenses</h3>
              <p>{location.defenses.fortifications}</p>
              <p className="world-card-meta">{location.defenses.watchPresence}</p>
            </section>
          )}
        </>
      )}

      {location.travelConnections && location.travelConnections.length > 0 && (
        <section className="world-section">
          <h3>Travel Connections</h3>
          <div className="world-card-grid">
            {location.travelConnections.map((conn, i) => (
              <div key={i} className="world-info-card">
                <h4><LoreLink termId={conn.destinationId}>{conn.destinationId}</LoreLink></h4>
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
    {location.history && (
      <section className="world-section">
        <h3>History</h3>
        <p className="world-prose">{location.history.foundingStory}</p>
        {location.history.significantEvents && (
          <div className="world-timeline-mini">
            {location.history.significantEvents.map((evt, i) => (
              <div key={i} className="world-timeline-item">
                <span className="world-timeline-date">{evt.date}</span>
                <p>{evt.event}</p>
              </div>
            ))}
          </div>
        )}
      </section>
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

const PeopleTab = ({ context, onClassClick, onFactionClick }) => {
  const { location, classesPracticed } = context;
  const factionPresence = location.isDeep ? (location.factionPresence || []) : [];
  const rawFactions = location.factions || [];

  return (
    <div className="world-section-stack">
      {classesPracticed && classesPracticed.length > 0 && (
        <section className="world-section">
          <h3>Classes Practiced Here</h3>
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
        <h3>Faction Presence</h3>
        {factionPresence.length > 0 ? (
          <div className="world-card-grid">
            {factionPresence.map((fp, i) => (
              <div
                key={i}
                className="world-info-card world-clickable"
                onClick={() => onFactionClick && onFactionClick(fp.factionId)}
              >
                <span className={`world-badge world-badge-${fp.influence}`}>{fp.influence}</span>
                <h4>{fp.factionId?.replace(/-/g, ' ')}</h4>
                <p>{fp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="world-tag-list">
            {rawFactions.map((f, i) => (
              <span key={i} className="world-tag">{f}</span>
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
      <h3>Connected Maps</h3>
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

export default LocationDetail;
