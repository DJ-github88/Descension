import React from 'react';
import useWorldStore from '../../store/worldStore';

const MapControls = ({
  zoomIn,
  zoomOut,
  resetTransform,
  onClose,
  devMode,
  onToggleDev
}) => {
  const { lockedRegions, toggleAllRegionLocks } = useWorldStore();
  const allUnlocked = lockedRegions.length === 0;

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

      <button
        className={`map-ctrl-btn map-ctrl-lock ${allUnlocked ? 'active' : ''}`}
        onClick={toggleAllRegionLocks}
        title={allUnlocked ? "Lock all regions (except starting zone)" : "Bypass all region locks"}
      >
        <i className={`fas ${allUnlocked ? 'fa-unlock' : 'fa-lock'}`}></i>
      </button>

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

