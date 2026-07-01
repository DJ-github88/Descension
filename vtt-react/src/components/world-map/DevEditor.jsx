import React, { useState, useRef, useEffect } from 'react';
import { REGION_POLYGONS, BASELINE_REGION_POLYGONS } from '../../data/regionPolygons';
import { LOCATION_COORDINATES, BASELINE_LOCATION_COORDINATES } from '../../data/locationCoordinates';
import { PIN_TYPE_OPTIONS } from './mapPinIcons';
import PIN_ICONS from './mapPinIcons';
import { ZONE_DATA } from '../../data/zoneData';
import './DevEditor.css';

const MAP_WIDTH = 4096;
const MAP_HEIGHT = 3072;

const REGION_OPTIONS = Object.values(REGION_POLYGONS).map(r => ({
  id: r.id,
  name: r.name
}));

const CustomSelect = ({ value, onChange, options, placeholder = 'Select...', width = '160px' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => String(o.id) === String(value));
  const displayLabel = selectedOption ? (selectedOption.name || selectedOption.title || selectedOption.label) : placeholder;

  return (
    <div className="custom-dev-select-container" style={{ width }} ref={dropdownRef}>
      <button 
        type="button"
        className={`custom-dev-select-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </button>

      {isOpen && (
        <div className="custom-dev-select-dropdown animate-fade-in-up">
          {options.length === 0 ? (
            <div className="custom-dev-select-no-options">No options available</div>
          ) : (
            options.map(option => (
              <button
                key={option.id}
                type="button"
                className={`custom-dev-select-option ${String(option.id) === String(value) ? 'active' : ''}`}
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
              >
                {option.name || option.title || option.label}
                {option.badge && <span className="select-option-badge">{option.badge}</span>}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

const CustomPinTypePicker = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = options.find(o => o.id === value) || options[0];
  const ActiveIcon = PIN_ICONS[activeOption.id];

  return (
    <div className="custom-pin-type-picker-container" ref={dropdownRef}>
      <button 
        type="button"
        className={`custom-pin-type-picker-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title={`Pin Type: ${activeOption.label}`}
      >
        {ActiveIcon && (
          <svg viewBox={ActiveIcon.viewBox} width="16" height="16">
            <path d={ActiveIcon.path} fill="#ebd5a3" />
          </svg>
        )}
        <span className="picker-active-label">{activeOption.label}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} picker-arrow`}></i>
      </button>

      {isOpen && (
        <div className="custom-pin-type-picker-popover animate-fade-in-up">
          <div className="picker-popover-header">Select Pin Type</div>
          <div className="custom-pin-type-grid">
            {options.map(pt => {
              const icon = PIN_ICONS[pt.id];
              const isActive = pt.id === value;
              return (
                <button
                  key={pt.id}
                  type="button"
                  className={`custom-pin-type-cell ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onChange(pt.id);
                    setIsOpen(false);
                  }}
                  title={pt.label}
                >
                  {icon && (
                    <svg viewBox={icon.viewBox} width="20" height="20">
                      <path d={icon.path} fill={isActive ? '#ffe082' : '#ebd5a3'} />
                    </svg>
                  )}
                  <span className="pin-cell-label">{pt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const DevEditor = ({
  devMode,
  devTool,
  setDevTool,
  currentRegion,
  setCurrentRegion,
  drawingPoints,
  setDrawingPoints,
  selectedPinType,
  setSelectedPinType,
  selectedZoneId,
  setSelectedZoneId,
  currentCampaign,
  pinSourceType,
  setPinSourceType,
  selectedCampaignLocId,
  setSelectedCampaignLocId,
  selectedCampaignLoreId,
  setSelectedCampaignLoreId,
  customPinName,
  setCustomPinName,
  customPinDesc,
  setCustomPinDesc,
  cursorPos,
  onUpdate,
  showConfirm,
  selectedDevPinId,
  setSelectedDevPinId,
  updateTrigger
}) => {

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState({ regions: '', locations: '' });
  const [copiedType, setCopiedType] = useState(null);
  const [exportFormat, setExportFormat] = useState('agent');

  // Inspector draft coordinates for the currently selected dev pin.
  const [draftX, setDraftX] = useState('');
  const [draftY, setDraftY] = useState('');

  // Sync the inspector inputs whenever the selection changes, and also while
  // the pin is being dragged (updateTrigger bumps from WorldMapImmerse) — but
  // never clobber the field the user is actively typing in.
  useEffect(() => {
    const c = selectedDevPinId ? LOCATION_COORDINATES[selectedDevPinId] : null;
    if (!c) { setDraftX(''); setDraftY(''); return; }
    const ae = document.activeElement;
    const focused = ae && (ae.dataset && ae.dataset.coordAxis);
    if (!focused) { setDraftX(String(c.x)); setDraftY(String(c.y)); }
  }, [selectedDevPinId, updateTrigger]);

  if (!devMode) return null;

  const regionZones = (currentRegion ? ZONE_DATA.filter(z => z.regionId === currentRegion) : ZONE_DATA).map(z => {
    const regionName = REGION_POLYGONS[z.regionId]?.name || z.regionId;
    const isPlaced = !!LOCATION_COORDINATES[z.id];
    return {
      ...z,
      name: `${z.name} — ${regionName}`,
      badge: isPlaced ? null : 'not placed'
    };
  });
  const campaignLocations = currentCampaign?.campaignData?.locations || [];
  const campaignLoreArticles = currentCampaign?.campaignData?.homebrew?.lore || [];

  const getDrawnRegions = () => {
    const out = {};
    Object.values(REGION_POLYGONS).forEach(r => {
      if (r.points && r.points.length >= 3) out[r.id] = { ...r };
    });
    return out;
  };

  const formatRegionEntry = (r) => {
    const pts = r.points.map(p => `[${p[0]}, ${p[1]}]`).join(', ');
    return `'${r.id}': {\n  points: [${pts}],\n  labelPosition: [${r.labelPosition[0]}, ${r.labelPosition[1]}]\n}`;
  };

  // ── Diff computation against the committed file baseline ──
  const computeLocationDiff = () => {
    const moved = [], added = [], removed = [];
    Object.keys(LOCATION_COORDINATES).forEach((key) => {
      const cur = LOCATION_COORDINATES[key];
      const base = BASELINE_LOCATION_COORDINATES[key];
      if (!base) added.push(key);
      else if (cur.x !== base.x || cur.y !== base.y) {
        moved.push({ key, from: [base.x, base.y], to: [cur.x, cur.y] });
      }
    });
    Object.keys(BASELINE_LOCATION_COORDINATES).forEach((key) => {
      if (!LOCATION_COORDINATES[key]) removed.push(key);
    });
    return { moved, added, removed };
  };

  const computeRegionDiff = () => {
    const changed = [];
    Object.values(REGION_POLYGONS).forEach((r) => {
      const base = BASELINE_REGION_POLYGONS[r.id];
      if (!base || !r.points || r.points.length < 3) return;
      const ptsChanged = JSON.stringify(base.points) !== JSON.stringify(r.points);
      const labelChanged = JSON.stringify(base.labelPosition) !== JSON.stringify(r.labelPosition);
      if (ptsChanged || labelChanged) changed.push(r);
    });
    return changed;
  };

  const locDiff = computeLocationDiff();
  const regDiff = computeRegionDiff();
  const changeCount =
    locDiff.moved.length + locDiff.added.length + locDiff.removed.length + regDiff.length;

  // Resolve display info for the currently selected dev pin (inspector panel).
  const selectedPin = selectedDevPinId ? LOCATION_COORDINATES[selectedDevPinId] : null;
  const selectedPinZone = selectedDevPinId ? ZONE_DATA.find((z) => z.id === selectedDevPinId) : null;
  const selectedRegionName = (() => {
    const rid = selectedPinZone?.regionId || selectedPin?.regionId;
    return rid ? (REGION_POLYGONS[rid]?.name || rid) : '—';
  })();

  const commitCoord = (axis, raw) => {
    if (!selectedDevPinId || !selectedPin) return;
    const max = axis === 'x' ? MAP_WIDTH : MAP_HEIGHT;
    const parsed = parseInt(raw, 10);
    const val = Number.isFinite(parsed) ? Math.max(0, Math.min(max, parsed)) : 0;
    if (axis === 'x') setDraftX(raw); else setDraftY(raw);
    selectedPin[axis] = val;
    if (onUpdate) onUpdate();
  };

  const handleExport = () => {
    const drawnRegions = getDrawnRegions();

    let regionsStr = '';
    let locationsStr = '';

    if (exportFormat === 'agent') {
      // Agent format: emit ONLY the diff vs the committed file baseline so a
      // code agent gets a precise, minimal change-set to apply.
      const diff = computeLocationDiff();
      const rDiff = computeRegionDiff();
      const anyChanges =
        diff.moved.length || diff.added.length || diff.removed.length || rDiff.length;

      if (rDiff.length) {
        const entries = rDiff.map((r) => formatRegionEntry(r)).join('\n\n');
        regionsStr = `Update src/data/regionPolygons.js — replace each region entry's "points" and "labelPosition" with these values (edited in the map dev editor):\n\n${entries}`;
      } else {
        regionsStr = 'No region boundary changes to export.';
      }

      if (!anyChanges) {
        locationsStr = 'No location coordinate changes to export — the live map matches src/data/locationCoordinates.js exactly.';
      } else {
        const parts = [];
        if (diff.moved.length) {
          parts.push(`## Moved (${diff.moved.length})\n` + diff.moved.map((m) =>
            `'${m.key}': { x: ${m.to[0]}, y: ${m.to[1]} }  // was [${m.from[0]}, ${m.from[1]}]`
          ).join('\n'));
        }
        if (diff.added.length) {
          parts.push(`## Added (${diff.added.length})\n` + diff.added.map((k) =>
            `'${k}': ${JSON.stringify(LOCATION_COORDINATES[k])}`
          ).join('\n'));
        }
        if (diff.removed.length) {
          parts.push(`## Removed (${diff.removed.length})\n` + diff.removed.map((k) => `'${k}'`).join('\n'));
        }
        locationsStr = `Update src/data/locationCoordinates.js with these changes (edited in the map dev editor). Replace the matching entries' x/y (or add/remove the keys):\n\n${parts.join('\n\n')}`;
      }
    } else {
      // Full JS code format (complete dump)
      const regionsOutput = drawnRegions;
      regionsStr = `export const REGION_POLYGONS = ${JSON.stringify(regionsOutput, null, 2)};\n\nexport default REGION_POLYGONS;`;
      locationsStr = `export const LOCATION_COORDINATES = ${JSON.stringify(LOCATION_COORDINATES, null, 2)};\n\nexport default LOCATION_COORDINATES;`;
    }

    setExportData({ regions: regionsStr, locations: locationsStr });
    setExportModalOpen(true);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <>
      <div className="dev-editor-toolbar">
        <div className="dev-toolbar-brand">
          <i className="fas fa-feather-alt"></i>
          <span>GM Editor</span>
        </div>
        
        <div className="dev-toolbar-divider" />

        <div className="dev-toolbar-section">
          <span className="dev-toolbar-label">Mode:</span>
          <div className="dev-btn-group">
            <button
              className={`dev-tool-btn ${devTool === 'drawRegion' ? 'active' : ''}`}
              onClick={() => setDevTool('drawRegion')}
            >
              <i className="fas fa-draw-polygon"></i> Draw Region
            </button>
            <button
              className={`dev-tool-btn ${devTool === 'placePin' ? 'active' : ''}`}
              onClick={() => setDevTool('placePin')}
            >
              <i className="fas fa-map-pin"></i> Place Pin
            </button>
            <button
              className={`dev-tool-btn ${devTool === 'movePin' ? 'active' : ''}`}
              onClick={() => setDevTool('movePin')}
              title="Select and nudge existing pins (arrow keys = 1px, Shift = 10px)"
            >
              <i className="fas fa-arrows-up-down-left-right"></i> Move
            </button>
            <button
              className={`dev-tool-btn danger-active ${devTool === 'erasePin' ? 'active' : ''}`}
              onClick={() => setDevTool('erasePin')}
            >
              <i className="fas fa-eraser"></i> Erase Pin
            </button>
          </div>
        </div>

        {devTool === 'drawRegion' && (
          <>
            <div className="dev-toolbar-divider" />
            <div className="dev-toolbar-section">
              <span className="dev-toolbar-label">Region:</span>
              <CustomSelect
                value={currentRegion}
                onChange={setCurrentRegion}
                options={REGION_OPTIONS}
                placeholder="Select region..."
                width="160px"
              />

              <div className="dev-btn-group">
                <button
                  className="dev-tool-btn secondary"
                  onClick={() => setDrawingPoints([])}
                  disabled={!drawingPoints || drawingPoints.length === 0}
                  title="Clear current drawing draft"
                >
                  <i className="fas fa-undo"></i> Clear Draft
                </button>

                <button
                  className="dev-tool-btn secondary"
                  onClick={() => {
                    if (drawingPoints.length > 0) {
                      setDrawingPoints(drawingPoints.slice(0, -1));
                    }
                  }}
                  disabled={!drawingPoints || drawingPoints.length === 0}
                  title="Undo last placed point"
                >
                  <i className="fas fa-step-backward"></i> Undo Point
                </button>
              </div>

              <button
                className="dev-tool-btn primary"
                onClick={() => {
                  if (drawingPoints.length >= 3 && currentRegion) {
                    const existing = REGION_POLYGONS[currentRegion];
                    showConfirm(
                      `Are you sure you want to complete and save the boundaries for "${existing.name}"?`,
                      () => {
                        const cx = drawingPoints.reduce((s, p) => s + p[0], 0) / drawingPoints.length;
                        const cy = drawingPoints.reduce((s, p) => s + p[1], 0) / drawingPoints.length;
                        existing.points = [...drawingPoints];
                        existing.labelPosition = [Math.round(cx), Math.round(cy)];
                        setDrawingPoints([]);
                        if (onUpdate) onUpdate();
                      }
                    );
                  }
                }}
                disabled={!drawingPoints || drawingPoints.length < 3 || !currentRegion}
              >
                <i className="fas fa-check"></i> Complete Region
              </button>

              <button
                className="dev-tool-btn danger"
                onClick={() => {
                  if (currentRegion) {
                    showConfirm(
                      `Are you sure you want to clear the existing saved boundaries for "${REGION_POLYGONS[currentRegion].name}"? This will hide the polygon until you draw and complete a new one.`,
                      () => {
                        REGION_POLYGONS[currentRegion].points = [];
                        setDrawingPoints([]);
                        if (onUpdate) onUpdate();
                      }
                    );
                  }
                }}
                disabled={!currentRegion || !REGION_POLYGONS[currentRegion]?.points || REGION_POLYGONS[currentRegion].points.length === 0}
                title="Delete saved boundaries for this region"
              >
                <i className="fas fa-trash-alt"></i> Clear Saved
              </button>
            </div>
          </>
        )}

        {devTool === 'placePin' && (
          <>
            <div className="dev-toolbar-divider" />
            <div className="dev-toolbar-section">
              <span className="dev-toolbar-label">Pin Type:</span>
              <CustomPinTypePicker
                value={selectedPinType}
                onChange={setSelectedPinType}
                options={PIN_TYPE_OPTIONS}
              />

              <div className="dev-toolbar-divider mini" />

              <span className="dev-toolbar-label">Source:</span>
              <CustomSelect
                value={pinSourceType}
                onChange={setPinSourceType}
                options={[
                  { id: 'world', label: 'World Lore' },
                  ...(currentCampaign ? [
                    { id: 'campaignLocation', label: 'Campaign Location' },
                    { id: 'campaignLore', label: 'Campaign Lore' }
                  ] : []),
                  { id: 'custom', label: 'Custom Pin' }
                ]}
                placeholder="Select source..."
                width="150px"
              />

              {pinSourceType === 'world' && (
                <>
                  <span className="dev-toolbar-label">Zone:</span>
                  <CustomSelect
                    value={selectedZoneId}
                    onChange={setSelectedZoneId}
                    options={regionZones}
                    placeholder="Select zone..."
                    width="160px"
                  />
                </>
              )}

              {pinSourceType === 'campaignLocation' && (
                <>
                  <span className="dev-toolbar-label">Location:</span>
                  <CustomSelect
                    value={selectedCampaignLocId}
                    onChange={setSelectedCampaignLocId}
                    options={campaignLocations}
                    placeholder="Select location..."
                    width="160px"
                  />
                </>
              )}

              {pinSourceType === 'campaignLore' && (
                <>
                  <span className="dev-toolbar-label">Lore:</span>
                  <CustomSelect
                    value={selectedCampaignLoreId}
                    onChange={setSelectedCampaignLoreId}
                    options={campaignLoreArticles}
                    placeholder="Select lore..."
                    width="160px"
                  />
                </>
              )}

              {pinSourceType === 'custom' && (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    className="dev-input"
                    placeholder="Pin Name"
                    value={customPinName}
                    onChange={(e) => setCustomPinName(e.target.value)}
                    style={{ width: '120px' }}
                  />
                  <input
                    type="text"
                    className="dev-input"
                    placeholder="Description (optional)"
                    value={customPinDesc}
                    onChange={(e) => setCustomPinDesc(e.target.value)}
                    style={{ width: '160px' }}
                  />
                </div>
              )}
            </div>
          </>
        )}

        <div className="dev-toolbar-divider" />

        <div className="dev-toolbar-section dev-toolbar-right">
          <button className="dev-tool-btn export" onClick={handleExport} title="Copy coordinate changes for your code agent">
            <i className="fas fa-code"></i> Export
            {changeCount > 0 && (
              <span className="dev-export-badge">{changeCount}</span>
            )}
          </button>
          {devTool === 'movePin' && (
            <span className="dev-point-count">
              {selectedDevPinId ? `${selectedPinZone?.name || selectedDevPinId}` : 'select a pin'}
            </span>
          )}
          {((devTool === 'drawRegion' && drawingPoints && drawingPoints.length > 0) ||
            (devTool === 'placePin' && selectedPinType)) && (
            <span className="dev-point-count">
              {devTool === 'drawRegion' ? (
                <>{drawingPoints.length} {drawingPoints.length === 1 ? 'pt' : 'pts'}</>
              ) : (
                <>{selectedPinType}</>
              )}
            </span>
          )}
        </div>
      </div>

      {exportModalOpen && (
        <div className="dev-modal-overlay" onClick={() => setExportModalOpen(false)}>
          <div className="dev-modal-content animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="dev-modal-header">
              <h3><i className="fas fa-file-export"></i> Export Coordinates</h3>
              <button className="dev-modal-close" onClick={() => setExportModalOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="dev-modal-body">
              {/* Format toggle */}
              <div className="export-format-toggle">
                <button
                  className={`export-format-btn ${exportFormat === 'code' ? 'active' : ''}`}
                  onClick={() => { setExportFormat('code'); setTimeout(handleExport, 0); }}
                >
                  <i className="fas fa-code"></i> JS Code (full dump)
                </button>
                <button
                  className={`export-format-btn ${exportFormat === 'agent' ? 'active' : ''}`}
                  onClick={() => { setExportFormat('agent'); setTimeout(handleExport, 0); }}
                >
                  <i className="fas fa-robot"></i> Agent Diff
                  {changeCount > 0 && <span className="export-diff-count">{changeCount}</span>}
                </button>
              </div>

              {exportFormat === 'agent' && (
                <div className={`export-summary ${changeCount === 0 ? 'clean' : 'dirty'}`}>
                  {changeCount === 0 ? (
                    <><i className="fas fa-circle-check"></i> Live map matches the committed file — nothing to sync.</>
                  ) : (
                    <>
                      <i className="fas fa-pen-to-square"></i>
                      <span><strong>{locDiff.moved.length}</strong> moved · <strong>{locDiff.added.length}</strong> added · <strong>{locDiff.removed.length}</strong> removed · <strong>{regDiff.length}</strong> regions</span>
                    </>
                  )}
                </div>
              )}

              <div className="export-section">
                <div className="export-section-header">
                  <h4>{exportFormat === 'agent' ? 'Region Boundaries (Agent)' : 'regionPolygons.js'}</h4>
                  <button 
                    className="dev-tool-btn secondary mini-btn"
                    onClick={() => handleCopy(exportData.regions, 'regions')}
                  >
                    {copiedType === 'regions' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy</>}
                  </button>
                </div>
                <textarea 
                  className="export-textarea" 
                  value={exportData.regions} 
                  readOnly 
                  onClick={e => e.target.select()}
                />
              </div>

              <div className="export-section">
                <div className="export-section-header">
                  <h4>{exportFormat === 'agent' ? 'Location Pins (Agent)' : 'locationCoordinates.js'}</h4>
                  <button 
                    className="dev-tool-btn secondary mini-btn"
                    onClick={() => handleCopy(exportData.locations, 'locations')}
                  >
                    {copiedType === 'locations' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy</>}
                  </button>
                </div>
                <textarea 
                  className="export-textarea" 
                  value={exportData.locations} 
                  readOnly 
                  onClick={e => e.target.select()}
                />
              </div>
            </div>
            <div className="dev-modal-footer">
              <button className="dev-tool-btn primary" onClick={() => setExportModalOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move-tool inspector: precise coordinate editing for the selected pin */}
      {devTool === 'movePin' && (
        <div className="dev-move-inspector animate-fade-in-up">
          {selectedDevPinId && selectedPin ? (
            <>
              <div className="dev-inspector-head">
                <i className="fas fa-arrows-up-down-left-right dev-inspector-grip" />
                <div className="dev-inspector-title">
                  <span className="dev-inspector-name">{selectedPinZone?.name || selectedDevPinId}</span>
                  <span className="dev-inspector-region">{selectedRegionName}</span>
                </div>
                <button
                  className="dev-inspector-close"
                  onClick={() => setSelectedDevPinId(null)}
                  title="Deselect pin"
                  aria-label="Deselect pin"
                >
                  <i className="fas fa-times" />
                </button>
              </div>
              <div className="dev-inspector-coords">
                <label className="dev-coord-field">
                  <span className="dev-coord-label">X</span>
                  <input
                    type="number"
                    data-coord-axis="x"
                    value={draftX}
                    onChange={(e) => commitCoord('x', e.target.value)}
                    min={0}
                    max={MAP_WIDTH}
                  />
                </label>
                <label className="dev-coord-field">
                  <span className="dev-coord-label">Y</span>
                  <input
                    type="number"
                    data-coord-axis="y"
                    value={draftY}
                    onChange={(e) => commitCoord('y', e.target.value)}
                    min={0}
                    max={MAP_HEIGHT}
                  />
                </label>
              </div>
              <div className="dev-inspector-hint">
                <i className="fas fa-keyboard" />
                <span>Arrow keys nudge 1px · <kbd>Shift</kbd>+arrows 10px · drag to move</span>
              </div>
            </>
          ) : (
            <div className="dev-inspector-empty">
              <i className="fas fa-hand-pointer" />
              <span>Click a pin on the map to select &amp; move it</span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default DevEditor;
