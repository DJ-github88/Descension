import React, { useState, useCallback } from 'react';
import { notify } from './MapNotify';
import './WorldMapImmerse.css';

const AnnotationToolbar = ({
  activeTool,
  setActiveTool,
  tierInfo,
  pendingSharesCount,
  onOpenShares,
  onOpenShareDialog,
  selectedPinType,
  setSelectedPinType
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = useCallback(() => setIsOpen(prev => !prev), []);

  if (!tierInfo || tierInfo.tierKey === 'GUEST') return null;

  const isFree = tierInfo.tierKey === 'FREE';
  const canDrawArea = !isFree;
  const canShare = !isFree;

  const pinIcons = [
    { type: 'fortress', label: 'Fortress', icon: 'fa-fortress' },
    { type: 'house', label: 'Settlement', icon: 'fa-house' },
    { type: 'mountain', label: 'Point of Interest', icon: 'fa-mountain' },
    { type: 'tree', label: 'Nature/Wilderness', icon: 'fa-tree' },
    { type: 'camp', label: 'Camp', icon: 'fa-camp' },
    { type: 'cave', label: 'Cave/Dungeon', icon: 'fa-dungeon' },
    { type: 'custom', label: 'Marker', icon: 'fa-location-pin' }
  ];

  const hasActiveTool = activeTool !== 'none';

  return (
    <div className={`map-tools-sidebar ${isOpen ? 'open' : ''}`}>
      <button
        className="map-tools-trigger"
        onClick={toggleOpen}
        title={isOpen ? "Close map tools" : "Open map tools"}
      >
        <i className={`fas ${isOpen ? 'fa-chevron-right' : 'fa-layer-group'} trigger-icon`}></i>
        <span className="trigger-label">Tools</span>
      </button>

      <div className="map-tools-panel">
        <div className="map-tools-panel-header">
          <i className="fas fa-wand-magic-sparkles"></i>
          <span>Map Tools</span>
        </div>

        <div className="map-tools-panel-body">
          <button
            className={`toolbar-btn ${activeTool === 'placePin' ? 'active' : ''}`}
            onClick={() => setActiveTool(activeTool === 'placePin' ? 'none' : 'placePin')}
            title="Place custom map marker"
          >
            <i className="fas fa-map-pin"></i>
            <span>Add Pin</span>
          </button>

          <button
            className={`toolbar-btn ${activeTool === 'drawArea' ? 'active' : ''} ${!canDrawArea ? 'locked' : ''}`}
            onClick={() => {
              if (!canDrawArea) {
                notify('Dungeon Master tier or higher is required to draw custom territories.', 'warning');
                return;
              }
              setActiveTool(activeTool === 'drawArea' ? 'none' : 'drawArea');
            }}
            title={canDrawArea ? "Draw custom territory boundaries" : "Draw custom boundaries (Locked - DM/Archmage required)"}
          >
            <i className="fas fa-draw-polygon"></i>
            <span>Draw Area</span>
            {!canDrawArea && <i className="fas fa-lock lock-icon"></i>}
          </button>

          {activeTool === 'placePin' && (
            <div className="toolbar-sub-section pin-selector-container">
              <div className="pin-type-selector">
                {pinIcons.map((p) => (
                  <button
                    key={p.type}
                    className={`pin-type-btn ${selectedPinType === p.type ? 'selected' : ''}`}
                    onClick={() => setSelectedPinType(p.type)}
                    title={p.label}
                  >
                    <i className={`fas ${p.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTool === 'drawArea' && (
            <div className="toolbar-sub-section drawing-info-alert">
              <i className="fas fa-info-circle"></i>
              <span>Click map to add points. Click near first point to close.</span>
            </div>
          )}

          <div className="toolbar-divider"></div>

          <button
            className={`toolbar-btn ${!canShare ? 'locked' : ''}`}
            onClick={() => {
              if (!canShare) {
                notify('Dungeon Master tier or higher is required to share views with friends.', 'warning');
                return;
              }
              onOpenShareDialog();
            }}
            title={canShare ? "Share your current map view coordinates with a friend" : "Share view with friends (Locked - DM/Archmage required)"}
          >
            <i className="fas fa-share-nodes"></i>
            <span>Share View</span>
            {!canShare && <i className="fas fa-lock lock-icon"></i>}
          </button>

          <button
            className="toolbar-btn shares-btn"
            onClick={onOpenShares}
            title="View shared map coordinates from friends"
          >
            <i className="fas fa-envelope"></i>
            <span>Inbox</span>
            {pendingSharesCount > 0 && (
              <span className="shares-badge-count">{pendingSharesCount}</span>
            )}
          </button>

          {hasActiveTool && (
            <div className="active-tool-indicator">
              <i className="fas fa-circle"></i>
              <span>{activeTool === 'placePin' ? 'Pin Mode' : 'Draw Mode'}</span>
              <button
                className="cancel-tool-btn"
                onClick={() => setActiveTool('none')}
                title="Cancel current tool"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnotationToolbar;
