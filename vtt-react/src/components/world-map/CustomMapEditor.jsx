import React, { useEffect, useRef, useState } from 'react';

const formatUpdatedAt = (value) => {
  if (!value) return '';
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const CustomMapEditor = ({
  maps,
  currentMap,
  draftZones,
  isLoading,
  hasAccount,
  drawingActive,
  drawingPoints,
  zoneName,
  setZoneName,
  onClose,
  onCreateMap,
  onSelectMap,
  onRenameMap,
  onSaveMap,
  onDeleteMap,
  onStartDrawing,
  onFinishDrawing,
  onCancelDrawing,
  onDeleteZone,
  onImageSelected,
  onClearImage
}) => {
  const fileInputRef = useRef(null);
  const [nameDraft, setNameDraft] = useState(currentMap?.name || '');
  const [isDropActive, setIsDropActive] = useState(false);

  useEffect(() => {
    setNameDraft(currentMap?.name || '');
  }, [currentMap?.id]);

  const commitName = (value) => {
    const nextName = value.trim() || 'Untitled Map';
    setNameDraft(nextName);
    if (currentMap) onRenameMap(currentMap.id, nextName);
  };

  const handleFiles = (files) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    onImageSelected(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDropActive(false);
    handleFiles(event.dataTransfer?.files);
  };

  return (
    <aside className="custom-map-editor-panel" aria-label="Custom map editor">
      <div className="custom-map-editor-header">
        <div>
          <span className="custom-map-eyebrow">Immerse workspace</span>
          <h2><i className="fas fa-map"></i> Custom Maps</h2>
        </div>
        <button type="button" className="custom-map-close" onClick={onClose} title="Close custom maps">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <p className="custom-map-intro">
        Start with a clean grid, drop in your own map, then outline territories before saving the workspace.
      </p>

      <div className="custom-map-account-status">
        <i className={`fas ${hasAccount ? 'fa-cloud' : 'fa-hard-drive'}`}></i>
        <span>{hasAccount ? 'Synced to your account' : 'Demo storage: sign in to sync across devices'}</span>
      </div>

      <div className="custom-map-field-row">
        <label htmlFor="custom-map-name">Map name</label>
        <input
          id="custom-map-name"
          type="text"
          value={nameDraft}
          placeholder="Untitled Map"
          onChange={(event) => {
            setNameDraft(event.target.value);
            if (currentMap) onRenameMap(currentMap.id, event.target.value);
          }}
          onBlur={(event) => commitName(event.target.value)}
          disabled={!currentMap}
        />
      </div>

      <div className="custom-map-action-row">
        <button type="button" className="custom-map-secondary-btn" onClick={() => onCreateMap()}>
          <i className="fas fa-plus"></i> New map
        </button>
        <button
          type="button"
          className="custom-map-primary-btn"
          onClick={onSaveMap}
          disabled={!currentMap || isLoading}
        >
          <i className="fas fa-cloud-arrow-up"></i> {isLoading ? 'Saving...' : 'Save map'}
        </button>
      </div>

      {maps.length > 0 && (
        <div className="custom-map-library">
          <div className="custom-map-section-title">
            <span>Saved workspaces</span>
            <span className="custom-map-count">{maps.length}</span>
          </div>
          <div className="custom-map-library-list">
            {maps.map((map) => (
              <div key={map.id} className={`custom-map-library-item ${currentMap?.id === map.id ? 'active' : ''}`}>
                <button type="button" className="custom-map-library-select" onClick={() => onSelectMap(map.id)}>
                  <i className={`fas ${map.image ? 'fa-image' : 'fa-border-all'}`}></i>
                  <span>
                    <strong>{map.name || 'Untitled Map'}</strong>
                    <small>{(map.zones || []).length} zones{formatUpdatedAt(map.updatedAt) ? ` · ${formatUpdatedAt(map.updatedAt)}` : ''}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className="custom-map-delete-btn"
                  onClick={() => onDeleteMap(map.id, map.name || 'Untitled Map')}
                  title={`Delete ${map.name || 'custom map'}`}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`custom-map-dropzone ${isDropActive ? 'drag-active' : ''} ${!currentMap ? 'disabled' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault();
          if (currentMap) setIsDropActive(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (currentMap && event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
        }}
        onDragLeave={() => setIsDropActive(false)}
        onDrop={handleDrop}
        onClick={() => currentMap && fileInputRef.current?.click()}
        role="button"
        tabIndex={currentMap ? 0 : -1}
        onKeyDown={(event) => {
          if (currentMap && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => handleFiles(event.target.files)}
          hidden
        />
        <i className="fas fa-cloud-arrow-down"></i>
        <strong>{currentMap?.image ? 'Replace map image' : 'Drop a map image here'}</strong>
        <span>PNG, JPG, or WEBP · compressed for account storage</span>
      </div>

      {currentMap?.image && (
        <button type="button" className="custom-map-link-btn" onClick={onClearImage}>
          <i className="fas fa-grid-2"></i> Clear image and return to grid
        </button>
      )}

      <div className="custom-map-zone-tools">
        <div className="custom-map-section-title">
          <span>Custom zones</span>
          <span className="custom-map-count">{draftZones.length}</span>
        </div>
        <label htmlFor="custom-zone-name">Next zone name</label>
        <input
          id="custom-zone-name"
          type="text"
          value={zoneName}
          placeholder={`Zone ${draftZones.length + 1}`}
          onChange={(event) => setZoneName(event.target.value)}
          disabled={!currentMap || drawingActive}
        />
        <div className="custom-map-zone-actions">
          {!drawingActive ? (
            <button type="button" className="custom-map-draw-btn" onClick={onStartDrawing} disabled={!currentMap}>
              <i className="fas fa-draw-polygon"></i> Draw zone
            </button>
          ) : (
            <>
              <button type="button" className="custom-map-draw-btn active" onClick={onFinishDrawing} disabled={drawingPoints.length < 3}>
                <i className="fas fa-check"></i> Finish ({drawingPoints.length})
              </button>
              <button type="button" className="custom-map-cancel-btn" onClick={onCancelDrawing}>
                Cancel
              </button>
            </>
          )}
        </div>
        <p className="custom-map-zone-hint">
          {drawingActive ? 'Click points on the map. Close the polygon near its first point or use Finish.' : 'Zones stay in this draft until you save the map.'}
        </p>
      </div>

      {draftZones.length > 0 && (
        <div className="custom-map-zone-list">
          {draftZones.map((zone, index) => (
            <div className="custom-map-zone-item" key={zone.id || index}>
              <span className="custom-map-zone-swatch" style={{ background: zone.color || 'rgba(196, 164, 74, 0.7)' }}></span>
              <span className="custom-map-zone-label">
                <strong>{zone.name || `Zone ${index + 1}`}</strong>
                <small>{zone.points?.length || 0} points</small>
              </span>
              <button type="button" onClick={() => onDeleteZone(zone.id)} title="Remove zone">
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default CustomMapEditor;
