import React, { useState, useRef, useEffect } from 'react';
import { REGION_POLYGONS } from '../../data/regionPolygons';
import { LOCATION_COORDINATES } from '../../data/locationCoordinates';
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
  showConfirm
}) => {

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportData, setExportData] = useState({ regions: '', locations: '' });
  const [copiedType, setCopiedType] = useState(null);

  if (!devMode) return null;

  const regionZones = currentRegion ? ZONE_DATA.filter(z => z.regionId === currentRegion) : ZONE_DATA;
  const campaignLocations = currentCampaign?.campaignData?.locations || [];
  const campaignLoreArticles = currentCampaign?.campaignData?.homebrew?.lore || [];

  const handleExport = () => {
    const regionsOutput = {};
    Object.values(REGION_POLYGONS).forEach(r => {
      if (r.points && r.points.length >= 3) {
        regionsOutput[r.id] = { ...r };
      }
    });

    const regionsStr = `export const REGION_POLYGONS = ${JSON.stringify(regionsOutput, null, 2)};\n\nexport default REGION_POLYGONS;`;
    const locationsStr = `export const LOCATION_COORDINATES = ${JSON.stringify(LOCATION_COORDINATES, null, 2)};\n\nexport default LOCATION_COORDINATES;`;

    setExportData({
      regions: regionsStr,
      locations: locationsStr
    });
    setExportModalOpen(true);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getPolygonPath = (points) => {
    if (!points || points.length === 0) return '';
    return points.map(([x, y]) => `${x},${y}`).join(' ');
  };

  const getDrawingPreview = () => {
    if (!drawingPoints || drawingPoints.length === 0) return '';
    const pts = [...drawingPoints];
    if (cursorPos && pts.length > 0) {
      pts.push(cursorPos);
    }
    return pts.map(([x, y]) => `${x},${y}`).join(' ');
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
          <button className="dev-tool-btn export" onClick={handleExport}>
            <i className="fas fa-code"></i> Export
          </button>
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
              <div className="export-section">
                <div className="export-section-header">
                  <h4>regionPolygons.js</h4>
                  <button 
                    className="dev-tool-btn secondary mini-btn"
                    onClick={() => handleCopy(exportData.regions, 'regions')}
                  >
                    {copiedType === 'regions' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy Code</>}
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
                  <h4>locationCoordinates.js</h4>
                  <button 
                    className="dev-tool-btn secondary mini-btn"
                    onClick={() => handleCopy(exportData.locations, 'locations')}
                  >
                    {copiedType === 'locations' ? <><i className="fas fa-check"></i> Copied!</> : <><i className="fas fa-copy"></i> Copy Code</>}
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
    </>
  );
};

export default DevEditor;
