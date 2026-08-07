import React, { useMemo } from 'react';
import './LoreSidebar.css';

const ENTRY_TYPE_CONFIG = {
  continent: { label: 'Continent', icon: 'fa-earth-americas', color: 'rgba(135, 104, 196, 0.9)', badgeClass: 'badge-continent' },
  region: { label: 'Region', icon: 'fa-mountain-sun', color: 'rgba(196, 164, 74, 0.9)', badgeClass: 'badge-region' },
  subregion: { label: 'Subregion', icon: 'fa-map-location-dot', color: 'rgba(83, 151, 190, 0.9)', badgeClass: 'badge-subregion' },
  location: { label: 'Location / POI', icon: 'fa-location-dot', color: 'rgba(235, 190, 85, 0.9)', badgeClass: 'badge-location' }
};

const CustomZoneSidebar = ({
  zone,
  allZones = [],
  isOpen,
  onClose,
  onUpdateZone,
  onDeleteZone,
  onFocusZone,
  onAddLocationToRegion,
  onSelectZone
}) => {
  if (!isOpen || !zone) return null;

  const typeConfig = ENTRY_TYPE_CONFIG[zone.kind] || ENTRY_TYPE_CONFIG.region;
  const isPolygon = zone.kind !== 'location' && zone.geometry !== 'point';

  // Find parent zone if applicable
  const parentZone = zone.parentId ? allZones.find((z) => z.id === zone.parentId) : null;

  // Find child locations that belong to this region or subregion
  const childLocations = useMemo(() => {
    return (allZones || []).filter((z) => {
      if (z.id === zone.id) return false;
      return z.parentId === zone.id;
    });
  }, [allZones, zone.id]);

  const pointCount = zone.points?.length || 0;

  return (
    <aside className="custom-zone-sidebar open animate-fade-in" aria-label="Custom zone details">
      <div className="custom-zone-sidebar-accent" style={{ background: zone.color || typeConfig.color }} />

      <div className="custom-zone-sidebar-header">
        <div className="custom-zone-header-top">
          <span className={`custom-zone-type-badge ${typeConfig.badgeClass}`}>
            <i className={`fas ${typeConfig.icon}`}></i> {typeConfig.label}
          </span>
          <button
            type="button"
            className="custom-zone-close-btn"
            onClick={onClose}
            title="Close sidebar popup"
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {parentZone && (
          <div className="custom-zone-breadcrumbs">
            <button
              type="button"
              className="breadcrumb-link"
              onClick={() => onSelectZone && onSelectZone(parentZone.id)}
            >
              <i className="fas fa-chevron-left"></i> {parentZone.name || 'Parent Region'}
            </button>
          </div>
        )}

        <div className="custom-zone-title-wrap">
          <input
            type="text"
            className="custom-zone-name-input"
            value={zone.name || ''}
            placeholder="Name this place..."
            onChange={(e) => onUpdateZone && onUpdateZone(zone.id, { name: e.target.value })}
            aria-label="Zone name"
          />
        </div>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="custom-zone-action-bar">
        {onFocusZone && (
          <button
            type="button"
            className="zone-action-btn focus-btn"
            onClick={() => onFocusZone(zone)}
            title="Smoothly zoom and center map on this realm"
          >
            <i className="fas fa-compass"></i>
            <span>Go There / Focus</span>
          </button>
        )}

        {isPolygon && onAddLocationToRegion && (
          <button
            type="button"
            className="zone-action-btn add-loc-btn"
            onClick={() => onAddLocationToRegion(zone.id)}
            title="Add a point of interest or location inside this region"
          >
            <i className="fas fa-location-dot"></i>
            <span>+ Add Location</span>
          </button>
        )}

        {onDeleteZone && (
          <button
            type="button"
            className="zone-action-btn delete-btn"
            onClick={() => {
              if (window.confirm(`Delete "${zone.name || 'this entry'}" from custom map?`)) {
                onDeleteZone(zone.id);
                onClose();
              }
            }}
            title="Remove this zone from world"
          >
            <i className="fas fa-trash"></i>
          </button>
        )}
      </div>

      {/* Overview Stats Pill */}
      <div className="custom-zone-meta-strip">
        <div className="zone-meta-item">
          <span className="meta-val">{isPolygon ? `${pointCount} pts` : 'Coordinate Pin'}</span>
          <span className="meta-lbl">Geometry</span>
        </div>
        {isPolygon && (
          <>
            <div className="zone-meta-divider" />
            <div className="zone-meta-item">
              <span className="meta-val">{childLocations.length}</span>
              <span className="meta-lbl">Locations</span>
            </div>
          </>
        )}
        <div className="zone-meta-divider" />
        <div className="zone-meta-item">
          <span className="meta-val">{zone.lore ? 'Documented' : 'Draft'}</span>
          <span className="meta-lbl">Lore Status</span>
        </div>
      </div>

      {/* Child Locations inside this Region */}
      {isPolygon && (
        <div className="custom-zone-section child-locations-section">
          <div className="custom-zone-section-header">
            <div className="section-title-wrap">
              <i className="fas fa-landmark"></i>
              <h4>Locations in this Realm</h4>
            </div>
            {onAddLocationToRegion && (
              <button
                type="button"
                className="section-add-btn"
                onClick={() => onAddLocationToRegion(zone.id)}
                title="Place location on map inside this realm"
              >
                <i className="fas fa-plus"></i> Add
              </button>
            )}
          </div>

          {childLocations.length > 0 ? (
            <div className="child-locations-list">
              {childLocations.map((loc) => (
                <div key={loc.id} className="child-location-card">
                  <div
                    className="child-location-info"
                    onClick={() => {
                      if (onFocusZone) onFocusZone(loc);
                      if (onSelectZone) onSelectZone(loc.id);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <i className="fas fa-location-dot loc-marker-icon"></i>
                    <div className="child-location-text">
                      <strong>{loc.name || 'Unnamed Location'}</strong>
                      {loc.lore && <p className="child-lore-preview">{loc.lore}</p>}
                    </div>
                  </div>
                  <div className="child-location-actions">
                    <button
                      type="button"
                      className="child-jump-btn"
                      onClick={() => onFocusZone && onFocusZone(loc)}
                      title="Jump camera to location"
                    >
                      <i className="fas fa-crosshairs"></i>
                    </button>
                    <button
                      type="button"
                      className="child-delete-btn"
                      onClick={() => onDeleteZone && onDeleteZone(loc.id)}
                      title="Delete location"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="child-locations-empty">
              <i className="fas fa-map-pin"></i>
              <p>No locations added to this realm yet.</p>
              {onAddLocationToRegion && (
                <button
                  type="button"
                  className="empty-add-location-btn"
                  onClick={() => onAddLocationToRegion(zone.id)}
                >
                  <i className="fas fa-plus"></i> Place First Location Here
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Lore and World Notes Editor */}
      <div className="custom-zone-section lore-editor-section">
        <div className="custom-zone-section-header">
          <div className="section-title-wrap">
            <i className="fas fa-book-open"></i>
            <h4>Lore & Notes</h4>
          </div>
        </div>
        <textarea
          className="custom-zone-lore-textarea"
          value={zone.lore || ''}
          placeholder="History, noble houses, natural hazards, ancient ruins, tavern gossip, or factions governing this realm..."
          rows={5}
          onChange={(e) => onUpdateZone && onUpdateZone(zone.id, { lore: e.target.value })}
          aria-label="Zone lore notes"
        />
      </div>

      {/* Color Customization */}
      <div className="custom-zone-section color-section">
        <div className="custom-zone-section-header">
          <div className="section-title-wrap">
            <i className="fas fa-palette"></i>
            <h4>Boundary Tone</h4>
          </div>
        </div>
        <div className="custom-zone-color-presets">
          {[
            { color: 'rgba(196, 164, 74, 0.28)', stroke: '#f1d48a', label: 'Gold' },
            { color: 'rgba(135, 104, 196, 0.28)', stroke: '#b39ddb', label: 'Purple' },
            { color: 'rgba(83, 151, 190, 0.28)', stroke: '#81d4fa', label: 'Sky' },
            { color: 'rgba(76, 175, 80, 0.28)', stroke: '#a5d6a7', label: 'Emerald' },
            { color: 'rgba(244, 67, 54, 0.28)', stroke: '#ef9a9a', label: 'Crimson' },
            { color: 'rgba(255, 152, 0, 0.28)', stroke: '#ffcc80', label: 'Amber' }
          ].map((preset, i) => (
            <button
              key={i}
              type="button"
              className="color-preset-pill"
              style={{ background: preset.stroke }}
              onClick={() => onUpdateZone && onUpdateZone(zone.id, { color: preset.color, stroke: preset.stroke })}
              title={preset.label}
              aria-label={preset.label}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CustomZoneSidebar;
