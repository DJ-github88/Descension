import React from 'react';
import PIN_ICONS from './mapPinIcons';
import { REGION_POLYGONS } from '../../data/regionPolygons';
import './WorldMapImmerse.css';

const TYPE_META = {
  region:     { label: 'Region',          icon: 'fa-map' },
  devPin:     { label: 'Marked Location', icon: 'fa-location-dot' },
  playerPin:  { label: 'Your Marker',     icon: 'fa-thumbtack' },
  playerArea: { label: 'Your Territory',  icon: 'fa-draw-polygon' }
};

const regionAccent = (regionId) =>
  (regionId && REGION_POLYGONS[regionId]?.glowColor) || 'rgba(196, 164, 74, 0.6)';

const AnnotationCollisionMenu = ({ isOpen, onClose, items, onSelectItem, position }) => {
  if (!isOpen || !items || items.length === 0) return null;

  // Clamp the anchored card so it never spills off the viewport.
  const CARD_W = 280;
  const estimatedHeight = 48 + items.length * 60;
  let left = '50%';
  let top = '50%';
  let transform = 'translate(-50%, -50%)';
  let anchorAbove = false;

  if (position) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const roomAbove = position.y;
    anchorAbove = roomAbove > vh * 0.45;
    const clampedX = Math.max(
      CARD_W / 2 + 12,
      Math.min(position.x, vw - CARD_W / 2 - 12)
    );
    const clampedY = anchorAbove
      ? Math.max(estimatedHeight + 20, position.y)
      : Math.min(position.y, vh - estimatedHeight - 20);
    left = `${clampedX}px`;
    top = `${clampedY}px`;
    transform = anchorAbove ? 'translate(-50%, -118%)' : 'translate(-50%, 18px)';
  }

  return (
    <div className="collision-menu-overlay" onClick={onClose}>
      <div
        className="collision-menu-card"
        style={{ position: 'fixed', left, top, transform }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className={`collision-menu-tail ${anchorAbove ? 'below' : 'above'}`} />

        <div className="collision-menu-header">
          <i className="fas fa-compass collision-header-icon" />
          <span className="collision-header-title">What lies here?</span>
          <span className="collision-header-count">{items.length}</span>
          <button className="collision-close" onClick={onClose} title="Dismiss" aria-label="Dismiss">
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="collision-menu-list">
          {items.map((item) => {
            const meta = TYPE_META[item.type] || { label: 'Item', icon: 'fa-circle-question' };
            const accent = regionAccent(item.regionId);
            const pinIcon = PIN_ICONS[item.pinType] || PIN_ICONS.custom;
            const showPinArt = item.type === 'devPin' || item.type === 'playerPin';

            return (
              <button
                key={`${item.type}-${item.id}`}
                className={`collision-item ${item.type}`}
                style={{ '--collision-accent': accent }}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
              >
                <span className="collision-item-accent" />
                <span className="collision-item-icon">
                  {showPinArt ? (
                    <svg viewBox={pinIcon.viewBox} width="17" height="17">
                      <path d={pinIcon.path} fill="currentColor" />
                    </svg>
                  ) : (
                    <i className={`fas ${meta.icon}`} />
                  )}
                </span>
                <span className="collision-item-text">
                  <span className="collision-item-name">{item.title || item.name || 'Unnamed'}</span>
                  <span className="collision-item-type">{meta.label}</span>
                </span>
                <i className="fas fa-chevron-right collision-item-arrow" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AnnotationCollisionMenu;
