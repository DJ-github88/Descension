import React from 'react';
import './WorldMapImmerse.css'; // Styled in the map's css sheet

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

  return (
    <div className="annotation-toolbar animate-fade-in">
      <div className="toolbar-section">
        <span className="toolbar-title">Map Tools</span>
        
        {/* Toggle Place Pin mode */}
        <button
          className={`toolbar-btn ${activeTool === 'placePin' ? 'active' : ''}`}
          onClick={() => setActiveTool(activeTool === 'placePin' ? 'none' : 'placePin')}
          title="Place custom map marker"
        >
          <i className="fas fa-map-pin"></i>
          <span>Add Pin</span>
        </button>

        {/* Toggle Draw Area mode (locked for Free tier) */}
        <button
          className={`toolbar-btn ${activeTool === 'drawArea' ? 'active' : ''} ${!canDrawArea ? 'locked' : ''}`}
          onClick={() => {
            if (!canDrawArea) {
              alert('Dungeon Master tier or higher is required to draw custom territories.');
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
      </div>

      {/* Select active Pin Type if Place Pin tool is selected */}
      {activeTool === 'placePin' && (
        <div className="toolbar-sub-section pin-selector-container">
          <span className="sub-title">Icon:</span>
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

      {/* Active Area drawing controls */}
      {activeTool === 'drawArea' && (
        <div className="toolbar-sub-section drawing-info-alert">
          <i className="fas fa-info-circle"></i>
          <span>Click on the map to add points. Click near first point to close.</span>
        </div>
      )}

      <div className="toolbar-divider"></div>

      <div className="toolbar-section">
        {/* Share Current View (locked for Free tier) */}
        <button
          className={`toolbar-btn ${!canShare ? 'locked' : ''}`}
          onClick={() => {
            if (!canShare) {
              alert('Dungeon Master tier or higher is required to share views with friends.');
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

        {/* View Shared Maps lists */}
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
      </div>
    </div>
  );
};

export default AnnotationToolbar;
