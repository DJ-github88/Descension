import React from 'react';
import './WorldMapImmerse.css';

const AnnotationCollisionMenu = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  position
}) => {
  if (!isOpen || !items || items.length === 0) return null;

  // Determine modal position styles based on mouse click coordinates
  const style = position
    ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 10000,
        transform: 'translate(-50%, -10px)'
      }
    : {
        position: 'fixed',
        left: '50%',
        top: '50%',
        zIndex: 10000,
        transform: 'translate(-50%, -50%)'
      };

  const getEntityIcon = (item) => {
    switch (item.type) {
      case 'region':
        return 'fa-map';
      case 'devPin':
      case 'playerPin':
        return 'fa-location-dot';
      case 'playerArea':
        return 'fa-draw-polygon';
      default:
        return 'fa-circle-question';
    }
  };

  const getEntityBadge = (item) => {
    switch (item.type) {
      case 'region':
        return 'Region';
      case 'devPin':
        return 'Official Location';
      case 'playerPin':
        return 'Personal Marker';
      case 'playerArea':
        return 'Custom Territory';
      default:
        return 'Item';
    }
  };

  return (
    <div className="collision-menu-overlay" onClick={onClose}>
      <div
        className="collision-menu-container animate-fade-in"
        style={style}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="collision-menu-header">
          <span>Resolve Selection ({items.length})</span>
          <button className="collision-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="collision-menu-list">
          {items.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="collision-menu-item"
              onClick={() => {
                onSelectItem(item);
                onClose();
              }}
            >
              <i className={`fas ${getEntityIcon(item)} item-icon`}></i>
              <div className="item-details">
                <span className="item-name">{item.title || item.name || 'Unnamed'}</span>
                <span className={`item-type-badge ${item.type}`}>
                  {getEntityBadge(item)}
                </span>
              </div>
              <i className="fas fa-chevron-right item-arrow"></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnotationCollisionMenu;
