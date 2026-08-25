import React, { useEffect, useRef, useState, useMemo } from 'react';

const formatUpdatedAt = (value) => {
  if (!value) return '';
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const ENTRY_TYPES = [
  { value: 'continent', label: 'Continent', icon: 'fa-earth-americas', desc: 'Major continental landmass' },
  { value: 'region', label: 'Region', icon: 'fa-mountain-sun', desc: 'Realm or province territory' },
  { value: 'subregion', label: 'Subregion', icon: 'fa-map-location-dot', desc: 'Localized area, valley, or fief' },
  { value: 'location', label: 'Location / Point of Interest', icon: 'fa-location-dot', desc: 'City, fortress, dungeon, or landmark' }
];

const LOCATION_CATEGORIES = [
  { id: 'capital', label: 'Capital / Seat', icon: 'fa-crown' },
  { id: 'settlement', label: 'City / Town', icon: 'fa-city' },
  { id: 'fortress', label: 'Fortress / Keep', icon: 'fa-shield-halved' },
  { id: 'port', label: 'Port / Haven', icon: 'fa-anchor' },
  { id: 'forge', label: 'Forge / Outpost', icon: 'fa-hammer' },
  { id: 'sacred', label: 'Temple / Archive', icon: 'fa-book-archive' },
  { id: 'dungeon', label: 'Dungeon / Ruin', icon: 'fa-dungeon' },
  { id: 'wilderness', label: 'Peak / Wilds', icon: 'fa-tree' },
  { id: 'camp', label: 'Camp / Mark', icon: 'fa-fire' }
];

const getEntryTypeLabel = (value) => ENTRY_TYPES.find((entry) => entry.value === value)?.label || 'Region';

const CustomMapEditor = ({
  maps = [],
  currentMap = null,
  draftZones = [],
  selectedZoneId = null,
  isLoading = false,
  hasAccount = false,
  drawingActive = false,
  drawingPoints = [],
  zoneName = '',
  setZoneName = () => {},
  entryType = 'continent',
  setEntryType = () => {},
  parentId = '',
  setParentId = () => {},
  lore = '',
  setLore = () => {},
  onClose = () => {},
  onCreateMap = () => {},
  onSelectMap = () => {},
  onRenameMap = () => {},
  onSaveMap = () => {},
  onDeleteMap = () => {},
  onStartDrawing = () => {},
  onFinishDrawing = () => {},
  onCancelDrawing = () => {},
  onUndoPoint = () => {},
  onDeleteZone = () => {},
  onUpdateZone = () => {},
  onSelectZone = () => {},
  onFocusZone = () => {},
  onAddLocationToRegion = () => {},
  onImageSelected = () => {},
  onClearImage = () => {}
}) => {
  const fileInputRef = useRef(null);
  const [nameDraft, setNameDraft] = useState(currentMap?.name || '');
  const [isDropActive, setIsDropActive] = useState(false);
  const [activeTab, setActiveTab] = useState('tools'); // 'tools' | 'maps' | 'outliner' | 'inspector'
  const [filterSearch, setFilterSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('settlement');

  useEffect(() => {
    setNameDraft(currentMap?.name || '');
  }, [currentMap?.id, currentMap?.name]);

  // If a zone is selected from map click, automatically switch or highlight
  useEffect(() => {
    if (selectedZoneId && activeTab === 'maps') {
      setActiveTab('outliner');
    }
  }, [selectedZoneId]);

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

  const parentOptions = useMemo(() => {
    return (draftZones || []).filter((entry) => {
      if (entry.kind === 'location' || entry.geometry === 'point') return false;
      if (entryType === 'region') return entry.kind === 'continent';
      if (entryType === 'subregion') return entry.kind === 'continent' || entry.kind === 'region' || !entry.kind;
      if (entryType === 'location') return true;
      return false;
    });
  }, [draftZones, entryType]);

  const parentName = (id) => (draftZones || []).find((entry) => entry.id === id)?.name || '';

  // Hierarchical groupings for the Outliner
  const hierarchy = useMemo(() => {
    const continents = (draftZones || []).filter((z) => z.kind === 'continent');
    const regions = (draftZones || []).filter((z) => z.kind === 'region');
    const subregions = (draftZones || []).filter((z) => z.kind === 'subregion');
    const locations = (draftZones || []).filter((z) => z.kind === 'location' || z.geometry === 'point');

    return {
      continents,
      regions,
      subregions,
      locations,
      total: (draftZones || []).length
    };
  }, [draftZones]);

  // Selected zone object for the Inspector tab
  const activeZone = useMemo(() => {
    if (!selectedZoneId) return null;
    return (draftZones || []).find((z) => z.id === selectedZoneId) || null;
  }, [draftZones, selectedZoneId]);

  return (
    <aside className="custom-map-editor-panel" aria-label="Custom map editor">
      {/* Panel Top Header */}
      <div className="custom-map-editor-header">
        <div>
          <span className="custom-map-eyebrow">Immerse Workspace</span>
          <h2>
            <i className="fas fa-map-marked-alt"></i> {currentMap?.name || 'Custom World Builder'}
          </h2>
        </div>
        <div className="header-actions">
          <button type="button" className="custom-map-close" onClick={onClose} title="Close custom maps" aria-label="Close custom maps">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      {/* Account Sync Status Pill */}
      <div className="custom-map-account-status">
        <i className={`fas ${hasAccount ? 'fa-cloud-check' : 'fa-hard-drive'}`}></i>
        <span>{hasAccount ? 'Synced to your account' : 'Demo storage: sign in to sync across devices'}</span>
      </div>

      {/* Modern Tab Navigation Bar */}
      <nav className="custom-map-tabs" aria-label="Custom map editor tabs">
        <button
          type="button"
          className={`custom-map-tab-btn ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
          title="Draw & Place Entities"
        >
          <i className="fas fa-pen-ruler"></i>
          <span>Cartography</span>
        </button>

        <button
          type="button"
          className={`custom-map-tab-btn ${activeTab === 'outliner' ? 'active' : ''}`}
          onClick={() => setActiveTab('outliner')}
          title="World Hierarchy Tree"
        >
          <i className="fas fa-layer-group"></i>
          <span>Outliner ({draftZones.length})</span>
        </button>

        <button
          type="button"
          className={`custom-map-tab-btn ${activeTab === 'maps' ? 'active' : ''}`}
          onClick={() => setActiveTab('maps')}
          title="Map Artwork & Workspaces"
        >
          <i className="fas fa-image"></i>
          <span>Maps</span>
        </button>

        {activeZone && (
          <button
            type="button"
            className={`custom-map-tab-btn ${activeTab === 'inspector' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspector')}
            title="Selected Zone Details"
          >
            <i className="fas fa-feather-pointed"></i>
            <span>Details</span>
          </button>
        )}
      </nav>

      {/* TAB 1: CARTOGRAPHY & DRAWING TOOLS */}
      {activeTab === 'tools' && (
        <div className="custom-map-tab-content tab-tools animate-fade-in">
          {/* Quick World Title Input */}
          <div className="custom-map-field-row">
            <label htmlFor="custom-map-name">World title</label>
            <input
              id="custom-map-name"
              type="text"
              value={nameDraft}
              placeholder="The World of ..."
              onChange={(event) => {
                setNameDraft(event.target.value);
                if (currentMap) onRenameMap(currentMap.id, event.target.value);
              }}
              onBlur={(event) => commitName(event.target.value)}
              disabled={!currentMap}
            />
          </div>

          <div className="custom-map-zone-tools">
            <div className="custom-map-section-title">
              <span>Create World Entity</span>
            </div>

            {/* Visual Layer Selector Cards */}
            <label>Build layer</label>
            <div className="custom-layer-chips">
              {ENTRY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`layer-chip ${entryType === type.value ? 'active' : ''}`}
                  onClick={() => setEntryType(type.value)}
                  disabled={!currentMap || drawingActive}
                >
                  <i className={`fas ${type.icon}`}></i>
                  <span>{type.label.split('/')[0]}</span>
                </button>
              ))}
            </div>

            {/* Parent Layer Assignment */}
            {parentOptions.length > 0 && (
              <div className="custom-parent-wrap animate-fade-in">
                <label htmlFor="custom-entry-parent">Belongs to</label>
                <select
                  id="custom-entry-parent"
                  value={parentId}
                  onChange={(event) => setParentId(event.target.value)}
                  disabled={!currentMap || drawingActive}
                >
                  <option value="">No parent layer (Top-level)</option>
                  {parentOptions.map((entry) => (
                    <option key={entry.id} value={entry.id}>
                      {entry.name || getEntryTypeLabel(entry.kind)} ({getEntryTypeLabel(entry.kind)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Entity Title */}
            <label htmlFor="custom-zone-name">Entry title</label>
            <input
              id="custom-zone-name"
              type="text"
              value={zoneName}
              placeholder={`${getEntryTypeLabel(entryType)} ${draftZones.length + 1}`}
              onChange={(event) => setZoneName(event.target.value)}
              disabled={!currentMap || drawingActive}
            />

            {/* Location Category Selection when placing POIs */}
            {entryType === 'location' && (
              <div className="custom-location-category-picker animate-fade-in">
                <label>Location Category</label>
                <div className="category-chip-grid">
                  {LOCATION_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      <i className={`fas ${cat.icon}`}></i>
                      <span>{cat.label.split('/')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lore and Notes */}
            <label htmlFor="custom-entry-lore">Lore and notes</label>
            <textarea
              id="custom-entry-lore"
              value={lore}
              placeholder="History, noble houses, landmarks, taverns, factions, hazards, secrets..."
              onChange={(event) => setLore(event.target.value)}
              disabled={!currentMap || drawingActive}
              rows="3"
            />

            {/* Primary Action Button Bar */}
            <div className="custom-map-zone-actions">
              {!drawingActive ? (
                <button
                  type="button"
                  className="custom-map-draw-btn primary-action"
                  onClick={() => onStartDrawing(selectedCategory)}
                  disabled={!currentMap}
                >
                  <i className={`fas ${entryType === 'location' ? 'fa-location-dot' : 'fa-draw-polygon'}`}></i>
                  {entryType === 'location' ? ' Place location on map' : ` Draw ${getEntryTypeLabel(entryType).toLowerCase()}`}
                </button>
              ) : (
                <div className="active-drawing-bar animate-fade-in">
                  <div className="active-drawing-status">
                    <span className="pulse-indicator"></span>
                    <span>
                      {entryType === 'location'
                        ? 'Click map to place pin'
                        : `Drawing: ${drawingPoints.length} point${drawingPoints.length === 1 ? '' : 's'}`}
                    </span>
                  </div>

                  <div className="active-drawing-btns">
                    {entryType !== 'location' && (
                      <>
                        <button
                          type="button"
                          className="custom-map-draw-btn active finish-btn"
                          onClick={onFinishDrawing}
                          disabled={drawingPoints.length < 3}
                          title="Complete polygon boundary"
                        >
                          <i className="fas fa-check"></i> Finish ({drawingPoints.length})
                        </button>
                        {drawingPoints.length > 0 && onUndoPoint && (
                          <button
                            type="button"
                            className="custom-map-undo-btn"
                            onClick={onUndoPoint}
                            title="Undo last point"
                          >
                            <i className="fas fa-rotate-left"></i> Undo
                          </button>
                        )}
                      </>
                    )}
                    <button type="button" className="custom-map-cancel-btn" onClick={onCancelDrawing}>
                      <i className="fas fa-times"></i> {entryType === 'location' ? 'Cancel placement' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <p className="custom-map-zone-hint">
              {drawingActive
                ? entryType === 'location'
                  ? 'Click anywhere on the map to place this marker. Its name, category, and lore will attach directly.'
                  : 'Click points on the canvas. Close near the first point (green glow) or click Finish (min 3 points).'
                : 'Entities are drafted live on the map. Click Save Map when ready to persist across sessions.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: OUTLINER & WORLD HIERARCHY */}
      {activeTab === 'outliner' && (
        <div className="custom-map-tab-content tab-outliner animate-fade-in">
          <div className="outliner-header">
            <div className="custom-map-section-title">
              <span>World Hierarchy</span>
              <span className="custom-map-count">{draftZones.length} entities</span>
            </div>

            <div className="outliner-search-wrap">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="outliner-search-input"
                placeholder="Search entities & lore..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
              />
              {filterSearch && (
                <button type="button" className="clear-search" onClick={() => setFilterSearch('')} title="Clear search">
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>

          {draftZones.length === 0 ? (
            <div className="outliner-empty-state">
              <i className="fas fa-map-location-dot"></i>
              <h4>No entities drafted yet</h4>
              <p>Switch to the Cartography tab to draw continents, regions, and place locations on your map.</p>
              <button type="button" className="custom-map-secondary-btn" onClick={() => setActiveTab('tools')}>
                <i className="fas fa-plus"></i> Start Drawing
              </button>
            </div>
          ) : (
            <div className="outliner-tree-list">
              {/* Continents Group */}
              {hierarchy.continents.length > 0 && (
                <div className="outliner-group">
                  <span className="group-heading">
                    <i className="fas fa-earth-americas"></i> Continents ({hierarchy.continents.length})
                  </span>
                  {hierarchy.continents
                    .filter((z) => !filterSearch || z.name?.toLowerCase().includes(filterSearch.toLowerCase()) || z.lore?.toLowerCase().includes(filterSearch.toLowerCase()))
                    .map((zone) => (
                      <div key={zone.id} className={`outliner-card ${selectedZoneId === zone.id ? 'active' : ''}`}>
                        <div className="outliner-card-main" onClick={() => { onSelectZone(zone.id); onFocusZone(zone); }}>
                          <span className="outliner-swatch" style={{ background: zone.color || '#9c27b0' }}></span>
                          <div className="outliner-info">
                            <strong>{zone.name || 'Unnamed Continent'}</strong>
                            <small>{zone.points?.length || 0} pts {zone.lore ? '· Lore added' : ''}</small>
                          </div>
                        </div>
                        <div className="outliner-card-actions">
                          <button type="button" onClick={() => onFocusZone(zone)} title="Focus continent on map">
                            <i className="fas fa-compass"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onAddLocationToRegion(zone.id);
                              setActiveTab('tools');
                            }}
                            title="Add location inside this continent"
                          >
                            <i className="fas fa-location-dot"></i>
                          </button>
                          <button type="button" onClick={() => onDeleteZone(zone.id)} title="Delete continent">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Regions Group */}
              {hierarchy.regions.length > 0 && (
                <div className="outliner-group">
                  <span className="group-heading">
                    <i className="fas fa-mountain-sun"></i> Regions & Realms ({hierarchy.regions.length})
                  </span>
                  {hierarchy.regions
                    .filter((z) => !filterSearch || z.name?.toLowerCase().includes(filterSearch.toLowerCase()) || z.lore?.toLowerCase().includes(filterSearch.toLowerCase()))
                    .map((zone) => (
                      <div key={zone.id} className={`outliner-card ${selectedZoneId === zone.id ? 'active' : ''}`}>
                        <div className="outliner-card-main" onClick={() => { onSelectZone(zone.id); onFocusZone(zone); }}>
                          <span className="outliner-swatch" style={{ background: zone.color || '#c4a44a' }}></span>
                          <div className="outliner-info">
                            <strong>{zone.name || 'Unnamed Region'}</strong>
                            <small>
                              {zone.points?.length || 0} pts
                              {zone.parentId && parentName(zone.parentId) ? ` · in ${parentName(zone.parentId)}` : ''}
                              {zone.lore ? ' · (Lore)' : ''}
                            </small>
                          </div>
                        </div>
                        <div className="outliner-card-actions">
                          <button type="button" onClick={() => onFocusZone(zone)} title="Focus realm on map">
                            <i className="fas fa-compass"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onAddLocationToRegion(zone.id);
                              setActiveTab('tools');
                            }}
                            title="Add location inside this region"
                          >
                            <i className="fas fa-location-dot"></i>
                          </button>
                          <button type="button" onClick={() => onDeleteZone(zone.id)} title="Delete region">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Subregions Group */}
              {hierarchy.subregions.length > 0 && (
                <div className="outliner-group">
                  <span className="group-heading">
                    <i className="fas fa-map-location-dot"></i> Subregions & Provinces ({hierarchy.subregions.length})
                  </span>
                  {hierarchy.subregions
                    .filter((z) => !filterSearch || z.name?.toLowerCase().includes(filterSearch.toLowerCase()) || z.lore?.toLowerCase().includes(filterSearch.toLowerCase()))
                    .map((zone) => (
                      <div key={zone.id} className={`outliner-card ${selectedZoneId === zone.id ? 'active' : ''}`}>
                        <div className="outliner-card-main" onClick={() => { onSelectZone(zone.id); onFocusZone(zone); }}>
                          <span className="outliner-swatch" style={{ background: zone.color || '#5397be' }}></span>
                          <div className="outliner-info">
                            <strong>{zone.name || 'Unnamed Subregion'}</strong>
                            <small>
                              {zone.points?.length || 0} pts
                              {zone.parentId && parentName(zone.parentId) ? ` · in ${parentName(zone.parentId)}` : ''}
                              {zone.lore ? ' · (Lore)' : ''}
                            </small>
                          </div>
                        </div>
                        <div className="outliner-card-actions">
                          <button type="button" onClick={() => onFocusZone(zone)} title="Focus subregion on map">
                            <i className="fas fa-compass"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onAddLocationToRegion(zone.id);
                              setActiveTab('tools');
                            }}
                            title="Add location inside this subregion"
                          >
                            <i className="fas fa-location-dot"></i>
                          </button>
                          <button type="button" onClick={() => onDeleteZone(zone.id)} title="Delete subregion">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              {/* Locations Group */}
              {hierarchy.locations.length > 0 && (
                <div className="outliner-group">
                  <span className="group-heading">
                    <i className="fas fa-location-dot"></i> Locations & POIs ({hierarchy.locations.length})
                  </span>
                  {hierarchy.locations
                    .filter((z) => !filterSearch || z.name?.toLowerCase().includes(filterSearch.toLowerCase()) || z.lore?.toLowerCase().includes(filterSearch.toLowerCase()))
                    .map((zone) => (
                      <div key={zone.id} className={`outliner-card location-card ${selectedZoneId === zone.id ? 'active' : ''}`}>
                        <div className="outliner-card-main" onClick={() => { onSelectZone(zone.id); onFocusZone(zone); }}>
                          <i className="fas fa-map-pin outliner-pin-icon"></i>
                          <div className="outliner-info">
                            <strong>{zone.name || 'Unnamed Location'}</strong>
                            <small>
                              {zone.parentId && parentName(zone.parentId) ? `In ${parentName(zone.parentId)}` : 'World Landmark'}
                              {zone.lore ? ' · (Lore)' : ''}
                            </small>
                          </div>
                        </div>
                        <div className="outliner-card-actions">
                          <button type="button" onClick={() => onFocusZone(zone)} title="Jump to location pin">
                            <i className="fas fa-crosshairs"></i>
                          </button>
                          <button type="button" onClick={() => onDeleteZone(zone.id)} title="Delete location">
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MAP ARTWORK & WORKSPACES */}
      {activeTab === 'maps' && (
        <div className="custom-map-tab-content tab-maps animate-fade-in">
          {/* Action Row */}
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

          {/* Map Image Dropzone */}
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
              <i className="fas fa-border-all"></i> Clear image and return to grid
            </button>
          )}

          {/* Saved Workspaces List */}
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
                        <small>
                          {(map.zones || []).length} zones
                          {formatUpdatedAt(map.updatedAt) ? ` · ${formatUpdatedAt(map.updatedAt)}` : ''}
                        </small>
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
        </div>
      )}

      {/* TAB 4: ACTIVE ZONE INSPECTOR */}
      {activeTab === 'inspector' && activeZone && (
        <div className="custom-map-tab-content tab-inspector animate-fade-in">
          <div className="inspector-header">
            <div className="custom-map-section-title">
              <span>Inspect Entity</span>
              <span className="custom-map-count">{getEntryTypeLabel(activeZone.kind)}</span>
            </div>
            <button type="button" className="btn-return-outliner" onClick={() => setActiveTab('outliner')}>
              <i className="fas fa-arrow-left"></i> Back to tree
            </button>
          </div>

          <div className="inspector-fields">
            <label>Name</label>
            <input
              type="text"
              value={activeZone.name || ''}
              onChange={(e) => onUpdateZone(activeZone.id, { name: e.target.value })}
            />

            <label>Parent Realm</label>
            <select
              value={activeZone.parentId || ''}
              onChange={(e) => onUpdateZone(activeZone.id, { parentId: e.target.value || null })}
            >
              <option value="">No Parent</option>
              {parentOptions.filter((p) => p.id !== activeZone.id).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <label>Lore & History</label>
            <textarea
              rows="5"
              value={activeZone.lore || ''}
              onChange={(e) => onUpdateZone(activeZone.id, { lore: e.target.value })}
              placeholder="Add history, factions, secrets..."
            />

            <div className="inspector-actions">
              <button
                type="button"
                className="custom-map-secondary-btn"
                onClick={() => onFocusZone(activeZone)}
              >
                <i className="fas fa-compass"></i> Focus on map
              </button>

              {activeZone.kind !== 'location' && (
                <button
                  type="button"
                  className="custom-map-primary-btn"
                  onClick={() => {
                    onAddLocationToRegion(activeZone.id);
                    setActiveTab('tools');
                  }}
                >
                  <i className="fas fa-location-dot"></i> + Add Location Here
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default CustomMapEditor;
