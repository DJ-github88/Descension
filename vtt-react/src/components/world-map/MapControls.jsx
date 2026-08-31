import React from 'react';

const MapControls = ({
  zoomIn,
  zoomOut,
  resetTransform,
  onClose,
  devMode,
  onToggleDev,
  customMapMode,
  customReadOnly = false,
  onToggleCustomMap,
  onToggleCustomReadOnly,
  canAccessCustomMaps,
  borderEnabled = true,
  onToggleBorder
}) => {

  return (
    <div className="map-controls-fixed">
      <button
        className="map-ctrl-btn map-ctrl-close"
        onClick={onClose}
        title="Close immersive map"
      >
        <i className="fas fa-times"></i>
      </button>

      <div className="map-ctrl-group">
        <button
          className="map-ctrl-btn"
          onClick={() => zoomIn()}
          title="Zoom in"
        >
          <i className="fas fa-plus"></i>
        </button>
        <button
          className="map-ctrl-btn"
          onClick={() => zoomOut()}
          title="Zoom out"
        >
          <i className="fas fa-minus"></i>
        </button>
        <button
          className="map-ctrl-btn"
          onClick={() => resetTransform()}
          title="Reset view"
        >
          <i className="fas fa-compress"></i>
        </button>
      </div>

      {onToggleBorder && (
        <button
          className={`map-ctrl-btn map-ctrl-border ${borderEnabled ? 'active' : ''}`}
          onClick={onToggleBorder}
          title={borderEnabled ? "Hide Burned Parchment Border" : "Show Burned Parchment Border"}
          aria-label="Toggle burned parchment border"
        >
          <i className={borderEnabled ? "fas fa-scroll" : "fas fa-border-none"}></i>
        </button>
      )}

      {canAccessCustomMaps && (
        <button
          className={`map-ctrl-btn map-ctrl-custom-map ${customMapMode ? 'active' : ''}`}
          onClick={onToggleCustomMap}
          title={customMapMode ? "Exit custom map workspace" : "Open custom map workspace"}
          aria-label="Toggle custom map workspace"
        >
          <i className="fas fa-map"></i>
        </button>
      )}

      {customMapMode && canAccessCustomMaps && onToggleCustomReadOnly && (
        <button
          className={`map-ctrl-btn map-ctrl-custom-view ${customReadOnly ? 'active' : ''}`}
          onClick={onToggleCustomReadOnly}
          title={customReadOnly ? "Back to Edit Mode" : "Enter Immersive View (read-only)"}
          aria-label={customReadOnly ? "Back to edit mode" : "Enter immersive view"}
        >
          <i className={customReadOnly ? "fas fa-pen" : "fas fa-eye"}></i>
        </button>
      )}

      <button
        className={`map-ctrl-btn map-ctrl-dev ${devMode ? 'active' : ''}`}
        onClick={onToggleDev}
        title="Toggle dev editor"
      >
        <i className="fas fa-pen-ruler"></i>
      </button>
    </div>
  );
};

export default MapControls;
